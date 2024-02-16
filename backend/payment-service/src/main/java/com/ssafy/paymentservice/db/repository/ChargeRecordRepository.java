package com.ssafy.paymentservice.db.repository;

import com.ssafy.paymentservice.db.entity.ChargeRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChargeRecordRepository extends JpaRepository<ChargeRecord, String> {

}
