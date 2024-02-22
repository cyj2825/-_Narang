package com.ssafy.userservice.api.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Builder
@Getter @Setter
public class UserDeleteRequest {
    UUID userId;
}
