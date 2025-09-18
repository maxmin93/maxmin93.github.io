---
date: 2024-06-29 00:00:00 +0900
title: Svelte 5 Mdsvex 튜토리얼 - 2일차
description: 기존의 jekyll 기반의 블로그를 대체하기 위해 Svelte 5 기반의 markdown blog 개발을 시작합니다. 기존 자료를 참고하며 나름대로 만들어 보겠습니다.
categories: [Frontend, Svelte]
tags: [mdsvex]
image: "https://i.ytimg.com/vi/UFSmNnWPvrM/sddefault.jpg"
hidden: true
---

## 0. 개요

### Features


#### 비교 : svelte preprocess 이용한 방법

> 출처 : [깃허브 - sveltedown](https://github.com/joysofcode/sveltedown)

- mdsvex 을 사용하지 않고, `.md` 확장자 파일에 대해 처리하는 전처리기를 이용했다.
- mdsvex 과 유사한 메카니즘으로 동작하도록 markup 함수와 하위 함수들을 작성
  - frontmatter : metadata 를 포함하는 스크립트 모듈을 생성
  - parseMarkdown : markdown 을 HTML 로 변환하는 플러그인들을 연결
  - excapeHtml : 예외적인 특수문자들을 변환하는 후처리 수행

여기서 핵심적인 요소는 tailwind v4 버전인데, 전처리기를 사용하지 않고 css 레벨까지 내려가서 작동하는 방식이다. markdown 에 사용된 tailwind css 클래스들이 별도의 처리 없이 반영된다.

### 화면캡쳐

> 홈페이지

### 라이브러리

- [x] Bun 1.1.33 + Svelte 5
  - typescript
  - prettier
  - tailwindcss

### 참고자료

- [Joy Of Code - Creating Your Own Markdown Preprocessor Is Easier Than You Might Think](https://www.youtube.com/watch?v=UFSmNnWPvrM)
  - [깃허브 - sveltedown](https://github.com/joysofcode/sveltedown)
  - [깃허브 - jasonstitt blog](https://github.com/jasonstitt/blog)
- [daisyUI - Dark mode 선택자](https://daisyui.com/docs/themes/#-9)
- [meltUI - Svelte 5 compatibility](https://github.com/melt-ui/melt-ui/discussions/957#discussioncomment-9550603)

- [Steve Kinney - Creating a Markdown Preprocessor for Svelte](https://stevekinney.net/writing/svelte-markdown-preprocessor)


## 1. Svelte 5 프로젝트

svelte 5 버전이 릴리즈 되면서 CLI 명령어인 `sv create` 를 사용해야 한다.

```bash
$ bunx sv create svlt5-beginner-app

┌  Welcome to the Svelte CLI! (v0.5.8)
│
◇  Which template would you like?
│  SvelteKit minimal
│
◇  Add type checking with Typescript?
│  Yes, using Typescript syntax
│
◆  Project created
│
◇  What would you like to add to your project? (use arrow keys / space bar)
│  prettier, tailwindcss
│
◇  tailwindcss: Which plugins would you like to add?
│  typography, container-queries
│
◇  Which package manager do you want to install dependencies with?
│  bun
│
◆  Successfully setup integrations
◇  Successfully installed dependencies
◇  Successfully formatted modified files
│
◇  Project next steps
│  1: cd svlt5-beginner-app
│  2: git init && git add -A && git commit -m "Initial commit" (optional)
│  3: bun run dev -- --open
```

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

## 9. Review

- 작성중

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
