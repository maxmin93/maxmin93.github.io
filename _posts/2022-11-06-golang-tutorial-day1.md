---
date: 2022-11-06 00:00:00 +0900
title: Go 언어 배우기 - 1일차 개요, 특징
description: Go 언어의 기본적인 내용과 다른 언어와 대비해 특징적인 기능 위주로 요약해본다. (1일차)
categories: [Language, Go]
tags: [1st-day]
image: "https://images.velog.io/images/milkcoke/post/2e6493d9-ef2a-4116-91bc-e257ca9af7ec/golang_icon.jpg"
---

> 목록
{: .prompt-tip }

- [Go 언어 배우기 - 1일차 개요, 특징](/posts/golang-tutorial-day1/) &nbsp; &#10004;
- [Go 언어 배우기 - 2일차 문법, 고루틴](/posts/golang-tutorial-day2/)
- [Go 언어 배우기 - 3일차 GIN, GORM](/posts/golang-tutorial-day3/)
- [Go 언어 배우기 - 4일차 유틸리티 코드](/posts/golang-tutorial-day4/)
- [Go 언어 배우기 - 5일차 Go Fiber API](/posts/golang-tutorial-day5/)

## 1. Go 언어 개요

일단 첫 소감은 C 언어 사용자라면 쉽게 접근할 수 있지 않나 싶다. C 언어를 대체하려고 만든 것인지, 특히 포인터와 레퍼런스 기호가 나오고 struct 타입이 반갑다. 

### 1) 언어적 특징

- ';' 같은 문장 종결 기호가 필요 없다
- 강한 타입 선언이 필요한 언어, 하지만 대부분 타입추론에 의존 가능
- Java 와 비교되는 빠른 컴파일 성능과 더 빠른 실행 성능
- 객체지향을 지원하지 않는다 : class 없음
- 대소문자를 구분한다. ex) 변수 hello != 변수 Hello

> 포인터(de-reference) `*`, 레퍼런스(reference) `&`

```go
type Thing struct {
  Comment string
  ID     int
}

func NewThing(someParameter string) *Thing {
    return &Thing{someParameter, 33} // <- 33: default value
}

a := NewThing("foo")
b := &Thing{"foo", 33}

fmt.Println(*a)  // {foo 33}
fmt.Println(*b)  // {foo 33}

if *a != *b {panic("not equalt")}
```

### 2) 네이밍 규칙 (이름 표기법)

참고 : [Golang 에서의 명명 규칙](https://blog.billo.io/devposts/golang_naming_convention/#:~:text=%EA%B8%B0%EB%B3%B8%EC%A0%81%EC%9C%BC%EB%A1%9C%2C%20Go%EC%97%90%EC%84%9C%20%EB%91%90,%ED%98%95%ED%83%9C%EB%A1%9C%20%EB%B6%99%EC%97%AC%EC%84%9C%20%EC%82%AC%EC%9A%A9%ED%95%9C%EB%8B%A4.&text=%EB%A7%8C%EC%95%BD%20URL%2C%20IP%2C%20NATO%20%EC%B2%98%EB%9F%BC,%EB%A1%9C%20%EC%9D%BC%EC%A0%95%ED%95%98%EA%B2%8C%20%EC%82%AC%EC%9A%A9%ED%95%B4%EC%95%BC%20%ED%95%9C%EB%8B%A4.)

#### 변수/함수 : 알파벳으로 시작, 단어 결합시 낙타 표기법 권장

- 첫 문자가 소문자면 private 사용, 대문자면 public 사용 가능
  + ex) internalFunc(), ExternalFunc()

- `_` 으로 시작할 수 없음 (키워드와 혼동)

- 이니셜/줄임말 단어의 경우, 대문자나 소문자로 일정하게 사용
  + ex) `IP`를 `Ip`처럼 표기하지 말것

- 상수(const) 선언시 대문자보다 소문자 추천
  + ex) MAX_VALUE 보다는 maxValue 권장

#### 패키지 : 디렉토리의 `base name` 과 일치

- base name : 마지막 디렉토리 이름

#### 그 외 규칙들

- interface 에 메서드가 하나일 경우 '-er' (행위자) 어미 사용
  + ex) Read() => Reader 인터페이스, Close() => Closer 인터페이스

