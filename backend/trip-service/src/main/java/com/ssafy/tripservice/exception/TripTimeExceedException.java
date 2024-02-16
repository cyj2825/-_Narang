package com.ssafy.tripservice.exception;

import java.util.NoSuchElementException;

public class TripTimeExceedException extends RuntimeException {
    public TripTimeExceedException() {
        super("신청을 수락할 수 없습니다.");
    }
}
