---
date: 2023-07-13 00:00:00 +0900
title: Typescript 5 튜토리얼 - 1일차
categories: ["language","typescript"]
tags: ["decorator", "using", "1st-day"]
image: "https://blog.theodo.com/static/ba2166b279b234c4824d1c2fb299ced2/a79d3/ts_logo.png"
hidden: true
---

> using 같은 새로운 키워드도 나오고 버전도 계속 올라가면서 보수 교육이 필요해졌다. 최신 문서들을 참고해 공부하고 기록해보자.
{: .prompt-tip }

## 1. Typescript 5 새로운 기능들

- 더 빠른 컴파일
- 향상된 오류 메시지
- 더 엄격한 클래스 속성 초기화

### 1) Typescript 4.9 새로운 기능

- satisfies 연산자
- in 연산자를 사용한 목록에 없는 프로퍼티 좁히기
- 클래스의 자동 접근자
- NaN에 대한 동등성 검사
- 파일 감시는 이제 파일 시스템 이벤트를 사용합니다.
- 에디터용 “Remove Unused Imports” 및 “Sort Imports” 명령어 추가
- return 키워드에 대한 정의한 부분으로 이동 기능
- 성능 개선
- 정확 수정 및 브레이킹 체인지

### 2) 타입스크립트 5.1

> return 생략 가능 &rArr; 기본 반환 타입 undefined

```ts
function logMessage(message: string): undefined {
    console.log(message);
    // No return statement needed here
}
```


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


## 9. Summary


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