### 3) 키워드와 연산자

![Golang keywords](https://miro.medium.com/max/742/1*BmhM5w3Lp-jCwCn5R97JKA.png){: width=600}

#### 눈여겨볼 키워드

- `defer` : 함수 실행시 블록 마지막 순서에 실행 (지연)
  + 파이썬의 `with` 절 처럼 사용 가능, ex) 종료시 파일 닫기

- `interface` : 공통 함수들의 집합 타입 => 베이스 클래스 기능
- `map` : 파이썬의 dict 와 유사
- `go` : 함수를 고루틴으로 실행
- `chan` : 고루틴에서 값을 주고 받는 채널 (context 변수)
  + 채널에서 값을 읽을 때는 `<-`(채널) 연산자 사용
- `select` : 고루틴에서 채널 이벤트별 분기 처리 문장 (+ case)
- `goto` : C 언어의 goto 문과 유사 (라벨 위치로 제어 이동)
- `range` : 파이썬의 (for ... in) enumerate 와 유사 (인덱스, 값)
- `fallthrough` : switch 문에서 다음 case 절까지 실행 (제어 통과)
  + 참고 : 각 case 절에 break 문을 명시할 필요 없음 (기본)
- `_` : 파이썬의 anything 과 유사

> struct 비교 : '==' 연산자 사용

```go
// Creating a structure
type Author struct {
    name      string
    language  string
    Particles int
}

// Creating variables of Author structure
a1 := Author{
    name:      "Moana",
    language:  "Python",
    Particles: 38,
}

a2 := Author{"Moana","Python",38}

a3 := Author{
    language:  "Python",
    Particles: 38,
}

// Checking equality
if a1 != a2 { panic("Variable a1 is not equal to a2") }
if a2 != a3 { panic("Variable a2 is not equal to a3") }
```

#### 특별한 연산자

- `:=` 파이썬의 walrus 연산자와 유사 (선언 + 대입)
- `*` 데이터의 포인터 수신 (`->` 구별없이 `.`만 사용하면 됨)
- `&` 데이터의 포인터 전달
- `<-` (고루틴 context의 변수인) 채널 읽기
- `변수++` 증감 연산자 (후위표기법만 가능) 
- `...` 파이썬의 Spread syntax (...) 와 유사 (코드 간소화)
  + Spread syntax : 반복 구절의 생략과 참조 데이터의 언패킹

```go
func Greeting(prefix string, who ...string) { /* ... */ }

// 반복적 변수를 재사용
s := []string{"James", "Jasmine"}
Greeting("goodbye:", s...)

// 원소 개수에 맞는 크기 생성
a := [...]string{"a", "b", "c"}
```

> 참고 : 자바스크립트, 파이썬의 Spread syntax (...) 

javascript 예제

```js
function sum(x, y, z) {
  return x + y + z;
}

const numbers = [1, 2, 3];

console.log(sum(...numbers));
// expected output: 6
````

python 예제

```python
# 리스트의 언패킹
const oldArray = [1, 2, 3]
const newArray = [...oldArray, 4, 5]

# 딕셔너리의 언패킹
const oldObject = { hello: 'world', foo: 'bar' }
const newObject = { ...oldObject, foo: 'baz' }
```

### 4) 데이터 타입

출처 : [codekru.com/data-types-in-golang](https://www.codekru.com/go/data-types-in-golang)

![data-types-in-golang](https://www.codekru.com/wp-content/uploads/2021/08/data-types-in-golang.jpg){: width="600" .w-75}

#### 문자열 슬라이싱 : rune 사용 권장 (non-ASCII Unicode characters)

```go
// Wrong way
func main() {
  str := "I ♥ emojis 😍"
  substr := str[2:3]
  fmt.Println(substr)  // empty string instead of ♥ character
}

// Right way
func main() {
  str := "I ♥ emojis 😍"
  runes := []rune(str)  // convert string to rune slice
  substr := string(runes[2:3])  // take subslice of rune and convert back to string
  fmt.Println(substr)  // ♥
}
```

### 5) 특수한 Built-in 함수

- panic() : 파이썬의 raise Exception() 과 유사 

- new() : 데이터 타입 또는 구조체 초기화 생성 후 포인터 반환
- make() : channel / map / slice 타입을 위한 특별한 생성자
  + [new 와의 차이점](https://stackoverflow.com/a/68325868/6811653) : 데이터 타입 또는 구조체에 사용할 수 없음

```go
import "fmt"

type Comment struct {
  Author string
  Body   string
  Slug   string
  ID     int
}

func main() {
  cmt := new(Comment)  // <- Comment 포인터 == &Comment{}
  fmt.Printf("%+v\n", cmt)  // 모두 공백으로 표시, 숫자는 0
}
// &{Author: Body: Slug: ID:0}
```

참고 : [Stackoverflow - Why would I make() or new()?](https://stackoverflow.com/a/9325620/6811653)

```go
new(int)         // -->  NEW(*int)
new(Point)       // -->  NEW(*Point)
new(chan int)    // -->  NEW(*chan int)
make([]int, 10)  // -->  NEW([]int, 10)

make(Point)      // Illegal
make(int)        // Illegal
```

## 2. Go 언어 설치 및 설정

### 1) [Go 설치](https://go.dev/doc/install)

```shell
$ brew install golang

# 변경 가능
$ export GOPATH=<원하는 디렉토리>

$ go env GOROOT  # go 컴파일러 위치
$ go env GOPATH  # 외부 모듈 다운로드 위치
```

### 2) VSCODE 설정 - Go Extension 설치

#### settings.json

```json
{
  "[go]": {
    "editor.tabSize": 4,
    "editor.defaultFormatter": "golang.go"
  },
  "go.buildOnSave": "off",
  "go.lintOnSave": "workspace",
  "go.vetOnSave": "workspace",
  "go.buildTags": "",
  "go.buildFlags": [],
  "go.lintTool": "golint",
  "go.lintFlags": [],
  "go.vetFlags": [],
  "go.testOnSave": false,
  "go.coverOnSave": false,
  "go.useCodeSnippetsOnFunctionSuggest": true,
  "go.formatTool": "goimports",
  "go.formatFlags": [],
  "go.inferGopath": true,
  "go.gopath": "",
  "go.goroot": "",
  "go.gocodeAutoBuild": false,
  "go.testFlags": ["-v"],
  "[go.mod]": {
    "editor.defaultFormatter": "golang.go"
  },
}
```

## 3. Go 명령어

### 1) init : go.mod 생성

```shell
go mod init <모듈명>

go mod init example.com/hello
```

### 2) run

```shell
go run .

go run main.go
```

### 3) build

```shell
go build .
# ==> 실행 가능 바이너리 생성 
```

### 4) edit & tidy

#### 사용자 모듈 설정

참고 : [Call your code from another module](https://go.dev/doc/tutorial/call-module-code)

```shell
# 사용자 모듈 작성
go mod init example.com/greetings
# package greetings

# 메인 모듈 작성 (greetings 호출)
go mod init example.com/hello
# package main

# 사용자 모듈의 실제 위치 설정
go mod edit -replace example.com/greetings=../greetings
# ==> 
# module example.com/hello
# go 1.16
# replace example.com/greetings => ../greetings
# require example.com/greetings v0.0.0-00010101000000-000000000000

go run .
```

#### 하위 디렉토리의 패키지 가져오기

> `대문자`로 시작하는 함수는 외부에서 접근 가능 (public)
> `소문자`로 시작하는 함수는 외부에서 접근 불가능 (private)

예를 들어, 디렉토리 구조가 다음과 같다고 할 때

- go.mod : module `example.com`
- main.go : package `main`
- (디렉토리) models
  + book.go : package `models`

models 디렉토리의 book.go 로부터 함수를 호출하고 싶다면

- helloWorld() <== import 안됨 
- HelloWorld() <== OK!

- struct book type {} <== import 안됨 
- struct Book type {} <== OK!

> go-lint 는 export 가능 항목에 대해 주석을 달도록 강요한다. (주석은 '항목명'부터 시작해야 한다)

```go
// models/book.go
package models

// Book can be referenced from outside
type Book struct {
  BookID   int    `json:"book_id"`
  BookName string `json:"book_name"`
}

type book struct {
  BookAuthor string `json:"book_author"`
  BookPrice  int    `json:"book_price"`
}

// HelloWorld can be referenced from outside
func HelloWorld() string {
  return "Hello, world!"
}

func helloWorld() string {
  return "hello, world?"
}
```

```go
// main.go
package main

import (
  "fmt"

  // vscode 에서 formater 가 자동으로 import 해준다
  // - 반대로, import 항목이 없으면 자동으로 삭제한다 (짜증!)
  m "example.com/models"
)

func main() {
  // NOTE: `대문자`로 시작하면 외부에서 접근 가능 (public)
  //       `소문자`로 시작하면 외부에서 접근 불가능 (private)
  // 
  // => `book` 타입과 `helloWorld` 함수를 호출할 수 없다

  book := m.Book{BookID: 1, BookName: "Go"}
  fmt.Println(book)

  Book := new(m.Book)
  fmt.Println(book == *Book)

  fmt.Println(m.HelloWorld)  # "Hello, world!"
}
```

## 4. Go 프로그래밍 기법

### 1) 익명함수, 중첩함수, 클로저

```go
package main

import (
    "fmt"
)

func main() {
    var counter int = 1

    // 익명 함수
    func(str string) {
        fmt.Println("Hi", str, "I'm an anonymous function")
    }("Ricky")

    // 중첩 함수
    funcVar := func(str string) {
        fmt.Println("Hi", str, "I'm an anonymous function assigned to a variable.")
    }
    funcVar("Johnny")

    // 클로저 : 외부 counter 사용
    closure := func(str string) {
        fmt.Println("Hi", str, "I'm a closure.")
        for i := 1; i < 5; i++ {
            fmt.Println("Counter incremented to:", counter)
            counter++
        }
    }
    fmt.Println("Counter is", counter, "before calling closure.")
    // ==> Counter is 1 before calling closure.
    closure("Sandy")
    fmt.Println("Counter is", counter, "after calling closure.")
    // ==> Counter is 5 after calling closure.
}
```

### 2) 커링

```go
func greet(greeting, name string) string {
    return fmt.Sprintf("%v, %v", greeting, name)
}
func main() {
    fmt.Println(greet("Good Morning", "Sam"))
}
// ==> Good Morning, Sam

////////////////////////////////////////////

func prefixedGreet (p string) func(string) string {
    // 클로저 함수
    return func(n string) string {
        return greet(p,n)
    }
}

// 커링 함수
currfn := prefixedGreet("굳모닝")

currfn("고랭")
// ==> 굳모닝, 고랭
```

## 5. 참고문서

### 1) 공식문서 - [튜토리얼](https://go.dev/doc/)

- [Tutorial: Getting started](https://go.dev/doc/tutorial/getting-started.html)
- [Tutorial: Create a module](https://go.dev/doc/tutorial/create-module.html)
- [Tutorial: Getting started with multi-module workspaces](https://go.dev/doc/tutorial/workspaces.html)
- [Tutorial: Developing a RESTful API with Go and Gin](https://go.dev/doc/tutorial/web-service-gin.html)
- [Tutorial: Getting started with generics](https://go.dev/doc/tutorial/generics.html)
- [Tutorial: Getting started with fuzzing](https://go.dev/doc/tutorial/fuzz.html)

### 2) [Resources](https://github.com/avelino/awesome-go#resources)

* [Benchmarks](https://github.com/avelino/awesome-go#benchmarks)
* [Gophers](https://github.com/avelino/awesome-go#gophers)
* [Style Guides](https://github.com/avelino/awesome-go#style-guides)
* [Websites](https://github.com/avelino/awesome-go#websites)
  * [Tutorials](https://github.com/avelino/awesome-go#tutorials)

### 3) 무료 책

- [Effective Go](https://go.dev/doc/effective_go)

## 9. Review

- C 언어와 Python 언어를 짬뽕시켜 놓은거 같다.
  - 두가지 언어를 다 아는 개발자라면 Go 를 안배울 이유가 없다.
- 최대한 간결하게, 간편하게 개발할 수 있도록 배려한다.
  + 파이썬의 특성을 반영
- 여러 용도로 사용할 수 있지만, 백엔드 처리에 특화하여 발전중
  + 믿고 쓸수 있는 모듈이 백엔드 위주이고, 그런 식으로 주로 사용

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
