---
date: 2023-09-12 00:00:00 +0900
title: SvelteKit + Supabase 통합 - 3일차
description: gustavocadev 의 'SvelteKit + Supabase Auth' 를 따라한 클론 프로젝트입니다. 소스는 깃허브 svltk-drizzle-app 에 있습니다.
categories: [Backend, Supabase]
tags: ["bun", "auth", "svelte", "skeleton"]
image: "https://i.ytimg.com/vi/Qnpce8hwn58/hqdefault.jpg"
---

> 목록
{: .prompt-tip }

- [SvelteKit + Supabase 통합 - 1일차](/posts/sveltekit-supabase-tutorial-day1/) : prisma 연동
- [SvelteKit + Supabase 통합 - 2일차](/posts/sveltekit-supabase-tutorial-day2/) : drizzle 연동
- [SvelteKit + Supabase 통합 - 3일차](/posts/sveltekit-supabase-tutorial-day3/) : Bun Docker 배포 &nbsp; &#10004;
- [SvelteKit + Supabase 통합 - 4일차](/posts/sveltekit-supabase-tutorial-day4/) : Auth.js 연동

## 0. 개요

출처 : [SvelteKit + Supabase Auth](https://github.com/gustavocadev/supabase-sveltekit-auth)

- [x] Bun + SvelteKit
- [x] TailwindCSS + daisyUI
- [x] supabase 로컬 개발 환경 설정
- [x] Drizzle ORM (postgresql)

> 화면 캡쳐

![svltk-drizzle-app-users](https://github.com/maxmin93/svltk-drizzle-app/blob/main/static/svltk-drizzle-app-users.png?raw=true){: width="540" .w-75}
_users 리스트 출력_

## 1. 프로젝트 생성

### [Bun &amp; SvelteKit](https://bun.sh/guides/ecosystem/sveltekit)

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

> 설치 관리자 : 사용법이 pnpm 과 유사하다

### 1) [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```console
$ bun create svelte@latest bun-tailwind-app
  - Skeleton project
  - TypeScript

$ cd bun-tailwind-app
$ bun install

$ bun run dev
```

### 2) [TailwindCSS 설정](https://tailwindcss.com/docs/guides/sveltekit)

1. Install TailwindCSS, tailwind-merge
2. `tailwind.config.js` 에 template paths 추가
3. `postcss.config.js` 에 nesting plugin 추가
4. `app.css` 에 Tailwind directives 추가
5. 최상위 `+layout.svelte` 에 `app.css` import
6. `+page.svelte` 에서 TailwindCSS classes 를 사용해 작동 확인

```bash
bun add -d tailwindcss postcss autoprefixer tailwind-merge
bunx tailwindcss init -p

# default font 설정
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

cat <<EOF > postcss.config.js
export default {
  plugins: {
    'tailwindcss/nesting': {}, 
    tailwindcss: {}, 
    autoprefixer: {},
  },
};
EOF

cat <<EOF > src/app.postcss
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
EOF

cat <<EOF > src/routes/+layout.svelte
<script lang="ts">
  import '../app.postcss';
</script>

<slot />
EOF

cat <<EOF > src/routes/+page.svelte
<h1 class="bg-green-300 hover:bg-red-600 border-green-600 border-b p-4 m-4 rounded text-3xl font-bold">Hello, SvelteKit!</h1>
EOF

bun run dev
```

### [daisyUI 설정](https://daisyui.com/docs/config/)

```bash
bun add -d daisyui@latest
bun add -d @tailwindcss/typography
```

```js
// tailwind.config.js
module.exports = {
  //...
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    logs: false,
    themes: ['light', 'dark'], // HTML[data-theme]
  },
};
```

```html
<!-- +page.svelte -->
<div class="card m-10 w-96 bg-base-100 shadow-xl" data-theme="lofi">
  <figure>
    <!-- 랜덤 이미지 -->
    <img src="https://picsum.photos/200/300" alt="Shoes" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Shoes!</h2>
    <p>If a dog chews shoes whose shoes does he choose?</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Buy Now</button>
    </div>
  </div>
</div>
```

## 2. [supabase 로컬 개발 환경 설정](https://supabase.com/docs/guides/cli/local-development)

supabase local studio [http://localhost:54323](http://localhost:54323/project/default)

```bash
supabase status

cat <<EOF > .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
SUPABASE_ANON_KEY="..."
SUPABASE_URL="http://localhost:54321"
EOF
```

### [SvelteKit 에서 Supabase 사용하기](https://supabase.com/docs/guides/getting-started/quickstarts/sveltekit)

```bash
bun add @supabase/supabase-js
bun add @supabase/auth-helpers-sveltekit
```

```ts
// src/lib/server/supabase.ts
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

## 3. [Drizzle ORM + Supabase](https://orm.drizzle.team/docs/quick-postgresql/supabase) 설정

### Drizzle Kit 설치 및 설정

- DATABASE_URL 환경변수 설정
- [`drizzle.config.ts` 파일 생성](https://orm.drizzle.team/kit-docs/conf)
- `drizzle/schema.ts` 파일 생성
  - postgresql 의 collate 는 아직 지원하지 않음 [(issue#638 open 상태)](https://github.com/drizzle-team/drizzle-orm/issues/638)

```bash
bun add drizzle-orm postgres
bun add -d drizzle-kit

# drizzle-kit 을 위한 config 파일
cat <<EOF > drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: 'drizzle/schema.ts',
  out: 'drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true, // Print all statements
  // strict: true,  // Always ask for my confirmation
} satisfies Config;
EOF

mkdir drizzle && cat <<EOF > drizzle/schema.ts
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const countries = pgTable('country', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }),
});

/*
CREATE TABLE countries (
 id SERIAL PRIMARY KEY,
 name VARCHAR(255) NOT NULL COLLATE "ko-x-icu"
);
*/
EOF
```

### SvelteKit 에서 Drizzle ORM 사용하기

1. `src/lib/server/db.ts` 에서 drizzle orm client 생성
2. `src/routes/+page.server.ts` 에서 select 문 실행
3. `src/routes/+page.svelte` 에서 데이터 출력

```ts
// src/lib/server/drizzle.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';
import * as schema from '../../../drizzle/schema';

const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });
```

```ts
// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/drizzle';
import { countries } from '../../drizzle/schema';

export const load: PageServerLoad = async () => {
  const allCountries = await db.select().from(countries);

  return {
    users: allCountries ?? [],
  };
};
```

```html
<!-- src/routes/+page.svelte -->
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<div data-theme="cupcake" class="mt-4">
  <h2>Countries</h2>
  <ul class="list-disc ml-4 mt-4">
    {#each data.countries as country (country.id)}
    <li>{country.name} ({country.id})</li>
    {/each}
  </ul>
</div>
```

## 4. Docker 배포

### adapter-bun 빌드

- adapter-auto 를 adapter-bun 으로 변경
- 환경변수와 함께 `build/index.js 실행` (기본 3000 포트)
  + `.env` 파일이 있으면 자동으로 읽고 시작한다

```console
$ bun add -D svelte-adapter-bun

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

## 9. Review

- 잘 된다. 정말로 bun 이 node 를 대체할거 같다.
  - node 의 번거롭던 작은 문제들이 해결되고, 안쓰는 기능들이 깔끔하게 정리된 버전

> 참고문서

- [유튜브 - Mastering SvelteKit with Geoff Rich](https://www.youtube.com/watch?v=MaF8kRbHbi0)
- [유튜브 - SvelteKit and Supabase Deep Dive](https://www.youtube.com/watch?v=1tsUB58KX2s)
- [깃허브 - SikandarJODD/SvelteKit-Drizzle](https://github.com/SikandarJODD/SvelteKit-Drizzle)
- [깃허브 - gustavocadev/sveltekit-drizzle-orm-planetscale-lucia](https://github.com/gustavocadev/sveltekit-drizzle-orm-planetscale-lucia)
  
&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
