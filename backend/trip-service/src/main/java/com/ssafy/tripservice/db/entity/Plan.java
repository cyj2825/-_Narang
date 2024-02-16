package com.ssafy.tripservice.db.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.ssafy.tripservice.api.response.PlanResponse;
import jakarta.persistence.Entity;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter @Entity @Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "narang-plan")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Plan extends BaseEntity {
    private String planName;
    private String planDesc;
    private LocalDate lastModifiedDate;
    private UUID ownerId;
    private List<UUID> participantIds;
    private String planInfo;

    public PlanResponse toPlanResponse(){
        return PlanResponse.builder()
                .planId(this.get_id())
                .planName(this.planName)
                .planDesc(this.planDesc)
                .lastModifiedDate(this.lastModifiedDate)
                .ownerId(this.ownerId)
                .participantIds(this.participantIds)
                .planInfo(this.planInfo)
                .build();
    }
}
