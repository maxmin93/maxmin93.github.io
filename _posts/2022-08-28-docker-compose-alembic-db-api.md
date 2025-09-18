---
date: 2022-08-28 00:00:00 +0900
title: Docker-compose 로 alembic + postgres + FastAPI 만들기
description: alembic 을 이용한 초기 DB 마이그레이션과 함께 api + db 구성을 docker-compose 로 생성합니다.
categories: [DevOps, Docker]
tags: ["python", "alembic", "postgresql", "poetry", "fastapi"]
image: "https://miro.medium.com/max/1400/1*Thx7VapgMNGDOoLZ2kxBuQ.png"
---

## 1. [이전 작업](/posts/docker-alpine-poetry-fastapi/)에 이어서 docker-compose 구성

alembic 을 이용해 데이터베이스 스키마를 구성하고, 나머지 컨테이너들을 실행

### 1) 서비스 구성: db, api

- db : postgres:14
  + 환경변수만 설정
- api : python:3.9-alpine
  + fastapi + sqlalchemy 프로젝트 소스
  + alembic 도구

### 2) 실행순서

1. docker build 작업 수행<br />
  `docker compose build`
2. api 서비스에서 alembic 마이그레이션 수행<br />
  `docker compose run --rm api poetry run alembic upgrade head`
3. 모든 서비스 시작 <br />
  `docker compose up -d`
4. 모든 서비스 종료 (볼륨 삭제 포함)<br />
  `docker compose down -v`

```shell
## 1) docker build 작업 수행
$ docker compose build
[+] Building 0.1s (26/26) FINISHED
 => [internal] load build definition from Dockerfile
#...
 => CACHED [20/21] COPY --chown=fastapi alembic.ini ./                       0.0s
 => CACHED [21/21] COPY --chown=fastapi alembic ./alembic                    0.0s
 => exporting to image                                                       0.0s
 => => exporting layers                                                      0.0s
 => => writing image sha256:3e6fcaa2bdeef4805b0de9b995ef18b2440c7f13c6531ba  0.0s
 => => naming to docker.io/library/py39-alpine

## 2) api 서비스에서 alembic 마이그레이션 수행
$ docker compose run --rm api poetry run alembic upgrade head
[+] Running 4/4
 ⠿ Network nfp-devops_default  Created                                       0.0s
 ⠿ Volume "nfpdb_data"         Created                                       0.0s
 ⠿ Volume "nfpapi_data"        Created                                       0.0s
 ⠿ Container nfp-db            Created                                       0.0s
[+] Running 1/1
 ⠿ Container nfp-db  Started                                                 0.2s
BASE_DIR: /backend/alembic
load .env: /backend/.env
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 127bcea40bef, create notes table

## 3) 모든 서비스 시작
$ docker compose up
[+] Running 2/0
 ⠿ Container nfp-db   Running                                                0.0s
 ⠿ Container nfp-api  Created                                                0.1s
Attaching to nfp-api, nfp-db
nfp-api  | INFO:     Will watch for changes in these directories: ['/backend']
nfp-api  | INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
nfp-api  | INFO:     Started reloader process [1] using watchgod
nfp-api  | INFO:     Started server process [10]
nfp-api  | INFO:     Waiting for application startup.
nfp-api  | INFO:     Application startup complete.
nfp-api  |
nfp-api  | load .env: /backend/.env
nfp-api  | TEST: psycopg2.connect
nfp-api  | ==> postgresql://tonyne:tonyne@db:5432/nfp_db
nfp-api  | 2022-09-23 15:28:52
nfp-api  | ==> success!
nfp-api  | INFO:     172.25.0.1:64060 - "GET /notes/ HTTP/1.1" 200 OK

## 4) 모든 서비스 종료 (volume 삭제)
$ docker compose down -v
[+] Running 5/0
 ⠿ Container nfp-api           Removed                                       0.0s
 ⠿ Container nfp-db            Removed                                       0.0s
 ⠿ Volume nfpdb_data           Removed                                       0.0s
 ⠿ Volume nfpapi_data          Removed                                       0.0s
 ⠿ Network nfp-devops_default  Removed                                       0.1s

```

### 3) 디렉토리와 파일 구성

- nfp-devops
  + 환경변수가 설정된 .env 파일들
    * `api.env` : CONN_URL (db 접속용 URL)
    * `db.env` : POSTGRES_* 환경변수들, TZ/LANG/LC_ALL 환경변수
  + nfp-api
    * 구성파일들
      - `alembic.ini` 파일 (COPY)
      - `pyproject.toml` 파일
      - `Dockerfile` 파일
    * nfp-api/alembic
      - alembic 스크립트 소스를 배치
    * nfp-api/app
      - fastapi 소스를 배치

![docker-compose 프로젝트 구조](/2022/08/28-docker-compose-directory-structure-min.png){: width="580" .w-75}
_&lt;그림&gt; 프로젝트의 디렉토리 구조_


## 2. 시행착오 및 참고 내용

### 1) alembic 작업 관련 (api 서비스)

__alembic 작업은 db 가 생성 된 이후에 실행되어야 함__

- depends_on 조건 필요
- Dockerfile 내부 작업이 아니라 CMD 명령으로 처리해야 함
  + 환경변수가 적용되고 난 이후, 최종적으로 실행되는 단계

__alembic 작업 후 exit(0) 처리됨 (연속처리 안됨)__

alembic 작업은 별도의 명령으로 처리해야 함

```shell
# ---------------------
  api:
    command: poetry run alembic upgrade head && poetry run uvicorn main:app --app-dir app --reload --host 0.0.0.0 --port 8000
# ---------------------

nfp-api  | INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
nfp-api  | INFO  [alembic.runtime.migration] Will assume transactional DDL.
nfp-api  | INFO  [alembic.runtime.migration] Running upgrade  -> 127bcea40bef, create notes table
nfp-api  | BASE_DIR: /backend/alembic
nfp-api  | load .env: /backend/.env
nfp-api exited with code 0
```

___db 서비스의 volume 에 변경사항들이 누적됨___

- `poetry run alembic upgrade head` 작업이 반영되어
  + 마치 Dockerfile 의 layer 처럼 
- 다음 fastapi 실행에서 구성이 완료된 db 를 사용하게 됨

___alembic 의 `env.py` 에서 `sys.path.append(BASE_DIR)` 해야 함___

- 별도의 python 파일을 import 하기 위해서 필요
  + alembic 실행시 시작 위치를 특정해 주어야 함

```python
## ---- env.py ---- ##
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
print("BASE_DIR:", BASE_DIR)
sys.path.append(BASE_DIR)

# 'models.py' 같은 위치에 있어도 못찾음
from models import Base
```

### 2) network 연결

___links 설정 (service 이름이 host 로 치환됨)___

- api 서비스에 db 를 link
- db 서비스를 가리키는 문자열에 대해 적용됨
  + ex) CONN_URL="postgresql://tonyne:tonyne@db:5432/nfp_db"
  + => `db` 의 IP 등을 알 필요 없음

___별도의 network 자원 정의 필요 없음___

- `networks` 항목을 설정하면 별도의 네트워크가 생성되어 적용됨
  - Host 에서 접속을 못하게 됨
    + 어떻게 하는 방법이 있는거 같은데 모르겠음. (bridge??)

### 3) `.env` 환경파일 전달 (env_file 옵션으로)

- Dockerfile 에서 COPY 할 필요 없음

### 4) `load_dotenv()` 환경변수 읽어오기

