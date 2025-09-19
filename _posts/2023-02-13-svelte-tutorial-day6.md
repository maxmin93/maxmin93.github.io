---
date: 2023-02-13 00:00:00 +0900
title: Svelte 공부하기 - 6일차
description: 프론트엔드 프레임워크인 SvelteKit 에 대해 공부한다. Svelte 중에 부족한 부분을 보충한다. (6일차)
categories: [Frontend, Svelte]
tags: []
image: "https://blog.hyper.io/content/images/2021/03/SvelteLogo.png"
---

> 목록
{: .prompt-tip }

- [Svelte 공부하기 - 1일차](/posts/svelte-tutorial-day1/) : Svelte
- [Svelte 공부하기 - 2일차](/posts/svelte-tutorial-day2/) : SvelteKit + CSS
- [Svelte 공부하기 - 3일차](/posts/svelte-tutorial-day3/) : SvelteKit 구조, 작동방식
- [Svelte 공부하기 - 4일차](/posts/svelte-tutorial-day4/) : SvelteKit 애플리케이션 예제
- [Svelte 공부하기 - 5일차](/posts/svelte-tutorial-day5/) : Supabase 인증, DB 연동
- [Svelte 공부하기 - 6일차](/posts/svelte-tutorial-day6/) : SvelteKit 심화 &nbsp; &#10004;

## 1. Svelte Events

### 1) [Event forwarding](https://svelte.dev/tutorial/event-forwarding)

기본적인 이벤트 방향은 하위 컴포넌트에서 상위 컴포넌트로 전달된다. 여기서는 중간의 Outter 컴포넌트를 통과해서, 차상위 App 컴포넌트에서 처리되고 있다.

- **App.svelte** : message 이벤트를 handleMessage 에 연결한다
  + on:message => handleMessage
  + handleMessage => alert(event.detail.text) 최종 수행 
  + **Outter.svelte** : message 이벤트를 처리 안하고 전달만 한다.
    * Inner => on:message : message 이벤트를 처리할 handler 가 없다
    * **Inner.svelte** : 클릭 이벤트를 message 이벤트로 변환하여 전달
      - button on:click => sayHello
      - sayHello => dispatch(message)

```svelte
<script>
  import Outer from './Outer.svelte';

  function handleMessage(event) {
    alert(event.detail.text);
  }
</script>

<Outer on:message={handleMessage}/>
```
{: file="App.svelte"}

```svelte
<script>
  import Inner from './Inner.svelte';
</script>

<Inner on:message/>
```
{: file="Outter.svelte"}

```svelte
<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  function sayHello() {
    dispatch('message', {
      text: 'Hello!'
    });
  }
</script>

<button on:click={sayHello}>
  Click to say hello
</button>
```
{: file="Inner.svelte"}

비슷한 예제로 DOM 이벤트도 handler 가 없으면 상위로 전달된다.

```svelte
<script>
  import CustomButton from './CustomButton.svelte';

  function handleClick() {
    alert('Button Clicked');
  }
</script>

<CustomButton on:click={handleClick}/>
```
{: file="App.svelte"}

```svelte
<button on:click> <!-- 핸들러가 없다 (이벤트 통과) -->
  Click me
</button>
```
{: file="CustomButton.svelte"}

## 2. Lifecycle

### 1) [onMount](https://svelte.dev/tutorial/onmount)

- Element 가 처음 DOM에 렌더링된 후에 실행된다.
  + 가장 자주 사용하게 되는 라이프사이클 Hook 함수
- 수명 주기 함수는 SSR 중에 실행되지 않습니다. (onDestroy는 제외)
- DOM에 마운트된 후 데이터를 느리게 가져오는 것을 피할 수 있습니다.
  - 서버 사이드 렌더링 할 때 fetch 타이밍을 맞추기 위함 (script 태그에 의한 데이터 로딩 방식보다 나은 방법)

```svelte
<script>
  import { onMount } from 'svelte';

  let photos = [];

  onMount(async () => {
    const res = await fetch(`/tutorial/api/album`);
    photos = await res.json();
  });
</script>

<div class="photos">
  {#each photos as photo}
    <figure>
      <img src={photo.thumbnailUrl} alt={photo.title}>
      <figcaption>{photo.title}</figcaption>
    </figure>
  {:else}
    <!-- this block renders when photos.length === 0 -->
    <p>loading...</p>
  {/each}
</div>

```

### 2) [onDestroy](https://svelte.dev/tutorial/ondestroy)

- 구성요소가 소멸될 때 실행되는 라이프 사이클 Hook 함수
- Timer 소멸시 setInterval 을 clear 처리하는 예제
  + 메모리 누수를 막을 수 있다

```svelte
<script>
  import Timer from './Timer.svelte';

  let open = true;
  let seconds = 0;

  const toggle = () => (open = !open);
  const handleTick = () => (seconds += 1);
</script>

<div>
  <button on:click={toggle}>{open ? 'Close' : 'Open'} Timer</button>
  <p>
    The Timer component has been open for
    {seconds} {seconds === 1 ? 'second' : 'seconds'}
  </p>
  {#if open}
  <Timer callback={handleTick} />
  {/if}
</div>
```
{: file="App.svelte"}

```svelte
<script>
  import { onDestroy } from 'svelte';
  function onInterval(callback, milliseconds) {
    const interval = setInterval(callback, milliseconds);

    onDestroy(() => {
      clearInterval(interval);
    });
  }

  export let callback;
  export let interval = 1000;

  onInterval(callback, interval);
</script>
```
{: file="Timer.svelte"}

### 3) beforeUpdate and afterUpdate

- Update 라이프사이클 Hook 함수
  + beforeUpdate 함수: DOM이 업데이트되기 직전에 작업을 수행
  + afterUpdate 함수: DOM이 데이터와 동기화되면 코드를 실행
- 함께 사용하면 상태 기반 방식으로 달성하기 어려운 작업을 명령적으로 수행하는 데 유용합니다.
  + 사례) div 요소의 스크롤 위치 업데이트
    * div 요소를 bind:this 로 div 변수에 바인딩
    * update 이전에 채팅의 스크롤 위치를 확인하고, 이후에 스크롤링

```svelte
<script>
  import Eliza from 'elizabot';
  import { beforeUpdate, afterUpdate } from 'svelte';

  let div;
  let autoscroll;

  beforeUpdate(() => {
    autoscroll = div && (div.offsetHeight + div.scrollTop) > (div.scrollHeight - 20);
  });

  afterUpdate(() => {
    if (autoscroll) div.scrollTo(0, div.scrollHeight);
  });
</script>

<div class="chat">
  <h1>Eliza</h1>

  <div class="scrollable" bind:this={div}>
    {#each comments as comment}
      <article class={comment.author}>
        <span>{comment.text}</span>
      </article>
    {/each}
  </div>

  <input on:keydown={handleKeydown}>
</div>
```

## 3. Special elements

### 1) [svelte:window](https://svelte.dev/tutorial/svelte-window)

- window 개체에 이벤트를 등록하는 경우에 사용
  + 예) 키 이벤트 인식 및 출력
- 특정 window 속성에 바인딩 할 수도 있음
  + 연결 가능 속성들 : inner/outer - Width/Height, scrollX/Y, online
  + 예) 윈도우 스크롤 위치 

```vue
<script>
  let key;
  let code;

  function handleKeydown(event) {
    key = event.key;
    code = event.code;
  }

  let y;
</script>

<svelte:window bind:scrollY={y}/>

<svelte:window on:keydown={handleKeydown}/>
```

## 4. [Skeleton & Flowbite](https://www.skeleton.dev/blog/skeleton-plus-flowbite)

Skeleton CSS for SvelteKit 에서 Flowbite 를 사용할 수 있게 되었다. 

- `npm install flowbite` 안해도 됨
- [Flowbite Svelte](https://github.com/themesberg/flowbite-svelte) 컴포넌트는 아니고, 순수 Flowbite 만 가능
  + 여러가지 [HTML Elements](https://flowbite.com/docs/components/) 들을 사용할 수 있다.

### 1) Flowbite 와 Skeleton 의 SvelteKit 프로젝트 생성

```console
$ npm create skeleton-app@latest skeleton-plus-flowbite
    - Choose "Yes, using Typescript syntax"
    - Select "No" for ESLint, Prettier, Playwright, Vitest, Inspector
    - Hit "Enter" to skip Tailwind plugins
    - Select the default "Skeleton" theme
    - Select the "Bare Bones" template

$ cd skeleton-plus-flowbite
$ npm run dev -- --open
```

블로그에서는 Flowbite Timeline 요소를 사용하는 방법을 설명하고 있다.

- Timeline 과 TimelineItem 으로 나누고
- Flowbite 예제 코드에는 색상이 하드코딩 되어 있어, 일부 제거/조정
- 배지와 아이콘 스타일을 고치고
- Typography 를 조정하고

![The Timeline element presented on the Flowbite website.](https://skeleton.ghost.io/content/images/2023/01/Screenshot-2023-01-29-at-2.11.05-PM.png){: width="560" .w-75}
_The Timeline element presented on the Flowbite website._

### 2) [Skeleton Modal](https://www.skeleton.dev/utilities/modals)

기본적으로 Modal 컴포넌트가 HTML 영역에 선언되어 있어야 한다.

```svelte
<script lang="ts">
  // Modals Utils
  import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
  import { Modal, modalStore } from '@skeletonlabs/skeleton';

  function triggerAlert(): void {
    console.log('working!');
  }
</script>

<Modal />
```
{: file="+page.svelte"}

#### Alert (기본)

```svelte
<script lang="ts">
  function modalAlert(): void {
    const d: ModalSettings = {
      type: 'alert',
      title: 'Welcome to Skeleton',
      body: 'This simple alert modal examples uses <code>type: alert</code> and makes use of the optional <code>title</code>, <code>body</code>, and <code>image</code> values.',
      image: 'https://i.imgur.com/WOgTG96.gif'
    };
    modalStore.trigger(d);
  }
</script>

<button class="btn variant-ghost-surface" on:click={modalAlert}>Alert</button>
```

#### Form (Component 타입)

```svelte
<script lang="ts">
  import ModalForm from '$lib/Modal/ModalForm.svelte';

  function modalComponentForm(): void {
    const c: ModalComponent = { ref: ModalForm };
    const d: ModalSettings = {
      type: 'component',
      title: 'Custom Form Component',
      body: 'Complete the form below and then press submit.',
      component: c,
      response: (r: any) => {
        if (r) console.log('response:', r);
      },
      meta: {
        foo: 'bar',
        fizz: 'buzz',
        fn: triggerAlert
      }
    };
    modalStore.trigger(d);
  }  
</script>

<button class="btn variant-ghost-surface" on:click={modalComponentForm}>Form</button>
```

## 9. Review

- Skeleton 이 유용하긴 한데, HTML 요소들이 다양하지 않아 불편했다.
  + Flowbite 가 필요하던 차에 업데이트가 되어 반갑다.
- 일단 업로드 하고 나중에 필요한 부분을 업데이트 하자.

> Full-Stack CRUD Application Example

- [Full-Stack CRUD Application with SvelteKit & Prisma](https://www.youtube.com/watch?v=E9J2VXd-bzE)

> SvelteKit Auth Tutorials with Firebase Auth

- [SvelteKit Authentication Tutorial + Firebase Auth](https://www.youtube.com/watch?v=8NlUTFppJkU)
- [SvelteKit + Firebase 9 Authentication Simple Tutorial](https://www.youtube.com/watch?v=PXf0t6Id7i0)


### Comments

json 의 결과인 Response 에 대해 setHeader 적용이 안된다.

- immutable data : json 결과는 수정 불가능한 데이터
- api 파라미터는 event.url.searchParams 를 사용한다.
  + 예) `http://localhost:5173/api/people?page=1`

```ts
export const GET = (async (event) => {
  // log all headers
  // console.log(...event.request.headers);
  console.log(event.url.searchParams);
  const page = event.url.searchParams.get('page') || 1;

  const url = `https://reqres.in/api/users?page=${page}`;
  const response = await event.fetch(url);
  const data = await response.json();

  // immutable data : json 결과는 수정 불가능한 데이터
  return json({
    people: data.data || []
  });
}) satisfies RequestHandler;
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

