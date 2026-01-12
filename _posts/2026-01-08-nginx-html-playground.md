---
date: 2026-01-08 00:00:00 +0900
title: NginX 로 HTML 연습 환경 만들기
description: Docker 와 NginX 를 이용하여 간단하게 웹서버를 만듭니다. TailwindCSS 도 CLI 의 watch 기능을 이용해 CSS 연습도 할 수 있습니다.
categories: [DevOps]
tags: [docker, nginx, tailwind]
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5VHx44wSZ6wFp5AzwXtzexDqVd3MIumjzGQ&s"
---

오랜만에 다뤄 보려고 하니깐 기억도 안나고 해서, 초심자의 마음으로 정리합니다.


## 1. HTML 연습용 nginx 설정

### 작업 순서

- NginX 을 위한 Docker 설정
- HTML 작성

```text
<root>
├── docker-compose.yml
├── html
│   └── index.html
└── nginx
    ├── nginx.conf
    └── conf.d/
        └── default.conf
```
{: file="디렉토리 구조"}

### 작업 내용

작업할 프로젝트 경로를 생성하고

```console
# 프로젝트 root
mkdir nginx-simple
cd nginx-simple

# 하위 디렉토리 생성
mkdir -p nginx/conf.d
mkdir html

# docker 설정 파일
touch docker-compose.yml
```

docker 를 위한 yml 파일을 작성한다

```yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: my-nginx-container
    ports:
      - "8080:80" # host port : container port
    volumes:
      - ./nginx/conf.d/:/etc/nginx/conf.d/:ro
      - ./html:/usr/share/nginx/html:ro
    restart: always
```
{: file='docker-compose.yml'}


NginX 의 default 사이트를 위한 config 파일 작성

```conf
server {
    listen       80;
    listen  [::]:80;
    server_name  localhost;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
    }
}
```
{: file='nginx/conf.d/default.conf'}

간단한 HTML 파일을 작성합니다.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Simple Page</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is my first paragraph of text.</p>
    <p>This is another paragraph.</p>
</body>
</html>
```
{: file='html/index.html'}

Docker Compose 로 Nginx 를 실행한다.

```console
# 실행
docker compose up -d

# 종료
docker compose down
```

<http://localhost:8080> 에서 HTML 페이지를 확인한다.


## 2. TailwindCSS 연습 환경 만들기

참고문서 : [Get started with Tailwind CSS](https://tailwindcss.com/docs/installation/tailwind-cli)

### 작업 순서

- tailwindcss 설치 (bun 또는 npm)
- index.html, input.css 작성
- package.json 에 scripts 항목 추가
- build:css 및 watch:css 실행

### 작업 내용

```console
# 프로젝트 root 에서 tailwindcss v4 설치
bun install -d tailwindcss @tailwindcss/cli

# html/input.css 작성
cat << EOF > html/input.css
@import "tailwindcss";
EOF
```

`html/index.html` 도 tailwindcss 를 사용해 작성한다.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="./output.css" rel="stylesheet" />
  </head>
  <body>
    <h1 class="text-3xl font-bold underline">Hello world!</h1>
    <button class="bg-sky-500 hover:bg-sky-700">Save changes</button>
  </body>
</html>
```
{: file="html/index.html"}

scripts 명령어를 작성한다.

```json
{
  "scripts": {
    "build:css": "bunx @tailwindcss/cli -i ./html/input.css -o ./html/output.css",
    "watch:css": "bunx @tailwindcss/cli -i ./html/input.css -o ./html/output.css --watch"
  },
  "dependencies": {},
  "devDependencies": {
    "@tailwindcss/cli": "^4.1.18",
    "tailwindcss": "^4.1.18"
  }
}
```
{: file="pakcage.json"}

`watch:css` 명령어를 실행하자.

```console
# output.css 생성
bun run build:css

# output.css 지속 갱신
bun run watch:css
```

index.html 에 아래 항목을 추가하고 새로고침 해보자.

```html
<h3 class="text-xl italic">Hello world! 3rd</h3>
```

이제 간단한 tailwindcss 연습 환경이 만들어졌다.


## 3. [daisyUI](https://daisyui.com) 적용하기

tailwindcss 4 기반의 UI 라이브러리이다. 플러그인으로 연결하면 간편하게 사용할 수 있다.

```css
@import "tailwindcss";
@plugin "daisyui";
```
{: file="html/input.css"}

css 파일과 함께 아래 html 을 tailwindcss CLI 로 컴파일하면 깔끔한 UI 가 출력된다.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="./output.css" rel="stylesheet" />
  </head>
  <body>
<div class="card bg-base-100 w-96 shadow-sm">
  <figure>
    <img
      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
      alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
  </body>
</html>
```
{: file="html/index.html"}


## 9. Reviews

- 오랜만에 다루어 보려니깐 바로 손이 안나간다. 
- 더 쉽게, 완전 초보도 바로 따라할 수 있도록 문서를 작성하자.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
