---
date: 2022-12-15 00:00:00 +0900
title: 프론트엔드 생산성 도구들
description: 프론트엔드 개발에 유용한 생산성 도구들을 살펴본다. 생산성 도구들은 코드의 안전성과 테스트 비용 등을 아껴준다.
categories: [Frontend]
tags: [library, ui-components, validation]
image: "https://vite.dev/assets/ecosystem-vite4.D87C5WSz.webp"
---

## 1. 번들 도구

### 1) [Vite](https://vitejs.dev/) : js 실행도구

> 컴포넌트 단위로 개발하고 결합하여 JS 애플리케이션을 실행하는 도구

[Vite 4.0 출시 - 2022년12월](https://vitejs.dev/blog/announcing-vite4.html)

- Vite 기반 프레임워크 : Astro 1.0, Nuxt 3, SvelteKit 1, ...

#### 모듈 번들러 [Rollup](https://rollupjs.org/guide/en/) 포함

작은 js 조각으로 나누어 CommonJS/AMD 모듈 등으로 다시 컴파일하고 결합

- 로딩 시간, 용량을 줄여서 결과적으로 성능 향상
- 트리 쉐이킹 : 사용하지 않는 모듈 제거
- 호환성 증가, 부작용 방지
- 환경 변수와 모드 설정, 플러그인 통합
- 정적 사이트 빌드와 배포 (`vite preview`는 production 용도가 아님)
- 서버렌더링(SSR), 백엔드 통합

> ESBuild 번들러는 왜 사용하지 않는가?

esbuild는 매우 신속하게 XML을 유지하는 유능한 번들러이지만 애플리케이션 번들링에 필요한 일부 중요한 기능, 특히 코드 손상 및 CSS 처리 기능이 미흡합니다. 그 때까지는 Rollup 이 해당 기능을 대신합니다.

### 2) ESLinter

소스코드를 분석하여 오류나 오타, 잠재적 버그를 찾아주는 도구

### 3) Prettier

코드를 일관된 스타일로 정렬해주는 코드 포맷터

## 2. 테스트 도구

### 1) [Storybook](https://storybook.js.org/docs/react/get-started/whats-a-story) : 컴포넌트 테스트 도구

package.json 의 개발 도구로 포함하여 쓸 수 있다.

- 사용자 입장에서 바라보는 렌더링 상태로 컴포넌트를 테스트
  + 예) Button 을 만든 경우, 실제 렌더링 출력과 기능을 확인
- 공유 : 독립적으로 퍼블리싱, 임베딩, 결합해보기
- 에디트 : 속성 편집, 디버깅 - 동작 출력

참고

- [스토리북 작성을 통해 얻게 되는 리팩토링 효과](https://fe-developers.kakaoent.com/2022/220609-storybookwise-component-refactoring/)
- [Storybook의 유용함](https://medium.com/@j_podracer/storybook%EC%9D%98-%EC%9C%A0%EC%9A%A9%ED%95%A8-8581ea618c32)

## 3. 라이브러리

### 1) Zod : 스키마 Validation

- 외부 API 데이터에 대해 스키마를 선언하거나 파싱하는데 사용
- TypeScript 4.5 이상에서 지원

### 2) [Hightlightjs](https://highlightjs.org/) : 코드 블럭 (197가지 언어)

### 3) [ToastUI](https://ui.toast.com) : UI 컴포넌트

- 애플리케이션 : [차트](https://ui.toast.com/tui-editor), [에디터](https://ui.toast.com/tui-editor), [그리드(테이블)](https://ui.toast.com/tui-grid), [칼렌더](https://ui.toast.com/tui-calendar), [이미지 수정](https://ui.toast.com/tui-image-editor)
- 컴포넌트 : [날짜 입력기](https://ui.toast.com/tui-date-picker), [색상 선택기](https://ui.toast.com/tui-color-picker) 등등..

### 4) [svelte-french-toast](https://svelte-french-toast.com/) : 상단 팝업 알리미 (자동 사라짐)

### 5) [marked](https://marked.js.org/) : Markdown 문자열을 HTML로 변환

## 4. 폰트, 아이콘

### 1) [Lucide](https://lucide.dev/docs/lucide-svelte) 아이콘

### 2) [랜덤 프로파일](https://randomuser.me/api/) (사용자 정보)

- [랜덤 섬네일 300px](https://i.pravatar.cc/300) : 숫자는 사이즈

### 3) [랜덤 풍경/동물 사진](https://picsum.photos/)

랜덤 이미지 API 는 무척 다양하다. 검색하면 바로 나옴.

## 9. Review

- 일단 업로드하고, 계속 업데이트 하자!

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }