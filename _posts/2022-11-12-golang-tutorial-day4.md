---
date: 2022-11-12 00:00:00 +0900
title: Go 언어 배우기 - 4일차 유틸리티 코드
description: 개발에 필요한 다양한 유틸리티 코드들의 예제를 살펴봅니다. 또 interface 타입 변환을 공부합니다. (4일차)
categories: [Language, Go]
tags: [library]
image: "https://cdn.hashnode.com/res/hashnode/image/upload/v1698324966590/ecc115a4-12ef-4074-a7be-45a009792324.png"
---

> 목록
{: .prompt-tip }

- [Go 언어 배우기 - 1일차 개요, 특징](/posts/golang-tutorial-day1/)
- [Go 언어 배우기 - 2일차 문법, 고루틴](/posts/golang-tutorial-day2/)
- [Go 언어 배우기 - 3일차 GIN, GORM](/posts/golang-tutorial-day3/)
- [Go 언어 배우기 - 4일차 유틸리티 코드](/posts/golang-tutorial-day4/) &nbsp; &#10004;
- [Go 언어 배우기 - 5일차 Go Fiber API](/posts/golang-tutorial-day5/)

## 1. Go 패키지 < 모듈 < 리포지토리

- 패키지(모듈) 검색 [https://pkg.go.dev/](https://pkg.go.dev/)
- 참고: [초보자를 위한 Go 모듈 - 18가지 기초 정보](https://dev.to/zaracooper/18-essential-go-module-tidbits-for-a-newbie-4455)

### 1) [기본 패키지](https://pkg.go.dev/std)

#### [fmt](https://pkg.go.dev/fmt@go1.19.3) : 포맷 출력

- fmt.Printf, fmt.Print, fmt.Println
- fmt.Sprintf

```go
var s3 string
s3 = fmt.Sprintf("%d %.3f %s\n", 1, 1.1, "Hello, world!")
fmt.Print(s3)
// 1 1.100 Hello, world!
```

#### [io](https://pkg.go.dev/io) : 바이트/스트림 입출력

- Copy, Pipe, ReadAll, ReadFull, WriteString
- ByteReader, ByteWriter, ByteScanner
- Closer

#### [log, log/syslog](https://pkg.go.dev/log@go1.19.3) : 로그

- syslog.New() : 시스템 로그 생성, 설정
  + log.New() : 사용자 로그 생성, 설정
- log.Println : 로그 출력 
- log.Panic : 심각한 로그 출력 

#### [os](https://pkg.go.dev/os@go1.19.3) : 터미널 환경

- os.Args : 커맨드라인 파라미터 가져오기
- os.Exit : 종료 

#### [strconv](https://pkg.go.dev/strconv@go1.19.3) : 문자열 타입 변환

- Atoi, Itoa : 문자/정수 변환
- strconv.parseFloat(arg, 64) : float64 변환

#### [strings](https://pkg.go.dev/strings@go1.19.3) : 문자열 조작, 비교, 찾기 등..

- ToUpper/ToLower, TrimSpace
- HasPrefix, Index, Count
- Compare
- Split
- 문자열 반복 Repeat

```go
fmt.Println(strings.Repeat("--", 30))
// ==> ----------------------------------
```

#### [math, math/rand](https://pkg.go.dev/math@go1.19.3) : 수학 관련 패키지

이하 생략...

### 2) [Awesome Go 패키지](https://github.com/avelino/awesome-go) - 추천 목록

- [Authentication and OAuth](https://github.com/avelino/awesome-go#authentication-and-oauth)
- [Build Automation](https://github.com/avelino/awesome-go#build-automation)
- [Command Line](https://github.com/avelino/awesome-go#command-line)
- [Data Structures and Algorithms](https://github.com/avelino/awesome-go#data-structures-and-algorithms)
- [Database](https://github.com/avelino/awesome-go#database)
- [Database Drivers](https://github.com/avelino/awesome-go#database-drivers)
- [Date and Time](https://github.com/avelino/awesome-go#date-and-time)
- [Error Handling](https://github.com/avelino/awesome-go#error-handling)
- [File Handling](https://github.com/avelino/awesome-go#file-handling)
- [Functional](https://github.com/avelino/awesome-go#functional)
- [Job Scheduler](https://github.com/avelino/awesome-go#job-scheduler)
* [JSON](https://github.com/avelino/awesome-go#json)
* [Logging](https://github.com/avelino/awesome-go#logging)
* [Machine Learning](https://github.com/avelino/awesome-go#machine-learning)
* [Messaging](https://github.com/avelino/awesome-go#messaging)
- [Networking](https://github.com/avelino/awesome-go#networking)
+ [HTTP Clients](https://github.com/avelino/awesome-go#http-clients)
* [OpenGL](https://github.com/avelino/awesome-go#opengl)
* [ORM](https://github.com/avelino/awesome-go#orm)
* [Security](https://github.com/avelino/awesome-go#security)
* [Serialization](https://github.com/avelino/awesome-go#serialization)
* [Server Applications](https://github.com/avelino/awesome-go#server-applications)
* [Stream Processing](https://github.com/avelino/awesome-go#stream-processing)
* [Web Frameworks](https://github.com/avelino/awesome-go#middlewares)
    * [Actual middlewares](https://github.com/avelino/awesome-go#actual-middlewares)
    * [Libraries for creating HTTP middlewares](https://github.com/avelino/awesome-go#libraries-for-creating-http-middlewares)
  * [Routers](https://github.com/avelino/awesome-go#routers)
* [WebAssembly](https://github.com/avelino/awesome-go#webassembly)

## 2. 개발시 사용할법한 유틸리티 코드

### 1) [crypto 암호화/복호화](https://gist.github.com/hothero/7d085573f5cb7cdb5801d7adcf66dcf3)

> expire 기간과 (사용)권한 정보를 담은 라이센스 검사 등에 사용 

`평문`을 `key` 문장을 이용하여 암호화하고 복호화함

- AESEncrypt : NewCBCEncrypter + Padding + CryptBlocks
- AESDecrypt : NewCBCDecrypter + CryptBlocks + Trimming
- PKCS5Padding : 블록 크기에 맞추기 위해 패딩 처리
  + 암호화된 데이터의 길이는 블록 크기의 배수가 되어야함
- PKCS5Trimming : 복호화 후 패딩 문자열을 제거

```go
var (
  initialVector = "1234567890123456"
  passphrase    = "Impassphrasegood"
)

func main() {
  var plainText = "hello world"

  encryptedData := AESEncrypt(plainText, []byte(passphrase))
  encryptedString := base64.StdEncoding.EncodeToString(encryptedData)
  fmt.Println(encryptedString)

  encryptedData, _ = base64.StdEncoding.DecodeString(encryptedString)
  decryptedText := AESDecrypt(encryptedData, []byte(passphrase))
  fmt.Println(string(decryptedText))
}

func AESEncrypt(src string, key []byte) []byte {
  block, err := aes.NewCipher(key)
  if err != nil {
    fmt.Println("key error1", err)
  }
  if src == "" {
    fmt.Println("plain content empty")
  }
  ecb := cipher.NewCBCEncrypter(block, []byte(initialVector))
  content := []byte(src)
  content = PKCS5Padding(content, block.BlockSize())
  crypted := make([]byte, len(content))
  ecb.CryptBlocks(crypted, content)

  return crypted
}

func AESDecrypt(crypt []byte, key []byte) []byte {
  block, err := aes.NewCipher(key)
  if err != nil {
    fmt.Println("key error1", err)
  }
  if len(crypt) == 0 {
    fmt.Println("plain content empty")
  }
  ecb := cipher.NewCBCDecrypter(block, []byte(initialVector))
  decrypted := make([]byte, len(crypt))
  ecb.CryptBlocks(decrypted, crypt)

  return PKCS5Trimming(decrypted)
}

func PKCS5Padding(ciphertext []byte, blockSize int) []byte {
  padding := blockSize - len(ciphertext)%blockSize
  padtext := bytes.Repeat([]byte{byte(padding)}, padding)
  return append(ciphertext, padtext...)
}

func PKCS5Trimming(encrypt []byte) []byte {
  padding := encrypt[len(encrypt)-1]
  return encrypt[:len(encrypt)-int(padding)]
}
```

### 2) 구조체를 map 타입으로 변환하기

출처 : [function for converting a struct to map in Golang](https://stackoverflow.com/a/71272123/6811653)

```go
import (
    "fmt"
    "reflect"
)

func StructToMap(val interface{}) map[string]interface{} {
    //The name of the tag you will use for fields of struct
    const tagTitle = "kelvin"

    var data map[string]interface{} = make(map[string]interface{})
    varType := reflect.TypeOf(val)
    if varType.Kind() != reflect.Struct {
        // Provided value is not an interface, do what you will with that here
        fmt.Println("Not a struct")
        return nil
    }

    value := reflect.ValueOf(val)
    for i := 0; i < varType.NumField(); i++ {
        if !value.Field(i).CanInterface() {
            //Skip unexported fields
            continue
        }
        tag, ok := varType.Field(i).Tag.Lookup(tagTitle)
        var fieldName string
        if ok && len(tag) > 0 {
            fieldName = tag
        } else {
            fieldName = varType.Field(i).Name
        }
        if varType.Field(i).Type.Kind() != reflect.Struct {
            data[fieldName] = value.Field(i).Interface()
        } else {
            data[fieldName] = StructToMap(value.Field(i).Interface())
        }

    }

    return data
}
```

### 3) interface 슬라이스에서 특정 항목의 포함 여부 검사하기

```go
func Contains(s []interface{}, e interface{}) bool {
  for _, a := range s {
    if a == e {
      return true
    }
  }
  return false
}
```

### 4) [interface 값을 문자열로 변환하기](https://yourbasic.org/golang/interface-to-string/)

```go
var x interface{} = []int{1, 2, 3}
str := fmt.Sprintf("%v", x)
fmt.Println(str) // "[1 2 3]"
```

### 5) 문자열의 이메일 형식 검사 (정규식)

```go
func CheckEmail(email interface{}) bool {
  re := regexp.MustCompile("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$")
  return re.MatchString(ToStr(email))
}
```

### 6) [interface 에서 특정 값만 추출하기](https://luci7.medium.com/golang-extract-value-from-interfaces-without-specifying-the-struct-type-ffb7e23223a7)

```go
import (
  "fmt"
  "reflect"
)

type User struct {
  UserEmail string
  UserPass  string
}

func login(user interface{}) {
  ////--- Extract Value without specifying Type
  val := reflect.ValueOf(user).Elem()
  n := val.FieldByName("UserEmail").Interface().(string)
  fmt.Printf("%+v\n", n)

  fmt.Println(user.(*User).UserEmail)
}

func main() {
  login(&User{UserEmail: "lucian@knesk.com", UserPass: "lucian123"})
}
```

### 7) [타입변환 정리](https://levelup.gitconnected.com/golang-type-conversion-summary-dc9e36842d25)

- Assertion.
- Forced type conversion.
- Explicit type conversion.
- Implicit type conversion.

#### Assertion

```go
// x 를 T 형식으로 변환 (Assertion)
var s = x.(T)

// 예제
var foo interface{} = "123" 
fooStr, ok := foo.(string)
if ok {
    // ...
}
```

#### Type Switch 타입 스위치

```go
switch i := x.(type) {
    case nil:
        printString("x is nil")                // type of i is type of x (interface{})
    case int:
        printInt(i)                            // type of i is int
    case float64:
        printFloat64(i)                        // type of i is float64
    case func(int) float64:
        printFunction(i)                       // type of i is func(int) float64
    case bool, string:
        printString("type is bool or string")  // type of i is type of x (interface{})
    default:
        printString("don't know the type")     // type of i is type of x (interface{})
}

// 예제
var foo interface{} = 123

switch fooStr := foo.(type) {
  case string:
    fmt.Println("fooStr is a string")
  case int:
    fmt.Println("fooStr is an integer")
  default:
    fmt.Println("don't know what fooStr is")
}
```

#### Forced type conversion. 강제 변환

```go
var f float64
bits = *(*uint64)(unsafe.Pointer(&f))

type ptr unsafe.Pointer
bits = *(*uint64)(ptr(&f))

var p ptr = nil
```

#### Interface type detection. 인터페이스 타입인지 검사

`Context = xx` 이라 반환된 경우, xx 가 Interface 를 만족하면 OK

- 무슨 말인지 잘 모르겠다
- 실패하면 error 발생한다고 함

```go
var _ Context = (*ContextBase)(nil)
```

#### Explicit type conversion. 명시적 변환

```go
int64(123)
[]byte("hello")
type A int
A(0)
```

#### Implicit type conversion. 모호한 변환

```go
import (
    "fmt"
    "reflect"
)

type Handler func()

func a() Handler {
    return func() {}
}

func main() {
    var i interface{} = main

    _, ok := i.(func())
    fmt.Println(ok)  // true

    _, ok = i.(Handler)
    fmt.Println(ok)  // false (실질적으론 같지만 형식상 다르다)

    fmt.Println(reflect.TypeOf(main) == reflect.TypeOf((*Handler)(nil)).Elem())
    // ==> false
}
```

## 9. Review

- interface 를 자유롭게 써야 하는데, 아직은 어지럽다.
  + 고수 형님들 코드들을 보면 구조체를 정의하고, 결합되는 함수를 나열한다. 이후 수시로 interface 함수들이 툭툭 뛰어나오는데, 찾아가며 확인하지 않으면 무슨 일이 일어나고 있는지 바로 알기 어렵다.
- reflect 패키지가 파워풀 하지 않다고 한다. (내가 봐도 그렇다)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }