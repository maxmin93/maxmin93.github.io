---
date: 2022-12-21 00:00:00 +0900
title: Backend 오픈소스 Supabase
description: Firebase 대체제로 유명한 백엔드 오픈소스 Supabase 에 대해 알아보자. 웹앱, 모바일앱 개발시 많이 사용된다.
categories: [Backend, Supabase]
tags: [postgresql, headless, cms]
image: "https://media2.dev.to/dynamic/image/width=1280,height=720,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Ftjeeetdg8xey073vktvx.png"
---

## 1. [Supabase](https://supabase.com) 란?

모든 백엔드 기능을 제공하는 Firebase 의 대체 오픈소스

![Supabase Architecture](https://supabase.com/docs/img/supabase-architecture--light.svg){: width="600" .w-75}
_Supabase Architecture_

### 1) 기능

- [x] 호스팅 된 Postgres 데이터베이스 [Docs](https://supabase.com/docs/guides/database)
- [x] 사용자 인증 및 권한 부여 [Docs](https://supabase.com/docs/guides/auth)
- [x] 자동생성 API
  - [x] REST [Docs](https://supabase.com/docs/guides/api#rest-api)
  - [x] 실시간 구독 [Docs](https://supabase.com/docs/guides/api#realtime-api)
  - [x] GraphQL (Beta) [Docs](https://supabase.com/docs/guides/api#graphql-api)
- [x] 함수
  - [x] 데이터베이스 함수. [Docs](https://supabase.com/docs/guides/database/functions)
  - [x] 엣지 함수 [Docs](https://supabase.com/docs/guides/functions)
- [x] 파일 스토리지 [Docs](https://supabase.com/docs/guides/storage)
- [x] 대시보드

#### [클라이언트 라이브러리](https://github.com/supabase/supabase/blob/master/i18n/README.ko.md#%ED%81%B4%EB%9D%BC%EC%9D%B4%EC%96%B8%ED%8A%B8-%EB%9D%BC%EC%9D%B4%EB%B8%8C%EB%9F%AC%EB%A6%AC)

- JS/Typescript
- C#, Go, Java, Kotlin, Rust, Ruby
- Flutter, Swift

### 2) [요금](https://supabase.com/pricing)

클라우드 서비스를 이용할 수 있다.

#### 무료 : 프로젝트 2개까지

- DB 500MB 를 포함해 저장소 1GB
- 네트워크 트래픽 2GB, 파일 업로드 50MB 까지
- 소셜 OAuth 제공, 월 5만명 사용자 접속 가능
- 엣지 함수 호출 500K 회
- 1일 로그 유지

#### 프로 : 프로젝트당 월 25달러 (3만1천원)

- 무료 버전에서 용량 업그레이드 (충분)
- 일일 백업, 7일 로그 유지
- 프로젝트 중지 없음

### 3) [셀프 호스팅 (도커)](https://supabase.com/docs/guides/self-hosting/docker)

Docker 실행 후 http://localhost:3000 접속하면 스튜디오가 실행된다.

```console
# Get the code
git clone --depth 1 https://github.com/supabase/supabase

# Go to the docker folder
cd supabase/docker

# Copy the fake env vars
cp .env.example .env

# Start
docker compose up --build --force-recreate --remove-orphans
# docker compose down -v
```
{: file="Setup and Docker up"}

#### `.env`, `kong.yml` 설정

- `.env` 에 API 키와 암호, 포트번호 등의 설정사항을 입력
- [API Keys](https://supabase.com/docs/guides/self-hosting#api-keys) 로 `JWT Secret`, `ANON_KEY`, `SERVICE_KEY` 를 생성한다.
  + `docker/.env` 에 JWT, ANON, SERVICE 를 설정하고
  + `docker/volumes/api/kong.yml` 에 ANON, SERVICE 를 설정

> 동일한 JWT Secret 값에 대해 `Generate JWT` 버튼을 눌러 생성하면 된다.

#### nginx 로 rest, auth, realtime, studio 연결하기

참고 [How to Self-host Supabase: A complete guide - 2022년12월](https://blog.devgenius.io/how-to-self-host-supabase-a-complete-guide-f4c68f449920)

## 2. 구성요소

[docker-compose.yml](https://github.com/supabase/supabase/blob/master/docker/docker-compose.yml) 내용을 참고

### 1) studio : 프로젝트 관리를 위한 웹애플리케이션

![Supabase Studio](https://blog.logrocket.com/wp-content/uploads/2022/03/api-keys.png){: width="600" .w-75}
_Supabase Studio_

- Next.js, Tailwind, Supabase UI 등으로 만들어졌다. [참고](https://supabase.com/blog/supabase-studio)

### 2) [kong](https://docs.konghq.com/gateway/latest/) : 클라우드 네이티브 API 게이트웨이

- [kong.yml](https://github.com/supabase/supabase/blob/master/docker/volumes/api/kong.yml) 에서 서비스 항목 정의 및 경로 연결

### 3) auth : 인증 API 및 사용자 관리

- 참고 [깃허브 - supabase/gotrue](https://github.com/supabase/gotrue)
- 사용자 관리 및 SWT 토큰 발급을위한 SWT 기반 API

### 4) rest : [postgrest](https://postgrest.org/en/stable/) 이용

- PostgreSQL 과 직접 연결되는 RESTful API 웹서비스

### 5) realtime : websocket 기반 실시간 알림

- 참고 [Realtime Quickstart](https://supabase.com/docs/guides/realtime/quickstart)
- 웹 소켓을 사용하여 PostgreSQL 삽입, 업데이트 및 삭제를 수신 할 수 있는 Elixir 서버

### 6) storage : [S3](https://aws.amazon.com/s3/), [Wasabi](https://wasabi.com/), [Backblaze](https://www.backblaze.com/) 저장소 연결

![supabase storage](https://supabase.com/images/blog/storage/infra.png){: width="600" .w-75}
_supabase storage architecture_

- 참고 [Storage is now available in Supabase](https://supabase.com/blog/supabase-storage)

### 7) [imgproxy](https://imgproxy.net/) : 이미지 리사이즈, 썸네일 서비스

- 참고 [깃허브 - imgproxy/imgproxy](https://github.com/imgproxy/imgproxy)

### 8) postgres-meta : PG 의 테이블, 계정, 함수, 쿼리 실행 API

- 참고 [깃허브 - supabase/postgres-meta](https://github.com/supabase/postgres-meta)

### 9) postgres : supabase 의 Database

- PG 14 이상에 여러 extentions 들을 필요로 한다.
  + [docker](https://hub.docker.com/r/supabase/postgres) 의 Extensions 리스트를 참고

## 3. Sveltekit 관련 Supabase 예제

### 1) [Auth 예제](https://supabase.com/docs/guides/getting-started/tutorials/with-sveltekit) : signIn, signOut

- [유튜브 - SvelteKit and Supabase Tutorial with Authentication](https://www.youtube.com/watch?v=YqIyET7XKIQ)
- [유투브 - How to Use Supabase Auth With Sveltekit!](https://www.youtube.com/watch?v=z3BAuF2XZng)
- [블로그 - SvelteKit with Supabase SSR Auth Helpers](https://dev.to/kvetoslavnovak/sveltekit-with-supabase-auth-helpers-578a)

### 2) [Supabase 설정 (OUTDATED)](https://www.youtube.com/watch?v=j4AV2Liojk0)

- [블로그 - Setting up Supabase with Sveltekit](https://sjorswijsman.medium.com/setting-up-supabase-with-sveltekit-f6234fa1b54b)

### 3) [유튜브 - 블로그 만들기](https://www.youtube.com/watch?v=7_9rUtwM-q0)

- 소스 코드: [깃허브 - sveltemaster/sveltekit-supabase-realtime-blog](https://github.com/sveltemaster/sveltekit-supabase-realtime-blog)

## 9. Review

- 웹애플리케이션보다 Flutter 같은 모바일 개발자들에게 인기가 높은듯
- 여러차례 노력했지만, 셀프 호스팅 시도에 실패했다. (클라우드 쓰기 싫어서)
  + pg 를 필요로 하는 부가 서비스들이 로그인 시도에 실패한다.
  + pg 자체 로그인이 가능하도록 계정 sql 을 수정했지만, 계속 실패.
  + 통합된 도커 구성에 문제가 있다고 판단해서, appwrite 로 전환하기로 함

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
