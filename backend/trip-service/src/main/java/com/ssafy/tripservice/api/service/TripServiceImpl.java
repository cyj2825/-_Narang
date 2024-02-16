package com.ssafy.tripservice.api.service;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.mongodb.client.result.DeleteResult;
import com.mongodb.client.result.UpdateResult;
import com.ssafy.tripservice.api.request.*;
import com.ssafy.tripservice.api.response.TripPageResponse;
import com.ssafy.tripservice.api.response.TripRefundResponse;
import com.ssafy.tripservice.api.response.TripResponse;
import com.ssafy.tripservice.api.response.TripSimpleResponse;
import com.ssafy.tripservice.db.entity.QTrip;
import com.ssafy.tripservice.db.entity.Trip;
import com.ssafy.tripservice.db.repository.TripRepository;
import com.ssafy.tripservice.exception.TripAlreadyJoinException;
import com.ssafy.tripservice.exception.TripNotFoundException;
import com.ssafy.tripservice.exception.TripTimeExceedException;
import com.ssafy.tripservice.exception.TripsizeFullException;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.client.inject.GrpcClient;
import net.devh.boot.grpc.server.service.GrpcService;
import org.narang.lib.*;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.core.*;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RequiredArgsConstructor
@Transactional
@Service @GrpcService
@Slf4j
public class TripServiceImpl extends NarangGrpc.NarangImplBase implements TripService  {

    private final MongoOperations mongoTemplate;
    private final AmazonS3Client amazonS3Client;
    private final TripRepository tripRepository;

    @GrpcClient("payment-service")
    private NarangGrpc.NarangBlockingStub paymentBlockingStub;

    @GrpcClient("message-service")
    private NarangGrpc.NarangBlockingStub chatBlockingStub;

