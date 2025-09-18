---
date: 2023-11-08 00:00:00 +0900
title: Svelte Component 라이브러리 - 4일차
description: 원하는 UI 구성을 위해 유틸리티 CSS 라이브러리인 TailwindCSS 와 daisyUI 를 공부합니다. 웹프레임워크로 SveltKit 을 사용하고 bun 런타임 위에서 실행합니다.
categories: [Frontend, Svelte]
tags: ["daisyui","tailwind"]
image: "https://s3-alpha.figma.com/hub/file/3709321768/b28165db-1eed-4f6a-9027-8f3317357e55-cover.png"
---

> 목록
{: .prompt-tip }

- [Svelte Component 라이브러리 - 1일차](/posts/svelte-components-tutorial-day1/) : Steeze UI
- [Svelte Component 라이브러리 - 2일차](/posts/svelte-components-tutorial-day2/) : Flowbite Svelte
- [Svelte Component 라이브러리 - 3일차](/posts/svelte-components-tutorial-day3/) : Flowbite Blocks
- [Svelte Component 라이브러리 - 4일차](/posts/svelte-components-tutorial-day4/) : daisyUI &nbsp; &#10004;

## 0. 개요

- [x] Bun 1.0.10 + SvelteKit 1.20.4
- [x] TailwindCSS 3.3.5
  - daisyUI 3.9.4
  - theme-change
- [x] Etc
  - heroicons
  - purgecss

> svelte 와 daisyui 로 구현한 tabs 컴포넌트

![svelte-daisyui-tabs](/2023/11/08-svelte-daisyui-tabs.png){: width="560" .w-75}
_svelte-daisyui-tabs_

## 1. 프로젝트 생성

### [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
bun create svelte@latest bun-daisyui-app
  # - Skeleton project
  # - Typescript

cd bun-daisyui-app
bun install

bun run dev
```

### [TailwindCSS 및 daisyUI 설정](https://daisyui.com/docs/install/) 

1. TailwindCSS, tailwind-merge 설치
2. 한글 폰트, daisyUI 라이브러리 설치
3. heroicons 설치 (MIT 라이센스), fontawesome-free 설치 (무료)
4. `tailwind.config.js` 에 daisyUI 설정 추가
5. `app.postcss` 에 Tailwind directives 추가
6. 최상위 `+layout.svelte` 에 전역 css 추가 
7. `+page.svelte` 에 데모 코드를 넣어 daisyUI 작동 확인

```bash
bun add -d tailwindcss postcss autoprefixer tailwind-merge
bun add -d @tailwindcss/typography daisyui@latest
bun add -d svelte-hero-icons
bun add @fortawesome/fontawesome-free

bunx tailwindcss init -p

# lang, daisyUI theme 설정
sed -i '' 's/html lang="en"/html lang="ko" data-theme="dark"/' src/app.html

# default font, daisyUI 설정
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
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    logs: false,
    themes: ['cmyk', 'dark', 'lofi'], // HTML[data-theme]
  },
};
EOF

cat <<EOF > src/app.postcss
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');
@import url("//cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-ligature-full.css");

@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

cat <<EOF > src/routes/+layout.svelte
<script lang="ts">
  import '@fortawesome/fontawesome-free/css/all.min.css';
  import '../app.postcss';
</script>

<slot />
EOF

# daisyUI hero 데모
cat <<EOF > src/routes/+page.svelte
<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">안녕, daisyUI</h1>
      <p class="py-6">with TailwindCSS + SvelteKit + Bun</p>
      <button class="btn btn-primary">시작하기</button>
    </div>
  </div>
</div>
EOF

bun run dev
```

#### daisyUI [theme-change 추가](https://github.com/saadeghi/theme-change)

- 설치 : `bun add theme-change`

```html
<script>
  import { onMount } from 'svelte';
  import { themeChange } from 'theme-change';

  onMount(() => {
    themeChange(false);
    // 👆 false parameter is required for svelte
  });
</script>

<select data-choose-theme>
  <option value="cmyk">Light</option>
  <option value="dark">Dark</option>
  <option value="lofi">Other</option>
</select>
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

