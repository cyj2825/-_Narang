package com.ssafy.tripservice.db.entity;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.persistence.Entity;
import lombok.*;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Getter @Entity @Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "narang-plan")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Plan extends BaseEntity {
    private String planName;
    private LocalDateTime lastModifiedDate;
    private List<DailyPlan> dailyPlans;

    @Builder
    @Data
    public static class DailyPlan {
        private String placeId;
        private String placeName;
        private String imageUrl;
        private LocalDateTime startDate;
        private LocalDateTime endDate;
    }

    @Builder
    @Data
    public static class Destination {
        private Double latitude;
        private Double longitude;

        private String destinationName;
        private LocalDateTime sttTime;
        private LocalDateTime endDate;
    }
}
