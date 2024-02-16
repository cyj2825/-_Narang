package com.ssafy.tripservice.api.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

@Getter
@Setter
@Builder
@ToString
public class UserRejectRequest {
    private UUID tripId;
    private UUID userId;
    private String usageId;
    private String alertId;
}