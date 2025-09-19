---
date: 2024-01-22 00:00:00 +0900
title: Svelte Server Pagination
description: DaisyUI 와 Sqlite 를 이용해 테이블과 페이지네이션 컴포넌트를 구현합니다. Svelte 의 load 기능과 drizzle 의 select 문을 이용해 server 모드에서 작동합니다.
categories: [Frontend, Svelte]
tags: ["daisyui","drizzle","sqlite","ui-components"]
image: "https://img.youtube.com/vi/G-tafjJzfQo/0.jpg"
---

## 0. 개요

참고 : [Huntabyte - Pagination with SvelteKit](https://www.youtube.com/watch?v=G-tafjJzfQo)

## 1. 프로젝트 생성

### [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
bun create svelte@latest daisyui-svelt-app
  # - Skeleton project
  # - Typescript
  # - Prettier

cd daisyui-svelt-app
bun install

bun run dev
```

### [TailwindCSS 설정](https://tailwindcss.com/docs/guides/sveltekit)

1. tailwind, postcss 설치 (typography)
2. daisyui 및 melt-ui, 개발 유틸리티 설치
3. `.prettierrc` 설정 : tailwind 플러그인
4. `vite.config.ts` 설정 : purgeCss (highlight.js 클래스 제거 방지)
5. `svelte.config.js` 설정 : melt-ui 전처리기
6. `tailwind.config.js` 설정 : Noto 폰트, daisyui
7. `app.html` : D2Coding 폰트, lang 설정
8. `app.pcss` : tailwind 테마 설정
9. `+layout.svelte` : 전역 css 연결
10. `+page.svelte` : 데모 코드를 넣어 tailwind 작동 확인

```bash
# tailwind 설치
bun add -d tailwindcss postcss autoprefixer
bun add -d @tailwindcss/typography  #@tailwindcss/forms

bunx tailwindcss init -p

# tailwind 필수 라이브러리, 아이콘 설치
bun add -d vite-plugin-tailwind-purgecss prettier-plugin-tailwindcss
bun add tailwind-variants clsx tailwind-merge lucide-svelte

# tailwindcss 컴포넌트 설치
bun add -d daisyui@latest
# headless-ui 컴포넌트 설치
bun add -d @melt-ui/svelte @melt-ui/pp @internationalized/date

# utilities 설치
bun add @faker-js/faker  # 가짜 데이터
bun add svelte-legos  # 유용한 UI 기능들 (svelte 확장판)
bun add svelte-persisted-store  # local-storage 관리
bun add sveltekit-superforms zod  # action, load 에 스키마 적용


# prettier 에 tailwind 플러그인 추가
sed -i '' 's/"prettier-plugin-svelte"\]/"prettier-plugin-svelte","prettier-plugin-tailwindcss"\]/' .prettierrc

echo "bun.lockb" >> .prettierignore


# purgecss 설정
cat <<EOF > vite.config.ts
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    purgeCss({ safelist: {greedy: [/^hljs-/] }}),
  ]
});
EOF

# melt-ui 전처리기 설정, a11y 경고 문구 가리기
cat <<EOF > svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { preprocessMeltUI, sequence } from '@melt-ui/pp';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
  kit: {
    adapter: adapter()
  },
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-')) {
      return;
    }
    if (warning.code === 'css-unused-selector') {
      return;
    }
    handler(warning);
  }  
};
export default config;
EOF

# tailwind 테마 설정 : class, colors, font 등..
cat <<EOF > tailwind.config.js
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  safelist: ['dark'],  // purge 제외 대상
  theme: {
    fontFamily: {
      sans: ['"Noto Sans KR"', ...fontFamily.sans],
      serif: ['"Noto Serif KR"', ...fontFamily.serif],
      mono: ['D2Coding', ...fontFamily.mono],
    },  
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: false,  // light, dark
    logs: false
  }
};
EOF


