---
date: 2022-09-06 00:00:00 +0900
title: Best API 프레임워크와 Benchmark (2022년)
description: 언어에 상관 없이 API 용 웹 프레임워크에 대해 조사하고 성능 벤치마킹 자료를 살펴봅니다.
categories: [Backend]
tags: [api, framework, benchmark]
image: "https://res.cloudinary.com/dufh810os/images/c_scale,w_448,h_179,dpr_2/f_auto,q_auto/v1753873755/Best-API-Framework/Best-API-Framework.png?_i=AA"
---

## 최고의 웹 프레임워크 (API 서버)

원글에 더해 별 개수 조사와 프레임워크를 추가했습니다.

출처: [Best API Frameworks For Fast Performance](https://www.snapt.net/blog/best-api-frameworks-for-fast-performance) (2022.7)

### 1위. [Gin Web Framework](https://github.com/gin-gonic/gin) - 별 62.6k 개

마이크로서비스 바람이 불더니, Express.js 를 넘어섰네요. 백엔드 개발의 대세가 된 Go 언어는 도커와 쿠버네티스와도 잘 어울립니다.

> 예제 코드

```go
// example.go

package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
)

func main() {
  r := gin.Default()
  r.GET("/ping", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{
      "message": "pong",
    })
  })
  r.Run()  // listen and serve on 0.0.0.0:8080
}
```

> 설치 및 실행 

```shell
# 라이브러리 다운로드
$ go get -u github.com/gin-gonic/gin

# 예제 실행 => 0.0.0.0:8080/ping
$ go run example.go
```

### [Go-fastapi: a library to quickly build APIs](https://golangexample.com/go-fastapi-a-library-to-quickly-build-apis-it-is-inspired-by-pythons-popular-fastapi/)

go-fastapi is a library to quickly build APIs. It is inspired by Python’s popular FastAPI library.

> 예제 코드

```go
package main

import (
    "github.com/gin-gonic/gin"
    "github.com/sashabaranov/fastapi"

    "encoding/json"
    "fmt"
)

type EchoInput struct {
    Phrase string `json:"phrase"`
}

type EchoOutput struct {
    OriginalInput EchoInput `json:"original_input"`
}

func EchoHandler(ctx *gin.Context, in EchoInput) (out EchoOutput, err error) {
    out.OriginalInput = in
    return
}

func main() {
    r := gin.Default()

    myRouter := fastapi.NewRouter()
    myRouter.AddCall("/echo", EchoHandler)

    // for OpenAPI/Swagger
    swagger := myRouter.EmitOpenAPIDefinition()
    swagger.Info.Title = "My awesome API"
    jsonBytes, _ := json.MarshalIndent(swagger, "", "    ")
    fmt.Println(string(jsonBytes))

    // 라우터 url 맵핑
    r.POST("/api/*path", myRouter.GinHandler) // must have *path parameter
    r.Run()
}
```

> 설치 및 실행

```shell
$ go get github.com/sashabaranov/go-fastapi

$ go run example.go

# Try it:
$ curl -H "Content-Type: application/json" -X POST --data '{"phrase": "hello"}' localhost:8080/api/echo
# ==> {"response":{"original_input":{"phrase":"hello"}}}
```

### 2위. [Express.js + Node.js](https://github.com/expressjs/express) - 별 58.2k

가장 대중적인 javascript 언어에 오랜 시간 사용되어 온 웹 프레임워크

> 예제 코드

```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

> 설치 및 실행

```shell
$ npm install express --save

$ node app.js
```


### 3위. [FastAPI](https://github.com/tiangolo/fastapi) - 별 49k

Python 생태계가 커지면서 빠르게 사용자층이 늘어난 FastAPI. Nodejs 의 비동기 방식을 채택하여 성능을 높였다. 

> 예제 코드

```python
from typing import Union

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


#######################################
##  또는 async 호출로
##

@app.get("/")
async def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
```

> 설치 및 실행 

```shell
$ pip install fastapi
$ pip install "uvicorn[standard]"

$ uvicorn main:app --reload
```

### 4위. [Fastify](https://github.com/fastify/fastify) - 별 24.8k

Express.js 만 알고 있었는데, 훨씬 뛰어난 성능을 가진 Fastify 가 있었다. Nestjs 의 http 엔진을 Fastify 로 바꿔서 사용할 수 있다.

- [Nestjs - Performance (Fastify)](https://docs.nestjs.com/techniques/performance)
  - Express 엔진보다 2배 정도 빠르다고
  - 그럼에도 공식적으로 Express 를 채택하는 이유는 호환성과 서드파티가 많아서

> 예제 코드

```js
// ESM
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

// sync 호출
fastify.get('/sync', (request, reply) => {
  reply.send({ hello: 'world' })
})

// async 호출
fastify.get('/async', async (request, reply) => {
  reply.type('application/json').code(200)
  return { hello: 'world' }
})

// Run the server!
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err
  // Server is now listening on ${address}
})
```

> 설치 및 실행

```shell
$ yarn add fastify

$ npm init fastify

$ npm start
```

#### Fastify 에서 제시하는 Benchmarks

__Machine:__ EX41S-SSD, Intel Core i7, 4Ghz, 64GB RAM, 4C/8T, SSD.

__Method:__: `autocannon -c 100 -d 40 -p 10 localhost:3000` * 2, taking the
second average

| Framework          | Version                    | Router?      |  Requests/sec |
| :----------------- | :------------------------- | :----------: | ------------: |
| Express            | 4.17.3                     | &#10003;     | 14,200        |
| hapi               | 20.2.1                     | &#10003;     | 42,284        |
| Restify            | 8.6.1                      | &#10003;     | 50,363        |
| Koa                | 2.13.0                     | &#10007;     | 54,272        |
| **Fastify**        | **4.0.0**                  | **&#10003;** | **77,193**    |
| -                  |                            |              |               |
| `http.Server`      | 16.14.2                    | &#10007;     | 74,513        |


### 5위. [Fiber](https://github.com/gofiber/fiber) - 별 22.2k

Fiber 는 Go 언어에서 가장 빠른 `Fasthttp` 엔진 기반으로 만들어진 웹 프레임워크. 빠른 개발과 최적의 메모리 활용을 제공한다.

![Golang WebFrameworks Performance Benchmark](https://miro.medium.com/v2/resize:fit:1400/1*EmDS4L2_s3SykfI0xxamLA.png){: width="440" .w-75}

> 예제 코드

```go
package main

import "github.com/gofiber/fiber/v2"

func main() {
    app := fiber.New()

    app.Get("/", func(c *fiber.Ctx) error {
        return c.SendString("Hello, World 👋!")
    })

    app.Listen(":3000")
}
```

### 6위. [Phoenix + Elixir](https://github.com/phoenixframework/phoenix) - 별 18.5k

몰랐던 웹 프레임워크인데, 성능상 최고의 웹 프레임워크이다. 분산시스템을 기반으로 동작하기 때문에 무한히 수평확장을 할 수 있다. 별도의 소켓 기반 클라이언트가 필요하다.

#### [Elixir (엘릭서) 언어란?](https://velog.io/@gudrb33333/Elixir엘릭서-Erlang얼랭)

Elixir는 José Valim이 개발한 함수형 프로그래밍 언어로, 고성능 분산 Erlang VM (BEAM)에서 돌아갑니다. 따라서 엘릭서 컴파일러는 소스코드를 Erlang VM 바이트 코드로 컴파일합니다.

- Elixir 창시자인 José Valim은 이러한 Erlang에 특징에서 메타프로그래밍, 다형성, 프로덕션 환경에서 사용할 수 있는 툴과 같이 일상적으로 사용하는 기능에 대한 지원을 추가하여 Elixir를 만들었습니다.
- 동시성과 메시지 전달은 언어의 기본입니다. Erlang으로 작성된 애플리케이션은 종종 수백 또는 수천 개의 경량 프로세스로 구성됩니다. Erlang 프로세스 간의 컨텍스트 전환은 일반적으로 C 프로그램의 스레드 간 전환보다 1-2배 저렴합니다.
- Erlang으로 작성된 애플리케이션은 통신,메시징과 관련된 서버에 강점이 있고 서로 메시지를 주고 받는 수백,수천개의 경량 프로세스로 돌아간다고 할 수 있습니다.


#### [Phoenix Channels JavaScript client](https://hexdocs.pm/phoenix/js/index.html) v1.6.11

> 예제 코드

```js
let socket = new Socket("/socket", {params: {userToken: "123"}})
socket.connect()

let channel = socket.channel("room:123", {token: roomToken})

channel.on("new_msg", msg => console.log("Got message", msg) )

$input.onEnter( e => {
  channel.push("new_msg", {body: e.target.val}, 10000)
    .receive("ok", (msg) => console.log("created message", msg) )
    .receive("error", (reasons) => console.log("create failed", reasons) )
    .receive("timeout", () => console.log("Networking issue...") )
})

channel.join()
  .receive("ok", ({messages}) => console.log("catching up", messages) )
  .receive("error", ({reason}) => console.log("failed join", reason) )
  .receive("timeout", () => console.log("Networking issue. Still waiting..."))

```

- - - -

## 벤치마크 : FastAPI, Fastify, Spring, Gin

출처: [FastAPI vs. Fastify vs. Spring Boot vs. Gin Benchmark](https://www.travisluong.com/fastapi-vs-fastify-vs-spring-boot-vs-gin-benchmark/) (01.10.2022)

저자는 Node.js와 동등하다는 FastAPI의 주장을 확인하기 위해 이 벤치마크를 수행했다고 합니다.

### 1) 저자의 결론

- FastAPI는 기본적으로 빠르지 않습니다. FastAPI의 속도를 최대한 활용하려면 asyncpg와 같은 올바른 데이터베이스 드라이버를 사용해야 합니다.
- asyncpg를 사용하더라도 FastAPI와 함께 더 빠른 json 라이브러리를 사용하여 성능을 Node.js 수준까지 끌어올려야 합니다.
- 원시 sql 쿼리에서 json으로 이동하는 것은 ORM을 사용하는 것보다 훨씬 빠르며, 이는 개체 매핑 프로세스를 건너뛰므로 의미가 있습니다. 
- 직접 확인하지는 않았지만 컴파일된 언어가 인터프리터 언어보다 빠르다는 말을 항상 들었습니다. Java/Go는 해석된 언어의 유사한 설정에 비해 실제로 더 빠릅니다.
- Node.js에는 Node.js 프로세스 클러스터를 시작하여 멀티 코어 시스템을 활용할 수 있는 클러스터 모듈이 있습니다. 
- 로깅은 성능에 영향을 줍니다.

> 최적의 조합 구성시 Node 와 Python 프레임워크의 성능이 비등
> 
> 04) FastAPI + asyncpg + ujson + gunicorn 8w (4831 req/sec)<br />
> 05) Fastify + pg + cluster mode 8w (without logging) (4622 req/sec)

### 2) The Rankings

- 01) Spring Boot + jdbc (7886 req/sec)
  - 20) SpringBoot + JPA (844 req/sec)

- 02) Go + pgx (7517 req/sec)
  - 03) Go + pg + SetMaxOpenConns + SetMaxIdleConns (7388 req/sec)

- 04) FastAPI + asyncpg + ujson + gunicorn 8w (4831 req/sec)
  - 06) FastAPI + asyncpg + ujson + gunicorn 4w (4401 req/sec)
  - 07) FastAPI + asyncpg + gunicorn 4w + orjson (4193 req/sec)
  - 14) FastAPI + asyncpg + uvicorn + orjson (1885 req/sec)
  - 15) FastAPI + asyncpg + uvicorn + ujson (1711 req/sec)
  - 18) FastAPI + psycopg2 + gunicorn 4w (989 req/sec)
  - 19) FastAPI + asyncpg + gunicorn 4w (952 req/sec)
  - 21) FastAPI + psycopg2 + uvicorn + orjson (827 req/sec)
  - 23) FastAPI + SQLModel + gunicorn 4w (569 req/sec)
  - 25) FastAPI + asyncpg + uvicorn (314 req/sec)
  - 26) FastAPI + psycopg2 + uvicorn (308 req/sec)
  - 27) FastAPI + databases + uvicorn (267 req/sec)
  - 28) FastAPI + SQLModel + uvicorn (182 req/sec)

- 05) Fastify + pg + cluster mode 8w (without logging) (4622 req/sec)
  - 09) Fastify + pg + cluster mode 8w (3417 req/sec)
  - 11) Fastify + pg (without logging) (2750 req/sec)
  - 12) Fastify + pg (2184 req/sec)

- 08) Express.js + pg + cluster mode 8w (4145 req/sec)
  - 13) Express.js + pg (1931 req/sec)
  - 17) Nest.js + Prisma (1184 req/sec)

- 10) Gin + database/sql + lib/pq (2966 req/sec)

- 16) Flask + psycopg2 + gunicorn 4w (1478 req/sec)
  - 22) Flask + psycopg2 + flask run (705 req/sec)
  - 24) Flask + psycopg2 + gunicorn 1w (536 req/sec)


### 3) 제 나름의 정리

#### 복잡한 비즈니스 요구가 아니면 JDBC + json 조합 고려

- 어떤 프레임워크이든 ORM 이 붙게되면 1/4 로 성능 저하 (심지어 10배까지)
- 성능이 우선되어야 한다면 JDBC 와 SQL + Json Mapper 조합이 좋겠다는 것
  - 코드의 유지보수, 모델부터 일체화된 디자인 등의 정석적 이득을 다소 희생
    - 사실 정석은 어디까지나 정석일뿐이고
    - ORM 은 JSON 변환 뿐만 아니라 sql 관련 기능이 많아 무겁다
  - 비교적 단순한 스키마와 참조 테이블이 얼마 안되면 ORM 안써도 된다
- ORM 을 써야 한다면 JPA 말고 대체제를 찾아보자
  - iBatis 가 좋겠다

#### 웹 프레임워크, ORM 등 차세대 버전들은 async 이전 중

> 07) FastAPI + asyncpg + gunicorn 4w + orjson (4193 req/sec)<br />
> 18) FastAPI + psycopg2 + gunicorn 4w (989 req/sec)

- SQLAlchemy 도 2.0 으로 가면서 asynio 기반으로 변환중
- DB 어댑터들도 asyncpg, aiomysql 등으로 교체중 
- 이러한 이슈는 한 5~7년 전에도 나왔었는데, 지금이 그 타이밍인듯
  - 많은 부분이 함께 async 를 지원해야 제성능이 나오니깐

#### Java/Spring-boot, Go/Gin (Go/Fiber)

> 01) Spring Boot + jdbc (7886 req/sec)<br />
> 20) SpringBoot + JPA (844 req/sec)

- 기본적인 구성으로도 가장 좋은 성능을 보이는 프레임워크
  - 컴파일 언어 특성탓
- Java 가 싫거나 싫증났다면 Go 로 가보자
  - Go 계열 스택을 알아보자 (JPA 보다는. 낫겠지)
    - [Building a REST API With Go, Gin Framework, and GORM](https://betterprogramming.pub/building-a-rest-api-with-go-gin-framework-and-gorm-38cb2d6353da)
    - [GORM: Golang을 위한 최고의 ORM 라이브러리](https://gorm.io/ko_KR/index.html)
- Go/Gin (별 62.6k) 프레임워크가 가장 대중적이긴 한데, 차세대 프레임워크가 있다.
  - [Go/Fiber](https://github.com/gofiber/fiber) - 별 22.2k

#### Node/Fastify

> 12) Fastify + pg (2184 req/sec)<br />
> 13) Express.js + pg (1931 req/sec)<br />
> 17) Nest.js + Prisma (1184 req/sec)

- Node 계열에서는 확실히 Fastify 를 선택하는게 좋겠다는 것
- Fastify 의 ORM 으로 [prisma](https://www.prisma.io/docs/) 를 써봐야겠다는 것
  - [Easy Database Access in Fastify servers](https://www.prisma.io/fastify)
  - Nest.js + Prisma 조합에서 ORM 에 의한 페널티가 크지 않았음

#### Python/FastAPI

> Node 구성
> 
> 12) Fastify + pg (2184 req/sec)<br />
> 13) Express.js + pg (1931 req/sec)<br />

> Python 구성
> 
> 21) FastAPI + psycopg2 + uvicorn + orjson (827 req/sec)<br />
> 26) FastAPI + psycopg2 + uvicorn (308 req/sec)

- 기본 구성에서는 Node 성능에 비해 Python 의 프레임워크가 열악하고
- FastAPI 를 쓸거면 orjson 을 꼭 쓰자 (2배 성능 향상)
  - [Custom Response - use ORJSON Response](https://fastapi.tiangolo.com/advanced/custom-response/#use-orjsonresponse)
    - 추가: [ujson](https://fastapi.tiangolo.com/advanced/custom-response/#ujsonresponse)

> ORJSON 예제 코드

```python
from fastapi import FastAPI
from fastapi.responses import ORJSONResponse

app = FastAPI()


@app.get("/items/", response_class=ORJSONResponse)
async def read_items():
    return ORJSONResponse([{"item_id": "Foo"}])
```

> UJSON 예제 코드

```python
from fastapi import FastAPI
from fastapi.responses import UJSONResponse

app = FastAPI()


@app.get("/items/", response_class=UJSONResponse)
async def read_items():
    return [{"item_id": "Foo"}]
```

## 9. Review

- 성능이 뛰어나다는 것과 생산성이 뛰어난 것은 의미가 다르다.
  + python 버전은 성능은 느릴지라도, 빨리 개발할 수 있어 인기가 높다.
  + 투자 대비 효과는 단연 nodejs 계열이다.
- 풀스택 개발 언어로는 nodejs 가 적절하다. 수많은 사용 사례가 있다.
  + 반면에 go 언어는 백엔드 전용, 동시성 처리, 성능 중심이다.
- Spring 은 과거에도, 현재도 가장 사랑받는 백엔드 프레임워크이다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
