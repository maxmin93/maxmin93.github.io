---
date: 2022-12-07 00:00:00 +0000
title: Svelte 공부하기 - 1일차
categories: ["nodejs","svelte"]
tags: ["frontend","tutorial","1st-day"]
image: "https://assets.stickpng.com/images/584830e8cef1014c0b5e4aa0.png"
---

> 프론트엔드 프레임워크인 Svelte 에 대해 공부한다. Svelte 는 Vite 를 사용한다. (1일차)
{: .prompt-tip }

- [Svelte 공부하기 - 1일차](/posts/2022-12-07-svelte-tutorial-day1/) <span style='font-size:1.5rem;'>&nbsp; &#10004;</span>
- [Svelte 공부하기 - 2일차](/posts/2022-12-14-svelte-tutorial-day2/)

## 1. [Svelte 공식 문서](https://svelte.dev/docs)

Jekyll 의 코드블럭의 문법 하이라이터로 [rouge](https://github.com/rouge-ruby/rouge) 가  쓰이는데, 아직 svelte 언어 지원이 안되어서 vue 로 사용하여 작성함. (`_config.yml` 의 `syntax_highlighter: rouge` 옵션 참조)

- 참고 [Svelte Examples](https://svelte.dev/examples)
- "스벨^트" 라고 발음한다. (매끄럽다는 뜻)

### 1) 프로젝트 생성 및 실행

```shell
$ npm create svelte@latest my-app
Need to install the following packages:
  create-svelte@2.0.0-next.198
Ok to proceed? (y) y

create-svelte version 2.0.0-next.198

Welcome to SvelteKit!

✔ Which Svelte app template? › SvelteKit demo app
✔ Add type checking with TypeScript? › Yes, using JavaScript with JSDoc comments
✔ Add ESLint for code linting? … No / Yes
✔ Add Prettier for code formatting? … No / Yes
✔ Add Playwright for browser testing? … No / Yes
✔ Add Vitest for unit testing? … No / Yes

Your project is ready!

$ npm run dev -- --open
> my-app@0.0.1 dev
> vite dev --open

Forced re-optimization of dependencies

  VITE v3.2.5  ready in 747 ms
  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose

오후 2:59:44 [vite-plugin-svelte] ssr compile done.
package  files    time     avg
my-app       5  54.9ms  11.0ms
```

#### Svelte + Vite 템플릿

- Typescript 사용시 `--template svelte-ts`

```shell
$ npm create vite@latest my-svelte-project -- --template svelte
$ cd my-svelte-project
$ npm install
$ npm run dev      # vite 실행 => http://localhost:5173
$ npm run build    # dist 디렉토리로 결과 생성 
$ npm run preview  # dist 실행
```

### 2) 컴포넌트 형식

- `.svelte` 확장명을 가지고
- script 와 markup, style 을 모두 포함한다. (Vue 와 유사)
- `$:` 값이 변할 때 재실행 (useEffect 같은)
- Nested 컴포넌트에 `props = {answer: 42}` 을 전달
  + 노출할 변수는 `export let answer` 와 같이 선언

```vue
<script>
  // logic goes here
  let name = 'world';

  let count = 0;
  $: doubled = count * 2;
</script>
<!-- markup (zero or more items) goes here -->
<p>Styled {name}!</p>
<p>{count} * 2 = {doubled}</p>

<script>
  function handleClick() {
    count += 1;
  }
</script>
<button on:click={handleClick}>  <!-- 클릭 이벤트 -->
  Clicked {count} {count === 1 ? 'time' : 'times'}
</button>

<script>
  import Nested from './Nested.svelte';
</script>
<Nested answer={42}/>  <!-- 컴포넌트 삽입 (props={42}) -->

<style>
  /* styles go here */
  p {
    color: purple;
    font-family: 'Comic Sans MS', cursive;
    font-size: 2em;
  }
</style>
```

### 3) 논리 문법 : if/else, each, await 등..

- 마크업 영역에서 `{#if ...}` 형태로 작성
  + Jekyll 의 Ruby 문법과 비슷한거 같다.
- 주요 로직
  + 분기 `{$if ...}`,`{:else if ...}`,`{:else}`
  + 반복 `{$each 배열 as 변수, index}`
    * 컨테이너가 앞에 오고 값을 받는 변수가 뒤에 온다 (반대네!)
  + 대기 `{#await promise변수}`, `{:then 변수}`
    * 비동기 결과의 상태에 따라 출력 제어

```vue
<script>
  let user = { loggedIn: false };
  function toggle() {
    user.loggedIn = !user.loggedIn;
  }
</script>
{#if user.loggedIn}
  <button on:click={toggle}>
    Log out
  </button>
{:else if !user.loggedIn}
  <button on:click={toggle}>
    Log in
  </button>
{/if}

<script>
  let cats = [
    { id: 'J---aiyznGQ', name: 'Keyboard Cat' },
    { id: 'z_AbfPXTKms', name: 'Maru' },
    { id: 'OUtn3pvWmpg', name: 'Henri The Existential Cat' }
  ];
</script>
<ul>
  {#each cats as { id, name }, i}
    <li>
      <a target="_blank" rel="noreferrer" href="https://www.youtube.com/watch?v={id}">
        {i + 1}: {name}
      </a>
    </li>
  {/each}
</ul>

<script>
  let promise = getRandomNumber();
  async function getRandomNumber() {
      return text;
      // 또는 throw new Error(text);
  }  
</script>
{#await promise}
  <p>...waiting</p>
{:then number}
  <p>The number is {number}</p>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
```

### 4) 이벤트

- `on:이벤트` 에 핸들러 함수를 연결
- `이벤트:` 에 once 같은 이벤트 제어기를 연결 
- `createEventDispatcher` 로 사용자 이벤트 생성
- 컴포넌트 간의 이벤트 전달 가능
  + 하부에서 상부로 : Inner -> Outer -> App
  + 상부에서 하부로 : App -> Outer -> Inner

```vue
<script>
  let m = { x: 0, y: 0 };

  function handleMousemove(event) {
    m.x = event.clientX;
    m.y = event.clientY;
  }
</script>

<!-- div 영역 내의 마우스 이동 이벤트 -->
<div on:mousemove={handleMousemove}>
  The mouse position is {m.x} x {m.y}
</div>
<!-- 이벤트 제어: once -->
<button on:click|once={handleClick}>
  Click me
</button>

<style>
  div { width: 100%; height: 100%; }
</style>
```

### 5) 바인딩

- 입출력 양방향 바인딩 (angular/vue 와 유사)
  + 단일값: `bind:DOM속성` 에 변수를 바인딩
  + 그룹값: `bind:group` 에 배열을 바인딩
  + 개체 자체에 바인딩: `bind:this`
- 포함된 하위 컴포넌트의 export 변수를 상위의 변수로 바인딩
  + `bind:value` 로 상위 컴포넌트의 변수에 연결

```vue
<script>
  let name = '';
</script>
<input bind:value={name} placeholder="enter your name">
<p>Hello {name || 'stranger'}!</p>

<script>
  let yes = false;
</script>
<label>
  <input type=checkbox bind:checked={yes}>
  Yes! Send me regular email spam
</label>
<button disabled={!yes}>
  Subscribe
</button>

<script>
  let todos = [
    { done: false, text: 'finish Svelte tutorial' },
    { done: false, text: 'build an app' },
    { done: false, text: 'world domination' }
  ];
  function add() {
    todos = todos.concat({ done: false, text: '' });
  }
  $: remaining = todos.filter(t => !t.done).length;
</script>
{#each todos as todo}
  <div><input .. {todo.done}><input .. {todo.text}></div>
{/each}
<p>{remaining} remaining</p>

<script>
  import { onMount } from 'svelte';
  let canvas;
  onMount(() => {
    // 마운트 Hook 함수 정의
    // => canvas 에 svg 개체 로딩
  });
</script>
<canvas
  bind:this={canvas}
  width={32}
  height={32}
></canvas>

<script>
  import Keypad from './Keypad.svelte';
</script>
<Keypad bind:value={pin} on:submit={handleSubmit}/>
```

### 5) 라이프사이클

> Angular 에도 onInit, onLoad 등의 Hook 함수가 있음. React 에도 useEffect 등의 Hook 함수가 있고, Vue 에도 있겠지.

- onMount : 컴포넌트가 렌더링 되는 시점?
  + 데이터를 불러와 바인딩 하는 작업을 기술
- onInterval : 주기적으로 실행, ex) 1초 마다
- beforeUpdate : 변경 전에 일어나야 할 사항을 정의
  + ex) div 의 세로 길이를 확장하고
- afterUpdate : 변경 이후에 일어나야 할 사항을 정의
  + ex) div 확장이 일어났으면, 하단으로 스크롤
- tick : 변경 사항이 즉시 반영되도록 작업 블럭을 다음으로 넘기기
  + ex) `await tick();` => 대문자로 변경된 문자열로 바뀜

```vue
<script>
  import { onMount } from 'svelte';
  import { beforeUpdate, afterUpdate } from 'svelte';

  let div;
  let autoscroll;

  beforeUpdate(() => {
    autoscroll = div && (div.offsetHeight + div.scrollTop) > (div.scrollHeight - 20);
  });

  afterUpdate(() => {
    if (autoscroll) div.scrollTo(0, div.scrollHeight);
  });

  let photos = [];

  onMount(async () => {
    const res = await fetch(`/tutorial/api/album`);
    photos = await res.json();
  });
</script>
```

### 6) Stores (공유 데이터)

Rxjs 의 observable, subscribe 방식을 사용하는 것으로 보임

- observable 값을 가져올 때, 
  + subscribe 함수로 받아서 변수에 대입하거나
  + 또는 `$변수` 를 마크업에 직접 사용
- 쓰임새에 따라 쓰기(writable), 또는 읽기전용(readable)로 생성
  + 파생 데이터로 derived 함수를 사용 (pipe로 클론 생성)
- 커스텀 스토어를 정의할 때는 함수로 정의
  + 갱신된 값을 전달하는게 아니라, 값을 다루는 함수를 전달

> 별도의 js 에서 공유 데이터 변수를 선언하고

```js
import { writable } from 'svelte/store';
export const count = writable(0);
```

> 하위 컴포넌트에서 공유 데이터 변수의 update 로직을 작성

```vue
<script>
  import { count } from './stores.js';

  function decrement() {
    count.update(n => n - 1);
  }
</script>

<button on:click={decrement}>
  -
</button>
```

> 상위 컴포넌트에서 subscribe 하여 변수에 바인딩한다.

```vue
<script>
  import { count } from './stores.js';
  import Incrementer from './Incrementer.svelte';
  import Decrementer from './Decrementer.svelte';
  import Resetter from './Resetter.svelte';

  let countValue;

  const unsubscribe = count.subscribe(value => {
    countValue = value;
  });
</script>

<h1>The count is {countValue}</h1>

<Decrementer/>
```

### 7) 애니메이션

- Motion : 움직임의 분산을 작게 또는 크게
- Transitions : 사라지거나, 이동하거나, 회전하거나 바꾸거나 
- Animations : DOM 개체를 움직이게 함, ex) 그룹간 아이템 이동
- Easing : 이동간 움직임을 스무딩하게 조절
- SVG : ex) 아날로그 시계, 막대 차트

### 8) Actions

- 다양한 사용자 인터랙션
  + ex) 외곽 클릭, 마우스 길게 누르기, 드래그

### 9) 그 외 다양한 엘리먼트들

- 트리형 메뉴
- 지도
- 아이템 리스트 
- ... (아뭏튼 다양하다)

### 10) 디버깅

렌더링 될 때마다, console 창에 값을 출력

```vue
<script>
  let user = {
    firstname: 'Ada',
    lastname: 'Lovelace'
  };
</script>

<input bind:value={user.firstname}>
<input bind:value={user.lastname}>

{@debug user}

<h1>Hello {user.firstname}!</h1>
```

## 2. Svelte Typescript Tutorial

참고 [Source code for Svelte Tutorials at MDN Web docs](https://github.com/opensas/mdn-svelte-tutorial)

> 예제에서는 `sirv-cli` 를 사용하지만, 최신 svelte 는 ts 템플릿을 자체적으로 지원하기 때문에 svelte 을 사용하는 것이 옳다.

### 1) Getting started

프로젝트 생성시, 옵션 선택에서 typescript 를 선택하면 된다.

```shell
$ npm create svelte@latest my-ts-app
# ==> Add type checking with TypeScript? › Yes, using TypeScript syntax
$ cd my-ts-app
$ npm install
$ npm run dev -- --open
```

`npm create vite@latest my-ts-project -- --template svelte-ts`

- 이런 방식으로 할 수도 있지만, svelte 쪽이 더 최신 버전을 사용한다.
- 그리고 아래 두 파일에 설정 추가가 필요하다.
  + vite.config.js : vite 실행시 옵션
  + tsconfig.json : 타입스크립트 컴파일 옵션

#### vite.config.js

import 의 경로를 좀 더 명확히 하기 위해 `$root` 디렉토리를 정의한다.

```js
const config = {
  resolve: {
    alias: {
      $root: path.resolve('./src'),
    },
  },
}
```

#### tsconfig.json

별도의 ts 파일 등을 작성했을 때, import 관련하여 vscode 의 경고 메시지가 뜨는데 이를 방지를 위해 다음과 같은 설정이 필요하다.

- 컴파일 범위와 컴파일에 포함되는 파일 타입을 명시

```js
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "$root/*": ["./src/*"]
    }
  },
  "include": [
    "src/**/*.d.ts",
    "src/**/*.ts",
    "src/**/*.js",
    "src/**/*.svelte"
  ]
}
```


### 2) TS 로 작성된 svelte

> lang=ts 를 명시한 script 태그 안에 typescript 로 작성한다.

```vue
<script lang="ts">
  import axios from 'axios';

  interface User {
  // type User = {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };

  type userData = {
    data: User[];
  };

  const getUsersData = async (url: string): Promise<User[]> => {
    const { data, status } = await axios.get<userData>(url);
    if (status === 200) {
        console.log(JSON.stringify(data.data));
        return data.data;
    } else {
        throw new Error('Something went wrong');
    }
  };

  const usersRespose = getUsersData("https://reqres.in/api/users");
</script>

{#await usersRespose}
  <p>...loading</p>
{:then result}
  {#each result as user}
    <div class="user">
      <p>{user.id} - {user.first_name} {user.last_name}</p>
      <img src={user.avatar} alt={user.name}>
    </div>
  {/each}
{:catch error}
  <p>Upps! {error}</p>
{/await}

<style>
  .user {
    display: flex;
    align-items: center;
    margin: 20px;
  }
  .user img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-left: 10px;
  }
</style>
```

#### TS: interface 과 type

interface 와 type 은 역활이 거의 동일하다. 

- 커스텀 타입을 정의하고
- `extends` 로 타입 확장이 가능하다.

다만, 차이점은 (interface 의 제한점)

- interface 는 object 에 대해서만 정의할 수 있고
- interface 는 동일 이름으로 재정의가 가능하다 (덮어쓰기)
- interface 는 computed value 를 사용할 수 없다. (계산 필드)

> 결론은 외부 인터페이스를 위해 interface 를 사용하고, 그 외에는 type 을 사용하는 것이 맞다. 다층 구조의 type 내부 필드에 복합 object 가 사용된 경우 interface 로 정의하자.

> interface 는 타입 체크 기능이 type 보다 약하다. 따라서 외부에서 오는 데이터에 사용하거나, 강한 제약이 필요하지 않은 느슨한 처리에 사용하자.

- type 으로 뭉쳐서 정의해도 되지만

```ts
type BookListItemProps = {
  // 내부의 복합 오브젝트
  item: {
    title: string,
    image: string,
    price: string,
    author: string,
    pubdate: string
  },
  index: number
}
```

- 이렇게 쪼개어 놓는 것이 가독성이 좋다.

```ts
interface Item {
  title: string,
  image: string,
  price: string,
  author: string,
  pubdate: string
};

type BookListItemProps = {
  index: number,
  item: Item
}
```

### 3) 배포

- Github 로부터 [Vercel 클라우드](https://vercel.com/)에 직접 배포 (CI/CD)
  + [svelte-ts-todo-app.vercel.app](https://svelte-ts-todo-app.vercel.app/)

- 또는 vite 를 직접 실행하여 nginx 에서 서브 디렉토리에 연결

```shell
$ npm run preview
$ npx vite preview --host 0.0.0.0
```

#### nginx 의 sub-path 연결하기 (base 설정)

App 을 sub-path 에 매칭하기 위해서는 app 의 base path 설정이 필요하다.

- `localhost:4173/app/todo` 에서 실행되는지 확인하고
  + base path 설정 안하면, 기본 '/'를 사용하기 때문에 css, js 파일 등의 assets 로딩이 실패한다.
- nginx 의 /app/todo 에 Svelte App 연결

참고 [Dev server does not apply base path correctly #2958](https://github.com/sveltejs/kit/issues/2958#issuecomment-993442115)

> svelte.config.js

```js
const config = {
  kit: {
    adapter: adapter(),
    paths: {
      base: '/app/todo'
    }
  }
};
```

> nginx.conf

```conf
server {
  listen       80;
  listen       [::]:80;
  server_name  test.jeju.onl;

  location /app/todo {
    proxy_pass http://127.0.0.1:4173/app/todo;
  }
}
```

## 3. 장단점

참고

- [Svelte vs Vue: 상위 프런트 엔드 프레임워크 비교 (2022.9)](https://procoders.tech/blog/svelte-vs-vue-frameworks-comparison/)
- [Svelte.js Guide: The Framework to Write Faster JavaScript](https://snipcart.com/blog/svelte-js-framework-tutorial)

|     | Svelte | React | Vue |
| :-- | :--    | :--   | :-- |
| App Performance | Faster than React and Vue | Slower than Svelte and slightly slower than Vue | Slower than Svelte but slightly faster than React |
| Architecture | JavaScript compiler | DOM | Virtual DOM |
| Average app size | 15 kb | 193 kb | 71 kb |
| Learning curve | Easy to learn | Relatively easy to learn | Relatively easy to learn |

> NPM Trends : React vs Angular vs Svelte vs Vue

![React vs Angular vs Svelte vs Vue](https://procoders.tech/wp-content/webp-express/webp-images/doc-root/wp-content/uploads/2021/07/image4-3-1024x490.png.webp){: width="600"}

- 현시점에서 React, Angular, Vue 다음으로 4위를 차지하고 있다.
  + 하지만 개발자 호응도가 좋아 성장 가능성은 높다.
  + 여차하면 Vue 로 갈아탈 수도 있지 않을까

### 1) 장점

- 사용하기 쉽다.
- 가상 DOM 없이 코드를 컴파일한다. (최적화, 컴파일 성능 향상)
  + 런타임 오버헤드가 낮아짐. 부드러운 전환과 빠른 렌더링 효과
- 자동화된 업데이트 (사용자경험 향상)
  + 가상DOM 에 반영될 때까지 기다릴 필요 없음
  + _cf._ React 와 Vue 는 가상DOM 을 사용

### 2) 단점

- Google, Facebook 같은 주요 지원이 없음
- 소규모 커뮤니티
- 라우팅 문제 : 라우터에 페이지를 정의한다. (라우터가 꼭 필요함)
- React Native 같은 크로스 플랫폼 앱은 불가능
  + 어차피 Flutter 사용할거니깐

## 9. Summary

- Vue 와 유사점이 많다. [참고](https://blog.logrocket.com/svelte-vs-vue-comparing-framework-internals/)
  + 일단 해보고, 필요하면 Vue 로 갈아타자.
- 이거 하나면 React & Next 를 굳이 배울 필요가 있나 싶다.
  + 흰 고양이든 검은 고양이든 쥐만 잘 잡으면 된다. 

- 다음으로 간단한 애플리케이션을 다뤄보자. (라우팅 포함)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
