package com.ssafy.tripservice.db.repository;

import com.ssafy.tripservice.db.entity.Plan;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

// MongoRepository는 이미 리포지토리 빈으로 등록되어 있기에 @Repository 추가할 필요없음
public interface PlanRepository extends MongoRepository<Plan, UUID>, QuerydslPredicateExecutor<Plan> {

}