    @Override
    public Optional<TripResponse> createTrip(TripRequest tripRequest, MultipartFile tripImg) {
        /*
            Saving Img To AWS S3
         */

        Optional<String> uploadTripImgRes = Optional.of("https://youngkimi-bucket-01.s3.ap-northeast-2.amazonaws.com/airplain.jpg");

        if (tripImg != null) {
            uploadTripImgRes = uploadFile(tripImg);
        }

        /*
            Saving Trip to mongoDB
         */
        tripRequest.setTripImgUrl(uploadTripImgRes.get());

        Trip.Participant initialParticipant
                = Trip.Participant.builder()
                .userRoles(tripRequest.getLeaderRoles())
                .participantId(tripRequest.getTripLeaderId())
                .enrollmentDate(LocalDateTime.now())
                .build();

        List<Trip.Participant> initialParty = List.of(initialParticipant);

        ChatGrpcResponse response = chatBlockingStub.postChatRoom(
                ChatGrpcRequest.newBuilder()
                        .setChatroomName(tripRequest.getTripName())
                        .setUserId(tripRequest.getTripLeaderId().toString())
                        .build()
        );

        tripRequest.setParticipants(initialParty);
        tripRequest.setTripChatId(UUID.fromString(response.getChatroomId()));
        Trip trip = tripRequest.toEntity();

        /*
            add User To Trip
         */

        try {
            return Optional.of(tripRepository.insert(trip))
                    .map(Trip::toTripResponse);
        } catch (DataAccessException e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }

    @Transactional
    @Override
    public Optional<TripResponse> modifyTrip(TripModifyRequest tripRequest, MultipartFile tripImg) {

        Optional<Trip> trip = Optional.ofNullable(mongoTemplate.findById(tripRequest.getTripId(), Trip.class));

        if (trip.isEmpty()) {
            log.error("Trip not found...");
            return Optional.empty();
        }

        Optional<String> uploadTripImgRes = Optional.of("https://youngkimi-bucket-01.s3.ap-northeast-2.amazonaws.com/airplain.jpg");

        if (tripImg != null) {
            uploadTripImgRes = uploadFile(tripImg);
        }

        // tripName, tripDesc, tripImgUrl, tripParticipantsSize

        Query query = new Query(Criteria.where("_id").is(tripRequest.getTripId()));

        Update update = new Update();

        update.set("tripName", tripRequest.getTripName());
        update.set("tripDesc", tripRequest.getTripDesc());
        update.set("tripImgUrl", uploadTripImgRes.get());

        return Optional.ofNullable(mongoTemplate.findAndModify(query, update, Trip.class))
                .map(Trip::toTripResponse);
    }

    @Override
    public List<TripResponse> getAvailableTrips() {

        List<TripResponse> tripResponses = new ArrayList<>();

        Iterable<Trip> tripIterable = tripRepository.findAll(
                QTrip.trip.departureDate.gt(LocalDate.now()));

        for (Trip trip : tripIterable) {

            TripResponse tripResponse = trip.toTripResponse();

            if (tripResponse.getDepartureDate().isAfter(LocalDate.now()))
                System.out.println(tripResponses);
            tripResponses.add(tripResponse);
        }

        return tripResponses;
    }

    @Override
    public Optional<TripResponse> getTripById(UUID tripId) {

        Query query = new Query(Criteria.where("_id").is(tripId));
        Update update = new Update();

        update.inc("viewCnt", 1);

        mongoTemplate.updateFirst(query, update, Trip.class);

        return Optional.ofNullable(mongoTemplate.findById(tripId, Trip.class))
                .map(Trip::toTripResponse);
    }

    @Override
    public Optional<TripResponse> joinTrip(UserRequest userRequest) {

        Query cntQuery = new Query(Criteria.where("_id").is(userRequest.getTripId()));

        Optional<Trip> trip = tripRepository.findById(userRequest.getTripId());

        if (trip.isEmpty()) {
            log.error("Trip not found...");
            throw new TripNotFoundException();
        }
        if (trip.get().getParticipants().size() >= trip.get().getTripParticipantsSize()) {
            log.error("Trip is full...");
            throw new TripsizeFullException();
        }
        if (trip.get().getDepartureDate().isBefore(LocalDate.now())) {
            log.error("Trip already departed...");
            throw new TripTimeExceedException();
        }

        for (Trip.Participant p : trip.get().getParticipants()) {
            if (p.getParticipantId().equals(userRequest.getUserId())) {
                log.error("Already participated...");
                throw new TripAlreadyJoinException();
            }
        }

        /*
            Alert Patch Request
            Chat Join Request
         */

        AlertPatchGrpcResponse response = chatBlockingStub.acceptJoinRequestType(
                AlertPatchGrpcRequest.newBuilder()
                        .setAlertId(userRequest.getAlertId())
                        .setAlertType("ACCEPT").build());

        ChatroomUserPatchGrpcResponse chatRoomJoinResponse = chatBlockingStub.joinIntoChatroom(ChatroomUserPatchGrpcRequest.newBuilder()
                        .setChatroomId(trip.get().getTripChatId().toString())
                        .setUserId(userRequest.getUserId().toString())
                        .build());

        Query query = new Query(Criteria.where("_id").is(userRequest.getTripId()));

        Trip.Participant participant
                = Trip.Participant.builder()
                .userRoles(userRequest.getUserRoles())
                .usageId(userRequest.getUsageId())
                .participantId(userRequest.getUserId())
                .enrollmentDate(LocalDateTime.now())
                .build();

        Update update = new Update().addToSet("participants", participant);

        UpdateResult res = mongoTemplate.updateFirst(query, update, Trip.class);

        /*
            채팅
         */

        return Optional.ofNullable(mongoTemplate.findById(userRequest.getTripId(), Trip.class))
                .map(Trip::toTripResponse);
    }

    @Override
    public Optional<TripRefundResponse> leaveTrip(UserRequest userRequest) {

        log.info(userRequest.toString());

        Query cntQuery = new Query(Criteria.where("_id").is(userRequest.getTripId()));

        Optional<Trip> trip = tripRepository.findById(userRequest.getTripId());

        if (trip.isPresent())
            log.info("Trip : {}", trip.get().toString());
        else log.error("Trip Not Found");

        if (trip.isEmpty()) {
            log.error("Trip not found...");
            return Optional.empty();
        }
        if (trip.get().getTripLeaderId().equals(userRequest.getUserId())) {
            log.error("Leader cannot leave...");
            return Optional.empty();
        }

        boolean exist = false;

        for (Trip.Participant p : trip.get().getParticipants()) {

            log.info(p.toString());

            if (p.getParticipantId().equals(userRequest.getUserId())) {
                exist = true;
                break;
            }
        }

        if (! exist)
            return Optional.empty();

        Query query = new Query(
                Criteria.where("_id").is(userRequest.getTripId()));

        List<Trip.Participant> participants = trip.get().getParticipants().stream()
                .filter(participant -> ! participant.getParticipantId().equals(userRequest.getUserId()))
                .toList();

        Update update = new Update();

        update.set("participants", participants);

        UpdateResult res = mongoTemplate.upsert(query, update, Trip.class);

        log.info(userRequest.getUserId().toString());
        log.info(trip.get().getTripChatId().toString());

        if (res.getModifiedCount() > 0) {
            ChatroomUserPatchGrpcResponse response = chatBlockingStub.exileFromChatroom(ChatroomUserPatchGrpcRequest.newBuilder()
                            .setUserId(userRequest.getUserId().toString())
                            .setChatroomId(trip.get().getTripChatId().toString())
                    .build());

            for (Trip.Participant p : trip.get().getParticipants()) {
                if (p.getParticipantId().equals(userRequest.getUserId())) {

                    PaymentRefundGrpcResponse refundGrpcResponse = paymentBlockingStub.refundPaymentRecord(
                            PaymentRefundGrpcRequest.newBuilder()
                                    .setUsageId(p.getUsageId())
                                    .setTripId(userRequest.getTripId().toString())
                                    .setDepartureDate(trip.get().getDepartureDate().toString())
                                    .build()
                    );
                    return Optional.of(
                            TripRefundResponse.builder()
                                    .message(refundGrpcResponse.getMessage())
                                    .price(refundGrpcResponse.getRefundPrice())
                                    .result(refundGrpcResponse.getResult())
                                .build()
                    );
                }
            }
        }

        return Optional.empty();
    }

   @Override
    public boolean deleteTrip(UserRequest userRequest) {
        Query query = new Query(Criteria.where("_id").is(userRequest.getTripId()))
                .addCriteria(Criteria.where("tripLeaderId").is(userRequest.getUserId()));

        DeleteResult res = mongoTemplate.remove(query, Trip.class);

        if (res.getDeletedCount() == 0)
            log.error("Trip not found...");
        return res.getDeletedCount() != 0;
    }

    public Optional<String> uploadFile(MultipartFile img) {

        String bucket = "youngkimi-bucket-01";

        try {
            String fileName = UUID.randomUUID().toString();
            StringBuilder fileUrl = new StringBuilder();
            fileUrl.append("https://").append(bucket).append(".s3.ap-northeast-2.amazonaws.com/").append(fileName);
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(img.getContentType());
            metadata.setContentLength(img.getSize());
            amazonS3Client.putObject(bucket, fileName, img.getInputStream(), metadata);
            return Optional.of(fileUrl.toString());
        } catch (IOException e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }


    public Page<TripPageResponse> getAvailableTripPages(int pageNo) {
        final int pageSize = 9;

        PageRequest pageRequest = PageRequest.of(pageNo, pageSize, Sort.by("departureDate").ascending());

        Query query = new Query()
                .with(pageRequest)
                .skip((long) pageRequest.getPageSize() * pageRequest.getPageNumber())
                .limit(pageSize);

        query.addCriteria(Criteria.where("departureDate").gt(LocalDateTime.now()));

        List<Trip> availableTrips = mongoTemplate.find(query, Trip.class);

        return PageableExecutionUtils
                .getPage(availableTrips, pageRequest,
                        () -> mongoTemplate.count(query.skip(-1).limit(-1), Trip.class))
                .map(Trip::toTripPageResponse);
    }

    @Override
    public List<TripResponse> getBannerTrips(String tripConcept) {

        Query query = new Query(
                Criteria
                .where("departureDate")
                    .gt(LocalDateTime.now())).with(Sort.by("departureDate").ascending()).limit(24)
                .addCriteria(
                Criteria
                    .where("tripConcept").is(tripConcept)
                );

        return mongoTemplate.find(query, Trip.class)
                .stream().map(Trip::toTripResponse).toList();
    }

    @Override
    public Page<TripPageResponse> getTripsIveBeen(TripQueryRequest tripQueryRequest) {

        final int pageSize = 4;

        PageRequest pageRequest = PageRequest.of(
                tripQueryRequest.getPageNo(), pageSize, Sort.by("departureDate").descending());

        Query query = new Query()
                .with(pageRequest)
                .skip((long) pageRequest.getPageSize() * pageRequest.getPageNumber())
                .limit(pageSize);

        query.addCriteria(
                Criteria
                        .where("participants")
                        .elemMatch(
                                Criteria.where("participantId").is(tripQueryRequest.getUserId())))
                .addCriteria(
                    (Criteria.where("departureDate").lt(tripQueryRequest.getQueryEndDate()))
                            .and("returnDate").gt(tripQueryRequest.getQuerySttDate()));

        List<Trip> myTrips = mongoTemplate.find(query, Trip.class);

        return PageableExecutionUtils
                .getPage(myTrips, pageRequest,
                        () -> mongoTemplate.count(query.skip(-1).limit(-1), Trip.class))
                .map(Trip::toTripPageResponse);
    }

    @Override
    public Page<TripPageResponse> getTripsIveOwn(TripQueryRequest tripQueryRequest) {

        final int pageSize = 4;

        PageRequest pageRequest = PageRequest.of(
                tripQueryRequest.getPageNo(), pageSize, Sort.by("departureDate").descending());

        Query query = new Query()
                .with(pageRequest)
                .skip((long) pageRequest.getPageSize() * pageRequest.getPageNumber())
                .limit(pageSize);

        query.addCriteria(
                        Criteria
                                .where("tripLeaderId").is(tripQueryRequest.getUserId())
                                .and("departureDate").gt(LocalDateTime.now()));

        List<Trip> myTrips = mongoTemplate.find(query, Trip.class);

        return PageableExecutionUtils
                .getPage(myTrips, pageRequest,
                        () -> mongoTemplate.count(query.skip(-1).limit(-1), Trip.class))
                .map(Trip::toTripPageResponse);
    }

    @Override
    public Page<TripPageResponse> getTripsIWant(TripQueryRequest tripQueryRequest) {

        final int pageSize = 9;

        PageRequest pageRequest = PageRequest.of(
        tripQueryRequest.getPageNo(), pageSize, Sort.by("departureDate").ascending());

        List<Trip> tripsIWant = new LinkedList<>();

        Page<Trip> tripPages = tripRepository.findAll(
                QTrip.trip
                        .tripRoles.any().in(tripQueryRequest.getTripRoles())
                        .and(QTrip.trip.departureDate.before(tripQueryRequest.getQueryEndDate())
                                .and(QTrip.trip.returnDate.after(tripQueryRequest.getQuerySttDate())))
                        .and(QTrip.trip.departureDate.after(LocalDate.now()))
                        .and(QTrip.trip.tripParticipantsSize.goe(tripQueryRequest.getParticipantsSize()))
                        .and(QTrip.trip.tripConcept.in(tripQueryRequest.getTripConcept()))
                        .and(QTrip.trip.continent.in(tripQueryRequest.getTripContinent())), pageRequest);

        return tripPages.map(Trip::toTripPageResponse);
    }

    /*
        탈퇴 회원 가입 파티 삭제
        한개씩만 되는거 문제. 나머지 데이터 다 사라지는거 문제 : 해결 !
     */
    @Override
    public long eraseWithdrawalUser(UUID userId) {

        Query query = new Query(
                Criteria
                        .where("participants")
                        .elemMatch(
                                Criteria.where("participantId")
                                        .is(userId)));

        System.out.println(mongoTemplate.find(query, Trip.class).size());

        Update update = new Update().pull("participants", Query.query(Criteria.where("participantId").is(userId)));

        return mongoTemplate.updateMulti(query, update, Trip.class).getMatchedCount();
    }

    @Override
    public void getTripById(org.narang.lib.TripGrpcRequest request, StreamObserver<org.narang.lib.TripGrpcResponse> responseObserver) {
        Optional<Trip> trip = tripRepository.findById(UUID.fromString(request.getTripId()));

        log.info("REQUEST RECIVED >>>>> ");
        log.info("REQUEST RESULT >>>>> ");
        if (trip.isPresent()) {
            log.info("REQUEST RESULT EXISTS ");
        }
        else {
            log.info("REQUEST RESULT NOT EXISTS");
        }

        if (trip.isEmpty()) {
            responseObserver.onError(new NoSuchElementException());
            responseObserver.onCompleted();
        }
        else {
            TripGrpcResponse response = TripGrpcResponse.newBuilder()
                    .setTripId(trip.get().get_id().toString())
                    .setTripLeaderId(trip.get().getTripLeaderId().toString())
                    .setTripChatId(trip.get().getTripChatId().toString())
                    .setTripDeposit(trip.get().getTripDeposit())
                    .setTripParticipantsSize(trip.get().getTripParticipantsSize())
                    .setTripApplicantsSize(trip.get().getParticipants().size())
                    .build();

            // Plan NULL EXCEPTION

            responseObserver.onNext(response);
            responseObserver.onCompleted();
        }
    }

    @Override
    public boolean rejectTripJoinRequest(UserRejectRequest request) {

        // Alert Toggle
        AlertPatchGrpcResponse alertResponse =  chatBlockingStub.rejectJoinRequestType(
                AlertPatchGrpcRequest.newBuilder()
                        .setAlertId(request.getAlertId())
                        .setAlertType("REJECT")
                        .build()
        );

        if (! alertResponse.getResult()) return false;
        // Refund
        PaymentRefundGrpcResponse response =  paymentBlockingStub.cancelPaymentRecord(
                PaymentRefundGrpcRequest.newBuilder()
                .setUsageId(request.getUsageId())
                .build()
        );

        return response.getResult();
    }
}
