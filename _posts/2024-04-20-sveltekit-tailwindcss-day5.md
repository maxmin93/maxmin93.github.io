---
date: 2024-04-20 00:00:00 +0900
title: SvelteKit Tailwind 튜토리얼 - 5일차
description: TailGrids 의 샘플 Templates 들을 Svelte5 로 변환하며 runes 와 Tailwind CSS 사용법을 공부합니다. 외워질 때까지 여러번 반복하여 숙달합니다.
categories: [Frontend, CSS]
tags: [tailwind, svelte]
image: "https://cdn.icon-icons.com/icons2/2699/PNG/512/tailwindcss_logo_icon_170649.png"
---

> 목록
{: .prompt-tip }

- [SvelteKit Tailwind 튜토리얼 - 1일차](/posts/sveltekit-tailwindcss-day1/) : Tailwind Labs
- [SvelteKit Tailwind 튜토리얼 - 2일차](/posts/sveltekit-tailwindcss-day2/) : Plugins &amp; Tools
- [SvelteKit Tailwind 튜토리얼 - 3일차](/posts/sveltekit-tailwindcss-day3/) : Tutorial &#35;1
- [SvelteKit Tailwind 튜토리얼 - 4일차](/posts/sveltekit-tailwindcss-day4/) : Tutorial &#35;2
- [SvelteKit Tailwind 튜토리얼 - 5일차](/posts/sveltekit-tailwindcss-day5/) : Tutorial &#35;3 &nbsp; &#10004;

## 0. 개요

- [x] Bun 1.1.3 + Svelte 5 preview
  - prettier
  - [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte)
- [x] TailwindCSS 3.4.1 + typography
  - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss)
  - [vite-plugin-tailwind-purgecss](https://www.npmjs.com/package/vite-plugin-tailwind-purgecss) 0.1.3
- [x] Etc
  - fonts : 한글 Noto Sans KR, D2Coding

## 1. 프로젝트 생성

> 참고

- [2024-02-26-svelte5-runes-example1 - 1. 프로젝트 생성](/posts/svelte5-runes-example1/)
- [SvelteKit Tailwind 튜토리얼 - 4일차](/posts/sveltekit-tailwindcss-day4/)
  - 이전에 만들어 본 TailGrids Agency Site 와 많은 부분이 흡사하다.

### TailGrids - Startup Site Template

> top 화면

![](/2024/04/20-tailgrid-templates2-top.png){: width="560" .w-75}
_TailGrids - Startup Site Template_

> 전체 화면

![](/2024/04/20-tailgrid-templates-site2-whole.png){: width="200" .w-75}
_TailGrids - Startup Site Template_

> Template Section and Pages:

- Home
- Pricing
- Features
- Team Section
- FAQ
- Call to Action
- Testimonials
- Contacts Us
- Newsletter
- Log In & Sign Up
- Privacy Policy Page
- Legal Notice Page
- Terms of Service Page
- 404 Page


## 2. `+page.svelte`

### 작업 절차

1. 전체 페이지를 하위 section 들로 구분하여 분리하다.
2. 페이지 전체에서 사용할 상태를 `$state` 객체로 선언하다.
3. section 컴포넌트 에 `$state` 객체를 전달하여 공유한다.
4. `svelte:window` 로 window 이벤트를 bind 하여 사용한다.
5. 외부 데이터는 PageData 로 데이터를 받아 제어하고 전달한다.
6. 아이콘 및 이미지 등의 리소스는 `$lib/assets` 으로 분리한다.
7. 반복되어 자주 사용되는 html 템플릿도 svelte 컴포넌트로 분리한다.
8. mobile 을 기준으로 tailwindcss 를 작성한다.
9. window 속성 추가시 `app.d.ts` 에 정의합니다.

### 전체 코드

```svelte
<script>
  import NavbarSection from './navbar-section.svelte';
  import HeroSection from './hero-section.svelte';
  import ServicesSection from './services-section.svelte';
  import VideoSection from './video-section.svelte';
  import PricingSection from './pricing-section.svelte';
  import TeamSection from './team-section.svelte';
  import FaqSection from './faq-section.svelte';
  import CtaSection from './cta-section.svelte';
  import TestimonialsSection from './testimonials-section.svelte';
  import ContactSection from './contact-section.svelte';
  import FooterSection from './footer-section.svelte';

  import { onMount } from 'svelte';

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
    // $inspect('navController =', navController.open);
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

<svelte:window bind:scrollY={y} />

<!-- 상단 메뉴 -->
<NavbarSection {scrolledFromTop} {navController} />

<HeroSection />
<ServicesSection />
<VideoSection />
<PricingSection />
<TeamSection />
<FaqSection />
<CtaSection />
<TestimonialsSection />
<ContactSection />
<FooterSection />

<!-- Back to top button -->
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


## 3. Section 컴포넌트

### `navbar-section.svelte`

- header 태그 사용
- scrolledFromTop : 페이지의 최상단에서 벗어난 경우
  - fixed 로 상단 고정 후, opacity-80 만큼 살짝 투명하게 처리
- navController.open : 메뉴 버튼이 open 된 경우
  - 메뉴 버튼에 클래스 navbarTogglerActive 적용  
  - close 상태이면 풀다운 메뉴를 hidden 처리
- menuItems 로 풀다운 메뉴의 항목을 반복 처리

```svelte
<script>
  import { clickOutside } from '$lib/utils/click-outside';
  import LogoSvg from '$lib/assets/template2/images/logo/logo.svg';
  import LogoWhiteSvg from '$lib/assets/template2/images/logo/logo-white.svg';

  /** @type { {
   *    scrolledFromTop: boolean,
   *    navController: {
   *      toggle: () => void,
   *      open: boolean
   *    }
   *  } } */
  let { scrolledFromTop, navController } = $props();

  $effect(() => {
    $inspect('scrolledFromTop =', scrolledFromTop);
  });

  /** @param {Event} event */
  function closeNav(event) {
    if (navController.open) {
      navController.toggle();
    }
  }

  const menuItems = [
    { title: 'Home', anchor: '' },
    { title: 'Payment', anchor: 'payment' },
    { title: 'Biz Video', anchor: 'bizvideo' },
    { title: 'Features', anchor: 'features' },
  ];
</script>

<header
  class="left-0 top-0 z-50 w-full {scrolledFromTop
    ? 'fixed z-50 bg-white bg-opacity-80 shadow-sm backdrop-blur-sm dark:bg-dark'
    : 'absolute'}"
>
  <div class="container mx-auto">
    <div class="relative -mx-4 flex items-center justify-between">
      <!-- logo icon -->
      <div class="w-60 max-w-full px-4">
        <a href={undefined} class="block w-full py-5">
          <img src={LogoSvg} alt="logo" class="w-full dark:hidden" />
          <img src={LogoWhiteSvg} alt="logo" class="hidden w-full dark:block" />
        </a>
      </div>

      <div class="flex w-full items-center justify-between px-4">
        <!-- Hamburger Menu -->
        <div>
          <button
            use:clickOutside
            on:click_outside={closeNav}
            onclick={navController.toggle}
            class="absolute right-4 top-1/2 block -translate-y-1/2 rounded-lg px-3 py-[6px] ring-primary focus:ring-2 lg:hidden {navController.open &&
              'navbarTogglerActive'}"
          >
            <!-- Hamburger Icon -->
          </button>
          <!-- Pulldown menu -->
          <nav
            id="navbarCollapse"
            class="absolute right-4 top-full z-40 w-full max-w-[250px] rounded-lg bg-white px-6 py-5 shadow transition-all lg:static lg:block lg:w-full lg:max-w-full lg:bg-transparent lg:shadow-none dark:bg-dark lg:dark:bg-transparent {!navController.open &&
              'hidden'}"
          >
            <ul class="block lg:flex">
              {#each menuItems as item}
                <li>
                  <a
                    href="#{item.anchor}"
                    class="flex py-2 text-base font-medium text-dark hover:text-primary lg:ml-12 lg:inline-flex dark:text-white"
                  >
                    {item.title}
                  </a>
                </li>
              {/each}
            </ul>
          </nav>
        </div>

        <!-- Auth Menu -->
        <div class="hidden justify-end pr-16 text-base font-medium sm:flex lg:pr-0">
          <a href={undefined} class="px-7 py-3 text-dark hover:text-primary dark:text-white">
            Login
          </a>
          <a
            href={undefined}
            class="rounded-lg bg-primary px-7 py-3 text-white hover:bg-opacity-90 dark:text-white"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  </div>
</header>
```

### `video-section.svelte`

- videoOpen 상태 변수 선언
  - play 버튼 클릭시 true 상태로 변경
  - 오른쪽 상단 X 버튼 클릭시, 또는 outside 클릭시 false 상태로 변경
- videoOpen 이 true 이면 youtube 를 autoplay 시킴
  - `div > iframe` 으로 youtube 플레이 크기를 지정
  - youtube 링크 파라미터로 autoplay 와 mute 설정

```svelte
<script>
  import { clickOutside } from '$lib/utils/click-outside';
  import VideoImg01 from '$lib/assets/template2/images/videos/image-01.jpg';

  let videoOpen = $state(false);
</script>

<section id="bizvideo" class="relative z-10 overflow-hidden bg-primary">
  <div class="container mx-auto">
    <!-- content : Right side (sm 에서는 세로 정렬) -->
    <div class="right-0 top-0 z-10 h-full w-full lg:absolute lg:w-1/2">
      <div class="flex h-full w-full items-center justify-center">
        <img
          src={VideoImg01}
          alt="video image"
          class="left-0 top-0 z-[-1] h-full w-full object-cover object-center lg:absolute"
        />
        <a
          href={undefined}
          onclick={() => {
            videoOpen = true;
          }}
          class="absolute z-40 flex h-20 w-20 items-center justify-center rounded-full bg-primary md:h-[100px] md:w-[100px]"
        >
        <!-- ... -->
        </a>
      </div>
    </div>        
  </div>        

  <!-- Video -->
  {#if videoOpen}
    <div
      class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-black bg-opacity-70"
    >
      <div
        use:clickOutside
        on:click_outside={() => {
          videoOpen = false;
        }}
        class="mx-auto w-full max-w-[550px] bg-white"
      >
        <iframe
          class="h-[320px] w-full"
          src="https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1"
        >
        </iframe>
      </div>

      <!-- video stop button : 오른쪽 상단 X 표시 -->
      <button
        onclick={() => {
          videoOpen = false;
        }}
        class="absolute right-0 top-0 flex h-20 w-20 cursor-pointer items-center justify-center text-body-color hover:bg-black"
      >
        <svg viewBox="0 0 16 15" class="h-8 w-8 fill-current">
          <!-- ... -->
        </svg>
      </button>
    </div>
  {/if}
</section>
```  

![](/2024/04/20-tailgrid-templates2-video.png){: width="320" .w-75}
_Startup Site Template - Video Section_

### `testimonials-section.svelte`

- snippet 으로 반복 템플릿 정의
  - `each .. as` 반복 구문과 함께 활용
- snippet 을 뒷부분에 정의하고 싶으면 script 블록이 존재해야 한다.
  - 안그러면 선언 전에 객체를 사용했다고 오류 메시지가 나온다. (작동은 됨)

```svelte
<script>
  import Testimonial5Img1 from '$lib/assets/template2/images/testimonials/testimonial-05/image-01.jpg';
  import Testimonial5Img2 from '$lib/assets/template2/images/testimonials/testimonial-05/image-02.jpg';
  import Testimonial5Img3 from '$lib/assets/template2/images/testimonials/testimonial-05/image-03.jpg';
  import Testimonial5Img4 from '$lib/assets/template2/images/testimonials/testimonial-05/image-04.jpg';

  const cardItems = [
    { imgSrc: Testimonial5Img1, name: '..', email: '..', comment: '..' },
    { imgSrc: Testimonial5Img2, name: '..', email: '..', comment: '..' },
    { imgSrc: Testimonial5Img3, name: '..', email: '..', comment: '..' },
    { imgSrc: Testimonial5Img4, name: '..', email: '..', comment: '..' },
  ];
</script>

<section class="pb-7 pt-20 lg:pb-14 lg:pt-[120px]">
  <div class="container mx-auto">
    <!-- container wrapper -->
    <div class="-mx-4 flex flex-wrap justify-center">

      {#each cardItems as item }
        <!-- content wrapper -->      
        <div class="w-full px-4 md:w-1/2">
          <!-- card -->
          <div
            class="relative mb-10 overflow-hidden rounded-lg bg-white p-8 shadow-testimonial-5 sm:p-10 md:px-6 md:py-10 lg:p-10"
          >
            <!-- content of card -->
            {@render cardContent(item)}
            <!-- deco of card -->
            {@render cardDeco()}
          </div>
        </div>
      {/each}

  </div>
</section>  

{#snippet cardContent({ imgSrc, name, email, comment })}
  <!-- avatar & title -->
  <div class="mb-8 flex items-center">
    <div
      class="mr-5 h-20 w-full max-w-[80px] overflow-hidden rounded md:h-[60px] md:max-w-[60px] lg:h-20 lg:max-w-[80px]"
    >
      <img src={imgSrc} alt="image" class="w-full" />
    </div>
    <div class="w-full">
      <h5 class="mb-1 text-lg font-semibold text-dark">{name}</h5>
      <p class="text-xs text-body-color">{email}</p>
    </div>
  </div>
  <!-- comment -->
  <p class="text-base leading-relaxed text-body-color">
    “{comment}”
  </p>
{/snippet}

{#snippet cardDeco()}
  <!-- ... -->
{/snippet}
```

![](/2024/04/20-tailgrid-templates2-mobile.png){: width="320" .w-75}
_Startup Site Template - Testimonials Section_


### `faq-section.svelte`

- faq 항목 6개에 대해서 각각 open/close 처리
  - collaps 상태 객체에서 모든 항목의 상태를 관리
- faq 항목 클릭시 상태를 toggle 시키고, `if` 블럭으로 출력 제어
- snippet 에 onclick 함수까지 전달할 수 있다

```svelte
<script>
  import ArrowDownIcon from '$lib/assets/template2/icons/arrow-down-icon.svelte';

  let collaps = $state({
    openFaq1: false,
    openFaq2: false,
    openFaq3: false,
    openFaq4: false,
    openFaq5: false,
    openFaq6: false,
  });
</script>

<section
  id="features"
  class="relative z-20 overflow-hidden bg-white pb-12 pt-20 lg:pb-[90px] lg:pt-[120px]"
>
  <div class="container mx-auto">

    <!-- wrapper -->
    <div class="-mx-4 flex flex-wrap">
      <!-- lg: Left side -->
      <div class="w-full px-4 lg:w-1/2">
        <!-- FAQ #1 -->
        {@render faqCard({
          title: 'FAQ1: How long?',
          content: '...',
          onclick: () => {
            collaps.openFaq1 = !collaps.openFaq1;
          },
          isOpen: collaps.openFaq1,
        })}
        <!-- FAQ #2 -->
        {@render faqCard({
          title: 'FAQ2: How much?',
          content: '...',
          onclick: () => {
            collaps.openFaq2 = !collaps.openFaq2;
          },
          isOpen: collaps.openFaq2,
        })}
        <!-- FAQ #3 -->
        {@render faqCard({
          title: 'FAQ3: How do you ship?',
          content: '...',
          onclick: () => {
            collaps.openFaq3 = !collaps.openFaq3;
          },
          isOpen: collaps.openFaq3,
        })}
        <!-- ... -->
      </div>

  </div>
</section>  
```


## 9. Review

- 개인적인 사정도 있었지만, 게으름병이 도져서 오랜만에 글을 올린다.
  - 스스로에게 부끄럼지 않도록 잘하자!!
- 좀더 반복하자. 지겹도록 반복하자.
  - 나이를 먹은 탓인가? 기억력이 좋지 않다. 아니면 원래 안좋았던가?
- Svelte Snippet 의 유용성은 써볼수록 신통하다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
