package com.ssafy.tripservice.exception;

import org.apache.coyote.BadRequestException;

import java.util.NoSuchElementException;


public class TripAlreadyJoinException extends NoSuchElementException {
    public TripAlreadyJoinException() {
        super("이미 참여한 여행입니다.");
    }
}
