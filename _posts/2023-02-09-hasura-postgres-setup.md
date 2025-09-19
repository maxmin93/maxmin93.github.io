---
date: 2023-02-09 00:00:00 +0900
title: Hasura 사용법 (GraphQL Engine)
description: 고성능 GraphQL 엔진인 Hasura 를 도커로 설치하고 PostgreSQL 15 를 설정하여 사용법을 공부합니다.
categories: [Backend, ORM]
tags: ["graphql","hasura","docker","postgres"]
image: "https://hasura.io/brand-assets/hasura-logo-primary-dark.svg"
---

## 1. Hasura

GraphQL 를 통해 앱/웹과 데이터를 주고 받을 수 있게 해주는 오픈소스 GraphQL API 엔진이다. 실시간 모니터링과 보안 기능도 제공한다. Hasura 를 이용하려면 도커를 통해 자체 호스팅을 하거나, Hasura Cloud 를 이용하면 된다.

![hasura graphql-engine](/2023/02/09-hasura-demo.gif){: width="600" .w-75}
_hasura graphql-engine demo_

### 1) 지원하는 데이터베이스

- Postgresql
- MS SQL
- Citus
- BigQuery
- MySQL

> MongoDB, MySQL, Oracle, Elastic, Snowflake 등은 지원 예정 [link](https://hasura.io/blog/hasura-graphql-data-connectors/)

## 2. Docker 설치

### 1) [hasura/graphql-engine](https://hub.docker.com/r/hasura/graphql-engine) Image

Docker 실행 후 [http://localhost:8080/console](http://localhost:8080/console) 콘솔에 접속한다.

> Host 에 설치된 postgres 를 사용할 경우, port 맵핑을 하지 않는다.

```console
# 도커 내부의 postgres 를 사용하는 경우
$ docker run -d -p 8080:8080 --name hasura  \
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://username:password@hostname:port/dbname \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
  hasura/graphql-engine:latest

# Host 에 설치된 postgres 를 사용하는 경우 (net=host 옵션)
$ docker run -d --net=host --name hasura \
  -e HASURA_GRAPHQL_DATABASE_URL=postgres://username:password@hostname:port/dbname \
  -e HASURA_GRAPHQL_ENABLE_CONSOLE=true \
  hasura/graphql-engine:latest  
```

### 2) Schema, Table 생성

상단 `DATA` 탭에서 왼쪽 패널의 `Databases > default` 선택

- Console 의 Create Table GUI 기능을 사용하거나
- SQL 창에서 직접 DDL 문을 작성할 수 있다.

#### Schema 생성

`default` 데이터베이스 화면의 `Create Schema` 버튼 클릭

- 대충 hasura 라고 적어보자

#### Table 생성

public 또는 생성한 schema 화면의 `Create Table` 버튼 클릭

- author 와 article 테이블을 생성해보자 [link](https://hasura.io/docs/latest/schema/postgres/tables/#pg-create-tables)
  + foreign-key 관계 설정

```sql
insert into hasura.author(name) values
('Tom',{"city":"Bengaluru","phone_numbers":[9090909090,8080808080]})
,('Jane',{"city":"Hongkong","phone_numbers":[9090909090,8080808080]})
,('Gilbert',{"city":"Sydney","phone_numbers":[9090909090,8080808080]})
,('Rary',{"city":"NewYork","phone_numbers":[9090909090,8080808080]})
,('Andie',{"city":"Istanbul","phone_numbers":[9090909090,8080808080]});

insert into hasura.articles (title, content, rating, author_id) values
('Tom article #1','Hasura automatically picks up any comments that might have been added to your tables and columns and adds them as GraphQL descriptions of the auto-generated types and fields.',1,1)
,('Janes article #2','These auto-generated fields will allow you to query and mutate data in our table.\nSee the query and mutation API references for the full specifications.',2,2)
,('Jane article #1','Hasura GraphQL Engine은 데이터베이스 이벤트를 웹훅 트리거로 제공하고 비즈니스로직을 위한 원격 스키마와 함께 Postgres를 통한 즉각적이고 실시간 GraphQL API 를 제공하는 초고속 GraphQL 서버입니다.',1,2)
,('Gilbert article #1','Hasura는 Postgres를 지원하는 GraphQL 앱을 만들거나 Postgres를 사용하는 기존 응용 프로그램을 GraphQL로 서서히 옮길수있게 제공합니다.\n자세한 내용은 hasura.io에서 읽어보거나 도큐먼트를 참고하세요.',1,3)
,('Rary article #1','강력한 쿼리를 만들기: 내장 필터링, pagination, 패턴 서칭, 대량 insert, update , delete 뮤테이션 지원\n실시간: subscription을 사용하여 GraphQL 쿼리를 라이브 쿼리로 변환 가능',1,4)
,('Andie article #1','원격 스키마 머지(병합): 비즈니스 로직을 잇는 단일 GraphQL 엔진 엔드포인트를 위한 커스텀 graphQL 스키마 액세스 가능 더 많은 정보는 여기로.\n웹훅 또는 서버리스 function 트리거: Postgres 에서 insert/update/delete 이벤트들을 지원 (더 많은 정보는 여기로)',1,5);
```

### 3) GraphQL

#### [Queries: Postgres](https://hasura.io/docs/latest/queries/postgres/index/)

> schema 와 table 은 '\_'로 연결되어 사용된다.

```graphql
{
  hasura_articles {
    id
    title
    author_id
  }
  hasura_articles_aggregate {
    aggregate {
      count
    }
  }
}

query {
  hasura_author_by_pk(id: 1) {
    id
    name
    address
    city: address(path: "$.city")
    phone: address(path: "$.phone_numbers.[0]")
  }
}
```

#### [Mutations: Postgres](https://hasura.io/docs/latest/mutations/postgres/index/)

```graphql
mutation insert_single_article {
  insert_hasura_articles_one(object: {
    title: "Hello, Hasura", 
    content: "GraphQL 변형은 서버의 데이터를 수정하는 데 사용됩니다(즉, 데이터 쓰기, 업데이트 또는 삭제). Hasura GraphQL 엔진은 Postgres 스키마 모델에서 GraphQL 스키마의 일부로 변형을 자동 생성합니다.", 
    rating: 4, 
    author_id: 5
  })
  {
    title
    content
    rating 
    author_id 
  }
}

# RESULT
{
  "data": {
    "insert_hasura_articles_one": {
      "title": "Hello, Hasura",
      "content": "GraphQL 변형은 서버의 데이터를 수정하는 데 사용됩니다(즉, 데이터 쓰기, 업데이트 또는 삭제). Hasura GraphQL 엔진은 Postgres 스키마 모델에서 GraphQL 스키마의 일부로 변형을 자동 생성합니다.",
      "rating": 4,
      "author_id": 5
    }
  }
}
```

파라미터와 함께 데이터를 변경할 수 있다.

```graphql
mutation($todo: String, $userId: String) {
  insert_todos(objects: [{
    title: $todo,
    user_id: $userId
  }]) {
    affected_rows
    returning {
      id
    }
  }
}

variables {
  "todo": "This is a test with variables.",
  "userId": "TestUser #1" 
}

# RESULT
{
  "data": {
    "insert_todos": {
      "affected_rows": 1,
      "returning": [
        {
          "id": 3
        }
      ]
    }
  }
}
```

#### [Subscription: Postgres](https://hasura.io/docs/latest/subscriptions/postgres/index/)

GraphQL 구독은 기본적으로 필드 값이 업스트림에서 변경될 때마다 클라이언트가 업데이트를 받는 쿼리입니다. 모든 종류의 쿼리에 대해 구독이 지원됩니다.

> 라이브

라이브 쿼리 구독은 수행 중인 쿼리의 최신 결과를 반환하며 반드시 결과로 이어지는 모든 개별 이벤트를 반환하지는 않습니다. 기본적으로 업데이트는 1초 마다 클라이언트에 전달됩니다 .

```graphql
subscription {
  messages(where: { group_id: 1 }, order_by: { created_at: asc }) {
    id
    sender
    receiver
    content
    created_at
    edited_at
  }
}
```

> 스트리밍
 
스트리밍 구독은 사용자가 입력한 커서에 따라 응답을 스트리밍합니다. 스트리밍 구독은 전체 결과 집합이 아니라 한 번에 개별 행을 전송한다는 점에서 라이브 쿼리와 다릅니다.

```graphql
subscription {
  messages_stream(where: { group_id: 1 }, cursor: { initial_value: { created_at: now } }, batch_size: 10) {
    id
    sender
    receiver
    content
    created_at
    edited_at
  }
}
```

## 3. JWT 인증

인증 관련해서 잘 설명된 문서를 찾지 못했다. 일단 내용만 대충 정리한다.

![hasura headers](https://graphql-engine-cdn.hasura.io/learn-hasura/assets/graphql-hasura-authentication/jwt-decoded.png){: width="560" .w-75}
_hasura headers_

### 1) 헤더 변수

- x-hasura-default-role
- x-hasura-allowed-roles
- x-hasura-user-id

### 2) [인증 공급자](https://hasura.io/learn/graphql/hasura-authentication/integrations/)

- SaaS : Auth0, Firebase, Cognito, Clerk
- 자체 호스팅 : SuperTokens, KeyCloak, Authorizer

### 3) [How to Integrate Auth0 with Hasura](https://hasura.io/learn/graphql/hasura-authentication/integrations/auth0/)

- hasura-app-url
- hasura-admin-secret

```js
function (user, context, callback) {
  const userId = user.user_id;
  const userName = user.name;
  
  const admin_secret = "<your-admin-secret>";
  const url = "<your-hasura-app-url>";
  const query = `mutation($userId: String!, $userName: String) {
    insert_users(objects: [{
      id: $userId, name: $userName, last_seen: "now()"
    }], on_conflict: {constraint: users_pkey, update_columns: [last_seen, name]}
    ) {
      affected_rows
    }
  }`;

  const variables = { userId, userName };

  request.post({
      url: url,
      headers: {'content-type' : 'application/json', 'x-hasura-admin-secret': admin_secret},
      body: JSON.stringify({
        query: query,
        variables: variables
      })
  }, function(error, response, body){
       console.log(body);
       callback(null, user, context);
  });
}
```

## 4. Datadog 모니터링

Datadog 은 클라우드 서비스이고, 데이터를 전송하기 위해 datadog-agent 를 호스트에 설치하여야 한다.

```sql
# datadog 계정 생성
create user datadog with password '<PASSWORD>';
grant SELECT ON pg_stat_database to datadog;
GRANT pg_monitor TO datadog;

# 모든 데이터베이스에 대해서
CREATE SCHEMA datadog;
GRANT USAGE ON SCHEMA datadog TO datadog;
GRANT USAGE ON SCHEMA public TO datadog;
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

# explain_statement 함수
CREATE OR REPLACE FUNCTION datadog.explain_statement(
   l_query TEXT,
   OUT explain JSON
)
RETURNS SETOF JSON AS
$$
DECLARE
curs REFCURSOR;
plan JSON;

BEGIN
   OPEN curs FOR EXECUTE pg_catalog.concat('EXPLAIN (FORMAT JSON) ', l_query);
   FETCH curs INTO plan;
   CLOSE curs;
   RETURN QUERY SELECT plan;
END;
$$
LANGUAGE 'plpgsql'
RETURNS NULL ON NULL INPUT
SECURITY DEFINER;
```

> Datadog 권한 확인

```console
$ psql -h localhost -U datadog postgres -A -c \ "select * from pg_stat_database LIMIT(1);" && echo -e "\e[0;32mPostgres connection - OK\e[0m" || \ || echo -e "\e[0;31mCannot connect to Postgres\e[0m"
datadog 사용자의 암호: 
datid|datname|numbackends|xact_commit|xact_rollback|blks_read|blks_hit|tup_returned|tup_fetched|tup_inserted|tup_updated|tup_deleted|conflicts|temp_files|temp_bytes|deadlocks|checksum_failures|checksum_last_failure|blk_read_time|blk_write_time|session_time|active_time|idle_in_transaction_time|sessions|sessions_abandoned|sessions_fatal|sessions_killed|stats_reset
0||0|15869|17|182|315648|141506|73025|78|8|0|0|0|0|0|||0|0|12395337375114.434|0|0|0|0|0|0|
(1개 행)
Postgres connection - OK
```

Datadog 은 일단 나중에 필요하면 설치하도록 하자. 일단은 여기서 중단.

## 9. Review

- 구독과 스트리밍은 사용 안해봐서 잘 모르겠다.
  + 구독은 데이터를 1초마다 계속 push 한다는 것인지
  + 스트리밍은 특정 조건에 대해 변경사항을 트리거로 전달한다는 것인지
  + 채팅 앱도 만들수 있는거 같다.
- 음, 이정도의 사용성이라면 서비스에 사용해도 충분하다.
- [REST 로 사용](https://hasura.io/learn/graphql/intro-graphql/graphql-vs-rest/)해도 되지만, [gRPC 와 결합](https://hasura.io/learn/graphql/intro-graphql/graphql-vs-grpc/)하면 정말 강력할 듯
- 뭔가 샘플 프로그램을 살펴봐야 실사용법을 알 수 있을듯
  + [svelte-apollo tutorial](https://hasura.io/learn/graphql/svelte-apollo/introduction/)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }