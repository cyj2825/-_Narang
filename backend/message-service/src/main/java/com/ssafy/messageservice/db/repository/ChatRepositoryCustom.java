package com.ssafy.messageservice.db.repository;

import com.ssafy.messageservice.api.response.ChatroomListResponse;

public interface ChatRepositoryCustom{
    ChatroomListResponse getLatestChatsByUserId(String userId);
}
