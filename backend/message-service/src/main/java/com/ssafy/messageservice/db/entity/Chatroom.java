package com.ssafy.messageservice.db.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@Builder
@Table(name="Chatroom")
@Entity
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Chatroom {
    @Id
    @Column(length = 50)
    private String chatroomId;

    @Column(length = 40)
    private String chatroomName;

    public static Chatroom create(String name) {
        Chatroom room = new Chatroom();
        room.chatroomId = UUID.randomUUID().toString();
        room.chatroomName = name;
        return room;
    }
}
