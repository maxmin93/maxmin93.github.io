---
date: 2023-03-15 00:00:00 +0900
title: Scrapy, Playwright 공부하기 - 2일차
description: 스크래핑은 데이터를 가져오는 행위를 말하고, 크롤링은 페이지 내의 링크를 수집하는 것을 말합니다. 본 글에서는 Scrapy 의 크롤링 모드를 사용해봅니다.
categories: [Backend, Crawling]
tags: ["playwright","scrapy","2nd-day","python"]
image: "https://pbs.twimg.com/profile_images/1318604600677527552/stk8sqYZ_400x400.png"
---

> 목록
{: .prompt-tip }

- [Scrapy, Playwright 공부하기 - 1일차](/posts/scrapy-playwright-day1/) : Scrapy, Playwright
- [Scrapy, Playwright 공부하기 - 2일차](/posts/scrapy-playwright-day2/) : CrawlSpider &nbsp; &#10004;

## 1. CrawlSpider 사용법

link 를 수집하는 작업을 크롤링(crawling) 이라고 한다. (참고로 HTML 데이터를 긁어오는 작업은 scraping 이다)

scrapy 는 start_urls 변수 또는 start_requests 함수를 통해 수집 작업을 수행할 대상을 지정하는데, 크롤링 작업부터 정의할 수 있는 방법을 CrawlSpider 으로 제공하고 있다.

### 1) 프로젝트 생성 (동일)

startproject 에서 설치 위치로 현재 디렉토리(.)를 지정하지 않으면 하위 경로가 추가되어 디렉토리 구조가 번거롭게 된다.

```console
# 프로젝트 가상환경
python -m venv venv
source venv/bin/activate

# 라이브러리 설치
pip install scrapy

# scrapy 생성
scrapy startproject myscraper .
cd myscraper

# spider 생성
scrapy genspider myspider example.com
scrapy list

# spider 실행 (옵션: Overwrite Output)
scrapy crawl myspider -O output/example.jsonl --logfile logs/myspider.log -L INFO
```

> settings.py

```py
ROBOTSTXT_OBEY = False

USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"

DEFAULT_REQUEST_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "ko,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6,ja;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
}

DOWNLOAD_DELAY = 1
```

### 2) 일반적인 CrawlSpider [예제](https://doc.scrapy.org/en/latest/topics/spiders.html#crawlspider-example)

- Rule 은 하나의 추출 규칙을 의미하고
  + 하나의 추출기 LinkExtractor 를 포함할 수 있다.
  + callback 으로 parse 함수를 지정할 수 있다
- LinkExtractor 는 기본적으로 a 태그의 href 속성을 수집한다.
  + 포함 조건 allow, 제외 조건 deny
  + restrict_css 으로 범위를 지정
  + process_value 으로 매칭된 value 를 수정할 수 있다.

```py
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule

class MySpider(CrawlSpider):
    name = "myspider"
    allowed_domains = ["example.com"]
    start_urls = ["https://example.com/product/all"]

    rules = (
        Rule(LinkExtractor(allow=('category\.php', ), deny=('subsection\.php', ))),
        Rule(LinkExtractor(allow=('item\.php', )), callback='parse_item'),
    )    
```

> follow 의 뜻은 Request 개체를 전달한다는 의미로 또다른 start_url 로 사용한다는 뜻이다. 수집된 링크가 크롤링의 시작점으로 사용되는 것을 멈추려면 callback 을 지정해야 한다.

- `callback=parse, follow=True` 는 파싱도 하고, 다음 페이지로도 넘어간다는 뜻
  + 예) 다음 페이지 링크가 있는 경우에 적합

```py
class Rule:
  def __init__(
    follow=None,
  ):
    # callback 설정이 없으면 기본적으로 follow = True 가 된다
    # follow 설정 없이 callback 이 지정된 경우, follow 는 False 가 된다
    self.follow = follow if follow is not None else not callback
```
{: file="crawl.py"}

### 3) 특정 태그의 속성값으로 크롤링

자바스크립트에 의해 url 이 변경되는 경우, 속성값을 추출하여 처리해야 한다. 

```html
<a href='#' onclick="setCategory2('CODE100','CODE101');return false;";>카테고리1-1</a>

<script type="text/javascript">
function setCategory2(parentCode,cateCode) {
  location.href = "/product/cate1/"+parentCode+"/cate2/"+cateCode;
}
</script>
```

원하는 추출 작업은 다음과 같다.

1. a 태그의 onclick 속성값을 추출
2. setCategory2 의 cate1, cate2 파라미터를 추출
3. javascript 와 동일한 url 을 생성
4. 제대로 추출한 것인지 parse 함수에서 로깅으로 url 확인

