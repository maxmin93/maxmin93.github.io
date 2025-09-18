---
date: 2023-06-23 00:00:00 +0900
title: ChatGPT Plugin 과 Supabase 통합
description: ChatGPT 플러그인에 Supabase 와 Postgresql 을 사용할 수 있다고 합니다. 관련 문서를 공부합니다. (작성중!!)
categories: [AI, Generative AI]
tags: [gpt, postgresql, plugin, supabase]
image: "https://supabase.com/_next/image?url=%2Fimages%2Fblog%2F2023-05-25-chatgpt-plugins-support-postgres%2Fchatgpt-plugins-support-postgres.jpeg&w=3840&q=75"
hidden: true
---

## 1. 원문 요약

출처: [ChatGPT 플러그인은 이제 Postgres 및 Supabase를 지원합니다](https://supabase.com/blog/chatgpt-plugins-support-postgres)

### 1) 목적과 기능

#### 목적

문제점: ChatGPT 가 개인 정보를 포함한 답변을 출력할 수 있다는 것

➡️ ChatGPT 의 `검색 플러그인`으로 해결

#### `ChatGPT 검색 플러그인` 이란?

참고: [ChatGPT plugins 문서](https://platform.openai.com/docs/plugins/introduction)

OpenAI 플러그인은 ChatGPT를 타사 애플리케이션에 연결합니다. 이러한 플러그인을 통해 ChatGPT는 개발자가 정의한 API와 상호 작용하여 ChatGPT의 기능을 향상하고 다양한 작업을 수행할 수 있습니다. 플러그인을 사용하면 ChatGPT가 다음과 같은 작업을 수행할 수 있습니다.

- 실시간 정보 검색, 예) 스포츠 점수, 주가, 최신 뉴스 등
- 지식 기반 정보를 검색, 예) 회사 문서, 개인 메모 등
- 사용자의 행동을 지원, 예) 항공편 예약, 음식 주문 등

#### 검색 플러그인의 작업

1. 문서를 더 작은 청크로 변환합니다.
2. OpenAI의 모델을 사용하여 청크를 임베딩으로 변환합니다 text-embedding-ada-002.
3. 임베딩을 벡터 데이터베이스에 저장합니다.
4. 질문이 있을 때 관련 문서에 대한 벡터 데이터베이스를 쿼리합니다.

#### [벡터를 지원하는 데이터베이스](https://github.com/openai/chatgpt-retrieval-plugin#choosing-a-vector-database)

- Postgres, Supabase
- Redis
- 그 외 모르는 DB들 : Llama Index, Chroma, Azure Cognitive Search, Pinecone, Weaviate, Zilliz, Milvus, Qdrant, AnalyticDB

### 2) 예: Postgres Docs와 채팅

Postgres 문서에 대해 "ChatGPT 질문"을 할 수 있는 예제를 만들어 봅시다.

1. 모든 Postgres 문서를 PDF로 다운로드
2. 문서를 포함된 텍스트 덩어리로 변환하고 Supabase에 저장
3. Postgres 문서에 대해 질문할 수 있도록 플러그인을 로컬에서 실행합니다.

![chatgpt-plugins-support-postgres](https://supabase.com/images/blog/2023-05-25-chatgpt-plugins-support-postgres/chatgpt-plugin-scheme--dark.png){: width="600" .w-75}
_chatgpt-plugins-support-postgres_


#### 1단계: ChatGPT 검색 플러그인 리포지토리 포크

#### 2단계: 종속성 설치

#### 3단계: Supabase 프로젝트 생성

#### 4단계: 로컬에서 Postgres 실행

#### 5단계: OpenAI API 키 얻기

#### 6단계: 플러그인 실행!


## 9. Review

### 참고문서

이미 특정 domain 의 sementic 검색서비스 여럿 활용되고 있다.

- [OpenAI ChatGPT 플러그인 문서](https://platform.openai.com/docs/plugins/introduction)
- [ChatGPT 검색 플러그인 저장소](https://github.com/openai/chatgpt-retrieval-plugin)
- [Supabase Edge Runtime으로 처음부터 ChatGPT 플러그인을 구축하는 방법](https://supabase.com/blog/building-chatgpt-plugins-template)
- [문서 pgvector: 임베딩 및 벡터 유사성](https://supabase.com/docs/guides/database/extensions/pgvector)



&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
