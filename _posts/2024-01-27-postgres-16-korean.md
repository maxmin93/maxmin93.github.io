---
date: 2024-01-27 00:00:00 +0900
title: PostgreSQL 16 한글 검색 설정
description: Postgresql 에서 한글 검색을 위한 gin 과 rum 인덱스를 살펴보고, 한글 텍스트 데이터로 검색 사례들을 테스트 합니다.
categories: [Backend, Database]
tags: [extension, postgresql, locale, rum-index, gin-index]
image: "https://postgrespro.com/media/2019/06/21/i8_000_800x450.jpg"
---

> 목록
{: .prompt-tip }

- [PostgreSQL 15 한글 검색 설정](/posts/postgres-15-korean/) : ko-x-icu, mecab
- [PostgreSQL 16 한글 검색 설정](/posts/postgres-16-korean/) : gin, rum

## 1. full-textsearch 한글 설정

### 데이터베이스 설정

> 기본 collate 는 'C.utf8' 이지만, 한글 정렬 필요시 컬럼별로 'ko-x-icu' 를 지정하면 된다.

```sql
-- 데이터베이스 생성: tablespace, owner, collate
CREATE DATABASE {DB}
  WITH
    TABLESPACE {DB_TS}
    OWNER = tonyne
    ENCODING = 'UTF8'
    LC_COLLATE = 'C.utf8'
    LC_CTYPE = 'C.utf8'
    TEMPLATE template0
    IS_TEMPLATE = False;

\c {DB}
SELECT pg_database.datcollate AS current_collation
FROM pg_catalog.pg_database
WHERE pg_database.datname = pg_catalog.current_database();
-- C.utf8

-- for SELECT uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
SELECT uuid_generate_v4();  -- verify
```

### mecab-ko 분석기 설치

- [깃허브 - textsearch_ko](https://github.com/i0seph/textsearch_ko) : 10년전 코드이지만 여전히 잘 된다.
  - mecab-ko 와 mecab-ko-dic 을 설치후 실행 (터미널에서 mecab 테스트할 것)

```bash
git clone https://github.com/i0seph/textsearch_ko.git
cd textsearch_ko

# 알맞는 postgresql-server-dev-{version} 설치
sudo apt install postgresql-server-dev-16

make USE_PGXS=1
sudo make USE_PGXS=1 install

sudo -u postgres psql -d {DB}

# macab_ko 설치 스크립트
> \i ts_mecab_ko.sql
create function
create text search parser
create text search template
create text search dictionary
create text search configuration
commit ...

# text search config 조회
> \dF korean
#                 텍스트 검색 구성 목록
#  스키마 |  이름  |               설명
# --------+--------+-----------------------------------
#  public | korean | configuration for korean language
# (1개 행)

# 기본 korean 사용 (필요시 english 등을 매개변수로 넣어 사용)
> set default_text_search_config = 'korean';
> show default_text_search_config;
# public.korean

# to_tsvector 역색인 결과
> select to_tsvector('korean', content) as parsed
from {DB} 
limit 5;
```

> mecab-ko 에 의한 tsvector 결과

![pg16-mecab-ko-tsvector](/2024/01/27-pg-mecab-ko-tsvector.png){: width="560" .w-75}
_pg16-mecab-ko-tsvector_

### [textsearch 함수 및 연산자](https://www.postgresql.org/docs/current/functions-textsearch.html)

```sql
-- '제주시' 검색
select content from {DB} 
  where to_tsvector('korean', content) 
        @@ to_tsquery('korean','제주시')
  limit 5;

-- not '제주' 검색
select content from {DB} 
  where to_tsvector('korean', content) 
        @@ to_tsquery('korean','!제주')
  limit 5;

-- '서귀포 & 모슬포' 검색
select content from {DB} 
  where to_tsvector('korean', content) 
        @@ to_tsquery('korean','서귀포 & 모슬포') 
  order by content limit 5;
```

#### textsearch 연산자 

- `tsvector @@ tsquery → boolean` : 매치 여부
- `tsvector || tsvector → tsvector` : tsvector 병합
- `tsquery && tsquery → tsquery` : tsquery 의 AND 병합
  - `tsquery || tsquery → tsquery` : tsquery 의 OR 병합
- `!! tsquery → tsquery` : not exists 매치 (ex: `!'cat'`)
- `tsquery <-> tsquery → tsquery` : 연결된 tsquery 매치 (구절)
- `tsquery @> tsquery → boolean` : tsquery 간의 포함 관계 여부

#### textsearch 함수

- `websearch_to_tsquery('english', '"fat rat" or cat dog') → 'fat' <-> 'rat' | 'cat' & 'dog'` : <br/>
  웹검색처럼 텍스트를 tsquery 로 변환 (구절 검색, or/and 연산자)
  - `plainto_tsquery('english', 'The Fat Rats') → 'fat' & 'rat'` : <br/>
    텍스트를 '&'로 연결된 tsquery 로 변환
  - `phraseto_tsquery('english', 'The Fat Rats') → 'fat' <-> 'rat'` <br/>
    `phraseto_tsquery('english', 'The Cat and Rats') → 'cat' <2> 'rat'` : <br/>
    텍스트 문장을 term 들과 연결관계를 포함된 tsquery 로 변환  
- `setweight(vector tsvector, weight "char") → tsvector` <br/>
  `setweight('fat:2,4 cat:3 rat:5B'::tsvector, 'A') → 'cat':3A 'fat':2A,4A 'rat':5A` : <br/>
  우선순위 문자(A/B/C/D) 를 tsvector 에 부여
- `ts_headline('The fat cat ate the rat.', 'cat') → The fat <b>cat</b> ate the rat.` : <br/>
  (tsvector 가 아니라) raw 문자열에서 매칭된 단어를 강조하여 출력
- `tsvector_to_array ( tsvector ) → text[]` : <br/>
  tsvector 로부터 token 배열을 출력
- `ts_stat('SELECT vector FROM apod')` : <br/>
  문서(record)의 document statistics 출력 (word, 문서수, 총 TF)
- `ts_rank(to_tsvector('raining cats and dogs'), 'cat') → 0.06079271` : <br/>
  tf 기반 매칭 점수를 반환 (비교: `ts_rank_cd` 는 밀도 기반 랭킹을 사용)
  - [가중치 A/B/C/D 사용시 기본 가중치 사용](https://www.postgresql.org/docs/current/textsearch-controls.html#TEXTSEARCH-RANKING) : `{A:1.0, B:0.4 C:0.2 D:0.1}`

> ts_rank 함수의 normalization 옵션 (flag bit)

- 기본값 0 : 문서 길이를 무시 
- 1 : `1 + log(문서길이)` 로 나누기 (짧은 문서에서 우위)
- 4 : 근접우선인 조화평균거리로 나누기 (ts_rank_cd 에서만 사용)
- 8 : 문서의 유일 단어수로 나누기 (문서의 정보성)
- 32 : `rank / (rank+1)` (백분율 환산)

```sql
SELECT title, 
  ts_rank_cd(textsearch, query, 32 /* rank/(rank+1) */ ) AS rank
FROM apod, to_tsquery('neutrino|(dark & matter)') query
WHERE  query @@ textsearch
ORDER BY rank DESC
LIMIT 10;
--                      title               |        rank
-- -----------------------------------------+-------------------
--  Neutrinos in the Sun                    | 0.756097569485493
--  The Sudbury Neutrino Detector           | 0.705882361190954
--  A MACHO View of Galactic Dark Matter    | 0.668123210574724
--  Hot Gas and Dark Matter                 |  0.65655958650282
```

#### 단어별 [document statistics](https://www.postgresql.org/docs/current/textsearch-features.html#TEXTSEARCH-STATISTICS) 출력

단일 tsvector 컬럼을 조회하는 쿼리문에 대해서 word 통계를 산출하여 출력한다.

- word text : 색인 토큰
- ndoc integer : 출현 문서수 (DF)
- nentry integer : 총 출현수 (total TF)

```sql
SELECT * FROM ts_stat('SELECT gin_vec FROM public.test_gin')
  where length(word) > 2
  ORDER BY nentry DESC, ndoc DESC, word
  LIMIT 10;
-- ------------------------
-- | word | ndoc | nentry |
-- ------------------------
-- "제주도"  301  1056
-- "2023"  273  530
-- "2024"  219  395
-- "프로그램"  111  284
-- "제주특별자치도"  213  273
-- "서귀포"  100  270
-- "서비스"  112  269
-- "위원회"  112  223
-- "나타나"  82  218
-- "포인트"  48  212
```


## 2. [gin 인덱스](https://www.postgresql.org/docs/current/gin-intro.html)

tsvector 결과를 gin 인덱스에 넣어 full-text search 에 사용할 수 있다.

### gin 인덱스 생성 및 사용

- to_tsvector 함수로 gin 인덱스 생성 후 to_tsquery 로 검색
- '서귀포 & 모슬포' 쿼리에 대해 gin 인덱스 검색시 `0.688 ms` 소요

> 단순 search('%키워드%') 에 비해 매우 빠름 (실험 데이터로는 약 160배)

```sql
CREATE TABLE IF NOT EXISTS test_gin
(
  "content" text COLLATE "ko-x-icu" NOT NULL
  -- , c_vec tsvector
);

-- 1만건 insert (content)

-- indexing with mecab (17만 레코드에 14초 소요)
CREATE INDEX ix_test_gin_content
  on test_gin
  USING GIN (to_tsvector('korean', content));

-- seq-scan 129.710 ms
explain (analyze) 
  select distinct content 
  from test_gin
  where content like '%서귀포%' and content like '%모슬포%'
  limit 5;

-- bitmap index scan on ix_test_gin_content 0.815 ms
explain (analyze)
  select distinct content 
  from test_gin
  where to_tsvector('korean', content) @@ to_tsquery('korean','서귀포 & 모슬포')
  limit 5;  
```

### [textsearch update trigger](https://www.postgresql.org/docs/current/textsearch-features.html#TEXTSEARCH-UPDATE-TRIGGERS)

`tsvector_update_trigger(tsvector_column_name, config_name, text_column_name [, ... ])`

- 컬럼 여러개를 넣을 수 있다.
- function 을 정의하여 setweight 로 컬럼 가중치를 부여할 수 있다.
  - 참고 : [Efficiently searching text using postgres](https://codebots.com/crud/How-to-efficiently-search-text-using-Postgres-text-search)

```sql
-- drop table if exists public.test_gin;
CREATE TABLE public.test_gin
(
  title text COLLATE "ko-x-icu",
  "content" text COLLATE "ko-x-icu" NOT NULL,
  gin_vec tsvector
);

-- # content, title 을 parsing 해서 gin_vec 에 저장
-- NOTE: textsearch config 이름을 scheme 까지 포함하여 넣어야 함
-- drop trigger if exists tsvectorupdate ON public.test_gin;
CREATE TRIGGER tsvectorupdate
  BEFORE UPDATE OR INSERT ON test_gin
  FOR EACH ROW EXECUTE FUNCTION 
  tsvector_update_trigger('gin_vec', 'public.korean', 'content', 'title');

-- 색인 vector 가 생성되며 저장된다.
insert into test_gin (title, "content")
  SELECT title, "content"
  FROM news_article
  LIMIT 1000;

-- #########################################
-- ##  컬럼별 가중치를 부여하여 vector 생성
-- #########################################

-- drop function if exists test_gin_trigger;
CREATE FUNCTION test_gin_trigger() RETURNS trigger AS $$
begin
  new.gin_vec :=
     setweight(to_tsvector('public.korean', coalesce(new.title,'')), 'A') ||
     setweight(to_tsvector('public.korean', coalesce(new.content,'')), 'D');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER tsvectorupdate 
  BEFORE INSERT OR UPDATE ON public.test_gin 
  FOR EACH ROW EXECUTE FUNCTION test_gin_trigger();

-- bitmap index scan 0.213ms
explain (analyze)
  select title, ts_rank_cd(gin_vec, websearch_to_tsquery('korean','서귀포 and 바다')) as rnk
  from test_gin
  where gin_vec @@ websearch_to_tsquery('korean','서귀포 and 바다')
  order by gin_vec <=> websearch_to_tsquery('korean','서귀포 and 바다')
  limit 5;  

-- | "title" | "rnk" |
-- --------------------
-- "고성림 서귀포해경서장 취임 ‘희망의 서귀포 바다 만들겠다’"  1.064899
-- "고성림 서귀포해양경찰서장 취임...‘안전하고 깨끗한 서귀포...’"  1.0530303
-- "서귀포시, ‘제25회 서귀포 겨울바다 국제펭귄수영대회’ 개최"  0.6617919
-- "문화재청, 서귀포 문섬 바다 관광잠수함 운항 재허가 '불허'"  0.60041153
-- "제주 거점 여성 문학인 동백문학회, ‘동백문학 3호’ 발간"  0.05  
```

> 위 쿼리의 5번째 결과는 title 이 아닌, content 에 `바다 ... 서귀포` 로 매칭되었음.


## 3. [RUM](https://github.com/postgrespro/rum) : GIN 기반 역색인

GIN 인덱스를 사용하여 빠른 full-text 검색을 수행할 수 있지만, 몇가지 문제가 있다.

- GIN 인덱스에는 pos 정보가 없어 매칭 이후에도 pos 스캔을 수행하여 순위 계산을 한다.
- 구문 검색시에도 pos 정보가 필요한데 마찬가지로 추가 스캔이 필요하다.
- 인덱싱 되지 않은 (timestamp 같은) 추가열에 따른 정렬이 느리다.

RUM 인덱스는 추가 정보를 저장할 수 있어 위의 문제들을 해결하지만, 대신 느린 빌드와 삽입 시간의 단점이 있다. (어쩔 수 없다)

![gin vs rum index](https://github.com/postgrespro/rum/raw/master/img/gin_rum.png){: width="560" .w-75}
_gin vs rum index_

> 참고 : [supabase - pg 확장기능 - RUM](https://supabase.com/docs/guides/database/extensions/rum)

### 벤치마크 : RUM vs GIN vs array with GIN

검색 rank 정렬이 들어간 최종 수행시간은 GIN 보다 RUM 이 빠르다고 한다. (대략 2배)

> 출처 : [PostgreSQL을 사용한 RUM 인덱스 및 전체 텍스트 검색](https://www.alibabacloud.com/blog/the-rum-index-and-full-text-search-using-postgresql_595343)

```sql
-- 테스트 테이블
create table rum_test(c1 tsvector);

-- 테스트 데이터 (test.sql)
insert into rum_test 
  select to_tsvector(string_agg(c1::text,',')) 
  from (
    select (100000*random())::int 
    from generate_series(1,100)
    ) t(c1);

-- 20만건 생성
-- $ pgbench -M prepared -n -r -P 1 -f ./test.sql -c 50 -j 50 -t 200000

-- 색인 생성
set maintenance_work_mem ='64GB';
CREATE INDEX rumidx ON rum_test USING rum (c1 rum_tsvector_ops);

-- Full-text search with rum index:
explain analyze 
  select * from rum_test 
  where c1 @@ to_tsquery('english','1 | 2') 
  order by c1 <=> to_tsquery('english','1 | 2') 
  offset 19000 limit 100;
------------------------------------------
QUERY PLAN
------------------------------------------
  Limit  
  (cost=18988.45..19088.30 rows=100 width=1391) 
  (actual time=58.912..59.165 rows=100 loops=1)
  -> Index Scan using rumidx on rum_test  
    (cost=16.00..99620.35 rows=99749 width=1391) 
    (actual time=16.426..57.892 rows=19100 loops=1)
      Index Cond: (c1 @@ '''1'' | ''2'''::tsquery)
      Order By: (c1 <=> '''1'' | ''2'''::tsquery)
 Planning time: 0.133 ms
 Execution time: 59.220 ms
(6 rows)

-- 비교 : GIN 인덱스
 Planning time: 0.134 ms
 Execution time: 126.122 ms
(11 rows)

-- 비교 : GIN 인덱스 about array
 Planning time: 0.122 ms
 Execution time: 93.057 ms
(11 rows)
```

### rum 확장기능 설치

```bash
git clone https://github.com/postgrespro/rum pg_rum
cd pg_rum

make USE_PGXS=1
sudo make USE_PGXS=1 install
# sudo make USE_PGXS=1 installcheck (안됨)

sudo -u postgres psql -d {DB} -c `create extension rum`;
```

### rum 검색 테스트 (예제)

RUM 은 ts_rank 와 ts_tank_cd 을 결합한 새로운 ranking 함수를 사용한다. ([출처](https://pgconf.ru/media/2017/04/03/20170316H3_Korotkov-rum.pdf))

- ts_rank 는 논리 연산자를 지원하지 않고
- ts_rank_cd 는 OR 쿼리에서 잘 작동하지 않는다.

> 더 많은 내용은 RUM 깃허브 [readme 문서](https://github.com/postgrespro/rum/blob/master/README.md) 참조

- text 컬럼 't' 를 tsvector 로 색인
- 트리거 생성 : 'english' 언어로 tsvector 생성 실행
- 검색 distance = rank (연산자 `<=>`)
  - `a <=> to_tsquery('english', 'beautiful | place') AS rank`

```sql
CREATE TABLE test_rum(t text, a tsvector);

CREATE TRIGGER tsvectorupdate
  BEFORE UPDATE OR INSERT ON test_rum
  FOR EACH ROW EXECUTE PROCEDURE tsvector_update_trigger('a', 'pg_catalog.english', 't');

INSERT INTO test_rum(t) VALUES ('The situation is most beautiful');
INSERT INTO test_rum(t) VALUES ('It is a beautiful');
INSERT INTO test_rum(t) VALUES ('It looks like a beautiful place');

select * from test_rum;
                t                |           a
---------------------------------+-----------------------
 The situation is most beautiful | 'beauti':5 'situat':2
 It is a beautiful               | 'beauti':4
 It looks like a beautiful place | 'beauti':5 'like':3 'look':2 'place':6
(3개 행)

SELECT t, a <=> to_tsquery('english', 'beautiful | place') AS rank
  FROM test_rum
  WHERE a @@ to_tsquery('english', 'beautiful | place')
  ORDER BY a <=> to_tsquery('english', 'beautiful | place');
                t                |   rank
---------------------------------+----------
 It looks like a beautiful place |  8.22467
 The situation is most beautiful | 16.44934
 It is a beautiful               | 16.44934
(3개 행)

SELECT t, a <=> to_tsquery('english', 'place | situation') AS rank
  FROM test_rum
  WHERE a @@ to_tsquery('english', 'place | situation')
  ORDER BY a <=> to_tsquery('english', 'place | situation');
                t                |   rank
---------------------------------+----------
 The situation is most beautiful | 16.44934
 It looks like a beautiful place | 16.44934
(2개 행)
```

#### rum 인덱스에 정보 추가 (테스트)

- timestamp 를 rum_tsvector_addon_ops 에 추가
- `to` 에 넣을 tsvector 컬럼이 존재해야 한다.

```sql
-- drop table if exists public.test_rum;
CREATE TABLE IF NOT EXISTS public.test_rum
(
  pub_dt timestamp without time zone NOT NULL,
  "content" text COLLATE "ko-x-icu" NOT NULL,
  c_vec tsvector
);

insert into public.test_rum
SELECT pub_dt, "content"
  , to_tsvector('korean', content) as c_vec
FROM news_article
LIMIT 1000;

-- 색인 생성 (추가 pub_dt)
CREATE INDEX content_rum_idx ON public.test_rum
  USING rum (c_vec rum_tsvector_addon_ops, pub_dt)
  WITH (attach='pub_dt', to='c_vec')
;

-- 특정 시간과 가까운 문서에 가중치가 더 부여된 순서로 rank 정렬
with top20 as (
  select pub_dt <=> '2023-12-29 12:00:00' as q_dt, pub_dt
    , c_vec <=> to_tsquery('korean','제주시 & 행사') as rnk
    , content
  from public.test_rum
  where c_vec @@ to_tsquery('korean','제주시 & 행사')
  limit 20
)
select q_dt, pub_dt, rnk, substring(content,1,30) as summary
  , rnk / sqrt(q_dt) as rnk_with_dt
from top20
where rnk <> 'Infinity'
order by rnk_with_dt desc
limit 5;

-- | q_dt | pub_dt              | rnk     | summary    |
-- -----------------------------------------------------
-- 16119  "2023-12-29 16:28:39"  422.19974  "제주도 공직자 마라톤동호회 '도르미' ..."
-- 39349  "2023-12-29 22:55:49"  400.2673  "제주도청 마라톤동호회 도르미 15년째 ..."
-- 180651  "2023-12-27 09:49:09"  734.7372  "제주시, 재산조회 안심상속 원스톱 서비스 ..."
```

> rnk 만 비교하면 2번째 결과가 우선이지만, pub_dt 차이로 인해 순위가 바뀌었다.

#### 쿼리 분기 (예제)

- 특정 문서에 매칭되는 쿼리와 연관된 태그를 출력하는 예제
- 인기 쿼리 리스트에 대해 특정 문서에 어떤 태그들을 넣어야 할지 결정할 때 사용 가능
  - 예시 : '서귀포 모슬포 생선 요리 맛집' 포스트에 '제주', '맛집' 등의 태그를 부여

```sql
CREATE TABLE query (q tsquery, tag text);

INSERT INTO query VALUES 
  ('supernova & star', 'sn'),
  ('black', 'color'),
  ('big & bang & black & hole', 'bang'),
  ('spiral & galaxy', 'shape'),
  ('black & hole', 'color');

CREATE INDEX query_idx ON query USING rum(q);

SELECT * 
  FROM query
  WHERE to_tsvector('english','black holes never exists before we think about them') @@ q;
        q         |  tag
------------------+-------
 'black'          | color
 'black' & 'hole' | color
(2개 행)
```

## 9. Review

- full-textsearch 관련 기능이 많아 찾아보다 놀랬다.
- rum 이 gin 보다 빠르다는데, 잘 모르겠다. 그보다 부가기능 때문에 사용할 필요가 있다.
- elsticsearch 도 유용한 도구이지만, 원천 데이터 보관용 DB 를 별도로 두고 pipeline 으로 ES 에 붓는 형태의 데이터 관리가 필요하다. 대규모 서비스라면 몰라도 소규모 프로젝트에서는 확실히 오버 스펙이다. (번거롭고 힘들다)
  - 차라리 수집용 DB 와 검색용 DB 를 이중으로 두고 추가/변경/삭제를 처리하는게 낫다.
  - pg 도 search 점수에 부가 정보를 이용한 가중치를 부여하여 검색할 수 있다.

### postgresql vs elasticsearch 응답시간 비교 그래프 (2021년)

- postgresql full-textsearch 는 버전업에 따라 검색 응답시간이 향상되고 있고, elasticsearch 와 비교할 때 크게 차이가 나지 않습니다. 따라서 수백만개의 레코드나 대규모 데이터가 아니라면 pg full-textsearch 를 선택하는 것이 좋습니다.
  - 출처 : [postgresql full-textsearch 와 elasticsearch](https://stackoverflow.com/a/74927254/6811653)

![pg full-textsearch vs elasticsearch](https://i.stack.imgur.com/LGUNe.png){: width="560" .w-75}
_pg full-textsearch vs elasticsearch_

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
