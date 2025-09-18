---
date: 2023-02-18 00:00:00 +0900
title: Nextjs 공부하기 - 1일차
description: 프론트엔드 프레임워크인 Nextjs 에 대해 공부한다. 현재 세계에서 가장 많은 사용자가 사용하는 프레임워크이다. (1일차)
categories: [Frontend]
tags: ["trpc","nextjs","1st-day"]
image: "https://www.jellyfishtechnologies.com/wp-content/uploads/2024/12/nextjs-hero.webp"
---

> 목록
{: .prompt-tip }

- [Nextjs 공부하기 - 1일차](/posts/nextjs-tutorial-day1/) : Svelte &nbsp; &#10004;

## 1. Nextjs

### 1) [pnpm 으로 설치하기](https://medium.com/readytowork-org/how-to-create-next-app-using-pnpm-a2978c9d6b76)

```console
$ pnpm create next-app new-next-app
npx create-next-app@latest my-project --typescript --eslint

# typescript, eslint 템플릿 적용
$ pnpm create next-app ts-next-app --typescript --eslint
  => typescript
  => eslint
  => `src/` directory
  => experimental `app/` directory
  => import alias "@/*": ["./src/*"]

$ cd new-next-app
$ pnpm run dev
```

#### import 경로 별칭 설정

[Absolute Imports and Module path aliases](https://nextjs.org/docs/advanced-features/module-path-aliases)

- 컴포넌트 파일 `components/button.js`
- 참조 `import Button from '@/components/button'`

```json
// tsconfig.json or jsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"]
    }
  }
}
```

#### 디렉토리 구성

- src
  + components
    * Post.tsx
  + pages
    * index.tsx
    * `_app.tsx`
  + styles
    * global.css
  + types
    * index.ts



### 2) [tailwindcss 적용](https://tailwindcss.com/docs/guides/nextjs)

라이브러리 임포트 후 초기화 

```console
$ pnpm install -D tailwindcss postcss autoprefixer
$ pnpx tailwindcss init -p
```

tailwind.config.js 설정

```js
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['"Noto Sans KR"', ...defaultTheme.fontFamily.sans],
      serif: ['"Noto Serif KR"', ...defaultTheme.fontFamily.serif],
      mono: ['D2Coding', ...defaultTheme.fontFamily.mono],
    },      
  },
  plugins: [],
}
```

global.css 설정

```css
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;
```

tailwind 사용 : className 안에 기술

```tsx
  return (
    <>
      <h1 className="text-3xl font-bold">
        Read{" "}
        <Link href="/posts/first-post" className="underline text-blue-500">
          this page!
        </Link>
      </h1>
    </>
    );
 ```

### 3) Layout

React.ReactNode 타입의 children 을 삽입한다.

```tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

props 와 함께 children 가 암시적으로 사용되는 경우는 [FC를 사용한다.](https://stackoverflow.com/a/64722878/6811653)

```tsx
import { FC } from 'react';

// If you want to include more props than just children:
interface MyProps {
   name: string;
}

// props includes children and name properties
const MyComponent: FC<MyProps> = (props) => {};
```

## 2. [T3 App](https://create.t3.gg) : Nextjs + Typescript + TailwindCSS

풀스택 애플리케이션을 빠르게 만들기 위한 Nextjs 템플릿을 제공

- [Typescript](https://www.totaltypescript.com) : 타입 체크를 통해 오류를 줄이고 생산성을 높인다
- nextAuth : OAuth 인증 라이브러리
- prisma : DB ORM
- tailwind : CSS 프레임워크
- trpc : 타입 안전을 보장하며 서버 함수(RPC)를 호출하는 라이브러리

```console
$ pnpm create t3-app@latest <app_name> --default
  => 다중 선택: nextAuth, prisma, tailwind, trpc, envVariables
$ cd default-t3-app
$ pnpm prisma db push  ## 기본 sqlite
$ pnpm dev

# 또는 CI 옵션과 함께 조합 선택
$ pnpm dlx create-t3-app@latest --CI --trpc --tailwind
```

> Guestbook 튜토리얼 참고 

- 블로그 [Build a full stack app with create-t3-app](https://www.nexxel.dev/blog/ct3a-guestbook)
  + 깃허브 [nexxeln/guestbook-blog](https://github.com/nexxeln/guestbook-blog)

### 1) NextAuth.js + Discord

1. [Discord Developers Portal](https://discord.com/developers/) 에서 새로운 프로젝트 생성
2. Auth 메뉴에서 DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET 를 가져오고
3. `.env`에 환경변수로 등록
4. Auth 의 Redirects 에 [http://localhost:3000/api/auth/callback/discord](http://localhost:3000/api/auth/callback/discord) 추가

```tsx
// src/pages/index.tsx

import { signIn, signOut, useSession } from "next-auth/react";

const Home = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <main>Loading...</main>;
  }

  // ...
  {session ? 
    // 로그아웃
    onClick={() => {
      signOut().catch(console.log);
    }}
    :
    // 로그인
    onClick={() => {
      signIn("discord").catch(console.log);
    }}
  // ...
};

export default Home;  
```

> 예제와 다른점

- unstable_getServerSession 대신에 getServerSession 사용 (deprecated)


### 2) Prisma + Postgresql

1. postgresql 을 준비하고, 개발용 스키마 생성 `create schema t3;`
2. schema.prisma 의 datasource 를 `provider = "postgresql"` 로 수정
3. postgresql 을 위해 `@db.Text` 주석들을 해제 
4. 튜토리얼을 위한 Guestbook 모델 추가
5. `pnpx prisma db push` 적용

### 3) [tRPC](https://create.t3.gg/en/usage/trpc#-servertrpccontextts)

기본 골격은 자동으로 코드가 생성되어 있다. Router 만 작성하면 된다.

- `src/server/api/routers/guestbook.ts` 에 새로운 메서드를 생성
  + postMessage : input 을 받아 mutation 처리 
    * `zod` 로 타입 확인 후 object 로 전달
    * `ctx.prisma.guestbook.create` 수행
  + getAll : 모든 방명록을 읽어서 전달
    + `ctx.prisma.guestbook.findMany` 수행
- `src/server/api/root.ts` 에 작성한 Router 를 등록

> 사용할 때는 컴포넌트 어디서든 api 의 메소드를 호출하면 됨

```tsx
// src/pages/index.tsx
import { api } from "../utils/api";

const GuestbookEntries = () => {
  const { data: guestbookEntries, isLoading } = api.guestbook.getAll.useQuery();
  if (isLoading) return <div>Fetching messages...</div>;

  // ...
};
```

### 4) 완성된 튜토리얼 화면

Discord OAuth 로 로그인을 하면, 텍스트 입력 박스로 멘트를 입력할 수 있다.

![t3-app tutorial - Guestbook](/2023/02/18-t3-tutorial-guestbook-w640.png){: width="480" .w-75}
_t3-app tutorial - Guestbook_

## 2. [데이터 처리](https://nextjs.org/docs/basic-features/layouts#data-fetching)

### 1) [SWR](https://swr.vercel.app/ko) (stale-while-revalidate) : 캐시 + fetch

캐시를 탐색하고, 없으면 fetcher 가 작동하는 방식

```jsx
import useSWR from 'swr'

function Profile() {
  const { data, error, isLoading } = useSWR('/api/user', fetcher)

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

## 9. Review

- 일단 업로드 하고 나중에 필요한 부분을 업데이트 하자.
- SvelteKit 의 예제가 부족하기도 하고, 코드 확보를 위해 Nextjs 를 공부한다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

