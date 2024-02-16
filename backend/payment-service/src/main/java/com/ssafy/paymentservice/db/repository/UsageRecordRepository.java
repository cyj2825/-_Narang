package com.ssafy.paymentservice.db.repository;

import com.ssafy.paymentservice.db.entity.UsageRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UsageRecordRepository extends JpaRepository<UsageRecord, String> {

}