- 참고: [FastAPI with SQLAlchemy, PostgreSQL and Alembic and of course Docker [Part-1]](https://ahmed-nafies.medium.com/fastapi-with-sqlalchemy-postgresql-and-alembic-and-of-course-docker-f2b7411ee396)

```python
## ---- env.py ---- ##
from dotenv import load_dotenv

load_dotenv()

config.set_main_option("sqlalchemy.url", os.environ["CONN_URL"])
```

alembic.ini 에 "sqlalchemy.url" 를 고정시면 안되니깐, 환경변수를 읽어서 값을 설정하는 것으로 소스를 수정해야 함

## 3. 완성된 소스: docker-compose.yml + Dockerfile + alembic 소스

### 1) alembic 소스

___alembic.ini___

```txt
[alembic]
script_location = alembic

# URL will be modified by env.py
sqlalchemy.url = 

prepend_sys_path = .
version_path_separator = os  # default: use os.pathsep
```

___env.py___

```python
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
print("BASE_DIR:", BASE_DIR)
sys.path.append(BASE_DIR)

load_dotenv()

config = context.config
config.set_main_option("sqlalchemy.url", os.environ["CONN_URL"])

from models import Base
target_metadata = Base.metadata

#... (자동생성 된 내용과 동일)
```

### 2) Dockerfile

최종 CMD 는 docker-compose.yml 에서 정의

```dockerfile
FROM python:3.9-alpine

LABEL maintainer="Tonyne@JEJU <tonyne.jeju@gmail.com>"
LABEL description="FastAPI + sqlalchemy + psycopg2 with poetry"

RUN apk update -q

# export GLIBC_VERSION=2.35-r0 (for alpine 3.16.2)
# https://github.com/sgerrand/alpine-pkg-glibc
ENV GLIBC_VERSION 2.35-r0
RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk && \
    apk add glibc-${GLIBC_VERSION}.apk
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-bin-${GLIBC_VERSION}.apk && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-i18n-${GLIBC_VERSION}.apk && \
    apk add glibc-bin-${GLIBC_VERSION}.apk glibc-i18n-${GLIBC_VERSION}.apk

RUN /usr/glibc-compat/bin/localedef -i ko_KR -f UTF-8 ko_KR.UTF-8

# install utils: gcc, curl, ping, sudo, vim
RUN apk --no-cache add build-base libffi-dev curl iputils sudo vim

# default env.
ENV TZ Asia/Seoul
ENV LANG=C.UTF-8 LC_ALL=C.UTF-8
ENV GRP=pythonapp USR=fastapi
ENV PATH=/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

# default value
ENV APP_PORT ${APP_PORT:-8000}
ENV APP_ROOT ${APP_ROOT:-app}
ENV APP_MAIN ${APP_MAIN:-main:app}
ENV APP_TOML ${APP_TOML:-pyproject.toml}

# for pm2: --build-arg BUILD_DEV_MODE=development
ARG BUILD_DEV_MODE
ENV NODE_ENV=${BUILD_DEV_MODE:-production}

# add USER as sudoer
RUN addgroup --system --gid 1001 $GRP
RUN adduser --system --uid 1001 -G $GRP -s /bin/bash $USR
RUN echo "$USR ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers


USER $USR
ENV HOME "/home/$USR"
ENV VENV_PATH=$HOME/.local

# for user (bash)
RUN echo $'             \n\
alias ll="ls -al"       \n\
alias vi="vim"          \n\
export PATH=$PATH:$VENV_PATH/bin' > $HOME/.bashrc

# for vim
RUN echo $'             \n\
set nonu                \n\
set title               \n\
set showmatch           \n\
set ruler               \n\
syntax on               \n\
set t_Co=256            \n\
set autoindent          \n\
set tabstop=4           \n\
set shiftwidth=4        \n\
set softtabstop=4       \n\
set smarttab            \n\
set expandtab           \n\
inoremap { {}<ESC>ha    \n\
set mouse-=a            \n\
set encoding=utf-8      \n\
set termencoding=utf-8  \n\
set cursorline          \n\
set ignorecase          ' > $HOME/.vimrc


# install poetry manually (need gcc libffi-dev)
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH="${PATH}:$VENV_PATH/bin"
# check python & poetry
RUN python --version && poetry --version

WORKDIR backend

# copy .env, toml and sources
COPY --chown=fastapi $APP_TOML ./pyproject.toml
COPY --chown=fastapi $APP_ROOT ./$APP_ROOT
# make virtualenv in project
RUN poetry config virtualenvs.in-project true
RUN poetry install && poetry run which python

# init latest SCHEMA by alembic after createdb
COPY --chown=fastapi alembic.ini ./
COPY --chown=fastapi alembic ./alembic

# multiple ports for concat with blanks
EXPOSE $APP_PORT
ENV PORT $APP_PORT
```

### 3) docker-compose.yml

서비스 이름은 일관성 있게 통일시켜서 엇갈리지 않도록 주의 필요!!

```yml
version: '3'

services:
  db:
    image: postgres:14
    container_name: nfp-db
    env_file:
      - db.env
    ports:
      - 55432:5432
    volumes:
      - nfpdb_data:/var/lib/postgresql/data

  api:
    image: py39-alpine
    container_name: nfp-api
    build: ./nfp-api
    command: poetry run uvicorn main:app --app-dir app --reload --host 0.0.0.0 --port 8000
    env_file:
      - api.env
    depends_on:
      - db
    links:
      - db
    ports:
      - 58000:8000
    volumes:
      - nfpapi_data:/app


volumes:
  nfpdb_data:
    name: nfpdb_data
  nfpapi_data:
    name: nfpapi_data
```

### 4) .env 파일들

한데 모아도 되지만 분리했음

#### db.env

```ini
# for db
POSTGRES_USER=tonyne
POSTGRES_PASSWORD=tonyne
POSTGRES_DB=nfp_db
TZ=Asia/Seoul
LANG=C.UTF-8
LC_ALL=C.UTF-8
```

#### api.env

```ini
# for api
CONN_URL="postgresql://tonyne:tonyne@db:5432/nfp_db"
```


## 9. Review

- 끝인가 싶다가도 끝이 아니네요. 이 바닥이 바닥이 아닌가.
- 이쯤 되니 뭘 구성해도 편합니다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }