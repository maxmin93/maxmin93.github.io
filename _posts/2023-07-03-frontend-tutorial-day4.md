---
date: 2023-07-03 00:00:00 +0900
title: Frontend 공부하기 - 4일차 CSS Part3
categories: ["frontend","css"]
tags: ["svelte", "css","tutorial","4th-day"]
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1-kQQloEDQ90MNQJP2X5a2onDmlkfHRnV7MHlK2ocvv4zRrwtMOb8lMJhaCAUWlY-Xus&usqp=CAU"
---

> 프론트엔드 개발을 배우기 위해 CSS 기초부터 다지려고 합니다. Dave Gray 유튜브 강좌이고, 실습 환경은 SvelteKit + PostCSS 을 사용합니다. (4일차)
{: .prompt-tip }

- [Frontend 공부하기 - 1일차](/posts/2023-02-24-frontend-tutorial-day1/) : Dave Gray &ndash; [HTML Full Course](https://www.youtube.com/watch?v=mJgBOIoGihA) 
- [Frontend 공부하기 - 2일차](/posts/2023-06-29-frontend-tutorial-day2/) : Dave Gray &ndash; [CSS Full Course](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit) Part&#9839;1
- [Frontend 공부하기 - 3일차](/posts/2023-06-30-frontend-tutorial-day3/) : Dave Gray &ndash; [CSS Full Course](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit) Part&#9839;2
- [Frontend 공부하기 - 4일차](/posts/2023-07-03-frontend-tutorial-day4/) : Dave Gray &ndash; [CSS Full Course](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit) Part&#9839;3 &nbsp; &#10004;

> 참고문서

[MDN - CSS 문서](https://developer.mozilla.org/ko/docs/Web/CSS)

## Part &#9839;3 Chapter 19 ~ 23

### Ch19. CSS Pseudo-Classes vs Pseudo-Elements

#### Pseudo-Classes

- 상태를 가리키는 선택자, ex) `:hover`, `:active` 등..

#### `:is` (특이성 10) 와 `:where` (특이성 0)

- 둘다 `,` 로 연결된 선택자를 묶는 같은 역활을 하고 있지만
- is 의 특이성 점수는 높고, where 는 특이성 점수를 제거하여 우선순위가 낮아진다는 차이점이 있습니다.

#### 의사 선택자들

- not(), nth-child() 등 ...
- `:before` 왼쪽 `:after` 오른쪽 
- odd 홀수번째, even 짝수번

```css
.card figcaption::after {
  content: '✨';
  display: block;
}

.card figcaption::first-letter {
  font-size: 3rem;
}
```

### Ch20. CSS Custom Variables &amp; Dark Mode

`--`로 시작하며, 보통 `:root` 에 global 속성값으로 작성

- `:global` 이란 의사코드는 MDN 에 없음 
  + [CSS Modules](https://github.com/css-modules/css-modules) 에서 사용한 의사코드라는데, 지금은 안쓰이는듯
  + `:global(:root)` 라는 것도 없는 셈인데, 오류는 나지 않음

```css
  /* || VARIABLES */
  :root {
    --ch20-bgcolor: #475569;
    --ch20-header-color: #1e293b;
  }

  div {
    background-color: var(--ch20-bgcolor);
    background-image: radial-gradient(whitesmoke, var(--ch20-bgcolor));
  }

  header,
  footer {
    background-color: var(--ch20-header-color);
  }  
```

#### Svelte 에서 [CSS Variable 예제](https://svelte.dev/repl/57f03a5268884c8080b286c95e9a7c52?version=3.38.2)

```vue
<script>
  let red = 0;
  let green = 0;
  let blue = 0;

  let rootElement;

  $: rootElement && rootElement.style.setProperty('--container-background', `rgb(${red}, ${green}, ${blue})`);
</script>

<div class="container" bind:this={rootElement}>
</div>

<style>
  :root {
    --container-background: inherit;
  }

  .container {
    background-color: var(--container-background);
  }
</style>  
```

#### Chrome 에서 `prefer-color-scheme` 설정하는 법

개발자 도구 &gt; Elements &gt; Styles (하단) &gt; filter 옆의 페인트 아이콘

![setup prefer-color-scheme](https://i.stack.imgur.com/b3yDU.png){: width="400"}
_setup prefer-color-scheme_

#### Classes 이름 명명법에서 `--` (더블 하이픈) 의미는 무엇인지?

참고 : [CSS - BEM 구문](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/)

- 블록, 요소, 수정자를 의미하는 `BEM` 은 Yandex 직원이 고안한 명명
- 대규모 프로젝트에서 협업을 위해 사용 (공식적인 방법론은 아님)

```css
.site-search {} /* Block */
.site-search__field {} /* 구성되는 Element */
.site-search--full {} /* Block 의 Modifier, 상태, 또다른 버전 등 */
```

> 사용 예제

```html
<!-- full, field 등의 클래스 이름의 개별적인 의미를 알기 어렵다 -->
<form class="site-search full">
    <input type="text" class="field">
    <input type="Submit" value ="Search" class="button">
</form>

<!-- BEM 명명법 사용한 경우 -->
<form class="site-search  site-search--full">
    <input type="text" class="site-search__field">
    <input type="Submit" value ="Search" class="site-search__button">
</form>
```

#### `on:click` 추가한 svelte 버전

`a11y` 때문에 div 에 `on:click` 추가시 `on:keyup` 등도 필요하다

- 참고: [How To Fix click-events-have-key-events?](https://excellentwebcheck.com/blogs/how-to-fix-jsx-a11y-click-events-have-key-events)
  + 번거로운 작업을 피하려면 div 대신에 button 요소를 사용하면 됨
- squareClick 으로 active 상태를 제어한다
  + true 이면 `square--highlight` 클래스가 활성화됨

```vue
<script lang="ts">
  const squaresCount = 12;
  const squares = Array<boolean>(squaresCount).fill(false);

  function squareClick(index: number) {
    squares[index] = !squares[index];  // 토글
    console.log(index, squares[index]);
  }
</script>

<main>
  <!-- each 블럭의 고유 id(key) 는 괄호를 이용하여 지정한다 -->
  {#each squares as active, i (i)}
    <div tabindex={i} role="button" class="square"
      on:click={() => {
        squareClick(i);
      }}
      on:keyup={() => {
        squareClick(i);
      }}
      class:square--highlight={active}
    >
      {#if i == 0}
        <p>Hey</p>
      {:else}
        💻
      {/if}
    </div>
  {/each}
</main>

<style>
  /* || FEATURES */
  .square--highlight {
    --SQUARE-BGCOLOR: cornflowerblue;
  }
</style>  
```

![css_20_variables-svelte](/2023/07/03-css_20_variables-svelte-w640.png){: width="600"}

### Ch21. CSS Functions

#### clamp 함수 : 최소값과 최대값 사이의 값을 선택

- 사용법: clamp(최소값, 비율값, 최대값)
  + 최소값과 최대값 사이에서 자동으로 비율값이 계산됨
  + font-size 에서는 백분율을 사용하지 않는다 &rarr; (vh 권장)

```css
  :root {
    --FS: clamp(1.75rem, 3vh, 2.25rem);  /* 1.75rem ~ 2.25rem 사이에서 */
    --FS-SM: clamp(1.25rem, 2vh, 1.5rem);  /* 1.25rem ~ 1.5rem 사이에서 */
  }

  .element {
    width: clamp(200px, 50%, 1000px);  /* 400 이상 2000 이하에서 작동 */
  }
```

#### data-tooltip

data-tooltip 의 문자열이 (클릭시) 툴팁으로 표시된다.

```html
<span class="tooltip" data-tooltip="This is Latin">Lorem</span>

<style>
  .tooltip {
    border-bottom: 1px dashed orange;
    position: relative;

    &:hover::before {
      content: attr(data-tooltip);
      position: absolute;
      top: -20px;
      white-space: nowrap;
      background-color: var(--DARK-COLOR);
      padding: var(--PADDING);
      border-radius: 15px;
    }
  }
</style>style>  
```

#### 그외 함수들

- `min(2vw, 20px)` 최소값, `max(150px, 20vw)` 최대값
- `calc(70% - 5px)` 계산식
- `brightness(150%)` 밝기, `hue-rotate(180deg)` hue 변경
- `repeat(4, minmax(100px, 300px))` : 반복

### Ch22. CSS Animated Responsive NavBar

<video width="600" controls>
  <source src="/assets/img/2023/07/03-css-ch22-animations.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

> `video` 태그로 mp4 파일을 직접 플레이 할 수 있다. (HTML)


#### box 굴리기

3번째 박스에 대해 animation 이 2회 반복된다.

```css
  .animate {
    /* animation-name: slide;
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
    animation-delay: 0.1s;
    animation-iteration-count: 2;
    animation-direction: alternate;
    animation-fill-mode: forwards; */
    animation: 3s ease-in-out 0.9s 2 alternate forwards slide;
  }

  @keyframes slide {
    0%   { transform: translateX(0); }
    33%  { transform: translateX(300px) rotate(180deg); }
    66%  { transform: translateX(-300px) rotate(-180deg); }
    100% { transform: translateX(0); background-color: rebeccapurple; }
  }
```

#### pull-down 메뉴의 햄버거 아이콘

Header 에 hover 시, 메뉴 icon 이 회전하여 'X' 표시가 된다.

- '&ndash;' 형태의 div 를 before 과 after 로 위아래로 쌓아 햄버거 아이콘 생성
- 회전 `rotate(180deg)`
- 햄버거 쌓기를 위한 위치 이동 `translate(-20px, +12px)`

```css
  header {
    background-color: var(--HEADER-BGCOLOR);
    color: var(--HEADER-COLOR);
    position: sticky; /* 시작 위치에 고정 */

    :is(&:hover, &:focus-within) {
      .menu-icon {
        background-color: transparent;
        transform: rotate(180deg);

        &::before {
          transform: translateX(-20px) rotate(45deg);
        }
        &::after {
          transform: translateX(-20px) rotate(-45deg);
        }
      }

      nav {
        display: block; /* visibility: visible; */
      }
    }
  }

  .menu-icon,
  .menu-icon::before,
  .menu-icon::after {
    background-color: var(--HEADER-COLOR);
    width: 40px;
    height: 5px;
    border-radius: 5px;
    position: absolute;
    transition: all 0.2s ease-in-out;
  }

  .menu-icon::before,
  .menu-icon::after {
    content: '';
  }

  .menu-icon::before {
    transform: translate(-20px, -12px);
  }
  .menu-icon::after {
    transform: translate(-20px, +12px);
  }    
```

#### pull-down 메뉴의 바운스 효과

- hover 시에만 nav 가 `display: block` 되며 나타난다
- Y축 방향으로 스케일을 0 에서 1.2배 살짝 늘렸다가 원래 길이로 복원시킨다
  + 애니메이션 `showMenu` 을 0.5초 동안 실행

```css
  nav {
    background-color: var(--HEADER-BGCOLOR);
    display: none; /* visibility: hidden; */
    transform-origin: top center;
    animation: showMenu 0.5s ease-in-out forwards;

    /* pull-down 메뉴 고정하기: position, top, left */
    position: relative; /* 상대좌표 기준 */

    a {
      display: block;

      &:hover,
      &:focus {
        transform: scale(1.2);
        transition: all 0.3s;
      }
    }
  }

  @keyframes showMenu {
    0%   { transform: scaleY(0); }
    80%  { transform: scaleY(1.2); }
    100% { transform: scaleY(1); }
  }  
```

#### [메뉴 숨기기 애니메이션](https://www.youtube.com/watch?v=VzkWH7mJpe8&list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit&index=26) (추가)

'X' 로 변한 햄버거 메뉴를 다시 눌렀을 때, 풀다운 메뉴가 접혀지도록 한다

```html
  <header>
    <section class="header-title-line">
      <h1>Acme Co.</h1>
      <button class="menu-button" title="Open Nav Menu">
        <div class="menu-icon" />
      </button>
    </section>

    <!-- 닫기 버튼 추가 (절대위치로 햄버거 메뉴를 덮도록 설정) -->
    <button class="closeMenuBtn" title="Close Nav Menu" tabindex="-1" />

    <nav> <!-- ... 생략 ... --> </nav>
  </header>


<style lang="postcss">

  header:focus-within nav {
    display: block; /* visibility: visible; */
    transform-origin: top center;
    animation: showMenu 0.5s ease-in-out forwards;
  }

  /* 열기 버튼을 누른 후에는 닫기 버튼이 그 자리를 차지한다 */
  header:focus-within .closeMenuBtn {
    display: block;
  }

  /* 닫기 버튼을 누른 후에는 열기 버튼을 위해 자리를 피해준다 */
  header:focus-within .closeMenuBtn:focus {
    transform: translateX(-50px);
  }

  .closeMenuBtn {
    display: none;
    background-color: transparent;
    outline: none;
    border: 1px solid red;
    position: absolute;
    top: 0.25rem;
    right: 0.5rem;
    width: 48px;
    height: 48px;
  }

  .closeMenuBtn:focus + nav {
    animation: hideMenu 0.5s ease-in-out forwards;
  }

  @keyframes hideMenu {
    0%   { transform: scaleY(1); }
    20%  { transform: scaleY(1.2); }
    100% { transform: scaleY(0); }
  }  
</style>
```

![pull-down menu - close button animation](/2023/07/03-css-ch22-animations-close-10fps.gif){: width="600"}
_pull-down menu - close button animation_


### Ch23. How to Organize CSS

#### 컨벤션 제안

1. 팀 규칙에 따를 것
2. 상단에 항상 주석을 달 것
3. 속성은 ABC 순서로 정렬할 것 (vscode 명령어 `sort line ascending` 활용)
4. 대규모 프로젝트라면 BEM (Block, Element, Modifier) 명명법을 활용할 것

```html
<header class="header">
  <h1 class="header__title">BEM</h1>
  <nav class="header__nav">
    <button class="header__btn">🚀</button>
    <button class="header__btn header__btn--secondary">🔥</button>
    <button class="header__btn header__btn--lean header__btn--border-lg header__btn--secondary">🌮</button>
  </nav>
</header>
```


## 9. Summary

- CSS Grid 는 레이아웃용 (2차원), Flexbox 는 정렬용 (1차원)
- 자바스크립트 없이 css 만으로 동작을 제어하는 것은 어렵네 (되긴 하는데)
  + 가상의 selector 를 만들고 (보이지 않게)
  + focus 등의 상태를 구분하기 위해 위치를 이동시키고
  + 이건 뭐 객체를 이용한 프로그래밍인데, 변수가 아니라서 헷갈린다

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
