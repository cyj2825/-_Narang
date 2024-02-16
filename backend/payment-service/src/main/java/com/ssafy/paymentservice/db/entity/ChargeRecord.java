package com.ssafy.paymentservice.db.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class ChargeRecord {
    @Id
    private String aid; // 요청 고유 번호
    @Column
    private String tid; // 결제 고유 번호
    @Column
    private String user_id;
    @Column
    private String payment_method_type; // 결제 수단
    @Column
    private int price;
    @Column
    private int balance; // 충전 후 잔액
    @Column
    private String created_at; // 요청 시간
    @Column
    private String approved_at; // 승인 시간
    @Builder
    public ChargeRecord(String aid, String tid, String user_id, String payment_method_type, int price, String created_at, String approved_at){
        this.aid = aid;
        this.tid = tid;
        this.user_id = user_id;
        this.payment_method_type = payment_method_type;
        this.price = price;
        this.created_at = created_at;
        this.approved_at = approved_at;
    }
}
