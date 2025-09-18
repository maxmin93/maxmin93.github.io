---
date: 2022-04-29 00:00:00 +0900
title: Angular Material 제거하기
description: Angular 프로젝트에서 Material 말고 다른 UI 테마를 쓰고 싶을 때, 초기화 하는 방법을 설명합니다.
categories: [Frontend]
tags: [material, angular]
image: https://miro.medium.com/v2/resize:fit:759/1*JCXpsIIoc21cj3Ea8PdnjQ.png
---

## Angular Material

[Angular Material](https://material.angular.io)는 Angular 용으로 제작된 Material UI 프레임워크입니다.<br/>
프로그래머가 HTML/CSS에 익숙하지 않더라도 손쉽게 UI를 다룰수 있도록 규격화된 속성들을 가지고 있습니다.<br/>

Angular Material 을 사용하면 웹디자이너(웹퍼블리셔)와 협업을 하지 않아도 우선 화면을 뽑아낼 수 있기 때문에<br/>
훨씬 빠른 프로토타입을 뽑아 낼 수 있는 장점이 있습니다.<br/>
특히 웹디자이너가 교체되는 경우에도 어느 정도는 개발자가 직접 수정을 할 수도 있습니다.

### Angular Material 설치

[Getting Started](https://material.angular.io/guide/getting-started)를 따라가면 됩니다.<br/>
본 예제는 'Angular CLI 13.3.3' 버전에서 실행했습니다.

```shell
# Angular Material 설치
$ ng add @angular/material
ℹ Using package manager: npm
✔ Found compatible package version: @angular/material@13.3.5.
✔ Package information loaded.

The package @angular/material@13.3.5 will be installed and executed.
Would you like to proceed? Yes
✔ Package successfully installed.

# 질문1: theme 스타일을 고르시오
? Choose a prebuilt theme name, or "custom" for a custom theme:
Pink/Blue Grey     [ Preview: https://material.angular.io?theme=pink-bluegrey ]

# 질문2: typography styles을 전체에 적용할건지?
? Set up global Angular Material typography styles? No

# 질문3: animation 효과를 적용할 것인지?
? Set up browser animations for Angular Material? No

# Angular Material 적용시 변경되는 사항들 (5개 파일)
UPDATE package.json (1184 bytes)
✔ Packages installed successfully.
UPDATE src/app/app.module.ts (1568 bytes)
UPDATE angular.json (3237 bytes)
UPDATE src/index.html (555 bytes)
UPDATE src/styles.css (907 bytes)

# 실행해 보기
$ ng serve --open
```

### Angular Material 적용시 변경 사항

@angular/cli 에 의해서 자동으로 변경된 사항들이다.<br/>
(material 제거시 변경 사항들도 함께 제거해야 함)

> package.json

```json
    "dependencies": {
        "@angular/cdk": "^13.3.5",
        "@angular/material": "^13.3.5",
    }
```

> angular.json

```json
    "build": {
        "styles": [
            "./node_modules/@angular/material/prebuilt-themes/pink-bluegrey.css",
        ],
    },
    "test": {
        "styles": [
            "./node_modules/@angular/material/prebuilt-themes/pink-bluegrey.css",
        ],
    }
```

> style.css

```css
/* 맨 하단에 자동으로 추가됨 */
html,
body {
  height: 100%;
}
body {
  margin: 0;
  font-family: Roboto, "Helvetica Neue", sans-serif;
}
```

> index.html

```html
<head>
  <link rel="preconnect" href="https://fonts.gstatic.com" />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap"
    rel="stylesheet"
  />
  <link
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
    rel="stylesheet"
  />
</head>
```

### Angular Material 설치 후 body margin 수정

사실 CSS를 잘 모르는 입장에서 Material 이후 화면 모서리 여백들이 몽땅 없어져 크게 당혹했다.<br/>
'이걸 원복시켜야 하나?', '그러면 Material의 기능을 못쓸텐데' 등등 고민하기 시작한다.

Material을 사용하면서 body margin을 적용할 방법은 2가지가 있다.

- `style.css`에서 (자동으로) 추가된 body 항목 제거
- 또는, `app.component.css`에서 body 항목에 대한 스타일 적용

```css
/* 최상위 component에서 ng-deep을 적용해야 먹힘
*/
::ng-deep body {
  margin: 2em;
}
```

## Angular Material 제거하기

`ng help`를 쳐봐도 remove 명령어는 보이지 않는다.<br/>
Material 패키지를 제거하는 방법은 `npm uninstall` 뿐이다.<br/>
이후 `ng add`에 의해 자동으로 추가된 항목들을 제거하면 된다.

```shell
# material 과 cdk 패키지 제거
$ npm uninstall @angular/material --save
$ npm uninstall @angular/cdk --save

# src/app/app.module.ts 변경사항 삭제
# angular.json 변경사항 삭제
# src/index.html 변경사항 삭제
# src/styles.css 변경사항 삭제
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
