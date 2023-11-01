---
date: 2023-10-08 00:00:00 +0900
title: Svelte Component 만들기 - 3일차
categories: ["frontend","svelte"]
tags: ["flowbite","ui-components","3rd-day"]
image: "https://raw.githubusercontent.com/themesberg/flowbite-svelte/main/static/images/flowbite-svelte.png"
hidden: true
---

> 원하는 UI 구성을 위해 유틸리티 CSS 라이브러리인 TailwindCSS 와 Flowbite 를 공부합니다. 웹프레임워크로 SveltKit 을 사용하고 bun 런타임 위에서 실행합니다.
{: .prompt-tip }

- [Svelte Component 만들기 - 1일차](/posts/2023-08-31-svelte-components-tutorial-day1/) : Steeze UI
- [Svelte Component 만들기 - 2일차](/posts/2023-10-08-svelte-components-tutorial-day2/) : Flowbite Svelte
- [Svelte Component 만들기 - 3일차](/posts/2023-11-01-svelte-components-tutorial-day3/) : Flowbite 예제들 &nbsp; &#10004;

## 0. 개요

- [x] Bun 1.0.7 + SvelteKit 1.20.4
- [x] TailwindCSS 3.3.5
  - flowbite 2.0.0 (flowbite-svelte 0.44.18)
  - flowbite-svelte-blocks 0.5.1


## 1. 프로젝트 생성

### 1) [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
bun create svelte@latest bun-tailwind-app
  # - Skeleton project
  # - Javascript with JSDoc

cd bun-tailwind-app
bun install

bun run dev
```

### 2) [TailwindCSS 설정](https://tailwindcss.com/docs/guides/sveltekit)

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

@layer base {
  html {
    -webkit-text-size-adjust: 100%;
    font-family: -apple-system, Arial, Noto Sans, Noto Color Emoji;
    line-height: 1.5;
    -moz-tab-size: 4;
    tab-size: 4;
  }
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

### 3) [Flowbite Svelte 설정](https://flowbite-svelte.com/docs/pages/quickstart)

- icons, svelte, flowbite 라이브러리 임포트
- 옵션 : 고급 컴포넌트 blocks 임포트

```bash
bun add -d flowbite-svelte-icons flowbite-svelte flowbite
bun add -d flowbite-svelte-blocks
```

- `tailwind.config.js` 설정

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
    './node_modules/flowbite-svelte-blocks/**/*.{html,js,svelte,ts}',
  ],
  plugins: [require('flowbite/plugin')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // flowbite-svelte
        primary: {
          50: '#FFF5F2',
          100: '#FFF1EE',
          200: '#FFE4DE',
          300: '#FFD5CC',
          400: '#FFBCAD',
          500: '#FE795D',
          600: '#EF562F',
          700: '#EB4F27',
          800: '#CC4522',
          900: '#A5371B',
        },
      },
    },
  },
};
```

- `src/routes/+page.svetle` 확인

```bash
cat <<EOF > src/routes/+page.svelte
<script>
  import { Alert, Button, Blockquote } from 'flowbite-svelte';
  import { InfoCircleSolid } from 'flowbite-svelte-icons';
  /** @type {boolean} */
  let error = false;

  /** @type {import('flowbite-svelte').BlockQuoteType} */
  export let size = 'lg';
</script>

<div class="p-8">
  <Alert border>
    <InfoCircleSolid slot="icon" class="w-4 h-4" />
    <span class="font-medium">Info alert!</span>
    <span class="text-{error ? 'red' : 'green'}-600"
      >Change a few things up and try submitting again.</span
    >
  </Alert>
  <div class="p-4">
    <Button class="!bg-blue-500">Blue Button</Button>
    <Button class="!bg-green-500">Green Button</Button>
  </div>
  <Blockquote {size}
    >"Flowbite is just awesome. It contains tons of predesigned components and
    pages starting from login screen to complex dashboard. Perfect choice for
    your next SaaS application."</Blockquote
  >
</div>
EOF
```

- 동적으로 속성 변환을 할 수 있고, TS 타입을 이용할 수도 있다.
- [참고](https://flowbite-svelte.com/docs/pages/customization#Importance_of_!_for_Some_Components) : `!` 문자를 사용해 유틸리티 클래스의 속성을 변경할 수 있다.

> 화면 캡쳐

<img alt="svltk-flowbite-page" src="/2023/10/08-svltk-flowbite-page.png" width="540px" />
_초기 설정이 완료된 페이지_

#### Flowbite [dark 모드 스위치](https://flowbite-svelte.com/docs/components/darkmode#Mode_icon) 설정

```html
<!-- routes/+layout.svelte -->
<script>
  import { DarkMode } from 'flowbite-svelte';
  import { SunSolid, MoonSolid } from 'flowbite-svelte-icons';
</script>

<DarkMode class="text-lg">
  <svelte:fragment slot="lightIcon">
    <SunSolid />
  </svelte:fragment>
  <svelte:fragment slot="darkIcon">
    <MoonSolid />
  </svelte:fragment>
</DarkMode>
```

## 2. [Flowbite Blocks in Svelte](https://flowbite-svelte-blocks.vercel.app/)

### 1) [Application UI 그룹](https://flowbite-svelte-blocks.vercel.app/application)

- Table
  - Advanced Tables
  - Table Footers
  - Table Headers
- Drawers : 사이드에서 밀려 나오며 나타나는 입력 폼
  - CRUD Create Drawers
  - CRUD Read Drawers : 읽기 전용
  - CRUD Update Drawers : 수정 전용
  - Faceted Search Drawers : 입력 도구 모음
- Forms
  - CRUD Create Forms : 일반 입력 폼
  - CRUD Update Forms : 수정 전용
- Modals
  - CRUD Create Modals : 모달 입력 폼
  - CRUD Read Modals : 읽기 전용
  - CRUD Update Modals : 수정 전용
- Message : 모달 확인창
  - CRUD Delete Confirm : 삭제 확인창
  - CRUD Success Message : 성공 알림창
- Dashboard
  - Dashboard Navbars : 헤더
  - Dashboard Footers : 푸터
- Sections
  - CRUD Read Sections : 읽기 전용 섹션 폼
  - Side Navigations : 사이드 메뉴 폼

### 2) [Marketing UI](https://flowbite-svelte-blocks.vercel.app/marketing)

### 3) [Publisher UI](https://flowbite-svelte-blocks.vercel.app/publisher)

## 9. Summary

- 작성중

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
