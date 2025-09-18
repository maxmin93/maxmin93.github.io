---
date: 2024-03-08 00:00:00 +0900
title: Svelte 5 Runes - Supabase DB
description: Svelte 5 기능을 연습하기 위해 Todo 앱 만들기를 연습합니다. 이전 과정에 이어서 supabase DB 와 연동하는 부분까지 진행합니다.
categories: [Frontend, Svelte]
tags: [supabase]
image: "https://i.ytimg.com/vi/uOI77E8Y95Q/sddefault.jpg"
hidden: true
---

> 목록
{: .prompt-tip }

- [Svelte 5 Runes](/posts/svelte5-runes-tutorial/) : features
- [Svelte 5 Runes - Todo App](/posts/svelte5-runes-example1/)
- [Svelte 5 Runes - Supabase Auth](/posts/svelte5-runes-example2/)
- [Svelte 5 Runes - Supabase DB](/posts/svelte5-runes-example3/) &nbsp; &#10004;


## 0. 개요

- 프레임워크 : bun + svelte 5 preview + TS
- 컴포넌트 : tailwind + daisyui + lucide(icons)
  - theme-change : light/dark 테마 변경
  - svelte-remixicon : line 과 filled 스타일 아이콘 2850개
- 인증 : supabase ssr
  - 이메일 인증 방식이라서 supabase cloud 프로젝트가 필요함
- 데이터베이스 : supabase pg
  - user 로그인, todos 테이블


## 1. Svelte 5 preview + Supabase

상세 설정은 상단에 나열된 이전 포스트들을 참고하세요.

### svelte 5 runes 프로젝트 생성

```bash
bun create svelte@latest svlt5-auth-app
  # - Skeleton project
  # - Typescript
  # - Prettier, Svelte5 preview

cd svlt5-auth-app
bun install

# bun runtime
bunx --bun vite dev
```

### supabase 설정

```bash
# ssr 패키지
bun add @supabase/ssr @supabase/supabase-js

cat <<EOF > .env.local
PUBLIC_SUPABASE_URL={프로젝트 URL}
PUBLIC_SUPABASE_ANON_KEY={프로젝트 익명 KEY}
EOF
```

## 2. Todo App 연결

### SVG 아이콘

예약어 `class` 를 피해서 class 속성을 전달하기 위한 $props 사용 방법이다.

- `$props` 의 나머지 속성값들을 restProps 로 받은 후, class 를 추출하여 사용
  - Svelte 5 에서 `$$props`, `$$restProps` 등은 없어졌다.

> `$lib/assets/icons/ri-sun-line.svelte`

```html
<script>
  // $props() 하나만 존재할 수 있다. (중복 호출 안됨)
  let { size = '1em', color = 'currentColor', label = '', ...restProps } = $props();
 
  let customClass = restProps.class ?? '';
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill={color}
  width={size}
  height={size}
  aria-label={label ? label : undefined}
  aria-hidden={!label ? 'true' : undefined}
  role={label ? 'img' : undefined}
  class="remixicon ri-sun-line {customClass}"
  ><path
    d="M12 18C8.68629 ... 11V13H1V11H4Z"
  ></path></svg
>
```

> `+page.svelte`

```html
<script>
  import { RiSunLine, RiMoonLine } from '$lib/assets';
</script>

<RiSunLine class="bg-primary" size="20px" />
```

### [TailwindCSS - 반응형 NavBar](https://tw-elements.com/learn/te-foundations/tailwind-css/containers/)

