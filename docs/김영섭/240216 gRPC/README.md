## gRPC 사용 가이드

#### gRPC interface dependency 관련

```
buildscript {
    ext {
        protobufVersion = '3.14.0'
        protobufPluginVersion = '0.9.4'
        grpcVersion = '1.35.0'
    }
}

plugins {
    id 'java'
    id 'com.google.protobuf' version "${protobufPluginVersion}"
}

group 'org.example'
version '1.0-SNAPSHOT'

repositories {
    mavenCentral()
}

dependencies {
    implementation "io.grpc:grpc-protobuf:${grpcVersion}"
    implementation "io.grpc:grpc-stub:${grpcVersion}"
    compileOnly 'jakarta.annotation:jakarta.annotation-api:1.3.5' // Java 9+ compatibility - Do NOT update to 2.0.0
}

protobuf {
    protoc {
        artifact = "com.google.protobuf:protoc:${protobufVersion}"
    }
    generatedFilesBaseDir = "$projectDir/src/generated"
    clean {
        delete generatedFilesBaseDir
    }
    plugins {
        grpc {
            artifact = "io.grpc:protoc-gen-grpc-java:${grpcVersion}"
        }
    }
    generateProtoTasks {
        all()*.plugins {
            grpc{}
        }
    }
}

test {
    useJUnitPlatform()
}
```

#### .proto 관련

본 파일에서 사용한 .proto는 다음과 같다.

service는 메서드의 이름과 request struct, response struct를, message는 해당 struct의 구조를 서술한다.
해당 .proto는 다른 언어로 작성된 서버도 공통적으로 사용하여 다른 언어로 작성된 서버의 자원도 가져와 사용할 수 있도록 한다.

```
syntax = "proto3";

option java_multiple_files = true;
option java_package = "org.narang.lib";
option java_outer_classname = "NarangProto";

service Narang {
  rpc postChatRoom (ChatGrpcRequest) returns (ChatGrpcResponse) {
  }

  rpc tripUseMileage (TripMileageUsageRequest) returns (TripMileageUsageResponse) {
  }

  rpc getTripById (TripGrpcRequest) returns (TripGrpcResponse) {
  }

  rpc acceptJoinRequestType (AlertPatchGrpcRequest) returns (AlertPatchGrpcResponse) {
  }

  rpc rejectJoinRequestType (AlertPatchGrpcRequest) returns (AlertPatchGrpcResponse) {
  }

  rpc joinIntoChatroom (ChatroomUserPatchGrpcRequest) returns (ChatroomUserPatchGrpcResponse) {
  }

  rpc exileFromChatroom (ChatroomUserPatchGrpcRequest) returns (ChatroomUserPatchGrpcResponse) {
  }

  rpc cancelPaymentRecord (PaymentRefundGrpcRequest) returns (PaymentRefundGrpcResponse) {
  }

  rpc refundPaymentRecord (PaymentRefundGrpcRequest) returns (PaymentRefundGrpcResponse) {
  }
}

message ChatGrpcRequest {
  string chatroomName = 1;
  string userId = 2;
}

message ChatGrpcResponse {
  string chatroomId = 1;
}

message TripMileageUsageRequest {
  string user_id = 1;
  int32 price = 2;
}

message TripMileageUsageResponse {
  string record_id = 1;
  string user_id = 2;
  int32 price = 3;
  int32 balance = 4;
}


message TripGrpcRequest {
  string tripId = 1;
}

message TripGrpcResponse {
  string tripId = 1;
  string tripLeaderId = 2;
  string tripChatId = 3;
  string tripPlanId = 4;
  int32 tripApplicantsSize = 5;
  int32 tripParticipantsSize = 6;
  int32 tripDeposit = 7;
}

message PaymentRefundGrpcRequest {
  string usageId = 1;
  string tripId = 2;
  string departureDate = 3;
}

message PaymentRefundGrpcResponse {
  bool result = 1;
  int32 refundPrice = 2;
  string message = 3;
}

message AlertPatchGrpcRequest {
  string alertId = 1;
  string alertType = 2;
}

message AlertPatchGrpcResponse {
  bool result = 1;
}

message ChatroomUserPatchGrpcRequest {
  string chatroomId = 1;
  string userId = 2;
}

message ChatroomUserPatchGrpcResponse {
  bool result = 1;
}
```

Spring 에서는 해당 .proto를 빌드한 jar를 프로젝트 내부 '/libs/' 경로에 두었다.

이를 통해 Spring에서 Proto에 정의된 메서드를 실제 구현하거나 사용할 수 있다.

구현은 Implbase를 extends 하여 작성하면 된다.

사용은 아래와 같이

```
@GrpcClient("message-service")
    private NarangGrpc.NarangBlockingStub chatBlockingStub;
```

yml에 등록한 server를 stub과 매핑하면 해당 메서드를 사용할 수 있다.

#### Spring dependencies

```
implementation 'net.devh:grpc-client-spring-boot-starter:2.15.0.RELEASE'
implementation 'net.devh:grpc-server-spring-boot-starter:2.15.0.RELEASE'
implementation files('libs/GrpcNarangInterface-1.0-SNAPSHOT.jar')
```

다음과 같이 grpc client / server 등록을 위한 dependency와
Interface를 빌드한 jar 파일을 impl 해주었다.

#### Spring yml 관련

아래와 같이 등록한다.
client로 타 서비스에 client로서 등록하고
server로 메서드를 제공한다.

```
grpc:
  client:
    payment-service:
      address: 'static://payment-service:9099' # Server Address
      negotiation-type: plaintext
      enableKeepAlive: true
      keepAliveWithoutCalls: true
    message-service:
      address: 'static://message-service:9099' # Server Address
      negotiation-type: plaintext
      enableKeepAlive: true
      keepAliveWithoutCalls: true
  server:
    port: 9099
```

#### 구현 예시

Java는 여러 개를 동시에 extends 할 수 없으므로
Protocol Buffer를 따로 작성해서 둘 경우 각각 extends 해야한다.
근데 @GrpcService를 여러 서비스에 달면 빈 충돌 나므로 유의.  
이번 프로젝트의 경우는 Interface jar 파일은 하나로 관리하였으므로
따로 gRPC 연관 Service 를 작성하였다.

```
@GrpcService @Slf4j
public class GrpcMessageService extends NarangGrpc.NarangImplBase {

    private final AlertService alertService;
    private final ChatService chatService;
    private final ChatroomUserRepository chatroomUserRepository;
    private final ChatroomRepository chatroomRepository;

    @Override
    public void acceptJoinRequestType(AlertPatchGrpcRequest request, StreamObserver<AlertPatchGrpcResponse> responseObserver) {

        ResponseEntity<?> res = alertService.patchAlert(request.getAlertId(), "ACCEPT");

        if (res.getStatusCode().is2xxSuccessful())
            responseObserver.onNext(AlertPatchGrpcResponse.newBuilder().setResult(true).build());
        else
            responseObserver.onNext(AlertPatchGrpcResponse.newBuilder().setResult(false).build());
        responseObserver.onCompleted();
    }

    @Override
    public void rejectJoinRequestType(AlertPatchGrpcRequest request, StreamObserver<AlertPatchGrpcResponse> responseObserver) {
        ResponseEntity<?> res = alertService.patchAlert(request.getAlertId(), "REJECT");

        if (res.getStatusCode().is2xxSuccessful())
            responseObserver.onNext(AlertPatchGrpcResponse.newBuilder().setResult(true).build());
        else
            responseObserver.onNext(AlertPatchGrpcResponse.newBuilder().setResult(false).build());
        responseObserver.onCompleted();
    }

    @Override
    public void joinIntoChatroom(ChatroomUserPatchGrpcRequest request, StreamObserver<ChatroomUserPatchGrpcResponse> responseObserver) {
        Optional<Chatroom> chatroom = chatroomRepository.findById(request.getChatroomId());

        if (chatroom.isEmpty()) {

            Chatroom newRoom = Chatroom.builder()
                    .chatroomId(request.getChatroomId())
                    .chatroomName("나랑 여행 채팅방")
                    .build();

            chatroomRepository.save(newRoom);
        }

        ChatroomUser chatroomUser = ChatroomUser.builder()
                .chatroom(chatroom.get())
                .userId(request.getUserId())
                .id(UUID.randomUUID().toString())
                .build();

        Optional<ChatroomUser> result = Optional.of(chatroomUserRepository.save(chatroomUser));

        responseObserver.onNext(ChatroomUserPatchGrpcResponse.newBuilder().setResult(true).build());
        responseObserver.onCompleted();
    }

    @Override
    public void exileFromChatroom(ChatroomUserPatchGrpcRequest request, StreamObserver<ChatroomUserPatchGrpcResponse> responseObserver) {

        log.info(request.toString());
        chatService.exileFromChatroom(
                ChatroomUserRequest.builder()
                        .chatroomId(request.getChatroomId())
                        .userId(request.getUserId())
                        .build()
        );

        Optional<Chatroom> chatroom = chatroomRepository.findById(request.getChatroomId());

        chatroom.ifPresent(value -> log.info("NOT DELETED : " + value.toString()));

        responseObserver.onNext(ChatroomUserPatchGrpcResponse.newBuilder().setResult(true).build());
        responseObserver.onCompleted();
    }

    @Override
    public void postChatRoom(ChatGrpcRequest request, StreamObserver<ChatGrpcResponse> responseObserver) {

        String chatroomId = chatService.postChatroom(
                ChatroomRequest.builder()
                        .userId(request.getUserId())
                        .chatroomName(request.getChatroomName())
                        .build());

        ChatGrpcResponse response = ChatGrpcResponse.newBuilder()
                .setChatroomId(chatroomId)
                .build();

        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
}

```
