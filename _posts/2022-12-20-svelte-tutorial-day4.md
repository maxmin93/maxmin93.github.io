---
date: 2022-12-20 00:00:00 +0000
title: Svelte 공부하기 - 4일차
categories: ["nodejs","svelte"]
tags: ["frontend","tutorial","4th-day"]
image: "https://assets.stickpng.com/images/584830e8cef1014c0b5e4aa0.png"
---

> 프론트엔드 프레임워크인 SvelteKit 에 대해 공부한다. 간단한 애플리케이션을 만들어보자. (4일차)
{: .prompt-tip }

- [Svelte 공부하기 - 1일차](/posts/2022-12-07-svelte-tutorial-day1/) : Svelte
- [Svelte 공부하기 - 2일차](/posts/2022-12-14-svelte-tutorial-day2/) : SveltKit + CSS
- [Svelte 공부하기 - 3일차](/posts/2022-12-18-svelte-tutorial-day3/) : SveltKit 구조, 작동방식
- [Svelte 공부하기 - 4일차](/posts/2022-12-20-svelte-tutorial-day4/) <span style='font-size:1.5rem;'>&nbsp; &#10004;</span>

## 1. Form Actions 와 `use:enhance` 를 이용한 메모장

출처: [Progressive Enhancement in SvelteKit (use:enhance)](https://www.youtube.com/watch?v=jXtzWMhdI2U)

![20-example01-memo](/2022/12/20-example01-memo.png){: width="600"}
_memo 애플리케이션 캡쳐_

- 페이지 새로고침 없이 메모 추가/삭제
  + Form 의 Submit 을 SvelteKit 의 Actions 과 연결: create, delete
- Skeleton 의 Toast 컴포넌트 사용
- create 실패시 fail 처리
  + SvelteKit 의 ActionData 로 돌려받아 오류 메시지 출력

### +page.server.ts

- Actions 의 파라미터는 RequestEvent 타입이다.
- Actions 으로 create, delete 를 정의
- create 액션의 (제목 길이) 제약사항 위반시 fail 반환
  + ActionFailure 객체는 작업을 취소하고 ActionData 반환
  + ==> 클라이언트에서 오류 메시지 출력

```ts
import type { RequestEvent } from './$types';
import { fail } from '@sveltejs/kit';  // ActionFailure 객체

type Note = {
  title: string;
  content?: string;
};

let notes: Note[] = [
  {
    title: 'Progressive Enhancement',
    content: 'use:enhance is cool 👍'
  }
];

/** @type {import('./$types').PageServerLoad} */
export const load = () => {
  return {
    notes
  };
};

/** @type {import('./$types').Actions} */
export const actions = {
  create: async ({ request }: RequestEvent) => {
    const data = Object.fromEntries(await request.formData()) as Note;
    console.log('data.title.length:', data.title.length);
    if (data.title.length < 2) {
      return fail(400, {
        data: data,
        errorMsg: '❌ Title must not be empty! (server)'
      });
    }
    notes.push(data);
    return {
      data: undefined,
      errorMsg: undefined
    };
  },
  delete: async ({ request }: RequestEvent) => {
    const data = Object.fromEntries(await request.formData()) as Note;
    notes = notes.filter((note) => note.title !== data.title);
    return {
      data: undefined,
      errorMsg: undefined
    };
  }
};
```
{: file="src/routes/memo/+page.server.ts"}

### +page.svelte

- form action="?/create" 에 submitCreateNote 함수 연결
  + server 의 create 액션에 연결
- form action="?/delete" 에 submitDeleteNote 함수 연결
  + server 의 delete 액션에 연결

> arguments

- form : ActionData
  + 오류 메시지 출력
- data : PageData
  + 서버에서 클라이언트로 전달되는 title, content 데이터 (memo)

```vue
<script lang="ts">
  import { enhance, type SubmitFunction } from '$app/forms';
  import type { ActionData, PageData } from './$types';
  import { type ToastSettings, toastStore } from '@skeletonlabs/skeleton';

  export let data: PageData;
  export let form: ActionData;

  const triggerToast = (message: string, label = 'success'): void => {
    const t: ToastSettings = {
      message: message,
      // ...
    };
    toastStore.trigger(t);
  };

  const submitCreateNote: SubmitFunction = ({ form, data, action, cancel }) => {
    const { title, content } = Object.fromEntries(data);

    if (title.length < 1) {
      triggerToast('Title cannot be blank!', 'error');
      cancel();
    }

    return async ({ result, update }) => {
      switch (result.type) {
        case 'success':
          triggerToast('Note added!', 'success');
          break;
        case 'invalid':
          triggerToast('Title cannot be blank', 'error');
          break;
        default:
          break;
      }
      await update();
    };
  };

  const submitDeleteNote: SubmitFunction = () => {
    return async ({ result, update }) => {
      switch (result.type) {
        case 'success':
          triggerToast('Deleted note!', 'success');
          break;
        default:
          break;
      }
      await update();
    };
  };
</script>

<div class="grid grid-cols-2 gap-10 pt-4 pl-4 pr-4">
  <div class="side">
    <form action="?/create" method="POST" class="form-create" use:enhance={submitCreateNote}>
      <label for="title"> Title </label>
      <input type="text" name="title" />
      <label for="content">Content</label>
      <input type="text" name="content" />
      <button type="submit" class="btn btn-filled-primary btn-sm w-48">Add</button>
      {#if form?.errorMsg}
        <div class="alert error">{form.errorMsg}</div>
      {/if}
    </form>
  </div>
  <div class="side">
    {#each data.notes as note}
      <div class="note">
        <div>
          <h4>{note.title}</h4>
          <p>{note.content}</p>
        </div>
        <form action="?/delete" method="POST" use:enhance={submitDeleteNote}>
          <input type="hidden" name="title" value={note.title} />
          <button type="submit">❌</button>
        </form>
      </div>
    {/each}
  </div>
</div>
```
{: file="src/routes/memo/+page.svelte"}

## 2. PageLoad 로 JSON 데이터 전달하기

참고 [SvelteKit Tutorial (Crash Course)](https://www.youtube.com/playlist?list=PL4cUxeGkcC9hpM9ARM59Ve3jqcb54dqiP)

- Ninja Tutorial 의 강좌중 하나를 기반으로 이것저것 참고해 추가했다.

![svltk-tutorial-lesson01](https://github.com/maxmin93/svltk-tutorial/raw/main/static/sveltk-lesson01-crunch.png){: width="600px"}

### 1) 구현 기능

- Guides JSON 데이터를 제공하는 Repo 클래스 구현
  - getGuides() : 전체 리스트
  - getById(ID) : 특정 ID의 데이터
- `+page.ts` 와 `+page.svelte` 간의 PageData 전달
  - `/lesson01` 에서 getGuides() 를 통해 전체 리스트 출력
  - `/lesson01/[id]` 에서 getById(ID) 를 통해 특정 데이터 출력
- data-sveltekit-preload-data 적용 : 링크 hover 시에 데이터를 미리 로드
  - data-sveltekit-reload : 페이지 이동시에 데이터를 다시 로드
- `+error.svelte` 구현 : getById(ID) 의 Not Found(404) 에러 페이지

> create svelte 로 프로젝트 생성시 data-sveltekit-preload-data="hover" 가 body 태그에 적용되어 있음


## 3. Prisma 와 Server API 로 tweets 출력하기

참고 : [Full Stack SvelteKit For Beginners](https://joyofcode.xyz/sveltekit-for-beginners)

![svltk-tutorial-lesson02](https://github.com/maxmin93/svltk-tutorial/raw/main/static/sveltk-lesson02-home-crunch.png){: width="600px"}

### 1) 구현 기능

- prisma 를 이용한 tweets DB 연동
- `/lesson02` 에서 svelte transition 적용
  - onMount() : 페이지가 로드 이후 visible=true 로 in transition 시작
  - 버튼 클릭시 setTimeout 이후, visible=false 로 out transition 시작
- `/api/tweets/+server.ts` 에서 tweets API 생성 : GET
  - `/lesson02/home/+page.ts` 에서 fetch 로 API 호출
  - `/lesson02/home/+page.svelte` 에서 tweets 출력

### 2) prisma 관련 설정

#### prisma 설치

```console
$ pnpm i -D prisma
$ pnpm i @prisma/client

# 별도로 prisma 스크립트를 실행시키려면 아래와 같이 설치
$ pnpm i -D ts-node @types/node
```

```json
{
  "prisma": {
    "seed": "node --loader ts-node/esm prisma/seed.ts"
  },
}
```
{: file="package.json"}

#### Prisma 초기화

- Sqlite 파일 생성 : `prisma/dev.db`

```console
$ pnpx prisma init --datasource-provider sqlite
```

#### Prisma Schema 작성

- 스키마를 정의하고 Sqlite DB에 반영

```prisma
model Tweet {
  id      Int      @id @default(autoincrement())
  url     String
  posted  DateTime
  content String
  likes   Int
  user    User     @relation(fields: [userId], references: [id])
  userId  Int
}

model User {
  id     Int     @id @default(autoincrement())
  email  String  @unique
  handle String  @unique
  name   String
  avatar String
  about  String
  tweets Tweet[]
  liked  Liked[]
}

model Liked {
  id      Int  @id @default(autoincrement())
  tweetId Int  @unique
  user    User @relation(fields: [userId], references: [id])
  userId  Int
}
```

#### prisma 스키마 적용

- `prisma db push` 는 `prisma generate` 까지 수행한다
- `prisma db seed` 는 prisma 에서 특별히 준비된 기능 같다.
  + `ts-node` 로 개별적으로 실행하면 작동 안된다.

```console
$ pnpx prisma db push
# ==> Generated Prisma Client

$ pnpx prisma db seed
```

## 8. 참고자료

#### 예제

- 트위터 클론 [Full Stack SvelteKit For Beginners](https://joyofcode.xyz/sveltekit-for-beginners#sveltekit-tour)
  + 사용자 계정, 트윗, 좋아요 : Prisma & Sqlite
- 로그인 [Supabase - Quickstart: SvelteKit](https://supabase.com/docs/guides/getting-started/tutorials/with-sveltekit)
  + [Supabase](https://app.supabase.com/)
- JWT 로그인 [Authentication and authorization in SvelteKit](https://www.okupter.com/blog/handling-auth-with-jwt-in-sveltekit)
  + 사용자 계정 : Prisma & Sqlite
  + 로그인 : JWT
- [SvelteKit 1.0 Crash Course - Full Tutorial with Prismic](https://www.youtube.com/watch?v=mDQy0NsBrwg)
  + Prismic as a CMS [참고](https://prismic.io/docs/svelte)
  + [Pico CSS](https://picocss.com)
- 레디스 캐시 [Speed up SvelteKit Pages With a Redis Cache](https://www.captaincodeman.com/speed-up-sveltekit-pages-with-a-redis-cache)
  + Redis 
- 로그인 [Announcing SvelteKit Auth: NextAuth.js](https://vercel.com/blog/announcing-sveltekit-auth)
  + [NextAuth.js - Getting Started](https://next-auth.js.org/getting-started/example)
- JSON Async Fetch [How To Fetch JSON In Svelte – Example](https://codesource.io/how-to-fetch-json-in-svelte-example/)
- [Skeleton 블로그](https://github.com/skeletonlabs/blog-tutorials)
- [Svelte 예제 따라하기](https://github.com/emsweetland/svelte-app)

#### 강좌

- [깃허브/iamshaunjp/sveltekit-tutorial]()
- [Youtube - Huntabyte](https://www.youtube.com/@Huntabyte)
- [Youtube - Joy Of Code](https://www.youtube.com/@JoyofCodeDev), [Blog - joyofcode.xyz](https://joyofcode.xyz/)
  + [SvelteKit Endpoints](https://joyofcode.xyz/sveltekit-endpoints)
  + [SvelteKit For Beginners #5 - Setting Up Prisma](https://joyofcode.xyz/sveltekit-for-beginners#setting-up-prisma)
  + [SvelteKit Authentication Using Cookies](https://joyofcode.xyz/sveltekit-authentication-using-cookies)
- [Youtube - Johnny Magrippis](https://www.youtube.com/@jmagrippis)
  + [Magically load data with SvelteKit Endpoints](https://www.youtube.com/watch?v=f6prqYlbTE4) : supabase 예제

#### 기타 등등

- [Twitter clone with TailwindCSS@1.4.6](https://tailwindcomponents.com/component/twitter-clone) : tailwind 스타일 예제
- [Appwrite Console](https://github.com/appwrite/console) : SvelteKit 으로 만든 콘솔
- [깃허브/skeleton](https://github.com/skeletonlabs/skeleton) : SvelteKit 으로 만든 제품 페이지

## 9. Summary

- 모르는 함수가 나오면 [모듈 레퍼런스](https://kit.svelte.dev/docs/modules) 에서 찾아라.
- 소스 코드 : [깃허브/svltk-tutorial](https://github.com/maxmin93/svltk-tutorial)

#### `+error.svelte` 의 `$page.error` 사용법

- `throw error(statusCode, { message: MESSAGE })` 로 데이터 전달
- 기본으로 전달 되는 message 외에 다른 prop 도 전달 가능

#### 첫 빌드/실행 이전에 './$types' 선언의 ESLint 빨간줄 메시지

파일을 생성하고 처음 type import 작성시 나오는 'can not found' 메시지는 아직 빌드되지 않았기 때문에 `$types.d.ts` 파일이 생성되지 않았기 때문이다. 때문에 첫 빌드/실행 이후 관련 메시지가 없어진다. 

- 무시하던지
- 아래 코드처럼 코멘트 타입 지시자를 사용하면 된다.

```ts
// import type { Actions, PageServerLoad } from './$types';

/** @type {import('./$types').PageServerLoad} */
export const load = () => {
  // ...
}

/** @type {import('./$types').Actions} */
export const actions = {
  // ...
}
```
{: file="src/routes/memo/+page.server.ts"}

#### Actions 실패시 [`fail`](https://kit.svelte.dev/docs/modules#sveltejs-kit-fail) 반환 (deprecated `invalid` function)

`Error: invalid(...) is now fail(...)`

- 기존 코드에 `return invalid(400, ...)` 되어 있는 것들이 많은데, fail 함수로 바꾸면 된다.
- Actions 관련해 4개의 함수가 준비되어 있다.
  + `import { error, fail, json, redirect } from '@sveltejs/kit';`
  + fail 은 Actions 에서만 사용 가능 (ActionFailure)
- 아마 `$app/navigation` 관련 `invalidate`/`invalidateAll` 함수와 헷갈리는거 같으니 이름을 변경한듯 싶다.
  + 문제는 변경 내용을 검색해도 찾을 수 없어서 꽤 고민했다는게 문제

> ActionFailure 예제 코드

```ts
import { fail } from '@sveltejs/kit';

/** @type {import('./$types').Actions} */
export const actions = {
  create: async ({ request }) => {
    // if invalid, ...
    return fail(400, {
      data: data,
      errorMsg: '❌ Title must not be empty!'
    });
    // if success, ...
    return {
      data: undefined,
      errorMsg: undefined
    };
  },
}
```
{: file="src/routes/memo/+page.server.ts"}


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

