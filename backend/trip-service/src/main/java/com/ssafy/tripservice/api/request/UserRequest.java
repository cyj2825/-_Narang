package com.ssafy.tripservice.api.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.lang.reflect.Array;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@ToString
public class UserRequest {
    private UUID tripId;
    private UUID userId;
    private String alertId;
    private String usageId;
    private List<String> userRoles;
}