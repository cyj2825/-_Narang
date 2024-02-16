package com.ssafy.userservice.api.oauth2.exception;


public class InvalidTokenException extends ApiException {
    public InvalidTokenException() {
        super(AuthErrorCode.INVALID_TOKEN);
    }
}