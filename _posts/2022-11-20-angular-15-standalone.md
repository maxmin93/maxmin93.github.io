---
date: 2022-11-20 00:00:00 +0000
title: Angular 15 - 기능 및 Standalone
categories: ["nodejs","angular"]
tags: ["TIL","release","standalone"]
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/AngularJS_logo.svg/1200px-AngularJS_logo.svg.png"
---

> Angular 버전 15 가 출시되면서 소개된 여러 기능들과 Standalone Component 에 대해 알아본다.
{: .prompt-tip }

## 1. [Angular v15 is now available!](https://blog.angular.io/angular-v15-is-now-available-df7be7f2f4c8)

중요한 특징들이 대거 반영된 메이저 버전이라 블로그의 내용을 옮겨본다.

- 참고 : 버전 15의 `ng new <my-app>` 생성 패키지 

```json
{
  "dependencies": {
    "@angular/animations": "^15.0.0",
    "@angular/common": "^15.0.0",
    "@angular/compiler": "^15.0.0",
    "@angular/core": "^15.0.0",
    "@angular/forms": "^15.0.0",
    "@angular/platform-browser": "^15.0.0",
    "@angular/platform-browser-dynamic": "^15.0.0",
    "@angular/router": "^15.0.0",
    "rxjs": "~7.5.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.12.0"
  },
  "devDependencies": {
    // ...
    "typescript": "~4.8.2"
  }
}  
```

### 1) Standalone APIs

NgModules를 사용하지 않고 애플리케이션을 구축할 수 있는 새로운 독립형 API (하단에서 예제로 자세히 설명)

- v14 에서 실험적 기능으로 포함되어 있었는데, 이번에 해제됨
- NgModule 에 포함되는 기본 모듈의 크기가 크고 제약이 있었음

### 2) standalone APIs 의 lazy loading

Standalone 은 NgModule 과 분리될 수 있기 때문에, 라우팅에서도 하위 경로를 동적으로 호출할 수 있다.

- 사용하지 않는 라우팅은 번들링에서 제외된다. (코드 크기 감소)
- bootstrapApplication 으로 독립형 컴포넌트부터 시작할 수 있음
  + 애플리케이션을 임의의 지점부터 로딩하고 호출한다는 뜻인듯
    * 기존에는 `app-root` 부터 강하게 연결되어 있는 구조였음

### 3) Directive composition API

Directive 개발시 host 속성에 직접 파라미터 설정을 할 수 있음

### 4) Image directive is now stable!

이미지 태그 기능 향상

- `srcset` 으로 다양한 크기의 이미지들을 등록하고 최적의 이미지 크기가 로딩되도록 할 수 있음 (로딩시간 절약)
- 이미지가 부모 컨테이너 크기에 맞춰 채워지도록 함
  + 따로 크기를 지정하지 않아도 넘치거나 모자라지 않게됨

### 5) Functional router guards

라우팅의 guard (사용가능 여부) 설정을 함수형으로 설정할 수 있음

- 가독성 향상
- 함수형으로 신뢰성 향상

