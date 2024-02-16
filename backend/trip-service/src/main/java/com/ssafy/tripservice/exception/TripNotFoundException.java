package com.ssafy.tripservice.exception;

import java.util.NoSuchElementException;

public class TripNotFoundException extends NoSuchElementException {
    public TripNotFoundException() {
        super("여행을 찾을 수 없습니다.");
    }
}
