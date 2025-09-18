---
date: 2025-01-03 00:00:00 +0900
title: Zig Tutorial - 1일차
description: Zig 언어 공부를 시작합니다. 설치부터 문법 및 간단한 응용까지 다룹니다.
categories: [Language, Zig]
tags: [1st-day]
image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Zig_logo_2020.svg"
---

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

![](/2025/01/03-vscode-ext-ziglang.png){: width="560" .w-75}
_vscode-ext-ziglang_

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

- `build.zig` : 빌드를 위한 작업
- `build.zig.zon` : 스펙 데이터
- `src`
  - `main.zig` : 실행되는 코드
  - `root.zig` : 정적 라이브러리 코드 (root 란 이름은 일종의 컨벤션이다)
- `zig-out` : 실행파일 빌드시 생성된다


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

pub fn main() !void {
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

### src/root.zig 파일

`zig init` 실행시 생성되고 정적 라이브러리 작성을 위한 별도의 파일이다.

- 이름을 다른 것으로 변경해도 된다. 단, `build.zig` 에 명기해야 함
  - 참고 : [What is root.zig?](https://ziggit.dev/t/what-is-root-zig/5319/2)

```zig
const std = @import("std");
const testing = std.testing;

// export 라고 된 키워드를 pub 로 변경했다
pub fn add(a: i32, b: i32) i32 {
    return a + b;
}

test "basic add functionality" {
    try testing.expect(add(3, 7) == 10);
}
```

`zig test` 로 파일을 개별적으로 테스트 할 수 있다.

```console
$ zig test src/root.zig    
All 1 tests passed.
```

### build.zig 파일

빌드시 필요한 외부 라이브러리 파일들을 빌더에게 등록하는 역활을 한다.

- 외부 라이브러리를 사용하고 싶으면 아래와 같은 등록이 필요하다.

```zig
// build.zig

// root.zig 를 정적 라이브러리로 등록 (이름과 위치)
const lib = b.addStaticLibrary(.{
    .name = "hello-world",
    .root_source_file = b.path("src/root.zig"),
    .target = target,
    .optimize = optimize,
});

b.installArtifact(lib);
```

#### main.zig 에서 root.zig 불러오기

`pub` 키워드가 붙어 있어야 외부로 노출할 수 있다.

- 그런데 이건 정적 라이브러리를 사용하는 방식은 아니다.
  - root 정적 라이브러리를 사용하는 올바른 방법을 못 찾았다.
  - 대다수 코드들에서 extern 을 사용하는 경우는 C 모듈과 인터페이스 할 때다.
- `@import` 는 build.zig 에서 addImport 하는 방식과 같다.
  - 써 놓은게 아까워서 놔두긴 하지만, 나중에 알게되면 수정할 생각이다.

```zig
const root = @import("root.zig");

pub fn main() !void {
    std.debug.print("Hello {s}!\n", .{"World"});
    std.debug.print("add(2,3) = {d}\n", .{root.add(2, 3)});
}
```

빌드와 실행을 한꺼번에 수행한다. 또는 개별 파일을 실행할 수도 있다.

```console
# build.zig 에 명시된 exe 모듈인 main.zig 를 호출
$ zig build run  
Hello World!
add(2,3) = 5

# 명시적으로 main.zig 를 실행
$ zig run src/main.zig          
Hello world!
add = 5
```

별도로 라이브러리 binary 를 생성하는 빌드도 있다.

```
# 라이브러리 생성 => libroot.a
$ zig build-lib src/root.zig
```


## 9. Review

- 마음을 비웠다. 의미 없이 노는 것도 지겹다.
- 논다고 생각하고 처음부터 공부하기를 시작하자. 부담을 갖지 말자.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }