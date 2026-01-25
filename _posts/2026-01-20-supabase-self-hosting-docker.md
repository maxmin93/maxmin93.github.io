---
date: 2026-01-20 00:00:00 +0900
title: Supabase 셀프 호스팅 가이드
description: Supabase 는 백엔드를 위한 거의 모든 기능을 포함하고 있다. 클라우드에서 하나의 서비스를 사용할 수 있지만, 개발용으로 다루기 위해서는 셀프 호스팅이 편리하다. 요즘은 AI 애플리케이션을 개발하기 위해 인기가 더 높아졌다.
categories: [Backend, Supabase]
tags: [docker]
image: "https://supabase.com/_next/image?url=https%3A%2F%2Ffrontend-assets.supabase.com%2Fwww%2F3b7bba9a9aa5%2F_next%2Fstatic%2Fmedia%2Flogo-preview.50e72501.jpg&w=3840&q=75"
---

오랜만에 다뤄 보려고 하니깐 기억도 안나고 해서, 초심자의 마음으로 정리합니다.


## 1. Docker 기반 셀프 호스팅

따라하기 : [공식문서 - Self-Hosting with Docker](https://supabase.com/docs/guides/self-hosting/docker)

1. 깃허브 다운로드 : 2026년 1월기준 [최신 태그 v1.26.01](https://github.com/supabase/supabase/releases/tag/v1.26.01)
2. 인스턴스용 디렉토리 생성
3. 환경파일 복사
4. 도커 이미지 다운로드
5. 환경파일 키 생성 및 수정 (`generate-keys.sh`)
6. 도커 컴포즈 시작

따라하기만 하면 된다.

```console
# Get the code
git clone --depth 1 https://github.com/supabase/supabase

# Make your new supabase project directory
mkdir supabase-project

# Tree should look like this
# .
# ├── supabase
# └── supabase-project

# Copy the compose files over to your project
cp -rf supabase/docker/* supabase-project

# Copy the fake env vars
cp supabase/docker/.env.example supabase-project/.env

# Switch to your project directory
cd supabase-project

# Pull the latest images
docker compose pull
```

키를 자동으로 생성하고 적용하는 스크립트가 있어서 편하다.

```console
# 키 생성 및 환경파일 수정 (자동)
sh ./utils/generate-keys.sh

# => JWT_SECRET, ANON_KEY, SERVICE_ROLE_KEY,
#   SECRET_KEY_BASE, VAULT_ENC_KEY, PG_META_CRYPTO_KEY,
#   LOGFLARE_PUBLIC_ACCESS_TOKEN, LOGFLARE_PRIVATE_ACCESS_TOKEN,
#   S3_PROTOCOL_ACCESS_KEY_ID, S3_PROTOCOL_ACCESS_KEY_SECRET,
#   POSTGRES_PASSWORD, DASHBOARD_PASSWORD
```

이 중에 DASHBOARD_PASSWORD 와 POSTGRES_PASSWORD 는 따로 작성하자. 그리고 psql 접속에 사용되는 POOLER_TENANT_ID 도 기억하기 쉽도록 수정한다.

```console
vi .env

DASHBOARD_PASSWORD=...
POSTGRES_PASSWORD=...
POOLER_TENANT_ID=dev-server
```

준비는 다 되었고, supabase-project 디렉토리에서 명령어를 실행한다.

```console
# 시작
$ docker compose up -d
WARN[0000] No services to build
[+] up 14/14
 ✔ Network supabase_default                 Created
 ✔ Container supabase-imgproxy              Created
 ✔ Container supabase-vector                Healthy
 ✔ Container supabase-db                    Healthy
 ✔ Container supabase-analytics             Healthy
 ✔ Container supabase-pooler                Created
 ✔ Container supabase-kong                  Created
 ✔ Container supabase-auth                  Created
 ✔ Container supabase-meta                  Created
 ✔ Container realtime-dev.supabase-realtime Created
 ✔ Container supabase-rest                  Created
 ✔ Container supabase-studio                Created
 ✔ Container supabase-edge-functions        Created
 ✔ Container supabase-storage               Created

# 상태 확인
$ docker compose ps
$ docker compose logs analytics

# 종료
$ docker compose down
```

도커 스택이 모두 정상 작동하였으면 대시보드에 접속하자.

<http://localhost:8000>


## 2. 접속 테스트

Supabase 백엔드가 잘 작동하는지 테스트를 해보자.

- [API Keys 생성](http://localhost:8000/project/default/settings/api-keys) : 셀프 호스팅에서는 필요 없음

### edge function

- <http://localhost:8000/functions/v1/hello>

### rest query

[GoTrue Auth API](https://supabase.com/docs/reference/self-hosting-auth/introduction) 확인하기

```console
export SB_ANON_KEY="..."

curl -X GET 'http://localhost:8000/auth/v1/health' \
-H "apikey: $SB_ANON_KEY" \
-H "Authorization: Bearer $SB_ANON_KEY"

{
  "version":"v2.184.0",
  "name":"GoTrue",
  "description":"GoTrue is a user registration and authentication API"
}
```

[`todos` 테이블 생성](https://supabase.com/docs/guides/api/quickstart) 후 쿼리하기

```console
export SB_ANON_KEY="..."

curl 'http://localhost:8000/rest/v1/todos' \
-H "apikey: $SB_ANON_KEY" \
-H "Authorization: Bearer $SB_ANON_KEY"

[
  {"id":1,"task":"Create tables"},
  {"id":2,"task":"Enable security"},
  {"id":3,"task":"Add data"},
  {"id":4,"task":"Fetch data from the API"}
]
```

### db connection

연결한 김에 postgres 의 타임존(TZ)을 변경하자.

```console
# direct connect
psql 'postgres://postgres.{테넌트ID}:{패스워드}@localhost:5432/postgres'

# pooling connect
psql 'postgres://postgres.{테넌트ID}:{패스워드}@localhost:6543/postgres'

ALTER DATABASE postgres SET timezone TO 'Asia/Seoul';
```


## 3. 자바스크립트 API 사용

bun 으로 TS 프로젝트를 생성한다.

```console
# 프로젝트 생성
bun init my-app
# > Blank 선택

cd my-app 

# supabase 클라이언트 패키지 설치
bun add @supabase/supabase-js

# 실행
bun index.ts
# 출력> Hello via Bun!
```

앞에서 생성했던 todos 테이블을 출력해 보자.

```js
import { createClient } from '@supabase/supabase-js'

console.log("Hello via Bun!");

let SB_URL = 'http://localhost:8000'
let SB_KEY = process.env.SB_ANON_KEY ?? '';

// Create a single supabase client for interacting with your database
const supabase = createClient(SB_URL, SB_KEY);

const { data } = await supabase.from('todos').select();
console.log(JSON.stringify(data, null, 2));
```
{: file="index.ts"}

```console
# 실행
bun index.ts
# 출력>
Hello via Bun!
[
  {
    "id": 1,
    "task": "Create tables"
  },
  {
    "id": 2,
    "task": "Enable security"
  },
  {
    "id": 3,
    "task": "Add data"
  },
  {
    "id": 4,
    "task": "Fetch data from the API"
  }
]
```

plain Object 를 class Instance 로 변형하는 코드도 추가해 봤다.

```ts
const isObjectArr = (value: unknown) => {
  return (
    typeof value === 'object' &&
    value !== null && 
    Array.isArray(data)
  );
}
// console.log(`=> ${isObjectArr(data) }`);

if (!isObjectArr(data)) {
  throw new TypeError('data is not an Array of Objects');
}

////////////////////////////////////////////

const formatNumber = (num: number, targetLength: number): string => {
  return String(num).padStart(targetLength, '0');
};

interface ITodo {
  id: number;
  task: string;
}

class Todo implements ITodo {
  id: number;
  task: string;  

  constructor(data: ITodo){
    // Object.assign(this, data);
    this.id = data.id;
    this.task = data.task;
  }

  getDisplayName(): string {
    let paddedId = formatNumber(this.id,2);
    let shortenTask = this.task.slice(0,10) + (this.task.length > 10 ? '..' : '');
    return `${paddedId}-${shortenTask}`;
  }  
}

let todos:Todo[] = data.map(item => new Todo(item));
for (const todo of todos){
  console.log(todo.getDisplayName());
}

/*
01-Create tab..
02-Enable sec..
03-Add data
04-Fetch data..
 */
```

원래는 [typia](https://typia.io/) 라이브러리를 써보려고 했는데, 무슨 이유인지 안된다.

```console
$ bun add typia
$ bun typia setup --manager bun

# 소스 작성하고...

$ bun index.ts
error: Error on typia.is(): no transform has been configured.

Read and follow https://typia.io/docs/setup please.
```

### Self Hosting 에서 Supabase CLI 사용하기

`supabase gen types` 명령을 사용하는데 project_id 가 필요하다고 해서 넣었지만 작동하지 않았다.

- project_id 는 다운로드 된 supabase 깃허브 소스에 있다.
  - `supabase/supabase/config.toml` 파일

```console
$ bunx supabase gen types typescript --project-id xguihxuzqibwxjnimxev
2026/01/25 13:58:57 Access token not provided. Supply an access token by running supabase login or setting the SUPABASE_ACCESS_TOKEN environment variable.
```

[공식문서](https://supabase.com/docs/reference/cli/supabase-gen-types) 설명에 따르면 `db-url` 을 대신 사용할 수 있다.

- `db-url` 옵션은 `supabase db` 명령에도 사용된다.

```console
$ bunx supabase gen types typescript --db-url 'postgres://postgres.{테넌트ID}:{패스워드}@localhost:5432/postgres'
Connecting to localhost 5432
v0.95.2: Pulling from supabase/postgres-meta
...
```

스키마 전체를 풀어내는 거라서 장황하다. 필요한 부분만 잘라서 사용하는 것이 좋다.

- 참고 : [공식문서 - typescript 스키마 예제](https://supabase.com/docs/reference/javascript/typescript-support)


## 9. Reviews

- 컴퓨터를 종료하기 전에 supabase 도커 스택도 종료해야 옳다.
  - 다시 켜면 자동으로 시작되는데 정상 시동되지 않는 경우가 있다.
- 타입스크립트를 오랜만에 만져보니 타이핑이 번거롭다. 잔소리도 많고.
- Object 를 클래스 Instance 로 변환하는데 [class-transformer](https://github.com/typestack/class-transformer) 를 사용한다는데, 부하가 크지 않을까 염려된다.
  - zod 보다는 심플해 보인다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
