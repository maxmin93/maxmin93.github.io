---
date: 2022-09-03 00:00:00 +0900
title: python ORM - SQLModel - 1일차
description: python ORM 으로 FastAPI 저자가 만든 SQLModel 에 대해 공부한 것을 정리합니다.
categories: [Backend, ORM]
tags: ["1st-day", "python", "sqlmodel", "sqlalchemy"]
image: "https://sqlmodel.tiangolo.com/img/logo-margin/logo-margin-vector.svg"
---

> 목록
{: .prompt-tip }

- 1일차 [python ORM - SQLModel - 1일차](/posts/python-orm-sqlmodel-1st/) &nbsp; &#10004;
- 2일차 [python ORM - SQLModel - 2일차](/posts/python-orm-sqlmodel-2nd/)
- 3일차 [python ORM - SQLModel - 3일차](/posts/python-orm-sqlmodel-3rd/)
- 4일차 [python ORM - SQLModel - 4일차](/posts/python-orm-sqlmodel-4th/)
- 5일차 [FastAPI + SQLModel + Postgres 프로젝트](/posts/fastapi-sqlmodel-postgres-backend/)

## ORM 설명

ORM 은 서비스 계층의 관점으로 객체를 정의하고, 이를 관계형 데이터베이스와 맵핑을 시켜주는 설계방식이자 도구이다. ORM 을 통해 RDB 의 자원을 사용할 수 있게 되면서 데이터 모델링은 한층 더 추상적으로 구현할 수 있게 되었다. 서비스의 인터페이스나 서비스 객체간의 상호작용들을 데이터 모델링으로 일관성 있게 다루면서 소프트웨어 품질도 좋아지는 영향을 미치고 있다.

### ORM 사용으로 인한 장단점

#### 장점

1. 객체지향적인 코드로 인해 더 직관적이고 비즈니스 로직에 집중할 수 있게 도와준다
2. 재사용 및 유지보수의 편리성이 증가한다.
3. DBMS 에 대한 종속성이 줄어든다.
4. SQL Injection 공격 등의 위험으로부터 안전성이 높아진다. (검사 기능)

#### 그에 따른 단점

1. ORM 만으로 서비스를 완전히 구현하기가 어렵다. (익히기도 쉽지 않다)
2. DB 의 성능을 완전히 끌어내기가 어렵다.
3. 모델링 품질에 따라서 데이터의 용량이나 서버의 부하가 증가할 수 있다.

#### 그밖에 의견

- 한창 DB가 잘나가던 시절이 있었는데, 개발자들이 DB 벤더들의 권력을 분산시키려고 ORM 을 개발
- DB 와 SW 개발에 필요한 인력을 줄여서 이익을 증가시키기 위해 ORM 을 적극 도입
- 개발자들이 DB 도, SQL 도 신경쓰고 싶지 않아서 (데이터 관리 같은건 쿨하지 못해)

### python ORM 의 대표적인 라이브러리들

