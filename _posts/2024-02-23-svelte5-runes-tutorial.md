---
date: 2024-02-23 00:00:00 +0900
title: Svelte 5 Runes
categories: ["frontend","svelte"]
tags: ["svelte5","runes","tutorial"]
image: "https://i.ytimg.com/vi/RVnxF3j3N8U/sddefault.jpg"
---

> Svelte 5 의 Rune 기능을 공부합니다. 2024년 1분기 출시는 확정적인 것 같고 충분히 검토를 거친 기능들이기 때문에 미리 익숙해지는 것이 좋다고 생각합니다.
{: .prompt-tip }

- [Svelte 5 Runes](/posts/2024-02-23-svelte5-runes-tutorial/) : features &nbsp; &#10004;
- [Svelte 5 Runes - Todo App](/posts/2024-02-26-svelte5-runes-example1/) &nbsp; &#10004;
- [Svelte 5 Runes - Supabase Auth](/posts/2024-02-29-svelte5-runes-example2/) 


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

### [SvelteKit 로드맵](https://sveltekit.io/blog/sveltekit-roadmap)

- SvelteKit 3 출시 : 2024년 12월 14일 예정
  - 웹소켓 통합 (아직 개발중)
- Svelte 5 출시 : 2024년 1분기 예정


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

### runes 활성화 옵션

프로젝트 생성시에 `svelte5 preview` 선택했으면 설정 안해도 되긴 한다.

> 전체 프로젝트 수준에서 사용할 때 `svelte.config.ts` 에 설정

이거 쓰면 거의 대부분의 라이브러리들을 못쓰게 된다. 심지어 icons 라이브러리까지.

```ts
export default {
  // ...,
  compilerOptions: {
    runes: true
  }
};
```

> 특정 영역에서 사용할 때 해당 svelte 파일 내에서 선언

```html
<svelte:options runes={true} />
```


## 2. Runes

**읽어보기** : [SvelteKit 블로그 - 스벨트 5가 온다](https://sveltekit.io/blog/svelte-5)

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

- 반응형 변수 [`$state`](https://svelte-5-preview.vercel.app/docs/runes#$state)
  - [`$state.frozen`](https://svelte-5-preview.vercel.app/docs/runes#$state-frozen) : immutable 객체 생성 (대체만 가능하다)
- 반응형 파생(재계산) [`$derived`](https://svelte-5-preview.vercel.app/docs/runes#$derived)
  - [`$derived.by`](https://svelte-5-preview.vercel.app/docs/runes#$derived-by) : 단문 형식이 맞지 않을 때 함수형으로 사용
- 반응형 로깅 [`$inspect`](https://svelte-5-preview.vercel.app/docs/runes#$inspect)

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

#### [`$state` 는 어디에나 사용할 수 있다](https://www.infoworld.com/article/3712688/reactive-magic-in-svelte-5-understanding-runes.amp.html)

> object 생성시 property 로 사용한 예시

```html
<script>
  /**
   * $state 를 property 로 삼은 object 를 생성한다.
   * @param {string} def
   */
  let makeText = function (def) {
    let myText = $state(def);
    return {
      get text() {
        return myText;
      },
      set text(text) {
        myText = text;
      },
    };
  };
  let text = makeText('test');  
</script>

<input type="text" bind:value={text.text} />
<span class="text-lg">Text: {text.text}</span>
```

> class 생성시 member 로 사용한 예시

```html
<script>
  /**
   * 클래스에 $state 멤버를 포함할 수 있다.
   * @class StateObject
   */
  const StateObject = class {
    /** @type {string} */
    text = $state('I am a test');
    /** @type {number} */
    num = $state(42);
  };
  let valueObject = new StateObject();  
</script>

<span class="text-lg">Text: {valueObject.text}</span>
<span class="text-lg">Number: {valueObject.num}</span>
```

#### sveltekit 에서 외부 js 파일로 사용하기

[Svelte 공식문서 예제](https://svelte.dev/blog/runes#beyond-components) 를 따라해 보았습니다. 별도의 js/ts 파일에서 runes 을 사용하려면 확장자가 `.svelte.js` 또는 `.svelte.ts` 이어야 합니다.

> `counter.svelte.js`

😱 **주의**: 반응형 변수(`$state`)는 반드시 클래스 또는 함수 멤버여야 한다.

```js
export function createCounter() {
  let count = $state(0);  
  // let count = 0;  // 안변함 (반응형 변수가 아니라서)
  return {
    get count() {
      return count;
    },
    increment: () => (count += 1),
  };
}
```

> `test-page.svelte`

```html
<script>
  import { createCounter } from './counter.svelte.js';

  const counter = createCounter();
</script>

<button on:click={counter.increment}>
  clicks: {$counter}
</button>
```

#### 자식 컴포넌트에 반응형 객체를 전달하기

> `Child.svelte`

구조가 해제된 변수(destructured variable)의 JDoc 타입 표현은 `@type` 으로 구조를 모두 풀어쓰면 된다. 

- 참고 : [How to document destructured variable with jsdoc](https://stackoverflow.com/a/72012216/6811653)
- [Snippet 의 타입](https://svelte-5-preview.vercel.app/docs/snippets#typing-snippets)은 `import('svelte').Snippet` 이다.
  - `@render` 지시자로 처리하고, 파라미터로 동적으로 생성할 수 있다.
  - `children` 스니펫은 하위 컴포넌트 태그 안의 모든 내용을 지시하는 예약어이다.
  - 별도의 이름은 `{#snippet}...{/snippet}` 으로 지정할 수 있다. [Demo](https://svelte-5-preview.vercel.app/#H4sIAAAAAAAAE41S247aMBD9lVFYCegGsiDxks1G7T_0bdkHJ3aI1cR27aEtsvzvtZ0LZeGhiiJ5js-cmTMemzS8YybJ320iSM-SPPmmVJImeFEhML9Yh8zHRp51HZDC1JorLI_iiLxXUiN8J1XHoNGyh-U2i9F2SFy-epon1lIY9IwzRwNv8B6wI1oIJXNYEqV8E8sUfuIlh0MKSvPaX-zBpZ-oFRH-m7m7l5m8uyfXLdOaX5X3V_bL9gAu0D98i0V2NSWKwQ4lSN7s0LKLbgtsyxgXmT9NiBe-iaP-DYISSTcj4bcLI7hSDEHL3yu6dkPfBdLS0m1o3nk-LW9gX-gBGss9ZsMXuLu32VjZBdfRaelft5eUN5zRJEd9Zi6dlyEy_ncdOm_IxsGlULe8o5qJNFgE5x_9SWmpzGp9N2-MXQxz4c2cOQ-lZWQyF0Jd2q_-mjI9U1fr4FBPE8iuKTbjjRt2sMBK0svIsQtG6jb2CsQAdQ_1x9f5R9tmIS-yPToK-tNkQRQGL6ObCIIdEpH9wQ3p-Enk0LEGXwe4ktoX2hhFai5Ofi0jPnYc9QF1LrDdRK-rvXjerSfNitQ_TlqeBc1hwRi7yY3F81MnK9KtsF2n8Amis44ilA7VtwfWTyr-kaKV-_X4cH8BTOhfRzcEAAA=)
  - 가끔 `Svelte SSR validation error` 이 나오는데 다시 시작하면 없어진다.

```html
<script>
  /**
   * @type { {
   *  counter: {
   *    count:number,
   *    increment:()=>void
   *  },
   *  children: import('svelte').Snippet
   *  childTitle: import('svelte').Snippet
   * } }
   */
  let { counter, children, childTitle } = $props();
</script>

<h2 class="text-2xl">{@render children()} : {@render childTitle()}</h2>
<button class="btn" on:click={counter.increment}>click: {counter.count}</button>
```

> `test-page.svelte`

```html
<script>
  import Child from './Child.svelte';
  import { createCounter } from './counter.svelte';

  const counter = createCounter();
</script>

<h1 class="text-4xl font-bold">TEST</h1>
<Child {counter}>
  Child Page
  {#snippet childTitle()}
    <span class="text-red-500">Counter</span>
  {/snippet}
</Child>
```

### 반응형 라이프 사이클 `$effect`

`$state` 변수의 상태에 따라 뭔가를 처리하려면 `$effect` 안에서 해야 한다. 어떻게 보면 `$derived` 와 비슷한데, 반응형 코드 블럭을 수행하던 `$: {...}` 를 대체한다고 여기면 된다.

- onmount [`$effect`](https://svelte-5-preview.vercel.app/docs/runes#$effect)
  - `$effect`.return 반응형 라이프 종료시 실행
- `$effect` 고급 기능
  - `$effect.pre` : DOM 업데이트 이전에 실행
  - `$effect.active` : effect 내부에서 실행되거나 템플릿에서 실행되는지 여부
  - `$effect.root` : effect 블럭을 감싸서 수동으로 처리할 때 사용

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
let { catch: TheCatch } = $props();

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

**읽어보기** : [SvelteKit 블로그 - Slot 은 이제 안녕](https://sveltekit.io/blog/snippets)

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
- `$effect` 도 pre, active, root 등 고급 기능들이 있는데 잘 모르겠다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
