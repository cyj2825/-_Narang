package com.ssafy.messageservice.api.service;


import com.ssafy.messageservice.api.request.ChatroomRequest;
import com.ssafy.messageservice.api.request.ChatroomUserRequest;
import com.ssafy.messageservice.db.entity.Chatroom;
import com.ssafy.messageservice.db.entity.ChatroomUser;
import com.ssafy.messageservice.db.repository.ChatroomRepository;
import com.ssafy.messageservice.db.repository.ChatroomUserRepository;
import io.grpc.stub.StreamObserver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.narang.lib.*;
import org.springframework.http.ResponseEntity;

import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@GrpcService @Slf4j
public class GrpcMessageService extends NarangGrpc.NarangImplBase {

    private final AlertService alertService;
    private final ChatService chatService;
    private final ChatroomUserRepository chatroomUserRepository;
    private final ChatroomRepository chatroomRepository;

    @Override
    public void acceptJoinRequestType(AlertPatchGrpcRequest request, StreamObserver<AlertPatchGrpcResponse> responseObserver) {

        ResponseEntity<?> res = alertService.patchAlert(request.getAlertId(), "ACCEPT");

        if (res.getStatusCode().is2xxSuccessful())
            responseObserver.onNext(AlertPatchGrpcResponse.newBuilder().setResult(true).build());
        else
            responseObserver.onNext(AlertPatchGrpcResponse.newBuilder().setResult(false).build());
        responseObserver.onCompleted();
    }

    @Override
    public void rejectJoinRequestType(AlertPatchGrpcRequest request, StreamObserver<AlertPatchGrpcResponse> responseObserver) {
        ResponseEntity<?> res = alertService.patchAlert(request.getAlertId(), "REJECT");

        if (res.getStatusCode().is2xxSuccessful())
            responseObserver.onNext(AlertPatchGrpcResponse.newBuilder().setResult(true).build());
        else
            responseObserver.onNext(AlertPatchGrpcResponse.newBuilder().setResult(false).build());
        responseObserver.onCompleted();
    }

    @Override
    public void joinIntoChatroom(ChatroomUserPatchGrpcRequest request, StreamObserver<ChatroomUserPatchGrpcResponse> responseObserver) {
        Optional<Chatroom> chatroom = chatroomRepository.findById(request.getChatroomId());

        if (chatroom.isEmpty()) {

            Chatroom newRoom = Chatroom.builder()
                    .chatroomId(request.getChatroomId())
                    .chatroomName("나랑 여행 채팅방")
                    .build();

            chatroomRepository.save(newRoom);
        }

        ChatroomUser chatroomUser = ChatroomUser.builder()
                .chatroom(chatroom.get())
                .userId(request.getUserId())
                .id(UUID.randomUUID().toString())
                .build();

        Optional<ChatroomUser> result = Optional.of(chatroomUserRepository.save(chatroomUser));

        responseObserver.onNext(ChatroomUserPatchGrpcResponse.newBuilder().setResult(true).build());
        responseObserver.onCompleted();
    }

    @Override
    public void exileFromChatroom(ChatroomUserPatchGrpcRequest request, StreamObserver<ChatroomUserPatchGrpcResponse> responseObserver) {

        log.info(request.toString());
        chatService.exileFromChatroom(
                ChatroomUserRequest.builder()
                        .chatroomId(request.getChatroomId())
                        .userId(request.getUserId())
                        .build()
        );

        Optional<Chatroom> chatroom = chatroomRepository.findById(request.getChatroomId());

        chatroom.ifPresent(value -> log.info("NOT DELETED : " + value.toString()));

        responseObserver.onNext(ChatroomUserPatchGrpcResponse.newBuilder().setResult(true).build());
        responseObserver.onCompleted();
    }

    @Override
    public void postChatRoom(ChatGrpcRequest request, StreamObserver<ChatGrpcResponse> responseObserver) {

        String chatroomId = chatService.postChatroom(
                ChatroomRequest.builder()
                        .userId(request.getUserId())
                        .chatroomName(request.getChatroomName())
                        .build());

        ChatGrpcResponse response = ChatGrpcResponse.newBuilder()
                .setChatroomId(chatroomId)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}
