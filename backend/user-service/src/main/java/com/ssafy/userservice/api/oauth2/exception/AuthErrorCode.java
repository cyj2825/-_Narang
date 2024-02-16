package com.ssafy.userservice.api.oauth2.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum AuthErrorCode implements ErrorCode {

    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED, "Invalid credentials"),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "Expired token"),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "Invalid Token"),
    AUTH_NOT_FOUND(HttpStatus.NOT_FOUND, "Authentication information not found"),
    INVALID_SOCIAL_TYPE(HttpStatus.BAD_REQUEST, "Invalid Social Type"),
    ;

    private final HttpStatus httpStatus;
    private final String message;
}
