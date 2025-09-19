---
date: 2025-02-04 00:00:00 +0900
title: Svelte & Tailwind CSS 4 튜토리얼 - 1일차
description: 2025년 1월에 출시된 TailwindCSS 4 를 이용하여 Svelte 프로젝트를 생성하고 설정하는 방법을 다룹니다.
categories: [Frontend, CSS]
tags: [tailwind, svelte, 1st-day]
image: "https://i.ytimg.com/vi/UFSmNnWPvrM/sddefault.jpg"
hidden: true
---

## 0. Tailwind CSS 4

> 참고자료

- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)
- [TailwindCSS 4.0.0 is out.](https://dev.to/falselight/tailwindcss-version-400-has-been-released-29pp)
- [daisyUI 5 beta release notes](https://v5.daisyui.com/docs/v5-beta/)
- [How to add tailwind 4 alpha to sveltekit 5?](https://github.com/tailwindlabs/tailwindcss/discussions/13417)


### [변경사항](https://daily.dev/blog/tailwind-css-40-everything-you-need-to-know-in-one-place)

- 새로운 엔진 Oxide 으로 더 빨라짐 (Rust를 활용해 성능 향상)
- 네스팅, 미디어 쿼리 등의 통합 툴체인으로 Lightning CSS 을 사용
- 최신 웹을 위해 설계되어 컨테이너 쿼리와 같은 기능을 지원
- 스타일링에 더 많은 유연성을 제공
- 스타일 적용을 자동화
- JavaScript 보다 CSS 의 설정을 우선하여 구성

> 이전 버전과의 주요 변경 사항

- 더 이상 지원되지 않는 유틸리티를 제거
- PostCSS 플러그인과 CLI 도구의 분리
- 기본 테두리 색상이 없고, 링은 기본적으로 1px로 변경됨


## 1. [Svelte 5 프로젝트](https://svelte.dev/docs/kit/creating-a-project)

> SvelteKit with Svelte 5

- SvelteKit 2.17.1 (Svelte 5.19.7)
- Prettier 3.4.2

```bash
bunx sv create svlt-hello-app
  # - SvelteKit minimal
  # - using Typescript syntax
  # - Prettier
  # - bun

cd svlt-hello-app
  # bun install (이미 설치되어 있다)

# bun runtime
bun run dev --host 0.0.0.0

# (선택사항) 최신 버전으로 업데이트
bun update --latest
```

## 9. Review

- 작성중

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
