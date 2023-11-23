---
date: 2023-11-14 00:00:00 +0900
title: React 를 Svelte 로 변환하기 - 1일차
categories: ["frontend","svelte"]
tags: ["react","tailwindcss","ui-components","1st-day"]
image: "https://dev-to-uploads.s3.amazonaws.com/uploads/articles/v7e3wmv98ql24smnwhe0.png"
---

> 흔히 찾을 수 있는 react 기반 프로젝트들을 svelte 로 바꿔서 작성하는 연습을 합니다. 클론 코딩을 통해 svelte 개발 능력을 높이고자 합니다.
{: .prompt-tip }

- [React 를 Svelte 로 변환하기 - 1일차](/posts/2023-11-14-rewrite-react-to-svelte-day1/) : 자료 정리 &nbsp; &#10004;

## 0. 개요

- [x] Bun 1.0.11 + SvelteKit 1.20.4
- [x] TailwindCSS 3.3.5
  - daisyUI 3.9.4
  - theme-change
- [x] Etc
  - heroicons
  - purgecss

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

### [TailwindCSS 및 daisyUI 설정](/posts/2023-11-08-svelte-components-tutorial-day4/#tailwindcss-및-daisyui-설정) 

> 코드는 이전에 작성한 포스트 참조

1. TailwindCSS, tailwind-merge 설치
2. 한글 폰트, daisyUI 라이브러리 설치
3. `tailwind.config.js` 에 daisyUI 설정 추가
4. `app.postcss` 에 Tailwind directives 추가
5. 최상위 `+layout.svelte` 에 전역 css 추가 
6. `+page.svelte` 에 데모 코드를 넣어 daisyUI 작동 확인


## 2. React 를 Svelte 로 바꾸는 방법

### 참고1: [JoyOfCode - Svelte Guide For React Developers](https://joyofcode.xyz/svelte-for-react-developers)

#### HTML 과 style 을 분리한다.

- style 은 style 블록으로 분리하여 보내고
- 순수한 HTML 이 남도록 표준 tag 로 변경
  - className 은 class 로 변경
  - HtmlFor 등은 for 로 변경

#### `useState(초기값)` 는 script 블록의 let 변수로 옮겨 적는다.

- 외부 props 와 연결된 변수에는 export 를 붙여 노출한다.
- 이벤트와 연결된 update 는 일반 function 으로 만들고
- 연쇄적인 [reactive](https://kit.svelte.dev/docs/state-management#component-state-is-preserved) 가 필요한 경우 `$:` 블럭으로 추가 기술한다.

> original : **React**

```jsx
import { useState } from 'react'

export function Counter(props) {
  const [count, setCount] = useState(props.count ?? 0)

  return (
    <>
      <p style={_{ fontWeight: 700 }_}>{count}</p>
      <button onClick={() => setCount(count + 1)}>
        Click
      </button>
    </>
  )
}
```

> revision : **Svelte**

```html
<!-- CounterWithProps.svelte -->
<script>
  export let count = 0
</script>

<p>{count}</p>
<button on:click={() => (count += 1)}>Click</button>

<style lang="scss">
  p {
    font-weight: 700;
  }
</style>

<!-- 
  // 사용 예시
  <CounterWithProps count={10} /> // count is 10
  <CounterWithProps />  // count is 0
-->  
```

#### 전달되는 child 컴포넌트는 `slot` 으로 처리

- 스타일 변수는 `style:{css변수}={값}` 를 통해 전달

> original : **React**

```jsx
import { useState } from 'react'

export function Grid({ children, columns }) {
  return (
    <div
      style={_{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`
      }_}
    >
      {children}
    </div>
  )
}

/**
  // 사용 예시
  <Grid columns={4}>
    <div>Column 1</div>
    <div>Column 2</div>
    <div>Column 3</div>
    <div>Column 4</div>
  </Grid>
 **/
```

> revision : **Svelte**

```html
<script>
  export let columns
</script>

<div class="grid" style:--columns={columns}>
  <slot />
</div>

<style>
  .grid {
    --columns: 0;

    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
  }
</style>
```

#### `Array.map` 로직은 `{#each}..{/each}` 블록으로 변환

- `key` 는 each 블록의 괄호로 처리 (별도의 `{#key}..{/key}` 도 있긴함)
- 조건부 class 또는 style 은 `class:{조건}` 을 이용

```jsx
const todos = [
  { id: 1, text: 'Todo 1', completed: true },
  { id: 2, text: 'Todo 2', completed: false },
  { id: 3, text: 'Todo 3', completed: false },
  { id: 4, text: 'Todo 4', completed: false }
]

export function Todos() {
  return (
    <ul>
      {todos.map((todo) => (
        <li
          key={todo.id}
          style={_{
            textDecoration: todo.completed
              ? 'line-through'
              : ''
          }_}
        >
          {todo.completed ? `${todo.text} 🎉` : todo.text}
        </li>
      ))}
    </ul>
  )
}
```

> revision : **Svelte**

```html
<script>
  const todos = [
    { id: 1, text: 'Todo 1', completed: true },
    { id: 2, text: 'Todo 2', completed: false },
    { id: 3, text: 'Todo 3', completed: false },
    { id: 4, text: 'Todo 4', completed: false }
  ]
</script>

<ul>
  {#each todos as todo (todo.id)}
    <li class:completed={todo.completed}>
      {todo.completed ? `${todo.text} 🎉` : todo.text}
    </li>
  {/each}
</ul>

<style>
  .completed {
    text-decoration: line-through;
  }
</style>
```

#### [이벤트는 함수로 만들어 연결하거나 직접 binding](https://joyofcode.xyz/svelte-for-react-developers#handling-events)

- 단순한 값 저장의 경우는 `bind:{속성}={변수}` 를 이용
- 이벤트 연결은 `on:{이벤트}={함수}` 형태로 처리

#### [동작 연결 및 동기화](https://joyofcode.xyz/svelte-for-react-developers#synchronization)

- `$:` 은 상태를 추적하는 `useEffect` 를 의미한다. (대부분 커버 가능)
- `useEffect` (연결 동작)는 script 영역의 적절한 함수로 옮겨 적는다.
  - handleClick 에서 직접 pause 또는 play 를 수행하도록 수정

```jsx
import { useEffect, useRef, useState } from 'react'
import ein from '../assets/video.mp4'

export function Player() {
  const [status, setStatus] = useState('paused')
  const videoEl = useRef(null)

  useEffect(() => {
    status === 'paused' ? pause() : play()
  }, [status])

  function play() {
    videoEl.current?.play()
  }

  function pause() {
    videoEl.current?.pause()
  }

  function handleClick() {
    setStatus(status === 'paused' ? 'playing' : 'paused')
  }

  return (
    <>
      <video ref={videoEl} src={ein} loop />

      <button onClick={handleClick}>
        {status === 'paused' ? 'Play' : 'Pause'}
      </button>
    </>
  )
}
```

> revision : **Svelte**

```html
<script>
  import ein from '../assets/video.mp4'

  let videoEl = null
  let status = 'paused'

  function play() {
    videoEl.play()
    status = 'playing'
  }

  function pause() {
    videoEl.pause()
    status = 'paused'
  }

  function handleClick() {
    status === 'paused' ? play() : pause()
  }
</script>

<video bind:this={videoEl} src={ein} loop />

<button on:click={handleClick}>
  {status === 'paused' ? 'Play' : 'Pause'}
</button>
```

> 연쇄/파생 상태 (Derived State)는 `$:` reactive 블록으로 변환

#### 부모의 context 를 자식들이 공유하는 형태는 context + writable 이용

- 부모 컴포넌트가 items, addItem, removeItem 컨텍스트를 공유
  - React 에서는 `Context.Provider`, Svelte 에서는 `setContext`
- 자식 컴포넌트가 context 를 받아 사용
  - React 에서는 `useContext`, Svelte 에서는 `getContext`

> original : **React**

```tsx
///////////////////////////////
// context.ts
///////////////////////////////
import { createContext } from 'react'

export const ListContext = createContext(null)


///////////////////////////////
// List.tsx
///////////////////////////////
import { useState } from 'react'
import { ListContext } from './context'

export function List({ children, listItems }) {
  const [items, setListItems] = useState(listItems)

  function addItem() {
    setListItems((items) => [...items, items.length + 1])
  }

  function removeItem() {
    setListItems((items) =>
      items.slice(0, items.length - 1)
    )
  }

  return (
    <ListContext.Provider
      value={_{ items, addItem, removeItem }_}
    >
      <ul>{children}</ul>
    </ListContext.Provider>
  )
}
```

```tsx
///////////////////////////////
// items.tsx
///////////////////////////////
import { useContext } from 'react'
import { ListContext } from './context'

export function Items() {
  const { items } = useContext(ListContext)

  return (
    <>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </>
  )
}

///////////////////////////////
// AddItem.tsx
///////////////////////////////
import { useContext } from 'react'
import { ListContext } from './context'

export function AddItem() {
  const { addItem } = useContext(ListContext)

  return <button onClick={addItem}>Add</button>
}

///////////////////////////////
// RemoveItem.tsx
///////////////////////////////
import { useContext } from 'react'
import { ListContext } from './context'

export function RemoveItem() {
  const { removeItem } = useContext(ListContext)

  return <button onClick={removeItem}>Remove</button>
}
```

> revision : **Svelte**

```html
<!-- List.svelte -->
<script>
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'
  export let listItems = []

  const items = writable(listItems)

  setContext('items', items)
  setContext('addItem', addItem)
  setContext('removeItem', removeItem)

  function addItem() {
    $items = [...$items, $items.length + 1]
  }

  function removeItem() {
    $items = $items.slice(0, $items.length - 1)
  }
</script>

<ul>
  <slot />
</ul>
```

```html
<!-- items.svelte -->
<script>
  import { getContext } from 'svelte'

  const items = getContext('items')
</script>

{#each $items as item}
  <li>{item}</li>
{/each}

<!-- AddItem.svelte -->
<script lang="ts">
  import { getContext } from 'svelte'

  const addItem = getContext('addItem')
</script>

<button on:click={addItem}>Add</button>

<!-- RemoveItem.svelte -->
<script>
  import { getContext } from 'svelte'

  const removeItem = getContext('removeItem')
</script>

<button on:click={removeItem}>Remove</button>
```

> [Global State Management](https://joyofcode.xyz/svelte-for-react-developers#global-state-management) 도 context + writable 을 사용하면 된다.

#### [Animations](https://joyofcode.xyz/svelte-for-react-developers#animations) 은 svelte 의 animate 와 transition 로 처리

- 애니메이션의 타겟 tag에 옵션을 직접 설정하면 된다.

### 참고2: [Rewrite app from React to Svelte, what you can expect](https://dbgate.org/development/2021/04/08/react-to-svelte.html)

1. CSS 분리 : 코드에 엮인 부분을 style 블록으로 이동
2. useEffect 코드를 onMount 와 onDestroy 로 분리하여 이동

> original : **React**

```jsx
// 단순 사용
React.useEffect(() => {
  console.log('MOUNT');  // onMount
  return () => console.log('UNMOUNT');  // onDestroy
}, []);

// reactive 문장 : height 변경시 파생 실행
React.useEffect(() => {
  console.log('HEIGHT changed, new value:', height);
}, [height]);

React.useEffect(() => {
  console.log(state1, state2, state3, state4, state5);
}, [state1, state2, state3, state4, state5]);
```

> revision : **Svelte**

- 관찰 대상이 여러개일 경우(Lots Of Deps), 함수를 만들어 일괄 처리한다.

```html
<script>
  onMount(() => {
    console.log('MOUNT');
    return () => console.log('UNMOUNT 1');
  });
  onDestroy(() => {
    console.log('UNMOUNT 2');
  });  

  $: console.log('HEIGHT changed, new value:', height); 

  function doSomethingBigWithLotsOfDeps(state1, state2, state3, state4, state5) {
    /* Do epic shit! */
  }
  
  $: doSomethingBigWithLotsOfDeps(state1, state2, state3, state4, state5);  
</script>
```

#### 속성, 이벤트, 바인딩, 하위 컴포넌트 등을 변환

> original : **React**

```jsx
function Outer(props) {
  return <Inner {...props} />;
}
```

> revision : **Svelte**

- `$$props` : 모든 props
- slots : 전달되는 하위 컴포넌트
- `use:{action}` : HTML 요소 바인딩 시에 재사용 되는 로직을 기술
- `on:{event}` : 이벤트 함수 바인딩

```html
<Inner {...$$props} on:click on:keydown />
```

#### TabControl 예시

> original : **React**

```jsx
<TabControl>
  <TabPage label='Page 1'>
    Page 1 content
  </TabPage>
  <TabPage label='Page 2'>
    Page 2 content
  </TabPage>
</TabControl>
```

> revision : **Svelte**

- `svelte:fragment` : slot 이름을 특정하여 내용을 삽입할 수 있다.

```html
<TabControl tabs={[
  { label: 'Page 1', slot: 1},
  { label: 'Page 2', slot: 2},
  ]}>
  <svelte:fragment slot='1'>
    Page 1 content
  </svelte:fragment>
  <svelte:fragment slot='2'>
    Page 2 content
  </svelte:fragment>
</TabControl>
```

#### 컴포넌트 error 처리

- [issue : svelte 는 `on:error` 제안 상태](https://github.com/sveltejs/svelte/issues/1096)

> original : **React**

```jsx
<ErrorBoundary>
  {(null).read()}
</ErrorBoundary>
```

> revision : **Svelte**

- [window:unhandledrejection](https://developer.mozilla.org/en-US/docs/Web/API/Window/unhandledrejection_event) 이벤트를 이용한다.
  - 그러나 이런 경우는, 오류를 일으키는 하위 컴포넌트 사용시에 발생한다.

```html
<script>
  const onunhandledrejection = async e => {
    console.log('Unhandler error, checking whether crashed', e);
    // pass
  };
</script>

<svelte:window on:unhandledrejection={onunhandledrejection} />
```

> 그 외 참고문서

- [How I moved from React to Svelte](https://dev.to/kedzior_io/how-i-moved-from-react-to-svelte-gdi)
- [Ultimate Svelte Guide for React Developers](https://www.100ms.live/blog/svelte-react-developers)


## 3. React 프로젝트 클론 코딩

다음 글에서 이어서 하자. (너무 길다)

> 참고 프로젝트

- React.js : [Daisyui Admin Dashboard Template](https://www.builtatlightspeed.com/theme/srobbin01-daisyui-admin-dashboard-template)
  - [깃허브 - srobbin01/daisyui-admin-dashboard-template](https://github.com/srobbin01/daisyui-admin-dashboard-template)
- Next.js : [TripAdvisor Clone using NextJS TailwindCSS DaisyUI](https://www.youtube.com/watch?v=c59sjkDpHXo)
  - [깃허브 - 9jacoderYT/tripadvsior-clone-starting-code](https://github.com/9jacoderYT/tripadvsior-clone-starting-code)
- Svelte : [깃허브 - spences10/sveltekit-mdsvex-starter-blog](https://github.com/spences10/sveltekit-mdsvex-starter-blog)
  - [Demo](https://sveltekit-mdsvex-starter-blog.vercel.app/)


## 9. Review

- React 를 Svelte 로 변환할 수 있는 각이 보이지 않는 경우가 있다.
  - 동영상에서는 쉬운 부분만 가르쳐는 경향이 있어서 금방 따라할 수 있을듯 싶지만, 실제 React 코드를 보면 각종 변종이 판친다. 특히 오버 엔지니어링 이라는 일컷는 부분들이 있다.
- Svelte 에서는 최대한 단순하게 구현하라고 방향을 제시한다.
  - 개발자가 누구냐에 따라 언어와 프레임워크를 막론하고 스파게티 코드가 나올 수 있다.

### `$:` 는 `$effect` 로 기억할 것!

`useEffect` 는 대부분 `$:` 로 대체 가능하다.

- 그러나 분명하게 드러나는 변수만 관찰하기 때문에 미세 조정은 불가능 (svelte 한계)
  - 예를 들어, 함수 안에 변수가 둘러쌓인 경우 관찰이 불가능함
  - 또는 Array 의 추가만 추적하고, Array item 내용 변경은 구분하지 못함
    - Object, Array 변수는 복제와 재생성을 통해 추적이 가능하도록 하고 있다.
- 그래서 최근 **Svelte 5** 에서 `Runes` 이라는 연산자들을 만들고 있다.
  - 그런데 그 형태가 React, Vue 와 유사해서 반대파의 공격을 많이 받고 있다.
  - Runes 연산자로 인해 코딩 방식이 복잡해지면 Svelte 의 장점을 잃는다는 주장


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
