---
date: 2022-09-02 00:00:00 +0900
title: pymysql 과 aiomysql 살펴보기 (async 처리)
description: DB 의 async 처리를 공부하기 위해 aiomysql 소스 코드를 파보려고 합니다.
categories: [Backend, ORM]
tags: ["mysql", "asyncio", "sqlalchemy","python"]
image: "https://byline.network/wp-content/uploads/2017/10/mysql-logo.jpg"
---

## MySQL 설명

처리속도가 빠르고 대용량 처리에 용이해서 쇼핑몰 등의 트랜잭션에 적합한 데이터베이스입니다. 멀티 플랫폼에 다중 사용자 관리를 지원합니다.

### MySQL 특징

큰 특징은 3가지

- 단일 코어에서 Nested Loop Join 처리
    + 괄호로 둘러싼 내부쿼리를 이용 (단순해서 좋다)
- 다양한 스토리지 엔진 (주로 InnoDB)
    + InnoDB 는 트랜잭션 되고, 레코드 단위 락, 중형 서비스에 적절한 용량이라 범용 트랜잭션용 적합
- 데이터 복제(Replication) 기능
    + (파티션) 샤딩을 통해 클러스터을 구성해 수평확장 가능


#### 5.7 버전에서 8.0 (2018년) 으로 이어짐

- 최근 8.0.30 안정화 버전 (2022년 7월 6일)
- JSON, SSL 지원, 성능은 2배 향상 (InnoDB 재설계), 내림차순 인덱스 (스캔 향상)

### Postgresql 과 MySQL 비교

- 둘다 C/C++ 구현체인 점이 같고, 성능도 거의 비슷
- Postgresql 은 오픈소스이고, 
    + MySQL 은 오라클이 소유권을 갖고 있습니다.
- Postgresql 은 확장기능 활용해 GIS 같은 특수 목적용 파생 버전이 많음
    + MySQL 은 심플한 구조와 빠른 성능으로 트랜잭션용으로 사용

## MySQL Python Adapter 설명

DB 서버와 클라이언트의 프로그램간 연결과 실행을 제어하는 모듈

![DB-Adapter diagram](https://i.stack.imgur.com/A9E32.png){: width="560"}

DB Adapter 는 다음과 같은 기능을 지원한다 (역활)

- python 에 connect() 기능 제공
- Connection 에 대한 pool 관리
- Dialect query 실행 지원
- DB API 지원 (DB 제품을 다루는 API)

### [mysqlclient](https://github.com/PyMySQL/mysqlclient)

`mysqlclient` 는 `MySQL 클라이언트`의 C 모듈 위에 Python wrapper 씌운 구현체

- 지금까지 가장 빠른 CPython 용 MySQL 커넥터
  - `libmysqlclient`(MySQL 클라이언트) 에 대한 의존성 (설치 필요)
    - C 라이브러리도 필요함 (함께 설치됨)
- 구버전에서 fork(분리)하여 `mysqlclient` 라고 부르고 있음
  - 구버전 version 1.x 에서는 `mysqldb` 라고 불리웠고 (여전히 혼재해서 쓰임)
- 크고 빠른 쿼리를 써야 한다면 mysqlclient 사용을 권장 (벤치마크 참조)

### [mysql connector/python](https://dev.mysql.com/doc/connector-python/en/connector-python-introduction.html)

MySQL(오라클) 에서 제공하는 공식 Adapter 이고, 순수 Python 으로 개발됨

- Protobuf C++ 에 대한 의존성 있음 (Protobuf Compiler 설치 필요)
- 성능은 셋중에 최악 (벤치마크 참조)

### [pymysql](https://github.com/PyMySQL/PyMySQL)

순수 Python 으로 작성된 어댑터

- 버전 관리자가 말하는 pymysql 를 사용해야 하는 이유
  - libmysqlclient 를 사용하고 싶지 않거나
  - libmysqlclient 등의 설치로 인해 부작용이 생기는 멍키패치를 원치 않는다면
  - mysql 프로토콜(오라클 저작권/사용규칙)을 원치 않는 경우

#### 벤치마크

mysqlclient 가 가장 빠르고, pymysql 보다 수배~십배 빠릅니다.<br />

- [Benchmarking MySQL drivers (Python 3.4)](https://gist.github.com/methane/90ec97dda7fa9c7c4ef1)
  - 결과
    - mysql connector/python: 4.554934978485107 sec
    - mysqlclient: 0.8555710315704346 sec
    - pymysql: 5.129631996154785 sec
      <br />&nbsp;
- [PyMySQL Evaluation](https://wiki.openstack.org/wiki/PyMySQL_evaluation)
- [Python MySQLdb vs mysql-connector query performance]()


## pymysql 설명

### 설치 및 DB 접속

- 설치: `pip install pymysql`
- DB 접속: pymysql.connect() 에 DB 접속 정보를 넣어 실행
  + CONNECTION_URL 문자열은 안됨
  
```python
import pymysql

mysql_params = {
    "host": "localhost",
    "port": 3306,
    "user": "root",
    "password": "p@ssw0rd",
    "database": "mydb",
    "cursorclass": pymysql.cursors.DictCursor,
}

conn = pymysql.connect(**mysql_params)

with conn:
    with conn.cursor() as cursor:
        cursor.execute("SELECT * FROM hero")
        result = cursor.fetchone()
        print(result)

# >> {'id': 1, 'name': 'a', 'age': 10}
```

### 용어 설명

#### connection 클래스

접속상태와 쿼리 관리하기 위한 변수와 접속/해제 등의 메서드 정의

- 내부적으로는 socket 통신으로 서버와 클라이언트간에 약속된 패킷 신호를 주고 받음
- `self._closed` 로 접속 상태 관리
 
#### cursor 클래스

프로그램에서 DB와 execute 등의 상호작용을 하기 위한 제어 개체 (상태값, 메서드)

- connection 객체 관리
- exected 상태 관리
- 실행 결과로 리턴되는 rowcount 관리
- 실행 결과의 임시 저장변수와 커서 관리 
- 등등..

#### SQLAlchemy 이용시 pymysql 설정 (2가지 방법)

1. CONNECTION_URL 에 pymysql adapter 를 명시하고 sqlalchemy.create_engine 호출

```python
# connection url
db_adapter = "pymysql"
CONNECTION_URL = (
    f"mysql+{db_adapter}://root:root123!!@localhost:3306/mydb?charset=utf8mb4"
)

import sqlalchemy as sa
engine = sa.create_engine(url=CONNECTION_URL, echo=True)
```

2. pymysql adapter 를 명시하지 않는 경우, module 'MySQLdb' 로 pymysql 모듈을 등록

```python
# == 파일 `__init__.py` ==

# pymysql 모듈을 mysqldb 이름의 모듈로 등록
import pymysql
pymysql.install_as_MySQLdb()

# 이것과 같은 내용
# ==> sys.modules["MySQLdb"] = sys.modules["pymysql"]


# == 파일 `conn_db.py` ==

# connection url
CONNECTION_URL = (
    f"mysql://root:root123!!@localhost:3306/mydb?charset=utf8mb4"
)

import sqlalchemy as sa
engine = sa.create_engine(url=CONNECTION_URL, echo=True)
```

## [aiomysql](https://github.com/aio-libs/aiomysql) 설명

aiomysql 모듈은 pymysql 어댑터 개발자가 만든 pymysql 의 비동기 실행을 위한 모듈입니다.

python 의 비동기 호출 방식을 사용하려면 호출되는 함수가 비동기 방식을 지원해야 하는데, 통상 NoSQL 아닌 RDBMS 에서는 동기식만 가능합니다.

특히 FastAPI 처럼 다중 스레드에 비동기 실행을 처리하는 프레임워크에서는 DB 작업을 수행하기 위해 비동기 모듈 asyncio 를 사용합니다.


### aiomysql 예제

- sqlalchemy 와 유사하게 pool 관리를 하고 session 으로 DB 작업 수행
- DB 커넥션 관리는 은폐시킴

```python
import asyncio
import aiomysql

# 실질적으로 main 함수
async def test_example(loop):
    # 커넥션 풀을 생성해 연결을 관리 (maxsize=10 설정)
    pool = await aiomysql.create_pool(host='127.0.0.1', port=3306,
                                      user='root', password='',
                                      db='mysql', loop=loop)

    # 커넥션 획득부터 비동기 처리
    async with pool.acquire() as conn:

        # 세션(실행개체) 획득도 비동기 호출
        async with conn.cursor() as cur:

            # DB 작업은 그래도 await 해주네
            await cur.execute("SELECT 42;")            
            print(cur.description)

            # 결과셋 가져오기 
            (r,) = await cur.fetchone()
            assert r == 42

    # 세션 작업 기다리지 않고 바로 닫네!
    # 하지만 실제 close 완료는 대기 작업이 다 끝나야 수행됨 (걱정할 필요 없음)
    pool.close()
    await pool.wait_closed()

# 이벤트 루프를 생성해 넘겨준다
loop = asyncio.get_event_loop()
loop.run_until_complete(test_example(loop))
```

### DB 접속 과정

풀생성(커넥션) 요청이 있을 때마다 

- 대기상태 free 디큐에서 커넥션 반환
    + 종료된 또는 오류중지된 커넥션 해제
- 사용상태 used 디큐에서 커넥션 추가/삭제
    + minsize~maxsize 내에서 디큐 관리

> 의사코드(pseudo-code) 형식으로 작성합니다.

```python
# main
pool = await aiomysql.create_pool(DB_파라미터셋)


# 풀생성: 커넥션 생성 후 반환 
#         (내부에서는 free 와 used 디큐 관리)
def create_pool(DB_파라미터셋, ...):
    풀생성_코루틴 = _create_pool(DB_파라미터셋)

    class _PoolContextManager(컨텍스트관리자):
        async def __aexit__(...):
            """커넥션 비동기 close() 처리"""

    return _PoolContextManager(풀생성_코루틴):


def _create_pool(DB_파라미터셋):
    연결풀 = Pool(DB_파라미터셋)
    return 연결풀


class Pool:

    def __init__(self):
        # 풀생성 작업에 대한 Lock & Event
        self._cond = asyncio.Condition()


    # 연결 획득
    def acquire(self):
        # 작업 가능할 때까지 기다렸다가
        async with self._cond:

            while True:  계속 루프
                # (커넥션) 대기풀이 채워지기를 기다려서 
                await self._fill_free_pool(True)
                    # - 틈날 때마다 대기풀의 커넥션 50%를 닫는다
                    # - minsize 만큼 커넥션을 대기풀에 채워넣는다

                # 대기(free) 풀에서 커넥션 하나를 빼서 
                커넥션 = self._free.popleft()
                # 사용(used) 풀에 커넥션 추가
                self._used.add(커넥션)

                # 커넥션 반환 (create_pool 호출 지점으로)
                return 커넥션

            # 대기풀이 아직 비어 있으면
            # lock 잠금 유지 (점유)

```                 

### DB 질의 과정

```python
# main
async with pool.acquire() as conn:

    # 커넥션에서 커서 생성과 트랜잭션 처리
    async with conn.cursor() as cur:

        # 커서에서 질의 전송과 결과 데이터 처리
        await cur.execute("SELECT 42;")            
        (r,) = await cur.fetchone()


# 트랜잭션 관리는 Connection 클래스에서 처리
class Connection:

    async def begin(self):
        # 트랜잭션 BEGIN 신호 전송

    async def commit(self):
        # 트랜잭션 COMMIT 신호 전송

    async def rollback(self):
        # 트랜잭션 COMMIT 신호 전송

    async def select_db(self, db):
        # 데이터베이스 변경

    async def show_warnings(self):
        # "SHOW WARNINGS" 질의 결과를 받아옴

    def cursor(self, *cursors):
        커서 = 인스턴스_생성(커서_클래스)
        # Future 에 상태관리자를 붙여서 커서 반환


# 질의 처리는 Cursor 클래스부터 출발
class Cursor:

    # aiomysql 에서는 커넥션이 세션
    def _get_db(self):
        return self._connection:    


    # 커넥션이 질의 가능한 상태면 False 반환
    # - 커넥션이 사용중도 아니고, 결과셋도 비어 있으면
    #
    # 질의 가능한 상태가 아니면 다음 rs 를 준비하고 True 반환
    # - 이전 rs 를 비우고, 다음 rs 를 커넥션에서 가져옴
    async def nextset(self):
        self._result = None
        self._clear_result()
        await conn.next_result()
        await self._do_get_result()
        return True


    # 질의를 수행
    async def execute(self, query, args=None):
        # 커넥션을 받아서
        conn = self._get_db()

        # 질의 가능한 상태일 때까지 기다렸다가
        while (await self.nextset()):
            pass

        # 질의 수행 (기다리기)
        await self._query(query)

        # 수행완료 상태로 바꾸고, rs 크기를 반환
        # - cur.execute() 호출 지점으로 돌아간다
        self._executed = query
        return self._rowcount


    # 질의 결과셋 rs 를 row 한개만 가져와 반환한다
    async def fetchone(self):
        # 버퍼에 도착한 데이터를 row 로 변환해 가져온다
        코루틴 = await self._read_next()

        # 없으면 None 반환
        if row is None: return

        # 가져온 row 개수를 세면서 코루틴 반환
        self._rownumber += 1
        return 코루틴


    # 커서 닫기
    async def close(self):
        # 결과셋 버퍼를 비우고
        # 질의 수행이 가능한 상태까지 기다렸다가
        # 커넥션 개체 해제 (None 설정)
        # - 나중에 풀관리자에 의해 free 대기열 처리

```

## 9. Review

- python 이라서 그나마 소스 보기가 훨 편하다. (어렵게 생각말자)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }














