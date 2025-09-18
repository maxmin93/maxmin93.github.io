---
date: 2023-06-24 00:00:00 +0900
title: Prisma ORM 튜토리얼
description: nodejs 에서 가장 널리 쓰이는 ORM 라이브러리인 Prisma 사용법을 공부합니다.
categories: [Backend, ORM]
tags: ["prisma","typescript","postgresql"]
image: "https://seeklogo.com/images/P/prisma-logo-BE375CFB25-seeklogo.com.png"
---

## 1. [Prisma](https://www.prisma.io/docs/concepts/overview/what-is-prisma)

### 1) 특징

기존 ORM 들은 객체지향모델을 사용해 맵핑하고 클래스 코드를 직접 작성하는데 반해, Prisma 는 모델 코드를 자동 생성해주는 장점이 있다. 

- 모델 코드를 자동으로 작성해 개발 생산성을 높인다
- 개발자의 실수를 줄여주는 건전한 제약 사항을 제공

### 2) 모델 생성 과정

![prisma-client-generation-workflow](https://www.prisma.io/docs/static/0e7b01ad1504ad4b171484e55f71ba41/4c573/prisma-client-generation-workflow.png){: width="600" .w-75}
_prisma client generation workflow_

- 초기에 migration 으로 DB 부터 테이블까지 자동 생성이 가능
- 또는 변경 사항을 읽어 반복적으로 모델에 반영한다

### 3) 구성요소

- Prisma Client: 안전한 타입 쿼리 빌더
- Prisma Migrate: 마이그레이션 시스템
- Prisma Studio: 데이터 GUI 편집기


## 2. Prisma Tutorial

### 1) [시작하기](https://www.prisma.io/docs/getting-started/quickstart)

> typescript 프로젝트 생성

```console
# 프로젝트 디렉토리 생성
$ mkdir hello-prisma 
$ cd hello-prisma

# nodejs 개발환경 설정
$ npm init -y 

# typescript 개발환경 설정
$ npm install typescript ts-node @types/node --save-dev
$ npx tsc --init
```

> Prisma 설치 및 DB 접속정보 설정

```console
$ npm install prisma --save-dev

$ npx prisma init --datasource-provider postgresql
```

초기화를 실행하면, `prisma/schema.prisma` 파일이 생성된다.

```js
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

`.env` 파일도 생성되어 있다. DATABASE_URL 을 작성한다.

```env
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=${DB_SCHEMA}"
```

`migration` 을 위해 `DB_USER` 가 db_owner 또는 schema_owner 이어야 한다.

> model 작성 : `prisma/schema.prisma`

Postgresql 의 경우, 대소문자를 가리기 때문에 관리를 위해 이름을 지정하면 편하다. `@@map` 은 테이블명을, `@map` 은 컬럼명을 지정할 수 있다.

```js
// 상단 내용 그대로 유지하고, 아래에 추가

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]

  @@map("tutorial_user")  // 테이블 이름
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String?
  published Boolean @default(false)
  author    User    @relation(fields: [authorId], references: [id])
  authorId  Int

  @@map("tutorial_post")  // 테이블 이름
}
```

> migration + generation

```console
$ npx prisma migrate dev --name init
```

- `prisma/migrations` 폴더에 모델 생성을 위한 SQL 파일이 생성된다
- migration 에 generation 도 포함되어, prismaClient 코드도 자동생성 된다.
  + `node_modules/.prisma/client` 아래에 모델 코드 생성

> ts 파일 작성 및 실행: "script.ts"

코드는 [공식문서](https://www.prisma.io/docs/getting-started/quickstart#4-explore-how-to-send-queries-to-your-database-with-prisma-client)를 참조할 것

```console
$ touch script.ts  # 생성

$ npx ts-node script.ts  # 실행
```

> 데이터 탐색 및 수정: prisma studio

```console
$ npx prisma studio
```

### 2) 직접 실행 및 쿼리

쿼리를 조작하여 성능 저하 또는 오류를 일으키는 공격으로부터 보호하기 위해 Prisma.sql 을 사용하도록 권장하고 있다.

```ts
async function test3() {
  const email = 'david@prisma.io'
  const result = await prisma.$queryRaw(
    Prisma.sql`SELECT * FROM prisma."User" WHERE email = ${email}`
  )
  console.log(`find by email:`, result)
}
```

> NOTE: Prisma.sql 의 formatter 는 값(values)에 대해서만 작동한다. 테이블 또는 컬럼 이름 같은 Identifier 에 대해서는 작동하지 않는다.

이같은 경우, 부득이 문자열을 직접 입력할 수 있는 Unsafe 함수를 사용한다.

- 직접 쿼리: prisma.$queryRawUnsafe("...")
- 직접 실행: prisma.$executeRawUnsafe("...") 

```ts
async function test4(include_age:boolean) {
  const cols = 'gender' + include_age ? ', age' : '';
  const stmt = `select ${cols} from test`;
  console.log('stmt:', stmt);

  try {
    const result = await db.$queryRawUnsafe<unknown[]>(stmt);
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}
```

### 3) [트랜잭션](https://www.prisma.io/docs/concepts/components/prisma-client/transactions#the-transaction-api)

> 순차 작업 : 트랜잭션 내에서 순차적으로 실행될 쿼리 배열을 전달

```ts
const [posts, totalPosts] = await prisma.$transaction([
  prisma.post.findMany({ where: { title: { contains: 'prisma' } } }),
  prisma.post.count(),
])

const [userList, updateUser] = await prisma.$transaction([
  prisma.$queryRaw`SELECT 'title' FROM User`,
  prisma.$executeRaw`UPDATE User SET name = 'Hello' WHERE id = 2;`,
])
```

> 대화형 트랜잭션 : 쿼리, 코드 등 트랜잭션에서 실행될 제어 흐름을 전달

- sender 에게서 잔액(balance) 을 amount 만큼 차감시키고
- 이 때, 잔액이 0 이하이면 오류 발생 (이체 불가능)
- 성공시에는 recipient 의 잔액을 amount 만큼 증감시킨다

```ts
async function transfer(from: string, to: string, amount: number) {
  return await prisma.$transaction(async (tx) => {
    // 1. Decrement amount from the sender.
    const sender = await tx.account.update({
      data: {
        balance: {
          decrement: amount,
        },
      },
      where: {
        email: from,
      },
    })

    // 2. Verify that the sender's balance didn't go below zero.
    if (sender.balance < 0) {
      throw new Error(`${from} doesn't have enough to send ${amount}`)
    }

    // 3. Increment the recipient's balance by amount
    const recipient = await tx.account.update({
      data: {
        balance: {
          increment: amount,
        },
      },
      where: {
        email: to,
      },
    })

    return recipient
  })
}

async function main() {
  // This transfer is successful
  await transfer('alice@prisma.io', 'bob@prisma.io', 100)
  // This transfer fails because Alice doesn't have enough funds in her account
  await transfer('alice@prisma.io', 'bob@prisma.io', 100)
}
```

### 4) 그밖에 기능들

> [Full-text search](https://www.prisma.io/docs/concepts/components/prisma-client/full-text-search)

```js
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["fullTextSearch"]
}
```

Postgresql 의 경우, [(참고)](https://www.postgresql.org/docs/current/functions-textsearch.html)

- `fox & dog` : The text contains 'fox' and 'dog'
- `!cat` : 'cat' is not in the text
- `fox | cat` : The text contains 'fox' or 'cat'
- `fox <-> dog` : 'dog' follows 'fox' in the text

> 계산 필드 [Computed fields](https://www.prisma.io/docs/concepts/components/prisma-client/computed-fields)

User 모델에 fullName 이라는 계산 필드를 추가

```ts
const prisma = new PrismaClient().$extends({
  result: {
    user: {
      fullName: {
        needs: { firstName: true, lastName: true },
        compute(user) {
          return `${user.firstName} ${user.lastName}`
        },
      },
    },
  },
})
```
- 

## 3. 활용 케이스

### 1) 이미 존재하는 기존 스키마, 테이블을 읽어서 적용하는 경우

`db pull` 을 위해 USAGE on schema, SELECT on table 권한이 필요하다.

```sql
-- reader role 권한
GRANT CONNECT ON DATABASE dev TO reader;
GRANT USAGE ON SCHEMA tutorial to reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA tutorial
  GRANT SELECT ON TABLES TO reader;
```

db 스키마와 테이블 컬럼을 읽고 model 과 client 를 자동생성한다.

```console
$ npx prisma db pull

$ npx prisma generate
```

### 2) 접속 후 DB role 을 변경하여 적용하는 방법

SvelteKit 의 경우 `lib/server/database.ts` 에 작성한다.

```ts
import { PrismaClient, Prisma } from '@prisma/client';
import { DB_ROLE } from '$env/static/private';

const db = new PrismaClient({ errorFormat: 'pretty' });
await db.$executeRawUnsafe(`set role "${DB_ROLE}"`);

const stmt = Prisma.sql`select current_user, session_user`;
const result = await db.$queryRaw<unknown[]>(stmt2);
console.log(result?.[0])

export default db;
```

## 9. Review

- Nextjs, Nuxt, SvelteKit 등은 server 기능을 포함하기 때문에, prisma 를 연결하여 직접 데이터를 다룰 수 있다. 이럴 경우, 애플리케이션만 시작하면 되기 때문에 유지보수 측면에서 관리 포인트가 줄어든다는 장점이 있다.
  + 만약, 서버 기능이 커진다면 [Graphile](https://www.graphile.org/postgraphile/introduction/), [Hasura](https://hasura.io/docs/latest/index/), [Nestjs](https://docs.nestjs.com/) 등을 미들웨어로 쓰는 방법을 고려할 수 있다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }