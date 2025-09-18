---
date: 2023-06-29 00:00:00 +0900
title: Frontend 공부하기 - 2일차 CSS Part1
description: 프론트엔드 개발을 배우기 위해 CSS 기초부터 다지려고 합니다. Dave Gray 유튜브 강좌이고, 실습 환경은 SvelteKit + PostCSS 을 사용합니다. (2일차)
categories: [Frontend, CSS]
tags: ["svelte", "css","tutorial","1st-day"]
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1-kQQloEDQ90MNQJP2X5a2onDmlkfHRnV7MHlK2ocvv4zRrwtMOb8lMJhaCAUWlY-Xus&usqp=CAU"
---

> 목록
{: .prompt-tip }

- [Frontend 공부하기 - 1일차](/posts/frontend-tutorial-day1/) : Dave Gray &ndash; [HTML Full Course](https://www.youtube.com/watch?v=mJgBOIoGihA)
- [Frontend 공부하기 - 2일차](/posts/frontend-tutorial-day2/) : Dave Gray &ndash; [CSS Full Course](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit) Part&#9839;1 &nbsp; &#10004;
- [Frontend 공부하기 - 3일차](/posts/frontend-tutorial-day3/) : Dave Gray &ndash; [CSS Full Course](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit) Part&#9839;2
- [Frontend 공부하기 - 4일차](/posts/frontend-tutorial-day4/) : Dave Gray &ndash; [CSS Full Course](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit) Part&#9839;3
- [Frontend 공부하기 - 5일차](/posts/frontend-tutorial-day4/) : Dave Gray &ndash; [CSS Full Course](https://www.youtube.com/playlist?list=PL0Zuz27SZ-6Mx9fd9elt80G1bPcySmWit) Part&#9839;4

> 참고문서

[MDN - CSS 문서](https://developer.mozilla.org/ko/docs/Web/CSS)

## Part &#9839;1 Chapter 01 ~ 10

### Ch01. CSS Introduction

SvelteKit + PostCSS 설치로 대체한다.

```console
$ npm create svelte@latest css-lesson
$ cd css-lesson

$ npx svelte-add@latest postcss
$ npm install
```

전역 설정을 위해 `app.postcss` 작성

- font 설치 및 기본 패밀리 적용
  + 웹설치 폰트보다 다운로드 후 로컬설치 방식을 권장

```css
@charset "UTF-8";

/* Import fonts from web: Noto Sans KR, sans & serif */
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR&family=Noto+Serif+KR&display=swap');

/* Import fonts from local, ex: url(), url(), ... */
@font-face {  
  font-family: 'Noto Sans KR';  /* Reference name */
  src: url('/fonts/NotoSansKR-Regular.otf'), url('/fonts/NotoSerifKR-Regular.otf');
}

/* root : HTML 과 같지만 지정 우선순위가 더 높다 */ 
:root {
  --theme-rounded-base: 20px;
  --theme-rounded-container: 4px;

  --theme-font-family-base: 'Noto Sans KR', sans-serif;
  --theme-font-family-heading: 'Noto Sans KR', sans-serif;
}

body {  
  padding: 2em;  /* padding: 5%; */
  font-size: 1.2rem;
}
```

### Ch02. CSS Selectors : tag, class, id

#### 비교: `*`, `:root`, `body`

- `*` : 모든 요소 또는 특정 요소 내의 모든 하위 요소
- `:root` : 문서의 최상위 요소를 뜻하는 의사 클래스 선택자
  + HTML 및 XML, XHTML 도 포함하므로, `html` 선택자보다 상위 선택자임
- `body` : 브라우저에서 보는 전체 html 문서
  + 주로 보여지는 페이지의 레이아웃을 설정하는데 사용한다

#### Nested CSS with `PostCSS`

- nested 플러그인 설치 : `npm install --save-dev postcss-nested`
- `postcss.config.cjs` 에 nested 플러그인 추가

```js
const autoprefixer = require('autoprefixer');
const postcssNested = require('postcss-nested');

const config = {
  plugins: [autoprefixer, postcssNested],
};

module.exports = config;
```

svelte 페이지에서 script 사용시 `lang="postcss"` 를 명시하면 된다.

```css
<style lang="postcss">
  p {
    text-align: justify;

    span {
      text-transform: uppercase;
      background-color: gold;
    }
  }

  /* p span {
    text-transform: uppercase;
    background-color: gold;
  } */
</style>
```

#### [의사(Pseudo) 클래스](https://developer.mozilla.org/ko/docs/Web/CSS/Pseudo-classes)

- `:hover`, `:focus`, `:checked`, `:active`, `:visited`, ...
- `:first`, `:last`, `:last-child`, `:nth-child()`, `:nth-last-child()`, ...
- `:not()`, `:is()`
- `:only-child`, `:read-only`, `:link`, `:right`, `:left`, `:past`, ...

#### `!important` 사용하지 말 것 (권고)

selectors 에 대해 설정을 재설정하게 됨 => 엉성한 스타일을 의미

### Ch03. CSS Colors

#### 유용한 도구

- [Color Contrast Checker](https://coolors.co/contrast-checker): 배경과 글자색이 얼마나 시인성 있는지 검사

#### color 지정 방식

- color name, rgb(), Hex value
- rgba() : 마지막 a 는 투명도
- hsl() : 채도, 명도 등..

#### color 지정 대상

- background-color
- color : 텍스트

### Ch04. CSS Units &amp; Sizes

#### Units

- 절대 단위: pt, px, ... (브라우저 설정을 변경해도 같은 크기)
  + percent `%` : 절대값의 상대값을 계산
- 상대 단위: em, rem, ch, ... (페이지 크기별로 다른 크기)
  + rem (root 기준) 기본크기, ex) 2rem 은 기본 크기의 2배
    * ex) 2em 은 부모의 2배 크기 (부모가 기준)
  + `40ch` 한줄에 40자 이하 글자
  + vw, vh : view-point 기준 1% 단위

### Sizes

- 가로(width)는 `%` 를 사용해야 가로 스크롤이 생기지 않는다
  + vw 사용시 충분히 줄여서 정렬을 시켜야 할 듯

### Ch05. CSS Box Model

#### Box Model 의 재설정 (reset)

박스 사이즈는 콘텐츠 기준보다 기준선 중심으로 하는게 계산하기 좋다.

```css
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;  /* 여분을 포함한 사이즈 계산 */
  }

  body {
    max-height: 100vh;
    height: 95vh;  /* edge 에서는 95vh 정도 되어야 스크롤바 없어짐 */
  }

  .container {
    border: 2px dashed red;
    font-size: 1.5rem;
    margin: 1.5em 2em 2em 1.5em;
    padding: 1em;

    /* outline 은 box 사이즈에 포함되지 않음 */
    outline: 5px solid purple;
    outline-offset: -20px;  /* 상대적 위치 */
  }
```

#### vertical scrollbar 생성되지 않도록 하는 방법

참고: [height=100vh 일때 스크롤바 생성 문제](https://stackoverflow.com/a/58387290/6811653)

- height 를 충분히 줄이는 것만이 유일한 해결책
  + `100vh != 100%` (다르다)
- body 여백을 제거할 것
- 최상위 margin-top, margin-bottom 요소를 제거
- 모바일에서는 `height: 100%` 를 사용할 것
- 백분율 size는 여백 또는 테두리를 고려하지 않는다. 백분율 사용시 여백을 제거하지 않으면 상자(box)가 약간 더 커진다.

```css
* {
     overflow: hidden;  /* 또는 overflow-y: hidden */
}
```

### Ch06. CSS Text and Fonts

`form` 아래에서는 font-size 속성이 상속되지 않으므로, 명시해야 한다.

```css
  input,
  button {
    font: inherit;  /* 상위의 속성을 상속 받는다 */
  }

  p {
    text-align: justify;
    text-indent: 1em;  /* 첫글자 들여쓰기 */
    line-height: 1.5;
    letter-spacing: 0.1em;
    word-spacing: 0.1em;  /* 딱히 필요가 없다 */
    font-weight: normal;  /* 두께: 100, 200, ... */
    font-style: normal;
    font-family: serif;
  }
```

### Ch07. hypertext links styles: visited, hover, active and focus

```css
  a {
    text-decoration: none;
    cursor: pointer;
    color: hsl(207, 44%, 49%);

    &:visited {
      color: purple;
    }

    &:hover,
    &:focus {
      color: hsl(207, 44%, 49%, 0.8);  /* 살짝 깜박임을 만듦 */
    }
  }
```

### Ch08. CSS List Styles

```css
  ul,
  ol {
    /* padding-left: 2ch; */
    list-style-position: inside;  /* outside 하면 왼쪽에 가려 안보인다 */
    line-height: 1.6;
  }

  @counter-style thumbs {
    system: cyclic;
    symbols: '\1F44D';
    suffix: ' ';
  }

  ol {
    list-style-type: upper-roman;

    ::marker {
      color: red;
    }
  }

  ul {
    /* list-style-type: thumbs; */
    /* list-style-image: url(/images/checkmark.png); */
    list-style: square url(/images/checkmark.png) inside;

    li:nth-child(even) {
      color: red;
    }
  }
```

### Ch09. CSS Mini-project

```css
  nav {
    border: 2px solid #333;
    border-radius: 2rem;
    margin: 0 auto 1rem;
    max-width: 600px;
    font-size: 3rem;
    line-height: 7rem;
  }

  h2 {
    padding: 1rem;
    background-color: gold;
    border-radius: 2rem 2rem 0 0;
  }

  ul {
    list-style-type: none;
  }

  li {
    border-top: 1px solid #333;

    a {
      display: block;
    }

    &:last-child a {
      border-radius: 0 0 2rem 2rem;
    }

    a,
    a:visited {
      text-decoration: none;
      color: #333;
    }

    a:hover,
    a:focus {
      background: #333;
      color: whitesmoke;
      cursor: pointer;
      font-weight: bolder;
    }
  }
```


### Ch10. CSS Display Property

![css-inline-vs-inlineblock-vs-block](https://samanthaming.gumlet.io/pictorials/css-inline-vs-inlineblock-vs-block-4.jpg.gz?format=auto){: width="480" .w-75}
_css-inline-vs-inlineblock-vs-block_

- inline 요소는 서로 쌓이지 않고, 새 라인을 생성하지 않음 (나란히 배치)
  + width, height 등의 속성이 무시됨 (콘텐츠만큼의 너비만 차지)
  + 대표적인 태그: span, a, img, em, strong, i, small 등..
- block 은 새 라인을 생성하고, 라인의 전체를 차지함 (분리된다)
  + width, height, margin, padding 속성이 모두 반영됨
  + 대표적인 태그: div, h1, p, li, section 등..
- inline-block 은 하이브리드 (내부는 block, 외부는 inline)
  + inline 처럼 나란히 배치되지만, block 처럼 높이와 너비 설정 가능
  + 대표적인 태그: button, input, select 등..

```css
  .opposite {
    display: inline-block; /* 안하면, margin 등은 효과 없음 */
    background-color: #333;
    color: whitesmoke;
    margin-top: 2rem;
  }

  ul {
    list-style-type: none;
    padding: 0.5rem;
    text-align: right;
    background-color: black;
    color: whitesmoke;
    margin: 0;
  }

  li {
    display: inline-block;
    margin-inline: 0.5rem;

    a {
      text-decoration: none;
      color: whitesmoke;
      cursor: pointer;

      &:hover,
      &:focus {
        text-decoration: underline;
      }
    }
  }
```

#### pull-down (풀다운) 메뉴 항목을 overlay 시키기

예제: [How to get a drop-down menu to overlay other elements](https://stackoverflow.com/a/29732614/6811653)

> 메뉴 그룹 ul 의 시작점을 절대위치로 고정하면 된다. (덮어버림)

- `header` 는 상단에 붙이고 `position: sticky`
- `nav` 를 기준으로 상대좌표 시작 `position: relative`
  + `ul` 은 위치 고정 `position: absolute` + `top: 0` &amp; `left: 0`
  + `li` 항목은 nav 의 block 으로 visibility 조정

```html
  .container {
    min-height: 100vh;

    display: flex;
    flex-flow: column nowrap;
  }

  header {
    position: sticky; /* 시작 위치에 고정 */
  }

  :is(header:hover, header:focus-within) {
    nav {
      display: block; /* visibility: visible; */
    }
  }  

  nav {
    display: none; /* visibility: hidden; */
    position: relative; /* 상대좌표 기준 */

    ul {
      position: absolute; /* 상대좌표를 기준으로 절대좌표 시작 */
      left: 0;
      top: 0;
      width: 100%;
    }  
  }
```


## 9. Review

- 답답하지만, 조금씩 나아진다는 생각으로 위안을 삼자.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
