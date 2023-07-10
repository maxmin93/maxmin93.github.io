---
date: 2022-12-18 00:00:00 +0000
title: Svelte 공부하기 - 3일차
categories: ["nodejs","svelte"]
tags: ["frontend","tutorial","3rd-day"]
image: "https://assets.stickpng.com/images/584830e8cef1014c0b5e4aa0.png"
---

> 프론트엔드 프레임워크인 SvelteKit 에 대해 공부한다. 구조와 작동방식에 대해 살펴보자. (3일차)
{: .prompt-tip }

- [Svelte 공부하기 - 1일차](/posts/2022-12-07-svelte-tutorial-day1/) : Svelte
- [Svelte 공부하기 - 2일차](/posts/2022-12-14-svelte-tutorial-day2/) : SvelteKit + CSS
- [Svelte 공부하기 - 3일차](/posts/2022-12-18-svelte-tutorial-day3/) : SvelteKit 구조, 작동방식 &nbsp; &#10004;
- [Svelte 공부하기 - 4일차](/posts/2022-12-20-svelte-tutorial-day4/) : SvelteKit 애플리케이션 예제 
- [Svelte 공부하기 - 5일차](/posts/2022-12-30-svelte-tutorial-day5/) : Supabase 인증, DB 연동

## 1. SvelteKit 의 구조

