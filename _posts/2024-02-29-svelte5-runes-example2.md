---
date: 2024-02-29 00:00:00 +0900
title: Svelte 5 Runes - Supabase Auth
description: Svelte 5 기능을 연습하기 위해 Todo 앱 만들기를 연습합니다. 이전 과정에 이어서 supabase 로그인과 저장까지 진행합니다.
categories: [Backend, Supabase]
tags: [svelte, auth]
image: "https://i.ytimg.com/vi/uOI77E8Y95Q/sddefault.jpg"
---

> 목록
{: .prompt-tip }

- [Svelte 5 Runes](/posts/svelte5-runes-tutorial/) : features
- [Svelte 5 Runes - Todo App](/posts/svelte5-runes-example1/)
- [Svelte 5 Runes - Supabase Auth](/posts/svelte5-runes-example2/) &nbsp; &#10004;


## 0. 개요

- 프레임워크 : bun + svelte 5 preview + TS
- 컴포넌트 : tailwind + daisyui + lucide(icons)
  - theme-change : light/dark 테마 변경
  - svelte-persisted-store : localStorage 읽기/쓰기
- 인증 : supabase ssr
  - 이메일 인증 방식이라서 supabase cloud 프로젝트가 필요함
- 데이터베이스 : supabase
  - user 로그인, todos 테이블


## 1. Supabase Auth 예제

> 참고자료

- [Supabase SSR Auth with SvelteKit](https://dev.to/kvetoslavnovak/supabase-ssr-auth-48j4)

> TS 버전으로 작성한 코드 구조 (빨간색 없음)

![](/2024/02/29-svlt5-auth-app-files.png){: width="200" .w-75}
_svlt5-auth-app-files_

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

### supabase 서버 코드

> `src/app.d.ts`

- 페이지 데이터에 session 등록
- 모든 이벤트에 전역변수로 supabase 와 getSession 함수 등록
  - FastAPI 의 depends 의존성 주입과 유사

```ts
import { SupabaseClient, Session } from '@supabase/supabase-js';

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient;
      getSession(): Promise<Session | null>;
    }
    interface PageData {
      session: Session | null;
    }
    // interface Error {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
```

> `src/hooks.server.ts`

- 서버 쿠키를 이용해 인증 정보를 다룬다 (get, set, remove)
  - path 에 따라서 쿠키 요구 범위를 정할 수 있다 ('/' 이면 이하 모든 URL)

- 쿠키에는 두가지 정보가 담긴다
  - sb-access-token : JWT 형태의 액세스 토큰
  - sb-refresh-token : 새로고침을 위한 임의의 문자열

- 로그인 직후 getSession 를 호출하면 저장된 세션을 수정할 여지가 없다.
  - 저장된 세션이 합당하다면 getUser 도 올바른 데이터를 반환한다.

- 데이터베이스에서 사용자가 삭제되었지만 여전히 브라우저에서 로그인 상태인 경우를 위해
  - 무효한 session 을 null 로 삭제

```ts
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';

export const handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      get: (key) => event.cookies.get(key),
      set: (key, value, options) => {
        event.cookies.set(key, value, { ...options, path: '/' });
      },
      remove: (key, options) => {
        event.cookies.delete(key, { ...options, path: '/' });
      }
    }
  });

  event.locals.getSession = async () => {
    const { data: getUserData, error: err } = await event.locals.supabase.auth.getUser();
    let {
      data: { session }
    } = await event.locals.supabase.auth.getSession();

    if (getUserData.user == null) {
      session = null;
    }
    return session;
  };

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === 'content-range';
    }
  });
};
```

> `src/routes/+layout.server.ts`

- 세션 정보는 페이지 요청시 마다 읽어들인다.

```ts
export const load = async (event) => {
  let session = await event.locals.getSession();
  return {
    session
  };
};
```

> `src/routes/auth/confirm/+server.ts`

- 멤버 추가 (register 또는 signup) 하면 OTP 인증을 요구하는데
- PKCE 흐름에 따라 token_hash 파라미터를 검사하여 진행한다.

```ts
import { redirect } from '@sveltejs/kit';
import type { VerifyOtpParams } from '@supabase/supabase-js';

/**
 * http://localhost:5173/auth/confirm?type=email&
 *   token_hash=pkce_c39601225...
 */
export const GET = async (event) => {
  const {
    url,
    locals: { supabase }
  } = event;
  const token_hash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  const next = url.searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash, type } as VerifyOtpParams);
    if (!error) {
      redirect(303, `/${next.slice(1)}`);
    }
  }

  // return the user to an error page with some instructions
  redirect(303, '/auth/auth-code-error');
};
```

#### Supabase : [Email rate limit exceeded for all auth requests](https://github.com/supabase/supabase/issues/15804)

인증 또는 auth 관련 요청 처리에 이메일을 사용하는데, supabase SMTP 에 대한 DDoS 공격 탓이라 사용에 제약이 있다. 그래서 상용 서비스에는 [custom SMTP 사용을 권장하고 있다.](https://supabase.com/docs/guides/platform/going-into-prod#availability)

- 1시간에 이메일 발송 4회 제한이라는데, 해보니깐 2번 정도면 막히는듯 싶다.
- 좀 짜증나긴 했지만 간격을 두고 테스트하니 되긴 되더라.

![](/2024/02/29-svlt5-auth-app-email.png){: width="440" .w-75}
_svelte5-auth-app-signup-email_

### supabase 클라이언트 코드

> `src/routes/+layout.ts`

- 브라우저를 위한 supabase 인증 클라이언트
  - 쿠키 가져오기 기능만 기술
  - 서버 API 호출을 위한 fetch 객체 연결

- `depends('supabase:auth')`
  - 블로그 저자가 매우 중요하다고 강조했다.
  - 식별자 이름은 변경 가능 (대부분 url 을 사용)
  - `invalidate('supabase:auth')` 를 통해 다시 load 하도록 지시
    - invalidateAll 로는 충분히 작동하지 않는 문제가 있는듯 함
  - 참고 : 언제 사용하나요? (fetch vs depends)
    - 서버에서 데이터를 한 번만 가져오려면 (SSR) 단순한 fetch를 사용
    - 데이터가 변경될 때마다 UI를 업데이트하려면 depends와 함께 fetch를 사용
  - 참고 : [JoyOfCode - SvelteKit API Endpoints And Loading Data For Pages](https://joyofcode.xyz/sveltekit-loading-data#how-load-functions-work)

```ts
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { combineChunks, createBrowserClient, isBrowser, parse } from '@supabase/ssr';

export const load = async ({ fetch, data, depends }) => {
  depends('supabase:auth');

  const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
    global: {
      fetch
    },
    cookies: {
      get(key) {
        if (!isBrowser()) {
          return JSON.stringify(data.session);
        }
        const cookie = combineChunks(key, (name) => {
          const cookies = parse(document.cookie);
          return cookies[name];
        });
        return cookie;
      }
    }
  });

  const {
    data: { session }
  } = await supabase.auth.getSession();

  return { supabase, session };
};
```

> `src/routes/+layout.svelte`

- layout server 모듈로부터 supabase 클라이언트를 가져온다
- `$props` 로부터 페이지 data 를 받고, `$derived` 로 변경시 업데이트 한다.
- [onMount](https://svelte.dev/docs/svelte#onmount) 는 `$effect` 와는 다르게 DOM 에 마운트 되고 한번만 실행된다.
  - 참고 : [Svelte 5 preview - $effect 가 대체하는 것](https://svelte-5-preview.vercel.app/docs/runes#$effect-what-this-replaces)

```svelte
<script>
  import { enhance } from '$app/forms';
  import { invalidate, invalidateAll, goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let { data } = $props();
  let { supabase } = $derived(data);

  onMount(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, _session) => {
      invalidate('supabase:auth');
      invalidateAll();
    });
    return () => subscription.unsubscribe();  // onDestroy
  });

  /** @type {import('@sveltejs/kit').SubmitFunction} */
  const submitLogout = async ({ cancel }) => {
    const { error } = await data.supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    cancel();
    await goto('/');
  };
</script>

<a href="/">Home</a>
<a href="/subscription">Subscriptions</a>

<span id="auth_header">
  {#if !data.session}
    <a href="/login">login</a> /
    <a href="/register">signup</a>
  {:else}
    <a href="/user_profile">User profile</a>
    <form action="/logout?/logout" method="POST" use:enhance={submitLogout}>
      <button type="submit">Logout</button>
    </form>
  {/if}
</span>

<slot />
```

## 2. Svelte 5 에서 활용

![](/2024/02/29-svlt5-auth-app-home.png){: width="320" .w-75}
_svelte5-auth-app-home_

### 로그인 페이지

> `src/routes/login/+page.server.ts`

```ts
import { fail, redirect } from '@sveltejs/kit';
import { AuthApiError } from '@supabase/supabase-js';
import type { SignInWithPasswordCredentials } from '@supabase/supabase-js';

export const actions = {
  login: async (event) => {
    const { request, url, locals } = event;
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');

    const { data, error: err } = await locals.supabase.auth.signInWithPassword({
      email: email,
      password: password
    } as SignInWithPasswordCredentials);

    if (err) {
      if (err instanceof AuthApiError && err.status === 400) {
        return fail(400, {
          error: 'Invalid credentials',
          email: email,
          invalid: true,
          message: err.message
        });
      }
      return fail(500, {
        message: 'Server error. Try again later.'
      });
    }

    redirect(307, '/');
  }
};

export async function load({ locals: { getSession } }) {
  const session = await getSession();
  if (session) {
    redirect(303, '/');
  }
}
```

> `src/routes/login/+page.svelte`

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  import type { ActionData } from './$types';

  let {
    form
  }: {
    form: {
      invalid?: boolean;
      email?: string;
      message?: string;
    } & ActionData;
  } = $props();
</script>

<h2>Log in</h2>
<form action="?/login" method="POST" use:enhance>
  <label for="email">email</label>
  <input name="email" type="email" value={form?.email ?? ''} required />
  <label for="password">password</label>
  <input name="password" required />
  <button type="submit">Login</button>
</form>
{#if form?.invalid}<mark>{form?.message}!</mark>{/if}

<p>Forgot your password? 
  <a href="/reset_password">Reset password</a>
</p>
```

#### svelte : Property does not exist on type 'never' js (2339)

formData 다룰 때, 이런 메시지가 자주 나오는데 빨간줄까지 그어져 신경쓰인다.

- 해결방법 : ActionData 타입 정의에 확장 속성을 추가하여 타입 선언을 하면 된다.
  - [예시](https://stackoverflow.com/questions/39672807/types-in-object-destructuring) `const {foo} : {foo: IFoo[]} = bar;`

![](/2024/02/29-svlt5-auth-app-signup.png){: width="320" .w-75}
_svelte5-auth-app-signup_

### 로그아웃 페이지

> `src/routes/logout/+page.server.ts`

```ts
import { redirect } from '@sveltejs/kit';

export const actions = {
  logout: async ({ locals }) => {
    await locals.supabase.auth.signOut();
    redirect(303, '/');
  }
};

export async function load() {
  redirect(303, '/');
}
```

다른 기능들은 대동소이해서 생략한다.

### Protected 페이지

#### 페이지에서 접근을 제어하는 방법

> `src/routes/+page.svelte`

- `+layout.ts` 에서 전달된 pageData 에서 session 을 꺼내어
- session 이 있으면 login 된 것으로 판단한다.
- 로그인 사용자의 경우, 합당한 데이터 또는 메뉴 링크를 노출하면 된다.
 
```svelte
<script>
  let { data } = $props();
  let { session } = $derived(data);
  $inspect(session);
</script>

<h1>Welcome to Svelte 5 TS</h1>
{#if session?.user}
  <p class="authenticated">You are authenticated.</p>
{/if}

<style>
  .authenticated {
    color: darkgreen;
    font-weight: bold;
  }
</style>
```

#### 서버 스크립트에서 접근을 제어하는 방법

> `src/routes/protected/+page.svelte`

- 로그인 된 사용자만 볼 수 있는 페이지

```html
<h1>Protected Page</h1>
<p>User should be authenticated.</p>
```

> `src/routes/protected/+page.server.ts`

- 페이지 데이터 로드 시점에서 session 또는 user 가 없으면 권한이 없는 것으로 판단
- redirect 로 메인 페이지 또는 로그인 페이지로 이동시킨다.

```ts
import { redirect } from '@sveltejs/kit';

export async function load({ locals: { getSession } }) {
  const session = await getSession();
  // if the user is not logged in redirect back to the home page
  if (!session || !session.user) {
    redirect(303, '/');
  }
}
```


## 3. UI 에서 반응형 활용

### Dropdown Menu 닫기

dropdown 형태의 Auth 메뉴를 구현하기 위해, 열린 후 바깥쪽을 클릭했을 때 닫히는 동작을 `$state` 로 구현했다.

- `menuAuthOpened` 반응형 변수 선언
- dropdown 메뉴를 닫는 closeDropdownMenu 함수 
- `$effect` 에서 outside 클릭 이벤트를 연결하고 해제
  - 열린 상태에서 click 이벤트 리스너를 연결한다. 
    - [once 옵션](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#once) : 1회 사용 후 리스너 자동 제거
  - 반응형 종료시 click 이벤트 리스너를 제거한다.

> `$inspect` 로깅을 보면 상태변경시 2번씩(초기값과 변경값) 찍힌다.

![](/2024/02/29-svlt5-dropdown-close.png){: width="440" .w-75}
_svelte-5-dropdown-close_

```svelte
<script>
  let menuAuthOpened = $state(false);

  $effect(() => {
    $inspect('detailEl:', menuAuthOpened);
    if (menuAuthOpened) {
      // once 옵션 : 최대 1번 호출되고 이후 자동 제거된다.
      document.body.addEventListener('click', closeDropdownMenu, { once: true });
    }
    return () => document.body.removeEventListener('click', closeDropdownMenu);
  });

  /**
   * details 의 open 상태 닫기
   * @param {Event} event Document Click Event
   */
  function closeDropdownMenu(event: Event) {
    menuAuthOpened = false;
  }  
</script>

<div class="container">
  <ul class="menu menu-horizontal px-1">
    <li><a href="/protected">Protected</a></li>
    <li>
      <details bind:open={menuAuthOpened}>
        <summary>Auth</summary>
        <ul class="z-20 float-right rounded-t-none bg-base-300 p-2">
          {#if !data.session}
            <li><a href="/login">login</a></li>
            <li><a href="/register">signup</a></li>
          {:else}
            <li><a href="/user_profile">Profile</a></li>
            <li>
              <form
                class="inline"
                action="/logout?/logout"
                method="POST"
                use:enhance={submitLogout}
              >
                <button type="submit">Logout</button>
              </form>
            </li>
          {/if}
        </ul>
      </details>
    </li>
  </ul>
</div>        
```

### dialog 자식 컴포넌트 제어

반응형 선언이 필요없는 경우인데, $state 사용하라고 메시지로 권고한다. [이슈 #10435](https://github.com/sveltejs/svelte/issues/10435) 에서 다뤄진 것처럼 무시하도록 반영될 듯하다. 거슬리지만 preview 버전인 만큼 그냥 넘어가야 한다.

- export const 또는 export function 을 통해 자식 메소드를 호출할 수 있다.

> parent

```svelte
<script>
  import { LoginDialog } from '$lib/components';

  /** @type { { open: ()=>void, close: ()=>void } } */
  let control;
  // [메시지]
  // showDialog is updated, but is not declared with $state(...).
  // Changing its value will not correctly trigger updates.

  /**
   * loginDialogEl 오픈
   * @param {Event} event
   */
  function openDialog(event) {
    control.open();
  }  
</script>

<button class="btn" onclick={openDialog}>open modal</button>

<LoginDialog bind:control />
<!-- <svelte:component this={LoginDialog} bind:control /> -->
```

> child

```svelte
<script>
  /** @type {HTMLDialogElement} */
  let dialogEl;

  export const control = {
    open: () => dialogEl.show(),
    close: () => dialogEl.close(),
  };
</script>

<dialog bind:this={dialogEl} class="modal">
  <!-- ... -->
</dialog>
```

### UI 라이브러리와 호환성

아직은 어떤 원인으로 그런지 모르겠지만, svelte 5 preview 가 딱지를 떼고 라이브러리들도 호환성 명시를 해주지 않는 이상 사용은 불가능한 것으로 보인다.

- svelte-lego 의 [clickOutsideAction](https://sveltelegos.com/guides/actions/clickOutsideAction) 을 넣어봤는데 안됨! (컴파일 오류)
- melt-ui 의 [Dropdown Menu](https://melt-ui.com/docs/builders/dropdown-menu) 를 넣어봤는데 안됨! (작동안함)

일단은 순수 tailwind 라이브러리인 daisyUI 를 사용하기로 한다. (잘됨)


## 9. Review

- 이전에 작성했던 Todo 기능까지 붙이려고 했지만, 분량이 길어 다음편으로 넘긴다.
- 공부 공부 또 공부..


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
