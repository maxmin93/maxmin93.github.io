---
date: 2019-03-15 00:00:00 +0900
title: Zombodb - pg10 plugin for ES6
description: Postgresql 과 Elasticsearch 를 연동시키는 Zombodb 라는 플러그인을 설치하는 방법을 설명합니다.
categories: [Backend, Search]
tags: [elasticsearch, postgresql]
image: /2019/03/15-zombodb-logo.png
---

## Zombodb 설치

> 출처 : Github [zombodb](https://github.com/zombodb/zombodb)

- Zombodb configuration
- zombodb--10-1.0.3.sql

### CentOS 6 환경 (installed by yum)

PATH `/usr/pgsql-10/share/extension/zombodb--10-1.0.3.sql`

### Mac OS 환경 (installed by brew)

PATH `/usr/local/Cellar/postgresql@10/10.6_1/share/postgresql@10/extension/zombodb--10-1.0.3.sql`

```sql

INSERT INTO analyzers(name, definition, is_default) VALUES (
  'zdb_korean', '{
          "type": "custom",
          "tokenizer": "nori_tokenizer",
          "filter": [
            "lowercase",
            "nori_part_of_speech"
          ]
        }', true);

CREATE DOMAIN text_ko AS text;

-- INSERT INTO type_mappings(type_name, definition, is_default) VALUES (
--   'text', '{
--     "type": "text",
--     "copy_to": "zdb_all",
--     "fielddata": true,
--     "analyzer": "zdb_standard"
--   }', true);

INSERT INTO type_mappings(type_name, definition, is_default) VALUES (
  'text_ko', '{
    "type": "text",
    "copy_to": "zdb_all",
    "analyzer": "zdb_korean"
  }', true);

CREATE DOMAIN korean AS text;      -- nori_analyzer

```

```json
{
  "error": {
    "root_cause": [
      {
        "type": "mapper_parsing_exception",
        "reason": "analyzer [korean] not found for field [sentence]"
      }
    ],
    "type": "mapper_parsing_exception",
    "reason": "Failed to parse mapping [doc]: analyzer [korean] not found for field [sentence]",
    "caused_by": {
      "type": "mapper_parsing_exception",
      "reason": "analyzer [korean] not found for field [sentence]"
    }
  },
  "status": 400
}
```

## ZomboDB 인덱스 생성 및 테스트

ElasticSearch 서버 <http://localhost:9200> 에 인덱스 연결

```sql
create index idx_products on idx_products
  using zombodb((products.*))
  with (url='http://localhost:9200');
```

![create-zombodb-index](/2019/03/15-create-zombodb-index.png){: w="80%"}
_ZomboDB 인덱스 생성 명령_

ElasticSearch 의 쿼리 결과를 인덱스로 사용해 Postgresql 의 테이블을 쿼리한다.

```sql
-- 텍스트 통합 필드에 대해 키워드를 쿼리
select * from products
where products ==> 'mix';

-- 특정 필드에 대해 값을 쿼리
select * from products
where products ==> 'productname:"chai"';
```

![create-zombodb-index-query](/2019/03/15-create-zombodb-index-exec.png){: w="80%"}
_ZomboDB 인덱스 생성된 결과_

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
