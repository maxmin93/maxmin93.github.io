---
date: 2024-03-10 00:00:00 +0900
title: SvelteKit Tailwind 튜토리얼 - 4일차
description: Tailwind CSS 튜토리얼들을 공부합니다. 같은 내용이 반복되는 것 같지만 익숙해질 때까지 다른 방법은 없다고 생각합니다. 유튜브의 좋은 강좌들을 하나씩 정복하려고 합니다.
categories: [Frontend, CSS]
tags: [tailwind, svelte]
image: "https://cdn.icon-icons.com/icons2/2699/PNG/512/tailwindcss_logo_icon_170649.png"
---

> 목록
{: .prompt-tip }

- [SvelteKit Tailwind 튜토리얼 - 1일차](/posts/sveltekit-tailwindcss-day1/) : Tailwind Labs
- [SvelteKit Tailwind 튜토리얼 - 2일차](/posts/sveltekit-tailwindcss-day2/) : Plugins &amp; Tools
- [SvelteKit Tailwind 튜토리얼 - 3일차](/posts/sveltekit-tailwindcss-day3/) : Tutorial &#35;1
- [SvelteKit Tailwind 튜토리얼 - 4일차](/posts/sveltekit-tailwindcss-day4/) : Tutorial &#35;2 &nbsp; &#10004;


## 0. 개요

- [x] Bun 1.0.30 + Svelte 5 preview
  - prettier
  - [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte)
- [x] TailwindCSS 3.4.1 + typography
  - daisyUI
  - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss)
  - [vite-plugin-tailwind-purgecss](https://www.npmjs.com/package/vite-plugin-tailwind-purgecss) 0.1.3
- [x] Etc
  - fonts : 한글 Noto Sans KR, D2Coding
  - [splidejs](https://splidejs.com/)
  - Kakao Map

## 1. 프로젝트 생성

참고 : [2024-02-26-svelte5-runes-example1 - 1. 프로젝트 생성](/posts/svelte5-runes-example1/)

### svelte.config.js

- a11y 관련 메시지 무시하기

```js
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
  },
  onwarn: (warning, handler) => {
    // console.log('** onwarn code:', warning.code);
    if (warning.code.startsWith('a11y-')) {
      return;
    }
    handler(warning);
  },
};

export default config;
```

### tailwind.config.js

- theme
  - screens : 스크린 사이즈 사용자 정의
  - container : center 적용과 padding 정의
  - fontFamily : 폰트 적용 순서
  - extend : 확장 설정
    - colors : 색상 변수
    - boxShadow : 박스 그림자 변수
    - dropShadow : (아이콘 같은) 박스가 아닌 형태에 대한 그림자 변수
  - plugins : typography, daisyui
  - daisyui

```js
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        dark: '#090E34',
        ...
      },
      boxShadow: {
        two: '0px 1px 4px rgba(0, 0, 0, 0.12)',
        three: '0px 1px 5px rgba(0, 0, 0, 0.14)',
        ...
      },
      dropShadow: {
        tooltip: '0px 0px 2px rgba(0, 0, 0, 0.14)',
        ...
      },
    },
    container: (theme) => ({
      center: true,
      padding: {
        DEFAULT: theme('spacing.4'),
        sm: theme('spacing.5'),
        lg: theme('spacing.6'),
        xl: theme('spacing.8'),
      },
    }),
    screens: {
      xs: '400px',
      sm: '540px',
      md: '720px',
      lg: '960px',
      xl: '1140px',
      '2xl': '1320px',
    },
    fontFamily: {
      sans: ['"Noto Sans KR"', ...defaultTheme.fontFamily.sans],
      serif: ['"Noto Serif KR"', ...defaultTheme.fontFamily.serif],
      mono: ['D2Coding', ...defaultTheme.fontFamily.mono],
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    logs: false,
    themes: false,
  },
};
```

### app.pcss

- 폰트 설치 : Noto Sans KR, Noto Serif KR, D2Coding
- [splidejs](https://splidejs.com/) 기본 css 설치 : slider/carousel 라이브러리
  - 자동으로 node_modules 위치에서 읽어온다 (`~` 필요없음)
- html 기본 스타일
  - 부드러운 scroll
  - 기본 폰트 스타일
  - 기본 폰트 크기

```css
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');
@import url('//cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-ligature-full.css');
@import '@splidejs/splide/css';

@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth; /* 부드러운 스크롤 */
  font-family: font-sans;
  font-size: clamp(1rem, 2.2vh, 1.5rem);
}
```

## 2. 템플릿 구성요소 만들기

### Svelte &amp; Kakao Map 예제

- [Kakao Map - Web API](https://apis.map.kakao.com/web/)
  - app.html 의 body 안에 kakao map 라이브러리 임포트
    - `dapi.kakao.com/v2/maps/sdk.js?appkey={자바스크립트 API Key}`
  - div 에 style 로 width, height 설정 필요 (tailwind class 안됨)
  - API 사용법
    - [지도 생성](https://apis.map.kakao.com/web/sample/basicMap/)
    - [컨트롤러 추가](https://apis.map.kakao.com/web/sample/addMapControl/)
    - [마커 생성](https://apis.map.kakao.com/web/sample/basicMarker/)
    - [지도 이동 막기](https://apis.map.kakao.com/web/sample/disableMapDragMove/)

- [Svelte Action](https://svelte.dev/docs/svelte-action)
  - HTMLElement 렌더링 때에 실행되는 Action 정의
  - onMount 를 통해 수행해도 되지만, 특정 element 에 종속시켜 세련되게 처리 가능

```html
<script>
  /**
   *  @type { {
   *    addControl: (arg0: any, arg1: any) => void;
   *    setDraggable: (arg0: boolean) => void;
   *  } }
   */
  let map;

  /** @type {import('svelte/action').Action<HTMLElement, any>}  */
  function setupKakaoMap(node, kakao) {
    let options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3, // 지도의 레벨 (확대, 축소 정도)
    };
    // 지도 생성
    map = new kakao.maps.Map(node, options);

    // 일반 지도와 스카이뷰로 전환할 수 있는 컨트롤 생성
    let mapTypeControl = new kakao.maps.MapTypeControl();
    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

    let markerPosition = new kakao.maps.LatLng(33.450701, 126.570667);
    let marker = new kakao.maps.Marker({
      position: markerPosition,
    });
    marker.setMap(map);

    // 사용자 이벤트
    node.dispatchEvent(new CustomEvent('emit', { detail: 'hello' }));

    return {
      destroy() {
        if (map) {
          mapTypeControl = null;
          markerPosition = null;
          marker = null;
          // @ts-ignore
          map = null;
        }
      },
    };
  }

  /** @type { (event:{detail:string}) => void } */
  function handleEmit(event) {
    console.log('Map.onEmit:', event.detail);
  }
</script>

<div on:emit={handleEmit} use:setupKakaoMap={window.kakao} style="width:500px;height:400px;"></div>
<div class="mt-4">
  <button
    class="btn"
    onclick={() => {
      map.setDraggable(false);
    } } >지도 드래그 이동 끄기</button
  >
  <button
    class="btn"
    onclick={() => {
      map.setDraggable(true);
    } } >지도 드래그 이동 켜기</button
  >
</div>
```

![](/2024/03/10-svelte-kakaomap-example.png){: width="560" .w-75}
_svelte-kakaomap-example_

#### window 전역변수에 kakao 등록하기

- `window.kakao` 사용시 미등록 타입으로 인한 컴파일 오류 해결 방법
- Window 인터페이스 타입에 kakao 를 등록하고 기본값 `{}` 설정

```ts
declare global {
  interface Window {
    kakao: any;
  }
  namespace App {
  }
}

window.kakao = window.kakao || {};

export {};
```

### Svelte &amp; Splider 예제

- Slide root 아래에 `track > list > slide` 순서로 작성
  - 중간에 다른 요소가 끼워져 있으면 안됨
- [splide options](https://splidejs.com/guides/options)
  - type : 슬라이딩 동작
  - arrows : 좌우의 기본 컨트롤러 없애기 
    - 대신에 하단에 별도의 슬라이드 이동 버튼을 만들어 API 연결
  - perPage : 페이지 당 슬라이드 출력 개수
  - 슬라이더 전체 width 와 height
    - 슬라이더 개별 fixedWidth, fixedHeight 지정시 auto 크기는 무효화 됨
  - 클래스 
    - pagenation : 원형 page 를 감싸는 container
    - page : 슬라이드 선택용 원형 버튼

```html
<script>
  import { onMount } from 'svelte';
  import { Splide } from '@splidejs/splide';

  /** @type { import('@splidejs/splide').Splide } */
  let splide;

  /** @type {import('svelte/action').Action<HTMLElement>}  */
  function setupSplide(node) {
    /** @type { import('@splidejs/splide').Options } */
    let options = {
      type: 'loop',
      arrows: false, // hide
      padding: '2rem',
      perPage: 1,
      width: '40em',
      // fixedWidth: '20rem', // width of slide
      height: '10rem',
      classes: {
        pagination: 'splide__pagination bg-red-100 -bottom-2',
        page: 'splide__pagination__page bg-blue-400',
      },
    };

    splide = new Splide(node, options);
    splide.mount();

    return {
      destroy() {
        splide.destroy();
      },
    };
  }
</script>

<div class="container mx-auto">
  <!-- Slide root : track > list > slide -->
  <section class="splide" use:setupSplide>
    <h2 id="carousel-heading">Splide Basic HTML Example</h2>
    <div class="splide__arrows">
      <button class="splide__arrow splide__arrow--prev">Prev</button>
      <button class="splide__arrow splide__arrow--next">Next</button>
    </div>

    <div class="splide__track">
      <ul class="splide__list">
        <li class="splide__slide">Slide 01</li>
        <li class="splide__slide">Slide 02</li>
        <li class="splide__slide">Slide 03</li>
      </ul>
    </div>
  </section>

  <!-- controller -->
  <div class="mt-4 flex w-1/2 justify-center gap-8 border">
    <button class="btn btn-accent px-8"
      onclick={() => splide.go('<')}>Prev</button>
    <button class="btn btn-accent px-8"
      onclick={() => splide.go('>')}>Next</button>
  </div>
</div>
```

![](/2024/03/10-svelte-splide-example.png){: width="560" .w-75}
_svelte-splide-example_

### [Flex 로 반응형 컬럼 Grid 구현하기](https://laravelnews.s3.amazonaws.com/images/grid-system-equal-height-buttons-1643380450.png)

- wrapper 의 `flex flex-wrap` 이 핵심 포인트
  - wrapper 에서 `-mx-4` 한 후에, column 에서 `p-4` 으로 채운다. 
- column 에서 콘텐츠의 너비를 지정 : 1/2 또는 1/3  

```html
<!-- Container -->
<div class="max-w-screen-xl mx-auto px-4">
  <!-- Grid wrapper -->
  <div class="-mx-4 flex flex-wrap">

    <!-- Grid column 1 -->
    <div class="w-full p-4 sm:w-1/2 lg:w-1/3">
      <!-- Column contents -->
      <div class="px-10 py-12 bg-white rounded-lg shadow-lg">
        <!-- Card contents -->
      </div>
    </div>

    <!-- Grid column 2 -->
    <div class="w-full p-4 sm:w-1/2 lg:w-1/3">
      <!-- Column contents -->
      <div class="px-10 py-12 bg-white rounded-lg shadow-lg">
        <!-- Card contents -->
      </div>
    </div>

    <!-- Grid column 3 -->
    <div class="w-full p-4 sm:w-1/2 lg:w-1/3">
      <!-- Column contents -->
      <div class="px-10 py-12 bg-white rounded-lg shadow-lg">
        <!-- Card contents -->
      </div>
    </div>

  </div>
</div>
```

![](https://laravelnews.s3.amazonaws.com/images/grid-system-equal-height-buttons-1643380450.png){: width="560" .w-75}
_Bootstrap-like responsive column grid with Tailwind CSS and flexbox_

## 3. [TailGrid - Agency Site Template](https://tailgrids.com/templates)

- 섹션별로 svelte 파일 분리
- 풀다운 메뉴 컨트롤러 navController 를 하위 요소에 전달
- window.scrollY 이벤트를 연결하여 scrolledFromTop 반응형 변수 변경
- 팀 구성원 정보를 PageData.members 로 받아서 하위 요소에 전달

> 팁

- 개발 편의를 위해 페이지 로딩시 자동으로 최하단으로 window.scrollTo 이동


```html
<script>
  import { onMount } from 'svelte';
  import TeamSection from './team-section.svelte';
  import AboutSection from './about-section.svelte';
  import ServiceSection from './service-section.svelte';
  import BrandSection from './brand-section.svelte';
  import HeroSection from './hero-section.svelte';
  import NavbarSection from './navbar-section.svelte';
  import TestimonialsSection from './testimonials-section.svelte';
  import PricingSection from './pricing-section.svelte';
  import CtaSection from './cta-section.svelte';
  import ContactSection from './contact-section.svelte';
  import BlogSection from './blog-section.svelte';
  import FooterSection from './footer-section.svelte';

  // Child 의 변경사항이 Parent 로 전달되기 위해서는 Object 형태이어야 한다
  // - scrolledFromTop 처럼 state 변수를 단순 전달하면 안올라온다
  const navController = (() => {
    /** @type {boolean} */
    let isOpen = $state(false);
    return {
      toggle: () => {
        isOpen = !isOpen;
      },
      get open() {
        return isOpen;
      },
    };
  })();

  // Child 로의 변경사항은 실시간으로 전달된다
  /** @type {boolean} */
  let scrolledFromTop = $state(false);

  // window 스크롤 세로 위치
  /** @type {number} */
  let y = $state(0);

  $effect(() => {
    // 사용자 스크롤에 의해 scrollY 가 변경되어야 갱신된다
    scrolledFromTop = y >= 50 ? true : false;
  });

  onMount(() => {
    $inspect(data);

    //** DEBUG: 새로고침 이후 아래부분 작성 내용을 즉시 확인
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'instant',
    });
  });

  // Smooth scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /** @type { {
   *     data: import('./$types').PageData
   *   } } */
  let { data } = $props();
</script>

<!-- || 윈도우 이벤트 연결 -->
<svelte:window bind:scrollY={y} />

<NavbarSection {scrolledFromTop} {navController} />
<HeroSection />
<BrandSection />
<ServiceSection />
<AboutSection />
<TeamSection members={data.members ?? []} />
<TestimonialsSection />
<PricingSection />
<CtaSection />
<ContactSection />
<BlogSection />
<FooterSection />

<!-- || Back to top button -->
<button
  onclick={scrollToTop}
  type="button"
  class="{!scrolledFromTop &&
    'hidden'} !fixed bottom-6 end-6 z-30 rounded-full bg-red-600 p-3 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg"
  id="btn-back-to-top"
>
  <span class="[&>svg]:w-4">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="3"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
    </svg>
  </span>
</button>
```

> top 화면

![](/2024/03/10-tailgrid-template-agency.png){: width="560" .w-75}
_Agency - Tailwind CSS Agency Site Template_

> 전체 화면

![](/2024/03/10-tailgrid-templates-site1-whole.png){: width="200" .w-75}
_Agency - Tailwind CSS Agency Site Template 전체_

> Template Section and Pages:

- Home Page
- About Us
- Our Team
- Features
- Pricing
- Support
- Blog
- 404 Page


## 9. Review

- TailGrid 유료 템플릿들을 모두 Svelte 버전으로 바꿔가며 연습하려고 한다.
  - 이제 겨우 1개 했는데, 엄청 길어서 힘들었다.
- Svelte Action 을 이용해 splidejs 와 kakaomap 을 연결했다.
  - Agency 템플릿에 지도와 carousel 기능이 구현되어 있지 않아서 채워 넣었다.
- window 전역객체에 property 를 정의해서 빨간줄을 안보게 되니 속이 시원하다.
  - 인터페이스로 `Window` 선언 후 `window.kakao = window.kakao || {};` 초기화

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
