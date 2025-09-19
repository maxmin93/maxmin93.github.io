---
date: 2024-01-07 00:00:00 +0900
title: Tailwind 클론 프로젝트 - 1일차
description: Tailwind 무료 템플릿을 구해서 svelte 및 melt-ui 등으로 UI 기능을 구성하는 연습을 합니다. 첫번째로 TailAdmin 이라는 템플릿으로 클론 프로젝트를 진행합니다.
categories: [Frontend, CSS]
tags: [melt-ui, tailwind, 1st-day]
image: "https://cdn.taildashboards.com/media/screenshots/tailadmin.png"
---

> 목록
{: .prompt-tip }

- [Tailwind 클론 프로젝트 - 1일차](/posts/tailwind-clone-project-day1/) : TailAdmin &nbsp; &#10004;


## 0. 개요

무료 템플릿 출처 : [tailadmin](https://taildashboards.com/get/tailadmin)

![admin-dashboard-mobile](/2024/01/07-admin-dashboard-desktop.png){: width="560" .w-75}
_admin-dashboard-mobile_

## 1. 프로젝트 생성

### [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
bun create svelte@latest tailwind-admin-app
  # - Skeleton project
  # - Typescript
  # - Prettier

cd tailwind-admin-app
bun install

bun run dev
```

### [TailwindCSS 설정](https://tailwindcss.com/docs/guides/sveltekit)

1. tailwind, postcss 설치 (typography, forms)
2. melt-ui 및 개발 유틸리티, plugins, icons 설치
3. `.prettierrc` 설정 : tailwind 플러그인
4. `vite.config.ts` 설정 : purgeCss (highlight.js 클래스 제거 방지)
5. `svelte.config.js` 설정 : melt-ui 전처리기
6. `tailwind.config.js` 설정 : Noto 폰트, plugins
7. `app.html` : D2Coding 폰트, lang 설정
8. `app.pcss` : tailwind 테마 설정
9. `+layout.svelte` : 전역 css 연결
10. `+page.svelte` : 데모 코드를 넣어 tailwind 작동 확인

```bash
# tailwind 설치
bun add -d tailwindcss postcss autoprefixer
bun add -d @tailwindcss/typography @tailwindcss/forms

bunx tailwindcss init -p

# tailwind 필수 라이브러리, 아이콘 설치
bun add -d vite-plugin-tailwind-purgecss prettier-plugin-tailwindcss
bun add tailwind-variants clsx tailwind-merge lucide-svelte

# melt-ui 설치
bun add -d @melt-ui/svelte @melt-ui/pp @internationalized/date

# utilities 설치
bun add @faker-js/faker  # 가짜 데이터
bun add cmdk-sv  # 목록 검색창
bun add mode-watcher  # light/dark 모드 변경
bun add svelte-legos  # 유용한 UI 기능들 (svelte 확장판)
bun add svelte-sonner  # 세련된 toast
bun add svelte-headless-table  # table, columns builder
bun add svelte-persisted-store  # local-storage 관리
bun add sveltekit-superforms zod  # action, load 에 스키마 적용
bun add svelte-wrap-balancer  # 긴 제목을 wrap 처리


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

# melt-ui 설정
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
  darkMode: ['class'],
  safelist: ['dark'],  // purge 제외 대상
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },    
    fontFamily: {
      sans: ['"Noto Sans KR"', ...fontFamily.sans],
      serif: ['"Noto Serif KR"', ...fontFamily.serif],
      mono: ['D2Coding', ...fontFamily.mono],
    },  
    extend: {
      colors: {
        border: 'oklch(var(--border) / <alpha-value>)',
        input: 'oklch(var(--input) / <alpha-value>)',
        ring: 'oklch(var(--ring) / <alpha-value>)',
        background: 'oklch(var(--background) / <alpha-value>)',
        foreground: 'oklch(var(--foreground) / <alpha-value>)',

        info: 'oklch(var(--info) / <alpha-value>)',
        success: 'oklch(var(--success) / <alpha-value>)',
        warning: 'oklch(var(--warning) / <alpha-value>)',
        error: 'oklch(var(--error) / <alpha-value>)',

        primary: {
          DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
          foreground: 'oklch(var(--primary-foreground) / <alpha-value>)'
        },
        secondary: {
          DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
          foreground: 'oklch(var(--secondary-foreground) / <alpha-value>)'
        },
        destructive: {
          DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
          foreground: 'oklch(var(--destructive-foreground) / <alpha-value>)'
        },
        muted: {
          DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
          foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
        },
        accent: {
          DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
          foreground: 'oklch(var(--accent-foreground) / <alpha-value>)'
        },
        popover: {
          DEFAULT: 'oklch(var(--popover) / <alpha-value>)',
          foreground: 'oklch(var(--popover-foreground) / <alpha-value>)'
        },
        card: {
          DEFAULT: 'oklch(var(--card) / <alpha-value>)',
          foreground: 'oklch(var(--card-foreground) / <alpha-value>)'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), 
    require('@tailwindcss/forms'),
  ],
};
EOF


# 기본 언어 설정
cat <<EOF > src/app.html
<!doctype html>
<html lang="ko">
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

@layer base {
  :root {
    --background: 100% 0 0;
    --foreground: 27.81% 0.03 256.85;

    --info: 45.2% 0.31 264;
    --success: 51.98% 0.177 142;
    --warning: 96.8% 0.21 109;
    --error: 62.8% 0.257 29;

    --muted: 95.9% 4.8% 240;
    --muted-foreground: 240 3.8% 46.1%;

    --popover: 100% 0 0;
    --popover-foreground: 3.9% 10% 240;

    --card: 100% 0 0;
    --card-foreground: 3.9% 10% 240;

    --border: 90% 5.9% 240;
    --input: 90% 5.9% 240;

    --primary: 49.12% 0.3096 275.75;
    --primary-foreground: 100% 0 0;

    --secondary: 69.71% 0.329 342.55;
    --secondary-foreground: 98.71% 0.0106 342.55;

    --accent: 95.9% 4.8% 240;
    --accent-foreground: 10% 5.9% 240;

    --destructive: 50.59% 72.22% 0;
    --destructive-foreground: 98% 0% 0;

    --ring: 64.9% 5% 240;

    --radius: 0.5rem;
  }

  .dark {
    --background: 0% 0 0;
    --foreground: 87.61% 0 0;

    --muted: 15.9% 3.7% 240;
    --muted-foreground: 64.9% 5% 240;

    --popover: 3.9% 10% 240;
    --popover-foreground: 98% 0% 0;

    --card: 3.9% 10% 240;
    --card-foreground: 98% 0% 0;

    --border: 15.9% 3.7% 240;
    --input: 15.9% 3.7% 240;

    --primary: 33.68% 0 0;
    --primary-foreground: 87.61% 0 0;

    --secondary: 33.68% 0 0;
    --secondary-foreground: 87.61% 0 0;

    --accent: 33.68% 0 0;
    --accent-foreground: 87.61% 0 0;

    --destructive: 30.6% 62.8% 0;
    --destructive-foreground: 87.61% 0 0;

    --ring: 15.9% 3.7% 240;
  }
}
@layer base {
  * {
    @apply border-border;
  }
  html {
    -webkit-text-size-adjust: 100%;
    font-variation-settings: normal;
  }
  body {
    @apply bg-background text-foreground;
    font-feature-settings: 'liga';
  }

  /* Mobile tap highlight */
  html {
    -webkit-tap-highlight-color: rgba(128, 128, 128, 0.5);
  }

  /* === Scrollbars === */
  ::-webkit-scrollbar {
    @apply w-2;
    @apply h-2;
  }
  ::-webkit-scrollbar-track {
    @apply !bg-muted;
  }
  ::-webkit-scrollbar-thumb {
    @apply rounded-sm !bg-muted-foreground/30;
  }

  /* Firefox */
  html {
    scrollbar-color: hsl(215.4 16.3% 46.9% / 0.3);
  }
  html.dark {
    scrollbar-color: hsl(215.4 16.3% 56.9% / 0.3);
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .antialised {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@media (max-width: 640px) {
  .container {
    @apply px-4;
  }
}
EOF


cat <<EOF > src/routes/+layout.svelte
<script>
  import '../app.pcss';
  import { ModeWatcher } from 'mode-watcher';
</script>

<ModeWatcher />
<slot />
EOF


cat <<EOF > src/routes/+error.svelte 
<script lang="ts">
  import { page } from '\$app/stores';
</script>

<article class="prose p-8 lg:prose-xl">
  <h1 class="text-error">Error</h1>
  <p>
    Even though you're on the <b>{\$page.url.pathname}</b> route this is not the
    <code>+page.svelte</code> component but the <code>+error.svelte</code> component.
  </p>
</article>
EOF


# tailwind container 데모
cat <<EOF > src/routes/+page.svelte
<script>
  import { BookOpen } from 'lucide-svelte';
  import { faker } from '@faker-js/faker/locale/ko';
</script>

<header class="container mt-10 h-full items-center p-4 lg:mt-4 lg:flex">
  <div class="w-full">
    <h1 class="text-4xl font-bold lg:text-6xl">
      Hello,
      <span class="text-green-700">SvelteKit &plus; TailwindCSS</span>
    </h1>
    <div class="my-4 h-2 w-44 bg-green-700"></div>
    <p class="mb-10 text-xl">{faker.lorem.paragraph(5)}</p>
    <button
      class="hover:brightness-150 inline-flex items-center rounded bg-primary px-4 py-2 text-2xl font-medium text-primary-foreground shadow"
    >
      <BookOpen size="2rem" />
      <span class="ml-2">Learn more</span>
    </button>
  </div>
</header>
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


cat <<EOF > src/routes/+page.server.ts
import { db } from '\$lib/server/index.js';
import { users } from '\$lib/server/schema';
import type { PageServerData } from './\$types.js';

const pageSize = 10;

export const load: PageServerData = async ({ params }) => {
  console.log('params:', params);  
  const pageUsers = await db.select().from(users).orderBy(users.id).limit(pageSize);
  // for DEBUG
  for (let index = 0; index < pageUsers.length; index++) {
    const element = pageUsers[index];
    console.log(\`[\${index}] \${element.id} \${element.email}\`);
  }
  return {
    pageSize,
    pageUsers
  };
};
EOF


# bun:sqlite 위해 bun 런타임 실행
bun --bun run dev
```


## 2. Tailwind 템플릿을 Svelte 프로젝트로 바꾸기

![admin-dashboard-mobile](/2024/01/07-admin-dashboard-mobile.png){: width="320" .w-75}
_admin-dashboard-mobile_

### 작업 절차

1. sveltekit + tailwind 프로젝트 생성
2. layout 과 page 분리
3. layout : header 와 footer 분리
4. lib : icon 등을 분리하여 assets 에 저장
5. layout 으로부터 컴포넌트들을 분리 - depth 1부터 최대 3까지
6. parent 와 child 컴포넌트 간의 state 또는 handler 처리 (store & context)
7. transition 등을 svelte 기능으로 대체
8. bg 및 text 색상 변수를 tailwind 설정 변수로 대체 (ex: primary, info 등)
9. 최신 유틸리티 라이브러리로 대체 가능한 기능을 선별하고 대체

### 디렉토리 구조

- `.env` : 외부 변수
- `.prettierrc` : 플러그인
- `svelte.config.js` : 전처리기
- `tailwind.config.js` : 플러그인, 테마 설정
- [src]
  - `app.html`
  - `app.pcss` : tailwind 변수값, 사용자 클래스
  - [lib]
    - [assets] : 정적인 컴포넌트
      - [icons] : svg 또는 이미지
    - [components]
      - [admin] : 특정 페이지에 종속적인 컴포넌트
        - header
          - left-section
          - right-section
          - dropdown-menu
          - mobile-nav
        - footer
          - copyright
      - [ui] : 다른 곳에서도 사용할 수 있는 컴포넌트
        - mode-toggle
        - card
    - [stores] : 여러 컴포넌트에 걸쳐서 상태를 처리하는 모듈
    - [config] : 메타 데이터, 설정 데이터
    - [types] : 사용자 타입 정의
  - [routes]
    - `+layout.svelte`
      - header
      - main
      - footer
    - `+page.svelte`
      - contents

#### 예시 : header

- 가독성과 유지보수 편의성을 위해 블럭 단위로 컴포넌트를 분할
- 일단 해당 디렉토리에서 하위 컴포넌트 파일들을 나누고, 나중에 `$lib` 로 이동

```svelte
<script>
  import { ModeToggle } from '$lib/components/ui';
  import { dropdownOpen, mobileNavOpen } from './open-handlers';
  import { setContext } from 'svelte';
  setContext('dropdownOpen', dropdownOpen);
  setContext('mobileNavOpen', mobileNavOpen);

  import HeaderLeftSection from './header-left-section.svelte';
  import HeaderMobileNavButton from './header-mobile-nav-button.svelte';
  import HeaderMobileNavMenu from './header-mobile-nav-menu.svelte';
  import HeaderUserDropdown from './header-user-dropdown.svelte';
  import HeaderRightToolbar from './header-right-toolbar.svelte';
</script>

<header id="page-header" class="z-1 flex flex-none items-center">
  <div class="container mx-auto px-4 lg:px-8 xl:max-w-7xl">
    <div class="flex justify-between border-b-2 border-slate-200/50 py-6">
      <HeaderLeftSection />

      <!-- Right Section -->
      <div class="flex items-center gap-1 lg:gap-5">
        <HeaderRightToolbar />
        <HeaderUserDropdown />
        <ModeToggle />
        <HeaderMobileNavButton />
      </div>
      <!-- END Right Section -->
    </div>

    {#if $mobileNavOpen}
      <HeaderMobileNavMenu />
    {/if}
  </div>
</header>
```

### 색상 테마 변경

daisyUI 의 light, dark 테마 색상으로 변경

1. daisyUI 의 light, dark 색상 변수 찾기
2. tailwind 설정의 색상 변수와 daisyUI 색상 변수 매핑
    1. rgb, hsl 변수를 모두 oklch 로 변경
3. app.pcss 의 색상 변수에 daisyUI 색상값 적용
    1. rgb, hsl 색상값을 모두 oklch 색상값으로 변경 
4. 컴포넌트 svelte 파일에서 `bg-{색상}`, `text-{색상}` 들을 모두 교체
    1. bg-background, text-foreground

> 참고 : [OKLCH Color Picker & Converter](https://oklch.com/)

#### 참고 : [daisyUI 테마](https://github.com/saadeghi/daisyui/blob/master/src/theming/themes.js)

```css
:root,
[data-theme] {
  background-color: theme(colors.base-100); /* background */
  color: theme(colors.base-content);        /* foreground */
}
```

> CSS 속성 : [var 함수](https://developer.mozilla.org/ko/docs/Web/CSS/Using_CSS_custom_properties)

- `var(--my-var, red)` : --my-var 가 정의되지 않았을 경우 red로 표시됨

```js
// themes.js
{
  black: {
    "color-scheme": "dark",
    "primary": "#373737",
    "secondary": "#373737",
    "accent": "#373737",
    "base-100": "#000000",
    "base-200": "#141414",
    "base-300": "#262626",
    "base-content": "#d6d6d6",
    "info": "#0000ff",
    "success": "#008000",
    "warning": "#ffff00",
    "error": "#ff0000",
  },
  light: {
    "color-scheme": "light",
    "primary": "oklch(49.12% 0.3096 275.75)",
    "secondary": "oklch(69.71% 0.329 342.55)",
    "secondary-content": "oklch(98.71% 0.0106 342.55)",
    "accent": "oklch(76.76% 0.184 183.61)",
    "base-100": "oklch(100% 0 0)",
    "base-200": "#F2F2F2",
    "base-300": "#E5E6E6",
    "base-content": "#1f2937",
  },  
}  
```


## 3. 코딩

### Icon 컴포넌트 (SVG)

- `aria-hidden` : (스크린 리더에서) 불필요한 요소를 숨기는 역활
- twMerge 를 이용해 사용자 class 와 병합하여 적용
- `<FlagIcon />` 사용시 정적 맵핑
  - 동적 맵핑 필요시엔 `<svelte:component this={컴포넌트} />` 활용

```svelte
<!-- flag-icon.svelte -->
<script>
  import { twMerge } from 'tailwind-merge';
  const defaultClass =
    'hi-mini hi-flag inline-block h-5 w-5 text-slate-300 group-hover:text-indigo-500';
</script>

<svg
  class={twMerge(defaultClass, $$props.class)}
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 20 20"
  fill="currentColor"
  aria-hidden="true"
>
  <path d="M3.5 2.75a.75.75 ..." />
</svg>
```

### handler 모듈 (drilling)

- 오픈 상태를 여러 컴포넌트에서 제어해야 하는 경우
  - 모바일 화면에서 nav 메뉴 오픈 상태를 여기저기서 제어
  - dropdown 메뉴의 오픈 상태에 따라 하위 컴포넌트에서 출력
- 제어 동작을 사전에 정의 : open, close, toggle
  - 참고 : [Using stores with context](https://kit.svelte.dev/docs/state-management#using-stores-with-context)

```ts
import { writable } from 'svelte/store';

function createOpenHandler(isOpen: boolean) {
  const { subscribe, set, update } = writable(isOpen);

  function open() {
    set(true); // update(() => true)
  }
  function close() {
    set(false); //update(() => false);
  }
  function toggle() {
    update((isOpen) => !isOpen);
  }

  return { subscribe, open, close, toggle };
}

export const dropdownOpen = createOpenHandler(false);
export const mobileNavOpen = createOpenHandler(false);
```

```svelte
<!-- parent 컴포넌트 -->
<script>
  import { dropdownOpen, mobileNavOpen } from './open-handlers';
  import { setContext } from 'svelte';
  setContext('dropdownOpen', dropdownOpen);
  setContext('mobileNavOpen', mobileNavOpen);
</script>

<header>
  {#if $mobileNavOpen}
    <HeaderMobileNavMenu />
  {/if}  
</header>
```

```svelte
<!-- mobile-nav-button 컴포넌트 -->
<script>
  import HamburgerIcon from '$lib/assets/icons/hamburger-icon.svelte';
  import { getContext } from 'svelte';
  const mobileNavOpen = getContext('mobileNavOpen');
</script>

<div class="lg:hidden">
  <button type="button" on:click={mobileNavOpen.toggle}>
    <HamburgerIcon />
  </button>
</div>
```

```svelte
<!-- mobile-nav-menu 컴포넌트 -->
<script>
  import { getContext } from 'svelte';
  const mobileNavOpen = getContext('mobileNavOpen');
</script>

<nav on:click={mobileNavOpen.close}>
  <ul>
    <li>메뉴 아이템</li>
    <li>...</li>
  </ul>
</nav>
```

### 조건부 class 적용

value 값에 따라 적용되는 색상을 `tailwind-variants` 으로 설정하여 적용한다.

> `{#if}..{/if}` 에 의한 html 중복 없이 간단하게 처리할 수 있다.

```svelte
<!-- table-cell-status.svelte -->
<script lang="ts">
  import { tv } from 'tailwind-variants';
  const status = tv({
    base: 'inline-block rounded-full border px-2 py-1 text-xs font-semibold leading-4',
    variants: {
      color: {
        completed: 'border-success text-success',
        proceeding: 'border-info text-info',
        pending: 'border-warning bg-warning/50 text-error'
      }
    }
  });
  export let value: string;
</script>

<div class={status({ color: value.toLowerCase() })}>
  {value}
</div>
```

### `svelte-headless-table` 사용해 보기

shadcn-svelte 의 [Data Table](https://www.shadcn-svelte.com/docs/components/data-table) 에서는 해볼만하게 나왔는데, [svelte-headless-table](https://svelte-headless-table.bryanmylee.com/docs/getting-started/quick-start) 만으로 적용해 보려니깐 무척 지저분하게 보인다. 일단 컬럼 순서와, 정렬, 컬럼 숨기기 plugin 기능을 추가하여 적용해 보았다.

> 컬럼 단위 정렬은 [Svelte Legos](https://sveltelegos.com/guides/actions/sortableTableAction) 에도 있다.

```svelte
<script lang="ts">
  import TableStatusCell from './table-cell-status.svelte';
  import { Subscribe, Render, createTable, createRender } from 'svelte-headless-table';
  import { addColumnOrder, addSortBy, addHiddenColumns } from 'svelte-headless-table/plugins';
  // $: table = createTable(data.pageUsers);
  const records = readable(data.data.pageUsers);
  const table = createTable(records, {
    hide: addHiddenColumns(),
    sort: addSortBy(),
    colOrder: addColumnOrder({
      initialColumnIdOrder: ['username', 'email', 'status', 'revenue'],
      hideUnspecifiedColumns: true
    })
  });
  const columns = table.createColumns([
    table.column({
      header: 'UserName',
      accessor: 'username' as never,
      plugins: {}
    }),
    table.column({
      header: 'Email',
      accessor: 'email' as never,
      plugins: {}
    }),
    table.column({
      header: 'Status',
      accessor: 'status' as never,
      // @ts-ignore
      cell: ({ value }) => createRender(TableStatusCell, { value }),
      plugins: {}
    }),
    table.column({
      header: 'Revenue',
      accessor: 'revenue' as never,
      cell: ({ value }) => `\$${value}`,
      plugins: {}
    })
  ]);
  const { headerRows, rows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
  // const { columnIdOrder } = pluginStates.colOrder;
  // const { hiddenColumnIds } = pluginStates.hide;
  // $hiddenColumnIds = ['status'];
</script>

<table {...$tableAttrs} class="min-w-full align-middle text-sm">
  <thead>
    {#each $headerRows as headerRow (headerRow.id)}
      <Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
        <!-- HeaderRow props -->
        <tr {...rowAttrs} class="border-b-2 border-slate-100">
        {#each headerRow.cells as cell (cell.id)}
          <Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
            <!-- HeaderCell props -->
            <th
              {...attrs}
              on:click={props.sort.toggle}
              class:sorted={props.sort.order !== undefined}
              class="px-3 py-2 text-start text-sm font-semibold uppercase tracking-wider"
            >
              <Render of={cell.render()} />
              {#if props.sort.order === 'asc'}
                ⬇️
              {:else if props.sort.order === 'desc'}
                ⬆️
              {/if}
            </th>
          </Subscribe>
        {/each}
        </tr>
      </Subscribe>
    {/each}
  </thead>
  <tbody {...$tableBodyAttrs}>
    {#each $rows as row (row.id)}
      <Subscribe rowAttrs={row.attrs()} let:rowAttrs>
        <tr {...rowAttrs} class="hover:bg-slate-200/50">
          {#each row.cells as cell (cell.id)}
            <Subscribe attrs={cell.attrs()} let:attrs>
              <td {...attrs} class="hidden p-3 md:table-cell">
                <Render of={cell.render()} />
              </td>
            </Subscribe>
          {/each}
        </tr>
      </Subscribe>
    {/each}
  </tbody>
</table>
```

![admin-dashboard-headless-table](/2024/01/07-admin-dashboard-headless-table.png){: width="560" .w-75}
_admin-dashboard-headless-table_

## 9. Review

- tailwind 의 색상 변수를 사용하니 편하다. 뭔가 좀 만져볼 수 있다는 자신감이 생겼다.
- faker 는 nanoid 를 포함하고, random 값 생성 기능이 쓸모가 많다.
- 조건부 스타일 적용시 tailwind-variants 가 유용하다. 
- 테마 색상이 이쁜 tailwind 프레임워크들을 뜯어서 사용해보는 것도 좋겠다.

### tailwind 참고사항

- [font-feature-settings](https://story.pxd.co.kr/1717) : 오픈타입 글꼴의 고급 설정 [(values)](https://css-tricks.com/almanac/properties/f/font-feature-settings/#aa-values)
  - [Noto OpenType](https://fonts.google.com/knowledge/using_type/implementing_open_type_features_on_the_web#the-basics) : liga (standard ligatures)
  - 예시 `font-feature-settings: 'rlig' 1, 'calt' 1;`

### tailwind 색상 테마 솔루션

> 참고 : [tailwind-dynamic-color-theme-solution](https://medium.com/@elvann.abendroth/tailwind-dynamic-color-theme-solution-4351d0495c7f)

- Solution 1. Using a Theme File
  - `tailwind.config.js` 에서 변수와 연결되는 색상 함수를 정의
  - `theme.js` 에서 색상 함수를 제공 (json 파일 등에서 읽어올 수도 있음)

- Solution 2. Using CSS Variables
  - `tailwind.config.js` 에서 변수를 정의하고
  - `global.css` 에서 변수값(색상)을 설정

### [CSS 색상 함수 `oklch` 로 전환하는 이유](https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl)

공식을 정의하고 몇가지 색상을 선택하면 전체 디자인 시스템 팔레트가 자동으로 생성됩니다.

> `oklch`(L C H) or `oklch`(L C H / a)

- L 밝기 : lightness (0 ~ 100%) 검은색이냐 흰색이냐
- C 채도 : chroma (0.0 ~ 1.0) 원색이냐 탁한색이냐
- H 색조 : hue angle (0 ~ 360) 빨주노초파남보
- a 투명도 : opacity (0.0 ~ 1.0, 0 ~ 100%)

```css
.bw {
  color:   oklch(0% 0 0);       /* black */
  color:   oklch(100% 0 0);     /* white */
  color:   oklch(100% 0.2 100); /* also white, any hue with 100% L is white */
  color:   oklch(50% 0 0);      /* gray */
}
.colors {
  color:   oklch(80% 0.12 100); /* yellow */
  color:   oklch(60% 0.12 100); /* much darker yellow */
  color:   oklch(80% 0.05 100); /* quite grayish yellow */
  color:   oklch(80% 0.12 225); /* blue, with the same perceived lightness */
}
.opacity {
  color:   oklch(80% 0.12 100 / 50%); /* transparent yellow */
}
```

![oklch-axes](https://evilmartians.com/static/1ba334bc155f6d4652884281b72aa948/a0c8c/oklch-axes.webp){: width="560" .w-75}
_oklch-axes_

> oklch 와 hsl 비교

- [hsl](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl)( H S L / A) : H (색조), S (채도), L (밝기), A (투명도)
  - oklch 는 (sRGB 모니터보다) 더 넓은 범위의 P3 색상에 사용할 수 있습니다.
- hsl() 와 달리 oklch 는 색상 수정 및 팔레트 생성에 더 좋습니다.
  - HSL 처럼 작동하지만 HSL 보다 밝기를 더 잘 인코딩합니다.
  - 색상에 따라 L 값이 다르기 때문에 hsl 형식은 a11y 에 적합하지 않습니다.
  - RGB, hex 및 색상(display-p3)은 색상 수정에 편리하지 않습니다. 왜냐하면 대부분의 인간에게는 빨간색, 파란색 및 녹색의 양을 변경하여 직관적으로 색상을 설정하는 것이 어렵기 때문입니다.

> oklch 와 lch 차이

- lch 의 색상 변화 버그를 해결하기 위해 OKLCH 공간을 만들었습니다.
  - LCH 에는 한 가지 고통스러운 버그가 있습니다. 채도의 예상치 못한 색조 변화와 파란색의 밝기 변경( 270및 색조 값 사이 330)입니다.
- 그 외에도 색역 보정 등이 향상 되었습니다.

![p3 vs sRGB](https://evilmartians.com/static/34e8eeed150629f41555c92b01f36644/p3.png){: width="560" .w-75}
_p3 vs sRGB_

> CSS 색상 변환 (rgb 를 oklch 로 바꾸기)

```css
:root {
  --origin: #ff000;
  --error: oklch(60% 0.16 30);  
}
.foo {
  color: oklch(from var(--origin) l c h);
}
.message.is-error {
  /* The same color but with different opacity */
  background: oklch(from var(--error) l c h / 60%);
  /* 10% darker */
  border-color: oklch(from var(--error) calc(l - 10%) c h)
}
.message.is-success {
  /* Another hue (green) with the same lightness and saturation */
  background: oklch(from var(--error) l c 140);
}
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