## 2. daisyUI 로 Tab 컴포넌트 만들기

### [daisyUI 의 Tab 스타일](https://daisyui.com/components/tab/#lifted)

이것만으로는 tab 을 클릭할 수도, 전환할 수도, 내용을 출력할 수도 없다.

- `tab-lifted` 스타일 
- `tab-active` : 활성화 탭을 강조

```html
<div class="tabs">
  <a class="tab tab-lifted">Tab 1</a> 
  <a class="tab tab-lifted tab-active">Tab 2</a> 
  <a class="tab tab-lifted">Tab 3</a>
</div>
```

#### [Svelte Tab component 예제](https://svelte.dev/repl/cf05bd4a4ca14fb8ace8b6cdebbb58da?version=4.2.2)

기본 예제에 daisyUI 를 적용했다. (context 사용 예제도 추가)

> `+page.svelte` : 탭 그룹이 출력될 페이지

```html
<!-- +page.svelte -->
<script>
  import Tab1 from './Tab1.svelte';
  import Tab2 from './Tab2.svelte';
  import Tab3 from './Tab3.svelte';
  import Tabs from './Tabs.svelte';  // TapGroup

  // List of tab items with labels, values and assigned components
  let items = [
    { label: 'Content', value: 1, component: Tab1 },
    { label: 'Interactions', value: 2, component: Tab2 },
    { label: 'Tab 3', value: 3, component: Tab3 },
  ];

  import { setContext } from 'svelte';
  setContext('count', 5);  // Tab2 의 count 초기값  
</script>

<Tabs {items} />
```

> `Tabs.svelte` : 탭 그룹

- tab 라벨 클릭시 activeTabValue 변경하고 `tab-active` 활성화
- tab 라벨과 컴포넌트들을 index 값 순서로 출력
- svelte 컴포넌트 
  - TS 타입 선언시 `import('svelte').ComponentType` 사용
  - `svelte:component` 를 이용해 바인딩

```html
<!-- Tabs.svelte -->
<script>
  /**
   * TabItem 타입 정의
   * @typedef {Object} TabItem
   * @property {string} label - 탭 이름
   * @property {number} value - 탭 번호
   * @property {import('svelte').ComponentType} component - 탭 내용
   */

  /** @type { TabItem[] } */
  export let items = [];
  export let activeTabValue = 1;

  const handleClick = (/** @type {number} */ tabValue) => () =>
    (activeTabValue = tabValue);
</script>

<div class="container">
  <div class="tabs">
    {#each items as item (item.value)}
      <a class="tab tab-lifted" 
        class:tab-active={activeTabValue === item.value} 
        on:click={handleClick(item.value)}
        >{item.label}</a>
    {/each}
  </div>
  {#each items as item (item.value)}
    {#if activeTabValue == item.value}
      <div class="border p-4">
        <svelte:component this={item.component} />
      </div>
    {/if}
  {/each}
</div>
```

> `Tab2.svelte` : 탭 아이템

- daisyUI 에서 typography 사용시 prose 클래스로 감싸야 함
- context 로부터 count 초기값을 받고, 종료시 context 에 저장

```html
<!-- Tab2.svelte -->
<script lang="ts">
  import { setContext, getContext, onDestroy } from 'svelte';
  let count = getContext<number>('count') ?? 1;
  onDestroy(() => {
    setContext('count', count); // 탭 전환 전에 count 저장
  });
</script>

<article class="prose">
  <h2 class="h2">And we can have interactive content like this</h2>
  <p>
    The count is: {count}
  </p>
</article>
<div class="pt-4">
  <button class="btn btn-primary" on:click={() => (count += 1)}>
    Increment
  </button>
  <button class="btn btn-secondary" on:click={() => (count -= 1)}>
    Decrement
  </button>
</div>
```

### [flowbite-svelte 의 Tabs 컴포넌트](https://flowbite-svelte.com/docs/components/tabs)

> Tabs 사용 예시

- Tabs : 탭 그룹
- TabItem : 탭 아이템
  - open 속성 : active 상태 여부
  - title 속성 : 탭 라벨

```html
<!-- +page.svelte -->
<script>
  import { Tabs, TabItem } from 'flowbite-svelte';
</script>

<Tabs>
  <TabItem open title="Profile">
    <p class="text-sm text-gray-500 dark:text-gray-400">
      <b>Profile:</b>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </TabItem>
  <TabItem title="Settings">
    <p class="text-sm text-gray-500 dark:text-gray-400">
      <b>Settings:</b>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    </p>
  </TabItem>
  <!-- ... -->
</Tabs>  
```

#### [Tabs 그룹 컴포넌트](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/tabs/Tabs.svelte)

- context 로 설정 내용을 하위 탭 아이템 컴포넌트들에게 전달
  - active/inactive 클래스 전달
  - 선택 컴포넌트 selected 를 writable 로 전달
- 탭 내용이 출력될 div 에 액션 함수 init 를 연결
  - 선택 컴포넌트가 있으면 div 의 내용을 선택 컴포넌트로 교체

```html
<!-- Tabs.svelte -->
<script context="module" lang="ts">
  import { writable, type Writable } from 'svelte/store';

  export interface TabCtxType {
    activeClasses: string;
    inactiveClasses: string;
    selected: Writable<HTMLElement>;
  }
</script>

<script lang="ts">
  import { twMerge } from 'tailwind-merge';
  import { setContext } from 'svelte';

  const ctx: TabCtxType = {
    activeClasses: styledActiveClasses[style] || activeClasses,
    inactiveClasses: styledInactiveClasses[style] || inactiveClasses,
    selected: writable<HTMLElement>()
  };
  setContext('ctx', ctx);

  function init(node: HTMLElement) {
    const destroy = ctx.selected.subscribe((x: HTMLElement) => {
      if (x) node.replaceChildren(x);
    });

    return { destroy };
  }
</script>

<ul class={ulClass}>
  <slot {style} />
</ul>
<div class={contentClass} role="tabpanel" aria-labelledby="id-tab" use:init />      
```

#### [Tabs 아이템 컴포넌트](https://github.com/themesberg/flowbite-svelte/blob/main/src/lib/tabs/TabItem.svelte)

- 외부에서 open, title, defaultClass 입력받기
  - button 형태로 title 출력
  - open 이면 button 에 active 클래스 추가
- 컴포넌트가 생성되면서 init 액션 함수 실행
  - 현재 아이템 컴포넌트를 selected 로 저장
  - 컴포넌트 소멸시, 현재 아이템 컴포넌트가 selected 가 아닐 경우
    - `open=false` 처리 (hidden 상태로 존재)

```html
<script lang="ts">
  import { getContext } from 'svelte';
  import type { TabCtxType } from './Tabs.svelte';
  import { writable } from 'svelte/store';
  import { twMerge } from 'tailwind-merge';

  export let open: boolean = false;
  export let title: string = 'Tab title';
  export let defaultClass: string = 'inline-block text-sm font-medium text-center disabled:cursor-not-allowed';

  const ctx = getContext<TabCtxType>('ctx') ?? {};
  // single selection
  const selected = ctx.selected ?? writable<HTMLElement>();

  function init(node: HTMLElement) {
    selected.set(node);

    const destroy = selected.subscribe((x) => {
      if (x !== node) {
        open = false;
      }
    });

    return { destroy };
  }

  let buttonClass: string;
  $: buttonClass = twMerge(
    defaultClass,
    open ? ctx.activeClasses : ctx.inactiveClasses,
    open && 'active'
  );
</script>

<li class={twMerge('group', $$props.class)} role="presentation">
  <button type="button" on:click={() => (open = true)} class={buttonClass}>
    <slot name="title">{title}</slot>
  </button>
  {#if open}
    <div class="hidden tab_content_placeholder">
      <div use:init>
        <slot />
      </div>
    </div>
  {/if}
</li>
```

#### [svelte 의 `use:{action}` 사용법](https://svelte.dev/docs/element-directives#use-action)

[action](https://svelte.dev/docs/svelte-action) 은 해당 element 가 생성될 때, 실행되는 함수이다.

- TS 타입 : `import('svelte/action').Action`
- `HTMLElement` 를 첫번째(필수) 파라미터로 받는다.
- element 종료시 실행될 destory 를 반환한다. (대부분의 사용 사례가 이것임)
  - element 갱신시에 실행될 update 함수는 어떻게 쓰는지 이해 안됨

> 참고 : [JoyOfCode 의 Svelte Actions 예제](https://joyofcode.xyz/svelte-actions-guide#svelte-actions)

- div 생성시 greet 액션 함수가 실행되면서 'hello (init)' 출력
  - greet 액션 함수에서 커스텀이벤트 greet 등록
  - greet 이벤트를 dispatch 하면서, 바로 'hi' 출력
- input 요소에 바인딩 된 content 값이 변경되면 update 콜백이 실행됨
  - onchange 이벤트가 연결된 듯이 처리됨 (변경될 때마다 content 출력)
  - greet 함수에 **parameter** 가 연결되지 않으면 update 콜백도 실행 안됨 (오호!)
- div 종료시 destory 콜백이 실행됨 ('bye' 출력)

```html
<script lang="ts">
  let content = ''

  function greet(element: HTMLElement, content: string) {
    console.log('hello (init)')

    // custom event
    const greetEvent = new CustomEvent('greet', { detail: 'hi' })
    element.dispatchEvent(greetEvent)

    return {
      update(content: string) {
        // the value of content has changed
        console.log({ content })
      },
      destroy() {
        // logs when element is removed
        console.log('bye')
      },
    }
  }

  function handleGreet(event: CustomEvent) {
    console.log(event.detail) // "hi"
  }
</script>

<!-- bind input value to `content` -->
<input bind:value={content} />

<!-- run `update` when `content` updates  -->
<div on:greet={handleGreet} use:greet={content}>Action</div>
```

#### [svelte 에서 subscribe 를 멈추는 방법](https://stackoverflow.com/a/74997646/6811653)

[subscription](https://rxjs.dev/guide/subscription) 을 onDestory 함수에 넣기만 하면 된다. 

- onDestory 는 svelte 컴포넌트의 종료시 자동으로 실행된다. (callback)

```js
import { onDestroy } from "svelte"

const subcriber = page.subscribe((newPage) => handleChangePage(newPage.params.id))

onDestroy(subcriber)
```

### [skeleton 의 Tabs 컴포넌트](https://www.skeleton.dev/components/tabs)

> Tabs 사용 예시

```html
<script>
  import Tab from './Tab.svelte';
  import TabGroup from './TabGroup.svelte';

  let tabSet = 0;
</script>

<!-- <div class="tabs"> -->
<TabGroup>
  <!-- <a class="tab tab-lifted">Tab 1</a>  -->
  <Tab bind:group={tabSet} name="tab1" value={0}>
    <svelte:fragment slot="lead">(icon)</svelte:fragment>
    <span>(label 1)</span>
  </Tab>
  <Tab bind:group={tabSet} name="tab2" value={1}>(label 2)</Tab>
  <Tab bind:group={tabSet} name="tab3" value={2}>(label 3)</Tab>
  <!-- Tab Panels --->
  <svelte:fragment slot="panel">
    {#if tabSet === 0}
      (tab panel 1 contents)
    {:else if tabSet === 1}
      (tab panel 2 contents)
    {:else if tabSet === 2}
      (tab panel 3 contents)
    {/if}
  </svelte:fragment>
</TabGroup>

```

#### [Tabs 그룹 컴포넌트](https://github.com/skeletonlabs/skeleton/blob/dev/packages/skeleton/src/lib/components/Tab/TabGroup.svelte)

- 탭 아이템을 출력할 slot 을 정의하고
- panel slot 을 별도로 정의해서 탭 내용을 기술할 수 있도록 했다.

```html
<script>
  // context 로 active, hover, flex, padding 등 스타일 변수들을 저장
</script>

<div class="tab-group {classesBase}">
  <!-- Tab List -->
  <div class="tab-list {classesList}">
    <slot />
  </div>
  <!-- Tab Panel -->
  {#if $$slots.panel}
    <div class="tab-panel {classesPanel}" tabindex="0">
      <slot name="panel" />
    </div>
  {/if}
</div>
```

#### [Tabs 아이템 컴포넌트](https://github.com/skeletonlabs/skeleton/blob/dev/packages/skeleton/src/lib/components/Tab/Tab.svelte)

- 탭 리스트의 탭 아이템을 출력하는 요소
- 탭 선택의 동작은 radio input 요소가 담당하고, 실제 보여지는 탭은 따로 있다.
- `onKeyDown` 이벤트에서 키보드 관련 동작만 처리한다.
  - mouse 이벤트는 어떻게 연결되는지를 이해하지 못했다.
    - [aria-controls](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-controls) 를 이용하는거 같은데 잘 모르겠다.

```html
<script>
  let elemInput: HTMLElement;

  // A11y Key Down Handler
  function onKeyDown(event: SvelteEvent<KeyboardEvent, HTMLDivElement>): void {
    // 길어서 생략...
  }

</script>

<label class={classesBase} {title}>
  <div 
    class="tab {classesTab}" tabindex={selected ? 0 : -1}
    on:keydown={onKeyDown}
  >
    <div class="h-0 w-0 overflow-hidden">
      <input
        bind:this={elemInput}
        type="radio"
        bind:group
        {name}
        {value}
        {...prunedRestProps()}
        tabindex="-1"
        on:click
        on:change
      />
    </div>
    <!-- Interface -->
    <div class="tab-interface {classesInterface}">
      {#if $$slots.lead}
        <div class="tab-lead"><slot name="lead" /></div>
      {/if}
      <div class="tab-label">
        <slot />
      </div>
    </div>
  </div>
</label>
```

#### [svelte 의 radio input 그룹 바인딩 예제](https://svelte.dev/repl/2b143322f242467fbf2b230baccc0484?version=3.23.2)

- `bind:group` 가 value 와 일치하면 active 선택

```html
<script>
  const values = [
    { label: 'ten', price: 10 },
    { label: 'twenty', price: 20 },
    { label: 'thirty', price: 30 },
  ];
  let selected = 20; // or values[1];

  const slugify = (str = '') =>
    str.toLowerCase().replace(/ /g, '-').replace(/\./g, '');
</script>

{#each values as value}
  <label for={slugify(value.label)}>
    <input
      type="radio"
      bind:group={selected}
      id={slugify(value.label)}
      name="amount"
      value={value.price /* or value */}
    />
    {value.label}
  </label>
{/each}
```

> 참고 : label 과 input 의 매칭 기준은 `id`

- [label 의 for 과 input 의 id 가 일치해야 matching 되지만](https://stackoverflow.com/a/62211160/6811653)
- [label 안에 input 을 넣을 경우 for, id 가 없어도 된다.](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#try_it)


## 3. [daisyUI 를 이용한 svelte blog starter](https://github.com/spences10/sveltekit-mdsvex-starter-blog)

> [Live Preview](https://sveltekit-mdsvex-starter-blog.vercel.app/)

글이 너무 길어졌다. 나중에 하자.


## 9. Review

- React 버전 예제 : [Daisy UI Admin Dashboard Template - DashWind](https://github.com/srobbin01/daisyui-admin-dashboard-template)
  - [CalendarView](https://github.com/srobbin01/daisyui-admin-dashboard-template/blob/master/src/components/CalendarView/index.js) 컴포넌트를 svelte 버전으로 바꾸고 싶다.
    - [Live Preview - Calendar](https://tailwind-dashboard-template-dashwind.vercel.app/app/calendar)

![daisyui-react-calendar](/2023/11/08-daisyui-react-calendar.png){: width="560" .w-75}
_daisyui-react-calendar_

- Tabs 를 기준으로 flowbite 와 skeleton 의 소스를 살펴보았다. 
  - flowbite 는 프로그래밍 요소가 많다.
  - skeleton 은 aria 및 a11y 규격을 신경썼다.

- daisyUI 가 스타일이 제일 깔끔하고 이쁘다. 내 입맛대로 쓸 수 있으면 좋겠다.
  - 가볍고, 단순하게 필요한 만큼만 기능을 정의해서 쓰면 최고
  - 조만간 4.0 이 나온다고 한다. 클래스가 더 깔끔해졌다.



&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
