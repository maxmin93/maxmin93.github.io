---
date: 2023-05-29 00:00:00 +0900
title: psycopg3 Sync/Async 예제
description: Python 에서 Postgresql 를 다루기 위한 psycopg 라이브러리에 대해 공부해보자. Sync, Async 및 fastapi 에서의 사용 방법을 다룬다.
categories: [Language, Python]
tags: ["psycopg3", "pool", "python", "async", "fastapi"]
image: "https://miro.medium.com/v2/resize:fit:1400/1*9ma4X2mX_-KSw8hapRP9gw.gif"
---

## 0. [psycopg3 설치](https://www.psycopg.org/psycopg3/docs/basic/install.html)

```console
$ pip install "psycopg[binary]"

$ pip install "psycopg[binary,pool]"  # psycopg_pool 포함
```

## 1. psycopg 동기식 사용 (sync)

### 1) DB 접속

autocommit 옵션을 사용하면 모든 변경 사항이 즉시 반영된다. 

```py
import psycopg
from psycopg import connection, sql
from psycopg.rows import class_row
from pydantic import BaseModel

def connect_db(DATABASE_URL: str) -> connection.Connection | None:
    """Connect to the PostgreSQL database server

    참고:
        - current_date => datetime.date (time 데이터 없음)
        - current_timestamp, now() => datetime.datetime
    """
    try:
        conn = psycopg.connect(DATABASE_URL, autocommit=True)

        # Test connection
        with conn.cursor() as cur:
            cur.execute("select current_timestamp, 'ok' as result")
            data = cur.fetchone()
            print("data[0]:", data[0], type(data[0]))
            print("data[1]:", data[1], type(data[1]))
            assert data[1] == "ok"
        return conn
    except psycopg.Error as e:
        print("Unable to connect!", e)

def main(DATABASE_URL: str):
    conn = connect_db(DATABASE_URL)
    if conn is None:
        return


if __name__ == "__main__":
    # load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")
    main(DATABASE_URL)        
```

### 2) pydantic 자료구조

dataclasses 또는 pydantic 을 사용하면 select 할 때 편리하다.

- insert 할 때는 클래스 사용이 별 도움이 못된다.
- pydantic 의 validator 데코레이터를 이용하면 제약사항을 기술할 수 있다.

```py
from pydantic import BaseModel
from pytz import timezone

class TestRow(BaseModel):
    id: int | None
    logdate: datetime
    info: dict
    phones: List[str] = []
    content: str | None = ""  

    @validator("content")
    def content_default(cls, v):
        print(f"validator(content): {v}")  # => None
        return v or "no data"  # if null, set default value


def main(DATABASE_URL: str):
    conn = connect_db(DATABASE_URL)

    # 직접 정의하거나 dict 으로부터 parse_obj 로 생성
    data = TestRow.parse_obj(
        {
            "logdate": datetime.now(timezone("Asia/Seoul")),
            "info": {
                "customer": "Alex Cross",
                "items": {"product": "Tea", "qty": 6},
            },
            "phones": ["010-1234-5678", "064-1234-5678"],
            "content": "얼어붙은 플레이어의 귀환 (미완) - `제리엠`",
        }
    )
    print("data:", data)
```

### 3) insert 데이터

SQL 인젝션을 방어하기 위해 `sql.Identifier`, `sql.Literal` 등을 적극 사용하자.

- json 데이터는 한번 dumps 시킨 후에 사용해야 한다

```py
from psycopg import connection, sql

def insert_data(conn: connection.Connection, data: TestRow):
    with conn.cursor() as cur:
        stmt = sql.SQL(
            "INSERT INTO {} (logdate, info, phones, content) VALUES ({}, {}, {}, {})"
        ).format(
            sql.Identifier("test"),  # table name
            sql.Literal(data.logdate),
            sql.Literal(json.dumps(data.info)),  # json -> str
            sql.Literal(data.phones),
            data.content,
        )
        # print("SQL:", stmt.as_string)
        cur.execute(stmt)

def main(DATABASE_URL: str):
    conn = connect_db(DATABASE_URL)
    with conn:
        try:
            insert_data(conn, data)
        except psycopg.Error as e:
            print("Unable to insert data!", e)
```

### 4) select 데이터

`row_factory` 를 사용하여 class 생성자로 레코드를 가공하도록 하였다.

```py
from psycopg import connection, sql
from psycopg.rows import class_row

def select_data(conn: connection.Connection) -> TestRow | None:
    # use row_factory with pydantic BaseModel
    with conn.cursor(row_factory=class_row(TestRow)) as cur:
        # Query the database and obtain data as Python objects.
        cur.execute(
            sql.SQL("SELECT * FROM {}").format(sql.Identifier("public", "test"))
        )
        obj = cur.fetchone()
        if not obj:
            print("No data!")
            return None
        return obj

def main(DATABASE_URL: str):
    conn = connect_db(DATABASE_URL)
    with conn:
        try:
            row = select_data(conn)
            print("\n==>", row)
        except psycopg.Error as e:
            print("Unable to insert data!", e)
```

## 2. psycopg 비동기식 사용 (async)

psycopg3 에서는 asyncpg 등을 사용하지 않아도 자체적으로 비동기 처리를 지원한다.

### 1) DB 접속

`autocommit=False` 상태이면 반드시 `commit()` 을 해주어야 반영된다.

- autocommit 옵션의 기본값은 False 이다.

```py
import asyncio
import psycopg
from psycopg import AsyncConnection, sql

async def connect_db(DATABASE_URL: str):
    """Connect to the PostgreSQL database server

    참고:
        - current_date => datetime.date (time 데이터 없음)
        - current_timestamp, now() => datetime.datetime
    """
    try:
        aconn = await AsyncConnection.connect(DATABASE_URL)  # autocommit=False
        async with aconn:
            # Test connection
            async with aconn.cursor() as cur:
                await cur.execute("select current_timestamp, 'ok' as result")
                data = await cur.fetchone()
                print("data[0]:", data[0], type(data[0]))
                print("data[1]:", data[1], type(data[1]))
                assert data[1] == "ok"
        return True
    except psycopg.Error as e:
        print("Unable to connect!", e)
    return False


async def main(DATABASE_URL: str):
    if not await connect_db(DATABASE_URL):
        print("cannot connect to db!")
        return


if __name__ == "__main__":
    # load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")

    # async call from main
    loop = asyncio.get_event_loop()
    asyncio.run(main(DATABASE_URL))
    loop.close()    
```

### 2) insert 데이터

비동기 연결 객체는 with 구문과 강하게 연결되어 있어서 함께 사용해야 한다.

- 다른 함수로 연결 객체를 전달하려면 `with 구문` 아래에서 해야 한다.

```py
async def insert_data(aconn: AsyncConnection, data: TestRow):
    async with aconn.cursor() as cur:
        stmt = sql.SQL(
            "INSERT INTO {} (logdate, info, phones, content) VALUES ({}, {}, {}, {})"
        ).format(
            sql.Identifier("test_async"),  # table name
            sql.Literal(data.logdate),
            sql.Literal(json.dumps(data.info)),  # json -> str
            sql.Literal(data.phones),
            data.content,
        )
        # print("SQL:", stmt.as_string)
        await cur.execute(stmt)
    await aconn.commit()

async def main(DATABASE_URL: str):
    aconn = await AsyncConnection.connect(DATABASE_URL)
    async with aconn:
        loop.add_signal_handler(signal.SIGINT, aconn.cancel)
        try:
            await insert_data(aconn, data)
            rows = await select_data(aconn)
            for record in rows:
                print(record)
        except psycopg.Error as e:
            print("Unable to insert data!", e)


if __name__ == "__main__":
    # load_dotenv()
    DATABASE_URL = os.getenv("DATABASE_URL")

    # async call from main
    loop = asyncio.get_event_loop()
    asyncio.run(main(DATABASE_URL))
    loop.close()
```

### 3) select 데이터

async/await 키워드 외에 특별한 사항은 없다. (asyncio 인터페이스)

```py
async def select_data(aconn: AsyncConnection) -> TestRow | None:
    # use row_factory with pydantic BaseModel
    async with aconn.cursor(row_factory=class_row(TestRow)) as cur:
        # Query the database and obtain data as Python objects.
        await cur.execute(
            sql.SQL("SELECT * FROM {}").format(sql.Identifier("public", "test_async"))
        )
        return await cur.fetchall()
```

## 3. psycopg_pool 을 이용한 fastapi 와 연계 사용

fastapi 에서 psycopg 를 사용하기 위해서는 `psycopg_pool` 이 필요하다.

> 참고

- [깃허브 - FastAPI + Psycopg3 Example](https://github.com/chuck-alt-delete/fastapi_psycopg3_example)
- [공식문서 - Connection pool](https://www.psycopg.org/psycopg3/docs/advanced/pool.html)

### 1) AsyncConnectionPool 생성 및 해제

- startup 이벤트 : AsyncConnectionPool 생성
- shutdown 이벤트 : AsyncConnectionPool 해제
- endpoint 사용시 : Pool 에서 async connection 객체를 얻어 사용

```py
from psycopg_pool import AsyncConnectionPool
from fastapi import FastAPI

app = FastAPI()

@app.on_event("startup")
def open_pool():
    """create database connection pool"""
    app.state.pool = AsyncConnectionPool(DATABASE_URL, max_size=500)

@app.on_event("shutdown")
async def close_pool():
    """close database connection pool"""
    await app.state.pool.close()
```

### 2) Pool 로부터 비동기 연결 객체를 가져와 사용하기

```py
@app.get("/my_data/")
async def get_my_data():
    return await my_query(app.state.pool)


async def my_query(pool: AsyncConnectionPool):
    async with pool.connection() as conn:
        async with conn.cursor(row_factory=class_row(TestRow)) as cur:
            await cur.execute("SELECT * FROM public.test_async")
            rows = await cur.fetchall()
            return {"data": rows}


if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

## 9. Review

> 비동기를 사용하는 경우 psycopg3 가 asyncpg 보다 더 사용자 친화적이다. [&lt;출처&gt;](https://www.reddit.com/r/learnpython/comments/vi59dk/comment/ie41lfj/?utm_source=share&utm_medium=web2x&context=3)

- psycopg3 관련 자료가 얼마 없다. psycopg2 를 잘 사용하고 있는데 굳이 옮길 필요가 있느냐라는 분위기이다. [&lt;참고&gt;](https://www.reddit.com/r/PostgreSQL/comments/10q63ty/are_you_using_psycopg3_or_psycopg2/)
- 별점 : psycopg3 1k, asyncpg 6k, aiopg 1.3k (마지막 업데이트 2022년 10월)

> psycopg2 와 psycopg3(버전 3.0.15)의 성능 비교 [&lt;출처&gt;](https://www.spherex.dev/psycopg-2-vs-psycopg3/)

- psycopg3으로 SQL 쿼리를 실행하는 것이 psycopg2를 사용하는 것보다 메모리 효율성이 4~5배 더 높다는 것을 알 수 있었다.
- 그러나 insert 에 대해서 2.4 ~ 2.5 배 더 느렸다. (최적화가 미흡한 상태라 추측)
  + 현재 psycopg3 최신 버전은 `3.2.0.dev1` 이다. 실험 당시와는 많이 달라졌음.

### 트랜잭션은 transaction 구문을 사용하는 것이 훨씬 편한다.

> 트랜잭션 상태에 따라 commit 또는 rollback 이 적용된다

```py
    try:
        async with pool.connection() as conn:
            await set_role(conn)
            # 정상 처리시 commit, 실패시 rollback
            async with conn.transaction(tx_name):
                await conn.execute(stmt_new_person)
                await conn.execute(stmt_new_order)
        return True
    except Exception as e:
        print(f"  - transaction[{tx_name}] fail: {e}")
        return False
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
