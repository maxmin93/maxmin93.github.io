---
date: 2022-11-21 00:00:00 +0900
title: React 공부하기 - 1일차
description: 프론트엔드 개발시 View 구현의 필수 재료인 React 에 대해 공부한다. Nextjs/Gatsby, WebComponent 연계 (1일차)
categories: [Frontend]
tags: [1st-day, react]
image: "https://ko.react.dev/images/uwu.png"
---

> 목록
{: .prompt-tip }

- [React 공부하기 - 1일차](/posts/react-tutorial-day1/) &nbsp; &#10004;


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

```shell
$ npm uninstall -g create-react-app
# 또는 yarn global remove create-react-app

$ npx create-react-app my-app
Need to install the following packages:
  create-react-app@5.0.1
Ok to proceed? (y)
```

#### [create-react-app](https://create-react-app.dev/docs/getting-started#quick-start) 으로 새 프로젝트 생성

```shell
# npx 로 프로젝트 생성
npx create-react-app hello-react

# 또는 yarn 으로 생성
yarn create react-app hello-react

cd hello-react
yarn && yarn run start
```

![create-react-app files](/2022/11/21-react-package-json-crunch.png){: width="540" .w-75}

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

## 2. React Tutorial : [Square Board Game (TicTacTok)](https://reactjs.org/tutorial/tutorial.html#inspecting-the-starter-code)

보드게임 튜토리얼을 Functional Component(함수형 컴포넌트)로 구현

- 공식문서에는 클래스형 컴포넌트로 설명하고 있음
- 깃허브 또는 검색 결과에는 Board 컴포넌트가 클래스형으로 기술된 것들뿐
- 소스 : [깃허브/react-square-board-game](https://github.com/maxmin93/react-square-board-game) 

### 1) 파일 구성

- `board-game`
  - package.json
  - public
    - index.html : `<div id="root"></div>` 포함
    - favicon.ico 등.. assets 파일들
  - src
    - index.js : `#root` 에 ReactDOM 생성 (건드릴 부분 없음)
    - index.css : 전체에 영향을 미치는 스타일 정의
    - App.js : root 컴포넌트
    - App.css : root 컴포넌트를 위한 스타일 정의
    - Game.js : v2 에서 사용되는 게임 상태 클래스를 정의

### 2) 컴포넌트 구성

#### App (Game) 컴포넌트

- 보드의 상태 정보를 생성하고 관리
- 현재 상태 또는 종료시 승리자를 출력

#### Board 컴포넌트

- 플레이어의 클릭 이벤트와 차례를 제어
- 이미 마킹된 경우 변경 없음

#### Square 컴포넌트

- 최초 상태는 공백
- 클릭된 경우 마킹된 표식을 출력 (X 또는 O)

### 3) 로직

#### 전체 흐름

1. 최초 X 플레이어부터 시작 (다음은 O 플레이어)
2. 9개의 셀에 중에 임의의 위치를 클릭하여 자신의 표식을 마킹
3. 이미 마킹된 셀의 표식은 변경할 수 없음
4. 9개의 셀이 모두 마킹되면, 승리자를 계산
5. 승리자를 게임 정보에 출력

#### Winner 판정 : checkWinner 함수

승리하는 모든 경우의 조합 8가지에 대해, 동일한 player 마킹이 있는지 확인

### 3) 구현 버전

#### 버전1) Board 에 게임 상태가 저장되는 형태

함수형 컴포넌트가 제각각 출력할 항목과 상태를 관리하는 형태

> 게임의 상태값과 변경 로직이 흩어져 있는 형태. 헷갈린다.

- Board 의 상태값으로 Square 마킹 출력
- Board 에서 onClick 함수로 게임의 상태 변경을 처리
- App 에서는 info 출력만 관리

![TicTacToe ver1 Capture](https://github.com/maxmin93/react-square-board-game/raw/main/assets/react-tictactoe-ver1.png){: width="600" .w-75}

#### 버전2) Game 클래스에 게임 상태가 저장되는 형태

흩어진 상태값과 로직을 모두 모아서 Game 클래스로 구성

> 리액트 컴포넌트는 렌더링에만 집중하도록 하여 코드가 단순해졌다.

- Game Class 에서 모든 상태값을 관리
  - Game 인스턴스는 index.js 에서 생성하고 App 컴포넌트에 전달
- App 에서는 Game 의 상태 변경(handleClick)에 대한 로직만 처리
- Board 는 Square 의 위치 바인딩과 함수 전달자 역활만 수행
  - onClick 함수의 파라미터 i 값을 바인딩

![TicTacToe ver2 Capture](https://github.com/maxmin93/react-square-board-game/raw/main/assets/react-tictactoe-ver2.png){: width="600" .w-75}

#### 버전3) History 이용해 이전 스텝으로 이동하는 기능 추가

스텝 버튼 생성을 위한 문자열은 컴포넌트 내에서 생성해야 함

- Game 클래스에서 label 문자열을 만들어 태그를 생성하는데 실패
- 렌더링 되는 대상은 컴포넌트에서 생성되도록 하는게 옳다
  + key 를 부여해도 `li` 가 최종 label 하나만 생성됨

![TicTacToe ver3 Capture](https://github.com/maxmin93/react-square-board-game/raw/main/assets/react-tictactoe-ver3-signed.png){: width="600" .w-75}

### 4) 핵심 포인트

#### [React Without JSX](https://reactjs.org/docs/react-without-jsx.html)

확장명을 JSX 로 설정할 필요가 없다. JS 가 더 편리해졌음.

```js
// index.js
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App game={new Game()} />
  </React.StrictMode>
);
```

#### 함수형 컴포넌트 스타일

- 클래스형 컴포넌트보다 코드가 적어지고 단순해진다.
- 대신 Hook 함수를 적절히 잘 써야함
- 함수형 컴포넌트의 파라미터는 `props` 로 묶어서 처리하기도 한다.

#### useState

- 변수와 변경함수가 셋트로 정의된다.
- 컴포넌트가 useState 를 사용하면, 변경에 대한 관리도 컴포넌트 내부에서 해야 함

#### useEffect

- useEffect 는 두번식 호출되는 경우가 잦다. (마운트, 언마운트)
  - 이 Hook 함수로 누적 카운팅 같은 작업은 하지 말것!

## 9. Review

- React 는 정말 렌더링만 처리한다.
- DOM 계층이 깊어지거나 복잡해지면 데이터와 로직 관리가 어려울듯
  + 상태관리 라이브러리가 필수! 
  + [Recoil](https://recoiljs.org/docs/introduction/getting-started) 을 공부해보자!

- 아직도 밝히지 못한 신비로움이 있다. 분발하자.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

