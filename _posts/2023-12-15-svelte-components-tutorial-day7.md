---
date: 2023-12-15 00:00:00 +0900
title: Svelte Component 라이브러리 - 7일차
description: 원하는 UI 구성을 위해 headless 컴포넌트 라이브러리인 melt-UI 를 공부합니다. 이와 함께 daisyUI 를 사용할 방법을 찾아봅니다. 웹프레임워크로 SveltKit 을 사용하고 bun 런타임 위에서 실행합니다.
categories: [Frontend, Svelte]
tags: ["melt-ui","ui-components","tailwind"]
image: "https://www.melt-ui.com/banner.png"
---

> 목록
{: .prompt-tip }

- [Svelte Component 라이브러리 - 1일차](/posts/svelte-components-tutorial-day1/) : Steeze UI
- [Svelte Component 라이브러리 - 2일차](/posts/svelte-components-tutorial-day2/) : Flowbite Svelte
- [Svelte Component 라이브러리 - 3일차](/posts/svelte-components-tutorial-day3/) : Flowbite Blocks
- [Svelte Component 라이브러리 - 4일차](/posts/svelte-components-tutorial-day4/) : daisyUI Svelte
- [Svelte Component 라이브러리 - 5일차](/posts/svelte-components-tutorial-day5/) : Skeleton
- [Svelte Component 라이브러리 - 6일차](/posts/svelte-components-tutorial-day6/) : Open Props
- [Svelte Component 라이브러리 - 7일차](/posts/svelte-components-tutorial-day7/) : melt-UI &nbsp; &#10004;

svelte-components 시리즈를 6개나 쓰면서 만족스럽지 못했는데, 드디어 찾은거 같다. melt-ui 는 headless, accessible 컴포넌트 빌더라고 설명되어 있다. 사용법을 보면 style 에 관해서는 css 를 쓰거나 tailwind 를 골라서 사용할 수 있다. melt-ui 는 단지 builder 를 불러와 원하는 component 의 기능을 구현시키는 역활을 하고 있다. Tab 컴포넌트를 만드는데 skeleton 이나 flowbite 처럼 style 과 내용을 모두 사전에 정의된 스펙에 맞추어 사용할 필요가 없다. 게다가 컴포넌트 종류도 많다. 앞으로 melt-ui 을 익숙하게 다루도록 연습할 계획이다.

## 0. 개요

- [x] 웹프레임워크 및 개발도구
  - Bun 1.0.15 + Vite 5.0.3 + SvelteKit 2.0.0
  - typescript 5.0.0
  - prettier 3.1.1
  - [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte) 3.1.2
- [x] CSS 유틸리티
  - TailwindCSS 3.3.6 + postcss 8.4.32
  - Tailwind: forms + typography
  - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss) 0.5.9
  - [vite-plugin-tailwind-purgecss](https://www.npmjs.com/package/vite-plugin-tailwind-purgecss) 0.1.4
  - [tailwindcss-debug-screens](https://www.npmjs.com/package/tailwindcss-debug-screens) 2.2.1
  - [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) 2.1.0
- [x] UI 라이브러리
  - [daisyUI](https://daisyui.com/) 4.4.22 (Tailwind Components)
  - [melt-ui](https://www.melt-ui.com/) 0.66.0 (Headless UI)
- [x] 유틸리티
  - fonts : D2Coding, Noto Sans/Serif KR, Noto Color Emoji
  - [faker-js](https://www.npmjs.com/package/@faker-js/faker) 8.3.1
  - [lucide-svelte](https://www.npmjs.com/package/lucide-svelte) 0.295.0 (아이콘 1346개, ISC 라이센스)

> heroicons 는 292개에 불과. lucide 아이콘이 훨씬 많다. (상용 가능 라이센스)

## 1. 프로젝트 생성

Svelte 버전이 4.x 이라서 SvelteKit 2.0 이라도 큰 변화는 없다.

### [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
bun create svelte@latest svltk2-meltui-app
  # - Skeleton project
  # - Typescript
  # - Prettier

cd svltk2-meltui-app
bun install

# bun runtime
bun --bun dev
```

### [TailwindCSS 설정](https://tailwindcss.com/docs/installation/using-postcss)

> 작업 목록

1. Tailwind, Components, 개발도구 설치
2. 한글 폰트, 아이콘, 유틸리티 설치
3. `.prettierrc` 설정 : svelte, tailwind
4. `vite.config.ts` 설정 (highlight.js 클래스 제거 방지)
5. `svelte.config.js` 설정 : melt-ui
6. `tailwind.config.js` 설정 : 폰트, plugins
7. `src/app.html` 설정 : 폰트, theme
8. `src/app.postcss` 설정 : 폰트, Tailwind directives
9. `src/+layout.svelte` : 전역 css 연결
10. `src/+page.svelte` : 데모 코드 작성후 확인

> 작업 로그

```bash
# tailwind 설치
bun add -d tailwindcss postcss autoprefixer tailwind-merge
bun add -d @tailwindcss/typography @tailwindcss/forms

# tailwind plugins 설치
bun add -d vite-plugin-tailwind-purgecss
bun add -d prettier-plugin-tailwindcss
bun add -d tailwindcss-debug-screens

# components UI 설치
bun add -d daisyui
# date 관련 컴포넌트 사용시 @internationalized/date 필요!
bun add -d @melt-ui/svelte @internationalized/date
bun add -d @melt-ui/pp svelte-sequential-preprocessor

# utilities 설치 : icons, faker, date (melt-ui 에서 사용)
bun add -d lucide-svelte
bun add -d @faker-js/faker
bun add -d @internationalized/date
bun add date-and-time

bunx tailwindcss init -p

# prettier 에 tailwind 플러그인 추가
sed -i '' 's/"prettier-plugin-svelte"\]/"prettier-plugin-svelte","prettier-plugin-tailwindcss"\]/' .prettierrc

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

# melt-ui 전처리기 설정 (vite 뒤에)
cat <<EOF > svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { preprocessMeltUI } from '@melt-ui/pp';
import sequence from 'svelte-sequential-preprocessor';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config}*/
const config = {
  preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
  kit: {
    adapter: adapter()
  },
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-')) {
      return;
    }
    handler(warning);
  }  
};
export default config;
EOF

# default fonts, typography, forms 설정
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
  plugins: [
    require('@tailwindcss/typography'), 
    require('@tailwindcss/forms'),
    require('tailwindcss-debug-screens'),
    require('daisyui')
  ],
  daisyui: {
    logs: false,
    themes: ['light', 'dark'] // HTML[data-theme]
  }
};
EOF

# lang, daisyUI theme 설정
# svelte preload 설정 지우고, debug-screens 설정
cat <<EOF > src/app.html
<!doctype html>
<html lang="ko" data-theme="light">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
  </head>
  <body class="debug-screens">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
EOF

# Tailwind 설정, 폰트 추가 (Noto 한글 및 Emoji)
cat <<EOF > src/app.pcss
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');
@import url("//cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-ligature-full.css");

@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  @apply h-full sm:scroll-smooth;
}
EOF

cat <<EOF > src/routes/+layout.svelte
<script lang="ts">
  import '../app.pcss';
</script>

<slot />
EOF
```

#### tailwind 유틸리티

```bash
bun add tailwind-variants clsx tailwind-merge
```

> `$lib/utils.ts`

`cn` 함수를 이용하면, join 과 merge 가 적용된 tailwind 클래스 문자열을 얻게 된다.

- clsx 는 모든 클래스 이름을 결합하고 단일 문자열을 출력 (dict 형태도 다룬다)
- twMerge 는 같은 종류의 tailwind 클래스들을 overlay 하여 출력
- 참고
  - [Simplify Your Tailwind CSS Class Management with Merge and Clsx](https://medium.com/@nomanfareed681/simplify-your-tailwind-css-class-management-with-merge-and-clsx-42f1e2458fd8)
  - [Tailwind와 React에서 클래스 이름을 병합하는 방법](https://korayguler.medium.com/how-to-merge-react-and-tailwind-css-class-names-f5faeb10ed24)

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
```

> [tailwind variants 사용법](https://www.tailwind-variants.org/docs/getting-started#usage) 

```svelte
<script>
import { tv } from 'tailwind-variants';
 
const button = tv({
  // 공통
  base: 'font-semibold text-white text-sm py-1 px-4 rounded-full active:opacity-80',
  // 옵션
  variants: {
    color: {
      primary: 'bg-blue-500 hover:bg-blue-700',
      secondary: 'bg-purple-500 hover:bg-purple-700',
      success: 'bg-green-500 hover:bg-green-700'
    }
  }
});
</script>

<button class={button({ color:'primary' })}>Outline</button>
```

#### 데모 `src/+page.svelte`

- daisyUI : hero 클래스, light 테마
- melt-ui : Collapsible 컴포넌트
- lucide : 아이콘
- date-and-time : addDays
- faker : 회사 이름

```svelte
<script>
  import { createCollapsible, melt } from '@melt-ui/svelte';
  import { slide } from 'svelte/transition';
  import { ChevronsUpDown, X } from 'lucide-svelte';
  import { faker } from '@faker-js/faker/locale/ko';
  import { now, getLocalTimeZone } from '@internationalized/date';
  import date from 'date-and-time';

  const {
    elements: { root, content, trigger },
    states: { open }
  } = createCollapsible();

  let localTime = now(getLocalTimeZone()); // Asia/Seoul
  const yesterday = date.addDays(localTime.toDate(), -1);
</script>

<div class="hero bg-base-200 min-h-screen">
  <div class="hero-content">
    <div class="flex flex-col items-center">
      <section class="mx-auto w-screen bg-gray-400 p-4 text-center">
        <h1 class="text-5xl font-bold">안녕, Svelte &plus; daisyUI</h1>
        <p class="py-6">
          with <span class="font-bold">{faker.company.name()}</span> since
          <span class="italic">{date.format(yesterday, 'YYYY-MM-DD HH:mm')}</span>
        </p>
        <button class="btn btn-primary">시작하기</button>
      </section>

      <section>
        <!-- Collapsible start -->
        <div use:melt={$root} class="relative mx-auto mb-28 w-[18rem] max-w-full sm:w-[25rem]">
          <div class="flex items-center justify-between">
            <span class="text-magnum-900 text-sm font-semibold">
              @thomasglopes starred 3 repositories
            </span>
            <button
              use:melt={$trigger}
              class="text-magnum-800 relative h-6 w-6 place-items-center rounded-md bg-white
        text-sm shadow hover:opacity-75 data-[disabled]:cursor-not-allowed
        data-[disabled]:opacity-75"
              aria-label="Toggle"
            >
              <div class="abs-center">
                {#if $open}
                  <X class="square-4" />
                {:else}
                  <ChevronsUpDown class="square-4" />
                {/if}
              </div>
            </button>
          </div>

          <div class="my-2 rounded-lg bg-white p-3 shadow">
            <span class="text-base text-black">melt-ui/melt-ui</span>
          </div>

          <div
            style:position="absolute"
            style:top="calc(100% + 10px)"
            style:right="0"
            style:left="0"
          >
            {#if $open}
              <div use:melt={$content} transition:slide>
                <div class="flex flex-col gap-2">
                  <div class="rounded-lg bg-white p-3 shadow">
                    <span class="text-base text-black">sveltejs/svelte</span>
                  </div>
                  <div class="rounded-lg bg-white p-3 shadow">
                    <span class="text-base text-black">sveltejs/kit</span>
                  </div>
                </div>
              </div>
            {/if}
          </div>
        </div>
        <!-- Collapsible end -->
      </section>
    </div>
  </div>
</div>

<style lang="postcss">
  .abs-center {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
```

#### [daisyUI 에서 Headless UI 를 사용하는 방법](https://daisyui.com/blog/how-to-use-headless-ui-and-daisyui/)

- vue 와 react 에서는 [Headless UI](https://headlessui.com/) 를 사용할 수 있다.
- svelte 에서는 [Svelte Headless UI](https://svelte-headlessui.goss.io/docs/2.0) 또는 [melt-ui](https://www.melt-ui.com/) 를 함께 사용할 수 있다.
  - 재생성한 컴포넌트 라이브러리 예시 : [shadcn-svelte](https://www.shadcn-svelte.com/) ([bits-ui](https://www.bits-ui.com/) 처럼 만들었다) 

### bun:sqlite + drizzle ORM

bun 런타임 기반의 sqlite 를 이용하여 Database 기능을 개발할 수 있다. (turso 또는 sqlite3 등을 설치하지 않아도 된다)

> 참고문서

- [Bun - SQLite](https://bun.sh/docs/api/sqlite)
- [Drizzle - Bun SQLite](https://orm.drizzle.team/docs/get-started-sqlite#bun-sqlite)

> 라이브러리 설치 및 bun 런타임 실행

bun 런타임을 실행하기 위해 `--bun` 옵션을 사용한다.

```bash
bun add drizzle-orm
bun add -d drizzle-kit

# bun:sqlite 위해 bun 런타임 실행
bun --bun run dev
```

#### drizzle 설정

sveltekit 외적인 코드는 `{project}/drizzle` 에 두고, schema 와 orm 관련 코드들은 `$lib/server` 에 두는 것이 활용에 편리하다.

> `{project}/src/lib/server/schema.ts`

node 의 crypto API 도 bun 런타임에서 구현되어 있다. 그냥 똑같이 사용하면 된다.

```ts
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: text('id', { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  username: text('username'),
  email: text('email', { length: 256 })
});
```

> `{project}/src/lib/server/index.ts`

```ts
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { sql } from 'drizzle-orm';
// @ts-ignore
import { Database } from 'bun:sqlite';  // bun 런타임
import { SQLITE_DB } from '$env/static/private';
import * as schema from './schema';

const sqlite = new Database(SQLITE_DB);  // DB 파일 이름
export const db = drizzle(sqlite, { schema });

// for DEBUG
const query = sql`select "bun:sqlite" as text`;
const result = db.get<{ text: string }>(query);
console.log('database: ' + result?.text);
```

> `{project}/drizzle/migrate.ts`

`schema.ts` 에 기술된 내용대로 DDL 스크립트를 생성하여, migrations 에 저장

```ts
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { drizzle } from 'drizzle-orm/bun-sqlite';
// @ts-ignore
import { Database } from 'bun:sqlite';

const sqlite = new Database(process.env.SQLITE_DB as string);
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
```

> `{project}/drizzle/seed.ts`

`faker-js` 로 임의의 username, email 을 생성하여 users 테이블에 데이터 작성

```ts
import { drizzle } from 'drizzle-orm/bun-sqlite';
// @ts-ignore
import { Database } from 'bun:sqlite';
import { faker } from '@faker-js/faker';
import * as schema from '../src/lib/server/schema';

const main = async () => {
  const sqlite = new Database(process.env.SQLITE_DB as string);
  const db = drizzle(sqlite);
  const data: (typeof schema.users.$inferInsert)[] = [];

  for (let i = 0; i < 20; i++) {
    data.push({
      username: faker.internet.userName(),
      email: faker.internet.email()
    });
  }

  console.log('Seed start');
  await db.insert(schema.users).values(data);
  console.log('Seed done');
};

main();
```

> `{project}/package.json` 실행 스크립트

1. `bun --bun run drizzle:generate`  스크립트 작성
2. `bun --bun run drizzle:migrate` 스크립트 적용 (DB 생성)
3. `bun --bun run drizzle:seed` 시드 데이터 생성 (DB 기록)

```jsonc
  "scripts": {
    // ... ,
    "drizzle:generate": "drizzle-kit generate:sqlite --out ./drizzle/migrations --breakpoints --schema=./src/lib/server/schema.ts",
    "drizzle:migrate": "bun drizzle/migrate.ts",
    "drizzle:seed": "bun drizzle/seed.ts"
  }
```


## 2. daisyUI 로 dashboard 개발

### `+layout.svelte`

- div.drawer 메뉴를 포함한 최외곽 영역
  - input:checkbox.drawer-toggle 모바일용 메뉴 토글
  - main.drawer-content 대시보드의 콘텐츠 영역 (메인)
    - header : 제목, 검색창, 알림 아이콘, 프로파일 아이콘
    - **slot** : 페이지 영역
  - aside.drawer-side 메뉴 영역
    - nav 메뉴 그룹 영역
      - div 아바타 및 제품명
      - ul.menu 메뉴 리스트
        - li &gt; a 메뉴 아이템 

> lg 스크린샷

![users-infinite-table ending](/2023/12/15-users-infinite-table-end.png){: width="560" .w-75}
_users-infinite-table ending_

> lg 이하 모바일 스크린샷 

![daisyui-menu-drawer-mobile](/2023/12/15-daisyui-menu-drawer-mobile.png){: width="200" .w-75}
_daisyui-menu-drawer-mobile_

### bun:sqlite + drizzle 이용한 table 페이지

seed 데이터로 생성한 users 리스트를 daisyUI 의 테이블 클래스로 출력해본다.

- 초기 데이터 로딩 : `select * from users order by id limit 4`
- 버튼 클릭시 form action 으로 `pageSize=4` 만큼 users 데이터를 추가
- 추가된 users 데이터와 remains 개수를 갱신

> `+page.server.ts`

- [`drizzle-pagination`](https://github.com/miketromba/drizzle-pagination#readme) 를 이용해 커서 방식의 데이터 쿼리
  - fetch 를 위한 limit
  - 커서를 위한 기준 컬럼과 정렬 방식, 기준 value
    - 기준 value 이후의 데이터를 가져온다 (undefined 이면 첫부분을 가져온다)
    - 기준 value 는 이전 fetch 의 마지막 id 값을 formData 로 받아온다
- db.query 에서 스키마를 불러오려면, db 클라이언트 생성시 schema 를 포함해야 한다.
  - `export const db = drizzle(sqlite, { schema });`
- users 전체 크기를 가져오기 위해 count() 함수를 사용했다.

```ts
import { db } from '$lib/server';
import { users } from '$lib/server/schema';
import type { PageServerLoad, Actions } from './$types';
import { withCursorPagination } from 'drizzle-pagination';
import { count } from 'drizzle-orm';

const pageSize = 4;

// 추가 데이터 로딩 (버튼 클릭시)
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const lastId = data.get('lastId');
    console.log(`lastId = '${lastId}'`);

    const pageUsers = await db.query.users.findMany(
      withCursorPagination({
        limit: pageSize,
        cursors: [[users.id, 'asc', lastId]]
      })
    );
    return { pageUsers };
  }
} satisfies Actions;

// 초기 데이터 로딩
export const load: PageServerLoad = async () => {
  let usersSize = await db.select({ value: count() }).from(users);
  console.log(`Users.size = ${usersSize.at(-1)?.value}`);

  let pageUsers = await db.select().from(users).orderBy(users.id).limit(pageSize);
  return {
    pageUsers,
    usersSize: usersSize.at(-1)?.value
  };
};
```

> `+page.svelte`

- PageData 또는 ActionData 를 다룰 때에는 function 처리가 필요하다. (필수!)
  - 안하니깐 allUsers 가 제멋대로 갱신되었다가 이전 데이터로 되돌아가기도 했음
- onMount 를 이용해 초기 데이터를 갱신하고
- 이후 formAction 으로 페이지 refresh 없이 테이블 내용을 갱신
  - hidden 으로 lastId 값을 전달
  - submit 버튼 클릭시마다 aciton 실행
- [테이블 스타일은 daisyUI 를 이용](https://daisyui.com/components/table/)
  - [hover 클래스](https://daisyui.com/components/table/#table-with-a-row-that-highlights-on-hover) 덕분에 마우스 커서가 지나칠 때마다 테이블 행이 반전된다.

```svelte
<script lang="ts">
  import { pageTitle } from '$lib/stores';
  import { onMount } from 'svelte';
  import { enhance } from '$app/forms';

  function updateUsers(newUsers: any[]) {
    if (newUsers.length === 0) return;
    allUsers = [...allUsers, ...newUsers];
    lastId = allUsers.at(-1)?.id;
    remainsSize = (data.usersSize ?? 0) - allUsers.length;
    console.log(`lastId = '${lastId}' (remains ${remainsSize})`);
  }

  onMount(() => {
    pageTitle.update(() => 'Users');
    updateUsers(data.pageUsers);
  });

  import type { PageData, ActionData } from './$types';
  export let data: PageData;
  export let form: ActionData;
  let allUsers: any[] = [];
  let lastId: string | undefined = undefined;

  $: remainsSize = (data.usersSize ?? 0) - allUsers.length;
  $: if (form) updateUsers(form.pageUsers);
</script>

<div class="flex w-[90vw] flex-col pl-4 md:pl-8 lg:w-[60vw]">
  {#if allUsers.length == 0 || remainsSize > 0}
    <div class="grid w-full place-content-center">
      <form method="POST" use:enhance>
        <input type="hidden" name="lastId" value={lastId} />
        <button type="submit" class="btn btn-primary">remains more.. {remainsSize}</button>
      </form>
    </div>
  {/if}

  <table class="table">
    <!-- head -->
    <thead>
      <tr>
        <th></th>
        <th>Email</th>
        <th>Name</th>
      </tr>
    </thead>
    <tbody>
      {#each allUsers as item, i (i)}
        <tr class="hover">
          <th>{i + 1}</th>
          <td>{item.email} </td>
          <td>{item.username}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
```

> 스크린샷

![users-infinite-table first click](/2023/12/15-users-infinite-table-action.png){: width="560" .w-75}
_users-infinite-table first click_


## 3. melt-ui 사용법

너무 많아서 일단은 Toast 만 다루어본다.

### [Toast](https://melt-ui.com/docs/builders/toast)

daisyUI 의 [Toast 스타일](https://daisyui.com/components/toast/)을 사용해 꾸며보았다.

- daisyUI 의 toast, alert 스타일을 이용했다 (나머지는 melt-ui 샘플 코드를 참조)
- daisyUI 는 color 변수가 정의되어 있어서 지정하기 편하다.
  - primary, second, error, warning 등등..

```svelte
<script>
  const toastData: ToastData[] = [
    {
      title: 'success',
      description: 'Congratulations! It worked!',
      color: 'bg-green-500'
    },
    // ...
  ];  
</script>

<div class="toast" use:portal>
  {#each $toasts as { id, data } (id)}
    <div
      use:melt={$content(id)}
      animate:flip={_{ duration: 500 }_}
      in:fly={_{ duration: 150, x: '100%' }_}
      out:fly={_{ duration: 150, x: '100%' }_}
      class="alert alert-{data.title}"
    >
      <div class="">
        <h3 use:melt={$title(id)} class="flex items-center gap-2 font-semibold capitalize">
          <span class="square-1.5 rounded-full {data.color} px-1">&nbsp;</span>
          {data.title}
        </h3>
        <div use:melt={$description(id)}>
          {data.description}
        </div>
      </div>
      <button
        use:melt={$close(id)}
        class="square-6 grid place-items-center rounded-full text-magnum-500
          hover:bg-magnum-900/50"
      >
        <X class="square-4" />
      </button>
    </div>
  {/each}
</div>
```

> 스크린샷

![meltui-components-toast](/2023/12/15-meltui-components-toast.png){: width="560" .w-75}
_meltui-components-toast_

## 9. Review

- daisyUI 와 melt-ui 결합이 썩 잘 맞지 않는 듯한 느낌
  - Toast 작성할 때, close 역활을 하는 X 버튼 위치가 달라져서 거슬렸다.
  - melt-ui 는 svelte 의 transition 을 적극 채용하는데, daisyUI 와 어긋난다.
- [shadcn-svelte](https://www.shadcn-svelte.com/examples/forms) 은 melt-ui 와 tailwind 로 만들어진 라이브러리이다. 이걸 살펴봐야겠다.

### 참고 : clone projects

- source : [깃허브 - nazifbara/invoice-app](https://github.com/nazifbara/invoice-app)
- live : [fm-nazif-invoice-app](https://fm-nazif-invoice-app.netlify.app/)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
