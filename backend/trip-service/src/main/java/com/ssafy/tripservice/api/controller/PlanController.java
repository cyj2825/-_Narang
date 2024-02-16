package com.ssafy.tripservice.api.controller;

import com.ssafy.tripservice.api.request.PlanModifyRequest;
import com.ssafy.tripservice.api.request.PlanRequest;
import com.ssafy.tripservice.api.response.PlanResponse;
import com.ssafy.tripservice.api.service.PlanService;
import com.ssafy.tripservice.db.entity.Plan;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/plan")
@AllArgsConstructor
public class PlanController {

    private final PlanService planService;

    @Operation(summary = "Plan ID 로 Plan 개별 조회",
            responses = {
                    @ApiResponse(description = "The Plan",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Plan.class))),
                    @ApiResponse(responseCode = "404", description = "Plan not found")})
    @GetMapping("/plan/{planId}")
    public ResponseEntity<PlanResponse> getPlanByPlanId(@Parameter(description = "plan Id needs to be fetched") @PathVariable UUID planId) {

        Optional<PlanResponse> plan = planService.getPlanById(planId);

        // map : return Empty Optional it t is null
        return plan.map(t -> new ResponseEntity<>(t, HttpStatus.OK))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Plan 생성",
            responses = {
                    @ApiResponse(description = "The Plan Created",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Plan.class))),
                    @ApiResponse(responseCode = "400", description = "Plan Not Created")})
    @PostMapping(value = "/create")
    public ResponseEntity<?> postPlan(@RequestBody PlanRequest planRequest) {

        Optional<PlanResponse> createRes = planService.createPlan(planRequest);

        return createRes.map(r -> new ResponseEntity<>(r, HttpStatus.OK))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @Operation(summary = "Plan 수정",
            responses = {
                    @ApiResponse(description = "The Plan Modified",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Plan.class))),
                    @ApiResponse(responseCode = "400", description = "Plan Not Modified")})
    @PostMapping(value = "/update")
    public ResponseEntity<?> patchPlan(@RequestBody PlanModifyRequest planModifyRequest) {

        Optional<PlanResponse> modifiedRes = planService.modifyPlan(planModifyRequest);

        return  modifiedRes.isPresent() ?
                ResponseEntity.ok(modifiedRes.get()) : ResponseEntity.badRequest().build();
    }

    @Operation(summary = "Plan 삭제",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Deleted Plan Successfully"),
                    @ApiResponse(responseCode = "404", description = "Plan Deletion Failed")})
    @DeleteMapping("/plan/{planId}")
    public ResponseEntity<Void> deleteTrip(@PathVariable UUID planId) {
        return planService.deletePlan(planId) ?
                ResponseEntity.ok().build() : ResponseEntity. badRequest().build();
    }

    @Operation(summary = "User ID 로 Plan 조회",
            responses = {
                    @ApiResponse(description = "My Plan List",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Plan.class))),
                    @ApiResponse(responseCode = "404", description = "Plans not found")})
    @GetMapping("/my/{userId}")
    public ResponseEntity<List<PlanResponse>> getPlansByUserId(@Parameter(description = "User Id needs to be fetched") @PathVariable UUID userId) {

        List<PlanResponse> plans = planService.getPlansByOwner(userId);

        return ResponseEntity.ok().body(plans);
    }
}
