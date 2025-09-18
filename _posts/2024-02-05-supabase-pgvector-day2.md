---
date: 2024-02-05 00:00:00 +0900
title: supabase pgvector - 2일차
description: PostgreSQL(supabase) 에서 한글 검색을 위한 pgvector 사용법을 알아봅니다. 영문 리뷰 데이터를 openai API 로 임베딩하여 유사 문서를 찾는 실습을 진행합니다.
categories: [Backend, Supabase]
tags: [openai, embedding]
image: "https://supabase.com/images/blog/embeddings/og_pgvector.png"
---

> 목록
{: .prompt-tip }

- [supabase pgvector - 1일차](/posts/supabase-pgvector-day1/) : supabase 와 pgvector
- [supabase pgvector - 2일차](/posts/supabase-pgvector-day2/) : openai embedding


## 1. [openai 임베딩](https://platform.openai.com/docs/guides/embeddings/what-are-embeddings)

### food reviews 데이터 

- 1천건 리뷰 데이터 : Time, ProductId, UserId, 평점, 제목, 본문
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
\copy foodreview1k_embedding(id, productid, userid, score, summary, body, combined, n_tokens, embedding) from '$HOME/Downloads/fine_food_reviews_with_embeddings_1k.csv' delimiter ',' csv header;

-- supabase : Row Level Security
alter table foodreview1k_embedding enable row level security;
-- supabase : policy
create policy "foodreview1k_embedding are viewable by everyone"
on foodreview1k_embedding for select
to authenticated, anon
using ( true );

-- TEST : 0번 문서의 유사 문서 쿼리
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

영문 리뷰 데이터를 대상으로 openai 임베딩 변환 후 벡터 거리 연산자로 유사문서를 쿼리한다.

- id=0 리뷰 문서의 summary(제목) 만으로 임베딩 벡터 변환 요청
- pgsql-http 로 open api 를 요청해 summary 의 임베딩 벡터를 가져오기
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
            "input": "where does one  start...and stop... with a treat like this",
            "model": "text-embedding-3-small"
          }'
      )::http_request)
  )
  select id, summary, 
    regexp_replace(embedding,'[\r\n\t ]', '', 'g')::vector as qvector
  from query_text, query_embedding;

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

일단 생각대로 잘 되었다. 한글 데이터에서는 어떻게 될지 모르겠지만.

| rank | 원본 벡터 |  | summary 쿼리 | |
|      | idx  | dist   | idx   | dist      |
| :--- | :--- | :---   | :---  | :---      |
| 1    | 0    | 0      | 0     | 0.832656749864305         |
| 2    | 726    | 0.915856064307327      | 726     | 1.06856213209488         |
| 3    | 359    | 0.924484765683111      | 390     | 1.12354179478311         |
| 4    | 59    | 0.950686317853922      | 269     | 1.12738237577285         |
| 5    | 907    | 0.953927412158517      | 194     | 1.13635072197582         |


## 2. Airbnb 검색 서비스

- sveltekit + tailwind + daisyui
- openai API : chat.completion, embedding
- supabase(postgresql) + pgvector

> 참고문서

- [유튜브 - PostgreSQL as a Vector Database: Part 1](https://www.youtube.com/watch?v=RFnZB76KVWk)
  - [블로그 - Better Together: OpenAI Embeddings API With PostgreSQL pgvector Extension](https://medium.com/@magda7817/better-together-openai-embeddings-api-with-postgresql-pgvector-extension-7a34645bdac2)
  - [깃허브 - YugabyteDB-Samples/openai-pgvector-lodging-service](https://github.com/YugabyteDB-Samples/openai-pgvector-lodging-service)

### 화면 캡쳐

> 사용자 prompt

`I want to stay near the Golden Gate Bridge with a nice view of the Bay.`

#### openai GPT-4 chat

- 5개의 옵션을 제안하도록 지시
- 출력은 name, description, price 배열의 json 데이터로 응답하도록 지시

```js
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          "You're a helpful assistant that helps to find lodging in San Francisco. Suggest five options. Send back a JSON object in the format below." +
          '[{"name": "<hotel name>", "description": "<hotel description>", "price": <hotel price>}]' +
          "Don't add any other text to the response. Don't add the new line or any other symbols to the response, just the raw JSON."
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    model: 'gpt-4'
  });
```

![](/2024/02/05-airbnb-recommend-with-openai.png){: width="560" .w-75}
_airbnb-recommend-with-openai_

#### openai Embedding and search airbnb database

- openai.embeddings: 'text-embedding-ada-002' 모델 사용
  - csv 파일의 embedding 모델과 일치하지 않으면 매칭 0건 나옴
- [airbnb 숙박정보 csv](https://github.com/YugabyteDB-Samples/openai-pgvector-lodging-service/blob/main/sql/airbnb_listings_with_embeddings.csv) : description 의 embedding 벡터 포함
  - [테이블 airbnb_listing](https://github.com/YugabyteDB-Samples/openai-pgvector-lodging-service/blob/main/sql/airbnb_listings.sql)

```js
const embeddingResp = await openai.embeddings.create(
  {
    model: "text-embedding-ada-002",
    input: prompt
  }
);
```

![](/2024/02/05-airbnb-recommend-with-pgvector.png){: width="560" .w-75}
_airbnb-recommend-with-pgvector_

#### [embedding models](https://platform.openai.com/docs/guides/embeddings/embedding-models)

최신 모델인 `text-embedding-3-small` 이 성능과 가격 측면에서 두가지 다 `text-embedding-ada-002` 보다 낫지만, 예제에서 선택한대로 진행한다.

> (2022년 12월 발표) text-embedding-ada-002 모델 설명

`text-embedding-ada-002` 는 텍스트 검색, 코드 검색, 문장 유사성 작업에서 기존의 모든 임베딩 모델보다 성능이 뛰어나고 텍스트 분류에서 비슷한 성능을 얻습니다. 각 작업 카테고리에 대해 이전 임베딩에 사용된 데이터 세트에 대한 모델을 평가합니다.

> (2024년 1월 발표) text-embedding-3-small, text-embedding-3-large

| Eval benchmark | ada v2 | text-embedding-3-small | text-embedding-3-large |
| :--- | :--- | :--- | :--- |
| MIRACL average | 31.4 | 44.0 | 54.9 |
| MTEB average | 61.0 | 62.3 | 64.6 |

### supabase 설정

vector 연산을 수행하는 function 을 등록하고 [`supabase.rpc`](https://supabase.com/docs/reference/javascript/rpc?example=call-a-postgres-function-with-arguments) 로 호출했다.

```sql
drop function if exists airbnb_match;

create or replace function airbnb_match(embeddingresp text, matchthreshold float, matchcnt int) -- 1
  returns table( similarity float, name text, description text, price varchar(10)) -- 2
  language plpgsql -- 3
as $$  -- 4
begin 
  return query
  with userinput as (
    select embeddingresp::vector as prompt
  )
  SELECT 1 - (description_embedding <=> prompt) as similarity
    , a.name, a.description, a.price
  FROM airbnb_listing a, userinput 
  WHERE 1 - (description_embedding <=> prompt) > matchthreshold
  ORDER BY description_embedding <=> prompt 
  LIMIT matchcnt;
end; $$;

-- select * from airbnb_match('[...prompt_vector]', 0.8, 5);
```

> 주의 : function 의 파라미터는 소문자만 인식한다.

```js
// **NOTE: function 파라미터는 소문자만 인식한다
const { data, error } = await supabase.rpc('airbnb_match', {
  embeddingresp: await this.embeddingPrompt(prompt),
  matchthreshold: matchThreshold,
  matchcnt: matchCnt
});
```

### sveltekit form & Server actions

#### [ISSUE: Textfield is empty after form submit with use:enhance](https://github.com/sveltejs/kit/issues/9609#issuecomment-1506689792)

form submit 후에 select 및 textarea 의 내용이 reset 되는 문제가 있어 찾아보았다. form 의 기본 매커니즘에서 reset 을 하도록 되어 있어서, 이를 중단시키는 설정이 필요하다.

> `+page.svelte`

```html
<script>
  import { enhance } from '$app/forms';

  /** @type {string} */
  let searchServiceOption = 'pgvector';
  /** @type {string} */
  let searchText = 'I want to stay near the Golden Gate Bridge with a nice view of the Bay.';
</script>

<form
  class="flex w-60 min-w-max flex-col gap-2 p-2 md:w-80"
  method="POST"
  use:enhance={() => {
    return ({ update }) => update({ reset: false });
  }}
>
  <h1 class="text-2xl font-bold text-slate-100">Query</h1>
  <div class="mt-4">
    <select
      name="apiType"
      class="select select-bordered w-full"
      bind:value={searchServiceOption}
    >
      <option disabled selected>select API</option>
      <option value="openai">OpenAI</option>
      <option value="pgvector">pgVector</option>
    </select>
  </div>
  <div class="mt-4">
    <textarea
      name="apiQuery"
      class="textarea textarea-bordered w-full"
      placeholder="type your question"
      rows="4"
      bind:value={searchText}
    ></textarea>
  </div>
  <button type="submit" class="btn btn-primary w-full">Search</button>
</form>
```

> `+page.server.ts` : post 요청은 server 스크립트에서 처리한다.

```js
export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const apiType = data.get('apiType');
    const apiQuery = data.get('apiQuery');
    console.log(`${apiType} : "${apiQuery}"`);

    if (apiType && apiQuery) {
      if (apiType === 'openai') {
        const response = await openaiService.searchPlaces(apiQuery);
        return { success: true, response };
      } else if (apiType === 'pgvector') {
        const response = await pgEmbeddingsService.searchPlaces(apiQuery);
        return { success: true, response };
      }
    }

    // Fail
    return {
      success: false,
      message: 'Wrong value with API Type or Query'
    };
  }
} satisfies Actions;
```

#### actionData 출력

- daisyUI 의 card 스타일을 이용해서, svelte each 구문으로 처리했다.
- similarity 의 소수점 포맷은 `Number().toLocaleString({ .. })` 를 사용했다.

```html
<script>
  /** @type {import('./$types').ActionData} */
  export let form;

  $: responseItems = form?.response ?? [];
</script>

<div>
  <h1 class="mb-2 text-2xl font-bold text-slate-100">
    Results: {responseItems.length || 'ready'}
  </h1>
  {#if responseItems}
    <div class="flex w-full max-w-2xl flex-col gap-2">
      {#each responseItems as item, idx (idx)}
        <div class="card card-compact w-96 bg-base-100 shadow-xl">
          <div class="card-body">
            <h2 class="card-title">&num;{idx} {item.name}</h2>
            <p>{item.description}</p>
            <span class="font-bold">price: {item.price}</span>
            {#if searchServiceOption !== 'openai'}
              <div class="card-actions justify-end">
                <span
                  >similarity: {Number(item.similarity ?? 0.0).toLocaleString(undefined, {
                    minimumFractionDigits: 4,
                    maximumFractionDigits: 6
                  })}</span
                >
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
```

## 9. Review

- 영문 데이터를 임베딩하고 매칭 하는 예제 두가지를 연습해 보았다.
- tailwind 로 grid 템플릿 구성하는데 더 많은 시간이 걸렸다. 프론트는 정말 어렵다.
  - grid 두열짜리 만드는데, 첫 열의 크기를 컨텐츠 크기로 고정시키는게 마음대로 안되었다.
  - grid-custom 이란 스타일을 적용해서 어찌 하긴 했는데, 무슨 원리인지는 모르겠다.

```html
<div class="grid-custom grid grid-cols-1 gap-x-4 p-4 md:grid-cols-2">
  <form> <!-- ... --> </form>
  <div> <!-- ... --> </div>
</div>

<style lang="postcss">
  .grid-custom {
    grid-template-columns: repeat(2, minmax(0, max-content));
  }
</style>
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
