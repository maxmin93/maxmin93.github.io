---
date: 2022-09-10 00:00:00 +0900
title: (펌) 프론트엔드 개발 트렌드 - MVI 패턴
description: 위시켓 요즘IT에 프론트엔드 개발에 관한 좋은 글이 올라와서 스크랩 해둡니다.
categories: [Frontend]
tags: [trends, mvi, cqrs]
image: "https://yozm.wishket.com/media/news/1663/image025.png"
---

출처: [프론트엔드 아키텍처의 가장 최근 트렌드는?](https://yozm.wishket.com/magazine/detail/1663/)

- 글쓴이: [테오의 프론트엔드](https://velog.io/@teo/MVI-Architecture) 

아래 모든 내용은 위 글에서 요약하여 가져왔습니다. (글쓴이에게 감사)


## 1. 프론트엔드 아키텍처 변화

> MVC -> MVP -> MVVM -> MVI 아키텍처

### 1) 프론트엔드 트렌드 변천사 8줄 요약

1. HTML, CSS, JS 의 탄생: 관심의 분리와 느슨한 결합<br/>
  - 서버가 View 를 전달

2. jQuery 까지의 시대: 일단 DOM 을 쉽게 쓰자<br/>
  - Ajax 의 탄생, 데이터 교환 (API)

3. HTML + JS 를 합치는게 더 낫던데?: MVC 컴포넌트 방식의 탄생<br/>
  - 컴포넌트(HTML+JS) 단위로 View, Model 관리, ex) backbone.js

4. 선언적으로 만들자: 데이터 바인딩 + 템플릿 = MVVM 웹프레임워크 전국시대<br/>
  - 템플릿 방식으로 HTML 작성 자동화, ex) Angular, Vue, React, ...

5. 컴포넌트간 데이터 교환이 너무 복잡해: Container - Presenter 방식<br/>
  - 상태관리 로직이 흩어지고 컴포넌트가 복잡해짐, 재사용성도 떨어짐
  - 컴포넌트를 나누자!
    + readonly 스타일의 'Present 타입 컴포넌트'
    + 데이터 조작을 주로 다루는 'Container 타입 컴포넌트'
  - Container => (props) => Presenters (View, 재사용성)
    + 최상위에 Application State (API)
    + Service 컴포넌트가 로직을 담고, View 컴포넌트는 상태변화를 관리
    + View 컴포넌트는 (조립된) 여러 하위 readonly 컴포넌트로 구성
 
6. Props Drill 문제 어떻게 할거야?: FLUX 와 Redux<br/>
  - 하위 컴포넌트까지의 props(상태값 묶음) 전달 경로가 길어짐
    + 페이스북 FLUX 아키텍처 고안: 단방향 데이터 흐름 (로직 단순화)
  - FLUX 구현체로 상태관리 패턴과 라이브러리 등장
    + React: [Redux](https://redux.js.org/)
    + Vue: [Vuex](https://vuex.vuejs.org/)
    + Angular: [ngrx](https://ngrx.io/), [ngxs](https://www.ngxs.io/)

7. 너무 복잡한데?: hooks 와 context, Recoil, Zustand, jotai<br/>
  - 더 간결한 문법과 외부 비즈니스 로직과의 쉬운 연동 필요
    + [Recoil](https://recoiljs.org/): 전역객체(Atom)로 상태 저장과 변경감지로 데이터 전달
    + 그 밖에 Zustands, Jotai 등 ...

8. 어차피 대부분 서버 API 를 관리하려고 쓰는거 아니야?<br/>
  - API 를 통한 전역 상태관리로 View 컴포넌트에 바로 전달
    + Composition API (Vue 3.0), Valtio (React), Hookstate 등 ...

### 2) 프론트엔드 상태관리의 변화 3줄 요약

1. 컴포넌트의 계층구조가 데이터의 계층구조와 다르고 더 복잡해짐 <br/>
  => 컴포넌트 간 데이터 교환이 어려워짐
2. 컴포넌트와 비즈니스 로직의 분리<br/>
  => 상태관리의 등장
3. 상태관리의 3가지 방향성
  1. 고도화된 상태관리
  2. 간단한 전역 스토어
  3. 서버(API) 기반 상태관리

## 2. MVI 패턴 (MVVM 이후)

### 1) 특징

- 앱 전체, 컴포넌트 전체에 적용되는 패턴이라는 점에서 큰 변화점
- 데이터가 단방향으로 연결되고 전역적으로 구성됨
  + 컴포넌트 계층구조를 따라 전달하지 않음 => 일관성 있는 상태관리

![MVI cyclic flow representation](https://yozm.wishket.com/media/news/1663/image025.png){: width="560" .w-75}
_&lt;그림&gt; MVI cyclic flow representation - 테오의 프론트엔드_

### 2) 아키텍처 방향성

- 비즈니스 로직을 분리
  + Model: 데이터를 관장
  + Intent: 사용자 행동을 데이터 변화로 매핑
- Model 도 분리
  + 변화를 감지하고 변경사항을 전파하는 영역
  + 데이터를 변화하는 로직 (Command)
- View 에서는 Query 와 Command 를 조립해서 사용 (CQRS 패턴)
  + Query: Model 로부터 데이터 조회
  + Command: 데이터 변화

### 3) Intent 와 Reducer

- AS-IS
  + Model 과 View 간의 의존성 발생 

```js
// View 에서 직접 여러가지 값들의 변화를 기술한다.

// 흔한 코드 (MVC)
const onClick = () => {
  setVisible(!visible)
  setCount(count + 1)     // 데이터 변화
  setTodos([...todos, {title: "할일 추가"}])  // 의도
}
```

- TO-BE
  + View 에서는 의도만을 전달하도록 하고
  + 데이터 변환은 모델에서만 처리하도록 한다

### 4) MVI 패턴의 의사코드 예제

```js
// Action
export const _INCREASE = action("_INCREASE")
export const _DECREASE = action("_DECREASE")
export const _RESET = action("_RESET")

// input(state): Intent => Model

// Model
export const store = createStore({count: 0}, state => {

  on(_INCREASE, (value) => state.count += value)
  on(_DECREASE, (value) => state.count -= value)
  on(_RESET, (value) => state.count = 0)
})

// load(state): Model => View

// Component
export const App = (props) => {

  // Query
  const count = SELECT(store.count)

  // Computed Value
  const doubledCount = count * 2

  // Intent
  const onClick = () => dispatch(_INCREASE(+1))

  // View
  return (
    <button onClick={onClick}>
      {count}
    </button>
  );
}

// display(state): View => User
```

## 9. Review

- View 컴포넌트가 비대해진다면, 상태관리 라이브러리를 도입하자.
  + 덩치 큰 View 컴포넌트가 다 처리하는 방식은 MVC 패턴이다.
  + Service 컴포넌트는 API 만 담당하는게 아니다. (Action 기술)
- React 는 현재 전세계적으로 가장 많이 사용되는 프론트 개발 기술이다.
- MVI 상태관리 라이브러리를 검색하면 안드로이드 분야가 많이 나온다.
  + 외국어 문서를 검색하고 싶다면 'CQRS' 키워드를 사용하자.

> 참고문서

- [Cycle.js - Basic examples](https://cycle.js.org/basic-examples.html)
- [Atomic Design Pattern의 Best Practice 여정기 - velog](https://velog.io/@teo?tag=atomic-design-pattern)
- [NGXS is a state management pattern + library for Angular](https://www.ngxs.io/)
- [Recoil is an experimental state management framework for React](https://recoiljs.org/ko/)


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
