---
date: 2025-01-11 00:00:00 +0900
title: Zig Tutorial - 7일차
categories: [Language, Zig]
tags: [data-types]
image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Zig_logo_2020.svg"
---

> Zig 언어 공부를 시작합니다. 설치부터 문법 및 간단한 응용까지 다룹니다.
{: .prompt-tip }

## 0. 튜토리얼 참고문서

- [ziglang 공식문서](https://ziglang.org/documentation/master/)
- [zig.guide](https://zig.guide/getting-started/hello-world)
- [Introduction to Zig](https://pedropark99.github.io/zig-book/)
- [Learning Zig 한글 번역판](https://faultnote.github.io/posts/learning-zig/)


## 1. [Slices](https://zig.guide/language-basics/slices)

- 슬라이스 표현은 `m..n` 으로 한다. (m 에서 n 까지)
- m 은 생략할 수 없다. (n 생략시 end 까지 포함)

```zig
const std = @import("std");
const testing = @import("std").testing;

pub fn main() !void {}

// value 합산하기
fn total(values: []const u8) usize {
    var sum: usize = 0;
    for (values) |v| sum += v;
    return sum;
}

test "slices" {
    const array = [_]u8{ 1, 2, 3, 4, 5 };  // 타입: [5]u8
    const slice = array[0..3];  // 타입: *const [3]u8

    // 배열을 출력하려면 format 으로 any 를 사용한다
    std.debug.print("slices: array = {any}\n", .{ array[0..] });
    std.debug.print("slices: slice = {any} ({any})\n", .{ slice, @TypeOf(slice) });
    try testing.expect(total(slice) == 6);
}

// 출력
// slices: array = { 1, 2, 3, 4, 5 }
// slices: slice = { 1, 2, 3 } (*const [3]u8)
```

#### 참고: 포인터 타입들의 비교

- `*T` : 역참조 가능 (`ptr.*`)
- `*[N]T` : 배열의 포인터, 역참조 불가, 인덱싱 가능, 슬라이싱 가능
- `[]T` : 배열, 역참조 불가, 인덱싱 가능, 슬라이싱 가능
  - N 이 지정되지 않아 크기 모름 (런타임)
- `[*]T` : 포인터의 배열, 역참조 불가, 인덱싱 가능, 슬라이싱 가능
  - `ptr+1`, `ptr-1` 같은 주소에 대한 연산 가능


## 2. [Enums](https://zig.guide/language-basics/enums)

- 타입을 정하고, 태그에 값을 지정할 수 있다.
- 내부에 struct 처럼 멤버 함수를 작성할 수 있다.

```zig
const AlphabetValue = enum(u4) { zero = 0, one = 11, two };

test "enum ordinal value" {
    try testing.expect(@intFromEnum(AlphabetValue.zero) == 1);
    try testing.expect(@intFromEnum(AlphabetValue.one) == 11);
    try testing.expect(@intFromEnum(AlphabetValue.two) == 12);
}
```

## 3. 구조체 [Structs](https://zig.guide/language-basics/structs)

- 멤버 필드를 가진다. `.{}` 로 전달할 수도 있다.
  - `var thing: Stuff = .{ .x = 10, .y = 20 };`
- enum 과 마찬가지로 함수와 변수도 가질 수 있다.

```zig
const Vec3 = struct { x: f32 = 0, y: f32 = 0, z: f32 = 0 };

test "struct usage" {
    const my_vector = Vec3{
        .x = 50,
        .y = 100,
        // .z = 50,
    };
    std.debug.print("struct: my_vector = {}\n", .{my_vector});
    // _ = my_vector;
}

// 출력
// struct: my_vector = Vec3{ .x = 5e1, .y = 1e2, .z = 0e0 }
```

### 멤버 함수

구조체는 구조체에 대한 포인터가 주어지면 필드에 액세스할 때 한 단계의 역참조가 자동으로 수행된다.

- swap 함수에서 포인터인 self 에 대해 역참조 없이 .x 와 .y 를 사용한다.
  - 구조체가 아닌, 기본 타입인 경우에는 `ptr.*` 으로 역참조해서 연산했다.

```zig
const Stuff = struct {
    x: i32,
    y: i32,

    // 인수가 없으면, 자기 자신을 인자로 받는다
    fn swap(self: *Stuff) void {
        const tmp = self.x;
        self.x = self.y;
        self.y = tmp;
    }
};

test "automatic dereference" {
    var thing = Stuff{ .x = 10, .y = 20 };

    thing.swap();  // 자체 멤버 함수 호출
    try testing.expect(thing.x == 20);
    try testing.expect(thing.y == 10);
    std.debug.print("struct: thing = {}\n", .{thing});

    Stuff.swap(&thing);  // 참조 연산자를 붙인다 (포인터 전달)
    std.debug.print("struct: swaped = {}\n", .{thing});
}

// 출력
// struct: thing = Stuff{ .x = 20, .y = 10 }
// struct: swaped = Stuff{ .x = 10, .y = 20 }
```

## 4. 유니온 [Unions](https://zig.guide/language-basics/unions)

struct 와 유사하지만, 멤버 필드 중 하나만 사용 가능하다. (활성화)

```zig
const Result = union {
    int: i64,
    float: f64,
    bool: bool,
};

test "simple union" {
    var result = Result{ .int = 1234 };
    result.float = 12.34;  // <== 비활성화된 필드 접근 에러!!
}
```

union 을 enum 과 연결하여 어떤 멤버와 연결되어 있는 제어할 수 있다.

```zig
const Tag = enum { a, b, c };

const Tagged = union(Tag) { a: u8, b: f32, c: bool };

test "switch on tagged union" {
    var value = Tagged{ .b = 1.5 };

    // value 의 포인터를 페이로드 캡쳐(||) 하여 값에 접근할 수 있다
    switch (value) {
        .a => |*byte| byte.* += 1,
        .b => |*float| float.* *= 2,
        .c => |*b| b.* = !b.*,
    }
    try expect(value.b == 3);
}
```

참고: [Payload Captures](https://zig.guide/language-basics/payload-captures/) `|value|` 무언가의 값을 캡쳐하기


## 9. Review

- 조금씩 복잡해진다. 왜 저렇게 만들었는지 의문이지만 나보다 머리 좋은 사람들이 만든 것이니 이유가 있겠지.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }