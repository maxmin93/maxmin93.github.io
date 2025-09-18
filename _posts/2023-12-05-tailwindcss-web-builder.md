---
date: 2023-12-05 00:00:00 +0900
title: Tailwind 웹페이지 빌더 조사
description: Tailwind 를 사용에 어려움이 많아 도구의 힘을 빌리려고 합니다. Tailwind 의 Page Builer 도구로 유명한 Shuffle 등을 공부합니다.
categories: [Frontend, CSS]
tags: [wysiwyg, shuffle, tailwind]
image: "https://i.ytimg.com/vi/_v3jR3BQeeM/maxresdefault.jpg"
---

## 0. 개요

- Tailwind 유용한 팁들과 도구들 : 유튜브 참고
- [Shuffle](https://shuffle.dev/) : TW wysiwyg 도구

## 1. [5가지 최고의 드래그 앤 드롭 Tailwind CSS 페이지 빌더](https://medium.com/landing-page-tips/5-best-drag-drop-tailwind-css-page-builders-9c251758d891)

2023년 10월 16일자로 작성된 문서

### 페이지 빌더를 사용할 경우의 장단점

CSS 기본 지식이 부족한 사람이라도 원하는 결과를 얻을 수 있다는 것이 장점

> 장점

- 사용의 용이성
- 능률
- 내장 구성요소 및 템플릿
- 가격

> 제한 사항

- 자바스크립트 지원 부족
- 플랫폼 종속성
- 사용자 정의 수준
- CMS 통합

### [Shuffle](https://shuffle.dev/)

![Shuffle에서 Tailwind 웹 사이트 빌더 드래그 앤 드롭](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*kirlLBfpbdxx9b-lQYjGXw@2x.png){: width="560" .w-75}
_Shuffle에서 Tailwind 웹 사이트 빌더 드래그 앤 드롭_

> 특징 ✨

- 29개 이상의 사전 디자인된 Tailwind 템플릿 라이브러리
- 드래그 앤 드롭 온라인 편집기
- vscode 확장 프로그램
- 평생 및 연간 지불 옵션을 사용할 수 있습니다
- HTML, React, Next.js 및 Vue 기반의 템플릿 15개 이상
- AI 카피라이터 내장
- 마케팅 UI 컴포넌트
- 관리 및 대시보드 및 전자상거래 UI 템플릿 라이브러리 포함

> 장점 ✅

- 사전 구축된 관리 및 랜딩 페이지 UI 템플릿
- 온라인 빌더와 함께 제공됩니다.
- export 제한 없음
- 간단한 문서화
- 새로운 UI 라이브러리가 Shuffle 에 정기적으로 제공됩니다.
- 기타 프레임워크 지원(Bootstrap, Bulma, Material UI)

> 단점 ⛔️

- 최신 Tailwind CSS 업데이트가 기본 설정에서 작동하지 않을 수 있습니다.
- HTML 템플릿은 단지 정적 페이지일 뿐입니다. 
  - `.js` 코드를 직접 추가해야 합니다.
- 타사 Tailwind 구성요소는 Shuffle Editor에서 시각적으로 편집하지 못할 수 있습니다.

### [Tails](https://devdojo.com/tails)

> 특징 ✨

- 여러 페이지 지원
- Tailwind V3 지원
- import 가능 
- 100개 이상의 디자인 구성요소
- 프리미엄 플랜에는 다른 DevDojo 제품에 대한 액세스가 포함됩니다

> 장점 ✅

- 사전 구축된 랜딩 페이지 구성 요소
- 타사 컴포넌트를 import 할 수 있습니다.
- 원클릭으로 GitHub에 게시
- 쉬운 플러그인 관리
- 컴포넌트들은 Alpine.js 를 지원합니다.

> 단점 ⛔️

- 개별 컴포넌트는 디자인이 통일되지 않아 조합했을 때 조화롭게 보이지 않을 수 있습니다.
- Tails에는 Shuffle 과 같은 올인원 랜딩 페이지 템플릿이 포함되어 있지 않습니다.
- Tails는 2022년만큼 자주 업데이트 지원이 되지 않습니다.

### [Windframe](https://www.devwares.com/windframe/)

![Windframe](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*_u8SQ2TnGgs2r1ECTEJxjQ@2x.png){: width="560" .w-75}
_Windframe_

> 특징 ✨

- 800개 이상의 Tailwind CSS 템플릿이 내장되어 있습니다.
- AI 카피라이터 내장
- 내장된 양식 작성기
- HTML, React, Vue로 코드 내보내기

> 장점 ✅

- 타사 구성요소를 가져올 수 있습니다.
- 관리 템플릿도 사용 가능
- 디자인 템플릿과 함께 제공됩니다.

> 단점 ⛔️

- 무료 평가판을 제공하지만 무료 플랜에서는 코드 편집기를 사용할 수 없습니다
- 코드 편집기를 실행하려면 페이지를 몇 번 새로 고쳐야 할 수도 있습니다.

### [Chai Builder](https://chaibuilder.com/)

![Chai Builder](https://miro.medium.com/v2/resize:fit:2000/format:webp/1*mTMNEo-5E8JNtiuUQ0fItQ@2x.png){: width="560" .w-75}
_Chai Builder_

> 특징 ✨

- 한 번의 클릭으로 정적 웹사이트로 게시
- HTML, Image, React, Vue, NextJS, Remix 등으로 내보내기
- 비밀번호로 보호된 사이트
- 데스크탑에서도 사용 가능

> 장점 ✅

- 저렴한 가격
- 다국어 지원

> 단점 ⛔️

- 제한된 컴포넌트 라이브러리
- 베타 버전의 제품을 사용하고 있다는 느낌을 받을 수 있습니다.

### [loopple](https://www.loopple.com/tailwind)

> 특징 ✨

- 랜딩 페이지 및 관리 템플릿 포함
- 사용하기 쉽고
- 564개 구성 요소 포함
- AI 카피라이터 내장

> 장점 ✅

- 564개 구성 요소 포함
- 대시보드 2개 + 관리 템플릿

> 단점 ⛔️

- 맞춤화가 부족함
- 컴포넌트에 대한 제한된 디자인 제어


## 2. [Shuffle](https://shuffle.dev/) 사용해보기

계정을 생성하지 않고도 빌더의 사용법은 체험할 수 있습니다.

![Shuffle 빌더 사용법](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*3wC1ZtuJV19fuWj5aesXTg.gif){: width="560" .w-75}
_Shuffle 빌더 사용법_

### 사용법

1. 프로젝트를 생성하면 비어있는 index 페이지가 나오고
2. 왼쪽 템플릿 메뉴에서 Drag &amp; Drop 으로 가져다 배치하고
3. 페이지 내의 컴포넌트의 속성과 class 들을 수정할 수 있다.
4. 완성을 위해 중간중간 preview 를 확인해 볼 수 있다.

### 특이사항

- 무료버전에서 체험해 볼 수 있는 컴포넌트나 템플릿은 제한적
- 테마 형태로 동일한 디자인들의 템플릿들을 제공 (그린이면 그린계열로)
- XL, MD, SM 반응형 제공
- Custom HTML : 제작한 페이지의 HTML 코드를 확인할 수 있다

더 작성하려다가 중단한다. 

- 찍어내기 하듯이 웹페이지를 생산하게 된다면 사용할만한다.
- 부가세를 감안하면 평생 라이센스에 36만원 정도이다.


## 9. Review

- Shuffle, Windframe, Chai Builder 세가지를 주로 살펴보았다.
  - Shuffle 이 더 풍부한 템플릿을 가진 것으로 보여지고 다른 기능은 비슷하다.
- Drag &amp; Drop 이라는 것이지 자유롭게 마우스로 늘이고 줄일 수 있는 것은 아니다.
  - 스타일을 바꾸려면 Tailwind CSS 를 알아야 한다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
