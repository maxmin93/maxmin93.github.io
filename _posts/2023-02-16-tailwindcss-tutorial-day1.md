---
date: 2023-02-16 00:00:00 +0000
title: TailwindCSS 공부하기 - 1일차
categories: ["nodejs","tailwindcss"]
tags: ["frontend","tutorial","1st-day"]
image: "https://assets.stickpng.com/images/584830e8cef1014c0b5e4aa0.png"
hidden: true
---

> 프론트엔드 프레임워크인 Svelte 에 대해 공부한다. Svelte 는 Vite 를 사용한다. (1일차)
{: .prompt-tip }

- [TailwindCSS 공부하기 - 1일차](/posts/2023-02-16-tailwindcss-tutorial-day1/) : Tutorial &num;1 <span style='font-size:1.5rem;'>&nbsp; &#10004;</span>

## 1. TailwindCSS 강좌

참고자료 [Tailwind CSS Introduction, Basics & Guided Tutorial](https://www.youtube.com/watch?v=pYaamz6AyvU)

### 1) 개발도구 셋팅

- VS Code
  + Tailwind CSS IntelliSense
  + Live Server : html 파일에 대한 빠른 웹서버 기능을 제공
  + inline fold : 지저분한 class 내용을 `...` 으로 숨겨준다

### 2) [기본 설정](https://tailwindcss.com/docs/installation)

TailwindCSS 페이지의 설치 과정을 따라하면 된다.

- node 필요
- npm 으로 개발 의존도구로 tailwindcss 설치
- tailwind init 로 설정파일을 생성 후, 컴파일 대상을 정의 (html 파일들)
- src 폴더로부터 tailwind css 를 컴파일 해서 dist 폴더로 표준 css 파일을 생산

### 3) 사용법

- 기본 배율 : 값 4 = `1rem` = `16px`
  + ex) 값 2 = `0.5rem` = `8px`
- 반응형 디자인을 위한 5개의 중단점 => 사이즈별로 스타일 정의
  + sm 최소 너비 640px
  + md 최소 너비 768px
    * `<div class="md:max-lg:flex">` md 부터 max-lg 까지 flex 적용
  + lg 최소 너비 1024px
  + xl 최소 너비 1280px (2xl 1536px) : 256px 씩 증가
- `dark:` dark 모드의 스타일 지정
  + 수동으로 dark 모드 지정시 `<html class="dark">`
- 반복 스타일은 class 사용
- [Functions & Directives](https://tailwindcss.com/docs/functions-and-directives#layer)
  + `@apply` 사용자 css 를 인라인으로 적용시키는 지시자

```html
<button class="btn-primary">
  Save changes
</button>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  h1 {
    @apply text-2xl;
  }
  h2 {
    @apply text-xl;
  }
}

@layer components {
  .btn-primary {
    @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
  }
}

@layer utilities {
  .filter-none {
    filter: none;
  }
  .filter-grayscale {
    filter: grayscale(100%);
  }
}
</style>
```

## 2. Tutorial &num;2

### 1) body

- min-h-screen : 최소 높이 (100vh 전체)
- bg-slate-50 : 바탕색 회색 50 
- dark 다크 모드
  + dark:bg-black : 다크 모드에서 바탕색 검정
  + dark:text-white : 다크 모드에서 글자색 흰색

### 2) header

- bg-teal-700 : 바탕색
- text-white : 글자색
- sticky : 화면에 고정, 자식에 대한 위치 참조 역활 (relative)
- top-0 : 상대 좌표에서 상단 위치
- z-10 : 요소의 스택 순서 (높은 수가 더 상위)

### 3) section

- max-w-4xl : 최대 너비 (4xl 만큼)
- mx-auto : 컨테이너를 중앙에 위치로 배치
- p-4 
- flex
- justify-between
- items-center

- text-slate-#num;

#### margin : 바깥 영역

- `my-#` : 세로 방향 바깥 영역
- `m-#` : 모든 방향 바깥 영역


## 9. Summary


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
