## 인프라 사용 가이드

### 자주 쓸 명령어

#### Q&A

- Q. 프론트 빌드 배포했는데 서버 갑자기 터짐
- A. 네트워크 재설정 되서 그런거임 Nginx restart 해주세요.
- Q. `docker ps -a` 찍어봤는데 무한 restarting 함
- A. 일단 `docker stop` 하고 방금 건드린 파일 cp 해와서 기존 상태로 고치고 다시 cp 해서 원복시키세요.
- Q. 포트 맞게 연결한 것 같은데 안되뮤ㅠㅠㅠ
- A. 도커 간 네트워크 연결해놨으면 `내부 Port`로 접속하면 됩니다.

#### 개선점

- 서버 하나 못찾으면 nginx가 계속 연결 재시도해서 전체 Appliction의 Reverse Proxy에 문제 발생.
- 못찾으면 더 이상 찾지 않도록 세팅 변경 필요.
- 지금은 마이크로 서비스로 직접 연결하는데 Eureka와 같은 관리 서버에 연결해두는 것이 좋을 듯 하다.
- 도커 네트워크 IP도 고정적으로 할당될 수 있도록 변경해야 할 것 같다.
- 컨테이너 마다 외부 Port 매핑하지 않고, 리버스 프록시와 Docker Network 만으로 통신 가능하도록

#### EC2 Shell 관련

1. 컨테이너 목록 조회
   - `docker ps -a`
2. 컨테이너 상세 조회
   - `docker inspect $'container-name'`
3. 네트워크 목록 조회
   - `docker network ls`
4. 네트워크 상세 조회
   - `docker network $'network-name'`
5. 도커 컨테이너 진입
   - ` docker exec -it $'container-name' /bin/bash`
6. 도커 내부 파일 복사
   - `docker cp $'from-location' $'to-location'`
7. 해당 문자열 포함하는 컨테이너 행 모두 rm
   - `docker ps -a | grep $'word' | awk '{print $1}' | xargs docker rm`
8. 도커 컨테이너 네트워크 연결
   - `docker network connect $'network-name' $'container-name'`
9. 열린 포트 확인
   - `netstat -nltp`
10. 내가 친 Command 확인
    - `history`

## 인프라 구축 가이드

### EC2 Key 로 MobaXterm 연동

- Session 추가해서 epm 키 연동. 이후 ubuntu 서버 접속 가능.
- 서버 시간을 한국 표준시로 변경할 것 (기본은 UTC+0)
  - `sudo timedatectl set-timezone Asia/Seoul`
- 미러 서버를 카카오 서버로 변경
  - 카카오에서 제공하는 미러 서버
  - `sudo sed -i 's/ap-northeast-2.ec2.archive.ubuntu.com/mirror.kakao.com/g' /etc/apt/sources.list`
- 미러 서버 변경 후 패키지 `UPDATE`
  - `sudo apt-get -y update && sudo apt-get -y upgrade`
- Swap 영역 할당
  - Swap 영역 : 메모리 부족 시를 대비하여 디스크의 일부 공간을 비상용으로 할당.
  - 당연히 성능은 메모리 쓰는 것보다는 느리겠지만 비상용 할당임
  - 용량 확인, 영역 할당, 권한 설정, swapfile 생성, 활성화, 유지 설정
  ```console
  free -h
  sudo fallocate -l 4G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  sudo echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
  ```

### Docker 설치

#### 필요한 Package 설치

#### Docker Compose

- 여러 컨테이너 구동 시, 초기 run을 더 간편하게 하기 위해 작성한 일종의 스크립트
- 컨테이너 생성, 환경 변수 설정, 네트워크 설정, 컨테이너 생성 순서와 의존성 설정 등 가능
- ~~매번 새로 하면 헷갈리고 힘들어~~
- 도커 컴포즈 다운로드
  ```
  sudo curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  ```
- 도커 컴포즈 디렉토리 사용 권한 변경
  ```
  sudo chmod +x /usr/local/bin/docker-compose
  ```

### Jenkins 설치

#### Jenkins 도커 컨테이너 생성

```
docker run -d --restart always --env JENKINS_OPTS=--httpPort=8080 --env JENKINS_OPTS="--prefix=/jenkins" -v /etc/localtime:/etc/localtime:ro -e TZ=Asia/Seoul -p 8080:8080 -v /jenkins:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v /usr/local/bin/docker-compose:/usr/local/bin/docker-compose --name jenkins -u root jenkins/jenkins:jdk17
```

- `-d` : Ubuntu Background (Daemon) 구동
- `--restart always` : 컨테이너 종료되어도 재구동하는 옵션
- `-e TZ=Asia/Seoul` : 컨테이너 내부 시간대 설정
- `--env` : 위처럼 환경 변수 설정
  - `--env JENKINS_OPTS=--httpPort=8080`
  - `--env JENKINS_OPTS="--prefix=/jenkins"` : `domain/jenkins` 접속시 필요
- `-v /etc/localtime:/etc/localtime:ro`
- `-v /jenkins:/var/jenkins_home`
  - 컨테이너 내부:내부 볼륨 마운트
  - 컨테이너 종료 후에도 데이터 저장
- `--name jenkins` : 컨테이너 이름 설정
- `-u root` : 컨테이너 실행할 리눅스 사용자 계정
- `jenkins/jenkins:jdk17` : 이미지 옵션, 최신 버젼으로 설치 안하면 플러그인 설치 에러 가능

#### Jenkins 세팅

1. Jenkins 컨테이너 종료 후 Jenkins 데이터가 있는 디렉토리에 update-center-rootCAs 하위 디렉토리 생성

```
sudo docker stop jenkins
sudo mkdir /jenkins/update-center-rootCAs
```

2. CA 파일 다운로드

```
sudo wget https://cdn.jsdelivr.net/gh/lework/jenkins-update-center/rootCA/update-center.crt -O /jenkins/update-center-rootCAs/update-center.crt
```

3. Jenkins 플러그인 다운로드 시 미러사이트로 대체될 수 있도록 설정

```
sudo sed -i 's#https://updates.jenkins.io/update-center.json#https://raw.githubusercontent.com/lework/jenkins-update-center/master/updates/tencent/update-center.json#' /jenkins/hudson.model.UpdateCenter.xml
```

4. Jenkins 컨테이너 재시작
5. 포워딩 및 방화벽 개방 후 브라우저 통해서 접속. 초기 비밀번호 확인 후 입력

```console
docker exec -it jenkins /bin/bash
cd /var/jenkins_home/secrets
cat initialAdminPassword
```

6. 젠킨스 내부 도커 설치
   - 컨테이너 내부 진입 후
   - AMD64, ARM64 여부에 따라
   ```
   apt-get update && apt-get -y install apt-transport-https ca-certificates curl gnupg2 software-properties-common && curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable" && apt-get update && apt-get -y install docker-ce
   ```
   ```
   apt-get update && apt-get -y install apt-transport-https ca-certificates curl gnupg2 software-properties-common && curl -fsSL https://download.docker.com/linux/$(. /etc/os-release; echo "$ID")/gpg > /tmp/dkey; apt-key add /tmp/dkey && add-apt-repository "deb [arch=arm64] https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") $(lsb_release -cs) stable" && apt-get update && apt-get -y install docker-ce
   ```
   - Docker Jenkins 에서 Host Docker 접근 권한
   ```
   groupadd -f docker
   usermod -aG docker jenkins
   chown root:docker /var/run/docker.sock
   ```

### Nginx 설치

#### Nginx 도커로 설치

- `docker run -d --restart always -p 80:80 -p 443:443 -e TZ=Asia/Seoul --name nginx -u root nginx:latest`
- `--network` 옵션 주기. (Default는 Bridge 네트워크)
- 바인딩을 통해 내부 `/etc/nginx/conf.d/` 볼륨 바인딩 해도 좋을 듯
- `sudo vim /etc/nginx/sites-enabled/default`
  - 다음을 추가
  - `include /etc/nginx/conf.d/service-url.inc;`
  - `proxy_pass $service_url;`
  - `try_files $uri $uri/ =404;` 는 주석처리
  - service-url.inc 추가
  - `sudo vim /etc/nginx/conf.d/service-url.inc`
  - 기본 80 포트를 8081로 전환
  - `set $service_url http://127.0.0.1:8081;`

#### Nginx Container에 Certbot 설치. SSL 인증 받기

- `sudo snap install --classic certbot`
- 에러 시에는 아래 명령어로 문제 맞춰 확인해볼 것
  - `sudo apt-add-repository -r ppa:certbot/certbot`
  - `sudo apt-get -y install python3-certbot-nginx`
- SSL 인증서 발급 (Nginx 사용 시)
  - `sudo certbot --nginx -d develop.code-speed.com`
- SSL 인증서 확인
  - `/etc/cron.d` 에서 인증서 자동 갱신 스크립트 설치 기록
  - `sudo certbot renew --dry-run` 인증서 갱신 테스트

#### Nginx /etc/nginx/conf.d/default.conf 수정

- 프론트 백 분기, 백 서버 분기 처리
- 80포트로 오는 요청 443으로 redirect (http -> https)
- 기본 uri는 프론트엔드로 연결

```conf
location / {
        proxy_pass http://frontend:3716;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
```

- /api uri는 백엔드(할당된 IP + Port로) 연결. IP는 container 이름으로 대체 가능
- 그래서 위 예시도 컨테이너 이름인 frontend로 되어있습니다.
- Swagger-ui 사용 희망 시 아래 location 설정 필요

```
location ~ ^/(swagger|webjars|configuration|swagger-resources|v2|csrf) {
         proxy_pass $service_url;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_set_header X-Forwarded-Proto $scheme;
    }
```

- 현재 프로젝트 전체 conf 파일 (24.01.30)

```

server {
    server_name  i10a701.p.ssafy.io;

    error_log /var/log/nginx/error.log;

    include /etc/nginx/conf.d/service-url.inc;

    location / {
        proxy_pass http://frontend:3716;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location ~ ^/(swagger|webjars|configuration|swagger-resources|v2|csrf) {
         proxy_pass $service_url;
         proxy_set_header Host $host;
         proxy_set_header X-Real-IP $remote_addr;
         proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
         proxy_set_header X-Forwarded-Proto $scheme;
    }

    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/i10a701.p.ssafy.io/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/i10a701.p.ssafy.io/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

    location /jenkins {
        proxy_pass http://jenkins:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/trip {
        proxy_pass http://trip-service:8083;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

     location /api/message {
        proxy_pass http://message-service:8084;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
     }

     location /api/user {
        proxy_pass http://user-service:8081;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
     }
}

server {
    if ($host = i10a701.p.ssafy.io) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen       80;
    listen  [::]:80;
    server_name  i10a701.p.ssafy.io;
    return 404; # managed by Certbot
}
```

### 이후 할 작업

#### BACKEND WebHook 작성

- 최근 커밋과 비교, 수정 폴더 확인해서 Build Trigger 만들기
