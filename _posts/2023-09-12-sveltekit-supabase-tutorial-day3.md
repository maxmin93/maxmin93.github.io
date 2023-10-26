---
date: 2023-09-12 00:00:00 +0900
title: SvelteKit + Supabase 통합 - 3일차
categories: ["frontend","svelte"]
tags: ["bun", "auth", "supabase", "skeleton", "3rd-day"]
image: "https://i.ytimg.com/vi/Qnpce8hwn58/hqdefault.jpg"
---

> gustavocadev 의 [SvelteKit + Supabase Auth](https://github.com/gustavocadev/supabase-sveltekit-auth) 를 따라한 클론 프로젝트입니다. 소스는 [깃허브](https://github.com/maxmin93/svltk-drizzle-app) 에 있습니다.
{: .prompt-tip }

- [SvelteKit + Supabase 통합 - 1일차](/posts/2023-09-06-sveltekit-supabase-tutorial-day1/) : prisma 연동
- [SvelteKit + Supabase 통합 - 2일차](/posts/2023-09-10-sveltekit-supabase-tutorial-day2/) : drizzle 연동
- [SvelteKit + Supabase 통합 - 3일차](/posts/2023-09-12-sveltekit-supabase-tutorial-day3/) : Bun Docker 배포 &nbsp; &#10004;
- [SvelteKit + Supabase 통합 - 4일차](/posts/2023-10-03-sveltekit-supabase-tutorial-day4/) : Auth.js 연동

## 0. 개요

- [x] Bun + SvelteKit
- [x] TailwindCSS + Skeleton
- [x] supabase 로컬 개발 환경 설정
- [x] Drizzle ORM (postgresql)

> 화면 캡쳐

<img alt="svltk-drizzle-app-users" src="https://github.com/maxmin93/svltk-drizzle-app/blob/main/static/svltk-drizzle-app-users.png?raw=true" width="540px" />
_users 리스트 출력_

## 1. 프로젝트 생성

[Skeleton UI 툴킷](https://www.skeleton.dev/docs/get-started) 수동 설치를 시도하면 안된다. 할 수 없어 Skeleton CLI 를 사용했다.

### [SvelteKit + Skeleton](https://www.skeleton.dev/docs/get-started)

```console
$ bun create skeleton-app@latest svltk-skeleton-app
  - AppShell starter
  - Wintry
  - Tailwind forms
  - Typescript

$ cd svltk-skeleton-app

# macOS 외장볼륨을 사용하고 있어서 강제 copyfile 옵션이 필요
$ bun install --backend=copyfile

$ bun run dev
```

#### Deploy : [adapter-bun](https://github.com/gornostay25/svelte-adapter-bun)

- adapter-auto 를 adapter-bun 으로 변경
- 환경변수와 함께 `build/index.js 실행` (기본 3000 포트)

```console
$ bun add -D svelte-adapter-bun
# bun install --backend=copyfile

$ sed -i "" "s/@sveltejs\/adapter-auto/svelte-adapter-bun/" svelte.config.js

$ bun run build
> Using svelte-adapter-bun
  ✔ Start server with: bun ./build/index.js
  ✔ done
✓ built in 1.40s

$ PORT=8000 bun build/index.js
Listening on 0.0.0.0:8000
```

### Supabase

```bash
# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
PUBLIC_SUPABASE_ANON_KEY="..."
PUBLIC_SUPABASE_URL="http://localhost:54321"
```


## 2. 

```bash
bun add -D drizzle-kit zod
bun add -D svelte-meta-tags sveltekit-superforms

bun add @supabase/supabase-js
bun add @supabase/auth-helpers-sveltekit
bun add @supabase/auth-ui-shared @supabase/auth-ui-svelte

bun add drizzle-orm postgres
bun add twilio

bun add @floating-ui/dom svelte-french-toast 
bun add country-flag-icons

# bun install --backend=copyfile
```

### [Drizzle ORM - postgresql](https://lucia-auth.com/guidebook/drizzle-orm#postgresql)


## 4. [Bun &amp; SvelteKit](https://bun.sh/guides/ecosystem/sveltekit)

새로운 JS 런타임 도구가 나와서 사용해 보았다.

- node 완전 호환
- npm 같은 패키지 관리자를 포함하고, npx 같은 `bunx` 도 있다
- 왠만한 라이브러리는 내장되어 있다 (dotenv, 심지어 sqlite 도)
- 그리고 빠르다

```console
$ brew tap oven-sh/bun 
$ brew install bun
$ bun upgrade

$ bun --version
1.0.1
```

### 설치 관리자 : 사용법이 pnpm 과 유사하다

> macOS 의 외장 볼륨에 대해 설치가 안되는 문제가 있음 [(임시조치)](https://github.com/oven-sh/bun/issues/876#issuecomment-1326083788)

```console
$ bun add figlet
$ bun add -d @types/figlet 

$ bun install
Failed to install 3 packages
error: Unexpected installing @types/figlet
error: Unexpected installing bun-types
error: Unexpected installing figlet

$ bun install --backend=copyfile
 3 packages installed [136.00ms]
```

### 프로젝트 생성

```console
$ bun create svelte@latest my-app
$ cd my-app

$ bun install
# bun install --backend=copyfile

$ bun --bun run dev
```

### 빌드

- adapter-auto 를 adapter-bun 으로 변경
- 환경변수와 함께 `build/index.js 실행` (기본 3000 포트)
  + `.env` 파일이 있으면 자동으로 읽고 시작한다

```console
$ bun add -D svelte-adapter-bun
# bun install --backend=copyfile

$ sed -i "" "s/@sveltejs\/adapter-auto/svelte-adapter-bun/" svelte.config.js

$ bun run build
> Using svelte-adapter-bun
  ✔ Start server with: bun ./build/index.js
  ✔ done
✓ built in 1.40s

# .env 로딩
$ bun ./build/index.js
[0.07ms] ".env"
Listening on 0.0.0.0:8000
```

- Chrome 브라우저 오류 : [`Not found: /service-worker.js`](https://github.com/sveltejs/kit/issues/3159#issuecomment-1314986378)
  - [chrome://serviceworker-internals/](chrome://serviceworker-internals/) 에서 3000 포트에 대한 서비스 워커 호출을 해제

### Docker 배포 

```console
$ docker pull oven/bun

$ cat <<EOF > Dockerfile
FROM oven/bun
WORKDIR /app
COPY ./build .
EXPOSE 8000
ENV PORT 8000
CMD ["bun", "./index.js"]
EOF

$ docker run -it -P --rm bun-svltk-app bash
$ docker run -dP --rm --name bun-svltk-app bun-svltk-app
$ docker stop $(docker ps -lq)
```

#### docker-compose

- `.env` 에서 PORT 설정하고
- build 디렉토리를 마운트 해서, 바로 실행

```yml
version: "3"
services:
  bun_docker:
    image: oven/bun
    container_name: bun_docker
    command: ["bun", "/app/index.js"]
    env_file: .env
    ports:
      - ${PORT}:${PORT}
    working_dir: /app
    volumes:
      - type: bind
        source: ./build
        target: /app
    tty: true
    network_mode: "bridge"   
```

```bash
docker compose up --build --no-recreate -d
docker compose up -d

docker compose ps

docker compose down -v
```

## 9. Summary


### 참고문서

> 참고문서

- [유튜브 - Mastering SvelteKit with Geoff Rich](https://www.youtube.com/watch?v=MaF8kRbHbi0)
- [유튜브 - SvelteKit and Supabase Deep Dive](https://www.youtube.com/watch?v=1tsUB58KX2s)
- [깃허브 - SikandarJODD/SvelteKit-Drizzle](https://github.com/SikandarJODD/SvelteKit-Drizzle)
- [깃허브 - gustavocadev/sveltekit-drizzle-orm-planetscale-lucia](https://github.com/gustavocadev/sveltekit-drizzle-orm-planetscale-lucia)

  
&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
