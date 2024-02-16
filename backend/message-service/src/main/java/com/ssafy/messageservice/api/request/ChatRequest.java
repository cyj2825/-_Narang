package com.ssafy.messageservice.api.request;

import lombok.*;

import java.time.LocalDateTime;

/**
 * 채팅 생성 API 데이터
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChatRequest {
    private String chatroomId;
    // enter -> 초대했을 경우는 초대되는 사람의 id
    // send -> 채팅을 보내는 경우는 보내는 사람의 id
    private String userId;
    private LocalDateTime sendTime;
    private String content;
}
