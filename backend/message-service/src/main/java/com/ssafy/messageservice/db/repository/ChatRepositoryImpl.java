package com.ssafy.messageservice.db.repository;

import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.ssafy.messageservice.api.response.ChatroomListResponse;
import com.ssafy.messageservice.db.entity.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Repository
@Primary
@RequiredArgsConstructor
public class ChatRepositoryImpl implements ChatRepositoryCustom {
    private final JPAQueryFactory queryFactory;
    private final ChatroomUserRepository chatroomUserRepository;
    private final UserRepository userRepository;
    private final ChatroomRepository chatroomRepository;

    // 채팅방 리스트
    @Override
    public ChatroomListResponse getLatestChatsByUserId(String userId) {
        // ChatroomUser 테이블에 가서 전달받은 userId값을 갖고 있는 chatroomId를 받아온다.
        List<ChatroomListResponse.ChatroomResponse> chatroomResponses = queryFactory
                .selectDistinct(QChatroom.chatroom.chatroomId)
                .from(QChatroom.chatroom)
                .where(QChatroom.chatroom.chatroomId.in(
                        JPAExpressions
                                .select(QChatroomUser.chatroomUser.chatroom.chatroomId)
                                .from(QChatroomUser.chatroomUser)
                                .where(QChatroomUser.chatroomUser.userId.eq(userId))
                ))
                .fetch()
                .stream()
                .map(chatroomId -> getLatestMessageForChatroom(chatroomId, userId))
                .filter(Objects::nonNull) // null을 제외
                .sorted(Comparator.comparing(ChatroomListResponse.ChatroomResponse::getChat, Comparator.reverseOrder()))
                .toList();

        return new ChatroomListResponse(chatroomResponses);
    }

    private ChatroomListResponse.ChatroomResponse getLatestMessageForChatroom(String chatroomId, String userId) {
        // 해당 채팅방의 모든 메시지 중 가장 최근의 메시지 가져오기
        Chat latestMessage = queryFactory
                .selectFrom(QChat.chat)
                .where(QChat.chat.chatroom.chatroomId.eq(chatroomId))
                .orderBy(QChat.chat.sendTime.desc()) // sendTime 기준으로 내림차순 정렬
                .fetchFirst();

        // 해당 채팅방에 있는 모든 userId를 가져온다.
        List<String> userIds = chatroomUserRepository.findUserIdsByChatroomId(chatroomId);
        // userIds 값이 null일 수는 없다. 내가 존재하기 때문
        // user 테이블에 접근해서 채팅방에 있는 모든 user에 대한 정보 가져오기
        List<User> userList = userRepository.findAllByIdIn(userIds);

        // chatroom Repo 처리해야 하는데 시간이 없음 .
        if (latestMessage == null)
            latestMessage = Chat.builder()
                    .chatId(UUID.randomUUID().toString())
                    .chatroom(chatroomRepository.findById(chatroomId).get())
                    .content("아직 채팅이 없습니다!")
                    .sendTime(LocalDateTime.now())
                    .userId(userId)
                    .build();

        // 가장 최근 메시지가 존재 상관없이 일단 보낸다.
        // mapToChatroomResponse에서 처리
        return mapToChatroomResponse(latestMessage, userList);
    }
    
    private ChatroomListResponse.ChatroomResponse mapToChatroomResponse(Chat chat, List<User> users) {

        // user 테이블에 접근해서 sender에 대한 정보 가져오기
        Optional<User> senderInfo = userRepository.findById(chat.getUserId());

        if(senderInfo.isPresent()){
            return new ChatroomListResponse.ChatroomResponse(
                    chat.getChatroom().getChatroomId(),
                    chat.getChatroom().getChatroomName(),
                    new ChatroomListResponse.ChatroomResponse.ChatResponse(
                            chat.getUserId(),
                            senderInfo.get().getNickname(),
                            chat.getContent(),
                            chat.getSendTime()
                    ),users
            );
        }
        else{
            return new ChatroomListResponse.ChatroomResponse(
                    chat.getChatroom().getChatroomId(),
                    chat.getChatroom().getChatroomName(),
                    new ChatroomListResponse.ChatroomResponse.ChatResponse(
                            chat.getUserId(),
                            "No Data",
                            chat.getContent(),
                            chat.getSendTime()
                    ),users
            );
        }
    }
}