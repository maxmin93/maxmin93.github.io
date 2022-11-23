---
date: 2022-11-21 00:00:00 +0000
title: React 공부하기 - 1일차
categories: ["nodejs","react"]
tags: ["book","tutorial","1st-day"]
image: "https://assets.stickpng.com/images/584830e8cef1014c0b5e4aa0.png"
hidden: true
---

> 프론트엔드 개발시 View 구현의 필수 재료인 React 에 대해 공부한다. Nextjs/Gatsby, WebComponent 연계 (1일차)
{: .prompt-tip }

- 1일차 [React 공부하기 - 1일차](/posts/2022-11-21-react-tutorial-day1/)


## 1. [React 공식 문서](https://reactjs.org/docs/getting-started.html)

> React is a JavaScript library for building user interfaces.

- React 는 웹프레임워크가 아니다. UI 전용 라이브러리이다.
  + 다른 기술 스택에 대한 제한이 없다. 함께 써라!
- 현재 최신 버전은 [v18.2.0](https://github.com/facebook/react/releases) 이다.

### 1) [Try React](https://reactjs.org/docs/getting-started.html#try-react)

#### Online Playgrounds - Hello World template

아래 링크를 이용해 간단히 React 를 프로그래밍 해 볼 수 있다.

- [CodePen](https://reactjs.org/redirect-to-codepen/hello-world)
- [CodeSandbox](https://codesandbox.io/s/new)
- [Stackblitz](https://stackblitz.com/fork/react)
- [download this HTML file](https://raw.githubusercontent.com/reactjs/reactjs.org/main/static/html/single-file-example.html)

### 2) [HTML 에 React 붙이기 - 1분 완성](https://reactjs.org/docs/add-react-to-a-website.html#add-react-in-one-minute)

기존 HTML 에 React CDN 을 추가하고, JS 파일로 React 컴포넌트를 붙일 수 있다.

- 기존 HTML 에 React 라이브러리와 컴포넌트 JS 추가
  - react 와 react-dom 필요

```html
<!-- ... existing HTML ... -->
<div id="like_button_container"></div>
<!-- ... existing HTML ... -->

<!-- Note: 배포할 때는 "development.js" 대신에 "production.min.js" 을 사용할 것. -->
<script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>

<!-- 추가할 React 컴포넌트 (혹은 외부 컴포넌트) -->
<script src="like_button.js"></script>
```

- 추가할 컴포넌트 JS (클래스 형식으로 정의된 컴포넌트)
  - 버튼이 추가되고, 클릭시 "You liked this." 문장이 나타남

```js
'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    // React.createElement 생성
    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}
```

### 3) React CLI `create-react-app` 활용

#### [create-react-app](https://www.npmjs.com/package/create-react-app) global 삭제

항상 최신 버전을 사용하고 싶다면 [global 설치를 하지 말것!](https://github.com/facebook/create-react-app#quick-overview)

- npx 가 알아서 최신 버전을 찾아 설치한다.

```bash
$ npm uninstall -g create-react-app
# 또는 yarn global remove create-react-app

$ npx create-react-app my-app
Need to install the following packages:
  create-react-app@5.0.1
Ok to proceed? (y)
```

#### [create-react-app](https://create-react-app.dev/docs/getting-started#quick-start) 으로 새 프로젝트 생성

```bash
npx create-react-app hello-react
cd hello-react
yarn && yarn run start
```

![create-react-app files](/2022/11/21-react-package-json-crunch.png){: width="540"}

- react, react-dom 필수 라이브러리 설치
- react-script 설치 => `create-react-app`
- web-vitals 설치 : 크롬 브라우져 자동 launch 
  + index.js 에 `reportWebVitals();` 추가

### 4) [Next.js](https://nextjs.org/), [Gatsby](https://www.gatsbyjs.org/) 에서 사용한다

React 는 단지 View 를 전문적으로 다루는 라이브러리임을 잊지 말자.

- `Next.js`, `Gatsby` 는 정적, 서버 렌더링 프레임워크
  + React 를 사용하여 페이지를 생성한다.
  + Routing 방식은 각기 다르다.
    * Gatsby 는 Jekyll 처럼 파일 경로와 이름에 매칭

### 1) [Try React]()


## 5.

## 9. Summary

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

