---
date: 2023-11-30 00:00:00 +0900
title: Svelte Component 라이브러리 - 6일차
description: 원하는 UI 구성을 위해 유틸리티 CSS 라이브러리인 Open Props 공부합니다. 웹프레임워크로 SveltKit 을 사용하고 bun 런타임 위에서 실행합니다.
categories: [Frontend, Svelte]
tags: ["open-props","postcss"]
image: "https://repository-images.githubusercontent.com/402643958/641eff02-6323-4414-8f16-a579dd497e0f"
---

> 목록
{: .prompt-tip }

- [Svelte Component 라이브러리 - 1일차](/posts/svelte-components-tutorial-day1/) : Steeze UI
- [Svelte Component 라이브러리 - 2일차](/posts/svelte-components-tutorial-day2/) : Flowbite Svelte
- [Svelte Component 라이브러리 - 3일차](/posts/svelte-components-tutorial-day3/) : Flowbite Blocks
- [Svelte Component 라이브러리 - 4일차](/posts/svelte-components-tutorial-day4/) : daisyUI Svelte
- [Svelte Component 라이브러리 - 5일차](/posts/svelte-components-tutorial-day5/) : Skeleton
- [Svelte Component 라이브러리 - 6일차](/posts/svelte-components-tutorial-day6/) : Open Props &nbsp; &#10004;

svelte-components 시리즈는 여기까지만 한다. 본래 컴포넌트 만드는 연습을 하기 위해 작성하기 시작한 것인데, css 프레임워크를 한번씩 살펴보는 시리즈가 되어 버렸다. (실패다) 여러 기술들을 살펴보는 것은 좋으나, 깊이 없이 기웃거리기만 하고 있으니 실망스럽다. 어느 분야이든 깊이 파고든다는 것은 중요하다. 기웃거리더라도 넘치면 지식이 된다는데, 그런 방식으로는 굳건한 줄기를 만드는데 너무 많은 시간이 걸릴 것이다. 효율적으로 공부하자.

## 0. 개요

- [x] Bun 1.0.10 + SvelteKit 1.20.4
- [x] postcss 8.4.24 + [Open Props](https://open-props.style/#getting-started) 1.6.13
  - [postcss-preset-env](https://github.com/csstools/postcss-plugins)
  - postcss-jit-props
- [x] Etc
  - heroicons

> tailwindcss 는 백엔드 개발자들이 선호하고, open-props 는 프론트엔드 개발자들이 선호하는 경향이 있다고 한다. (순수한 css 이기 때문에)

참고 : [유튜브 - Open Props - CSS Framework](https://www.youtube.com/watch?v=BuRAvafvGTA&t=37s)

> open-props 사용을 위한 vscode extension 추천 (자동완성)

[CSS Variable Autocomplete](https://marketplace.visualstudio.com/items?itemName=vunguyentuan.vscode-css-variables)

## 1. 프로젝트 생성

### 1) [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
bun create svelte@latest bun-openprops-app
  # - Skeleton project
  # - Typescript

cd bun-openprops-app
bun install

bun run dev
```

### 2) [Open Props 설정](https://open-props.style/#getting-started) 

1. postcss 설치 및 구성 (svelte-add)
2. postcss-preset-env (autoprefixer, nested 포함)
3. open-props, postcss-jit-props 설치
4. heroicon 설치
5. `postcss.config.cjs ` 설정 (autoprefixer 제거할것)
6. `src/app.pcss` 에 open-props 와 font 임포트
7. `+layout.svelte` 에 app.pcss 참조 (이미 되어있음)
8. `+page.svelte` 에 데모 코드를 넣어 작동 확인

```bash
bunx svelte-add@latest postcss
bun add -d postcss-preset-env
bun add -d open-props postcss-jit-props
bun add -d svelte-hero-icons

# postcss 는 CommonJS 확장자를 필요로 한다!
cat <<EOF > postcss.config.cjs 
const postcssPresetEnv = require('postcss-preset-env');
const postcssJitProps = require('postcss-jit-props');
const openProps = require('open-props');

module.exports = {
  plugins: [
    postcssJitProps(openProps),
    postcssPresetEnv({
      features: {
        'nesting-rules': {
          noIsPseudoSelector: false
        }
      }
    })
  ]
};
EOF

# 전역 css 에 directives 와 noto 폰트 설정
cat <<EOF > src/app.pcss
/* fonts: Noto Color Emoji, Noto Sans KR, Noto Serif KR */
@import url('https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;700&display=swap');
@import url("//cdn.jsdelivr.net/gh/wan2land/d2coding/d2coding-ligature-full.css");

/* the props */
@import 'open-props/postcss/style';

/* optional imports that use the props */
@import 'open-props/postcss/normalize';
@import 'open-props/postcss/buttons';

/* Reset */
*,
*::before,
*::after {
  padding: var(--size-fluid-0);
  margin: var(--size-fluid-0);
  box-sizing: border-box;
  font-family: 'Noto Sans KR', var(--font-sans);
}
EOF

cat <<EOF > src/routes/+layout.svelte
<script>
  import '../app.pcss';
</script>

<slot />
EOF

cat <<EOF > src/routes/+page.svelte
<script>
  import { Icon, Radio } from 'svelte-hero-icons';
</script>

<section>
  <h1>Welcome to SvelteKit</h1>
  <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
  <button class="btn-custom">
    <Icon src={Radio} size="1rem" />
    Icon
  </button>
</section>

<style lang="pcss">
  :global(body) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--size-5);
    padding: var(--size-5);
  }

  section {
    display: grid;
    gap: var(--size-2); /* .5rem */
    text-align: center;

    & > p {
      font-size: var(--font-size-4); /* 1.5rem */
    }
  }

  .btn-custom {
    --_bg: linear-gradient(var(--indigo-5), var(--indigo-7));
    --_border: var(--indigo-6);
    --_text: var(--indigo-0);
    --_ink-shadow: 0 1px 0 var(--indigo-9);
    --_size: var(--font-size-3);
    padding-block: var(--size-2);
  }
</style>
EOF

bun run dev
```

> open-props 개별적인 import 항목들 (선택사항)

```css
/* individual imports */
@import 'open-props/postcss/indigo';
@import 'open-props/postcss/easings';
@import 'open-props/postcss/animations';
@import 'open-props/postcss/sizes';
@import 'open-props/postcss/gradients';
/* see PropPacks for the full list */
```

## 9. Review

- 검색을 해봐도 `open props` 예제를 찾기 어렵다. 순수 CSS 에 능숙한 이들만 쓴다.
  - tailwind 는 프로토타입 개발에 유용하지만, 작성한 코드를 다시 보기 싫다는데
  - 그렇다 하더라도 빠른 개발과 수정에는 tailwind 가 효과적이란 의견이 다수이다.
- postcss 를 어떻게 써야할지 고민하지 말고 `postcss-preset-env` 쓰자.
  - nesting 보다는 css 작성의 효율성을 높이는 함수 사용에 신경쓰자.
  - [tailwind 는 postcss 플러그인이라서 다른 전처리기를 사용할 필요가 없다.](https://tailwindcss.com/docs/using-with-preprocessors)

### [트렌드 - postcss nesting 플러그인 3종 비교](https://npmtrends.com/postcss-nested-vs-postcss-nesting-vs-postcss-preset-env)

비등한데, 최근에 단촐하게 postcss-nested 플러그인만 사용하는 경향이 많아졌다.

> 참고 : [Nesting in PostCSS — Which Way to Go?](https://chriscoyier.net/2023/03/02/nesting-in-postcss-which-way-to-go/)

- postcss-nesting : CSS 스펙 스타일
- postcss-nested : Sass 스타일
  - nest 기능 외에는 관심이 없다는 사용자는 이것만 설치하는 경향이 있다.
- postcss-preset-env &larr; 저자가 추천하는 플러그인? (일반적인 선택)
  - git 리포지토리 이름은 `postcss-plugins` 이다. (커밋은 활발)
  - 흔히 사용되는 설정들을 다 포함한다. (autoprefixer, nested 포함)
  - css 스펙과 동떨어지는 경향도 없지 않지만 쉬운 css 사용을 위해 노력한다고 소개글에 적혀있다. 
  - [rgb, color 등등 다양한 함수를 지원하고 있다.](https://preset-env.cssdb.org/features/)

> 참고 : [tailwind 의 postcss 플러그인 사용 예시](https://tailwindcss.com/docs/using-with-preprocessors)

```bash
bun add -d postcss-import
bun add -d postcss-preset-env
```

```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    'postcss-preset-env': {
      features: { 'nesting-rules': false },
    },
  }
}
```


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
