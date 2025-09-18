---
date: 2023-09-10 00:00:00 +0900
title: SvelteKit + Supabase 통합 - 2일차
description: Ben Davis 유튜버의 SvelteKit + Supabase 심화학습을 따라한 클론 프로젝트입니다. 소스는 깃허브 svltk-supabase-app 에 있습니다.
categories: [Backend, Supabase]
tags: [svelte, drizzle]
image: "https://i.ytimg.com/vi/Qnpce8hwn58/hqdefault.jpg"
---

> 목록
{: .prompt-tip }

- [SvelteKit + Supabase 통합 - 1일차](/posts/sveltekit-supabase-tutorial-day1/) : prisma 연동
- [SvelteKit + Supabase 통합 - 2일차](/posts/sveltekit-supabase-tutorial-day2/) : drizzle 연동 &nbsp; &#10004;
- [SvelteKit + Supabase 통합 - 3일차](/posts/sveltekit-supabase-tutorial-day3/) : Bun Docker 배포
- [SvelteKit + Supabase 통합 - 4일차](/posts/sveltekit-supabase-tutorial-day4/) : Auth.js 연동

## 0. 개요

- [x] TailwindCSS + DaisyUI 설정
- [x] supabase 로컬 개발 환경 설정
- [x] Drizzle 설정 (postgresql)

> 화면 캡쳐

![svltk-drizzle-app-users](https://github.com/maxmin93/svltk-drizzle-app/blob/main/static/svltk-drizzle-app-users.png?raw=true){: width="540" .w-75}
_users 리스트 출력_

> 참고문서

- [깃허브 - SikandarJODD/SvelteKit-Drizzle](https://github.com/SikandarJODD/SvelteKit-Drizzle)
- [깃허브 - gustavocadev/sveltekit-drizzle-orm-planetscale-lucia](https://github.com/gustavocadev/sveltekit-drizzle-orm-planetscale-lucia)


## 1. 프로젝트 생성

### [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
pnpm create svelte@latest svltk-drizzle-app
  - Skeleton project
  - TypeScript

cd svltk-drizzle-app
pnpm install

pnpm run dev
```

### [TailwindCSS 설정](https://tailwindcss.com/docs/guides/sveltekit)

1. Install TailwindCSS, tailwind-merge
2. `tailwind.config.js` 에 template paths 추가
3. noto sans, d2coding 한글 폰트 추가
4. `app.css` 에 Tailwind directives 추가
5. 최상위 `+layout.svelte` 에 `app.css` import
6. `+page.svelte` 에서 TailwindCSS classes 를 사용해 작동 확인

```bash
pnpm add -D tailwindcss postcss autoprefixer tailwind-merge
pnpx tailwindcss init -p

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

cat <<EOF > src/app.css
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
  import '../app.css';
</script>
<slot />
EOF

cat <<EOF > src/routes/+page.svelte
<h1 class="text-3xl font-bold underline">Hello, SvelteKit!</h1>
EOF

pnpm run dev
```

> 참고

- [sed 명령어 - How To Replace Text with a Bash Script](https://levelup.gitconnected.com/bash-script-to-replace-text-904f1ba05bc)


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
    themes: ['cmyk', 'dark', 'lofi'], // HTML[data-theme]
  },
};
```

```html
<div class="card m-10 w-96 bg-base-100 shadow-xl" data-theme="lofi">
  <figure>
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

> 랜덤 이미지 `https://picsum.photos/200/300`

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

프로젝트에 필요한 DB 및 설정들을 개별적으로 관리할 수 있다.

### [supabase CLI 설치 및 사용](https://supabase.com/docs/guides/cli/getting-started)
 
0. supabase login : access token 입력 (클라우드와 link 할 때 필요)
1. supabase init : `supabase/config.toml` 설정 파일 생성됨
2. `supabase/seed.sql` 작성
3. supabase start : docker 컨테이너 실행
4. supabase studio : [http://localhost:54323](http://localhost:54323)

```bash
# .env
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
SUPABASE_ANON_KEY="..."
SUPABASE_URL="http://localhost:54321"
```

#### [DB migration](https://supabase.com/docs/guides/cli/local-development#database-migrations)

- db reset 할 때, migrations sql 파일들은 이름 순서대로 실행된다.
- migrations 의 sql 파일들이 먼저 실행된 후, seed.sql 이 실행된다.

```bash
supabase migration new tables
# `supabase/migrations/{timestamp}_tables.sql` 파일 생성
# cat 명령어로 파일 생성해도 마찬가지로 동작함

cat <<EOF > supabase/migrations/$(date '+%Y%m%d%H%M%S')_tables.sql
-- Create the table
CREATE TABLE countries (
 id SERIAL PRIMARY KEY,
 name VARCHAR(255) NOT NULL COLLATE "ko-x-icu"
);
EOF

cat <<EOF > supabase/seed.sql
-- Insert some sample data into the table
INSERT INTO countries (name) VALUES 
('미국'),('캐나다'),('러시아'),('중국'),('일본'),('한국');
EOF

# DB 컨테이너가 재시작 되며 초기화 된다
supabase db reset
```

Supabase Studio 의 SQL Editor 로 데이터 확인

```sql
-- # 사용 가능한 collation 리스트
SELECT collname FROM pg_collation where collname like 'ko%';
-- => ko-x-icu
-- => ko-KR-x-icu
-- => ...

-- # collation 적용된 테이블과 컬럼 조회
select table_schema, table_name, column_name, collation_name
from information_schema.columns
where table_schema = 'public' and collation_name is not null
order by table_schema, table_name, ordinal_position;

-- query
select * from countries;
```

### [Drizzle ORM + Supabase](https://orm.drizzle.team/docs/quick-postgresql/supabase) 설정

#### Drizzle Kit 설치 및 설정

- DATABASE_URL 환경변수 (`.env`) 설정
- `src/lib/db/schema.ts` 파일 생성
- [`drizzle.config.ts` 파일 생성](https://orm.drizzle.team/kit-docs/conf)
- 마이그레이션 : schema 파일로부터 push (자동)

> drizzle-kit 은 npm 또는 pnpm 으로 실행해야 한다. 

```bash
pnpm add drizzle-orm postgres dotenv
pnpm add -D drizzle-kit

# drizzle config 파일 생성
touch drizzle.config.ts

# db 를 읽어서 schema.ts 파일 자동 생성 (필요한 코드만 가져다 쓴다)
pnpm drizzle-kit introspect:pg

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
- `.env` 에 DATABASE_URL 환경변수가 있어야 한다

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


## 9. Review

- 아직도 본론은 안들어 갔다. (이제 시작 2)
- daisyUI 는 색감이 이쁘다. 설치도 아주 간편하다.
- drizzle ORM 은 typescript 로 schema 를 정의하는 가벼운 ORM 이다.
  + 이 때문에 [serverless 환경에서 대략 2배 이상 빠르다고 한다.](https://github.com/drizzle-team/drizzle-northwind-benchmarks-pg#sample-runs)
  + 잡다한 기능이 없어서 반쯤은 수동으로 DB 를 다룰수 있어서 편하다.
  + prisma 에 질린 개발자들 사이에서 인기가 높다. (동감)
  + drizzle-kit 기능이 아직 부족하다.
  + 참고: [Seeding Database With Drizzle ORM](https://dev.to/anasrin/seeding-database-with-drizzle-orm-fga)


### Javascript with JSDoc

최근 추세가 Typescript 로부터 탈출하는 경향이 있어서 관련 이슈를 살펴보았다. Typescript 는 초기 JS 의 알 수 없는 오류로부터 안전을 보장받기 위해서 시작된 보조 도구였는데, 요즈음은 형세가 역전되어 Type 가드를 위한 잡다한 코드를 발생시키고 빨간줄을 없애기 위해 생산성을 떨어뜨리는 지경에 이르렀다고 느끼는 사람들이 늘어난 모양이다. 또 다른 개발도구와 프레임워크의 도움으로 타입 검사가 꼭 필요한 케이스가 줄은 탓도 크다.

- js 파일에서 타입체크를 하고 싶으면 [최상단에 `@ts-check` 을 넣으면 된다.](https://code.visualstudio.com/docs/nodejs/working-with-javascript#_type-checking-javascript)

- 참고 : [JSDoc - type](https://jsdoc.app/tags-type.html)
  - lint 의 빨간줄을 피하고 싶으면 `/** @type {...} */` 를 이용하면 된다.
  - 타입체크를 무력화 할 수도 있다.
    + 한줄 `@ts-ignore`
    + 문서 전체 `@ts-nocheck`

- 참고 : [TypeScript vs. JSDoc JavaScript for static type checking](https://blog.logrocket.com/typescript-vs-jsdoc-javascript/)
  - JSDoc 장점
    - 실수를 피하면서 약간의 유형 안전성을 원할 때
    - 컴파일 단계가 없는 것을 선호할 때 (더 빠른 변경과 반영)
  - JSDoc 단점
    - 그렇지만, Typescript 가 JSDoc 보다 도구 지원이 더 좋다. (약간의 차이)
    - Typescript 보다 타이핑이 더 많다.

```js
  const checkIfExist = (
    /** @type {any} */ objectName,
    /** @type {string} */ keyName
  ) => {
    let keyExists = Object.keys(objectName).some((key) => key === keyName);
    return keyExists && objectName[keyName] ? true : false;
  };

  console.log(checkIfExist(data, 'tag')); // Returns true|false
```

> 이번에는 Javascript 로 진행해보려 했다가 TS 로 다시 바꿨다.

- drizzle 이 ts 용 ORM 라이브러리라서 TS 필요
  - prisma 보다는 경량이라는 점이 확실히 이점이라
- JSDoc 을 사용해 보았지만, 줄곳 Typescript 만 사용하던 관행이 있어서 Javascript 가 낯설게 느껴졌다. 컴파일 과정이 필요하지 않을 정도로 고수이거나, 추가 개발에 부담을 느끼는 라이브러리 개발자들, 빠른 실행을 위해 단계를 단축하고 싶은 사람들이나 사용할 법하다고 느꼈다. 
  - 나 같은 어설픈 개발자에게는 vscode 와 typescript 조합이 최고다.
  - Rich Harris : 라이브러리 개발에는 JSDoc 을 쓰자! (Typescript 과열)

> 앱 개발시에는 어차피 컴파일 과정이 있어서 JSDoc 사용의 효용이 크지 않다.
  
&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
