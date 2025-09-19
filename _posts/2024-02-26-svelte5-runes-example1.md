---
date: 2024-02-26 00:00:00 +0900
title: Svelte 5 Runes - Todo App
description: Svelte 5 기능을 연습하기 위해 Todo 앱 만들기를 연습합니다. JoyOfCode 유튜버의 코드를 참고하여 DaisyUI 컴포넌트로 작성합니다.
categories: [Frontend, Svelte]
tags: [todo-app, daisyui]
image: "https://i.ytimg.com/vi/uOI77E8Y95Q/sddefault.jpg"
---

> 목록
{: .prompt-tip }

- [Svelte 5 Runes](/posts/svelte5-runes-tutorial/) : features
- [Svelte 5 Runes - Todo App](/posts/svelte5-runes-example1/) &nbsp; &#10004;
- [Svelte 5 Runes - Supabase Auth](/posts/svelte5-runes-example2/)


## 0. 개요

처음 생각은 shadcn-svelte 를 이용하려 했는데, melt-ui 가 svelte 4 기반이라 안맞을거 같아서 순수 tailwind 컴포넌트인 daisyui 로 변경합니다.

- 프레임워크 : bun + svelte 5 preview
- 컴포넌트 : tailwind + daisyui + lucide(icons)
- 유틸리티
  - theme-change : light/dark 테마 변경
  - svelte-persisted-store : localStorage 읽기/쓰기
  - [svelte-remixicon](https://remixicon.com/) : 리믹스 아이콘 (MIT 라이센스)
    - lucide 아이콘은 1444개로 line 스타일만 있는데, remix 아이콘은 2850개 (filled 스타일 포함)

## 1. 프로젝트 생성

> home 화면 캡쳐

![](/2024/02/26-svelte5-daisyui-home.png){: width="560" .w-75}
_svelte5-daisyui-home_

### [Svelte 5 runes](https://kit.svelte.dev/) 프로젝트 생성

```bash
bun create svelte@latest svlt5-todo-app
  # - Skeleton project
  # - Typescript
  # - Prettier, Svelte5 preview

cd svlt5-todo-app
bun install

# bun runtime
bunx --bun vite dev
```

### [TailwindCSS 설정](https://tailwindcss.com/docs/installation/using-postcss)

- tailwind 설정의 theme.extend 는 기본값에 추가한다는 의미이다.
  - 주의 : color 를 직접 추가하지 말자. 안된다. 변수를 바로 사용해야 작동한다.
- tailwind 컨테이너 container 를 theme 파라미터로 재정의 했다.
- 기존 스크린 외에 모바일, 태블릿, 데스크탑 스크린을 추가했다.

```bash
# tailwind, plugins 설치
bun add -d tailwindcss postcss autoprefixer @tailwindcss/typography
bun add -d vite-plugin-tailwind-purgecss prettier-plugin-tailwindcss 

bunx tailwindcss init -p

# daisyui 설치
bun add -d daisyui@latest

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

# CSS 최적화를 위한 purgecss 설정은 배포단계에서 해제할것
cat <<EOF > vite.config.ts
// import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    // purgeCss({ safelist: {greedy: [/^hljs-/] }}),
  ]
});
EOF

# font & screen & 변수 추가, daisyUI 설정
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
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    container: {
      center: true, // mx-auto
      padding: {
        DEFAULT: '1rem', // px-4
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
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
  scroll-behavior: smooth; /* 부드러운 스크롤 */
  font-family: font-sans;
  /* font-size: clamp(1rem, 2.2vh, 1.5rem); */
}
EOF
```

### home 페이지 작성

```bash
# plugins, icons, faker 설치
bun add -d @faker-js/faker svelte-remixicon
bun add tailwind-variants clsx tailwind-merge

# utils (옵션)
# bun add nanoid svelte-persisted-store 

mkdir src/lib/utils

# A simple indicator to show current breakpoint
cat <<EOF > src/lib/utils/tw-indicator.svelte
<script lang="ts">
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
 * @param {string} hex
 * @returns {[number, number, number]}
 */
export function hexToHsl(hex) {
  if (!hex) [0, 0, 0];

  const sanitizedHex = hex.replace('#', '');

  const red = Number.parseInt(sanitizedHex.substring(0, 2), 16);
  const green = Number.parseInt(sanitizedHex.substring(2, 4), 16);
  const blue = Number.parseInt(sanitizedHex.substring(4, 6), 16);

  const normalizedRed = red / 255;
  const normalizedGreen = green / 255;
  const normalizedBlue = blue / 255;

  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue);
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue);

  let hue, saturation, lightness;

  if (max === min) {
    hue = 0;
  } else if (max === normalizedRed) {
    hue = ((normalizedGreen - normalizedBlue) / (max - min)) % 6;
  } else if (max === normalizedGreen) {
    hue = (normalizedBlue - normalizedRed) / (max - min) + 2;
  } else {
    hue = (normalizedRed - normalizedGreen) / (max - min) + 4;
  }

  hue = Math.round(hue * 60);
  if (hue < 0) {
    hue += 360;
  }

  lightness = (max + min) / 2;

  if (max === min) {
    saturation = 0;
  } else if (lightness <= 0.5) {
    saturation = (max - min) / (max + min);
  } else {
    saturation = (max - min) / (2 - max - min);
  }

  saturation = Math.round(saturation * 100);
  lightness = Math.round(lightness * 100);

  return [hue, saturation, lightness];
}

/**
 * @param {string} hex
 * @returns {[number, number, number]}
 */
export function hexToRgb(hex) {
  if (!hex) [0, 0, 0];

  const sanitizedHex = hex.replace('#', '');

  const red = Number.parseInt(sanitizedHex.substring(0, 2), 16);
  const green = Number.parseInt(sanitizedHex.substring(2, 4), 16);
  const blue = Number.parseInt(sanitizedHex.substring(4, 6), 16);

  return [red, green, blue];
}

/**
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

# 기존 첫페이지를 지우고 '(home)' 아래에 생성
rm "src/routes/+page.svelte"
mkdir "src/routes/(home)"

# daisyUI 확인용 demo 페이지 (theme 변경 스위치 포함)
cat <<EOF > "src/routes/(home)/+page.svelte"
<script>
  import { RiSunLine, RiMoonLine } from 'svelte-remixicon';
  import { onMount } from 'svelte';
  import { toggleTheme } from '\$lib/utils/tw-util.js';

  let isDark = \$state(true);  // html[data-theme="dark"]
  onMount(()=>{
    isDark = localStorage.getItem('theme') === 'dark';
  });
  \$effect(() => {
    toggleTheme(isDark);  // default themes : light/dark
  });
</script>

<div class="hero min-h-screen bg-background">
  <div class="hero-content">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">안녕, daisyUI</h1>
      <p class="py-6 font-mono text-foreground">구성 : TailwindCSS + SvelteKit + Bun</p>
      <label class="flex cursor-pointer gap-2">
        <RiSunLine size="20px"></RiSunLine>
        <input type="checkbox" bind:checked={isDark} class="toggle" />
        <RiMoonLine size="20px"></RiMoonLine>
      </label>
    </div>
  </div>
</div>
EOF
```


## 2. Svelte5 Todos Example

> 참고자료

- [JoyOfCode - Let's Make A Todo App Using Svelte 5 Runes](https://www.youtube.com/watch?v=uOI77E8Y95Q)


### 레이아웃 및 컨트롤

- 필터 radio 버튼 : all, done=false, done=true
  - 완료 안된 todo 개수 출력
- 새로운 todo 입력필드
  - keyEvent 로 Enter 확인후 todo 추가
- 생성된 todos 리스트
  - 새로운 todo 에 대해 indicator 출력
  - todo 텍스트 입력필드
    - 입력필드 작성시 todo 텍스트 변경
  - todo 완료 여부 체크박스 
    - 완료시 텍스트 입력필드의 border 색상 추가, opacity 적용

```svelte
<!-- src/routes/todos/+page.svelte -->
<script lang="ts">
  type Todo = {
    text: string;
    done: boolean;
    isnew?: boolean;
  };
  type Filters = 'all' | 'active' | 'completed';

  let todos = $state<Todo[]>([
    { text: 'Todo 1', done: false, isnew: false },
    { text: 'Todo 2', done: false, isnew: false },    
  ]);
</script>


<div id="container" class="flex min-h-screen flex-col place-content-center items-center gap-6">
  <div class="form-control">
    <div class="filters join join-horizontal">
      {#each ['all', 'active', 'completed'] as selector}
        <input
          type="radio"
          name="filters"
          checked={filter === selector}
          onclick={setFilter}
          class="btn join-item min-w-[4.5rem]"
          aria-label={selector}
        />
      {/each}
    </div>
    <div class="label">
      <span class="label-text-alt text-sm">{remaining()} remaining</span>
    </div>
  </div>

  <div class="text-center">
    <input
      onkeydown={addTodo}
      type="text"
      tabindex="0"
      placeholder="Add todo"
      class="input input-bordered w-[262px]"
    />
  </div>
  <div id="content" class="grid gap-4">
    {#each filteredTodos as todo, i}
      <div class="indicator">
        {#if todo.isnew}
          <span class="badge indicator-item badge-secondary indicator-start">new</span>
        {/if}
        <div class="todo opacity-100 transition-opacity duration-1000 ease-out">
          <input
            oninput={editTodo}
            data-index={i}
            type="text"
            name="text"
            readonly={todo.done}
            value={todo.text}
            class="input w-full max-w-xs"
            class:completed={todo.done}
          />
          <label class="label cursor-pointer">
            <input
              onchange={toggleTodo}
              data-index={i}
              type="checkbox"
              name="done"
              checked={todo.done}
              class="checkbox"
            />
          </label>
        </div>
      </div>
    {/each}
  </div>
</div>

<style lang="postcss">
  .completed {
    @apply input-bordered input-accent opacity-50;
  }
  .todo {
    @apply relative flex gap-2;
  }
</style>
```

### todos 데이터 로직

- 반응형 변수 : todos, filter
- 파생 변수 : filteredTodos (출력되는 todos)
  - setFilter : 반응형 변수 filter 를 변경 (파생 변수도 영향을 받아 변경된다)
  - remaining(잔여 개수)도 파생변수나 마찬가지이지만, 함수로 처리했다.
- todo 데이터 처리
  - addTodo : onkeydown 이벤트와 연결
  - editTodo : oninput 이벤트와 연결
  - toggleTodo : onchange 이벤트와 연결

> 특이사항

- event.target 으로 HTMLElement 를 바로 접근
  - value 는 물론이고, dataset(data-속성), aria 속성까지 접근
- onkeydown, oninput 등의 event 속성에 함수를 바로 연결할 수 있다.  
  - 예전에는 on 지시자를 사용했다

```svelte
<script lang="ts">
  import type { Todo, Filters } from '$lib/stores/todos';
  import { todos as todosStorage } from '$lib/stores/todos';
  import { get } from 'svelte/store';

  let todos = $state<Todo[]>([]);
  let filter = $state<Filters>('all');
  let filteredTodos = $derived(filterTodos());

  $effect(() => {
    todos = get(todosStorage);
    console.log(todos);

    return () => {
      todosStorage.set(todos);
      console.log('saved todos to localStorage');
    };
  });

  function filterTodos() {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.done);
      case 'completed':
        return todos.filter((todo) => todo.done);
      default: // all
        return todos;
    }
  }

  function addTodo(event: KeyboardEvent) {
    if (event.key != 'Enter') return;

    const todoEl = event.target as HTMLInputElement;
    const text = todoEl.value;
    todos = [
      ...todos.map((todo) => {
        return { ...todo, isnew: false }; // update rest todos
      }),
      { text, done: false, isnew: true }, // new todo
    ];
    todoEl.value = '';
  }

  function editTodo(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const index = Number(inputEl.dataset.index);
    console.log(todos[index].text);
    todos[index].text = inputEl.value;
  }

  function toggleTodo(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    const index = Number(inputEl.dataset.index);
    todos[index].done = !todos[index].done;
  }

  function setFilter(event: Event) {
    const inputEl = event.target as HTMLInputElement;
    filter = inputEl.ariaLabel as Filters;
  }

  function remaining() {
    return todos.filter((todo) => !todo.done).length;
  }
</script>
```

### todos 로컬 저장

- `svelte-persisted-store` 에서 JSON 처리 후 writable 개체를 반환
- writable 에서 `$state` 변수로 바로 넣는 방법은 없는거 같다. (get 사용)
- todosStorage 를 onMount 시점에서 읽고, onDestroy 시점에서 저장했다. 

> localStroage 초기화

콘솔창에서 `localStorage.clear()` 실행, 또는 `localStorage.removeItem(key)`

```svelte
<script lang="ts">
  import type { Todo, Filters } from '$lib/stores/todos';
  import { todos as todosStorage } from '$lib/stores/todos';
  import { get } from 'svelte/store';

  let todos = $state<Todo[]>([]);
  let filter = $state<Filters>('all');
  let filteredTodos = $derived(filterTodos());

  // onMount 콜백
  $effect(() => {
    todos = get(todosStorage);  // todos 읽어오기
    console.log(todos);

    // onDestroy 콜백 
    return () => {  
      todosStorage.set(todos);  // todos 저장
      console.log('saved todos to localStorage');
    };
  });
</script>
```

```ts
// $lib/stores/todos.ts
import { persisted } from 'svelte-persisted-store';

export type Todo = {
  text: string;
  done: boolean;
  readonly?: boolean;
  isnew?: boolean;
};
export type Filters = 'all' | 'active' | 'completed';

// 없으면 초기 데이터 반환
export const todos = persisted<Todo[]>('todos', [
  { text: 'Todo 1', done: false, isnew: false },
  { text: 'Todo 2', done: false, isnew: false },
]);
```

### 화면 캡쳐

> 초기 로딩 (all 출력)

![](/2024/02/26-svelte5-todos-all.png){: width="320" .w-75}
_svelte5-todos-all_

> completed 필터 출력

![](/2024/02/26-svelte5-todos-completed.png){: width="320" .w-75}
_svelte5-todos-completed_


## 9. Review

- svelte 4 에 비해 편하고 직관적이라 이해하기 쉽다.
  - javascript 바닐라 문법에 좀 더 다가간 느낌이다. 이질감은 적다.
- daisyUI 에 변수도 추가해 보고, 컴포넌트도 사용해 보았다. (일보 전진)
  - 익숙해지면 사용해 볼 만한데, 프론트엔드 디자인은 여전히 두렵다.
- 처음에 body 상단이 1rem 만큼 내려 앉아서 스크롤이 생겼다. 그래서 당황했다.
  - 마이너스 mt-4 도 소용없어서, hero 클래스를 넣어보니 되었고 이후 flex 로 바꿨다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
