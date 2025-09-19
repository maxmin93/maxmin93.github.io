---
date: 2023-09-06 00:00:00 +0900
title: SvelteKit + Supabase 통합 - 1일차
description: Ben Davis 유튜버의 SvelteKit + Supabase 심화학습을 따라한 클론 프로젝트입니다. 소스는 깃허브 svltk-supabase-app 에 있습니다.
categories: [Backend, Supabase]
tags: ["svelte","prisma","1st-day"]
image: "https://i.ytimg.com/vi/Qnpce8hwn58/hqdefault.jpg"
---

> 목록
{: .prompt-tip }

- [SvelteKit + Supabase 통합 - 1일차](/posts/sveltekit-supabase-tutorial-day1/) : prisma 연동 &nbsp; &#10004;
- [SvelteKit + Supabase 통합 - 2일차](/posts/sveltekit-supabase-tutorial-day2/) : drizzle 연동
- [SvelteKit + Supabase 통합 - 3일차](/posts/sveltekit-supabase-tutorial-day3/) : Bun Docker 배포
- [SvelteKit + Supabase 통합 - 4일차](/posts/sveltekit-supabase-tutorial-day4/) : Auth.js 연동

## 0. 개요

- [x] TailwindCSS 설정
- [x] supabase 로컬 개발 환경 설정
- [x] Prisma (postgresql) + multi-schema

> 화면 캡쳐

![svltk-supabase-app-blog](https://github.com/maxmin93/svltk-supabase-app/blob/main/static/svltk-supabase-app-blog.png?raw=true){: width="540" .w-75}
_블로그 포스트 리스트 (메인)_

![svltk-supabase-app-blog](https://github.com/maxmin93/svltk-supabase-app/blob/main/static/svltk-supabase-app-blog-post.png?raw=true){: width="540" .w-75}
_블로그 포스트 페이지_

## 1. 프로젝트 생성

### [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
pnpm create svelte@latest svltk-supabase-app
  - Skeleton project
  - TypeScript

cd svltk-supabase-app
pnpm install

pnpm run dev
```

### [TailwindCSS 설정](https://tailwindcss.com/docs/guides/sveltekit)

1. Install TailwindCSS, tailwind-merge
2. `tailwind.config.js` 에 template paths 추가
3. `app.css` 에 Tailwind directives 추가
4. 최상위 `+layout.svelte` 에 `app.css` import
5. `+page.svelte` 에서 TailwindCSS classes 를 사용해 작동 확인

```bash
pnpm install -D tailwindcss postcss autoprefixer tailwind-merge
pnpx tailwindcss init -p

pnpm run dev
```

```bash
cat <<EOF > tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ['"Noto Sans KR"', ...defaultTheme.fontFamily.sans],
      serif: ['"Noto Serif KR"', ...defaultTheme.fontFamily.serif],
      mono: ['D2Coding', ...defaultTheme.fontFamily.mono],
    },      
  },
  plugins: [],
};
EOF
```

```scss
/* src/app.css */

/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');
@import url("//cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-ligature-full.css");

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white dark:bg-gray-800;
  }
}
```

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import '../app.css';
</script>

<slot />
```

```html
<!-- src/routes/+page.svelte -->
<h1 class="text-3xl font-bold underline">Hello, SvelteKit!</h1>
```

#### 선택사항 : Tailwind [Nesting](https://tailwindcss.com/docs/using-with-preprocessors#nesting) 플러그인

```js
// postcss.config.js
export default {
  plugins: {
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## 2. [supabase 로컬 개발 환경 설정](https://supabase.com/docs/guides/cli/local-development)

> 참고문서

- [Supabase Docs - Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)
- [Self-Hosting with Docker](https://supabase.com/docs/guides/self-hosting/docker)
  - [Self-Hosting Supabase Studio](https://supabase.com/docs/guides/self-hosting/docker#accessing-supabase-studio) 로그인 기본값
    - Username: supabase
    - Password: this_password_is_insecure_and_should_be_updated

### supabase cli 설치 및 설정

1. CLI 설치 (OS X)
2. supabase login : access token 입력 (클라우드와 link 할 때 필요)
3. 프로젝트용 superbase docker 컨테이너 실행
  - 우선 로컬에 docker 서비스가 활성화 되어 있어야 한다.

```console
$ brew install supabase/tap/supabase
```

```console
$ supabase login
# - access_token 입력
```

```console
$ cd ${PROJECT_ROOT}

$ supabase init
# `./supabase/config.toml` 생성됨

$ supabase start
# project_id 이름으로 도커 컨테이너 그룹 실행

$ supabase status
# - DB URL
# - API URL
# - anon key

# open Studio => http://localhost:54323/

$ pnpm install @supabase/supabase-js
# pnpm install @supabase/auth-helpers-sveltekit

$ supabase stop
# supabase stop --no-backup  # 백업 없이 종료 (초기화)
```

### [SvelteKit 에서 Supabase 사용하기](https://supabase.com/docs/guides/getting-started/quickstarts/sveltekit)

1. `.env` 설정
2. Supabase Studio - SQL Query : [countries 테이블 생성](https://supabase.com/docs/guides/getting-started/quickstarts/sveltekit)
3. client.ts 생성 : anon_key, url 을 환경변수에서 가져오기
4. supabase client 로 [데이터 가져오기](https://kit.svelte.dev/docs/load)
5. `+page.svelte` 에서 데이터 출력

> 참고

- [Supabase.js - Initializing](https://supabase.com/docs/reference/javascript/initializing)
- [Static For Variables During The Build Process](https://joyofcode.xyz/sveltekit-environment-variables#static-for-variables-during-the-build-process)

```bash
# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
SUPABASE_ANON_KEY="..."
SUPABASE_URL="http://localhost:54321"
```

```sql
-- Create the table
CREATE TABLE countries (
 id SERIAL PRIMARY KEY,
 name VARCHAR(255) NOT NULL
);
-- Insert some sample data into the table
INSERT INTO countries (name) VALUES ('United States');
INSERT INTO countries (name) VALUES ('Canada');
INSERT INTO countries (name) VALUES ('Mexico');

select * from countries;
```

```ts
// src/lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_ANON_KEY, SUPABASE_URL } from '$env/static/private';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: 'public',
  },
  auth: {
    persistSession: false,
  },
});

```

```ts
// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabase/client';

export const load: PageServerLoad = async ({ params }) => {
  const { data } = await supabase.from('countries').select();
  return {
    countries: data ?? [],
  };
};
```

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div class="container mx-auto">
  <h1 class="text-3xl font-bold underline">Hello, SvelteKit!</h1>

  <ul class="list-disc">
    {#each data.countries as country}
    <li key="{country.id}">{country.name}</li>
    {/each}
  </ul>
</div>
```

#### 참고: [Typescript 위한 database types 생성](https://supabase.com/docs/reference/javascript/typescript-support)

```bash
supabase gen types typescript --local --debug > src/lib/database.types.ts
```

## 3. Prisma 설치 및 설정

brew 패키지 매니저로 설치한 경우 버전이 안맞아 previewFeatures 가 작동 안되는 경우가 있으니 npm 또는 pnpm 을 붙여서 사용해야 한다.

### Prisma 설치

참고: [Using Prisma with SvelteKit](https://dev.to/joshnuss/using-prisma-with-sveltekit-46l6)

```console
$ pnpm install -D prisma @prisma/client

$ pnpx prisma init --datasource-provider postgresql

# 이미 DB 에 스키마가 존재하는 경우 
$ pnpx prisma db pull
$ pnpx prisma generate

# 또는, 모델링 작성후 DB 에 반영하려면
$ pnpx prisma db push
```

### [Prisma multi-schema](https://www.prisma.io/docs/guides/other/multi-schema)

멀티 스키마 의존라이브러리를 설치한다.

```console
$ pnpm add prisma-multischema

$ pnpx prisma-multischema

$ pnpx prisma db pull  # 기존 스키마를 읽고

$ pnpx prisma db push  # 새로운(변경된) 스키마를 반영한다

$ pnpx prisma generate # prisma client 를 생성한다
```

`prisma/schema.prisma` 에 멀티 스키마를 위한 변경사항을 작성한다

- db 에 schemas 를 나열하고
- model 마다 `@@schema` 를 명시해야 한다.

```js 
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["auth", "public"]
}

model countries {
  id   Int    @id @default(autoincrement())
  name String @db.VarChar(255)

  @@schema("public")
}

model user {
  id     Int     @id
  name String @db.VarChar(255)

  @@schema("auth")
}
```

#### [Adding Prisma Migrate to an existing project](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate/add-prisma-migrate-to-a-project)

```console
$ pnpx prisma db push  # 새로운(변경된) 스키마를 반영한다

# migration 을 위한 스크립트 생성
$ pnpx prisma migrate diff \
--from-empty \
--to-schema-datamodel prisma/schema.prisma \
--script > prisma/migrations/0_init/migration.sql
```

[초기 수정사항이 더 생긴 경우,](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate/add-prisma-migrate-to-a-project#work-around-features-not-supported-by-prisma-schema-language)

- migration.sql 수정 후에
  + `CREATE INDEX blog_post_title_idx ON blog."Post" (title);`
- 반영 (실패! 왜 안되지?) : 초기화 migration 관련 이야기 같음

```console
$ pnpx prisma migrate resolve --applied 0_init
Error: P3008

The migration `0_init` is already recorded as applied in the database.
```

### [Adding Database Access to your SvelteKit App with Prisma](https://www.prisma.io/blog/sveltekit-prisma-kvCOEoeQlC)

소스 : [깃허브 - sonylomo/demo-sveltekit](https://github.com/sonylomo/demo-sveltekit)

1. 편의상 blog 스키마를 만들고, 테이블 생성
2. `prisma/schema.prisma` 스키마 작성
3. 스키마 변경 사항을 반영하고
4. seed 데이터 `$lib/data.json` 을 insert (소스 참고)
5. `$lib/prisma.ts` : prisma 클라이언트 생성
6. SvelteKit load 함수 작성 
  - `/`  Get all published posts
  - `/drafts`  Get all drafted posts
  - `/p/[id]`  Get a single post by its id
7. SvelteKit action 함수 작성 
  - `route/create` POST : Create a new post in your database
  - `route/p/[id]` PUT : Publish a post by its id
  - `route/p/[id]` DELETE : Delete a post by its id
  - `route/signup` POST : Create a new user

```sql
create schema blog;
```

```js
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  previewFeatures = ["multiSchema"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["blog", "public"]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  published Boolean  @default(false)
  author    User?    @relation(fields: [authorId], references: [id])
  authorId  Int?

  @@schema("blog")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]

  @@schema("blog")
}
```

```console
pnpx prisma db push

pnpx vite-node prisma/seed.ts
```

## 4. 도커 배포

### [adapter-node](https://kit.svelte.dev/docs/adapter-node) 오류

```console
$ pnpm add -D @sveltejs/adapter-node
$ pnpm add dotenv

$ pnpm run build 
$ pnpm run preview  # vite preview

# node 실행시 __dirname 관련 오류로 실행 안됨! (prisma 문제)
# ➡ `.env` 읽기를 위해 dentenv/config 모듈을 먼저 수행
$ node -r dotenv/config build
```

> prisma 이슈

`vite dev` 또는 `vite preview` 에서는 문제가 없다. (단, node 실행시 오류)

- [__dirname is not defined when generating PrismaClient to custom location, w/ SvelteKit](https://github.com/prisma/prisma/issues/15614)
- [_dirname is not defined in ES module scope, Error Only In hooks.server.ts in SvelteKit](https://github.com/prisma/prisma/issues/20702)


### [vite preview 설정](https://vitejs.dev/config/preview-options.html)

node 서버 대신에 vite 를 사용하여 웹앱을 기동시키자.

- 외부 노출용 호스팅 설정
- port 설정 : 동일 port 가 사용중이면 exit
  + server (개발용) `pnpm run dev`
  + preview (빌드용) `pnpm run preview`

```ts
// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true,
    },
  },
  preview: {
    port: 8000,
  },
});

// ** vite 설정 안하는 경우, 파라미터로 설정 --host, --port
// CMD [ "pnpm", "run", "preview", "--host", "0.0.0.0"]
```

### 도커 컴포즈 설정

- node 18 + pnpm 패키지 매니저
- preview 실행

```Dockerfile
FROM node:18-slim
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

EXPOSE 8000
CMD [ "pnpm", "run", "preview" ]
```

```yml
version: '3'

services:
  vite_docker:
    # docker build -t svltk-supabase-app --no-cache .
    build: .
    container_name: vite_docker
    ports:
      - 8000:8000
    networks:
      - webappnetwork

networks:
  webappnetwork:
    driver: bridge
```

```console
$ docker build -t svltk-supabase-app --no-cache .
$ docker run -it -p 4173:4173 --rm svltk-supabase-app bash
$ docker run -dp 4173:4173 --rm \
  --name svltk-supabase-app svltk-supabase-app

$ docker compose up --build -d 
$ docker compose down -v
```


## 9. Review

- 아직 본론은 안들어 갔다. (이제 시작)

### 참고문서

- [유튜브 - SvelteKit and Supabase Deep Dive](https://www.youtube.com/watch?v=1tsUB58KX2s)
  + [깃허브 - 소스](https://github.com/bmdavis419/enceladus-1)
- [레딧 - Any self-hostable CMS to use with SvelteKit](https://www.reddit.com/r/sveltejs/comments/15ojr1k/any_selfhostable_cms_to_use_with_sveltekit/)
- [유튜브 - SvelteKit Authentication with Supabase](https://www.youtube.com/watch?v=lSm0GNnh-0I)
- [Lucia Auth - SvelteKit](https://lucia-auth.com/getting-started/sveltekit)
  + [Lucia - Sign in with username and password in SvelteKit](https://lucia-auth.com/guidebook/sign-in-with-username-and-password/sveltekit)
- [Directus Guides - Headless CMS](https://docs.directus.io/guides/)
  + [Directus Examples - SvelteKit](https://github.com/directus/examples/tree/main/sveltekit)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
