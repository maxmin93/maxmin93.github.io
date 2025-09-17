---
date: 2022-08-24 00:00:00 +0900
title: bullseye-slim 기반 poetry + FastAPI 이미지 만들기
description: FastAPI 서버 개발을 위한 Docker 이미지를 생성합니다. (bullseye-slim 버전 기반)
categories: [DevOps, Docker]
tags: ["python", "sqlalchemy", "bullseye", "docker", "poetry", "fastapi"]
image: "https://hasura.io/blog/content/images/downloaded_images/how-to-write-dockerfiles-for-python-web-apps-6d173842ae1d/1-8rsXezmgl9VTA4zqCcUsfw.jpeg"
---

## 개발환경 Docker 이미지

필요시 app 만 개발해서 바로바로 포팅하여 배포할 수 있는 베이스 이미지가 필요하여 작업을 시작했습니다. 설치되는 기본 구성은 다음과 같습니다.

- bullseye-slim (debian 계열)
  + 패키지 관리자: `apt`
  + 기본 shell: `/bin/bash`
- python 3.9
  + 패키지 관리자: `poetry`
- API 웹프레임워크
  + `FastAPI`
  + `uvicorn`
  + `gunicorn`
- DB 어댑터
  + `psycopg2` (Postgresql 접속용)

## 2. Dockerfile 개발

### 1) 작업 순서

1. python3 기본 컨테이너 실행 
2. 개발시 사용할 환경변수와 패키지들을 모조리 셋팅
3. 적용된 항목들을 고정과 가변 그룹으로 정리
4. 고정 그룹은 Dockerfile 에, 가변 그룹은 entrypoint 로 저장
5. 최종 실행 CMD 를 선언하고, 이미지 빌드
6. 환경변수 연결하고 컨테이너 실행/테스트
7. 완료된 소스는 문서화 하여 github 업로드

### 2) Docker 이미지 빌드 와 컨테이너 실행

#### 도커

-  `-it` 옵션 사용시 실행 로그가 보여서 좋다

```shell
# 빌드
$ docker build -t py39-api:latest --no-cache . 

# 실행
$ docker run -it --rm --name py39-api -p 58000:8000 \
    -e CONN_URL=postgresql://db_user:db_passwd@192.168.0.x/tempdb \
    py39-api
```

#### 실행화면

```shell
... # (생략)

Step 28/29 : ENTRYPOINT ["/entrypoint.sh"]
 ---> Running in 5b3a52b39950
Removing intermediate container 5b3a52b39950
 ---> 3fba5a2340b4
Step 29/29 : CMD poetry run uvicorn $APP_MAIN --app-dir $APP_ROOT --reload --host 0.0.0.0 --port $APP_PORT
 ---> Running in 95c601cb34dc
Removing intermediate container 95c601cb34dc
 ---> 3c8147accfe0
Successfully built 3c8147accfe0
Successfully tagged py39-api:latest

... # (생략)

#########################
##  TEST: psycopg2.connect

TEST: psycopg2.connect
2022-09-20 15:01:27
==> success!

** OK, ready to FastAPI
poetry run uvicorn main:app --app-dir app --reload --host 0.0.0.0 --port 8000

INFO:     Will watch for changes in these directories: ['/backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [113] using StatReload
INFO:     Started server process [117]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     172.17.0.1:33898 - "GET / HTTP/1.1" 200 OK
INFO:     192.168.0.50:51905 - "GET / HTTP/1.1" 200 OK
INFO:     192.168.0.50:51905 - "GET /favicon.ico HTTP/1.1" 404 Not Found
...
```

### 3) 완성된 소스: Dockerfile + entrypoint.sh

- localdef : 한국어 locale 설정 (언어별 시간, 돈, 메시지 등의 포맷)
- 생성된 image size = __355 MB__

#### 고정: 설치된 시스템 패키지 (apt)

- curl : API 테스트 및 유틸리티 설치용
- iputils-ping : 네트워크 잡히는지 ping 사용 목적
- vim : 기본 에디터
- git : 소스 설치용
- poetry (curl 이용해 설치)

#### 소스) Dockerfile

