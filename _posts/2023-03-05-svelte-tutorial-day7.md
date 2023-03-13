---
date: 2023-03-05 00:00:00 +0000
title: Svelte 공부하기 - 7일차
categories: ["nodejs","svelte"]
tags: ["frontend","tutorial","7th-day"]
image: "https://assets.stickpng.com/images/584830e8cef1014c0b5e4aa0.png"
hidden: true
---

> 프론트엔드 프레임워크인 SvelteKit 에 대해 공부한다. Svelte 와 함께 사용할 수 있는 인증 라이브러리 튜토리얼들을 보충한다. (7일차)
{: .prompt-tip }

- [Svelte 공부하기 - 1일차](/posts/2022-12-07-svelte-tutorial-day1/) : Svelte
- [Svelte 공부하기 - 2일차](/posts/2022-12-14-svelte-tutorial-day2/) : SvelteKit + CSS
- [Svelte 공부하기 - 3일차](/posts/2022-12-18-svelte-tutorial-day3/) : SvelteKit 구조, 작동방식
- [Svelte 공부하기 - 4일차](/posts/2022-12-20-svelte-tutorial-day4/) : SvelteKit 애플리케이션 예제
- [Svelte 공부하기 - 5일차](/posts/2022-12-30-svelte-tutorial-day5/) : Supabase 인증, DB 연동 <span style='font-size:1.5rem;'>&nbsp; &#10004;</span>

## 1. SvelteKit + [Lucia](https://lucia-auth.com/) + Prisma

자체 DB로 인증 서비스를 구축할 수 있는 Auth 라이브러리이다.

- User 가 생성한 여러개의 Session 을 개별적으로 login/logout 관리 가능
- User 에 Custom 필드를 추가하는 것이 유연하다.
- Next.js, Astro, SvelteKit 과 연동할 수 있다.
  + Dart 버전 클라이언트는 없다. (아마도 예정?)
- 현재 Lucia 의 최신 버전은 `0.7.1`

```console
pnpm i lucia-auth @lucia-auth/sveltekit @lucia-auth/adapter-prisma
```

### 1) Lucia 초기화

- prisma adapter 를 등록하고
- lucia 생성자로 Auth 타입을 정의
  + UserData 로 사용할 필드를 지정할 수 있다.
    * 예제에서는 username 과 name 을 추가했음 (userId는 기본)

```ts
import lucia from 'lucia-auth'
import prismaAdapter from '@lucia-auth/adapter-prisma'
import { dev } from '$app/environment'
import { prisma } from '$lib/server/prisma'

export const auth = lucia({
  adapter: prismaAdapter(prisma),
  env: dev ? 'DEV' : 'PROD',
  transformUserData: (userData) => {
    return {
      userId: userData.id,
      username: userData.username,
      name: userData.name
    }
  }
})

export type Auth = typeof auth
```

### 2) [prisma schema](https://lucia-auth.com/learn/adapters/prisma#schema): User, Key, Session

- User 는 계정에 대한 유일 개체이고, Key 와 Session 은 로직에 따라 관리됨
- User 와 Key 는 1:M 관계
  + hashed 처리된 password 와 함께 신규 Key 생성 (Register)
  + expires 자동 처리 (패스워드 변경)
- User 와 Session 은 1:M 관계
  + validateKeyPassword 로 생성된 키로 Session 생성 (Login)
  + active_expires, idle_expires 자동 처리 (Logout)

```prisma
model User {
  id       String    @id @unique
  session  Session[]
  Key      Key[]
  // here you can add custom fields for your user
  // e.g. name, email, username, roles, etc.

  @@map("user")
}

model Session {
  id             String @id @unique
  user_id        String
  active_expires BigInt
  idle_expires   BigInt
  user           User   @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
  @@map("session")
}

model Key {
  id              String  @id @unique
  hashed_password String?
  user_id         String
  primary         Boolean
  expires         BigInt?
  user            User    @relation(references: [id], fields: [user_id], onDelete: Cascade)

  @@index([user_id])
  @@map("key")
}
```

### 4) [OAuth 연동](https://lucia-auth.com/oauth/start-here/getting-started)

#### Provider

- Discord
- Facebook
- Github
- Google
- Patreon
- Reddit
- Twitch

### 3) 예제 참고

[SvelteKit Authentication with Lucia & Prisma](https://www.youtube.com/watch?v=UMpKaZy0Rpc) - Huntabyte

## 2.


## 9. Summary

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
