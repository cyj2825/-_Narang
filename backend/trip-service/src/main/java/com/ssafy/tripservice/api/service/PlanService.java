package com.ssafy.tripservice.api.service;


import com.ssafy.tripservice.api.request.PlanModifyRequest;
import com.ssafy.tripservice.api.request.PlanRequest;
import com.ssafy.tripservice.api.response.PlanResponse;
import com.ssafy.tripservice.api.response.TripResponse;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PlanService {
    Optional<PlanResponse> createPlan(PlanRequest planRequest);
    Optional<PlanResponse> modifyPlan(PlanModifyRequest planModifyRequest);
    Optional<PlanResponse> getPlanById(UUID planId);
    boolean deletePlan(UUID planId);
    List<PlanResponse> getPlansByOwner(UUID userId);
}
