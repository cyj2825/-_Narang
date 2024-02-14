package com.ssafy.paymentservice.db.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.*;

import java.util.UUID;

@Getter
@MappedSuperclass
public class BaseEntity {

    @Id @GeneratedValue
    private String id;

    public BaseEntity() {
        id = UUID.randomUUID().toString();
    }
}
