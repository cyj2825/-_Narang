package com.ssafy.messageservice.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class ChatroomRequest {
    private String chatroomName;
    private String userId;
}
