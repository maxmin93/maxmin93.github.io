---
date: 2023-07-25 00:00:00 +0900
title: Typescript 5 튜토리얼 - 2일차
description: using, satisfies 같은 새로운 키워드도 나오고 버전도 계속 올라가면서 보수 교육이 필요해졌다. 최신 문서들을 참고해 공부하고 기록해보자.
categories: [Language, Typescript]
tags: []
image: "https://velog.velcdn.com/images/kwontae1313/post/2b6e1f63-0d35-49a7-ab5b-9dcddf04172b/image.png"
---

> 목록
{: .prompt-tip }

- [Typescript 5 튜토리얼 - 1일차](/posts/typescript-5-tutorial-day1/) - 새로운 기능들
- [Typescript 5 튜토리얼 - 2일차](/posts/typescript-5-tutorial-day2/) - 공식문서 Part&#9839;1 &nbsp; &#10004;

## 1. Typescript 공식문서

모르는 내용, 되새김이 필요한 내용만 선별하여 기록합니다.

### 1) Typescript 를 사용하는 이유

- 런타임 오류 같은 치명적인 문제를 방지할 수 있다.
- 코드 상의 타입 관련 버그를 잡아내고 (오류 메시지도 제공)
- VSCode 같은 개발도구와 결합하여 코드를 작성하는 순간에 오류를 막아주고, 올바른 접근을 제시한다.

## 2. Everyday Types

### [객체 타입](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#object-types)

- 함수 매개변수로 객체 타입을 직접 사용할 수 있다.
  + 또는 type, interface 로 선언할 수 있다.
- last 속성은 undefined 검사를 해야 사용할 수 있다
  + `?` 은 optional 을 의미

```ts
// 객체 타입을 type 별칭으로 정의할 수도 있다
type Name = {
  first: string;
  last?: string;
};

function printName(obj: { first: string; last?: string }) {
  // 오류 - 'obj.last' is possibly 'undefined'.
  // console.log(obj.last.toUpperCase());
  
  if (obj.last !== undefined) {
    console.log(obj.last.toUpperCase());
  }
 
  // 최신 JavaScript 문법을 사용하였을 때 또 다른 안전한 코드
  console.log(obj.last?.toUpperCase());
}
```

### [유니언 타입](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

- 서로 다른 두 개의 타입을 조합하여 사용할 수 있는데
- 타입 가드로 타입 확정을 해야 정상적으로 사용할 수 있다.
  + string 함수를 사용하려면 string 타입을 확정해야 함

```ts
function printId(id: number | string) {
  if (typeof id === "string") {
    // 이 분기에서 id는 'string' 타입을 가집니다
    console.log(id.toUpperCase());
  } else {
    // 여기에서 id는 'number' 타입을 가집니다
    console.log(id);
  }
}


type CodeArray = number[] | string;

// 반환 타입은 'number[] | string'으로 추론됩니다
function getFirstThree(x: number[] | string): CodeArray {
  return x.slice(0, 3);
}

let result = getFirstThree([1,2,3,4]);
console.log(result);
```

### [타입 별칭(type)과 인터페이스의 차이점](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases)

- interface 는 extends(확장) 으로 추가될 수 있다 (개방형)
  + 오직 `객체 타입`을 선언하는 데에만 사용된다 (원시타입은 불가)
- type 은 property 추가가 안되지만 (폐쇄형)
  + `&` 연산자를 이용해 다른 타입 별칭으로 확장할 수 있다

```ts
type Animal = {
  name: string
}

type Bear = Animal & {
  honey: Boolean
}

const bear = getBear();
bear.name;
bear.honey;
```

### [타입 명시(Assertion)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

Assertion 을 한국어로 풀이하자면 '주장','단언' 이라는데 '명시'가 어울린다.

- `as` 키워드를 이용하거나, 꺽쇠 기호를 이용하거나
- 강제적인 타입 변환을 하고 싶으면, any 변환 후 원하는 type T 로 변환한다.

```ts
const myCanvas = document.getElementById("main_canvas") as HTMLCanvasElement;
const myCanvas = <HTMLCanvasElement>document.getElementById("main_canvas");

// 번거롭지만 두번 치환하여 형변환을 강제할 수 있다
const a = (expr as any) as T;
```

### [리터럴 타입 (유니언과 함께 사용)](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#literal-types)

```ts
// 오직 한 종류의 문자열만 나타낼 수 있다
const constantString = "Hello World";

function printText(s: string, alignment: "left" | "right" | "center") {
  // ...
}
printText("Hello, world", "left");
printText("G'day, mate", "centre");  // <-- type Error

// 숫자 리터럴도 가능
function compare(a: string, b: string): -1 | 0 | 1 {
  return a === b ? 0 : a > b ? 1 : -1;
}
```

### [null 과 undefined](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#null-and-undefined)

- 컴파일 옵션 strictNullChecks 가 설정되었다면, 반드시 테스트해야 사용 가능
- null 과 undefined 는 서로 타입이 다르므로 타입 없는 `==` 비교만 가능

```ts
// 다음 값이 아닌 경우 활성화: null, undefined, 0, false, "", NaN
if ( value ) or if ( !!value )

// 또는 다음 값인 경우 활성화: null, undefined, 0, false, "", NaN
if ( !value )
```

## 3. Narrowing (타입 한정)

### [`in` 연산자 타입 한정](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

- 객체 타입의 속성을 검사하여 타입 한정을 수행

```ts
type Fish = { swim: () => void };
type Bird = { fly: () => void };
 
function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    return animal.swim();
  }
 
  return animal.fly();
}
```

### [type 검사기(predicate) 사용](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)

- `pet is Fish` 의 결과를 생성하는 return 문을 작성한다

```ts
// type predicate 함수 => pet is Fish => Boolean
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();
 
if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

### [유니언 식별](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)

> kind 값을 통해 radius 또는 sideLength 속성의 유무를 결정한다면

**(문제점)** typescript 는 아래 코드에 대해 할 수 있는 것이 없다.

```ts
interface Shape {
  kind: "circle" | "square";
  radius?: number;
  sideLength?: number;
}
```

> type 을 분리하고, 공통 속성인 kind 에 대한 타입 한정을 서술해야 한다.

```ts
interface Circle {
  kind: "circle";
  radius: number;
}
 
interface Square {
  kind: "square";
  sideLength: number;
}
 
type Shape = Circle | Square;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;                      
    case "square":
      return shape.sideLength ** 2;
  }
}
```

### [export 와 declare global](https://zelord.tistory.com/83#:~:text=%2F%2F%20index.ts%20declare%20let,index.js%EC%97%90%EC%84%9C%EB%8A%94%20%EB%82%98%ED%83%80%EB%82%98%EC%A7%80%EC%95%8A%EB%8A%94%EB%8B%A4.)

- 전역으로 쓸 수 있는 파일을 ambient module이라고 한다. 
  + 같은 디렉토리 내의 ts 파일들은 서로 사용이 가능
- `export` 키워드는 노출될 변수를 선언한다.
  + `export` 키워드 사용시, 그 외의 변수는 local 로만 취급되어 외부에서 접근할 수 없다. (`import` 키워드도 마찬가지로 로컬 모듈을 생성시킨다)
- `declare` 키워드는 선언된 변수가 이미 존재한다고 알리는 것이다.
- `declare global` 은 global 변수가 되었음을 선언한다.
  + import 없이 다른 외부에서 global 변수를 사용할 수 있게 된다.

```ts
// data.ts

export {};  // export 키워드로 인해 모든 변수 및 타입들이 로컬에서만 사용가능하도록 된다.
var num:number = 20;  // 로컬에서만 사용 가능한 변수

// declare global 키워드로 인해 안에 있는 타입이 글로벌로 변경되어 다른 파일에서도 사용할 수 있다.
declare global {  
    type MyName = string;
}
```
{: file="data.ts"}

```ts
// index.ts

let myname: MyName = 'zelord';  // data.ts에서 declare global 키워드로 인해 사용이 가능하다.
console.log(num + 1);  // export 키워드로 인해 사용이 불가능하다.
```
{: file="index.ts"}

### [공집합 never 타입](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#the-never-type)

- `never` 는 값이 없거나 없어야만 하는 곳에 사용
  + 불가한 예외 사항들을 다루거나 제한을 거는 용도로 사용

> any, unknown 와 관련하여 비교

- `unknown` 은 값이 있지만, any 타입을 가지게 되는 곳에 사용
  + `any` 타입은 (안전하지 않아도) 꼭 필요한 경우 외에는 타입 변형을 해야 함

> 예제 코드에서 never 는 Triangle 타입을 할당 받게 되고 오류 출력

```ts
interface Circle {
  kind: "circle";
  radius: number;
}

interface Square {
  kind: "square";
  sideLength: number;
}

// 선언 했지만 안쓰임
interface Triangle {
  kind: "triangle";
  sideLength: number;
}
 
type Shape = Circle | Square | Triangle;

function getArea(shape: Shape) {
  switch (shape.kind) {
    case "circle":
      return Math.PI * shape.radius ** 2;
    case "square":
      return shape.sideLength ** 2;
    default:
      const _exhaustiveCheck: never = shape;  // <-- Error
      return _exhaustiveCheck;
  }
}

let circle: Shape = {kind: 'triangle', sideLength: 10};
let result = getArea(circle);
console.log(result);
```

## 9. Review

- never 키워드는 무슨 용도로 써야 하는지 감이 안잡힌다. 
- 공식문서의 함수편은 다음 포스트로 미룬다. (양이 많다)


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

