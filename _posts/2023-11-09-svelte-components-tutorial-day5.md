---
date: 2023-11-09 00:00:00 +0900
title: Svelte Component 라이브러리 - 5일차
description: 원하는 UI 구성을 위해 유틸리티 CSS 라이브러리인 TailwindCSS 와 Skeleton 를 공부합니다. 웹프레임워크로 SveltKit 을 사용하고 bun 런타임 위에서 실행합니다.
categories: [Frontend, Svelte]
tags: ["skeleton","ui-components","tailwind","a11y"]
image: "https://i.ytimg.com/vi/tHzVyChDuyo/maxresdefault.jpg"
---

> 목록
{: .prompt-tip }

- [Svelte Component 라이브러리 - 1일차](/posts/svelte-components-tutorial-day1/) : Steeze UI
- [Svelte Component 라이브러리 - 2일차](/posts/svelte-components-tutorial-day2/) : Flowbite Svelte
- [Svelte Component 라이브러리 - 3일차](/posts/svelte-components-tutorial-day3/) : Flowbite Blocks
- [Svelte Component 라이브러리 - 4일차](/posts/svelte-components-tutorial-day4/) : daisyUI
- [Svelte Component 라이브러리 - 5일차](/posts/svelte-components-tutorial-day5/) : Skeleton &nbsp; &#10004;

## 0. 개요

- [x] Bun 1.0.10 + SvelteKit 1.20.4
- [x] TailwindCSS 3.3.5
  - skeleton 2.5.0 (tw-plugin 0.2.4)
  - vite-plugin-tailwind-purgecss 0.1.3
- [x] Etc
  - heroicons
  - fontawesome-free
  - purgecss



## 1. 프로젝트 생성

### 1) [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
bun create svelte@latest bun-skeleton-app
  # - Skeleton project
  # - Javascript with JSDoc

cd bun-skeleton-app
bun install

bun run dev
```

### 2) [TailwindCSS 및 skeleton 설정](https://www.skeleton.dev/docs/get-started) 

1. skeleton, tw-plugin 설치
2. tailwindcss, postcss 설치 (typography, forms 추가)
3. heroicons 설치 (MIT 라이센스), fontawesome-free 설치 (무료)
4. `postcss.config.cjs ` 추가 (cjs 확장자)
5. `tailwind.config.js` 에 skeleton 설정
6. `app.postcss` 에 directives 와 noto 폰트 추가
7. `+layout.svelte` 에 전역 css 추가
8. `+page.svelte` 에 데모 코드를 넣어 작동 확인

```bash
bun add -d @skeletonlabs/skeleton @skeletonlabs/tw-plugin
bun add -d tailwindcss postcss autoprefixer
bun add -d @tailwindcss/typography @tailwindcss/forms
bun add -d svelte-hero-icons
bun add @fortawesome/fontawesome-free

bunx tailwindcss init

# postcss 는 CommonJS 확장자를 필요로 한다!
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
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,svelte,ts}',
    './node_modules/@skeletonlabs/skeleton/**/*.{html,js,svelte,ts}',
  ],
  theme: {
    fontFamily: {
      sans: ['"Noto Sans KR"', ...defaultTheme.fontFamily.sans],
      serif: ['"Noto Serif KR"', ...defaultTheme.fontFamily.serif],
      mono: ['D2Coding', ...defaultTheme.fontFamily.mono],
    },      
  },
  plugins: [
    forms,
    typography,  
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

# hover 빼고 skeleton theme 기본 적용 (Mac 에서는 첫번째 인자 ''가 필요하다)
sed -i '' 's/data-sveltekit-preload-data="hover"/data-theme="skeleton"/' src/app.html

# 전역 css 에 directives 와 noto 폰트 설정
cat <<EOF > src/app.postcss
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');
@import url("//cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-ligature-full.css");

@tailwind base;
@tailwind components;
@tailwind utilities;
@tailwind variants;

html, body {
  @apply h-full overflow-hidden;
}
EOF

cat <<EOF > src/routes/+layout.svelte
<script lang="ts">
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import '../app.postcss';
</script>

<slot />
EOF

cat <<EOF > src/routes/+page.svelte
<script>
  import { Icon, Radio } from 'svelte-hero-icons';
</script>

<div class="container mx-auto p-8 space-y-8">
  <h1 class="h1">안녕, Skeleton!</h1>
  <button type="button" class="btn variant-filled">
    <span><Icon src={Radio} size="1rem" /></span>
    <span>Button</span>
  </button>
</div>
EOF

bun run dev
```

#### [fontawesome-free](https://heroicons.com/) 와 [purgecss](https://www.skeleton.dev/docs/purgecss) 설치

- fontawesome-free 아이콘 (무료)
- tailwindcss 최적화를 위한 vite 전용 purgecss 플러그인 설치

```bash
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

### [svelte 에서 a11y warning 비활성화 시키기](https://github.com/sveltejs/language-tools/issues/650#issuecomment-1729917996)

a11y 의 좋은 목적은 알겠지만, 신경 쓰이는 경우가 많아 disable 시키고 싶었다.

> vscode 의 settings.json 에서 설정

```json
"svelte.plugin.svelte.compilerWarnings": {
    "a11y-aria-attributes": "ignore",
    "a11y-incorrect-aria-attribute-type": "ignore",
    "a11y-unknown-aria-attribute": "ignore",
    "a11y-hidden": "ignore",
    "a11y-misplaced-role": "ignore",
    "a11y-unknown-role": "ignore",
    "a11y-no-abstract-role": "ignore",
    "a11y-no-redundant-roles": "ignore",
    "a11y-role-has-required-aria-props": "ignore",
    "a11y-accesskey": "ignore",
    "a11y-autofocus": "ignore",
    "a11y-misplaced-scope": "ignore",
    "a11y-positive-tabindex": "ignore",
    "a11y-invalid-attribute": "ignore",
    "a11y-missing-attribute": "ignore",
    "a11y-img-redundant-alt": "ignore",
    "a11y-label-has-associated-control": "ignore",
    "a11y-media-has-caption": "ignore",
    "a11y-distracting-elements": "ignore",
    "a11y-structure": "ignore",
    "a11y-mouse-events-have-key-events": "ignore",
    "a11y-missing-content": "ignore",
    "a11y-no-static-element-interactions":"ignore"
}
```

> `sveltekit.config.js` 에서 컴파일 옵션 설정

```js
const config = {
  preprocess: vitePreprocess(),
  onwarn: (warning, handler) => {
    if (warning.code.startsWith('a11y-')) {
      return;
    }
    handler(warning);
  },
  // ...
}
```


## 2. [Skeleton.dev/blog](https://www.skeleton.dev/blog) 클론 코딩

소스 코드 : [깃허브 - skeletonlabs/skeleton](https://github.com/skeletonlabs/skeleton/tree/dev/sites/skeleton.dev)

> [SvelteKit 프로젝트 구조](https://kit.svelte.dev/docs/project-structure)

- `src` : html, global css, hooks
  - `lib`
    - `components` : 컴포넌트 파일들
    - `server` : 서버에서만 실행되는 lib 파일들
  - `routes` : root 경로
    - `blog` : skeleton 의 블로그 리스트
      - `[slug]` : 블로그의 특정 포스트
    - `docs` : skeleton 의 설명서

### Template Component 방식

동일한 포맷의 페이지를 템플릿 컴포넌트로 만들어 놓고 속성값만 바꿔서 재사용한다.

> skeleton docs 설명에 쓰이는 페이지 템플릿

```svelte
<!-- DocsShell.svelte -->
<script>
  export let settings;   // @type { DocsShellSettings }
  const pageData = {     // @type { DocsShellSettings }
    // Define defaults first
    ...docShellDefaults,
    // Local Overrides
    ...{ docsPath: $page.url.pathname },
    // Prop Settings Values
    ...settings
  };  
</script>

<LayoutPage class="doc-shell {classesBase}" tocKey={tabPanel}>
  <!-- Header -->
  <Header {pageData} />
  <!-- Panels -->
  <div id="panels" class={classesPanels}>
  </div>
</LayoutPage>    
```

> 특정 docs 페이지

```svelte
<script>
  import DocsShell from '$lib/layouts/DocsShell/DocsShell.svelte';
  // DocsShellSettings
  const settings = {
    feature: DocsFeature.Component,
    name: 'Table of Contents',
    description: 'Allows you to quickly navigate the hierarchy of headings for the current page.',
    imports: ['TableOfContents', 'tocCrawler'],
    source: 'packages/skeleton/src/lib/utilities/TableOfContents',
    components: [{ sveld: sveldTableOfContents }]
  };  
</script>

<DocsShell {settings}>
  <svelte:fragment slot="sandbox">
  </svelte:fragment>
  <svelte:fragment slot="usage">
  </svelte:fragment>
</DocsShell>
```

### Blog 리스트

- `page[.server].ts` 로부터 Blog 리스트 데이터를 받아와서
- `section > a > article` 안에 이미지와 제목, 본문발췌를 출력
  - Blog 포스트는 a 태그로 감싸서 출력

```svelte
<script lang="ts">
  export let data: PageData;
</script>

<!-- Blog List -->
<div class="page-container-wide page-padding">
  <header class="flex justify-between items-center">
    <div class="space-y-4">
      <h2 class="h2">The Skeleton Blog</h2>
      <p>Keep up with the latest news, tutorials, and releases for Skeleton.</p>
    </div>
  </header>
  <hr />
  <section class="blog-list space-y-8">
    {#each data.posts as post}
      <a
        class="block hover:card hover:variant-soft p-4 rounded-container-token"
        href="/blog/{post.slug}"
        data-sveltekit-preload-data="hover"
      >
        <article
          class="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-4 lg:gap-8"
        >
          <!-- Featured Image -->
          {#if post.feature_image}
            <img
              class="bg-black/50 w-full lg:max-w-sm aspect-video rounded-container-token shadow-xl bg-cover bg-center"
              src={post.feature_image}
              alt="thumbnail"
            />
          {/if}
          <!-- Content -->
          <div class="space-y-4">
            <h2 class="h2">{post.title}</h2>
            <p>{post.excerpt}</p>
            <div class="flex items-center space-x-4">
              {#each post.tags as tag}
                <span class="text-xs font-bold opacity-50 capitalize"
                  >{tag.slug}</span
                >
              {/each}
            </div>
            <button class="btn variant-ghost-surface"
              >Read Article &rarr;</button
            >
          </div>
        </article>
      </a>
    {/each}
  </section>
  <footer>
    <!-- 생략 -->
  </footer>
</div>  
```

> css 살펴보기

- [`space-y-4`](https://tailwindcss.com/docs/space#add-vertical-space-between-children) : flex 아이템 간의 세로 간격
- [`items-center`](https://tailwindcss.com/docs/align-items) : flex 또는 grid 에서 보조축에 대한 중간 정렬
- [`mx-auto`](https://tailwindcss.com/docs/container#using-the-container) : container 를 중앙에 위치시킨다
- [`w-full`](https://tailwindcss.com/docs/width#percentage-widths) : `flex` 아래에서 사용하며, 너비 전체를 사용
  - [`w-auto`](https://tailwindcss.com/docs/width#resetting-the-width) : 기존에 설정된 너비 설정을 무효화 (ex: `md:w-auto`)

```scss
.page-container-wide {
  @apply w-full max-w-7xl mx-auto space-y-10;
}
.page-padding {
  @apply p-4 md:p-10;
}
```

#### Blog 리스트의 Pagination 과 Form Actions

소스 코드에는 client 스크립트로 처리되던 것을 server 스크립트로 변경해보았다.

- [SvelteKit 의 form actions 는 서버와 소통하는 가장 쉬운 방법이다.](https://joyofcode.xyz/sveltekit-data-flow#form-actions)
  - [`use:enhance` 는 form 과 POST 메서드를 이용해 페이지 reload 없이 동작한다.](https://joyofcode.xyz/working-with-forms-in-sveltekit#progressive-form-enhancement)
- 스크립트 `+page.ts` 파일을 `+page.server.ts` 로 이름 변경
  - client 는 server 의 코드를 import 도 호출도 할 수 없게 된다.
- server 의 blog-service 함수들를 직접 호출하던 것을 제거하고
  - client 함수 호출을 분리하여, form action 으로 변경했다.
  - 이것은 개별적인 [`/api/{endpoint}` 를 만드는 것](https://joyofcode.xyz/working-with-forms-in-sveltekit#working-with-forms-using-api-endpoints)과 다름없다.

> Pagination 제어부

```ts
// +page.server.ts
import { getBlogList } from '$lib/server/blog-service';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  return getBlogList(fetch, 1);  // 첫 페이지
};

export const actions = {
  prevPage: async ({ request, fetch }) => {
    const data = await request.formData();
    const page = Number(data.get('page'));
    console.log(`Action: prevPage=${page - 1}`);
    return getBlogList(fetch, page - 1);
  },
  nextPage: async ({ request, fetch }) => {
    const data = await request.formData();
    const page = Number(data.get('page'));
    console.log(`Action: nextPage=${page + 1}`);
    return getBlogList(fetch, page + 1);
  },
} satisfies Actions;
```

> Pagination 출력부

- PageData 로 초기 데이터를 받아오고
  - `data.meta.pagination` 에 현재 페이지 번호와 총 페이지 번호가 있음
- ActionData 로 새로운 페이지 번호에 대한 블로그 리스트 데이터를 받아온다.
  - 갱신된 form 으로 data 도 갱신 (effect 처리)
- 이전, 이후 페이지에 대한 제한은 button 비활성화로 처리한다.
  - [ghost](https://ghost.org/docs/introduction/) 라는 오픈소스 CMS 에서는 다양한 [meta 데이터](https://ghost.org/docs/content-api/#pagination) 를 제공한다.

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import type { PageData, ActionData } from './$types';
  import { enhance } from '$app/forms';
  export let data: PageData;
  export let form: ActionData;

  $: if (form) {
    data = form;
  }
</script>

<!-- Pagination -->
<footer class="flex justify-between items-center space-x-4">
  <div>
    <small class="opacity-50"
      >Page {data.meta.pagination.page} of {data.meta.pagination.pages}</small
    >
  </div>
  <div class="flex items-center space-x-4">
    <form method="POST" action="?/prevPage" use:enhance>
      <input type="hidden" name="page" value={data.meta.pagination.page} />
      <button
        type="submit"
        class="btn-icon variant-filled"
        disabled={!data.meta.pagination.prev}>&larr;</button
      >
    </form> <!-- 이전 페이지 버튼 폼 -->
    <form method="POST" action="?/nextPage" use:enhance>
      <input type="hidden" name="page" value={data.meta.pagination.page} />
      <button
        type="submit"
        class="btn variant-filled"
        disabled={!data.meta.pagination.next}>Next &rarr;</button
      >
    </form> <!-- 다음 페이지 버튼 폼 -->
  </div>
</footer>
```

#### [form action 동작중 loading 처리](https://joyofcode.xyz/working-with-forms-in-sveltekit#customize-the-enhance-action-to-show-a-loading-ui)

- `use:enhance={submitFunction}` 으로 action 호출시 hook 함수 연결
- `aria-busy={loading}` 으로 관련 button 을 비활성화
  - 참고 : [codepen - `aria-busy` 예제](https://codepen.io/stevef/pen/OZwMqv/)

```svelte
<!-- +page.svelte -->
<script lang="ts">
  import type { SubmitFunction } from './$types';
  import { enhance } from '$app/forms';
  // 생략...

  let loading = false;
  const onChangePage: SubmitFunction = () => {
    loading = true;
    console.log('onChangePage: loading...');
    return async ({ update }) => {
      loading = false;
      await update();
    };
  };  
</script>

<!-- 생략 -->    
<div class="flex items-center space-x-4">
  <form method="POST" action="?/prevPage" use:enhance={onChangePage}>
    <button
      aria-busy={loading}        
      type="submit"
      class="btn-icon variant-filled"
      disabled={!data.meta.pagination.prev}>&larr;</button
    >
  </form>
  <form method="POST" action="?/nextPage" use:enhance={onChangePage}>
    <button
      aria-busy={loading}
      type="submit"
      class="btn variant-filled"
      disabled={!data.meta.pagination.next}>Next &rarr;</button
    >
  </form>
</div>
```

### Blog 콘텐츠 페이지

```svelte
<script lang="ts">
  import hljs from 'highlight.js/lib/core';
  import { onMount } from 'svelte';

  import type { PageData } from './$types';  
  export let data: PageData;

  // Local
  const post = data.posts[0];
  let elemPage: HTMLElement | null;

  onMount(() => {
    // Element Page
    elemPage = document.querySelector('#page');
    // CodeBlock Highlight
    document.querySelectorAll('pre code').forEach((elem) => {
      if (!(elem instanceof HTMLElement)) return;
      hljs.highlightElement(elem);
    });
    // Table
    document.querySelectorAll('table').forEach((elem) => {
      elem.classList.add('table');
    });
  });   

  function scrollToTop(): void {
    if (elemPage) elemPage.scrollTop = 0;
  }
</script>

<div class="max-w-5xl mx-auto p-4 md:p-12 space-y-8">
  <!-- Breadcrumbs -->
  <ol class="breadcrumb">
    <li class="crumb"><a class="anchor" href="/blog">Blog</a></li>
    <li class="crumb-separator" aria-hidden>&rsaquo;</li>
    <li>Article</li>
  </ol>
  <!-- Header -->
  <header class="space-y-4">
    <h1 class="h1">{post.title}</h1>
    <!-- Featured Image -->
    {#if post.feature_image}<img
        src={post.feature_image}
        alt={post.title}
        class="w-full aspect-video rounded-container-token shadow-xl"
      />{/if}
  </header>
  <!-- Article -->
  <article class="prose lg:prose-xl max-w-full space-y-8 md:space-y-12">
    {@html post.html}
  </article>
</div>  
```

> HTMLElement 의 [classList](https://developer.mozilla.org/en-US/docs/Web/API/Element/classList)

`{el}.className` 또는 `{el}.classList` 로 특정 요소의 클래스를 조작할 수 있다.

> css 살펴보기

- [`max-w-full`](https://tailwindcss.com/docs/max-width) : 너비 100% (최대너비 제한에 사용)
- [`prose-xl`](https://tailwindcss.com/docs/typography-plugin#applying-a-type-scale) : typography 에서 폰트 사이즈 `1.25rem` 지정

## 3. Skeleton - Utilities

### [Code Blocks](https://www.skeleton.dev/utilities/codeblocks)

highlight.js 를 이용해 코드 블럭을 출력한다. ([지원하는 언어 리스트](https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md))

> 설치

1. [highlight.js](https://highlightjs.org/#usage) 설치
2. `+layout.svelte` 에서 필요한 lang 들만 선별하여 hljs 설정
3. `+layout.svelte` 에서 hljs 의 style css 설정
4. `+layout.svelte` 에서 storeHighlightJs 에 설정을 저장
5. `vite.config.ts` 에서 purgeCss 에 hljs 를 제외하도록 설정

```bash
bun add -d highlight.js
```

```svelte
<!-- +layout.svelte -->
<script>
  // Dependency: Highlight JS
  import hljs from 'highlight.js/lib/core';
  import xml from 'highlight.js/lib/languages/xml';
  import css from 'highlight.js/lib/languages/css';
  import json from 'highlight.js/lib/languages/json';
  import javascript from 'highlight.js/lib/languages/javascript';
  import typescript from 'highlight.js/lib/languages/typescript';
  import shell from 'highlight.js/lib/languages/shell';
  hljs.registerLanguage('xml', xml);
  hljs.registerLanguage('css', css);
  hljs.registerLanguage('json', json);
  hljs.registerLanguage('javascript', javascript);
  hljs.registerLanguage('typescript', typescript);
  hljs.registerLanguage('shell', shell);
  // hljs style css
  import 'highlight.js/styles/github-dark.css';
  // save hljs settings to store
  import { storeHighlightJs } from '@skeletonlabs/skeleton';
  storeHighlightJs.set(hljs);
</script>  
```

```ts
// vite.config.ts
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    purgeCss({
      safelist: {
        // any selectors that begin with "hljs-" will not be purged
        greedy: [/^hljs-/],
      },
    }),
  ],
  ssr: {
    noExternal: ['svelte-hero-icons'],
  },
});
```

> 사용법

```svelte
<script>
  import { CodeBlock } from '@skeletonlabs/skeleton';
</script>

<CodeBlock
  language="html"
  code={`
<p>
  The quick brown fox jumped over the lazy dog.
</p>
`}
/>
```

### [Popups](https://www.skeleton.dev/utilities/popups)

[@floating-ui/dom](https://floating-ui.com/docs/getting-started) 를 사용해 팝업 기능을 제공한다.

> 설치

1. `@floating-ui/dom` 설치
2. `+layout.svelte` 에서 floating-ui 설정을 `storePopup` 에 저장 (선택사항)

```bash
bun add -d @floating-ui/dom
```

> 사용법

- `use:popup` : popup 기능과 setttings 를 사용
- `data-popup` : 컴파일 할 때 변환

```svelte
<script>
  import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
  const popupClick: PopupSettings = {
    event: 'click',
    target: 'popupClick',
    placement: 'top'
  };  
</script>

<button class="btn variant-filled" use:popup={popupClick}>Click</button>

<div class="card p-4 variant-filled-primary" data-popup="popupClick">
  <p>Click Content</p>
  <div class="arrow variant-filled-primary" />
</div>          
```

### [Toasts](https://www.skeleton.dev/utilities/toasts)

하단에 잠시 노출되는 알림창이다. ex) url 클립보드 복사 버튼 클릭시 알림

> 설치

1. `+layout.svelte` 에서 initializeStores 실행
2. `+layout.svelte` 에서 최상위(AppShell 바깥쪽)에 Toast 요소 작성

> 사용법

```html
<script>
  import { getToastStore } from '@skeletonlabs/skeleton';
  const toastStore = getToastStore();  

  const t: ToastSettings = {
    message: 'Lorem ipsum dolor sit amet consectetur adipisicing elit...',
  };
  toastStore.trigger(t);
  // toastStore.close();  // 메시지 즉시 닫기
  // toastStore.clear();  // 메시지 큐를 비움
</script>
```

## 9. Review

- Skeleton 은 [AppShell](https://www.skeleton.dev/components/app-shell), [AppBar](https://www.skeleton.dev/components/app-bar) 등의 레이아웃 컴포넌트가 유용하다.
- ghost CMS 에는 [comments](https://ghost.org/docs/themes/helpers/comments/#basic-example) 기능도 있다. 살펴봐야겠다.
- Tailwind CSS 튜토리얼을 마치고 돌아와야겠다.
  - 템플릿 구조는 알겠지만, 복붙할 생각 아니면 스타일을 수정할 수 있어야한다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
