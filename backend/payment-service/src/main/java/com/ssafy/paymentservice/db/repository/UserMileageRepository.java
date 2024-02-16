package com.ssafy.paymentservice.db.repository;

import com.ssafy.paymentservice.db.entity.UserMileage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserMileageRepository extends JpaRepository<UserMileage, String> {
    Optional<UserMileage> findByUserId(String userId);
}
