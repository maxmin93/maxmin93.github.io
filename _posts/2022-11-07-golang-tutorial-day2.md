---
date: 2022-11-07 00:00:00 +0900
title: Go 언어 배우기 - 2일차 문법, 고루틴
description: Go 언어의 문법과 예제로 자료구조를 살펴봅니다. 추가로 고루틴 예제를 공부합니다. (2일차)
categories: [Language, Go]
tags: [goroutine]
image: "https://miro.medium.com/v2/resize:fit:1400/0*bxrLnXTTyWfb_B5R"
---

> 목록
{: .prompt-tip }

- [Go 언어 배우기 - 1일차 개요, 특징](/posts/golang-tutorial-day1/)
- [Go 언어 배우기 - 2일차 문법, 고루틴](/posts/golang-tutorial-day2/) &nbsp; &#10004;
- [Go 언어 배우기 - 3일차 GIN, GORM](/posts/golang-tutorial-day3/)
- [Go 언어 배우기 - 4일차 유틸리티 코드](/posts/golang-tutorial-day4/)
- [Go 언어 배우기 - 5일차 Go Fiber API](/posts/golang-tutorial-day5/)

## 1. Go 언어 문법

### 1) for ... range 반복문

참고 : [4 basic range loop (for-each) patterns](https://yourbasic.org/golang/for-loop-range-array-slice-map-channel/)

```go
a := []string{"Foo", "Bar"}
for i, s := range a {
  fmt.Println(i, s)
}
// 0 Foo
// 1 Bar


// 문자값도 함께 출력 "%#U" => U+D55C '한'
for i, ch := range "한국어" {
  fmt.Printf("%#U starts at byte position %d\n", ch, i)
}
// U+D55C '한' starts at byte position 0
// U+AD6D '국' starts at byte position 3
// U+C5B4 '어' starts at byte position 6


const s = "golang nice!"
for i := 0; i < len(s); i++ {
  fmt.Printf("%c ", s[i])
}
// g o l a n g   n i c e ! 


m := map[string]int{
  "one":   1,
  "two":   2,
  "three": 3,
}
for k, v := range m {
  fmt.Println(k, v)
}
// one 1
// two 2
// three 3


ch := make(chan int)  // int 채널 생성 
go func() {  // 고루틴
  ch <- 1    // 파이썬 yield 와 유사
  ch <- 2
  ch <- 3
  close(ch)  // 채널 닫기
}()
for n := range ch {
  fmt.Println(n)
}
```

### 2) 구조체 생성 및 대입

```go
type Point struct {
  X, Y float64
}

// Point 타입에 대한 메소드 정의
func (p Point) toString() string {
    return fmt.Sprintf("P(%.1f,%.1f)", p.X, p.Y)
}

// Point 생성 후 toString 출력 
p := Point{X:5.33,Y:7.56}
fmt.Println(p.toString())
// P(5.3,7.6)
```


### 9) 흔히 저지르는 실수들

참고 : [Do you make these Go coding mistakes?](https://yourbasic.org/golang/gotcha/)

#### 데이터 타입 map 은 make 필요 (array도 마찬가지)

```go
var m map[string]float64  // (메모리) 생성 안됨
m["pi"] = 3.1416
// panic: assignment to entry in nil map

m := make(map[string]float64)
m["pi"] = 3.1416
```

#### 구조체 생성은 `new` 연산자 필요

```go
type Point struct {
  X, Y float64
}

func (p *Point) Abs() float64 {
  return math.Sqrt(p.X*p.X + p.Y*p.Y)
}

func main() {
  var p *Point
  fmt.Println(p.Abs())
}
// panic: runtime error: invalid memory address or nil pointer


func main() {
  var p *Point = new(Point)  // 구조체 생성 new
  fmt.Println(p.Abs())
}
```

#### 대부분의 함수는 결과와 error 를 반환한다

```go
// 하나의 값만 반환 받으려 하면 multiple-value error 발생 
t, err := time.Parse(time.RFC3339, "2018-04-06T10:49:05Z")
if err != nil {
  // TODO: Handle error.
}
fmt.Println(t)
// 2018-04-06 10:49:05 +0000 UTC


// map 은 값과 exists 를 반환
m := map[string]float64{"pi": 3.1416}
_, exists := m["pi"]
fmt.Println(exists) // exists == true
```

#### Array 값을 변경하려면 slice 방식을 사용해야 한다

```go
func Foo(a [2]int) {  // array 로 param 선언 (복사된다)
  a[0] = 8  // 복사된 array 의 값을 변경 (의미 없음)
}

func main() {
  a := [2]int{1, 2}  // 값이 채워진 array 생성
  Foo(a)         // param 로 넘겨지면서 array 복사됨
  fmt.Println(a) // Output: [1 2] (원본은 반영안됨)
}

//////////////////////////////////

func Foo(a []int) {  // array 의 포인터 (slice)
  if len(a) > 0 {
    a[0] = 8  // 원본을 변경
  }
}

func main() {
  a := []int{1, 2}  // a 는 array 의 포인터 (slice)
  Foo(a)         // Change a[0].
  fmt.Println(a) // Output: [8 2]
}
```

#### `:=` 과 `=` 을 잘 구별해 써야 한다

n 을 변경하고 싶다면, `=` 을 써야 함

```go
func main() {
  n := 0
  if true {
    n := 1  // 새로운 변수 n 생성 (이름이 같지만 다른 shadow)
    n++
  }
  fmt.Println(n) // 0 (if 이전의 변수는 그대로임)
}
```

#### multi-line 값을 대입할 때, line 마다 `,` 를 사용해야 함

슬라이스, 배열, 맵에 multi-line 값 대입할 때 모두 해당

```go
fruit := []string{  // multi-line slice
  "apple",
  "banana",
  "cherry"  // ',' 이 빠져서 error 발생
}
fmt.Println(fruit)
// missing ',' before newline in composite literal
```

#### string 은 불변이다

```go
s := "hello"
s[0] = 'H'  // 불변 데이터를 변경 시도하여 error
fmt.Println(s)

//////////////////////

buf := []rune("hello")  // 바꾸려면 애초에 rune 슬라이스로 정의
buf[0] = 'H'
```

#### 문자열과 문자형(rune)은 처리 방식이 다르다

```go
fmt.Println("H" + "i")  // 문자열은 concat 수행
fmt.Println('H' + 'i')  // rune(문자형) 은 정수 계산을 수행

s := fmt.Sprintf("%c%c, world!", 72, 'i')
fmt.Println(s)// "Hi, world!"
```

#### 후행삭제는 TrimSuffix 함수이다 (헷갈리지 말것)

Trim/TrimLeft/TrimRight 함수는 일치할 때까지 계속 문자를 제거

```go
fmt.Println(strings.Trim("  ABBA  ", " ")) // Output: "ABBA"
fmt.Println(strings.TrimRight("ABBA", "BA")) // Output: ""

fmt.Println(strings.TrimSuffix("ABBA", "BA")) // Output: "AB"
```

#### 배열을 복사하려면, 메모리가 확보되어 있어야 함

```go
var src, dst []int
src = []int{1, 2, 3}
copy(dst, src)  // Copy elements to dst from src.
fmt.Println("dst:", dst)  // 공간이 없어 여전히 ""

dst = make([]int, len(src)) // 메모리 확보 (복사 가능)
copy(dst, src)
fmt.Println("dst:", dst)  // [1,2,3]
```

#### 슬라이스 사용시 메모리 재사용으로 인한 부작용 염두할 것

```go
a := []byte("ba")

a1 := append(a, 'd')  // 메모리 +1
a2 := append(a, 'g')  // 'd' 공간에 'g'가 덧씌워짐

fmt.Println(string(a1)) // bag
fmt.Println(string(a2)) // bag
```

#### 지연 계산시 숨겨진 interface 함수들을 유의할 것

```go
const n = 9876543210 * 9876543210  // 정의 시에는 오류 없음
fmt.Println(n)  // 출력을 위해 n 값이 계산되면서 error 발생

fmt.Println(float64(n))  // float 변환 후 Println 처리 (OK)
```

#### 애매한 `i++` 은 분리해서 사용

```go
i := 0
fmt.Println(++i)  // 전위 표현의 inc 연산자는 허용 안함
fmt.Println(i++)  // 괄호 내부에서 사용 안되는듯 (오류)

/////////////////////

i := 0
i++
fmt.Println(i)
fmt.Println(i)
i++
```

#### 연산자 우선순위에 주의하라 (`%` 와 `/`)

```go
n := 43210 // time in seconds
fmt.Println(n/60*60, "hours and", n%60*60, "seconds")
// 43200 hours and 600 seconds

// 계산식으로 분리 권장
const SecPerHour = 60 * 60
fmt.Println(n/SecPerHour, "hours and", n%SecPerHour, "seconds")
```

#### 시간은 숫자가 아니다. 시간 타입을 사용할 것

```go
n := 100
time.Sleep(n * time.Millisecond)  // 타입 오류

//////////////////////////////////

// 1) 시간 타입 사용
var n time.Duration = 100
time.Sleep(n * time.Millisecond)

// 2) 상수는 사용시에 타입 적용
const n = 100
time.Sleep(n * time.Millisecond)

// 3) 한 문장 안에서 동일 타입으로 처리
time.Sleep(100 * time.Millisecond)
```

#### for 문에서 길이(len) 이용하여 반복하는 방법

```go
for i := 0; i < len(a); i++ {
  fmt.Println(a[i])
}

for _, n := range a {
  fmt.Println(n)
}
```

#### for 문의 값변수는 local 변수임. 변경 안됨

```go
s := []int{1, 1, 1}
for _, n := range s {
  n += 1
}
fmt.Println(s)
// [1 1 1]

////////////////////////////

s := []int{1, 1, 1}
for i := range s {
  s[i] += 1  // index 로 원본값 변경
}
fmt.Println(s)
// [2 2 2]
```

#### for 문 내에서 변경된 값을 사용하고 싶으면 copy 사용

```go
var a [2]int
for _, x := range a {
  fmt.Println("x =", x)  // x 가 변경된 a[1] 을 반영 못함
  a[1] = 8
}
fmt.Println("a =", a)
// x = 0
// x = 0
// a = [0 8]

//////////////////////////////

var a [2]int
for _, x := range a[:] {  // copy 처리되어 변경 값을 반영 
  fmt.Println("x =", x)   // a[1] 변경값을 출력 
  a[1] = 8
}
fmt.Println("a =", a)
// x = 0
// x = 8
// a = [0 8]
```

#### json 변환시 `json:태그` 로 필드명 지정

```go
import "encoding/json"

type Person struct {
  Name string `json:"name"`  // 명확한 필드명을 지정
  Age  int    `json:"age"`   // 안하면, "Name"/"Age" 출력
}

p := Person{"Alice", 22}  // 구조체 값 정의

jsonData, _ := json.Marshal(p)
fmt.Println(string(jsonData))
// {"name":"Alice","age":22}
```

#### interface 값은 값과 타입이 모두 일치해야 동일

```go
func Foo() error {
  var err *os.PathError = nil  // PathError interface 의 nil
  // …
  return err
}

err := Foo()
fmt.Println(err)         // <nil>
fmt.Println(err == nil)  // false : 타입 정보가 있는 nil

/////////////////////////////////

fmt.Println(err == (*os.PathError)(nil))  // true
```


## 2. 자료구조

### 1) 이진트리

```go
type Tree struct {
  Left *Tree
  Value int
  Right *Tree
}

// 이진트리 순회 (재귀호출)
func traverse(t *Tree) {
  if t == nil {
    return
  }
  traverse(t.Left)  // 왼쪽 먼저 순회
  fmt.Print(t.Value, " ")  // 자신
  traverse(t.Right)  // 오른쪽 순회
}

// 이진트리 삽입
func insert(t *Tree, v int) *Tree {
  // 빈자리(말단 노드)이면 삽입
  if t == nil {
    return &Tree(nil, v, nil)
  }
  // 같은 값이 있으면 자신을 반환
  if v == t.Value {
    return t
  }

  // 값이 작으면 왼쪽 노드에 삽입
  if v < t.Value {
    t.Left = insert(t.Left, v)
    return t
  }
  // 아니면 오른쪽 노드에 삽입
  t.Right = insert(t.Right, v)
  return t
}
```
### 2) 해시 테이블

```go
const SIZE = 15

// 해시 버킷의 노드 (링크드 리스트)
type Node struct {
  Value int 
  Next *Node
}

// 해시 테이블
type HashTable struct {
  Table map[int]*Node  // 맵
  Size int  // 맵 크기 (SIZE)
}

// 해시 버킷 결정 함수
func hashFunction(i, size int) int {
  return (i % size)
}

// 삽입 => 버킷 번호 반환
func insert(hash *HashTable, value int) int {
  index := hashFunction(value, hash.Size)
  // 버킷에 루트 노드로 추가
  element := Node{ Value: value, Next: hash.Table[index] }
  // (생략됨) 기존 루트 노드가 추가 노드에 연결
  hash.Table[index] = &element
  return index
}

func traverse(hash *HashTable) {
  for k := range hash.Table {
    if hash.Table[k] != nil {
      t := hash.Table[k]
      for t != nil {  // 루트 노드에 연결된 모든 노드를 출력
        fmt.Printf("%d -> ", t.Value)
        t = t.Next
      }
      fmt.Println()
    }
  }
}
```

## 3. 고루틴 (Goroutine)

참고 : [책 - 백엔드를 위한 Go 프로그래밍](https://www.aladin.co.kr/shop/wproduct.aspx?ItemId=299624701)

### 1) 고루틴 기본 형태

별도의 (백그라운드) 고루틴에서 squareIt 함수를 실행

- 고루틴이 완료되기 전에 메인 루틴이 종료될 수 있기 때문에
  + time.Sleep 함수를 추가했지만, 기다리는 것은 아님
  + 실제 고루틴 완료를 기다리기 위해서는 `채널`이 필요함

- 프로그램이 실행되면 고루틴은 하나만 실행됨 (스레드 하나)
  + 멀티 고루틴을 실행하게 되면 여러 스레드에 맵핑되어 실행됨

- 고루틴 간에는 서로를 제어할 수 없다. (단점)
  + `채널`을 이용해 정보를 공유하고, 상태를 이용할 수 있음

```go
package main

import "fmt"
import "time"

func squareIt(x int) {
  fmt.Println(x * x)  
}

func main() {
  go squareIt(2)  // "go" 를 추가하면 고루틴으로 실행
  time.Sleep(1 * time.Millisecond)  // 고루틴 완료를 위해 1ms 지연
}
```

### 2) 채널(channel)

일단 실행된 고루틴 함수와 데이터를 공유하기 위해 채널을 사용

#### 버퍼링 되지 않은 채널을 이용하여 데드락 발생

main 고루틴, squareIt 고루틴 모두 상대방이 채널 데이터를 가져갈 때까지 대기 상태에 빠짐 => 데드락

```go
// input, output 두개의 채널
func squareIt(inputChan, outputChan chan int) {
  for x := range inputChan {
    outputChan <- x * x
  }
}

func main() {
  inputChannel := make(chan int)  // 공유 메모리를 생성
  outputChannel := make(chan int)
  go squareIt(inputChannel, outputChannel)

  for i := 0; i < 10; i++ {  
    inputChannel <- i  // squareIt 고루틴이 읽음
  }
  for i := range outputChannel {  // main 고루틴이 읽음
    fmt.Println(i)  // 읽은 즉시 출력
  }
}
```

#### 데드락 제거

- 출력 채널에 버퍼링을 주고 (9 정도 주어도 데드락 발생 안함)
  + 버퍼링이 있으면 비동기 채널, 없으면 동기 채널
- for 루프에서 출력 채널 읽기를 제거

```go
func main() {
  inputChannel := make(chan int)
  outputChannel := make(chan int, 10)  // 출력 버퍼링 (최대 10)
  go squareIt(inputChannel, outputChannel)

  for i := 0; i < 10; i++ {
    inputChannel <- i  // 입력이 주어지는 대로 고루틴이 실행됨
  }
  for i := 0; i < 10; i++ {
    fmt.Println(<- outputChannel)  // 읽는 대로 출력 
  }
  close(inputChannel)  // squareIt 고루틴 정상 종료
}
```

> close(채널) : 고루틴 해제

채널에 더이상 데이터를 보낼 수 없고, 블록된 고루틴들이 정상 종료됨

#### 크기가 0인 채널을 세마포어로 활용한 경우

- 아래 예제는 하나의 세마포어로 하나의 신호를 처리
- 둘 이상의 신호를 처리하고 싶다면, 버퍼링 채널로 변경
  - `semaphore := make(chan struct{}, 10)`
  - 버퍼링을 원형 연결 리스트로 처리하면 더 nice 해짐

```go
import (
  "fmt"
  "time"
)

func main() {
  semaphore := make(chan struct{})
  fmt.Println("ready")
  go func() {
    time.Sleep(3 * time.Second)
    // .. do something
    fmt.Println("signalling")
    semaphore <- struct{}{}
  }()
  <-semaphore
  fmt.Println("exiting")
}
// ready
// (3초 대기) signalling
// (즉시) exiting
```

### 3) select 문 : 채널용 switch

- 다양한 채널로부터 데이터를 기다릴 수 있게 해주고
- 가장 먼저 값을 제공하는 채널부터 처리할 수 있게 해준다

```go
// 제곱용 채널 2개, 세제곱용 채널 2개, 종료용 채널 1개
func squarerCuber(sqInChan, sqOutChan, cuInChan, cuOutChan, exitChan chan int) {
  var squareX int 
  var cubeX int 
  for {  // 무한루프
    select {  // 채널 스위치
    case squareX = <- sqInChan:  // 제곱용 채널
      sqOutChan <- squareX * squareX
    case cubeX = <- cuInChan:  // 세제곱용 채널
      cuOutChan <- cubeX * cubeX * cubeX
    case <- exitChan:  // 종료용 채널
      return
    }
  }
}

func main() {
  sqInChan := make(chan int, 10)  // 입력용 채널 (버퍼링)
  cuInChan := make(chan int, 10)
  sqOutChan := make(chan int, 10)  // 출력용 채널 (버퍼링)
  cuOutChan := make(chan int, 10)
  exitChan := make(chan int)  // 종료용 채널
  go squarerCuber(sqInChan, sqOutChan, cuInChan, cuOutChan, exitChan)

  for i := 0; i < 10; i ++ {
    sqInChan <- i 
    cuInChan <- i 
  }
  for i := 0; i < 10; i ++ {
    fmt.Printf("squarer says %d\n", <- sqOutChan)
    fmt.Printf("cuber says %d\n", <- cuOutChan)
  }
  exitChan <- 0
}
```

## 9. Review

- 방심할 수 없네. C + Python 과 같은 듯 하면서 다른 Go 언어
- 고루틴은 nodejs, python 의 event-loop 와 다르다.
  + 우선 성능은 고루틴이 월등히 좋다
  + `nodejs` 는 하나의 기본 스레드만 있고, 다른 코드를 블록시킬 수 있다
    * 스레드풀을 이용해도 최대 4개만 가능
  + 고루틴은 두개 이상의 스레드가 있고, 다른 코루틴을 제어할 수 없다
- 웹애플리케이션 개발에는 적합치 않다 -> nodejs 추천

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

