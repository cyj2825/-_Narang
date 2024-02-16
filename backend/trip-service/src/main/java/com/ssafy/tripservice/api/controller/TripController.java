package com.ssafy.tripservice.api.controller;

import com.amazonaws.services.s3.AmazonS3Client;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.ssafy.tripservice.api.request.*;
import com.ssafy.tripservice.api.response.TripPageResponse;
import com.ssafy.tripservice.api.response.TripRefundResponse;
import com.ssafy.tripservice.api.response.TripResponse;
import com.ssafy.tripservice.api.response.TripSimpleResponse;
import com.ssafy.tripservice.api.service.TripService;
import com.ssafy.tripservice.db.entity.Trip;
import com.ssafy.tripservice.exception.TripAlreadyJoinException;
import com.ssafy.tripservice.exception.TripNotFoundException;
import com.ssafy.tripservice.exception.TripTimeExceedException;
import com.ssafy.tripservice.exception.TripsizeFullException;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Encoding;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.AllArgsConstructor;
import org.apache.coyote.BadRequestException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/trip")
@AllArgsConstructor
public class TripController {

    private final AmazonS3Client amazonS3Client;
    private final TripService tripService;

    @Operation(summary = "Trip ID 로 TRIP 개별 조회",
            responses = {
                    @ApiResponse(description = "The Trip",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Trip.class))),
                    @ApiResponse(responseCode = "404", description = "Trip not found")})
    @GetMapping("/trip/{tripId}")
    public ResponseEntity<TripResponse> getTripByTripId(@Parameter(description = "trip Id needs to be fetched") @PathVariable UUID tripId) {

        Optional<TripResponse> trip =tripService.getTripById(tripId);

        // map : return Empty Optional it t is null
        return trip.map(t -> new ResponseEntity<>(t, HttpStatus.OK))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Trip 생성",
            responses = {
                    @ApiResponse(description = "The Trip Created",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Trip.class))),
                    @ApiResponse(responseCode = "400", description = "Trip Not Created")})
    @PostMapping(value = "/create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @io.swagger.v3.oas.annotations.parameters.RequestBody (content = @Content(encoding = @Encoding(name = "tripRequest", contentType = MediaType.APPLICATION_JSON_VALUE)))
    public ResponseEntity<?> postTrip(@RequestPart TripRequest tripRequest,
                                      @RequestPart(required = false) MultipartFile tripImg) {

        Optional<TripResponse> createRes = tripService.createTrip(tripRequest, tripImg);

        return createRes.map(r -> new ResponseEntity<>(r, HttpStatus.OK))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @Operation(summary = "Trip 수정",
            responses = {
                    @ApiResponse(description = "The Trip Modified",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Trip.class))),
                    @ApiResponse(responseCode = "400", description = "Trip Not Modified")})
    @PatchMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @io.swagger.v3.oas.annotations.parameters.RequestBody (content = @Content(encoding = @Encoding(name = "tripModifyRequest", contentType = MediaType.APPLICATION_JSON_VALUE)))
    public ResponseEntity<?> patchTrip(@RequestPart TripModifyRequest tripModifyRequest,
                                      @RequestPart(required = false) MultipartFile tripImg) {

        Optional<TripResponse> modifiedRes = tripService.modifyTrip(tripModifyRequest, tripImg);

        return  modifiedRes.isPresent() ?
                ResponseEntity.ok(modifiedRes.get()) : ResponseEntity.badRequest().build();
    }

    @Operation(summary = "Trip 가입",
            responses = {
                    @ApiResponse(description = "The Trip You Joined",
                            content = @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Trip.class))),
                    @ApiResponse(responseCode = "400", description = "User Not Joined")})
    @PatchMapping("/trip/join")
    public ResponseEntity<?> patchTripJoin(@RequestBody UserRequest userRequest) {
        ;
        Optional<TripResponse> joinRes = tripService.joinTrip(userRequest);

        return joinRes.map(j -> new ResponseEntity<>(j, HttpStatus.OK))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @Operation(summary = "Trip 탈퇴",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User Canceled Successfully"),
                    @ApiResponse(responseCode = "400", description = "User Not Canceled")})
    @PatchMapping("/trip/leave")
    public ResponseEntity<TripRefundResponse> patchTripLeave(@RequestBody UserRequest userRequest) {

        Optional<TripRefundResponse>  response = tripService.leaveTrip(userRequest);

        return response.map(tripRefundResponse -> ResponseEntity.ok().body(tripRefundResponse))
                .orElseGet(() -> ResponseEntity.badRequest().build());
    }

    @Operation(summary = "참여 거절",
            responses = { @ApiResponse(responseCode = "200", description = "User Rejected Successfully")})
    @PostMapping("/trip/reject")
    public ResponseEntity<?> rejectTripJoinRequest(@RequestBody UserRejectRequest request) {

        boolean res = tripService.rejectTripJoinRequest(request);

        return res ? ResponseEntity.ok().build() : ResponseEntity.badRequest().build();
    }

    /*
        Just For Test

     */
    
    @PostMapping(value = "/imgUploadTest", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<String> uploadFile(@RequestParam("img") MultipartFile img) {

        String bucket="youngkimi-bucket-01";

        try {
            String fileName = img.getOriginalFilename();
            String fileUrl = "https://" + bucket + "/test" + fileName;
            ObjectMetadata metadata = new ObjectMetadata();
            metadata.setContentType(img.getContentType());
            metadata.setContentLength(img.getSize());
            amazonS3Client.putObject(bucket, fileName, img.getInputStream(), metadata);
            return ResponseEntity.ok(fileUrl);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Trip 삭제",
            responses = {
                    @ApiResponse(responseCode = "200", description = "User Deleted Trip Successfully"),
                    @ApiResponse(responseCode = "404", description = "Trip Deletion Failed")})
    @DeleteMapping("/trip")
    public ResponseEntity<Void> deleteTrip(@RequestBody UserRequest userRequest) {
        return tripService.deleteTrip(userRequest) ?
                ResponseEntity.ok().build() : ResponseEntity. badRequest().build();
    }

    @Operation(summary = "참여 가능한 Trip Pages 조회",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Trips You Can Join")})
    @PostMapping("/page/available")
    public ResponseEntity<Page<TripPageResponse>> getAvailableTrips(@RequestBody TripQueryRequest tripQueryRequest) {
        return new ResponseEntity<>(tripService.getTripsIWant(tripQueryRequest), HttpStatus.OK);
    }

    @Operation(summary = "배너용 Trips",
            responses = {
                    @ApiResponse(responseCode = "200", description = "Trips For Banner")})
    @GetMapping("/trips/banner")
    public ResponseEntity<List<TripResponse>> getBannerTrips(
            @RequestParam("tripConcept") String tripConcept) {
        System.out.println(tripConcept);

        return ResponseEntity.ok(tripService.getBannerTrips(tripConcept));
    }

    @DeleteMapping("/user")
    public ResponseEntity<Long> deleteUserTrips (
            @RequestParam("userId") UUID userId) {
        System.out.println(userId);

        return ResponseEntity.ok(tripService.eraseWithdrawalUser(userId));
    }

    @Operation(summary = "나의 여행 조회 (기간)",
            description = "name = userId, pageNo, querySttDate(optional), queryEndDate(optional)",
            responses = {@ApiResponse(responseCode = "200", description = "User Get Trip Successfully")})
    @PostMapping("/trips")
    public ResponseEntity<Page<TripPageResponse>> getTripsIveBeen(
            @RequestBody TripQueryRequest tripQueryRequest) {
        System.out.println(tripQueryRequest);
        return ResponseEntity.ok(tripService.getTripsIveBeen(tripQueryRequest));
    }

    @Operation(summary = "내가 리더인 여행",
            parameters = { @Parameter (name = "tripQueryRequest", description = "userId, pageNo") },
            responses = { @ApiResponse(responseCode = "200", description = "User Get Trip Successfully")})
    @PostMapping("/recruit")
    public ResponseEntity<Page<TripPageResponse>> getTripsIveOwn(
            @RequestBody TripQueryRequest tripQueryRequest) {
        return ResponseEntity.ok(tripService.getTripsIveOwn(tripQueryRequest));
    }

    @ExceptionHandler(TripNotFoundException.class)
    public ResponseEntity<String> handleTripNotFoundException(TripNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(exception.getMessage());
    }

    @ExceptionHandler({TripsizeFullException.class, TripTimeExceedException.class, TripAlreadyJoinException.class})
    public ResponseEntity<String> handleUnavailableTripException(RuntimeException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(exception.getMessage());
    }
}
