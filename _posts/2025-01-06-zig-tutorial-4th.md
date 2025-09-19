---
date: 2025-01-06 00:00:00 +0900
title: Zig Tutorial - 4일차
description: Zig 언어 공부를 시작합니다. 설치부터 문법 및 간단한 응용까지 다룹니다.
categories: [Language, Zig]
tags: [tips]
image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Zig_logo_2020.svg"
---

## 0. 튜토리얼 참고문서

- [ziglang 공식문서](https://ziglang.org/documentation/master/)
- [zig.guide](https://zig.guide/getting-started/hello-world)
- [Introduction to Zig](https://pedropark99.github.io/zig-book/)
- [Learning Zig 한글 번역판](https://faultnote.github.io/posts/learning-zig/)


## 1. 빠르게 알고 시작해야 할 것들

### 주석

주석은 가독성을 위해 싱글라인으로 `//..` 만 사용한다.

- C 의 `/* ... */` 같은 멀티라인(여러줄) 주석이 없다.

### [외부 모듈 가져오기 `@import`](https://faultnote.github.io/posts/learning-zig/#%EA%B0%80%EC%A0%B8%EC%98%A4%EA%B8%B0importing)

`pub` 키워드로 노출된 함수, 구조체 등을 `@import` 로 가져올 수 있다.

```zig
// models/user.zig
pub const MAX_POWER = 100_000;

pub const User = struct {
  power: u64,
  name: []const u8,
};
```

`models/user.zig` 소스의 `User` 타입을 가져오는 예제이다.

```zig
const user = @import("models/user.zig");
const User = user.User;
const MAX_POWER = user.MAX_POWER
```

### [함수 Function](https://faultnote.github.io/posts/learning-zig/#%ED%95%A8%EC%88%98functions)

파이썬의 `__main__` 모듈 처럼 소스 파일마다 실행을 위한 진입점으로 `main()` 을 사용한다.

- `zig run 파일명.zig` 를 수행하면 main 함수를 찾아 실행한다.

```zig
const std = @import("std");

pub fn main() void {
  const sum = add(8999, 2);
  std.debug.print("8999 + 2 = {d}\n", .{sum});
}

fn add(a: i64, b: i64) i64 {
  return a + b;
}
```

- `fn` 키워드로 함수임을 명기하고 입력 파라미터와 출력 타입을 정의한다.
  - `return` 키워드로 출력값을 정의한다.
- 같은 이름이지만 다른 타입을 정의하는 함수 오버로딩(overloading)은 없다.

### [구조체](https://faultnote.github.io/posts/learning-zig/#%EA%B5%AC%EC%A1%B0%EC%B2%B4structures)

구조체는 `.{..}` 표기법으로 정의한다.

- 필드는 `,`(콤마)로 끝나야 한다.
- 네임스페이스처럼 사용할 수도 있다.
- `class` 처럼 메소드를 갖는 `struct` 로 복합 타입을 정의할 수 있다.

```zig
pub const User = struct {
  power: u64 = 0,
  name: []const u8,

  pub const SUPER_POWER = 9000;

  fn diagnose(user: User) void {
    if (user.power >= SUPER_POWER) {
      std.debug.print("it's over {d}!!!", .{SUPER_POWER});
    }
  }

  pub fn init(name: []const u8, power: u64) User {
    return User{
      .name = name,
      .power = power,
    };
  }
};

const user = User{.name = "Goku"}; // no power assigned
```


## 2. 문자열

(String 타입이 없고) `u8` 의 배열로 정의하고 문자코드는 UTF-8 을 사용한다.

- `*const [4:0]u8` : null 로 종료되는 길이 4의 문자열 타입
  - `[길이:센티넬]` : **_센티넬_** 은 배열 끝에서 발견되는 특수값을 의미
- 문자열은 보통 이렇게 정의해 사용한다. ==> `[]const u8`
  - 문자열의 null 종결자를 찾을 필요가 없어서 효율적이다.

```zig
const hello: []const u8 = "Hello";

const c_style: [*:0]const u8 = "Null-terminated";
const slice_style: []const u8 = "Just a slice";
const sentinel_slice: [:0]const u8 = "Sentinel-terminated slice";
```

참고자료 : [The Comprehensive Guide to Strings in Zig: From Bytes to Unicode](https://gencmurat.com/en/posts/zig-strings/)

- `*const [N:0]u8` : N+1 바이트 배열의 포인터 (null 종결자 보장)
- `[]const u8` : 바이트 배열의 조각 (null 종결자 보장 안함)
- `[:0]const u8` : 바이트 배열의 조각 (null 종결자 보장)

### 문자열 슬라이싱

```zig
const full_name = "Zig Ziglar";
const first_name = full_name[0..3];
const last_name = full_name[4..];

std.debug.print("First: {s}, Last: {s}\n", .{first_name, last_name});
// 출력
// First: Zig, Last: Ziglar
```

### utf8 문자열

참고자료 : [Unicode Basics in Zig](https://zig.news/dude_the_builder/unicode-basics-in-zig-dj3)

```zig
const greeting = "Hello, 월드 世界!";
var utf8 = (try std.unicode.Utf8View.init(greeting)).iterator();
var char_count: usize = 0;
while (utf8.nextCodepoint()) |code_point| : (char_count += 1) {
    std.debug.print("0x{x} is {u} \n", .{ code_point, code_point });
}
std.debug.print("Character count: {}\n", .{char_count});

// 출력
// ...
// 0x20 is   
// 0xc6d4 is 월 
// 0xb4dc is 드 
// 0x20 is   
// 0x4e16 is 世 
// 0x754c is 界 
// 0x21 is ! 
// Character count: 13
```


## 9. Review

- 문자열 사용 방법이 많이 불편하다. String 타입을 만들주면 좋겠다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }