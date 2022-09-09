---
date: 2022-09-05 00:00:00 +0000
title: python ORM - SQLModel - 3일차
categories: ["python"]
tags: ["TIL", "2.0", "orm", "sqlalchemy", "tutorial"]
image: "https://sqlmodel.tiangolo.com/img/logo-margin/logo-margin-vector.svg"
---

> SQLAlchemy 1.4 의 Future(2.0) 스타일과 1.x 스타일의 Tutorial 을 살펴봅니다.
{: .prompt-tip }

## 1. SQLAlchemy 1.4 의 Future(2.0) 버전과 1.x 버전

SQLAlchemy의 1.x 스타일은 15년간 유지되고 발전되어 왔습니다. 변화가 필요한 부분들을 정리하여 2.0의 Core 버전으로 개발하고 있습니다. 1.4 버전은 classic 스타일을 Future 스타일로 마이그레이션을 위한 버전으로 튜토리얼과 함께 2.0 Stubs 패키지를 제공하고 있습니다.

[2.0 스타일의 차이점은 다음과 같습니다.](https://docs.sqlalchemy.org/en/20/changelog/migration_20.html#new-features-and-improvements)

- PEP 484 (DBAPI 2) 스펙을 준수합니다
- postgresql 의 psycopg 어댑터를 지원하며, async 기능을 사용할 수 있습니다.
- create_endgine 과 session 의 사용 형태가 조금 바뀌었고
- execute 가 query 와 얽히지 않고 분리되어 바깥에서 감싸게 됩니다.
- Generic Type 에 대한 처리방식(Stub)에 대해 과거 버전과 호환되지 않습니다.
  + 정확한 뜻을 이해하지는 못했지만
  + 각각의 DB 데이터 타입을 sqlalchemy 함수와 묶기 위한 타입 변환과 처리 방식에 대한 정의인 것으로 이해됨


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

with Session(engine) as session:
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

stmt = select(User).where(User.name.in_(["spongebob", "sandy"]))

for user in session.scalars(stmt):
    print(user)

# User(id=1, name='spongebob', fullname='Spongebob Squarepants')
# User(id=2, name='sandy', fullname='Sandy Cheeks')

```

### 6) JOIN 이용한 질의

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
sandy_address = None


stmt = (
    select(Address)
    .join(Address.user)
    # .where(User.name == "sandy")
    .where(Address.email_address == "sandy@sqlalchemy.org")
)
sandy_address = session.scalars(stmt).one()

print("fetchOne():", sandy_address)

```

### 7) insert, update, commit

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

# patrick.addresses += new Address()
patrick.addresses.append(
    Address(email_address="patrickstar@sqlalchemy.org")
)

# sandy: Address.email_address = ".."
sandy_address.email_address = "sandy_cheeks@sqlalchemy.org"

session.commit()

```

### 8) delete, flush

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

sandy = session.get(User, 2)

sandy.addresses.remove(sandy_address)

session.flush()  # alternative command for commit

session.delete(patrick)

session.commit()

```

### 9) 좀 더 복잡한 JOIN 질의

```python
##############################
##  SELECT with JOIN
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
##  Make Changes
##

stmt = select(User).where(User.name == "patrick")
patrick = session.scalars(stmt).one()


patrick.addresses.append(
    Address(email_address="patrickstar@sqlalchemy.org")
)

sandy_address.email_address = "sandy_cheeks@sqlalchemy.org"

session.commit()

```

### 11) JOIN 데이터 삭제와 cascade 삭제

```python
##  Some Deletes
##

sandy = session.get(User, 2)


sandy.addresses.remove(sandy_address)

session.flush()

session.delete(patrick)

session.commit()

```


### 3. SQLAlchemy 1.4 의 1.x 스타일 튜토리얼

문서: [SQLAlchemy 1.4 Documentation](https://docs.sqlalchemy.org/en/14/index.html)

- [ORM Tutorial (1.x API)](https://docs.sqlalchemy.org/en/14/orm/tutorial.html) : 짧지 않은 예제
- [SQL Expression Language Tutorial (1.x API)](https://docs.sqlalchemy.org/en/14/core/tutorial.html) : 항목별 설명


### 1)

```python
##  Connecting
##

# connection url
import urllib.parse
password = urllib.parse.quote_plus("p@ssw0rd")  # 특수문자 처리
CONN_URL = f'mysql+pymysql://root:{password}@minubt/tutorial'

from sqlalchemy import create_engine
engine = create_engine(CONN_URL, echo=True)
```

### 2)

```python
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

### 3)

```python
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

### 4)

```python
##  Create an Instance of the Mapped Class
##

# instance
ed_user = User(name='ed', fullname='Ed Jones', nickname='edsnickname')

print(ed_user)
print("ed_user.id:", str(ed_user.id))
```

### 5)

```python
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

### 6)

```python
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

### 7)

```python
from sqlalchemy import text
query = text("SELECT * FROM users WHERE users.name = :name_1")

# sqlalchemy.engine.result.ScalarResult
# 첫번째 컬럼 값만 가져와 scalars 생성
results = session.execute(query, { "name_1":'ed' }).scalars()
user_ids = results.all()  # all() 을 두번 호출할 수 없다 (임시 데이터라 fetch 이후 사라짐)
print("scalars().all():", user_ids)
# ==> [1, 2, ..., 8, 9, 10, 11]

# List
results = session.execute(query, { "name_1":'ed' }).all()
print("scalars() = ScalarResult:", type(results), results)
# ==> [(1, 'ed'), ..., (9, 'ed'), (10, 'ed'), (11, 'ed')]

last_user = results[-1]
print(f"last_user[{last_user.id}]:", User(**last_user))
```

### 8)

```python
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

### 9)

```python
##  and, or
##

from sqlalchemy import and_, or_
session.query(User).filter(and_(User.name=="ed", User.id > 1)).delete()
session.commit()
```

### 10)

```python
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

### 11)

```python
##  Querying
##

# class
for instance in session.query(User).order_by(User.id):
    print(instance.name, instance.fullname)

# Map: unpack
for name, fullname in session.query(User.name, User.fullname):
    print(name, fullname)

# Map having class, scalar    
for row in session.query(User, User.name).all():
    print(row.User, row.name)



# User.clone()
from sqlalchemy.orm import aliased
user_alias = aliased(User, name='user_alias')
print(type(user_alias), user_alias)

for row in session.query(user_alias, user_alias.name).all():
    print(row.user_alias)

# SELECT user_alias.*, user_alias.name AS user_alias_name__1 
# FROM users AS user_alias
    
    
class UserClone(User):
    pass

for row in session.query(UserClone, UserClone.name).all():
    print(row.UserClone)
    
# SELECT users.*, users.name AS users_name__1 
# FROM users    
```

### 12)

```python
for u in session.query(User).order_by(User.id)[1:3]:
    print(u)

for name, in session.query(User.name).filter_by(fullname='Ed Jones'):
    print(name)

for name, in session.query(User.name).filter(User.fullname=='Ed Jones'):
    print(name)

# and_
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

### 13)

```python
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

### 14)

```python
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

### 15)

```python
##  Counting
##

session.query(User).filter(User.name.like('%ed')).count()


from sqlalchemy import func
session.query(func.count(User.name), User.name).group_by(User.name).all()


session.query(func.count('*')).select_from(User).scalar()
session.query(func.count(User.id)).scalar()

```

### 16)

```python
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

### 17)

```python
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

### 18)

```python
for k in Base.metadata.tables:
    print(k, type(Base.metadata.tables[k]))
    


user_table = Base.metadata.tables['users']
print(user_table, user_table.columns.keys())
# user_table.drop(engine, checkFirst=True)

email_table = Base.metadata.tables['email_addresses']
print(email_table, email_table.columns.keys())
# email_table.drop(engine, checkFirst=True)

# create_all 은 생성, drop_all 은 제거
Base.metadata.drop_all(engine, tables=[user_table, email_table], checkfirst=True)

# DROP TABLE email_addresses
# DROP TABLE users
```

### 19)

```python
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

### 20)

```python
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

### 21)

```python
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

### 22)

```python
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

### 23)

```python
##  Deleting
##

session.delete(jack)
session.query(User).filter_by(name='jack').count()


session.query(Address).filter(
    Address.email_address.in_(['jack@google.com', 'j25@yahoo.com'])
 ).count()

```

### 24)

```python
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

참고문서

- [SQLAlchemy 2.0 - Major Migration Guide](https://docs.sqlalchemy.org/en/20/changelog/migration_20.html)
- [파이썬 개발자를 위한 SQLAlchemy](https://soogoonsoogoonpythonists.github.io/sqlalchemy-for-pythonist/) - 공식 문서 번역
- [SQLAlchemy 시작하기 – Part 2](https://edykim.com/ko/post/getting-started-with-sqlalchemy-part-2/) 2013년 문서 - 길고 상세

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
