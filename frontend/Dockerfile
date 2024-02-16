FROM nginx:latest

# root에 /app 폴더 생성
RUN mkdir /app

# work dir 고정
WORKDIR /app

# work dir에 build 폴더 생성
RUN mkdir ./build

# host pc의 현재 경로의 build 폴더를 work dir의 build 폴더로 복사
ADD ./frontend/dist ./build

# nginx 설정 파일 복사
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# 3000 포트 개방
EXPOSE 3000

# # container 실행 시 자동으로 실행할 command. nginx 시작함
CMD ["nginx", "-g", "daemon off;"]