```py
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule

def process_cate2(value):
    m = re.search(r"setCategory2\('(\S+)',\s*'(\S+)'\);", value)
    if m:
        cate1, cate2 = m.groups()
        print(f"cate1: {cate1}, cate2: {cate2}")
        return f"https://example.com/product/cate1/{cate1}/cate2/{cate2}"
    return None

class MySpider(CrawlSpider):
    name = "myspider"
    allowed_domains = ["example.com"]
    start_urls = ["https://example.com/product/all"]

    rules = (
        Rule(
            LinkExtractor(
                tags="a",
                attrs="onclick",
                restrict_css="div.prd_cate2 a[onclick]",
                deny=r"/page/\d+",
                process_value=process_cate2,
            ),
            callback="parse",
        ),
    )

    def parse(self, response):
        self.logger.info("**" * 20)
        self.logger.info(f"** status: {response.status}, url: {response.url}")
        pass
```

> SgmlLinkExtractor 는 scrapy 1.0 이전에 deprecated 되어 없어졌다. 대신에 LinkExtractor 의 tags 와 attrs 로 동일한 동작을 수행할 수 있다.


## 2. Scrapy 실전 사용법 (TIP)

### 1) 모든 스파이더 실행하기

#### [Sell script 로 모든 스파이더 실행](https://stackoverflow.com/a/69035122)

```bash
#!/bin/bash

for spider in $(scrapy list)
do
  scrapy crawl "$spider" -o "$spider".json
done
```

#### [Python 으로 모든 스파이더 실행](https://stackoverflow.com/a/75020300)

Scrapy 2.8.0 에서도 동작함

```py
# Run all spiders in project implemented using Scrapy 2.7.0

from scrapy.crawler import CrawlerProcess
from scrapy.utils.project import get_project_settings


def main():
    settings = get_project_settings()
    process = CrawlerProcess(settings)
    spiders_names = process.spider_loader.list()
    for s in spiders_names:
        process.crawl(s)
    process.start()


if __name__ == '__main__':
    main()
```

### 2) Dockerfile

스크래퍼는 ETL 형태를 띄고 있기 때문에, 데이터 저장소에 대한 설정도 필요하다. 관련 리소스들간의 설정을 도커로 묶어서 관리하는 것이 편하다.

```Dockerfile
FROM python:3.10.10-bullseye

WORKDIR /app/logs
WORKDIR /app

RUN pip install --no-cache-dir --upgrade pip

# install dependencies
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt

# copy sources
COPY . .

# ENV FOO bar
CMD ["bash","run_all_spiders.sh"]
```

마지막에 쉘스크립트로 등록된 spider 들을 실행한다.

### 3) crontab 설정

도커를 실행하는 스크립트를 작성한 후 crontab 에 등록한다.

```bash
#!/usr/bin/env bash
echo "scraping..." >> $LOG_FILE
docker run -d --rm --name example_scraper \
  -v scraper_logs:/app/logs \
  -e DATABASE_URL=$DATABASE_URL \
  example_scraper:latest >> $LOG_FILE 2>&1
```

crontab 설정 (반드시 테스트 필요!)

- 매일 스크래퍼 실행 
- 일주일 단위로 오래된 로그파일 제거

```text
#################################
# crontab 설정
#################################

# cronjob test
# 34 9 * * * docker --version >> /tmp/cron-log 2>&1

20 7 * * * /home/ec2-user/scrapers/cronjob_scrapy.sh

# remove docker log-files (only remain 7-days)
0 23 * * * /home/ec2-user/scrapers/cronjob_rm_logs.sh
```

만일을 대비해 하루 2번 실행하도록 하였고, 두번째 실행시에는 앞의 작업이 실패한 경우에만 동작하도록 작성하였다. 

#### bash script 에서 지난달, 이번달, 다음달 날짜 구하기

참고: [Linux - First and last day of a month](https://unix.stackexchange.com/a/249794)

```bash
# Last month:
l_first_date=$(date -d "`date +%Y%m01` -1 month" +%Y-%m-%d)
l_last_date=$(date -d "`date +%Y%m01` -1 day" +%Y-%m-%d)

# This month:
t_first_date=$(date +%Y-%m-01)
t_last_date=$(date -d "`date +%Y%m01` +1 month -1 day" +%Y-%m-%d)

# Next month:
n_first_date=$(date -d "`date +%Y%m01` +1 month" +%Y-%m-%d)
n_last_date=$(date -d "`date +%Y%m01` +2  month -1 day" +%Y-%m-%d)

# Print everything
echo "Last month: $l_first_date to $l_last_date"
echo "This month: $t_first_date to $t_last_date"
echo "Next month: $n_first_date to $n_last_date"
```

데이터 용량 관리를 위해 postgresql 테이블 파티션을 사용했고, 매월 다음달 파티션을 생성하도록 crontab 설정을 했다. 

## 9. Review

- 자동화를 하려니 작업 사항이 계속 생기더라. 대책 1,2,3,...
- 그래도 일단 설정해 두니 신경쓰지 않아도 되어 너무 좋다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
