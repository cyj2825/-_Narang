package com.ssafy.paymentservice.db.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

@Getter
@MappedSuperclass
public class BaseEntity {

    @Id
    private String id;
    public BaseEntity() {
        id = UUID.randomUUID().toString();
    }
}
