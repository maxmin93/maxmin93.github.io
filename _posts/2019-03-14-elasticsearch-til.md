---
date: 2019-03-14 00:00:00 +0900
title: Learning Elastic Stack 6
categories: [elasticsearch]
tags: [TIL]
---

> 대용량 데이터 탐색에 Elasticsearch 를 사용하려고 튜토리얼 공부 중입니다.
{: .prompt-tip }

> 출처 : 도서 [Learning Elastic Stack 6](http://aladin.kr/p/e1tcY)

## 튜토리얼 따라하기

### 2장 엘라스틱서치 따라하기

```jsonc
// PUT /catalog/product/1
{
  "sku": "SP0001",
  "title": "Elasticsearch for Hadoop",
  "description": "Elasticsearch for Hadoop",
  "author": "Vishal Shukla",
  "ISBN": "1785288997",
  "price": 26.99
}

// GET /catalog/product/1

// PUT /catalog/product/2
{
  "sku": "SP0002",
  "title": "Google Pixel Phone 32GB",
  "description": "Google Pixel Phone 32GB - 5 inch display (Factory Unlocked US version)",
  "price": 400,
  "resolution": "1440 x 2560 pixels",
  "os": "Android 7.1"
}

// GET /catalog
// GET /catalog/_mapping/product

// DELETE /catalog/_mapping/product/properties/doc


// POST /catalog/product/1/_update
{
  "doc": {
    "price": "28.99"
  }
}

// ## FAIL "document_missing_exception"
// POST /catalog/product/3/_update
{
  "doc": {
    "sku": "SP0003",
    "title": "Elasticsearch 5.0 Cookbook",
    "description": "Elasticsearch 5.0 Cookbook Third Edition",
    "price": "54.99",
    "author": "Arbert Paro"
  }
}

// DELETE /catalog/product/3

// POST /catalog/product/3
{
  "sku": "SP0003",
  "title": "Elasticsearch 5.0 Cookbook",
  "description": "Elasticsearch 5.0 Cookbook Third Edition",
  "price": "54.99",
  "author": "Arbert Paro"
}
// GET /catalog/product/3

// DELETE /catalog

// ## "resource_already_exists_exception"
// PUT /catalog
{
  "settings": {
    "index" : {
      "number_of_shards": 5,
      "number_of_replicas": 1
    }
  },
  "mappings": {
    "my_type": {
      "properties": {
        "f1": {
          "type": "text"
        },
        "f2": {
          "type": "keyword"
        }
      }
    }
  }
}

// ## mapping would have more than 1 type
// ## ex) PUT /catalog/_mapping/category
// PUT /catalog/_mapping/my_type
{
  "properties": {
    "name": {
      "type": "text"
    }
  }
}

// GET /catalog/_mapping/my_type
```

### 3장 유사도 검색

```jsonc
// PUT test_analyzer
{
  "settings": {
    "analysis": {
      "analyzer": {
        "std" : {
          "type": "standard"
        }
      }
    }
  },
  "mappings": {
    "my_type": {
      "properties": {
        "my_text": {
          "type": "text",
          "analyzer": "std"
        }
      }
    }
  }
}

// POST test_analyzer/_analyze
{
  "field": "my_text",
  "text": "The Standard Analyzer works this way"
}

// GET /_analyze
{
  "text": "Learning Elastic Stack 6",
  "analyzer": "standard"
}

// PUT /test_analyzer1
{
  "settings": {
    "index": {
      "analysis": {
        "analyzer": {
          "custom_analyzer": {
            "type": "custom",
            "tokenizer": "standard",
            "filter": [
              "lowercase","custom_edge_ngram"
              ]
          }
        },
        "filter": {
          "custom_edge_ngram": {
            "type": "edge_ngram",
            "min_ngram": 2,
            "max_ngram": 10
          }
        }
      }
    }
  },
  "mappings": {
    "my_type": {
      "properties": {
        "product": {
          "type": "text",
          "analyzer": "custom_analyzer",
          "search_analyzer": "standard"
        }
      }
    }
  }
}

// POST /test_analyzer1/my_type
{
  "product": "Learning Elastic Stack 6"
}

// POST /test_analyzer1/my_type
{
  "product": "Mastering Elasticsearch"
}

// GET /test_analyzer1/_search
{
  "query": {
    "match": {
      "product": "el"
    }
  }
}

// POST _analyze
{
  "tokenizer": {
    "nori_user_dict": {
      "type": "nori_tokenizer",
      "decompound_mode": "mixed",
      "user_dictionary": "userdict_ko.txt"
    }
  },
  "text": "하늘은 맑고 바다는 푸르다"
}
```

#### 별첨 : _*nori analyzer*_ 테스트

```jsonc
// DELETE nori_sample

// PUT nori_sample
{
  "settings": {
    "index": {
      "analysis": {
        "tokenizer": {
          "nori_user_dict": {
            "type": "nori_tokenizer",
            "decompound_mode": "mixed",
            "user_dictionary": "userdict_ko.txt"
          }
        },
        "analyzer": {
          "my_analyzer": {
            "type": "custom",
            "tokenizer": "nori_user_dict",
            "filter": [
              "nori_part_of_speech","lowercase"
              ]
          }
        }
      }
    }
  }
}

// GET nori_sample/_analyze
{
  "analyzer": "my_analyzer",
  "text": "하늘은 맑고 바다는 푸르다"
}

// GET nori_sample/_analyze
{
  "analyzer": "my_analyzer",
  "text": "세종시 제주도 한라산"
}

// GET nori_sample/_analyze
{
  "analyzer": "my_analyzer",
  "text": "21세기 세종계획"
}
```

#### [update-settings-analysis](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-update-settings.html#update-settings-analysis)

```jsonc
// POST /twitter/_close

// PUT /twitter/_settings
{
  "analysis" : {
    "analyzer":{
      "content":{
        "type":"custom",
        "tokenizer":"whitespace"
      }
    }
  }
}

// POST /twitter/_open
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
