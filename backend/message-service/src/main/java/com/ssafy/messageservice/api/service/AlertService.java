package com.ssafy.messageservice.api.service;

import com.ssafy.messageservice.api.request.AlertAttendRequest;
import com.ssafy.messageservice.api.response.AlertListResponse;
import com.ssafy.messageservice.api.response.AlertSendListResponse;
import com.ssafy.messageservice.db.entity.Alert;
import com.ssafy.messageservice.db.entity.User;
import com.ssafy.messageservice.db.repository.AlertRepository;
import com.ssafy.messageservice.db.repository.EmitterRepository;
import com.ssafy.messageservice.db.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import org.narang.lib.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class AlertService extends NarangGrpc.NarangImplBase {
    // 기본 타임아웃 설정
    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;
    private final EmitterRepository emitterRepository;
    private final AlertRepository alertRepository;
    private final UserRepository userRepository;
    @GrpcClient("payment-service")
    private NarangGrpc.NarangBlockingStub paymentBlockingStub;
    @GrpcClient("trip-service")
    private NarangGrpc.NarangBlockingStub tripBlockingStub;

    private static final Logger LOGGER = LoggerFactory.getLogger(AlertService.class);

    /**
     * 클라이언트가 구독을 위해 호출하는 메서드 -> 로그인할 때 모든 user들이 구독하도록 한다
     *
     * @param userId - 구독하는 클라이언트의 사용자 아이디
     * @return SseEmitter - 서버에서 보낸 이벤트 Emitter
     */
    public SseEmitter subscribe(String userId, String lastEventId) {
        String emitterId = userId + "_" + System.currentTimeMillis();
        SseEmitter emitter = emitterRepository.save(emitterId, new SseEmitter(DEFAULT_TIMEOUT));

        // Emitter가 완료될 때(모든 데이터가 성공적으로 전송된 상태) Emitter를 삭제
        emitter.onCompletion(() -> emitterRepository.deleteById(emitterId));
        // Emitter가 타임아웃 되었을 때(지정된 시간동안 어떠한 이벤트도 전송되지 않았을 때) Emitter를 삭제
        emitter.onTimeout(() -> emitterRepository.deleteById(emitterId));

        String eventId = userId + "_" + System.currentTimeMillis();
        // 503 에러를 방지하기 위한 더미 이벤트 전송
        sendAlert(emitter, eventId, emitterId, "EventStream Created. [userId=" + userId + "]");

        if(hasLostData(lastEventId)) {
            sendLostData(lastEventId, userId, emitterId, emitter);
        }

        // 클라이언트가 미수신한 Event 목록이 존재할 경우 전송하여 Event 유실을 예방
        return emitter;
    }

    // 클라이언트에게 메시지 전송
    private void sendAlert(SseEmitter emitter, String eventId, String emitterId, Object data) {
        try {
            emitter.send(SseEmitter.event()
                    .id(eventId)
                    .name("sse")
                    .data(data)
            );
            log.info("sse!" + data);
        } catch (IOException exception) {
            log.error("연결 오류");
            emitterRepository.deleteById(emitterId);
        }
    }

    private boolean hasLostData(String lastEventId) {
        return !lastEventId.isEmpty();
    }

    private void sendLostData(String lastEventId, String userId, String emitterId, SseEmitter emitter) {
        Map<String, Object> eventCaches = emitterRepository.findAllEventCacheStartWithByUserId(String.valueOf(userId));
        eventCaches.entrySet().stream()
                .filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
                .forEach(entry -> sendAlert(emitter, entry.getKey(), emitterId, entry.getValue()));
    }

    // 요청 알림 보내는 메소드
    public ResponseEntity<?> send(AlertAttendRequest alertAttendRequest) {
            boolean exists = alertRepository.existsByTripIdAndSenderId(alertAttendRequest.getTripId(), alertAttendRequest.getSenderId());

            if (exists)
                log.error("ALREADY PARTICIPATED");
            else
                log.info("TRY TO PARTICIPATE . . .");

            if(!exists) {

                /*
                 여행 정보 Get
                 */
                log.info("TRIP REQUEST . . .");
                TripGrpcResponse tripGrpcResponse = tripBlockingStub.getTripById(TripGrpcRequest.newBuilder()
                        .setTripId(alertAttendRequest.getTripId()).build());

                log.info("===================tripInfo=================");
                log.info(tripGrpcResponse.toString());

                if (tripGrpcResponse.getTripApplicantsSize() >= tripGrpcResponse.getTripParticipantsSize()) {
                    log.error("PARTY FULL ... CANNOT ATTEND");
                    throw new NoSuchElementException();
                }

                /*
                 마일리지 사용
                 */
                TripMileageUsageResponse paymentResponse = paymentBlockingStub.tripUseMileage(TripMileageUsageRequest.newBuilder()
                        .setUserId(alertAttendRequest.getSenderId())
                        .setPrice(tripGrpcResponse.getTripDeposit())
                        .build());

                log.info("===================paymentInfo=================");
                log.info(paymentResponse.toString());

                String usageId = paymentResponse.getRecordId();

                // DB Alert 테이블에 데이터 저장하기
                Alert alert = new Alert(UUID.randomUUID().toString(),
                        alertAttendRequest.getTripId(),
                        alertAttendRequest.getTripName(),
                        alertAttendRequest.getSenderId(),
                        alertAttendRequest.getReceiverId(),
                        alertAttendRequest.getPosition(),
                        alertAttendRequest.getAspiration(),
                        alertAttendRequest.getAlertType(),
                        alertAttendRequest.isRead(),
                        usageId);
                alertRepository.save(alert);

                String receiver = alertAttendRequest.getReceiverId();
                String eventId = receiver + "_" + System.currentTimeMillis();
                Map<String, SseEmitter> emitters = emitterRepository.findAllEmitterStartWithByUserId(receiver);
                // 알림을 보내는 response 값 데이터 넣어주기

                AlertListResponse.AlertResponse alertResponse = new AlertListResponse.AlertResponse(alert.getId(),
                        alertAttendRequest.getTripId(),
                        alertAttendRequest.getTripName(),
                        alertAttendRequest.getSenderId(),
                        getSenderName(alertAttendRequest.getSenderId()),
                        alertAttendRequest.getPosition(),
                        alertAttendRequest.getAspiration(),
                        alertAttendRequest.getAlertType(),
                        alertAttendRequest.isRead(),
                        usageId);

                emitters.forEach(
                        (key, emitter) -> {
                            // 데이터 캐시 저장
                            emitterRepository.saveEventCache(key, alertResponse);
                            // 데이터 전송
                            sendAlert(emitter, eventId, key, alertResponse);
                        }
                );

                return ResponseEntity.ok().body("Alert sent successfully"); // 성공 응답
            }
            else{
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Data already exists");
            }
    }

    // 수락/거절 알림 보내는 메소드
    public ResponseEntity<?> patchAlert(String id, String alertType) {
        try{
            Optional<Alert> alertExists = alertRepository.findById(id);
            // 해당 id를 가지고 있는 데이터가 존재하는지 확인하기
            if(alertExists.isPresent()){
                // alertType 변경 + sender와 receiver도 변경해야 함
                Alert alert = alertExists.get();
                alert.setAlertType(alertType);
                alertRepository.save(alert);

                // 이때 요청에 대한 답장 알림이기 때문에 sender,receiver 변경해줘야 함
                String receiver = alert.getSenderId();
                String eventId = receiver + "_" + System.currentTimeMillis();
                Map<String, SseEmitter> emitters = emitterRepository.findAllEmitterStartWithByUserId(receiver);

                // 알림을 보내는 response 값 데이터 넣어주기
                AlertListResponse.AlertResponse alertResponse = new AlertListResponse.AlertResponse(alert.getId(),
                        alert.getTripId(),
                        alert.getTripName(),
                        alert.getReceiverId(),
                        getSenderName(alert.getReceiverId()),
                        alert.getPosition(),
                        alert.getAspiration(),
                        alert.getAlertType(),
                        alert.isRead(),
                        alert.getUsageId());
                emitters.forEach(
                        (key, emitter) -> {
                            // 데이터 캐시 저장
                            emitterRepository.saveEventCache(key, alertResponse);
                            // 데이터 전송
                            sendAlert(emitter, eventId, key, alertResponse);
                        }
                );
                return ResponseEntity.ok().body("Alert sent successfully"); // 성공 응답
            }
            else{
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Data not found");
            }

        }catch (Exception e){
            // DB에 저장된 senderId를 사용해야 함
            log.error("알림 보내기를 실패했습니다.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to send alert");
        }
    }

    // userId별로 알림 리스트 보내주기
    public List<AlertListResponse.AlertResponse> getAlertsByReceiverId(String receiverId) {
        List<Alert> alerts = alertRepository.findByReceiverId(receiverId);
        if(alerts.isEmpty()){
            return null;
        }
        else{
            return mapAlertsToAlertResponses(alerts);
        }
    }

    // senderId별로 알림 리스트 보내주기
    public List<AlertSendListResponse.AlertSendResponse> getAlertsBySenderId(String senderId) {
        List<Alert> alerts = alertRepository.findBySenderId(senderId);
        if(alerts.isEmpty()){
            return null;
        }
        else{
            return mapAlertsToAlertSendResponses(alerts);
        }
    }

    // tripId별로 알림 리스트 보내주기
    public List<AlertListResponse.AlertResponse> getAlertsByTripId(String tripId) {
        List<Alert> alerts = alertRepository.findByTripIdAndAlertType(tripId, "REQUEST");
        if(alerts.isEmpty()){
            return null;
        }
        else{
            return mapAlertsToAlertResponses(alerts);
        }
    }

    private List<AlertListResponse.AlertResponse> mapAlertsToAlertResponses(List<Alert> alerts) {
        return alerts.stream()
                .map(alert -> new AlertListResponse.AlertResponse(
                        alert.getId(),
                        alert.getTripId(),
                        alert.getTripName(),
                        alert.getSenderId(),
                        getSenderName(alert.getSenderId()),
                        alert.getPosition(),
                        alert.getAspiration(),
                        alert.getAlertType(),
                        alert.isRead(),
                        alert.getUsageId()
                ))
                .collect(Collectors.toList());
    }

    // senderId별로
    private List<AlertSendListResponse.AlertSendResponse> mapAlertsToAlertSendResponses(List<Alert> alerts) {
        return alerts.stream()
                .map(alert -> new AlertSendListResponse.AlertSendResponse(
                        alert.getId(),
                        alert.getTripId(),
                        alert.getTripName(),
                        alert.getReceiverId(),
                        getSenderName(alert.getReceiverId()),
                        alert.getPosition(),
                        alert.getAspiration(),
                        alert.getAlertType(),
                        alert.isRead(),
                        alert.getUsageId()
                ))
                .collect(Collectors.toList());
    }

    private String getSenderName(String senderId) {
        Optional<User> sender = userRepository.findById(senderId);
        if (sender.isEmpty()){
            return "No Data";
        }
        else{
            return sender.get().getNickname();
        }
    }

    // sse 알림 삭제
    public ResponseEntity<?> deleteAlert(String id){
        Optional<Alert> findAlert = alertRepository.findById(id);
        if (findAlert.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error during deletion");
        }
        else{
            alertRepository.deleteById(id);
            return ResponseEntity.ok().body("Delete successfully");
        }
    }
}