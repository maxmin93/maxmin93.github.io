---
date: 2022-08-26 00:00:00 +0000
title: 맥 M1 alpine 기반 poetry + FastAPI 이미지 만들기
categories: ["python"]
tags: ["개발환경", "alpine", "aarch64", "docker", "poetry", "fastapi"]
---

> 파이썬 alpine 이미지로 poetry + FastAPI 배포용 Docker 이미지를 생성합니다. (sqlmodel, psycopg2 포함)
{: .prompt-tip }

## 이전에 만들었던 이미지에 이어서 alpine 버전

그러나 사이즈가 줄지는 않네요. 오히려 더 커졌어요. (뭐 이런~ xx)

- 작은 사이즈가 강점인데 만들고 나니 **509 MB**
  + 지난번 것은 _376 MB_

```bash
$ docker build -t py39-alpine:latest --no-cache .

$ docker run -it --rm --name py39-alpine -p 58000:8000 \
    py39-alpine
# ...
INFO:     Will watch for changes in these directories: ['/backend']
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [1] using StatReload
INFO:     Started server process [10]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     172.17.0.1:59788 - "GET / HTTP/1.1" 200 OK    
```

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

#### requirements.txt 필요

poetry 명세 파일인 pyproject.toml 말고 requirements.txt 활용

- 개발 소스에서 requirements.txt 를 생성해 두어야 함
  + 참고: [poetry export requirements.txt](https://python-poetry.org/docs/cli/#export)

### 3) Mac M1 (aarch64) 생성시 특이사항

#### poetry 설치 때 gcc 라이브러리(cffi) 가 없다고 오류

- 시스템 패키지 추가 설치
  + build-base : gcc 도구 
  + libffi-dev : cffi 라이브러리

```bash
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
ENV APP_DEPS_INSTALL ${APP_DEPS_INSTALL:-requirements.txt}

# for pm2: --build-arg BUILD_DEV_MODE=development
ARG BUILD_DEV_MODE
ENV NODE_ENV=${BUILD_DEV_MODE:-production}


RUN addgroup --system --gid 1001 $GRP
RUN adduser --system --uid 1001 -G $GRP -s /bin/bash $USR
RUN echo "$USR ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

RUN mkdir /backend
RUN chown -R $USR:$GRP /backend


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

# makedir '/backend/app' with pyproject.toml
RUN poetry new backend --name $APP_ROOT

WORKDIR backend
COPY $APP_DEPS_INSTALL ./$APP_ROOT ./

# cannot use 'poetry shell', but use 'poetry run'
RUN poetry install && poetry run which python
# poetry export -f requirements.txt --output requirements.txt
RUN grep -v -e '^#' $APP_DEPS_INSTALL | xargs poetry add


# multiple ports for concat with blanks
EXPOSE $APP_PORT
ENV PORT $APP_PORT

# poetry run fastapi with uvicorn
CMD poetry run uvicorn $APP_MAIN --app-dir $APP_ROOT --reload --host 0.0.0.0 --port $APP_PORT
#CMD ["/bin/bash"]
```

> Summary

- 앞으로는 bullseye-slim 버전으로 갑시다!

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }