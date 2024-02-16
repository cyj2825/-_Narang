package com.ssafy.messageservice.db.repository;

import com.ssafy.messageservice.db.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findById(String id);
    List<User> findAllByIdIn(List<String> userIds);
}
