package com.ssafy.tripservice.api.response;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Builder
@Setter
@Getter
public class TripRefundResponse {
    int price;
    String message;
    boolean result;
}
