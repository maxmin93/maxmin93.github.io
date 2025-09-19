---
date: 2023-07-05 00:00:00 +0900
title: Frontend 공부하기 - 5일차 CSS Part4
description: 프론트엔드 개발을 배우기 위해 CSS 기초부터 다지려고 합니다. Dave Gray 유튜브 강좌이고, 실습 환경은 SvelteKit + PostCSS 을 사용합니다. (5일차)
categories: [Frontend, CSS]
tags: [svelte]
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1-kQQloEDQ90MNQJP2X5a2onDmlkfHRnV7MHlK2ocvv4zRrwtMOb8lMJhaCAUWlY-Xus&usqp=CAU"
---

> 목록
{: .prompt-tip }

- [Frontend 공부하기 - 1일차](/posts/frontend-tutorial-day1/) : Dave Gray &ndash; [HTML Full Course](https://www.youtube.com/watch?v=mJgBOIoGihA)
- [Frontend 공부하기 - 2일차](/posts/frontend-tutorial-day2/) : Dave Gray &ndash; [CSS Full Course](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit) Part&#9839;1
- [Frontend 공부하기 - 3일차](/posts/frontend-tutorial-day3/) : Dave Gray &ndash; [CSS Full Course](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit) Part&#9839;2
- [Frontend 공부하기 - 4일차](/posts/frontend-tutorial-day4/) : Dave Gray &ndash; [CSS Full Course](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit) Part&#9839;3
- [Frontend 공부하기 - 5일차](/posts/frontend-tutorial-day4/) : Dave Gray &ndash; [CSS Full Course](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit) Part&#9839;4 &nbsp; &#10004;

> 참고문서

[MDN - CSS 문서](https://developer.mozilla.org/ko/docs/Web/CSS)

## 1. [Chapter 24 : Complete Project](https://www.youtube.com/watch?v=cMN2Odm5ieA&list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit&index=25)

Dave Gray 의 CSS 강좌를 정리하는 마지막 실습 프로젝트이다.

- index.html : 타코 종류와 수량별 가격을 설명한 메뉴 페이지 
- hours.html : 영업시간 안내 페이지
- contact.html : 점포 위치와 연락처, 그리고 방명록 입력폼 페이지
- about.html : 점포에 대한 대략적인 설명 페이지

<video width="350" height="720" controls autoplay muted>
  <source src="/assets/img/2023/07/05-css-ch24-taco-shop-h264.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<p>&nbsp;</p>

> 비디오 캡쳐 품질에 대한 코멘트

- High quality, 10 fps 녹화시 892kb => 최적화 448kb
- Medium quality, 10 fps 녹화시 178kb => 최적화 91kb (채택!!)

Medium 화질이 많이 떨어지지만 용량을 보면 GIF 보다도 훨씬 절약된다.

### 1) svelte 페이지 구성

원래는 `routes` 밑에 구성해야 하지만, 다른 chapter 예제들도 있어서 `ch24` 디렉토리 밑으로 구성했다. 

```txt
- src/routes
  + ch24                 <= /ch24
    + about              <= /ch24/about
      - `+page.svelte`
    + contact            <= /ch24/contact
      - `+page.svelte`
    + hours              <= /ch24/hours
      - `+page.svelte`
    - `+layout.svelte`   <= 공통 화면 : 상단 header, 이미지, 하단 footer
    - `+page.svelte`     <= /ch24#menu
```

### 2) `app.postcss` 공통/최상단 style

여기서 정의된 스타일들은 하부 component 들까지 기본으로 적용된다.

- 기본으로 설정된 margin, padding, box-sizing 을 리셋한다
  + box-sizing 은 테두리를 기준으로 사이즈를 계산하도록 설정
- html 에서 부드러운 스크롤과 폰트 종류 및 크기를 설정
  + `clamp(1rem, 2.2vh, 1.5rem)` : 최소 1rem ~ 최대 1.5rem 내에서 조정됨
    * 작은 화면에서는 작은 폰트로, 큰 화면에서는 큰 폰트로 반응형 설정
- img 는 화면 크기를 벗어나지 않도록 설정
- input, button, textarea 의 스타일은 상속 적용되도록 설정
- 유틸리티 스타일 nowrap, underline, offscreen, center 정의

```css
/* begin Reset */
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
/* end Reset */

html {
  scroll-behavior: smooth; /* 부드러운 스크롤 */
  font-family: var(--theme-font-family-base);
  /* font-size: 1.5rem; */
  font-size: clamp(1rem, 2.2vh, 1.5rem);
}


body {
  min-height: 100vh;

  /* variables 가 정의되어 있지 않으면 적용되지 않는다 */
  background-color: var(--BGCOLOR);
  background-image: var(--BGIMAGE);
}

img {
  display: block;
  max-width: 100%;
  height: auto;
}

input,
button,
textarea {
  font: inherit;
}

.wrapper {
  /* outline 은 box 사이즈에 포함되지 않음 */
  outline: 2px solid purple;
  outline-offset: -2px;
}

/* || Utility classes */

.nowrap {
  white-space: nowrap;
}

.underline {
  text-decoration: underline;
}

.offscreen {
  position: absolute;
  left: -10000px;
}

.center {
  text-align: center;
}
```

### 3) `/ch24/+layout.svelte`

클래스 이름은 BEM 규칙을 따른다.

- wrapper 는 body 대용으로 넣은 element 이다. (학습용)
- header : 상단 고정 (sticky, top)
  + h1 : 제목
  + nav : 메뉴
    * rootPath 와 현재 경로를 비교하여 선택적으로 item 을 출력
    * ul : `flex` &amp; `row` 사용하여 가로방향 나열
- section : header 아래 위치
  + h2 : 애니메이션이 들어간 광고 문구 (메인 페이지에서만 출력)
    * 절대위치로 문구가 나타내는 애니메이션 효과 적용
  + figure : 상단을 차지하는 큰 이미지 
    * 현재 경로에 따라 다른 이미지와 다른 caption 을 출력
- main : section 아래 위치
  + slot : 하부 페이지를 수화(hydration) 시키는 위치 
- footer : 하단 고정 (sticky, bottom)
  + 저작권 문구를 출력
  + 연도는 time 태그를 사용하고, js 로 올해 연도를 계산하여 출력


```svelte
<div class="wrapper">
  <header class="header">
    <h1 class="header__h1">Little Taco Shop</h1>
    <nav class="header__nav">
      <ul class="header__ul">
        {#if $page.url.pathname !== rootPath}
          <li>
            <a href={rootPath}>Home</a>
          </li>
        {/if}
        <li>
          <a href="{rootPath}#menu">Menu</a>
        </li>
        {#if $page.url.pathname !== rootPath + '/hours'}
          <li>
            <a href="{rootPath}/hours">Hours</a>
          </li>
        {/if}
        {#if $page.url.pathname !== rootPath + '/contact'}
          <li>
            <a href="{rootPath}/contact">Contact</a>
          </li>
        {/if}
        {#if $page.url.pathname !== rootPath + '/about'}
          <li>
            <a href="{rootPath}/about">About</a>
          </li>
        {/if}
      </ul>
    </nav>
  </header>

  <section class="hero">
    {#if $page.url.pathname === rootPath}
      <h2 class="hero__h2">Bienvenidos!</h2>
    {/if}
    <figure>
      <img src="/images/{figData.imgFile}" alt="Tacos Delicioso" title="We love tacos!" width="1000" height="667" />
      <figcaption class="offscreen">{figData.caption}</figcaption>
    </figure>
  </section>

  <main class="main">
    <slot />
  </main>

  {#if $page.url.pathname !== rootPath}
    <p class="center">
      <a href={rootPath}>Back to Home</a>
    </p>
  {/if}

  <footer class="footer">
    <p>
      <span class="nowrap">Copyright &copy; <time datetime={thisYear} id="year">{thisYear}</time></span>
      <span class="nowrap">The Little Taco Shop</span>
    </p>
  </footer>
</div>
```

#### 반응형 설정

- 큰 화면에서는 제목에 타코 아이콘이 좌우로 나타나도록 설정

```scss
  @media screen and (min-width: 576px) {
    .header__h1 {
      &::before {
        content: '🌮 ';
      }

      &::after {
        content: ' 🌮';
      }
    }
  }
```

dark 모드를 위한 색상 변수를 정의

```css
  @media (prefers-color-scheme: dark) {
    :root {
      --BGCOLOR-FADE: gray;
      --BGCOLOR: #000;
      --BODY-BGCOLOR: #333;
      --BORDER-COLOR: whitesmoke;
      --BUTTON-COLOR: #000;
      --FONT-COLOR: whitesmoke;
      --HEADER-COLOR: whitesmoke;
      --HERO-COLOR: #333;
      --HIGHLIGHT-COLOR: whitesmoke;
      --LINK-ACTIVE: rgb(252, 200, 103);
      --LINK-COLOR: whitesmoke;
      --LINK-HOVER: orange;
      --NAV-BGCOLOR: rgb(20, 20, 20);
    }
  }
```

### 4) `/ch24/+page.svelte`

- article
  + h2 : 메뉴 제목
  + table : grid &amp; template-area 로 메뉴표 구획을 정의
    * 테이블 cell 의 내용은 gird &amp; center 로 가운데 위치하도록 설정

```scss
  .menu {
    &__container {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-areas:
        'hd1 hd2 hd3'
        'cr cr1 cr1p'
        'cr cr2 cr2p'
        'cr cr3 cr3p'
        'sf sf1 sf1p'
        'sf sf2 sf2p'
        'sf sf3 sf3p'
        'cs cs cs';
      gap: 0.1em;
      margin-bottom: 1em;
    }

    &__cr {
      grid-area: cr;
    }
    &__sf {
      grid-area: sf;
    }
    &__cs {
      grid-area: cs;
    }

    &__cr,
    &__sf,
    &__cs,
    &__header {
      color: var(--HIGHLIGHT-COLOR);
      font-weight: bold;
      height: 100%;
      display: grid;
      place-content: center;
    }
  }
```

#### 반응형 설정

테이블 header 성격의 텍스트는 큰 화면에서 조금 더 큰 글자로 표시되도록 설정

```scss
  @media screen and (min-width: 576px) {
    .menu__header,
    .menu__cr,
    .menu__sf,
    .menu__cs {
      font-size: 125%;
    }
  }
```

### 4) `/ch24/about/+page.svelte`

- `abbr` 약어 설명 &rArr; hover 할 때 title 내용이 팝업으로 표시됨
- `aside` 부연 설명을 위한 시멘틱 태그
  + `details` 로 가려 두었다가 펼쳐서 볼 수 있다.

```html
<article id="about" class="main__article about">
  <h2>About <abbr title="The Little Taco Shop">LTS</abbr></h2>
  <p> ... </p>
  <aside class="about__trivia">
    <h3>Taco Trivia</h3>
    <details>
      <summary>When did tacos first appear in the United Stated?</summary>
      <p class="about__trivia-answer"> ... </p>
    </details>
  </aside>
</article>
```

### 5) `/ch24/contact/+page.svelte`

- 주소는 `address` 태그로, 전화번호는 `a` 태그의 `tel` 스키마 사용
- 입력 양식에 `form`, `fieldset`, `legend` 태그를 사용

```html
<article class="main__article">
  <h2>Our Location</h2>
  <address>
    555 Taco Temptation Lane, Suite T<br />
    Kansas City, MO 55555-5555
    <br /><br />
    Phone: <a href="tel:+5555555555">555-555-5555</a>
  </address>
</article>
```

### 6) `/ch24/hours/+page.svelte`

- dl(definition list) : 용어를 설명하는 목록
  + dt : 용어의 제목
  + dd : 용어의 설명 (들여쓰기가 기본)

```html
  <dl>
    <dt>Sunday-Thursday</dt>
    <dd>11am-9pm</dd>
    <dt>Friday-Saturday</dt>
    <dd>11am-11pm</dd>
  </dl>

  <style type="text/css">
    dl {
      margin-top: 1em;
      dd {
        text-indent: 20px;
      }
    }
  </style>
```

### 7) sveltekit 스타일 작성시 주의사항

#### 전역 적용시 `:global` 키워드

참고: [SvelteKit CSS 예제 - Scoped component styling](https://svelte.dev/repl/bb7a7e7a71b440039016e65de00a8a98?version=3.22.2)

- 기본적으로 style 은 해당 component 에만 적용된다. (고유 class 태그가 붙여짐)
- 하위 컴포넌트에도 적용되도록 하고 싶으면 `:global` 키워드 사용

> `:global` 함수는 selector 의 시작 또는 끝에 위치해야 한다 (중간은 안됨!)

![svelte-scoped-styling](/2023/07/05-svelte-scoped-styling.png){: width="420" .w-75}
_global 키워드 사용 예_

```html
<script>
  import Link from './Link.svelte'
</script>

<div>
  <Link href="/test">
    <h1>
      Another link
    </h1>
  </Link>
  <Link href="/blah">some other unaffected link</Link>
</div>

<Link href="/blah">some other unaffected link</Link>

<style>
  div :global(a) {
    color: red;
  }
</style>
```
{: file="App.svelte"}

```svelte
<a href={href} on:click={onClick} {...$$restProps}>
  <slot/>
</a>

<style>
  a {
    color: green;
  }
</style>

<script>
import { getContext } from 'svelte/internal'

export let href

let router = getContext('router')

async function onClick (event) {
    event.preventDefault()
    router.push(href)
}
</script>
```
{: file="Link.svelte"}


참고: [Joy Of Code - How To Use Global Styles In SvelteKit](https://joyofcode.xyz/global-styles-in-sveltekit#global)

> svelte-preprocess 에서 `style global` 옵션을 지원한다

```svelte
<script>
  export let data
</script>

<div class="prose">
  {@html data.content}
</div>

<style>
  :global(.prose h1) {
    color: aqua;
  }
</style>

<!-- 또는 스타일 모듈 자체를 global 적용이 되도록 선언 -->

<style global>
  .prose h1 {
    color: aqua;
  }
</style>
```

## 2. 그 외 추가 내용

### [Ch27. CSS `:has` selector is Amazing](https://www.youtube.com/watch?v=XdtZWVK3y_Q&list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit&index=28)

`:has()` 는 js 의 if 와 유사한 역활을 한다.

- `+` 는 선행자에 대한 선택을 할 수 없는데, `:has()` 는 가능
  + 마찬가지로 부모에 대한 조건을 설정할 수도 있다.
- not 과 결합하거나, OR / AND 형태로 사용할 수 있다.
  + 다른 요소들과 결합하여 복잡하게 사용하기도 함 

```css
  /* Example 1 */
  /* Previously we could only select forwards... */

  /* 첫번째 article은 선택되지 않음 */
  /* article + article {
    background-color: aliceblue;
  } */

  /* 첫번째 article도 선택됨. 단, 마지막 article 은 선택되지 않음 */
  /* article:has(+ article) {
    background-color: coral;
  } */

  /* Example 2 */
  /* We can do more than just select the parent */

  /* 부모 선택자의 조건을 정의 - span 이 있는 article */
  article:has(span) .bold {
    background-color: rgba(255, 255, 0, 0.61);
  }

  article:has(span) .italic {
    text-decoration: underline;
  }

  /* Example 3 */
  /* not has (aka "does not have") */

  article:not(:has(span)) {
    background-color: lightgray;
  }

  /* Example 4 */
  /* OR example */

  article:has(input, .button) {
    background-color: rebeccapurple;
  }

  /* Example 5 */
  /* AND example
    - :has(.button) 이 :has(button) 보다 우선순위가 높음
      => :has(button) 으로 하면 적용이 안됨 (덧씌워져 효과 없음)
  */

  article:has(p):has(.button) {
    background-color: lightsalmon;
  }

  /* Example 6 */
  /* more complex example - specific and looks back
  */

  article:has(p):has(.button) p:has(+ .button) {
    margin-bottom: 2rem;
  }
```

js 의 역활을 대신해서 사용할 수도 있다.

- 특정 요소가 있는 상태를 전제로 style 을 정의하거나
- check 박스가 checked 상태인지에 따라 정의하거나
  + 모달 다이얼로그 박스 숨기기
  + 다크모드 변경
  + 배경 이미지 변경
- 입력값이 valid 이면 적합하다는 심볼을 출력하거나

```css
  /* Practical Example */
  /* Create fewer modifier classes */

  /* submenu 있는 item 만 아이콘 추가 */
  .nav__item:has(.nav__submenu)::after {
    font-family: 'Font Awesome 5 Free';
    font-weight: 400;
    content: '\f150';
    margin-left: 1rem;
  }

  /* Modal & agree to terms */

  /* 모달 다이얼로그 박스 지우기 */
  .awesome:has(.awesome__terms:checked) {
    display: none;
  }

  /* 다크 모드로 변경 */
  .three:has(.lightswitch:checked) {
    background-color: var(--COLOR);
    color: var(--BGCOLOR);
  }

  /* 그라디언트 및 버블 이미지 배경 적용 */
  .three:has(.bubbleswitch:checked) {
    background: repeat-y right center url('/images/bubbles.png'), no-repeat linear-gradient(to left, steelblue, #fff);
    background-size: 20%, auto;
  }

  /* label:has(+ .name) : label 뒤에 br 이 있어 선택 안된다 */
  /* label:has(~ .name) : 같은 부모 아래 후행하기만 하면 선택된다 */

  /* 요구되는 패턴에 적합하면 체크 기호 출력, ex) 'Abc' */
  label:has(~ .name:valid)::after {
    content: '✔';
    color: limegreen;
    margin-left: 1rem;
    font-size: 3rem;
  }
```

### 선택자 `+` (인접) 와 `~` (후행)

- `label:has(+ .name)` : label 뒤에 br 이 있어 선택 안된다
- `label:has(~ .name)` : 같은 부모 아래 후행하기만 하면 선택된다

```html
<style> 
p ~ ul {
  background: green;  /* p 이후 모든 ul 의 배경색을 초록색으로 적용 */
}

p + ul {
  background: red;  /* p 이후 인접 ul 만 배경색을 빨간색으로 적용 */
}
</style>

<p>The first paragraph.</p>
<ul>                      <!-- 빨간색 -->
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ul>

<h2>Another list</h2>
<ul>                      <!-- 초록색 -->
  <li>Coffee</li>
  <li>Tea</li>
  <li>Milk</li>
</ul>
```

## 9. Review

- 강사가 하는 것을 보면, 쉬워 보이는데 직접 하려면 캄캄하다.
- 프론트엔드 개발은 절반이 css 인듯 (옛날에 얕잡아 봤던 것은 무지 때문)
- css 로 js 를 대체하는 기술이 늘어나고 있다. css 전용 언어가 생길지도.
  + ex) if 를 뜻하는 `:has` 라던지, isEmpty 를 뜻하는 `:blank` 라던지

#### `:blank` 지원여부 체크

[selector :blank](https://caniuse.com/mdn-css_selectors_blank) - 아직 지원하는 브라우져가 없다 (experimental)

#### svelte 에서 중괄호(&lbrace;, &rbrace;)를 html에 사용하려면 code 로 대체할 것

- ex) `<input required pattern="^[A-Z][a-z]&lbrace;2,&rbrace;" />`
  + &rArr; `<input required pattern="^[A-Z][a-z]{2,}" />`

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
