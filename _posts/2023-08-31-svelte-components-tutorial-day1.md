---
date: 2023-08-31 00:00:00 +0900
title: Svelte Component 라이브러리 - 1일차
description: 필요한 컴포넌트를 만들기 위해 Svelte 관련 문법을 정리합니다. steeze-ui 컴포넌트 라이브러리의 소스를 보며 공부합니다.
categories: [Frontend, Svelte]
tags: ["ui-components", "steeze-ui", "1st-day"]
image: "https://blog.hyper.io/content/images/2021/03/SvelteLogo.png"
---

> 목록
{: .prompt-tip }

- [Svelte Component 라이브러리 - 1일차](/posts/svelte-components-tutorial-day1/) : Steeze UI &nbsp; &#10004;
- [Svelte Component 라이브러리 - 2일차](/posts/svelte-components-tutorial-day2/) : Flowbite Svelte

> 참고문서

- [깃허브 - Steeze UI 컴포넌트 for Svelte](https://github.com/steeze-ui/components)
- [블로그 - 스벨트 기본 문법](https://kyounghwan01.github.io/blog/Svelte/svelte-basic/)

## 1. CSS: Attribute Selector

보통은 Tag 를 선택자로 삼고 스타일을 기술하는데, Tag 없이 Attribute 로만 선택자를 표기하는 경우 새삼 생소해서 다시 한번 살펴보려고 한다.

### [Attribute selector - 7가지 유형](https://css-tricks.com/almanac/selectors/a/attribute/#aa-the-seven-different-types)

```css
[data-value] {
  /* 속성을 가진 요소 */
}

[data-value="foo"] {
  /* 속성과 특정값을 가진 요소 (완전매칭) */
}

[data-value*="foo"] {
  /* 속성값에 특정철자들이 매칭되는 요소 (부분매칭) 
    - [O] “abstract art”, “athlete starting a new sport”
  */
}

[data-value~="foo"] {
  /* 속성값에 특정단어가 매칭되는 요소 (단어매칭) 
    - [O] “abstract art”, “art show”
    - [X] “athlete starting a new sport”
  */
}

[data-value^="foo"] {
  /* 속성값이 특정값으로 시작하는 부분매칭 요소 
    - [O] “art show”, “artistic pattern”
  */
}

[data-value|="foo"] {
  /* 속성값에서 특정값으로 시작하는 대시(-) 구분 리스트를 값으로 가진 요소 
    ex) li[data-years|="1900"]
      => [O] “1900-2000”, [X] “1800-1900”
  */
}

[data-value$="foo"] {
  /* 속성값이 특정값으로 끝나는 부분매칭 요소 
    ex) a[href$="pdf"]
  */
}
```

#### 속성 조건 결합

```css
img[alt~="person"][src*="lorem"] {
  /* style rules here */
}
```

> 참고문서

- [MDN - Attribute selector 예시](https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors#examples)

## 2. Svelte 템플릿

### [Special elements - `$$slots`](https://svelte.dev/docs/special-elements#slot-$$slots)

```svelte
<!-- Card.svelte -->
<div>
  <slot name="title" />
  {#if $$slots.description}
    <!-- description 슬롯이 있을 경우에만 출력된다. -->
    <hr />
    <slot name="description" />
  {/if}
</div>

<!-- App.svelte -->
<Card>
  <h1 slot="title">Blog Post Title</h1>
  <!-- slot="descript" 슬롯이 없기 때문에, title 슬롯만 출력된다. -->
</Card>
```

### [Special Tags](https://svelte.dev/docs/special-tags)

- `@html`
- `@debug`
- `@const` : 로컬 상수를 선언 (논리 블록 내에서 사용)
  + 논리 블록 : if, else if, each, then, catch, svelte:fragment 등

```svelte
<script>
  export let boxes;
</script>

{#each boxes as box}
  {@const area = box.width * box.height}
  {box.width} * {box.height} = {area}
{/each}
```

### [Element directive](https://svelte.dev/docs/element-directives)

- `on:{eventname}|{modifier} = {handler}`
  - eventname : click 같은 이벤트
  - modifier : preventDefault, stopPropagation, once 등... 
- `bind:{property} = {variable}`

#### block 단위 요소 바인딩

- img : naturalWidth, naturalHeight
- bind : clientWidth, clientHeight, offsetWidth, offsetHeight
- bind : group

```svelte
<img
  bind:naturalWidth
  bind:naturalHeight
></img>

<div bind:offsetWidth={width} bind:offsetHeight={height}>
  <Chart {width} {height} />
</div>

<!-- radio 버튼 입력자는 group 으로 묶여 하나의 값만 선택할 수 있다 -->
<input type="radio" bind:group={tortilla} value="Plain" />
<input type="radio" bind:group={tortilla} value="Whole wheat" />
<input type="radio" bind:group={tortilla} value="Spinach" />
```

#### preventDefault

handler 호출 전에 event.preventDefault() 를 먼저 호출한다.

```svelte
<form on:submit|preventDefault={handleSubmit}>
  <input bind:value={name} />
  <textarea bind:value={text} />
</form>
```

### [style 블록](https://svelte.dev/docs/svelte-components#style)

> 기본적으로 style 선택자는 해당 컴포넌트에만 적용된다. (하위 요소에 적용 안됨)

global 스코프로 지정하고 싶으면, `:global(...)` 수식어를 사용한다.

```svelte
<style>
  p {
    color: burlywood;
  }

  :global(body) {
    /* this will apply to <body> */
    margin: 0;
  }

  div :global(strong) {
    /* this will apply to all <strong> elements, in any
       component, that are inside <div> elements belonging
       to this component */
    color: goldenrod;
  }
</style>
```

### 컴포넌트 prop 노출(export)

```svelte
<!-- Foo.svelte -->
<script>
  /** @type {string} */  // <== ts-lint 를 위한 힌트 (error 제거)
  let className;

  // 외부로 노출되는 prop 선언
  export let foo='bar';
  console.log({ foo });
</script>

<!-- App.svelte -->
<script>
  import Foo from './Foo.svelte';
</script>
<Foo foo='hello' rest1="value1" rest2="value2">
```

#### 나머지 props 들은? ➡ [`$restProps`](https://svelte.dev/docs/basic-markup#attributes-and-props)

> 모든 props 는 `$$props`, 나머지 props 는 `$$restProps`

```svelte
<!-- TextField.svelte -->
<script>
  export let value;  // props
  export let color;  // props
</script>

<div class="my-custom-input">
  <input 
    bind:value 
    style="color: {color};"
    {...$$restProps} />
    <!-- {...$$props} /> -->
</div>

<!-- App.svelte -->
<script>
  import TextField from './TextField.svelte'

  let id = ''
</script>

<TextField 
  bind:value={id}
  color="yellowgreen"
  type="email"
  placeholder="ID!"
  maxlength="10"
  required
/>
```

### 반응을 일으키려면 할당(assignment)을 해야 한다

> [script](https://svelte.dev/docs/svelte-components#script) 블록은 컴포넌트가 생성될 때 한번만 실행된다.

> [script context="module"](https://svelte.dev/docs/svelte-components#script-context-module) 블록은 모듈이 처음 생성될 때 한번만 실행된다.

```html
<script>
  let count = 0;
  let arr = [0, 1];

  function handleClick() {
    // count 변수에 대한 할당이 trigger 를 작동시킨다
    count = count + 1;
  }

  function arrHandleClick() {
    // arr 원소를 변경했기 때문에 trigger 가 작동 안된다
    arr.push(2);
    // (비록 자기 자신이지만) arr 할당을 했기때문에 trigger 가 작동된다
    arr = arr;
  }

  export let person;
  // unpack 되어 할당되는 name 의 값은 최초 실행후 변경되지 않는다
  let { name } = person;
</script>
```

### `$` : trigger 이후에 실행되는 callback 문

```svelte
<script>
  export let title;  // 외부 노출 속성1
  export let person; // 외부 노출 속성2

  // `title` 속성이 변경되면 반응하여 실행된다 (callback)
  $: document.title = title;
  // 블록으로 callback 을 정의할 수 있다
  $: {
    console.log(`multiple statements can be combined`);
    console.log(`the current title is ${title}`);
  }

  // person 변경시 name 이 변경된다
  $: ({ name } = person);

  // 이렇게 하지 마라! (name 은 할당 이전이라 null 이다)
  let name2 = name;
</script>
```

### store 변수를 접근하려면 `$` 를 붙여라

> 여러 구성 요소 간에 공유되는 값은 [store](https://svelte.dev/docs/svelte-store) 를 사용하라.

> rxjs 스타일에서는 뒤에 붙이는데, svelte store 변수는 앞에 붙인다.

```svelte
<script>
  import { writable } from 'svelte/store';

  const count = writable(0);
  console.log($count); // logs 0
  count.set(1);
  console.log($count); // logs 1
  $count = 2;  // set
  console.log($count); // logs 2

  // 선언과 함께 set 함수를 정의
  let tick = writable(0, () => {
    let interval = setInterval(() => {
      tick.update((value) => value + 1)
    }, 1000)
 
    return () => {
      clearInterval(interval)  // 1초 뒤에 갱신후 interval 종료
    }
  })
 
  let tickValue = 0
  tick.subscribe((v) => {
    tickValue = v  // tick 변경시 tickValue 도 변경됨
  })
</script>
 
<p>{ tickValue }</p>
```

#### rxjs 와 svelte 혼용 예시

```html
<!-- time.js -->
<script>
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

export const time$ = interval(1000).pipe(
  map(() => new Date().toLocaleTimeString())
);
</script>

<!-- time.svelte -->
<script>
import { time$ } from './time.js';
</script>
<p>현재 시간은 {$time$}</p>  <!-- time$ 앞에 $ 을 또 붙였다 -->
```

## 3. [steeze-ui/components](https://github.com/steeze-ui/components) 살펴보기

SvelteKit 을 위한 component UI 라이브러리를 하나 살펴보며 공부해본다.

### [Button](https://github.com/steeze-ui/components/tree/main/src/lib/button)

```svelte
<script lang="ts">
  import Icon from '@steeze-ui/svelte-icon/Icon.svelte'
  import type { IconSource } from '@steeze-ui/svelte-icon/types'
  import { onMount } from 'svelte'

  // 노출된 속성들
  export let disabled = false
  export let icon: IconSource | undefined = undefined
  export let iconTheme = 'default'
  export let iconSize = '18px'
  export let theme: string = 'secondary'
  export let width = 'initial'

  const props: { 'data-icon'?: string } = {}

  onMount(() => {
    if (!$$slots.default) {
      props['data-icon'] = ''
    }
  })
</script>

<button
  {...props}
  {...$$restProps}
  {disabled}
  data-component="button"
  data-theme={theme}
  style:width
  on:click
  on:pointerdown
  on:focus
  on:blur
>
  <slot name="prefix">
    {#if icon}
      <Icon theme={iconTheme} src={icon} width={iconSize} height={iconSize} />
    {/if}
  </slot>
  <slot />
</button>

<style>
  button { ... }  /* 생략 */
</style>
```

#### [`style:{property}`](https://svelte.dev/docs/element-directives#style-property)

```svelte
<!-- 동일한 표현 -->
<div style:color="red">...</div>
<div style="color: red;">...</div>

<!-- myColor 변수를 사용하는 경우 -->
<div style:color={myColor}>...</div>

<!-- 변수 이름이 속성과 같을 때는 생략 가능하다 (변수명=color) -->
<div style:color>...</div>

<!-- important 수정자를 추가할 수 있다 -->
<div style:color|important="red">...</div>
```

#### [Button 사용 예시](https://www.steeze-ui.com/docs/components/button)

```svelte
<script>
  import { Button } from '@steeze-ui/components'
</script>

<!-- 기본 -->
<Button
  theme="primary"
  on:click={()=>console.log("clicked!")}
>Click Me</Button>

<!-- 아이콘 사용 -->
<Button theme="secondary" icon={Moon} aria-label="Icon Button with Label">Icon</Button>
```

## 9. Review

- steeze-ui 컴포넌트 소스를 보니, 참 간단치가 않구나라는 탄식부터 나온다.
- 알았다 싶어도 모르겠고, 계속 써보는 수밖에 없겠지.
- 남들 신경쓰지 말고, 내 공부에 집중하자.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
