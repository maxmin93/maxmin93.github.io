---
date: 2022-05-11 00:00:00 +0900
title: "GraphQL 로 Todo API 만들기"
categories: ["backend","webframework"]
tags: ["nestjs","typeorm","todo-app","sqlite","graphql"]
---

> 입사지원 과제로 제출한 프로젝트입니다. 백엔드에 GraphQL 구현을 추가했습니다.
{: .prompt-tip }

<div style="display: flex; justify-content: center;">
  <img src="https://miro.medium.com/max/1400/1*y5Cb_lSRJCg1ixoHbMA_ZA.png" width="120" alt="Apollo GraphQL"/>&nbsp; &nbsp;
  <img src="https://nestjs.com/img/logo-small.svg" width="130" alt="Nest Logo" />&nbsp;
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/SQLite370.svg/1280px-SQLite370.svg.png" width="150" alt="Sqlite Logo" />
</div>

- API: [Apollo GraphQL](https://www.apollographql.com/)
- 백엔드: [NestJS](http://nestjs.com/)
- 저장소: [Sqlite](https://www.sqlite.org/)

## Description

`Wisely Todo API` 는 Todo 를 기록하고, 조회할 수 있는 API 백엔드입니다.<br>

- GraphQL 로 Todo 를 생성, 수정, 조회
- Todo 조회를 위한 Pagination 기능
- Todo 검색 기능 : 단어 매칭, Done(완료여부), Created 기간(시작일, 종료일)

## Installation & Build

`Wisely Todo API` 은 node 를 기반으로 백엔드 nestjs 를 사용하여 만들어졌습니다.

- node 16.14.1 (npm 8.5.0)
- @nestjs/cli 8.0.0
- Sqlite 3.36.0

```shell
# node 설치
$ brew install node@16

# sqlite3 설치
$ brew install sqlite

# @nestjs/cli 설치
$ npm i -g @nestjs/cli

# 소스 다운로드 및 이동
$ git clone https://github.com/maxmin93/wisely-todo-api
$ cd wisely-todo-api

# 라이브러리 설치
$ npm install

# 백엔드 빌드
$ nest build

# 빌드 결과 확인
$ ls dist
```

## Running API server

서버 시동 후 웹브라우저 또는 Postman 으로 사용할 수 있습니다.<br>
API 포트 변경은 `.env` 파일의 `TODOS_PORT` 변수로 설정할 수 있습니다.

```shell
# development mode
$ npm run start

# production mode
$ npm run start:prod
```

## Sqlite Database

`todos.db` (Sqlite DB파일) 의 데이터 손상시 `create_todos.sql` 을 이용해 복구할 수 있습니다.

- Todo 저장에 사용된 테이블은 `todo` 입니다.
  - `id` 는 저장시 자동으로 생성됩니다. (auto-increment)
  - `name` 은 Todo 의 이름입니다.
- Todo 는 하위 Todo를 포함할 수 있으며, Relation 테이블은 `subtodo` 입니다.
  - Todo 와 Join 에 사용되는 컬럼은 `grp_id`, `sub_id` 이고
  - `grp_id` 은 상위 Todo, `sub_id` 는 하위 Todo

```shell
# DB 오류시 스크립트 실행으로 재생성
$ sqlite3 todos.db < create_todos.sql

# 내용 확인
$ sqlite3 todos.db -header -column

# SUBTODO 와 one-to-many 관계
> pragma table_info('todo');
cid  name   type          notnull  dflt_value  pk
---  -------  ------------  -------  ---------------------------  --
0    id       integer       1                                     1
1    name     varchar(200)  1                                     0
2    done     boolean       1        0                            0
3    created  varchar(20)   1        datetime('now','localtime')  0
4    updated  varchar(20)   1        datetime('now','localtime')  0

# TODO 와 many-to-one 관계
> pragma table_info('subtodo');
cid  name    type     notnull  dflt_value  pk
---  ------  -------  -------  ----------  --
0    id      integer  1                    1
1    grp_id  integer  1                    0
2    sub_id  integer  1                    0

> select * from todo where created > '2022-04-29';
id  name               done  created              updated
--  -----------------  ----  -------------------  -------------------
28  혈앵,눈건강,기억력 오메가3    0     2022-04-29 12:00:00  2022-04-29 12:00:00
30  뼈,신경,근육엔 칼슘마그네슘    0     2022-04-30 12:00:00  2022-04-30 12:00:00
38  hello new Todo 38  0     2022-05-04 01:18:44  2022-05-04 01:22:23

> select * from subtodo where grp_id=11;
id    sub_id  grp_id
----  ------  ------
1001  12      11
1002  13      11
1003  16      11
1004  17      11

> .quit
```

## GraphQL

[http://localhost:3000/graphql](http://localhost:3000/graphql) 에서 GraphQL 을 사용해 볼 수 있습니다.

### select

> 모든 Todo 조회

```js
# Query
query {
  todoAll {
  	id, name, done, created, updated, subtodos {
    	sub_id
	}
  }
}

# Result
{
  "data": {
    "todoAll": [
      {
        "id": 1,
        "name": "new Todo",
        "done": false,
        "created": "2022-05-10 23:42:20",
        "updated": "2022-05-10 23:42:20",
        "subtodos": []
      },
      {
        "id": 11,
        "name": "면도기 제품",
        "done": false,
        "created": "2022-04-04 12:00:00",
        "updated": "2022-04-11 12:00:00",
        "subtodos": [
          {
            "sub_id": 12
          },
          {
            "sub_id": 13
          },
          {
            "sub_id": 16
          },
          {
            "sub_id": 17
          }
        ]
      },
      {
          ...
      }
    ]
  }
}
```

> 특정 `id` 배열로 Todo 조회

```js
# Query
query {
    todos(ids: [12,13,14] ) {
        id, name, done, created, updated
    }
}

# Result
{
  "data": {
    "todos": [
      {
        "id": 12,
        "name": "리필면도날 4개입",
        "done": true,
        "created": "2022-04-05 12:00:00",
        "updated": "2022-05-10 23:29:59"
      },
      ...
    ]
  }
}
```

> 특정 `id` 로 Todo 조회

```js
# Query
query {
    todo(id:1) {
          name, done
    }
}

# Result
{
  "data": {
    "todo": {
      "name": "new Todo",
      "done": false
    }
  }
}
```

> 특정 `id` 로 하위 Todo 가 포함된 Todo Detail 조회

```js
# Query
query{
  todoDetail(id:11){
    id, name, done, arrtodos{
      id, name, done
    }
  }
}

# Result
{
  "data": {
    "todoDetail": {
      "id": 11,
      "name": "면도기 제품",
      "done": false,
      "arrtodos": [
        {
          "id": 12,
          "name": "리필면도날 4개입",
          "done": true
        },
        ...
      ]
    }
  }
}
```

> pagination (Offset-based)

- _cf._ 참고: [Offset-based vs Cursor-based Pagination](https://velog.io/@minsangk/%EC%BB%A4%EC%84%9C-%EA%B8%B0%EB%B0%98-%ED%8E%98%EC%9D%B4%EC%A7%80%EB%84%A4%EC%9D%B4%EC%85%98-Cursor-based-Pagination-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)

```js
# Query
query{
	searchTodo(data:{
    page: 1
  }){
    total, arrtodos{
      id
    }
  }
}

# Result
{
  "data": {
    "searchTodo": {
      "total": 8,
      "arrtodos": [
        {
          "id": 15
        },
        {
          "id": 16
        },
        {
          "id": 18
        }
      ]
    }
  }
}
```

> search : term, done, from_dt, to_dt

```js
# Query
query{
	searchTodo(data:{
    page: 0,
    done: true,
    term: "면도기",
    from_dt: "2022-04-06"
  }){
    total, arrtodos{
      id, done, name, created
    }
  }
}

# Result
{
  "data": {
    "searchTodo": {
      "total": 1,
      "arrtodos": [
        {
          "id": 13,
          "done": true,
          "name": "면도기 스타터세트",
          "created": "2022-04-06 12:00:00"
        }
      ]
    }
  }
}
```

### create, update, delete

> create (subtodo 처리 제외)

```js
# Mutaion
mutation {
  createTodo(data:{
    id: 2,
    name: "new Todo#2"
  }) {
    id, name, done, created
  }
}

# Result
{
  "data": {
    "createTodo": {
      "id": 2,
      "name": "new Todo#2",
      "done": false,
      "created": "2022-05-11 12:56:06"
    }
  }
}
```

> update (subtodo 처리 미완성)

```js
# Mutaion
mutation {
  updateTodo(data:{
    id: 2,
    done: true
  }) {
    id, name, done
  }
}

# Result
{
  "data": {
    "updateTodo": {
      "id": 2,
      "name": "new Todo#2",
      "done": true
    }
  }
}
```

> delete (subtodo 처리 미완성)

```js
# Mutaion
mutation {
  deleteTodo(id:2) {
    id
  }
}

# Result
{
  "data": {
    "deleteTodo": {
      "id": 2
    }
  }
}
```

## 시도하다가 안된 작업들

- Entity `Subtodo` 의 Primary Key로 (grp_id, sub_id) 를 사용하려 했는데 실패

  - 별도의 id 를 사용하면 중복 관리가 되지 않음
    - id 를 제거하고 (grp_id, sub_id)를 복합키로 지정하니 Join 동작에 문제가 생김
  - 수작업(로직)으로 처리

- DTO `TodoDto` 출력시 `subtodos` 를 `[Int]` 형식으로 변환해 출력하려 했는데 실패

  - 더 많은 스터디 필요

- Entity `Todo` 삭제시 `Subtodo` 에 대한 자동으로 Delete Cascade 처리가 안됨
  - 더 많은 스터디 필요

## Source

[[github]](https://github.com/maxmin93/wisely-todo-api)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
