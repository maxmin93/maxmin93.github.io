---
date: 2023-09-28 00:00:00 +0900
title: Bun 1.0 + Turso + Drizzle 튜토리얼
categories: ["database","sqlite"]
tags: ["bun", "drizzle", "turso", "elysia"]
image: "https://turso.tech/open-graph/turso3.png"
---

> Turso 는 SQLite 의 오픈소스 포크인 `libSQL` 를 기반으로 만든 Edge(분산형) 데이터베이스 서비스(DBasS)로 매우 빠르고 저렴한 것이 특징이다. Drizzle ORM 과 함께 사용하는 방법에 대해 공부한다.
{: .prompt-tip }

## 0. 개요

- [x] Bun 1.0.3 &plus; Elysia (TS)
- [x] Turso (SQLite)
- [x] Drizzle ORM

> 화면 캡쳐

<img alt="books insert - elysia html" src="https://github.com/maxmin93/bun-puppeteer-api/blob/main/assets/elysia-drizzle-turso-books-w600.png?raw=true" width="600px" />

## 1. [Turso](https://turso.tech/)

Turso 는 SQLite 를 Edge(분산형) 서비스 형태로 제공하는 데이터베이스이다.

- 가장 빠른 : CDN 처럼 SQLite 복제본이 가까운 클라우드에서 제공된다.
- 가장 쉬운 : SQLite 의 가볍고 단순한 사용법을 장점으로 삼았다.
- 가장 저렴 : 단일 파일 구조라서 용량 단위로 비용이 청구된다.
  - Starter 플랜(무료)은 데이터베이스 500개, 최대 9GB, Locations 3개

> Turso 의 edge 서비스 예시

<img alt="turso - edge database benchmark" src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*yNj01gILkRW0uklnI3g9ZA.png" width="540px" />

> 참고문서

- [Turso - Blog](https://blog.turso.tech/)
  - [Build a poll-making website using SvelteKit, Turso, Drizzle, and deploy it to Vercel.](https://blog.turso.tech/build-a-poll-making-website-using-sveltekit-turso-drizzle-and-deploy-it-to-vercel-eceb37018a2a)
    - [깃허브 - turso-extended/app-at-the-polls](https://github.com/turso-extended/app-at-the-polls)
- [Drizzle - Turso(SQLite)](https://orm.drizzle.team/docs/quick-sqlite/turso)
- [깃허브 - NTAK666/try-bun](https://github.com/NTAK666/try-bun)
  - BETH Stack : Bun + Elysia + Turso + HTMX
- [깃허브 - justinfriebel/sveltekit-turso-drizzle](https://github.com/justinfriebel/sveltekit-turso-drizzle)

### [CLI 설치](https://docs.turso.tech/tutorials/get-started-turso-cli/step-01-installation) 및 [로그인](https://docs.turso.tech/tutorials/get-started-turso-cli/step-02-sign-up)

- 한번 로그인 해 두면 환경변수로 API 토큰 설정 안해도 되더라.
  - 참고 : [Running remotely](https://docs.turso.tech/reference/turso-cli#running-remotely)

```bash
# macOS
brew install tursodatabase/tap/turso
# Linux or WSL
curl -sSfL https://get.tur.so/install.sh | bash

# 웹브라우저 로그인 : account 생성
turso auth signup

# 인증 토큰 조회
turso auth token
# "token..."

export TURSO_API_TOKEN=[YOUR-TOKEN-STRING]
```

### [데이터베이스 생성 및 관리](https://docs.turso.tech/tutorials/get-started-turso-cli/step-03-create-database)

- [Turso 대시보드](https://turso.tech/app)
- DB 관리를 위해 생성(create)과 삭제(destroy)를 기억해 두고
- 평상시에는 shell 로 테이블과 데이터를 관리한다.

```bash
# default 위치에 db 생성
turso db create my-db

# Turso SQL shell
turso db shell my-db

turso db show my-db
# Name: my-db
# URL: libsql://[DB-NAME]-[ORG-NAME].turso.io
# Locations: sin (일단은 primary 하나 밖에 없음)

turso db tokens create my-db
# "token..."

turso db list

turso db destroy my-db
# Are you sure? [y/n]
```

#### group 및 location 관리

- primary location 은 변경할 방법이 없는 듯 하다. (CLI 에서 가장 가까운 지역)
- 설정으로 꼭 포함할 지역을 추가(add) 할 수 있다.

```bash
turso db locations
# nrt  Tokyo, Japan
# hkg  Hong Kong, Hong Kong
# sin  Singapore, Singapore  [default]
# ...

turso group locations add default nrt
# Group default replicated to nrt in 6 seconds.

turso group locationslist default
# nrt, sin (primary)

turso db create --location nrt my-db
# primary 지역(sin)에 하나 생기고, nrt 에 복사본 생성

# 복사본 추가 생성
# turso db replicate my-db hkg
```

### [Turso 로컬 개발환경 설정](https://github.com/libsql/sqld/blob/main/docs/BUILD-RUN.md)

데몬 프로그램으로 sqld 가 필요하다.

```console
# macOS 설치
$ brew tap libsql/sqld
$ brew install sqld

# 또는 Docker
$ docker run -p 8080:8080 -d ghcr.io/libsql/sqld:latest

$ turso dev
sqld listening on port 8080.
Use the following URL to configure your libSQL client SDK for local development:

    http://127.0.0.1:8080
```

또는 로컬 파일로 생성할 수 있다.

```console
$ turso dev --db-file book.sqlite   
```

## 2. [ElaysiaJS](https://elysiajs.com/introduction.html) 로 REST API 만들기

앞서 작성했던 [bun-puppeteer-tutorial](/posts/2023-09-23-bun-puppeteer-tutorial/) 코드를 조금 더 다듬어 보았다.

- ElaysiaJS : ExpressJS 유사 프레임워크
- Turso(libSQL)
- Drizzle ORM

### `use` 로 파일 분리하기

db, html, puppeteer 등 기능별로 파일을 분리하고, `index.ts` 에서 통합한다.

- [src]
  - index.ts
  - server-db.ts
  - server-html.ts
  - server-puppeteer.ts
  - [html]
    - index.html
    - script.js
  - [lib]
    - db.ts
    - error.ts
    - scraper.ts

```ts
import { Elysia, t, NotFoundError } from 'elysia';
import { handleError } from '$lib/error';
import { Browser } from 'puppeteer';
import { app as dbApp } from './server-db';
import { app as htmlApp } from './server-html';
import { app as puppeteerApp } from './server-puppeteer';

const app = new Elysia()
  .use(dbApp)
  .use(htmlApp)
  .use(puppeteerApp)
  .onError((err) => handleError(err))
  .onStart(async ({ browser }) => {
    console.log('💫 Elysia start!');
    if (browser && browser instanceof Browser) {
      console.log('Browser version :', await browser.version());
    }
  })
  .onStop(async ({ browser, db }) => {
    if (browser && browser instanceof Browser) {
      await browser.close();
      console.log('Browser is closed!');
    }
    console.log('💤 Elysia stop!');
  });
```

> 참고: [깃허브 - gaurishhs/bun-web-app](https://github.com/gaurishhs/bun-web-app/blob/main/index.ts)

### typebox 이용한 params, query 타입 검증 및 변환

숫자의 경우 `transform` 단계가 필요한데, elysia 에서 [상용구 `t.Numeric`](https://elysiajs.com/concept/numeric.html)으로 지원한다.

- elysia 의 `t` 는 [typebox](https://github.com/sinclairzx81/typebox)를 다시 export 한 이름(alias)이다.
  - typebox 는 zod 라이브러리와 유사하다. Typescript 를 검증과 변환 등을 수행
- 쿼리 파리미터는 query 로, 경로 파라미터는 params 로 접근한다.

```ts
import { t } from 'elysia';

const app = new Elysia()
  .get(
    '/query',
    ({ query: { id } }) => {
      console.log(`query params: id=${id}`, typeof id);
      return {
        type: 'query',
        params: [id],
      };
    },
    {
      query: t.Object({
        id: t.Numeric(), // parseInt(query.id) 대신에 형변환 처리
      }),
    }
  );
```

#### [복잡한 model 정의를 분리하는 방법](https://elysiajs.com/patterns/reference-models.html)

- POST 메소드를 위한 body 모델을 정의
  - 필수 요소로 name, author 가 필요하다
- response 를 위해 필수 및 생략가능(Optional) 속성으로 구성 
  - success 는 꼭 필요
  - operator, data, affectedId 등은 생략 가능 (Nullable 과는 다르다)
- model 은 use 키워드로 적용되고, 타입 검증시 alias 로 접근한다.
  - 입력으로 book 모델 이용
  - 출력으로 result 모델 이용

```ts
const bookModel = new Elysia().model({
  book: t.Object({
    name: t.String(),
    author: t.String(),
  }),
  result: t.Object({
    success: t.Boolean(),
    operator: t.Optional(
      // === operator?: string
      t.Union([t.Literal('create'), t.Literal('update'), t.Literal('delete')])
    ),
    data: t.Optional(t.Object({})),
    affectedId: t.Optional(t.Number()),
  }),
});

export const app = new Elysia()
  .use(bookModel)
  .decorate('db', new BooksDatabase())
  .get('/books', ({ db }) => db.getBooks())  
  .post(
    '/books',
    async ({ db, body }) => {
      try {
        const result = await db.addBook(body);
        return { success: true, data: result.shift() };
      } catch (e) {
        console.error('create:', e);
        return { success: false, operator: 'create' };
      }
    },
    {
      body: 'book',
      response: 'result',
    }
  )  
```

## 3. drizzle orm 으로 turso 다루기

> 참고문서

- [Drizzle ORM - SQLite 컬럼 타입](https://orm.drizzle.team/docs/column-types/sqlite) : schema 정의시 사용
  - 추가 : [Drizzle 예제 - 깃허브 libSQL(Hono)](https://github.com/drizzle-team/drizzle-orm/blob/main/examples/libsql/src/server.ts)
- [Turso 예제 - 깃허브 api-mug-store-api](https://github.com/turso-extended/api-mug-store-api)
  - 추가 : [Turso 예제 - 이커머스 상점(Remix, Drizzle, Turso)](https://docs.turso.tech/tutorials/e-commerce-store-codelab/)

### books 테이블 스키마

Turso 는 `libSQL` 기반이기 때문에 `sqlite-core` 를 사용하면 된다.

```ts
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// https://orm.drizzle.team/docs/column-types/sqlite
export const books = sqliteTable('books', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  author: text('author').notNull(),
});

/*
CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  author TEXT
)
*/
```

### Drizzle ORM 로 CRUD 처리하기

Books 를 다루기 위한 메소드들을 묶어 `BooksDatabase` 클래스로 정의했다.

```ts
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { sql, eq } from 'drizzle-orm';
import * as schema from '../../drizzle/schema';

export type NewBook = typeof schema.books.$inferInsert;

export class BooksDatabase {
  private db: LibSQLDatabase;

  constructor() {
    if (process.env.TURSO_DB_URL === undefined) {
      throw new Error('TURSO_DB_URL is not defined');
    }
    if (process.env.TURSO_DB_AUTH_TOKEN === undefined) {
      throw new Error('TURSO_DB_AUTH_TOKEN is not defined');
    }

    const client = createClient({
      url: process.env.TURSO_DB_URL,
      authToken: process.env.TURSO_DB_AUTH_TOKEN,
    });
    this.db = drizzle(client);

    this.init()
      .then(() => console.log('Database initialized'))
      .catch(console.error);
  }

  async init() {
    return this.db.run(sql`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        author TEXT
      )
    `);
  }

  async getBooks() {
    return await this.db.select().from(schema.books);
  }

  async addBook(book: NewBook) {
    return await this.db
      .insert(schema.books)
      .values({
        name: book.name,
        author: book.author,
      })
      .returning();
  }

  async updateBook(id: number, book: NewBook) {
    return await this.db
      .update(schema.books)
      .set({
        name: book.name,
        author: book.author,
      })
      .where(eq(schema.books.id, id))
      .returning({ affectedId: schema.books.id });
  }

  async deleteBook(id: number) {
    return await this.db
      .delete(schema.books)
      .where(eq(schema.books.id, id))
      .returning({ affectedId: schema.books.id });
  }
}
```

#### Insert 를 위한 타입 추정 상용구 : `$inferInsert`

- `id` 컬럼은 생략 가능한 형태로 타입을 생성한다.
  - select 를 위한 타입 추정에는 `$inferSelect` 를 사용 (id 포함)

```ts
export type NewBook = typeof schema.books.$inferInsert;

/*
export interface NewBook {
    id?: number;
    name: string;
    author: string;
}
*/
```

#### insert/update/delete 이후 결과 반환 : `returning`

- Drizzle 에서 postgresql, sqlite 에 대해 지원한다. (mysql 제외)
- returning 의 반환 형태로 컬럼 스키마를 지정할 수 있다.
  - `affectedId` 컬럼으로 `id` 값을 반환하도록 작성
  - 이후 elysia 에서 response 모델로 `affectedId` 속성을 작성

```ts
    return await this.db
      .delete(schema.books)
      .where(eq(schema.books.id, id))
      .returning({ affectedId: schema.books.id });
```

## 9. Summary

- 중간에 `Table is locked` 오류가 있었는데, 재로그인 하니깐 해결되었다.
  - 개발중이라 오류로 중단되는 경우가 많았는데 그 탓에 close 처리가 안되어 발생 
- Turso 가 빠르다는건 모르겠다. 글로벌로 제공해야 edge 효과를 얻을듯.
  - 다만 무료 버전이라도 마음껏 DB 를 생성하는건 좋다.
  - 그래서 로컬 개발환경은 아직 사용해보지 못했다. 
- Elysia 에 더 익숙해지는 기회가 되었다. 다루기 편해지니깐 좋아졌다.
- Docker 작업은 다음에 하자.

> 참고

- [깃허브 - pedroosz/elysia-kickstart](https://github.com/pedroosz/elysia-kickstart)
- [깃허브 - stooezy/api-w-elysiajs](https://github.com/stooezy/api-w-elysiajs)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
