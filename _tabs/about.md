---
title: About
icon: fas fa-info-circle
order: 6
sitemap: false
---

> 현재 공부하고 있는 것들과, 가야할 목표들이다

## Full-stack 전략

### 1) 백엔드 트랜잭션 API

- Java : [Spring Webflux](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html) + [Spring Data R2DBC](https://spring.io/projects/spring-data-r2dbc)
  - 당장 빠르고 튼튼한 놈을 찾는다면 이 녀석으로!
    + 함께 쓰는 서드파티들이 (Spark 처럼) JVM 계열이면 무조건 선택
    + 그러나 최신 오픈소스들은 nodejs, python 계열이 더 많다.
  - Cold-start 성능에 문제가 있고, 메모리를 많이 먹는다.
  - CompletedFuture 와 WebFlux/Reactive 둘다 코드가 어지럽다.

- Go : [Go/Fiber](https://github.com/gofiber/fiber) + [GORM](https://gorm.io/ko_KR/index.html)
  - 공부할 시간이 있다면, Go 언어로 가자!
    + 다만, 시행착오까지 넘어서는데 어렵지 않을런지 걱정
    + 참고: [Building a REST API With Go, Gin Framework, and GORM](https://betterprogramming.pub/building-a-rest-api-with-go-gin-framework-and-gorm-38cb2d6353da)
  - 클라우드, Docker, Serverless 등 어디서나 안정적인 고성능 보장
  - 고성능 마이크로서비스 개발시 [gRPC/protobuf](https://docs.nestjs.com/microservices/grpc)(HTTP/2)

### 2) 백엔드 GraphQL API

- Node : [Nestjs/Express + Prisma + GraphQL](https://www.prisma.io/nestjs)
  + 성능 업그레이드 TIP!
    * (2배) 빠른 성능을 원한다면 [Nestjs+Fastify](https://docs.nestjs.com/techniques/performance)
    * 실시간 처리를 원한다면 [gRPC/protobuf](https://docs.nestjs.com/microservices/grpc)(HTTP/2)
  + 호환성과 빠른 개발이 가능하다. 프론트엔드와 공동작업이 편하다.
  + Docker 배포나 고가용성 처리 등 유틸리티도 많아 편리하다.

### 3) 백엔드 ML/DL API

- Python : [FastAPI + Async RDB](https://fastapi.tiangolo.com/advanced/async-sql-databases/), [FastAPI + MongoDB](https://www.mongodb.com/developer/languages/python/python-quickstart-fastapi/)
  + 딥러닝 모델을 다루는 경우 : [깃허브/FastAPI-TensorFlow-Docker](https://github.com/TiagoPrata/FastAPI-TensorFlow-Docker)
  + 위성 시공간 데이터 stac-api : [깃허브/stac-fastapi-elasticsearch](https://github.com/stac-utils/stac-fastapi-elasticsearch)
  + 정말 못다루는게 없다. 데이터 조작이 필요한 곳은 어디에나 알맞다.
    * numpy, pandas/arrow, [sklearn, gensim](https://www.kaggle.com/code/morrisb/compare-lda-topic-modeling-in-sklearn-and-gensim), nltk

#### 케이스 검토 : Nodejs vs Python

최근에는 Python 쪽의 async 라이브러리가 발전되어 Nodejs 와 비등해졌다. 게다가 Faster Python 프로젝트로 더 빨라질 것으로 기대되고 있다. 반면에, Nodejs 는 16버전에 들어서 성능 향상의 정체기에 들어선 것으로 보고 있다. [&lt;참조&gt;](https://medium.com/@ersun.warncke/benchmarking-node-js-v12-vs-v10-v8-v6-v4-and-go-89d28eee603d)

- [Elasticsearch](https://wanago.io/2020/09/07/api-nestjs-elasticsearch/) 또는 [NoSQL](https://docs.nestjs.com/techniques/mongodb) 의 경우 둘다 사용하기 편하다. 
- ORM 과 GraphQL 라이브러리는 Nodejs 가 조금 더 편하고 빠르다.
  + 순전히 서드파티 차이인데, Python 쪽에도 더 좋은게 나올거다.
- 시각화 관련으로 Nodejs 가 우세하지만, 데이터 분석쪽은 Python 이다.
  + Web 기반이라 Nodejs 용 Canvas/WebGL 라이브러리가 풍부하다.

### 4) 프론트엔드 - Angular, React

웬만한 프론트엔드는 현재 보유한 Angular 기술로 개발 가능하다.

- Node : (Angular 도 좋지만) 전세계적으로 React 가 압승이다. 
  + 이미 만들어진 웹컴포넌트들을 활용하기 위해서 필요함
  + Nextjs 는 동적 렌더링과 정적 렌더링을 모두 지원한다.
    * 기왕 새로 배울거라면, Vue/Nuxtjs 를 익히는건 기회가 아깝다.
    * 빠른 개발을 위해 Gatsby 를 `우회로`로 삼는 방법도 있다.

- Python : [py-script 태동](https://docs.pyscript.net/latest/index.html)
  + 참고 : [Hello PyScript](https://towardsdatascience.com/hello-pyscript-goodbye-javascript-c8d8fb83a93a) 파이썬 결과를 출력하는 용도로 쓰일 것이다.
- Rust+WASM : [rust-wasm 예제들](https://rustwasm.github.io/wasm-bindgen/examples/todomvc.html)
  + 정말 작고 빠르다. 이제 커가는 중.

### 5) 모바일 크로스 플랫폼 - Flutter

- 1인 풀스택이면 Flutter 로 간다.
  + 왜냐하면 디자인 요소도 코드로 작성하니깐
  + 괜찮은 모바일앱 개발자가 있다면 고민할 필요 없고

> 그래서 결론이 뭐냐? 다 할거냐? 그건 아니고..
{: .prompt-tip }

#### 1인 개발시 Nestjs 백엔드에 Nextjs 프론트엔드 조합

- 백엔드
  + AI 및 데이터 서비스의 경우 FastAPI 백엔드로 간다.
  + 클라우드, 백엔드는 Nodejs 기반으로 간다.
    * 참고: [How I Created an Event-Driven Backend with RxJS..](https://javascript.plainenglish.io/how-i-created-an-event-driven-backend-with-rxjs-server-sent-events-and-expressjs-9f8be1ffc123)
  + 특수 목적별로 OpenSource 를 사용하자, ex) 댓글 API
    * [17 Best Open-source Self-hosted Commenting Systems](https://medevel.com/17-commenting-systems-open-source/)
- 프론트엔드
  + SSR : 블로그/쇼핑몰처럼 정적 페이지가 다수인 경우
    * 매일 1~2회 정적페이지 배포 + 댓글/이벤트 부분 동적콘텐츠
  + 필요하면 뭐든 사용하자. 쉽게쉽게 가는게 핵심이다.
    * [Gatsbyjs](https://www.gatsbyjs.com/why-gatsby) : 호스팅 서비스를 지원해 개발과 배포가 편함
      - 참고: [Comparison of Gatsby vs Next.js](https://www.gatsbyjs.com/features/jamstack/gatsby-vs-nextjs)
    * [Nextjs](https://launchdarkly.com/blog/whats-so-great-about-nextjs/) : 정적/동적/지연 렌더링을 빠르고 세밀하게 지원
  + [Tailwind CSS](https://tailwindcss.com/) 도 배우자 (스타일도 코딩이다)

- 1인 개발로, 모바일 퍼스트라면 Flutter 로 간다.
  + (Firebase 같은) BaaS 백엔드 이용시 개발이 순조롭다
  + REST API는 검색 같은 경우만 최소로 사용 (노력 낭비 방지)

&nbsp; <br/>

> 배워야할 것들이 많네
{: .prompt-warning }

1. 프론트엔드 : [서버리스 플랫폼](https://www.intuz.com/blog/netlify-vs-vercel-serverless-deployment-platform) + Next ([create-t3-app](https://reflect.run/articles/introduction-to-t3-stack-and-create-t3-app/))
2. 백엔드 : Nestjs + Prisma + GraphQL (클라우드 GraphQL도 좋다)
3. 네트워크 : Nginx + API Gateway, CDN
4. 데이터 : Raw 입력은 MongoDB, 정제 후 RDB 저장, 캐시 활용
5. 인프라 : AWS EC2/Lightsail + Docker + 로드밸런서 HA

&nbsp; <br/>

***

## 실무에서 요구하는 역량들

### 개발 공통

> 협업(co-work) 능력

- 코드 리뷰와 페어 프로그래밍
- JIRA, WIKI, Notiion 등으로 이슈 관리 및 문서화
- Scrum 개발 방법론: Daily Scrum, Sprint

> 개발환경 운영 능력

- 코드 관리 : Git
- 배포, 레지스트리 : Docker, [AWS ECS](https://docs.aws.amazon.com/ko_kr/AmazonECS/latest/userguide/create-container-image.html)
- CI/CD 자동화 : Jenkins/Github Action, [AWS CodePipeline](https://docs.aws.amazon.com/ko_kr/codepipeline/latest/userguide/welcome.html) <span style='font-size:1.5rem;'>&nbsp; &#127939;</span>

> 클라우드 활용 능력

- AWS S3, DynamoDB 등 데이터 저장소 사용한 개발
- AWS 서버리스 개발
  + [Zappa](https://github.com/zappa/Zappa) Serverless Python 
  + [AWS Lambda](https://aws.amazon.com/ko/lambda/) Python, Javascript, Go, ...
    * ==> Lambda 사용시 Go 사용을 추천, 아니면 Python


#### 참고문서

- [AWS Lambda battle 2021: 언어별 성능 비교](https://filia-aleks.medium.com/aws-lambda-battle-2021-performance-comparison-for-all-languages-c1b441005fd1)
  + API 지연 시간: 콜드/웜 스타트를 메모리 별로 비교
    * Java/VM계열은 메모리가 커야하고, 초기에 엄청 느림
    * Node 와 비슷한데, Python 이 더 안정적임 (256M 에서 최적)
    * Rust 가 최고이고 (초반 불안), Go 도 버금가는 성능을 보임
- [Spring Data JDBC 와 R2DBC 성능 비교](https://filia-aleks.medium.com/r2dbc-vs-jdbc-19ac3c99fafa)
  + 대체로 비슷한데, select 에서 R2DBC 가 2배 더 성능이 좋음

&nbsp; <br/>

***

### 검색 엔지니어

일단 백엔드의 절반은 먹고 들어가는 부분이다. 베스트 모델을 만들자!

> Job Description
{: .prompt-tip }

- 텍스트 검색어 추출, 이미지 메타정보 추출, 카테고리 구축
- 콘텐츠/상품 검색 시스템 및 랭킹 알고리즘 개발
- 대용량 트래픽과 장애에 견고한 검색 서비스 구축

> Skill Requirements
{: .prompt-info }

- DB + Fulltext-search + Cache 서비스 개발 <span style='font-size:1.5rem;'>&nbsp; &#128679;</span>
- Query DSL + Elasticsearch + Logstash 서비스 개발 <span style='font-size:1.5rem;'>&nbsp; &#128679;</span>
- 기계 학습 또는 자연어 처리에 대하여 경험이 있으신 분 <span style='font-size:1.5rem;'>&nbsp; &#10004;</span>
- Java/Python 등 하나 이상의 프로그래밍 언어에 능숙하신 분 <span style='font-size:1.5rem;'>&nbsp; &#10004;</span>

참고: [Amazon OpenSearch Service](https://docs.aws.amazon.com/ko_kr/opensearch-service/latest/developerguide/what-is.html) - EC2 사용량 기반 (싸지 않다)

&nbsp; <br/>

***

### 백엔드 개발자 (서비스 개발)

쇼핑, 커뮤니티 등의 트랜잭션 처리용 서비스 개발에 익숙해지자!

> Job Description
{: .prompt-tip }

- 리뷰 및 평점 시스템
- 소셜 네트워킹, 커뮤니티 플랫폼 설계 및 개발
- 예약발권 시스템 개발 및 운영
- 실시간 서비스 모니터링 및 복구 시스템 개발
- 운영 효율화를 위한 백오피스 개발 및 운영

> Skill Requirements
{: .prompt-info }

웹프레임워크 : Java/Spring, Node/Nestjs+Fastify, Python/FastAPI, ...

- 웹프레임워크 + ORM + Cache + REST API 개발 <span style='font-size:1.5rem;'>&nbsp; &#10004;</span>
- NoSQL(Redis, MongoDB, Elasticsearch) 기반 개발 <span style='font-size:1.5rem;'>&nbsp; &#127939;</span>
- 대규모 서비스 설계, 구축, 운영 경험 &nbsp; <span style='font-size:1.5rem;'>&nbsp; &#129300;</span>
  + AWS 환경에서 개발 경험
  + MSA(마이크로서비스), EDA(이벤트중심) 개발 경험

> Extra Requirements
{: .prompt-warning }

- Nginx + API게이트 : 웹서버 운용 <span style='font-size:1.5rem;'>&nbsp; &#127939;</span>
- Kafka, Prometheus, Grafana : 데이터 파이프라인, 모니터링 구축 <span style='font-size:1.5rem;'>&nbsp; &#128679;</span>
- 비동기 처리
  + Spring : WebFlux + Reactive
  + Nestjs : 태생이 비동기이다. 단, ORM 쓸 때는 주의!
  + FastAPI : [async/await](https://fastapi.tiangolo.com/async/), [Async SQL RDB](https://fastapi.tiangolo.com/advanced/async-sql-databases/)


&nbsp; <br/>

***

### 프론트엔드 개발자

가성비가 안나옴 => 프론트엔드 프레임워크의 힘을 최대한 빌리자

> Job Description
{: .prompt-tip }

- 고객 경험 고도화를 위한 UX 개발 (화면, 컨트롤러)
- 검색 최적화 서버 렌더링
- 경량화, CDN 배포

> Skill Requirements
{: .prompt-info }

- React/Nextjs, Typescript 기반 개발
- 다양한 Viewport를 지원하는 반응형 웹사이트 개발
- 단위/통합 테스트 코드 작성 경험이 있으신 분

> Extra Requirements
{: .prompt-warning }

- 웹 성능을 측정하여 개선한 경험이 있으신 분
- 웹표준 / 웹접근성에 대한 이해

&nbsp; <br/>

***

### 데이터 분석, 머신러닝/AI

가성비가 안나옴 => 알려진 모델을 찾아서 잘쓰자

> Job Description
{: .prompt-tip }

- 주제별 데이터 분석, 가설 수립, 성장 실험 등
- 데이터 분석 환경 구축 : 도구, 파이프라인

> Skill Requirements
{: .prompt-info }

- 코호트 분석, A/B 테스트, 퍼널 분석 등의 분석 방법론 경험
- Appsflyer, Adjust 등의 어트리뷰션 툴을 사용한 경험
- Google Analytics, Firebase, BigQuery 등의 로그분석툴 사용 경험

&nbsp; <br/>

***

### 데이터 엔지니어 (인프라/파이프라인)

하긴 해야 하는데, 최소로 구축하고 => 나중에 나중에 나중으로 미루자

> Job Description
{: .prompt-tip }

- 클라우드 환경(AWS) 에서의 대규모 DB 관리
- 무중단 서비스 운영을 위한 DB 아키텍처 설계, 구축 및 운영
- 데이타베이스 모니터링, 알림 및 자동 복구 환경 구축
- 대규모 데이터 아키텍처 설계, 검토 및 성능 개선

> Skill Requirements
{: .prompt-info }

- AWS Database Architecture : MySQL, PostgreSQL, Oracle
- CloudWatch, CloudFormation/Lambda

&nbsp; <br/>

> ___ **끝!** ___ &nbsp;