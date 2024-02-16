package com.ssafy.messageservice.db.repository;

import com.ssafy.messageservice.db.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, String> {
    List<Alert> findByReceiverId(String receiverId);
    List<Alert> findBySenderId(String senderId);
    boolean existsByTripIdAndSenderId(String tripId, String senderId);
    List<Alert> findByTripIdAndAlertType(String tripId, String alertType);
}