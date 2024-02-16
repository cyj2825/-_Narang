package com.ssafy.paymentservice.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ExceptionCode {
    PAY_CANCEL("1000", "Pay Cancel", HttpStatus.BAD_REQUEST),
    PAY_FAILED("2000", "Pay Failed", HttpStatus.BAD_REQUEST),
    PAY_NO_MONEY("3000", "잔액 부족입니다.", HttpStatus.FORBIDDEN);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ExceptionCode(final String code, final String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}