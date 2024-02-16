package com.ssafy.messageservice.db.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="Alert")
public class Alert {
    @Id
    @Column(length = 100)
    private String id;

    @Column(length = 50)
    private String tripId;

    @Column(length = 200)
    private String tripName;

    @Column(length = 50)
    private String senderId;

    @Column(length = 50)
    private String receiverId;

    @Column
    private String position;

    @Column
    private String aspiration;

    @Column(length = 50)
    private String alertType;

    @Column
    private boolean isRead;

    @Column
    private String usageId;
}