---
date: 2025-09-30 00:00:00 +0900
title: TrueNAS 에 Docker 로 Apache 설치하기
description: 도메인과 nginx 프록시 매니저도 설치되어 있기 때문에 웹서버만 띄우면 개인 홈페이지도 운용할 수 있다. Ubuntu 버전 Apache2 를 도커로 설치해보자.
categories: [DevOps]
tags: [truenas, install, docker]
image: "https://forums.truenas.com/uploads/default/optimized/2X/3/39fe5131869649c438bf985b0228cefb42ccd20d_2_690x338.png"
---

> 목록
{: .prompt-tip }

- [TrueNAS 와 Application 설치하기](/posts/truenas-install-applications/)
- [TrueNAS 에 Docker 로 Apache 설치하기](/posts/truenas-install-docker-apache/) &nbsp; &#10004;


Apache2 는 TrueNAS 공식 앱스토리지에 없다. Docker 를 이용해 별도로 실행해야 한다. 이를 위해서 먼저 Portainer 를 설치하고, DockerHub 를 통해 Apache2 이미지를 받는다. 설정과 함께 간단한 웹페이지를 띄워 보자.


## 0. 작업순서

1. Portainer 설치
2. apache2 의 `/var/www/html` 를 마운트할 Dataset 생성
  - 간단한 index.html 작성
  - chown 권한 부여
3. ubuntu-apache2 를 위한 스택(yml) 작성
  - port 와 volume 설정
4. ubuntu-apache2 스택 실행하고, 웹페이지 확인
5. Tailscale 설치하고 VPN으로 접속하기


## 1. Portainer 설치

먼저 configs 아래에 portainer 를 위한 Dataset(폴더)를 생성하자.

```text
🗁 disk0
    │
    └── configs
          ├── ...
          └── portainer
```

TrueNAS APP 에서 Portainer 를 검색하고 설치한다.

- Application Name : Portainer
- Image : Portainer Community Edition
- WebUI Port : 31015 (기본값)
- Portainer Data Storage : 직접 지정
  - 아까 만든 `/mnt/data0/config/portainer` 를 선택

앱이 정상적으로 동작하면 'WebUI' 버튼을 누른다.

- 첫화면에서 'admin' 의 비밀번호를 설정한다.
- Home 에서 local 환경을 선택해서 들어간다.

### DockerHub Registry 등록

- 'Host > Registries' 에서 'Add registry' 를 선택
- 이미지를 가져올 provider 를 선택 : [DockerHub](https://hub.docker.com/)
- 생성할 Registry 이름과 DockerHub 의 uername, accessToken 을 입력

> DockerHub 의 access token 생성 방법

- DockerHub 로그인 후 프로파일의 'Account Settings' 메뉴 선택
- 'Personal access tokens' 메뉴에서 token 생성 버튼을 클릭
- 'Public Repo Read-only' 권한으로 유효기간 없이 생성


## 2. ubuntu-apache2 실행

TrueNAS 가 debian 계열 리눅스라 [Ubuntu/Apache2](https://hub.docker.com/r/ubuntu/apache2)를 선택했다.

- 💿 [ubuntu/apache2 이미지](https://hub.docker.com/r/ubuntu/apache2)
  - `httpd:2.4` 와는 conf 와 html 위치가 다르다.

### html 폴더 생성

웹페이지 작성과 배포가 쉽도록 `$HOME` 위치에 두었다.

```text
🗁 disk1
    │
    └── home
          └── user1
                └── html    # index.html
```

쉽게 vi 로 편집하고 scp 로 복사해 넣을 수 있다.

### Portainer Stack 생성

```yml
version: '3.8'

services:
  web:
    image: ubuntu/apache2:latest
    environment:
      - TZ=Asia/Seoul
    ports:
      - "8088:80"
    volumes:
      - /mnt/disk1/home/user1/html:/var/www/html/
    restart: unless-stopped
```

실행해 보자.

![](/2025/09/30-truenas-portainer-stacks.webp){: width="580" .w-75}
_Portainer 에서 실행된 ubuntu-apache2 스택_

웹브라우저에서 `{host}:8088` 를 호출하자.

### html 권한 문제 해결

호스트의 8088 포트를 접속하니 웹페이지 오류가 떴다.

```text
Forbidden

You don't have permission to access this resource.
```

컨테이너 로그를 살펴보면 다음과 같이 나온다.

```text
AH00132: file permissions deny server access "/var/www/html/index.html"
```

> TrueNAS 에는 이미 `www-data`(UID=33) 계정이 있다.

Apache2 는 www-data 권한으로 실행된다. 소유권을 변경해 준다.

```console
$ ssh user1@mynas

$ chown -R www-data:www-data ~/html

$ ll
...
drwxrwxr-x  2 www-data www-data      4 Sep 30 16:17 html
...
```

![](/2025/09/30-truenas-users.webp){: width="580" .w-75}
_TrueNAS에 생성되어 있는 계정들_


## 3. Nginx proxy manager 에 웹페이지 등록

도메인으로 접속할 수 있도록 `www.jeju.onl` 로 등록했다.

![](/2025/09/30-apache-index-html.webp){: width="380" .w-75}
_도메인이 부여된 Apache2 웹페이지_


## 9. Reviews

- 개인 서버에서 간단하게 웹페이지를 운용하게 되었다.
  - AWS Lightsail 의 개발용 서버를 중단했다. 돈 절약했다.
- `apache2.conf` 를 조작해 보려 했으나 복잡해서 관두었다.
  - 도커 작업은 최대한 단순하고 손 안내는게 최고다.
- Svelte Application 을 연결하는 작업을 해보자.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
