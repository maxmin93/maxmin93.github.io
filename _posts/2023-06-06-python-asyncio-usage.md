---
title: psycopg3 asyncio 사용법
date: 2023-06-06 00:00:00 +0000
categories: ["python", "asyncio"]
tags: ["coroutine", "psycopg3", "httpx", "async"]
---

> Python 에서 비동기 작업 coroutine 들을 배치하고 수행하기 위한 방법을 알아보자. httpx 와 psycopg 라이브러리를 이용하여 실험했다.
{: .prompt-tip }

## 0. 라이브러리 설치

```console
$ pip install "httpx"
$ pip install "psycopg[binary]"
```

## 1. asycnio 실험 설계

참고: [Python asyncio.create_task()](https://www.pythontutorial.net/python-concurrency/python-asyncio-create_task/)

### 1) asyncio 사용의 기본 형태

async 함수 안에서 coroutine 들을 await 로 정렬하면 순차적으로 실행된다.

- asyncio.run( main() )
    + async def main() : 총 6초 delay (3+3)
        * await task(call_api) : 3초 delay
        * await task(call_api) : 3초 delay

코드로 작성하면 다음과 같다.

```py
async def test1():
    """순차적 실행 : 6초 소요 (3+3)"""
    print("=== test1 ===")
    start = time.perf_counter()

    task_1 = asyncio.create_task(call_api2("Get stock price of GOOG...", 300))
    task_2 = asyncio.create_task(call_api2("Get stock price of APPL...", 400))

    price = await task_1
    print(price)
    price = await task_2
    print(price)

    end = time.perf_counter()
    print(f"It took {round(end-start,0)} second(s) to complete.")

async def main():
    await test1()

if __name__ == "__main__":
    asyncio.run(main())
```


## 2. httpx 실험

delay 를 발생시키는 `http://localhost:8000/?delay=3` API를 2번 호출했다. 이를 위해 httpx 의 get 함수와 httpx.AsyncClient 의 get 함수를 비교하였다. 

> asyncio 안에서 async 모듈을 사용하여야 동시적 실행이 가능하다.

### CASE 1) asyncio( httpx.sync + httpx.sync )

create_task 안에서 coroutine 을 실행했지만, sync 모듈에 의해 6초 소요

- 총 6초 소요 = 3초 + 3초
    + task1: httpx.sync 3초 
    + task2: httpx.sync 3초 

### CASE 2) asyncio( httpx.async + httpx.async )

create_task 안에서 coroutine 이 개별적으로 동시에 실행되어 총 3초 소요 

- 총 3초 소요 = 3초 & 3초
    + task1: httpx.AsyncClient 3초 
    + task2: httpx.AsyncClient 3초 


## 3. psycopg 실험

delay 를 발생시키는 `select pg_sleep(delay)` 쿼리를 2번 호출했다. 이를 위해 psycopg 의 connect 함수와 psycopg.AsyncConnection 의 connect 함수를 비교하였다. 

> 마찬가지로 asyncio 안에서 async 모듈을 사용하여야 동시적 실행이 가능하다.

### CASE 1) asyncio( psycopg.sync + psycopg.sync )

create_task 안에서 coroutine 을 실행했지만, sync 모듈에 의해 6초 소요

- 총 6초 소요 = 3초 + 3초
    + task1: psycopg.connect.execute 3초 
    + task2: psycopg.connect.execute 3초 

### CASE 2) asyncio( psycopg.async + psycopg.async )

create_task 안에서 coroutine 이 개별적으로 동시에 실행되어 총 3초 소요 

- 총 3초 소요 = 3초 & 3초
    + task1: psycopg.AsyncConnection.execute 3초 
    + task2: psycopg.AsyncConnection.execute 3초 

### CASE 3) asyncio( psycopg.async 2회 호출 ) 을 분할 또는 독립 실행

case2 와 같은 골자지만, task 하나에 쿼리를 2회 호출하는 것으로 변경했다.

- 세션 분할
    + psycopg.AsyncConnection
        * AsyncCursor.execute 1번 쿼리
        * AsyncCursor.execute 2번 쿼리
- 세션 독립
    + psycopg.AsyncConnection
        * AsyncCursor.execute 1번 쿼리
    + psycopg.AsyncConnection
        * AsyncCursor.execute 2번 쿼리

이와 같은 구조로 case2의 실험을 반복했다. 결과는 차이 없음이다.

- 실험1: psycopg.AsyncConnection 분할 2회 쿼리
    + 총 6초 소요 = 3 + 3
- 실험2: psycopg.AsyncConnection 독립 2회 쿼리
    + 총 6초 소요 = 3 + 3


## 4. httpx + psycopg 실험

예상되는 결과이지만, 코드 얼개를 작성하기 위해 조합에 대해 실험을 진행하였다.

```py
# httpx 로 결과를 받아 psycopg 로 쿼리를 수행

async def call_api2_11(message, value=1000, delay=3):
    """sync httpx + sync psycopg"""
    print(message)
    r1 = await call_api1_nw(value, delay)  # 3초
    r2 = await call_api1_db(r1, delay)  # 3초
    return r2

async def test2():
    """순차적 실행 : 12초 소요 (6+6)"""
    print("=== test2 ===")
    task_1 = asyncio.create_task(call_api2_12("...", 300))
    task_2 = asyncio.create_task(call_api2_21("...", 400))
    price = await task_1  # 6초
    price = await task_2  # 6초

async def main():
    await test2()

if __name__ == "__main__":
    asyncio.run(main())
```

### CASE 1) asyncio( httpx.sync + psycopg.sync )

create_task 안에서 coroutine 을 실행했지만, sync 모듈에 의해 6초 소요

- 총 12초 소요 = 6초 + 6초
    + task1: httpx.sync + psycopg.sync = 6초 
    + task2: httpx.sync + psycopg.sync = 6초 

### CASE 2) asyncio( httpx.async 또는 psycopg.async )

create_task 안에 async 모듈의 실행 구간에서만 동시 실행이 진행되었다.

- 총 9초 소요 = 6초 | 6초 (3초 중첩)
    + task1: httpx.sync + psycopg.async = 6초 
    + task2: httpx.async + psycopg.sync = 6초 

### CASE 3) asyncio( httpx.async + psycopg.async )

모든 task 가 async 모듈로 구성되었기 때문에 동시적 실행에 성공했다.

- 총 6초 소요 = 6초 & 6초
    + task1: httpx.async + psycopg.async = 6초 
    + task2: httpx.async + psycopg.async = 6초 

> psycopg 쿼리 실행을 2회로 나누었어도 문제 없이 동시적으로 실행되었다.


## 9. Summary

- 자주 사용되는 반복적인 작업을 동시적으로 실행되도록 하면 효율이 좋아진다.
- asyncio 안에서는 async 모듈만을 사용해야 한다.
    + 시간을 측정하고 기대했던 성능이 나오는지 확인해야 한다.
- 큰 얼개를 작성하고 상세 내용을 작성하는 방식이 현명하다.
    + 기껏 코드를 완성해 놓고 거대해진 코드를 대상으로 수정하는 것은 힘들다.
- fastapi 는 검증된 코루틴 실행 도구이다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
