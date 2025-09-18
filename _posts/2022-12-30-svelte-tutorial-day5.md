---
date: 2022-12-30 00:00:00 +0900
title: Svelte 공부하기 - 5일차
description: 프론트엔드 프레임워크인 SvelteKit 에 대해 공부한다. Supabase 를 이용해 로그인과 블로그 페이지를 개발해보자. (5일차)
categories: [Frontend, Svelte]
tags: []
image: https://svelte.dev/_app/immutable/assets/svelte-machine-mobile.B0w2rScM.png
---

> 목록
{: .prompt-tip }

- [Svelte 공부하기 - 1일차](/posts/svelte-tutorial-day1/) : Svelte
- [Svelte 공부하기 - 2일차](/posts/svelte-tutorial-day2/) : SvelteKit + CSS
- [Svelte 공부하기 - 3일차](/posts/svelte-tutorial-day3/) : SvelteKit 구조, 작동방식
- [Svelte 공부하기 - 4일차](/posts/svelte-tutorial-day4/) : SvelteKit 애플리케이션 예제
- [Svelte 공부하기 - 5일차](/posts/svelte-tutorial-day5/) : Supabase 인증, DB 연동 &nbsp; &#10004;

## 1. Pico CSS 설정하기

운영툴 입출력이나 튜토리얼을 위한 간단한 레이아웃을 만들 때에는 [Pico CSS](https://picocss.com/docs/) 가 편리하다. 단, 예제도 적고 스타일이 제한적이라 제품용으로는 적합하지 않은편이다. 

### 1) 설정

- 설치 `npm install @picocss/pico`
- app.css 설정 [깃허브 - picocss/examples/basic-template]

### 2) 테마 변경

예제 템플릿에서는 간단한 js 파일로 테마 변경 기능을 구현했다.

- `static/js` 아래에 `minimal-theme-switcher.js` 파일을 복사해 넣고
- `src/app.html` 에 script 태그를 삽입

```html
<!DOCTYPE html>
<html lang="en" data-theme="light">
  <head>...</head>
  <body data-sveltekit-preload-data="tap">
    <!-- 또는 hover -->
    <div style="display: contents">%sveltekit.body%</div>

    <script src="%sveltekit.assets%/js/minimal-theme-switcher.js" defer></script>
  </body>
</html>  
```

## 2. Todo List 예제

> 참고 

- [유튜브 - Build a To Do List With SvelteKit 1.0](https://www.youtube.com/watch?v=MnTfpmVzxQc&t=502s)
  + `+page.svelte` 파일 하나로 간단히 구현한 Todo 예제

### 1) add, edit, delete

- add 버튼에 addTodo 를 연결 => textInput 내용을 Todo 리스트에 추가
- edit 버튼에 setEditing 을 연결 => input 으로 편집 가능
- delete 버튼에 deleteTodo 를 연결

```html
<script lang="ts">
  type ToDo = {
    content: string;
    editing: boolean;
    checked: boolean;
  };

  let toDoList: ToDo[] = [{ content: 'Learn Svelte', editing: false, checked: false }];
  let textInput = '';

  const addToDo = () => { ... }
  const setEditing = (i: number, isEditing: boolean) => { ... }
  const deleteTodo = (i: number) => { ... }
</script>
```

### 2) 버튼 클릭 대신에 Enter 키 대체

- input 의 `on:keypress` 에 onKeyPress 연결
- KeyboardEvent 이벤트의 `e.key === 'Enter'` 조건 검사
  + 일치하면 callback 함수 실행

```html
<script lang="ts">
  const onKeyPress = (e: KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter') {
      callback();
    }
  };
</script>

<div style="display: flex;">
  <input type="text" on:keypress={(e) => onKeyPress(e, addToDo)} bind:value={textInput} />
  <button style="width: 200px;" on:click={addToDo}>Add</button>
</div>
```

## 3. Supabase 이용한 인증 (로그인, 로그아웃)

Supabase SvelteKit 예제로 [Email 로그인 코드](https://supabase.com/docs/guides/getting-started/tutorials/with-sveltekit#supabase-auth-helpers)를 제공하고 있다.

> 참고

- 공식문서 [Supabase - Social Login](https://supabase.com/docs/guides/auth/social-login)
- 인증 예제 [깃허브 - huntabyte/sk-supabase-oauth](https://github.com/huntabyte/sk-supabase-oauth)
  + email 인증 및 google, discord, github 소셜 인증

![huntabyte/sk-supabase-oauth 로그인 화면](/2022/12/30-supabase-login-page-crunch.png){: width="480" .w-75}
_huntabyte/sk-supabase-oauth 로그인 화면_

> Social 로그인 작업 절차

1. Supabase 프로젝트의 `Authentication > Providers` 메뉴로 이동해서
2. 원하는 제공자 항목을 펼치고, enable 스위치를 킨다
3. Redirect URL 을 복사한 후 
4. 제공자의 개발자 설정 페이지의 OAuth 메뉴에 들어가
5. 사용자의 App 을 생성하고 Redirect URL 항목을 붙여넣기 하면
6. 생성된 Client ID 와 Client Secret 를 복사해서
7. Supabase 인증 제공자의 Client ID 와 Client Secret 에 붙여넣기 후
8. App 코드에서 supabaseClient 의 auth.signInWithOAuth 호출 
9. signInWithOAuth 성공시 root 페이지로 redirect 처리
10. auth.onAuthStateChange 에서 subscription 갱신
11. 매 호출마다 실행되는 hook 에서 Supabase session 갱신 
12. 레이아웃에서 session 상태를 검사해 페이지 접근을 제어

![Supabase Auth 제공자 리스트](/2022/12/30-supabase-auth-providers-crunch.png){: width="480" .w-75}
_Supabase Auth 제공자 리스트_

### 1) [github 로그인](https://supabase.com/docs/guides/auth/social-login/auth-github)

Google 이나 Facebook 등에 비하면 따로 증명할 것도 없어, 매우 간편하다.

![Supabase Social Login - Github](/2022/12/30-tonyneapp-auth-github-login.png){: width="480" .w-75}
_Supabase Social Login - Github_

### 2) [google 로그인](https://supabase.com/docs/guides/auth/social-login/auth-google)

로그인 화면에서 리다이렉션 URL 이 supabase.co 로 표시되는 문제는 Google 의 도메인 인증 절차를 받아야 해결할 수 있다고 한다. 그래서 나도 도메인 인증을 시도했지만, 아직 제대로 표시되지 않고 있다. (어렵네)

- 관련 이슈 [Google OAuth -- Change displayed redirect url #2925](https://github.com/supabase/supabase/discussions/2925#discussioncomment-1512962)

![Supabase Social Login - Google](/2022/12/30-tonyneapp-auth-google-login.png){: width="480" .w-75}
_Supabase Social Login - Google_

![Google Cloud - OAuth 설정 - 동의화면 설정](/2022/12/30-supabase-auth-google-settings-w640.png){: width="600" .w-75}
_Google Cloud - OAuth 설정 - 동의화면 설정_

### 3) [facebook 로그인](https://supabase.com/docs/guides/auth/social-login/auth-facebook)

페이스북은 정말이지 비즈니스 기능이니 뭐니 너무 어렵다. (로그인은 됨)

![Facebook Developer - App 설정 - 비즈니스 인증 요구](/2022/12/30-tonyneapp-auth-facebook-settings.png){: width="600" .w-75}
_Facebook Developer - App 설정 - 비즈니스 인증 요구_

### 4) 그 외 소셜 제공자 이용하려면

커스텀 제공자 기능이 없는거 같다. [Custom OAuth providers #417](https://github.com/supabase/supabase/discussions/417)

- 카카오, 네이버 등의 소셜 로그인을 쓰려면 Auth.js 를 사용해야 함
  + [Auth.js 와 Supabase 연동](https://next-auth.js.org/adapters/supabase)
  + [Auth.js - Kakao 인증](https://next-auth.js.org/providers/kakao), [Auth.js - Naver 인증](https://next-auth.js.org/providers/naver)

## 4. Supabase 의 Postgresql 사용하기

참고

- 블로그 [JoyOfCode - SvelteKit Endpoint and Loading Data for Pages](https://joyofcode.xyz/sveltekit-loading-data)
  + prisma + sqlite 사용 
- [Set up a free PostgreSQL database on Supabase to use with Prisma](https://dev.to/prisma/set-up-a-free-postgresql-database-on-supabase-to-use-with-prisma-3pk6)

### 1) Supabase 에 myblog 데이터베이스 생성하기

1. Supabase 프로젝트의 Settings > Database 에서 DB 패스워드 설정
2. psql 접속 후 myblog 데이터베이스 생성 (쉐도우 데이터베이스도 생성)
3. URL 로 myblog 데이터베이스 접속 테스트

```console
# 1. 설정한 패스워드로 postgres 데이터베이스 접속
$ psql -h db.<프로젝트ID>.supabase.co -p 5432 -d postgres -U postgres
Password for user postgres: <패스워드>

-- 2-1. myblog 데이터베이스 생성
postgres> CREATE DATABASE myblog OWNER postgres ENCODING 'UTF-8';
-- 2-2. myblog 쉐도우 데이터베이스 생성
postgres> CREATE DATABASE myblog_shadow OWNER postgres ENCODING 'UTF-8';

-- 데이터베이스 조회
postgres> \l
-- 데이터베이스 변경
postgres> \c myblog
-- 콘솔 종료
postgres> \q

# 3. 접속 테스트
$ psql "postgresql://postgres:<패스워드>@db.<프로젝트ID>.supabase.co:5432/myblog"
```

#### [Supabase Roles 을 위한 기본 권한 설정 쿼리문](https://supabase.com/docs/guides/integrations/prisma#troubleshooting)

초기 마이그레이션을 여러번 수행할 경우 스키마가 삭제된 다음에 재생성 되는 방식으로 작동함. 이 과정에서 Supabase 기본 권한을 재설정 하는 쿼리문인데, 이것을 새로 생성한 데이터베이스에 적용하면 Supabase 운영툴에서 조회할 수 있지 않나 싶어 해봤는데 안됨. 

```sql
-- 데이터베이스 스키마 조회
SELECT schema_name FROM information_schema.schemata;

-- supabase Role 들에게 public 스키마에 대한 권한을 부여
grant usage on SCHEMA public to postgres, anon, authenticated, service_role;

grant all privileges on all tables in SCHEMA public to postgres, anon, authenticated, service_role;
grant all privileges on all functions in SCHEMA public to postgres, anon, authenticated, service_role;
grant all privileges on all sequences in SCHEMA public to postgres, anon, authenticated, service_role;

alter default privileges in SCHEMA public grant all on tables to postgres, anon, authenticated, service_role;
alter default privileges in SCHEMA public grant all on functions to postgres, anon, authenticated, service_role;
alter default privileges in SCHEMA public grant all on sequences to postgres, anon, authenticated, service_role;
```

### 2) [Prisma 와 Supabase 연동](https://supabase.com/docs/guides/integrations/prisma)

1. `.env` 에 DATABASE_URL, SHADOW_DATABASE_URL 설정
2. schema.prisma 에 DB Provider 설정 (Supabase 문서 참고) 
3. 스키마 적용 : 초기 마이그레이션 
4. 접속 후 테이블 확인

```console
$ pnpx prisma migrate dev --name init

$ pnpx vite-node prisma/seed.ts

$ pnpx prisma studio

$ psql -h db.<프로젝트ID>.supabase.co -p 5432 -d myblog -U postgres
Password for user postgres: <패스워드>

-- 데이터베이스의 테이블 조회
postgres> \dt
               List of relations
 Schema |        Name        | Type  |  Owner
--------+--------------------+-------+----------
 public | Post               | table | postgres
 public | _prisma_migrations | table | postgres
(2 rows)

-- **NOTE: "테이블명" 으로 쿼리해야 대소문자가 적용됨
postgres> select * from "Post" limit 1;
```

### 3) Post 리스트 및 페이지 출력

참고: Prisma Client API 

- [Prisma - PostgreSQL 데이터베이스 사용시](https://www.prisma.io/docs/concepts/database-connectors/postgresql)
- [Prisma - findMany 등의 API 설명](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findmany)
- [Prisma - Realtion Queries](https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries)
  + select 는 필드를 선택할 때, include 는 모든 필드를 포함할 때 사용

> 작업 순서

1. Supabase 프로젝트 준비 : URL, ANON_KEY (환경변수)
2. Supabase 의 PostgreSQL 에 접속할 DATABASE_URL 테스트 (환경변수)
3. Prisma 설치 : [Prisma CLI 사용법](https://www.prisma.io/docs/reference/api-reference/command-reference) 참고
4. Supabase PostgreSQL 연동과 스키마 관련 schema.prisma 설정
5. prisma db push 및 seed 적용 (psql 또는 prisma studio 로 확인)
6. $lib 에 supabaseClient 및 PrismaClient 생성하는 TS 작성
7. `routes/(myblog)` 그룹 생성 후, api 와 posts 디렉토리 생성
8. `(myblog)/api/posts/server.ts` 에 DB 쿼리 API(RequestHandler) 작성
9. `(myblog)/posts` 에 쿼리 API 를 호출하는 PageLoad 작성
10. PageData 로 posts 리스트를 받아와 출력하는 svelte 작성 
11. post 항목 클릭시 연결될 `(myblog)/posts/[slug]` 생성
12. post 전문을 쿼리하는 API endpoint 와 출력하는 svelte 작성

#### [SvelteKit 의 API Endpoint 를 보호하는 방법](https://github.com/sveltejs/kit/discussions/2968#discussioncomment-1737065)

참고 [How to secure pages with HTTP Basic Auth using SvelteKit](https://dev.to/danawoodman/how-to-secure-pages-with-http-basic-auth-using-sveltekit-1iod)

- [HTTP Header 의 Authorization](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization) 을 확인하고 접근 허용 
  + 예제 [How to secure pages with HTTP Basic Auth using SvelteKit](https://dev.to/danawoodman/how-to-secure-pages-with-http-basic-auth-using-sveltekit-1iod)
- 예) Authorization: &lt;auth-scheme&gt; &lt;credentials&gt;
  + 보통 auth-scheme 는 `Basic` 을 사용하고, Base64 인코딩 문자열을 붙인다
    * Base64 인코딩에 [atob 함수](https://developer.mozilla.org/en-US/docs/Web/API/atob)를, 디코딩에 [btoa 함수](https://developer.mozilla.org/en-US/docs/Web/API/btoa)를 사용
  + 토큰 사용시 `Bearer` 를 사용하고 JWT 토큰값을 붙인다.

#### [Prisma 기본 사용법](https://www.prisma.io/docs/concepts/components/prisma-client#3-use-prisma-client-to-send-queries-to-your-database)

클라이언트 생성 후 바로 사용 가능 (판타스틱!)

```js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
// use `prisma` in your application to read and write data in your DB

// run inside `async` function
const newUser = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@prisma.io',
  },
})

const users = await prisma.user.findMany()
```

#### 비교 : [Supabase Database API 사용하기](https://supabase.com/docs/guides/api#using-the-api)

SQL 문법과 유사한 형태로 사용할 수 있는 REST API 방식과 GraphQL 문법을 사용한 GraphQL API 방식이 있다.

```js
// Initialize the JS client
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Make a request
const { data: todos, error } = await supabase.from('todos').select('*')
```

#### 비교 : [Supabase 의 Join/Complex 쿼리 사용하기](https://github.com/supabase/supabase/discussions/1393#discussioncomment-689757)

prisma 와 유사하게 관계를 표현하여 쿼리할 수 있다.

- users 대상으로
  + products 테이블을 조인하고, wishlistProducts 으로 출력
    * tags 테이블이 조인된 product
  + wishlist 테이블의 조인을 카운트하고, wishlistCount 으로 출력
  + follows 테이블을 조인하고
  + follows 테이블의 조인을 카운트하고, followCount 으로 출력

```js
const { data, error } = await supabase
  .from('users')
  .select(`
    id,
    username,
    location,
    profilePicture,
    wishlistProducts:products(
      id,
      name,
      price,
      description,
      tags(
        id,
        name
      )
    ),
    wishlistCount:wishlist(count),
    follows(
      id,
      username,
      profilePicture
    ),
    followCount:follows(count)
  `)
```

> 좀 더 간단한 참고 자료

[How To SELECT, COUNT and JOIN Supabase Data](https://dev.to/thisisisheanesu/how-to-select-count-and-join-supabase-data-3ihk)

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

- [깃허브/iamshaunjp/sveltekit-tutorial](https://github.com/iamshaunjp/sveltekit-tutorial) : 단계별로 브랜치 설정
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

## 9. Review

- 인증을 하려면, Auth.js 와 Supabase 의 Users 를 연동해야 한다
  + 국내 서비스는 Google, Kakao, Naver 소셜 인증이 꼭 필요하다
- Supabase 무료 계정이 프로젝트 2개까지라, DB 를 추가 생성했다
  + 여러 예제에서 중복 사용하려다 보니. (공짜라 감사할뿐)
  + SaaS 라서 따로 관리 안해도 되니 참 편하다
- Supabase 데이터베이스의 Pool 기능을 사용하자 (6543 포트)
- Prisma 와 연동해서 더 좋은 점은 잘 모르겠다. 코드가 더 편하다는 정도?

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

