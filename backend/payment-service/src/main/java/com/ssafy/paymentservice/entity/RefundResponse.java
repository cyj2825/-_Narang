package com.ssafy.paymentservice.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class RefundResponse {
    private int refundPrice;
    private String message;
}