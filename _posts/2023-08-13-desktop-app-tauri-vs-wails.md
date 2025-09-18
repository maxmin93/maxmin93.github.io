---
date: 2023-08-13 00:00:00 +0900
title: Tauri(Rust) vs Wails(Go)
description: 웹기술로 Desktop App 을 만들 수 있는, Electron 대체 프레임워크인 Tauri 와 Wails 에 대해 알아보자. 윈도우 10 환경에서 애플리케이션을 빌드해 보자.
categories: [Frontend]
tags: ["sveltekit", "tauri", "wails", "electron"]
image: "https://repository-images.githubusercontent.com/161951219/9788ba3d-e5bf-4904-bdac-2c9dab9352cc"
---

## 1. Desktop Application 개발 프레임워크

멀티 OS 를 지원하는 크로스 플랫폼이다. 유사 개발 도구로 Electron, NW.js, Neutralino(C++), Tauri, Wails 등이 있다.

- Flutter 도 크로스 플랫폼이지만, 웹스택이 아닌 dart 언어만 지원
- 반면에, Electron 등은 HTML/JS/CSS 만으로도 애플리케이션 개발이 가능하다
  + Electron, NW.js 는 nodejs 를 사용하여 앱 개발

NodeJS 로 필요한 기능을 구현할 수 있다면 굳이 데스크탑 애플리케이션이 없어도 된다. 하지만 보안이 문제가 되거나, OS 자원이나 기능 또는 로컬 프로그램과의 협업이 필요한 경우 데스크탑 애플리케이션이 필요하다. 또한 웹서버 기반보다 응용프로그램 형태가 유지보수에 편리한 측면도 있다. (복사하면 끝, 죽어도 피해범위가 작다)

### 1) Tauri : Rust 기반 프레임워크

[버전 1은 2022년 6월 19일에 출시되었음](https://tauri.app/blog/2022/06/19/tauri-1-0)

#### 장점

- 네이티브 메뉴 지원
- 다중창 지원
- 알림 지원
- 격리 패턴에 의한 보안성, 안정성

#### 단점

- 네이티브, 다중창, 알림 지원시 Rust 코딩 필요
- DMG 커스터마이징 없음

### 2) Wails : Golang 기반 프레임워크

#### 버전 2는 2022년 9월 22일에 출시되었음

- 인기 있는 Vite 프로젝트를 활용한 실시간 개발
- 창 관리 및 메뉴 생성을 위한 풍부한 기능
- Microsoft의 WebView2 구성 요소
- Go 구조체를 반영하는 Typescript 모델 생성
- NSIS 설치 프로그램 생성
- 난독화된 빌드

#### 단점

- 지원되는 기능 범위가 Tauri 보다 한발 늦다.
- [다중창 지원은 v3 에서 예정되어 있음](https://wails.io/blog/the-road-to-wails-v3/)
  + v3 에서 API, 바인딩 생성, 빌드 시스템의 개선을 목표로 하고 있다고 함

### 3) Tauri/Wails 와 Electron/NW.js 와의 비교

#### Tauri 와 Wails 장단점

- 각각의 OS 에 내장된 WebView 를 사용하기 때문에 바이너리 크기가 작다
  + 이 때문에 호환성 문제가 발생한다. (macOS 의 safari 와 windows 의 edge)
- 성능, 실행시간, 메모리 소비 측면에서 뛰어나다

#### Electron, NW.js 장단점

- Rust/Go 같은 저수준 언어를 사용할 필요가 없음 (only JS)
- 번들로 제공되는 Chrominium 브라우저를 포함하므로 바이너리 크기가 크다

## 2. SvelteKit 정적 페이지 생성

### 1) [svelte 프로젝트 생성](https://kit.svelte.dev/docs/creating-a-project)

```console
$ %DOWNLOADS%\\node-v18.17.1-x64.msi  # Nodejs 설치

$ npm create svelte@latest my-app
$ cd my-app

$ npm install
$ npm run dev -- --open
```

### 2) [static adapter 설정](https://kit.svelte.dev/docs/adapter-static)

- 정적 페이지 생성을 위한 어댑터 라이브러리 추가

```console
$ npm i -D @sveltejs/adapter-static
$ npm run build  # ==> `${ROOT}/build` 위치에 생성
$ npm run preview -- --open
```

- `${ROOT}/svelte.config.js` 내용을 수정
  + adapter import 변경
  + adapter option 추가 

```js
//import adapter from '@sveltejs/adapter-auto';  // 제거
import adapter from '@sveltejs/adapter-static';  // 추가 
 
export default {
  kit: {
    adapter: adapter({
      // 어댑터 옵션 추가 (Tauri 예제에서는 자동 설정으로 비워두었다)
      pages: 'build',
      assets: 'build',
      fallback: undefined,
      precompress: false,
      strict: true
    })
  }
};
```
{: file="svelte.config.js"}

## 3. Tauri 튜토리얼

> 참고문서

- [v1.4 가이드](https://tauri.app/v1/guides/) : 웹애플리케이션 기반 (WebView 필요)
- [v2.0-alpha 가이드](https://beta.tauri.app/2/guide/) : iOS 와 Android 추가

### 1) Tauri 설치

#### [윈도우 환경의 사전설치](https://tauri.app/v1/guides/getting-started/prerequisites/)

> [cholately](https://chocolatey.org/) 설치 매니저로 설치하지 말자. 버전도 낮고 안된다.

- [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) 설치
  + Desktop development with C++ 섹션을 체크하고
  + 오른쪽 패널에서 MSVC 와 Windows 10 SDK 를 체크
  + (나머지는 필요없다)
- 윈도우용 브라우저인 [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/#download-section) 설치
- [Rust 설치](https://www.rust-lang.org/tools/install)
  - 버전 확인 및 업데이트
  - rust 의 기본 tool-chain 으로 msvc 를 설정  

```console
$ %DOWNLOADS%\\vs_BuildTools.exe

$ %DOWNLOADS%\\MicrosoftEdgeWebView2RuntimeInstallerX64.exe

$ %DOWNLOADS%\\rustup-init.exe

$ rustc --version  # 버전 확인
$ rustup update    # 셀프 업데이트

$ rustup default stable-msvc  # 기본 툴체인 설정
```

#### [Tauri CLI 설치](https://tauri.app/v1/guides/getting-started/setup/html-css-js#create-the-rust-project)

```console
$ cargo install tauri-cli
```

#### [Tauri 프로젝트 생성](https://tauri.app/v1/guides/getting-started/setup/html-css-js#create-the-rust-project) 2가지 방법

> create-tauri-app 으로 애플리케이션 프로젝트를 처음부터 생성하거나

```console
$ cargo install create-tauri-app --locked
package `create-tauri-app v3.7.2` is installed

# cargo create-tauri-app [옵션] [프로젝트명]
$ cargo create-tauri-app -m cargo -t vanilla -y demo-app

$ cd demo-app
$ cargo tauri dev
```

> tauri-cli 로 기존 웹애플리케이션 프로젝트에 tauri 를 기능을 설정하거나

```console
$ mkdir tauri-app && cd tauri-app
$ cargo tauri init
- What is your app name?
- What should the window title be?
- Where are your web assets (HTML/CSS/JS) located relative to the <current dir>/src-tauri/tauri.conf.json file that will be created?
- What is the URL of your dev server?
- What is your frontend dev command?
- What is your frontend build command?
```

### 2) Tauri 프로젝트 생성

#### create-tauri-app 이용한 Demo App (vanilla 템플릿)

- `cargo tauri build` 명령으로 설치용 번들 파일을 생성할 수 있다.
  + bundle.identifier 항목을 수정해야 빌드할 수 있다.
- 윈도우 크기 및 타이틀 등은 `tauri.conf.json` 파일에서 설정한다.
  + 윈도우10/11 에서 디렉토리 경로는 슬래쉬(/)를 사용한다.

> 생성된 파일들과 디렉토리 구조

```text
ROOT
  + src
    - index.html
    - main.js
    - style.css
  + src-tauri
    + icons
    + src
      - main.rs
    + target
      + debug
      + release
        + bundle
          + msi
            - demo-app_****.msi (설치용 번들 파일)
          + nsis
            - demo-app_****.exe (설치용 번들 파일)
    - build.rs
    - tauri.conf.json
  - README.md
```

![tauri-demo-app-setup-wizard](/2023/08/13-tauri-demo-app-setup-wizard.png){: width="480" .w-75}

> 애플리케이션 빌드를 위한 tauri 설정 파일

```json
{
  "build": {
    "beforeDevCommand": "",
    "beforeBuildCommand": "",
    "devPath": "../src",
    "distDir": "../src",
    "withGlobalTauri": true
  },
  "package": {
    "productName": "demo-app",
    "version": "0.0.1"
  },
  "tauri": {
    "bundle": {
      "active": true,
      "targets": "all",
      "identifier": "onl.jeju.dev",
      "icon": [ ... ]
    },
    "security": {
      "csp": null
    },
    "windows": [
      {
        "fullscreen": false,
        "resizable": true,
        "title": "Demo App",
        "width": 640,
        "height": 480
      }
    ]
  }
}
```
{: file="tauri.conf.json"}

![tauri-demo-app-dev-run](/2023/08/13-tauri-demo-app-dev-run.png){: width="560" .w-75}

#### HTML 작성 후 생성한 Demo App (vanilla 템플릿)

```console
$ mkdir demo-app
$ cd demo-app

$ mkdir ui
$ notepad ui\index.html  # index.html 작성
```

![tauri-html-app-dev-run](/2023/08/13-tauri-html-app-dev-run.png){: width="560" .w-75}

- `Welcome from Tauri!` 문구가 `Hello, My App!` 으로 변경됨
  + js 스크립트에 setTimeout 적용하여 백엔드 Tauri 의 greet 함수 호출
  + greet 함수에서 생성된 String 문자열을 받아 HTML 의 Content 변경

### 3) SvelteKit + Tauri 프로젝트

- SvelteKit 프로젝트에 Static Adapter 적용
  + build 디렉토리에 vanilla 웹애플리케이션 생성
- `cargo tauri init` 명령으로 Tauri 적용
  + `tauri.conf.json` 확인

```json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "devPath": "http://localhost:5173",
    "distDir": "../build"
  },
  ...
}  
```

![tauri-svltk-static-dev-run](/2023/08/13-tauri-svltk-static-dev-run.png){: width="560" .w-75}

> Svelte Demo 앱도 적용해 보았다. (잘된다)

![tauri-svltk-demo-dev-run](/2023/08/13-tauri-svltk-demo-dev-run.png){: width="400" .w-75}


## 3. Wails 튜토리얼

> 윈도우 OS 기준으로 기술합니다.

### 1) [Wails 설치](https://wails.io/docs/gettingstarted/installation)

#### 사전 설치

- node 설치 (이미 설치되어 있다고 가정하고)
  + 기본 웹서버로 vite 를 사용하기 때문에 필수이다!
- golang 설치
  + 사용자 환경 변수 `GOPATH=%USERPROFILE%\.go`
  + 시스템 환경 변수 `PATH=C:\Program Files\Go\bin;%PATH%`
- [WebView2 설치](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)
- EXE Setup 빌더 설치
  + nsis 또는 upx 설치
    * upx 는 웹페이지에서 설치 프로그램을 다운로드 받아 실행

```console
$ choco install golang

$ choco install nsis

# 변경된 환경변수 다시 불러오기
$ refreshenv
```

#### Wails CLI 설치

```console
$ go install github.com/wailsapp/wails/v2/cmd/wails@latest

$ wails version
Wails CLI v2.5.1

$ wails doctor
# System

OS           | Windows 10 Pro
Version      | 2009 (Build: 19045)
ID           | 22H2
Go Version   | go1.21.0
Platform     | windows
Architecture | amd64

# Wails

Version | v2.5.1

# Dependencies

Dependency | Package Name | Status    | Version
WebView2   | N/A          | Installed | 115.0.1901.203
Nodejs     | N/A          | Installed | 18.17.1
npm        | N/A          | Installed | activate linux command
*upx       | N/A          | Installed | upx 4.1.0
*nsis      | N/A          | Installed | v3.09
* - Optional Dependency
```

### 2) Wails 프로젝트 생성

#### Vanilla(HTML/CSS/JS) 템플릿의 프로젝트 생성

빌드시 nsis 설치 프로그램을 생성하려면 `-nsis` 옵션을 함께 사용한다.

```console
$ wails init -n myproject -t vanilla-ts

$ wails dev 
```

생성된 프로젝트의 디렉토리 구조

```txt
${ROOT}
  + build
    + bin
      - demo-app.exe
      - demo-app-amd64-installer.exe
    + windows
  + frontend
    + dist  # VITE 의 output 디렉토리
    + node_modules
    + src
      + assets
      - main.js
      - style.css      
    + wailsjs  # 복사해서 설치해도 된다
      + go
        + main
          - main.js
      + runtime
        - runtime.js
    - index.html
    - package.json  # VITE 개발 도구 설치
  - app.go
  - go.mod
  - go.sum
  - main.go
  - README.md
  - wails.json    
```

wails 환경변수 설정은 `wails.json` 으로 한다.

- `frontend:` prefix 는 frontend 디렉토리를 의미

```json
{
  "$schema": "https://wails.io/schemas/config.v2.json",
  "name": "web-app",
  "outputfilename": "web-app",
  "frontend:install": "npm install",
  "frontend:build": "npm run build",
  "frontend:dev:watcher": "npm run dev",
  "frontend:dev:serverUrl": "auto",
  "author": {
    "name": "",
    "email": ""
  }
}
```
{: file="wails.json"}

데모 앱의 실행 화면을 캡쳐했다.

![wails-demo-app-dev-run](/2023/08/13-wails-demo-app-dev-run-w560.png){: width="560" .w-75}
_wails-demo-app-dev-run_

#### Svelte 템플릿 기반 프로젝트 생성

- SvelteKit 이 아닌, Svelte 기반 프로젝트가 생성된다.

```console
$ wails init -n myproject -t svelte-ts

$ wails dev
```

#### SvelteKit 템플릿 기반 프로젝트 생성

문서에는 [wails-sveltekit-template](https://github.com/h8gi/wails-sveltekit-template) 를 사용하라 나와있지만 구버전이다.

- svelte 3.44 에 sveltekit 도 1.0 이하 버전이다
- 실행했지만 실패!

```console
$ wails init -n YOUR_PROJECT_NAME -t https://github.com/h8gi/wails-sveltekit-template
```

> 그래서 최신 버전 Svelte 4 이상, SvelteKit 1.20 이상으로 조립해 보았다.

- vanilla 템플릿 기반 프로젝트 생성
- 기존 frontend 디렉토리를 제거하고
- 최신 sveltekit 으로 frontend 프로젝트를 생성
  + adapter-static 을 적용
    * output 디렉토리를 dist 로 변경
  + 정상적으로 빌드가 되었음을 확인하고

```console
$ wails init -n web-app

$ cd web-app
$ rename frontend frontend-tmp

$ npm create svelte@latest frontend
$ cd frontend

$ npm install
$ npm i -D @sveltejs/adapter-static

$ notepad svelte.config.js  
# - adapter-static 적용
# - adapter 옵션에 output 디렉토리 변경 (build --> dist)

$ npm run build

$ copy ..\frontend-tmp\wailsjs .\  # wailsjs 복사
$ notepad vite.config.ts  # wailsjs 디렉토리 접근 등록
```

- wailsjs 를 복사해서 설치 (App.svelte 에서 사용)
  + vite.config.ts 에서 server 의 접근 허용 위치에 wailsjs 를 등록

```ts
export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['./wailsjs/'],
    },
  },
});
```
{: file="vite.config.ts"}

svelte 템플릿의 `App.svelte` 파일을 복사하여 `+page.svelte` 에 연결하였다.

![wails-svltk-static-dev-run](/2023/08/13-wails-svltk-static-dev-run-w560.png){: width="560" .w-75}


### 3) Wails 빌드

#### [설치 프로그램 빌더 NSIS](https://wails.io/docs/guides/windows-installer)

```console
$ wails build  # 실행파일 exe 만 생성
$ wails build -nsis  # 설치파일 exe 도 생성
```

productVersion 이 출력되도록 했다.

![wails-demo-app-setup-wizard](/2023/08/13-wails-demo-app-setup-wizard-w560.png){: width="480" .w-75}


## 9. Review

- Svelte 의 장점은 Vanilla JS 로 완벽하게 변환해 준다는 점이다.
  + Vanilla 템플릿을 지원하는 플랫폼이라면 연결에 문제가 없다.
- 간단한 웹기반 데스크탑 응용프로그램을 만들기에 Tauri, Wails 둘다 적합하다.
  + 빠르기는 둘다 문제가 안된다.
  + 의외로 Wails 가 exe 용량도 메모리도 덜 먹는다. (둘다 문제가 안된다)
- Tauri 와 Wails 를 비교했을 때, Tauri 에 조금더 점수를 주고 싶다.
  + Tauri 는 C++ 기반이라 OS 와 밀접함이 돋보인다. (보안성 우수)
    * 반면에 Wails 는 wailsjs 를 사용하여 window 전역 변수로 접근한다.
  + Tauri 가 문서나 접근 방식이 더 세련되었다. (사람이 많아서인듯)
- Tauri 사용하면서 불편하게 느낀 문제점도 있다.
  + 설치나 빌드에 시간이 더 걸린다. (무슨 설치가 그리 많은지 보통 300 단계 이상)
  + Wails 는 Vite 기반이라 웹화면 변경시 바로 적용된다. (Tauri 는 안됨)
  + Rust 언어로 백엔드로서 OS 기능을 얼마나 잘 다룰수 있을지 두렵다.
    * Go 언어는 그나마 두려움이 덜한데 (외국 형님들도 비슷한 말들을 한다)

> 총평을 하자면

Electron 의 대체 도구로서 윈도우 응용프로그램 개발에는 아무런 문제가 없었다. 하지만 iOS 와 Android 지원까지 잘 되어야 사용자가 폭발적으로 많아질 듯. (둘 다 차기 버전에서 목표로 삼고 있음)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
