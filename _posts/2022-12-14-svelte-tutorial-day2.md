---
date: 2022-12-14 00:00:00 +0900
title: Svelte 공부하기 - 2일차
description: 프론트엔드 프레임워크인 SvelteKit 에 대해 공부한다. css framework 들을 적용하고 레이아웃을 만들어보자. (2일차)
categories: [Frontend, Svelte]
tags: []
image: https://svelte.dev/_app/immutable/assets/svelte-machine-mobile.B0w2rScM.png
---

> 목록
{: .prompt-tip }

- [Svelte 공부하기 - 1일차](/posts/svelte-tutorial-day1/) : Svelte
- [Svelte 공부하기 - 2일차](/posts/svelte-tutorial-day2/) : SvelteKit + CSS &nbsp; &#10004;
- [Svelte 공부하기 - 3일차](/posts/svelte-tutorial-day3/) : SvelteKit 구조, 작동방식 
- [Svelte 공부하기 - 4일차](/posts/svelte-tutorial-day4/) : SvelteKit 애플리케이션 예제 
- [Svelte 공부하기 - 5일차](/posts/svelte-tutorial-day5/) : Supabase 인증, DB 연동

## 1. SvelteKit 이란?

**Svelte 를 뷰 레이어로 사용하는 SSR 프레임워크**

### 1) 요약

- [Sveltekit 1.0 출시 - 2022년12월](https://svelte.dev/blog/announcing-sveltekit-1.0)
  + 이전에 [Sapper](https://sapper.svelte.dev/docs/) 이란 이름으로 개발되던 백엔드 프레임워크 프로젝트를 이어 받았음

- Vercel 사의 Vite 와 통합하여 NextJS 와 유사
  + Svelte 는 VueJS 와 유사

> 백엔드와 프론트엔드의 경계가 모호하기 때문에 헷갈릴 수 있다.

### 2) SvelteKit 에 적용할 CSS Frameworks

참고 [UI Library made with Svelte](https://madewithsvelte.com/ui-library)

- [Svelte Headless UI](https://svelte-headlessui.goss.io/docs) : 더이상 업데이트가 안됨 => TailwindUI(유료)
- Svelte Material UI : 스타일이 구리다
- Carbon Components Svelte : CSS 설정이 어렵다?
- [daisyUI](https://daisyui.com/) : 이쁘고 떡상 가능성이 있다. 순수 CSS (컴포넌트 아님)
- [Skeleton](https://www.skeleton.dev/) : 이쁘다. 그런데 테마 색대비가 조금 이상하다.
- Attractions : 베스트. SCSS 사용한다는게 단점 (버려야함)
- [AgnosticUI](https://www.agnosticui.com/) : 최애 라이브러리 중에 하나 (모든 프레임워크 지원)

## 2. SvelteKit with Pico.CSS

Pico 기본 테마로 root 레이아웃을 만들어보자.

참고 [Why Pico Is My Favorite CSS Framework For Svelte](https://www.youtube.com/watch?v=-n84EMKIXQM)

![svelte-pico-layout-root](https://github.com/maxmin93/svelte-pico-tutorial/raw/main/static/svelte-pico-layout-crunch.png){: width="600"}
_picocss 적용된 첫페이지_

### 1) $src/routes/+layout.svelte

특별히 레이아웃을 생성하지 않으면 비어있는 layout 인 `<slot />`만 적용된다.

- `<slot />`에는 `+page.svelte`의 내용이 들어간다.

```html
<script>
  import '@picocss/pico';
</script>

<div id="page">
  <nav class="center">
    <!-- svelte-ignore a11y-missing-attribute -->
    <a>My Site</a>
  </nav>

  <main class="center">
    <slot />
  </main>

  <footer class="center">© 토니네-제주온라인 2022</footer>
</div>

<style>
  :global(html) {
    overflow-y: scroll;
  }

  #page {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    gap: 5vw;
  }

  .center {
    padding-left: max(1rem, calc(50vw - 350px));
    padding-right: max(1rem, calc(50vw - 350px));
  }

  nav,
  footer {
    text-transform: uppercase;
    font-size: 0.7rem;
    letter-spacing: 0.1px;
  }

  nav {
    background: rgba(0, 0, 0, 0.4);
    font-weight: 500;
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  footer {
    text-align: center;
    padding: 3rem 0;
    color: #777;
    margin-top: auto;
  }
</style>
```

> vite:import-analysis 의 imports deprecated 경고 메시지 없애기

- `import '@picocss/pico';` 방식으로 변경

```text
import pico from "@picocss/pico";
5  |  import { base } from "$app/paths";
6  |
Default and named imports from CSS files are deprecated.
Use the ?inline query instead.
For example: import pico from "@picocss/pico?inline"
  Plugin: vite:import-analysis
```

### 2) $src/routes/about/+layout.svelte

레이아웃은 계층적으로 적용된다.

- src
  - routes
    - +layout.svelte : 메인 레이아웃
    - +page.svelte : 메인 페이지
    - about
      - +layout.svelte : about 레이아웃
      - +page.svelte : about 페이지

```html
<h2>This is Layout of About</h2>

<slot />
```

About 페이지가 추가된 화면

![svelte-pico-layout-about](https://github.com/maxmin93/svelte-pico-tutorial/raw/main/static/svelte-pico-layout-about-crunch.png){: width="600"}
_about 페이지 추가_

## 3. SvelteKit with Skeleton

### 1) 프로젝트 생성 및 설정

#### 권장: create skeleton-app

```shell
pnpm create skeleton-app sklt-app
cd sklt-app
pnpm vite dev -- --open
```

#### 또는 create svelte 이후 setup skeleton

> 작업 사항이 적지 않다.

1. 생성 : sveltekit project
2. 설치 : Skeleton & Tailwind CSS
3. 설정 : tailwind,
4. 수정 : app.postcss, app.html

> 설치

```shell
# create-svelte
pnpm create svelte svltk-jwt-auth
# => Typescript 선택

# install Skeleton CSS
pnpm install -D @skeletonlabs/skeleton
# setup preprocess, PostCSS, TailwindCSS
pnpx svelte-add@latest tailwindcss
# install dependencies
pnpm install

# 추가 모듈 : forms, typography, line-clamp
pnpm install -D @tailwindcss/forms @tailwindcss/typography
pnpm install -D @tailwindcss/line-clamp
```

> 설정

4-1. tailwind.config.cjs 설정

- darkMode : html 태그 속성 지정
- content : skeleton 포함
- plugin : tailwind, skeleton theme

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    require("path").join(
      require.resolve("@skeletonlabs/skeleton"),
      "../**/*.{html,js,svelte,ts}"
    ),
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@skeletonlabs/skeleton/tailwind/theme.cjs"),
  ],
};
```
{: file="tailwind.config.cjs"}

4-2. `src/app.postcss` 수정 (tailwind 임포트 제거)

```scss
/*
// tainwind 임포트 라인들을 제거해야 한다!
@tailwind base;
@tailwind components;
@tailwind utilities;
*/

html,
body {
  @apply h-full overflow-hidden;
}
```
{: file="src/app.postcss"}

4-3. `src/app.html` 설정

- html 태그 : 모드 class="dark"
- body 태그 : 테마 data-theme="skeleton"

```html
<!DOCTYPE html>
<html lang="en" class="dark">
  <!-- ... -->
  <body data-theme="skeleton">
    <div style="display: contents" class="h-full overflow-hidden">
      %sveltekit.body%
    </div>
  </body>
</html>
```
{: file="src/app.html"}

4-4. `src/routes/+layout.svelte` 수정

- AppShell : 애플리케이션 레이아웃
- AppBar : AppShell 의 상단 메뉴바
  - lead : 레이아웃의 왼쪽
  - trail : 레이아웃의 오른쪽

```html
<script>
import "@skeletonlabs/skeleton/themes/theme-skeleton.css";
import "@skeletonlabs/skeleton/styles/all.css";
import "../app.postcss";
import { AppShell, AppBar } from "@skeletonlabs/skeleton";
</script>

<!-- App Shell -->
<AppShell slotSidebarLeft="bg-surface-500/5 w-56 p-4">
  <svelte:fragment slot="header">
    <!-- App Bar -->
    <AppBar>
      <svelte:fragment slot="lead">
        <strong class="text-xl uppercase">Skeleton</strong>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <a class="btn btn-sm btn-ghost-surface" href="https://discord.gg/EXqV7W8MtY" target="_blank" rel="noreferrer">Discord</a>
        <a class="btn btn-sm btn-ghost-surface" href="https://twitter.com/SkeletonUI" target="_blank" rel="noreferrer">Twitter</a>
        <a class="btn btn-sm btn-ghost-surface" href="https://github.com/skeletonlabs/skeleton" target="_blank" rel="noreferrer">GitHub</a>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <!-- Page Route Content -->
  <slot />

</AppShell>
```

#### [svelte-add](https://github.com/svelte-add/svelte-add) 도구

```console
# tailwindcss
$ pnpx --yes svelte-add@latest tailwindcss

# postcss
$ pnpx --yes svelte-add@latest postcss

# prettier 
$ pnpx --yes svelte-add@latest prettier

# eslint
$ pnpx --yes svelte-add@latest eslint
```

- [svelte-supabase](https://github.com/supabase-community/svelte-supabase)

```console
pnpx apply supabase-community/svelte-supabase
```

### 2) dev 실행

```shell
# dev 실행 (브라우저 오픈)
pnpx vite dev -- --open
```

![14-svelte-skeleton-layout](/2022/12/14-svelte-skeleton-layout.png){: width="600"}
_skeleton 레이아웃 (테마 적용)_

#### Issue: [New Vite requirements gives warning when building "for the first time"](https://github.com/sveltejs/kit/issues/5390#issuecomment-1176480653)

첫 실행시 다음과 같은 warning 메시지 발생 => 무시 (두번째부터는 안남옴)

```shell
$ pnpm vite dev -- --open
▲ [WARNING] Cannot find base config file "./.svelte-kit/tsconfig.json" [tsconfig.json]

    tsconfig.json:2:12:
      2 │   "extends": "./.svelte-kit/tsconfig.json",
        ╵              ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

## 9. Review

- 처음에는 어렵겠지만 Skeleton 을 써보자. 무엇보다 이쁘다.
- `a11y` 란? [웹접근성(accessibility)](https://studio-jt.co.kr/a11y-level-up-%EC%9B%B9%EC%A0%91%EA%B7%BC%EC%84%B1-%EB%A0%88%EB%B2%A8%EC%97%85/) 을 가리키는 축약어
  + 테마의 색대비 문제도 a11y 항목에 해당한다 (불편함도 접근성 문제)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
