package com.ssafy.tripservice.api.request;

import com.ssafy.tripservice.db.entity.Plan;
import lombok.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter @Setter
@ToString @RequiredArgsConstructor
public class PlanModifyRequest {
    private UUID planId;
    private String planName;
    private String planDesc;
    private LocalDate lastModifiedDate;
    private List<UUID> participantIds;
    private String planInfo;
}
