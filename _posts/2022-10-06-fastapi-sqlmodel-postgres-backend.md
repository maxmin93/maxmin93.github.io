---
date: 2022-10-06 00:00:00 +0900
title: FastAPI + SQLModel + Postgres 프로젝트
description: SQLModel 의 Hero Tutorial 을 FastAPI 와 Postgresql 로 구현한 프로젝트를 설명합니다. (Docker 포함)
categories: [Backend, ORM]
tags: [python, postgresql, docker, sqlmodel, fastapi]
image: "https://github.com/maxmin93/fastapi-sqlmodel-heroes/blob/main/assets/img/06-fastapi-sqlmodel-pg14-docs-crunch.png?raw=true"
---

> 목록
{: .prompt-tip }

- 1일차 [python ORM - SQLModel - 1일차](/posts/python-orm-sqlmodel-1st/)
- 2일차 [python ORM - SQLModel - 2일차](/posts/python-orm-sqlmodel-2nd/)
- 3일차 [python ORM - SQLModel - 3일차](/posts/python-orm-sqlmodel-3rd/)
- 4일차 [python ORM - SQLModel - 4일차](/posts/python-orm-sqlmodel-4th/)
- 5일차 [FastAPI + SQLModel + Postgres 프로젝트](/posts/fastapi-sqlmodel-postgres-backend/) &nbsp; &#10004;

## 1. SQLModel 의 [Hero Tutorial](https://sqlmodel.tiangolo.com/tutorial/)

Heroes 와 Teams 두 개의 모델에 대해 짧은 예제를 제공한다.

- create, update, delete 설명
- select 및 join 설명 
- FastAPI 에서 SQLModel 을 사용하는 방법 설명
- REST API 메소드에 필요한 멀티 모델에 관한 설명
- 두 모델의 Relationship 에 관한 설명

> 그렇지만, 조각난 코드로만 설명하고 하나의 프로젝트로 제공하고 있지는 않아서 막상 프로젝트를 구성하려면 여러가지 문제에 부딪힌다.

그래서 공부도 할겸 개발을 시작했는데, 이상하게 껄끄러움을 느꼈다. (왜이리 불편하지?) Spring 보다도 불편하고 투명하지 않다. 필요하니깐 공부하는 것이긴 하지만 왠지 정이 안가서 미적거리다 보니 시간이 꽤 흘러 이제야 정리를 하게 되었다.

## 2. (FastAPI + SQLModel) Hero 튜토리얼 실행

SqlModel 의 Hero 튜토리얼을 FastAPI 프레임워크로 구현한 프로젝트

### 1) 실행화면 캡쳐

#### Backend: api

![fastapi docs screen](https://github.com/maxmin93/fastapi-sqlmodel-heroes/blob/main/assets/img/06-fastapi-sqlmodel-pg14-docs-crunch.png?raw=true){: width="580"}
_&lt;그림&gt; FastAPI `/docs` 화면_

#### Storage: db

```sql
$ psql -d company_db -U tonyne -h localhost -p 5432 -W
Password:
psql (14.5)
Type "help" for help.

company_db=# show time zone;
  TimeZone
------------
 Asia/Seoul
(1 row)

company_db=# \dt
       List of relations
 Schema | Name | Type  | Owner
--------+------+-------+--------
 public | hero | table | tonyne
 public | team | table | tonyne
(2 rows)

company_db=# SELECT conrelid::regclass AS table_name,
       conname AS foreign_key,
       pg_get_constraintdef(oid) 
FROM   pg_constraint
WHERE  contype = 'f' AND connamespace = 'public'::regnamespace
ORDER  BY conrelid::regclass::text, contype DESC;
 table_name |    foreign_key    |           pg_get_constraintdef
------------+-------------------+-------------------------------------------
 hero       | hero_team_id_fkey | FOREIGN KEY (team_id) REFERENCES team(id)
(1 row)

company_db=# select * from hero;
    name    |   secret_name    | age | team_id | id
------------+------------------+-----+---------+----
 Deadpond   | Dive Wilson      |     |       1 |  1
 Rusty-Man  | Tommy Sharp      |  48 |       1 |  2
 Dormammu   | Unknown          |     |       2 |  3
 Spider-Boy | Pedro Parqueador |  21 |         |  4
(4 rows)

company_db=# select * from team;
  name  | headquarters | id
--------+--------------+----
 서울팀 | 종로구       |  1
 충남팀 | 홍성군       |  2
 경북팀 | 울산군       |  3
(3 rows)
```

#### Frontend: web

![Vue heroes screen](https://heroes-of-vue.netlify.app/assets/img/full-app.a2decf21.png){: width="580"}
_&lt;그림&gt; Vue `/heroes` 화면_


### 2) API 샘플

#### (1) create hero : POST `/heroes`

```shell
# insert with HeroCreate
$ curl -X POST "http://localhost:58000/heroes/" -H "Content-Type: application/json" -d '''
{"name": "ABC Teacher", "secret_name": "foo bar", "age": 35}
'''
{"name":"ABC Teacher","secret_name":"foo bar","age":35,"id":5}%


# select by ID=5
$ curl -X GET "http://localhost:58000/hero/5"
{"name":"ABC Teacher","secret_name":"foo bar","age":35,"id":5}%
```

#### (2) update hero{id} : PATCH `/heroes/{id}`

```shell
# update whole-data by ID=5
$ curl -X PATCH "http://localhost:58000/heroes/5" -H "Content-Type: application/json" -H 'Accept: application/json' -d '''
{"name": "ABC Teacher (Extra)", "secret_name": "foo bar", "age": 55}
'''
{"name":"ABC Teacher","secret_name":"foo bar","age":35,"id":5}%


# update partial-data by ID=5
$ curl -X PATCH "http://localhost:58000/heroes/5" -H "Content-Type: application/json" -H 'Accept: application/json' -d '''
{"name": "ABC Super Teacher (Extra)"}
'''
{"name":"ABC Super Teacher (Extra)","secret_name":"foo bar","age":55,"id":5}%


# select by ID=5
$ curl -X GET -H 'Accept: application/json' "http://localhost:58000/hero/5"
{"name":"ABC Teacher Teacher (Extra)","secret_name":"foo bar","age":55,"id":5}%
```

#### (3) delete hero{id} : DELETE `/heroes/{id}`

```shell
# delete by ID=5
$ curl -X DELETE -H 'Accept: application/json' "http://localhost:58000/heroes/5"
{"ok":true}%


# select by ID=5 => 404 Error
$ curl -X GET -H 'Accept: application/json' "http://localhost:58000/hero/5"
{"detail":"Hero not found"}%
```

#### (4) select hero or heroes

- GET `/heroes/last`
- GET `/heroes`
- GET `/hero/2`

```shell
$ curl -X GET "http://localhost:58000/heroes/last"
{"name":"Spider-Boy","secret_name":"Pedro Parqueador","age":21,"team_id":null,"id":4}%
```

- select with relations : GET `/heroes/1`

```json
{
  "name": "Deadpond",
  "secret_name": "Dive Wilson",
  "age": null,
  "team_id": 1,
  "id": 1,
  "team": {
    "name": "서울팀",
    "headquarters": "종로구",
    "id": 1
  }
}
```

#### (5) create team : POST `/teams`

```shell
$ curl -X POST "http://localhost:8000/teams/" -H "Content-Type: application/json" -d '''
{"name": "뉴욕팀", "headquarters": "뉴욕시청", "heroes": []}
'''
{"name":"뉴욕팀","headquarters":"뉴욕시청","id":6}%

$ curl -X POST "http://localhost:8000/teams/" -H "Content-Type: application/json" -d '''
{"name": "뉴욕팀", "headquarters": "뉴욕시청", "heroes": [
  {"name":"Spider-Boy","secret_name":"Pedro Parqueador","age":21,"id":4}
]}
'''
{"name":"뉴욕팀","headquarters":"뉴욕시청","id":7}%
```

#### (6) update team{id} : PATCH `/teams/{id}`

```shell
# update partial-data by ID=5
$ curl -X PATCH "http://localhost:8000/teams/6" -H "Content-Type: application/json" -H 'Accept: application/json' -d '''
{"name": "뉴욕팀 Super", "headquarters": "뉴욕시청 공원", "heroes": [
  {"name":"Spider-Boy","secret_name":"Pedro Parqueador","age":21,"id":4}
]}
'''
{"name":"뉴욕팀 Super","headquarters":"뉴욕시청 공원","id":6}%
```

#### (3) delete team{id} : DELETE `/teams/{id}`

```shell
# delete by ID=5
$ curl -X DELETE -H 'Accept: application/json' "http://localhost:58000/teams/5"
{"ok":true}%


# select by ID=5 => 404 Error
$ curl -X GET -H 'Accept: application/json' "http://localhost:58000/teams/5"
{"detail":"Team not found"}%
```

#### (4) select team or teams

- GET `/teams/last`
- GET `/teams`
- GET `/team/2`

```shell
$ curl -X GET "http://localhost:58000/teams/last"
{"name":"Spider-Boy","secret_name":"Pedro Parqueador","age":21,"team_id":null,"id":4}%
```

- select with relations : GET `/teams/1`

```json
{
  "name": "서울팀",
  "headquarters": "종로구",
  "id": 1,
  "heroes": [
    {
      "name": "Deadpond",
      "secret_name": "Dive Wilson",
      "age": null,
      "team_id": 1,
      "id": 1
    },
    {
      "name": "Rusty-Man",
      "secret_name": "Tommy Sharp",
      "age": 48,
      "team_id": 1,
      "id": 2
    }
  ]
}
```

### 3) tutorials

#### (0) remove heroes and teams : GET `/tutorial/0`

- delete `select(Hero).where(Hero.name.match("%Tutorial%"))`
- delete `select(Team).where(Team.name.match("%Tutorial%"))`

#### (1) create heroes and teams : GET `/tutorial/1`

- create teams: ['Tutorial Preventers', 'Tutorial Z-Force']
- create heroes: ['Tutorial Deadpond', 'Tutorial Rusty-Man', 'Tutorial Spider-Boy']
  - 'Tutorial Deadpond'.team = 'Tutorial Z-Force'
  - 'Tutorial Rusty-Man'.team = 'Tutorial Preventers'

#### (2) select hero and team : GET `/tutorial/2`

- select hero `select(Hero).where(Hero.name == "Tutorial Spider-Boy")`
- select team `select(Team).where(Team.id == hero_spider_boy.team_id)`

#### (3) update hero with team : GET `/tutorial/3`

- update hero "Tutorial Spider-Boy"
  - hero_spider_boy.team = team_preventers  (팀 배정)
  
#### (4) delete team and update heroes : GET `/tutorial/4`

- delete team "Tutorial Preventers"
  + updated hero with none team

## 3. pytest

### 1) `tests/main_test.py`

- test_hello : fastapi 작동 여부
- test_hero : GET `/heroes/last` 작동 여부와 HeroRead 변환
- test_aiohttp_with_every_client : 1000 번 GET `/heroes/` 호출
  + resp.status == 200 검사

```shell
$ poetry run pytest tests --log-cli-level=DEBUG
============================== test session starts ===============================
platform darwin -- Python 3.9.13, pytest-7.1.3, pluggy-1.0.0
rootdir: /Users/bgmin/Workspaces/python/sqlmodel/sqlmodel-pg-api/smp-api
plugins: anyio-3.6.1
collected 6 items

tests/main_test.py::test_hello
tests/main_test.py::test_read_items
tests/main_test.py::test_read_item
tests/main_test.py::test_create_item
tests/main_test.py::test_update_item
tests/main_test.py::test_delete_item

tests/main_test.py ......                                                  [100%]

=============================== 6 passed in 0.64s ================================
```

### 2) `tests/hero_test.py`

- test_read_items, test_read_item : select 테스트
- test_create_item : create 테스트
- test_update_item : update 테스트
- test_delete_item : delete 테스트

### 3) `tests/team_test.py`

- test_read_groups, test_read_group : select 테스트
- test_create_group : create 테스트
- test_update_group : update 테스트
- test_delete_group: delete 테스트

  
## 4. docker compose 실행

```shell
# 도커 컴포즈에서 linux/amd64 이미지 생성 (Mac M1)
$ env DOCKER_DEFAULT_PLATFORM=linux/amd64 docker compose build
[+] Building 650.5s (20/21)
 => [internal] load build definition from Dockerfile                 0.0s
 => => transferring dockerfile: 32B                                  0.0s
 => [internal] load .dockerignore                                    0.0s
 => => transferring context: 34B                                     0.0s
 => [internal] load metadata for docker.io/library/python:3.9-slim   3.1s
...

$ docker compose up -d
[+] Running 2/2
 ⠿ Container smp-db   Created                                        0.0s
 ⠿ Container smp-api  Recreated                                      0.1s
Attaching to smp-api, smp-db
...

$ docker compose down -v
[+] Running 5/0
 ⠿ Container smp-api                Removed                          0.0s
 ⠿ Container smp-db                 Removed                          0.0s
 ⠿ Volume smpapi_data               Removed                          0.0s
 ⠿ Volume smpdb_data                Removed                          0.0s
 ⠿ Network sqlmodel-pg-api_default  Rem...                           0.1s
```

### 1) 소스코드

[https://github.com/maxmin93/fastapi-sqlmodel-heroes](https://github.com/maxmin93/fastapi-sqlmodel-heroes)

### 2) SQLAlchemy 관련 다른 글

- [python ORM - SQLModel - 1일차](/posts/python-orm-sqlmodel-1st/)
  + SQLModel 핵심 모델
- [python ORM - SQLModel - 2일차](/posts/python-orm-sqlmodel-2nd/)
  + SQLAlchemy 1.4 - postgresql 접속
- [python ORM - SQLModel - 3일차](/posts/python-orm-sqlmodel-3rd/)
  + SQLAlchemy Future(2.0) 버전
- [Docker-compose 로 alembic + postgres + FastAPI 만들기](/posts/docker-compose-alembic-db-api/)
  + FastAPI 및 postgresql 의 Docker 이미지


## 9. Review

- 휴, 진짜 오래묵은 숙제를 해치웠다.
- SQLModel 의 (Advanced) 비동기 예제는 아직 없다. 언제 올려주려나.
- 풀스택 기술로 nodejs 에 집중하는게 낫지 않을까?
  - python 은 AI 모델 서비스를 위한 백엔드로만 쓰고 

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
