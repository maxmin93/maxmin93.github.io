---
date: 2026-01-29 00:00:00 +0900
title: Svelte 5 Mdsvex 튜토리얼 - 2일차
description: 기존의 jekyll 기반의 블로그를 대체하기 위해 Svelte 5 기반의 markdown blog 개발을 시작합니다. 기존 자료를 참고하며 나름대로 만들어 보겠습니다.
categories: [Frontend, Svelte]
tags: [mdsvex]
image: "https://i.ytimg.com/vi/UFSmNnWPvrM/sddefault.jpg"
hidden: true
---

## 0. 개요



### Features




### 화면캡쳐

> 홈페이지

### 라이브러리

- [x] Bun 1.1.33 + Svelte 5
  - typescript
  - prettier
  - tailwindcss


## 1. Svelte 5 프로젝트


### vscode 에서 require 모듈 사용하기

- tailwind.config.ts 파일에서 require 함수 호출시 필요 (문제 리스트에 출력)

```bash
# for using 'require' function
bun add -d @types/node
```

### 추가 설치

- svelte-hero-icons
- prettier-plugin-tailwindcss 

```bash
# utilities 설치 : icons, prettier
bun add -d svelte-hero-icons
bun add -d prettier-plugin-tailwindcss 

# prettier 에 tailwind 플러그인 추가
sed -i '' 's/"prettier-plugin-svelte"\]/"prettier-plugin-svelte","prettier-plugin-tailwindcss"\]/' .prettierrc
```

## 2. Mdsvex 설정

```bash

```

```bash

```

## 8. 참고문서

- [Joy of Code - How To Make A Svelte Markdown Preprocessor](https://joyofcode.xyz/svelte-preprocessors)
- [Steve Kinney - Creating a Markdown Preprocessor for Svelte](https://stevekinney.net/writing/svelte-markdown-preprocessor)

> SvelteKit Tutorials

- [Getting Started with SvelteKit: Setup, Project Structure & First App](https://dev.to/a1guy/getting-started-with-sveltekit-setup-project-structure-first-app-2jea)


### svelte preprocess 이용한 방법

참고 : [Joy Of Code - 깃허브 sveltedown](https://github.com/joysofcode/sveltedown)

- mdsvex 을 사용하지 않고, `.md` 확장자 파일에 대해 처리하는 전처리기를 이용했다.
- mdsvex 과 유사한 메카니즘으로 동작하도록 markup 함수와 하위 함수들을 작성
  - frontmatter : metadata 를 포함하는 스크립트 모듈을 생성
  - parseMarkdown : markdown 을 HTML 로 변환하는 플러그인들을 연결
  - excapeHtml : 예외적인 특수문자들을 변환하는 후처리 수행

여기서 핵심적인 요소는 tailwind v4 버전인데, 전처리기를 사용하지 않고 css 레벨까지 내려가서 작동하는 방식이다. markdown 에 사용된 tailwind css 클래스들이 별도의 처리 없이 반영된다.


## 9. Review

- 작성중

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }