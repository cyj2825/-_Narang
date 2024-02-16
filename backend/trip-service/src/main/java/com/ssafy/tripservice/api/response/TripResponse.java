package com.ssafy.tripservice.api.response;

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
public class TripResponse {

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
    private String tripConcept;
    private List<String> tripRoles;
    private List<Trip.Participant> participants;
}
