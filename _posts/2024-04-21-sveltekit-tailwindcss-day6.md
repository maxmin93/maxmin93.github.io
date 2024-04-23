---
date: 2024-04-21 00:00:00 +0900
title: SvelteKit Tailwind 튜토리얼 - 6일차
categories: ["frontend","tailwind"]
tags: ["tutorial","svelte5","6th-day"]
image: "https://cdn.icon-icons.com/icons2/2699/PNG/512/tailwindcss_logo_icon_170649.png"
---

> TailGrids 의 샘플 Templates 들을 Svelte5 로 변환하며 runes 와 Tailwind CSS 사용법을 공부합니다. 외워질 때까지 여러번 반복하여 숙달합니다.
{: .prompt-tip }

- [SvelteKit Tailwind 튜토리얼 - 1일차](/posts/2023-07-10-sveltekit-tailwindcss-day1/) : Tailwind Labs
- [SvelteKit Tailwind 튜토리얼 - 2일차](/posts/2023-12-01-sveltekit-tailwindcss-day2/) : Plugins &amp; Tools
- [SvelteKit Tailwind 튜토리얼 - 3일차](/posts/2023-12-13-sveltekit-tailwindcss-day3/) : Tutorial &#35;1
- [SvelteKit Tailwind 튜토리얼 - 4일차](/posts/2024-03-10-sveltekit-tailwindcss-day4/) : Tutorial &#35;2
- [SvelteKit Tailwind 튜토리얼 - 5일차](/posts/2024-04-20-sveltekit-tailwindcss-day5/) : Tutorial &#35;3
- [SvelteKit Tailwind 튜토리얼 - 6일차](/posts/2024-04-21-sveltekit-tailwindcss-day6/) : Tutorial &#35;4 &nbsp; &#10004;

## 0. 개요

- [x] Bun 1.1.3 + Svelte 5 preview
  - prettier
  - [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte)
- [x] TailwindCSS 3.4.1 + typography
  - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss)
  - [vite-plugin-tailwind-purgecss](https://www.npmjs.com/package/vite-plugin-tailwind-purgecss) 0.1.3
  - [daisyui](https://daisyui.com/docs/colors/) : (dark 선택자 대신에) color 테마를 활용
- [x] Etc
  - fonts : 한글 Noto Sans KR, D2Coding


## 1. 프로젝트 생성

> 참고

- [2024-02-26-svelte5-runes-example1 - 1. 프로젝트 생성](/posts/2024-02-26-svelte5-runes-example1/)
- [SvelteKit Tailwind 튜토리얼 - 4일차](/posts/2024-03-10-sveltekit-tailwindcss-day4/)
  - 이전에 만들어 본 TailGrids Agency Site 와 많은 부분이 흡사하다.

### TailGrids - Dashboard and Admin Template

> top 화면

<img src="/2024/04/21-tailgrids-templates-site3-top.png" alt="TailGrids - Dashboard and Admin Template" width="80%" />

> 전체 화면

<!-- img src="/2024/04/21-tailgrids-templates-site3-whole.png" alt="TailGrids - Dashboard and Admin Template" width="200px" /-->

> Template Section and Pages

- Home
- NavMenu
- Dashboard
- Orders
- Messages
- Notifications
- Sales
- Events
- Charts
- Docs
- Settings
- Account Settings
- Log In and Log Out
- Sales Analytics - Chart and Graph
- Revenue and Sales Section
- Product Table
- 404 Page


## 2. `+page.svelte`

### 작업 절차

1. 상단의 메뉴바 작성 (절대위치)
2. 상단 메뉴바를 감싸는 전체 container 작성
3. 상단 메뉴바 보다 우선순위를 갖는 사이드 메뉴바를 작성하여 끼워넣기
4. 사이드바 토글 버튼을 만들고 open 상태 변수를 작성하여 translate 클래스와 연결
5. 사이드바 open 때에 전체 화면을 반투명하게 가리는 outside 영역을 작성하고 닫기 연결
6. ...

### 전체 코드

```html

```


## 3. 레이아웃

> 사이드바 close 상태 (light 테마)

<img src="/2024/04/21-site3-mobile-sidebar-close-light.png" alt="Admin Template - Sidebar Layout - Close" width="40%" />

> 사이드바 open 상태 (dark 테마)

<img src="/2024/04/21-site3-mobile-sidebar-open-dark.png" alt="Admin Template - Sidebar Layout - Open" width="40%" />

### `+page.svelte`

- 생략가능(optional) 함수 파라미터의 JSDoc 표현식 : `@param {boolean=} value`

```html
<script>
  // 사이드 메뉴
  const sidebarController = (() => {
    /** @type {boolean} */
    let isOpen = $state(false);
    return {
      /** @param {boolean=} value */
      toggle: (value = undefined) => {
        if (value === undefined) {
          isOpen = !isOpen;
        } else {
          isOpen = value;
        }
      },
      get open() {
        return isOpen;
      },
    };
  })();
</script>

<section class="relative flex min-h-screen w-full items-start bg-base-100">
  <!-- 사이드바 위치 고정 -->
  <div
    class="{sidebarController.open
      ? 'translate-x-0'
      : '-translate-x-full'} absolute left-0 top-0 z-40 flex min-h-screen w-full max-w-[90px] flex-col justify-between bg-base-200 shadow-md duration-200 xl:translate-x-0"
  >
    <!-- || Sidebar menu Start -->
    <SidebarSection />
    <!-- || Sidebar menu End -->
  </div>

  <!-- Sidebar outside click -->
  <div
    onclick={() => {
      sidebarController.toggle();
    }}
    class="{sidebarController.open
      ? 'translate-x-0'
      : '-translate-x-full'} fixed left-0 top-0 z-30 h-screen w-full bg-neutral bg-opacity-80 xl:hidden"
  ></div>

  <!-- Content Area -->
  <div class="w-full xl:pl-[90px]">
    <!-- || Header Menu Section Start -->
    <HeaderSection {sidebarController} />
    <!-- || Header Menu Section End -->
  </div>
</section>
```

### 상단 메뉴바 

- 사이드바 open 버튼
- 검색창
- 툴바 : light/dark 테마, 칼렌더, 알림, 메시지, 프로파일

> `header-section.svelte`

```html
<header class="w-full bg-base-100">
  <div
    class="relative flex items-center justify-end bg-base-200 py-3 pl-[70px] pr-3 sm:justify-between md:pl-20 md:pr-8 xl:pl-8"
  >
    <!-- Hamburger Menu Button -->
    <button
      onclick={() => {
        sidebarController.toggle(true);
      }}
    >...</button>

    <!-- Search Input Box -->
    <div class="hidden sm:block">
      <div class="flex items-center">
        <span>...</span>
        <input type="text" ... />
      </div>
    </div>

    <!-- Toolbar -->
    <div>
      <div class="flex items-center">
        <!-- Theme Changer : light/dark -->
        <div class="mr-5 mt-2 hidden md:block">
          <!-- daisyui theme-controller ... -->
        </div>
        <!-- Calendar -->
        <div class="mr-5 hidden md:block">...</div>
        <!-- Alert -->
        <div class="relative mr-5 hidden md:block">...</div>
        <!-- Email -->
        <div class="relative mr-5 hidden md:block">...</div>
        <!-- Profile -->
        <div class="group relative">...</div>       
      </div>
    </div>

  </div>
</header>  
```

### 사이드바 

- 로고 이미지 (링크)
- 툴바 : 홈, 대시보드, 오더, 메시지, 판매, 이벤트, 차트, 문서
- 툴바 분리선
- 툴바 : 메시지, 설정, 로그아웃
- 프로파일 아바타

> `sidebar-section.svelte`

```html
<script>
  import LogoSvg from '$lib/assets/images/logo/logo.svg';
  import Avatar5Img from '$lib/assets/images/avatar/image-05.jpg';
</script>

<aside>
  <!-- 로고(Home) -->
  <div class="px-7 pb-7 pt-9">
    <a href={undefined}>
      <img src={LogoSvg} alt="logo" class="h-8 w-8" />
    </a>
  </div>

  <!-- 툴바 -->
  <nav>
    <ul>
      <!-- Home 버튼 -->
      <li class="group relative">
        <!-- 아이콘 링크 -->
        <a
          href={undefined}
          class="relative flex items-center justify-center border-r-4 border-transparent px-9 py-3 text-base font-medium text-base-content duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
        >...</a>
        <!-- 라벨 (hover 할 때 translate 로 출력) -->
        <span
          class="invisible absolute left-[115%] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[5px] bg-base-100 px-[14px] py-[6px] text-sm text-base-content shadow-md group-hover:visible"
        >...</span>
      </li>
      <!-- 나머지 툴바 버튼들... -->
      <li class="group relative">...</li>
    </ul>
  </nav>

  <!-- Profile : Avatar(image) -->
  <div class="px-6 py-10">
    <div class="flex items-center">...</div>
  </div>
</aside>
```


## 4. 컴포넌트

### 차트

### 테이블

### 다이얼로그 입력창



## 9. Review

- 나머지는 다음에..


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
