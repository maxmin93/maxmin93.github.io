---
date: 2024-01-03 00:00:00 +0900
title: Svelte Component 라이브러리 - 8일차
description: bits-ui 는 melt-ui 를 기반으로 작성된 headless UI 이다. 이를 다시 tailwind 변수들과 스타일 속성을 결합한 shadch-svelte 라이브러리를 살펴본다. 이와 함께 웹사이트 레이아웃을 추출하여 분석해본다.
categories: [Frontend, Svelte]
tags: ["melt-ui","bits-ui","tailwind"]
image: "https://opengraph.githubassets.com/46bfeda8337cd995f0b3d5f4f11f469cb06bbbd421e8f650c53f48d54d8145c2/huntabyte/bits-ui"
---

> 목록
{: .prompt-tip }

- [Svelte Component 라이브러리 - 1일차](/posts/svelte-components-tutorial-day1/) : Steeze UI
- [Svelte Component 라이브러리 - 2일차](/posts/svelte-components-tutorial-day2/) : Flowbite Svelte
- [Svelte Component 라이브러리 - 3일차](/posts/svelte-components-tutorial-day3/) : Flowbite Blocks
- [Svelte Component 라이브러리 - 4일차](/posts/svelte-components-tutorial-day4/) : daisyUI Svelte
- [Svelte Component 라이브러리 - 5일차](/posts/svelte-components-tutorial-day5/) : Skeleton
- [Svelte Component 라이브러리 - 6일차](/posts/svelte-components-tutorial-day6/) : Open Props
- [Svelte Component 라이브러리 - 7일차](/posts/svelte-components-tutorial-day7/) : Melt-UI
- [Svelte Component 라이브러리 - 8일차](/posts/svelte-components-tutorial-day8/) : Bits-UI &nbsp; &#10004;

bits-ui, shadcn-svelte 라이브러리는 [유튜버 Huntabyte](https://www.youtube.com/@Huntabyte) 가 작성했다.


## 0. 개요

- [x] 웹프레임워크 및 개발도구
  - Bun 1.0.21 + Vite 5.0.3 + SvelteKit 2.0.0
  - typescript 5.0.0
  - prettier 3.1.1
  - [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte) 3.1.2
- [x] CSS 유틸리티
  - TailwindCSS 3.3.6 + postcss 8.4.32
  - Tailwind: forms + typography
  - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss) 0.5.9
  - [vite-plugin-tailwind-purgecss](https://www.npmjs.com/package/vite-plugin-tailwind-purgecss) 0.1.4
  - [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) 2.1.0
- [x] UI 라이브러리
  - [shadcn-svelte](https://www.shadcn-svelte.com/) 0.5.0
  - [unovis/svelte](https://unovis.dev/docs/quick-start) 1.3.1 (시각화 라이브러리)
- [x] 유틸리티
  - fonts : D2Coding, Noto Sans/Serif KR, Noto Color Emoji
  - [faker-js](https://www.npmjs.com/package/@faker-js/faker) 8.3.1
  - [lucide-svelte](https://www.npmjs.com/package/lucide-svelte) 0.295.0 (아이콘 1346개, ISC 라이센스)


## 1. 프로젝트 생성

### [SvelteKit](https://kit.svelte.dev/) + shadcn 프로젝트 생성

```bash
bun create svelte@latest svltk2-shadcn-app
  # - Skeleton project
  # - Typescript
  # - Prettier

cd svltk2-shadcn-app
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
5. `tailwind.config.js` 설정 : 폰트, plugins
6. `src/app.html` 설정 : 폰트, theme
7. `src/app.pcss` 설정 : 폰트, Tailwind directives
8. `src/+layout.svelte` : app.pcss 연결
9. `src/+page.svelte` : 데모 코드 작성후 확인

> 작업 로그

```bash
# tailwind 설치
bun add -d tailwindcss postcss autoprefixer @tailwindcss/typography
bun add tailwind-variants clsx tailwind-merge

# tailwind plugins, icons, faker 설치
bun add -d vite-plugin-tailwind-purgecss
bun add -d prettier-plugin-tailwindcss
bun add -d lucide-svelte
bun add -d @faker-js/faker

bunx tailwindcss init -p

# prettier 에 tailwind 플러그인 추가
sed -i '' 's/"prettier-plugin-svelte"\]/"prettier-plugin-svelte","prettier-plugin-tailwindcss"\]\n"overrides": [\n{\n"files": "*.svelte",\n"options": {\n"parser": "svelte"\n}\n},\n{\n"files": "*.md",\n"options": {\n"tabWidth": 2,\n"useTabs": false,\n"printWidth": 79\n}\n}\n]/' .prettierrc

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
    // require('@tailwindcss/typography'), 
    // require('@tailwindcss/forms'),
  ],
};
EOF

# lang, body.class 추가
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

# Tailwind 설정, 폰트 추가 (Noto 한글 및 Emoji)
cat <<EOF > src/app.pcss
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');
@import url("//cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-ligature-full.css");

@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

cat <<EOF > src/routes/+layout.svelte
<script lang="ts">
  import '../app.pcss';
</script>

<slot />
EOF
```

#### 데모 `src/+page.svelte`

- lucide : 아이콘
- faker : lorem 더미 문장

```bash
# tailwind container 데모
cat <<EOF > src/routes/+page.svelte
<script>
  import { BookOpen } from 'lucide-svelte';
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
      <BookOpen size="2rem" />
      <span class="ml-2">Learn more</span>
    </button>
  </div>
</header>
EOF
```

## 2. [bits-ui 설정](https://www.bits-ui.com/docs/getting-started)

bits-ui 는 shacdn-svelte 으로 가기 위한 중간 개발물 같은 존재다. shacdn-svelte 에서 bits-ui 샘플 코드를 넣어도 tailwind 내용이 조금 틀리지만 잘 돌아간다.

```bash
bun add bits-ui
```

### 비교 : melt-ui vs bits-ui vs shadcn-svelte vs daisyUI

Accordion 컴포넌트를 기준으로 비교해 본다.

#### [melt-ui 의 Accordion](https://melt-ui.com/docs/builders/accordion)

- melt-ui 는 UI 를 위한 동작과 이벤트, 스타일을 모두 코드로 다루고 있다.
  - 참고: [깃허브 - melt-ui/builders/accordion](https://github.com/melt-ui/melt-ui/tree/develop/src/lib/builders/accordion)
  - 소스를 보면 굳이 이렇게까지 headless 를 사용할 필요가 있는지 회의감이 든다.
  - 다른 css 라이브러리에 구애받지 않고 동일한 기능을 사용할 수 있다는 것은 장점이다.

- 색상에 사용된 `bg-neutral-100` 등은 사용자 칼라 설정이 필요하다.
  - 참고: [tailwind 커스텀 칼라 설정](https://tailwindcss.com/docs/customizing-colors#using-custom-colors)

```svelte
<script lang="ts">
  import { cn } from '$docs/utils';
  import { createAccordion, melt } from '@melt-ui/svelte';
  import { slide } from 'svelte/transition';
 
  const {
    elements: { content, item, trigger, root },
    helpers: { isSelected },
  } = createAccordion({
    defaultValue: 'item-1',
  });
 
  const items = [
    {
      id: 'item-1',
      title: 'What is it?',
      description:
        'A collection of accessible & unstyled component builders for Svelte applications.',
    },
    {
      id: 'item-2',
      title: 'Can I customize it?',
      description: 'Totally, it is 100% stylable and overridable.',
    },
    {
      id: 'item-3',
      title: 'Svelte is awesome, huh?',
      description: 'Yes, and so are you!',
    },
  ];
 
  let className = '';
  export { className as class };
</script>
 
<div
  class={cn(
    'mx-auto w-[18rem] max-w-full rounded-xl bg-white shadow-lg sm:w-[25rem]',
    className,
  )}
  {...$root}
>
  {#each items as { id, title, description }, i}
    <div
      use:melt={$item(id)}
      class="overflow-hidden transition-colors first:rounded-t-xl
            last:rounded-b-xl"
    >
      <h2 class="flex">
        <button
          use:melt={$trigger(id)}
          class={cn(
            'flex flex-1 cursor-pointer items-center justify-between ',
            'bg-white px-5 py-5 text-base font-medium leading-none',
            'text-black transition-colors hover:bg-neutral-100 focus:!ring-0',
            'focus-visible:text-magnum-800',
            i !== 0 && 'border-t border-t-neutral-300',
          )}
        >
          {title}
        </button>
      </h2>
      {#if $isSelected(id)}
        <div
          class={cn(
            'content',
            'overflow-hidden bg-neutral-100 text-sm text-neutral-600',
          )}
          use:melt={$content(id)}
          transition:slide
        >
          <div class="px-5 py-4">
            {description}
          </div>
        </div>
      {/if}
    </div>
  {/each}
</div>
 
<style lang="postcss">
  .content {
    box-shadow: inset 0px 1px 0px theme('colors.neutral.300');
  }
</style>
```

#### [bits-ui 의 Accordion](https://www.bits-ui.com/docs/components/accordion)

- 사용 코드는 melt-ui 의 태그 레이어를 개별적인 svelte 요소로 만들어 조립한 형태이다.
  - 참고 : [깃허브 - accordion/components](https://github.com/huntabyte/bits-ui/tree/main/src/lib/bits/accordion/components)

```svelte
<script lang="ts">
  import { Accordion } from "$lib";
  import { CaretDown } from "phosphor-svelte";
  import { slide } from "svelte/transition";
 
  const items = [
    {
      title: "Feature Overview",
      content:
        "Task management, messaging, file sharing, progress tracking, and reporting for your team."
    },
    {
      title: "Platform Advantages",
      content:
        "Experience improved productivity, enhanced communication, and customizable project views for project execution."
    },
    {
      title: "Implementation Strategies",
      content:
        "Define clear goals, provide training, encourage adoption, and iterate based on feedback."
    }
  ];
</script>
 
<Accordion.Root class="w-full sm:max-w-[70%]" multiple>
  {#each items as item, i}
    <Accordion.Item value="${i}" class="group border-b border-dark-10 px-1.5">
      <Accordion.Header>
        <Accordion.Trigger
          class="flex w-full flex-1 items-center justify-between py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180 "
        >
          {item.title}
          <span
            class="inline-flex items-center justify-center rounded-[7px] bg-transparent transition-all sq-8 hover:bg-dark-10"
          >
            <CaretDown class="transition-all duration-200 sq-[18px]" />
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content
        transition={slide}
        transitionConfig={_{ duration: 200 }_}
        class="pb-[25px] text-sm tracking-[-0.01em]"
      >
        {item.content}
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
```

#### [shadcn-svelte 의 Accordion](https://www.shadcn-svelte.com/docs/components/accordion)

- bits-ui 코드에서 tailwind 클래스들이 제거되어 매우 깔끔해졌다.
  - 대신에 tailwind 테마 설정을 잘 해야 한다.
  - bits-ui 코드가 있고, 그 뒤에 melt-ui 가 돌아간다.

```svelte
<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion";
</script>

<Accordion.Root class="w-full sm:max-w-[70%]">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It adheres to the WAI-ARIA design pattern.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Is it styled?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It comes with default styles that matches the other components'
      aesthetic.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-3">
    <Accordion.Trigger>Is it animated?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It's animated by default, but you can disable it if you prefer.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>
```

#### [daisyUI 의 Accordion](https://daisyui.com/components/accordion/)

- 선택된 패널을 인식하기 위해 update_accordion 함수가 필요하다
- `svelte/transition` 의 slide 효과를 주고 싶었지만, 작동하지 않는다
  - daisyUI 의 `collapse-content` 에 이미 transition 지시자가 있다 

```svelte
<script lang="ts">
  import { slide } from 'svelte/transition';
  import { cn } from '$lib/utils';
  const items = [
    {
      id: 'item-1',
      title: 'What is it?',
      description:
        'A collection of accessible & unstyled component builders for Svelte applications.'
    },
    {
      id: 'item-2',
      title: 'Can I customize it?',
      description: 'Totally, it is 100% stylable and overridable.'
    },
    {
      id: 'item-3',
      title: 'Svelte is awesome, huh?',
      description: 'Yes, and so are you!'
    }
  ];
  let className = '';
  export { className as class };

  let selected_accordion = 'none';
  function update_accordion(selected_id: string) {
    if (selected_accordion === selected_id) {
      selected_accordion = 'none';
    } else {
      selected_accordion = selected_id;
    }
  }
</script>

<div class={cn('mx-auto w-[18rem] max-w-full rounded-xl shadow-lg sm:w-[25rem]', className)}>
  {#each items as { id, title, description }, i}
    <div class="collapse bg-base-200" on:click={() => update_accordion(id)}>
      <input type="radio" {id} checked={selected_accordion === id} />
      <div class="collapse-title text-xl font-medium">{title}</div>
      <div class="collapse-content bg-gray-600 pt-2"
        transition:slide={_{ delay: 250, duration: 3000 }_}
      >
        <p>{description}</p>
      </div>
    </div>
  {/each}
</div>
```

#### 추가 : [skeleton 의 accordion](https://www.skeleton.dev/components/accordions)

- 사용된 형태는 shacdn-svelte 와 비슷하다.
  - skeleton 이 svelte fragment 기능을 잘 활용한다. (가볍고 잘 움직임)
- 컴포넌트 소스의 복잡함은 비등비등한데, props 등의 문서 정리가 잘 되어 있다.
  - 참고 : [accordion 컴포넌트 소스](https://github.com/skeletonlabs/skeleton/tree/dev/packages/skeleton/src/lib/components/Accordion)

```svelte
<Accordion>
  <AccordionItem open>
    <svelte:fragment slot="lead">(icon)</svelte:fragment>
    <svelte:fragment slot="summary">(summary)</svelte:fragment>
    <svelte:fragment slot="content">(content)</svelte:fragment>
  </AccordionItem>
  <AccordionItem>
    <svelte:fragment slot="lead">(icon)</svelte:fragment>
    <svelte:fragment slot="summary">(summary)</svelte:fragment>
    <svelte:fragment slot="content">(content)</svelte:fragment>
  </AccordionItem>
  <!-- ... -->
</Accordion>
```


## 3. [shacdn-svelte 설치](https://www.shadcn-svelte.com/docs/installation)

shadcn-svelte 는 bits-ui 를 tailwind 변수들과 잘 짜집기 한 컴포넌트 파일셋 중 필요한 파일들만 추출하여 가져오는 방식으로 설치한다. (`components.json`에 가져올 코드셋에 대한 정보가 설정된다)

### 수동 설정

bits-ui 를 설치하고, 필요한 components/ui 파일들을 복사해 와도 된다.

1. sveltekit 프로젝트 생성
2. tailwind, bits-ui 라이브러리 설치
3. `tailwind.config.js` 설정 : theme, colors, font
4. `src/app.pcss` 설정 : color 변수값, base 레이어
5. `$lib/utils.ts` 생성 : 코드 복사
6. `src/routes/+layout.svelte` : app.pcss 연결

```bash
bun add bits-ui

# 필수 tailwind 라이브러리
bun add tailwind-variants clsx tailwind-merge
```

#### CLI 이용한 자동 설정

`default` 스타일인 경우 lucid icon 을 사용한다.

```console
$ bunx shadcn-svelte@latest init
This command assumes a SvelteKit project with TypeScript and Tailwind CSS.
If you don't have these, follow the manual steps at https://shadcn-svelte.com/docs/installation.

✔ Running this command will install dependencies and overwrite your existing tailwind.config.[cjs|js|ts] & app.pcss file. Proceed? … yes
✔ Which style would you like to use? › Default
✔ Which color would you like to use as base color? › Slate
✔ Where is your global CSS file? … src/app.pcss
✔ Where is your tailwind.config.[cjs|js|ts] located? … tailwind.config.js
✔ Configure the import alias for components: … $lib/components
✔ Configure the import alias for utils: … $lib/utils
✔ Write configuration to components.json. Proceed? … yes

✔ Writing components.json...
✔ Initializing project...
✔ Installing dependencies...

Success! Project initialization completed.

Don't forget to add the aliases you configured to your svelte.config.js!

$ _
```

### 웹사이트 레이아웃

> desktop 스크린샷

![shadcn-svelte-dashboard-desktop](/2024/01/03-shadcn-svelte-dashboard-desktop.png){: width="440" .w-75}
_shadcn-svelte-dashboard-desktop_

> mobile 스크린샷

![shadcn-svelte-dashboard-mobile](/2024/01/03-shadcn-svelte-dashboard-mobile.png){: width="320" .w-75}
_shadcn-svelte-dashboard-mobile_

> sidebar 메뉴 스크린샷

![shadcn-svelte-dashboard-sidebar](/2024/01/03-shadcn-svelte-dashboard-sidebar.png){: width="320" .w-75}
_shadcn-svelte-dashboard-sidebar_

> search dialog 스크린샷

![shadcn-svelte-dashboard-search](/2024/01/03-shadcn-svelte-dashboard-search.png){: width="440" .w-75}
_shadcn-svelte-dashboard-search_


#### `+layout.svelte`

- ModeWatcher : light/black 모드 관리
- Metadata : head 영역에 검색 최적화 정보 삽입
- DefaultSonner : 메시지 Toast 출력 영역
- div#page : 페이지 영역
  - SiteHeader : 헤더 (sticky top-0 w-full)
  - slot : 콘텐츠 영역 (flex-1)
  - SiteFooter : 푸터

```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { dev, browser } from '$app/environment';
  import { Metadata, SiteFooter, SiteHeader } from '$lib/components/docs';
  import { updateTheme } from '$lib/utils';
  import '../app.pcss';
  import { config } from '$lib/stores';
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster as DefaultSonner } from '$lib/components/ui/sonner';

  $: updateTheme($config.theme, $page.url.pathname);
</script>

<ModeWatcher />
<Metadata />
<DefaultSonner />

<div class="relative flex min-h-screen flex-col" id="page">
  <SiteHeader />
  <div class="flex-1">
    <slot />
  </div>
  <SiteFooter />
</div>
```

#### SiteHeader

- MainNav : 데스크탑 헤더
- MobileNav : 모바일 헤더
- CommandMenu : 문서/명령 검색 (dialog), Ctrl+K 단축키
- 링크 아이콘 : 깃허브, 트위터
- ModeToggle : 테마 모드 변경 (Light/Dark/System)

> MainNav

- 로고
- 데스크탑 메뉴

> MobileNav

- 햄버거 메뉴 아이콘
- Sheet : 사이드바 메뉴
  - Root, Trigger, Content

> CommandMenu

- onMount 에서 keydown 이벤트 등록 (소멸시 이벤트 삭제)
- 메인 메뉴, 사이드바 메뉴 포함
- 모드 Toggle 명령 연결

#### SiteFooter

- right, about 문구

## 9. Review

- tailwind 설정을 잘하게 되면 해결될 문제가 많다. 변수라던지, 테마, 칼라 등..
- 레이아웃만 뽑아놓고 보니 동작도 빠릿하고, 깔끔한게 세련되어 보인다.
  - markdown 과 테이블 등 몇가지 예제를 추가해서 더 다루어보려고 한다.
- 몰랐던 유틸리티들이 여럿 포함되어 있어서 유익했다.

> svelte 유틸리티 컴포넌트

- [svelte-sonner](https://github.com/wobsoriano/svelte-sonner) : 겹침 상태로 보여지는 Toast (세련된 스타일)
- [svelte-persisted-store](https://www.npmjs.com/package/svelte-persisted-store) : local storage 관리 (구독/갱신/설정/읽기)
- [Mode Watcher](https://www.npmjs.com/package/mode-watcher) : sveltekit 위한 light/dark 모드 관리
- [lodash.template](https://lodash.com/docs/4.17.15#template) : 템플릿 기반 문자열 생성 (eval 기능)
- [cmdk-sv](https://github.com/huntabyte/cmdk-sv) : 검색창 (목록 필터링)
- [svelte-infinite-loading](https://github.com/skayo/svelte-infinite-loading) : 무한 스크롤

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
