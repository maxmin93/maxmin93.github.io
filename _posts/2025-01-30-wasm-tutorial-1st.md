---
date: 2025-01-30 00:00:00 +0900
title: WASM Tutorial - 1일차
description: Zig 로 WASM 예제를 작성해보고 웹브라우져에서 실행해봅니다.
categories: [Language, Zig]
tags: [wasm, 1st-day]
image: "https://blog.mjgrzymek.com/static/images/zig-love-wasm.png"
---

## 0. 참고문서

- [Using Zig with WebAssembly - MJ Grzymek](https://blog.mjgrzymek.com/blog/zigwasm)
- [ziglang.org - WebAssembly](https://ziglang.org/documentation/master/#WebAssembly)
- [WebAssembly with Zig](https://enarx.dev/docs/WebAssembly/Zig)


## 1. WASM

Zig 를 공부하려던 이유는 WASM 때문이었다. Rust 로도 WASM 을 개발할 수 있지만 언어적으로 난해해 보여서 Zig 로 접근해 보려고 했다.

Zig 와 WASM 에 관련된 예제를 검색해 보면 [Minimal zig-wasm-canvas example](https://daneelsan.github.io/minimal-zig-wasm-canvas/) 이 나온다. 이 외에 두 개의 폴리곤을 캔바스 상에서 사용자 키보드에 따라 360도 방향 회전을 하는 예제도 있었다. (한번 봤었는데 링크를 다시 못찾음)

아래 동영상은 [TinyGo & WASM 의 WebGL 데모](https://github.com/semanser/tinygo-wasm-webgl-demo/tree/main) 이다.

<video src="https://github.com/semanser/tinygo-wasm-webgl-demo/assets/4020045/2047caee-491a-4db6-bb49-8e24ec42bb43" controls="controls" style="max-width: 90%;">
</video>

### WASM 의 장점

[Perplexity 답변](https://www.perplexity.ai/search/wasm-gisulyi-jangjeomeun-mueos-QryIRHHNS56IeDlnoexLtA)의 내용을 정리하면 다음과 같다.

- 높은 성능 : JS 보다 빠르고 네이티브 코드에 근접한 성능을 제공
- 언어 다양성 : C/C++, Rust 등 다양한 언어로 개발 가능
- 빠르 로딩 시간 : Docker 컨테이너보다 10~100배 빠름
- 크로스 플랫폼 호환성 : 웹브라우저에서 실행되기 때문에 어디서나 실행 가능

#### WASM 가치

웹브라우저에서 WASM 을 사용하는 이유는 다음과 같다

- 고성능 웹 애플리케이션 개발 : 이미지, 3D 렌더링, 과학 시뮬레이션 등
- C++, Rust 등의 레거시 코드를 웹으로 가져와 활용
- 유니티, 언리얼 등의 게임 엔진이 지원하여 고품질 웹 게임 개발 가능

### WASM 활용분야

다시 말하면, WASM 의 특화 분야는 (1) 고성능 컴퓨팅, (2) 실시간 3D 그래픽, (3) 대규모 데이터 처리 이다.

이와 같은 이유로 WASM 의 기술적 가치나 전망이 좋다고 말하는데.

- 웹 애플리케이션의 성능 혁신
- 새로운 웹개발 패러다임
- 산업계의 관심 증가 
- 클라우드 컴퓨팅 혁신

기존의 Docker 의 역활이었던 분야나 웹 애플리케이션에서 시각적 처리나 인터페이스, 서버 프로그램의 역활을 WASM 으로 대체할 수 있을 것으로 보고 있다.

WASM 의 비동기, 병렬성을 잘 살릴 수만 있다면 웹의 빠른 로딩과 고성능화에 큰 변화를 불러올 수 있다는 기대도 한다. 

#### WASM 의 성공사례

- Figma : 로드 시간을 3배까지 단축하고 네이티브에 가까운 성능을 달성
- Google Auth : 모든 브라우저에서 접근 가능한 서비스를 구현
- Photoshop : 웹 애플리케이션으로 전환하는데 WASM 사용
  - 참고 : [Photoshop is now on the web! (2023)](https://medium.com/@addyosmani/photoshop-is-now-on-the-web-38d70954365a)

2015년에 처음 발표되고 2017년에 첫 데모가 있었지만 WASM 은 아직도 초기 단계이다.

### WASM 이 성공하지 못하는 이유

참고 : [유튜브 - Why WebAssembly Can't Win](https://youtu.be/fbd0MEWnPkE?si=NoIeOAd6dsG4lehk)

내용이 길고, 여러 방향을 짚고 있어서 (잘 이해가 안되서지만) 줄이자면

- 아직도 WASM 기술이 성장할 시간이 필요하다. (초기단계)
- 대용량 파일, 고성능 연산 또는 그래픽 처리 등의 특정 영역에서만 강점을 보이고 있다. 반대로 말하면 웹애플리케이션을 대체하는 것은 경제적이지 못하다.
- 메모리 관리 등 프로그래밍 모델이 너무 다르기 때문에 통합이 어렵다.
  - Java, Kotlin, Dart, Python, C# 과 같은 GC 언어를 위한 WASM GC 도입 중이다. [(GeekNews)](https://news.hada.io/topic?id=11679)
- DOM 중심의 JS 생태계와의 통합이 아직 진행중이다.
  - 예를 들어, 아무도 wordpress 의 프론트를 WASM 으로 바꾸자고 하지 않는다.
  - 옛날 Java 애플릿과 같은 형태로 도입되는 방법도 생각볼 수 있다고

WASM 의 최적화된 작은 코드, 작은 모듈을 유지하기 위해서라도 특정 영역에 한정된 사용 형태를 보이게 될 거라는 의견이 있습니다.

### WASM 구현에 사용할 수 있는 언어들

출처 : [깃허브 - Awesome WebAssembly Languages](https://github.com/appcypher/awesome-wasm-langs?tab=readme-ov-file)

- 제품화가 가능한 언어 : C/C++, Rust, Go(TinyGo)
- 안정적으로 사용 가능한 언어 : Zig, Dart, AssemblyScript, C# 등등
- 사용은 가능하지만 불안정한 언어 : Python, Java/Kotlin 등등

이 중에 [TinyGo](https://tinygo.org/getting-started/), [AssemblyScript](https://www.assemblyscript.org/introduction.html) 가 눈에 띈다.

#### AssemblyScript 데모 몇가지

- [AssemblyScript - Conway's Game Of Life](https://assemblyscript.github.io/examples/game-of-life/)


## 2. WASM 예제

AssemblyScript 또는 TinyGo, Rust 등의 WASM 데모를 찾으면 비교적 쉽게 찾을 수 있다. 굳이 또다시 소스를 반복해서 적고 싶지는 않아 생략한다.

- 이전 포스트 [Zig Tutorial 8th - WASM 빌드 및 WASI](/posts/zig-tutorial-8th/#wasm-%EB%B9%8C%EB%93%9C) 에서 피보나치 함수를 wasm 으로 빌드하고 wasmtime 에서 실행하는 예제를 다루었다.
  - 출처 : [WebAssembly with Zig](https://enarx.dev/docs/webassembly/zig)

- [WASM by Example](https://wasmbyexample.dev/examples/reading-and-writing-graphics/reading-and-writing-graphics.go.en-us.html) : 캔버스 렌더링 예제
  - 구현 언어(선택) : AssemblyScript, TinyGo, C++, Rust

### [Zig - WASM Freestanding 예제](https://ziglang.org/documentation/master/#Freestanding)

1. math.zig 작성하고
2. wasm32-freestanding 를 위한 wasm 목표코드를 생성하고
3. math.wasm 을 로딩하여 실행하는 test.js 작성해서
4. node 로 실행한다.

```zig
// math.zig

// js 의 env 에서 print 개체를 매핑할거다 (extern)
extern fn print(i32) void;

// 덧셈과 (외부 함수로) 출력까지 수행
export fn add(a: i32, b: i32) void {
    print(a + b);
}
```

```console
$ zig build-exe math.zig -target wasm32-freestanding -fno-entry --export=add
```

```js
// test.js

const fs = require('fs');
const source = fs.readFileSync("./math.wasm");
const typedArray = new Uint8Array(source);

WebAssembly.instantiate(typedArray, {
  env: {
    print: (result) => { console.log(`The result is ${result}`); }
  }}).then(result => {
  const add = result.instance.exports.add;
  add(1, 2);  // wasm 의 add 호출
});
```

```console
$ node test.js
The result is 3
```


## 3. 참고 사항

### LLVM (Low Level Virtual Machine)

여러 언어와 여러 아키텍처의 조합에 대해 적합하게 코드를 컴파일 할 수 있는 재사용성이 높은 컴파일러 아키텍처이다. 프론트, 미들, 백엔드 세부분으로 나누어지고 LLVM 을 통과하면 주어진 조건에 navtive 가까운 코드를 생산해 낼 수 있다.

![](https://blog.kakaocdn.net/dn/bBg3Jn/btrH1z7cVLT/7NKkToRNIqxah9FmKysR00/img.png){: width="560" .w-75}
_LLVM Architecture_

Zig 도 빌드할 때 LLVM 을 사용하고, Rust/Python 등등의 여타 언어들도 LLVM 을 사용해 특정 머신의 바이너리 파일을 컴파일 할 수 있다.

> 참고 자료

- [블로그 - LLVM 컴파일러](https://etst.tistory.com/385)
- [위키 - LLVM](https://ko.wikipedia.org/wiki/LLVM)


## 9. Review

- WASM 의 사용분야는 지금으로서는 제한적이다. 일반 웹개발에서는 쓰일 일이 없을거 같다.
- 매우 큰 데이터를 입출력하거나 (웹상에서 그렇게까지 할 일이 있겠냐만은) 이 때 테이블 컴포넌트의 백엔드를 WASM 이 담당하는 그런 특수한 컴포넌트를 만든다거나 한다면 몰라도. 
- 이것을 굳이 다룰 필요가 있을까싶다. 그냥 한번 살펴본 것으로 만족하자. 끝??

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }