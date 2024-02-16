package com.ssafy.messageservice.api.request;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChatSendRequest {
    private String chatroomId;
    private String senderId;
    private String content;
}
