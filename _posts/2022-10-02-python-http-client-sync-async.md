---
date: 2022-10-02 00:00:00 +0900
title: HTTP Client 성능 비교 - httpx, aiohttp, requests
description: 대표적인 HTTP Client 라이브러리의 성능을 비교하고 특징을 공부합니다.
categories: [Language, Python]
tags: [httpx, aiohttp, benchmark]
image: "https://media.brightdata.com/2025/01/web-scraping-with-httpx-and-python.svg"
---

참고문서: [requests, aiohttp, httpx comparison](https://programs.wiki/wiki/requests-aiohttp-httpx-comparison.html)

## 1. Python 용 HTTP Client

API 서비스를 개발할 때, 또 다른 API 의 결과를 받아 전달하여야 할 경우 사용하는 라이브러리를 HTTP Client 라고 합니다.

- reqeusts : 가장 일반적인 라이브러리 (동기식만 제공)
- aiohttp : 비동기 HTTP client 의 최고봉 (비동기식만 제공)
- httpx : 동기식과 비동기식 모두를 제공 
  + 성능 측면에서 동기식 requests 과, 비동기식 aiohttp 모두에 약간씩 부족함
  + 동기식과 비동기식 모두를 하나로 구현할 수 있다는 점이 장점

__미리 총평을 하자면,__

> 비동기 HTTP Client 를 위해서는 __aiohttp__ 를 사용하는 것이 옳다! 하지만 개발 편의성 측면에서 **httpx** 가 더 좋다.


## 2. 비동기식 HTTP Client

보통 세션 또는 클라이언트를 한번 생성하거나, 매 호출마다 생성하는 두가지 방식이 있다. 동일한 URL 을 반복적으로 호출하는 경우에는 당연히 한번 생성후 재사용하는 방식이 효율적이다.

### https 비동기식

동기식에 비해 압도적으로 빠르지만, aiohttp 보다 2~3배 정도 느림

#### AsyncClient() 를 한번만 생성 후 재사용

호출하는 URL 이 고정된 경우

- Httpx asynchronous mode: create httpx only once AsyncClient()
  - Send 100 requests, time consuming: 4.35 sec

```python
import httpx
import asyncio
import time

url = 'https://www.baidu.com/'
url = 'http://localhost:8000/heroes/'
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}

async def make_request():
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, headers=headers)
        print(resp.status_code)


async def main():
    start = time.time()
    tasks = [asyncio.create_task(make_request()) for _ in range(100)]
    await asyncio.gather(*tasks)
    end = time.time()
    print(f'Send 100 requests, time consuming:{end - start}')


# Httpx asynchronous mode: create httpx every time AsyncClient()
# >>> Send 100 requests, time consuming:1.4033987522125244

if __name__ == '__main__':
    # asyncio.run(main())

    # jupyter 상에서 돌릴 때에는 이렇게
    # https://nocomplexity.com/documents/jupyterlab/tip-asyncio.html
    loop = asyncio.get_event_loop()
    loop.create_task(main())     
```

#### AsyncClient() 를 매 호출마다 생성

호출하는 URL 이 랜덤한 경우

- Httpx asynchronous mode: create httpx every time AsyncClient()
  - Send 100 requests, time consuming: 6.37 sec

```python
import httpx
import asyncio
import time

url = 'https://www.baidu.com/'
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}

async def make_request(client):
    resp = await client.get(url, headers=headers)
    print(resp.status_code)


async def main():
    async with httpx.AsyncClient() as client:
        start = time.time()
        tasks = [asyncio.create_task(make_request(client)) for _ in range(100)]
        await asyncio.gather(*tasks)
        end = time.time()
    print(f'Send 100 requests, time consuming:{end - start}')


# Httpx asynchronous mode: create httpx only once AsyncClient()
# >>> Send 100 requests, time consuming:0.8405098915100098

if __name__ == '__main__':
    # asyncio.run(main())

    # jupyter 상에서 돌릴 때에는 이렇게
    # https://nocomplexity.com/documents/jupyterlab/tip-asyncio.html
    loop = asyncio.get_event_loop()
    loop.create_task(main())        
```

### aiohttp : 비동기식만 지원

세션을 처음 맺을 때, 잠깐 주춤하는 딜레이가 있을 수 있다. (측정 오차가 클 수 있음) 그래도, 0.44 sec 로 다른 방식과 압도적 차이 (비동기 https 보다 2~3배 빠름)

#### ClientSession() 을 한번만 생성 후 재사용

호출하는 URL 이 고정된 경우

- Aiohttp: create aiohttp only once ClientSession()
  - Send 100 requests, time consuming: 2.23 sec

```python
import time
import asyncio

import aiohttp

url = 'https://www.baidu.com/'
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}

async def make_request():
    async with aiohttp.ClientSession() as client:
        async with client.get(url, headers=headers) as resp:
            print(resp.status)

async def main():
    start = time.time()
    # tasks = [asyncio.ensure_future(make_request()) for _ in range(100)]
    # loop = asyncio.get_event_loop()
    # loop.run_until_complete(asyncio.wait(tasks))
    
    tasks = [asyncio.create_task(make_request()) for _ in range(100)]
    await asyncio.gather(*tasks)    
    end = time.time()
    print(f'Send 100 requests, time consuming:{end - start}')

    
# 매번 session 생성    
# >>> Send 100 requests, time consuming:0.44777607917785645

if __name__ == '__main__':
    # main()

    # jupyter 상에서 돌릴 때에는 이렇게
    # https://nocomplexity.com/documents/jupyterlab/tip-asyncio.html
    loop = asyncio.get_event_loop()
    loop.create_task(main())    
```

#### ClientSession() 울 매 호출마다 생성

호출하는 URL 이 랜덤한 경우

- create aiohttp every time ClientSession()
  - Send 100 requests, time consuming: 2.66 sec

```python
import time
import asyncio

import aiohttp

url = 'https://www.baidu.com/'
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}

async def make_request(client):
    async with client.get(url, headers=headers) as resp:
        print(resp.status)

async def main():
    async with aiohttp.ClientSession() as client:
        start = time.time()
        tasks = [asyncio.create_task(make_request(client)) for _ in range(100)]
        await asyncio.gather(*tasks)
        end = time.time()
    print(f'Send 100 requests, time consuming:{end - start}')


# ClientSession 한번만 수행 후 유지    
# >>> Send 100 requests, time consuming:0.4473609924316406

if __name__ == '__main__':
    # asyncio.run(main())
    
    # jupyter 상에서 돌릴 때에는 이렇게
    # https://nocomplexity.com/documents/jupyterlab/tip-asyncio.html
    loop = asyncio.get_event_loop()
    loop.create_task(main())
```

## 3. 동기식 HTTP Client

간단히 실험하기 위해 Jupyter Notebook 에서 실행함

#### requests : 동기식만 지원

3배 이상 성능 차이: 65초 (반복) vs 20초 (유지)

- requests remain connected
  - Sending 100 requests takes 4.67 sec (실험은 저렇지만 명백히 6초에 가깝다)
- requests do not remain connected (everytime re-connect)
  - Send 100 requests, time consuming: 10.29 sec

```python
import time
import requests

session = requests.session()

url = 'https://www.baidu.com/'
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}


def make_request():
    resp = session.get(url, headers=headers)
    print(resp.status_code)


def main():
    start = time.time()
    for _ in range(100):
        make_request()
    end = time.time()
    print(f'Send 100 requests, time consuming:{end - start}')


# requests remain connected    
# >>> Send 100 requests, time consuming:20.03547477722168

if __name__ == '__main__':
    main()
```

#### httpx 동기식

동기식 reqeusts 와 동일한 성능

- httpx synchronization mode
  - Send 100 requests, time consuming: 16.60 sec

```shell
import time
import httpx

url = 'https://www.baidu.com/'
headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36'}

# 내부적으로 co-routine 사용하는듯
def make_request():
    resp = httpx.get(url, headers=headers)
    print(resp.status_code)

def main():
    start = time.time()
    for _ in range(100):
        make_request()
    end = time.time()
    print(f'Send 100 requests, time consuming:{end - start}')


# httpx synchronization mode
# >>> Send 100 requests, time consuming:67.80554008483887

if __name__ == '__main__':
    main()
```


## 9. Review

- 특히 FastAPI 의 경우 aiohttp 가 옳다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
