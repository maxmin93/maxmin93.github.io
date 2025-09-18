---
date: 2023-09-21 00:00:00 +0900
title: Bun 1.0 + Elysia.js Auth 따라하기
description: Bun 런타임 기반의 Elysia.js 프레임워크를 이용한 Auth API 구현을 따라합니다.
categories: [Backend, Web Framework]
tags: ["elysia", "prisma", "auth"]
image: "https://user-images.githubusercontent.com/35027979/205498891-b75dc404-3232-4929-b216-823aa7373b71.png"
---

## 0. 개요

- [x] Bun 1.0.2
- [x] Elysia.js + JWT + cookie
- [x] Drizzle ORM

> 출처

[Add JWT Authentication in Bun API](https://dev.to/harshmangalam/add-jwt-authentication-in-bun-api-488d)

## 1. elysia 프로젝트 생성

```bash
bun create elysia auth-api
cd auth-api
# bun install --backend=copyfile

bun dev
```

### supabase postgresql

```sql
-- UUID extension 확인
select Uuid_generate_v4();

-- 테이블 생성
create table bun_users (
  id UUID DEFAULT Uuid_generate_v4(),
  name TEXT NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  salt varchar(256) not null,
  hash varchar(512) not null,
  summary TEXT,
  links json,
  location json,
  profile_image text not null,
  created date default now(),
  updated date default now(),
  PRIMARY KEY (id),
  unique(username, email)
)

-- 테스트 데이터
insert into bun_users(name, username, email, salt, hash, summary, profile_image) values(
  'bob', 'bob@email.com', 'bob@email.com', 'salt-key', 'hash-value', 'test user', 'bob-email-com'
)

-- 확인
select * from bun_users;
```

#### `.env.local` 환경변수

Bun 런타임에서는 `{process 또는 Bun}.env.${변수명}` 으로 읽어올 수 있다.

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:54322/postgres"
JWT_SECRET="hello-elysia-auth"
```

> `.env.local` 파일의 우선순위가 `.env` 보다 높다 (dotenv)

### `tsconfig.json` [import path 설정](https://bun.sh/guides/runtime/tsconfig-paths)

```js
{
  "compilerOptions": {
    "paths": {
      // Re-map import paths with Bun
      "$lib/*": ["./src/lib/*"]
    }
  }
}
```

## 2. Drizzle ORM

### dependency 추가

```bash
bun add drizzle-orm postgres
# bun install --backend=copyfile
```

### schema 작성

```ts
// src/lib/db/schema.ts
import { sql } from 'drizzle-orm';
import { pgTable, uuid, date, json, text, varchar } from 'drizzle-orm/pg-core';

export const users = pgTable('bun_users', {
  id: uuid('id')
    .default(sql`Uuid_generate_v4()`)
    .primaryKey(),
  name: text('name').notNull(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
  salt: varchar('salt', { length: 256 }).notNull(),
  hash: varchar('hash', { length: 512 }).notNull(),
  summary: text('summary'),
  links: json('links'), // 인덱싱 또는 쿼리 필요시에는,
  location: json('location'), // jsonb 사용 (json binary)
  profileImage: text('profile_image').notNull(),
  createdAt: date('created').default(sql`now()`),
  updatedAt: date('updated').default(sql`now()`),
});
```

### client 생성

```ts
// src/lib/db/index.ts
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = Bun.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client, { schema });

// 테스트용 쿼리 `select count(*) from users`
const result = await db
  .select({ count: sql<number>`count(*)` })
  .from(schema.users);
const usersSize = result ? result[0].count : -1;
console.log(`users size = ${usersSize}`);

export { db };
```

### users 쿼리

- email 조건으로 users 조회
- users 삽입 : 완료후 데이터 반환
- email 또는 username 으로 users 조회

```ts
import { eq, or, and } from 'drizzle-orm';
import { db } from '$lib/db';
import { users } from '$lib/db/schema';

const emailExists = await db // result
  .select({ id: users.id })
  .from(users)
  .where(eq(users.email, email));
console.log('emailExists:', emailExists);

const newUser = await db
  .insert(users)
  .values({
    name, email, hash, salt, username, profileImage,
  })
  .returning();
console.log('newUser:', newUser);

const user = await db.query.users.findFirst({
  columns: {
    id: true,
    hash: true,
    salt: true,
  },
  where: (users, { or, eq }) =>
    or(eq(users.email, username), eq(users.username, username)),
});
console.log('user:', user);  
```

## 3. Auth API

### dependency 추가

```bash
bun add @elysiajs/cookie @elysiajs/jwt
# bun install --backend=copyfile
```

### elysia routes

- `/`
  - `/api` ⬅ jwt, cookie 적용
    - `/auth`
      - `/signup` POST ⬅ create user
      - `/login` POST ⬅ select user, verify password
    - `/me` ⬅ isAuthenticated 적용 (cookie 로부터 userId 검사)

```ts
const app = new Elysia()
  .group('/api', (app) =>
    app
      .use(
        jwt({
          name: 'jwt',
          secret: Bun.env.JWT_SECRET!,
        })
      )
      .use(cookie())
      .use(auth)
  )
  .get('/', () => 'Hello Elysia')
  .listen(8080);
```

#### 참고 : [Elysia - Plugin group](https://elysiajs.com/concept/group.html#plugin-group)

```ts
import { Elysia } from 'elysia'

const users = new Elysia({ prefix: '/user' })
    .post('/sign-in', signIn)
    .post('/sign-up', signUp)
    .post('/profile', getProfile)

app.group('/v1', app => app
    .get('/', () => 'Using v1')
    .use(users)
)
```

### `/api/auth/signup` POST

- body 로부터 email, name, password, username 받기
- 동일한 user 있는지 db 조회 
  + 동일한 email 또는 동일한 username
  + 있으면, Bad Request(400)
- user 데이터 생성
  + `hashPassword(password)` ➡ hash, salt 생성
  + profileImage URL 생성
- db 에 user 추가 : [insert returning](https://orm.drizzle.team/docs/insert#insert-returning)
- success 결과 반환

```json
{
  "success": true,
  "message": "Account created",
  "data": {
    "user": [
      {
        "id": "d84ac188-ebdc-4db1-8d04-ae4965029ef7",
        "name": "test2 user",
        "username": "test2user",
        "email": "test2@email.com",
        // ...
      }
    ]
  }
}
```

### `/api/auth/login` POST

- body 로부터 username, password 받기
- 동일한 user 있는지 db 조회 
  + 동일한 email 또는 동일한 username
  + 있으면, Bad Request(400)
- password 확인
  + `comparePassword(password, user.salt, user.hash)`
  + 일치하지 않으면, Bad Request(400)
- access_token 생성 및 저장
  - access_token 생성 : userId 포함
  - setCookie 저장 : maxAge 설정 (15분)
- success 결과 반환

```json
{
  "success": true,
  "data": null,
  "message": "Account login successfully"
}
```

### `/api/auth/me` GET

isAuthenticated 플러그인에 의해 보호된 경로

```json
{
  "success": true,
  "message": "Fetch authenticated user details",
  "data": {
    "user": {
      "id": "8795625d-0ec6-4441-8687-ef9e9a826e96",
      "name": "test1 user",
      "username": "test1user",
      "email": "test1@email.com",
      // ...
    }
  }
}
```

#### isAuthenticated 플러그인

- cookie.access_token 확인
  + 없으면, Unauthorized(401)
- user 확인  
  + access_token 에서 userId 추출
  + db 에서 userId 로 user 조회
  + 없으면, Unauthorized(401)
- user 정보 반환

### Password 처리

- `node:crypto` API 사용 [(bun 0.6.7 부터 지원)](https://bun.sh/blog/bun-v0.6.7#faster-node-crypto-hashing)
  - `import { randomBytes, pbkdf2, createHash } from 'node:crypto';`

> Bun 내장 API 에도 [Bun.CryptoHasher](https://bun.sh/docs/api/hashing#bun-cryptohasher) 기능이 있다. ("blake2b256", "sha512" 등등..)

#### 구현된 함수

- hashPassword(password) : 암호화
  - salt = randomBytes(16)
  - password = pbkdf2(password, salt, ..., 'sha512')
- comparePassword(password, salt, hash) : 암호화 값 비교
  - pbkdf2(password, salt, ..., 'sha512') 재생성
  - db 에 저장된 password 와 비교
- md5hash(email) : 이메일 난독화
  - createHash('md5') 로 text 변환


## 9. Review

- 익숙해질 때까지 반복 숙달할 목적으로 auth 구현 코드를 살펴보았다.

- vscode 에서 플러그인으로 삽입된 jwt, setCookie 에 대해 빨간줄이 뜬다.
  - 빨간줄이 없어지지 않는게 많이 거슬린다. (TS 가 싫어지는 이유)

- elysia 설정은 함수형 프로그래밍 스타일이라 코드가 어색하다.
  - 함수 파라미터로 함수를 넣는데, 나름의 스타일로 정리가 필요하다.
  - zod 같은 타입 가드 기능(`t`)이 있어 편리하다.

- 원본의 prisma 대신에 drizzle 을 사용해 보았다. 아주 좋다.
  - 그냥 sql 적용하고, 그에 맞춰서 수작업으로 schema 작성하는게 편하다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
