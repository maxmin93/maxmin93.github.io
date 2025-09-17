---
date: 2022-03-31 00:00:00 +0900
title: Mastering Go - 책 소개
description: 크롤링과 마이크로 서비스 등 백엔드 구현에 널리 쓰이는 Go 언어를 공부합니다. 책 소개와 목차를 담았습니다.
categories: [Language, Go]
tags: [book]
image: http://www.acornpub.co.kr/tb/detail/book/fl/sh/1621183964smdDjLWI.jpg
---

## 책소개

- 출처 : 에이콘 [Go 마스터하기 2/e](http://www.acornpub.co.kr/book/mastering-go-2e)
- 소스코드 : [다운로드](https://github.com/AcornPublishing/mastering-go-2e)

**동시성, 네트워크, 머신러닝, 컴파일러 등 고급 기능의 실습과 활용**

Go 언어의 기본 개념부터 동시성, 네트워크, 머신러닝, 고급 데이터 구조에 이르기까지 방대한 주제를 실습 예제와 함께 소개한다. 1판의 내용 중 도커와 쿠버네티스, 깃, 웹어셈블리, JSON, gRPC 등을 보강했으며, 머신러닝 관련 내용을 새롭게 추가했다. 이 책을 통해 Go 언어의 기초뿐만 아니라, 실전에서 활용할 수 있는 다양한 기술을 배울 수 있다. Go 언어를 제대로 배우고 싶다면 이 책은 전문가 수준에 이르기 위한 필독서다.

## 목차

이 책은 크게 세 부분으로 나눌 수 있다. 첫 번째 부분은 Go 언어의 주요 개념을 깊이 있게 들여다본다. 이러한 개념으로는 사용자 입출력, Go 패키지 다운로드하기, Go 코드 컴파일하기, Go 코드에서 C 코드 호출하기, Go에서 웹어셈블리 생성하기, Go의 기본 타입과 합성 타입 등이 있다. 두 번째 부분은 5장, 6장, 7장으로 구성되며, 패키지와 모듈로 구성하는 방법, Go 프로젝트 설계를 비롯한 고급 기능을 다룬다. 세 번째 부분은 Go 언어에 대한 실용적인 주제를 다룬다. 8장부터 11장까지는 Go 언어를 이용한 시스템 프로그래밍, 동시성, 코드 테스팅, 최적화, 프로파일링을 다룬다. 마지막 세 장은 네트워크 프로그래밍과 머신러닝을 소개한다. 이 책은 웹어셈블리, 도커 다루기, Viper와 Cobra 패키지로 전문적인 커맨드라인 도구를 생성하는 방법, JSON과 YAML 파싱하기, 행렬 연산하기, 스도쿠 퍼즐 다루기, go/scanner와 go/token 패키지 사용법, git(1)과 깃허브 사용법, atomic 패키지, gRPC와 HTTPS를 다루는 방법 등도 소개한다.

<a id="item01" />

### 1장 들어가기

1장, ‘Go와 OS’에서는 Go 언어의 역사와 장점부터 소개한다. 그런 다음 godoc 유틸리티를 설명하고, Go 프로그램을 컴파일하고 실행하는 방법을 소개한다. 이어서 화면에 출력하는 방법과 사용자로부터 입력받는 방법, 프로그램에서 커맨드라인 인수를 처리하는 방법, 로그 파일을 다루는 방법 등을 소개한다. 마지막으로 Go 언어에서 굉장히 중요한 역할을 하는 에러 처리 기법을 소개한다.

- [Go 언어의 역사] <!-- (/posts/mastering-go-ch01/#item01) -->
- [Go 현황] <!-- (/posts/mastering-go-ch01/#item02) -->
- [Go 언어의 장점] <!-- (/posts/mastering-go-ch01/#item03) -->
- [Go 코드 컴파일] <!-- (/posts/mastering-go-ch01/#item04) -->
- [Go 코드 실행] <!-- (/posts/mastering-go-ch01/#item05) -->
- [Go 언어의 두 가지 규칙] <!-- (/posts/mastering-go-ch01/#item06) -->
- [Go 패키지 다운로드] <!-- (/posts/mastering-go-ch01/#item07) -->
- [유닉스 stdin, stdout, stderr] <!-- (/posts/mastering-go-ch01/#item08) -->
- [화면에 출력] <!-- (/posts/mastering-go-ch01/#item09) -->
- [표준 출력 사용] <!-- (/posts/mastering-go-ch01/#item10) -->
- [사용자 입력받기] <!-- (/posts/mastering-go-ch01/#item11) -->
- [에러 출력 방법] <!-- (/posts/mastering-go-ch01#item012) -->
- [로그 파일 작성] <!-- (/posts/mastering-go-ch01#item013) -->
- [Go 언어에서 에러 처리] <!-- (/posts/mastering-go-ch01/#item14) -->
- [도커 사용] <!-- (/posts/mastering-go-ch01/#item15) -->

<a id="item02" />

### 2장 객체 생성과 파괴

2장, ‘Go 내부’에서는 Go 언어의 가비지 컬렉터의 개념과 작동 원리를 소개한다. 그런 다음 unsafe 패키지, Go 프로그램에서 C 코드를 호출하는 방법, C 프로그램에서 Go 코드를 호출하는 방법을 살펴본다. 이어서 defer 키워드를 사용하는 방법, strace(1)과 dtrace(1) 유틸리티 사용법을 소개한다. Go 환경의 정보를 조회하는 방법, Go 어셈블러를 사용하는 방법, Go에서 웹어셈블리를 생성하는 방법도 설명한다.

- [Go 컴파일러] <!-- (/posts/mastering-go-ch02/#item01) -->
- [가비지 컬렉션] <!-- (/posts/mastering-go-ch02/#item02) -->
- [Go에서 C 코드 호출] <!-- (/posts/mastering-go-ch02/#item03) -->
- [C 코드에서 Go 함수 호출] <!-- (/posts/mastering-go-ch02/#item04) -->
- [defer 키워드] <!-- (/posts/mastering-go-ch02/#item05) -->
- [panic 함수와 recover 함수] <!-- (/posts/mastering-go-ch02/#item06) -->
- [두 가지 유용한 유닉스 유틸리티] <!-- (/posts/mastering-go-ch02/#item07) -->
- [Go 환경 파악] <!-- (/posts/mastering-go-ch02/#item08) -->
- [go env 명령] <!-- (/posts/mastering-go-ch02/#item09) -->
- [Go 어셈블러] <!-- (/posts/mastering-go-ch02/#item10) -->
- [노드 트리] <!-- (/posts/mastering-go-ch02/#item11) -->
- [go build에 대해 좀 더 살펴보기] <!-- (/posts/mastering-go-ch02/#item12) -->
- [웹어셈블리 코드 생성] <!-- (/posts/mastering-go-ch02/#item13) -->
- [Go 프로그래밍 관련 팁] <!-- (/posts/mastering-go-ch02/#item14) -->

<a id="item03" />

### 3장 ‘기본 타입’

Go 언어에서 제공하는 다양한 데이터 타입을 소개한다. 이 과정에서 배열, 슬라이스, 맵뿐만 아니라 포인터, 상수, 루프, 날짜와 시간을 다루는 방법을 살펴본다.

- [숫자 타입] <!-- (/posts/mastering-go-ch03/#item01) -->
- [Go 루프] <!-- (/posts/mastering-go-ch03/#item02) -->
- [Go 배열] <!-- (/posts/mastering-go-ch03/#item03) -->
- [Go 슬라이스] <!-- (/posts/mastering-go-ch03/#item04) -->
- [맵] <!-- (/posts/mastering-go-ch03/#item05) -->
- [Go 상수] <!-- (/posts/mastering-go-ch03/#item06) -->
- [Go 포인터] <!-- (/posts/mastering-go-ch03/#item07) -->
- [날짜와 시간] <!-- (/posts/mastering-go-ch03/#item08) -->
- [실행 시간 측정] <!-- (/posts/mastering-go-ch03/#item09) -->

<a id="item04" />

### 4장 ‘합성 타입 사용’

먼저 구조체의 개념과 struct 키워드를 소개한 후 튜플, 스트링, 룬, 바이트 슬라이스, 스트링 리터럴 등을 살펴본다. 나머지 부분은 정규 표현식과 패턴 매칭, switch문, strings 패키지, math/big 패키지, 키-값 스토어를 구현하는 방법, XML과 JSON 파일을 다루는 방법을 소개한다.

- [합성 타입] <!-- (/posts/mastering-go-ch04/#item01) -->
- [구조체] <!-- (/posts/mastering-go-ch04/#item02) -->
- [튜플] <!-- (/posts/mastering-go-ch04/#item03) -->
- [정규 표현식과 패턴 매칭] <!-- (/posts/mastering-go-ch04/#item04) -->
- [스트링] <!-- (/posts/mastering-go-ch04/#item05) -->
- [switch문] <!-- (/posts/mastering-go-ch04/#item06) -->
- [파이 값 정확하게 계산] <!-- (/posts/mastering-go-ch04/#item07) -->
- [Go 언어로 키-값 스토어 구현] <!-- (/posts/mastering-go-ch04/#item08) -->
- [Go와 JSON] <!-- (/posts/mastering-go-ch04/#item09) -->
- [Go와 YAML 포맷] <!-- (/posts/mastering-go-ch04/#item10) -->

<a id="item05" />

### 5장 ‘데이터 구조로 Go 코드 개선’

Go 언어에서 제공하는 구조체만으로는 부족해서 데이터 구조를 직접 정의하는 방법을 소개한다. 이 과정에서 이진트리, 연결 리스트, 해시 테이블, 스택, 큐를 구현하는 방법과 각각의 장단점을 살펴본다. 또한 표준 Go 패키지인 container에서 제공하는 구조체의 사용법도 소개한다. 마지막으로 Go 언어에서 스도쿠 퍼즐을 검증하고 난수를 생성하는 방법도 알아본다.

- [그래프와 노드] <!-- (/posts/mastering-go-ch05/#item01) -->
- [알고리즘 복잡도] <!-- (/posts/mastering-go-ch05/#item02) -->
- [Go 언어에서의 이진트리] <!-- (/posts/mastering-go-ch05/#item03) -->
- [해시 테이블] <!-- (/posts/mastering-go-ch05/#item04) -->
- [연결 리스트] <!-- (/posts/mastering-go-ch05/#item05) -->
- [이중 연결 리스트] <!-- (/posts/mastering-go-ch05/#item06) -->
- [Go에서의 큐] <!-- (/posts/mastering-go-ch05/#item07) -->
- [Go에서의 스택] <!-- (/posts/mastering-go-ch05/#item08) -->
- [container 패키지] <!-- (/posts/mastering-go-ch05/#item09) -->
- [난수 생성] <!-- (/posts/mastering-go-ch05/#item10) -->
- [보안에 안전한 유사 난수 생성] <!-- (/posts/mastering-go-ch05/#item11) -->
- [행렬 계산] <!-- (/posts/mastering-go-ch05/#item12) -->
- [수도쿠 퍼즐 풀기] <!-- (/posts/mastering-go-ch05/#item13) -->

<a id="item06" />

### 6장, ‘패키지와 함수’

패키지와 함수, init() 함수 사용법, 표준 Go 패키지인 syscall, text/template, html/template을 소개한다. 또한 go/scanner, go/parser, go/token과 같은 고급 패키지 사용법도 살펴본다.

- [Go 패키지] <!-- (/posts/mastering-go-ch06/#item01) -->
- [Go 언어의 함수] <!-- (/posts/mastering-go-ch06/#item02) -->
- [Go 패키지 직접 만들기] <!-- (/posts/mastering-go-ch06/#item03) -->
- [Go 모듈] <!-- (/posts/mastering-go-ch06/#item04) -->
- [Go 패키지를 잘 만드는 방법] <!-- (/posts/mastering-go-ch06/#item05) -->
- [syscall 패키지] <!-- (/posts/mastering-go-ch06/#item06) -->
- [go/scanner, go/parser, go/token 패키지] <!-- (/posts/mastering-go-ch06/#item07) -->
- [텍스트와 HTML 템플릿] <!-- (/posts/mastering-go-ch06/#item08) -->
- [기본적인 SQLite3 명령] <!-- (/posts/mastering-go-ch06/#item09) -->

<a id="item07" />

### 7장 ‘리플렉션과 인터페이스’

Go 언어의 고급 주제 세 가지인 리플렉션, 인터페이스, type 메서드를 소개한다. 그리고 Go에서 제공하는 객체지향 기능과 Delve를 이용해 Go 프로그램을 디버깅하는 방법도 소개한다.

- [타입 메서드] <!-- (/posts/mastering-go-ch07/#item01) -->
- [인터페이스] <!-- (/posts/mastering-go-ch07/#item02) -->
- [인터페이스 정의] <!-- (/posts/mastering-go-ch07/#item03) -->
- [리플렉션] <!-- (/posts/mastering-go-ch07/#item04) -->
- [Go에서의 OOP] <!-- (/posts/mastering-go-ch07/#item05) -->
- [깃과 깃허브] <!-- (/posts/mastering-go-ch07/#item06) -->
- [Delve로 디버깅] <!-- (/posts/mastering-go-ch07/#item07) -->

<a id="item08" />

### 8장 ‘유닉스 시스템에 작업 지시’

Go 언어로 시스템 프로그래밍을 하는 방법을 소개한다. 이를 위해 flag 패키지로 커맨드라인 인수를 다루는 방법, 유닉스 시그널, 파일 입출력, bytes 패키지, io.Reader와 io.Writer 인터페이스를 다루는 방법, Viper와 Cobra Go 패키지를 사용하는 방법도 소개한다.

- [유닉스 프로세스] <!-- (/posts/mastering-go-ch08/#item01) -->
- [flag 패키지] <!-- (/posts/mastering-go-ch08/#item02) -->
- [viper 패키지] <!-- (/posts/mastering-go-ch08/#item03) -->
- [cobra 패키지] <!-- (/posts/mastering-go-ch08/#item04) -->
- [io.Reader와 io.Writer 인터페이스] <!-- (/posts/mastering-go-ch08/#item05) -->
- [bufio 패키지] <!-- (/posts/mastering-go-ch08/#item06) -->
- [텍스트 파일 읽기] <!-- (/posts/mastering-go-ch08/#item07) -->
- [파일에서 원하는 만큼 읽기] <!-- (/posts/mastering-go-ch08/#item08) -->
- [바이너리 포맷의 장점] <!-- (/posts/mastering-go-ch08/#item09) -->
- [CSV 파일 읽기] <!-- (/posts/mastering-go-ch08/#item10) -->
- [파일에 쓰기] <!-- (/posts/mastering-go-ch08/#item11) -->
- [디스크에 데이터를 읽거나 쓰기] <!-- (/posts/mastering-go-ch08/#item12) -->
- [strings 패키지 다시 보기] <!-- (/posts/mastering-go-ch08/#item13) -->
- [bytes 패키지] <!-- (/posts/mastering-go-ch08/#item14) -->
- [파일 접근 권한] <!-- (/posts/mastering-go-ch08/#item15) -->
- [유닉스 시그널 처리] <!-- (/posts/mastering-go-ch08/#item16) -->
- [Go에서의 유닉스 파이프] <!-- (/posts/mastering-go-ch08/#item17) -->
- [syscall.PtraceRegs] <!-- (/posts/mastering-go-ch08/#item18) -->
- [시스템 콜 추적] <!-- (/posts/mastering-go-ch08/#item19) -->
- [유저 ID와 그룹 ID] <!-- (/posts/mastering-go-ch08/#item20) -->
- [도커 API와 Go] <!-- (/posts/mastering-go-ch08/#item21) -->

<a id="item09" />

### 9장 ‘Go 언어의 동시성: 고루틴, 채널, 파이프라인’

Go 언어에서 동시성을 제공하기 위한 기능인 고루틴, 채널, 파이프라인을 소개한다. 또한 프로세스, 스레드, 고루틴의 차이점을 설명하고, sync 패키지 사용법과 Go 스케줄러 작동 방식도 소개한다.

- [프로세스, 스레드, 고루틴] <!-- (/posts/mastering-go-ch09/#item01) -->
- [고루틴] <!-- (/posts/mastering-go-ch09/#item02) -->
- [고루틴을 마칠 때까지 기다리기] <!-- (/posts/mastering-go-ch09/#item03) -->
- [채널] <!-- (/posts/mastering-go-ch09/#item04) -->
- [파이프라인] <!-- (/posts/mastering-go-ch09/#item05) -->
- [경쟁 상태] <!-- (/posts/mastering-go-ch09/#item06) -->
- [Go와 Rust의 동시성 모델 비교] <!-- (/posts/mastering-go-ch09/#item07) -->
- [Go와 Erlang의 동시성 모델 비교] <!-- (/posts/mastering-go-ch09/#item08) -->

<a id="item10" />

### 10장 ‘Go 언어의 동시성: 고급 주제’

9장에 이어 고루틴과 채널을 사용하는 방법을 집중적으로 소개한다. Go 스케줄러도 깊이 있게 살펴보고 강력한 키워드인 select 사용법과 다양한 타입의 채널, 공유 메모리, 뮤텍스, sync.Mutex 타입, sync.RWMutex 타입 등도 소개한다. 10장의 마지막에서는 context 패키지, 워커 풀, 경쟁 조건 감지 방법 등도 다룬다.

- [Go 스케줄러 다시 보기] <!-- (/posts/mastering-go-ch10/#item01) -->
- [select 키워드] <!-- (/posts/mastering-go-ch10/#item02) -->
- [고루틴 만료시키기] <!-- (/posts/mastering-go-ch10/#item03) -->
- [Go 채널 다시 보기] <!-- (/posts/mastering-go-ch10/#item04) -->
- [공유 메모리와 공유 변수] <!-- (/posts/mastering-go-ch10/#item05) -->
- [go문 다시 보기] <!-- (/posts/mastering-go-ch10/#item06) -->
- [경쟁 상태 발견] <!-- (/posts/mastering-go-ch10/#item07) -->
- [context 패키지] <!-- (/posts/mastering-go-ch10/#item08) -->

<a id="item11" />

### 11장 ‘코드 테스팅, 최적화, 프로파일링’

코드 테스팅, 코드 최적화, 코드 프로파일링, 크로스컴파일, 문서화, 벤치마킹, 예제 함수 작성법, 도달하지 않는 코드를 찾는 방법 등을 소개한다.

- [최적화] <!-- (/posts/mastering-go-ch11/#item01) -->
- [Go 코드 최적화] <!-- (/posts/mastering-go-ch11/#item02) -->
- [Go 코드 프로파일링] <!-- (/posts/mastering-go-ch11/#item03) -->
- [go tool trace 유틸리티] <!-- (/posts/mastering-go-ch11/#item04) -->
- [Go 코드 테스트] <!-- (/posts/mastering-go-ch11/#item05) -->
- [데이터베이스 백엔드를 갖춘 HTTP 서버 테스트] <!-- (/posts/mastering-go-ch11/#item06) -->
- [Go 코드 벤치마킹] <!-- (/posts/mastering-go-ch11/#item07) -->
- [간단한 벤치마킹 예제] <!-- (/posts/mastering-go-ch11/#item08) -->
- [쓰기 버퍼 벤치마킹] <!-- (/posts/mastering-go-ch11/#item09) -->
- [실행되지 않는 코드 찾기] <!-- (/posts/mastering-go-ch11/#item10) -->
- [크로스컴파일] <!-- (/posts/mastering-go-ch11/#item11) -->
- [예제 함수 만들기] <!-- (/posts/mastering-go-ch11/#item12) -->
- [Go 코드를 머신 코드로 변환] <!-- (/posts/mastering-go-ch11/#item13) -->
- [문서 생성] <!-- (/posts/mastering-go-ch11/#item14) -->
- [도커 이미지 사용법] <!-- (/posts/mastering-go-ch11/#item15) -->

<a id="item12" />

### 12장 ‘Go 언어를 이용한 네트워크 프로그래밍의 기초’

net/http 패키지를 사용하는 방법과 Go 언어에서 웹 서버와 웹 클라이언트를 작성하는 방법을 소개한다. 또한 http.Response, http.Request, http.Transport 구조체와 http.NewServeMux 타입을 사용하는 방법도 살펴본다. 그리고 Go 언어로 웹 사이트를 만드는 방법도 소개한다. 또한 네트워크 인터페이스의 설정 사항을 읽고 DNS를 조회하는 방법도 소개하고, 마지막으로 gRPC를 다루는 방법도 알아본다.

- [net/http, net, http.RoundTripper] <!-- (/posts/mastering-go-ch12/#item01) -->
- [TCP/IP] <!-- (/posts/mastering-go-ch12/#item02) -->
- [IPv4와 IPv6] <!-- (/posts/mastering-go-ch12/#item03) -->
- [nc(1) 커맨드라인 유틸리티] <!-- (/posts/mastering-go-ch12/#item04) -->
- [네트워크 인터페이스에서 설정 읽기] <!-- (/posts/mastering-go-ch12/#item05) -->
- [DNS 룩업] <!-- (/posts/mastering-go-ch12/#item06) -->
- [Go 언어로 웹 서버 만들기] <!-- (/posts/mastering-go-ch12/#item07) -->
- [HTTP 트레이싱] <!-- (/posts/mastering-go-ch12/#item08) -->
- [Go 언어로 웹 클라이언트 생성] <!-- (/posts/mastering-go-ch12/#item09) -->
- [HTTP 연결 타임아웃 지정] <!-- (/posts/mastering-go-ch12/#item10) -->
- [와이어샤크와 티샤크] <!-- (/posts/mastering-go-ch12/#item11) -->
- [gRPC] <!-- (/posts/mastering-go-ch12/#item12) -->

<a id="item13" />

### 13장 ‘네트워크 프로그래밍: 서버와 클라이언트 개발’

Go 언어로 HTTPS 트래픽을 다루는 방법, UDP 및 TCP 클라이언트와 서버를 작성하는 방법, net 패키지에서 제공하는 기능을 활용하는 방법을 소개한다. 그리고 RPC 클라이언트와 서버 작성법, TCP 서버에서 동시성을 지원하도록 작성하는 방법, 원본 패킷을 읽는 방법도 소개한다.

- [HTTPS 트래픽 다루기] <!-- (/posts/mastering-go-ch13/#item01) -->
- [표준 Go 패키지 net] <!-- (/posts/mastering-go-ch13/#item02) -->
- [TCP 클라이언트] <!-- (/posts/mastering-go-ch13/#item03) -->
- [TCP 서버] <!-- (/posts/mastering-go-ch13/#item04) -->
- [UDP 클라이언트] <!-- (/posts/mastering-go-ch13/#item05) -->
- [UDP 서버 구현] <!-- (/posts/mastering-go-ch13/#item06) -->
- [동시성을 지원하는 TCP 서버] <!-- (/posts/mastering-go-ch13/#item07) -->
- [TCP/IP 서버를 구동하는 도커 이미지 생성] <!-- (/posts/mastering-go-ch13/#item08) -->
- [원격 프로시저 호출(RPC)] <!-- (/posts/mastering-go-ch13/#item09) -->
- [로우레벨 네트워크 프로그래밍] <!-- (/posts/mastering-go-ch13/#item10) -->

<a id="item14" />

### 14장 ‘머신러닝’

분류, 클러스터링(군집화), 이상 감지, 아웃라이어, 신경망, 텐서플로와 같은 머신러닝 기법을 구현하는 방법을 소개하고, 아파치 카프카를 다루는 방법도 소개한다.

- [간단한 통계적 특성 계산] <!-- (/posts/mastering-go-ch14/#item01) -->
- [회귀] <!-- (/posts/mastering-go-ch14/#item02) -->
- [분류] <!-- (/posts/mastering-go-ch14/#item03) -->
- [군집] <!-- (/posts/mastering-go-ch14/#item04) -->
- [이상 감지] <!-- (/posts/mastering-go-ch14/#item05) -->
- [신경망] <!-- (/posts/mastering-go-ch14/#item06) -->
- [아웃라이어 분석] <!-- (/posts/mastering-go-ch14/#item07) -->
- [텐서플로] <!-- (/posts/mastering-go-ch14/#item08) -->
- [카프카] <!-- (/posts/mastering-go-ch14/#item09) -->

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
