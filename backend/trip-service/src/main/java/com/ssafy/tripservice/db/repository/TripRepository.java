package com.ssafy.tripservice.db.repository;

import com.ssafy.tripservice.api.request.UserRequest;
import com.ssafy.tripservice.db.entity.QTrip;
import com.ssafy.tripservice.db.entity.Trip;
import org.springframework.data.domain.Example;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.data.repository.query.FluentQuery;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

// MongoRepository는 이미 리포지토리 빈으로 등록되어 있기에 @Repository 추가할 필요없음
public interface TripRepository extends MongoRepository<Trip, UUID>, QuerydslPredicateExecutor<Trip> {

}
