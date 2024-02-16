package com.ssafy.messageservice.db.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Builder
@Table(name="ChatroomUser")
@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatroomUser {
    @Id
    @Column(length = 50)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chatroomId", referencedColumnName = "chatroomId")
    private Chatroom chatroom;

    @Column(length = 50)
    private String userId;
}
