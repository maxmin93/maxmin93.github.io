---
date: 2023-09-10 00:00:00 +0900
title: SvelteKit + Supabase 통합 - 2일차
categories: ["frontend","svelte"]
tags: ["drizzle", "supabase", "2st-day"]
image: "https://i.ytimg.com/vi/Qnpce8hwn58/hqdefault.jpg"
---

> Ben Davis 유투버의 SvelteKit + Supabase 심화학습을 따라한 클론 프로젝트입니다. 소스는 [깃허브](https://github.com/maxmin93/svltk-drizzle-app) 에 있습니다.
{: .prompt-tip }

## 0. 개요

- [x] TailwindCSS + DaisyUI 설정
- [x] supabase 로컬 개발 환경 설정
- [x] Drizzle 설정 (postgresql)

> 화면 캡쳐

<img alt="svltk-drizzle-app-users" src="https://github.com/maxmin93/svltk-drizzle-app/blob/main/static/svltk-drizzle-app-users.png?raw=true" width="540px" />
_users 리스트 출력_

> 참고문서

- [깃허브 - SikandarJODD/SvelteKit-Drizzle](https://github.com/SikandarJODD/SvelteKit-Drizzle)
- [깃허브 - gustavocadev/sveltekit-drizzle-orm-planetscale-lucia](https://github.com/gustavocadev/sveltekit-drizzle-orm-planetscale-lucia)


## 1. 프로젝트 생성

### [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
pnpm create svelte@latest svltk-supabase-app
  - Skeleton project
  - TypeScript

cd svltk-tailwind-todo-app
pnpm install

pnpm run dev
```

### [TailwindCSS 설정](https://tailwindcss.com/docs/guides/sveltekit)

1. Install TailwindCSS
2. `tailwind.config.js` 에 template paths 추가
3. `app.css` 에 Tailwind directives 추가
4. 최상위 `+layout.svelte` 에 `app.css` import
5. `+page.svelte` 에서 TailwindCSS classes 를 사용해 작동 확인

```bash
pnpm add -D tailwindcss postcss autoprefixer
pnpx tailwindcss init -p

pnpm run dev
```

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

```css
/* src/app.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

```html
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

선택사항 : Tailwind [Nesting](https://tailwindcss.com/docs/using-with-preprocessors#nesting) 플러그인

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

#### [daisyUI 설정](https://daisyui.com/docs/config/)

- 설치 : `pnpm add -D daisyui@latest`
- 설정 : `tailwind.config.js` 에 플러그인 추가
  - 로그 출력 설정
  - themes 설정 : 설정된 테마만 포함
    - 첫번째 테마가 light Mode
    - 두번째 테마가 dark Mode
    - 그 외의 테마는 `[data-theme]` 설정시 반영됨

```js
// tailwind.config.js
module.exports = {
  //...
  plugins: [require('daisyui')],
  daisyui: {
    logs: false,
    themes: ['cupcake', 'dark', 'cmyk'], // HTML[data-theme]
  },
};
```

```html
<div data-theme="cupcake">
  This div will always use light theme
  <span data-theme="dark">This span will always use retro theme!</span>
</div>
```

#### [`@tailwindcss/typography` 플러그인](https://daisyui.com/docs/layout-and-typography/#-1)

- 설치 : `pnpm add -D @tailwindcss/typography`
- 설정 : `tailwind.config.js` 에 플러그인 추가 (daisyui 앞에 위치)
  - `require('@tailwindcss/typography'),`

#### [theme-change 추가](https://github.com/saadeghi/theme-change)

- 설치 : `pnpm add theme-change`

```ts
import { onMount } from 'svelte';
import { themeChange } from 'theme-change';

onMount(() => {
  themeChange(false);
  // 👆 false parameter is required for svelte
});
```


## 2. [supabase 로컬 개발 환경 설정](https://supabase.com/docs/guides/cli/local-development)

> 참고문서

- [Supabase Docs - Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)

### supabase 설치 및 설정

1. CLI 설치 (OS X)
2. supabase login
3. 프로젝트용 superbase docker 컨테이너 실행
4. `.env` 설정

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

$ pnpm add @supabase/supabase-js
# pnpm add @supabase/auth-helpers-sveltekit

$ supabase stop
# supabase stop --no-backup
```

```bash
# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
SUPABASE_ANON_KEY="..."
SUPABASE_URL="http://localhost:54321"
```

> 참고문서

- [SvelteKit 에서 Supabase 사용하기](https://supabase.com/docs/guides/getting-started/quickstarts/sveltekit)
- [Supabase.js - Initializing](https://supabase.com/docs/reference/javascript/initializing)
- [Static For Variables During The Build Process](https://joyofcode.xyz/sveltekit-environment-variables#static-for-variables-during-the-build-process)

### [Drizzle ORM + Supabase](https://orm.drizzle.team/docs/quick-postgresql/supabase) 설정

#### Drizzle ORM 설치 및 설정

- DATABASE_URL 환경변수 (`.env`) 설정
- `src/lib/db/schema.ts` 파일 생성
- [`drizzle.config.ts` 파일 생성](https://orm.drizzle.team/kit-docs/conf)
- 마이그레이션 : schema 파일로부터 push (자동)

```bash
pnpm add drizzle-orm postgres dotenv
pnpm add -D drizzle-kit

# drizzle config 파일 생성
touch drizzle.config.ts

# schema 반영 (주의: drizzle.config.ts 파일이 있어야 함)
pnpm drizzle-kit push:pg

# typescript 로부터 마이그레이션 sql 생성 (자동)
pnpm drizzle-kit generate:pg --schema=./src/lib/db/schema.ts
```

```ts
// src/lib/db/schema.ts
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});
```

```ts
// drizzle.config.ts
import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  schema: 'src/lib/db/schema.ts',
  out: 'drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true, // Print all statements
  // strict: true,  // Always ask for my confirmation
} satisfies Config;
```

```json
// package.json
{
  "scripts": {
    "generate": "drizzle-kit generate:pg",
    "push": "drizzle-kit push:pg"
  }
}
```

#### SvelteKit 에서 Drizzle ORM 사용하기

1. 테스트용 데이터를 넣고
2. `src/lib/db/index.ts` 에서 drizzle 설정
3. `src/routes/+page.server.ts` 에서 select 문 실행
4. `src/routes/+page.svelte` 에서 데이터 출력

```sql
insert into users (full_name, phone) values
('John Doe', '1234567890'),
('Talon Gison', '677267890'),
('Babara Dov', '33267890'),
('Emi Karl', '7774567890');

select * from users;
```

```ts
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { DATABASE_URL } from '$env/static/private';
import * as schema from './schema';

const client = postgres(DATABASE_URL);
export const db = drizzle(client, { schema });
```

```ts
// src/routes/+page.server.ts
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { users } from '$lib/db/schema';

export const load: PageServerLoad = async () => {
  const allUsers = await db.select().from(users);

  return {
    users: allUsers ?? [],
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
  <h2>Users</h2>
  <ul class="list-disc ml-4 mt-4">
    {#each data.users as user (user.id)}
    <li>{user.fullName} ({user.phone})</li>
    {/each}
  </ul>
</div>
```

#### Drizzle Migrate 실행

- drizzle 아래 migration SQL 파일이 있어야 하고
- .env 에 DATABASE_URL 환경변수가 있어야 한다

```bash
pnpx vite-node migrate.ts
# Running migrations
# {
#   severity_local: 'NOTICE',
#   severity: 'NOTICE',
#   code: '42P07',
#   message: 'relation "users" already exists, skipping',
#   file: 'parse_utilcmd.c',
#   line: '209',
#   routine: 'transformCreateStmt'
# }
# Migrated successfully
```

```ts
// src/migrate.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

async function main() {
  require('dotenv').config();

  const DATABASE_URL = process.env.DATABASE_URL;
  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const sql = postgres(DATABASE_URL, { max: 1 });
  const db = drizzle(sql);

  console.log('Running migrations');
  await migrate(db, { migrationsFolder: 'drizzle' });

  console.log('Migrated successfully');
  process.exit(0);
}

main().catch((e) => {
  console.error('Migration failed');
  console.error('➜', e);
  process.exit(1);
});
```


## 9. Summary

- 아직도 본론은 안들어 갔다. (이제 시작 2)
- daisyUI 는 색감이 이쁘다. 설치도 아주 간편하다.
- drizzle ORM 은 typescript 로 schema 를 정의하는 가벼운 ORM 이다.
  + 이 때문에 [serverless 환경에서 대략 2배 이상 빠르다고 한다.](https://github.com/drizzle-team/drizzle-northwind-benchmarks-pg#sample-runs)
  + 잡다한 기능이 없어서 반쯤은 수동으로 DB 를 다룰수 있어서 편하다.
  + prisma 에 질린 개발자들 사이에서 인기가 높다. (동감)
  + drizzle-kit 기능이 아직 부족하다.
- 아직 다 작성된 문서는 아니다. (나중에 보충)

### 참고문서

- [Drizzle ORM Quickstart Tutorial and First Impressions](https://tone-row.com/blog/drizzle-orm-quickstart-tutorial-first-impressions)
- [What is TypeScript SQL-like Drizzle ORM?](https://byby.dev/drizzle-orm)
  
&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
