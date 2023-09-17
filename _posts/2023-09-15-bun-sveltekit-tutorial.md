---
date: 2023-09-15 00:00:00 +0900
title: Bun 1.0 + SvelteKit 튜토리얼
categories: ["frontend","svelte"]
tags: ["bun", "drizzle", "docker", "tutorial"]
image: "https://external-preview.redd.it/bun-1-0-is-here-are-you-ready-v0-fp8GzYdnbzXilD935RUKlAQnCM7jYHxsq6BDQMolntA.jpg?format=pjpg&auto=webp&s=6c11be2a3134ddece87230186c5f92b9506aeac8"
---

> Node 의 여러 문제점 때문에 Vite 로 웹서비스를 실행하는 사례가 늘어나고 있습니다. Vite 는 실서비스를 사용을 권장하지 않기 때문에 또다른 대안으로 Bun 을 이용하려고 합니다. 최근 1.0 을 릴리즈한 Bun 으로 빌드하고 도커로 배포하는 방법을 알아봅니다.
{: .prompt-tip }

## 0. 개요

- [x] Bun 1.0.1 &plus; SvelteKit (TS)
- [x] TailwindCSS
- [x] Drizzle ORM (postgresql)
- [x] Docker

> 화면 캡쳐

<img alt="bun-svltk-drizzle-app" src="https://github.com/maxmin93/bun-svltk-app/blob/main/static/bun-svltk-drizzle-app.png?raw=true" width="400px" />

### [Bun 1.0 출시](https://bun.sh/blog/bun-v1.0) 2023-09-08

> 올인원 툴킷 = Node + 컴파일러 + 번들러 + 패키지 매니저 + 테스팅 도구

- 빠른 자바스크립트 런타임 (Node 호환)
  - 내장 모듈 : fs, path, net
  - 전역 변수 : `__dirname`, process
  - 실행시 .env 로딩
- node 생태계의 파편화된 기능 통합
  - ts 를 별다른 설정 없이 바로 실행 
  - ESM, CommonJS 구분없이 import, require 혼합 사용 가능
  - nodemon 같은 핫로딩 지원 (옵션 `--hot`)
  - plugin 지원
    + 예를 들어 빌드시 yaml 파일 읽어서 설정 적용 하는 등의 기능 추가
- 기본 API 확장
  - file read/write, serve, password hash 등..
- pnpm 보다 빠른 패키지 관리자

### Bun 은 왜 Node 보다 빠른가?

- node 의 거대해진 호환성 관련 기능을 최적화 (오래 되긴 했다)
- 엔진이 다르다 : JavaScriptCore 를 사용 (node 는 v8 엔진)
- [Zig](https://ziglang.org/) 로 작성되었다 (C 언어의 현대화 버전)

> JS Core 는 애플, V8 은 구글, Chakra Core 는 마이크로소프트

## 1. [Bun 설정](https://bun.sh/docs/typescript)

```console
$ brew tap oven-sh/bun 
$ brew install bun
$ bun upgrade

$ bun --version
1.0.1
```

### 설치 관리자 : 사용법이 pnpm 과 유사하다

macOS 의 외장 볼륨에 대해 설치가 안되는 문제가 있음 [(임시조치)](https://github.com/oven-sh/bun/issues/876#issuecomment-1326083788)

> 작업을 외장 볼륨에서 하고 있기 때문에, 불편하지만 bun add 이후 bun install 을 한번 더 해주면 된다.

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

### Tutorial: [ElaysiaJS](https://elysiajs.com/introduction.html) 로 REST API 만들기

- ElaysiaJS : ExpressJS 유사 프레임워크
- 내장 Sqlite
- [swagger 플러그인](https://elysiajs.com/plugins/swagger.html#swagger-plugin) : `http://localhost:3000/swagger`

```bash
bun create elysia hi-elysia
cd hi-elysia

bun add @elysiajs/swagger

bun dev
```

```ts
// index.ts
import { Elysia } from 'elysia';
import { swagger } from '@elysiajs/swagger';
import { Database } from 'bun:sqlite';

const db = new Database(':memory:');
const app = new Elysia().use(swagger());

app.get('/query', () => {
  // https://bun.sh/docs/api/sqlite#statements
  const query = db.query(`select $message;`);
  // get(): first result (vs. all())
  const result = query.get({ $message: 'Hello world from Sqlite' });
  console.log(query.toString());
  // => select 'Hello world from Sqlite';
  return result;
});

app.get('/books', () => 'books');
app.post('/books', () => 'books');
app.put('/books', () => 'books');
app.get('/books/:id', ({ params: { id } }) => `books: GET ${id}`);
app.delete('/books/:id', ({ params: { id } }) => `books: DELETE ${id}`);

app.get('/', () => 'Hello Elysia');

app.get('/sample', () => ({
  vtuber: ['Shirakami Fubuki', 'Inugami Korone'],
}));

const options: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
  weekday: 'long',
};

app
  .state('version', '1.0.2')
  .decorate('getDate', () => Date.now())
  .get('/version', ({ getDate, store: { version } }) => ({
    version,
    date: new Intl.DateTimeFormat('ko-KR', options).format(getDate()),
  }));
/* => {
  "version": "1.0.2",
  "date": "2023. 09. 17. 일요일 오후 03:19"
} 
 */

app.listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
```

## 2. [Bun &amp; SvelteKit](https://bun.sh/guides/ecosystem/sveltekit)

### 프로젝트 생성

```console
$ bun create svelte@latest my-app
$ cd my-app

$ bun install
# bun install --backend=copyfile

$ bun --bun run dev
```

> `-b`, `--bun` 옵션은 런타임으로 Bun 을 사용하도록 강제한다.

```jsonc
// package.json
{
  "scripts": {
    // "dev": "vite dev", 대신에
    "dev": "bunx --bun vite dev",
  }
}
```

#### [bun-types for Typescript](https://bun.sh/docs/typescript)

Typescript 에서 Bun 의 내장 API 를 사용하고 싶으면 (쓸 일이 있으면)

- [bun-types](https://github.com/oven-sh/bun-types) 를 설치해야 한다.
- `tsconfig.json` 의 compilerOptions 에 `"types": ["bun-types"]` 추가

```bash
bun add -d bun-types
```

### 빌드

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

$ PORT=8000 bun ./build/index.js
Listening on 0.0.0.0:8000
```

- Chrome 브라우저 오류 : [`Not found: /service-worker.js`](https://github.com/sveltejs/kit/issues/3159#issuecomment-1314986378)
  - [chrome://serviceworker-internals/](chrome://serviceworker-internals/) 에서 3000 포트에 대한 서비스 워커 호출을 해제

### Docker 배포 

```console
docker pull oven/bun

cat <<EOF > Dockerfile
FROM oven/bun
WORKDIR /app
COPY ./build .
EXPOSE 8000
ENV PORT 8000
CMD ["bun", "./index.js"]
EOF

docker run -it -P --rm bun-svltk-app bash
docker run -dP --rm --name bun-svltk-app bun-svltk-app
docker stop $(docker ps -lq)
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
```

```bash
docker compose up --build --no-recreate -d
docker compose up -d

docker compose ps

docker compose down -v
```


## 9. Summary

- 잘 된다. 앞으로 node 대신 bun 으로 배포하자.
- node 보다 빠르다는데 더 가벼운 느낌정도? 부하가 걸려야 체감할 수 있겠다.
- 브라우저 입장에서 마찬가지라지만, 서버 스크립트 측면에서는 다를 수 있다. (주의)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
