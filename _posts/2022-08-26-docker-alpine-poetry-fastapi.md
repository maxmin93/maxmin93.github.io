---
date: 2022-08-26 00:00:00 +0900
title: Mac M1 에서 poetry+FastAPI 이미지 만들기
description: 파이썬 alpine 이미지로 poetry + FastAPI 배포용 Docker 이미지를 생성합니다. (sqlmodel, psycopg2 포함)
categories: [DevOps, Docker]
tags: ["python", "alpine", "aarch64", "docker", "poetry", "fastapi"]
image: "https://hasura.io/blog/content/images/downloaded_images/how-to-write-dockerfiles-for-python-web-apps-6d173842ae1d/1-8rsXezmgl9VTA4zqCcUsfw.jpeg"
---

## [이전 작업](/posts/docker-bullseye-poetry-fastapi/)에 이어서 alpine 버전으로 만들기

그러나 사이즈가 줄지는 않네요. 오히려 더 커졌어요. (뭐 이런~ xx)

- 작은 사이즈가 강점인데 만들고 나니 **509 MB**
  + 지난번 것은 _376 MB_

```shell
$ docker build -t py39-alpine:latest --no-cache .

$ docker run -it --rm --name py39-alpine -p 58000:8000 \
    -e CONN_URL=postgresql+psycopg2://tonyne:tonyne@minubt/nfp_db \
    py39-alpine
# ...
INFO:     Will watch for changes in these directories: ['/backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [1] using StatReload
** notes: ['id', 'text', 'completed']
(1, 'AAAA', False)
(2, 'BBBB', False)
(3, 'CCCC', True)
INFO:     Started server process [95782]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     172.17.0.1:59788 - "GET / HTTP/1.1" 200 OK    
```

- FastAPI 시동 전에 `alembic upgrade head` 실행
- FastAPI 시동 직후에 notes 테이블을 fetch_all() 출력

### 1) 실행 후 bash 접속시 상태

- 시스템 환경 : alpine 3.16.2
  + TZ Asia/Seoul
  + LANG=C.UTF-8 LC_ALL=C.UTF-8
    * 한국어(ko_KR.UTF-8) 로케일은 생성만 해 두고
- 계정 fastapi (group: pythonapp)
  + sudo 권한
- 디렉토리 위치 /backend 
- 유틸리티
  + vim (vi)
  + ping
  + curl, wget

### 2) 사용법

#### pyproject.toml 필요

poetry 명세 파일인 pyproject.toml 로 설치를 해야 한다.

