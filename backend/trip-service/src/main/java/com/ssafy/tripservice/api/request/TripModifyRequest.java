package com.ssafy.tripservice.api.request;

import com.ssafy.tripservice.db.entity.Trip;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter @Setter
@ToString @RequiredArgsConstructor
public class TripModifyRequest {
    private UUID tripId;
    private String tripName;
    private String tripDesc;
}
