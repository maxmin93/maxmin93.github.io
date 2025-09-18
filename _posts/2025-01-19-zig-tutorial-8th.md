---
date: 2025-01-19 00:00:00 +0900
title: Zig Tutorial - 8일차
categories: [Language, Zig]
tags: [wasm, wasi]
image: "https://upload.wikimedia.org/wikipedia/commons/b/b3/Zig_logo_2020.svg"
---

> Zig 언어 공부를 시작합니다. 설치부터 문법 및 간단한 응용까지 다룹니다.
{: .prompt-tip }

## 0. 튜토리얼 참고문서

- [ziglang 공식문서](https://ziglang.org/documentation/master/)
- [zig.guide](https://zig.guide/getting-started/hello-world)
- [Introduction to Zig](https://pedropark99.github.io/zig-book/)
- [Learning Zig 한글 번역판](https://faultnote.github.io/posts/learning-zig/)


## 1. 커맨드라인 Args 출력하기

표준 입력의 args 를 출력하는 간단한 코드이다.

참고 : [피보나치 샘플 소스](https://enarx.dev/docs/WebAssembly/Zig)

```zig
// wasi_args.zig

const std = @import("std");

pub fn main() !void {
    // 메모리 할당자
    const alloc: std.mem.Allocator = std.heap.page_allocator;

    // args 처리에 alloc 연결
    const args = try std.process.argsAlloc(alloc);
    defer alloc.free(args);

    // 표준 출력 핸들러
    const stdout = std.io.getStdOut();
    defer stdout.close();

    // writer 별칭 선언
    const out = stdout.writer();

    try out.print("Print args example: len={}\n", .{args.len});

    // 입력된 args 를 모두 출력
    for (args, 0..) |arg, i| {
        try out.print("{}: {s}\n", .{ i, arg });
    }
}
```

#### 원래 참고하려던 [WASI 예제](https://ziglang.org/documentation/master/#WASI)

소스 레벨에서 오류가 나서 빌드 실패! 그래서 다른 샘플 코드를 뜯어와 만든거다.

```zig
// 오류: 작동안됨

const std = @import("std");

pub fn main() !void {
    var general_purpose_allocator: std.heap.GeneralPurposeAllocator(.{}) = .init;
    const gpa = general_purpose_allocator.allocator();
    const args = try std.process.argsAlloc(gpa);
    defer std.process.argsFree(gpa, args);

    for (args, 0..) |arg, i| {
        std.debug.print("{}: {s}\n", .{ i, arg });
    }
}
```

빌드하면 `std/heap/general_purpose_allocator.zig` 에서 오류가 뜬다. 

```console
$ zig build-exe src/wasi_args_old.zig -target wasm32-wasi
src/wasi_args_old.zig:4:77: error: expected type 'heap.general_purpose_allocator.GeneralPurposeAllocator(.{ .stack_trace_frames = 0, .enable_memory_limit = false, .safety = true, .thread_safe = false, .MutexType = null, .never_unmap = false, .retain_metadata = false, .verbose_log = false })', found '@TypeOf(.enum_literal)'
    var general_purpose_allocator: std.heap.GeneralPurposeAllocator(.{}) = .init;
```

### 실행 및 빌드

`zig run` 명령에 args 를 추가하려면 `--` 다음에 붙이면 된다. [(출처)](https://stackoverflow.com/a/72558768)

```console
$ zig run src/wasi_args.zig -- 123 hello
Print args example: len=3
0: /Users/bgmin/.cache/zig/o/fcdbc87fdd24476dce088641df04e9d8/wasi_args
1: 123
2: hello
```

#### 빌드하여 실행하기

`zig build-exe` 명령으로 실행 가능한 binary 를 생성하여 실행한다.

- 빌드시 `-O` 최적화 옵션을 사용하면 빠르게 또는 작게 만들기 등을 할 수 있다.
- `-O ReleaseSmall` 사용시 1/10 수준으로 크기가 작아진다.

```console
$ zig build-exe src/wasi_args.zig

$ ./wasi_args 123 hello
Print args example: len=3
0: ./wasi_args
1: 123
2: hello

$ ls -l
797K    wasi_args  # 기본 빌드
52K     wasi_args  # ReleaseSmall 옵션 빌드

$ zig build-exe src/wasi_args.zig -O ReleaseSmall
```


## 2. [피보나치 샘플 소스](https://enarx.dev/docs/WebAssembly/Zig)

표준 입력에서 입력값을 받아 피보나치 수열 결과를 출력하는 예제이다.

- fibonacci : 함수 리커시브
- print_fibonacci : fibonacci 함수를 호출하고 출력
  - 파라미터 w : 출력 handler
  - 파라미터 s : 입력 문자열(arg)

```zig
const std = @import("std");

fn fibonacci(i: u64) u64 {
    if (i <= 1) return i;
    return fibonacci(i - 1) + fibonacci(i - 2);
}

fn print_fibonacci(w: anytype, s: []const u8) !void {
    const i = try std.fmt.parseUnsigned(u64, s, 10);
    try w.print("Fibonacci sequence number at index {d} is {d}\n", .{i, fibonacci(i)});
}

pub fn main() !void {
    // 메모리 할당자 선언
    const alloc: std.mem.Allocator = std.heap.page_allocator;

    // 표준 입력 핸들러 (메모리 연결)
    var args = try std.process.argsAlloc(alloc);
    defer alloc.free(args);

    // 표준 출력 핸들러
    const stdout = std.io.getStdOut();
    defer stdout.close();

    // 쓰기를 위한 함수 (alias)
    const out = stdout.writer();

    try out.print("Zig - Fibonacci sequence example\n", .{});

    // args 만 슬라이싱 하기 (0번째는 binary 이름)
    const indexes = args[1..];

    // 실행시 args 가 주어진 경우
    if (indexes.len > 0) {
        for (indexes) |arg| {
            try print_fibonacci(out, arg);
        }
    } 
    // args 가 없으면 표준 입력에서 받아온다
    else {
        // 표준 입력 핸들
        const stdin = std.io.getStdIn();
        defer stdin.close();

        try out.print("Enter a non-negative number:\n", .{});
        var buf: [19]u8 = undefined;
        if (try stdin.reader().readUntilDelimiterOrEof(&buf, '\n')) |arg| {
            try print_fibonacci(out, arg);
        } else {
            std.debug.print("failed to read from stdin", .{});
            std.process.exit(1);
        }
    }
}
```

### 빌드 및 실행

args 를 바로 추가하여 실행하거나, 표준 입력으로 받아서 실행할 수 있다.

```console
$ zig run src/fibonacci.zig -- 10
Zig - Fibonacci sequence example
Fibonacci sequence number at index 10 is 55

$ zig run src/fibonacci.zig      
Zig - Fibonacci sequence example
Enter a non-negative number:
10
Fibonacci sequence number at index 10 is 55

# 바이너리 빌드
$ zig build-exe src/fibonacci.zig -O ReleaseFast

$ ./fibonacci 10       
Zig - Fibonacci sequence example
Fibonacci sequence number at index 10 is 55

$ ./fibonacci   
Zig - Fibonacci sequence example
Enter a non-negative number:
10
Fibonacci sequence number at index 10 is 55
```

#### [WASM 빌드](https://ziglang.org/documentation/master/#WASI)

`wasm` 바이너리를 WASM 런타임 `wasmtime` 으로 실행할 수 있다.

- `wasmtime` 는 `brew install wasmtime` 으로 설치
- 참고: [wasmtime Introduction](https://docs.wasmtime.dev/introduction.html)

```console
# wasm 바이너리 빌드
$ zig build-exe src/fibonacci.zig -target wasm32-wasi

$ wasmtime fibonacci.wasm 10                       
Zig - Fibonacci sequence example
Fibonacci sequence number at index 10 is 55

$ wasmtime fibonacci.wasm   
Zig - Fibonacci sequence example
Enter a non-negative number:
10
Fibonacci sequence number at index 10 is 55
```

#### WASI 란? (WebAssembly System Interface)

WebAssembly(WASM) 모듈이 브라우저 외부 환경에서 시스템 리소스에 접근할 수 있게 해주는 표준화된 시스템 인터페이스입니다.

- 크로스플랫폼 실행 (클라우드, 임베디드 장치 등)
  - 시스템 리소스에 대한 표준화된 접근
  - OS 독립성
- 서버 사이드 활용

> 참고 : [WASM-Freestanding](https://ziglang.org/documentation/master/#Freestanding)

표준 인터페이스인 WASI 를 사용하지 않고, 웹브라우저와 nodejs 만 사용한다면 OS 와 상관없이 간단하게 WASM 을 작성할 수 있다. 다음 문서에서 작성해 보자.


## 9. Review

- Zig 를 공부하려던 이유는 WASM 때문이었다. zig 가 제일 최적화가 잘 될거 같아서였다. 그런데 이것 말고도 `TinyGo` 라는게 있다. 개발 생산성 측면에서는 TinyGo 가 나을듯 싶다.
- WASI 를 이용한 WASM 을 크로스플랫폼 런타임에서 실행할 수 있다면, 이 또한 node 같은 플랫폼이 또 생긴다는 말 같은데. 
- wasmtime 은 Rust 언어쪽 문서에서도 자주 나온다. 이쪽도 wasm 에 진심이라서.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }