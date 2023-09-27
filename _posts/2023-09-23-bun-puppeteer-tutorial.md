---
date: 2023-09-23 00:00:00 +0900
title: Bun 에서 Puppeteer 사용하기
categories: ["backend","scraper"]
tags: ["bun", "elysia", "puppeteer", "tutorial"]
image: "https://miro.medium.com/v2/resize:fit:290/1*kk8ovQKB-45FsZ8TZM-vjg.png"
---

> Puppeteer 는 웹자동화, 스크래핑 목적으로 사용되는 Chrome 헤드리스 브라우저 기반의 Node.js 라이브러리입니다. Bun 에서도 작동된다고 해서 사용해보려 합니다.
{: .prompt-tip }

## 0. 개요

- [x] Bun 1.0.3 + elysiajs (express 로 시작했다가 바꿈)
- [x] Puppeteer : 네이버 장소 검색 
- [x] Docker : bun + elysia + puppeteer

> 참고자료

- [Puppeteer 공식문서](https://pptr.dev/)
- [Create your own screenshot API using Puppeteer + ExpressJS](https://medium.com/@mishra.ankit/use-puppeteer-expressjs-to-create-your-own-screenshot-api-e5e7559cc32b)
- [Bun 블로그 - Use Puppeteer in Bun](https://bun.sh/blog/bun-v0.6.7#use-puppeteer-in-bun)
  + [Jarred Sumner 의 Tweet](https://twitter.com/jarredsumner/status/1664892235966734337)


<img alt="Use Puppeteer in Bun" src="https://pbs.twimg.com/tweet_video_thumb/FxrijgDagAA4Pb7.jpg" width="600px" />

## 1. Express 프로젝트

### Bun 프로젝트 생성

```bash
mkdir puppeteer-api
cd puppeteer-api

bun init 

bun run index.ts 
# Hello Bun!
```

### [bun + express 예제](https://bun.sh/guides/ecosystem/express)

- Typescript
- cors, json 플러그인
- query, path 파라미터 읽기
- get, post 메소드

```bash
bun add express cors
bun add -D @types/express @types/cors
```

```ts
// index.ts
import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/query', async (req, res) => {
  const { searchString }: { searchString?: string } = req.query;
  res.json({ type: 'query', searchString });
});

app.get('/param/:id', async (req, res) => {
  const { id } = req.params;
  res.json({ type: 'param', id });
});

(() => {
  const port = process.env.PORT || 8000;
  try {
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
```
{: file="index.ts"}

### [Express + Zod Typescript 예제](https://dev.to/franciscomendes10866/schema-validation-with-zod-and-expressjs-111p)

- zod 스키마 정의
- 스키마 검사 함수 정의
- app 메소드에 스키마 검사 함수를 RequestHandler 로 등록

```bash
bun add zod
```

```ts
import express, { Request, Response, NextFunction } from 'express';
import { z, AnyZodObject } from 'zod';

/* ... */

const LoginSchema = z.object({
  // In this example we will only validate the request body.
  body: z.object({
    // email should be valid and non-empty
    email: z.string().email(),
    // password should be at least 6 characters
    password: z.string().min(6),
  }),
});

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    if (!result.success) {
      const formatted = result.error.format();
      return res.status(400).json(formatted.body);
    }

    next();
  };

app.post('/login', validate(LoginSchema), (req, res) => {
  return res.json({ ...req.body });
});
```

### 참고 : [Stop using express.js](https://dev.to/sebastian_wessel/stop-using-expressjs-4io)

> Express.js 는 오래된 레거시 코드이다. (버전 5-beta 는 2022년 초에 멈춤)

- [Koa v2.14.2](https://koajs.com/) : 관리되지 않음(사망)
  - Express.js 의 최신 버전 (비동기 지원)

- [Feathers.js v4.5.18](https://feathersjs.com/)
  - REST-API 에 중점을 두고 있고, 멋진 개념과 사용하기 쉽다는 장점이 있음
  - 서비스와 별개로 Server 기능을 위해 socketio, koa 등을 결합시켜야 한다. 
  - Nestjs 의 대체용으로 쓸 수 있다.

- 웹프레임워크 3대장 : [Fastify](https://www.fastify.io/), [Restify](http://restify.com/), [Hapi](https://hapi.dev/)
  - REST-API 구축을 위한 다양한 기능을 제공

- [Hono v3.7.2](https://hono.dev/) : 블로그 저자가 찬양하는 프레임워크
  - 웹표준을 준수하여 Bun, Deno, AWS, Vercel 등 거의 모든 플랫폼 위에서 작동됨
  - 더욱이 속도도 빠름

- [Elysia.js v0.7](https://elysiajs.com/) : Bun 에 특화된 프레임워크
  - Hono 보다 약간 더 빠름 (벤치마크에서 둘 다 최상위)
  - 참고 : [Bun: Elysia.js vs Hono — Hello world](https://medium.com/deno-the-complete-reference/bun-elysia-js-vs-hono-hello-world-b655a20f1f2b)


## 2. [puppeteer](https://pptr.dev/) 다루기

### Headless Chrome 브라우저 및 puppeteer 설치

- [테스트용 크롬 브라우저 다운로드 방법](https://developer.chrome.com/blog/chrome-for-testing/#how-can-i-get-chrome-for-testing-binaries)
  - 일반 사용자가 아닌 개발용, 테스트용이라서 아래 방법으로만 다운로드가 가능하다

```bash
bunx @puppeteer/browsers install chrome@stable
# => download to './chrome/mac_arm-117.0.5938.92/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'

bun add puppeteer
```

### [puppeteer 예제](https://pptr.dev/#usage) : 네이버 검색

1. headless 브라우저 및 페이지 생성
2. `https://naver.com` 이동 및 화면 사이즈 설정
3. 검색창 선택(focus) 후 검색어 입력(type)
4. 검색버튼 클릭
5. (선택사항) 1초 딜레이 : `page.waitForTimeout` 는 없어졌음
6. 장소검색 섹션 선택
7. 이어서, 섹션 내부의 모든 장소 아이템 선택 : `$$(selector)`
8. 장소 아이템의 title 선택 후 evaluate
9. `Promise.all` 로 값 배열 변환 후 출력

```ts
// puppeteer-demo.ts
import puppeteer, { TimeoutError } from 'puppeteer';
import { sleep } from 'bun';

(async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],  // (도커) root 실행 아니더라도 필요하다
    executablePath:
      './chrome/mac_arm-117.0.5938.92/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(10000); // 10 sec

  try {
    console.log('1. navigate the page to a URL');
    await page.goto('https://naver.com/', {
      waitUntil: 'load',
      timeout: 6000, // 6 sec
    });
    // Set screen size
    await page.setViewport({ width: 1280, height: 1024 });

    console.log('2. focus search_input_box');
    const searchInputSelector = '.search_input_box > input';
    await page.waitForSelector(searchInputSelector);
    await page.focus(searchInputSelector);

    console.log('3. Type into search box');
    await page.type(searchInputSelector, '제주도 맛집');

    // Wait and click search Button
    const searchButtonSelector = '.btn_search';
    await page.waitForSelector(searchButtonSelector);
    await page.click(searchButtonSelector);

    // deprecated: await page.waitForTimeout(1000)
    // await new Promise((r) => setTimeout(r, 1000));
    await sleep(1000);  // with Bun

    console.log('4. Wait and click on first result');
    const searchResultSelector = '.place-app-root .api_subject_bx ul';
    const placesSection = await page.waitForSelector(searchResultSelector);

    const placeHandles = await placesSection?.$$('li');
    const titles = placeHandles?.map(async (handle) => {
      const titleSelector = await handle.$('.place_bluelink');
      return await titleSelector?.evaluate((el) => el.textContent);
    });

    const values = await Promise.all(titles ?? []);
    console.log(`==> ${values.join('|')} (size=${values.length})`);
  } 
  catch (e) {
    if (e instanceof TimeoutError) {
      console.log('** TimeoutError:', e);
    } else {
      console.log('** Other Errors:', e);
    }
  } 
  finally {
    await page.close();
    await browser.close();
  }
})();
```

> Bun 런타임으로 ts 파일 직접 실행 (편하다!)

```console
$ bun run puppeteer-demo.ts
1. Navigate the page to a URL
2. focus search_input_box
3. Type into search box
4. Wait and click on first result
==> 연남물갈비 서귀포점|제주곰집|우진해장국|제주광해 애월|런던베이글뮤지엄 제주점|올래국수|이춘옥원조고등어쌈밥 제주애월본점|아베베베이커리 (size=8)
```

#### [bun and puppeteer with Docker](https://github.com/puppeteer/puppeteer/blob/main/docker/Dockerfile)

- Mac OS (Apple M1) 에서는 Chrome 브라우저를 설치해도 안된다.
  - 오류 `E: Unable to locate package google-chrome-stable`
  - :arrow_right: &nbsp; Ubuntu 서버의 Docker 에서는 잘 작동한다.
- 테스트용 Headless 브라우저가 단독으로는 실행이 안된다.
  - google-chrome-stable 설치가 되어 있어야 실행된다.

- root 권한으로 Chrome 브라우저를 실행하려면 `--no-sandbox` 옵션 필요
  - 이슈 [Running as root without --no-sandbox is not supported](https://github.com/puppeteer/puppeteer/issues/3698)

- 옵션 `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`
  - 참고 : [How to use Puppeteer inside a Docker container](https://dev.to/cloudx/how-to-use-puppeteer-inside-a-docker-container-568c)

> 도커 `oven/bun` 이미지에 이미 USER `bun` 이 있다. 이용하자!

```Dockerfile
FROM oven/bun as base

# npm/yarn 등으로 패키지 설치시, 테스트용 브라우저 다운로드를 건너뛰기
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

RUN apt-get update \
    && apt-get install -y wget gnupg \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/googlechrome-linux-keyring.gpg \
    && sh -c 'echo "deb [arch=amd64 signed-by=/usr/share/keyrings/googlechrome-linux-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-khmeros fonts-kacst fonts-freefont-ttf libxss1 \
      --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# USER 'bun' already exists
RUN chown -hR bun:bun /home/bun

# FROM base as build
USER bun
WORKDIR /home/bun/app

COPY --chown=bun:bun . /home/bun/app
RUN bun install

EXPOSE 8080
ENV PORT 8080
CMD ["bun", "./src/index.ts"]
```

> `chrome` 디렉토리에 복사된 테스트용 Headless 브라우저는 복사해서 사용한다.

```dockerignore
.dockerignore
Dockerfile
.gitignore
/node_modules
*.md
bun.lockb
```

> 도커 빌드 및 실행 (image size 1.2GB)

```bash
docker build -t bun-puppeteer .

docker run -it -P --rm bun-puppeteer bash

docker run -d -p 8080:8080 -v `pwd`/data/:/home/bun/data \
  --rm --name bun-puppeteer-app bun-puppeteer

docker exec -it bun-puppeteer-app bash  

docker stop bun-puppeteer-app
```

## 3. Elysia + Puppeteer

### Elysia 프로젝트 생성

```bash
bun create elysia puppeteer-api
cd puppeteer-api

bun dev
```

#### 라우팅 및 파라미터 처리 (Context)

- [Context](https://elysiajs.com/concept/handler.html#context) 는 라우터 [Handler](https://elysiajs.com/concept/handler.html#handler) 가 처리할 입력 구조체이다.
  - request, body, query, params, store, set 등을 속성으로 보유
- query 파라미터와 path 파라미터 모두 context 로 접근할 수 있다.
  - `app.get('/id/:id', (context) => context.params.id)`

> Handler 의 출력은 표준 Response 부터 text, json, html 등 다양하게 처리한다.

```ts
app
  .get('/', () => 'Hello Elysia');

app
  .get('/path/:id', ({ params: { id } }) => {
    console.log(`path params: id=${id}`);
    return new Response(
      JSON.stringify({
        type: 'path',
        params: [id],
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  })
  .get('/query', ({ query: { id } }) => {
    console.log(`query params: id=${id}`);
    return {
      type: 'query',
      params: [id],
    };
  });
```

#### [Elysia Lifecycle](https://elysiajs.com/concept/life-cycle.html#life-cycle-1) : `onStart`, `onStop`, `onError`

- [`Ctrl-C` 탈출 시 `SIGINT` OS 이벤트를 처리할 수 있다](https://bun.sh/guides/process/os-signals)

```ts
import { Elysia, NotFoundError } from 'elysia';

const app = new Elysia()
  .onError(({ code, error, set }) => {
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return 'Not Found :(';
    }
    return new Response(error.toString());
  })
  .onStart(() => {
    console.log('💫 start!');
  })
  .onStop(() => {
    console.log('💤 stop!');
  });

app
  .post('/', () => {
    throw new NotFoundError();
  });

(() => {
  const port = process.env.PORT || 8000;
  try {
    app.listen(
      {
        port,
        hostname: '0.0.0.0',
      },      
      ({ hostname, port }) => {
        console.log(`🦊 Elysia is running at ${hostname}:${port}`);
      }
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }

  process.on('SIGINT', () => {
    console.log('\n\nReceived SIGINT');
    app.stop();
  });
})();  
```

- 시작시 puppeteer 또는 DB 접속을 처리하고
- 종료시 자원 해제, 접속 해제 등을 처리한다.

```console
$ bun run src/index.ts
💫 start!
🦊 Elysia is running at 0.0.0.0:8000
query params: id=999
^C

Received SIGINT
💤 stop!
```

### [HTML Plugin](https://elysiajs.com/plugins/html.html)

```bash
bun add @elysiajs/html
```

> 브라우저 상에서 보이는 html 출력이 text 응답과 html 응답이 조금 다르다.

```ts
import { html } from '@elysiajs/html';

const app = new Elysia()
  .use(html())
  .get(
    '/html',
    () => `
  <html lang="en">
      <head>
          <title>Hello World</title>
      </head>
      <body>
          <h1>Hello World v1</h1>
      </body>
  </html>  `
  )
  .get('/html-plugin', ({ html }) =>
    html(`
  <html lang="en">
      <head>
          <title>Hello World</title>
      </head>
      <body>
          <h1>Hello World v2</h1>
      </body>
  </html>  `)
  );
```

### puppeteer 와 [Decorate](https://elysiajs.com/concept/state-decorate.html)

앞의 puppeteer 예제를 두 부분으로 분리하여 elysia context 에 연결한다.

- `scraper.ts`
  - launchBrowser : `async (): Promise<Browser>`
  - searchPlaces : `async (browser: Browser, q: string): string[]`

- `index.ts`
  - `decorate` 를 이용해 context 에 속성으로 등록하여 handler 에서 사용
  - 참고: [Create a CRUD App with Bun and Elysia.js](https://dev.to/gaurishhs/create-a-crud-app-with-bun-and-elysiajs-gjn)

좀 더 nice 하게 하려면 [Dependency Injection](https://elysiajs.com/patterns/dependency-injection.html) 를 참고할 것.

```ts
import { launchBrowser, searchPlaces } from '$lib/scraper';
import { Browser } from 'puppeteer';

const app = new Elysia()
  .decorate('browser', await launchBrowser())
  .onStart(async ({ browser }) => {
    if (browser && browser instanceof Browser) {
      console.log('Browser version :', await browser.version());
    }
  })
  .onStop(async ({ browser }) => {
    if (browser && browser instanceof Browser) {
      await browser.close();
      console.log('Browser is closed!');
    }
  });

app.get('/search', async ({ browser, query: { q } }) => {
  console.log(`query params: q="${q}"`);
  if ((q?.trim()?.length || 0) === 0) {
    throw new Error('invalid empty query');
  }
  return {
    query: q,
    results: await searchPlaces(browser, q as string),
  };
});    
```

```console
$ bun run src/index.ts
🦊 Elysia is running at 0.0.0.0:8000
Browser version : Chrome/117.0.5938.92
query params: q="경포대 일식"
^C

Received SIGINT
Browser is closed!

$ curl -X GET "http://localhost:8000/search?q=경포대%20일식"
{
  "query":"경포대 일식",
  "results":[
    "마카","메시56","고성장미경양식","루이식당","시나미83","봉창이해물샤브칼국수"
  ]
}%
```

## 9. Summary

- 삼천포로 빠진거 같다.
- 요즘 게으름을 피우고 있다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
