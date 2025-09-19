---
date: 2024-05-29 00:00:00 +0900
title: SvelteKit Tailwind 튜토리얼 - 7일차
description: Svelte 4 + daisyUI + supabase 튜토리얼을 Svelte 5 로 변환하며 runes 와 Tailwind CSS 사용법을 공부합니다. 외워질 때까지 여러번 반복하여 숙달합니다.
categories: [Frontend, CSS]
tags: [tailwind, svelte, supabase]
image: "https://cdn.icon-icons.com/icons2/2699/PNG/512/tailwindcss_logo_icon_170649.png"
---

> 목록
{: .prompt-tip }

- [SvelteKit Tailwind 튜토리얼 - 1일차](/posts/sveltekit-tailwindcss-day1/) : Tailwind Labs
- [SvelteKit Tailwind 튜토리얼 - 2일차](/posts/sveltekit-tailwindcss-day2/) : Plugins &amp; Tools
- [SvelteKit Tailwind 튜토리얼 - 3일차](/posts/sveltekit-tailwindcss-day3/) : Tutorial &#35;1
- [SvelteKit Tailwind 튜토리얼 - 4일차](/posts/sveltekit-tailwindcss-day4/) : Tutorial &#35;2
- [SvelteKit Tailwind 튜토리얼 - 5일차](/posts/sveltekit-tailwindcss-day5/) : Tutorial &#35;3
- [SvelteKit Tailwind 튜토리얼 - 6일차](/posts/sveltekit-tailwindcss-day6/) : Tutorial &#35;4
- [SvelteKit Tailwind 튜토리얼 - 7일차](/posts/sveltekit-tailwindcss-day7/) : Tutorial &#35;5 &nbsp; &#10004;

## 0. 개요

출처 : [SvelteKit & Supabase Project Build #1 - Intro & Setup](https://youtu.be/JZRzP5QFXV8?si=yB8KfQHV-nFYdtxh)

[pokeapi.co](https://pokeapi.co) 에서 제공하는 포켓몬 API 를 사용하여 사용자별 MyPage 에서 자신의 포켓몬 카드 3장과 코멘트를 조회하고 수정할 수 있다.

### Features

- 홈페이지 : top 메뉴, 메인 섹션
  - 로그인 하면 사용자 email 출력 및 메뉴 변경
  - daisyUI 의 light/dark 테마 변경 (custom 색상 추가)
- 로그인페이지 : supabase ID/PW
  - 로그인 하면 홈페이지로 이동
- 마이페이지
  - supabase 테이블에서 사용자 데이터 읽어오기
  - 화면에 사용자의 pokemon 카드 3장과 코멘트 출력
  - 전체 pokemon 카드 리스트에서 선택 및 코멘트 수정하여 DB 저장
  - 로그아웃 하면 홈페이지로 이동

### 화면캡쳐

> 마이페이지

![](https://github.com/maxmin93/svelte5-pokepage/raw/main/static/images/29-svelte5-pokepage-mypage.png){: width="560" .w-75}
_pokepage-mypage_

> 마이페이지 : edit 다이얼로그

![](https://github.com/maxmin93/svelte5-pokepage/raw/main/static/images/29-svelte5-pokepage-editpage.png){: width="560" .w-75}
_pokepage-mypage-edit_

> 홈페이지

![](https://github.com/maxmin93/svelte5-pokepage/raw/main/static/images/29-svelte5-pokepage-home.png){: width="560" .w-75}
_pokepage-home_

> 로그인페이지

![](https://github.com/maxmin93/svelte5-pokepage/raw/main/static/images/29-svelte5-pokepage-login.png){: width="560" .w-75}
_pokepage-login_

### 라이브러리

- [x] Bun 1.1.7 + Svelte 5 preview
  - prettier
  - [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte)
- [x] TailwindCSS 3.4.1 + typography
  - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss)
  - [vite-plugin-tailwind-purgecss](https://www.npmjs.com/package/vite-plugin-tailwind-purgecss) 0.1.3
  - [daisyui](https://daisyui.com/) 4.11.1
- [x] Supabase + auth-ui-svelte
  - ID/PW Login
  - 테이블 pokemons 생성 및 핸들링
- [x] Etc
  - fonts : 한글 Noto Sans KR, D2Coding
  - [svelte-remixicon](https://remixicon.com/) 2.4.0


## 1. Supabase Auth

참고 : [Supabase SvelteKit Guide](https://supabase.com/docs/guides/auth/server-side/sveltekit)

출처에서는 hooks 을 사용하지 않고 브라우저 단의 LayoutData 를 이용하여 supabase.auth 와 session 을 사용하고 있다.

### [인증 아키텍처 (4계층)](https://supabase.com/docs/guides/auth/architecture)

SDK 는 browser 또는 server 모드에서 모두 사용 가능하다.

1. 클라이언트 레이어 (SDK) : 브라우저 또는 백엔드에서 실행 가능
2. Kong API 게이트웨이 : 단순 전달
3. GoTrue (인증서비스) : JWT 검증과 발급, DB 또는 OAuth 에 대한 서비스 브로커
4. PostgreSQL 데이터베이스 : 사용자 테이블, RLS, 권한관리

#### [인증을 위한 서버측 렌더링 (SSR)](https://supabase.com/docs/guides/auth/server-side/sveltekit)

Supabase 는 클라이언트 API 를 사용하여 브라우저 기반에서도 충분히 잘 작동한다. 반면에, SSR 은 서버 기반의 인증 방식을 사용한다. client 가 가벼워진다.

> SSR 을 사용하는 이유

SSR 프레임워크는 렌더링 및 데이터 가져오기를 서버로 이동하여 클라이언트 번들 크기와 실행 시간을 줄입니다.

#### [사용자 인증 방법](https://supabase.com/docs/guides/auth/users#the-user-object)

- 비밀번호 기반
- (비밀번호를 사용하지 않는) 이메일, 전화 기반
- OAuth
- SAML SSO

> ID 를 생성할 수 있는 수단 (ID 타입) : 사용자는 여러 ID를 가질 수 있음

- 이메일
- 핸드폰
- OAuth
- SAML

### supabase auth event 순서

`+layout.js` 로부터 생성된 LayoutData 는 `$props` 를 통해 전계층으로 전달된다.

- `depends('supabase:auth')` 선언된 부분만 invalidate 할 수 있다.
  - 보통 Logout 할 때 data 초기화를 위해 필요하다.
- LayoutData 도 반응형 전달체이기 때문에 `$effect` 로 변경 처리를 할 수 있다.
- AuthState 의 비동기 event 는 DOM 처리보다 뒤늦게 도착한다.
- onAuthStateChange 콜백은 ROOT js 또는 svelte 스크립트에서 설정한다.
  - 출처에서는 `+layout.svelte` 에서 했는데, `+layout.js` 에서 해도 된다.

> 첫페이지

HOME 상단메뉴에 login 버튼이 나타나고, 첫페이지 출력

1. ROOT `+layout.js` : createBrowserClient 호출하여 data 전달 (access_token)
2. ROOT `+layout.svelte` : onAuthStateChange 콜백 설정
3. HOME `+layout.svelte` : data 로부터 session 갱신
4. HOME `+page.svelte` : Login 버튼 출력 (session == null)
5. onAuthStateChange 콜백 : INITIAL_SESSION 이벤트 도착 (무반응)

> 로그인

로그인 입력폼에 ID/PWD 입력하면 user.email 이 표시된 첫페이지로 이동

1. HOME : login 버튼 클릭하여 login 페이지 이동
2. LOGIN `+page.svelte` : ID/PWD 입력 => AuthState 상태 변경
3. onAuthStateChange 콜백 : SINGED_IN event 수신 후 전계층 data 재전송
4. ROOT `+layout.js` : createBrowserClient 호출하여 data 전달 (access_token)
5. LOGIN `+page.svelte` : 변경된 data.session 로 인해 첫페이지 이동
6. HOME `+layout.svelte` : data 로부터 session, user.email 갱신
7. HOME `+page.svelte` : Login 버튼 없이 첫페이지 출력

> 로그아웃

auth.signOut() 호출시 HOME 상단메뉴의 user.email 표시가 없어지고 Login 버튼 출력

1. HOME `+layout.svelte` 상단의 logout 클릭 => AuthState 상태 변경
2. onAuthStateChange 콜백 : SINGED_OUT event 수신 후 전계층 data 재전송 (또는 페이지 이동)
3. HOME `+layout.svelte` : data 로부터 session 갱신 (session == null)

#### side effect 순서

DOM 렌더링 전에 설정이 필요한 경우 `$effect.pre` 를 사용한다. (ex) width/height 크기)

1. `$effect.pre` : DOM 의 beforeUpdate (ex: autoscroll 상태값)
2. `onMount` : 컴포넌트가 DOM 에 mount 될 때 한번만 실행
3. `$effect` : DOM 의 afterUpdate (ex: autoscroll 상태 변경에 대한 반영)


## 2. Supabase DB

1. 테이블 생성
2. RLS 활성화
3. policy 설정 : select, insert, update

```sql
-- 1. Create table
drop table if exists pokemons;

create table pokemons (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users on delete cascade,
  email text,
  comment text,
  pokemon_ids integer[]  -- '{1,2,3}'
);

-- 1-1. check user_id by email
do $$
declare
  user_email text := 'user@jeju.onl';
  user_id uuid;
begin
  select id into user_id from auth.users where email = user_email;
  raise notice 'ID of user "%" = "%"', user_email, user_id;
end; $$;

-- 1-2. insert sample data
insert into pokemons (user_id, email, comment, pokemon_ids) values(
  (select id from auth.users where email = 'user@jeju.onl'),
  'user@jeju.onl',
  '내가 좋아하는 개구리 포켓몬 3마리를 골랐어요.',
  '{1,2,3}'
);

-- 1-3. select sample data
select * from pokemons;

-- 2. Enable RLS
alter table pokemons enable row level security;

-- 3. Create Policy : select
create policy "Public pokemons are visible to everyone."
on pokemons for select
to anon  -- the Postgres Role (recommended)
using ( true );

-- 또는 자기 데이터만 보이기
-- create policy "User can see their own profile only."
-- on profiles for select
-- using ( (select auth.uid()) = user_id );

-- 4. Create Policy : insert
create policy "Users can create a profile."
on profiles for insert
to authenticated  -- the Postgres Role (recommended)
with check ( (select auth.uid()) = user_id );

-- 5. Create Policy : update
create policy "Users can update their own profile."
on profiles for update
to authenticated  -- the Postgres Role (recommended)
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );
```

## 3. PokePage App

### `+page.svelte`

- LayoutData 로부터 supabase, session 가져오기
- MyProfile 인스턴스 생성
- `$state` : myProfile, myPokemons 선언
- onMount : loadProfile 으로 myProfile 갱신
- `$effect` : getPokemonData 으로 myPokemons 갱신
- Edit Button : 코멘트, 카드 3종 편집을 위한 다이얼로그 열기
- Pokemon Button : pickPokemon 으로 pokemon 카드 선택
- Save Button : saveProfile 실행과 다이얼로그 닫기

#### pokemon 카드 출력

async 함수의 Promise 배열을 받아와 Svelte 의 await 블록으로 처리했다.

```js
  /**
   * pokemon_ids 에 해당하는 pokemonData 를 fetch 반환
   * @param {number[]} pokemonIds
   * @returns {Promise<{id:string, name:string, type:string, imgSrc:string}>[]}
   */
  async getPokemonData(pokemonIds) {
    const data = pokemonIds
      .map(async (id) => {
        const data = await getPokemonById(id);
        if (data) {
          return {
            id,
            name: data.name,
            type: data.types[0].type.name,
            imgSrc: data.sprites.front_default,
          };
        }
      })
      .filter((p) => p);
    console.log('getPokemonData:', data);
    return data;
  }
```

```svelte
<div class="grid grid-cols-3 pb-4">
  <!-- 포켓몬 카드 3장 출력 -->
  {#each myPokemons as data}
    <!-- Promise 데이터 처리를 위한 await 블록 -->
    {#await data then pokemon}
      <div class="bg-pokemoncard card m-4 shadow-lg shadow-blue-900">
        <div class="card-body">
          <div class="text-center">
            <img src={pokemon.imgSrc} alt="Pokemon" class="mx-auto h-32 w-32" />
            <h2 class="text-2xl font-bold text-white">{pokemon.name}</h2>
            <p class="text-info">{pokemon.type}</p>
          </div>
        </div>
      </div>
    {/await}
  {/each}
</div>
```

#### pokemon 리스트에서 카드 선택

Edit 다이얼로그에서 카드 선택할 때와 메인 화면 출력될 때의 pokemon_ids 배열을 각각 따로 사용해야 한다. 그렇치 않으면 선택시마다 메인 화면의 카드가 계속 바뀐다.

```svelte
<script>
  /**
   * Dialog 전체 리스트에서 선택시 사용될 pokemon_ids 복사본
   * - Dialog open 될 때, 복사본 생성
   * - Dialog close 될 때, myProfile 에 반영
   * @type {number[]}
   */
  let pickedIds = $state([]);

  /**
   * @param {Event} event
   */
  function openEditDialog(event) {
    pickedIds = [...myProfile.pokemon_ids];
    searchInput = '';  // 검색 초기화
    pokemonModal?.showModal();
  }

  /**
   * @param {Event} event
   */
  function saveProfile(event) {
    myProfile.pokemon_ids = [...pickedIds];
    myData.saveProfile(myProfile);
    pokemonModal?.close();
  }
</script>

{#each pokemonList as pokemon}
  <!-- 문자열 검색 (없으면 전체 출력) -->
  <!-- "char" 입력시 "charmander", "charizard" 등만 출력 -->
  {#if pokemon.name.includes(searchInput)}
    <button
      onclick={pickPokemon}
      data-pokemon-id={pokemon.id}
      class={'card m-1 items-center justify-center bg-slate-700 p-1' +
        pickedStyle(pokemon.id)}
    >
      <h2 class="text-center text-sm text-white">
        {pokemon.name}
      </h2>
    </button>
  {/if}
{/each}
```

### MyProfile 클래스

supabase 의 사용자 데이터를 다루기 위한 모든 기능을 포함한다.

> 자료구조

- supabase 클라이언트
- profile = { user_id, email, comment, pokemon_ids }
- pokemons = { id, name, type, imgSrc }[]

> 메소드

- loadProfile : profile 읽기 (onMount 에서 실행)
- saveProfile : profile 저장 (save 버튼 클릭시 실행)
- getPokemonData : getPokemonById(pokemon_ids) 로 포켓몬 데이터 전달
  - profile.pokemon_ids 변경시마다 `$effect` 반응형으로 실행

> `onMount` 와 `$effect` 에서 나눠 사용

```js
  let { data } = $props();
  const { supabase, session, pokemonList, myEmail } = data;
  let myData = new MyProfile(supabase, session);

  /**
   * @type { {user_id?: string, email: string, comment: string, pokemon_ids: number[]} }
   */
  let myProfile = $state(myData.profile);
  /**
   * @type {Promise<{id:string, name:string, type:string, imgSrc:string}>[]}
   */
  let myPokemons = $state([]);

  onMount(async () => {
    if (!session) {
      // goto() 는 browser 상태에서만 사용 가능 (또는 onMount)
      // - 반면에 redirect() 는 server(백엔드) 에서 사용
      setTimeout(() => goto('/'));
      return;
    }

    await myData.loadProfile();
    myProfile = myData.profile;
    console.log('1. myProfile:', myProfile);
  });

  $effect(() => {
    (async () => {
      myPokemons = await myData.getPokemonData(myProfile.pokemon_ids);
      console.log('2. myPokemons:', myPokemons);
    })();
  });
```

#### 외부 pokemon API

[pokeapi.co](https://pokeapi.co) 에서 제공하는 포켓몬 API 를 사용한다.

- [getPokemonList](https://pokeapi.co/api/v2/pokemon?limit=151&offset=0)
- [getPokemonByName](https://pokeapi.co/api/v2/pokemon/pikachu)
- [getPokemonById](https://pokeapi.co/api/v2/pokemon/25/)


## 4. daisyUI 작업

class 에 dark 선택자를 기술하지 않고 theme 를 사용하여 처리한다.

### 커스텀 색상 설정

- `pokemoncard` 라는 색상 이름을 추가하여 사용하였다.
- 테마는 light 와 dark 두개만 사용하고 default 설정을 변경했다.
  - neutral, neutral-content 색상을 변경했다.

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // 색상 선택 https://oklch.com/
        pokemoncard: 'oklch(var(--pokemoncard) / <alpha-value>)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    logs: false,
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          neutral: 'white',
          'neutral-content': 'black',
          '--pokemoncard': '37.26% 0.037 160.28',
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          neutral: 'black',
          'neutral-content': 'white',
          '--pokemoncard': '44.52% 0.131 266.16',
        },
      },
    ],
  },
};    
```


## 9. Review

- 거의 한달만에 올린다. 게으름병이 심각하다. 정신차리자!
- Supabase 를 반복하여 더 익숙해지자.
- 소스는 [svelte5-pokepage](https://github.com/maxmin93/svelte5-pokepage) 에 업로드 했다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
