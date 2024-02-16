package com.ssafy.tripservice.api.request;

import com.ssafy.tripservice.db.entity.Plan;
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
public class PlanRequest {
    private UUID planId;
    private String planName;
    private String planDesc;
    private LocalDate lastModifiedDate;
    private UUID ownerId;
    private List<UUID> participantIds;
    private String planInfo;

    public Plan toEntity() {
        return Plan.builder()
                .planName(this.planName)
                .planDesc(this.planDesc)
                .lastModifiedDate(this.lastModifiedDate)
                .ownerId(this.ownerId)
                .participantIds(this.participantIds)
                .planInfo(this.planInfo)
                .build();
    }
}
