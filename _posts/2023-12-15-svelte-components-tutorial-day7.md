---
date: 2023-11-30 00:00:00 +0900
title: Svelte Component 만들기 - 7일차
categories: ["frontend","svelte"]
tags: ["melt-ui","tailwind","7th-day"]
image: "https://www.melt-ui.com/banner.png"
hidden: true
---

> 원하는 UI 구성을 위해 headless 컴포넌트 라이브러리인 Melt-UI 를 공부합니다. 웹프레임워크로 SveltKit 을 사용하고 bun 런타임 위에서 실행합니다.
{: .prompt-tip }

- [Svelte Component 만들기 - 1일차](/posts/2023-08-31-svelte-components-tutorial-day1/) : Steeze UI
- [Svelte Component 만들기 - 2일차](/posts/2023-10-08-svelte-components-tutorial-day2/) : Flowbite Svelte
- [Svelte Component 만들기 - 3일차](/posts/2023-11-01-svelte-components-tutorial-day3/) : Flowbite Blocks
- [Svelte Component 만들기 - 4일차](/posts/2023-11-08-svelte-components-tutorial-day4/) : daisyUI Svelte
- [Svelte Component 만들기 - 5일차](/posts/2023-11-09-svelte-components-tutorial-day5/) : Skeleton
- [Svelte Component 만들기 - 6일차](/posts/2023-11-30-svelte-components-tutorial-day6/) : Open Props
- [Svelte Component 만들기 - 7일차](/posts/2023-12-15-svelte-components-tutorial-day7/) : Melt-UI &nbsp; &#10004;

svelte-components 시리즈를 6개나 쓰면서 만족스럽지 못했는데, 드디어 찾은거 같다. melt-ui 는 headless, accessible 컴포넌트 빌더라고 설명되어 있다. 사용법을 보면 style 에 관해서는 css 를 쓰거나 tailwind 를 골라서 사용할 수 있다. melt-ui 는 단지 builder 를 불러와 원하는 component 의 기능을 구현시키는 역활을 하고 있다. Tab 컴포넌트를 만드는데 skeleton 이나 flowbite 처럼 style 과 내용을 모두 사전에 정의된 스펙에 맞추어 사용할 필요가 없다. 게다가 컴포넌트 종류도 많다. 앞으로 melt-ui 을 익숙하게 다루도록 연습할 계획이다.

## 0. 개요

- [x] Bun 1.0.15 + Vite 5.0.3 + SvelteKit 2.0.0
  - typescript 5.0.0
  - prettier 3.1.1
  - [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte) 3.1.2
- [x] TailwindCSS 3.3.6 + postcss 8.4.32
  - forms + typography
  - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss) 0.5.9
  - [vite-plugin-tailwind-purgecss](https://www.npmjs.com/package/vite-plugin-tailwind-purgecss) 0.1.4
  - [tailwindcss-debug-screens](https://www.npmjs.com/package/tailwindcss-debug-screens) 2.2.1
  - [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) 2.1.0
- [x] Etc
  - fonts : D2Coding, Noto Sans/Serif KR, Noto Color Emoji
  - [faker-js](https://www.npmjs.com/package/@faker-js/faker) 8.3.1
  - [lucide-svelte](https://www.npmjs.com/package/lucide-svelte) 0.295.0 (아이콘 1346개, ISC 라이센스)

> heroicons 는 292개에 불과. lucide 아이콘이 훨씬 많다. (상용 가능 라이센스)

## 1. 프로젝트 생성

Svelte 버전이 4.x 이라서 SvelteKit 2.0 이라도 큰 변화는 없다.

### 1) [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
bun create svelte@latest svltk2-meltui-app
  # - Skeleton project
  # - Typescript
  # - Prettier

cd svltk2-meltui-app
bun install

bun run dev
```

### 2) [TailwindCSS 및 plugins 설정](https://www.skeleton.dev/docs/get-started) 

1. TailwindCSS, typography, forms, tailwind-merge 설치
2. 한글 폰트, TW 유틸리티, prettier plugins 설치
3. lucide 설치 (아이콘), faker-js 설치 (개발용 더미 텍스트)
4. `.prettierrc` 설정
5. `vite.config.ts` 설정 (highlight.js 클래스 제거 방지)
6. `tailwind.config.js` 설정 : 폰트, plugins
7. 폰트 설정 : Noto 한글 + Emoji, D2Coding
5. `app.postcss` 에 Tailwind directives 추가
6. 최상위 `+layout.svelte` 에 전역 css 추가 
7. `+page.svelte` 에 데모 코드를 넣어 daisyUI 작동 확인

```bash
# tailwind 설치
bun add -d tailwindcss postcss autoprefixer tailwind-merge
bun add -d @tailwindcss/typography @tailwindcss/forms

# tailwind plugins 설치
bun add -d vite-plugin-tailwind-purgecss
bun add -d prettier-plugin-tailwindcss
bun add -d tailwindcss-debug-screens

# utilities 설치 : icons, faker
bun add lucide-svelte
bun add -d @faker-js/faker

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
  ],
  ssr: {
    noExternal: ['svelte-hero-icons'],
  },
});
EOF

# default fonts, typography, forms 설정
cat <<EOF > tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
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
    require('@tailwindcss/typography'), 
    require('@tailwindcss/forms'),
    require('tailwindcss-debug-screens'),
  ],
};
EOF

# D2Coding 폰트 추가 (Mac 에서는 첫번째 "" 인자가 필요하다)
sed -i '' 's/favicon.png" \/>/favicon.png" \/>\n    <link href="http:\/\/cdn.jsdelivr.net\/gh\/joungkyun\/font-d2coding\/d2coding.css" rel="stylesheet" type="text\/css">/' src/app.html

# preload 설정 지우고, debug-screens 설정
sed -i '' 's/data-sveltekit-preload-data="hover"/class="debug-screens"/' src/app.html

# Noto 한글, Emoji 폰트 추가
cat <<EOF > src/app.pcss
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');

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

# tailwind container 데모
cat <<EOF > src/routes/+page.svelte
<script>
  import { Icon, BookOpen } from 'svelte-hero-icons';
  import { faker } from '@faker-js/faker/locale/ko';
</script>

<header class="container px-4 lg:flex mt-10 items-center h-full lg:mt-0">
  <div class="w-full">
    <h1 class="text-4xl lg:text-6xl font-bold">
      Hello,
      <span class="text-green-700">SvelteKit &plus; TailwindCSS</span>
    </h1>
    <div class="w-40 h-2 bg-green-700 my-4"></div>
    <p class="text-xl mb-10">{faker.lorem.paragraph(5)}</p>
    <button class="bg-green-500 hover:bg-green-700 text-white text-2xl font-medium px-4 py-2 rounded shadow inline-flex items-center">
      <Icon src={BookOpen} size="2rem" />
      <span class="ml-2">Learn more</span>
    </button>
  </div>
</header>
EOF

bun run dev
```

### [melt-ui 설치](https://melt-ui.com/docs/installation)

```bash
# 자동 설치
# bunx @melt-ui/cli@latest init

###############################

# 수동 설치
bun add -d @melt-ui/svelte
bun add -d @melt-ui/pp svelte-sequential-preprocessor

# melt-ui 전처리기 설정
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
  }
};
export default config;
EOF
```

## 2. melt-ui 사용법

## 3. clone project

- source : [깃허브 - nazifbara/invoice-app](https://github.com/nazifbara/invoice-app)
- live : [fm-nazif-invoice-app](https://fm-nazif-invoice-app.netlify.app/)

## 9. Review

- 작성중

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
