---
date: 2022-08-14 00:00:00 +0900
title: 도커 postresql 시간대, 언어 설정 방법들의 비교
description: 도커 postgresql 의 다양한 환경설정 방법들을 실험하며 차이점을 살펴보겠습니다.
categories: [DevOps, Docker]
tags: [utf8, postgresql, locale]
image: "https://miro.medium.com/1*Ub4SunP72TpHuqyQuwCPWw.jpeg"
---

## 1. 설치 패키지 postgresql 의 사용법

설치 패키지를 download 받아 설치를 하는 경우의 일반적인 사용 형태

1. 환경 분석: locale, timezone 등 변수 설정
2. initdb 실행: conf & data 생성, User 생성, DB 생성
3. server 실행: 소켓 생성, 로그인 준비

### 1) (참고) 설정

```shell
# 기본 locale="C"
$ initdb -D $PGDATA --no-locale --encoding=UTF8

# locale 지정
$ initdb -k -E UTF8 --locale=en_US.utf8
# (자동) -D $PGDATA

$ cat $PGDATA/postgresql.conf
# ==> 필수
# listen_addresses = '*'

$ cat $PGDATA/pg_hba.conf
# ==> 추가
# host all all all $POSTGRES_HOST_AUTH_METHOD
```

- 참고: [localization 을 위한 로케일(locale) 보조 카테고리](https://postgresql.kr/docs/10/locale.html#id-1.6.10.3.4)
  + LC_COLLATE : String 정렬 순서
  + LC_CTYPE : 문자 분류(어떤 글자인지, 대문자도 동일한지)
  + LC_MESSAGES : 메시지 언어
  * LC_MONETARY : 통화 형식
  + LC_NUMERIC : 숫자 형식
  + LC_TIME : 날짜 및 시간 형식


### 2) (참고) 사용법

#### psql 명령어

- `\l` : 데이터베이스 목록: 
- `\dt` : 접속한 DB Instance의 Table 목록
- `\ds` : Sequence 목록
- `\df` : Function 목록
- `\dv` : View 목록
- `\du` : User 목록

#### 데이터베이스 생성

```shell
createdb --lc-collate="C.utf8" --lc-ctype="C.utf8" --template="template0" testdb

psql -c "CREATE DATABASE testdb LC_COLLATE 'C.utf8' LC_CTYPE 'C.utf8' TEMPLATE template0;"
```

- 참고: [데이터베이스 템플릿](https://www.postgresql.kr/docs/10/manage-ag-templatedbs.html)
  + `template1` 표준 시스템 데이터베이스
    * 사이트-로컬 수정이 가능
      - 인코딩 또는 로케일(locale)에 관한 데이터를 포함
    * 데이터베이스 생성시 default template 로 사용됨
  + `template0` 2차 표준 시스템 데이터베이스
    * 로케일 기능이 없어 수정 불가능 (데이터만 있음)
    * pg_dump 덤프를 복원할 때 특히 유용
      - 새 인코딩 및 로케일(locale) 설정을 지정할 수 있기 때문
    * `template0` 사용하려면 create 문에 명시해야 함

#### **_Tip._** 원하는 locale 이 설정된 template 생성

출처: [rafaelbernard/pg_default_utf8.sql](https://gist.github.com/rafaelbernard/ed096423a0b8e23d1345)

- 맞춤형(custom) template 
  + `template0` 기반으로 locale 설정을 씌우면 됨

```sql
-- 현재 `template1` 을 disable
UPDATE pg_database SET datistemplate=FALSE WHERE datname='template1';

-- `template1` 제거
DROP DATABASE template1;

-- locale="C" 설정된 `template1` 생성
CREATE DATABASE template1 
 WITH owner=postgres template=template0 encoding='UTF8' LC_COLLATE='C' LC_CTYPE='C';

-- 생성된 `template1` 을 enable
UPDATE pg_database SET datistemplate=TRUE WHERE datname='template1';

-- 데이터베이스 생성 with template
CREATE DATABASE [Database to create]
WITH TEMPLATE [Database to copy]
OWNER [Your username];
```

#### **_Tip._** 데이터베이스 복제(copy)

복제 대상 데이터베이스가 사용중이지 않아야 복사 가능

```sql
-- 데이터베이스 사용여부 확인
SELECT pg_terminate_backend(pg_stat_activity.pid) 
FROM pg_stat_activity 
WHERE pg_stat_activity.datname = 'originaldb' 
    AND pid <> pg_backend_pid();

-- 데이터베이스 복사
CREATE DATABASE newdb 
WITH TEMPLATE originaldb 
OWNER dbuser;
```


## 2. postgres:14 이미지 사용

### 0) Docker 운용 환경 및 이미지 다운로드

```shell
# OS info
$ cat /etc/os-release*
PRETTY_NAME="Ubuntu 22.04.1 LTS"
ID=ubuntu
ID_LIKE=debian

# platform: ubuntu
$ docker pull --platform linux/amd64 postgres:14
```

#### 참고사항

- platform
  + ubuntu: `linux/amd64`
  + mac m1: `linux/arm64`

- POSTGRES_HOST_AUTH_METHOD 옵션 동작 방식
  + pg14 부터: `scram-sha-256` 또는 `trust`
  + pg14 이전 버전들: `md5` 또는 `trust`

```shell
# POSTGRES_HOST_AUTH_METHOD 옵션
# ==>
$ echo "host all all all $POSTGRES_HOST_AUTH_METHOD" >> pg_hba.conf
```

### 1) `postgres:14` 기본 설정 (no-option)

시간대(TZ) 만 빠진 기본 설정으로도 UTF8 인코딩 환경으로 사용 가능

- listening on IPv4 address "0.0.0.0", port 5432
  + 외부 접속 가능 (remote access)
- `LANG`, `TZ` 환경변수 설정 없음
  - 기본 locale: "en_US.utf8"
  - 기본 search: "english"
  - 기본 timezone: "Etc/UTC"
  - 기본 encoding: "UTF8"
- `POSTGRES_INITDB_ARGS` 설정 없음 (initdb)
  + encoding=UTF8
    * server_encoding, client_encoding 동일
  + LC_COLLATE=en_US.utf8
  + LC_CTYPE=en_US.utf8
- `POSTGRES_USER`, `POSTGRES_PASSWORD` 설정 없음
  + 생성된 사용자: `postgres`
    * 권한 "Superuser, Create role, Create DB, Replication"
  + 패스워드 없는 경우 다른 인증방식을 꼭 지정해야 함
    - `POSTGRES_HOST_AUTH_METHOD=trust` 

```shell
$ docker run -it --rm --name pg14-db -p 55432:5432 \
    -e POSTGRES_HOST_AUTH_METHOD=trust \
    postgres:14

$ psql -h localhost -p 55432 -U postgres -d postgres
# ==> trust 인증 (no-password)

# 한글 테스트 OK
# create table temp_tbl(name varchar(100));
# insert into temp_tbl(name) values('가가가aa'),('히힣힣bb'),('뚫뚫뚫cc');
# select * from temp_tbl where name like '%뚫%';
```

#### bullseye 시스템의 locale 정보

> 문자셋이 en_US.utf8, C.utf8 밖에 없어서 ko_KR.utf8 설정을 못함

```shell
$ locale
LANG=en_US.utf8
LANGUAGE=
LC_CTYPE="en_US.utf8"
LC_NUMERIC="en_US.utf8"
LC_TIME="en_US.utf8"
LC_COLLATE="en_US.utf8"
LC_MONETARY="en_US.utf8"
LC_MESSAGES="en_US.utf8"
LC_PAPER="en_US.utf8"
LC_NAME="en_US.utf8"
LC_ADDRESS="en_US.utf8"
LC_TELEPHONE="en_US.utf8"
LC_MEASUREMENT="en_US.utf8"
LC_IDENTIFICATION="en_US.utf8"
LC_ALL=

$ locale -a
C
C.UTF-8
en_US.utf8
POSIX
```

### 2) `postgres:14` + 시간대 + 패스워드 설정

시간대(TZ)와 POSTGRES_PASSWORD 설정 (표준형)

- listening on IPv4 address "0.0.0.0", port 5432
  + port 선택 설정
- volume 설정 없음 
- 환경변수 설정 `-e`
  - 시간대 TZ=Asia/Seoul
  - POSTGRES_INITDB_ARGS="-k -E UTF8"
    + 데이터 깨짐 체크 (datasum)
      * 약간의 성능 손실 대신에 데이터 안정성 확인
    + 인코딩(-E)는 기본 옵션이라 안해도 됨
  - POSTGRES_PASSWORD=password
    + USER 가 없는 경우 postgres 에 적용
    + `-W` 패스워드 옵션으로 로그인 해야 함

```shell
$ docker run -it --rm --name pg14-db -p 55432:5432 \
    -e TZ=Asia/Seoul \
    -e POSTGRES_INITDB_ARGS="-k -E UTF8" \
    -e POSTGRES_PASSWORD=password \
    postgres:14

$ psql -h localhost -p 55432 -U postgres -d postgres
# ==> password 인증 (md5)

# 시간대 확인 OK
# show timezone;
# ==> Asia/Seoul
# select now();
# ==> 우리나라 시간과 일치
```

#### 실행된 컨테이너의 postgresql.conf

> en_US.utf8 로케일 + Asia/Seoul 타임존 환경 

```text
$ cat postgresql.conf \
    | grep -v -e '^[[:space:]]*$' | grep -v -e '^[[:blank:]]*#'

listen_addresses = '*'
max_connections = 100      # (change requires restart)
shared_buffers = 128MB      # min 128kB
dynamic_shared_memory_type = posix  # the default is the first option
max_wal_size = 1GB
min_wal_size = 80MB
log_timezone = 'Asia/Seoul'
datestyle = 'iso, ymd'      # YYYY-mm-dd
timezone = 'Asia/Seoul'
lc_messages = 'C.utf8'      # locale for system error message
lc_monetary = 'C.utf8'      # locale for monetary formatting
lc_numeric = 'C.utf8'      # locale for number formatting
lc_time = 'C.utf8'        # locale for time formatting

default_text_search_config = 'pg_catalog.simple'
# default_text_search_config = 'pg_catalog."ko-x-icu"'
```

#### 실행된 컨테이너의 pg_hba.conf

```text
$ cat pg_hba.conf \
    | grep -v -e '^[[:space:]]*$' | grep -v -e '^[[:blank:]]*#'

local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
local   replication     all                                     trust
host    replication     all             127.0.0.1/32            trust
host    replication     all             ::1/128                 trust
host all all all scram-sha-256
```

### 3) `postgres:14` + USER + DATABASE 설정

postgres 계정 없이, USER 계정을 SUPER_USER 로 사용

- listening on IPv4 address "0.0.0.0", port 5432
  + port 선택 설정
- volume 설정 없음 
- 환경변수 설정 `-e`
  - POSTGRES_DB : 새로운 DB 생성
    + encoding=UTF8, locale=C.utf8
  - POSTGRES_USER : 관리자 계정 생성
    + postgres 계정은 없음

```shell
$ docker run -it --rm --name pg14-db -p 55432:5432 \
    -e TZ=Asia/Seoul \
    -e POSTGRES_DB=nfp_db \
    -e POSTGRES_USER=tonyne \
    -e POSTGRES_PASSWORD=password \
    postgres:14

$ psql -h localhost -p 55432 -U postgres -d postgres -W
# ==> 로그인 안됨 (인증 실패)

$ psql -h localhost -p 55432 -U tonyne -d postgres -W
# ==> $POSTGRES_USER 가 슈퍼 유저가 됨

# '\l' 데이터베이스 조회
$ select datname, datdba, encoding, datcollate, datctype, datistemplate from pg_database;
  datname  | datdba | encoding | datcollate |  datctype  | datistemplate
-----------+--------+----------+------------+------------+---------------
 postgres  |     10 |        6 | C.utf8 | C.utf8 | f
 nfp_db    |     10 |        6 | C.utf8 | C.utf8 | f
 template1 |     10 |        6 | C.utf8 | C.utf8 | t
 template0 |     10 |        6 | C.utf8 | C.utf8 | t
(4 rows)
```

## 3. postgres:14 기반 Dockerfile 사용

커스텀 이미지를 생성하여 사용

- 데이터베이스 또는 환경설정을 사전 설정하고 싶을 때
  + 특별한 기능, 함수, 데이터타입 등

> (참고) volume 및 network 생성

```shell
# volume 생성
$ docker volume create --label nfpdb_data nfpdb_data

# network 생성
$ docker network create --label nfp_default nfp_default
```

### 1) locale 설정 `ko_KR.UTF-8` 사용

`FROM postgres:14` 의 기반인 bullseye 에 locale 설정 후 설치

```shell
root@9abbe19eb4d8:/# cat /etc/os-release*
PRETTY_NAME="Debian GNU/Linux 11 (bullseye)"
VERSION="11 (bullseye)"
ID=debian
```


#### bullseye 시스템에 locale 설정 과정

- `localedef` 문자셋 생성
- LC_ALL, LANG, LANGUAGE 환경변수 설정: 'ko_KR.utf8'
  + "/etc/profile" 저장
- timezone 설정: "Asia/Seoul"
  + "/etc/timezone" 저장
  + "/etc/localtime" 연결
 
```dockerfile
FROM postgres:14

# https://hub.docker.com/_/postgres
RUN echo "\n**** setup locale and timezone ****\n"

# make locale data
RUN localedef -i ko_KR -c -f UTF-8 -A /usr/share/locale/locale.alias ko_KR.UTF-8
RUN locale -a | grep ko

# setup locale env.
RUN echo "export LC_ALL='ko_KR.utf8'" >> /etc/profile && \
    echo "export LANG='ko_KR.utf8'" >> /etc/profile && \
    echo "export LANGUAGE='ko_KR.utf8'" >> /etc/profile
ENV LANG ko_KR.utf8

# setup timezone env.
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
RUN echo "Asia/Seoul" > /etc/timezone
ENV TZ Asia/Seoul
```

#### image 생성 및 실행

"ko_KR.utf8" 로케일 환경에서 설치과정 실행

- 서버 부팅시 문자셋과 시간대 설정이 적용됨
- 이후 postgresql 설치 과정 진행
  + 기본 locale, timezone 등이 선택됨

- 컨테이너 외부에서는 password 로그인만 가능
  + 내부에서는 password, trust 둘다 로그인 가능

```shell
$ docker build -t pg14-ko:latest --no-cache .

$ docker run -it --rm --name pg14-db -p 55432:5432 \
    -v nfpdb_data:/var/lib/postgresql/data \
    -e POSTGRES_DB=nfp_db \
    -e POSTGRES_PASSWORD=password \
    pg14-ko

# 출력 내용
# -----------------------------------------
데이터베이스 클러스터는 "ko_KR.utf8" 로케일으로 초기화될 것입니다.
기본 데이터베이스 인코딩은 "UTF8" 인코딩으로 설정되었습니다.
initdb: "ko_KR.utf8" 로케일에 알맞은 전문검색 설정을 찾을 수 없음
기본 텍스트 검색 구성이 "simple"(으)로 설정됩니다.

기본 지역 시간대를 선택 중 ... Asia/Seoul

initdb: 경고: 로컬 접속용 "trust" 인증을 설정 함
IPv4, 주소: "0.0.0.0", 포트 5432 번으로 접속을 허용합니다
이제 데이터베이스 서버로 접속할 수 있습니다
# -----------------------------------------


$ psql -h localhost -p 55432 -d postgres -U postgres -w
psql: fe_sendauth: no password supplied
# ==> 로그인 실패

➜  minubt postgres psql -h localhost -p 55432 -d postgres -U postgres -W
Password for user postgres:
# ==> 로그인 성공!!

postgres=# create database testdb;
CREATE DATABASE

postgres=# \l    # 데이터베이스 목록                               
   이름    |  소유주  | 인코딩 |  Collate   |   Ctype    |
-----------+----------+--------+------------+------------+
 nfp_db    | postgres | UTF8   | ko_KR.utf8 | ko_KR.utf8 |
 postgres  | postgres | UTF8   | ko_KR.utf8 | ko_KR.utf8 |
 template0 | postgres | UTF8   | ko_KR.utf8 | ko_KR.utf8 |
           |          |        |            |            |
 template1 | postgres | UTF8   | ko_KR.utf8 | ko_KR.utf8 |
           |          |        |            |            |
 testdb    | postgres | UTF8   | ko_KR.utf8 | ko_KR.utf8 |
(5개 행)

testdb=# create table temp_tbl(name varchar(100));
CREATE TABLE

# \d temp_tbl
                    "public.temp_tbl" 테이블
 필드명 |          종류          | Collation | NULL허용 | 초기값
--------+------------------------+-----------+----------+--------
 name   | character varying(100) |           |          |

```

- [Table 24.1. PostgreSQL Character Sets](https://www.postgresql.org/docs/current/multibyte.html#MULTIBYTE-CHARSET-SUPPORTED)
  + UTF8 문자셋의 스펙
    * Unicode (8-bit), 가변 크기 1~4 Byte
    * 모든 언어 지원 (all)
    * server_encoding 지원
  + _(비교)_ EUC_KR 문자셋의 스펙
    * Extended UNIX Code-KR, 가변 크기 1~3 Byte
    * 한국어(Korean)만 지원
    * server_encoding 지원

#### "ko_KR.utf8" 컨테이너 내부

로그 포맷, 메시지, 시간 출력형식 등등 모두 한국어로 적용됨

```shell
$ docker exec -it $(docker ps -ql) /bin/bash
# ==> 이후 내부환경 확인

# 설정 가능한 모든 locale 에서 ko_KR 확인
$ root@9abbe19eb4d8:/# locale -a | grep ko
ko_KR.utf8

# 현재 설정된 locale
$ root@9abbe19eb4d8:/# locale
LANG=ko_KR.utf8
LANGUAGE=
LC_CTYPE="ko_KR.utf8"
LC_NUMERIC="ko_KR.utf8"
LC_TIME="ko_KR.utf8"
LC_COLLATE="ko_KR.utf8"
LC_MONETARY="ko_KR.utf8"
LC_MESSAGES="ko_KR.utf8"
LC_PAPER="ko_KR.utf8"
LC_NAME="ko_KR.utf8"
LC_ADDRESS="ko_KR.utf8"
LC_TELEPHONE="ko_KR.utf8"
LC_MEASUREMENT="ko_KR.utf8"
LC_IDENTIFICATION="ko_KR.utf8"
LC_ALL=

$ root@9abbe19eb4d8:/# env
POSTGRES_PASSWORD=password
TZ=Asia/Seoul
LANG=ko_KR.utf8
PG_MAJOR=14
PGDATA=/var/lib/postgresql/data
POSTGRES_DB=nfp_db
# .. 이하 생략

$ root@9abbe19eb4d8:/# date
2022. 09. 18. (일) 19:52:56 KST

# (암호 없이) trust 로그인
$ psql -d postgres -U postgres
# ==> 로그인 성공

# 암호(scram-sha-256) 로그인
$ psql -d postgres -U postgres -W
암호:
psql (14.5 (Debian 14.5-1.pgdg110+1))
# ==> 로그인 성공

$ cd $PGDATA

$ cat postgresql.conf \
    | grep -v -e '^[[:space:]]*$' | grep -v -e '^[[:blank:]]*#'
listen_addresses = '*'
datestyle = 'iso, ymd'
timezone = 'Asia/Seoul'
lc_messages = 'ko_KR.utf8'  # locale for system error message strings
lc_monetary = 'ko_KR.utf8'  # locale for monetary formatting
lc_numeric = 'ko_KR.utf8'   # locale for number formatting
lc_time = 'ko_KR.utf8'      # locale for time formatting
default_text_search_config = 'pg_catalog.simple'

$ cat pg_hba.conf \
    | grep -v -e '^[[:space:]]*$' | grep -v -e '^[[:blank:]]*#'
local   all             all                                     trust
host    all             all             127.0.0.1/32            trust
host    all             all             ::1/128                 trust
host all all all scram-sha-256

$ pg_dump testdb -t 'temp_tbl' --schema-only -U postgres
--
-- Name: temp_tbl; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.temp_tbl (
    name character varying(100)
);

ALTER TABLE public.temp_tbl OWNER TO postgres;
```

### 2) docker-entrypoint-initdb 스크립트 사용

Docker 이미지에서 외부 entrypoint-initdb.sh 를 이용해 설정

> 참고 문서

- [Docker/postgres 공식문서 - Initialization scripts](https://hub.docker.com/_/postgres)
- [postgresql: dockerfile create user and database from entrypoint script](https://stackoverflow.com/a/55361202)

#### [postgres:14 Docker - 관련코드 위치](https://github.com/docker-library/postgres/blob/56a1986772dd0f9488d54dccb82427c0db0b0599/14/bullseye/Dockerfile#L73)

설치 과정에 나오는 docker-entrypoint.sh 관련 로그

- `/docker-entrypoint-initdb.d/*` 안에 아무것도 없으면 건너뛴다

```text
LOG:  database system is ready to accept connections
      |  done
      | server started
      | CREATE DATABASE

/usr/local/bin/docker-entrypoint.sh: ignoring /docker-entrypoint-initdb.d/*

LOG: received fast shutdown request
```

#### (미완성) Dockerfile

`/docker-entrypoint-initdb.d/*` 채운 상태의 이미지가 되도록 만든다

> 핵심은 postgres 생성 과정에 shell script 실행을 끼워넣어야 한다.

```text
FROM postgres:14

COPY ./pg-initdb.sh /docker-entrypoint-initdb.d/pg-initdb.sh

RUN chmod +x /docker-entrypoint-initdb.d/docker-entrypoint.sh

```

#### (미완성) docker-entrypoint.sh

원하는 설정을 bash 스크립트로 수행

- 필수적으로 postgresql 을 설치하는 과정이 있어야 함
  + initdb
  + 임시로 내부 postgres server 실행
  + User, DB, setting 등 설정 적용
  + 재부팅 이후 설정의 정상 여부를 확인
  + 재부팅하여 작업 종료 (서비스 시작)

```shell
#!/bin/sh

# terminate script on ERROR
set -e

[ -z "$POSTGRES_USER" ] && export POSTGRES_USER=postgres
[ -z "$POSTGRES_PASSWORD" ] && export POSTGRES_PASSWORD=password

echo "\n#########################"
echo "##  list env. variables:\n"

env | grep POSTGRES
env | grep PGDATA
env | grep TZ
env | grep LANG

echo "\n#########################"
echo "##  check locale:\n"

locale -a | grep ko

if [ -d "$DIR" ]; then
  echo "\n#########################"
  echo "##  already done initdb: $PGDATA:\n"

  psql -v ON_ERROR_STOP=1 -d postgres -c \
     "SELECT DATNAME AS NAME, PG_GET_USERBYID(DATDBA) AS OWNER, ENCODING, DATCOLLATE, DATCTYPE FROM PG_DATABASE;"
  psql -v ON_ERROR_STOP=1 -d postgres -c \
     "SELECT USENAME AS ROLE_NAME, CASE WHEN USESUPER AND USECREATEDB THEN CAST('SUPERUSER, CREATE DATABASE' AS PG_CATALOG.TEXT) WHEN USESUPER THEN CAST('SUPERUSER' AS PG_CATALOG.TEXT) WHEN USECREATEDB THEN CAST('CREATE DATABASE' AS PG_CATALOG.TEXT) ELSE CAST('' AS PG_CATALOG.TEXT) END ROLE_ATTR FROM PG_USER ORDER BY ROLE_NAME DESC;"
  psql -v ON_ERROR_STOP=1 -d postgres -c "SHOW TIMEZONE;"

else
  # https://stackoverflow.com/a/55361202
  echo "\n#########################"
  echo "##  initdb & start server:\n"

  initdb -D $PGDATA $POSTGRES_INITDB_ARGS
  pg_ctl -D $PGDATA -o "-c listen_addresses=''" -w start

  echo "\n#########################"
  echo "##  create user and db:\n"

  if [ "$POSTGRES_USER" != "postgres" ]; then
    psql -v ON_ERROR_STOP=1 -d postgres -c \
       "CREATE USER $POSTGRES_USER WITH CREATEDB PASSWORD '$POSTGRES_PASSWORD';"
  fi
  echo "==> create[USER] $POSTGRES_USER / $POSTGRES_PASSWORD"

  if [ ! -z "$POSTGRES_DB" ]
  then
    createdb -e -l "ko_KR.UTF-8" -T "template0" -O $POSTGRES_USER $POSTGRES_DB
    echo "==> create[DB] $POSTGRES_DB owner $POSTGRES_USER"
  fi

  echo "\n#########################"
  echo "##  stop server:\n"

  pg_ctl -D $PGDATA -m fast -w stop
fi

grep 'listen_addresses' $PGDATA/postgresql.conf
# Password Authentication: md5 or scram-sha-256
echo "host  all  $POSTGRES_USER  0.0.0.0/0  md5" >> $PGDATA/pg_hba.conf
tail -n1 $PGDATA/pg_hba.conf

# exec return to user CMD
exec "$@"
```

<a id="dollar_n_atsign" />

참고: [set -e 와 exec "$@"](https://almostgeneral.tistory.com/4)

- `set -e` : 오류 발생시 스크립트 실행 중단
- `exec "$@"` : CMD 실행 프로세스를 다음 CMD 에 넘겨줌 
  - 안하면 새로운 프로세스로 CMD 가 실행되어 그만큼 무겁고 느려짐

## 3. postgres:14 기반 docker-compose 사용

### 1) postgresql.conf 마운트 (외부 설정파일)

- TZ=Asia/Seoul
- locale=en_US.utf8
- USER=postgres, 패스워드 인증
- $PGDATA 를 volume 마운트
- 외부 설정파일을 사용하도록 최종 CMD 변경

```shell
# 서비스 실행 
$ docker compose up --build --force-recreate
# ==> ['postgres','-c','config_file=/etc/postgresql/postgresql.conf']

# 접속 확인 OK
$ psql -h localhost -p 55432 -d postgres -U postgres -W
Password for user postgres:
psql (10.4, server 14.5 (Debian 14.5-1.pgdg110+1))
postgres=# \l
postgres=# show timezone;  # OK!

# 서비스 종료
$ docker compose down -v --rmi local
```

#### docker-compose.yml

```yml
version: '3'

services:
  pg14-db:
    image: postgres:14
    container_name: pg14-db
    command: ['postgres','-c','config_file=/etc/postgresql/postgresql.conf']
    environment:
        - TZ=Asia/Seoul
        - POSTGRES_INITDB_ARGS=-k -E UTF8
        - POSTGRES_PASSWORD=password
        - POSTGRES_DB=nfp_db
    ports:
        - 55432:5432
    volumes:
        - nfpdb_data:/var/lib/postgresql/data
        - ./config/my-postgres.conf:/etc/postgresql/postgresql.conf

volumes:
  nfpdb_data:
    name: nfpdb_data
```

#### `./config/my-postgres.conf` 외부 설정파일

- en_US.utf8 환경의 postgresql.conf 와 내용 같음
- 단, _하위 디렉토리를 하나 끼고__ **mount 해야** 정상 작동함!

#### 실행 및 테스트

```shell
$ psql -U postgres -d postgres
psql (14.5 (Debian 14.5-1.pgdg110+1))
Type "help" for help.

postgres=# \l
                       List of databases
   Name    |  Owner   | Encoding |  Collate   |   Ctype    |
-----------+----------+----------+------------+------------+
 postgres  | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
 template0 | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
 template1 | postgres | UTF8     | en_US.utf8 | en_US.utf8 |
(3 rows)

postgres=# show timezone;
# ==> Asia/Seoul
postgres=# select now();    # 시간 OK!
```


## 4. [Docker 문서 - postgres](https://hub.docker.com/_/postgres) 주요 내용

### 1) Locale Customization

> Dockerfile

```shell
FROM postgres:14.3

RUN localedef -i de_DE -c -f UTF-8 -A /usr/share/locale/locale.alias de_DE.UTF-8
ENV LANG de_DE.utf8
```

### 2) Arbitrary --user Notes

trust 인증 사용자를 자신의 계정으로 하고 싶은 경우

- 프로세스 및 파일 권한이 user `$(id -u):$(id -g)` 에게 귀속

```shell
# (id 가 달라서) 안되는 경우가 있다
$ docker run -it --rm --user 1000:1000 -e POSTGRES_PASSWORD=mysecretpassword postgres
initdb: could not look up effective user ID 1000: user does not exist

# solution ==> "$(id -u):$(id -g)"

$ docker run -it --rm --user "$(id -u):$(id -g)" -v /etc/passwd:/etc/passwd:ro -e POSTGRES_PASSWORD=mysecretpassword postgres
The files belonging to this database system will be owned by user "jsmith".
```

## 9. Review

- 휴, 드디어 밀린 숙제를 해치웠다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
