package com.ssafy.messageservice.db.repository;

import com.ssafy.messageservice.db.entity.ChatroomUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChatroomUserRepository extends JpaRepository<ChatroomUser, String> {
    @Query("SELECT cu.userId FROM ChatroomUser cu WHERE cu.chatroom.chatroomId = :chatroomId")
    List<String> findUserIdsByChatroomId(@Param("chatroomId") String chatroomId);


    @Modifying
    @Transactional
    @Query("DELETE FROM ChatroomUser cu WHERE cu.chatroom.chatroomId = :chatroomId AND cu.userId = :userId")
    void deleteChatroomUserByChatroomAndUserId(@Param("chatroomId") String chatroomId, @Param("userId") String userId);
}