- poetry 에서 생성한 requirements.txt 로는 pip 가 작동 못함
  + 너무 복잡하고 디테일 해서 쉽게 갈 수 없다
  + 참고: [poetry export requirements.txt](https://python-poetry.org/docs/cli/#export)

```txt
alembic==1.7.5 ; python_version >= "3.9" and python_version < "4.0" \
    --hash=sha256:7c328694a2e68f03ee971e63c3bd885846470373a5b532cf2c9f1601c413b153 \
    --hash=sha256:a9dde941534e3d7573d9644e8ea62a2953541e27bc1793e166f60b777ae098b4
anyio==3.4.0 ; python_version >= "3.9" and python_version < "4.0" \
    --hash=sha256:24adc69309fb5779bc1e06158e143e0b6d2c56b302a3ac3de3083c705a6ed39d \
    --hash=sha256:2855a9423524abcdd652d942f8932fda1735210f77a6b392eafd9ff34d3fe020
asgiref==3.4.1 ; python_version >= "3.9" and python_version < "4.0" \
    --hash=sha256:4ef1ab46b484e3c706329cedeff284a5d40824200638503f5768edb6de7d58e9 \
    --hash=sha256:ffc141aa908e6f175673e7b1b3b7af4fdb0ecb738fc5c8b88f69f055c2415214
asyncpg==0.25.0 ; python_version >= "3.9" and python_version < "4.0" \
# ...
```

- pyproject.toml 로는 깔끔하게 간다

```txt
[tool.poetry.dependencies]
python = "^3.9"
alembic = "1.7.5"
anyio = "3.4.0"
asgiref = "3.4.1"
asyncpg = "0.25.0"
click = "8.0.3"
databases = "0.5.3"
fastapi = "0.70.0"
greenlet = "1.1.2"
gunicorn = "20.1.0"
h11 = "0.12.0"
httptools = "0.2.0"
idna = "3.3"
Mako = "1.1.6"
MarkupSafe = "2.0.1"
psycopg2 = "2.9.2"
pydantic = "1.8.2"
python-dotenv = "0.19.2"
PyYAML = "6.0"
sniffio = "1.2.0"
SQLAlchemy = "1.4.27"
starlette = "0.16.0"
typing-extensions = "4.0.1"
uvicorn = "0.15.0"
uvloop = "0.16.0"
watchgod = "0.7"

# ...
```


#### poetry config `virtualenvs.in-project` true

파이썬 가상환경(venv)을 `$APP_ROOT/.venv` 에 생성한다. (의존 패키지도 포함)

```shell
$ poetry config virtualenvs.create false 

$ poetry config --list
cache-dir = "/home/fastapi/.cache/pypoetry"
virtualenvs.create = false
virtualenvs.in-project = null
virtualenvs.options.always-copy = false
virtualenvs.options.no-pip = false
virtualenvs.options.no-setuptools = false
virtualenvs.options.system-site-packages = false
# ...
```

#### createdb and alembic

alembic 으로 database 를 생성할 수 없다. 

- 비어있는 스키마에서 최신 상태로 마이그레이션 할 수 있다는 설명뿐이다.
  + 참고: [Alembic - 환경 생성](https://alembic.sqlalchemy.org/en/latest/tutorial.html#creating-an-environment)

```shell
$ createdb -e -h minubt -p 5432 -l "C.UTF-8" -T "template0" -O tonyne nfp_db
SELECT pg_catalog.set_config('search_path', '', false);
CREATE DATABASE nfp_db OWNER tonyne TEMPLATE template0 LC_COLLATE 'C.UTF-8' LC_CTYPE 'C.UTF-8';

# nfp_db=> \dt
# Did not find any relations.

$ alembic upgrade head
poetry run alembic upgrade head
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.
INFO  [alembic.runtime.migration] Will assume transactional DDL.
INFO  [alembic.runtime.migration] Running upgrade  -> 127bcea40bef, create notes table

# nfp_db=> \dt
#              List of relations
#  Schema |      Name       | Type  | Owner
# --------+-----------------+-------+--------
#  public | alembic_version | table | tonyne
#  public | notes           | table | tonyne
# (2 rows)
```

> postgresql 커맨드 라인 명령어: createdb, dropdb

```shell
$ createdb -e -h minubt -p 5432 -l "C.UTF-8" -T "template0" -O tonyne nfp_db
SELECT pg_catalog.set_config('search_path', '', false);
CREATE DATABASE nfp_db OWNER tonyne TEMPLATE template0 LC_COLLATE 'C.UTF-8' LC_CTYPE 'C.UTF-8';

$ dropdb -i -e -h minubt -p 5432 -U tonyne nfp_db
Database "nfp_db" will be permanently removed.
Are you sure? (y/n) y
SELECT pg_catalog.set_config('search_path', '', false);
DROP DATABASE nfp_db;
```


#### 도커 스크립트 또는 SQLAlchemy 코드상에서 DB 초기화 가능

도커 스크립트에서 Alembic 으로 테이블을 생성 하거나, <br />
`metadata.create_all(engine)` 으로 테이블을 생성할 수 있다.

- 보통 alembic 사용하고, create_all 은 주석처리를 한다.
  + 예제) [tiangolo/full-stack-fastapi-postgresql - init_db.py](https://github.com/tiangolo/full-stack-fastapi-postgresql/blob/master/%7B%7Bcookiecutter.project_slug%7D%7D/backend/app/app/db/init_db.py#L16)

- 코드 내에서 create_all 로 생성하는 경우,
  + `alembic_version` 테이블을 생성하고 최신 revision 으로 저장

```python
# inside of a "create the database" script, first create
# tables:
my_metadata.create_all(engine)

# then, load the Alembic configuration and generate the
# version table, "stamping" it with the most recent rev:
from alembic.config import Config
from alembic import command
alembic_cfg = Config("/path/to/yourapp/alembic.ini")
command.stamp(alembic_cfg, "head")
```

- 참고: [Building an Up to Date Database from Scratch](https://alembic.sqlalchemy.org/en/latest/cookbook.html#building-an-up-to-date-database-from-scratch)
- 이 외의 Alembic 사용법은 매뉴얼 참고 
  - [Creating an Environment](https://alembic.sqlalchemy.org/en/latest/tutorial.html#creating-an-environment)

```shell
$ alembic init alembic
$ alembic revision -m "create account table"
$ alembic upgrade head   # first migration
$ alembic revision -m "Add a column"   # second migration

$ alembic current
$ alembic history --verbose

$ alembic downgrade -1
$ alembic upgrade +2
```


### 3) Mac M1 (aarch64) 생성시 특이사항

#### poetry 설치 때 gcc 라이브러리(cffi) 가 없다고 오류

- 시스템 패키지 추가 설치
  + build-base : gcc 도구 
  + libffi-dev : cffi 라이브러리

```shell
# ...
      building '_cffi_backend' extension
      creating build/temp.linux-aarch64-cpython-39
      creating build/temp.linux-aarch64-cpython-39/c
      c/_cffi_backend.c:15:10: fatal error: ffi.h: No such file or directory
         15 | #include <ffi.h>
            |          ^~~~~~~
      compilation terminated.
      error: command '/usr/bin/gcc' failed with exit code 1
      [end of output]

  note: This error originates from a subprocess, and is likely not a problem with pip.
error: legacy-install-failure

× Encountered error while trying to install package.
╰─> cffi
```

#### [Uvicorn - Shutdown process is broken](https://github.com/encode/uvicorn/issues/1160)

FastAPI 종료를 위해 'Ctrl+C' 누르면 `asyncio.exceptions.CancelledError` 발생

- FastAPI 이슈는 아니고 Uvicorn 이슈
- Mac M1 특이사항은 아니지만, 아직 해결 안된 이슈라서 기록해 둠

```shell
^CINFO:     Shutting down
INFO:     Finished server process [95782]
ERROR:    Traceback (most recent call last):
  File "..venv/lib/python3.9/site-packages/starlette/routing.py", line 624, in lifespan
    await receive()
  File "..venv/lib/python3.9/site-packages/uvicorn/lifespan/on.py", line 135, in receive
    return await self.receive_queue.get()
  File "..pyenv/versions/3.9/lib/python3.9/asyncio/queues.py", line 166, in get
    await getter
asyncio.exceptions.CancelledError

INFO:     Stopping reloader process [95682]
```


## 2. 완성된 소스파일

- Dockerfile 
  + Mac M1 맥북에서 생성시 509 MB
  + Ubuntu 에서 생성시 **582 MB**
    - 지난번에 bullseye-slim 기반으로 생성한 이미지는 _384 MB_

> 음.. 굳이 번거롭게 alpine 사용할 필요가 없네요.

```dockerfile
FROM python:3.9-alpine

LABEL maintainer="Tonyne@JEJU <tonyne.jeju@gmail.com>"
LABEL description="FastAPI + sqlalchemy + psycopg2 with poetry"

RUN apk update -q
# && apk upgrade -U  <== become later version, ERROR

# export GLIBC_VERSION=2.35-r0 (for alpine 3.16.2)
# https://github.com/sgerrand/alpine-pkg-glibc
ENV GLIBC_VERSION 2.35-r0
RUN wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk && \
    apk add glibc-${GLIBC_VERSION}.apk
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-bin-${GLIBC_VERSION}.apk && \
    wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-i18n-${GLIBC_VERSION}.apk && \
    apk add glibc-bin-${GLIBC_VERSION}.apk glibc-i18n-${GLIBC_VERSION}.apk

# there is no `locale`, but can setup LANG (localedef)
# RUN /usr/glibc-compat/bin/localedef -i en_US -f UTF-8 en_US.UTF-8
RUN /usr/glibc-compat/bin/localedef -i ko_KR -f UTF-8 ko_KR.UTF-8

# install utils: gcc, curl, ping, sudo, vim
RUN apk --no-cache add build-base libffi-dev curl iputils sudo vim
# RUN apk --no-cache add postgresql-client

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

# copy toml and sources
COPY --chown=fastapi $APP_TOML ./pyproject.toml
COPY --chown=fastapi $APP_ROOT ./$APP_ROOT
# make virtualenv in project
RUN poetry config virtualenvs.in-project true
RUN poetry install && poetry run which python

# init latest SCHEMA by alembic after createdb
COPY --chown=fastapi alembic.ini ./
COPY --chown=fastapi alembic ./alembic
# createdb -e -h minubt -p 5432 -l "C.UTF-8" -T "template0" -O tonyne nfp_db
RUN [ -f "alembic.ini" ] && poetry run alembic upgrade head


# multiple ports for concat with blanks
EXPOSE $APP_PORT
ENV PORT $APP_PORT

# poetry run fastapi with uvicorn
CMD poetry run uvicorn $APP_MAIN --app-dir $APP_ROOT --reload --host 0.0.0.0 --port $APP_PORT
#CMD ["/bin/bash"]
```

## 9. Review

- 앞으로는 bullseye-slim 버전으로 갑시다!

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }