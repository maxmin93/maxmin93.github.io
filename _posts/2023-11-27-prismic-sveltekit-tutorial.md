---
date: 2023-11-27 00:00:00 +0900
title: primic.io - SvelteKit Tutorial
description: prismic.io 헤드레스 CMS 를 소개하는 Youtube 동영상이 있어서 따라해 보았습니다. slice machine 이라는 프리뷰 도구가 페이지 개발을 돕는 특징이 있습니다. (UI를 배치하며 꾸미는 WYSIWYG 방식은 아님)
categories: [Frontend, Svelte]
tags: ["primic","cms","slicemachine"]
image: "https://mma.prnewswire.com/media/1519349/prismic_logo_Logo.jpg?w=200"
---

## 0. 개요

- [x] node 18.18.2 + SvelteKit
- [x] prismic.io 
  - @slicemachine/adapter-sveltekit 0.3.27
  - @sveltejs/kit 1.27.1
- [x] Etc
  - open-props 1.6.13

> 출처

- [유튜브 - SvelteKit Crash Course: Build a Full Website in 90 min! - 2023 Tutorial](https://www.youtube.com/watch?v=QKxJW6VVp6w)
- [깃허브 - samlfair/sveltekit-tutorial-fall-2023](https://github.com/samlfair/sveltekit-tutorial-fall-2023)

## 1. 프로젝트 생성

### [prismic.io](https://prismic.io/) 프로젝트 생성

- 페이지에서 free(1 user) 버전 선택
- sveltekit 프로젝트 선택
- 설치 명령어 복사 후 터미널에 입력 (로그인이 오래 걸림)
- Slice Machine 기동 후, 브라우저로 `http://localhost:9999` 열기
  - `npm run dev` 실행시 함께 기동된다. 
  - vite server 5173 포트와 slice machine 9999 포트가 사용된다.

```bash
npx @slicemachine/init@latest --repository tonyne-blog --starter sveltekit-starter-prismic-minimal

Need to install the following packages:
@slicemachine/init@2.9.5
Ok to proceed? (y) y

 Slice Machine  → Initializing

✔ Starter copied

ℹ We collect telemetry data to improve user experience.
  Learn more: https://prismic.dev/slice-machine/telemetry

✔ Detected framework SvelteKit and package manager npm
✔ Began core dependencies installation with npm ... (running in background)
✔ Selected repository tonyne-blog (flag repository used)
✔ Installed core dependencies with npm
✔ Updated Slice Machine configuration and loaded adapter
✔ Logged in as maxmin93@gmail.com
✔ Synced data with Prismic
✔ Initialized project (patched package.json scripts)
✔ Initialized adapter

 Slice Machine  → Initialization successful!

Continue with next steps in Slice Machine.

? Run Slice Machine (npm run slicemachine)? › No
```

> 이것으로 개발환경 셋팅은 끝! 이후에는 페이지 빌더와 코딩으로 진행된다.

## 2. Page 빌더

동영상은 첫 페이지에 여러 slice 들을 나열해 놓은 데모 웹사이트를 개발하고 있다. 각 slice 에는 출력될 field 들을 가지고 있고, 여기에 데이터를 맵핑시키는 방법으로 페이지를 쉽게 만들 수 있음을 설명하고 있다.

- `Page types > Page` 이동

![prismic-pagebuilder-slices](/2023/11/27-prismic-pagebuilder-slices.png){: width="560" .w-75}
_prismic-pagebuilder-slices_

### Slices 만들기

1. `Add slice` 버튼 클릭
2. slice 이름 입력 후, 출력될 field 들을 추가
3. simulator 에서 비주얼로 편집하며 mockup 데이터를 작성
4. 디자인은 style 에서 직접 코딩
5. 변경사항을 코드와 mockups.json, model.json 으로 push

#### HeroText 컴포넌트

- 고정 구역 fields
  - Title : Rich Text 타입, h1
  - Subtitle : Rich Text 타입, p

#### ContactForm 컴포넌트

- 고정 구역 fields
  - Heading : Rich Text 타입, h2
  - Description : Rich Text 타입, p

#### CardList 컴포넌트

- 고정 구역 fields
  - Heading : Rich Text 타입, h2
- 반복 구역 fields
  - Title : Rich Text 타입, h3
  - Description : Rich Text 타입, p
  - Image : Image 타입, auto(Responsive views)
  - Name : Key Text 타입

### Custom types

#### Nav (Single 타입)

- Links : Group 타입
  - Link : Link 타입
  - Label : Key Text 타입

![prismic-pagebuilder-custom](/2023/11/27-prismic-pagebuilder-custom.png){: width="560" .w-75}
_prismic-pagebuilder-custom_

## 9. Review

- 따라하다 보니 기존의 리포트 저작도구와 다를바가 없다.
  - 정적 페이지를 만들 때 조금은 도움이 될지 모르겠지만,
  - 급 실망해서 깃허브 코드 실행해보고 접었다.
- 생성형 AI로 HTML 코드를 자동 생성하는 도구들을 찾아봐야겠다.
  - [Framer](https://www.framer.com/) : 2D 웹페이지 저작도구, SaaS 퍼블리싱, ChatGPT 자동생성, 템플릿 제공
    - 랜딩 페이지 만들기가 무척 쉽고, 마우스로 UI를 조작할 수 있다.
    - Figma 와의 결합이 잘 되어 있어서, 디자이너가 직접 개발도 할 수 있다.
    - 자체 CMS 를 제공하고, 외부 API 호출 코드를 끼워넣을 수 있다.
    - 중소업체, 자영업 등의 브랜드, 마케팅 목적을 모두 충족시킬 수 있다.    
  - [Dora](https://www.dora.run/) : 3D 웹페이지 저작도구, SaaS 퍼블리싱, ChatGPT 자동생성
    - 최신 스타일의 움직이는 웹페이지 개발이 가능하다. (꽤 멋지다)

> Framer 는 [외부로 HTML 을 내보낼 수는 없다.](https://www.framer.community/c/faq/can-i-export-my-website-to-html) (Dora 도 마찬가지)

소스 보기를 하면 대충 살펴볼 수는 있지만, 가져다 쓰기는 불가능하다. hidden 처리를 해 놓아서 코드를 복사해도 출력되지 않는다. (react 코드로 스타일을 변경시키는듯 하다)

```html
<body class="framer-body-XXXXXXXX">
  <script async="" src="https://events.framer.com/script" data-fid="4474e4946cd529b8de3d91dfabb53e46fa6be7570749b7118f8bbd97b9c0f0e0"></script>  
  <!-- End of bodyStart -->
  <div id="main" 
    data-framer-hydrate-v2="{&quot;routeId&quot;:&quot;XXXXXXXX&quot;,&quot;localizationId&quot;:&quot;default&quot;,&quot;localeId&quot;:&quot;default&quot;}"
    data-framer-ssr-released-at="2023-11-07T11:04:20.666Z" 
    data-framer-page-optimized-at="2023-11-28T06:38:26.560Z"
    >
    <!--$-->
    <div class="framer-dT8nf framer-7lfvm framer-uB14M framer-DV2gX" style="display:contents">
      <!-- (생략) -->
    </div>
    <!--/$-->
  </div>
  <div id="svg-templates" style="position: absolute; overflow: hidden; top: 0; left: 0; width: 0; height: 0">
  </div>
  <div id="__framer-badge-container"></div>
  <script>"use strict";var animator=(()=>{
      // (생략)
    })();
  </script>
  <script data-framer-appear-animation="no-preference">
    requestAnimationFrame(() => {
      // (생략)
    })
  </script>
  <script type="module" data-framer-bundle="" src="https://framerusercontent.com/sites/ZpwiLRpByJXdoGtj2f7te/preview_script0.KUDGNH4S.mjs"></script>  
  <!-- End of bodyEnd -->
</body>
```

### ChatGPT4 로 텍스트 떨어뜨리는 HTML 코드 생성시키기

블로그 글 분량이 적어서 짜투리로 ChatGPT4 로 텍스트 떨어지는 효과를 HTML&JS 로 코딩하도록 시켜본 내용을 추가한다.  

[유튜브 동영상](https://www.youtube.com/watch?v=cqKAPq4rZJs) 을 보면서 스크립트를 따라하며 계속 명령을 추가해 보았는데, 얼추 비슷하게 작동하는 코드를 얻어내는데 성공했다.

아쉬운 점은 기능적으로는 비슷한데, 디자인도 잘 해주면 좋겠다. (그냥 다 짜주면 좋겠다)

> 나의 스크립트

```text
> can you write a code text falling down from the top?
  ==> java 코드를 출력함 

> javascript 와 html 로 작성해줘. 떨어지는 텍스트는 임의의 텍스트를 생성해서 출력해줘.
  ==> 텍스트 한개만 출력함. style 의 yPosition 을 이용.

> css 의 transform 을 사용해서 text 가 떨어지도록 만들어줘. 텍스트는 settimeout 으로 계속 떨어지도록 코드를 생성해줘.
  ==> 텍스트 한개만 출력함

> 랜덤 텍스트 5개를 모두 동시에 떨어지도록 코드를 작성해줘.
  ==> for 문으로 createFallingText() 함수를 호출

> 임의의 텍스트 5개가 동시가 아니라 순차적으로 임의의 시간 간격을 두고 떨어지도록 코드를 수정해줘.
  ==> for 문 안에 setTimeout 과 delay 로 createFallingText() 함수를 호출

> fallingArea 라는 id 를 가진 div 안에서만 텍스트가 떨어지도록 코드를 수정해줘.
  ==> div 를 getElementById 로 찾은 다음 appendChild 를 수행
```

> ChatGPT4 가 생성한 코드

```html
<!DOCTYPE html>
<html>
<head>
    <title>지정된 영역 내에서 떨어지는 텍스트</title>
    <style>
        #fallingArea {
            position: relative;
            width: 100%;
            height: 100vh; /* 전체 화면 높이 */
            overflow: hidden; /* 영역 밖의 텍스트 숨김 */
        }

        .fallingText {
            position: absolute;
            font-size: 24px;
            animation: fall 5s linear;
        }

        @keyframes fall {
            from { transform: translateY(-100px); }
            to { transform: translateY(100vh); }
        }
    </style>
</head>
<body>
    <div id="fallingArea"></div>
    <script src="fallingText.js"></script>
</body>
</html>
```

```js
function generateRandomText() {
    const words = ["안녕하세요", "제주", "여행", "환영합니다", "즐거운", "시간"];
    return words[Math.floor(Math.random() * words.length)];
}

function createFallingText(index) {
    const fallingArea = document.getElementById('fallingArea');
    const textElement = document.createElement('div');
    textElement.classList.add('fallingText');
    textElement.textContent = generateRandomText();
    textElement.style.left = `${(index * 20) % 100}%`; // 각 텍스트의 위치를 다르게 설정
    fallingArea.appendChild(textElement);

    // 텍스트가 떨어지는 시간이 지나면 제거
    setTimeout(() => {
        fallingArea.removeChild(textElement);
    }, 5000);
}

// 5개의 텍스트가 서로 다른 시간에 떨어지도록 설정
for (let i = 0; i < 5; i++) {
    // 랜덤한 지연 시간 (0~2000 밀리초)
    const delay = Math.random() * 2000; 
    setTimeout(() => createFallingText(i), delay);
}
```

> Svelte 페이지에서 구동하려면

- 스타일을 전역 css 파일에 작성하고
- js 스크립트는 onMount 함수 내에서 실행하도록 하면 된다.

### [Svelte 로 Snowfall 효과 만들기](https://mannes.tech/svelte-snowfall/)

Svelte 에서는 텍스트 떨어지는 효과를 어떻게 하는지 검색하다가 나온 예제를 추가한다.

- Svelte 의 [Snowfall - live code](https://svelte.dev/repl/3fe590584ad348cebd053e3f1c4f1b0e?version=4.2.7)

![svelte-animation-snowball](https://mannes.tech/assets/static/snowfall_animationframe_small.e6cf399.87b36ac7443fcc935719de5814200057.gif){: width="560" .w-75}
_svelte-animation-snowball_

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
