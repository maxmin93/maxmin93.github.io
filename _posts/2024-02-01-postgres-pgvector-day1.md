---
date: 2024-02-01 00:00:00 +0900
title: PostgreSQL pgvector - 1일차
categories: ["database", "postgres"]
tags: ["pg16", "korean", "pgvector", "1st-day"]
image: "https://dyclassroom.com/image/topic/postgresql/postgresql.jpg"
---

> PostgreSQL 에서 한글 검색을 위한 pgvector 사용법을 알아봅니다. 우선은 pgvector 설정부터 시작합니다.
{: .prompt-tip }

## 1. [pgvector](https://github.com/pgvector/pgvector) 설정

### pgvector 설치

```bash
git clone --branch v0.6.0 https://github.com/pgvector/pgvector.git
cd pgvector

sudo make
sudo make install

sudo -u postgres psql -d {DB} -c 'CREATE EXTENSION vector'
```

> [supabase 의 pgvector](https://supabase.com/docs/guides/database/extensions/pgvector) 는 `create extension` 만 하면 된다.

```bash
# 로컬 docker 인스턴스 접속
psql -h localhost -p 54322 -d postgres -U postgres
```

### pgvector 쿼리

```sql
CREATE TABLE items (
  id bigserial PRIMARY KEY, 
  embedding vector(3)
  );
-- 또는 ALTER TABLE items ADD COLUMN embedding vector(3);

-- upsert vectors
INSERT INTO items (id, embedding) VALUES 
  (1, '[1,2,3]'), 
  (2, '[4,5,6]'),
  (3, '[6,3,1]')
  ON CONFLICT (id) DO 
    UPDATE SET embedding = EXCLUDED.embedding;

-- --------------------------------------------------
-- query : distacne, inner_product, cosine_similarity
-- --------------------------------------------------

SELECT id, embedding,  
  embedding <-> '[3,1,2]' as dist
  FROM items
  ORDER BY dist;
-- "id" | "embedding" | "dist"
-- -------------------------------
-- 1  "[1,2,3]"  2.449489742783178
-- 3  "[6,3,1]"  3.7416573867739413
-- 2  "[4,5,6]"  5.744562646538029

SELECT embedding, 
  (embedding <#> '[3,1,2]') * -1 AS inner_product 
  FROM items;
-- "embedding" | "inner_product"
-- -----------------------------
-- "[1,2,3]"  11
-- "[4,5,6]"  29
-- "[6,3,1]"  23

SELECT embedding, 
  1 - (embedding <=> '[3,1,2]') AS cosine_similarity 
  FROM items;
-- "embedding" | "cosine_similarity"
-- ---------------------------------
-- "[1,2,3]"  0.7857142857142857
-- "[4,5,6]"  0.8832601106161003
-- "[6,3,1]"  0.9063269671749657

-- --------------------------------------------------
-- Aggregation : avg
-- --------------------------------------------------

SELECT AVG(embedding) FROM items;
-- "[3.6666667,3.3333333,3.3333333]"
```

### [HNSW](https://github.com/pgvector/pgvector/blob/master/README.md#hnsw) 인덱스

Approximate NN(근사적인 근접 이웃) 탐색을 위해 사용되는 그래프 기반 인덱스이다.

- 거리 (L2 distance) `vector_l2_ops`
- 내적 (Inner product) `vector_ip_ops`
- 코사인 (Cosine distance) `vector_cosine_ops`

```sql
SET maintenance_work_mem = '8GB';
SET max_parallel_maintenance_workers = 7; -- speed up build (default=2)
SET max_parallel_workers_per_gather = 4; -- speed up query

CREATE INDEX ON items USING hnsw (embedding vector_l2_ops);
CREATE INDEX ON items USING hnsw (embedding vector_ip_ops);
CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);
```

> HNSW vs IVFFlat [인덱스 비교](https://tembo.io/blog/vector-indexes-in-pgvector#picking-the-right-index-for-your-use-case)

- 인덱스 크기와 빌드 시간이 중요하면 IVFFlat 를 선택 => 대규모 정적 데이터
  - lists 크기의 클러스터를 중심점을 기준으로 vector 탐색
- 검색 속도와 업데이트 반영이 중요하다면 HNSW 를 선택 => 소규모 동적 데이터
  - multi-layer 그래프 기반으로 가까운 node(vector) 를 탐색

| 비교 | IVFFlat | HNSW |
| :--- | :--- | :-- | 
| Build Time (in seconds) | 128 | 4,065 |
| Size (in MB) | 257 | 729 |
| Speed (in QPS) | 2.6 | 40.5 |
| 업데이트 이후 리콜 영향 | Significant | Negligible |


## 2. openai 임베딩으로 vector 변환

### food reviews 데이터 

- 1천건
- CSV 다운로드 : [fine_food_reviews_1k.csv](https://github.com/openai/openai-cookbook/blob/main/examples/data/fine_food_reviews_1k.csv)
  - embedding 포함 CSV : [fine_food_reviews_with_embeddings_1k.csv](https://github.com/openai/openai-cookbook/blob/main/examples/data/fine_food_reviews_with_embeddings_1k.csv)

```sql
-- drop table if exists foodreview1k;
create table foodreview1k (
  id bigserial primary key,
  regdt bigint,  /* to_timestamp() at time zone 'Asia/Seoul', */
  productid text,
  userid text,
  score smallint,
  summary text,
  body text
)

-- psql 에서 실행
\copy foodreview1k(id, regdt, productid, userid, score, summary, body) from '$HOME/Downloads/fine_food_reviews_1k.csv' delimiter ',' csv header;

-------------------------------------------

drop table if exists foodreview1k_embedding;
create table foodreview1k_embedding (
  id bigserial primary key,
  productid text,
  userid text,
  score smallint,
  summary text,
  body text,
  combined text,
  n_tokens int,
  embedding vector
)

-- psql 에서 실행
\copy foodreview1k_embedding(id, productid, userid, score, summary, body, combined, n_tokens, embedding) from '/Volumes/SSD2T_WORK/Users/bgmin/Downloads/fine_food_reviews_with_embeddings_1k.csv' delimiter ',' csv header;

-- supabase : Row Level Security
alter table foodreview1k_embedding enable row level security;
-- supabase : policy
create policy "foodreview1k_embedding are viewable by everyone"
on foodreview1k_embedding for select
to authenticated, anon
using ( true );

-- TEST
select id, data.embedding <-> query.embedding as dist, summary
from foodreview1k_embedding data,
(select embedding from foodreview1k_embedding where id=0) query
order by dist
limit 5;
-- 0  0  "where does one start... with a treat like this"
-- 726  0.915856064307327  "Perfect treat"
-- 359  0.924484765683111  "Wonderful!"
-- 59  0.950686317853922  "Yummy & Great Small Gift"
-- 907  0.953927412158517  "NTune@60"
```

### openai api 로 임베딩하기

- id=0 리뷰 문서의 summary(제목) 만으로 임베딩 벡터 변환 요청
- postgresql 에서 api 를 요청해서 임베딩 벡터를 가져오기
  - json 의 텍스트 결과에서 new-lines, spaces 등을 제거
  - vector 타입으로 변환
- foodreview1k_embedding 의 임베딩 벡터와의 거리 기준 상위 5개 문서 가져오기
  - 앞에서 자신의 임베딩 벡터로 뽑은 상위 5개 문서와 비교하기

#### [pgsql-http](https://github.com/pramsey/pgsql-http) : HTTP Client

postgresql 에서 OPENAI API 를 간단히 사용하기 위해 extension 을 설치한다.

- http : http_get, http_post, http_put, http_patch, http_delete
- [http_request](https://github.com/pramsey/pgsql-http/blob/master/http--1.6.sql)
  - method
  - uri
  - headers : http_header[]
  - content_type
  - content

```sql
-- supabase
create extension http;

SELECT urlencode('my special string''s & things?');
-- "my+special+string%27s+%26+things%3F"

SELECT content::json->>'origin' as origin
  FROM http_get('http://httpbun.com/ip');
-- {자신의 WAN IP}

SELECT content::json->>'Authorization'
  FROM http((
    'GET',
     'http://httpbun.com/headers',
     ARRAY[http_header('Authorization','Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9')],
     NULL,
     NULL
  )::http_request);
-- "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9"  


SELECT (unnest(headers)).*
  FROM http_get('http://httpbun.com/');
```

#### openai API 사용법

- API_KEY 가 필요하다.

```bash
curl https://api.openai.com/v1/embeddings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
    "input": "Your text string goes here",
    "model": "text-embedding-3-small"
  }'  
```

#### 쿼리 임베딩 벡터로 거리 기준 5개 문서 출력

```sql
create table foodreview1k_query(
  id bigserial primary key,
  summary text,
  embedding vector
);

-- openapi 로부터 embedding 결과를 받아 테이블에 저장
insert into foodreview1k_query
with 
  query_text as (
    select 0 as id
      ,'where does one  start...and stop... with a treat like this' as summary
  ),
  query_embedding as (
    select content::json->'data'->0->>'embedding' as embedding
      FROM http((
        'POST',
         'https://api.openai.com/v1/embeddings',
         ARRAY[http_header('Authorization','Bearer $OPENAI_API_KEY')],
         'application/json',
         '{
            "input": "Your text string goes here",
            "model": "text-embedding-3-small"
          }'
      )::http_request)
  )
  select regexp_replace(embedding,'[\r\n\t ]', '', 'g')::vector as qvector
  from query_embedding;

-- 리뷰 테이블에 쿼리 벡터로 유사 문서 검색
select id, data.embedding <-> query.embedding as dist, summary
from foodreview1k_embedding data,
(select embedding from foodreview1k_query where id=0) query
order by dist
limit 5;
-- 0  0.832656749864305  "where does one start... with a treat like this"
-- 726  1.06856213209488  "Perfect treat"
-- 390  1.12354179478311  "Good Girl Treats (GGTs)"
-- 269  1.12738237577285  "Fantastic -- But ..."
-- 194  1.13635072197582  "More Good Stuff"
```

> (이전 원본 embedding 쿼리 결과와) 0번 리뷰의 summary 벡터를 쿼리한 결과 비교

| rank | 원본 벡터 |  | summary 쿼리 | |
|      | idx  | dist   | idx   | dist      |
| :--- | :--- | :---   | :---  | :---      |
| 1    | 0    | 0      | 0     | 0.832656749864305         |
| 2    | 726    | 0.915856064307327      | 726     | 1.06856213209488         |
| 3    | 359    | 0.924484765683111      | 390     | 1.12354179478311         |
| 4    | 59    | 0.950686317853922      | 269     | 1.12738237577285         |
| 5    | 907    | 0.953927412158517      | 194     | 1.13635072197582         |


## 9. Review

- supabase 의 pg 에는 여러 확장 기능들이 준비되어 있어 편리하다.
  - Row Level Security 와 policy 도 사용해 보았다.
- 영문 리뷰 데이터를 대상으로 임베딩과 pg 벡터 연산자를 사용해보았다.
  - 일단 생각대로 잘 되었다. 한글 데이터에서는 어떻게 될지 모르겠지만.
- 여기까지 하고 다음 문서에서 계속하자.

> 참고문서

- [유튜브 - What's next in pgvector: Building AI-enabled apps with PostgreSQL](https://www.youtube.com/watch?v=CzeTgNoHXN0)
  - [AWS 블로그 - Leverage pgvector and Amazon Aurora PostgreSQL for Natural Language Processing, Chatbots and Sentiment Analysis](https://aws.amazon.com/ko/blogs/database/leverage-pgvector-and-amazon-aurora-postgresql-for-natural-language-processing-chatbots-and-sentiment-analysis/)
  - [깃허브 - aws-samples/aurora-postgresql-pgvector](https://github.com/aws-samples/aurora-postgresql-pgvector/tree/main/apgpgvector-langchain-auroraml)
  
&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
