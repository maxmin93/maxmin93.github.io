---
date: 2022-08-12 00:00:00 +0900
title: 도커 튜토리얼 getting-started
description: 개발환경과 배포의 필수품이 된 Docker 부터 AWS 자동화까지 알아보겠습니다.
categories: [DevOps, Docker]
tags: [aws, nginx]
image: "https://miro.medium.com/1*pFeovQIrwG9HozjsLa0CtQ.png"
---

## Docker Tutorial

### Docker 설치 (Mac)

`brew install` 또는 [Download 페이지](https://docs.docker.com/desktop/install/mac-install/) 통해 설치

```shell
# UI 애플리케이션도 설치됨
$ brew install docker
```

### 따라해 보기

1. [docker/getting-started](https://hub.docker.com/r/docker/getting-started) 실행해 보기
2. [깃허브 - docker/getting-started](https://github.com/docker/getting-started) 다운받아 빌드해 보기
3. docker-compose 및 jenkins 를 이용한 자동화
4. [nodejs - Todo App](https://docs.docker.com/get-started/02_our_app/#get-the-app) 실행해 보기
5. [nginx 이용해 고가용성 node app 연결하기](https://github.com/sowmenappd/load_balanced_nodejs_app)
6. [AWS EC2에 배포 - ECR/ECS](https://www.freecodecamp.org/news/build-and-push-docker-images-to-aws-ecr/)

#### 참고자료

- [Deployment of SSL Encrypted Node.js App on AWS EC2 Using Nginx and Docker with LetsEncrypt](https://medium.com/techbeatly/deployment-of-ssl-encrypted-node-js-app-on-aws-ec2-using-nginx-and-docker-with-letsencrypt-ff727fa33f6b)
- [Docker, NGINX, AWS ELB를 이용해 고가용성 Node.js 애플리케이션 빌드하기](https://smoh.tistory.com/439)
- [AWS EC2 Container Registry(ECR) 어렵지 않아요](https://bluese05.tistory.com/51)

#### TIP. docker 에 외부 접속(remote connection) 허용하기

- Mac 버전의 docker 에서는 TCP(port=2375) 접근 기능을 제공 안함
  - 포트를 연결해주는 socat 을 사용하여 설정하는 방법이 있음<br/>
    [ISSUE - Docker for Mac doesn't listen on 2375](https://github.com/docker/for-mac/issues/770#issuecomment-252560286)
  - socat 은 `brew install`로 직접 설치하거나, docker 로 설치하는 방법이 있음<br/>
    [DockerHub - alpine/socat](https://hub.docker.com/r/alpine/socat)

> Linux Docker Host에 대해 원격으로 접속하는 설정 방법

- 참고: [Enable TCP port 2375 for external connection to Docker](https://gist.github.com/styblope/dc55e0ad2a9848f2cc3307d4819d819f)
  - Docker 공식 페이지 [Configure where the Docker daemon listens for connections](https://docs.docker.com/engine/install/linux-postinstall/#configure-where-the-docker-daemon-listens-for-connections) 대로 하니깐 안됨!!

```shell
# 방화벽 TCP 포트 2375 허용하기
host1 $ sudo ufw allow 2375/tcp

# 컨테이너가 실행되는 호스트
host1 $ docker ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED       STATUS
41cfc66336b3   hello-world   "/hello"   2 hours ago   Exited (0) 2 hours ago

# 다른 컴퓨터로 이동
host1 $ ssh user@host2

# 외부에서 원격으로 도커를 실행하고자 하는 클라이언트
host2 $ docker -H host1 ps -a
CONTAINER ID   IMAGE         COMMAND    CREATED       STATUS
41cfc66336b3   hello-world   "/hello"   2 hours ago   Exited (0) 2 hours ago

# 환경변수(env) DOCKER_HOST 를 사용하면 '-H' 옵션 없이 사용 가능
host2 $ DOCKER_HOST=minubt; docker ps -a
...
```

### 1. docker/getting-started 실행해 보기

> 도커 실행 및 확인

```shell
# 도커 허브로부터 이미지를 다운로드 받아 바로 실행
# -d: 백그라운드 실행
# -p: 포트 맵핑 (내부:외부)
$ docker run -d -p 80:80 docker/getting-started
f17334ba1b8de83377b9810cd2f6934868f21404b6ba6c1462a0133e6171f275

# 실행중인 컨테이너 출력 (포맷 지정)
$ docker ps -f 'status=running' --format "table {\{ .ID \}}\t{\{ .Image \}}\t{\{ .Status \}}\t{\{ .Ports \}}"
CONTAINER ID   IMAGE                    STATUS         PORTS
f17334ba1b8d   docker/getting-started   Up 7 minutes   0.0.0.0:80->80/tcp
126f0a4d9aba   conda-image1:dev         Up 29 hours

# 마지막 사용한 컨테이너 ID만 출력
$ docker ps -q --latest --no-trunc
f17334ba1b8de83377b9810cd2f6934868f21404b6ba6c1462a0133e6171f275

# 컨테이너 리스트 + 옵션
$ docker container ls -q --latest
f17334ba1b8d
```

> 브라우저로 80 포트 접속

- [http://localhost:80/tutorial/](http://localhost:80/tutorial/) : "Getting Started" 튜토리얼 문서
  - 기대했던 Todo App 이 아님
- 컨테이너 콘솔에 접속하여 사용중인 포트와 프로그램 조회
  - `docker exec -it $(docker ps -l -q) /bin/bash`

```shell
# 컨테이너 콘솔로 진입 => /bin/sh
$ docker exec -it f17334ba1b8de83377b9810cd2f6934868f21404b6ba6c1462a0133e6171f
275 /bin/sh

# 사용중인 포트 조회 (':::'은 무시 - IPv6)
$ netstat -tnl
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 :::80                   :::*                    LISTEN

# 사용중인 포트와 연결된 프로그램 조회
$ netstat -tnlp | tail -n +2 | grep -v "-" | awk '{print $4"\t"$5"\t"$7}'
0.0.0.0:80	0.0.0.0:*	1/nginx:
:::80	:::*	1/nginx:
```

> 컨테이너 종료 후 삭제

```shell
# 마지막으로 사용한 컨테이너를 강제 종료하고 삭제 (force 옵션)
$ docker rm -f $(docker ps -lq)

# 모든 컨테이너 종료
$ docker stop $(docker ps -a -q)

# 모든 컨테이너 삭제
$ docker rm $(docker ps -aq)
```

### 2. 깃허브(docker/getting-started) 다운받아 빌드해 보기

> [깃허브](https://github.com/docker/getting-started) 다운받기 getting-started repository.

- Dockerfile : 도커 이미지를 생성하기 위한 스크립트 파일
- docker-compose.yml
- Jenkinsfile

```shell
$ git clone https://github.com/docker/getting-started

$ cd getting-started

$ ls
Dockerfile
docker-compose.yml
Jenkinsfile
...
app                       # nodejs application 루트
docs                      #
```

### 3. docker-compose 및 jenkins 를 이용한 자동화

#### 1) docker-compose

docker-compose 는 여러 도커에 대한 작업을 배치로 수행할 수 있게 해주는 도구이다.

- 예제에서는 docs 하나만 기술해 놓았다

```yaml
version: "3.7"

services:
  docs:
    build:
      context: .
      dockerfile: Dockerfile.docs
      target: dev
    ports:
      - 80:80
    volumes:
      - ./:/app
  nodeapp:
    build:
      context: .
      dockerfile: Dockerfile.node
      target: dev
    ports:
      - 3000:3000
    volumes:
      - ./:/app
```

```shell
$ docker-compose up

```

#### 2) jenkins

참조: [Jenkins를 이용한 Docker 배포](https://dev-overload.tistory.com/40)

- [Jenkins 사용한 devoops 환경 구축](https://www.dongyeon1201.kr/9026133b-31be-4b58-bcc7-49abbe893044)

```shell
# 젠킨스 이미지 다운로드
$ docker pull jenkins/jenkins:lts

# 젠킨스 컨테이너 실행 (젠킨스 서버)
# 호스트 $HOME/Tools/jenkins 에 컨테이너 /var/jenkins_home 를 마운트(연결)
$ docker run --name jenkins-docker -d -p 8080:8080 -p 50000:50000 -v $HOME/Tools/jenkins:/var/jenkins_home -u root jenkins/jenkins:lts

# 브라우저 접속: http://localhost:8080/login?from=%2F
# ==> AdminPassword 입력 요구

# AdminPassword 패스워드 찾기 (jenkins 부팅 로그에 출력됨)
$ docker logs jenkins-docker
"""
Jenkins initial setup is required. An admin user has been created and a password generated.
Please use the following password to proceed to installation:

37ee78edf8744bc386c48e170e821125

This may also be found at: /var/jenkins_home/secrets/initialAdminPassword
"""

# 브라우저에 AdminPassword 을 입력하고, 'Install suggested plugins' 을 클릭

```

### 4. Todo App(nodejs) 실행해 보기

![Todo App](https://docs.docker.com/get-started/images/todo-list-sample.png){: width="600"} <br />&nbsp;

참고: [Sample application - Todo (nodejs)](https://docs.docker.com/get-started/02_our_app/)

#### Dockerfile

> 원본 Dockerfile

- `FROM .. AS {alias}` 이용해 레이어를 재사용
- 튜토리얼 목적 때문에 여러 작업이 섞여 있음
  - mkdocs(python) 이용해 문서 웹서비스 기동(serve)
  - nodejs app 인스톨 테스트
  - mkdocs(python) 의 빌드된 결과를 nginx 로 웹서비스
- alpine 은 가장 작은 크기의 리눅스 이미지 (그만큼 없는게 많다)

```Dockerfile
# mkdocs 파이썬 의존패키지 설치
FROM python:alpine AS base
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

# 노드12 대상으로 nodejs src 복사
FROM node:12-alpine AS app-base
WORKDIR /app
COPY app/package.json app/yarn.lock ./
COPY app/spec ./spec
COPY app/src ./src

# nodejs app 인스톨, 테스트
FROM app-base AS test
RUN apk add --no-cache python3 g++ make
RUN yarn install
RUN yarn test

# 인스톨, 테스트 이전 상태로 만들어 zip 생성
FROM app-base AS app-zip-creator
COPY app/package.json app/yarn.lock ./
COPY app/spec ./spec
COPY app/src ./src
RUN apk add zip && \
    zip -r /app.zip /app

# Dev-ready container - actual files will be mounted in
FROM base AS dev
CMD ["mkdocs", "serve", "-a", "0.0.0.0:8000"]

# WORKDIR /app 유지
FROM base AS build
COPY . .
RUN mkdocs build

# nginx 웹 루트에 mkdocs 빌드 결과를 복사
# - app.zip 도 assets 한켠에 복사 (아무 의미 없다)
FROM nginx:alpine
COPY --from=app-zip-creator /app.zip /usr/share/nginx/html/assets/app.zip
COPY --from=build /app/site /usr/share/nginx/html
```

> Todo App(nodejs) 를 위한 Dockerfile (Dockerfile.node 로 저장)

- 원본 Dockerfile 에서 nodejs 관련 내용만 추리면 된다
- Apple silicon / arm64 머신에서 도커를 운용하는 경우 python2 를 설치한다
  - node 패키지 인스톨할 때 `node-gyp` 설치 오류 발생
- `index.js` 에서 express 포트를 3000 으로 설정했음
  - 도커 실행시 호스트와 포트 3000 에 대한 매핑 필요

```Dockerfile
FROM node:12-alpine
# Adding build tools to make yarn install work on Apple silicon / arm64 machines
RUN apk add --no-cache python2 g++ make
WORKDIR /app
COPY ./app .
RUN yarn install --production
CMD ["node", "src/index.js"]
```

> nginx & mkdocs 를 위한 Dockerfile (Dockerfile.docs 로 저장)

- 원본 Dockerfile 에서 mkdocs 와 nginx 관련 내용만 추리면 된다
- 캐시 레이어를 base, build 로 나눈 이유는 또다른 설정을 위해 재사용할 수 있게 하기 위함

```Dockerfile
# Install the base requirements for the app.
# This stage is to support development.
FROM python:alpine AS base
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

# Do the actual build of the mkdocs site
FROM base AS build
COPY . .
RUN mkdocs build

# Extract the static content from the build
# and use a nginx image to serve the content
FROM nginx:alpine
COPY --from=build /app/site /usr/share/nginx/html
```

### 5. nginx 이용해 고가용성 node app 연결하기

참고: [깃허브 - sowmenappd/load_balanced_nodejs_app](https://github.com/sowmenappd/load_balanced_nodejs_app/blob/main/docker-compose.yml)

```yaml
version: "3"

services:
  lb:
    image: nginx-s
    ports:
      - "80:80"
    command: [nginx-debug, "-g", "daemon off;"]
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app1
      - app2
      - app3
  app1:
    image: app
    ports:
      - "1000:1000"
    environment:
      - PORT=1000
      - SERVER_ID=1
  app2:
    image: app
    ports:
      - "2000:2000"
    environment:
      - PORT=2000
      - SERVER_ID=1
  app3:
    image: app
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - SERVER_ID=1
```

### 6. AWS EC2에 배포 - ECR/ECS

참고: [How to Build and Push Docker Images to AWS ECR](https://www.freecodecamp.org/news/build-and-push-docker-images-to-aws-ecr/)

- [AWS EC2 Container Registry(ECR) 어렵지 않아요](https://bluese05.tistory.com/51)

```shell
$ aws ecr create-repository --repository-name <repo_name> --region <region_name>

$ aws ecr get-login-password --region <region_name>

$ aws ecr --region <region> | docker login -u AWS -p <encrypted_token> <repo_uri>

$ docker tag <source_image_tag> <target_ecr_repo_uri>

$ docker push <ecr-repo-uri>
```

## 9. Review

- 아직 다 못했다. 내용이 길어 쉬었다가 다시 작성하자.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
