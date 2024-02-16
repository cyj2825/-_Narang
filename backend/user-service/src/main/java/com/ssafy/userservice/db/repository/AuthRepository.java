package com.ssafy.userservice.db.repository;

import com.ssafy.userservice.db.entity.Auth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthRepository extends JpaRepository<Auth, String> {
    Optional<Auth> findById(String id);
    Optional<Auth> findByRefreshToken(String refreshToken);
}
