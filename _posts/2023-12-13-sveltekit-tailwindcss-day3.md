---
date: 2023-12-13 00:00:00 +0900
title: SvelteKit Tailwind 튜토리얼 - 3일차
description: Tailwind CSS 튜토리얼들을 공부합니다. 유튜브에 좋은 강좌들이 많아서 하나씩 정복하려고 합니다. 나중에는 클론 프로젝트도 살펴봅니다.
categories: [Frontend, CSS]
tags: [tailwind]
image: "https://cdn.icon-icons.com/icons2/2699/PNG/512/tailwindcss_logo_icon_170649.png"
---

> 목록
{: .prompt-tip }

- [SvelteKit Tailwind 튜토리얼 - 1일차](/posts/sveltekit-tailwindcss-day1/) : Tailwind Labs &ndash; [Insta UI](https://www.youtube.com/watch?v=v74SZBVMPa0)
- [SvelteKit Tailwind 튜토리얼 - 2일차](/posts/sveltekit-tailwindcss-day2/) : Plugins &amp; Tools
- [SvelteKit Tailwind 튜토리얼 - 3일차](/posts/sveltekit-tailwindcss-day3/) : Tutorial &#35;1 &nbsp; &#10004;

## 0. 개요

- [x] Bun 1.0.15 + SvelteKit 1.20.4
  - prettier
  - [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte)
- [x] TailwindCSS 3.3.5 + postcss
  - forms + typography
  - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss)
  - [vite-plugin-tailwind-purgecss](https://www.npmjs.com/package/vite-plugin-tailwind-purgecss) 0.1.3
  - [tailwindcss-debug-screens](https://www.npmjs.com/package/tailwindcss-debug-screens)
  - [tailwind-merge](https://www.npmjs.com/package/tailwind-merge)
- [x] Etc
  - [svelte-hero-icons](https://www.npmjs.com/package/svelte-hero-icons)
  - [date-and-time](https://www.npmjs.com/package/date-and-time)
  - fonts : 한글 Noto Sans CJK KR, D2Coding, 

## 1. 프로젝트 생성

참고 : [2023-12-01-sveltekit-tailwindcss-day2 - 1. 프로젝트 생성](/posts/sveltekit-tailwindcss-day2/#1-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EC%83%9D%EC%84%B1)

## 2. 유튜브 [Tailwind 강좌를 보는 것은 시간낭비다](https://www.youtube.com/watch?v=Ksn1tThNTjI)

- [Tailwind Cheatsheet](https://tailwindcomponents.com/cheatsheet/) 를 활용하고
- VSCode 의 tailwindcss extension 을 사용하고
- [TailwindCSS 공식문서](https://tailwindcss.com/docs/) 에서 검색해 봐라
- 중요한 기초는 [Core Concepts](https://tailwindcss.com/docs/utility-first) 에 있으니 꼭 읽어보고

## 3. 유튜브 [Dave Gray - 초보자를 위한 TailwindCSS 강좌](https://www.youtube.com/watch?v=pYaamz6AyvU&list=PL0Zuz27SZ-6M8znNpim8dRiICRrP5HPft)

소스 : [깃허브 - gitdagray/tailwind-css-course](https://github.com/gitdagray/tailwind-css-course)

### Lesson &#35;1

> 목표

- tailwind 기초 연습

> 내용

- 원을 그리고 `rounded-full`
- 중앙을 정의할 전체 높이를 정한다 `min-h-screen`
- 원을 중앙에 위치시킨다 (grid) `grid place-content-center`

```html
<!-- +layout -->
<div class="grid min-h-screen place-content-center">
  <!-- +page -->
  <div class="h-52 w-52 rounded-full bg-emerald-500 shadow-2xl"></div>
</div>
```

- 원안에 또 원을 넣고 싶으면?
  - parent 의 모든 높이를 사용하려면 `min-h-full`
    - `min-h-max` 는 child 의 최대 높이라서 안통한다.

```html
<!-- +layout -->
<div class="grid min-h-screen place-content-center">
  <!-- +page -->
  <div class="h-52 w-52 rounded-full bg-emerald-500 shadow-2xl">
    <div class="grid min-h-full place-content-center">
      <div class="h-32 w-32 rounded-full bg-red-500 shadow-xl"></div>
    </div>    
  </div>
</div>
```

- 별도의 class 를 정의하고 사용하려면?
  - 또 원 하나를 넣고 싶으면, parent 에 grid 와 영역 높이를 정의해야 한다.
  - style 에서 class 정의하여 사용
    - radial-gradient() 함수로 색상 지정
  - `lang="postcss"` 를 사용하면 postcss 전처리기를 사용한다.

- grid 대신에 flex 를 사용한다면?
  - grid 대신에 flex 를 넣고
  - 주축 정렬에 `justify-center`, 보조축 정렬에 `items-center` 를 사용

```svelte
<!-- +layout -->
<div class="radial-blue grid min-h-screen place-content-center">
  <!-- +page -->
  <div class="h-52 w-52 rounded-full bg-emerald-500 shadow-2xl">
    <!-- container 1 -->
    <div class="grid min-h-full place-content-center">
      <!-- container 2 -->
      <div
        class="grid h-32 min-h-full w-32 place-content-center rounded-full bg-teal-500 shadow-xl"
      >
        <div class="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 shadow-xl">&sharp;1</div>
      </div>
    </div>
  </div>
</div>

<style lang="postcss">
  .radial-blue {
    background: radial-gradient(lightyellow, skyblue);
  }
</style>
```

### Lesson &#35;2

> 목표

- 메뉴 헤더
- hero 섹션
- 반응형 레이아웃 : 모바일 또는 SM 이상 스크린

> 내용

- 소스 코드에서 이미지 파일 복사 &rarr; `$lib/assets/lesson2/`
- body 대신에 `+layout.svelte` 이용
  - view 100% 이용 `min-h-screen`
  - background color 지정 (dark 모드의 bg 와 text 도 지정)
- header 상단에 붙이기 : `sticky top-0 z-10` 
- section 메뉴 만들기
  - 최대 너비를 지정하고 그 이상은 margin auto 처리하기 `max-w-4xl mx-auto`
  - 햄버거 버튼은 sm 이상에서 숨긴다 (sm >= width 640) `sm:hidden`
- nav 메뉴 그룹
  - sm 미만에서는 숨기고 sm 부터 표시 `hidden sm:block`
  - 메뉴 항목 간의 간격 지정 `space-x-8`
  - 메인 메뉴임을 설명 (접근성 속성) `aria-label="main"`
- main 콘텐츠 구역
  - 최대 너비와 자동 마진 `max-x-4xl mx-auto`
- section 콘텐츠 구역
  - (기본) 역순으로 세로 주축 flex 정렬 `flex flex-col-reverse`
  - sm 이상부터 가로로 정렬 `sm:flex-row`
  - (앵커로) 스크롤 이동시 상단 마진 지정 `scroll-mt-40`
  - 전체 패딩, 세로(y=위아래) 마진 `p-6 my-12`
- article 콘텐츠 구역
  - sm 이상에서 너비 50% 적용 `sm:w-1/2`
  - (기본) 최대 너비 `max-w-md` : 하위 항목에 모두 공통이라 이쪽으로 옮겼음
- h2 컨텐츠 제목
  - (기본) 4xl 크기로 텍스트 가운데 쓰기 `text-4xl text-center`
  - sm 이상에서는 5xl 크기로 왼쪽 쓰기 `sm:text-5xl sm:text-left`
- p 컨텐츠 내용
  - 위쪽에 여유 공간 만들고, 가운데 정렬 `mt-4 text-center`
  - sm 부터 왼쪽 정렬시키고 `sm:text-left`
  - dark 모드의 텍스트 색상 지정 `dark:text-slate-400`
- img 컨텐츠 이미지
  - (기본) 너비 50% 지정 `w-1/2`
- hr 가로선
  - 너비 50% 지정, 그 이상은 자동 마진 `mx-auto w-1/2`  
- 하위 콘텐츠 section
  - 세로 마진, 패딩 설정 `my-12 p-6`

### Lesson &#35;3

> 목표

- Lesson &#35;2 내용에 이어서
- Section 추가 : Testimonials, Contact Us
- 인용문 따옴표 추가 : 절대 위치 지정, transform 과 translate
- Footer 추가
- 사용자 스크린 정의 및 사용자 유틸리티 클래스 추가

> 내용

- section  
  - widescreen, tallscreen 에서 section-min-height 적용
    - tailwind config 에서 스크린 widescreen, tallscreen 정의
    - `app.pcss` 에서 utilities 레이어에 대해 section-min-height 정의
    - section 이 화면을 채우도록 최소 높이 설정 `min-height: calc(100vh - 68px);`
    - hero 섹션의 내용이 짧아도 다음 testimonials 섹션의 내용이 나타나지 않는다.

> `68px` 사이즈는 header 의 text-3xl 요소를 기준으로 작성되었다 (30px + 36px)

```js
// tailwind.config.js
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      screens: {
        widescreen: { raw: '(min-aspect-ratio: 3/2)' },
        tallscreen: { raw: '(min-aspect-ratio: 1/2)' }
      },
    }
  }
}        
```

```scss
/* app.pcss */
@tailwind utilities;

@layer utilities {
  .section-min-height {
    min-height: calc(100vh - 68px);
  }
}
```

- figure 인용 문구용 그룹 영역
- blockquote 인용 문구 영역
  - 인용 따옴표 위치 설정을 위해 상대 좌표 기준 선언 `relative`
- p 인용 문장
  - `before:` 따옴표 추가 `content-[var(--block-quote-open)]`
    - open 위치 지정 `absolute left-0 top-0`
  - `after:` 따옴표 추가 `content-[var(--block-quote-close)]`
    - close 위치 지정 `absolute right-0 bottom-0`
    - 2D 변형 (짤림 방지) `translate-y-14 transform`

```css
/* 역슬래쉬(\) 때문에 변수로 지정하여 사용함 */
  :root {
    --block-quote-open: '\201C';
    --block-quote-close: '\201D';
  }
```

#### [Tailwind - 사용자 정의 유틸리티 클래스 추가하기](https://tailwindcss.com/docs/adding-custom-styles#adding-custom-utilities)

- utilities 레이어에 사용자 style 클래스를 정의할 수 있다.
- 단, vue/svelte 등의 [컴포넌트 style 에서 `@layer` 를 사용할 수 없다.](https://tailwindcss.com/docs/adding-custom-styles#layers-and-per-component-css)
  - 오류 메시지 : "`@layer utilities` is used but no matching `@tailwind utilities` directive is present."
  - 오류를 고치려면, `@layer` 문을 최상위 `app.pcss` 파일에서 사용해야 한다.

#### [CSS transform 변경과 absolute 위치 지정 중 어느 것을 사용하는게 나을까요?](https://stackoverflow.com/questions/11100747/css-translation-vs-changing-absolute-positioning-values)

- transform 은 GPU 를 사용하는 가속장치를 이용하기 때문에 더 좋은 성능을 낸다.
- absolute 위치 지정은 레이아웃의 일부이고 CPU 를 이용한다.

### Lesson &#35;4

> 목표

- Lesson &#35;3 내용에 이어서
- 햄버거 메뉴 애니메이션
- 모바일 메뉴
- 반응형 네비게이션바

> 내용

- button 햄버거 메뉴 버튼
  - 햄버거 메뉴 모양의 가운데 가로선 div 를 두고, before 와 after 로 위/아래선 생성
  - 클릭시 'X' 버튼으로 before 와 after 를 변형시키기 `toggle-btn`

```scss
@layer utilities {
  .toggle-btn {
    @apply [&>div::after]:translate-y-0 [&>div::after]:-rotate-45 [&>div::before]:translate-y-0 [&>div::before]:rotate-45 [&>div]:rotate-[720deg] [&>div]:bg-transparent;
  }
}
```

- section 모바일 메뉴 펼치기
  - 메뉴 펼칠 때 탄성 효과 애니메이션 animate-open-menu
  - 햄버거 메뉴 클릭시 효과: toggle(hidden), toggle(flex)
    - 스크립트로 처리

```svelte
<script>
  /** @type { HTMLElement } */
  let hamburgerBtn; // button
  /** @type { HTMLElement } */
  let mobileMenu; // section

  const toggleMenu = () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenu.classList.toggle('flex');
    hamburgerBtn.classList.toggle('toggle-btn');
  };
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<button
  bind:this={hamburgerBtn}
  on:click={toggleMenu}
  id="hamburger-button"
  class="relative h-8 w-8 cursor-pointer text-3xl md:hidden"
>

<section
  bind:this={mobileMenu}
  on:click={toggleMenu}
  id="mobile-menu"
  class="top-68 animate-open-menu absolute hidden w-full origin-top flex-col justify-center bg-black text-5xl"
>
  <!-- ... -->
</section>

<style lang="postcss">
  .animate-open-menu {
    animation: open-menu 0.5s ease-in-out forwards;
  }

  @keyframes open-menu {
    0% {
      transform: scaleY(0);
    }

    80% {
      transform: scaleY(1.2);
    }

    100% {
      transform: scaleY(1);
    }
  }
</style>  
```

관련 내용은 [CSS 튜토리얼 - pull-down 메뉴의 햄버거 아이콘](/posts/frontend-tutorial-day4/#pull-down-%EB%A9%94%EB%89%B4%EC%9D%98-%ED%96%84%EB%B2%84%EA%B1%B0-%EC%95%84%EC%9D%B4%EC%BD%98) 에서 한번 다루었던 것이라 참고하면 된다.

## 9. Review

- 작성하던 중에 [SvelteKit 2.0 릴리즈](https://svelte.dev/blog/sveltekit-2) 소식이 나왔다. Tailwind 설정 해봤는데 이상없다.
  - svelte 버전이 4.2.7 이라 변동 없고, 2024년에 svelte 5.0 나온다고 한다.
  - 참고 : [Huntabyte - I already love SvelteKit v2](https://www.youtube.com/watch?v=B19DEGEclfk)

- 더 많은 tailwind 예제와 연습이 필요하다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
