---
date: 2022-11-14 00:00:00 +0000
title: Go 언어 배우기 - 4일차 유틸리티 코드
categories: ["golang"]
tags: ["TIL", "tutorial", "유틸리티", "examples", "library"]
image: "https://images.velog.io/images/milkcoke/post/2e6493d9-ef2a-4116-91bc-e257ca9af7ec/golang_icon.jpg"
hidden : true
---

> 개발에 필요한 다양한 유틸리티 패키지들의 예제를 살펴봅니다. 정렬, 환경파일, 랜덤, 변환 등 (4일차)
{: .prompt-tip }

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



## 9. Summary


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }