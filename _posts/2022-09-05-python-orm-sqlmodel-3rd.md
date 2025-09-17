---
date: 2022-09-05 00:00:00 +0900
title: python ORM - SQLModel - 3일차
description: SQLAlchemy 1.4 의 Future(2.0) 스타일과 1.x 스타일의 Tutorial 을 살펴봅니다.
categories: [Backend, ORM]
tags: ["python", "future", "sqlalchemy"]
image: "https://sqlmodel.tiangolo.com/img/logo-margin/logo-margin-vector.svg"
---

> 목록
{: .prompt-tip }

- 1일차 [python ORM - SQLModel - 1일차](/posts/python-orm-sqlmodel-1st/)
- 2일차 [python ORM - SQLModel - 2일차](/posts/python-orm-sqlmodel-2nd/)
- 3일차 [python ORM - SQLModel - 3일차](/posts/python-orm-sqlmodel-3rd/) &nbsp; &#10004;
- 4일차 [python ORM - SQLModel - 4일차](/posts/python-orm-sqlmodel-4th/)
- 5일차 [FastAPI + SQLModel + Postgres 프로젝트](/posts/fastapi-sqlmodel-postgres-backend/)

## 1. SQLAlchemy 1.4 의 Future(2.0) 버전과 1.x 버전

SQLAlchemy의 1.x 스타일은 15년간 유지되고 발전되어 왔습니다. 변화가 필요한 부분들을 정리하여 2.0의 Core 버전으로 개발하고 있습니다. 1.4 버전은 classic 스타일을 Future 스타일로 마이그레이션을 위한 버전으로 튜토리얼과 함께 2.0 Stubs 패키지를 제공하고 있습니다.

[2.0 스타일의 차이점은 다음과 같습니다.](https://docs.sqlalchemy.org/en/20/changelog/migration_20.html#new-features-and-improvements)

- PEP 484 (DBAPI 2) 스펙을 준수합니다
- postgresql 의 psycopg 어댑터를 지원하며, async 기능을 사용할 수 있습니다.
- create_endgine 과 session 의 사용 형태가 조금 바뀌었고
- execute 가 query 와 얽히지 않고 분리되어 바깥에서 감싸게 됩니다.
- Generic Type 에 대한 처리방식(Stub)에 대해 과거 버전과 호환되지 않습니다.
  + 정확한 뜻을 이해하지는 못했지만
  + 각각의 DB 데이터 타입을 sqlalchemy 함수와 묶기 위한 타입 변환과 처리 방식에 대한 정의인 것으로 짐작됨


## 2. SQLAlchemy 1.4 의 Future(2.0) 스타일 튜토리얼

문서: [SQLAlchemy 2.0 Documentation](https://docs.sqlalchemy.org/en/20/#)

- [ORM Quick Start](https://docs.sqlalchemy.org/en/14/orm/quickstart.html) : 한눈에 파악하기 위한 짧은 예제
- [SQLAlchemy 1.4 / 2.0 Tutorial](https://docs.sqlalchemy.org/en/14/tutorial/index.html)


### 1) 모델 선언: 테이블, 컬럼, 메타데이터

- declarative_base 은 새로운 registry 로 Base 를 초기화
  + 테이블, 컬럼 같은 DB 개체의 metadata 를 담게되는 저장소
  + metadata.clear() 해도 비울수 없음 (초기화 안됨)
- 테이블 class 는 Base 를 기반으로 선언
  + 테이블의 실제 이름은 `__tablename__` 사용
  + 특별히 지정이 필요한 사항은 `__table_args__` 사용
    + constraints, table options, 저장소 타입 등..
- Column 은 컬럼 생성자
  + MySQL 의 경우 String, Varchar 형식은 반드시 길이 지정해야 함
  + ForeignKey 은 DB 개체명 기준으로 작성, _cf._ relationship 과 다름
- relationship 은 JOIN 을 위한 정보를 지정
  + 상위 키 변경/삭제시 cascade 기능 지원
  + 연결되는 class, field 이름을 문자열로 정의 (미리 끌어쓰기 위해)
- 테이블에는 반드시 primary_key 가 있어야 함 (없으면 error)
- 포맷 파라미터의 `{!r}` 는 quote 감싸기 옵션

```python
##############################
##  Declare Models
##

from sqlalchemy import Column
from sqlalchemy import ForeignKey
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "user_account"
    id = Column(Integer, primary_key=True)
    name = Column(String(30))
    fullname = Column(String(50))
    addresses = relationship(
        "Address", back_populates="user", cascade="all, delete-orphan"
    )
    def __repr__(self):
        return f"User(id={self.id!r}, name={self.name!r}, fullname={self.fullname!r})"


class Address(Base):
    __tablename__ = "address"
    id = Column(Integer, primary_key=True)
    email_address = Column(String(40), nullable=False)
    user_id = Column(Integer, ForeignKey("user_account.id"), nullable=False)
    user = relationship("User", back_populates="addresses")
    def __repr__(self):
        return f"Address(id={self.id!r}, email_address={self.email_address!r})"

```


### 2) DB 연결 : connection url 사용, create_engine, future 옵션

- **Tip** : password 에 특수문자가 섞인 경우, 인터넷 전송용 문자로 변환
  + urllib.parse.quote_plus 함수로 인코딩
- create_engine
  + `echo=True` : SQL 로그 출력 여부  

```python
##############################
##  Create an Engine
##

# connection url
import urllib.parse
password = urllib.parse.quote_plus("p@ssw0rd")  # 특수문자 처리
CONN_URL = f'mysql+pymysql://root:{password}@minubt/tutorial'

# connect to db
from sqlalchemy import create_engine
engine = create_engine(CONN_URL, echo=True, future=True)

```


### 3) 테이블 생성 DDL

- create_all 은 Base 기반으로 선언한 모델들을 DB 에 실체화 수행
  + 테이블, 시퀀스 등의 DB 모델을 생성
  + 반대로, [drop_all() 함수](/posts/python-orm-sqlmodel-3rd/#18-개별-또는-전체-테이블-제거drop)도 있음 (선언 모델들만 해당)
  + 물리적인 foreignKey 는 컬럼을 Key 로 지정해야 생성됨 (user_id)

```python
##############################
##  Emit CREATE TABLE DDL
##

"""
CREATE TABLE user_account (
  id INTEGER NOT NULL AUTO_INCREMENT, 
  name VARCHAR(30), 
  fullname VARCHAR(50), 
  PRIMARY KEY (id)
)

CREATE TABLE address (
  id INTEGER NOT NULL AUTO_INCREMENT, 
  email_address VARCHAR(40) NOT NULL, 
  user_id INTEGER NOT NULL, 
  PRIMARY KEY (id), 
  FOREIGN KEY(user_id) REFERENCES user_account (id)
)
"""

# Models registered on Base
Base.metadata.create_all(engine)

# CompileError: VARCHAR requires a length on dialect mysql
# - String ==> String(50)

```

### 4) 데이터 개체 생성 및 저장

- 트랜잭션 관리를 위해 with 구문 이용 (close 포함)
  + 여러 개체를 지정할 때는 add_all() 사용
  + commit() 으로 DB 에 적용 (= flush + persist)
  
```python
##############################
##  Create Objects and Persist
##

"""
{'name': 'spongebob', 'fullname': 'Spongebob Squarepants'}
{'name': 'sandy', 'fullname': 'Sandy Cheeks'}
{'name': 'patrick', 'fullname': 'Patrick Star'}
==>
INSERT INTO user_account (name, fullname) VALUES (%(name)s, %(fullname)s)

{'email_address': 'spongebob@sqlalchemy.org', 'user_id': 1}
{'email_address': 'sandy@sqlalchemy.org', 'user_id': 2}
{'email_address': 'sandy@squirrelpower.org', 'user_id': 2}
==>
INSERT INTO address (email_address, user_id) VALUES (%(email_address)s, %(user_id)s)
"""

from sqlalchemy.orm import Session

# open & close
with Session(engine) as session:

    # new users
    spongebob = User(
        name="spongebob",
        fullname="Spongebob Squarepants",
        addresses=[Address(email_address="spongebob@sqlalchemy.org")],
    )
    sandy = User(
        name="sandy",
        fullname="Sandy Cheeks",
        addresses=[
            Address(email_address="sandy@sqlalchemy.org"),
            Address(email_address="sandy@squirrelpower.org"),
        ],
    )
    patrick = User(name="patrick", fullname="Patrick Star")

    # insert & commit
    session.add_all([spongebob, sandy, patrick])
    session.commit()

```

### 5) 간단한 질의(select)

- ScalarResult 는 Row 를 yield 하는 generator 
  + FilterResult 베이스로 ScalarResult, MappingResult, AsyncResult 있음
  + 값을 얻으려면 all, one, first 등을 쓰던지, loop 구문 사용
  + scalars( stmt ) 는 stmt.scalars() 와 같음
- select 로 질의 대상 지정, where 로 filter 조건 적용
  + 조건절에 SQL 에 대응하는 다양한 컬럼 연산자 사용
 
```python
##############################
##  Simple SELECT
##

"""
["spongebob", "sandy"]
==>
SELECT user_account.id, user_account.name, user_account.fullname 
FROM user_account 
WHERE user_account.name IN (%(name_1_1)s, %(name_1_2)s)
"""

from sqlalchemy import select

session = Session(engine)

# where 조건절, in_ 컬럼 연산자
stmt = select(User).where(User.name.in_(["spongebob", "sandy"]))

# ScalarResult: Generator[Row]
for user in session.scalars(stmt):
    print(user)

# User(id=1, name='spongebob', fullname='Spongebob Squarepants')
# User(id=2, name='sandy', fullname='Sandy Cheeks')

```

### 6) JOIN 이용한 질의

- 선언된 모델 Address 의 relationship 을 사용해 JOIN 가능
  + JOIN 의 on 조건을 relationship 설정에서 불러옴
  + 또는 직접 JOIN 대상 모델(class)을 지정할 수도 있음
    * ex) `query(Address).join(User, User.id==Address.user_id)`
- where 조건절은 여러번 반복 가능 (and_ 결합)

```python
##############################
##  SELECT with JOIN
##

"""
SELECT * FROM address 
    INNER JOIN user_account ON user_account.id = address.user_id 
WHERE 
    user_account.name = %(name_1)s AND 
    address.email_address = %(email_address_1)s
==>
fetchOne(): Address(id=2, email_address='sandy@sqlalchemy.org')


SELECT * FROM address 
    INNER JOIN user_account ON user_account.id = address.user_id 
WHERE 
    address.email_address = %(email_address_1)s
==>
fetchOne(): Address(id=2, email_address='sandy@sqlalchemy.org')
"""

stmt = (
    select(Address)  # returnType
    .join(Address.user)
    # .where(User.name == "sandy")  # and_
    .where(Address.email_address == "sandy@sqlalchemy.org")
)
sandy_address = session.scalars(stmt).one()

print("fetchOne():", sandy_address)

```

### 7) insert, update, commit

- Model 에 의해 insert, update 변경 사항이 추적된다
  + execution 대기열에 저장했다가 commit 할 때 실행됨
  + _cf._ SQLModel 의 경우엔 session.add() 로 명시해야 함

```python
##############################
##  Make Changes
##

"""
{'email_address': 'sandy_cheeks@sqlalchemy.org', 'address_id': 2}
==>
UPDATE address SET email_address=%(email_address)s WHERE address.id = %(address_id)s

{'email_address': 'patrickstar@sqlalchemy.org', 'user_id': 3}
==>
INSERT INTO address (email_address, user_id) VALUES (%(email_address)s, %(user_id)s)
"""

stmt = select(User).where(User.name == "patrick")
patrick = session.scalars(stmt).one()

# insert: Address 생성
patrick.addresses.append(
    Address(email_address="patrickstar@sqlalchemy.org")
)

# update: Address.email_address 값 변경
sandy_address.email_address = "sandy_cheeks@sqlalchemy.org"

session.commit()

```

### 8) delete, flush

- session 에서 Pk 값으로 직접 가져오기
- Model 에서 remove 되면 delete stmt 로 실행 대기줄에 추가
  + _cf._ session.delete: 직접적으로 delete stmt 추가

> flush 는 DB transaction 에 전달만 한 상태 (persist 이전 단계)

- flush 는 commit 이 아님 (commit 의 부분 동작)
  + select 한 경우, 자신의 transaction 에는 변경 상태로 읽히지만
  + 다른 transaction 에는 해당 안됨
- commit 할 때, flush 상태의 변경들도 함께 commit 됨
- [autoflush 옵션](https://docs.sqlalchemy.org/en/14/orm/session_api.html#sqlalchemy.orm.Session.params.autoflush) 적용시에는 사용할 필요가 없다

```python
##############################
##  Some Deletes
##

"""
{'pk_1': 2}
==>
SELECT * FROM user_account WHERE user_account.id = %(pk_1)s

{'id': 2}
==>
DELETE FROM address WHERE address.id = %(id)s
"""

sandy = session.get(User, 2)  # select by id(Pk)

sandy.addresses.remove(sandy_address)

session.flush()  # not commit, but applied to session

session.delete(patrick)

session.commit()

```

### 9) scalars 질의

- 앞의 `7)` 단계에서 등록한 sandy_address 가 삭제된 것을 확인

```python
##############################
##  SELECT with scalars
##

stmt = (
 select(Address)
 .join(Address.user)
 .where(User.name == "sandy")
 .where(Address.email_address == "sandy@sqlalchemy.org")
)
sandy_address = session.scalars(stmt).one()

sandy_address

```

### 10) JOIN 데이터의 update, insert

```python
##############################
##  Make Changes
##

stmt = select(User).where(User.name == "patrick")
patrick = session.scalars(stmt).one()

# insert: Address(User=patrick)
patrick.addresses.append(
    Address(email_address="patrickstar@sqlalchemy.org")
)

# update: Address(User=sandy)
sandy_address.email_address = "sandy_cheeks@sqlalchemy.org"

session.commit()  # execution

```

### 11) JOIN 데이터 삭제와 cascade 삭제

- patrick User 삭제시, relationship 에 의해 cascade 삭제 실행
  + User(patrick) 과 모든 Address(User=patrick) 삭제됨

```python
##############################
##  Some Deletes
##

sandy = session.get(User, 2)

# delete Address(sandy)
sandy.addresses.remove(sandy_address)

session.flush()

# delete User(patrick)
session.delete(patrick)

session.commit()

```

#### 참고: [SQLAlchemy: flush() 과 commit() 은 무엇이 다른가요?](https://stackoverflow.com/a/4202016)

- 예제: autoflush = True

```python
s = Session()    # default: s.autoflush = True

s.add(Foo('A'))  # Foo('A') 객체가 세션에 등록됨
                 # 아직 DB 에 커밋되지 않았지만
                 # 쿼리할 때 읽혀지는 상태
print( 1, s.query(Foo).all() )
# ==> 1 [<Foo('A')>]
                 # 아직은 중단 또는 rollback 할 때 사라질 수 있음
s.commit()       # DB 에 영속적으로 저장된 상태
```

- 예제: autoflush = False

```python
s2 = Session()
s2.autoflush = False

s2.add(Foo('B'))
print( 2, s2.query(Foo).all() ) # Foo('B') 를 질의할 수 없음
                                # 아직 flush 안된 상태  

s2.flush()                      # 이제야 flush 된 상태
                             
print( 3, s2.query(Foo).all() ) # Foo('B') 가 반환됨

s2.rollback()                   # 아직 커밋 안된 상태이고
                                # 트랜잭션에서 Foo('B') 가 제거됨
print( 4, s2.query(Foo).all() ) # Foo('B') 를 질의할 수 없음

# Output:
# ==> 2 [<Foo('A')>]
# ==> 3 [<Foo('A')>, <Foo('B')>]
# ==> 4 [<Foo('A')>]
```

#### 참고: [중첩된 트랜잭션 - savepoint 사용하기](https://docs.sqlalchemy.org/en/14/orm/session_transaction.html#using-savepoint)

- with 절을 벗어나면 자동 commit
  + 진행하면서 session.commit 하는 경우, with 절을 쓰지 마시오!
  + [commit 은 항상 가장 바깥쪽 transaction 에 대해 적용됨](https://groups.google.com/g/sqlalchemy/c/ZdAR03OQGAo/m/KENwGiT1BAAJ)
- 내부(중첩된) 트랜잭션에 대해 savepoint 사용
  + savepoint.commit() : 이런건 없다 (의미 없음)

```python
Session = sessionmaker()

# 트랜잭션 시작
with Session.begin() as session:
  session.add(u1)
  session.add(u2)

  # 중첩된 트랜잭션 시작 (savepoint)
  savepoint = session.begin_nested()
  try:
    session.add(u3)
  except:
    savepoint.rollback()  # rolls back u3, keeps u1 and u2

# commits u1 and u2 (and u3)
```


## 3. SQLAlchemy 1.4 의 1.x 스타일 튜토리얼 (클래식 style)

문서: [SQLAlchemy 1.4 Documentation](https://docs.sqlalchemy.org/en/14/index.html)

- [ORM Tutorial (1.x API)](https://docs.sqlalchemy.org/en/14/orm/tutorial.html) : 짧지 않은 예제
- [SQL Expression Language Tutorial (1.x API)](https://docs.sqlalchemy.org/en/14/core/tutorial.html) : 항목별 설명


### 1) DB 접속

- create_engine 과정은 동일
 
```python
##############################
##  Connecting
##

# connection url
import urllib.parse
password = urllib.parse.quote_plus("p@ssw0rd")  # 특수문자 처리
CONN_URL = f'mysql+pymysql://root:{password}@minubt/tutorial'

from sqlalchemy import create_engine
engine = create_engine(CONN_URL, echo=True)
```

### 2) Model 선언

- Base 기반으로 Model(class) 선언도 동일

```python
##############################
##  Declare a Mapping
##

"""
Table(
    'users', MetaData(), 
    Column('id', Integer(), table=<users>, primary_key=True, nullable=False, 
        default=Sequence('user_id_seq', metadata=MetaData())
        ), 
    Column('name', String(length=30), table=<users>), 
    Column('fullname', String(length=50), table=<users>), 
    Column('nickname', String(length=30), table=<users>), 
    schema=None
    )
"""

from sqlalchemy.orm import declarative_base

Base = declarative_base()

from sqlalchemy import Column, Integer, String, Sequence

# Base 기반으로 Model(class) 선언
class User(Base):
    __tablename__ = 'users'
    # id = Column(Integer, primary_key=True)
    id = Column(Integer, Sequence('user_id_seq'), primary_key=True)

    name = Column(String(30))
    fullname = Column(String(50))
    nickname = Column(String(30))
    
    def __repr__(self):
        return "<User(name='%s', fullname='%s', nickname='%s')>" % (
            self.name, self.fullname, self.nickname
        )

    
User.__table__     
```

### 3) 선언한 모든 Table 생성

- create_all 동일

```python
##############################
##  Create a Schema
##

"""
CREATE TABLE users (
  id INTEGER NOT NULL AUTO_INCREMENT, 
  name VARCHAR(30), 
  fullname VARCHAR(50), 
  nickname VARCHAR(30), 
  PRIMARY KEY (id)
)
"""

Base.metadata.create_all(engine)
```

### 4) User 데이터 생성

- 아직 DB 에 commit 안됨 (insert 대기)

```python
##############################
##  Create an Instance of the Mapped Class
##

# instance
ed_user = User(name='ed', fullname='Ed Jones', nickname='edsnickname')

print(ed_user)
print("ed_user.id:", str(ed_user.id))  # id = None

```

### 5) session 생성

- 2단계: sessionmaker 팩토리로부터 Session 생성자와 session 개체 생성
  - _cf._ Future 스타일에서는 바로 Session 통해 session 생성

```python
##############################
##  Creating a Session
##

"""
sessionmaker(class_='Session', 
    bind=Engine(mysql+pymysql://root:***@minubt/tutorial), 
    autoflush=True, 
    autocommit=False, 
    expire_on_commit=True
    )
"""

from sqlalchemy.orm import sessionmaker

# factory
Session = sessionmaker(bind=engine)
# session
session = Session()

# sqlalchemy.orm.session.Session
print(type(session))
session  # Session instance
```

### 6) insert, update, autoflush, expire_on_commit (=True)

- User(ed) 에 대한 변경사항들이 select(User) 이벤트 때 flush(적용) 됨
  + [autoflush](https://docs.sqlalchemy.org/en/14/orm/session_api.html#sqlalchemy.orm.Session.params.autoflush): 명시적으로 flush/commit 안해도 발생 (Session 옵션)
- commit 이후 User 모델의 instance 에 대해 refresh 실행됨
  + commit 이전의 User(ed) 의 id 는 None
  + commit 이후의 User(ed) 에 id 값이 채워져 있음 (refresh)

> Session 의 옵션 `expire_on_commit = True` 에 의해 자동 refresh

- 참고: [Session and sessionmaker](https://docs.sqlalchemy.org/en/14/orm/session_api.html?highlight=expire_on_commit#session-and-sessionmaker)

```python
##############################
##  Adding and Updating Objects
##

"""
{'name': 'ed', 'fullname': 'Ed Jones', 'nickname': 'edsnickname'}
==>
INSERT INTO users (name, fullname, nickname) VALUES (%(name)s, %(fullname)s, %(nickname)s)

{'name_1': 'ed', 'param_1': 1}
==>
SELECT * FROM users 
WHERE users.name = %(name_1)s 
 LIMIT %(param_1)s
"""

# ed_user.id = None
ed_user = User(name='ed', fullname='Ed Jones', nickname='edsnickname')
print(f"HEAD: new User[id={ed_user.id}]:", ed_user)
# HEAD: new User[id=None]: <User(name='ed', fullname='Ed Jones', nickname='edsnickname')>

session.add(ed_user)  # pending, not flush

# select User 이벤트에 flush 발생
first_user = session.query(User).filter_by(name='ed').first() 
print(f"first_user[id={first_user.id}]:", first_user)
# first_user[id=1]: <User(name='ed', fullname='Ed Jones', nickname='edsnickname')>

from sqlalchemy import text
query = text("SELECT * FROM users WHERE users.name = :name_1")

# sqlalchemy.engine.result.ScalarResult
results = session.execute(query, { "name_1":'ed' }).scalars()
print("scalars() = ScalarResult:", type(results), results)

user_ids = results.all()  # 두번 호출할 수 없다 (임시 데이터라 fetch 이후 사라짐)
print("scalars().all():", type(user_ids), user_ids)
# scalars().all(): <class 'list'> [1, 2, ..., 11, 12]

results = session.query(User).filter_by(name='ed').all()
print("all():", type(results), results)

last_user = results[-1]
print(f"last_user[id={last_user.id}]:", last_user)
# last_user[11]: <User(name='ed', fullname='Ed Jones', nickname='edsnickname')>

# refresh 가 자동으로 수행됨 (expire_on_commit=True)
print(f"TAIL: new User[id={ed_user.id}]:", ed_user)
# TAIL: new User[id=13]: <User(name='ed', fullname='Ed Jones', nickname='edsnickname')>

assert ed_user is last_user, "ed is instance before insert, last is instance after insert"
```

### 7) scalars() 와 all() 차이

- scalars() : ScalarResult 생성 
  + 값을 얻으려면 all() 사용 
  + 1번만 (호출) 가져올 수 있다 (제너레이터 방식)
- all() : MapResult 를 이용해 List[Any] 생성
  + 1번만 호출 가능한 것은 동일
- _cf._ scalar() vs one()
  + scalar() 한 행의 첫 컬럼만
  + one() 한 행만 가져오기

> 왜 Scalar 가 필요한지 이유는 Result 의 fetch 과정을 단축하기 위해서가 아닌가 짐작해본다. 가령, 컬럼 개수만큼 loop 문이 skip 된다던지.

```python
##############################
##  scalars() vs all()
##

from sqlalchemy import text
query = text("SELECT * FROM users WHERE users.name = :name_1")

# sqlalchemy.engine.result.ScalarResult
# 첫번째 컬럼 값만 가져와 scalars 생성
results = session.execute(query, { "name_1":'ed' }).scalars()
user_ids = results.all()  # all() 을 두번 호출할 수 없다
print("scalars().all():", user_ids)
# ==> [1, 2, ..., 8, 9, 10, 11]

# List
results = session.execute(query, { "name_1":'ed' }).all()
print("scalars() = ScalarResult:", type(results), results)
# ==> [(1, 'ed'), ..., (9, 'ed'), (10, 'ed'), (11, 'ed')]

last_user = results[-1]
print(f"last_user[{last_user.id}]:", User(**last_user))
```

### 8) 변경된 객체의 상태 변화

- change 이벤트 발생시
  + update 변경 객체는 transient 상태가 되고 (session.dirty)
  + insert 생성 객체는 pending 상태로 추가됨 (session.new)
- commit 이벤트 발생시
  + session 의 dirty/new 변경들이 DB 에 저장되고
  + transient/pending 상태 객체들은 persistent 상태로 바뀐다

```python
##############################
##  “object states” - transient, pending, and persistent
##

session.add_all([
    User(name='wendy', fullname='Wendy Williams', nickname='windy'),
    User(name='mary', fullname='Mary Contrary', nickname='mary'),
    User(name='fred', fullname='Fred Flintstone', nickname='freddy')
])

ed_user.nickname = 'eddie'
print(f"before commit: ed_user[{ed_user.id}]:", ed_user)
# before commit: ed_user[13]: <User(name='ed', fullname='Ed Jones', nickname='eddie')>

# transient => UPDATE
print("dirty:", session.dirty)
# dirty: IdentitySet([<User(name='ed', fullname='Ed Jones', nickname='eddie')>])

# pending => INSERT
print("pending:", session.new)
# pending: IdentitySet([
    # <User(name='wendy', fullname='Wendy Williams', nickname='windy')>, 
    # <User(name='mary', fullname='Mary Contrary', nickname='mary')>, 
    # <User(name='fred', fullname='Fred Flintstone', nickname='freddy')>
    # ])

# persistent
session.commit()  # flush

print(f"after commit: ed_user[{ed_user.id}]:", ed_user)
# after commit: ed_user[13]: <User(name='ed', fullname='Ed Jones', nickname='eddie')>

```

### 9) filter 조건절과 컬럼 연산자

- where 조건절에 filter 사용 (Future 스타일과 동일)

```python
##############################
##  ColumnOperator: and, or
##

from sqlalchemy import and_, or_
session.query(User).filter(and_(User.name=="ed", User.id > 1)).delete()
session.commit()
```

### 10) 트랜잭션의 롤백 (변경 취소)

- rollback: 이전 commit 상태로 되돌리기
- session 에 fake_user 변경(생성) 내용이 없어짐
  + session.new 비워짐

```python
##############################
##  Rolling Back
##

# transient: update
ed_user.name = 'Edwardo'
print("before rollback:", ed_user.name)
# before rollback: Edwardo

# new user
fake_user = User(name='fakeuser', fullname='Invalid', nickname='12345')
# pending: insert
session.add(fake_user)


# flush and select
session.query(User).filter(User.name.in_(['Edwardo', 'fakeuser'])).all()

# rollback
session.rollback()


# recovery before rollback
print("after rollback:", ed_user.name)
# after rollback: ed

assert fake_user not in session, "fake_user must be absent"
# pass

session.query(User).filter(User.name.in_(['ed', 'fakeuser'])).all()
# name='ed' 만 출력

```

### 11) 별칭(alias) 사용한 질의

- SQL 출력시 alias 문장이 출력됨
  + 다른 이름이 필요할 때 사용할 수 있음

```python
##############################
##  Querying
##

# cast class
for instance in session.query(User).order_by(User.id):
    print(instance.name, instance.fullname)

# unpack Result
for name, fullname in session.query(User.name, User.fullname):
    print(name, fullname)

# MappingResult{ User, name }
for row in session.query(User, User.name).all():
    print(row.User, row.name)


from sqlalchemy.orm import aliased
user_alias = aliased(User, name='user_alias')
print(type(user_alias), user_alias)

for row in session.query(user_alias, user_alias.name).all():
    print(row.user_alias)

# SELECT user_alias.*, user_alias.name AS user_alias_name__1 
# FROM users AS user_alias
```

#### 참고: 컬럼 alias 는 label 사용

```python    
employees = db.session.query(
        EmployeeModel.id,
        EmployeeModel.name.label("emp_name") #we are using emp_name alias for column name
    ).filter(
        EmployeeModel.department == 'finance'
    ).all()

result = db.session.query(
            SubjectModel.name,
            func.sum(SubjectModel.score).label("total_score")
        ).filter(
            SubjectModel.name== 'Math'
        ).group_by(
            SubjectModel.name
        ).all()
```

#### 참고: with 절 CTE 사용 (Common Table Expression)

- [2.0 스타일 Subqueries and CTEs](https://docs.sqlalchemy.org/en/14/tutorial/data_select.html#tutorial-subqueries-ctes)
- [1.x 스타일 CTE](https://docs.sqlalchemy.org/en/14/core/selectable.html#sqlalchemy.sql.expression.CTE)

```python
"""
WITH anon_1 AS
  (INSERT INTO t (c1, c2) VALUES (:param_1, :param_2))
SELECT t.c1, t.c2
FROM t
"""

# insert 한 후 select 출력하기

from sqlalchemy import table, column, select
t = table('t', column('c1'), column('c2'))

ins = t.insert().values({"c1": "x", "c2": "y"}).cte()

stmt = select(t).add_cte(ins)

```


### 12) 컬럼 연산자를 이용한 query

- Result 슬라이스 `[1:3]` : offset() 과 limit() 를 사용할 수도 있음
- filter_by() vs filter()
  + filter 가 더 범용적임 (query 의 모든 컬럼을 대상으로 사용)
- 컬럼 연산자: DB 의 where 조건절 연산자에 해당
  + eq_, neq_, gt_, lt_ 등의 산술연산 조건
  + like, ilike, match(contains) 문자열 매칭 조건
  + in_ 등의 집합연산 조건

```python
##############################
##  Column Operators
##

# offset & limit
for u in session.query(User).order_by(User.id)[1:3]:
    print(u)

# filter_by: query 의 class 의 fields 기준으로 컬럼 매핑
for name, in session.query(User.name).filter_by(fullname='Ed Jones'):
    print(name)

# filter: 기준 class 없이 컬럼 매핑 (Subquery 등에도 이용)
for name, in session.query(User.name).filter(User.fullname=='Ed Jones'):
    print(name)

# multi filters 는 and_ 관계와 동일
for user in session.query(User).\
         filter(User.name=='ed').\
         filter(User.fullname=='Ed Jones'):
    print(user)


# 그 밖에 컬럼 연산자들..    
#
# eq_: query.filter(User.name == 'ed')
# neq_: query.filter(User.name != 'ed')
# LIKE: query.filter(User.name.like('%ed%'))
# case-insensitive LIKE: query.filter(User.name.ilike('%ed%'))

# in_: query.filter(User.name.in_(['ed', 'wendy', 'jack']))
# match (=contains): query.filter(User.name.match('wendy'))

# works with query objects too:
query.filter(User.name.in_(
    session.query(User.name).filter(User.name.like('%ed%'))
))

# use tuple_() for composite (multi-column) queries
from sqlalchemy import tuple_
query.filter(
    tuple_(User.name, User.nickname).\
    in_([('ed', 'edsnickname'), ('wendy', 'windy')])
)
```

### 13) 결과 읽어오기: all, first, one, scalar

- empty 결과에 대해 Error 피하려면 one_or_none() 사용

```python
##############################
##  Returning Lists and Scalars
##

# List[User]
query = session.query(User).filter(User.name.like('%ed')).order_by(User.id)
query.all()

# resultset[0]
query.first()

# 1 row or empty 
user = query.filter(User.id == 99).one()  # Error
user = query.filter(User.id == 99).one_or_none()

# scalar: one()[0]
query = session.query(User.id).filter(User.name == 'ed').\
   order_by(User.id)
query.scalar()

```

### 14) SQL 문장 활용하기

- session.query 의 일부분으로 사용하거나
- from_statement 로 SQL 문장 전체를 정의할 수 있음
- params 으로 파라미터 설정

```python
##############################
##  Using Textual SQL (Literal strings)
##

from sqlalchemy import text

for user in session.query(User).\
            filter(text("id<224")).\
            order_by(text("id")).all():
    print(user.name)

# 조건문 일부만 사용
session.query(User).filter(text("id<:value and name=:name")).\
    params(value=224, name='fred').order_by(User.id).one()


session.query(User).from_statement(
    text("SELECT * FROM users where name=:name")).params(name='ed').all()


stmt = text("SELECT name, id, fullname, nickname "
            "FROM users where name=:name")
stmt = stmt.columns(User.name, User.id, User.fullname, User.nickname)
session.query(User).from_statement(stmt).params(name='ed').all()

```

### 15) Counting 함수

- func.count 외에도 sum, avg, max, min 등 ...

```python
##############################
##  Counting
##

session.query(User).filter(User.name.like('%ed')).count()

from sqlalchemy import func
session.query(func.count(User.name), User.name).group_by(User.name).all()

session.query(func.count('*')).select_from(User).scalar()
session.query(func.count(User.id)).scalar()

```

### 16) Relationship 정의 (JOIN)

- User 모델의 하위로 EmailAddress 모델 정의
  - User.emails
  - EmailAddress.user => User.emails

```python
##############################
##  Building a Relationship
##

from sqlalchemy import ForeignKey, Table, MetaData
from sqlalchemy.orm import relationship

# Base.metadata.clear()

class EmailAddress(Base):
    __tablename__ = 'email_addresses'
    id = Column(Integer, primary_key=True)
    email = Column(String(50), nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'))
    user = relationship("User", back_populates="emails")
    
    __table_args__ = {
        "extend_existing": True
    }
    def __repr__(self):
        return "<EmailAddress(email='%s')>" % self.email

    
User.emails = relationship(
    "EmailAddress", order_by=EmailAddress.id, back_populates="user")
```

### 17) JOIN 테이블 생성

```python
##############################
##  create JOIN relation table
##

"""
CREATE TABLE email_addresses (
  id INTEGER NOT NULL AUTO_INCREMENT, 
  email VARCHAR(50) NOT NULL, 
  user_id INTEGER, 
  PRIMARY KEY (id), 
  FOREIGN KEY(user_id) REFERENCES users (id)
)
"""

Base.metadata.create_all(engine)

for k in Base.metadata.tables:
    print(k)
```

### 18) 개별 또는 전체 테이블 제거(drop)

- 전체 제거: metadata.drop_all(engine)
- 개별 제거: metadata.tables[ '{테이블 이름}' ].drop(engine)

```python
##############################
##  drop, drop_all
##

# Base 로 선언된 모든 테이블
for k in Base.metadata.tables:
    print(k, type(Base.metadata.tables[k]))
   
# drop users table
user_table = Base.metadata.tables['users']
print(user_table, user_table.columns.keys())
# user_table.drop(engine, checkFirst=True)

# drop email_addresses table
email_table = Base.metadata.tables['email_addresses']
print(email_table, email_table.columns.keys())
# email_table.drop(engine, checkFirst=True)

# create_all 은 생성, drop_all 은 제거
Base.metadata.drop_all(engine, tables=[user_table, email_table], checkfirst=True)

# DROP TABLE email_addresses
# DROP TABLE users
```

### 19) JOIN 데이터 insert

```python
##############################
##  Working with Related Objects
##

jack = User(name='jack', fullname='Jack Bean', nickname='gjffdd')
print( jack.addresses )

jack.addresses = [
    Address(email_address='jack@google.com'),
    Address(email_address='j25@yahoo.com')
]

session.add(jack)
session.commit()

jack = session.query(User).filter_by(name='jack').one()
print(jack.id, jack.addresses)

```

### 20) JOIN 질의

```python
##############################
##  Querying with Joins
##

for u, a in session.query(User, Address).\
                    filter(User.id==Address.user_id).\
                    filter(Address.email_address=='jack@google.com').\
                    all():
    print(u)
    print('\t', a)

    
session.query(User).join(Address).\
        filter(Address.email_address=='jack@google.com').\
        all()


# query.join(Address, User.id==Address.user_id)          # explicit condition
# query.join(User.addresses)                             # specify relationship from left to right
# query.join(Address, User.addresses)                    # same, with explicit target
# query.join(User.addresses.and_(Address.name != 'foo')) # use relationship + additional ON criteria

# query.outerjoin(User.addresses)   # LEFT OUTER JOIN
```

### 21) 서브 쿼리, 라벨(as 키워드)

- 서브 쿼리: subquery
  + subquery alias: aliased
- 컬럼 alias: label

```python
##############################
##  Using Subqueries
##

from sqlalchemy.sql import func
stmt = session.query(Address.user_id, func.count('*').\
        label('address_count')).\
        group_by(Address.user_id).subquery()

for u, count in session.query(User, stmt.c.address_count).\
    outerjoin(stmt, User.id==stmt.c.user_id).order_by(User.id):
    print(u, count)

    
stmt = session.query(Address).\
                filter(Address.email_address != 'j25@yahoo.com').\
                subquery()
addr_alias = aliased(Address, stmt)
for user, address in session.query(User, addr_alias).\
        join(addr_alias, User.addresses):
    print(user)
    print(address)

```

### 22) exists 조건 사용

```python
##############################
##  Using EXISTS
##  - any, has
##

from sqlalchemy.sql import exists
stmt = exists().where(Address.user_id==User.id)
for name, in session.query(User.name).filter(stmt):
    print(name)

for name, in session.query(User.name).\
        filter(User.addresses.any()):
    print(name)


```

### 23) 삭제

```python
##############################
##  Deleting
##

session.delete(jack)
session.query(User).filter_by(name='jack').count()


session.query(Address).filter(
    Address.email_address.in_(['jack@google.com', 'j25@yahoo.com'])
 ).count()

```

### 24) Delete, 캐스케이드 삭제

```python
##############################
##  Configuring delete/delete-orphan Cascade
##

session.close()

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'
    pass

class Address(Base):
    __tablename__ = 'addresses'
    pass


jack = session.get(User, 5)

del jack.addresses[1]

session.query(Address).filter(
    Address.email_address.in_(['jack@google.com', 'j25@yahoo.com'])
).count()


session.delete(jack)

session.query(User).filter_by(name='jack').count()

session.query(Address).filter(
   Address.email_address.in_(['jack@google.com', 'j25@yahoo.com'])
).count()

```

## 9. Review

- 차이점을 익히고 classic 버전 코드를 future 버전으로 바꿔서 작성하자.
- 원치 않는 형태로 SQL 작성되지는 않는지 생성되는 Query 를 확인하자.
- 조만간 언어별로 DB 처리 기술들을 비교 조사해 봐야겠다.
  + ex) Spring Data JDBC + QueryDSL + POJO 스타일 Entity
- Spring JPA 를 쓸 당시에는, 사용폭이 좁았던 탓인지 이상함을 느끼지 못했다.
  + 이전보다 껄끄럼거나 의문점들이 많아 보인다면 재학습이 필요한 시기이다.

> 참고문서

- [pythonsheets - SQLAlchemy](https://www.pythonsheets.com/notes/python-sqlalchemy.html) 예제 중심으로 나열

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
