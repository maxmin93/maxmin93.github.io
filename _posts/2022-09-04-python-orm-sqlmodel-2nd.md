---
date: 2022-09-04 00:00:00 +0900
title: python ORM - SQLModel - 2일차
description: SQLAlchemy 와 postgresql, mysql 어댑터에 대해 sync, async 접속 방법을 알아보겠습니다. 접속 이후 테이블 생성에서는 SQLModel 과 비교합니다.
categories: [Backend, ORM]
tags: ["python", "psycopg", "sqlalchemy"]
image: "https://sqlmodel.tiangolo.com/img/logo-margin/logo-margin-vector.svg"
---

> 목록
{: .prompt-tip }

- 1일차 [python ORM - SQLModel - 1일차](/posts/python-orm-sqlmodel-1st/)
- 2일차 [python ORM - SQLModel - 2일차](/posts/python-orm-sqlmodel-2nd/) &nbsp; &#10004;
- 3일차 [python ORM - SQLModel - 3일차](/posts/python-orm-sqlmodel-3rd/)
- 4일차 [python ORM - SQLModel - 4일차](/posts/python-orm-sqlmodel-4th/)
- 5일차 [FastAPI + SQLModel + Postgres 프로젝트](/posts/fastapi-sqlmodel-postgres-backend/)

## 1. 데이터베이스 URL 접속

SQLModel 은 접속부터 실행까지 SQLAlchemy 의 기능을 활용한다. 따라서 접속 방법에 대해서는 SQLAlchemy 방식을 먼저 알아보자.

```python
from sqlmodel import create_engine

engine = create_engine(CONNECTION_URL)
```

### 1) [SQLAlchemy 1.4 - postgresql 접속](https://docs.sqlalchemy.org/en/14/core/engines.html#postgresql)

#### postgresql 어댑터

- [psycopg](https://github.com/psycopg/psycopg) : psycopg 3 을 의미
  - Python [DB API 2.0](https://www.python.org/dev/peps/pep-0249/) 스펙 준수,
  - (동시 다발적으로 발생하는 접속과 해제에 대해) 비동기 처리시 스레드 안정성 보장
- [psycopg2](https://github.com/psycopg/psycopg2) :
  - libpq(pg 클라이언트)의 wrapper 로 구현되어 빠르고 안전함
  - (2.2 부터 비동기 실행이 구현되어 있지만) 동기식 처리만 가능

#### CONNECTION_URL 형식

```python
# default (postgres 까지만 쓰면 안됨!)
engine = create_engine('postgresql://scott:tiger@localhost/mydatabase')

# psycopg2
engine = create_engine('postgresql+psycopg2://scott:tiger@localhost/mydatabase')

# psycopg
engine = create_engine('postgresql+psycopg://scott:tiger@localhost/mydatabase')
```

### 2) [SQLAlchemy 1.4 - mysql 접속](https://docs.sqlalchemy.org/en/14/core/engines.html#mysql)

#### mysql 어댑터

- mysqldb : mysqlclient 의 wrapper 로 구현되어 가장 빠르고 안정적인 어댑터
- pymysql : 순수 python 으로 구현된 어댑터로 mysqldb 모듈을 가장해 로딩됨
- aiomysql : async 실행을 지원하기 위한 asyncio + pymysql 버전 (개발중)

#### CONNECTION_URL 형식

```python
# default (mysqldb)
engine = create_engine('mysql://scott:tiger@localhost/foo')

# mysqlclient
engine = create_engine('mysql+mysqldb://scott:tiger@localhost/foo')

# PyMySQL
engine = create_engine('mysql+pymysql://scott:tiger@localhost/foo')
```

### 3) SQLAlchemy 2.0 - 접속 및 실행

SQLAlchemy 2.0 기능은 SQLAlchemy 1.4 에서도 `future=True` 옵션을 통해 사용 가능하다. SQLModel 은 SQLAlchemy 1.4 의 Future 모드를 사용한다. 이 부분은 참고용으로만 살펴보자.

참고 : [SQLAlchemy 2.0 Future (Core)](https://docs.sqlalchemy.org/en/14/core/future.html)

> Within the 1.4 series, the “2.0” style of engines and connections is enabled by passing the create_engine.future flag to create_engine():

> `asyncpg` 어댑터를 이용해 `create_async_engine` 이용시 Error 발생

- sqlalchemy 1.4 버전에서도 내장 어댑터 asyncpg 를 사용할 수 있다고 하는데
  + Mac M1 에 대해서는 `greenlet` 관련 이슈가 아직 해결되지 않은거 같다. 
    * sqlalchemy 1.4.41 에서는 `util.py` 의 `AsyncDaptedLock()` 가 미구현 상태
- 그렇기 때문에, async 기능은 아래 2.0.0b1 (pre-release) 버전으로 테스트 해보자


#### psycopg 비동기 지원

참고 : [Psycopg3: Powerful Tech Preview with SQLAlchemy 2.0](https://realcode.space/2022/05/10/psycopg3-powerful-tech-preview-with-sqlalchemy-2/)

> 사전 설치 (공통)

```shell
brew install libpq --build-from-source
brew install openssl@1.1

# 'pg_config'가 실행될 수 있어야 함
export PATH="$(brew --prefix libpq)/bin:$PATH"

# pure python 버전 참조용
export LDFLAGS="-L/opt/homebrew/opt/openssl@1.1/lib -L/opt/homebrew/opt/libpq/lib"
export CPPFLAGS="-I/opt/homebrew/opt/openssl@1.1/include -I/opt/homebrew/opt/libpq/include"
```

> 설치 버전

- sqlalchemy 2.0.0b1 (pre-release)
  - Apple M1 의 경우 greenlet 모듈이 자동으로 설치되지 않음
    - 참고 : [Asyncio Platform Installation Notes (Including Apple M1)](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html#asyncio-platform-installation-notes-including-apple-m1)
    - `greenlet` not found module 메시지가 뜨면 `1.1.1` 버전으로 재설치 

- psycopg : `psycopg-binary` 버전 설치
  - Apple M1 의 경우 `libpq` 와 `psycopg[c]` 설치
  - 참고: [psycopg vs psycopg-binary](https://www.psycopg.org/docs/install.html#psycopg-vs-psycopg-binary)

> 설치 확인

```python
# requirements.txt
#############################
psycopg[c]
git+https://github.com/sqlalchemy/sqlalchemy.git@0cb54010d86493168cc763b836c0a71429b26c1b
#############################

import greenlet
print("greenlet:", greenlet.__version__)

import sqlalchemy
print("sqlalchemy:", sqlalchemy.__version__)

print("--"*20, end='\n\n')
```

> psycopg 비동기 접속 및 비동기 실행

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine

db_string = "postgresql+psycopg://user:password@db/psycoptest"

async_engine = create_async_engine(db_string)

async def async_main():
    # connect with async
    async_engine = create_async_engine(db_string)

    # session with async
    async with async_engine.begin() as async_conn:
        result = await async_conn.execute(text("select version()"))
        print(result.fetchall())

    # disconnect
    await async_engine.dispose()

asyncio.run(async_main())
```

| ![psycopg3 비동기 접속, 실행](/2022/09/04-sqlalchemy2-async-test-w640.png){: width="560"} |
| :-----------------------------------------------------------------------------------------: |
|                           &lt;그림&gt; psycopg3 비동기 접속, 실행                           |

## 2. 접속 후 세션 생성

ORM Session 사용방법은 똑같다.

### 1) SQLModel 세션 생성 (트랜잭션)

```python
from sqlmodel import Session, text

with Session(engine) as conn:
  conn.execute(text("select version()"))
  print(result.fetchall())
```

### 2) SQLAlchemy 세션 생성 (트랜잭션)

```python
from sqlalchemy import text
from sqlalchemy.orm import Session

with Session(engine) as conn:
  result = conn.execute(text("select 'hello world'"))
  print(result.all())
```

## 3. 테이블 정의

### 참고: 핵심모델 sqlmodel.SQLModel

- pydantic 의 BaseModel 사용
  - sqlalchemy 의 weakref 사전에서 field 를 추출하고 정의
  - orm_mode 기능 사용
- sqlalchemy 의 MetaData 사용
  - relationship (조인) 관계 기능 사용

```python
from pydantic import BaseModel

class SQLModel(BaseModel, ...):
    # SQLAlchemy needs to set weakref(s), Pydantic will set the other slots values
    __slots__ = ("__weakref__",)
    __tablename__: str
    __sqlmodel_relationships__: Dict[str, RelationshipProperty]
    __name__: str
    metadata: MetaData

    class Config:
        orm_mode = True

    # ...
```

### 1) SQLModel 테이블 정의

SQLAlchemy 의 테이블 정의를 대부분 사용할 수 있다. 다만, BaseModel 이 다르기 때문에 MetaData 가 SQLAlchemy 처럼 동기화 되지는 않는다. (metadata 컬럼 따로, pydantic Field 따로)

- 정석적인 형태: 튜토리얼을 따라가면 된다
- metadata 를 일부 사용 (어쩔 수 없다)
  - 테이블명을 직접 지정하고 싶을 때 tablename 사용
    - 낙타 표기법이 안먹힌다. ex) `MyCustomerLocation` => `mycustomerlocation`
  - SQLAlchemy 의 옵션 사용시 table_args 사용
- 필드 지정없이 metadata 만 사용
  - 테이블을 생성할 수 있고, 데이터를 읽어오는 것까지는 할 수 있지만
  - 그 외 SQLModel 의 기능을 사용할 수 없음 (정의된 필드가 없어서)
  - 이런 경우는 트랜잭션이 아닌, DDL 명령이 필요할 때에만 사용

```python
# SQLModel 정석적인 형태
class Hero(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    secret_name: str
    age: Optional[int] = None


# metadata 를 일부 사용
class Hero(SQLModel, table=True):
    id: Optional[int] = sm.Field(default=None, primary_key=True)
    name: str = sm.Field(index=True)
    age: Optional[int] = sm.Field(default=None)

    # metadata
    __tablename__: str = "sometable"
    __table_args__ = {
        "mysql_engine": "InnoDB",
        "extend_existing": True,  # 없으면 SAWarning 출력
        "autoload_with": engine   # DB 스키마로부터 메타데이터 자동 로드
    }

# metadata.Table 만 사용
class Hero(sm.SQLModel, table=True):
    # __table__ 사용시에는 따로 필드 지정을 할 수 없음
    # id: Optional[int] = sm.Field(default=None, primary_key=True)
    # name: str = sm.Field(index=True)
    # age: Optional[int] = sm.Field(default=None)

    # metadata
    __table__ = sm.Table(
        "sometable",
        sm.SQLModel.metadata,
        sm.Column("id", sm.Integer, primary_key=True),
        sm.Column("name", sm.String(50)),
        sm.Column("age", sm.Integer, default=None),
        mysql_engine='InnoDB',
        extend_existing=True,
        autoload_with=engine,
    )
```

### 2) SQLAlchemy 테이블 정의

참고 : [Table Configuration](https://docs.sqlalchemy.org/en/14/orm/extensions/declarative/table_config.html)

```python
# declarative base class
Base = declarative_base()

# 선언적(declarative) 매핑: 정석적인 형태
class User(Base):
    __tablename__ = 'user'

    id = Column(Integer, primary_key=True)
    name = Column(String)
    fullname = Column(String)
    nickname = Column(String)

# 옵션 사용
class MyClass(Base):
    __tablename__ = 'sometable'
    __table_args__ = {'mysql_engine':'InnoDB'}

# 옵션에 제약사항 사용
class MyClass(Base):
    __tablename__ = 'sometable'
    __table_args__ = (
            ForeignKeyConstraint(['id'], ['remote_table.id']),
            UniqueConstraint('foo'),
            )

# 클래식 매핑: metadata(registry) 만 사용
class MyClass(Base):
    __table__ = Table('my_table', Base.metadata,
        Column('id', Integer, primary_key=True),
        Column('name', String(50))
    )
```

## 9. Review

- DB 어댑터에는 관련된 DB, ORM 과의 히스토리가 담겨있다. 
  + 가끔씩 이슈나 검색으로 새로운 소식을 알아보자.
- 오픈소스 특성상 새로운 기능이나 오픈소스 코드는 postgresql 기반이 많다.
  + 반면에 실무는 트랜잭션 처리에 어울리는 mysql 기반이 많다.
  + ORM 을 사용했다면, 테스트는 메모리 모드에서 SQLite 또는 J2 로 하자

> 참고문서

- [SQLModel - Releases Note](https://github.com/tiangolo/sqlmodel/releases)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
