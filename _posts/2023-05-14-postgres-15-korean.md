---
date: 2023-05-14 00:00:00 +0900
title: PostgreSQL 15 한글 검색 설정
description: Postgresql 에서 한글 검색을 위한 encode, collate, ctype 설정 및 gin 인덱스 설정에 대해 알아보자.
categories: [Backend, Database]
tags: [postgresql, mecab-ko, utf8, gin-indexing]
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLSQWTSCw2fR8lSdWXYWX3ht88kYXYV-oMYw&s"
---

## 1. PostgreSQL DB 실험 환경 설정

### 1) 테이블스페이스 생성 (옵션)

외장 SSD 드라이브를 설치하고, 테이블스페이스를 생성하여 사용함

- 슈퍼유저로 테이블스페이스 생성

```shell
# 슈퍼 유저만 생성 가능
$ sudo -u postgres psql -d postgres

> CREATE TABLESPACE tutorial_ts
  OWNER tonyne
  LOCATION '/mnt/ssd2t/pg_data/tutorial_ts';
```

### 2) collate 별 데이터베이스 생성

비교 대상은 `C.utf8`, `en_US.utf8`, `ko_KR.utf8` 코드셋이다.

- Debian, Ubuntu 계열은 collate, ctype 에 `.utf8` 을 넣어서 설정할 수 있음

#### 사용 가능한 collation 리스트

```sql
-- 사용 가능한 collation 리스트
SELECT collname FROM pg_collation where collname like 'ko%';
   collname
--------------
 ko-KP-x-icu
 ko-KR-x-icu
 ko-x-icu
 ko_KR
 ko_KR.utf8
 kok-IN-x-icu
 kok-x-icu
(7개 행)
```

#### 데이터베이스 생성

```sql
-- en_US.utf8 문자셋 환경 (libc)
CREATE DATABASE testdb_en
  WITH
    TABLESPACE tutorial_ts
    OWNER = tonyne
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf'
    TEMPLATE template0
    IS_TEMPLATE = False;

-- 문자셋에 상관없이 글자 단위 정렬 (libc)
CREATE DATABASE testdb_c
  WITH
    TABLESPACE tutorial_ts
    OWNER = tonyne
    ENCODING = 'UTF8'
    LC_COLLATE = 'C.utf8'
    LC_CTYPE = 'C.utf8'
    TEMPLATE template0
    IS_TEMPLATE = False;

-- ko_KR.utf8 문자셋 환경 (libc)
CREATE DATABASE testdb_ko
  WITH
    TABLESPACE tutorial_ts
    OWNER = tonyne
    ENCODING = 'UTF8'
    LC_COLLATE = 'ko_KR.utf8'
    LC_CTYPE = 'ko_KR.utf8'
    TEMPLATE template0
    IS_TEMPLATE = False;

-- ko_KR.utf8 문자셋 환경 (ICU)
CREATE DATABASE testdb_icu
  WITH
    TABLESPACE tutorial_ts
    OWNER = tonyne
    LOCALE_PROVIDER icu
    ICU_LOCALE "ko-KR"
    LOCALE "ko_KR.utf8"
    TEMPLATE template0
    IS_TEMPLATE = False;
```

```shell
$ psql -U tonyne -d postgres

-- 데이터베이스 조회
> \l
이름       | 소유주 | 인코딩 | Collate     | CType       | 로케일 제공자 |
-----------+--------+--------+-------------+-------------+---------------+
testdb_c   | tonyne | UTF8   | C.UTF-8     | C.UTF-8     | libc          |
testdb_en  | tonyne | UTF8   | en_US.UTF-8 | en_US.UTF-8 | libc          |
testdb_ko  | tonyne | UTF8   | ko_KR.UTF-8 | ko_KR.UTF-8 | libc          |
testdb_icu | tonyne | UTF8   | ko_KR.utf8  | ko_KR.utf8  | icu (ko-KR)   |
```

### 3) COPY: CSV 임포트

한글 텍스트 데이터를 세개의 데이터베이스에 동일하게 임포트 한다.

- tmp 스키마 생성 (스키마별로 권한 부여 가능)
- tbl_test 테이블 생성 (스키마 생성문장에 결합할 수 있음)
- korean.csv 데이터 임포트
  + 일반 사용자가 copy 명령을 사용하려면 psql 의 `\copy` 를 이용해야 함

```shell
$ psql -U tonyne -d testdb_c
> CREATE SCHEMA IF NOT EXISTS tmp 
    AUTHORIZATION tonyne
    CREATE TABLE tbl_test (
      section text,
      content text NOT NULL,
    );

> \copy tmp.tbl_test FROM 'C:\sampledb\korean.csv' DELIMITER ',' CSV;
COPY 7180
```

#### COPY: CSV 익스포트

```shell
$ psql -U tonyne -d testdb_c
\copy (SELECT * FROM persons) to 'C:\tmp\persons_client.csv' with csv

\copy persons (first_name, last_name, email) 
to 'C:\tmp\persons_partial_db.csv' DELIMITER ',' CSV HEADER;
```

## 2. 한글 정렬 및 검색

postgresql 의 정렬 기능은 `libc` 가 제공한다. libc 는 LC_COLLATE 설정에 따라 정렬 규칙을 적용하며, 이것은 order by 부터 비교 연산자 등에 영향을 미치기 때문에 SQL 성능에도 영향을 미치게 된다.

- 인코딩은 문자를 바이트로 변환하는 알고리즘
- 문자셋은 locale 을 의미 (한국은 ko_KR, 미국은 en_US) : 언어와 국가
- collate 는 libc 에 의한 문자열 비교 방법을 결정
- ICU 는 LC_COLLATE 에 의한 정렬 규칙 제한을 완화시키기 위해 탑재된 국가별 언어 지원용 libc 규칙셋을 의미한다. (pg10 부터 제공)
  + pg16 부터 ICU 가 기본 로케일로 사용될 예정

> 참고

- [PostgreSQL: difference between collations 'C' and 'C.UTF-8'](https://dba.stackexchange.com/questions/240930/postgresql-difference-between-collations-c-and-c-utf-8)
- [Postgres - Encoding, Collation and CType](https://dba.stackexchange.com/a/211588)

### 1) 'ko_KR' 와 'ko_KR.UTF-8' 의 차이점

- 인코딩은 데이터가 저장되는 방법이고, 언어의 표현 방식과는 관련이 없음
- 특정 언어의 문자셋을 locale 이라 하는데
  + `LC_COLLATE` 은 정렬 규칙을, `LC_CTYPE` 은 대소문자 규칙을 제공
  + `LC_COLLATE=C` 는 인코딩과 관계없이 적용할 수 있는 단순한 규칙을 제공
    * 단순한 만큼 비교 연산자, 패턴 매칭 연산자 등의 성능이 빠르다

> utf8 에 의해 다루어지는 문자셋이 확장되기 때문에, `C` 와 `C.utf8` 은 libc 의 정렬 규칙 측면에서 조금 다르다.

한글의 경우, 

- `ko_KR` 은 locale 이고,
- 데이터는 euc-kr, utf8 등으로 표현할 수 있다. (2바이트 vs 3바이트)
- (영어와 달리 대소문자가 없어서) LC_CTYPE 은 의미가 없다.
- `utf8` 인코딩은 한글을 `가~힣` 순으로 정렬하고 있어서, C 로케일을 사용해도 동일한 정렬 효과를 가지게 된다.

> utf8 인코딩을 사용하는 경우, `ko_KR` 이나 `ko_KR.utf8` 이나 같은 말이다.

### 2) collate 별 한글 정렬 비교

```sql
-- 레코드 7180개
select count(*) as cnt from tmp.tbl_test;

-- content 정렬 
select content from tmp.tbl_test order by content limit 5;

-- content 매칭 후 정렬
select content from tmp.tbl_test where content like '%한글%' order by content limit 5;

-- 실행시간 측정
explain (analyze) select content from tmp.tbl_test where content like '%한글%' order by content limit 5;
```

| collate | 한글 정렬 | 한글 매칭 | 실행 시간 |
| :------ | :-------- | :-------- | --------: |
| en_US.UTF-8 | __안됨__ | 잘됨 | 19.964 ms |
| C.UTF-8 | 잘됨 | 잘됨 | 9.525 ms |
| ko_KR.UTF-8 | 잘됨 | 잘됨 | 10.276 ms |
| ko_KR (ICU) | 잘됨 | 잘됨 | 9.785 ms |

#### 결론

- 한글 검색과 정렬을 위해서 collate 는 C 또는 ko_KR 을 사용해야 한다!
  + en_US 는 정렬도 안되고, 한글 검색시 느리다. (부적합)
- `C` 가 가장 빠르지만, `ko_KR (ICU)` 도 버금가게 빠르다. 
  + 아마도 최신 버전의 정렬 최적화가 적용된 탓이 아닐까 싶다.

### 3) 한글 인덱싱 비교 : 인덱스 사용 여부와 실행 시간

```sql
drop index if exists tmp.ix_tbl_test_content;

-- content 필드에 인덱스 생성
create index ix_tbl_test_content on tmp.tbl_test(content) tablespace tutorial_ts;

-- 문자열 매칭 : 중간
explain (analyze) select content from tmp.tbl_test where content like '%한글%';
-- 문자열 매칭 : 머리
explain (analyze) select content from tmp.tbl_test where content like '한글%';
-- 문자열 매칭 : 꼬리
explain (analyze) select content from tmp.tbl_test where content like '%한글';
```

| collate | 중간 매칭 | 머리 매칭 | 꼬리 매칭 |
| :------ | --------: | --------: | --------: |
| en_US.UTF-8 | seq-scan 10.521 ms | seq-scan 3.025 ms | seq-scan 10.508 ms |
| C.UTF-8 | seq-scan 9.675 ms | seq-scan 3.022 ms | seq-scan 9.740 ms |
| ko_KR.UTF-8 | seq-scan 9.178 ms | seq-scan 2.871 ms | seq-scan 9.740 ms |
| ko_KR (ICU) | seq-scan 9.556 ms | seq-scan 3.236 ms | seq-scan 9.687 ms |

#### 결론

- 모두 인덱스를 타지 못했음
- `ko_KR.UTF-8` 이 가장 빠른 seq-scan (풀스캔) 성능을 보여주었다는 정도뿐
  + 매칭을 위한 문자셋이 가장 작고, locale 에 최적화 된 탓인듯

> 한글 검색을 위해서 다른 인덱싱 방법이 필요하다.

## 3. full-text search 기반의 gin 인덱싱

### 1) gin 인덱스 생성

trigram 은 모든 토큰을 세글자 단위로 잘라서 색인한다.

```sql
-- 모듈 설치
> CREATE EXTENSION pg_trgm;

> select show_trgm('hello');
            show_trgm
---------------------------------
 {"  h"," he",ell,hel,llo,"lo "}
(1개 행)

-- 인덱스 생성
drop index if exists tmp.ix_tbl_test_content;
create index ix_tbl_test_content on tmp.tbl_test USING gin (content gin_trgm_ops) tablespace tutorial_ts;
```

### 2) gin 인덱스 검색 (trigram)

`3글자 이상` 에서는 Bitmap index-scan 으로 매칭되지만 2글자 이하는 안됨!

```sql
-- 문자열 매칭 : 중간 (3글자) : Index-scan
explain (analyze) select content from tmp.tbl_test where content like '%테스트%';

-- 문자열 매칭 : 중간 (2글자) : Seq-scan
explain (analyze) select content from tmp.tbl_test where content like '%테스%';
-- 문자열 매칭 : 머리
explain (analyze) select content from tmp.tbl_test where content like '테스%';
-- 문자열 매칭 : 꼬리
explain (analyze) select content from tmp.tbl_test where content like '%스트';
```

| collate | 중간 매칭 | 머리 매칭 | 꼬리 매칭 |
| :------ | --------: | --------: | --------: |
| en_US.UTF-8 | seq-scan 11.827 ms | index-scan 0.913 ms | index-scan 0.474 ms |
| C.UTF-8 | seq-scan 11.807 ms | index-scan 0.916 ms | index-scan 0.484 ms |
| ko_KR.UTF-8 | seq-scan 10.519 ms | index-scan 0.544 ms | index-scan 0.374 ms |
| ko_KR (ICU) | seq-scan 10.958 ms | index-scan 0.907 ms | index-scan 0.480 ms |

#### 결론

- 3글자부터 인덱싱을 사용하므로, 그 이하에서는 머리 또는 꼬리 매칭만 이용해야 함
- 같은 gin 인덱스를 사용하지만, `ko_KR.UTF-8` 문자셋 이용시 더 효과적임
  + 문자셋 크기가 상대적으로 작아서 그런듯 (libc 와 ICU 차이??)

## 4. mecab-ko 이용한 full-text search

### 1) [textsearch_ko](https://github.com/i0seph/textsearch_ko) 설치

참고 

- [은전한닢 형태소 분석기와 full-text-search 모듈 연동](https://corekms.tistory.com/entry/%EC%9D%80%EC%A0%84%ED%95%9C%EB%8B%A2-%ED%98%95%ED%83%9C%EC%86%8C-%EB%B6%84%EC%84%9D%EA%B8%B0%EC%99%80-fulltextsearch-%EB%AA%A8%EB%93%88-%EC%97%B0%EB%8F%99)
- [Ubuntu Postgresql에 한글 full text search 적용하기](https://velog.io/@shj5508/Ubuntu-Postgresql%EC%97%90-%ED%95%9C%EA%B8%80-full-text-search-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)
- [When to use PostgreSQL Full Text Search and Trigram Indexes](https://medium.com/@sukorenomw/when-to-use-postgresql-full-text-search-and-trigram-indexes-4c7c36223421)

```shell
$ git clone https://github.com/i0seph/textsearch_ko.git
$ cd textsearch_ko

# 컴파일 오류 발생시
$ make USE_PGXS=1
ts_mecab_ko.c:10:10: fatal error: postgres.h: 그런 파일이나 디렉터리가 없습니다

# 알맞는 postgresql-server-dev-{version} 설치
$ sudo apt install postgresql-server-dev-15

$ make USE_PGXS=1
$ sudo make USE_PGXS=1 install

# textsearch_ko 설치 (사용할 DB 마다 등록)
$ sudo -u postgres psql -d testdb
> \i ts_mecab_ko.sql
create function
create text search parser
create text search template
create text search dictionary
create text search configuration
commit ...

-- text search config 조회
> \dF korean
                텍스트 검색 구성 목록
 스키마 |  이름  |               설명
--------+--------+-----------------------------------
 public | korean | configuration for korean language
(1개 행)
```

#### 설치 확인

```sql
> select * from mecabko_analyze('아버지가방에들어가신다');
  word  | type | part1st | partlast | pronounce | detail | lucene
--------+------+---------+----------+-----------+--------+--------
 아버지 | NNG  |         | F        | 아버지    |        | 아버지
 가     | JKS  |         | F        | 가        |        | 가
 방     | NNG  | 장소    | T        | 방        |        | 방
 에     | JKB  |         | F        | 에        |        | 에
 들어가 | VV   |         | F        | 들어가    |        | 들어가
 시     | EP   |         | F        | 시        |        |
 ㄴ다   | EC   |         | F        | ㄴ다      |        |
(7개 행)

-- text-search 함수
> select * from to_tsvector('아버지가방에들어가신다');
        to_tsvector
----------------------------
 '아버지가방에들어가신다':1
(1개 행)

-- text-search 함수 : korean config 지정
> select * from to_tsvector('korean','아버지가방에들어가신다');

-- 기본으로 text_search 설정을 korean 으로 적용할 수 있다
> set default_text_search_config = 'korean';
SET

> select * from to_tsvector('아버지가방에들어가신다');
         to_tsvector
------------------------------
 '들어가':3 '방':2 '아버지':1
(1개 행)
```

### 2) mecab-ko 분석기로 full-text search 사용하기

to_tsvector 함수 결과에 대해 to_tsquery 함수를 사용한다.

- 특징 필드를 to_tsvector 로 분석한 후 
- 토큰에 대해 to_tsquery 로 매칭 : [Text Search Operators](https://www.postgresql.org/docs/current/functions-textsearch.html)
  + 여러 단어를 결합하고 싶으면 `&`, `|`, `!` 논리 연산자 이용

```sql
-- '제주시' 검색
> select content from tmp.tbl_test where to_tsvector('korean', content) @@ to_tsquery('korean','제주시') limit 5;

-- '서귀포 & 모슬포' 검색
> select content from jjall.lineadv_item_2023 where to_tsvector('korean', content) @@ to_tsquery('korean','서귀포 & 모슬포') order by content limit 5;
```

#### full-text search 위한 gin 인덱스 생성 및 사용

to_tsvector 함수로 gin 인덱스 생성 후 to_tsquery 로 검색

- '서귀포 & 모슬포' 쿼리에 대해 `0.688 ms` 소요 (약 100배 빠름)

```sql
> drop index if exists tmp.ix_tbl_test_content;

-- indexing with mecab (17만 레코드에 14초 소요)
> CREATE INDEX ix_tbl_test_content
    on tmp.tbl_test
    USING GIN (to_tsvector('korean', content));

-- parallel seq-scan 78.354 ms
> explain (analyze) 
  select distinct content from tmp.tbl_test
  where content like '%서귀포%' and content like '%모슬포%'
  limit 5;

-- bitmap heap-scan 0.688 ms
> explain (analyze)
  select distinct content from tmp.tbl_test
  where to_tsvector('korean', content) @@ to_tsquery('korean','서귀포 & 모슬포')
  limit 5;  
```

> 참고

- `create index CONCURRENTLY` 는 파티션 테이블에 대해 작동 안함
- index 생성시 tablespace 지정 안됨


## 9. Review

- UTF-8 인코딩은 필수이다.
- 영문 및 한글 텍스트가 쿼리의 주 대상이라면 LC_COLLATE=`C.UTF-8` 가 적합
  + 한글이라도 코드값 성격으로 사용한다면 `C.UTF-8` 로 충분
  + 한글을 컬럼 단위로 제어하고 싶다면 `collate "ko-x-icu"` 키워드를 활용하자
- 한글 인덱스는 full-text search 기반의 gin 인덱스가 좋다.
- mecab-ko 를 이용한 tsvector 검색을 어떻게 이용할지 성공사례가 필요하다.
  + 명사만 뽑아서 trigram 색인 되도록 하고 싶다. 좀 더 공부하자.
  + 참고 [Indexing for full text search in PostgreSQL](https://www.compose.com/articles/indexing-for-full-text-search-in-postgresql/)

> 참고: 중국어, 일본어, 한국어 (CJK)를 위한 [pg_cjk_parser](https://github.com/huangjimmy/pg_cjk_parser) 도 있다. (pg12부터)

### dblink : 원격 데이터베이스 쿼리 모듈 [(참고)](https://stackoverflow.com/a/27054140)

- superuser 가 아니면 password 가 필요함
  + `hostaddr=localhost port=5432 user=user01 password=p@ssw0rd dbname=db2`
- `as` 키워드와 함께 alias 와 record 정의가 필요함
- dblink 연결명 사용시 dblink_connect, dblink_disconnect 사용

```shell
$ sudo -u postgres psql -d tutorial

-- 확장 모듈 등록
> CREATE EXTENSION dblink;

-- dblink 쿼리 예제
> SELECT *
  FROM  dblink('dbname=db2','SELECT id, code FROM table2 limit 10')
        AS tb2(id int, code text);
```

### 참고: [Autovacuum, Vacuum(Full) 에 대해](https://nrise.github.io/posts/postgresql-autovacuum/)

`vacuum` 은 진공청소기로 청소한다는 의미이다. update/delete 등에 의해 발생한 `dead tuple` 들을 정리하여 FSM(해제 메모리)으로 되돌리는 기능을 수행한다.

- autovacuum 의 scale_factor 또는 threshold 를 이용해 자동 처리가 가능하다.
- 수동 Full Vacuum 과 자동 Autovacuum 의 가장 큰 차이점은 해당 테이블에 lock 을 유발하는지 여부이다. 또, 수동 vacuum 은 실질적인 용량 감소를 보인다.

```shell
$ ps aux|grep autovacuum|grep -v grep

$ psql -d postgres -c "SELECT name, setting FROM pg_settings WHERE name ILIKE '%autovacuum%'";
```

### 참고: 테이블 파티션 생성 권한

테이블 owner 또는 권한 상속 멤버들만 파티션 테이블을 만들 수 있다.

```sql
> CREATE TABLE tutorial.tbl_temp_2024 PARTITION OF tutorial.tbl_temp
    FOR VALUES FROM ('2023-01-01') TO ('2024-01-01');
오류:  article 테이블의 소유주여야만 합니다
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
