# Dockerfile

# 사용할 기본 이미지를 선택합니다.
FROM openjdk:17-alpine

# 작업 디렉토리를 지정합니다.
ARG JAR_FILE=./backend/trip-service/build/libs/trip-service-0.0.1-SNAPSHOT.jar

# 호스트의 JAR 파일을 컨테이너의 작업 디렉토리로 복사합니다.
COPY ${JAR_FILE} ./trip-service.jar

# 컨테이너에서 수행될 명령어를 지정합니다.
ENTRYPOINT ["java","-jar", "trip-service.jar"]