참조: [파이썬용 ORM - 2020년 문서](https://medium.com/pragmatech/orm-for-python-b63cfbc39e7f)

- [Django ORM](https://docs.djangoproject.com/en/3.1/topics/db/queries/)
  - Django 웹프레임워크에서 사용하는 ORM
  - 복잡하고 어렵다고 불평이 많아 SQLAlchemy 등으로 갈아타기도 한다고
- [SQLAlchemy](https://www.sqlalchemy.org/) : 최신버전 1.4.40 (2022-08-08)
  - Flask, Pyramid, Django 와 함께 사용할 수 있음
  - 단순성, 속도, 다양한 기능으로 최고의 ORM 으로 간주됨
- [Peewee](http://docs.peewee-orm.com/en/latest/)
  - SQLAlchemy 보다 쉽고 간단해서 ORM 입문용으로 추천
  - 거의 모든 웹프레임워크와 함께 사용할 수 있음
  - 아직 SQLAlchemy 급은 아니라서 대규모 프로젝트에 사용하기는 어려움
- [PonyORM](https://ponyorm.org/)
  - SQL 을 손쉽게 작성할 수 있고, 속도면에서 최고 중에 하나
  - 아쉽게도 마이그레이션을 아직 지원하지 못함 (개발중이라고)
- [SQLObject](http://sqlobject.org/)
  - 내용 없음

## [SQLModel](https://sqlmodel.tiangolo.com/)

> SQLModel is based on Python type annotations, and powered by [Pydantic](https://pydantic-docs.helpmanual.io/) and [SQLAlchemy](https://sqlalchemy.org/).

### 주요 특징 및 상태

#### 저자가 말하는 중요 특징

- 작성하기 편함
  - VSCode 등의 편집기에서 자동완성 기능을 지원함
- 사용하기 쉬움
  - 코드를 단순화 해서 작성할 코드를 줄여줌
- 호환 가능
  - FastAPI, Pydantic 및 SQLAlchemy와 호환되도록 설계되었음
- 확장 가능
  - SQLAlchemy 및 Pydantic 의 확장성을 물려 받음
- Short: 코드 중복을 최소화
  - SQLAlchemy 및 Pydantic에서 동일 모델을 schema 와 model 로 복제할 필요가 없음

> 참고: SQLModel 문서 중 [Database to Code (ORMs)](https://sqlmodel.tiangolo.com/db-to-code/)

- SQL Injection (주입) 과 SQL Sanitization (살균)
  - SQL 특성으로 어쩔수 없는 부분을 python 과 소통하도록 지원
  - SQL 위변조 방어

#### (사용자인) 개발자들이 갖는 관심

- FastAPI 저자가 개발중이라 FastAPI 에서 공식 ORM 으로 사용될 것이다 (인기 상승 예상)
- SQLAlchemy 1.x 가 복잡했는데, 2.0 Core (핵심 기능) 기반이라 하니 한결 편하고 강력할 것 같다
- 지금부터 배워가면 FastAPI 와 ORM 두마리 토끼를 한번 잡을 수 있다.

### 최신 버전 0.0.8 (2022년 9월 기준)

#### 주의사항!!

한 열흘전만 해도 0.0.6 버전이었는데, 일주일 사이에 두번의 릴리즈가 있을 정도로 빠르게 변하고 있는 중이라는 것음 염두해 두어야 함. 깃허브에는 이슈들과 제안들로 넘쳐나고, 얼개로 형태만 잡아놓고 기능이 연결 안된 경우도 있음

- [SQLAlchemy 2.0](https://docs.sqlalchemy.org/en/20/changelog/migration_20.html) 개발 버전을 활용

  - 기능의 대부분을 의존하고 있는 SQLAlchemy 가 현재 2.0.0b1 개발 초기 단계 (릴리즈 예정도 없음)
  - 공식 버전은 1.4 이고, 차세대 버전인 2.0 과의 연결 역활을 한다고 함
  - 문서나 예제 등의 자료가 많지만 버전을 확인하며 참고해야 함

- 활용되는 SQLAlchemy 클래스들의 위치나 이름이 원본과 달라 혼란이 올 수 있음

  - 저자는 pydantic 의 단순성과 범용성을 그대로 구현하고 싶어하는 듯

- 목표는 중복되는 모델을 하나로 사용케 하는 것이지만, 현실 모델의 Usecase 와 맞지 않을 수 있음
  - DB 의 schema 역활과 entrypoint(Request/Response) 의 DTO 역활을 하나로 통합하는 것

### SQLModel 예제

- DB 접속과 CRUD 과정은 sqlalchemy 와 동일
  - Table 의 BaseModel 이 달라지고 함수들이 축약됨
- fastapi 와 연동시에는 pydantic 과 유사
  - 객체와 json 간의 getter, setter 기능을 활용

```python
# connect
engine = create_engine(CONNECTION_URL, echo=True)


# model 정의
class Hero(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    secret_name: str
    age: Optional[int] = None


# model 적용(create) 또는 reflect(메타모델 가져오기)
SQLModel.metadata.create_all(engine)


# insert/update
hero_1 = Hero(name="Rusty-Man", secret_name="Tommy Sharp", age=48)
with Session(bind=engine) as conn:
    conn.add(hero_1)  # execution 대기: insert stmt
    conn.commit()

    hero_1.age = 16
    conn.add(hero_1)  # execution 대기: update stmt
    conn.commit()    # dirty 상태 (expired)

    conn.refresh(hero_1)  # reload (expired 초기화)
    print("Updated hero:", hero_1)


# select
with Session(bind=engine) as conn:
    statement = select(Hero).where(Hero.name == "Rusty-Man")
    results = session.exec(statement)
    for hero in results:
        print(hero)

    # join
    statement = select(Hero, Team) \
        .join(Team, isouter=True) \
        .where(Team.name == "Preventers")
    ...


# response_model with fastapi
@app.get("/heroes/", response_model=List[Hero])
def read_heroes():
    with Session(engine) as session:
        heroes = session.exec(select(Hero)).all()
        return heroes
```

### SQLModel 핵심 모델

#### sqlmodel.SQLModel

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

#### sqlmodel.create_engine

- sqlalchemy.create_engine 의 복잡성을 은닉시켜서 사용

```python
def create_engine(
    url: Union[str, URL],
    *,
    connect_args: _ConnectArgs = Default({}),
    # ...
) -> _FutureEngine:
    # 복잡한 설정 사항들을 검사하고 기본 설정
    # ...
    current_kwargs.update(kwargs)

    # sqlalchemy.create_engine
    return _create_engine(url, **current_kwargs)
```

#### sqlmodel.Session

- sqlalchemy 의 Session 을 베이스로 삼고 비슷한 함수들을 통합
- 네이밍을 통일시키고, 대체 함수를 제공

> _Tip._ `...` 은 literal 값의 반복 패턴을 단축하는 키워드로, 또는 `pass` 의미로도 사용

```python
from sqlalchemy.orm.sessions import Session as _Session

class Session(_Session):

    @overload
    def exec(self, statement, *, params, ...) -> Result:
        ...

    @overload
    def exec(self, statement, *, params, ...) -> ScalarResult:
        ...

    def exec(self, statement, *, params, ...) -> Union[Result, ScalarResult]:
        ...

    def execute(self, statement, params, ...) -> Result:
        ...
        return super().execute(statement, params, ...)

    # ...
```

## 9. Review

- 자신의 말로 설명하는 연습을 하자. 그래서 블로깅 하는거다.
- 라이브러리 저자의 의도나 목적을 알게된다면 변경사항을 이해하기 쉬워진다.
  + 어떻게 알 수 있나? 저자의 깃허브 이슈 댓글을 읽어보자.

> 참고문서

- [SQLAlchemy 2.0 - Major Migration Guide](https://docs.sqlalchemy.org/en/20/changelog/migration_20.html)
- [파이썬 개발자를 위한 SQLAlchemy](https://soogoonsoogoonpythonists.github.io/sqlalchemy-for-pythonist/)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