참고 [JoyOfCode - How SvelteKit work](https://joyofcode.xyz/learn-how-sveltekit-works)

![sveltekit-key-items](https://raw.githubusercontent.com/mattcroat/joy-of-code/main/posts/learn-how-sveltekit-works/images/sveltekit.webp){: width="600"}

### 1) SvelteKit 의 구성요소

- 페이지 (파일 기반 라우팅)
- 엔드포인트 (API 경로)
- 중첩 레이아웃 (Nested layouts) : URL 세그먼트가 구성 요소 계층 구조에 매핑되기 때문에 중첩 파일보다 훨씬 강력함
- 핫 모듈 교체(HMR) : 응용 프로그램 상태를 유지하면서 변경을 수행할 때 브라우저에서 즉시 업데이트
- 전처리 (TypeScript, SCSS 및 Pug 등)
- 구성 요소 라이브러리 빌드 (npm 패키지 생성 및 게시)
- 배포 옵션 (모든 플랫폼용 어댑터)

### 2) SvelteKit 의 필수 파일들

- vite.config.js : sveltekit 플러그인 설정
- svelte.config.js : 전처리와 어댑터 설정 
- src
  - app.html : `%sveltekit.head%`, `%sveltekit.body%`
  - routes
    - +page.svelte

> SvelteKit 의 routes 내의 파일 타입

- +layout.svelte : 페이지의 레이아웃 (page slot 포함)
- +page.svelte : 페이지 (svelte)
- +page.ts/+layout.ts : 클라이언트와 서버 모두에서 실행 (범용)
  + 데이터 로딩: PageLoad, LayoutLoad 사용
- +page.server.ts/+layout.server.ts : 서버에서만 실행
  + 데이터 로딩: PageServerLoad, LayoutServerLoad 사용

그 외의 파일들은 무시됨 => $lib 디렉토리에 작성할 것

### 3) `.svelte-kit` 폴더

SvelteKit 프로젝트가 컴파일된 실제적인 결과물이 저장되는 폴더

`.svelte-kit/generated`{: .filepath} 디렉토리

- root.svelte : 진입점
- client-matchers.js : 페이지 매처 
- client-manifest.js : js 로딩을 위한 경로 생성

### 4) SvelteKit 실행을 위한 구성요소

![sveltekit-runtime-tools](https://raw.githubusercontent.com/mattcroat/joy-of-code/main/posts/learn-how-sveltekit-works/images/kit.webp){: width="600"}

- Vite plugin : SvelteKit (build, dev, preview)
- Node : Web API 생성
- Core : builder, CLI
- Runtime : 애플리케이션의 서버와 클라이언트 코드
- Packaging

## 2. SvelteKit 의 작동 방식

### 1) Hydration(용해) : Page 생성

![sveltekit-page-hydration](https://raw.githubusercontent.com/mattcroat/joy-of-code/main/posts/learn-how-sveltekit-works/images/hydration.webp){: width="520"}

쿠키 반죽을 오븐에 넣어 완성된 쿠기를 얻는 개념으로 설명할 수 있다.

- 건조한 HTML 을 전달하고
- download 된 js 의 모듈을 로딩하여
- js 에 의해 재생성된 HTML 을 출력

### 2) layout 과 page (블로그 slug 예제)

`+layout.svelte` 의 slot 영역에 `+page.svelte` 가 렌더링 된다.

- src/routes
  + blog/`[slug]`
    * +layout.ts : 데이터 처리용 범용 스크립트
    * +layout.svelte
    * +page.ts : 데이터 처리용 범용 스크립트
    * +page.svelte

#### 사전 렌더링

Page 스크립트가 템플릿에 용해(Hydration)되면서 렌더링이 완성된다.

```ts
import type { PageLoad } from './$types';

export const load = (({ params }) => {
  return {
    post: {
      title: `Title for "${params.slug}" goes here`,
      content: `<input type='text' class="form-input px-4 py-3 rounded-full" value="Content for ${params.slug} goes here" />`
    }
  };
}) satisfies PageLoad;
```
{: file="src/routes/blog/[slug]/+page.ts"}

```vue
<script lang="ts">
  import type { PageData } from './$types';

  export let data: PageData;
</script>

<h1>{data.post.title}</h1>
<div>{@html data.post.content}</div>
```
{: file="src/routes/blog/[slug]/+page.svelte"}

#### 데이터 로딩

$lib 에 데이터 소스를 작성하고, 레이아웃에서 로딩해보자.

> 데이터 소스(Source) : SportItems

```ts
// PageData 로 감싸버리기 때문에 export 할 필요가 없음
type Item = {
  slug: string;
  title: string;
  price: number;
};

export const SportItems = async (): Promise<Item[]> => {
  return [
    { slug: 'sport1', title: 'Baseball', price: 9.99 },
    { slug: 'sport2', title: 'Basketball', price: 14.99 },
    { slug: 'sport3', title: 'Golf', price: 19.99 },
    { slug: 'sport4', title: 'Football', price: 24.99 }
  ];
};
```
{: file="src/lib/api/items.ts"}

> 레이아웃 데이터 제공자(Provider) 

```ts
// +layout.server.ts 에서는 LayoutServerLoad 를 사용
import type { LayoutLoad } from './$types';
import { SportItems } from '$lib/api/posts';

export const load = (async () => {
  return {
    items: SportItems()
  };
}) satisfies LayoutLoad;
```
{: file="src/routes/blog/[slug]/+layout.ts"}

> 레이아웃 데이터 소비자(Consumer) 

```vue
<script lang="ts">
  import type { LayoutData } from './$types';

  export let data: LayoutData;
</script>

<main>
  <slot /><!-- 페이지 렌더링 영역 -->
</main>

<section>
  <h2>More posts</h2>
  <nav class="list-nav">
    <ul>
      {#each data.items as item}
        <li>
          <a href="/blog/{item.slug}">
            <span class="badge bg-primary-500">💀</span>
            <span class="flex-auto">{item.title} ({item.price})</span>
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</section>
```
{: file="src/routes/blog/[slug]/+layout.svelte"}

### 3) `+server.ts` 에서 RequestHandler 로 API 만들기

- src/routes
  + dogs
    * +server.ts

```ts
import type { RequestHandler } from '@sveltejs/kit';

interface dog {
  name: string;
}

const dogs: dog[] = [
  { name: 'German Shepherd' }, 
  { name: 'BullDog' }, 
  { name: 'Poodle' }
];

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify(dogs));
};
```
{: file="src/routes/dogs/+server.ts"}

브라우저에서 `http://localhost:5173/dogs` 열기

> RequestHandler 로 GET, POST, DELETE 등을 구현할 수 있다.

```json
[
  {
    "name": "German Shepherd"
  },
  {
    "name": "BullDog"
  },
  {
    "name": "Poodle"
  }
]
```
{: file="http://localhost:5173/dogs"}

## 3. SvelteKit 의 Core

### 1) 라우팅

#### API route 또는 엔드포인트

+page 에서 사용할 HTTP 동사에 해당하는 함수들을 정의

- RequestEvent 인자를 받아 Response 객체를 반환
- GET, POST, PATCH, PUT, DELETE
- +page 와 같은 디렉토리에 있을 수 있음
  + PUT/PATCH/DELETE 는 `+server.ts` 

> 예제 : 인수 a, b 를 받아 덧셈을 반환

```js
export const POST = (async ({ request }) => {
  const { a, b } = await request.json();
  return json(a + b);
}) satisfies RequestHandler;
```
{: file="src/routes/api/add/+page.ts"}

```js
async function add(){
  const response = await fetch('/api/add'. { 
    method: 'POST',
    body: JSON.stringify({ a, b }),
    // ... 
  })
  return await response.json();
}
```
{: file="src/routes/add/+page.svelte"}

#### `$types`

변수들은 `.svelte-kit/types`{: .filepath} 에 컴파일 되어 생성됨

- PageData 등으로 export 된 데이터 변수들을 감싸고 있음 
- PageLoad 등의 load 함수에서 인자와 반환값의 타입체크에 쓰임

### 2) form action

server 스크립트는 form 의 POST 데이터를 처리하는 action 을 정의

> 로그인 form POST 액션 정의 (default)

```ts
import type { Actions } from './$types';
 
export const actions: Actions = {
  default: async (event) => {
    // TODO log the user in
    return { success: true };
  }
};
```
{: file="src/routes/login/+page.server.ts"}

```vue
<form method="POST">
  <label>
    Email
    <input name="email" type="email">
  </label>
  <label>
    Password
    <input name="password" type="password">
  </label>
  <button>Log in</button>
</form>
```
{: file="src/routes/login/+page.svelte"}

### 3) 페이지 옵션

기본적으로 SvelteKit 은 서버에서 모든 구성요소를 사전 렌더링 하고 클라이언트에 HTML 을 전달합니다. 이후 브라우저에서 다시 렌더링하여 hydration(용해) 과정으로 상호작용을 수행합니다.

#### 사전 렌더링 : true/false/'auto'

false 가 아니면 사전 렌더링이 가능한 것으로 판단하고, 서버 스크립트를 적용하여 HTML 페이지를 생성합니다. (빠른 속도)

- 사전 렌더링시 액세스 해야 하는 페이지는 svelte.config.js 의 config.kit.prerender.entries 옵션에서 수동으로 지정할 수 있음
- `src/routes/blog/[slug]/+page.svelte`{: .filepath} 와 같은 페이지 매개변수를 기반으로 로드하는 페이지를 사전 렌더링할 수 있음

```js
export const prerender = true;
```
{: file="+page.js/+page.server.js/+server.js"}

#### SSR

ssr=false 이면 빈 페이지가 렌더링 된다. (클라이언트 렌더링)

```js
export const ssr = false;
```
{: file="+page.js"}

#### CSR

About 페이지 처럼 클라이언트 렌더링(JS)이 굳이 필요없는 경우 비활성 시킨다.

```js
export const csr = false;
```
{: file="+page.js"}

### 4) 어댑터

배포 목적에 따라 빌드용 어댑터를 설정할 수 있다.

- 기본은 auto 이고 vercel 등의 다양한 호스팅 서비스를 지원한다.
- node 배포시에는 adapter-node 을 사용
- 웹서버로 정적페이지 배포시 adapter-static 사용
  - 이 경우 사전 렌더링 옵션을 수동 설정한다. (prerender = true)

```js
// import adapter from '@sveltejs/adapter-auto';
// import adapter from '@sveltejs/adapter-node';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/kit/vite';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter()
    // paths: { base: '/app/todo' }
  }
};

export default config;
```
{: file="svelte.config.js"}

```console
$ npm i -D @sveltejs/adapter-static
# 어댑터 변경
$ vi svelte.config.js
# =================================
// 기본값 import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-static';  # 변경
# =================================
# SSR 옵션
$ echo "export const prerender = true;" > src/routes/+layout.ts

$ npm run build
> pico-svelte@0.0.1 build
> vite build

vite v4.0.1 building for production...
✓ 46 modules transformed.
오후 3:28:07 [vite-plugin-svelte] dom compile done.
package         files     time     avg
pico-svelte         6   82.4ms  13.7ms

vite v4.0.1 building SSR bundle for production...
✓ 52 modules transformed.
오후 3:28:07 [vite-plugin-svelte] ssr compile done.
package         files     time    avg
pico-svelte         5   13.1ms  2.6ms
@sveltejs/kit       1    2.6ms  2.6ms
...

$ ls -l build
drwxr-xr-x  4 bgmin  staff   128 12 15 15:28 _app
-rw-r--r--  1 bgmin  staff  2062 12 15 15:28 about.html
-rw-r--r--  1 bgmin  staff  1571 12 15 15:28 favicon.png
-rw-r--r--  1 bgmin  staff  1997 12 15 15:28 index.html
-rw-r--r--  1 bgmin  staff  3882 12 15 15:28 vite-manifest.json
```

## 9. Summary

- SvelteKit 공식 문서를 보는게 정답이다. (많이 헷갈렸다. 쉑~)
  + 검색에 나오는 자료는 이전 [Sapper](https://sapper.svelte.dev/docs/) 의 내용을 담고 있다.
- `+page`, `+layout` 접두사를 사용한다. (이외는 무시됨)
  + `+server` 는 GET/POST 같은 [RequestHandler](https://kit.svelte.dev/docs/routing#server) 용도로만 사용한다.

### 중요 용어

- **SSR** _(server-side rendering)_  : 브라우저 요청으로 서버가 생성
- **CSR** _(client-side rendering)_  : 브라우저의 JS에서 페이지 생성
- **SSG** _(static site generation)_ : 빌드 타임에 페이지 생성
- **SPA** _(single page application)_: 경로 변경시 로드가 필요 없는 앱으로 CSR 로 모든 것을 처리
- **MPA** _(multi page application)_ : SPA 의 반대개념의 앱으로 SSR 을 사용하여 페이지마다 로드 (SPA 보다 빠르다)


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
