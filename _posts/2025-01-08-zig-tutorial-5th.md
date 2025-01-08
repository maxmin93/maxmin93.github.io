---
date: 2025-01-08 00:00:00 +0900
title: Zig Tutorial - 5일차
categories: ["language","zig"]
tags: ["tutorial","5th-day"]
image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Zig_logo_2020.svg"
---

> Zig 언어 공부를 시작합니다. 설치부터 문법 및 간단한 응용까지 다룹니다.
{: .prompt-tip }

## 0. 튜토리얼 참고문서

- [ziglang 공식문서](https://ziglang.org/documentation/master/)
- [zig.guide](https://zig.guide/getting-started/hello-world)
- [Introduction to Zig](https://pedropark99.github.io/zig-book/)
- [Learning Zig 한글 번역판](https://faultnote.github.io/posts/learning-zig/)


## 1. 문자열

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

## 2. Zig Package Manager

1. `zip fetch --save [URL]` 을 이용해 라이브러리를 다운로드 한다.
2. `build.zig` 에 `addImport` 코드를 추가한다.
3. 소스코드에서 `@import` 지시자로 라이브러리를 불러와 사용한다.

이렇게 설명은 되어 있는데, 실제로 해보니 제대로 되지 않았다.

### 시도한 라이브러리들

- [ziglyph](https://codeberg.org/dude_the_builder/ziglyph)
- [zig-json](https://github.com/berdon/zig-json)
- [zig-sqlite](https://github.com/vrischmann/zig-sqlite)

### 라이브러리 설치

```bash
zig fetch --save https://codeberg.org/dude_the_builder/ziglyph/archive/v0.13.1.tar.gz

zig fetch --save https://codeload.github.com/berdon/zig-json/tar.gz/master

zig fetch --save git+https://github.com/vrischmann/zig-sqlite
```

File **build.zig.zon**

```zon
.ziglyph = .{
  .url = "https://codeberg.org/dude_the_builder/ziglyph/archive/v0.13.1.tar.gz",
  .hash = "12207831bce7d4abce57b5a98e8f3635811cfefd160bca022eb91fe905d36a02cf25",
},
.sqlite = .{
  .url = "git+https://github.com/vrischmann/zig-sqlite?ref=master#47a9c0d42ff5c083a9b04b04a5a1aeb0a777e153",
  .hash = "1220caab315c54e76dff7a60d8486c5fb4de216402d2efb6471763e2d49c194b4600",
},
```

File **build.zig**

```zig
const exe = ...

const ziglyph = b.dependency("ziglyph", .{
    .target = target,
    .optimize = optimize,
});
exe.root_module.addImport("ziglyph", ziglyph.module("ziglyph"));

const zigJson = b.dependency("zig-json", .{
    .target = target,
    .optimize = optimize
});
exe.root_module.addImport("json", zigJson.module("zig-json"));

const sqlite = b.dependency("sqlite", .{
    .target = target,
    .optimize = optimize,
});
exe.root_module.addImport("sqlite", sqlite.module("sqlite"));
```

이 중에 `zig-json` 만 로컬에 다운로드해서 사용하는데 성공했다.

- deps 디렉토리를 생성하고
- git clone 으로 직접 소스를 다운로드하고
- 라이브러리 소스 파일을 모듈로 등록시키고 사용할 수 있었다.

```zig
// build.zig

const json_module = b.addModule("json", .{
    .root_source_file = b.path("deps/zig-json/src/main.zig"),
});
exe.root_module.addImport("json", json_module);
```

### 샘플 코드

```bash
zip build run
# error:
# no module named 'sqlite' available within module root
# error: 
# no module named 'ziglyph' available within module root
```

#### [ziglyph](https://codeberg.org/dude_the_builder/ziglyph#using-the-ziglyph-namespace)

```zig
const ziglyph = @import("ziglyph");
const expect = @import("std").testing.expect;

test "ziglyph namespace" {
    const z = 'z';
    try expect(ziglyph.isLetter(z));
}
```

#### [zig-json](https://github.com/berdon/zig-json?tab=readme-ov-file#usage)

```zig
const json = @import("json");

pub fn main() !void {
    std.debug.print("Hello {s}!\n", .{"World"});

    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer _ = gpa.deinit();
    const allocator = gpa.allocator();

    const value = try json.parse(
        \\{
        \\  "foo": [
        \\    null,
        \\    true,
        \\    false,
        \\    "bar",
        \\    {
        \\      "baz": -13e+37
        \\    }
        \\  ]
        \\}
    , allocator);
    const bazObj = value.get("foo").get(4);

    bazObj.print(null);
    try std.testing.expectEqual(bazObj.get("baz").float(), -13e+37);

    defer value.deinit(allocator);
}
```

#### [zig-sqlite](https://github.com/vrischmann/zig-sqlite-demo/blob/master/src/main.zig)

```zig
const sqlite = @import("sqlite");

pub fn main() anyerror!void {
    var gpa = std.heap.GeneralPurposeAllocator(.{}){};
    defer if (gpa.deinit() == .leak) {
        std.debug.panic("leaks detected", .{});
    };

    var allocator = gpa.allocator();

    var db = try sqlite.Db.init(.{
        .mode = sqlite.Db.Mode{ .Memory = {} },
        .open_flags = .{ .write = true },
    });
    defer db.deinit();

    try db.exec("CREATE TABLE user(id integer primary key, age integer, name text)", .{}, .{});

    const user_name: []const u8 = "Vincent";

    // Insert some data
    try db.exec("INSERT INTO user(id, age, name) VALUES($id{usize}, $age{u32}, $name{[]const u8})", .{}, .{ @as(usize, 10), @as(u32, 34), user_name });
    try db.exec("INSERT INTO user(id, age, name) VALUES($id{usize}, $age{u32}, $name{[]const u8})", .{}, .{ @as(usize, 20), @as(u32, 84), @as([]const u8, "José") });
}
```


## 9. Review

- 패키지 설치가 이렇게 힘들어서야 제대로 사용할 수가 없네. 내일 다시 해보자.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }