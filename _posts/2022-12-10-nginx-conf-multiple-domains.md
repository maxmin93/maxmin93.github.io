---
date: 2022-12-10 00:00:00 +0900
title: Nginx 도메인 + SSL + Node App 설정
description: Nginx 를 이용해 multiple domains 과 ssl 설정을 해보자. 그리고 nodejs, svelte, react 등의 application 에 대해 proxy 설정도 다룬다.
categories: [Backend, Network]
tags: [nginx, proxy, domain, certbot]
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtltoIcEP5lsu65rqH8t7E7BR8Ygqh06l8DTGQ3nOxta8ExZAfRDyvmYiXblZ-kbnTQhw"
---

## 1. [Nginx](https://nginx.com) 설정

참고 [Configuring multiple subdomains on an NGINX webserver](https://auro.technology/blog/configuring-multiple-subdomains-on-an-nginx-webserver)

### 1) nginx 설정

> nginx version: nginx/1.22.0

```shell
$ nginx -version
nginx version: nginx/1.22.0

$ sudo cp /etc/nginx/nginx.conf.default /etc/nginx/nginx.conf
$ sudo vi /etc/nginx/nginx.conf
```

#### nginx.conf

계층적으로, 순서적으로 설정값이 패턴 매칭으로 적용된다.

- http 프로토콜
  + server 규칙
    * listen 80 : 포트 패턴
    * server_name <domain> : 도메인 패턴
    * root 디렉토리 : 여기 없으면 location 에서 설정
    * location 패스 : URL
      - root 또는 alias

```conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/doc/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
  # 솰라솰라.. (기본 설정 그대로 두고)

  server {
    listen       80;
    listen       [::]:80;    
    server_name  jeju.onl www.jeju.onl;
    root         /var/www/html;

    autoindex off;
    location / {
      index    index.html;
    }

    error_page 404 /404.html;
    location = /40x.html {
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
    }
  }
}
```
{: file="nginx.conf"}

#### nginx 설정 확인 (테스트 옵션)

```shell
$ sudo nginx -t
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 2) html 파일 위치

기본으로 `/usr/share/nginx/html` 디렉토리가 web root 위치로 잡혀 있는데, 사용하면 안된다. 왜냐하면 upgrade 되면서 html 파일들이 변경되어 버리기 때문이다.

```shell
$ sudo mkdir -p /var/www/html
$ sudo cp index.html /var/www/html
```

### 3) certbot 으로 ssl 인증서 생성

dry-run 으로 테스트한 후, dry-run 없이 실적용

```shell
$ sudo systemctl stop nginx
$ sudo certbot certonly -d jeju.onl -d www.jeju.onl --dry-run
Saving debug log to /var/log/letsencrypt/letsencrypt.log

How would you like to authenticate with the ACME CA?
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
1: Spin up a temporary webserver (standalone)
2: Place files in webroot directory (webroot)
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
Select the appropriate number [1-2] then [enter] (press 'c' to cancel): 1
Plugins selected: Authenticator standalone, Installer None
Simulating a certificate request for jeju.onl and www.jeju.onl
Performing the following challenges:
http-01 challenge for jeju.onl
http-01 challenge for www.jeju.onl
Waiting for verification...
Cleaning up challenges

IMPORTANT NOTES:
 - The dry run was successful.

$ sudo certbot certonly -d jeju.onl -d www.jeju.onl
# ==> 실제 적용

$ sudo systemctl start nginx
$ sudo systemctl status nginx
```

#### ssl 인증서 갱신

인증 기한이 3개월 밖에 안되기 때문에, 재갱신 작업을 매월 수행해야 함

```shell
$ sudo systemctl stop nginx
$ sudo certbot certonly --force-renew --standalone -d demo.jeju.onl
$ sudo systemctl start nginx
```

### 4) ssl 적용

생성된 ssl 인증서를 사용하여 HTTPS(443 포트) server 설정

```conf
http {
  # ...
  server {
    listen       443 ssl http2;
    listen       [::]:443 ssl http2;
    server_name  jeju.onl;
    root         /var/www/html;

    ssl_certificate "/etc/letsencrypt/live/jeju.onl/fullchain.pem";
    ssl_certificate_key "/etc/letsencrypt/live/jeju.onl/privkey.pem";
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DH+3DES:!ADH:!AECDH:!MD5;

    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 10m;
    ssl_prefer_server_ciphers on;

    autoindex off;
    location / {
        index    index.html;
    }
  }
}    
```

### 5) 문제 해결

#### 404 forbidden

- `/var/www` 을 root 디렉토리로 삼으면 대부분의 문제 해결됨
- 권한 문제인 경우 => `sudo chown -R root:root /var/www`
- 속성 문제인 경우 => `sudo chmod -R 755 /var/www` 
  + 모두 755 거나, 또는 디렉토리만 755 (파일은 644)로 설정하면 된다.

## 2. 멀티 도메인 설정

server 단위로 server_name 을 필요한만큼 정의하면 됨

- https://jeju.onl
  + http://jeju.onl, http://www.jeju.onl, https://www.jeju.onl
- http://demo.jeju.onl
- http://test.jeju.onl

### 1) nginx.conf

```conf
http {
  # https://jeju.onl
  server {
    listen 80;
    server_name jeju.onl www.jeju.onl;
    return 301 https://jeju.onl$request_uri;
  }
  server {
    listen 443 ssl http2;
    server_name jeju.onl;
    root /var/www/html;

    # ssl 설정 ...

    autoindex off;
    location / {
      index index.html;
    }
  }
  server {
    listen       443 ssl http2;
    listen       [::]:443 ssl http2;
    server_name  www.jeju.onl;
    return 301 https://jeju.onl$request_uri;
  }

  # http://demo.jeju.onl
  server {
    listen 80;
    server_name demo.jeju.onl;
    root /var/www/demo.jeju.onl/html;
    
    autoindex off;
    location / {
      index index.html;
    }
  }

  # http://test.jeju.onl
  server {
    listen 80;
    server_name test.jeju.onl;
    root /var/www/test.jeju.onl/html;
    
    autoindex off;
    location / {
      index index.html;
    }
  }
}
```

### 2) 문제 해결

#### ssl_certificate 가 정의되지 않았음

첫번째로 나오는 HTTPS(443 포트) 설정에 ssl 설정 옵션이 명시되어야 함

- 리다이렉션 먼저 설정한다고 www.jeju.onl 에 대한 443 포트 server 규칙이 먼저 명시되면 이와 같은 오류 메시지가 나옴

```shell
$ sudo nginx -t
nginx: [emerg] no "ssl_certificate" is defined for the "listen ... ssl" directive in /etc/nginx/nginx.conf:46
nginx: configuration file /etc/nginx/nginx.conf test failed
```

## 3. node 애플리케이션을 위한 proxy 설정

### 1) 웹페이지 + API

- 웹페이지 test.jeju.onl
- API
  + /api/app1
  + /api/app2

> /api 안에 /app1 경로가 정의되는 형태를 nested location 이라 한다.

> 다양한 location 이 필요한 경우 정규식 패턴을 사용할 수 있지만, 고정된 경우 절대경로 라우팅이 더 빠르다.

```conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

events {
  worker_connections 1024;
}

http {
  # test.jeju.onl
  server {
    listen       80;
    listen       [::]:80;
    server_name  test.jeju.onl;

    autoindex off;
    location / {
        root /var/www/test.jeju.onl/html;
        index   index.html;
    }

    location /api {
      # 프락시 버퍼 사이즈를 적당이 늘려준다.
      # ==> 최신 버전에서는 없어도 잘 된다.      
      #proxy_buffer_size          128k;
      #proxy_buffers              4 256k;
      #proxy_busy_buffers_size    256k;

      #proxy_http_version 1.1;
      #proxy_set_header Upgrade $http_upgrade;
      #proxy_set_header Connection 'upgrade';
      #proxy_set_header Host $host;
      #proxy_cache_bypass $http_upgrade;

      location /api/app1 {
          proxy_pass http://127.0.0.1:3001/;
      }
      location /api/app2 {
          proxy_pass http://127.0.0.1:3002/;
      }
    }
  }
}
```

### 2) nginx 로드밸런서

Round-robin 방식으로 web1~n 을 순환하며 호출된다.

```conf
upstream loadbalancer {
  server web1:5000;
  server web2:5000;
}

server {
  listen 80;
  server_name localhost;
  location / {
    proxy_pass http://loadbalancer;
  }
}
```

### 3) Svelte 에서 base path 설정

App 을 sub-path 에 매칭하기 위해서는 app 의 base path 설정이 필요하다.

- `localhost:4173/app/todo` 에서 실행되는지 확인하고
- nginx 의 /app/todo 에 Svelte App 연결

> base path 설정 안하면, 기본 '/'를 사용하기 때문에 css, js 파일 등의 assets 로딩이 실패한다.
 
#### svelte.config.js 설정

참고 [Dev server does not apply base path correctly #2958](https://github.com/sveltejs/kit/issues/2958#issuecomment-993442115)

```js
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      base: '/demo'
    }
  }
};
```

#### nginx.conf

```conf
http {
  server {
    listen       80;
    listen       [::]:80;
    server_name  test.jeju.onl;

  location /app {
    location /app/todo {
      proxy_pass http://127.0.0.1:4173/app/todo;
    }
  }
}
```

### 4) ssl 인증서 설정 (HTTPS)

```conf
http {
  upstream backend {
    server 127.0.0.1:3001 weight=2;
    server 127.0.0.1:3000;
  }

  # demo.jeju.onl
  server {
    listen       443 ssl http2;
    listen       [::]:443 ssl http2;
    server_name  demo.jeju.onl;

    ssl_certificate "/etc/letsencrypt/live/demo.jeju.onl/fullchain.pem";
    ssl_certificate_key "/etc/letsencrypt/live/demo.jeju.onl/privkey.pem";
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDH+AESGCM:ECDH+AES256:ECDH+AES128:DH+3DES:!ADH:!AECDH:!MD5;

    ssl_session_cache shared:SSL:1m;
    ssl_session_timeout 10m;
    ssl_prefer_server_ciphers on;

    location / {
        root /var/www/test.jeju.onl/html;
    }
    location /api/backend/ {
        proxy_pass http://backend/;
    }
  }
}
```

#### upstream 로드밸런서 오류

참고 [nginx proxy_pass 404 error, don't understand why](https://stackoverflow.com/a/16158558)

> Route Not found 오류 발생

```conf
location /api/backend {
  proxy_pass http://backend;
}
```

> WORK! - 슬래쉬(/) 추가

```conf
location /api/backend/ {
  proxy_pass http://backend/;
}
```

- try_files 하면 50x 오류 (슬래쉬 무한 시도)
- location 과 proxy_pass 둘다 슬래쉬가 필요하다
  + 각각 따로 해봤지만 작동 안됨

## 4. 흔히 하는 실수

참고 [Nginx 설정 실수들](https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/)

### 1) Root 아래 location 블럭들

- 중복된 root 항목은 위로 공통 항목으로 올리자.

```conf
server {
    server_name www.example.com;
    root /var/www/nginx-default/;  # 공통
    location / {
        # 중복 : root /var/www/nginx-default/;
        # [...]
    }
    location /foo {
        # 중복 : root /var/www/nginx-default/;
        # [...]
    }
    location /bar {
        root /some/other/place;
        # [...]
    }
}
```

### 2) 다중 인덱스 지시자

- 중복된 index 항목을 공통 항목으로 올리자
- server_name 이 더 상세한 블럭을 위로 올리자

```conf
http {
    index index.php index.htm index.html;  # 공통
    server {
        server_name www.example.com;
        location / {
            # 중복 : index index.php index.htm index.html;
            # [...]
        }
    }
    server {
        server_name example.com;
        location / {
            # 중복 : index index.php index.htm index.html;
            # [...]
        }
        location /foo {
            # 중복 : index index.html;
            # [...]
        }
    }
}
```

### 3) redirect 처리문

- rewrite 함수보다 301 redirect 를 사용하자

> BAD

```conf
server {
    server_name example.com *.example.com;
        if ($host ~* ^www\.(.+)) {
            set $raw_domain $1;
            rewrite ^/(.*)$ $raw_domain/$1 permanent;
        }
        # [...]
    }
}
```

> GOOD

```conf
server {
    server_name www.example.com;
    return 301 $scheme://example.com$request_uri;
}
server {
    server_name example.com;
    # [...]
}
```

### 4) try_files 를 활용하자

If 처리문보다 try_files 를 활용하자.

> BAD

```conf
server {
    root /var/www/example.com;
    location / {
        if (!-f $request_filename) {
            break;
        }
    }
}
```

> GOOD

```conf
server {
    root /var/www/example.com;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 9. Review

- Docker 돌아가는거 보면 굳이 events, http 블럭이 없어도 되던데
  + 최상단에 옵션이 설정되면서 http > server 의 계층이 생성된듯 
  + 아뭏튼 ubuntu 설치 nginx 버전 1.22 에서는 이렇다. 
    + events 블록 필요
    + server 블록 바깥에 http 블록 필요


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