```dockerfile
FROM python:3.9-slim

LABEL maintainer="Tonyne@JEJU <tonyne.jeju@gmail.com>"
LABEL description="FastAPI + sqlalchemy + psycopg2 with poetry"

ADD entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN apt-get update && apt-get upgrade -y

# install utils: localedef, curl, sudo, ping, vim, git
RUN apt-get install -y locales curl sudo iputils-ping vim git

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

# add USER as sudoer with GROUP
RUN groupadd --system -g 1001 $GRP
RUN useradd --system -m -s /bin/bash -g $GRP -u 1001 -c "Python User" $USR
RUN usermod -aG sudo $USR


USER $USR
ENV HOME "/home/$USR"
ENV VENV_PATH=$HOME/.local
ENV EDITOR vim

# for root
RUN echo $'             \n\
alias ll="ls -al"       \n\
alias vi="vim"          \n\
export PATH=$PATH:$VENV_PATH/bin' >> $HOME/.bashrc

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

# poetry run alembic upgrade head after launched ALL
# COPY --chown=fastapi alembic.ini ./
# COPY --chown=fastapi alembic ./alembic

# for install requirements.txt
ENTRYPOINT ["/entrypoint.sh"]


# multiple ports for concat with blanks
EXPOSE $APP_PORT
ENV PORT $APP_PORT

# poetry run fastapi with uvicorn
CMD poetry run uvicorn $APP_MAIN --app-dir $APP_ROOT --reload --host 0.0.0.0 --port $APP_PORT
```

#### 가변: 설치할 python 패키지 (poetry)

- `cat requirements.txt | xargs poetry add`
  + requirements.txt 읽어서 설치
  - 주석처리 '^#' 제외

