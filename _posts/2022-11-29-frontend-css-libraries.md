---
date: 2022-11-29 00:00:00 +0900
title: 프론트엔드 CSS 라이브러리 비교
description: CSS 라이브러리에 대해 조사합니다. Bootstrap, Material 및 최신 Tailwind, Pico 등에 대해 비교합니다.
categories: [Frontend]
tags: [library, picocss, tailwind]
image: "https://stackdiary.com/wp-content/uploads/2022/03/average-bundle-size-for-CSS-frameworks.png"
---

## 1. CSS Libraries

CSS 는 기본적으로 HTML 의 스타일링을 위한 라이브러이고, React/Vue/Angular 등의 웹애플리케이션을 위한 전용 컴포넌트 라이브러리가 있다. 현재 프론트엔드 개발을 위한 라이브러리는 React 가 대세이기 때문에 대부분의 CSS 는 React 사용을 염두해 두고 구현되어 있다.

웹컴포넌트를 만드는 방법은 순수 vanilla component 를 React/Vue/Angular 등의 데이터 바인딩 기능을 이용하는 방법과, 전용 컴포넌트를 활용하는 방법이 있다. 당연히 후자가 개발에 필요한 여러 도움을 받을 수 있다.

### 1) 기본 CSS 라이브러리

#### [Bootstrap](https://getbootstrap.com/)

2011년에 트위터를 위해 개발되었고, 이후 오픈소스화 되면서 수많은 CSS 프레임워크의 근간이 되었다. 현재 최신 버전은 [Bootstrap 5.2.x](https://getbootstrap.com/docs/5.2/getting-started/introduction/)

- 가장 높은 사용률과 다양한 템플릿을 가지고 있는데, 그만큼 디자인이 식상하다는 단점이 있다.

#### [Material](https://m3.material.io/)

2014년에 구글에 의해 개발된 디자인 아키텍처이고, 이를 기반으로 웹 디자인과 안드로이드 디자인, 현재는 Flutter 를 위한 디자인에 사용되고 있다. M1, M2 를 거쳐 현재 M3 버전까지 와 있고 다채로운 색상과 일관성 있는 스타일을 제공한다.

- M2 까지만 해도 공돌이 냄새가 많이 나는 스타일이었다. 이번에 M3 에서 이쁘게 바뀌어서 기대가 크다.

#### [TailwindCSS](https://tailwindcss.com/)

앞의 Bootstrap, Material 은 디자인 철학과 일관성 있는 스타일링 아키텍처를 제공하는데 반해 Tailwind 는 단순한 CSS 라이브러리이다. 다만, CSS 키워드들을 자신만의 클래스 명명 규칙으로 재구성하여 독특한 사용방법을 제공하는 특징이 있다.

즉, 여러 css 의 조합으로 하나의 스타일링을 정의하는 방식과 반대로 Tailwind 는 css 들을 모조리 분해하여 사용자가 자유롭게 조합할 수 있도록 만들었다. 이처럼 앞의 두 CSS와 궤를 달리하는 목적을 가지고 있기 때문에 따로 분류하였다.

- 다크호스로 등장하면서 최근 인기와 관심도가 높다. 엄청 편리하다는데, 백엔드에 집중하고자 하는 나로서는 복잡하기 짝이없다. 정말 유용한걸까?

### 2) Minimal CSS 라이브러리들

CSS 기능이 늘어나면서 크기도, 기능도, 문법도 비대해지는 문제점이 생겨서 이를 대체하기 위한 다양한 CSS 들이 생겨나고 있다.

- 빈 화면이라도 CSS만 일단 몇십KB 이고, 컴포넌트 라이브러리까지 더하면 몇백KB가 넘기도 한다. (사용감이 무겁고 둔해짐)
- 때문에 사용되지 않는 CSS 를 제외하는 PostCSS 같은 후처리기도 있음

Minimal 또는 Lightweight 를 표방하는 라이브러리들은 Tailwind 와 반대로 최소의 CSS 키워드를 사용하도록 디자인 되었다. 태그가 몇종류 안되어서 다루기 편하지만 그만큼 세밀하게 제어할 수 없다.

참고: [Lightweight CSS Frameworks - 2021년](https://dev.to/sm0ke/lightweight-css-framework-a-curated-list-4hc3)

![CSS Framework Bundle Size](https://stackdiary.com/wp-content/uploads/2022/03/average-bundle-size-for-CSS-frameworks.png){: width="480"}

- [Pico.CSS](https://picocss.com/) - 제일 스타일리쉬 하다. 건드릴 부분이 거의 없다.
- [FICTOAN](https://sujan-s.github.io/fictoan/) - intuitive, modular CSS Framework
- [Milligram](https://milligram.io/) 2kb 미만 (제일 작은듯)
- [Spectre](https://picturepan2.github.io/spectre/getting-started.html) - a modern framework for faster development
- [Picnic](https://picnicss.com/) SCSS 기반으로 작성되었음
- [Pure.CSS](https://purecss.io/) 가장 오래된 편이라 사용률이 제법 많은 편
  + 그래봐야 코끼리급 메이저 CSS 들에 비하면 개미만큼 엄청 적지만
 
### 3) 전용 컴포넌트 CSS 라이브러리

프론트엔드 웹프레임워크를 위한 CSS 라이브러리들에 대해 알아보자. 당연히 해당 웹프레임워크와 함께 사용되어야 한다. 대부분 React 용이다.

컴포넌트 라이브러리들은 유료 버전들이 많다. 나름의 디자인 룩(Look)을 개발하고 이를 지원하는 CSS 라이브러리와 프로 버전의 디자인 템플릿을 판매한다. 학습과정을 만들어 교육 자료를 판매하기도 한다.

#### 참고문서

- [부트스트랩과 Tailwind CSS와 머티리얼 UI(MUI) 비교 2022년](https://blog.logrocket.com/comparing-bootstrap-vs-tailwind-css-vs-material-ui-mui/#material-ui-mui-react)

  - [Bootstrap](https://getbootstrap.com/) 기반
    + BootstrapVue, Reactstrap, Sveltestrap

  - [Material](https://m3.material.io/) 기반 [(최근 2022년10월 M3 웹버전 출시)](https://www.designware.io/blog/material-design-3)
    + Material UI (MUI), Vuetify
    + Angular 를 위한 MDC 로 [Angular Material](https://material.angular.io/) 이 있음

  - [TailwindCSS](https://tailwindcss.com/) 기반 [(참고: 컴포넌트 라이브러리)](https://stackdiary.com/tailwind-components-ui-kits/)
    + [Tailwind UI](https://tailwindui.com/), daisyUI, Mamba UI, Headless UI, [Tailwind Elements](https://tailwind-elements.com/), Xtend UI, [Flowbite](https://flowbite.com/), Meraki UI, Tailblocks

- [베스트 7 - 리액트 UI 프레임워크 2022년](https://themeisle.com/blog/best-react-ui-framework)
  + [Material UI (MUI)](https://mui.com/), [React Bootstrap](https://react-bootstrap.github.io/), React Redux/React Router, Grommet, Blueprint UI, Fluent UI
    
  - [베스트 10 리액트 UI 라이브러리 - 2020년 한글](https://usecode.pw/10-best-react-ui-library/)
    * Material UI, Ant Design, Chakra UI, Reactstrap, Semantic-UI-React, Bludeprint, Rebass, Grommet, React-Materialize

## 2. 살펴볼 주요 라이브러리들

### 1) 메이저 CSS 랭킹 비교 - [npm trends](https://npmtrends.com/@angular/material-vs-@material-ui/core-vs-bootstrap-vs-purecss-vs-react-bootstrap-vs-tailwindcss)

- Bootstrap 은 안쓰이는 곳이 없을 정도라 논외로 쳐야 할듯
- Tailwind 의 성장세가 놀랍다. 광풍이라는 말이 맞는듯
  + CSS 숙련자들은 직접 tailwind 다루어서 컴포넌트를 개발
- MUI 가 React 컴포넌트 스타일에 가장 많이 쓰인다.
- 미니멀 CSS 과의 비교를 위해 PureCSS 를 넣었지만 바닥에 가깝다.

![NPM Trends - Major CSS Libs](/2022/11/29-npmtrends-major-css-2022.png){: width="620"}

### 2) 미니멀 CSS 랭킹 비교 - [npm trends](https://npmtrends.com/@picocss/pico-vs-fictoan-react-vs-milligram-vs-picnic-vs-purecss-vs-spectre.css)

- PureCSS 가 여전히 대세이고, Spectre 가 2위 정도 하는 모양이다.
- Pico.CSS 가 상승세를 타고 올라오고 있다.
  + Spectre 의 개발 편이성을 Pico 역시 갖추고 있어서 상쇄하는 탓

![NPM Trends - Minimal CSS Libs](/2022/11/29-npmtrends-minimal-css-2022.png){: width="620"}

#### [Pico.CSS](https://picocss.com/) : HTML, 리액트와도 잘 맞는다.

- 기본 옵션이 잘 설정되어 있어서 복붙하면 끝이다.
- Angular 와는 중간에 끼이는 App Layer 때문에 수정이 필요함

### 3) 리액트 UI 라이브러리 랭킹 비교 - [npm trends](https://npmtrends.com/@material-ui/core-vs-antd-vs-react-bootstrap-vs-semantic-ui-react-vs-tailwindcss)

![NPM Trends - React UI CSS Libs](/2022/11/29-npmtrends-react-ui-css-2022.png){: width="620"}

#### [Material UI (MUI)](https://mui.com/) : React + Material

- 리액트 기반 UI 라이브러리 중에 가장 인기있고 성숙한 라이브러리
- 호환성 좋고, 레퍼런스도 다양해서 리액트 입문시에 추천

#### [React Bootstrap](https://react-bootstrap.github.io/) : React + Bootstrap

- Bootstrap 의 사용자가 많아 익히고 다루기 편하다.
- 최신버전 2.6.0 (Bootstrap 5.2 기반)

## 3. CSS 라이브러리 코드 비교 - Grid, Card 만

### 1) [Pure CSS](https://purecss.io/grids/)

안예쁘다. 뭐랄까 철지난 디자인 느낌이 든다.

> Grid system, Button

```jsx
// `-md-` 클래스로 반응형 디자인을 설정함
<div class="pure-g">
    <div class="pure-u-1 pure-u-md-1-3"> ... </div>
    <div class="pure-u-1 pure-u-md-1-3"> ... </div>
    <div class="pure-u-1 pure-u-md-1-3"> ... </div>
</div>
// 버튼
<a class="pure-button" href="#">A Pure Button</a>
<button class="pure-button">A Pure Button</button>
```

> Card

Card 가 없고, 이메일/포토갤러리 등의 템플릿으로 제공

### 2) [Pico CSS](https://picocss.com/docs/grid.html)

깔끔한 디자인과 시원한 색감을 사용한다. 기본적으로 버티컬 레이아웃

> Grid system, Button

```jsx
<div class="grid">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
</div>
<button>Button</button>
<a href="#" role="button" class="secondary">Secondary</a>
```

> Card

```jsx
// header, footer 만 들어감
<article>I'm a card!</article>
```

### 3) [Spectre CSS](https://picturepan2.github.io/spectre/layout/grid.html)

비교삼아 넣기는 했는데, 디자인도 색감도 별로다.

> Grid system, Button

```jsx
// flexbox grid example
<div class="container">
  <div class="columns">
    <div class="column col-6">col-6</div>
    <div class="column col-3">col-3</div>
    <div class="column col-2">col-2</div>
    <div class="column col-1">col-1</div>
  </div>
</div>
<button class="btn">default button</button>
<button class="btn btn-primary">primary button</button>
```

> Card

```jsx
<div class="card">
  <div class="card-header"> ...
  <div class="card-body"> ...
  <div class="card-footer"> ...
</div>
```

### 4) [Ant Design 5.0.2](https://ant.design/components/card)

하얀색 톤이 많이 쓰이고, 단조로운 디자인을 사용.   
쇼핑몰 보다는 기능성 애플리케이션에 맞을듯.

> Grid system

```jsx
import { Col, Row } from 'antd';

const App: React.FC = () => (
  <>
    <Row>
      <Col span={24}>col</Col>
    </Row>
    <Row>
      <Col span={12}>col-12</Col>
      <Col span={12}>col-12</Col>
    </Row>
  </>
);
```

> Card

```jsx
import { Card } from 'antd';

const App: React.FC = () => (
  <>
    <Card title="Default size card" extra={<a href="#">More</a>} style={ { width: 300 } }>
      <p>Card content</p>
    </Card>
  </>
);    
```

### 5) TailwindCSS

- [Tailwind UI](https://tailwindui.com/) 도 있지만, 유료이다. 
- 크기라던지 속성을 부여하는 정도는 건드려볼 수 있지만, 그 이상은 무리.

> Grid system

```jsx
// Full width column
<div class="flex mb-4">
  <div class="w-full bg-gray-500 h-12"></div>
</div>
// Two columns
<div class="flex mb-4">
  <div class="w-1/2 bg-gray-400 h-12"></div>
  <div class="w-1/2 bg-gray-500 h-12"></div>
</div>
```

> Card

```jsx
<div class="max-w-sm rounded overflow-hidden shadow-lg">
  <img class="w-full" src="/img/card-top.jpg" alt="Sunset in the mountains">
  <div class="px-6 py-4">
    <div class="font-bold text-xl mb-2">The Coldest Sunset</div>
    <p class="text-gray-700 text-base">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et perferendis eaque, exercitationem praesentium nihil.
    </p>
  </div>
  <div class="px-6 pt-4 pb-2">
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
    <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
  </div>
</div>
```

### 6) [Material Tailwind](https://www.material-tailwind.com/docs/react/card)

Tailwind 를 이용한 UI 컴포넌트 라이브러리들이 우후죽순 생겨나고 있다.   
TailwindCSS 의 npm trend 순위가 높아진 것은 이들을 다 합쳐기 때문인듯.

- 만들어진 [페이지 섹션](https://www.material-tailwind.com/blocks#pricing)들은 모두 유료이다.

> Grid system, Card

```jsx
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
 
export default function Example() {
  return (
    <Card className="w-96">
      <CardHeader
        variant="gradient"
        color="blue"
        className="mb-4 grid h-28 place-items-center"
      >
        <Typography variant="h3" color="white">
          Sign In
        </Typography>
      </CardHeader>
      <CardBody className="flex flex-col gap-4">
        <Input label="Email" size="lg" />
        <Input label="Password" size="lg" />
        <div className="-ml-2.5">
          <Checkbox label="Remember Me" />
        </div>
      </CardBody>
      <CardFooter className="pt-0">
        <Button variant="gradient" fullWidth>
          Sign In
        </Button>
        <Typography variant="small" className="mt-6 flex justify-center">
          Don't have an account?
          <Typography
            as="a"
            href="#signup"
            variant="small"
            color="blue"
            className="ml-1 font-bold"
          >
            Sign up
          </Typography>
        </Typography>
      </CardFooter>
    </Card>
  );
}
```

### 7) [Material UI (MUI)](https://mui.com/material-ui/react-grid2/#fluid-grids)

매터리얼 느낌도 나지만, 서드파티와 섞어서 쓸 수도 있어서 혼종이라는 느낌이 든다. 스타일 일관성이 깨진 느낌이랄까. 기능이라던지 지원하는 컴포넌트들은 다양하다.

> Grid system (12분할)

```jsx
<Grid container spacing={2}>
  <Grid xs={8}>
    <Item>xs=8</Item>
  </Grid>
  <Grid xs={4}>
    <Item>xs=4</Item>
  </Grid>
  <Grid xs={4}>
    <Item>xs=4</Item>
  </Grid>
  <Grid xs={8}>
    <Item>xs=8</Item>
  </Grid>
</Grid>
```

> Card

```jsx
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

export default function BasicCard() {
  return (
    <Card sx={ { minWidth: 275 } }>
      <CardContent>
        <Typography sx={ { fontSize: 14 } } color="text.secondary" gutterBottom>
          Word of the Day
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}
```

### 8) [React Bootstrap](https://react-bootstrap.github.io/components/buttons/)

많이 단순화 시켰다. 그리고 딱봐도 Bootstrap 이라는 느낌.

> Grid system

```jsx
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function ContainerExample() {
  return (
    <Container>
      <Row>
        <Col>1 of 2</Col>
        <Col>1 of 2</Col>
      </Row>
    </Container>
  );
}
```

> Button

```jsx
import Button from 'react-bootstrap/Button';

function TypesExample() {
  return (
    <>
      <Button variant="primary">Primary</Button>{' '}
      <Button variant="secondary">Secondary</Button>{' '}
      <Button variant="success">Success</Button>{' '}
    </>
  );
}      
```

> Card

```jsx
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function BasicExample() {
  return (
    <Card style={ { width: '18rem' } }>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}        
```

### 9) [Angular Material](https://material.angular.io/components/card/examples) - Angular (비교용)

Admin, 운영툴 만드는 정도의 디자인이다.

> Grid system

```html
<mat-grid-list cols="4" rowHeight="100px">
  <mat-grid-tile
      *ngFor="let tile of tiles"
      [colspan]="tile.cols"
      [rowspan]="tile.rows"
      [style.background]="tile.color">
    { { tile.text } }
  </mat-grid-tile>
</mat-grid-list>
```

> Card

```html
<mat-card>
  <mat-card-header>
    <mat-card-title>Actions Buttons</mat-card-title>
    <mat-card-subtitle>Start</mat-card-subtitle>
  </mat-card-header>
  <mat-card-actions>
    <button mat-button>LIKE</button>
    <button mat-button>SHARE</button>
  </mat-card-actions>
</mat-card>
```

## 4. 참고할만한 페이지 템플릿들 (유료)

### [Volt React Dashboard](https://themesberg.com/product/dashboard/volt-react)

- [깃허브/volt-react-dashboard](https://github.com/themesberg/volt-react-dashboard) : 라이센스가 걸려있는듯. 실행안됨
- 템플릿 개발사 Themesberg 는 [flowbite](https://github.com/themesberg/flowbite) 도 만들었다.
  + Tailwind 템플릿도 다수 있음. 어쨌든 모두 유료

## 9. Review

- MUI, React Bootstrap, Antd, Pico 정도로 압축된다.
  + 혼자서 간단히 해보려면 Pico 를 추천
  + 디자인 룩(Look) 을 찾는다면 MUI, React Bootstrap, Antd 에서
- Tailwind 는 CSS 숙련자 아니면 못건드리겠다. 예제를 따라해 보았지만 간단한 수정 외에는 뭘 어떻게 해야할지 막막한 느낌을 주었다.
  + 사실 개념 자체가 순수 CSS 를 사용하는 것과 다를바 없다.

- 디자인을 모르는 개발자가 프론트 화면을 만드는 것은 매우 어렵다.
  + 그럴듯한 디자인이나 템플릿을 가져다 쓰는게 고생 덜하는 방향임
  + 그렇다고 돈주고 Pro 템플릿 사기도 뭐하고. 무료 소스를 찾자.

- 여러모로 살펴볼 부분이 많아 추후에도 내용 업데이트가 필요함

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
