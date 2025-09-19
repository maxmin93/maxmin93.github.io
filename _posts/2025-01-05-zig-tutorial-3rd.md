---
date: 2025-01-05 00:00:00 +0900
title: Zig Tutorial - 3일차
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


## 1. 제어문

### [If 문](https://zig.guide/language-basics/if)

test 블록을 이용한 예제

```zig
const expect = @import("std").testing.expect;

test "if statement" {
    const a = true;
    var x: u16 = 0;
    if (a) {
        x += 1;
    } else {
        x += 2;
    }
    try expect(x == 1);
}
```

if 문 블록을 한 문장으로 축약할 수도 있다.

```zig
x += if (a) 1 else 2;
```

> test 실행 방법
{: .prompt-warning }

```bash
zig build test
# 테스트가 정상이면 오류 없이 종료
```

#### [또 다른 if 예제](https://pedropark99.github.io/zig-book/Chapters/03-structs.html#ifelse-statements)

- `try` 키워드를 사용하려면 `!void` 리턴 타입을 정의해야 한다.
- 이런 번거로움 없이 출력하려면 `std.debug.print` 가 최선이다.

```zig
const std = @import("std");
const stdout = std.io.getStdOut().writer();

pub fn main() !void {
    const x = 5;
    if (x > 10) {
        try stdout.print(
            "x > 10!\n", .{}
        );
    } else {
        try stdout.print(
            "x <= 10!\n", .{}
        );
    }
}
```

### [switch 문](https://pedropark99.github.io/zig-book/Chapters/03-structs.html#sec-switch)

`if` 보다 빡빡한 조건을 다루기 때문에 `else` 키워드를 사용해서라도 모든 경우를 포함해야 한다. 그렇지 않으면 컴파일 타임 오류가 발생한다.

- 에러 메시지 `switch must handle all possibilities`

```zig
const stdout = std.io.getStdOut().writer();
const Role = enum { SE, DPE, DE, DA, PM, PO, KS };

pub fn main() !void {
    try switch_exam();
}

pub fn switch_exam() !void {
    var area: []const u8 = undefined;
    const role = Role.SE;
    switch (role) {
        .PM, .SE, .DPE, .PO => {
            area = "Platform";
        },
        .DE, .DA => {
            area = "Data & Analytics";
        },
        .KS => {
            area = "Sales";
        },
        else => {},  // 모든 경우를 다루어서 없어도 됨
    }
    try stdout.print("{s}\n", .{area});
}
```


## 2. 반복문

### [while 문](https://zig.guide/language-basics/while-loops)

- 조건식에 이어 연속 실행 문장 `i += 1` 을 붙일 수 있고
- continue 와 break 명령을 사용할 수 있다.

```zig
test "while with continue expression" {
    var sum: u8 = 0;
    var i: u8 = 1;
    while (i <= 10) : (i += 1) {
        if (i == 2) continue;
        if (i == 8) break;
        sum += i;
    }
    std.debug.print("i = {d}, sum = {d}\n", .{ i, sum });
    try expect(sum != 55);
}

// 출력
// i = 8, sum = 26
```

### [For 문](https://zig.guide/language-basics/for-loops)

- string 같은 반복 대상이 있고, `0..` 처럼 시작 위치를 지정할 수 있다.
- character 은 반복시 액세스 되는 값이고, index 는 인덱스를 지정

```zig
test "for" {
    //character literals are equivalent to integer literals
    const string = [_]u8{ 'a', 'b', 'c' };

    for (string, 0..) |character, index| {
        std.debug.print("character = {c}, index = {d}\n", .{ character, index });
    }

    for (string) |character| {
        _ = character;
    }

    for (string, 0..) |_, index| {
        _ = index;
    }

    for (string) |_| {}
}

// 출력
// character = a, index = 0
// character = b, index = 1
// character = c, index = 2
```


## 9. Review

- [Learning Zig 한글 번역판](https://faultnote.github.io/posts/learning-zig/) 을 먼저 정독해보는 것이 편하겠다.
- 이상한 구분자 기호들이 사용되어서 눈에 거슬리는데, 익숙해져야 할듯

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }