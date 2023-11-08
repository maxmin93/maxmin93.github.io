---
date: 2023-10-03 00:00:00 +0900
title: SvelteKit + Supabase 통합 - 4일차
categories: ["frontend","svelte"]
tags: ["authjs","twitter","supabase","4th-day"]
image: "https://authjs.dev/img/og-image.png"
---

> Bun + SvelteKit + Supabase 조합에 Auth.js 를 이용한 Discord 소셜 로그인을 공부합니다. pg 에 테이블을 생성하고 Drizzle 어댑터를 연결합니다.
{: .prompt-tip }

- [SvelteKit + Supabase 통합 - 1일차](/posts/2023-09-06-sveltekit-supabase-tutorial-day1/) : prisma 연동
- [SvelteKit + Supabase 통합 - 2일차](/posts/2023-09-10-sveltekit-supabase-tutorial-day2/) : drizzle 연동
- [SvelteKit + Supabase 통합 - 3일차](/posts/2023-09-12-sveltekit-supabase-tutorial-day3/) : Bun Docker 배포
- [SvelteKit + Supabase 통합 - 4일차](/posts/2023-10-03-sveltekit-supabase-tutorial-day4/) : Auth.js 연동 &nbsp; &#10004;

## 0. 개요

- [x] Bun 1.0.4 + SvelteKit
- [x] supabase (로컬 개발 환경)
- [x] Drizzle 0.28.6 (postgresql)
- [x] Auth.js 0.16.1 + Discord OAuth

> 화면 캡쳐

<img alt="twitter-clone-posts" src="https://raw.githubusercontent.com/maxmin93/bun-authjs-app/main/static/03-twitter-clone-posts.png?raw=true" height="540px" />

<img alt="svltk-drizzle-app-users" src="https://raw.githubusercontent.com/maxmin93/bun-authjs-app/main/static/03-twitter-clone-auth-page.png?raw=true" height="540px" />

<img alt="svltk-drizzle-app-users" src="https://raw.githubusercontent.com/maxmin93/bun-authjs-app/main/static/03-twitter-clone-discord-login.png?raw=true" height="540px" />

> 참고문서

- [Build a Twitter Clone with SvelteKit, Auth.js, and Prisma](https://thethinks.vercel.app/tutorial/sveltekit-twitter-clone)
- [깃허브 - zeucapua/veranda-app](https://github.com/zeucapua/veranda-app)

## 1. 프로젝트 생성

### 1) [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```console
$ bun create svelte@latest bun-tailwind-app
  - Skeleton project
  - TypeScript

$ cd bun-tailwind-app
$ bun install

$ bun run dev
```

### 2) [TailwindCSS 설정](https://tailwindcss.com/docs/guides/sveltekit)

1. Install TailwindCSS
2. `tailwind.config.js` 에 template paths 추가
3. `postcss.config.js` 에 nesting plugin 추가
4. `app.css` 에 Tailwind directives 추가
5. 최상위 `+layout.svelte` 에 `app.css` import
6. `+page.svelte` 에서 TailwindCSS classes 를 사용해 작동 확인
7. [daisyUI 설정](https://daisyui.com/docs/config/)

### 3) [Drizzle ORM + Supabase](https://orm.drizzle.team/docs/quick-postgresql/supabase) 설정

- DATABASE_URL 환경변수 설정
- [`drizzle.config.ts` 파일 생성](https://orm.drizzle.team/kit-docs/conf)
- `drizzle/schema.ts` 파일 생성
  - postgresql 의 collate 는 아직 지원하지 않음 [(issue#638 open 상태)](https://github.com/drizzle-team/drizzle-orm/issues/638)

## 2. [Auth.js + drizzle adapter](https://authjs.dev/reference/sveltekit) 연동

### 1) Auth.js 를 위한 [postgresql 테이블 생성](https://authjs.dev/reference/adapter/pg)

drizzle adapter 사용시 public 스키마에 지정된 테이블명에서만 작동된다. (변경 금지)

- verification_token : sessions 에 발급되는 토큰
- accounts : user 는 여러 accounts 와 연결 가능 (1:N)
- sessions : users 에 연결된 세션 (1:1)
- users : email 로 구별되는 사용자

> supabase 로컬 개발 환경을 사용했다. (postgresql 15)

```sql
-- remove all tables;
drop table if exists "verification_token";
drop table if exists "account";
drop table if exists "session";
drop table if exists "user";

-- tables
CREATE TABLE "verification_token"
(
  identifier TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  token TEXT NOT NULL,

  PRIMARY KEY (identifier, token)
);

CREATE TABLE "account"
(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  id_token TEXT,
  scope TEXT,
  session_state TEXT,
  token_type TEXT,

  UNIQUE(provider, "providerAccountId")  -- constraints
);

CREATE TABLE "session"
(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  "userId" uuid NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL,

  UNIQUE("sessionToken")  -- constraints
);

CREATE TABLE "user"
(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255),
  email VARCHAR(255),
  "emailVerified" TIMESTAMPTZ,
  image TEXT,

  CONSTRAINT proper_email CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

-- relations
ALTER TABLE "account"
   ADD CONSTRAINT "account_userId_user_id_fk" 
    FOREIGN KEY ("userId") REFERENCES "user"(id) 
    ON DELETE cascade ON UPDATE no action;

ALTER TABLE "session"
  ADD CONSTRAINT "session_userId_user_id_fk" 
    FOREIGN KEY ("userId") REFERENCES "user"(id) 
    ON DELETE cascade ON UPDATE no action;
```

#### 참고 : unique 제약조건과 인덱스

unique 제약조건을 추가하면, 자동으로 unique 인덱스를 생성하고 이를 이용해 검사한다.

- unique 인덱스는 제약조건이 아니다.
- 제약조건은 `create table` 또는 `alter table add constraint` 에서 정의

```sql
/*
-- 아래 두 문장과 같다.
ALTER TABLE "session" 
  ADD CONSTRAINT "sessionToken_uk" UNIQUE ("sessionToken");
*/

-- index 생성
CREATE UNIQUE INDEX CONCURRENTLY "session_sessionToken_idx"
ON session ("sessionToken");

-- uk 제약조건을 특정 index 를 이용해 검사하도록 지정
ALTER TABLE "session"
  ADD CONSTRAINT "sessionToken_uk"
    UNIQUE  -- 컬럼 또는 컬럼 그룹 대신에
    USING INDEX "session_sessionToken_idx";
```

#### 참고 : do ... statement 

- PL/pgSQL 을 이용해 FK 로 연결된 데이터를 입력할 수 있다.
- `RAISE NOTICE` 로 디버깅 출력을 할 수 있다.

```sql
DO $$ 
  DECLARE __id UUID := uuid_generate_v4();
  DECLARE __tags VARCHAR[] := ARRAY['science','technology'];
BEGIN
  -- print userId
  RAISE NOTICE 'NEW userId is %', __id;

  -- __id := 'value'
  SELECT 'another value' INTO __id;
  -- after insert new USER
  INSERT INTO twitter_post (content, "userId", tags) VALUES(
  '''
    multi-line texts
  ''', __id, __tags
  );
END $$;
```

### 2) [Auth.js + drizzle 설정](https://authjs.dev/reference/adapter/pg)

- 인증 기본 로직 `@auth/core`
- sveltekit 을 위한 유틸리티 `@auth/sveltekit`
- drizzle ORM 통합을 위한 유틸리티 `@auth/drizzle-adapter`

```bash
bun add @auth/core @auth/sveltekit
bun add drizzle-orm @auth/drizzle-adapter
bun add -d drizzle-kit
```

#### 스키마 `drizzle/schema/auth.ts`

Unique 제약조건은 없어도 되는데, 다른 코드를 참고해 넣어 보았다.

```ts
import {
  pgTable, unique,  primaryKey,
  uuid, text, varchar, bigint, timestamp
} from 'drizzle-orm/pg-core';
import type { AdapterAccount } from '@auth/core/adapters';

// PK: verification_token(identifier, token)
export const verificationTokens = pgTable(
  'verification_token',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: timestamp('expires', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (t) => ({
    compoundPk: primaryKey(t.identifier, t.token),
  })
);

// PK: user(id)
export const users = pgTable('user', {
  id: uuid('id').notNull().primaryKey(),
  name: varchar('name', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  emailVerified: timestamp('emailVerified', {
    mode: 'date',
    precision: 3,
    withTimezone: true,
  }),
  image: text('image'),
});

// PK: account(id)
// UK: account(provider, providerAccountId)
// FK: account.userId = user.id
export const accounts = pgTable(
  'account',
  {
    id: uuid('id').notNull().primaryKey(),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 255 })
      .$type<AdapterAccount['type']>()
      .notNull(),
    provider: varchar('provider', { length: 255 }).notNull(),
    providerAccountId: varchar('providerAccountId', { length: 255 }).notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: bigint('expires_at', { mode: 'number' }),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (t) => ({
    compoundUk: unique().on(t.provider, t.providerAccountId),
  })
);

// PK: session(id)
// UK: session(sessionToken)
// FK: session.userId = user.id
export const sessions = pgTable(
  'session',
  {
    id: uuid('id').notNull().primaryKey(),
    sessionToken: text('sessionToken').notNull(),
    userId: uuid('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expires: timestamp('expires', {
      mode: 'date',
      withTimezone: true,
    }).notNull(),
  },
  (t) => ({
    uk: unique().on(t.sessionToken),
  })
);
```

### 3) twitter clone 을 위한 post 테이블

- 사용자 ID 와 연결되는 Post 테이블을 생성
  - user 와 post 를 조인하여 쿼리하기 위해 relations 를 설정
  - (유지보수 편의를 위해) post 테이블명에 `twitter_` 라는 prefix 를 적용

```sql
drop table if exists twitter_post;

-- prefix: "twitter_"
CREATE TABLE twitter_post
(
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content text COLLATE "ko-x-icu" NOT NULL,
  created_at TIMESTAMPTZ default (timezone('Asia/Seoul', current_timestamp)),
  "userId" uuid,
  claps integer default 0,
  tags varchar(50)[] default '{}'

  -- , CONSTRAINT "twitter_post_userId_user_id_fk"
  --     FOREIGN KEY ("userId") REFERENCES "user"(id)
);
```

#### post 를 위한 schema 코드

`pgTableCreator` 을 이용하여 테이블에 prefix 규칙을 적용했다.

```ts
import { pgTableCreator } from 'drizzle-orm/pg-core';

export const twTable = pgTableCreator((name) => `twitter_${name}`);
```

user 테이블과 FK 를 강하게 연결하기엔 부담스러워 코드상으로만 관계를 정의했다.

```ts
// public 스키마는 pgTable 을 써야 함
import { twTable } from './_table';
import { users } from './auth';

// PK: twitter_post(id)
export const post = twTable('post', {
  id: uuid('id').primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', {
    mode: 'date',
    withTimezone: true,
  }).defaultNow(),
  userId: uuid('userId'), // .references(() => users.id),
  claps: integer('claps').default(0),
  tags: varchar('tags', { length: 50 }).array().default([]),
});

export const postRelations = relations(post, ({ one }) => ({
  users: one(users, {
    fields: [post.userId],
    references: [users.id],
  }),
}));
```

### 4) Discord OAuth2 API Keys

1. [Discord - Developer Portal](https://discord.com/developers/applications) 에 가서
2. Application 을 생성 후 이동 : "t3-tutorial"
3. OAuth2 메뉴로 이동
4. [Redirects url 설정](https://authjs.dev/reference/sveltekit#usage) `http://localhost:5173/auth/callback/discord`
5. Client ID 와 Client Secret 를 복사해서 `.env` 파일에 설정

```env
DISCORD_CLIENT_ID="1234567890"
DISCORD_CLIENT_SECRET="..."

AUTH_SECRET="..."
```

#### Auth.js 토큰 생성을 위한 랜덤 문자열 생성

`.env` 파일에 `AUTH_SECRET` 변수로 설정

> 코딩에 직접적으로 사용하지는 않지만, Auth.js 라이브러리가 필요로 한다.

```bash
openssl rand -base64 32
```

## 3. SvelteKit 과 Auth.js 연동

### 1) `hooks.server.ts` 에서 SvelteKitAuth Handle 추가 

- adapter : drizzle orm
- providers : Discord 
- [callbacks](https://authjs.dev/guides/basics/callbacks) 설정
  + signIn : 추가적인 로그인 조건 설정
  + redirect : 조건에 따른 redirect 설정
  + session : user 객체 설정
  + jwt

```ts
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

const auth = (async (...args) => {
  const [{ event }] = args;
  return SvelteKitAuth({
    adapter: DrizzleAdapter(db),
    providers: [
      Discord({
        clientId: DISCORD_CLIENT_ID,
        clientSecret: DISCORD_CLIENT_SECRET,
      }),
    ],
    callbacks: {
      async session({ user, session }) {
        session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };

        event.locals.session = session;
        return session;
      },
    },
  })(...args);
}) satisfies Handle;

export const handle: Handle = sequence(auth, authorization);
```

### 2) Login 설정

#### [Callback URL 설정 방법](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl)

- signIn 호출시 callbackUrl 옵션을 사용 

```html
<button
      class="text-red-500"
      on:click={() => signIn('discord', { callbackUrl: '/page' })}
      >Sign In with Discord</button
    >
```

- 또는, SvelteKitAuth 의 callbacks 설정을 사용

```ts
// hooks.server.ts 의 SvelteKitAuth 설정
SvelteKitAuth({
  callbacks: {
    async redirect({url, baseUrl}) {
      console.log('url', url);
      console.log('baseUrl', baseUrl);
      
      return url.startsWith(baseUrl) ? url : baseUrl + '/page';
    }
  }
})  
``` 

- 또는, false 설정으로 사용하지 않을 수도 있다. 

### 3) protected path 설정

locals 내에 session 개체가 있는지를 검사하여 페이지 권한을 처리한다.

- `hooks.server.ts` 에서 Handle 로 처리하거나

```ts
// @ts-ignore
async function authorization({ event, resolve }) {
  // Protect any routes under `/authenticated`
  const path = event.url.pathname;
  if (path.startsWith('/u/') || path.startsWith('/p/')) {
    const session = await event.locals.getSession();
    if (!session) {
      throw redirect(303, '/login');
    }
  }
  // If the request is still here, just proceed as normally
  return resolve(event);
}

export const handle: Handle = sequence(auth, authorization);
```

- 원하는 path 의 `+layout.server.ts` 에서 처리

### 4) [Session.user 확장](https://authjs.dev/getting-started/typescript?frameworks=core#module-augmentation)

`declare module` 는 프로젝트 내의 어디에서든 선언할 수 있고, 이를 이용해서 interface 확장 등을 할 수 있다. SvelteKit 의 경우 `$src/app.d.ts` 파일이 가장 적절하다.

> DefaultSession 의 user 는 `id` 항목을 가지고 있지 않아서 확장이 필요하다.

- 기존 user 속성들: name, email, image
- 추가 user 속성들: id (이것으로 posts.userId 와 조인)

```ts
import type { Session as OGSession, DefaultSession } from '@auth/core/types';

declare module '@auth/core/types' {
  // user 에 id 속성 추가 (interface 확장)
  interface Session extends OGSession {
    user?: {
      id: string;
    } & DefaultSession['user'];
  }
}

declare global {
  namespace App {
    interface Locals {
      session: Session;
    }
  }
}

export {};
```

## 4. SvelteKit 기능 개발

### 1) PostView 컴포넌트 

- post 와 user 를 외부 파라미터로 받아와 출력한다. (NOT null)
- 좋아요(clap) 버튼 클릭시 카운트 증가
  - onClap 으로 client 자체적으로 카운트 증가
  - DB update 는 server 의 POST action 호출을 통해 처리 (ActionData 는 없음)

```html
<script lang="ts">
  import { onMount } from 'svelte';
  import { format } from 'timeago.js';
  import { enhance } from '$app/forms';
  import type { PostType } from '../schema/post';
  import type { UserType } from '../schema/auth';

  export let post: PostType;
  export let user: UserType;

  let claps: number;
  let duration = post.createdAt ? format(post.createdAt) : 'sometime';

  onMount(() => {
    claps = post.claps ?? 0;
  });

  function onClap() {
    claps += 1;
  }
</script>

<!-- ... -->
  <div class="flex flex-col gap-2">
    <a href={`/p/${post.id}`}>
      <p class="text-neutral-400 pb-2">
        <a href={`/u/${user.id}`}>@{user.name}</a>
        | {duration}
      </p>
      <p class="text-xl text-white">{post.content}</p>
    </a>
    <form action="/?/clapPost" method="post" use:enhance>
      <input type="hidden" name="post_id" value={post.id} />
      <button
        class="btn btn-outline btn-secondary rounded-full"
        on:click={onClap}
      >
        👏 {#if !claps}...{:else}{claps}{/if}
      </button>
    </form>
  </div>    
<!-- ... -->
```

### 2) claps API

- post.id 를 받아 post 테이블의 clap 값을 가져온다
- `claps + 1` 을 update 한다.
  - 성공한 경우 success, 실패한 경우 fail 반환

```ts
// src/routes/+page.server.ts

import { db } from '$lib/server/drizzle';
import { users } from '$lib/schema/auth';
import { posts, type PostType } from '$lib/schema/post';
import { eq, desc } from 'drizzle-orm';

export const actions = {
  // ...,
  clapPost: async ({ locals, request }) => {
    const session = await locals.getSession();
    if (!session) {  // 로그인부터 하도록 페이지 이동
      throw redirect(307, '/login');
    }

    const data = await request.formData();
    const post_id = String(data.get('post_id'));

    const post = await db.select().from(posts).where(eq(posts.id, post_id));
    if (post.length > 0 && post[0]) {
      const claps = post.shift()!.claps ?? 0;
      await db
        .update(posts)
        .set({ claps: claps + 1 })
        .where(eq(posts.id, post_id));
      // ActionResult 의 data 에 매핑 (result.type == 'success')
      return { success: true, claps: claps + 1 };  
    }
    return fail(502, { message: 'Cannot clap right now. Try again.' });
  },
};
```

#### [ActionResult 에 따라](https://kit.svelte.dev/docs/form-actions#progressive-enhancement-customising-use-enhance) 갱신된 claps 값 출력

- `use:enhance` 의 result 를 이용해 success 인 경우에만 claps 갱신 출력
  - `result` is an `ActionResult` object
  - 컴포넌트 함수를 호출하여 claps 값 변경

```html
<script lang="ts">
  export let post: PostType;

  let claps: number;
  onMount(() => {
    claps = post.claps ?? 0;
  });

  function updateClaps(value: number) {
    claps = value;
  }
</script>

  <!-- ... -->
    <form
      action="/?/clapPost"
      method="post"
      use:enhance={() => {
        return async ({ result }) => {
          // `result` is an `ActionResult` object
          if (result.type === 'success') {
            console.log('claps.updated =', result.data?.claps);
            updateClaps(Number(result.data?.claps));
          }
        };
      }}
    >
      <input type="hidden" name="post_id" value={post.id} />
      <button class="btn btn-outline btn-secondary rounded-full">
        👏 {#if !claps}...{:else}{claps}{/if}
      </button>
    </form>
  <!-- ... -->
```

### 3) create Post API

- form 에서 content 가져오기 
- session 에서 user 가져오기
- posts 테이블에 content, userId 데이터 입력
- returning 으로 결과 가져오기 : 없으면 fail 처리

```ts
export const actions = {
  createPost: async ({ locals, request }) => {
    const data = await request.formData();
    const content = data.get('content')?.toString();

    const session = await locals.getSession();
    const user = session?.user;

    if (user && content) {
      const result = await db
        .insert(posts)
        .values({ content, userId: user.id } as PostType)
        .returning();  // array 로 반환

      console.log('after saving post:', result);
      if (!result.length) {
        throw fail(503, {
          message: "There's been an error when posting. Try again.",
        });
      }
    }
  },
  // ...,
};
```

## 9. Review

- TS 의 타입 선언 때문에 귀찮다. JS 를 사용하면 이런 문제를 신경쓰지 않아도 될텐데
  + TS 를 사용하는 한 일종의 세금같은 거다.
- 어떻게 하긴 했는데, auth.js 의 흐름이 복잡하다. 
  + 구버전 `next-auth.js` 자료가 검색되어 헷갈린다.

> 다음에 살펴볼 문서들

- [리액트 daisyui-admin-dashboard-template](https://github.com/srobbin01/daisyui-admin-dashboard-template) : 달력이 참고 할만함
  - [달력 데모](https://tailwind-dashboard-template-dashwind.vercel.app/app/calendar)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
