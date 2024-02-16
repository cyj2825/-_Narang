package com.ssafy.messageservice.api.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AlertSendListResponse {
    private List<AlertSendResponse> alertList;

    @Getter
    @Setter
    @AllArgsConstructor
    public static class AlertSendResponse{
        private String id;
        private String tripId;
        private String tripName;
        private String receiverId;
        private String receiverName;
        private String position;
        private String aspiration;
        private String alertType;
        private boolean isRead;
        private String usageId;
    }
}