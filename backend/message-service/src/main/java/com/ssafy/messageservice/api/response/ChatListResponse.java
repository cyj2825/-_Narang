package com.ssafy.messageservice.api.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 채팅 리스트 API 데이터
 */
@Getter
@Setter
@AllArgsConstructor
public class ChatListResponse {
    private List<ChatsResponse> chatList;

    private PageResponse page;

    private boolean last;          // 마지막 페이지 여부
    private int totalPages;        // 전체 페이지 수
    private long totalElements;    // 전체 항목 수
    private boolean first;         // 첫번째 페이지 여부
    private int numberOfElements;  // 현재 페이지에 표시된 항목의 수

    @Getter
    @AllArgsConstructor
    public static class ChatsResponse {
        private String chatId;
        private String chatroomId;
        private String content;
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm")
        private LocalDateTime sendTime;
        private String userId;
        private String userName;
    }

    @Getter
    @AllArgsConstructor
    public static class PageResponse {
        private int pageNumber;       // 현재 페이지 번호
        private int pageSize;         // 페이지 크기
        private int offset;           // 현재 페이지의 첫번째 항목의 인덱스 (pageNumber * pageSize)
    }
}
