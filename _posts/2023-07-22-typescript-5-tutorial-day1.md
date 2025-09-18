---
date: 2023-07-22 00:00:00 +0900
title: Typescript 5 튜토리얼 - 1일차
description: using, satisfies 같은 새로운 키워드도 나오고 버전도 계속 올라가면서 보수 교육이 필요해졌다. 최신 문서들을 참고해 공부하고 기록해보자.
categories: [Language, Typescript]
tags: ["type-guard", "using", "1st-day"]
image: "https://velog.velcdn.com/images/kwontae1313/post/2b6e1f63-0d35-49a7-ab5b-9dcddf04172b/image.png"
---

> 목록
{: .prompt-tip }

- [Typescript 5 튜토리얼 - 1일차](/posts/typescript-5-tutorial-day1/) - 새로운 기능들 &nbsp; &#10004;
- [Typescript 5 튜토리얼 - 2일차](/posts/typescript-5-tutorial-day2/) - 공식문서 Part&#9839;1

## 1. Typescript 기능들

최근 5.2 beta 버전까지 나왔다. 주요 기능 위주로 빠르게 살펴보자

### 1) 데코레이터

클래스 및 클래스 멤버에 대해서 데코레이터를 정의하고 적용할 수 있다.

- 다중 적용시 위에서 아래로, 포함하는 관계로 실행순서가 정해진다

```ts
function first() {
  console.log("first(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): called");
  };
}
 
function second() {
  console.log("second(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): called");
  };
}
 
class ExampleClass {
  @first()
  @second()
  method() {}
}

// -----------------------------
// # 출력 결과
// -----------------------------
// first(): factory evaluated
// second(): factory evaluated
// second(): called
// first(): called
```

> class 데코레이터 예제

```ts
@ClassDecorator
class A {
  b: string = "Hello"

  get c(): string {
    return `${this.b} World!`
  }

  d(e: string): void {
    console.log(e)
  }
}

function ClassDecorator(constructor: typeof A) {
  console.log(constructor)
  console.log(constructor.prototype)
}

// -----------------------------
// # 출력 결과
// -----------------------------
// [Function: A]
// { c: [Getter], d: [Function (anonymous)] }
```

### 2) `as const` 와 `keyof` 로 유니온(Union) 타입 선언

```ts
// 객체로 as const 선언
const status = {
  todo: 'todo',
  inProgress: 'inProgress',
  complete: 'complete',
  cancel: 'cancel',
} as const;

// 또는 배열로 as const 선언
const status = ['todo', 'inProgress', 'complete', 'cancel'] as const;

// 유니온 타입 생성
type Status = typeof status[keyof typeof status];
// 'todo' | 'inProgress' | 'complete' | 'cancel'
```

#### `as const` 으로 literal type 추론

```ts
// const title:"typescript" 리터럴 타입으로 추론됨
const title = 'typescript';

// as const 를 이용하면 let 을 사용해도 리터럴 타입으로 추론됨
let title = 'typescript' as const;

// as const 를 이용하여 export 하면
const Colors = {   
    red: "RED",   
    blue: "BLUE",   
    green: "GREEN", 
} as const;

// key 가 자동으로 추출되어 자동으로 멤버 추론을 할 수 있다
Colors.blue  // 또는 red, green
```

#### 유니온 타입과 `enum` 타입 (가독성)

literal 타입 대신 기억하기 쉬운 korean 같은 이름을 사용하려면 enum 을 활용

```ts
// 유니온 타입 예제
type LanguageCode = 'ko' | 'en' | 'ja' | 'zh' | 'es'
const code: LanguageCode = 'ko'

// 이렇게 하면 언어 코드가 위아래에 중복되고 코드가 너무 길어진다
const korean = 'ko'
const english = 'en'
const japanese = 'ja'
const chinese = 'zh'
const spanish = 'es'
type LanguageCode = 'ko' | 'en' | 'ja' | 'zh' | 'es'
const code: LanguageCode = korean

// enum 을 사용하면 코드 가독성을 높일 수 있다
export enum LanguageCode {
  korean = 'ko',   
  english = 'en',
  japanese = 'ja',
  chinese = 'zh',
  spanish = 'es',
}
// enum 도 as const 처럼 리터럴 타입을 갖게 한다
// (의미상) LanguageCode === 'ko' | 'en' | 'ja' | 'zh' | 'es'
const code: LanguageCode = LanguageCode.korean

const keys = Object.keys(LanguageCode) // ['korean', 'english', ...]
const values = Object.values(LanguageCode) // ['ko', 'en', ...]
```

> 단, enum 을 사용하면 객체가 생성됩니다. 그래서 union type 을 추천

union type 을 채택하면 가질 수 있는 장점 

- 객체가 생성되지 않고, 
- import 를 할 필요가 없다


## 2. [Typescript 4.9 새로운 기능](https://medium.com/@yujso66/%EB%B2%88%EC%97%AD-typescript-4-9-73f94ec1ce9c)

- satisfies 연산자
- in 연산자를 사용한 목록에 없는 프로퍼티 좁히기
- 클래스의 자동 접근자 `accessor`
- NaN에 대한 동등성 검사
- 파일 감시에 파일 시스템 이벤트를 사용
  + 폴림 방식 fs.watchFile, 이벤트 방식 fs.watch

### 1) satisfies 연산자

- keys 와 values 에 대한 타입 검사를 한번에 처리
  - 예) bleu 오타 검사와 각 value 의 타입 검사까지 한방에 처리

```ts
// 기존 방식 : key 오타만 잡아낼 수 있었다
const palette: Record<'red' | 'green' | 'blue', [number, number, number] | string> = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255], // 오타 발견!
};

// 배열 [number, number, number] 일수도 있어서 타입 오류
const greenNormalized = palette.green.toUpperCase();

// satisfies 타입 연산자 사용하여 keys, values 를 동시에 만족하는지 검사
const palette = {
    red: [255, 0, 0],
    green: "#00ff00",
    bleu: [0, 0, 255], // blue 오타
} satisfies Record<'red' | 'green' | 'blue', [number, number, number] | string>;
```

SvelteKit 의 TS 코드에서 사용되는 [satisfies 예제](https://kit.svelte.dev/docs/load)

- parameters 의 Record 구조체와 return 타입까지 한번에 타입 검사 가능

```ts
import type { PageLoad } from './$types';

export const load = (({ params }) => {
    return {
        post: {
            title: `Title for ${params.slug} goes here`,
            content: `Content for ${params.slug} goes here`
        }
    };
}) satisfies PageLoad;
```

#### in 연산자로 유니온 타입 결정하기

RGB 와 HSV 두가지 타입이 가능한 경우 key 존재 유무로 HSV 타입 결정 가능

```ts
interface RGB {
  red: number;
  green: number;
  blue: number;
}

interface HSV {
  hue: number;
  saturation: number;
  value: number;
}

function setColor(color: RGB | HSV) {
  if ("hue" in color) {
    // 'color'의 타입은 HSV입니다.
  }
}
```

> mapped type 에서 in 연산자 사용 예제

```ts
type Fruit = 'apple' | 'banana' | 'orange';

// mapped type 선언 : in 연산자로 Fruit 타입 추론
const PRICE_MAP: { [fruit in Fruit]: number } = {
  apple: 1000,
  banana: 1500,
  orange: 2000,
};

// mapped type 활용
function getDiscountedPrice(fruit: Fruit, discount: number) {
  return PRICE_MAP[fruit] - discount;
}
```

#### NaN 대신에 Number.isNaN 을 사용

기존에 모호했던 NaN 비교 대신에 Number.isNaN 을 사용

```ts
function validate(someValue: number) {
  return someValue !== NaN;
  //     ~~~~~~~~~~~~~~~~~
  // 에러: 이 조건은 항상 'true'를 반환할 것입니다. (❌)
}

// 당신이 원하는 것은 '!Number.isNaN(someValue)' 아닌가요?
function validate(someValue: number) {
  return !Number.isNaN(someValue);
}
```

### 2) 타입스크립트 5.1

#### return 생략 가능 &rArr; 반환 타입 undefined

```ts
function foo() {
    // no return
}
// x = undefined
let x = foo();
```

#### 자동 자원 해제를 위한 `using` 키워드

참고: [Typescript 의 새로운 키워드 'using'](https://opnay.com/p/1311e9ae-0913-4ddd-bd5c-b2af67065bc0)

- let, const 변수 선언 키워드에 함께 사용
- 자원 해제 후에도 handler 에 접근할 수 있는 문제를 방지
- 블록 스코프를 벗어날 때 자동으로 자원을 해제해 주는 새로운 기능
  + 반복적인 패턴을 줄여주고, 자원 해제를 잊는 경우를 방지하기 위한 목적

```ts
// 반복적인 패턴 : 자원 할당과 해제
try {
  const resource = getResource();
  try {
    const reader = resource.getReader();
    // ...
  } finally {
    reader.close();
  }
} finally {
  resource.release();
}

// -------------------------------------

// using 키워드로 간편하게 작성
{
  using resource = getResource();
  using reader = resource.getReader();
  const { value, done } = reader.read();
} 
// 블록을 벗어날 때 'reader' => 'resource' 순으로 자원 해제
// 이후로 resource, reader 접근을 할 수 없다
```


### 3) 타입 계층 트리

![Typescript 타입 계층 트리](https://blog.kakaocdn.net/dn/RFH1X/btrL5yYwuHz/N2HeWJGbAQ4kEMI39S1G3K/img.png){: width="600" .w-75}
_Typescript 타입 계층 트리_

`unknown` 타입이 최상위 계층에 있다. &rArr; any 타입에만 할당 가능

> unknown 타입 필요성 

사용자로부터 입력을 받거나 잘 알려지지 않은 외부 API를 사용하는 등 실제로 어떤 값이 올 지 모를 때, 어떤 값이든 할당할 수 있지만 정작 이후에 그 값을 사용할 때는 타입 체킹을 해야만 안전하게 사용할 수 있는 타입이 필요해서 만들게 되었다고 한다. (any 보다 제한적인 타입)

#### upcast vs downcast 개념 그림

![타입 할당 - up, down](https://blog.kakaocdn.net/dn/coH7BT/btrxwYWLmLz/0gFKqQqfFE3SjzIR7RcEBk/img.png){: width="600" .w-75}
_타입 할당 - up, down_


## 2. [`as` 를 제거하는데 도움되는 방법](https://blog.theodo.com/2022/01/typescript-replace-as-typeguards/) - 타입 가드

```ts
interface Book {
  id: number;
  author: string;
  publisher?: string;
}

const book = fetch("baseUrl/get-book?id=5") as Book;
```

### 1) `as` 는 assertion 타입이다

- 데이터 변환을 수행하지 않는다
- assertion 이 가능한지만 확인한다

> 주요 용도는 (보호나 보장이 아닌) 개체의 가상 유형에 대해 알려주는 것이다.

### 2) typeof, instanceof 는 타입 가드의 기본 연산자

```ts
typeof 90 === 'number'
typeof "abc" === 'string'

new Date() instanceof Date === true
```

#### typeof 타입가드를 활용한 함수 예제

```ts
function getAgeText(age: number | string) {
  if (typeof age === "number") {
    return age.toFixed(2);
  } else {
    return age.trim();
  }
}
```

> Error 또는 assert 로도 타입가드를 기술할 수 있다.

```ts
// undefined 이면 Error 
function assert(value: any, errorMsg: string): asserts value {
  if (!value) throw new Error(errorMsg);
}

// undefined 이면 assertion Error 
function toString(value?: number) {
  assert(value !== undefined, "value 는 undefined 가 아니어야 한다.");
  return value.toFixed(2);
}
```

### 3) type-guard 이용한 Book 검증 함수

```ts
const isBook = (element: unknown): element is Book =>
    // Object.prototype.hasOwnProperty.call(element, "author") &&
    // Object.prototype.hasOwnProperty.call(element, "id") &&
    hasAttributes(element, ["author", "id"]) &&
    typeof element.author === "string" &&
    typeof element.id === "number";

const gift: unknown = getGift();

if (isBook(gift)) {
    /*
    * In this if-block the TypeScript compiler actually
    * resolved the unknown type to the type Book
    */

    read(gift);
    // read needs an argument of type Book

    return gift.author;
}
```

> jest 사용시 

```ts
it("should return true if the element is a book", () =>{
  const element1 = { author: "alpha"};
  expect( isBook(element1)).toBe(false);

  const element2 = {"id": 2000};
  expect( isBook(element2)).toBe(false);

  const element3 = { author: "alpha"; "id": 2000};
  expect( isBook(element3)).toBe(true);
})
```

#### 또 다른 예제: String Array 타입 가드

```ts
const myValue: unknown = JSON.parse(`[ "a", "b", "c" ]`)

function isStringArray(array: unknown): array is string[] {
  if (!Array.isArray(array)) return false

  const hasNonStringElement = array.some(element => typeof element !== 'string')
  return !hasNonStringElement
}

if (isStringArray(myValue)) {
  console.log(myValue.join(''))
}
```

## 3. [TypeScript 모범 사례 — 스위치, 표현식 및 다운캐스팅](https://javascript.plainenglish.io/typescript-best-practices-switches-expressions-and-downcasting-a27957787d06)

#### 대괄호와 문자열 속성값으로 접근해서는 안된다

```ts
// 이렇게 쓸 수도 있겠지만, 하지 말아야 한다 (❌)
obj['prop']  

// 올바른 사용법
obj.prop
```

#### 오류 생성시 문자열 값을 사용하지 마라

```ts
throw 'error';  // 이렇게 쓸 수도 있겠지만, ❌

throw new Error("error");  // 올바른 사용법
```

#### Switch 의 Case 를 통과해서는 안된다

break 또는 return 문이 들어가 있어서 격리되어야 한다

```ts
// 이렇게 쓸 수도 있겠지만, ❌
switch (foo) {
  case 1:
    doWork(foo);
  case 2:
    doOtherWork(foo);
}

// 올바른 사용법
switch (foo) {
  case 1:
    doWork(foo);
    break;
  case 2:
    doOtherWork(foo);
    break;
}
```

#### this 를 다른 변수로 전달하지 말 것

```ts
const self = this;  // 이렇게 쓸 수도 있겠지만, ❌
setTimeout(function() {
  self.work();
});

setTimeout(() => {
  this.work();  // 올바른 사용법
});
```

#### 보호되지 않는 메소드를 사용하지 말 것

이후 class 가 변경될 수 있기 때문에, 보안상 instance 생성 후 호출을 권장

```ts
class Foo {
  public log(): void {
    console.log(this);
  }
}
Foo.log();  // 이렇게 쓸 수도 있겠지만, ❌

class Foo {
  public log(): void {
    console.log(this);
  }
}
const foo = new Foo();
foo.log();  // 올바른 사용법

// 참고: bind 를 이용한 함수 레퍼런스로 호출하는 방법
const manualLog = foo.log.bind(foo);
manualLog.log();
```

#### any 로 타입 캐스팅을 해서는 안된다 (Downcast)

> Downcasting to any 의 반대는 Upcasting from any

```ts
// 이렇게 쓸 수도 있겠지만, ❌
const foo = bar as any;

// 올바른 사용법
interface Bar {
  [key: string]: string | number; 
  [index: number]: string; 
  baz: number;
}
const foo: Bar = bar;
```

#### finally 블럭에 흐름 제어문을 사용해서는 안된다

return, continue, break, throws 등은 try/catch 문에서 사용할 것

```ts
try {
  doWork();
}
catch(ex) {
  console.log(ex);
}
finally {
  return false;  // 이렇게 쓸 수도 있겠지만, ❌
}

try {
  doWork();
  reutrn true;
}
catch(ex) {
  console.log(ex);
  return false;  // 올바른 사용법
}
```

## 9. Review

- 슈퍼셋 언어라서 새로운 개념이나 필요성이 제기될 때마다 바로바로 반영된다.
- Symbol.dispose 는 뭔지 잘 모르겠다. 쓸 일이 생기면 그 때 다시 살펴보자.

> Zod 패키지

- API 사용시 [Zod 패키지](https://zod.dev/)로 json 검증을 하자 (런타임시 타입 안전 보장)
  + 설치: `npm i zod`

```ts
import { z } from "zod";

// 스키마 정의
const User = z.object({
  email: z.string(),
  age: z.number(),
  active: z.boolean(),
});

User.parse({
  email: "user@test.com",
  age: 35,
  active: true,
}); // ✅ 유효성 검증 통과

User.parse({
  email: "user@test.com",
  age: "35",
}); // ❌ 유효성 검증 실패


// 스카마로부터 타입을 추론 👍
type User = z.infer<typeof User>;

function processUser(user: User) {
  User.parse(user); // 유효성 검증
  // 사용자 처리 로직
}
```

### 참고문서

- [Microsoft 공식문서 - Announcing TypeScript 5.0](https://devblogs.microsoft.com/typescript/announcing-typescript-5-0/)
- [Exploring TypeScript 5 features: Smaller, simpler, faster](https://blog.logrocket.com/exploring-typescript-5-features-smaller-simpler-faster/)
- [카카오 FE 기술블로그 - 타입스크립트 꿀팁](https://fe-developers.kakaoent.com/2021/211012-typescript-tip/)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

