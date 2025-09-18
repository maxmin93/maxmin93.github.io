---
date: 2024-06-29 00:00:00 +0900
title: Svelte 5 Mdsvex 튜토리얼 - 1일차
description: 기존의 jekyll 기반의 블로그를 대체하기 위해 Svelte 5 기반의 markdown blog 개발을 시작합니다. 기존 자료를 참고하며 나름대로 만들어 보겠습니다.
categories: [Frontend, Svelte]
tags: [mdsvex, 1st-day]
image: "https://i.ytimg.com/vi/UFSmNnWPvrM/sddefault.jpg"
---

## 0. 개요

### Features

- 구성 : Svelte 5 + tailwindCSS + daisyUI + meltUI
- 기본 첫페이지
  - remixicon 아이콘
  - Toggle 버튼 클릭시 daisyUI 의 theme 변경
    - html 태그의 data-theme 속성값 변경
  - Toggle 버튼 호버링 할 때 meltUI 의 tooltip 연결
    - dark 모드 select 사용해서 툴팁 텍스트 색상 설정

### 화면캡쳐

> 홈페이지

![](/2024/06/29-svelte5-daisyui-meltui-light.png){: width="560" .w-75}
_svelte5-daisyui-meltui defalt-home_

### 라이브러리

- [x] Bun 1.1.7 + Svelte 5 preview
  - Typescript
  - prettier, [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte)
- [x] TailwindCSS 3.4.1 + typography
  - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss)
  - [vite-plugin-tailwind-purgecss](https://www.npmjs.com/package/vite-plugin-tailwind-purgecss) 0.1.3
  - [daisyui](https://daisyui.com/) 4.11.1
  - [melt-ui](https://melt-ui.com/) 0.81.0
- [x] Etc
  - fonts : 한글 Noto Sans KR, D2Coding
  - [svelte-remixicon](https://remixicon.com/) 2.4.0

### 참고자료

- [Joy Of Code - Creating Your Own Markdown Preprocessor Is Easier Than You Might Think](https://www.youtube.com/watch?v=UFSmNnWPvrM)
  - [깃허브 - sveltedown](https://github.com/joysofcode/sveltedown)
  - [깃허브 - jasonstitt blog](https://github.com/jasonstitt/blog)
- [daisyUI - Dark mode 선택자](https://daisyui.com/docs/themes/#-9)
- [meltUI - Svelte 5 compatibility](https://github.com/melt-ui/melt-ui/discussions/957#discussioncomment-9550603)


## 1. Svelte 5 프로젝트

> SvelteKit + Svelte 5 preview

```bash
bun create svelte@latest svlt5-markdown-app
  # - Skeleton project
  # - Typescript
  # - Prettier, Svelte5 preview

cd svlt5-markdown-app
bun install

# bun runtime
bun --bun run dev --host 0.0.0.0

# (선택사항) 최신 버전으로 업데이트
# 주의 : bun update --latest 실행하면 svelte 4.x 최신버전이 된다.
bun add -d svelte@next
# bun add -d @sveltejs/adapter-auto tslib typescript
# bun add -d prettier prettier-plugin-svelte
```

> tailwindCSS + daisyUI + meltUI

```bash
# tailwind, plugins 설치
bun add -d tailwindcss postcss autoprefixer @tailwindcss/typography
bun add -d vite-plugin-tailwind-purgecss prettier-plugin-tailwindcss 

bunx tailwindcss init -p

# daisyui 설치
bun add -d daisyui@latest
# meltui 설치 (Svelte 5 호환)
bun add -d @melt-ui/pp @melt-ui/svelte

echo "bun.lockb" >> .prettierignore

# prettier 에 tailwind 플러그인, markdown 설정 추가
cat <<EOF > .prettierrc
{
  "useTabs": true,
  "tabWidth": 2,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-svelte", "prettier-plugin-tailwindcss"],
  "overrides": [
    { "files": "*.svelte", "options": { "parser": "svelte" } },
    { "files": "*.md", "options": { "tabWidth": 2, "useTabs": false, "printWidth": 79 } }
  ]
}
EOF

# CSS 최적화를 위한 purgecss 주석은 배포단계에서 해제할것 (건너뛰어도 됨)
cat <<EOF > vite.config.ts
// import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    // purgeCss({ safelist: {greedy: [/^hljs-/] }}),
  ],
  server: {
    fs: {      
      allow: ['..'],  // serve files one level up
    },
  },
});
EOF

# melt-ui 전처리기 연결
cat <<EOF > svelte.config.js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { preprocessMeltUI, sequence } from '@melt-ui/pp';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sequence([vitePreprocess(), preprocessMeltUI()]),
  extensions: ['.svelte', '.md'],
  kit: { adapter: adapter() },
};

export default config;
EOF

# font & color 추가, daisyUI 설정
cat <<EOF > tailwind.config.js
const baseColors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const plugin = require('tailwindcss/plugin');
const daisyuiTheme = require('daisyui/src/theming/themes');
const { parseColor } = require('tailwindcss/lib/util/color');

/* Converts HEX color to RGB */
const toRGB = (value) => parseColor(value).color.join(' ');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,md,svelte,ts}'],
  theme: {
    container: {
      center: true, // mx-auto
      padding: {
        DEFAULT: '1rem', // px-4
        sm: '2rem',
        lg: '4rem',
        xl: '6rem',
        '2xl': '8rem',
      },
    },    
    fontFamily: {
      sans: ['"Noto Sans KR"', ...defaultTheme.fontFamily.sans],
      serif: ['"Noto Serif KR"', ...defaultTheme.fontFamily.serif],
      mono: ['D2Coding', ...defaultTheme.fontFamily.mono],
    },
    extend: {
      colors: {
        section: 'rgb(var(--section) / <alpha-value>)',
        magnum: {
          50: '#fff9ed',
          100: '#fef2d6',
          200: '#fce0ac',
          300: '#f9c978',
          400: '#f7b155',
          500: '#f38d1c',
          600: '#e47312',
          700: '#bd5711',
          800: '#964516',
          900: '#793a15',
          950: '#411c09',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
    plugin(function ({ addVariant, matchUtilities, theme }) {
      // pseudo-class custom variants
      addVariant('not-last', '&:not(:last-child)');
      addVariant('hocus', ['&:hover', '&:focus']);
      // Square utility
      matchUtilities(
        {
          square: (value) => ({
            width: value,
            height: value,
          }),
        },
        { values: theme('spacing') }
      );
    }),
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          ...daisyuiTheme['light'],
          neutral: baseColors.neutral[50], // white
          'neutral-content': baseColors.neutral[950],
          '--section': toRGB(daisyuiTheme['business']['success']),
        },
        dark: {
          ...daisyuiTheme['dark'],
          neutral: baseColors.neutral[950], // black
          'neutral-content': baseColors.neutral[50],
          '--section': toRGB(daisyuiTheme['business']['accent']),
        },
      },
    ],
  },
};
EOF

# lang, daisyUI theme 설정
cat <<EOF > src/app.html
<!doctype html>
<html lang="ko" data-theme="dark">
  <head>
    <meta charset="utf-8" />
    <link rel="icon" href="%sveltekit.assets%/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
    <script>
      try {
        document.documentElement.setAttribute('data-theme', localStorage.getItem('theme'));
      } catch (e) {}
    </script>
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>
EOF

cat <<EOF > src/app.pcss
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');
@import url("//cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-ligature-full.css");

@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
  font-family: font-sans;
  /* font-size: clamp(1rem, 2.2vh, 1.5rem); */
}
EOF
```

> utils, error

```bash
# plugins, icons, faker 설치
bun add -d @faker-js/faker svelte-remixicon nanoid
bun add clsx tailwind-merge

mkdir src/lib/utils

# A simple indicator to show current breakpoint
cat <<EOF > src/lib/utils/tw-indicator.svelte
<script>
  import { dev } from '\$app/environment';
</script>

{#if dev}
  <div
    class="fixed bottom-1 left-1 z-50 flex h-6 w-6 items-center justify-center rounded-full bg-gray-800 p-3 font-mono text-xs text-white"
  >
    <div class="block sm:hidden">xs</div>
    <div class="hidden sm:block md:hidden lg:hidden xl:hidden 2xl:hidden">sm</div>
    <div class="hidden md:block lg:hidden xl:hidden 2xl:hidden">md</div>
    <div class="hidden lg:block xl:hidden 2xl:hidden">lg</div>
    <div class="hidden xl:block 2xl:hidden">xl</div>
    <div class="hidden 2xl:block">2xl</div>
  </div>
{/if}
EOF

# TW Utilities
cat <<EOF > src/lib/utils/tw-util.js
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** @param {...(import('clsx').ClassValue)} inputs  */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** @type {boolean} isBrowser */
export const isBrowser = typeof document !== 'undefined';

/**
 * 상태변수 isDark 에 대해 \$effect 에서 실행해야 한다.
 * @param { boolean } isDark
 * @param { string[] } themes (default: light/dark)
 */
export function toggleTheme(isDark, themes = ['light', 'dark']) {
  if (isBrowser) {
    const rootEl = document.querySelector('html');
    if (rootEl) {
      rootEl.dataset.theme = isDark ? themes.at(-1) : themes.at(0);
      localStorage.setItem('theme', rootEl.dataset.theme);
    }
  }
}

/**
 * onMount 에서 상태변수 isDark 를 초기화 하는데 사용한다.
 * @param { string[] } themes (default: light/dark)
 * @returns { boolean }
 * */
export function isDarkTheme(themes = ['light', 'dark']) {
  if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
    return localStorage.getItem('theme') === themes.at(-1);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  } else {
    return false;
  }
}
EOF

mkdir src/lib/components

cat <<EOF > src/lib/components/theme-toggle.svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { toggleTheme, isDarkTheme } from '\$lib/utils/tw-util.js';

  let isDark = \$state(true); // html[data-theme="dark"]

  onMount(() => {
    isDark = isDarkTheme(); // init
  });

  \$effect(() => {
    toggleTheme(isDark); // reactive
  });

  function handleToggleClick(event: Event) {
    const el = event.currentTarget as HTMLElement;
    isDark = el.dataset.darktheme === String(true) ? false : true;
    el.dataset.darktheme = String(isDark); // toggled
  }
</script>

<button
  onclick={handleToggleClick}
  data-darktheme={String(isDark)}
  class="btn btn-circle btn-ghost swap swap-rotate {isDark ? 'swap-active' : ''}"
>
  <svg
    class="swap-off h-6 w-6 fill-current"
    width="24px"
    height="24px"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path
      d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
    />
  </svg>
  <svg
    class="swap-on h-6 w-6 fill-current"
    width="24px"
    height="24px"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path
      d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
    />
  </svg>
</button>
EOF

cat <<EOF > src/routes/+layout.svelte
<script lang="ts">
  import '../app.pcss';
  import TwIndicator from '\$lib/utils/tw-indicator.svelte';

  let { children } = \$props();
</script>

{@render children()}

<TwIndicator />
EOF

cat <<EOF > src/routes/+error.svelte 
<script>
  import { page } from '\$app/stores';
</script>

<div class="not-prose hero min-h-screen">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="mb-5 text-5xl font-bold opacity-10 lg:text-7xl xl:text-9xl">Error</h1>
      <p class="mb-5 font-mono">{\$page.error?.message}</p>
      <a class="btn" href="/">Go back</a>
    </div>
  </div>
</div>
EOF
```

> default Home

```bash
# 기존 첫페이지를 지우고 '(home)' 아래에 생성
rm "src/routes/+page.svelte" && mkdir "src/routes/(home)"

# daisyUI 확인용 demo 페이지 (theme 변경 스위치 포함)
cat <<EOF > "src/routes/(home)/+page.svelte"
<script>
  import ThemeToggle from '\$lib/components/theme-toggle.svelte';

  import { createTooltip, melt } from '@melt-ui/svelte';
  import { fade } from 'svelte/transition';

  const {
    elements: { trigger, content, arrow },
    states: { open },
  } = createTooltip({
    positioning: {
      placement: 'right',
    },
    openDelay: 0,
    closeDelay: 0,
    closeOnPointerDown: false,
    forceVisible: true,
  });
</script>

<div class="bg-background hero min-h-screen">
  <div class="hero-content">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">안녕, daisyUI</h1>
      <div class="my-4 rounded-lg bg-section px-8 shadow-md">
        <p class="py-6 font-mono text-neutral-content">구성 : TailwindCSS + SvelteKit + Bun</p>
      </div>
      <label use:melt={\$trigger} class="cursor-pointer">
        <ThemeToggle />
      </label>
      {#if \$open}
        <div
          use:melt={\$content}
          transition:fade={ {duration: 100} }
          class="z-10 rounded-lg bg-neutral shadow"
        >
          <div use:melt={\$arrow}></div>
          <p class="px-4 py-1 text-magnum-700 dark:text-magnum-500">Change light or dark theme</p>
        </div>
      {/if}
    </div>
  </div>
</div>
EOF
```


## 2. theme toggle 기능

![](/2024/06/29-svelte5-daisyui-meltui-dark.png){: width="560" .w-75}
_svelte5-daisyui-meltui dark-theme_

### Svelte 5 + daisyUI 구현

참고 : [daisyui - Swap icons with rotate effect](https://daisyui.com/components/swap/#swap-icons-with-rotate-effect)

#### 동작절차

1. currentTheme 상태($state) 변수 선언
2. onMount 에서 초기 Theme 값 설정 : localStorage, prefers-color-scheme
3. $effect 에서 Theme 값 적용 : html 의 data-theme 속성
4. currentTheme 와 localStorage 에 theme 를 toggle 시키는 함수 선언
5. Sun 과 Moon 을 감싸는 버튼에 click 이벤트로 toggle 함수 연결
6. 상태에 따라 아이콘을 변경하는 `swap-active` 클래스를 추가 또는 삭제

> 주의 : event.target 이 아닌 event.currentTarget 을 사용해야 함

#### 코드

`src/lib/components/theme-toggle.svelte` 참조

### Svelte 5 + meltUI 툴팁 구현

- Svelte 5 컴포넌트에는 use 지시자를 사용할 수 없어서 label tag 를 씌웠다.
- Tooltip $open 상태에 따라 Toolip 메시지 요소가 출력 된다.
- Toolip 메시지 요소 출력시 fade 전환효과를 부여한다. (svelte/transition)
  - 참고 : [meltUI - Tooltip](https://melt-ui.com/docs/builders/tooltip)

#### 코드

`src/routes/(home)/+page.svelte` 참조


## 9. Review

- 또다시 한달만에 올린다. 게으름병이 심각하다. 정신차리자!
- meltUI 를 함께 사용할 수 있게 되었다.
- 길어진다. 일단은 셋팅하는 부분에서 끊고 다음 포스트에서 이어서 쓰자.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
