---
date: 2023-10-08 00:00:00 +0900
title: Svelte Component 라이브러리 - 2일차
description: 원하는 UI 구성을 위해 유틸리티 CSS 라이브러리인 TailwindCSS 와 Flowbite 를 공부합니다. 웹프레임워크로 SveltKit 을 사용하고 bun 런타임 위에서 실행합니다.
categories: [Frontend, Svelte]
tags: ["flowbite","tailwind","ui-components"]
image: "https://raw.githubusercontent.com/themesberg/flowbite-svelte/main/static/images/flowbite-svelte.png"
---

> 목록
{: .prompt-tip }

- [Svelte Component 라이브러리 - 1일차](/posts/svelte-components-tutorial-day1/) : Steeze UI
- [Svelte Component 라이브러리 - 2일차](/posts/svelte-components-tutorial-day2/) : Flowbite Svelte &nbsp; &#10004;
- [Svelte Component 라이브러리 - 3일차](/posts/svelte-components-tutorial-day3/) : Flowbite Blocks

## 0. 개요

- [x] Bun 1.0.7 + SvelteKit 1.20.4
- [x] TailwindCSS 3.3.5
  - flowbite 2.0.0 (flowbite-svelte 0.44.18)
  - flowbite-svelte-blocks 0.5.1

## 1. 프로젝트 생성

### [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
bun create svelte@latest bun-tailwind-app
  # - Skeleton project
  # - Javascript with JSDoc

cd bun-tailwind-app
bun install

bun run dev
```

### [TailwindCSS 설정](https://tailwindcss.com/docs/guides/sveltekit)

1. Install TailwindCSS, tailwind-merge
2. `tailwind.config.js` 에 template paths 추가
3. `app.css` 에 Tailwind directives 추가
4. 최상위 `+layout.svelte` 에 `app.css` import
5. `+page.svelte` 에서 TailwindCSS classes 를 사용해 작동 확인

```bash
bun add -d tailwindcss postcss autoprefixer tailwind-merge
bunx tailwindcss init -p

# default font 설정
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
  plugins: [],
};
EOF

cat <<EOF > src/app.pcss
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');
@import url("//cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-ligature-full.css");

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white dark:bg-gray-800;
  }
}
EOF

cat <<EOF > src/routes/+layout.svelte
<script lang="ts">
  import '../app.pcss';
</script>

<slot />
EOF

cat <<EOF > src/routes/+page.svelte
<h1 class="bg-green-300 hover:bg-red-600 border-green-600 border-b p-4 m-4 rounded text-3xl font-bold">Hello, SvelteKit!</h1>
EOF

bun run dev
```

### [Flowbite Svelte 설정](https://flowbite-svelte.com/docs/pages/quickstart)

- icons, svelte, flowbite 라이브러리 임포트
- 옵션 : 고급 컴포넌트 blocks 임포트

```bash
bun add -d flowbite-svelte-icons flowbite-svelte flowbite
bun add -d flowbite-typography
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
  plugins: [require('flowbite/plugin'), require('flowbite-typography')],
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

![svltk-flowbite-page](/2023/10/08-svltk-flowbite-page.png){: width="540" .w-75}
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

## 2. SvelteKit 에서 [HTML DOM API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API) 로 HTML Element 다루기

### [Bindings](https://joyofcode.xyz/svelte-for-beginners#bindings)

- input Element 의 이벤트 input 과 filterList 함수를 연결
- input Element 의 속성 value 과 searchQuery 변수를 연결
  - 참고 : [Svelte 튜토리얼 - Bindings/Text inputs](https://learn.svelte.dev/tutorial/text-inputs)

```html
<script>
  let list = ['React', 'Vue', 'Svelte'];
  let filteredList = [];
  let searchQuery = '';

  function filterList() {
    filteredList = list.filter((item) => {
      return item.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }
</script>

<input on:input="{filterList}" bind:value="{searchQuery}" type="text" />

<ul>
  {#each filteredList as item}
  <li>{item}</li>
  {/each}
</ul>
```

### HTMLElement 와 bind

`document.querySelector` 의 결과는 `Element` 로 인식된다. 따라서 타입 지정이 필요하다.

- bind 로 svelte 스크립트 변수와 연결하기
  - 변수 root 와 HTMLDivElement 를 연결
  - 변수 value 와 HTMLInputElement 의 value 속성과 연결
- document 는 [browser](https://kit.svelte.dev/docs/modules#$app-environment-browser), [onMount](https://svelte.dev/docs/svelte#onmount) 안에서 접근할 수 있다.
  - browser 상태 여부를 검사하고 foo 클래스 선택자를 HTMLSpanElement 타입 지정
  - onMount 내에서 forminput 클래스 선택자를 type guard 코드와 함께 사용

```html
<script>
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  /** @type {boolean} */
  let error = false;

  /** @type {import('flowbite-svelte').BlockQuoteType} */
  export let size = 'lg';

  /** @type {HTMLDivElement} */
  let root;
  let value = '1234';

  // browser 상태일 때, document 접근 가능
  if (browser) {
    // spanEl 를 HTMLInputElement 타입이라 선언 (괄호 감싸기)
    const spanEle = /** @type {HTMLSpanElement} */ (
      document.querySelector('.foo') // Element | null
    );
    console.log(spanEle.innerText); // TEST
  }

  // onMount 라이프사이클에서도 document 접근 가능
  onMount(() => {
    // value 사용을 위해 type guard 와 null 확인이 필요하다
    const ele = document.querySelector('.forminput');
    if (ele !== null && ele instanceof HTMLInputElement) {
      console.log('element.value =', ele.value);
      ele.value = 'ABCDEFG'; // 값 변경
    }
  });
</script>

<p>This is a <span class="foo">TEST</span> sentence.</p>
<div bind:this="{root}">
  <input type="text" bind:value class="forminput" />
</div>
```

> 타입스크립트에서 HTMLInputElement 타입 지정 예시

상대적으로 매우 간단해 보인다. 그러나 불필요한 경우도 많다. (갈팡질팡)

```ts
const user: string =
  document.querySelector<HTMLInputElement>('input[name="user"]').value;

// 또는
let str: string = (<HTMLInputElement>document.getElementById('myUnit')).value;
```

#### [JSDoc을 사용하여 자바스크립트에 타입 힌트 제공하기](https://poiemaweb.com/jsdoc-type-hint)

> 참고문서

- [JS Projects Utilizing TypeScript](https://www.typescriptlang.org/docs/handbook/intro-to-js-ts.html)
- [JSDoc Reference](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)

```js
// @ts-check

/** @type {number} */
let num;

/**
 * 두 수의 합을 구한다.
 * @type { (a: number, b: number) => number }
 */
const add = (a, b) => a + b;

/**
 * @param {string}  p1 - A string param.
 * @param {string=} [p2] - An optional param (Closure syntax)
 * @return {string} This is the result
 */
function stringsStringStrings(p1, p2) {
  // TODO
}

/**
 * Object 타입 정의
 * @typedef {Object} Todo
 * @property {number} id - 할일 id
 * @property {string} content - 할일 내용
 * @property {boolean} completed - 할일 완료 여부
 */

/**
 * 정의된 타입 사용
 * @type {Todo[]}
 */
const todos = [
  { id: 1, content: 'HTML', completed: false },
  { id: 2, content: 'CSS', completed: true },
  { id: 3, content: 'Javascript', completed: false },
];

/**
 * @typedef { (data: string, index?: number) => boolean } Predicate1
 */

/** @type {Predicate1} */
const ok = (s) => !(s.length % 2);

// $input5를 HTMLInputElement 타입으로 타입 단언한다.
const $input5 = document.querySelector('.foo');
/** @type {HTMLInputElement} */ ($input5).value = 'hello';
```

### [svelte:element](https://svelte.dev/tutorial/svelte-element) 로 Element 변경

- 조건에 따라 링크(A) 또는 버튼(Button)으로 element 를 생성
  - svelte 의 `if 블록`을 이용해 다른 html 블록을 출력하는 것과 같다
  - 참고: [stackoverflow - svelte:component with DOM elements](https://stackoverflow.com/a/67274539/6811653)

```html
<script>
  export let href = '';

  let tag = href ? 'a' : 'button';
</script>

<svelte:element this="{tag}" {href}>
  <slot></slot>
</svelte:element>
```

#### [window 에 대한 bindings](https://svelte.dev/docs/special-elements#svelte-window) : Event, innerWidth(Height), scrollX(Y), ... 등

```html
<script>
  /** @param {KeyboardEvent} event */
  function handleKeydown(event) {
    alert(`pressed the ${event.key} key`);
  }
</script>

<svelte:window on:keydown="{handleKeydown}" />
```

#### [Element 를 this 로 binding](https://svelte.dev/docs/element-directives#bind-this)

```html
<script>
  import { onMount } from 'svelte';

  /** @type {HTMLCanvasElement} */
  let canvasElement;

  onMount(() => {
    const ctx = canvasElement.getContext('2d');
    drawStuff(ctx);
  });
</script>

<canvas bind:this="{canvasElement}" />
```

### [element 의 action 을 직접 만들기](https://svelte.dev/docs/element-directives)

#### [beomy 블로그 - Svelte 액션](https://beomy.github.io/tech/svelte/action/#svelte-%EC%98%88%EC%A0%9C)

- `pannable.js` 에서 action 함수를 정의
  - 사용자 정의 이벤트 : panstart, panmove, panend
- `App.svelte` 에서 div 의 action 에 pannable 함수를 바인딩하고 이벤트도 바인딩
  - `on:panstart={handlePanStart}`
  - `on:panmove={handlePanMove}`
  - `on:panend={handlePanEnd}`

```js
// pannable.js
export function pannable(node) {
  let x;
  let y;

  function handleMousedown(event) {
    // ...
    node.dispatchEvent(
      new CustomEvent('panstart', {
        detail: { x, y },
      })
    );
    window.addEventListener('mousemove', handleMousemove);
    window.addEventListener('mouseup', handleMouseup);
  }

  function handleMousemove(event) {
    // ...
    node.dispatchEvent(
      new CustomEvent('panmove', {
        detail: { x, y, dx, dy },
      })
    );
  }

  function handleMouseup(event) {
    // ...
    node.dispatchEvent(
      new CustomEvent('panend', {
        detail: { x, y },
      })
    );
    window.removeEventListener('mousemove', handleMousemove);
    window.removeEventListener('mouseup', handleMouseup);
  }

  node.addEventListener('mousedown', handleMousedown);

  return {
    destroy() {
      node.removeEventListener('mousedown', handleMousedown);
    },
  };
}
```

```html
<!-- App.svelte -->
<script>
  import { pannable } from './pannable.js';

  const coords = { x: 0, y: 0 };

  function handlePanStart() {}

  function handlePanMove(event) {
    coords.x += event.detail.dx;
    coords.y += event.detail.dy;
  }

  function handlePanEnd(event) {
    coords.x = 0;
    coords.y = 0;
  }
</script>

<div
  class="box"
  use:pannable
  on:panstart="{handlePanStart}"
  on:panmove="{handlePanMove}"
  on:panend="{handlePanEnd}"
></div>
```

#### [Introduction to Svelte Actions](https://blog.logrocket.com/svelte-actions-introduction/)

[binding 관련 기본 예제](https://svelte.dev/repl/8808de159c4a410693122074b83fe0e4?version=3.43.2)

- `bind:this` : DOM element 를 직접 binding
- `bind:value` : 다른 컴포넌트에서 value 를 제어하도록 export
- `use:{action}={params}` : 함수를 정의하고, 함수 내에서 파라미터로 받은 element 를 제어
  - 타입 : `import('svelte/action').Action`

`use:action` 에서 tooltip 라이브러리를 연결하는 예제

```html
<script>
  function tooltip(node, params = { content: 'Hello!' }) {
    let tip = tippy(node, params);
  }
</script>

<button use:tooltip={_{
    content: 'New message'
}_}>
    Hover me
</button>
```

- 이전 예제의 문제점 2가지 (아래에 개선된 코드)
  - 실행 이후 매개변수를 업데이트할 방법이 없고 : update 이용
  - 요소가 제거될 때 tippy 를 파괴하지 않았다 : destroy 이용

```html
<script>
  import tippy from 'tippy.js';

  function tooltip(node, params) {
    let tip = tippy(node, params);
    return {
      update: (newParams) => {
        tip.setProps(newParams);
      },
      destroy: () => {
        tip.destroy();
      }
    }
  }

  let selectedPlacement = 'top';
  let message = "I'm a tooltip!";
</script>

<button use:tooltip={_{
    content: message,
    placement: selectedPlacement
}_}>
    Hover me
</button>
```

`use:action` 대신에 `onMount`, `$`, `onDestroy` 를 이용하는 방법

```html
<script>
  import tippy from 'tippy.js';
  import { onMount, onDestroy } from 'svelte';

  let button; // 버튼 element
  let tip; // tooptip 객체

  // 컴포넌트 생성시
  onMount(() => {
    tip = tippy(button, { content: message, placement: selectedPlacement });
  });

  // tip 변경시
  $: if (tip) {
    tip.setProps({ content: message, placement: selectedPlacement });
  }

  // 컴포넌트 소멸시
  onDestroy(() => {
    tip.destroy();
  });

  let selectedPlacement = 'top';
  let message = "I'm a tooltip!";
</script>

<button bind:this="{button}">Hover me</button>
```

## 3. [Flowbite Blocks in Svelte](https://flowbite-svelte-blocks.vercel.app/)

> 사전 설정

- 라이브러리 `flowbite-svelte-blocks` 설치되어 있고 (icons, svelte 등도 포함)
- `tailwind.config.js` 의 content 에 `flowbite-svelte-blocks` 경로가 포함되어 한다.

### [Advanced 테이블 컴포넌트](https://flowbite-svelte-blocks.vercel.app/application/advanced-tables)

> 화면 캡쳐

![svltk-flowbite-table](/2023/10/08-svltk-flowbite-table.png){: width="600" .w-75}
_고급 테이블 예제 캡쳐_

#### 태그 설명

- Section : 테이블 wrapper (안하면 전체 페이지를 차지하게 됨)
- TableSearch : 테이블 내용 필터링
  - TableHead, TableBody 등 Table 관련 컴포넌트 전체를 감싼다
- header : 동작은 안하지만 이런 기능들을 넣을 수 있다는 예시를 제공
  - Button : Add product
  - Button : Actions (Dropdown)
  - Button : Filter (Dropdown)
- TableHead : 컬럼 리스트 영역
  - TableHeadCell : 컬럼 타이틀
- TableBody : 데이터 영역
  - TableBodyRow : 레코드 영역; `each .. as ..` 구문으로 반복
    - TableBodyCell : 데이터 출력 영역
  - 필터링 키워드 `searchTerm` 여부에 따라 filteredItems 또는 currentPageItems 사용
- div : 테이블 Tail 영역 (따로 컴포넌트는 없는듯)
  - span : 페이지 범위 출력 (start, end, total)
  - ButtonGroup : 페이지 선택 버튼 그룹
    - Button : 첫 페이지 이동 버튼, loadPreviousPage
    - Button : 개별 페이지 이동 버튼 (보여질 버튼 최대 개수); goToPage
    - Button : 마지막 페이지 이동 버튼, loadNextPage

#### 스크립트(함수) 설명

- updateDataAndPagination : array 데이터를 크기만큼 slice 하고, renderPagination 호출
- loadNextPage : 현재 위치를 itemsPerPage 만큼 더하고 updateDataAndPagination 호출
- loadPreviousPage : 현재 위치를 itemsPerPage 만큼 빼고 updateDataAndPagination 호출
- renderPagination : 현재 페이지의 상태 변수와 페이지 번호 배열을 생성
  - totalPages : 데이터 array 전체 길이를 itemsPerPage 로 나눈다
  - currentPage : 현재 위치를 itemsPerPage 로 나눈다
  - pagesToShow : startPage, endPage 사이의 페이지 번호 배열을 생성
- goToPage : 해당 페이지로 첫번째로 번호 이동 후 updateDataAndPagination 호출
- onMount : updateDataAndPagination 호출
- 리액티브(`$`) 설정
  - currentPosition 변경시, startRange 와 endRange 변경
  - paginationData 변경시, currentPageItems 와 filteredItems 변경

> 참고 : Array.from 으로 정수 배열 생성하는 법

```js
// 길이 length 의 array 생성 후, 함수로 값 생성 (undefined 는 0)
console.log(Array.from({ length: 5 }, (_, i) => 1 + i));
// => [1,2,3,4,5]

// 똑같다
const intArr = Array.from(new Int32Array(5)).map((_, i) => 1 + i);
```

### 그 외 컴포넌트들 소개

너무 많아서, 이번 글에서는 테이블만 작성하고 다음 글에서 이어가기로 하자.

#### [Application UI 그룹](https://flowbite-svelte-blocks.vercel.app/application)

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


## 9. Review

- Svelte 자체와 Javascript 기초가 부족하니깐 진도가 안나가고 자꾸 걸린다.
- 원하는 대로 UI 를 뽑아낼 수 있는 날이 올 때까지, 계속 하자!

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
