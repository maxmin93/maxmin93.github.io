---
date: 2025-01-03 00:00:00 +0900
title: Zig Tutorial - 1일차
categories: ["language","zig"]
tags: ["tutorial","install","1st-day"]
image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Zig_logo_2020.svg"
---

> Zig 언어 공부를 시작합니다. 설치부터 문법 및 간단한 응용까지 다룹니다.
{: .prompt-tip }

## 0. 설치

2025년 1월 현재 최신 버전은 `0.13.0` 입니다.

### [MacOS 에 Zig 설치](https://ziglang.org/learn/getting-started/#managers)

```bash
brew install zig

# zig version
# 0.13.0
```

#### VSCode 의 Zig 확장 모듈 설치

`Zig Language` 를 검색하여 선택한다.

<img src="/2025/01/03-vscode-ext-ziglang.png" alt="vscode-ext-ziglang" width="60%" />

### [Zig 언어 특징](https://www.openmymind.net/learning_zig/language_overview_1/)

- 강력하게 타입이 지정된 컴파일 언어
- 제네릭을 지원하고, 강력한 컴파일 타임 메타 프로그래밍 기능이 있고
- 가비지 수집을 포함하지 않습니다.
- 많은 사람들이 Zig 를 C 의 현대적인 대안으로 생각합니다.
  - 문법도 C 와 유사 (중괄호 블록을 사용하고 세미콜론으로 문장 구분)

### 튜토리얼 문서

- [ziglang 공식문서](https://ziglang.org/documentation/master/)
- [zig.guide](https://zig.guide/getting-started/hello-world)
- [Introduction to Zig](https://pedropark99.github.io/zig-book/)
- [Learning Zig](https://www.openmymind.net/learning_zig/), [Learning Zig 한글 번역판](https://faultnote.github.io/posts/learning-zig/)
- [유튜브 - zig 비디오 강좌 (2023년)](https://www.youtube.com/playlist?list=PLtB7CL7EG7pCw7Xy1SQC53Gl8pI7aDg9t)


## 1. 사용해보기 : [Hello World](https://ziglang.org/documentation/master/#Hello-World)

### 프로젝트 생성

```bash
mkdir hello-world
cd hello-world
zig init
```

src 와 zig-out 디렉토리와 기본 파일들이 생성된다.

### 빌드 및 실행

```bash
# 사용법 보기
zig build -h | more

# 빌드 및 실행
zig build run 
# All your codebase are belong to us.
# Run `zig build test` to run the tests.

# 실행파일
ls -l zig-out/bin 
# hello-world
```

#### 실행파일 출력

별도의 위치에 생성하고 싶으면 `-femit-bin` 옵션을 사용한다.

```bash
mkdir target
zig build-exe src/main.zig -femit-bin=target/hello
./target/hello
```

### src/main.zig 파일

기존에 작성된 내용은 날려버리자.

```zig
const std = @import("std");

pub fn main() void {
    std.debug.print("Hello, {s}!\n", .{"World"});
}
```

실행해 보자.

```bash
zig build run 
# Hello, World!
./zig-out/bin/hello-world 
# Hello, World!
```


## 9. Review

- 마음을 비웠다. 의미 없이 노는 것도 지겹다.
- 논다고 생각하고 처음부터 공부하기를 시작하자. 부담을 갖지 말자.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }