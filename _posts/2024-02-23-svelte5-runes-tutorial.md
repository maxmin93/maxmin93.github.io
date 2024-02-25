---
date: 2024-02-23 00:00:00 +0900
title: Svelte 5 Runes 연습
categories: ["frontend","svelte"]
tags: ["svelte5","runes","tutorial"]
image: "https://i.ytimg.com/vi/RVnxF3j3N8U/sddefault.jpg"
---

> Svelte 5 의 Rune 기능을 공부합니다. 변경은 확정적인것 같고 충분히 검토를 거친 기능들이기 때문에 미리 익숙해지는 것이 좋다고 생각합니다.
{: .prompt-tip }


## 0. 개요

- Windows 10 + Bun (실험적 버전)
- sveltekit + svelte5 preview

> 참고자료

- [Svelte 4 vs 5 코드 비교](https://component-party.dev/)
- [Svelte 5 preview 문서](https://svelte-5-preview.vercel.app/docs/introduction)
- [Upgrading to Svelte 5](https://gitcontext.com/blog/svelte-5-upgrade)

### Before we go any further

- Runes 의 문법이 React 따라하는 것 아니냐? 다른게 뭐냐? Svelte 장점을 훼손한다는 불만들이 많았지만 1년 넘도록 Svelte 5 로의 작업을 계속하고 있습니다.
- 나보다 머리 좋은 형님들이 머리를 맞대고 여러 사항에 대한 검토까지 마친 기능들이기 때문에 겸허히 받아들이고 감사히 쓰면 된다고 생각합니다.


## 1. 프로젝트 생성

### [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

Windows 10 환경 터미널에서 Bun 실행

- [Bun 설치](https://bun.sh/docs/installation#windows)
  - 관리자 권한 powershell 에서 `irm bun.sh/install.ps1|iex`
- [Bun 으로 vite 실행](https://bun.sh/guides/ecosystem/vite)
  - 윈도즈에서 `bun run dev` 는 리눅스 환경을 요구하며 실행이 멈춘다.

```bash
bun create svelte@latest rune-app
  - typescript
  - skeleton
  - prettier, svelte5 preview

cd rune-app

bun install
bunx --bun vite dev

bunx --bun vite build
bunx --bun vite preview
```


## 2. Runes

### 특징과 이점 (by Gemini)

Runes는 Svelte 5에서 도입된 핵심 개념으로, 이 반응성을 강화하고 프레임워크를 단순화하는 것을 목표로 합니다.

> Runes의 주요 특징

- `$state` : 컴포넌트 수준의 상태 관리를 위한 기초 변수를 선언합니다. $state로 선언된 변수는 컴포넌트를 자동으로 업데이트시킵니다.
- `$derived` : $state 변수 등에 기반한 파생값을 정합니다. $derived 변수 역시 변경 감지의 대상이 됩니다.
- `$effect` : 특정한 변수의 변경에 따르는 부수 효과(side-effects)를 정의합니다. onMount와 유사한 동작을 보입니다.
- `$props` : 상위 컴포넌트에서 전달되는 값을 명시적으로 처리하기 위해 $props를 사용합니다.

> Runes가 제공하는 이점

- 반응성의 확장 : Svelte의 반응성 시스템을 .svelte 파일의 경계를 넘어 확장시킵니다. JavaScript의 일반적인 부분에서도 간결한 방식으로 값의 변경을 감지하고 연쇄적으로 업데이트를 할 수 있습니다.
- 코드의 간결함 : 기존의 `$`, `onMount` 같은 문법을 Runes로 통합하여 반복적인 패턴을 줄이고 가독성을 향상시켰습니다.
- 명확성 : 변수의 역할을 쉽게 구분할 수 있습니다 (`$state`은 변경될 수 있음, `$derived`은 파생됨, 등). 이는 특히 팀 개발 시 유용합니다.

### 반응형 처리 `$state`, `$derived`, `$inspect`

- 변수 `$state`
- 파생(재계산) `$derived`
- 로깅 `$inspect`

```html
<script>
  let name = $state('John');
  name = 'Jane';

  let count = $state(10);
  function onclick() {
    count++;
  }

  const doubleCount = $derived(count * 2);  
  const doubleCountStatic = count * 2;
</script>

<button {onclick}>
  {doubleCount}
</button>

<h1>Hello {name}, NotReactive : {doubleCountStatic}</h1>
<p>count : {count}, computed(double) : {doubleCount}</p>
```

> migration 팁

- (writable 같은) 모든 store 를 $state 로 변환하고
- javascript class 의 멤버로 $state 변수들을 통합시켜 사용 
- slot 사용시 컨텐츠가 제공되지 않으면 오류가 발생하므로 render 함수를 변환해야 함
- Inspector는 Svelte 5(아직)에서 작동하지 않습니다.

### 라이프 사이클 `$effect`

- onmount `$effect`
- unmount `$effect`.return

```html
<script>
  /** @type {HTMLInputElement} */
  let inputElement;
  let pageTitle = $state('');
  let time = $state(new Date().toLocaleTimeString());

  $effect(() => {
    pageTitle = document.title;
    
    inputElement.focus();

    const timer = setInterval(() => {
      time = new Date().toLocaleTimeString();
    }, 1000);

    return () => clearInterval(timer);
  });
</script>

<input bind:this={inputElement} />

<svelte:head>
  <title>Svelte5 Rune</title>
</svelte:head>

<p>Page title is: {pageTitle}</p>

<p>Current time: {time}</p>
```

### 컴포넌트 속성 `$props`

```js
// 기본값
let { optionalProp = 42, requiredProp } = $props();

// 타입 지시자
let { catch: theCatch } = $props();

// 나머지
let { a, b, c, ...everythingElse } = $props();

// 전체에 타입 지시자 적용
let { a, b, c, ...everythingElse } = $props<MyProps>();
```

#### Using Props to Spread Event Handlers

```html
<!-- App.svelte -->
<script>
  let data ={
    name: 'Jane',
    onclick: ()=> { },
    onfocus: ()=> { },
    onblur: ()=> { },
    onchange: ()=> { },
  }
</script>

<ChildComponent {data} />
```

```html
<!-- ChildComponent.svelte -->
<script>
  let { name, ...attrs } = $props();
</script>

<!-- 이벤트 핸들러를 하나하나 풀어서 전달해야 했는데 -->
<input
  type="text"
  {name}
  bind:value
  on:focus
  on:blur
  on:change
  on:input
  />

<!-- svelte5 : 이렇게 바꿀 수 있다 -->
<input
  type="text"
  bind:value
  {name}
  ...attrs
  />
```

## 3. 그밖의 기능들

### [snippets](https://svelte-5-preview.vercel.app/docs/snippets)

- slot 대신에 @render 를 사용하고
- 템플릿을 snippet 키워드로 감싸서 함수처럼 재사용 할 수 있다.
- snippet 함수의 파라미터로 객체를 넣어서 값을 변경할 수 있다.

```html
{#snippet figure(image)}
  <figure>
    <img
      src={image.src}
      alt={image.caption}
      width={image.width}
      height={image.height}
    />
    <figcaption>{image.caption}</figcaption>
  </figure>
{/snippet}

{#each images as image}
  {#if image.href}
    <a href={image.href}>
      {@render figure(image)}
    </a>
  {:else}
    {@render figure(image)}
  {/if}
{/each}
```

#### snippet 을 서브 컴포넌트에 전달하기

- 데이터 fruits 와 snippet 템플릿인 header 와 row 를 Table 서브 컴포넌트에 전달
- Table 서브 컴포넌트에서 `$props` 로 받아 `@render` 함수로 렌더링

```html
<!-- App.svelte -->
<script>
  import Table from './Table.svelte';

  const fruits = [
    { name: 'apples', qty: 5, price: 2 },
    { name: 'bananas', qty: 10, price: 1 },
    { name: 'cherries', qty: 20, price: 0.5 }
  ];
</script>

{#snippet header()}
  <th>fruit</th>
  <th>qty</th>
  <th>price</th>
  <th>total</th>
{/snippet}

{#snippet row(d)}
  <td>{d.name}</td>
  <td>{d.qty}</td>
  <td>{d.price}</td>
  <td>{d.qty * d.price}</td>
{/snippet}

<Table data={fruits} {header} {row} />
```

```html
<!-- Table.svelte -->
<script>
  let { data, header, row } = $props();
</script>

<table>
  {#if header}
    <thead>
      <tr>{@render header()}</tr>
    </thead>
  {/if}

  <tbody>
    {#each data as d}
      <tr>{@render row(d)}</tr>
    {/each}
  </tbody>
</table>
```

> slot 과 render 함수의 차이점

- slot 은 커스텀 콘텐츠의 place-holder 의 역활을 하는데 반해
- render 함수는 데이터를 받아 HTML 을 생성하는 적극적인 역활을 수행한다.
  - 그렇기 때문에 snippet 은 render 함수로만 처리할 수 있다.

### Event Handler

- on 지시자 대신에 일반적인 속성으로서 handler 를 처리할 수 있다.
- 이전에 context 를 사용하던 방식 대신에 `$props` 를 통해 서브 컴포넌트로 전달할 수 있다.

```html
<!-- App.svelte -->
<script>
  import Pump from './Pump.svelte';

  let size = $state(15);
  let burst = $state(false);

  function reset() {
    size = 15;
    burst = false;
  }
</script>

<Pump
  inflate={() => {
    size += 5;
    if (size > 75) burst = true;
  }}
  deflate={() => {
    if (size > 0) size -= 5;
  }}
/>

{#if burst}
  <button onclick={reset}>new balloon</button>
  <span class="boom">💥</span>
{:else}
  <span class="balloon" style="scale: {0.01 * size}">
    🎈
  </span>
{/if}
```

```html
<!-- Pump.svelte -->
<script>
  let { inflate, deflate } = $props();
</script>

<button onclick={inflate}>inflate</button>
<button onclick={deflate}>deflate</button>
```

> on 지시자와 createEventDispatcher 를 퇴장(deprecated)시키기로 함

- createEventDispatcher 로 인한 상용구와 러닝커브를 줄이고
- Custom Event 객체를 생성하는 오버헤드를 제거

### [추가된 함수들](https://svelte-5-preview.vercel.app/docs/functions)

- untrack : `$effect`, `$derived` 에서 예외적으로 반응성을 멈출 때 사용
- unstate : `$state` 로 만든 반응성을 제거
- mount : 특정 svelte 를 인스턴스화 해서 target 에 연결
- hydrate : mount 와 유사하지만 SSR 모드에서 대화형으로 만든다 (무슨 뜻인지 모르겠음)
- render : 서버 모드에서 특정 svelte 를 렌더링 출력


## 9. Review

- 살펴보니 꼭 써야겠다. 
  - 특히 컴포넌트간의 데이터 전달하는 부분이 간결해질 것 같다.
  - store 와 context 남발을 없앨 수 있다.
  - 사용자 정의 이벤트 dispatch 기능을 쉽게 쓰질 못했는데 잘 되었다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
