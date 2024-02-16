package com.ssafy.messageservice.db.repository;

import com.ssafy.messageservice.db.entity.Chat;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// 해당 파일에서는 CRUD만 처리
public interface ChatRepository extends JpaRepository<Chat, String>, ChatRepositoryCustom {
    // 특정 채팅방의 최신 메시지를 기준으로 페이징된 채팅 목록을 가져오는 메서드
    Page<Chat> findByChatroomChatroomIdOrderBySendTimeDesc(String chatroomId, Pageable pageable);
    List<String> findUserIdsByChatroom_ChatroomId(String chatroomId);
}
