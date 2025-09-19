---
date: 2023-01-20 00:00:00 +0900
title: 오픈소스 Backend Appwrite
description: Firebase 대체제이고 완전 로 유명한 백엔드 오픈소스 Appwrite 에 대해 알아보자. 웹앱, 모바일앱 개발시 많이 사용된다.
categories: [Backend]
tags: ["oauth","appwrite","realtime","storage"]
image: "https://appwrite.io/images/blog/logo.png"
---

## 1. [Appwrite](https://appwrite.io) 란?

Appwrite는 최신 웹 또는 모바일 애플리케이션을 구축하는 데 필요한 모든 핵심 API를 제공하는 서비스형 오픈 소스 백엔드 솔루션입니다. 다양한 Appwrite 서비스에는 대부분의 널리 사용되는 언어를 지원하는 인증, 데이터베이스, 저장소 및 기능을 관리하기 위한 API가 있습니다.

- [Appwrite 1.0 출시](https://appwrite.io/1.0) (2022년9월14일)
- [Appwrite Console 2.0 출시](https://medium.com/appwrite-io/announcing-console-2-0-2e0e96891cb0) (2022년11월16일)

### 1) 특징

- 간단하고 유연함, 개인정보보호 및 보안
- 100% 오픈소스
- 도커 컨테이너로 배포 : 셀프 호스팅
- 클라우드 버전은 아직 준비중

### 2) 서비스

- [Account](https://appwrite.io/docs/client/account) 사용자 인증 및 계정 관리, 30여개의 OAuth 공급자 지원
- [Users](https://appwrite.io/docs/server/users) 프로젝트 사용자 관리
- [Teams](https://appwrite.io/docs/client/teams) 팀과 사용자를 그룹화, 역활 관리
- [Databases](https://appwrite.io/docs/client/databases) 데이터 관리 (MariaDB, MySQL)
- [Storage](https://appwrite.io/docs/client/storage) 파일 CRUD
- [Functions](https://appwrite.io/docs/server/functions) 격리된 환경에서 다양한 플랫폼의 함수를 실행
- [Realtime](https://appwrite.io/docs/realtime) 실시간 이벤트 발행과 구독
- [Locale](https://appwrite.io/docs/client/locale) 로케일 데이터 관리
- [Avatars](https://appwrite.io/docs/client/avatars) 사용자, 국가, 아이콘, QR코드 등을 관리

### 3) 아키텍처

![overview.drawio.svg](https://raw.githubusercontent.com/appwrite/appwrite/e5a6db613329f5b021d6763de706bdd6ff53269a/docs/specs/overview.drawio.svg){: width="600" .w-75}

## 2. SvelteKit 예제

먼저 Web SDK 를 설치한다.

```console
npm install appwrite
```

### 1) Appwrite Client

예제에서는 API Key 에 대한 언급이 없다. (없으면 권한 없다고 오류 나던데)

```ts
import { Client as Appwrite, Databases, Account } from 'appwrite';

// .env 에서 환경변수를 가져오고
const server = {
  endpoint: import.meta.env.VITE_APP_ENDPOINT.toString(),
  project: import.meta.env.VITE_APP_PROJECT.toString(),
  collection: import.meta.env.VITE_APP_COLLECTION_ID.toString(),
  database: import.meta.env.VITE_APP_DATABASE_ID.toString(),
};

// 클라이언트를 생성하고, Account 와 Databases 클라이언트를 생성
const client = new Appwrite();
const account = new Account(client);
const database = new Databases(client);

// 클라이언트에 Appwrite 접속을 위한 환경변수를 설정
client.setEndpoint(server.endpoint).setProject(server.project);

// 기본 sdk 로 노출하고
const sdk = { account, database };
export { sdk, server };
```

### 2) `+page.svelte`

Appwrite 의 Svelte 예제는 SvelteKit 을 사용하지 않았다. (router 만 사용)

- onMount 로 페이지 로딩시 state 설정
  + Appwrite Account 로 Session을 get 하고
  + state 에 설정한다. (서버에 접속하여 세션을 생성한 후 저장)
  + 세션이 정상적으로 생성되었으면 todos 페이지 이동
- `/todos` 페이지 이동시 state.account 를 체크한다
  - conditionsFailed 인 경우, 루트(`/`) 경로로 이동

```svelte
<script lang="ts">
  import { onMount } from "svelte";
  import { state } from "./store";
  import { sdk } from "./appwrite";

  const routes = {
    "/": Landing,
    "/login": Login,
    "/signup": SignUp,
    "/todos": wrap({
      component: Todo,
      conditions: [() => !!$state.account],
    }),
    "*": Landing,
  };

  onMount(async () => {
    try {
      const account = await sdk.account.get();
      state.init(account);
    } catch (error) {
      state.init(null);
    } finally {
      if ($state.account) {
        push("/todos");
      }
    }
  });
</script>

<Alert />
<Router {routes} on:conditionsFailed={() => push("/")} />
```

### 3) 데이터베이스 서비스

#### Todos

- listDocuments 는 select 테이블과 같다.
- addTodo 는 insert 문인데, user 권한과 ID 가 필요하다.
  + 레코드는 ID 와 json 데이터로 구성: `{ content, is_complete }`
  + account.$id 로 user Role 을 생성하고
  + user Role 에 생성하는 레코드(Document)에 대한 권한을 부여한다.
- updateDocument 시에도 User 권한을 명시해야 함 
- deleteDocument 는 User 권한 없이도 실행이 되는건가?

```ts
const createTodos = () => {
  const { subscribe, update, set } = writable<Todo[]>([]);

  return {
    subscribe,
    fetch: async () => {
      const response: any = await sdk.database.listDocuments(server.database, server.collection);
      console.log(response);
      return set(response.documents);
    },
    addTodo: async (content: string) => {
      const user = Role.user(get(state).account.$id);
      const todo = await sdk.database.createDocument<Todo>(
        server.database,
        server.collection,
        ID.unique(),
        {
          content,
          isComplete: false,
        },
        [
          Permission.read(user),
          Permission.update(user),
          Permission.delete(user),
        ]
      );

      return update((n) => [todo, ...n]);
    },
    removeTodo: async (todo: Todo) => {
      await sdk.database.deleteDocument(server.database, server.collection, todo.$id);
      return update((n) => n.filter((t) => t.$id !== todo.$id));
    },
    updateTodo: async (todo: Partial<Todo>) => {
      const user = Role.user(get(state).account.$id);
      await sdk.database.updateDocument(
        server.database,
        server.collection,
        todo.$id,
        todo,
        [
          Permission.read(user),
          Permission.update(user),
          Permission.delete(user),
        ]
      );
      return update((n) => {
        const index = n.findIndex((t) => t.$id === todo.$id);
        n[index] = {
          ...n[index],
          ...(<Todo>todo),
        };
        return n;
      });
    },
  };
};
```

## 8. 참고자료

### 1) TailwindCSS 템플릿

- [Tailnews - Tailwind News Templates](https://aribudin.gumroad.com/l/tailnews?layout=profile) : [Demo](https://tailnews.tailwindtemplate.net/index.html#)
- [Their Side](https://transmit.tailwindui.com/)

### 2) Appwrite : [Blog](https://dev.to/appwrite)

- [Appwrite Hand-In-Hand with Svelte Kit (SSR)](https://dev.to/meldiron/appwrite-hand-in-hand-with-svelte-kit-ssr-5097)
- [Appwrite Todo Demo - Svelte](https://github.com/appwrite/demo-todo-with-svelte)
- [Appwrite Console - Svelte](https://github.com/appwrite/console)

### 3) [SvelteKit Templates](https://sveltesociety.dev/templates)

- [SwyxKit - SvelteKit Blog Starter](https://swyxkit.netlify.app/)
- [Getting Started with Appwrite in NextJS by Building An App](https://dev.to/qwel/getting-started-with-appwrite-in-nestjs-22gk)
- [How to secure pages with HTTP Basic Auth using SvelteKit](https://dev.to/danawoodman/how-to-secure-pages-with-http-basic-auth-using-sveltekit-1iod)
- [Simplify Authentication in SvelteKit](https://javascript.plainenglish.io/how-to-use-authjs-in-sveltekit-eab6aa18a2ca)

## 9. Review

- 아, 설명서와 예제가 너무 부실하다. 
  + 참고할 코드 조각들이 없어서 뭘 해보려고 해도 답답하다.
  + 소스코드를 뒤져야 이해가 될 듯. 삽질을 많이 해야함
- User, Team 에 대해 Role 을 부여하여 Access Permission 을 제어하는데
  + Account 가 User 와 무슨 관계인지 이해가 안되어 답답하다.
  + Account 는 서비스 사용자이고, User 는 리소스 권한 대상을 가리키나?
- 데이터에 대한 보안을 철저히 한 것은 좋은데, 오버헤드가 커 보인다.

### 소회

- 원스톱으로 Docker 설치가 되는 것을 보고 '와~ 멋지다' 라고 탄성했다.
  + Console 이 바로 실행되는 것을 보고 '정말 좋다' 라고 감탄했다.
  + 그러나 ...
- 내가 굳이 불편한 Appwrite 를 잡고 있을 필요가 있을까?
  + Supabase 처럼 prisma 와 연계할 수 없다. (API로만 사용 가능)
  + Appwrite 는 클라우드 서비스가 아직 없다. 
  + 월 5달러의 돈이 들더라도 신경쓸 필요 없는 Supabase 클라우드를 쓰자.
- 사용자가 많고 예제가 많은 것이 좋은 도구인데, Svelte 는 아직도 부족하다.
  + 그냥 Flutter 로 가는게 맞지 않을까? Web App 도 배포할 수 있다는데.
- 계속 빙빙 돌다보니 시간만 축내고 성과는 내지 못하는 상태가 되었다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
