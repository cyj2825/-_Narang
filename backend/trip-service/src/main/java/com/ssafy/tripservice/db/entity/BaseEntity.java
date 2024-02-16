package com.ssafy.tripservice.db.entity;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.*;

import java.util.UUID;

@Getter
@MappedSuperclass
public class BaseEntity {

    @Id @GeneratedValue
    private UUID _id;

    public BaseEntity() {
        _id = UUID.randomUUID();
    }
}
