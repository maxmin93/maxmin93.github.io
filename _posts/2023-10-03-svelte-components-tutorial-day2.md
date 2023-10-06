---
date: 2023-10-03 00:00:00 +0900
title: Svelte Component 만들기 - 2일차
categories: ["frontend","svelte"]
tags: ["flowbite","tailwind","supabase","2nd-day"]
image: "https://cdn.icon-icons.com/icons2/2699/PNG/512/tailwindcss_logo_icon_170649.png"
hidden: true
---

> 원하는 UI 구성을 위해 유틸리티 CSS 라이브러리인 TailwindCSS 와 Flowbite 를 공부합니다. 웹프레임워크로 SveltKit 을 사용하고 bun 런타임 위에서 실행합니다.
{: .prompt-tip }

- [Svelte Component 만들기 - 1일차](/posts/2023-08-31-svelte-components-tutorial-day1/) : Tutorial &#9839;1
- [Svelte Component 만들기 - 2일차](/posts/2023-10-03-svelte-components-tutorial-day2/) : Tutorial &#9839;2 &nbsp; &#10004;

## 0. 개요

- [x] Bun 1.0.3 + SvelteKit + mdsvex
- [x] TailwindCSS 3.3.3 (flowbite-svelte)
- [x] supabase (로컬 개발 환경)
- [x] Drizzle 0.28.6 (postgresql)

> 화면 캡쳐

<img alt="svltk-drizzle-app-users" src="https://github.com/maxmin93/svltk-drizzle-app/blob/main/static/svltk-drizzle-app-users.png?raw=true" width="540px" />
_users 리스트 출력_

> 참고문서

- [Tailwind CSS Introduction, Basics & Guided Tutorial](https://www.youtube.com/watch?v=pYaamz6AyvU)


## 1. 프로젝트 생성

### [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```console
$ bun create svelte@latest bun-tailwind-app
  - Skeleton project
  - TypeScript

$ cd bun-tailwind-app
$ bun install

$ bun run dev
```

### [TailwindCSS 설정](https://tailwindcss.com/docs/guides/sveltekit)

1. Install TailwindCSS
2. `tailwind.config.js` 에 template paths 추가
3. `postcss.config.js` 에 nesting plugin 추가
4. `app.css` 에 Tailwind directives 추가
5. 최상위 `+layout.svelte` 에 `app.css` import
6. `+page.svelte` 에서 TailwindCSS classes 를 사용해 작동 확인

```bash
bun add -d tailwindcss autoprefixer
bunx tailwindcss init -p

# (Mac 에서는) 첫번째 "" 인자가 필요하다
sed -i "" "s/content: \[\]/content: \['\.\/src\/\*\*\/\*\.\{html,js,svelte,ts\}'\]/" tailwind.config.js

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
@tailwind base;
@tailwind components;
@tailwind utilities;
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

#### 선택 : [daisyUI 설정](https://daisyui.com/docs/config/)

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

### [supabase 로컬 개발 환경 설정](https://supabase.com/docs/guides/cli/local-development)

supabase local studio [http://localhost:54323](http://localhost:54323/project/default)

```bash
supabase status

cat <<EOF > .env.local
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
SUPABASE_ANON_KEY="..."
SUPABASE_URL="http://localhost:54321"
EOF
```

#### [SvelteKit 에서 Supabase 사용하기](https://supabase.com/docs/guides/getting-started/quickstarts/sveltekit)

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

### [Drizzle ORM + Supabase](https://orm.drizzle.team/docs/quick-postgresql/supabase) 설정

#### Drizzle Kit 설치 및 설정

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

export const users = pgTable('countries', {
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

#### SvelteKit 에서 Drizzle ORM 사용하기

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
import { users } from '../../drizzle/schema';

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


## 2. TailwindCSS 사용법

### 사이즈

- 기본 배율 : 값 4 = `1rem` = `16px`, 값 2 = `0.5rem` = `8px`
- 반응형 디자인을 위한 5개의 중단점 :right_arrow: 사이즈별로 스타일 정의
  + sm 최소 너비 640px
  + md 최소 너비 768px
    * `<div class="md:max-lg:flex">` md 부터 max-lg 까지 flex 적용
  + lg 최소 너비 1024px
  + xl 최소 너비 1280px (2xl 1536px) : 256px 씩 증가
- `dark:` dark 모드의 스타일 지정
  + 수동으로 dark 모드 지정시 `<html class="dark">`
- 반복 스타일은 class 사용
- [Functions & Directives](https://tailwindcss.com/docs/functions-and-directives#layer)
  + `@apply` 사용자 css 를 인라인으로 적용시키는 지시자

```html
<button class="btn-primary">
  Save changes
</button>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 {
    @apply text-2xl;
  }
  h2 {
    @apply text-xl;
  }
}

@layer components {
  .btn-primary {
    @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
  }
}

@layer utilities {
  .filter-none {
    filter: none;
  }
  .filter-grayscale {
    filter: grayscale(100%);
  }
}
</style>
```

## 2. TailwindCSS - [Core Concepts](https://tailwindcss.com/docs/utility-first)

### 기본 사항

#### body

- min-h-screen : 최소 높이 (100vh 전체)
- bg-slate-50 : 바탕색 회색 50 
- dark 다크 모드
  + dark:bg-black : 다크 모드에서 바탕색 검정
  + dark:text-white : 다크 모드에서 글자색 흰색

#### header

- bg-teal-700 : 바탕색
- text-white : 글자색
- sticky : 화면에 고정, 자식에 대한 위치 참조 역활 (relative)
- top-0 : 상대 좌표에서 상단 위치
- z-10 : 요소의 스택 순서 (높은 수가 더 상위)

#### section

- max-w-4xl : 최대 너비 (4xl 만큼)
- mx-auto : 컨테이너를 중앙에 위치로 배치
- p-4 
- flex
- justify-between
- items-center
- text-slate-#num;

#### margin : 바깥 영역

- `my-#` : 세로 방향 바깥 영역
- `m-#` : 모든 방향 바깥 영역

### Utility-First Fundamentals

### Hover, Focus, and Other States

### Responsive Design

### Dark Mode

### Reusing Styles

### Adding Custom Styles

### Functions &amp; Directives


## 3. [Flowbite Svelte](https://flowbite-svelte.com/docs/pages/introduction)


## 9. Summary

- 작성중


> 다음에 살펴볼 문서들

- [Tailwind CSS tutorial - A very hands-on approach to styling web applications](https://tsh.io/blog/tailwind-css-tutorial/)
- [Helpful Page Layouts using Tailwind CSS](https://dev.to/codeply/helpful-page-layouts-using-tailwind-css-1a3k)
- [Build a Twitter Clone with SvelteKit, Auth.js, and Prisma](https://thethinks.vercel.app/tutorial/sveltekit-twitter-clone)
- [리액트 daisyui-admin-dashboard-template](https://github.com/srobbin01/daisyui-admin-dashboard-template) : 달력이 참고 할만함
  - [달력 데모](https://tailwind-dashboard-template-dashwind.vercel.app/app/calendar)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
