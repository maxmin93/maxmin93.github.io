---
date: 2025-01-10 00:00:00 +0900
title: Zig Tutorial - 6일차
description: Zig 언어 공부를 시작합니다. 설치부터 문법 및 간단한 응용까지 다룹니다.
categories: [Language, Zig]
tags: []
image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Zig_logo_2020.svg"
---

## 0. 튜토리얼 참고문서

- [ziglang 공식문서](https://ziglang.org/documentation/master/)
- [zig.guide](https://zig.guide/getting-started/hello-world)
- [Introduction to Zig](https://pedropark99.github.io/zig-book/)
- [Learning Zig 한글 번역판](https://faultnote.github.io/posts/learning-zig/)


## 1. [Functions](https://zig.guide/language-basics/functions)

- 함수는 이름, 파라미터, 반환 타입으로 선언하고
- 재귀호출(recursive call)이 가능하다.

```console
$ touch src/fn-exam.zig     # 새로운 zig 파일을 만들고
$ zig test src/fn-exam.zig  # 테스트 수행
All 2 tests passed.
```

별도의 zig 파일에 functions 예제 파일을 작성하고 실행해보았다.

```zig
// src/fn-exam.zig

const std = @import("std");
const testing = @import("std").testing;

pub fn main() !void {}

fn addFive(x: u32) u32 {
    return x + 5;
}
test "function" {
    const y = addFive(0);
    try testing.expect(@TypeOf(y) == u32);
    try testing.expect(y == 5);
}

fn fibonacci(n: u16) u16 {
    if (n == 0 or n == 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}
test "function recursion" {
    const x = fibonacci(10);
    std.debug.print("fibonacci = {d}\n", .{x});
    try testing.expect(x == 55);
}

// 출력
// fibonacci = 55
```

## 2. [Defer](https://zig.guide/language-basics/defer)

- 주어진 코드 또는 블록의 범위가 끝날 때 실행된다.
- 여러개의 defer 가 있을 때는 역순으로 실행된다.

비슷한 기능으로 `errdefer` 가 있는데, 오류가 반환될 때만 실행된다.

```zig
test "defer" {
    var x: i16 = 5;
    {
        defer x += 2;
        try testing.expect(x == 5);
    }
    std.debug.print("defer1 : x = {d}\n", .{x});
    try testing.expect(x == 7);
}

test "multi defer" {
    var x: f32 = 5;
    {
        defer x += 2;
        defer x /= 2;
    }
    std.debug.print("defer2 : x = {d}\n", .{x});
    try testing.expect(x == 4.5);
}

// 출력
// defer1 : x = 7
// defer2 : x = 4.5  # float 도 {d}로 출력한다
```

## 3. 사용자 정의 [Errors](https://zig.guide/language-basics/errors)

enum 과 같이 error 집합을 정의한다.

```zig
const FileOpenError = error{
    AccessDenied,
    OutOfMemory,
    FileNotFound,
};
const AllocationError = error{OutOfMemory};

test "coerce error from a subset to a superset" {
    const err: FileOpenError = AllocationError.OutOfMemory;
    std.debug.print("error is OutOfMemory = {}\n", .{err == FileOpenError.OutOfMemory});
    try expect(err == FileOpenError.OutOfMemory);
}

# 출력
# error is OutOfMemory = true
```

## 4. [Runtime Safety](https://zig.guide/language-basics/runtime-safety)

- 런타임 세이프티 기능이 꽤 많은 범위의 오류를 찾아낸다. (안전성)
- 만일 안전성 검사 기능을 끄려면, `@setRuntimeSafety(false)` 사용한다
  - (주석을 풀면) 아무일도 없다는 듯이 그냥 실행된다.

```zig
test "out of bounds, no safety" {
    // @setRuntimeSafety(false);
    const a = [3]u8{ 1, 2, 3 };
    var index: u8 = 5;
    const b = a[index];

    _ = b;
    index = index;
}

// 출력
// thread 18456905 panic: index out of bounds: index 5, len 3
//    const b = a[index];
```

## 5. [Pointers](https://zig.guide/language-basics/pointers)

- 포인터 변수는 `*T` 타입으로 선언하고,
- 주소 참조는 `&V` 이고,
- 주소에 대한 역참조는 `V.*` 로 한다.
- 포인터 값은 0 또는 null 이 될 수 없다 (안전성 검사)
- const 값에 대한 역참조 변경은 허용되지 않는다. (안전성 검사)

```zig
fn increment(num: *u8) void {
    num.* += 1;
}

test "pointers" {
    var x: u8 = 2;
    increment(&x);
    std.debug.print("pointers : x = {d}\n", .{x});
    try testing.expect(x == 3);
}

// 출력
// pointers : x = 3

test "const pointers" {
    const x: u8 = 1;
    var y = &x;       // error: 변경이 없어 const 사용 권고
    y.* += 1;         // error: cannot assign to constant
}
```

포인터 크기는 `@sizeOf(*u8)` 은 **8 bytes** (64bit) 이다.

### [멀티 아이템 포인터](https://zig.guide/language-basics/many-item-pointers)

- 배열 등의 여러 아이템을 포함하는 변수에 대한 포인터이고
- 미리 아이템의 크기를 알아야 주소 계산이 가능하다. (ex: `u8`)

```zig
fn doubleAllManypointer(buffer: [*]u8, byte_count: usize) void {
    var i: usize = 0;
    // 배열의 내용을 `2`로 채운다
    while (i < byte_count) : (i += 1) buffer[i] *= 2;
}

test "many-item pointers" {
    // `1`로 채워진 100 크기의 배열 생성
    var buffer: [100]u8 = [_]u8{1} ** 100;
    const buffer_ptr: *[100]u8 = &buffer;  // 시작 포인터

    const buffer_many_ptr: [*]u8 = buffer_ptr;  // 포인터 배열
    doubleAllManypointer(buffer_many_ptr, buffer.len);
    // `2`로 잘 채워졌는지 모두 검사
    for (buffer) |byte| try expect(byte == 2);

    // 포인터 배열의 첫번째 값(주소)가 시작 포인터와 같은지 비교(?)
    const first_elem_ptr: *u8 = &buffer_many_ptr[0];
    const first_elem_ptr_2: *u8 = @ptrCast(buffer_many_ptr);
    try expect(first_elem_ptr == first_elem_ptr_2);
}
```

잘 이해가 안간다. 또 다른 예제가 필요하다.


## 9. Review

- zig 의 강력한 안전성 검사 기능들이 하나둘씩 나온다. 좋다.
- 옛날 학창시절에 C 배울 때에도 포인터 때문에 고생한 기억이 난다. 역시나다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }