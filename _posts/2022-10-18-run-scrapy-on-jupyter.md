---
date: 2022-10-18 00:00:00 +0900
title: Scrapy 사용법과 Jupyter 에서 Scrapy 실행하기
description: Scrapy 사용법을 소개하고, Jupyter 에서 오류 없이 실행하기 위한 방법을 설명합니다.
categories: [Backend, Crawling]
tags: [scrapy, xpath, jupyter]
image: "https://repository-images.githubusercontent.com/529502/dab2bd00-0ed2-11eb-8588-5e10679ace4d"
---

## 1. Scrapy

`스크래파이`는 웹사이트를 크롤링하고 구조적인 데이터를 추출하는 애플리케이션 프레임워크이다. 데이터 마이닝, 정보처리 또는 히스토리 적재 등 넓은 사용 범위를 가진다.

### 1) Scrapy 구조

![Scrapy - Data flow](https://docs.scrapy.org/en/latest/_images/scrapy_architecture_02.png){: width="580"}
_Scrapy - Data flow_

- Engine
  + Spiders 와 Downloader, Pipelines, Scheduler 를 실행하고
  + 개체와 개체간에 입출력 이벤트를 연결
- Spider
  + reqeust 가 시작되고
  + response 를 파싱하여 items 출력
- Scheduler 
  + request 의 처리 순서를 조정 (작업큐)
- Downloader
  + request 에 대한 HTML 을 다운로드
- Item Pipelines
  + item 에 대한 검증 또는 변형, 저장 등을 처리

### 2) Scrapy 장점

- css 또는 xpath 표현식을 사용하여 html 데이터 추출 가능
  + 이게 효과가 상당합니다. 코드량을 엄청나게 줄여줍니다.
- selector 표현식을 시험해 볼 수 있는 shell 기능 제공
- json/csv/xml 등 여러 포맷으로 export 할 수 있는 기능 제공

### 2) Scrapy 와 BS4(BeautifulSoup) 비교

출처: [Stackoverflow](https://stackoverflow.com/a/73927892/6811653)

> Scrapy is a multitool(다목적칼). BS4 is a penknife(주머니칼).

#### Scrapy 특징

- 무겁다
- 종속성 설치 문제가 발생할 수 있다
- 학습 난이도가 있다
- 최신 문서와 활발한 커뮤니티의 도움을 받을 수 있다.
- 추출 속도가 빠르다
- 큰 작업에 적합
- Scrapy spiders 를 위한 [클라우드 서비스](https://www.zyte.com/scrapy-cloud/)가 있다
  + [Scrapy Cloud API](https://docs.zyte.com/scrapy-cloud.html)
- 세부적인 설정과 추가기능 확장이 가능하다
- 매우 구조적인 코드 작성이 가능하다
- 프록시 서비스와 IP 로테이션 미들웨어와 통합이 쉽다
- 상태 조회 인터페이스와 디버깅이 편리하다.

#### BS4 특징

- 가볍다
- 설치가 빠르다
- 배우기도 쉽다
- 코드를 빠르게 작성할 수 있지만 지저분해진다.
- 간단한 작업에 적합
- 사이트를 테스트하거나 가설 검증에 적합
- Chrome 개발도구에서 curl 을 사용하여 쿠키 종속사이트 또는 복잡한 post 요청에 대한 결과를 사용할 수 있다.

#### 요약

- 웹스크래핑을 입문하는 경우, 단순 작업일 경우 BS4 를 사용하라
- 대규모 데이터, 긴 작업, 전문적인 스크래핑 작업에는 Scrapy 를 사용하라 

## 2. Scrapy 사용법

### 1) 프로젝트 생성 및 실행

```shell
$ scrapy startproject <project_name> [project_dir]

$ cd [project_dir]
$ scrapy list
<scrapy_module>

$ scrapy crawl <scrapy_module>
```

### 2) 프로젝트의 파일들

- {PROJECT_ROOT}
  - scrapy.cfg : scrapy 모듈 배포를 위한 설정
  - [naverstocks] : 실질적인 프로젝트 루트
    - settings.py : 기본 설정 및 커스텀 설정
    - pipelines.py : parse 처리된 item 들을 개별 처리하는 단계
    - items.py : export 를 위한 데이터 모델
    - exporters.py : 커스텀 exporter 기능을 설정
    - extensions.py : scrapy 실행 단계별 hook 에 실행할 확장 기능 정의
    - middlewares.py : spider, downloader 실행을 대체하는 커스텀 기능 정의
    - [spiders] : 독립적인 scrapy 실행 단위
      - stocks.py : spider 또는 crawler 클래스를 상속받아 request 와 response, parse 를 정의

### 3) scrapy 설정 파일

#### (1) settings.py

스파이더의 기본 설정 항목 또는 공통적으로 사용되는 항목들을 설정

- spider 인스턴스가 생성된 이후 settings 참조가 가능하다

```python
BOT_NAME = "naver-stocks-collector"

# 스파이더 모듈 paths (load 대상)
SPIDER_MODULES = ["naverstocks.spiders"]
# 스파이더 생성자 모듈
NEWSPIDER_MODULE = "naverstocks.spiders"

# 맥북 크롬 브라우져
USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"

# True 이면 로봇 정책 때문에 읽지 않음
ROBOTSTXT_OBEY = False

# Custom exporters
FEED_EXPORTERS = {
    # 분리 기호 또는 따옴표("") 사용방식 등의 csv 옵션 변경
    "csv": "naverstocks.exporters.QuoteAllCsvItemExporter",
}

# request 사이의 delay 설정 (기본값 0초)
# - 까다로운 사이트의 경우 3초 이상을 주어야 할 수도 있음
DOWNLOAD_DELAY = 0.25

# 스파이더 Hook 클래스에 커스텀 기능 구현
# https://docs.scrapy.org/en/latest/topics/extensions.html#sample-extension
MYEXT_ENABLED = True  # enable/disable the extension
MYEXT_ITEMCOUNT = 100  # how many items per log message
```

#### (2) spiders 클래스 내부에서 커스텀 설정

spider 인스턴스 생성시 개별적으로 참조되는 항목들을 설정

```python
# spiders/stock_categories.py
custom_settings = {
    "ITEM_PIPELINES": {StockGroupPipeline: 100},
    "FEEDS": {"output/stock-categories.csv": {"format": "csv", "overwrite": True}},
    # 사용자 정의 설정
    "ITEM_LIST_OUTPUT": "output/category-groups.jl",  # json list
}
```

## 3. Jupyter Notebook 에서 Scrapy 실행하기

정석적인 python 프로젝트 실행 외에, Jupyter 에서 간단히 작업하려면 Crawler 프로세스를 직접 실행시켜야 한다. 이 때 Jypyter 메인 스레드 위에서 동작되므로, 정상적으로 Crawler 프로세스를 동작시키려면 Thread 처리에 대한 설정이 필요하다.

출처: [Run Scrapy code from Jupyter Notebook without issues](https://towardsdatascience.com/run-scrapy-code-from-jupyter-notebook-without-issues-69b7cb79530c)

### 1) `CrawlerProcess` 사용시 Reactor 재실행 오류

- 첫번째는 잘 실행되었지만
- 두번째 실행부터는 `ReactorNotRestartable` 발생

> 해결책은 커널 재시작뿐!!

```python
# scrape webpage
import scrapy
from scrapy.crawler import CrawlerProcess

# text cleaning
import re

class QuotesToCsv(scrapy.Spider):
    name = "MJKQuotesToCsv"
    start_urls = [
        'https://en.wikiquote.org/wiki/Maynard_James_Keenan',
    ]
    custom_settings = {
        'ITEM_PIPELINES': {
            '__main__.ExtractFirstLine': 1
        },
        'FEEDS': {
            'quotes.csv': {
                'format': 'csv',
                'overwrite': True
            }
        }
    }

    def parse(self, response):
        for quote in response.css('div.mw-parser-output > ul > li'):
            yield {'quote': quote.extract()}

            
class ExtractFirstLine(object):
    def process_item(self, item, spider):
        lines = dict(item)["quote"].splitlines()
        first_line = self.__remove_html_tags__(lines[0])
        return {'quote': first_line}

    def __remove_html_tags__(self, text):
        """remove html tags from string"""
        html_tags = re.compile('<.*?>')
        return re.sub(html_tags, '', text)


# 처음에는 잘 작동했지만
# 두번째 실행부터는 ReactorNotRestartable 발생
process = CrawlerProcess()
process.crawl(QuotesToCsv)
process.start()
```

### 2) Reactor 재실행을 위해 [crochet](https://github.com/itamarst/crochet) 을 사용

- `setup` 과정에서 Reactor의 thread 상태에 대한 `observer` 를 등록
- `wait_for` 데코레이터를 통해 `timeout` 이후 thread 를 종료시킨다
  + 실행이 끝난 spider 작업에 대해 Reactor 를 해제시킴

```python
# scrape webpage
import scrapy
from scrapy.crawler import CrawlerRunner

# Reactor restart 를 위해 임포트
from crochet import setup, wait_for

# crawler 실행 이전에 한번만 실행
setup()


# 코드 동일
class QuotesToCsv(scrapy.Spider):
    pass

# 코드 동일
class ExtractFirstLine(object):    
    pass  


# 여기서부터 다름
@wait_for(10)  # 10초 후 timeout
def run_spider():
    """run spider with MJKQuotesToCsv"""
    crawler = CrawlerRunner()
    d = crawler.crawl(QuotesToCsv)
    return d


# 여러번 실행해도 정상적으로 수행됨
run_spider()
```


## 9. Review

- 데이터 수집/분석을 위해 크롤링은 핵심 기술이 되었다.
  + 가난한 서비스가 데이터 서비스를 하려면 크롤링뿐
  + 거대 플랫폼들이 데이터를 독식하면서 기생할 수 밖에 없다.
- Linkedin 사이트 등을 크롤링 하려면 프록시 API 와 IP 로테이션 서비스가 필수다.
  + 여러번 크롤링 하다보면 IP가 통채로 block 당한다
- 로그인이라던지, 동적 페이지라던지, 자바스크립트 처리 등이 고급과정
  + 유튜브 강좌: [Modern Web Scraping with Python](https://www.youtube.com/playlist?list=PLRzwgpycm-Fio7EyivRKOBN4D3tfQ_rpu)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

