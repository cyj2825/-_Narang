package com.ssafy.paymentservice.db.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
public class UserMileage extends BaseEntity {

    private String userId;
    private String encryptedMileage;

    public UserMileage() {
        super();
    }

    @Builder
    public UserMileage(String userId, String encryptedMileage) {
        super();
        this.userId = userId;
        this.encryptedMileage = encryptedMileage;
    }
}