- "fastapi[all]" 은 fastapi + uvicorn 통합 패키지
  + 참고: [FastAPI 공식문서 - 설치](https://fastapi.tiangolo.com/tutorial/#install-fastapi)
    * 프레임워크 fastapi 와 서버 uvicorn 도 설치해야 함

#### 소스) entrypoint.sh

```shell
#!/bin/bash

# stop script on ERROR
set -e

# install dependencies
if [ -z "$APP_DEPS_INSTALL" ]; then
  # default
  poetry add psycopg2-binary sqlalchemy fastapi
else
  # from requirements.txt
  grep -v -e '^#' $APP_DEPS_INSTALL | xargs poetry add
fi

echo ""
poetry show -l    # 설치된 패키지 리스트
echo ""

# test psycopg2 with conn_url
if [ ! -z "$CONN_URL" ]; then
  echo -e "\n#########################"
  echo -e "##  TEST: psycopg2.connect\n"

  mkdir -p /tmp/python
  cat <<EOF > /tmp/python/conn-test.py
import datetime
import psycopg2
print("TEST: psycopg2.connect")

try:
  conn = psycopg2.connect("$CONN_URL")
except (psycopg2.OperationalError, psycopg2.Error) as e:
  print(f"{type(e).__module__.removesuffix('.errors')}:{type(e).__name__}: {str(e).rstrip()}")
  print(f"==> FAIL: {e}")
  sys.exit(1)

with conn.cursor() as cur:
  cur.execute("select now()")
  now_dt, *_ = cur.fetchone()
  print(now_dt.strftime("%Y-%m-%d %H:%M:%S"))

conn.close()
conn = None
print("==> success!")
EOF
  poetry run python /tmp/python/conn-test.py
fi

echo -e "\n** OK, ready to FastAPI"
echo -e "poetry run uvicorn $APP_MAIN --app-dir $APP_ROOT --reload --host 0.0.0.0 --port $APP_PORT \n\n"

# continue to next CMD with this shell
exec "$@"
```


## 3. 단계별 설명

### 1) 도커 [bullseye + python 3.9](https://hub.docker.com/_/python) 작업

#### 기본 환경변수 설정하여 bash 접속

- 시간대(TZ): Asia/Seoul
- 언어(locale): LANG=C.UTF-8, LC_ALL=C.UTF-8
  - 기본 로케일이지만 UTF-8 이라서 모든 언어 표현 가능
  - 필요한 경우에만 ko_KR.UTF-8 사용 (약간의 성능/기능 제한 있음)

```shell
$ docker run -it --rm --name nfp-api -p 58000:8000 \
    -e TZ=Asia/Seoul -e LANG=C.UTF-8 -e LC_ALL=C.UTF-8 \
    python:3.9-slim bash
```

#### 참고: 도커의 ENV 명령

도커에서는 `ENV` 명령으로 로그인 쉘 안에서 사용되는 사용자 환경설정만 함

- 저장되지 않고
- 시스템 전체가 아닌 도커가 실행되는 환경에만 영향

#### 참고: [리눅스 환경변수 설정](https://pimylifeup.com/environment-variables-linux/)

일반적으로 `/etc/profile` 사용 (`/etc/environment` 는 사용 안함)

1. `/etc/environment` : 시스템 전체 환경 (`export` 안씀)
2. `/etc/profile` : 로그인 쉘에 들어갈 때 적용되는 시스템 전체 환경
3. `~/.profile` : 사용자 환경
4. `~/.bashrc` : 사용자 환경


### 2) 환경변수 설정 및 시스템 설정

- 스크립트 변수가 설정 안된 경우 기본값 설정
  + ${`변수`:-`기본값`}
  + bash script 사용법과 동일
- `ARG` 는 docker 의 `--build-arg` 옵션에서 지정
- `pm2` 으로도 python 스크립트를 실행/관리할 수 있다

```dockerfile
# for pm2: --build-arg BUILD_DEV_MODE=development
ARG BUILD_DEV_MODE
ENV NODE_ENV=${BUILD_DEV_MODE:-production}

# default value
ENV APP_PORT ${APP_PORT:-8000}
ENV APP_ROOT ${APP_ROOT:-app}
ENV APP_MAIN ${APP_MAIN:-main:app}
ENV APP_DEPS_INSTALL ${APP_DEPS_INSTALL:-requirements.txt}

# install poetry
ENV PATH="${PATH}:/root/.local/bin"
```

- Error: ENV PATH="/root/.local/bin:`$PATH`"
  + Command not found 발생: 왜 안되는지 이해가 안간다
    * 외부 명시가 아니라 내부에서 가변으로 생성된 값을 사용하기 때문이 아닌지 짐작할 뿐
  + Stackoverflow 에서 PATH 를 앞쪽으로 옮기라고 권함
    * ==> ENV PATH="`${PATH}`:/root/.local/bin"

#### 3) 멀티라인 문자열 입력

- `RUN echo $'` 로 시작
- 매 줄마다 끝에 `\n\` 추가
- ' > ~/.bashrc 로 종료

```dockerfile
RUN echo $'             \n\
alias ll="ls -al"       \n\
alias vi="vim"          \n\
' > ~/.bashrc
```

### 4) 시스템 패키지 설치

#### build 중에 빨간 메시지 ".. since apt-utils is not installed" 무시!

오류가 아니니 무시하는게 최선입니다.

- 참고: [debconf: delaying package configuration, since apt-utils is not installed](https://stackoverflow.com/a/51023393)

아래쪽 솔루션을 적용해 보았지만, 소용없음

```dockerfile
# not working
RUN DEBIAN_FRONTEND=noninteractive apt-get -yq install {your-pkgs}
```

### 5) Docker 명령어

#### RUN 명령어

- Error: RUN `echo "which: $(which python)"`
  - 내부에 sh 스크립트가 한번 더 돌면서 가변 정보가 생기는 형식은 안됨

#### CMD 명령어

- 배열 형식을 권장하는데

- Error: CMD ["uvicorn","main:app","--port", 8000]
  - port 에 integer 타입을 넣어야 하는데 배열로 넣으면 모두 문자열이 됨
  - 통짜 문자열로 넣는 수밖에 없음
    + CMD `uvicorn main:app --port 8000`

- Error: CMD ["poetry","shell"]
  + 컨테이너에서 내부에 또다른 (이중) 쉘을 실행 수 없다

#### ENTRYPOINT 명령어

- 실행 가능 파일이어야 한다: `chmod +x entrypoint.sh`
  - 앞에서 ADD 명령으로 파일을 이미지 내부에 저장

### 6) psycopg2 Catch Exception

환경 변수에 CONN_URL 이 있으면 DB 접속 테스트도 하도록 작성했음

- 오류 발생하면 메시지 출력해서 문제를 해결할 수 있도록 함
- 참고: [Getting error messages from psycopg2 exceptions](https://splunktool.com/getting-error-messages-from-psycopg2-exceptions)

```python
import datetime
import psycopg2
print("TEST: psycopg2.connect")

try:
  conn = psycopg2.connect("$CONN_URL")
except (psycopg2.OperationalError, psycopg2.Error) as e:
  print(f"{type(e).__module__.removesuffix('.errors')}:{type(e).__name__}: {str(e).rstrip()}")
  print(f"==> FAIL: {e}")
  sys.exit(1)

# open and close
with conn.cursor() as cur:
  cur.execute("select now()")
  now_dt, *_ = cur.fetchone()
  print(now_dt.strftime("%Y-%m-%d %H:%M:%S"))

conn.close()
conn = None    # 메모리 해제

print("==> success!")
```

### 7) `exec "$@"` 의미

- 참고: [2022-08-14 포스트 - set -e 와 exec "$@"](/posts/postgres-tz-locale-setup/#dollar_n_atsign)

## 9. Review

- 휴, 드디어 밀린 숙제(2)를 해치웠다.
  - 필요할 때 처음부터 만들려고 하면 또 얼마나 시간 잡아 먹겠냐!
  - 복붙할 수도 있지만, 남의 코드라 항상 신경쓰일 것이다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }