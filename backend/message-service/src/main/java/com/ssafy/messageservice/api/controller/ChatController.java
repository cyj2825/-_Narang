package com.ssafy.messageservice.api.controller;

import com.ssafy.messageservice.api.request.AlertAttendRequest;
import com.ssafy.messageservice.api.request.ChatroomRequest;
import com.ssafy.messageservice.api.response.ChatListResponse;
import com.ssafy.messageservice.api.response.ChatroomListResponse;
import com.ssafy.messageservice.api.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;

@CrossOrigin("*")
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/message/chat")
public class ChatController {
    private final ChatService chatService;
    private static final Logger LOGGER = LoggerFactory.getLogger(ChatController.class);

    // 채팅방 리스트
    @GetMapping("/list/{userId}")
    public ResponseEntity<ChatroomListResponse> getLatestChatsByUserId(@PathVariable String userId) {
        ChatroomListResponse chatroomListResponse = chatService.getLatestChatsByUserId(userId);
        LOGGER.info(String.format("메시지 시간을 확인해보자", chatroomListResponse.getChatroomList().get(0).getChat().getLatestTime()));
        LOGGER.info(String.format("확인해야 하거든? -> %s", ZoneId.systemDefault()));
        return ResponseEntity.ok(chatroomListResponse);
    }

    // 채팅방 조회 (해당 채팅방의 채팅 불러오기)
    @GetMapping("/{chatroomId}")
    public ResponseEntity<ChatListResponse> getChatMessagesByChatroomId(@PathVariable String chatroomId, @RequestParam(defaultValue = "0") int page) {
        ChatListResponse chatPage = chatService.getChatMessagesByChatroomId(chatroomId, page);
        return ResponseEntity.ok(chatPage);
    }

    // 채팅방 생성
    @PostMapping("/create")
    public ResponseEntity<String> postChatroom(@RequestBody ChatroomRequest chatroomRequest) {
        return ResponseEntity.ok(chatService.postChatroom(chatroomRequest));
    }

    // 채팅 생성 -> stomp으로 처리
//    @PostMapping("/{chatroomId}/chat")
//    public ResponseEntity<String> postChatMessageByChatroomId(@PathVariable String chatroomId) {
//        return ResponseEntity.ok("success");
//    }
}
