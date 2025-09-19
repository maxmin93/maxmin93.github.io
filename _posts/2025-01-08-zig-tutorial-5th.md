---
date: 2025-01-08 00:00:00 +0900
title: Zig Tutorial - 5일차
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


## 1. Zig Package Manager

1. `zip fetch --save [URL]` 을 이용해 라이브러리를 다운로드 한다.
2. `build.zig` 에 `addImport` 코드를 추가한다.
3. 소스코드에서 `@import` 지시자로 라이브러리를 불러와 사용한다.

이렇게 설명은 되어 있는데, 실제로 해보니 제대로 되지 않았다.

### 시도한 라이브러리들

- [ziglyph](https://codeberg.org/dude_the_builder/ziglyph) : OK
- [zig-json](https://github.com/berdon/zig-json) : 로컬로 받아서 성공
- [zig-sqlite](https://github.com/vrischmann/zig-sqlite) 안됨! (소스 문제?)

### 라이브러리 설치

```bash
zig fetch --save https://codeberg.org/dude_the_builder/ziglyph/archive/v0.13.1.tar.gz

zig fetch --save https://codeload.github.com/berdon/zig-json/tar.gz/master

zig fetch --save git+https://github.com/vrischmann/zig-sqlite
```

#### File **build.zig.zon**

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

#### File **build.zig**

```zig
const exe = ...

// ziglyph 등록
const ziglyph = b.dependency("ziglyph", .{
    .target = target,
    .optimize = optimize,
});
exe.root_module.addImport("ziglyph", ziglyph.module("ziglyph"));

// zig-json 등록
// deps 아래에 zig-json 을 다운로드 받아 path 를 연결했다
const json_module = b.addModule("json", .{
    .root_source_file = b.path("deps/zig-json/src/main.zig"),
});
exe.root_module.addImport("json", json_module);

// zig-sqlite 등록
const sqlite = b.dependency("sqlite", .{
    .target = target,
    .optimize = optimize,
});
exe.root_module.addImport("sqlite", sqlite.module("sqlite"));
```

#### 참고 : `zig-json` 빌드 에러

`zig fetch` 로 다운로드 후, 코드를 작성해 build 하면 error 가 나온다.

```console
$ zig build run                  
build.zig:6:71: error: no field named 'path' in union 'Build.LazyPath'
const module = b.addModule("zig-json", .{ .root_source_file = .{ .path = "src/main.zig" } });
```

`zig-json` 의 [소스 파일](https://github.com/berdon/zig-json/blob/1d7abd208fa9f73a1664ebad300ed8e703c89406/build.zig#L11)을 살펴보니

```zig
const lib = b.addStaticLibrary(.{
    .name = "zig-json",
    .root_source_file = .{ .path = "src/main.zig" },
    .target = target,
    .optimize = optimize,
});
```

이런 표기 방식은 구버전이라 안되는거 같다. (참고: [ziggit.dev](https://ziggit.dev/t/random-build-errors/5638/2))

```zig
// .root_source_file = .{ .path = "src/hello.zig" },
.root_source_file = b.path("src/hello.zig"),  // OK!
```

`zig-json` 소스를 로컬에 다운로드해서 사용하는데 성공했다.

- deps 디렉토리를 생성하고
- git clone 으로 직접 소스를 'deps/zig-json' 에 다운로드하고
- 라이브러리 소스 파일을 모듈로 등록시켜서 사용할 수 있었다.

### 샘플 코드

#### [ziglyph](https://codeberg.org/dude_the_builder/ziglyph#using-the-ziglyph-namespace) : 정상 작동

```zig
const ziglyph = @import("ziglyph");
const expect = @import("std").testing.expect;

pub fn main() !void {
    std.debug.print("Hello {s}!\n", .{"World"});

    const z = 'z';
    std.debug.print("ziglyph: '{c}' is isLetter = {}!\n", .{ z, ziglyph.isLetter(z) });
}

// 출력
// Hello World!
// ziglyph: 'z' is isLetter = true!
```

그러나, test 블럭에서 실행하면 ziglyph 를 못찾아서 오류가 난다. test 수행을 위한 별도의 라이브러리 등록 절차가 필요한 것 같다.

- exe 의 root_module 에 등록한 것으로 봐서 test 와는 관련 없는듯


#### [zig-json](https://github.com/berdon/zig-json?tab=readme-ov-file#usage) : 정상 작동

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

// 출력
// Hello World!
// {
//   "baz": -130000000000000000000000000000000000000
// }
```

#### [zig-sqlite](https://github.com/vrischmann/zig-sqlite-demo/blob/master/src/main.zig) : 실패!

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

    // 생략..
}
```

패키지 소스가 잘못된 것 같다. 뭔가 구버전 스타일 문법이 들어간듯

```console
$ zig build run 
sqlite.zig:36:26: error: no field named 'struct' in enum '@typeInfo(builtin.Type).Union.tag_type.?'
    return type_info == .@"struct";
                        ~^~~~~~~~~
```

## 9. Review

- zig 언어 자체는 안정화 상태라는데, 패키지들은 그렇지 않은가 보다.
- 계속 참고문서들을 살펴보자. (뭔가 판단하기엔 성급하지)


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }