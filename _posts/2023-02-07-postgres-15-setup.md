---
date: 2023-02-07 00:00:00 +0900
title: PostgreSQL 15 설정 (Ubuntu)
description: 만능 데이터베이스인 PostgreSQL 15 설정의 작업 과정을 기록합니다.
categories: [Backend, Database]
tags: [postgresql, install]
image: "https://blog.kakaocdn.net/dna/bOpOMb/btsxgWrvpuz/AAAAAAAAAAAAAAAAAAAAAOvbNqxQwacoD5CgsZMjG0d8RIqrf0tIggEgL4_3CFeh/img.png?credential=yqXZFxpELC7KVnFOS48ylbz2pIh7yKj8&expires=1759244399&allow_ip=&allow_referer=&signature=p6CTgTsKbUuBHYFfn8IgXvtMjGc%3D"
---

## 1. PostgreSQL 15

### 1) 특이사항

### 3) 참고자료

- [How to Install PostgreSQL 15 on Ubuntu 22.04 Step-by-Step](https://www.linuxtechi.com/how-to-install-postgresql-on-ubuntu/)
- [Creating user, database and adding access on PostgreSQL](https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e)

## 2. 우분투에 설치하기

### 1) 리포지토리 등록 및 APT 설치

설치 로그에 PG_HOME 과 PG_DATA 위치가 나온다. 기록해두자.

```console
$ sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
$ wget -qO- https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo tee /etc/apt/trusted.gpg.d/pgdg.asc &>/dev/null

$ sudo apt update
$ sudo apt install postgresql postgresql-client -y

$ sudo systemctl status postgresql
$ psql --version
```

> 콘솔창을 열 때마다 서비스 상태를 출력하도록 하자. (`.zshrc`)

```console
echo ""
systemctl list-units --state=running --no-pager | grep -E 'docker|postgres' | grep -E '.+\.service' | awk '{print $1"\t"$2,$3,$4}' | sort -nk1
```

차후 관리를 위해 (잊어먹을 수 있으니) 환경변수에 등록한다.

- PG_HOME `/usr/lib/postgresql/15`
- PG_DATA `/var/lib/postgresql/15/main`

> 계정 보호를 위해 postgres 암호를 변경한다. (데이터 랜섬웨어)

```console
$ sudo -u postgres psql
postgres=#

postgres=# ALTER USER postgres PASSWORD 'demoPassword';
postgres=# \q
```

### 2) postgres.conf 및 pg_hba.conf 설정

> PG_DATA 위치에 있을줄 알았는데 없다. (당황)

postgresql config 파일 위치 찾는 법 [(stackoverflow)](https://stackoverflow.com/a/3603162/6811653)

- 우분투에 postgres 계정이 생성되어 있다.
- 소유권이 postgres 에게 있기 때문에 `sudo -u postgres` 를 사용하자.

```console
$ sudo -u postgres psql -c 'SHOW config_file'
               config_file               
-----------------------------------------
 /etc/postgresql/15/main/postgresql.conf

$ sudo -u postgres vi /etc/postgresql/15/main/postgresql.conf
# 추가
# listen_addresses = '*'

$ sudo -u postgres vi /etc/postgresql/15/main/pg_hba.conf
# 변경
# IPv4 local connection:
# host all all 192.168.0.0/24 scram-sha-256

# 방화벽
$ sudo ufw allow 5432/tcp
$ sudo ufw status numbered

# 재시작
$ sudo systemctl restart postgresql
$ sudo systemctl status postgresql

# 패스워드 접속 테스트
$ psql -h 192.168.0.x -U postgres
```

### 3) 사용자 및 데이터베이스 생성

```console
$ sudo -u postgres createuser <username> --createdb --no-superuser --no-createrole
$ sudo -u postgres createdb <dbname> --owner <username> --encoding='utf-8' --locale=en_US.utf-8 --template=template0

$ sudo -u postgres psql
psql=# ALTER USER `username` WITH ENCRYPTED PASSWORD 'p@ssw0rd';
psql=# GRANT ALL PRIVILEGES ON DATABASE `dbname` TO `username`;
```

> `template1` 대신 `template0` 을 복사하는 일반적인 다른 이유는, template1 의 복사는 동일한 설정을 사용해야 하지만 template0 을 복사하는 경우에는 새 인코딩 및 로케일(locale) 설정을 지정할 수 있기 때문이다. template1 은 인코딩 또는 로케일(locale)에 관한 데이터를 포함하지만 template0 은 그렇지 않다.

```sql
-- 로그인 계정 생성 (상속 금지, 로그인)
CREATE USER `username`
  NOINHERIT LOGIN 
  WITH ENCRYPTED PASSWORD 'p@ssw0rd';

-- 데이터베이스 생성 (template0)
CREATE DATABASE `dbname`
  WITH OWNER `username`
  ENCODING 'utf-8' 
  LC_COLLATE = 'C.utf8'
  LC_CTYPE = 'C.utf8'
  TEMPLATE template0
  IS_TEMPLATE = False;

-- 데이터베이스 접속을 포함한 모든 권한 제거 (dbo 는 가능)
--   + PUBLIC(대문자) : 모든 사용자
--   + public 스키마에 대한 PUBLIC 사용자 권한도 없어진다.
REVOKE ALL ON DATABASE `dbname` FROM PUBLIC;

/*
-- public 스키마 접근 권한 제거 (dbo 는 가능)
--   + PUBLIC(대문자) : 모든 사용자
REVOKE ALL PRIVILEGES ON SCHEMA public FROM PUBLIC;
*/
```

### 4) Python 테스트 (psycopg3)

#### pyenv 및 poetry 업그레이드

```console
# 설치 가능한 3.x 버전들
$ pyenv install -l | grep -e '^\s*3\.'

# 3.10 최신 버전 설치
$ pyenv install 3.10 
$ pyenv global 3.10

# pip 및 pipx 업그레이드
$ pip install --upgrade pip
$ python -m pip install --user -U pipx

# poetry 업그레이드 (최신 1.3.2)
# pipx upgrade poetry
# poetry --version
```

#### 프로젝트 생성 및 psycopg3 설치

```console
$ poetry new hello-pg --name app
$ cd hello-pg
# 또는
$ poetry init --name app --python=3.10 -q

$ poetry env use 3.10
$ poetry install
$ poetry env info

$ poetry add psycopg
```

#### [테스트 Python 코드](https://www.psycopg.org/psycopg3/docs/basic/usage.html#main-objects-in-psycopg-3)

`app/main.py` 파일 생성 후 코드 작성

```python
# Note: the module name is psycopg, not psycopg3
import psycopg

# Connect to an existing database
with psycopg.connect("host=HOST dbname=DB user=USER password=PASSWORD") as conn:

    # Open a cursor to perform database operations
    with conn.cursor() as cur:

        # Execute a command: this creates a new table
        cur.execute("""
            CREATE TABLE if not exists test (
                id serial PRIMARY KEY,
                num integer,
                data text)
            """)

        # Pass data to fill a query placeholders and let Psycopg perform
        # the correct conversion (no SQL injections!)
        cur.execute(
            "INSERT INTO test (num, data) VALUES (%s, %s)",
            (100, "abc'def"))

        # Query the database and obtain data as Python objects.
        cur.execute("SELECT * FROM test")
        cur.fetchone()
        # will return (1, 100, "abc'def")

        # You can use `cur.fetchmany()`, `cur.fetchall()` to return a list
        # of several records, or even iterate on the cursor
        for record in cur:
            print(record)

        # Make the changes to the database persistent
        conn.commit()
```
{: file="app/main.py"}

> 실행 및 확인

```console
$ poetry shell
$ python app/main.py
(1, 100, "abc'def")

$ psql -h HOST -U USER -d DB -c "select * from test" -W
암호: 
 id | num |  data   
----+-----+---------
  1 | 100 | abc'def
(1개 행)
```

## 3. PostgREST Server 설치

### 1) [PostgREST](https://postgrest.org/en/stable/tutorials/tut0.html) v10.1.2

1. PostgREST 리눅스 바이너리 [다운로드](https://github.com/PostgREST/postgrest/releases) 
2. 압축해제 => postgrest 실행 파일
3. /usr/local/bin 에 link 등록

```console
$ wget https://github.com/PostgREST/postgrest/releases/download/v10.1.2/postgrest-v10.1.2-linux-static-x64.tar.xz
$ tar xJf postgrest-v10.1.2-linux-static-x64.tar.xz
$ sudo ln -s $HOME/Servers/postgrest /usr/local/bin/postgrest
```

### 2) PostgREST Tutorial &#9839;0

1. tutorial 데이터베이스 생성
2. api 스키마 생성
  + api.todos 테이블 생성 및 샘플 데이터 저장
3. web_anon 역활 생성 (nologin)
  + api 스키마에 대한 사용과 api.todos 테이블에 대한 select 권한 부여
4. authenticator 역활 생성 (로그인 패스워드)
  + web_anon 권한을 authenticator 에 부여
5. tutorial.conf 파일 생성
6. postgrest 실행
7. REST API 에 대해 GET 조회
  + POST 는 권한 없음

```console
$ sudo -u postgres createdb tutorial --encoding='utf-8' --locale=en_US.utf-8 --template=template0

$ sudo -u postgres psql -d tutorial
psql=# create schema api;
psql=# create table api.todos (
  id serial primary key,
  done boolean not null default false,
  task text not null,
  due timestamptz
);
psql=# insert into api.todos (task) values
  ('finish tutorial 0'), ('pat self on back');

    -- 권한 설정용 계정 생성
psql=# create role web_anon nologin;
psql=# grant usage on schema api to web_anon;
psql=# grant select on api.todos to web_anon;

    -- 로그인 전용 계정 생성
psql=# create role authenticator noinherit login with password 'p@ssw0rd';
    -- 데이터베이스 connect 권한 부여 (REVOKE ALL 데이터베이스 한 경우)
psql=# GRANT CONNECT ON DATABASE tutorial TO authenticator;

    -- 권한 상속: web_anon => authenticator
psql=# grant web_anon to authenticator;

psql=# \q

$ cat <<EOF > tutorial.conf
db-uri = "postgres://authenticator:mysecretpassword@localhost:5432/postgres"
db-schemas = "api"
db-anon-role = "web_anon"
EOF

$ ./postgrest tutorial.conf
08/Feb/2023:15:53:02 +0900: Attempting to connect to the database...
08/Feb/2023:15:53:02 +0900: Connection successful
08/Feb/2023:15:53:02 +0900: Listening on port 3000
08/Feb/2023:15:53:02 +0900: Config reloaded
08/Feb/2023:15:53:02 +0900: Listening for notifications on the pgrst channel
08/Feb/2023:15:53:02 +0900: Schema cache loaded

$ curl http://localhost:3000/todos
[{"id":1,"done":false,"task":"finish tutorial 0","due":null}, 
 {"id":2,"done":false,"task":"pat self on back","due":null}]% 

$ curl http://localhost:3000/todos -X POST \
     -H "Content-Type: application/json" \
     -d '{"task": "do bad thing"}'  
{"code":"42501","details":null,"hint":null,"message":"todos 테이블에 대한 접근 권한 없음"}%      
```

### 3) PostgREST Tutorial &#9839;1

1. todo_user 역활 생성 (nologin)
  + api 스키마에 대한 사용 권한 부여
  + api.todos 테이블에 대한 모든 권한 부여
  + api.todos_id_seq 시퀀스에 대한 사용과 select 권한 부여
2. todo_user 권한을 authenticator 에 부여

```sql
-- 권한 설정용 role 생성
create role todo_user nologin;
grant usage on schema api to todo_user;
grant all on api.todos to todo_user;
grant usage, select on sequence api.todos_id_seq to todo_user;

-- 로그인 계정에 권한 상속 (todo_user => authenticator)
grant todo_user to authenticator;

-- role 사용시 `set role todo_user;` 필요
```

3. 길이 32바이트의 랜덤 문자열 생성 (JWT 암호로 사용)
4. tutorial.conf 에 jwt-secret 값으로 랜덤 문자열 설정
5. postgrest 재시작
6. [jwt.io](https://jwt.io/) 사이트에서 수동으로 token 생성
  + payload 에 암호화 대상 데이터를 작성 
  + verify signature 의 secret 위치에 JWT 암호 설정
  + (왼쪽 텍스트박스) 생성된 token 을 복사
7. PG_REST_TOKEN 값을 환경 변수로 설정
8. POST 데이터 생성 테스트
  + GET 데이터 조회 OK!

```console
$ ./postgrest tutorial.conf

# Allow "tr" to process non-utf8 byte sequences
$ export LC_CTYPE=C

# read random bytes and keep only alphanumerics
$ < /dev/urandom tr -dc A-Za-z0-9 | head -c32

$ vi tutorial.conf
# 추가
jwt-secret = "<the password you made>"

$ export PG_REST_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidG9kb191c2VyIn0.k-p_9S-fAbmGT1WXjPmgySvBtjpYJSGoD48tDzzdN-0

$ curl http://localhost:3000/todos -X POST \
     -H "Authorization: Bearer $PG_REST_TOKEN"   \
     -H "Content-Type: application/json" \
     -d '{"task": "learn how to auth"}'

$ curl http://localhost:3000/todos
[{"id":1,"done":false,"task":"finish tutorial 0","due":null}, 
 {"id":2,"done":false,"task":"pat self on back","due":null}, 
 {"id":3,"done":false,"task":"learn how to auth","due":null}]%      
```

9. 폐기시간 exp 을 추가하여 JWT 토큰을 재생성 한다.
  + [jwt.io](https://jwt.io/) Payload 에 exp 를 추가
10. API GET 조회 실행
  + 5분 이후에 실행하면 HTTP 401 Unauthorized 오류 반환
  + `JWT expired` 메시지를 받게된다.

```console
$ sudo -u postgres psql -c "select extract(epoch from now() + '5 minutes'::interval) :: integer;" 
[sudo] bgmin 암호: 
  extract   
------------
 1675845577
(1개 행)

$ export PG_REST_TOKEN_EXP=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidG9kb191c2VyIiwiZXhwIjoxNjc1ODQ1NTc3fQ.mY7hUreGZ3MstxdCrjY7EWh4yuTaeCJisM_bXcN1qSc

$ curl http://localhost:3000/todos \
     -H "Authorization: Bearer $PG_REST_TOKEN_EXP"
[{"id":1,"done":false,"task":"finish tutorial 0","due":null}, 
 {"id":2,"done":false,"task":"pat self on back","due":null}, 
 {"id":3,"done":false,"task":"learn how to auth","due":null}]%      
```

11. auth 스키마를 만들고, web_anon 과 todo_user 에게 사용 권한 부여
12. auth.check_token() 함수 생성
  + email 값이 `disgruntled@mycompany.com` 이면 예외 발생  

```sql
create schema auth;
grant usage on schema auth to web_anon, todo_user;

create or replace function auth.check_token() returns void
  language plpgsql
  as $$
begin
  if current_setting('request.jwt.claims', true)::json->>'email' =
     'disgruntled@mycompany.com' then
    raise insufficient_privilege
      using hint = '아니, 우리는 당신에게 있습니다';
  end if;
end
$$;
```

13. conf 에 db-pre-request 항목을 추가하고 postgrest 재시작
14. email 항목이 추가된 JWT 토큰을 재생성
15. email 항목을 담은 토큰으로 API PATCH 실행
  + 예외 메시지(hint) 출력
  + 다른 기능은 잘 작동함 : 폐기 토큰, PATCH 반영

```console
$ vi tutorial.conf 
# 추가
db-pre-request = "auth.check_token"

$ ./postgrest tutorial.conf 

$ export PG_REST_TOKEN_EMAIL=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoidG9kb191c2VyIiwiZW1haWwiOiJkaXNncnVudGxlZEBteWNvbXBhbnkuY29tIn0.MaTNsYqXo77uww4R7ZL5AmQ0SVgDj6heWWkedgSEcFo

$ curl http://localhost:3000/todos -X PATCH \
     -H "Authorization: Bearer $PG_REST_TOKEN_EXP"    \
     -H "Content-Type: application/json"  \
     -d '{"done": true}'
{"code":"PGRST301","details":null,"hint":null,"message":"JWT expired"}%

$ curl http://localhost:3000/todos -X PATCH      \
     -H "Authorization: Bearer $PG_REST_TOKEN_EMAIL" \
     -H "Content-Type: application/json"       \
     -d '{"task": "AAAHHHH!", "done": false}'
{"code":"42501","details":null,"hint":"아니, 우리는 당신에게 있습니다","message":"insufficient_privilege"}% 

$ curl http://localhost:3000/todos -X PATCH \
     -H "Authorization: Bearer $PG_REST_TOKEN"    \
     -H "Content-Type: application/json"  \
     -d '{"done": true}'

$ curl http://localhost:3000/todos \
     -H "Authorization: Bearer $PG_REST_TOKEN"
[{"id":1,"done":true,"task":"finish tutorial 0","due":null}, 
 {"id":2,"done":true,"task":"pat self on back","due":null}, 
 {"id":3,"done":true,"task":"learn how to auth","due":null}]%  
```

## 9. Review

- GraphQL 서버 설치까지 하려다 분량이 많아 다음 포스트로 넘긴다.
  + Hasura 서버를 사용할 계획이다.
- PostgREST 서버 튜토리얼에서 JWT 토큰 사용법에 대해 배웠다.
  + image 데이터도 전송할 수 있더라.
  + auth 기능을 이용하면 데이터 보안도 가성비 좋게 구축할 수 있다.
- PostgREST 서버 성능에 대해 알 수가 없어 서비스로 사용해도 될지 모르겠다.

#### `set role <config_role>;` 안해도 기본 적용시키는 환경변수 설정하기

- `alter role` 을 이용하여 자동으로 적용할 환경변수들을 설정한다
- 특정 데이터베이스에서 적용되도록 `in database` 구절을 사용하자

```sql
-- 기본 role 을 config_role 이 되도록 설정
ALTER ROLE `username` IN DATABASE `dbname` SET ROLE='<config_role>';

-- 설정 해제
ALTER ROLE `username` RESET ALL;
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
