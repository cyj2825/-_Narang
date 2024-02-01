package com.ssafy.messageservice.api.service;

import com.ssafy.messageservice.api.request.AlertAttendRequest;
import com.ssafy.messageservice.api.response.AlertListResponse;
import com.ssafy.messageservice.db.entity.Alert;
import com.ssafy.messageservice.db.repository.AlertRepository;
import com.ssafy.messageservice.db.repository.EmitterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlertService {
    // 기본 타임아웃 설정
    private static final Long DEFAULT_TIMEOUT = 60L * 1000 * 60;
    private final EmitterRepository emitterRepository;
    private final AlertRepository alertRepository;

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
        } catch (IOException exception) {
            emitterRepository.deleteById(emitterId);
        }
    }

    private boolean hasLostData(String lastEventId) {
        return !lastEventId.isEmpty();
    }

    private void sendLostData(String lastEventId, String userId, String emitterId, SseEmitter emitter) { // (6)
        Map<String, Object> eventCaches = emitterRepository.findAllEventCacheStartWithByUserId(String.valueOf(userId));
        eventCaches.entrySet().stream()
                .filter(entry -> lastEventId.compareTo(entry.getKey()) < 0)
                .forEach(entry -> sendAlert(emitter, entry.getKey(), emitterId, entry.getValue()));
    }

    // 알림 보내는 메소드
    public boolean send(AlertAttendRequest alertAttendRequest) {
        try{
            // DB Alert 테이블에 데이터 저장하기
            Alert alert = new Alert(UUID.randomUUID().toString(),
                    alertAttendRequest.getTripId(),
                    alertAttendRequest.getTripName(),
                    alertAttendRequest.getSenderId(),
                    alertAttendRequest.getReceiverId(),
                    alertAttendRequest.getPosition(),
                    alertAttendRequest.getAspiration(),
                    alertAttendRequest.getAlertType(),
                    alertAttendRequest.isRead());
            alertRepository.save(alert);
            String receiver = alertAttendRequest.getReceiverId();
            String eventId = receiver + "_" + System.currentTimeMillis();
            Map<String, SseEmitter> emitters = emitterRepository.findAllEmitterStartWithByUserId(receiver);
            emitters.forEach(
                    (key, emitter) -> {
                        emitterRepository.saveEventCache(key, alert);
                        sendAlert(emitter, eventId, key, "success");
                    }
            );
            return true;
        }catch (Exception e){
            System.out.println("알림 보내기를 실패했습니다.");
            return false;
        }
    }


    // 알림 리스트 보내기
    public List<AlertListResponse.AlertResponse> getAlertsByReceiverId(String receiverId) {
        List<Alert> alerts = alertRepository.findByReceiverId(receiverId);
        return mapAlertsToAlertResponses(alerts);
    }

    private List<AlertListResponse.AlertResponse> mapAlertsToAlertResponses(List<Alert> alerts) {
        return alerts.stream()
                .map(alert -> new AlertListResponse.AlertResponse(
                        alert.getAlertId(),
                        alert.getTripId(),
                        alert.getTripName(),
                        alert.getSenderId(),
                        getSenderName(alert.getSenderId()),
                        alert.getPosition(),
                        alert.getAspiration(),
                        alert.getAlertType(),
                        alert.isRead()
                ))
                .collect(Collectors.toList());
    }

    private String getSenderName(String senderId) {
        // todo : senderId 값을 바탕으로 senderName 받아오기
        return "Sample Sender Name 예진";
    }


//    public void send(AlertAttendRequest alertAttendRequest) {
//        // DB Alert 테이블에 데이터 저장하기
//        Alert alert = new Alert(UUID.randomUUID().toString(),
//                alertAttendRequest.getTripId(),
//                alertAttendRequest.getTripName(),
//                alertAttendRequest.getSenderId(),
//                alertAttendRequest.getReceiverId(),
//                alertAttendRequest.getPosition(),
//                alertAttendRequest.getAspiration(),
//                alertAttendRequest.getAlertType(),
//                alertAttendRequest.isRead());
//        alertRepository.save(alert);
//        String receiver = alertAttendRequest.getReceiverId();
//        String eventId = receiver + "_" + System.currentTimeMillis();
//        Map<String, SseEmitter> emitters = emitterRepository.findAllEmitterStartWithByUserId(receiver);
//        emitters.forEach(
//                (key, emitter) -> {
//                    emitterRepository.saveEventCache(key, alert);
//                    sendAlert(emitter, eventId, key, "success");
//                }
//        );
//    }

//    private Alert createNotification(Member receiver, Notify.NotificationType notificationType, String content, String url) {
//        return Alert.builder()
//                .receiver(receiver)
//                .notificationType(notificationType)
//                .content(content)
//                .url(url)
//                .isRead(false)
//                .build();
//    }
}