```html
<!-- Navbar -->
<nav
  class="flex-no-wrap relative flex w-full items-center justify-between bg-neutral-100 py-2 shadow-md shadow-black/5 dark:bg-neutral-600 dark:shadow-black/10 lg:flex-wrap lg:justify-start lg:py-4"
  data-twe-navbar-ref>
  <!-- Here add a container -->
  <div
    class="container mx-auto flex w-full flex-wrap items-center justify-between px-3">
    <!-- Hamburger button for mobile view -->
    <button
      class="block border-0 bg-transparent px-2 text-neutral-500 hover:no-underline hover:shadow-none focus:no-underline focus:shadow-none focus:outline-none focus:ring-0 dark:text-neutral-200 lg:hidden"
      type="button"
      data-twe-collapse-init
      data-twe-target="#navbarSupportedContent1"
      aria-controls="navbarSupportedContent1"
      aria-expanded="false"
      aria-label="Toggle navigation">
      <!-- Hamburger icon -->
      <span class="[&>svg]:w-7">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          class="h-7 w-7">
          <path
            fill-rule="evenodd"
            d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
            clip-rule="evenodd" />
        </svg>
      </span>
    </button>

    <!-- Collapsible navigation container -->
    <div
      class="!visible hidden flex-grow basis-[100%] items-center lg:!flex lg:basis-auto"
      id="navbarSupportedContent1"
      data-twe-collapse-item>
      <!-- Logo -->
      <a
        class="mb-4 me-2 mt-3 flex items-center text-neutral-900 hover:text-neutral-900 focus:text-neutral-900 dark:text-neutral-200 dark:hover:text-neutral-400 dark:focus:text-neutral-400 lg:mb-0 lg:mt-0"
        href="#">
        <img
          src="https://tecdn.b-cdn.net/img/logo/te-transparent-noshadows.webp"
          style="height: 15px"
          alt=""
          loading="lazy" />
      </a>
      <!-- Left navigation links -->
      <ul
        class="list-style-none me-auto flex flex-col ps-0 lg:flex-row"
        data-twe-navbar-nav-ref>
        <li class="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
          <!-- Dashboard link -->
          <a
            class="text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-zinc-400"
            href="#"
            data-twe-nav-link-ref
            >Dashboard</a
          >
        </li>
        <!-- Team link -->
        <li class="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
          <a
            class="text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
            href="#"
            data-twe-nav-link-ref
            >Team</a
          >
        </li>
        <!-- Projects link -->
        <li class="mb-4 lg:mb-0 lg:pe-2" data-twe-nav-item-ref>
          <a
            class="text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 lg:px-2 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
            href="#"
            data-twe-nav-link-ref
            >Projects</a
          >
        </li>
      </ul>
    </div>

    <!-- Right elements -->
    <div class="relative flex items-center">
      <!-- Cart Icon -->
      <a
        class="me-4 text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
        href="#">
        <span class="[&>svg]:w-5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-5 w-5">
            <path
              d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
          </svg>
        </span>
      </a>

      <!-- Container with two dropdown menus -->
      <div class="relative" data-twe-dropdown-ref>
        <!-- First dropdown trigger -->
        <a
          class="hidden-arrow me-4 flex items-center text-neutral-500 hover:text-neutral-700 focus:text-neutral-700 disabled:text-black/30 dark:text-neutral-200 dark:hover:text-neutral-300 dark:focus:text-neutral-300 [&.active]:text-black/90 dark:[&.active]:text-neutral-400"
          href="#"
          id="dropdownMenuButton1"
          role="button"
          data-twe-dropdown-toggle-ref
          aria-expanded="false">
          <!-- Dropdown trigger icon -->
          <span class="[&>svg]:w-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="h-5 w-5">
              <path
                fill-rule="evenodd"
                d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                clip-rule="evenodd" />
            </svg>
          </span>
          <!-- Notification counter -->
          <span
            class="absolute -mt-2.5 ms-2 rounded-[0.37rem] bg-danger px-[0.45em] py-[0.2em] text-[0.6rem] leading-none text-white"
            >1</span
          >
        </a>
        <!-- First dropdown menu -->
        <ul
          class="absolute left-auto right-0 z-[1000] float-left m-0 mt-1 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-neutral-700"
          aria-labelledby="dropdownMenuButton1"
          data-twe-dropdown-menu-ref>
          <!-- First dropdown menu items -->
          <li>
            <a
              class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
              href="#"
              data-twe-dropdown-item-ref
              >Action</a
            >
          </li>
          <li>
            <a
              class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
              href="#"
              data-twe-dropdown-item-ref
              >Another action</a
            >
          </li>
          <li>
            <a
              class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
              href="#"
              data-twe-dropdown-item-ref
              >Something else here</a
            >
          </li>
        </ul>
      </div>

      <!-- Second dropdown container -->
      <div class="relative" data-twe-dropdown-ref>
        <!-- Second dropdown trigger -->
        <a
          class="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none"
          href="#"
          id="dropdownMenuButton2"
          role="button"
          data-twe-dropdown-toggle-ref
          aria-expanded="false">
          <!-- User avatar -->
          <img
            src="https://tecdn.b-cdn.net/img/new/avatars/2.jpg"
            class="rounded-full"
            style="height: 25px; width: 25px"
            alt=""
            loading="lazy" />
        </a>
        <!-- Second dropdown menu -->
        <ul
          class="absolute left-auto right-0 z-[1000] float-left m-0 mt-1 hidden min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg data-[twe-dropdown-show]:block dark:bg-neutral-700"
          aria-labelledby="dropdownMenuButton2"
          data-twe-dropdown-menu-ref>
          <!-- Second dropdown menu items -->
          <li>
            <a
              class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
              href="#"
              data-twe-dropdown-item-ref
              >Action</a
            >
          </li>
          <li>
            <a
              class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
              href="#"
              data-twe-dropdown-item-ref
              >Another action</a
            >
          </li>
          <li>
            <a
              class="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-white/30"
              href="#"
              data-twe-dropdown-item-ref
              >Something else here</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</nav>
<!-- Navbar -->
```


### Mobile Layout

그냥 보이기가 밋밋해서 겉에 모바일 프레임을 씌워보았다. 

- demo 용 모바일 프레임만 가져옴 : [출처](https://www.tailwindawesome.com/resources/astroship-starter/demo)
  - snippet 으로 프레임 상단에 title 출력
- 세로축 스크롤바 `overflow-y-scroll` : 콘텐츠 영역의 왼쪽 밀림 현상을 방지
- 프레임 안에서 Todo App 상단 띄우기 `relative top-4`

> `components/mobile-frame.svelte`

```html
<script>
  /** @type { {
   *    children: import('svelte').Snippet,
   *    title: import('svelte').Snippet
   *  } } */
  const { children, title } = $props();
</script>

<section class="px-4 py-8 leading-6 text-gray-700 sm:px-6 lg:px-8">
  <div
    class="mx-auto w-full max-w-md transform duration-500 ease-in-out"
    data-class-toggler-target="toggleable"
  >
    <div class="relative top-4">
      <div class="overflow-hidden rounded-xl shadow-xl" style="transform-origin: right center;">
        <div class="flex h-7 items-center space-x-1 rounded-t-xl bg-gray-200 pl-3">
          {#if title}
            {@render title()}
          {:else}
            <span class="inline-block w-full pl-20 align-bottom font-bold">TITLE</span>
          {/if}
        </div>
        <div class="h-[calc(100vh_-_10.75rem)] w-full overflow-y-scroll rounded-b-xl align-middle">
          {#if children}
            {@render children()}
          {/if}
        </div>
      </div>
    </div>
  </div>
</section>
```

> `todos/+page.svelte`

```html
<script>
  import MobileLayout from '$lib/components/mobile-frame.svelte';
</script>

<MobileLayout>
  {#snippet title()}
    <span class="inline-block w-full pl-20 align-bottom font-bold">TODO</span>
  {/snippet}

  <div class="relative top-4 flex flex-col items-center gap-6">
  <!-- Todo App ... -->
  </div>
</MobileLayout>  
```

### Todo App 





### App Login



## 3. Todo 테이블 연동

**읽어두기** : [SvelteKit 블로그 - API 만들기](https://sveltekit.io/blog/sveltekit-api)

### API 엔드포인트 타입 안정성 검사

### [zod 를 활용한 검사](https://sveltekit.io/blog/sveltekit-backend#are-form-actions-type-safe)

```js
import { z } from 'zod';
import { fail } from '@sveltejs/kit';

const schema = z.object({
  email: z.string(),
  password: z.string()
});

export const actions = {
  login: async function ({ cookies, request }) {
    const form = event.request.formData();
    const object = Object.fromEntries(form.entries());
    const { success, data, error } = schema.safeParse(object);

    if (!success) {
      return fail(422, { object, errors: error.issues });
    }
    const user = await db.getUser(email);
    cookies.set('sessionid', await db.createSession(user), { path: '/' });
    return { success: true };
  } // other actions...
};
```

#### [Superforms 을 이용한 검사](https://sveltekit.io/blog/sveltekit-backend#superforms)

> 사용 예시

```html
<script lang="ts">
  import type { PageData } from './$types';
  import { superForm } from 'sveltekit-superforms/client';

  export let data: PageData;
  const { form } = superForm(data.form);
</script>

<form method="POST">
  <label for="email">Name</label>    
  <input type="text" name="email" bind:value={$form.email} />

  <label for="password">Email</label>    
  <input type="password" name="password" bind:value={$form.password} />

  <button>Submit</button>
</form>
```

```js
const schema = z.object({
  email: z.string(),
  password: z.string()
});

// ... imports, schema and load function

export const actions = {
  default: async function ({ request }) {
    const form = await superValidate(request, schema);

    if (!form.valid) {
      return fail(400, { form });
    } // Do something with the valid form.data

    return { form };
  }
};
```

## 9. Review

- 작성중


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
