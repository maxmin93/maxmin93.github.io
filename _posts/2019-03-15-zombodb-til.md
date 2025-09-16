---
date: 2019-03-15 00:00:00 +0900
title: Zombodb - pg10 plugin for ES6
description: es 검색을 위한 pg 플러그인
categories: [Backend, ThirdParty]
tags: [elasticsearch, postgresql]
image: /2019/03/15-zombodb-logo.png
---

> Postgresql 과 Elasticsearch 를 연동시키는 Zombodb 라는 플러그인을 설치하는 방법을 설명합니다.
{: .prompt-tip }

> 출처 : Github [zombodb](https://github.com/zombodb/zombodb)

## Zombodb install

## Zombodb configuration

### zombodb--10-1.0.3.sql

#### CentOS 6 (installed by yum)

PATH `/usr/pgsql-10/share/extension/zombodb--10-1.0.3.sql`

#### Mac OS (installed by brew)

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

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