참고 : [Advancements in the Angular Router](https://blog.angular.io/advancements-in-the-angular-router-5d69ec4c032)

```ts
const route = {
  path: ‘edit’,
  component: EditCmp,
  canDeactivate: [
    (component: EditCmp) => !component.hasUnsavedChanges
  ]
};

const route = {
  path: ‘admin’,
  canActivate: [() => inject(LoginService).isLoggedIn()]
};
```

### 6) Router unwraps default imports

지연로딩의 loadComponent 사용 문법이 기본값 설정으로 단순화됨

### 7) Better stack traces

오류에 대해 더 정확하고 가독성을 높인 형태로 스택을 출력

### 8) Release MDC-based components to stable

MDC 기반의 [Angular Material](https://material.angular.io/) 리팩토링 버전을 출시 (재구현)

- [Angular Components v15.0.0](https://github.com/angular/components/releases/tag/15.0.0) : DOM/CSS 가 대부분 변경됨
  + 매터리얼 디자인 [MDC(Material Design Components for Web)](https://github.com/material-components/material-components-web)
  + 웹컴포넌트 [Material Web Components](https://github.com/material-components/material-web) v0.27.0

- Material 디자인을 원본에 가깝게, 온전히 사용할 수 있음 
  + 기존에는 Angular Material 을 통해서 사용
  + CDN 을 통해서 일반 HTML 에서도 사용 가능

- 기존 Material 컴포넌트들은 `legacy-` prefix 가 붙게됨
  + ex) 매터리얼 버튼 모듈 `MatLegacyButtonModule`

### 9) More improvements in components

매터리얼 컴포넌트의 인터페이스 개선 - 사용자 추천에 의한 개선

- CDK(Component Dev Kit) 리스트 박스의 프로그래밍 인터페이스 개선
  + 스타일이 빠진 공백 상태의 인터페이스용 컴포넌트를 말함
    * input/output 속성, 메소드 등이 포함됨

### 10) Improvements in the experimental esbuild support

더 빠른 성능의 실험적 빌더를 포함했다.

- 실험적 빌더 `@angular-devkit/build-angular:browser-esbuild`


### 11) Automatic imports in language service

선언되지 않은 항목을 자동으로 import 문 추가하는 편의 기능 추가

## 2. 독립형(Standalone) 컴포넌트 예제

참고 : [Getting started with standalone components](https://angular.io/guide/standalone-components)

- 예제 : [깃허브/walk-my-dog](https://github.com/angular/examples/tree/main/walk-my-dog)
  + 리스트 `/` : AppComponent 에 연결된 화면 
  + 상세 `/details/{ 번호 }` : 완전 분리된 화면
    * 컴파일도 따로 되고, 로딩도 호출시점에 따로 올라옴

- 별 다른 설정 없이 이미지가 article 안에 맞춰서 꽉 차게 출력됨
  + 원래부터 이랬는지는 잘 모르겠음
  
![예제 walk-my-dog 리스트](/2022/11/20-WalkMyDog-list-crunch.png){: width="640"}

- 지연 로딩된 상세 페이지

![예제 walk-my-dog 상세](/2022/11/20-WalkMyDog-detail-crunch.png){: width="640"}

### 1) 코딩

```bash
$ ng new walk-my-dog --inline-template --inline-style --skip-tests
? Would you like to add Angular routing? Yes
? Which stylesheet format would you like to use? CSS

$ ng g service Dogs --flat
$ ng g component DogsList --flat --standalone
$ ng g component DogView --flat --standalone
$ ng g component DogsListCard --flat --standalone
```

#### 소스 리스트

- src
  + index.html
  + main.ts
  + app
    * app-routing.module.ts
    * app.component.ts
    * app.module.ts : AppComponent 만 포함 
    * (독립형) dog-view.component.ts
    * (독립형) dogs-list-card.component.ts
    * (독립형) dogs-list.component.ts : DogsListCardComponent 참조
    * dogs.service.ts
  + assets
    * 이미지들... 

```ts
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

#### 라우팅

- 독립형이라 해도 component 를 직접 연결하면 메인 번들에 포함된다
- 번들 분리와 지연 로딩을 노리려면 loadComponent 사용
  + 따로 import 할 필요 없음. 소스에서 직접 로딩

```ts
import { RouterModule, Routes } from '@angular/router';
import { DogsListComponent } from './dogs-list.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  { path: 'list', component: DogsListComponent },
  // { path: 'details/:index', component: DogViewComponent },
  {
    path: 'details/:index',
    // lazy load the DogViewComponent
    loadComponent: () =>
      import('./dog-view.component').then((m) => m.DogViewComponent),
  },
];
```

#### 독립형 컴포넌트

- standalone 속성과 함께 imports 모듈을 직접 등록
  + CommonModule 에는 NgIf, NgFor 등 기본 지시자가 있다
    * 이마저도 필요한 것만 골라서 등록할 수도 있음

```ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dog } from './dogs.service';

// routerLink 등의 라우팅 관련 디렉티브를 사용하기 위해
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dogs-list-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `...
    <a routerLink="/details/{ { index } }">Learn More</a>
  ...`,
  styles: [`...`]
})
export class DogsListCardComponent {
  @Input() dog!: Dog;       // Dog 인터페이스
  @Input() index!: Number;  // 숫자 Interface
}
```

### 2) 빌드

지연로딩 되는 `dog-view-comp...` 뷰가 따로 번들링 되었다.

```bash
$ ng build
✔ Browser application bundle generation complete.
✔ Copying assets complete.
✔ Index html generation complete.

Initial Chunk Files  | Names         |  Raw Size | Transfer Size
main.194e6f9.js      | main          | 216.23 kB |      59.41 kB
polyfills.0df5128.js | polyfills     |  33.08 kB |      10.66 kB
runtime.4f5e7b5.js   | runtime       |   2.63 kB |       1.24 kB
styles.ef4e999.css   | styles        |   0 bytes |             -

                     | Initial Total | 251.94 kB |      71.31 kB

Lazy Chunk Files     | Names         |  Raw Size | Transfer Size
566.caca22c.js       | dog-view-comp |   1.56 kB |     785 bytes

Build at: 2022-11-22T06:43:15.285Z - Time: 2018ms
```

### 3) 지연로딩 확인 : 크롬 개발자도구 - Network

- 메인 번들은 최초 호출시 모두 로딩됨
- `src_app_dog-view_component_ts.js` 파일이 따로 로딩됨
  + 함께 참조되는 assets 들도 지연 로딩
  
![지연로딩 - 개발자도구 network](/2022/11/20-WalkMyDog-lazy-loading-crunch.png){: width="620"}

## 3. bootstrapApplication 예제 비교

- 참고 : [Angular Standalone Components: Without NgModule](https://netbasal.com/angular-standalone-components-welcome-to-a-world-without-ngmodule-abd3963e89c5)

### 1) 설정

#### 소스 리스트

- src
  + index.html : app-root 포함
  + main.ts : Application 시작 지점과 routing 설정 제공
  + app
    * (독립형) app.component.ts => 라우팅 포함
    * (독립형) foo.component.ts => 지연 로딩

### 2) 코딩

> app.component.ts 과 foo.component.ts 은 서로 완전 독립이다.

#### app.component.ts

```ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `...
    <a *ngIf="route == 'Home'" routerLink="/foo">Foo</a>
    <a *ngIf="route != 'Home'" href="javascript:void(0)" 
    (click)="goBack()">🔙 Back</a>

    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  title = 'bootstrap-lonely';
  route: string = '';

  constructor(private location: Location, private router: Router) {
    router.events.subscribe((val) => {
      if (location.path() != '') {
        this.route = location.path();
      } else {
        this.route = 'Home';
      }
    });
  }

  ngOnInit() {}

  goBack() {
    // window.history.back();
    this.router.navigate(['/']);
  }
}

```

#### foo.component.ts

```ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-foo',
  standalone: true,
  imports: [CommonModule],
  template: ` <h3>foo works!</h3> `,
  styles: [],
})
export class FooComponent {}
```

#### main.ts : AppComponent 로부터 애플리케이션 실행

- AppComponent 으로 애플리케이션 시작
- providers 로 라우팅 설정을 제공 (RouterModule 에 포함됨)

```ts
import { importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app/app.component';

const routes = [
  { path: '', children: [] }, // empty path
  { path: 'foo',
    loadComponent: () =>
      import('./app/foo.component').then((m) => m.FooComponent),
  },
];

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(RouterModule.forRoot(routes))],
}).catch((err) => console.error(err));
```


### 3) 실행

빌드하면 `app-foo-component` 뷰가 분리되어 번들링 됨

```text
Welcome to bootstrap-lonely!

bootstrap-lonely app is running!
current: Home

[Foo]


######################################
##  Foo 링크 클릭 후
######################################

Welcome to bootstrap-lonely!

bootstrap-lonely app is running!
current: /foo

🔙   Back
foo works!
```


## 4. 기타사항

### 1) [purgecss](https://github.com/FullHuman/purgecss) : 사용하지 않는 css 제거

- scripts 의 post-build 단계로 등록해서 사용
  + 설치 `npm i purgecss -D`
- 기존 css 에서 사용되는 부분만 남겨서 css 업데이트
  + bootstrap 의 경우 268kb 가 25kb 로 1/10 축소됨

- 참고 [Remove unused CSS styles from Bootstrap using PurgeCSS](https://medium.com/dwarves-foundation/remove-unused-css-styles-from-bootstrap-using-purgecss-88395a2c5772)
  + React, Angular 등에서도 사용
  + TailwindCSS 에서 스폰서하고 있음

```bash
purgecss -css dist/*.css --content dist/index.html dist/*.js -o dist
# ...
Run PurgeCSS...
PurgeCSS done
┌─────┬───────────────────────┬──────────────┬───────────┐
│ idx │         file          │ originalSize │  newSize  │
├─────┼───────────────────────┼──────────────┼───────────┤
│  0  │ 'styles.7302e820.css' │  '268.25kb'  │ '25.44kb' │
└─────┴───────────────────────┴──────────────┴───────────┘
```

### 2) `ts(7015)` : 불분명한 key 사용 오류 제외

Typescript 오류 메세지

> Element implicitly has an 'any' type because index expression is not of type 'number'.

- window 가 any 타입을 key 로 사용하고 있기 때문에 지적한 오류
  + `tsconfig.json` 의 ts 컴파일 옵션에서 무시해야 한다

- interface 의 key 대신에 다른 타입이 사용된 경우
  + `as keyof` 캐스팅 처리로 오류 수정

```ts
// ts(7015) 오류!
if (window['ngRef']) {
  window['ngRef'].destroy();
}
window['ngRef'] = ref;

/////////////////////////////

interface IMyObj { title: string; content: string; }
const myObj: IMyObj = { title: 'Hi', content: 'Hope all is well' };
const myKey: string = 'content';

// ts(7015) 오류!
myObj[myKey] = 'All is great now!';  // title, content 만 가능

// `as keyof` 캐스팅 처리로 오류 수정
// myObj[myKey as keyof IMyObj] = 'All is great now!';  
```

- ts 컴파일 옵션 수정 (항목 추가)

```js
// tsconfig.json
{
  "compilerOptions": {
    "suppressImplicitAnyIndexErrors": true,  // <-- 추가 
    "strictNullChecks":false,
    "strictPropertyInitialization": false,    
  }
}
```

## 9. Summary

- 갈수록 좋아지는 앵귤러인데, 국내에서는 왜 찬밥인지..
- 앵귤러가 다이어트 하려고 처절하게 노력중이다. 

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

