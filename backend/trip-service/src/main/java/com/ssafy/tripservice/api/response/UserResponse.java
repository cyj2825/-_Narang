package com.ssafy.tripservice.api.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class UserResponse {
    private UUID tripID;
    private UUID userId;
    private List<String> userRoles;
    private LocalDateTime enrollmentDate;
}
