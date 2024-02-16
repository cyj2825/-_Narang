package com.ssafy.tripservice.api.response;

import com.ssafy.tripservice.db.entity.Trip;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@ToString
public class PlanResponse {
    private UUID planId;
    private String planName;
    private String planDesc;
    private LocalDate lastModifiedDate;
    private UUID ownerId;
    private List<UUID> participantIds;
    private String planInfo;
}
