package com.ssafy.userservice.db.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Auth extends BaseEntity {
    @Column
    private String password;
    @Column(length = 40)
    private String email;
    @Column(length = 20)
    private String name;
    @Column
    private String provider;
    @Column
    private String providerId;
    @Column
    @Enumerated(EnumType.STRING)
    private Authority authority;
    @Column
    private String refreshToken;

    public void passwordEncode(PasswordEncoder passwordEncoder) {
        this.password = passwordEncoder.encode(this.password);
    }

    public void updateRefreshToken(String updateRefreshToken) {
        this.refreshToken = updateRefreshToken;
    }

    @Builder
    public Auth(String id, String password, String email, String name, String provider, String providerId, Authority authority, String refreshToken){
        super.setId(id);
        this.password = password;
        this.email = email;
        this.name = name;
        this.provider = provider;
        this.providerId = providerId;
        this.authority = authority;
        this.refreshToken = refreshToken;
    }
}
