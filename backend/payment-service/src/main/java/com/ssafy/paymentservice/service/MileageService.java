package com.ssafy.paymentservice.service;

import com.ssafy.paymentservice.db.entity.RefundRecord;
import com.ssafy.paymentservice.db.entity.UsageRecord;
import com.ssafy.paymentservice.db.entity.UserMileage;
import com.ssafy.paymentservice.db.repository.RefundRecordRepository;
import com.ssafy.paymentservice.db.repository.UsageRecordRepository;
import com.ssafy.paymentservice.db.repository.UserMileageRepository;
import com.ssafy.paymentservice.entity.RefundResponse;
import io.grpc.stub.StreamObserver;
import com.ssafy.paymentservice.exception.BusinessLogicException;
import com.ssafy.paymentservice.exception.ExceptionCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import net.devh.boot.grpc.server.service.GrpcService;
import org.narang.lib.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.encrypt.TextEncryptor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.util.NoSuchElementException;
import java.util.Optional;

@Slf4j
@Service @GrpcService
@RequiredArgsConstructor
public class MileageService extends NarangGrpc.NarangImplBase {
    private final UserMileageRepository userMileageRepository;
    private final UsageRecordRepository usageRecordRepository;
    private final RefundRecordRepository refundRecordRepository;

    @GrpcClient("trip-service")
    private NarangGrpc.NarangBlockingStub tripBlockingStub;

    @Autowired
    private TextEncryptor textEncryptor;
    public int getMileage(String user_id){
        Optional<UserMileage> userMileageOptional = userMileageRepository.findByUserId(user_id);
        if (userMileageOptional.isPresent()) {
            UserMileage userMileage = userMileageOptional.get();
            return Integer.parseInt(textEncryptor.decrypt(userMileage.getEncryptedMileage()));
        } else {
            // 마일리지를 찾을 수 없을 때, 기본 마일리지가 0인 새로운 UserMileage 객체 생성 및 저장
            UserMileage newUserMileage = new UserMileage();
            newUserMileage.setUserId(user_id);
            newUserMileage.setEncryptedMileage(textEncryptor.encrypt("0")); // 기본 마일리지를 암호화하여 설정

            userMileageRepository.save(newUserMileage); // 저장하는 코드 필요 (실제 저장 방법에 따라 다를 수 있음)

            return 0; // 0으로 설정된 기본 마일리지 반환
        }
    }
    public UsageRecord useMileage(String user_id, int price){
        log.info("useMileage 호출. user_id : {}, price : {}", user_id, price);
        UserMileage userMileage = userMileageRepository.findByUserId(user_id)
                .orElseThrow(() -> new NoSuchElementException("User mileage not found..."));

        setMileage(userMileage, price * (-1));

        UsageRecord usageRecord = new UsageRecord(user_id, price,
                Integer.parseInt(textEncryptor.decrypt(userMileage.getEncryptedMileage())));
        usageRecordRepository.save(usageRecord);
        return usageRecord;
    }

    public RefundResponse cancelMileage(String usage_id, String trip_id, LocalDate departureDate){
        log.info("cancelMileage 호출. usage_id : {}", usage_id);
        UsageRecord usageRecord = usageRecordRepository.findById(usage_id)
                .orElseThrow(() -> new NoSuchElementException("Usage record not found..."));

        if(usageRecord.getRefundStatus()){
            throw new IllegalStateException("이미 환불된 기록입니다.");
        }


        String user_id = usageRecord.getUserId();
        int price = usageRecord.getPrice();
        int refund_price = 0;

        int dayDifference = calculateDateDifference(LocalDate.now(), departureDate);

        RefundResponse refundResponse = new RefundResponse();

        if(dayDifference > 13){ // 2주일 이상 남은 경우
            log.info("2주일 이상 남았으므로 전액({}원) 환불 처리됩니다.", price);
            refundResponse.setMessage("2주일 이상 남았으므로 전액 환불 처리됩니다.");
            refundResponse.setRefundPrice(price);
        } else if(dayDifference > 6) { // 1주일 이상 남은 경우
            log.info("1주일 이상 남았으므로 50%({}원) 환불 처리됩니다.", price / 2);
            price /= 2;
            refund_price = price;
            refundResponse.setMessage("1주일 이상 남았으므로 50% 환불 처리됩니다.");
            refundResponse.setRefundPrice(price);
        } else {
            log.info("1주일 이내 남았으므로 환불 처리되지 않습니다.");
            refund_price = price;
            price = 0;
            refundResponse.setMessage("1주일 이내 남았으므로 환불 처리되지 않습니다.");
            refundResponse.setRefundPrice(price);
        }

        TripGrpcResponse tripGrpcResponse = tripBlockingStub.getTripById(TripGrpcRequest.newBuilder()
                .setTripId(trip_id).build());
        UserMileage leaderMileage = userMileageRepository.findByUserId(tripGrpcResponse.getTripLeaderId())
                .orElseThrow(() -> new NoSuchElementException("Leader mileage not found..."));

        UserMileage userMileage = userMileageRepository.findByUserId(user_id)
                .orElseThrow(() -> new NoSuchElementException("User mileage not found..."));

        setMileage(leaderMileage, refund_price);
        setMileage(userMileage, price);

        usageRecord.setRefundStatus(true);

        RefundRecord refundRecord = new RefundRecord(user_id, price,
                Integer.parseInt(textEncryptor.decrypt(userMileage.getEncryptedMileage())));

        refundRecordRepository.save(refundRecord);
        return refundResponse;
    }

    public RefundResponse rejectMileageWithResponse(String usage_id){
        log.info("rejectMileage 호출. usage_id : {}", usage_id);
        UsageRecord usageRecord = usageRecordRepository.findById(usage_id)
                .orElseThrow(() -> new NoSuchElementException("Usage record not found..."));
        if(usageRecord.getRefundStatus()){
            throw new IllegalStateException("이미 환불된 기록입니다.");
        }
        String user_id = usageRecord.getUserId();
        int price = usageRecord.getPrice();
        RefundResponse refundResponse = new RefundResponse();
        refundResponse.setRefundPrice(price);
        refundResponse.setMessage("전액 환불 처리되었습니다.");

        UserMileage userMileage = userMileageRepository.findByUserId(user_id)
                .orElseThrow(() -> new NoSuchElementException("User mileage not found..."));

        setMileage(userMileage, price);

        usageRecord.setRefundStatus(true);

        RefundRecord refundRecord = new RefundRecord(user_id, price,
                Integer.parseInt(textEncryptor.decrypt(userMileage.getEncryptedMileage())));

        refundRecordRepository.save(refundRecord);
        return refundResponse;
    }

    public RefundRecord rejectMileage(String usage_id){
        log.info("rejectMileage 호출. usage_id : {}", usage_id);
        UsageRecord usageRecord = usageRecordRepository.findById(usage_id)
                .orElseThrow(() -> new NoSuchElementException("Usage record not found..."));
        if(usageRecord.getRefundStatus()){
            throw new IllegalStateException("이미 환불된 기록입니다.");
        }
        String user_id = usageRecord.getUserId();
        int price = usageRecord.getPrice();

        UserMileage userMileage = userMileageRepository.findByUserId(user_id)
                .orElseThrow(() -> new NoSuchElementException("User mileage not found..."));

        setMileage(userMileage, price);

        usageRecord.setRefundStatus(true);

        RefundRecord refundRecord = new RefundRecord(user_id, price,
                Integer.parseInt(textEncryptor.decrypt(userMileage.getEncryptedMileage())));

        refundRecordRepository.save(refundRecord);
        return refundRecord;
    }

    private void setMileage(UserMileage userMileage, int price){
        String encryptedMileage = userMileage.getEncryptedMileage();
        // 암호화된 마일리지 복호화
        int current_mileage = Integer.parseInt(textEncryptor.decrypt(encryptedMileage));
        int new_mileage = current_mileage + price;
        if(new_mileage < 0){ throw new BusinessLogicException(ExceptionCode.PAY_NO_MONEY); }
        String newEncryptedMileage = textEncryptor.encrypt(String.valueOf(new_mileage));
        userMileage.setEncryptedMileage(newEncryptedMileage);
        userMileageRepository.save(userMileage);
    }

    private int calculateDateDifference(LocalDate startDate, LocalDate endDate) {
        Period period = Period.between(startDate, endDate);
        return period.getDays();
    }
    /*
        Trip 아니고 Chat 에 들어가야 함 ...
     */

    @Override
    public void tripUseMileage(TripMileageUsageRequest request, StreamObserver<TripMileageUsageResponse> responseObserver) {
        UsageRecord record = useMileage(request.getUserId(), request.getPrice());

        if (record != null) {
            TripMileageUsageResponse response = TripMileageUsageResponse.newBuilder()
                    .setUserId(record.getUserId())
                    .setBalance(record.getBalance())
                    .setPrice(record.getPrice())
                    .setRecordId(record.getId().toString()).build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
        else {
            responseObserver.onError(new NoSuchElementException());
            responseObserver.onCompleted();
        }
    }

    @Override
    public void cancelPaymentRecord(PaymentRefundGrpcRequest request, StreamObserver<PaymentRefundGrpcResponse> responseObserver) {

        RefundResponse record = rejectMileageWithResponse(request.getUsageId());

        responseObserver.onNext(PaymentRefundGrpcResponse.newBuilder()
                .setResult(true)
                .setMessage(record.getMessage())
                .setRefundPrice(record.getRefundPrice())
                .build());
        responseObserver.onCompleted();
    }

    @Override
    public void refundPaymentRecord(PaymentRefundGrpcRequest request, StreamObserver<PaymentRefundGrpcResponse> responseObserver) {

        RefundResponse response =
        cancelMileage(request.getUsageId(), request.getTripId(), LocalDate.parse(request.getDepartureDate()));

        responseObserver.onNext(PaymentRefundGrpcResponse.newBuilder()
                .setResult(true)
                .setMessage(response.getMessage())
                .setRefundPrice(response.getRefundPrice())
                .build());
        responseObserver.onCompleted();
    }
}
