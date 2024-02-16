package com.ssafy.tripservice.api.request;

import com.ssafy.tripservice.db.entity.Trip;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Builder
@ToString
public class TripRequest {
    private UUID tripId;
    private String tripName;
    private String tripDesc;
    private String tripImgUrl;
    private LocalDateTime recruitDate;
    private String continent;
    private String country;
    private String city;
    private LocalDate departureDate;
    private LocalDate returnDate;
    private UUID tripLeaderId;
    private UUID tripChatId;
    private UUID tripPlanId;
    private Integer viewCnt;
    private Integer tripParticipantsSize;
    private Integer tripDeposit;
    private Integer tripAgeUpperBound;
    private Integer tripAgeLowerBound;
    private List<String> leaderRoles;
    private String tripConcept;
    private List<String> tripRoles;
    private List<Trip.Participant> participants;

    public Trip toEntity() {
        return Trip.builder()
                .tripName(this.tripName)
                .tripDesc(this.tripDesc)
                .tripImgUrl(this.tripImgUrl)
                .recruitDate(LocalDateTime.now())
                .continent(this.continent)
                .country(this.country)
                .city(this.city)
                .departureDate(this.departureDate)
                .returnDate(this.returnDate)
                .tripLeaderId(this.tripLeaderId)
                .tripChatId(this.tripChatId)
                .tripPlanId(this.tripPlanId)
                .viewCnt(this.viewCnt)
                .tripParticipantsSize(this.tripParticipantsSize)
                .tripDeposit(this.tripDeposit)
                .tripAgeUpperBound(this.tripAgeUpperBound)
                .tripAgeLowerBound(this.tripAgeLowerBound)
                .tripConcept(this.tripConcept)
                .tripRoles(this.tripRoles)
                .participants(this.participants)
                .build();
    }
}
