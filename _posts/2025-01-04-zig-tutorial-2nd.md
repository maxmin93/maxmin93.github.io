---
date: 2025-01-04 00:00:00 +0900
title: Zig Tutorial - 2일차
description: Zig 언어 공부를 시작합니다. 설치부터 문법 및 간단한 응용까지 다룹니다.
categories: [Language, Zig]
tags: []
image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Zig_logo_2020.svg"
---

## 0. 튜토리얼 참고문서

- [ziglang 공식문서](https://ziglang.org/documentation/master/)
- [zig.guide](https://zig.guide/getting-started/hello-world)
- [Introduction to Zig](https://pedropark99.github.io/zig-book/)
- [Learning Zig](https://www.openmymind.net/learning_zig/), [Learning Zig 한글 번역판](https://faultnote.github.io/posts/learning-zig/)
- [유튜브 - zig 비디오 강좌 (2023년)](https://www.youtube.com/playlist?list=PLtB7CL7EG7pCw7Xy1SQC53Gl8pI7aDg9t)


## 1. [Assignment](https://zig.guide/language-basics/assignment)

### World 를 변수로 출력

print 함수의 args 위치에 `.{ ... }` 파라미터 배열을 작성한다.

```zig
const world: *const [4]u8 = "World";

std.debug.print("Hello, {s} {s}!\n", .{ world, world });
// Hello, Worl Worl!
```

#### std.log 를 std.debug 대신 사용하기

`std.log` 는 `info`, `debug`, `warn` 등의 함수를 제공한다.

```zig
const world = "World";
std.log.debug("Hello, {s} {s}!\n", .{ world, world });
// debug: Hello, World World!
```

### std.debug.print 함수 구현 [(from the stdlib)](https://github.com/ziglang/zig/blob/b4da8eef2a393543e9520c544364689ab482b080/lib/std/debug.zig#L94)

참고문서 : [Where is print() in Zig](https://zig.news/kristoff/where-is-print-in-zig-57e9)

```zig
const std = @import("std");
const io = std.io;

pub fn lockStdErr() void {
    std.Progress.lockStdErr();
}

pub fn unlockStdErr() void {
    std.Progress.unlockStdErr();
}

pub fn print(comptime fmt: []const u8, args: anytype) void {
    lockStdErr();
    defer unlockStdErr();
    const stderr = io.getStdErr().writer();
    nosuspend stderr.print(fmt, args) catch return;
}
```

print 함수를 사용해보자.

```zig
const world: *const [4]u8 = "World";

print("Hello, {s} {s}!\n", .{ worl, worl });
// Hello, Worl Worl!
```

### 숫자 출력

가변 변수를 변형하지 않으면 오류를 생성한다. (const 로 변경할 것을 권유함)

```zig
const constant: i32 = 5; // signed 32-bit
var variable: u32 = 5000; // unsigned 32-bit
variable += 1;

std.debug.print("{d}, {d}\n", .{ constant + 1, variable });
// 6, 5001
```

### `@as` 캐스팅을 이용한 정의

명시적인 타입 선언과 같다.

```zig
const inferred_constant = @as(i32, constant);
var inferred_variable = @as(u32, variable);
inferred_variable += 1;

std.debug.print("{d}, {d} => {d}, {d}\n", .{ constant, variable, inferred_constant, inferred_variable });
// 5, 5001 => 5, 5002
```

### undefined 설정

```zig
const a: i32 = undefined;
var b: u32 = undefined;
```

### unused 에러 대응하기 

`_` 을 사용하면 var 또는 const 변수 사용 여부를 무시하게 된다.

```zig
_ = 10;
```


## 2. [Arrays](https://zig.guide/language-basics/arrays)

array 의 len 필드를 통해서 배열의 길이를 알 수 있다.

```zig
const arr_a = [5]u8{ 'H', 'e', 'l', 'l', 'o' };
const arr_b = [_]u8{ 'W', 'o', 'r', 'l', 'd' };
const length_ab = arr_a.len + arr_b.len;

std.debug.print("{s}, {s}! ({d})\n", .{ arr_a, arr_b, length_ab });
// Hello, World! (10)
```

### 슬라이싱

`시작..끝` 표기로 배열의 일부 범위를 지정할 수 있다. 

```zig
const a = [_]i32{1, 2, 3, 4, 5};
const b = a[1..4];
var c = a[1..4];

b[2] = 5;  // <== 컴파일 오류
```

### const 와 var 

const 로 생성된 배열은 원소의 값을 바꿀 수 없다.

- b 는 `[]const i32` 로 정의된다. (immutable)
- `var` 로 생성된 c 는 `[]i32` 로 정의된다. (mutable)


## 9. Review

- 조금이면 어때. 무리하지 말고 작성한 만큼만 올리자!
- Zig 는 C 와 매우 흡사하다. 대신 위험성과 애매함을 해결하기 위한 다양한 도구를 포함하고 있다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }