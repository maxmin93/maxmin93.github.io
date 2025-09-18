---
date: 2023-12-01 00:00:00 +0900
title: SvelteKit Tailwind 튜토리얼 - 2일차
description: Tailwind 를 사용에 어려움이 많아 도구의 힘을 빌리려고 합니다. Tailwind 관련한 Plugin 과 Tailscan 등의 도구들을 공부합니다.
categories: [Frontend, CSS]
tags: ["wysiwyg","plugins","tailscan","tailwind"]
image: "https://www.tailscan.com/og.png"
---

> 목록
{: .prompt-tip }

- [SvelteKit Tailwind 튜토리얼 - 1일차](/posts/sveltekit-tailwindcss-day1/) : Tailwind Labs &ndash; [Insta UI](https://www.youtube.com/watch?v=v74SZBVMPa0)
- [SvelteKit Tailwind 튜토리얼 - 2일차](/posts/sveltekit-tailwindcss-day2/) : Plugins &amp; Tools &nbsp; &#10004;

## 0. 개요

- Tailwind 유용한 팁들과 도구들 : 유튜브 참고
  - Tailwind CSS Debug Screens
- [Tailscan](https://tailscan.com/) : TW 도구
  - [크롬 확장프로그램 - Tailscan](https://chromewebstore.google.com/detail/tailscan/ehlgpljoffpijelfiegjpkfanlfhgeae) : 라이센스 필요

## 1. 프로젝트 생성

### [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
bun create svelte@latest bun-tailwind-app
  # - Skeleton project
  # - Typescript
  # - Prettier

cd bun-tailwind-app
bun install

bun run dev
```

### [Tailwind CSS with SvelteKit 설정](https://tailwindcss.com/docs/guides/sveltekit)

1. TailwindCSS, typography, forms, tailwind-merge 설치
2. 한글 폰트, TW 유틸리티, prettier plugins 설치
3. heroicons 설치 (MIT 라이센스), faker-js 설치 (개발용 더미 텍스트)
4. `.prettierrc` 설정
5. `vite.config.ts` 설정 (highlight.js 클래스 제거 방지)
6. `tailwind.config.js` 설정 : 폰트, plugins
7. 폰트 설정 : Noto 한글 + Emoji, D2Coding
5. `app.postcss` 에 Tailwind directives 추가
6. 최상위 `+layout.svelte` 에 전역 css 추가 
7. `+page.svelte` 에 데모 코드를 넣어 daisyUI 작동 확인

```bash
# 수동 설정으로 진행한다
# bunx svelte-add@latest postcss
# bunx svelte-add@latest tailwindcss --tailwindcss-forms --tailwindcss-typography

# tailwind 설치
bun add -d tailwindcss postcss autoprefixer tailwind-merge
bun add -d @tailwindcss/typography @tailwindcss/forms

# tailwind plugins 설치
bun add -d vite-plugin-tailwind-purgecss
bun add -d prettier-plugin-tailwindcss
bun add -d tailwindcss-debug-screens

# utilities 설치 : icons, faker
bun add -d svelte-hero-icons
bun add -d @faker-js/faker

bunx tailwindcss init -p

# prettier 에 tailwind 플러그인 추가
sed -i '' 's/"prettier-plugin-svelte"\]/"prettier-plugin-svelte","prettier-plugin-tailwindcss"\]/' .prettierrc

# purgecss 설정
cat <<EOF > vite.config.ts
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit(),
    purgeCss({ safelist: {greedy: [/^hljs-/] }}),
  ],
  ssr: {
    noExternal: ['svelte-hero-icons'],
  },
});
EOF

# default fonts, typography, forms 설정
cat <<EOF > tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ['"Noto Sans KR"', ...defaultTheme.fontFamily.sans],
      serif: ['"Noto Serif KR"', ...defaultTheme.fontFamily.serif],
      mono: ['D2Coding', ...defaultTheme.fontFamily.mono],
    },      
  },
  plugins: [
    require('@tailwindcss/typography'), 
    require('@tailwindcss/forms'),
    require('tailwindcss-debug-screens'),
  ],
};
EOF

# preload 설정 지우고, debug-screens 설정
sed -i '' 's/data-sveltekit-preload-data="hover"/class="debug-screens"/' src/app.html

# Noto 한글, Emoji 폰트 추가
cat <<EOF > src/app.pcss
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');
@import url("//cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-ligature-full.css");

@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  @apply h-full sm:scroll-smooth;
}
EOF

cat <<EOF > src/routes/+layout.svelte
<script lang="ts">
  import '../app.pcss';
</script>

<slot />
EOF

# tailwind container 데모
cat <<EOF > src/routes/+page.svelte
<script>
  import { Icon, BookOpen } from 'svelte-hero-icons';
  import { faker } from '@faker-js/faker/locale/ko';
</script>

<header class="container px-4 lg:flex mt-10 items-center h-full lg:mt-0">
  <div class="w-full">
    <h1 class="text-4xl lg:text-6xl font-bold">
      Hello,
      <span class="text-green-700">SvelteKit &plus; TailwindCSS</span>
    </h1>
    <div class="w-40 h-2 bg-green-700 my-4"></div>
    <p class="text-xl mb-10">{faker.lorem.paragraph(5)}</p>
    <button class="bg-green-500 hover:bg-green-700 text-white text-2xl font-medium px-4 py-2 rounded shadow inline-flex items-center">
      <Icon src={BookOpen} size="2rem" />
      <span class="ml-2">Learn more</span>
    </button>
  </div>
</header>
EOF

bun run dev
```

### turso `@libsql/client` + drizzle

참고 : [build-a-poll-making-website-using-sveltekit-turso-drizzle](https://blog.turso.tech/build-a-poll-making-website-using-sveltekit-turso-drizzle-and-deploy-it-to-vercel.-2d766286)

- 소스 : [깃허브 - turso-extended/app-at-the-polls](https://github.com/turso-extended/app-at-the-polls)

```bash
# sqlite 파일 DB 생성 (옵션 없으면 메모리 DB)
turso dev --db-file ./files.sqlite
# http://127.0.0.1:8080

# DB 관련 로직은 모두 server 스크립트로 실행해야 함
bun add drizzle-orm @libsql/client
bun add -d drizzle-kit
```


## 2. TailwindCSS 도구들

### [유튜브 - 이전부터 알았더라면 좋았을 Tailwind 팁들](https://www.youtube.com/watch?v=QBajvZaWLXs)

- [Tailwind CSS Cheat Sheet](https://tailwindcomponents.com/cheatsheet/) : 찾아보기 쉬운 css 매핑 사전

#### [Tailwind - Reusing Styles](https://tailwindcss.com/docs/reusing-styles)

- Editor 의 다중선택 기능을 활용하는 방법 (ex: vscode)
- 웹프레임워크의 loop 문법을 활용
- 웹프레임워크의 컴포넌트 기법을 활용
- HTML 에서 공통 스타일을 묶는 구조화도 매우 중요한 문제이다.
- 반복되는 클래스에 대해 일부를 `@apply` 로 사용자화 (지나치면 안됨!)

> 참고 : [VSCode - Multiple selection (multi-cursor)](https://code.visualstudio.com/docs/editor/codebasics#_multiple-selections-multicursor)

- 다음 항목까지 선택 `⌘D`, 모두 수정 `⇧⌘L`
- 멀티라인 선택시 `⌥⌘↓` or `⌥⌘↑`

![vscode - Multiple selection](https://code.visualstudio.com/assets/docs/editor/codebasics/multicursor.gif){: width="560" .w-75}
_vscode - Multiple selection_

#### [Automatic class sorting with Prettier](https://tailwindcss.com/docs/editor-setup#automatic-class-sorting-with-prettier)

클래스 정렬을 통해 충돌과 오류를 더 빨리 발견하고 수정할 수 있다. 무엇보다 클래스의 순서는 스타일 적용의 우선순위와 아무런 관련이 없다. 또, 자동정렬을 설정해 놓으면 복사+붙여넣기를 두려움 없이 할 수 있다는 이점이 있다.

- [prettier-plugin-tailwindcss](https://github.com/tailwindlabs/prettier-plugin-tailwindcss) 설치
- `.prettierrc` 설정
- vscode settings 설정 (중요!)

```jsonc
// settings.json
{
  "[svelte]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
   },
  "prettier.documentSelectors": ["**/*.svelte"]
}
```

> 참고 : [Set Up SvelteKit With Tailwind CSS](https://joyofcode.xyz/sveltekit-with-tailwind-css)

### [유튜브 - 없으면 불편한 Tailwind 도구들](https://www.youtube.com/watch?v=CCgpk64orZo)

> 라이브러리

- [깃허브 - ben-rogerson/twin.macro](https://github.com/ben-rogerson/twin.macro) : tw 클래스를 코드와 분리하는 라이브러리
  - React 등등 에서 유용

> 확장 프로그램

- [vscode extension - Headwind](https://marketplace.visualstudio.com/items?itemName=heybourn.headwind) : 클래스 정렬 (단축키 사용)
- [vscode extension - Tailwind Docs](https://marketplace.visualstudio.com/items?itemName=austenc.tailwind-docs) : 원하는 기능의 Tailwind 문서 페이지를 열어주는 기능
  - 이거보다는 아까 'Tailwind CSS Cheat Sheet'가 유용할듯

> 플러그인

- [깃허브 - tailwindcss-debug-screens](https://github.com/jorenvanhee/tailwindcss-debug-screens) : 반응형 스크린의 현재 사이즈를 하단에 표시
- [깃허브 - tailwindcss-brand-colors](https://github.com/praveenjuge/tailwindcss-brand-colors) : 특정 브랜드의 칼라셋을 사용할 수 있다 (ex: AirBnB)

> 온라인 도구

- [TailBlocks](https://tailblocks.cc/) : 다양한 레이아웃 (코드 복붙)
- [Tailwind Toolbox](https://www.tailwindtoolbox.com/) : 템플릿, 컴포넌트, 리소스
- [Gradient Designer](https://gradient-designer.csspost.com/) : 그라디언트 빌더

#### tailwindcss-debug-screens 설정

```bash
# 설치
bun add -d tailwindcss-debug-screens

# tailwind.config.js 설정
# {
#   plugins: [
#     require('tailwindcss-debug-screens'),
#   ],
# }

# body.class 설정
sed -i '' 's/data-sveltekit-preload-data="hover"/class="debug-screens"/' src/app.html
``` 

![tailwindcss-debug-screens](https://github.com/jorenvanhee/tailwindcss-debug-screens/raw/master/screenshot.png){: width="560" .w-75}
_화면 왼쪽 하단에 스크린 크기가 표시된다_


## 3. [Tailscan](https://tailscan.com/)

Chrome 확장프로그램 [Tailscan](https://chromewebstore.google.com/detail/tailscan/ehlgpljoffpijelfiegjpkfanlfhgeae) 으로 설치하여 사용한다. Tailwind 로 작성된 웹사이트를 보면서 구성을 살피고 즉시 변경해 볼 수 있다.

### [가격](https://tailscan.com/#pricing) 

당장은 공부하는 목적으로 구매하지만, 익숙해지면 필요없을듯 하여 1년만 구매했다.

- 평생 라이센스 $249 (부가가치세 10% 붙이면 35만9천원)
- 연단위 라이센스 $79 (부가가치세 10% 붙이면 11만4천원) &larr; 구매
- 월단위 라이센스 $15 (부가가치세 10% 붙이면 2만1천원)

### 사용법

- 웹브라우저 : 마우스 오른쪽 팝업메뉴에서 tailscan 선택
- 맥OS : Command + Shift + Z
- 윈도우OS : Control + Shift + Z  

![tailscan-usage-example](/2023/12/01-tailscan-usage-example.png){: width="560" .w-75}
_tailscan-usage-example_

## 9. Review

- tailscan 을 1년간만 구독하기로 했다.
- [shuffle](https://shuffle.dev/) 은 다음 포스트에서 작성하자.
  - tailscan 를 써서 코드를 가져다 쓸 수 있을지 테스트 해보자.

- 유용한 팁들은 다음 포스트에서도 작성해보자. (찾아보면 많다)
  - [유튜브 - Advanced TailwindCSS Techniques You Have To Know?!](https://www.youtube.com/watch?v=LHYqKEtD-Co)

- 따라 하려다가 다음으로 미룬다.
  - [유튜브 - Upload, Store and Retrieve Images in SvelteKit (with SQLite)](https://www.youtube.com/watch?v=OLg6RwESnSo)
  - [유튜브 - How I Changed my App's Routing for the Better](https://www.youtube.com/watch?v=oyVZ3M5K1hs)

### [Chrome 확장프로그램 - Youtube ChatGPT](https://chromewebstore.google.com/detail/youtube-chatgpt-%EC%B1%84%ED%8C%85gpt%EB%A5%BC-%EC%82%AC%EC%9A%A9/baecjmoceaobpnffgnlkloccenkoibbb)

외국 형님들의 유튜브 방송을 자주 보다보니 답답해서 Script 를 추출해주는 프로그램을 찾다가 발견한 프로그램이다. 주요 키워드를 빨리 발견하여 찾아볼 수 있다는 점만으로도 유용하다. 말이 많은 한글 방송도 제법 잘 요약해준다.

- 한글 출력을 설정하고, OpenAI 의 GPT4 APIKey(유료) 를 저장해 두면
- 유튜브 동영상의 스크립트를 추출하고 전체 내용을 한글로 요약해서 출력해 준다.
  - 영어 자막 자동생성의 경우도 시간별로 출력되고, AI 요약 버튼도 달려있다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
