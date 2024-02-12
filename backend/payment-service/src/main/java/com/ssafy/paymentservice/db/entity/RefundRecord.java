package com.ssafy.paymentservice.db.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@Getter
//@Setter
public class RefundRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column
    private String userId;
    @Column
    private int price;
    @Column
    private int balance; // 사용 후 잔액
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime regDate; // 요청 시간
    @Builder
    public RefundRecord(String userId, int price, int balance){
        this.userId = userId;
        this.price = price;
        this.balance = balance;
        this.regDate = LocalDateTime.now();
    }
}
