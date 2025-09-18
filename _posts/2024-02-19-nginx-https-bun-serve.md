---
date: 2024-02-19 00:00:00 +0900
title: Nginx HTTPS Bun Serve
description: Bun + Elysia 조합으로 API 를 제공하려고 한다. SSL 설정과 함께 nginx 에서 서브 디렉토리에 port forwarding 설정을 하는 방법을 정리한다.
categories: [Backend, Network]
tags: ["nginx","https","elysia"]
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtltoIcEP5lsu65rqH8t7E7BR8Ygqh06l8DTGQ3nOxta8ExZAfRDyvmYiXblZ-kbnTQhw"
---

## 1. [Nginx](https://nginx.com) 사용법

참고 : [Nginx 도메인 + SSL + Node App 설정](/posts/nginx-conf-multiple-domains/)

- 이전에 작성해 둔 포스트가 있지만, 잡스러운 내용이 많아 보기 힘들었다.
- 복잡한 것은 운영만 힘들어지고 골치 아파져서 단순하게 사용하려 한다.

### 가이드

- 서브 도메인은 1차만 가능하고, 도메인에 대한 라우팅은 DNS 가 담당한다.
  - 서브 도메인의 서브 도메인을 설정하지 말고, 그냥 서브 도메인을 DNS 에 등록하자.
  - dev.api.domain.com 을 호출한다고 찾다가 못찾으면 디폴트로 api.domain.com 으로 가는 방법은 없다.

- nginx 서비스는 서버 이름과 port 를 기준으로 listening 한다.
  - 동일 포트에 다른 서버 이름으로 여러 가상 호스트를 사용할 수 있다.

#### 용어

> upstream

- 서버 그룹을 정의한다. 이름이 중복되면 failed 되니깐 주의할 것!
- 도메인 설정 파일에서 작성한다. (nginx.conf 에서는 안됨)
- proxy_pass 의 대상으로 네이밍을 사용할 수 있다.
- 로드 밸런싱을 할 때에는 여러 서버를 추가하여 사용한다.

> `ipv6only=on`

- 이것이 있으면 동일 포트에 다른 서버 이름을 사용할 수 없다. (삽질의 원인)
- 이미 nginx 1.3.4 에서 기본값 `on` 으로 설정된 옵션이라 쓸 필요 없다.

> $http_upgrade

- WebSocket 을 위한 설정 (hop-by-hop 헤더 사용)
- Upgrade 와 Connection 헤더가 필요하다.


## 2. [Nginx](https://nginx.com) 구성

하나의 물리적 서버에서 두개의 도메인을 설정하려고 한다. 

- certbot 으로 인증서 두개를 받아놓은 상태
- 둘 다 동일한 80 포트와 443 포트를 사용한다.

### 구조

> `/etc/nginx/nginx.conf`

- (최상위) http 프로토콜 수준에서 설정한다.
- sites-enabled 의 conf 파일을 포함한다.

> `/etc/nginx/sites-enabled`

- 가상 호스트를 설정 파일을 link 로 등록한다.
  - nginx 시작시 있으면 읽어들이는 것이고, 없으면 다루지 않는다.
- 가상 호스트는 server_name, port 기준으로 listen 한다.

> `/etc/nginx/sites-available`

- 도메인 단위로 설정 파일을 작성한다. (설정 파일 안에서 여러 port 를 설정)
- 443 포트를 우선 작성하고, 이후 80 포트를 작성하자.
- if 문 처리는 가급적 피하자. (도메인 분기할 바에는 도메인별 설정 파일을 작성)
  - https 강제 전환시, 80 포트 서버 블록에서 그냥 redirect 시켜버리자
  - redirect : 301 permanent, 302 temporary

```text
sub1.domain.com
  - port=443, server_name=sub1.domain.com
  - port=80, server_name=sub1.domain.com
    - return 301 https://$host$request_uri;

sub2.domain.com
  - port=443, server_name=sub2.domain.com
  - port=80, server_name=sub2.domain.com
    - location /
      - return 404;

default
  - port=80, server_name=_
```

- sub1.domain.com 의 http 접근은 https 로 redirect
- sub2.domain.com 의 / 접근은 차단
  - 또는 `return 401 "Access denied"`;

### 예제

> default

```text
server {
    listen 80;
    listen [::]:80;

    server_name _;

    root /var/www/example.com;
    index index.html;

    location / {
           try_files $uri $uri/ =404;
    }
}
```

> sub1.domain.com

```text
# server groups (그룹명 중복되면 failed 됨)
upstream online {
    server 127.0.0.1:3000;
}

server {
    listen [::]:443 ssl;
    listen 443 ssl;

    server_name sub1.domain.com;

    root /var/www/sub1.domain.com/html;
    index index.html index.htm index.nginx-debian.html;

    location / {
        try_files $uri $uri/ =404;
    }

    ssl_certificate /etc/letsencrypt/live/sub1.domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sub1.domain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location /online {
        rewrite ^/online/(.*)$ /$1 break;
        proxy_pass https://online;

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $http_host;
        proxy_cache_bypass $http_upgrade;
    }

    # add slash at last
    location ~ ^([^.\?]*[^/])$ {
        rewrite ^([^.]*[^/])$ $1/ permanent;
    }
}

server {
    listen [::]:80;
    listen 80;

    server_name sub1.domain.com;

    return 301 https://$host$request_uri;
}     
```


## 3. elysia.js + bun + ssl

### [ElysiaJS quick start](https://elysiajs.com/quick-start.html#automatic-installation)

```ts
// src/index.ts
import { Elysia } from "elysia";

const app = new Elysia()
  .get("/", () => "Hello Elysia with SSL");

const sslCertPath = '/etc/letsencrypt/live/도메인/fullchain.pem';
const sslKeyPath = '/etc/letsencrypt/live/도메인/privkey.pem';

const server = Bun.serve({
  hostname: '0.0.0.0',
  port: 3000,
  fetch: (request) => app.handle(request),
  tls: {
    cert: Bun.file(sslCertPath),  // cert.pem
    key: Bun.file(sslKeyPath),    // key.pem
  },
});

console.log(
  `🦊 Elysia is running at ${server.hostname}:${server.port}`
);
```

### cert 파일 permission

참고 : [Giving Node.js access to certificate/private key](https://stackoverflow.com/a/72807488)

nodejs 로 웹서비스 제공시 ssl 파일들을 읽는 권한이 필요하다. chmod 755 를 하는 방법도 있지만 보안상 별도의 group 을 이용해 관리하는 방법이 적절하다.

```bash
sudo groupadd certAccess
sudo usermod -a -G certAccess YOUR_USER
# logout and login

sudo chown -R root:certAccess /etc/letsencrypt/live/
sudo chown -R root:certAccess /etc/letsencrypt/archive/

sudo chmod -R 754 /etc/letsencrypt/live/
sudo chmod -R 754 /etc/letsencrypt/archive/
```

### nginx config file

- [path 의 끝에 슬래쉬(/)를 생략하면 제대로 찾지를 못해 rewrite 문을 추가했다.](https://stackoverflow.com/a/16640381)
  - `/myrest/do?d=12345` 같은 queryString 도 알아서 붙여준다.

```text
    location /node {
        location /node/app {
            rewrite ^/node/app/(.*)$ /$1 break;
            proxy_pass https://127.0.0.1:3000;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $http_host;
            proxy_cache_bypass $http_upgrade;
        }
    }            

    # add slash at last
    location ~ ^([^.\?]*[^/])$ {
        rewrite ^([^.]*[^/])$ $1/ permanent;
    }
```


## 9. Review

- 애초 생각했던대로 작동되는 것이었는데, `ipv6only=on` 때문에 하루 삽질했다.
- 한동안 잊고 살았는데, 정말 잊어버렸다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
