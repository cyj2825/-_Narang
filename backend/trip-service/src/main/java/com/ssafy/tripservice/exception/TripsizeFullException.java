package com.ssafy.tripservice.exception;

import java.util.NoSuchElementException;

public class TripsizeFullException extends RuntimeException {
    public TripsizeFullException() {
        super("이미 참여자를 모두 모집했습니다.");
    }
}
