---
date: 2023-11-09 00:00:00 +0900
title: Svelte Component 만들기 - 5일차
categories: ["frontend","svelte"]
tags: ["skeleton","tailwindcss","ui-components","5th-day"]
image: "https://i.ytimg.com/vi/tHzVyChDuyo/maxresdefault.jpg"
hidden: true
---

> 원하는 UI 구성을 위해 유틸리티 CSS 라이브러리인 TailwindCSS 와 Skeleton 를 공부합니다. 웹프레임워크로 SveltKit 을 사용하고 bun 런타임 위에서 실행합니다.
{: .prompt-tip }

- [Svelte Component 만들기 - 1일차](/posts/2023-08-31-svelte-components-tutorial-day1/) : Steeze UI
- [Svelte Component 만들기 - 2일차](/posts/2023-10-08-svelte-components-tutorial-day2/) : Flowbite Svelte
- [Svelte Component 만들기 - 3일차](/posts/2023-11-01-svelte-components-tutorial-day3/) : Flowbite Blocks
- [Svelte Component 만들기 - 4일차](/posts/2023-11-08-svelte-components-tutorial-day4/) : daisyUI Svelte
- [Svelte Component 만들기 - 5일차](/posts/2023-11-09-svelte-components-tutorial-day5/) : Skeleton &nbsp; &#10004;

## 0. 개요

- [x] Bun 1.0.10 + SvelteKit 1.20.4
- [x] TailwindCSS 3.3.5
  - skeleton 2.5.0 (tw-plugin 0.2.4)
  - vite-plugin-tailwind-purgecss 0.1.3
- [x] Etc


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

### 2) [TailwindCSS 및 flowbite-svelte 설정](https://tailwindcss.com/docs/guides/sveltekit) 

1. skeleton, tw-plugin 설치
2. tailwindcss, postcss 설치
3. `postcss.config.cjs ` 추가
4. `tailwind.config.js` 에 skeleton 설정
5. `app.postcss` 에 directives 와 noto 폰트 추가
6. `+layout.svelte` 에 전역 css 추가
7. `+page.svelte` 에 데모 코드를 넣어 작동 확인

```bash
bun add -d @skeletonlabs/skeleton @skeletonlabs/tw-plugin
bun add -d tailwindcss postcss autoprefixer
bunx tailwindcss init

# postcss 는 CommonJS 확장자를 필요로 한다
cat <<EOF > postcss.config.cjs 
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
EOF

# skeleton, fonts, 기본 theme 설정
cat <<EOF > tailwind.config.js
import { skeleton } from '@skeletonlabs/tw-plugin';

const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans KR"', ...defaultTheme.fontFamily.sans],
        serif: ['"Noto Serif KR"', ...defaultTheme.fontFamily.serif],
        mono: ['D2Coding', ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [
    skeleton({
      themes: {
        preset: [
          {
            name: 'skeleton',
            enhancements: true,
          },
        ],
      },
    }),
  ]
}
EOF

# skeleton theme 기본 적용 (Mac 에서는 첫번째 "" 인자가 필요하다)
sed -i '' 's/hover">/hover" data-theme="skeleton">/' src/app.html

# 전역 css 에 directives 와 noto 폰트 설정
cat <<EOF > src/app.postcss
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;
@tailwind variants;

html, body {
  @apply h-full overflow-hidden;
}
EOF

# D2Coding 폰트 추가 
sed -i '' 's/favicon.png" \/>/favicon.png" \/>\n    <link href="http:\/\/cdn.jsdelivr.net\/gh\/joungkyun\/font-d2coding\/d2coding.css" rel="stylesheet" type="text\/css">/' src/app.html

cat <<EOF > src/routes/+layout.svelte
<script lang="ts">
  import '../app.postcss';
</script>

<slot />
EOF

cat <<EOF > src/routes/+page.svelte
<div class="container mx-auto p-8 space-y-8">
  <h1 class="h1">안녕, Skeleton!</h1>
  <p class="font-mono">베이스 : Bun + SvelteKit + TailwindCSS</p>
</div>
EOF

bun run dev
```

#### [heroicons](https://heroicons.com/) 와 [purgecss](https://www.skeleton.dev/docs/purgecss) 설치

- svelte 용 heroicons 설치 (MIT 라이센스)
- tailwindcss 최적화를 위한 vite 전용 purgecss 플러그인 설치

```bash
bun add -d svelte-hero-icons
bun add -d vite-plugin-tailwind-purgecss

cat <<EOF > vite.config.ts
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit(), purgeCss()],
  ssr: {
    noExternal: ['svelte-hero-icons'],
  },
});
EOF
```



## 9. Review

- 작성중


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
