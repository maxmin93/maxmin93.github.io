---
date: 2023-02-01 00:00:00 +0900
title: Dart 공부하기 - 1일차
description: Flutter 베이스 언어인 Dart 에 대해 공부한다. Dart 는 완전한 OOP를 지원한다. (1일차)
categories: [Language]
tags: ["dart","tutorial","1st-day"]
image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Dart_programming_language_logo.svg/2560px-Dart_programming_language_logo.svg.png"
---

> 목록
{: .prompt-tip }

- [Dart 공부하기 - 1일차](/posts/flutter-tutorial-day1/) : Dart 언어 &nbsp; &#10004;

## 0. 시작하기에 앞서

메타 프로그래밍을 위해 Svelte 를 선택했는데, React 에 비해 예제와 문서가 적어 고생을 하는 중이다. 하지만 후회는 안함. 문제는 애플리케이션 개발을 위해 BaaS 도구를 다루어야 하는데, 프로그래밍 방식에 익숙치 않아 더 다양한 예제가 필요한 상황이다. 

Flutter 는 다양한 라이브러리에서 지원하고 코드가 많기 때문에 Firebase, Supabase 등과 연결된 예제가 많다. 플러터를 중심으로 애플리케이션의 메카니즘을 능숙하게 익히고 다시 Svelte 로 돌아가려 한다.

Nomad 의 니꼬쌤이 말한대로, Flutter 를 잘 다루기 위해서는 구현 언어인 Dart 에 대한 기본을 탄탄히 하는게 러닝커브를 줄이는 방법이라 Dart 공부부터 시작한다.

## 1. Dart 언어 _(2023년 2월 기준 최신버전 2.19.1)_

### 1) 특징

- Dart VM 으로 멀티플랫폼 지원 : 윈도우, 리눅스, 맥(amd, arm)
- 모바일, 데스크톱, 서버, 웹 앱 용도에 사용됨 (다목적)
- 구글에서 지원, 2011년 10월에 공개 (충분한 기간동안 성숙됨)
- 다양한 예제와 라이브러리, 커뮤니티 지원이 강점
- Javascript 를 대체할 목적이라, Typescript 특징을 대부분 커버함
  + Python, Deno 라던지, Go 언어 등의 현대적 특징을 포함

### 2) [핵심특징 5가지](https://medium.com/@tkdgy0801/flutter-개발을-위한-dart-언어-핵심-특징으-48dc1e6ccb68)

- 모든 것들이 Object 로 취급됨 (Fuction, number, null 전부 Objcet)
- `List<int>`, `List<dynamic>` 같은 제너릭 type을 지원
- Typed 언어지만, 자유도를 준다. (형식 추정)
- 클래스 멤버의 (파일 범위) private 정의가 없으며, `_` 식별자 사용
- Identifier는 `_` 아니면 letter로 시작된다. (낙타 표기법)

### 3) [Dart 주요기능](https://beomseok95.tistory.com/315)

- 두 가지 컴파일 방법 지원 (JIT + AOT)
- 핫 리로드 : 빠른 개발 가능
- 초당 60 프레임의 훌륭한 애니메이션
- 선제적 스케줄링, 타임 슬라이싱 및 공유 리소스
- Lock 없이 객체 할당 가비지 수집 가능
- 선언적인 방식의 레이아웃

### 3) 참고

- [Language samples](https://dart.dev/samples)
- [노마드 무료강의 - Dart 초급](https://nomadcoders.co/dart-for-beginners/lobby)
  + [노마드 무료강의 - Flutter 웹툰앱 만들기](https://nomadcoders.co/flutter-for-beginners/lectures/4178)

## 2. Dart 튜토리얼

console 환경에서 프로젝트를 구성하고 예제를 따라해본다.

### 1) [Console 프로젝트 구성](https://dart.dev/tutorials/server/get-started#2-install-dart)

- main 함수와 lib 파일을 임포트하는 기본 구성을 생성
  + `pubspec.yaml` 에 프로젝트 구성정보를 설정
  + `bin/{프로젝트명}.dart` 을 생성
- 멀티플랫폼에 맞는 컴파일을 통해 실행파일을 생성
  + `bin/{프로젝트명}.exe` 을 생성

```console
$ dart create -t console cli

$ cd cli

$ dart run
Hello world: 42!

$ dart compile exe bin/cli.dart

$ time bin/cli.exe
Hello world: 21!
```

- 외부 패키지 추가 : `pubspec.yaml` 의 dependecies 에 명시됨
  + 반대로 `pubspec.yaml` 에 기술 후, `dart pub get` 해도 됨

```console
$ dart pub add vector_math
Resolving dependencies... 
+ vector_math 2.1.3
Downloading vector_math 2.1.3...
Changed 1 dependency!
```

#### 프로젝트 템플릿 (`-t` 옵션)

- console (디폴트) : 커맨드라인 애플리케이션
- package : 공유 라이브러리
- server-shelf : 서버 애플리케이션
- web : 웹 애플리케이션

#### [수동으로 프로젝트 생성하기](https://alvinalexander.com/dart/how-create-dart-project-manually-command-line/)

1. `mkdir hello && cd hello`
2. `vi pubspec.yaml` : name 과 sdk 를 명시해야 함
3. `dart pub get` : 필요한 라이브러리 구성 (golang 의 get 과 유사)
4. `mkdir bin && vi bin/hello.dart` : 애플리케이션 시작 파일
5. `dart run` : 시작 파일을 실행

> dart run 으로 파일명을 명시하고 실행해도 된다.

### 2) [튜토리얼 코드](https://dart.dev/samples)

- Importing User libraries
- Variables 선언
- Control flow statements : if 문, for 문, while 문
- 가로 연결 출력을 하려면 (print 대신에) stdout.write 사용
- 파라미터를 `List<String> arguments` 로 받음
- 익명함수(Anonymous function)
- Class, Enum, Function 등

```dart
import 'package:cli/cli.dart' as cli;
import "dart:io";

// Importing User libraries
import 'package:cli/class.dart' as cls;
import 'package:cli/enum.dart' as enm;

void main(List<String> arguments) {
  // Hello world
  print('Hello world: ${cli.calculate()}!');

  // Variables
  var name = 'Voyager I';
  var year = 1977;
  var antennaDiameter = 3.7;
  var flybyObjects = ['Jupiter', 'Saturn', 'Uranus', 'Neptune'];
  var image = {
    'tags': ['saturn'],
    'url': '//path/to/saturn.jpg'
  };

  // Control flow statements
  if (year >= 2001) {
    print('21st century');
  } else if (year >= 1901) {
    print('20th century');
  }

  print('${'--' * 20}\nfor .. in:');
  for (final object in flybyObjects) {
    stdout.write('$object, ');
  }
  print('\n${'--' * 20}\nfor .. condition:');
  for (int month = 1; month <= 12; month++) {
    stdout.write('$month, ');
  }
  print('\n${'--' * 20}\nwhile .. condition:');
  while (year < 2016) {
    year += 1;
  }

  print('\n${'--' * 20}\nfunction call:');
  var result = fibonacci(20);
  print('Fibonacci of 20 is "$result"');

  // Anonymous function
  flybyObjects.where((name) => name.contains('turn')).forEach(print);

  // Classes
  var voyager = cls.Spacecraft('Voyager I', DateTime(1977, 9, 5));
  voyager.describe();
  var voyager3 = cls.Spacecraft.unlaunched('Voyager III');
  voyager3.describe();

  final yourPlanet = enm.Planet.earth;
}

// Functions
int fibonacci(int n) {
  if (n == 0 || n == 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}
```

#### 클래스 관련 항목

- Class
- Enum
- Inheritance
- Mixins
- Interfaces and abstract classes

#### 비동기 Async / Await

파일을 읽는 동안 다른 dart 코드가 CPU 를 사용하도록 함

```dart
void main() async {
  // Read some data.
  final fileData = await _readFileAsync();
  final jsonData = jsonDecode(fileData);

  // Use that data.
  print('Number of JSON keys: ${jsonData.length}');
}

Future<String> _readFileAsync() async {
  final file = File(filename);
  final contents = await file.readAsString();
  return contents.trim();
}
```

[Example: Incorrectly using an asynchronous function](https://dart.dev/codelabs/async-await#example-execution-within-async-functions)

```dart
Future<void> printOrderMessage() async {
  print('Awaiting user order...');
  var order = await fetchUserOrder();
  print('Your order is: $order');
}

Future<String> fetchUserOrder() {
  // 3초 후에 문자열 반환
  return Future.delayed(const Duration(seconds: 3), () => 'Large Latte');
}

void main() async {
  countSeconds(4); // 4초 동안 카운트
  await printOrderMessage();
}

void countSeconds(int s) {
  for (var i = 1; i <= s; i++) {
    Future.delayed(Duration(seconds: i), () => print(i));
  }
}

// 실행 결과
// Awaiting user order...
// 1
// 2
// 3
// Your order is: Large Latte
// 4
```

#### (이벤트 루프같은) Isoate.run 과 클로저

Isolate.run 안에 Future 함수를 넣거나, 클로저 함수를 바로 넣을 수 있음

```dart
void main() async {
  // Read some data.
  final jsonData = await Isolate.run(() async {
    final fileData = await File(filename).readAsString();
    final jsonData = jsonDecode(fileData) as Map<String, dynamic>;
    return jsonData;
  });

  // Use that data.
  print('Number of JSON keys: ${jsonData.length}');
}

Future<Map<String, dynamic>> _readAndParseJson() async {
  final fileData = await File(filename).readAsString();
  final jsonData = jsonDecode(fileData) as Map<String, dynamic>;
  return jsonData;
}
```

#### Exception 처리 : try ... on .. catch .. finally

```dart
try {
  //code that has potential to throw an exception
} on SomeException {
  //code
} on AnotherException {
  //code
} catch(e) {
  //code
} finally {
  //code
}
```

## 3. 샘플 및 자습서

### 1) null 세이프티

- 타입+? : nullable 선언 (var 는 안되고 타입 선언만)
- `??=` : null 할당 연산자
- `??` : null 병합 연산자
- `.?` : 선택적 연결 연산자

```dart
int? a = 5;

int b = a; // Not allowed.
int b = a!; // Allowed.
```

### 2) 선언

- `?` 으로 nullable 선언하거나 또는 기본값 초기화
  + ex) `int? lineCount;`, `int lineCount=0;`
- Late variables : 우선 선언하고 나중에 초기화
  + ex) `late String descriptioin;`
- final (변경불가), const (컴파일 타임 상수)
  + ex) `final name = 'Bob';`, `const bar = 1000;`

### 3) 내장타입

- 숫자 : int, double, bool
- 문자열 : String (UTF-16 코드 사용)
  + 객체 출력시 객체의 toString 멤버 함수를 호출함
  + 다중 문자열 기술할 때는 삼중 따옴표 (``` 또는 """) 을 사용
  + 원시 문자열, ex) `var s = r'line \n next line';`
- 배열 : List
  + ex) `var list = const [1,2,3];`
  + `...` 연산자로 배열을 삽입, nullable 의심되면 `[...?list]`
- 집합 : Set
  + ex) `var halogens = {'A','B'}`
- 맵 : Map
  + ex) `var gift = {1:'first', 2:'second'};`
- 룬 : Runes, characters
  + 개별 유니코드 문자를 읽거나 쓸 때 characters 패키지를 이용해야 함
  + ex) `var hi = 'Hi 🇩🇰'; print('${hi.characters.last}');`
- 기호(`#`) : Symbol
- null 값 : Null

### 4) 매개변수

선택적 위치 매개변수 `[ .. ]`

```dart
multiply(int a, [int b = 5, int? c]) {
  ...
}

main() {
  // All are valid function calls.
  multiply(3);
  multiply(3, 5);
  multiply(3, 5, 7);
}
```

명명된 매개변수 `{ .. }`

```dart 
multiply(bool x, {required int a, int b = 5, int? c}) {
  ...
}

multiply(false, a: 3); // Only provide required named parameters
multiply(false, a: 3, b: 9); // Override default value of `b`
multiply(false, c: 9, a: 3, b: 2); // Provide all named parameters out of order
```
{: file="명명된 매개변수"}

### 5) 제너레이터 yield

```dart
Iterable<int> naturalsTo(int n) sync* {
  int k = 0;
  while (k < n) {
    yield k++;
  }
}

// Returns an iterable with [0, 1, 2, 3, 4]
print(naturalsTo(5).toList());
```

### 6) [비동기 프로그래밍 Streams](https://dart.dev/tutorials/language/streams)

- 스트림은 이벤트 또는 데이터의 비동기 시퀀스를 제공
- 스트림 이벤트 수신 : `await for`
- 스트림은 단일 구독 또는 브로드캐스트 두 종류가 있음

> Java 의 Stream 과 유사하다.

```dart
Future<int> sumStream(Stream<int> stream) async {
  var sum = 0;
  await for (final value in stream) {
    sum += value;
  }
  return sum;
}

Stream<int> countStream(int to) async* {
  for (int i = 1; i <= to; i++) {
    yield i;
  }
}

void main() async {
  var stream = countStream(10);
  var sum = await sumStream(stream);
  print(sum); // 55
}
```

## 9. Review

- 언어들이 서로 베끼기를 해서 짬뽕이다. 유사하면서도 헷갈린다.
  + Java, Kotlin, Go, Python, Typescript 등등의 혼합
- [Javascript 와의 유사점을 비교하며 설명한 글](https://dart.dev/guides/language/coming-from/js-to-dart)이 도움이 된다.
- Flutter 사용 사례를 바탕으로 Dart 언어를 계속 발전시키고 있다.
  + 계속 본다고 해도 끝이 안날듯
  + Flutter 를 사용하며 부족한 문법을 살펴보는게 낫겠다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
