---
date: 2023-06-06 00:00:00 +0900
title: python asyncio 사용법
description: Python 에서 비동기 작업 coroutine 들을 배치하고 수행하기 위한 방법을 알아보자. httpx 와 psycopg 라이브러리를 이용하여 실험했다.
categories: [Language, Python]
tags: ["coroutine", "psycopg3", "httpx", "asyncio"]
image: "https://developers.redhat.com/sites/default/files/styles/article_feature/public/blog/2021/05/Python-01.png?itok=qO_bpcrR"
---

## 0. 라이브러리 설치

```console
$ pip install "httpx"
$ pip install "psycopg[binary]"
```

## 1. asycnio 실험 설계

참고: [Python asyncio.create_task 함수](https://www.pythontutorial.net/python-concurrency/python-asyncio-create_task/)

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

> 결론: asyncio 안에서 async 모듈을 사용하여야 동시적 실행이 가능하다.

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

case2 와 같은 골자지만, task 하나에 쿼리를 2회 호출하는 것으로 변경해보았다.

- 세션 분할
    + with `psycopg.AsyncConnection.connect` as aconn
        * AsyncCursor.execute 1번 쿼리
        * AsyncCursor.execute 2번 쿼리
- 세션 독립
    + psycopg.AsyncConnection
        * AsyncCursor.execute 1번 쿼리
    + psycopg.AsyncConnection
        * AsyncCursor.execute 2번 쿼리

이와 같은 구조로 case2의 실험을 반복했다. 결과는 `차이 없음`이다.

- 실험1: psycopg.AsyncConnection 분할 2회 쿼리
    + 총 6초 소요 = 3초 + 3초
- 실험2: psycopg.AsyncConnection 독립 2회 쿼리
    + 총 6초 소요 = 3초 + 3초

#### psycopg3 의 AsyncConnection 은 generator(yield) 사용이 안된다.

`set role` 공통 작업을 수행후 session 을 전달하고 싶어 분리했는데 실패

- anext 로 비동기 객체를 받은 후 await 처리 => 코드는 정상
- 그러나 set role 이 적용된 session 이 유지도 안되고
- 두번째 쿼리에서 connection 이 툭하면 끊긴다. (첫번째 쿼리는 실행됨)
    + `psycopg.OperationalError: the connection is closed`

```py
async def gen_aconn(DATABASE_URL: str, db_role: str):
    """접속 후 공통 작업으로 set role 을 실행한다"""
    aconn = await AsyncConnection.connect(DATABASE_URL)  # autocommit=False
    async with aconn:
        # Set role
        await aconn.execute(sql.SQL("SET ROLE {}").format(sql.Identifier(db_role)))
        yield aconn


async def call_api3_db(aconn, value=1000, delay=3, tag: str = ""):
    print("- Async psycopg : dependent " + tag)
    async with aconn.cursor() as acur:
        await acur.execute(sql.SQL("select current_user, session_user"))
        obj = await acur.fetchone()  # tuple
        print("users:", obj)
    async with aconn.cursor() as acur:
        await acur.execute(
            sql.SQL("SELECT pg_sleep({}), {}*2 as value").format(delay, value)
        )
        obj = await acur.fetchone()  # tuple
        return obj[1]


async def call_api3_3(message, value=1000, delay=3):
    print(message)
    r1 = await call_api2_nw(value, delay)

    aconn = await anext(gen_aconn(DATABASE_URL, "tscraper"))
    r2 = await call_api3_db(aconn, r1, delay, "Part1")  # async part1
    aconn = await anext(gen_aconn(DATABASE_URL, "tscraper"))
    r3 = await call_api3_db(aconn, r2, delay, "Part2")  # async part2

    return r3


async def test6():
    """동시적 실행 : 9초 소요 (3+(3+3)) & (3+(3+3))"""
    print("=== test6 ===")
    start = time.perf_counter()

    task_1 = asyncio.create_task(call_api3_3("Get stock price of GOOG...", 300))
    task_2 = asyncio.create_task(call_api3_3("Get stock price of APPL...", 400))
    tasks = [task_1, task_2]

    results = await asyncio.gather(*tasks)
    print(results)

    end = time.perf_counter()
    print(f"It took {round(end-start,0)} second(s) to complete.")    
```

> 정리: psycopg3 의 AsyncConnection 은 하나의 with 구문에서 사용해야 함

with 구문과 강하게 연결된 탓인데, 공통 실행 쿼리는 함수로 빼서 사용하자.

- Async Function 의 type hint 는 Callable & Awaitable 을 사용

```py
async def set_role(conn: AsyncConnection):
    """공통으로 사용되는 쿼리 (함수 자체를 매개변수로 전달하여 사용)

    callback 으로 사용시 타입 힌트:
        => Callable[[AsyncConnection], Awaitable[None]]
    """
    await conn.execute(SQL("SET ROLE {}").format(Identifier(settings.database_role)))

async def query_test(
    pool: AsyncConnectionPool, set_role: Callable[[AsyncConnection], Awaitable[None]]
):    
    async with pool.connection() as conn:
        await set_role(conn)  # common stmt
        async with conn.cursor(row_factory=class_row(Item)) as cur:
            await cur.execute(stmt)  # select item
            return await cur.fetchall()

main()
    pool = AsyncConnectionPool(...)
    asyncio.run( query_test(pool, set_role) )
```

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


## 9. Review

- 자주 사용되는 반복적인 작업을 동시적으로 실행되도록 하면 효율이 좋아진다.
- asyncio.run 안에 create_task 로 생성된 독립된 작업들을 구성해야 한다.
- asyncio 안에서는 async 모듈만을 사용해야 한다.
    + 시간을 측정하고 기대했던 성능이 나오는지 확인해야 한다.
- 큰 얼개를 작성하고 상세 내용을 작성하는 방식이 현명하다.
    + 기껏 코드를 완성해 놓고 거대해진 코드를 대상으로 수정하는 것은 힘들다.
- fastapi 는 검증된 코루틴 실행 도구이다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