# 기본 언어 설정, D2Coding 폰트 추가
cat <<EOF > src/app.html
<!doctype html>
<html lang="ko" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body data-sveltekit-preload-data="hover" class="min-h-screen bg-background font-sans antialiased">
    <div style="display: contents" class="relative flex min-h-screen flex-col">%sveltekit.body%</div>
  </body>
</html>
EOF


# tailwind 변수 및 설정 (shacdn-svelte 참고), Noto 폰트 추가
cat <<EOF > src/app.pcss
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');
@import url("//cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-ligature-full.css");

@tailwind base;
@tailwind components;
@tailwind utilities;
EOF


cat <<EOF > src/routes/+layout.svelte
<script>
  import '../app.pcss';
</script>

<slot />
EOF

# 작성된 route 위치의 error 는 +error.svelte 로 전달된다
cat <<EOF > src/routes/+error.svelte 
<script lang="ts">
  import { page } from '\$app/stores';
</script>

<article class="prose p-8 lg:prose-xl">
  <h1 class="text-error">{\$page.status}</h1>
  <p>
    {\$page.error.message} on <b>{\$page.url.pathname}</b>
  </p>
</article>
EOF


mkdir -p src/lib/components/ui
mkdir "src/routes/(base)"

cat <<EOF > src/lib/components/ui/mode-toggle.svelte
<script>
  import { Moon, Sun } from 'lucide-svelte';
  const size = 8;
</script>

<label class="swap swap-rotate">
  <input type="checkbox" class="theme-controller" value="dark" />
  <Sun class="swap-on h-{size} w-{size} fill-current" />
  <Moon class="swap-off h-{size} w-{size} fill-current" />
</label>
EOF

# daisyui - header - navbar 사용
cat <<EOF > "src/routes/(base)/+layout.svelte"
<script>
  import ModeToggle from '\$lib/components/ui/mode-toggle.svelte';
</script>

<div class="relative flex min-h-screen flex-col" id="page">
  <!-- SiteHeader -->
  <header class="navbar sticky top-0 bg-base-300 px-4">
    <div class="navbar-start flex gap-4">
      <div class="avatar">
        <div class="w-8 rounded-xl ring ring-base-content ring-offset-base-100">
          <img src="https://daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg" />
        </div>
      </div>    
      <span class="text-4xl font-bold">Title</span>
    </div>
    <div class="navbar-center">
      <div class="flex items-center gap-4">
        <a href="/users">Users</a>
      </div>
    </div>
    <div class="navbar-end">
      <ModeToggle />
    </div>
  </header>
  <!-- /SiteHeader -->

  <!-- SiteContent -->
  <slot />
  <!-- /SiteContent -->
</div>
EOF

cat <<EOF > "src/routes/(base)/+page.svelte"
<script>
  import { BookOpen } from 'lucide-svelte';
  import { faker } from '@faker-js/faker/locale/ko';
</script>

<main class="hero min-h-[calc(100vh-64px)]">
  <section class="hero-content">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">안녕, daisyUI</h1>
      <p class="py-6">{faker.lorem.paragraph(4)}</p>
      <button class="btn btn-primary">
        <BookOpen size="2rem" />
        <span class="text-2xl">Get Started</span>
      </button>
    </div>
  </section>
</main>
EOF

bun run dev
```

### DB & ORM 설정 (bun:sqlite)

bun:sqlite 을 내장한 bun 런타임을 실행하기 위해 `--bun` 옵션을 사용한다.

```bash
bun add drizzle-orm
bun add -d drizzle-kit

mkdir drizzle
mkdir src/lib/server


cat <<EOF >> .env  
DB_URL=db.sqlite
EOF


cat <<EOF > src/lib/server/schema.ts
import { sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id', { length: 36 })
    .primaryKey()
    .\$defaultFn(() => crypto.randomUUID()),
  username: text('username'),
  email: text('email', { length: 256 }),
  status: text('status'),
  revenue: real('revenue') // float(precision=2)
});
EOF


cat <<EOF > src/lib/server/index.ts
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { sql } from 'drizzle-orm';
// @ts-ignore
import { Database } from 'bun:sqlite';  // bun 런타임
import { DB_URL } from '\$env/static/private';
import * as schema from './schema';

const sqlite = new Database(DB_URL);  // DB 파일 이름
export const db = drizzle(sqlite, { schema });

// for DEBUG
const query = sql\`select "bun:sqlite" as text\`;
const result = db.get<{ text: string }>(query);
console.log('database: ' + result?.text);
EOF


cat <<EOF > drizzle/migrate.ts
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { drizzle } from 'drizzle-orm/bun-sqlite';
// @ts-ignore
import { Database } from 'bun:sqlite';

const sqlite = new Database(process.env.DB_URL as string);
export const db = drizzle(sqlite);

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: 'drizzle/migrations'
    });
    console.log('Tables migrated!');
    process.exit(0);
  } catch (error) {
    console.error('Error performing migration: ', error);
    process.exit(1);
  }
}

main();
EOF


cat <<EOF > drizzle/seed.ts
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { count } from 'drizzle-orm';
// @ts-ignore
import { Database } from 'bun:sqlite';
import { faker } from '@faker-js/faker';
import * as schema from '../src/lib/server/schema';

const main = async () => {
  const sqlite = new Database(process.env.DB_URL as string);
  const db = drizzle(sqlite);
  const data: (typeof schema.users.\$inferInsert)[] = [];

  for (let i = 0; i < 20; i++) {
    data.push({
      id: faker.string.nanoid(21),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      status: faker.helpers.arrayElement(['Proceeding', 'Pending', 'Completed']),
      revenue: faker.number.float({ min: 0.0, max: 1000.0, precision: 0.01 })
    });
  }

  console.log(\`Seed start (\${data.length})\`);
  await db.insert(schema.users).values(data);
  let total = await db.select({ value: count() }).from(schema.users);
  console.log(\`Seed done.. (total=\${total.at(-1)?.value})\`);
};

main();
EOF

# package.json 에 drizzle 스크립트 명령어 추가
  "scripts": {
    "drizzle:generate": "drizzle-kit generate:sqlite --out ./drizzle/migrations --breakpoints --schema=./src/lib/server/schema.ts",
    "drizzle:migrate": "bun drizzle/migrate.ts",
    "drizzle:seed": "bun drizzle/seed.ts",
    # ...
  },

bun run drizzle:generate  # 1. DDL sql 생성 
bun run drizzle:migrate  # 2. db 적용
bun run drizzle:seed  # 3. data 추가


cat <<EOF > "src/routes/(base)/+page.server.ts"
import { db } from '\$lib/server/index.js';
import { users } from '\$lib/server/schema';
import { count } from 'drizzle-orm';

export const load = async () => {
  const pageSize = 10;
  const pageData = await db.select().from(users).orderBy(users.id).limit(pageSize);
  const totalSize = await db.select({ value: count() }).from(users);

  // for DEBUG
  for (let index = 0; index < pageData.length; index++) {
    const element = pageData[index];
    console.log(\`[\${index}] \${element.id} \${element.email}\`);
  }
  
  return {
    total: totalSize.at(-1)?.value || 0
    pageSize,
    pageData
  };
};
EOF


# bun:sqlite 위해 bun 런타임 실행
bun --bun run dev
```


## 2. Table 및 Pagination

![daisyui-table-pagination-param](/2024/01/22-daisyui-table-pagination-param.png){: width="560" .w-75}
_daisyui-table-pagination-param_

### Table 출력

- daisyUI 의 table 컴포넌트를 활용
- svelte-legos 의 컬럼 정렬 기능을 활용 (Table 데이터 내에서 작동)
- `/users?skip=10` 에서 skip 파라미터를 기준으로 현재 페이지와 번호를 계산
  - skip=10 이면 pageSize=10 기준으로 2번재 페이지를 출력

```svelte
<script lang="ts">
  import TableCellStatus from './table-cell-status.svelte';
  import { sortableTableAction } from 'svelte-legos';
  import { page } from '$app/stores';
  import type { PageData } from '../$types';
  export let data: PageData;

  $: pageSize = data.pageSize || 10;
  $: currentPage = (Number($page.url.searchParams.get('skip')) || 0) / pageSize;  
</script>

<table class="table text-xs" use:sortableTableAction>
  <thead>
    <tr class="text-md">
      <th>No.</th>
      <th>Name</th>
      <th>Email</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    {#each data.users as user, index (user.id)}
      <tr class="hover">
        <td>{currentPage * pageSize + index + 1}</td>
        <td>{user.username}</td>
        <td>{user.email}</td>
        <td><TableCellStatus value={user.status} /></td>
      </tr>
    {/each}
  </tbody>
</table>
```

### Status 컴포넌트 출력

- daisyUI 의 badge 컴포넌트를 활용
- tailwind-variants 로 조건부 스타일을 적용

```svelte
<script lang="ts">
  import { tv } from 'tailwind-variants';
  const status = tv({
    base: 'badge badge-outline badge-sm',
    variants: {
      color: {
        completed: 'badge-success',
        proceeding: 'badge-info',
        pending: 'badge-warning'
      }
    }
  });
  export let value: string;
</script>

<span class={status({ color: value.toLowerCase() })}>
  {value}
</span>
```

#### Pagination 출력

- daisyUI 의 pagination 컴포넌트를 사용했다.

![daisyui-table-pagination-last](/2024/01/22-daisyui-table-pagination-last.png){: width="560" .w-75}
_daisyui-table-pagination-last_

> pagination 버튼

- 첫 페이지 : 현재 페이지가 첫 페이지인 경우 제외
- 다음 페이지 : 현재 페이지가 첫 페이지인 경우 비활성화(disable)
- 페이지 번호 : slide 크기만큼 (slideSize=5)
- 이전 페이지 : 현재 페이지가 마지막 페이지인 경우 비활성화(disable) 
- 마지막 페이지 : 현재 페이지가 마지막 페이지인 경우 제외

```svelte
    <div class="join mt-4">
      {#if !visiblePages.includes(1)}
        <a
          href="/users?skip={0}"
          class="btn join-item"
          class:btn-active={currentPage === 0}
        >
          <ChevronsLeft class="h-4 w-4" /></a
        >
      {/if}
      <a
        href="/users?skip={(currentPage - 1) * pageSize}"
        class="btn join-item"
        class:btn-disabled={currentPage === 0}
      >
        <ChevronLeft class="h-4 w-4" /></a
      >

      {#each visiblePages as idx}
        <a
          href="/users?skip={pageSize * idx}"
          class="btn join-item"
          class:btn-active={currentPage === idx}
        >
          {idx + 1}</a
        >
      {/each}

      <a
        href="/users?skip={(currentPage + 1) * pageSize}"
        class="btn join-item"
        class:btn-disabled={currentPage === totalPages - 1}
      >
        <ChevronRight class="h-4 w-4" /></a
      >
      {#if !visiblePages.includes(totalPages - 2)}
        <a
          href="/users?skip={pageSize * (totalPages - 1)}"
          class="btn join-item"
          class:btn-active={currentPage === totalPages - 1}
        >
          <ChevronsRight class="h-4 w-4" /></a
        >
      {/if}
    </div>
```

### url 로부터 parameter 입력 받기

> [URLSearchParms 방식](https://kit.svelte.dev/docs/web-standards#url-apis-urlsearchparams)

`url.searchParams.get('{변수}')`

- svelte 페이지에서 사용시 `import { page } from '$app/stores';` 
- script 에서 사용시 `load({ url })`

> [params 방식](https://kit.svelte.dev/docs/load#using-url-data-params)

`params.{변수}`

- svelte 페이지에서 사용시 `import { page } from '$app/stores';` 
- script 에서 사용시 `load({ params })`
  - `url.pathname` 과 `route.id` 에서 가져올 수도 있다.


## 3. SvelteKit PageLoad 와 slug 입력

![daisyui-table-pagination-slug](/2024/01/22-daisyui-table-pagination-slug.png){: width="560" .w-75}
_daisyui-table-pagination-slug_

### pagination 변수들

reactive 블럭을 이용해 값 변경시마다 pagination 변수들을 재계산 한다.

- pageSize : 테이블에 출력될 item 개수
- totalItems : DB 테이블의 총 item 개수
- totalPages : totalItems 와 pageSize 를 이용해 총 page 수를 계산
- currentPage : 현재 페이지 (1 부터 시작)
- slideSize : pagination 에 보여질 페이지 번호 Array 크기를 지정
- visiblePages : 총 페이지수와 현재 페이지, slideSize 를 이용해 pagination 에 보여질 페이지 번호 Arrary 를 생성

```svelte
<script lang="ts">
  import type { PageData } from '../$types';
  export let data: PageData;

  let pageSize: number;
  let currentPage: number;
  let totalItems: number;
  let totalPages: number;
  let visiblePages: number[] = [];
  const slideSize = 5;

  $: {
    pageSize = data.pageSize || 10;
    totalItems = data.totalSize || 0;
    totalPages = Math.ceil(totalItems / pageSize);
    currentPage = data.currentPage || 1;
    visiblePages = Array.from(Array(slideSize).keys())
      .map((n) => 1 + n + slideSize * Math.trunc((currentPage - 1) / slideSize))
      .filter((n) => n <= totalPages);
    // console.log('DEBUG:', currentPage, visiblePages);
  }
</script>
```

### PageServerLoad

참고 : [깃허브 - huntabyte/sk-pg](https://github.com/huntabyte/sk-pg/blob/main/src/routes/songs/%5Bpage%5D/%2Bpage.server.ts)

- params 를 통해 `[page]` 변수값을 불러온다 (예시: `/users/1`)
  - url parameter 보다 path 를 이용한 방식이 svelte 에 더 어울린다. (깔끔)
- 요청 페이지가 없으면 첫 페이지로 redirect 처리
  - SvelteKit 2.0 부터 throw 를 사용하지 않아도 되도록 변경되었음
- limit, skip 을 통해 select 하고, svelte 페이지 데이터로 전달

```ts
import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/index.js';
import { users } from '$lib/server/schema';
import { count } from 'drizzle-orm';

export const load = async ({ params }) => {
  if (!params.page || Number(params.page) <= 0) {
    redirect(302, '/users/1'); // sveltekit2
  }

  const page = Number(params.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  // console.log(page, limit, skip);

  async function getTotalSize() {
    const totalSize = await db.select({ value: count() }).from(users);
    return totalSize.at(-1)?.value || 0;
  }

  async function getUsers(limit: number = 10, skip: number = 0) {
    const data = await db.select().from(users).orderBy(users.id).limit(limit).offset(skip);
    return data;
  }

  return {
    pageSize: limit,
    currentPage: page,
    totalSize: await getTotalSize(),
    users: await getUsers(limit, skip)
  };
};
```

## 9. Review

- tailwind 컴포넌트만 있지, 로직과 함께 있는 pagination 코드가 없어서 스스로 작성해 보았다.
- 페이지 변경시 페이지 reload 가 발생하지 않도록 form & action 을 사용해 보자.
- pagination 버튼들을 어떻게 구성할지도 고민해 볼 거리다. (UX 문제)

> jekyll blog pagination

첫 페이지와 마지막 페이지 버튼 좌우로 이동 버튼을 놓고, 중간에 페이지 번호를 배치 (좋다!)

![jekyll-blog-pagination-example](/2024/01/22-jekyll-blog-pagination-example.png){: width="560" .w-75}
_jekyll-blog-pagination-example_


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
