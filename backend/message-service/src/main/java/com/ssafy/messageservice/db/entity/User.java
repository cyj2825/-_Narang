package com.ssafy.messageservice.db.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class User extends BaseEntity{
    @Column(name = "nickname")
    private String nickname;
}


