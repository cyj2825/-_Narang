package com.ssafy.messageservice.api.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ssafy.messageservice.db.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 채팅방 리스트 API 데이터
 */
@Getter
@AllArgsConstructor
public class ChatroomListResponse {
    private List<ChatroomResponse> chatroomList;

    @Getter
    @AllArgsConstructor
    public static class ChatroomResponse implements Comparable<ChatroomResponse>{
        private String chatroomId;
        private String chatroomName;
        private ChatResponse chat;
        private List<User> userList;

        @Override
        public int compareTo(ChatroomResponse other) {
            // 해당 클래스의 비교 로직 추가 (예: chatroomId 기준으로 비교)
            return this.chatroomId.compareTo(other.chatroomId);
        }

        @Getter
        @AllArgsConstructor
        public static class ChatResponse implements Comparable<ChatResponse>{
            private String senderId;
            private String senderName;
            private String latestContent;
//            @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm", timezone = "Asia/Seoul")
            @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
            private LocalDateTime latestTime;

            @Override
            public int compareTo(ChatResponse other) {
                // latestTime을 기준으로 내림차순 정렬
                return other.getLatestTime().compareTo(this.latestTime);
            }
        }
    }
}
