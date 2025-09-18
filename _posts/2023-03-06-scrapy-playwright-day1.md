---
date: 2023-03-06 00:00:00 +0900
title: Scrapy, Playwright 공부하기 - 1일차
description: Microsoft 에서 만든 Playwright 를 사용하여 웹 스크래핑 방법을 공부합니다. Scrapy 와 연동하거나 단독으로 사용할 수 있습니다.
categories: [Backend, Crawling]
tags: ["playwright","scrapy","1st-day","python"]
image: "https://pbs.twimg.com/profile_images/1318604600677527552/stk8sqYZ_400x400.png"
---

> 목록
{: .prompt-tip }

- [Scrapy, Playwright 공부하기 - 1일차](/posts/scrapy-playwright-day1/) : Scrapy, Playwright &nbsp; &#10004;
- [Scrapy, Playwright 공부하기 - 2일차](/posts/scrapy-playwright-day2/) : CrawlSpider

## 1. [Playwright](https://playwright.dev/python/) 란?

Microsoft 사에서 만든 E2E 용 headless browser 로 웹애플리케이션의 브라우져별 호환성과 기능 테스트를 위해 사용할 수 있습니다.

> 지원하는 브라우져

- Chromium, WebKit, Firefox

> 지원하는 언어

- Node.js, Python, Java, .NET

### 1) Node.js 용 Playwright [설치 및 사용해보기](https://playwright.dev/docs/intro#installing-playwright)

npm 또는 pnpm 을 통해 프로젝트를 설정하면, `playwright.config.ts` 파일이 생성됩니다.

```console
pnpm dlx create-playwright
  ==> Typescript
  ==> E2E 테스트를 어디에 작성할 것이냐? tests
  ==> 깃허브 액션 워크플로우를 추가할 것이냐? false

# 모든 브라우져 환경에 대해서 테스트
pnpx playwright test
# 특정 브라우져 환경에 대해서만 실행 (playwright.config.ts)
pnpm playwright test --project=chromium
# 특정 테스트 파일을 실행
pnpx playwright test ./tests/example.spec.ts

# 테스트 결과 조회
pnpx playwright show-report
```

#### Example 코드

- 'has title' 테스트
  + `https://playwright.dev/` 이동
  + `toHaveTitle(/Playwright/)` 패턴매칭 검사
- 'get started link' 테스트
  + `https://playwright.dev/` 이동
  + getByRole 로 찾은 요소를 click (페이지 이동)
  + `.toHaveURL(/.*intro/)` 패턴매칭 검사

```ts
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects the URL to contain intro.
  await expect(page).toHaveURL(/.*intro/);
});
```

![Playwright Test Report](https://user-images.githubusercontent.com/13063165/212743312-edf1e8ed-3fc2-48aa-9c93-24ae3e36504d.png){: width="540" .w-75}
_Playwright Test Report_

#### [Amazon 상품 가격 가져오기](https://muuktest.com/blog/how-does-playwright-work/)

- [XPath locator](https://playwright.dev/docs/other-locators#xpath-locator)
  + 예) `await page.locator('xpath=//button').click();`
  + 코드의 `(//span[@class='a-price-whole'])[1]` 는 XPATH 표기법

```ts
// https://muuktest.com/blog/how-does-playwright-work/
test.describe("3-rd tests", () => {
  test("open given url", async ({ page }) => {
    await page.goto("https://www.amazon.in/dp/B09F6S8BT6/");
    await expect(page.locator("span#productTitle")).toBeVisible();
    await console.log("Amazon product page is visible");

    let price =
      (await page
        .locator("(//span[@class='a-price-whole'])[1]")
        .textContent()) || "";
    price = price.replace(/,/g, "");
    await console.log("Price is: ", price);
  });
});
```

```console
$ pnpm playwright test --project=chromium
[chromium] › example.spec.ts:36:7 › 3-rd tests › open given url
Amazon product page is visible
Price is:  13990.
Done with tests
```

### 2) Python 용 Playwright [설치 및 사용해보기](https://www.lambdatest.com/blog/playwright-python-tutorial/)

playwright 를 설치한 후, Inspector 를 통해 사용자 액션을 Python 코드로 생성할 수 있습니다.

```console
pip install playwright

# Inspector 실행
playWright codegen https://ecommerce-playground.lambdatest.io/

# 코드 생성 포함
playwright codegen --target python -o example2.py https://ecommerce-playground.lambdatest.io/
```

Chromium 브라우져가 입력 URL 을 열고, 사용자의 액션이 기록됩니다.

1. chromium.launch(headless=False) : 브라우져 띄우기
2. browser.new_context() : 컨텍스트 생성
3. context.new_page() : 페이지 생성
4. page.goto(URL)
5. page.locator, get_by_text, get_by_role, ... 등
6. element 에 대한 select, click 등의 action
7. context.close()
8. browser.close()

```py
from playwright.sync_api import Playwright, sync_playwright, expect


def run(playwright: Playwright) -> None:
    browser = playwright.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()
    page.goto("https://ecommerce-playground.lambdatest.io/")
    page.get_by_text("Top Products Add to Cart Add to Wish List iMac $170.00 Add to Cart Add to Wish L").click()
    page.get_by_role("heading", name="Top Products").click()
    page.get_by_role("group", name="1 / 24", exact=True).get_by_role("link", name="Apple Cinema 30\"", exact=True).click()
    page.get_by_role("combobox", name="Size *").select_option("37")
    page.get_by_role("button", name="Increase quantity").click()

    # ---------------------
    context.close()
    browser.close()


with sync_playwright() as playwright:
    run(playwright)
```

Playwright 코드 생성기의 단점

- 생성된 코드는 확장 및 유지 관리가 불가능합니다.
- 복잡한 웹사이트를 테스트하는 데는 적합하지 않습니다.
- 하나의 코드 파일만 생성하기 때문에 병렬 테스트를 실행할 수 없습니다.

이러한 이유로, Scrapy 와 연동하여 사용하면 효율성을 높일 수 있습니다.

## 2. Scrapy 튜토리얼

참고 : [Create Your First Scrapy Spider - Python Scrapy Beginner Series](https://www.youtube.com/watch?v=NkIlpHTFCIE)

### 1) scrapy 프로젝트 생성

- 스크래핑 목표 URL `https://www.chocolate.co.uk/collections/all`
- 상품의 name, price, url 수집
- next page 가 존재하면, 이동하여 spider 재실행

```console
# 설치
pip3 install scrapy

# 프로젝트 생성 (스켈레톤)
$ scrapy startproject scraper01
$ cd scraper01

# 하위 spider 생성 (실제 실행 코드)
$ scrapy genspider chocolatespider chocolate.co.uk
# ==> ./spiders/chocolatespider.py 생성

# spiders 리스트 (등록 확인)
$ scrapy list
chocolatespider

# loglevel 필터링, json 출력
$ scrapy crawl chocolatespider -O chocolates.json --loglevel WARNING
```

```console
$ scrapy shell "https://www.chocolate.co.uk/collections/all"

# 또는 실행 후 fetch 명령어 사용
$ scrapy shell
>>> fetch(https://www.chocolate.co.uk/collections/all)

>>> response.css('product-item')
[<Selector xpath='descendant-or-self::product-item' data='<product-item
... 
data='<product-item class="product-item " r...'>]

>>> exit()
```

### 2) Spider, Item, ItemLoader, Pipelines, Feed

#### scrapy.Spider

- start_urls 로부터 request 생성 (callback=self.parse)
- parse 에 Response 를 전달하여, 파싱 시작
  + response.css 또는 xpath 함수로 쿼리 
  + parse 의 결과는 yield 시킨다
- 새로운 URL 에 대해 parse callback 을 이어갈 수 있다.
  + response.follow 로 재귀 시키거나, 새로운 request 를 반환(yield)

> XPath 와 CSS 선택자 차이점

![XPath and CSS Selector 차이점](https://res.cloudinary.com/practicaldev/image/fetch/s--b0AA4O7P--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/a6iz0mfocerlnregrbwg.png){: width="600" .w-75}
_XPath and CSS Selector 차이점_

XPath 는 상위, 이웃, 이전 경로 등 경로상 이동이 보다 더 자유롭다.

#### scrapy.Item, scrapy.loader.ItemLoader

parse 에서 dict 형태로 넘겨도 되지만, Scrapy 아키텍처가 정해 놓은 Item 과 ItemLoader 를 사용하면 코드를 절약하고 간략하게 만들 수 있다.

- 스크래핑의 결과물인 데이터를 Item 클래스로 정의
  + Field 별로 serializer 를 연결할 수 있다.
- ItemLoader 는 Item 의 필드별로 in/out 프로세서를 정의
  + 예) title 필드의 입력 처리 title_in, 출력 처리 title_out
  + 흔히 쓰이는 연산자들을 만들어 두었기 때문에, 가져다 쓰면 된다.
    * TakeFirst, Identity, MapCompose 등등

#### Pipeline : 데이터 변경, 필터링(누락), 출력

- process_item 함수를 작성하여, Item 단위로 추가 처리를 할 수 있다
  - ItemAdapter 를 사용하여 필드를 읽고 변경
  - 조건에 따라 누락시키거나 (DropItem), ex) 중복 검사
  - Postgresql, MongoDB 등으로 데이터를 저장

#### Feed

settings 설정에 따라 csv, json/jsonl 등의 포맷으로 출력

### 3) 미들웨어

- 다운로드 미들웨어를 사용하면, cache 또는 user-agent 를 설정하여, 일반 브라우져처럼 속인다.

참고 : [Bypassing Restrictions - Python Scrapy Beginners Series (Part 4)](https://www.youtube.com/watch?v=NiFuoJw0sn8)

#### scrapy-user-agents

request 마다 user-agent 를 변경해준다. default 리스트가 옛날 것들이라 검색을 통해 최신 리스트로 작성해 주는 것이 좋다.

```console
# 미들웨어 플러그인 설치 
pip3 install scrapy-user-agents
```

다운로드 미들웨어에 기본 UserAgentMiddleware 를 Disable(None) 시키고, RandomUserAgentMiddleware 를 대신 사용하도록 설정한다.

```py
# scrapy-user-agents
RANDOM_UA_FILE = "myscraper/user_agents.txt"
if os.path.isfile(RANDOM_UA_FILE):
    print(f"Found user agents file: {RANDOM_UA_FILE}")
else:
    raise FileNotFoundError(f"User agents file not found: {RANDOM_UA_FILE}")


# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
DOWNLOADER_MIDDLEWARES = {
    "scrapy.downloadermiddlewares.useragent.UserAgentMiddleware": None,
    "scrapy_user_agents.middlewares.RandomUserAgentMiddleware": 400,
}
```
{: file="settings.py"}

> 이렇게 해도, IP 가 막히면 소용없는 짓이다. 특히 해외 IP는 통째로 차단.

#### 참고 : [최신 User Agents](https://www.whatismybrowser.com/guides/the-latest-user-agent/)

- [Latest Chrome user agents](https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome)
- [Latest Firefox user agents](https://www.whatismybrowser.com/guides/the-latest-user-agent/firefox)
- [Latest Safari user agents](https://www.whatismybrowser.com/guides/the-latest-user-agent/safari)
- [Latest Internet Explorer user agents](https://www.whatismybrowser.com/guides/the-latest-user-agent/internet-explorer)
- [Latest Edge user agents](https://www.whatismybrowser.com/guides/the-latest-user-agent/edge)

```text
Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36
Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36
Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36
Mozilla/5.0 (Macintosh; Intel Mac OS X 13_2_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Safari/605.1.15
Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Mobile/15E148 Safari/604.1
Mozilla/5.0 (iPad; CPU OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.3 Mobile/15E148 Safari/604.1
Mozilla/5.0 (Windows NT 10.0; Trident/7.0; rv:11.0) like Gecko
Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko
Mozilla/5.0 (Windows NT 6.2; Trident/7.0; rv:11.0) like Gecko
Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko
```
{: file="user_agents.txt"}

> Edge 계열 user-agent 를 사용하면 scrapy 에서 WARNING 메시지를 출력한다.

```console
2023-03-08 20:31:53 [scrapy_user_agents.user_agent_picker] WARNING: [UnsupportedBrowserType] Family: Edge
2023-03-08 20:31:53 [scrapy_user_agents.user_agent_picker] WARNING: [UnsupportedBrowserType] Family: Edge Mobile
```

## 3. scrapy-playwright 연동

장황하게 설명하는 것보다, 첫번째 참고 문서 (scrapeops.io) 에 잘 나와 있기 때문에 코드를 생략했다. 그냥 따라하면 된다.

참고

- [Scrapy Playwright Guide: Render & Scrape JS Heavy Websites](https://scrapeops.io/python-scrapy-playbook/scrapy-playwright/)
- 깃허브 [scrapy-playwright](https://github.com/scrapy-plugins/scrapy-playwright)

> 주의 : playwright 는 poetry 로 설치가 되지 않는다. (pip 로만 설치 가능)

```console
# 단독 사용시
python3 -m pip install install-playwright

# Scrapy 와 함께 사용할 때
python3 -m pip install scrapy
python3 -m pip install scrapy-playwright
```

### 1) Playwright 코드 참고

#### [locator 로 선택한 element 가 존재하는지 검사하는 방법](https://stackoverflow.com/a/75221745/6811653) : is_visible

```py
if selector_exits(page, 'div[aria-label="Next"]'):
    print('yeah it exits')

def selector_exists(page, selector, timeout=3000):
    try:
        element = page.locator(selector).is_visible(timeout=timeout)
        return element
    except:
        return False
```

#### [A 태그의 href 값을 가져오는 방법](https://stackoverflow.com/a/68095321/6811653) : evaluate

- 같은 방식으로 해당 element 의 outerHTML 도 가져올 수 있다.
  + `locator.evaluate("el => el.outerHTML")` 

```py
hrefs_of_page = page.eval_on_selector_all("a[href^='/wiki/']", "elements => elements.map(element => element.href)")
```

#### [iFrame 안의 element 를 선택하는 방법](https://stackoverflow.com/a/73809343/6811653) : frame_locator

참고 : [Playwright 공식문서 - Frames](https://playwright.dev/python/docs/frames)

```py
# Locate element inside frame and Get frame using any other selector
username = page.frame_locator('.frame-class').get_by_label('User Name')
username.fill('John')
```

## 9. Review

- HTTP Proxy 유료 서비스는 한국은 한달에 약 6만원, 외국은 50달러나 한다.
- [ScrapeOps](https://scrapeops.io/) 의 IP Proxy 서비스를 이용해 보았는데, 440여건이 나올 출력이 60건 밖에 나오지 않았다.
  + 왜지? 블럭당한 IP들이 많아서인가? 영국이라 더 오래 걸리기도 한다.
    * IP Proxy를 제거하고 다시 해보니 정상적으로 전체 건수가 나온다.
  + 계속 스크래핑 하다 보니 안된다. 404 Not Found 처리됨

### CSS, XPath 선택자 참고 자료

- XPath 에 대한 자세한 내용은 다음 문서를 참고
  - [Web Scraping Cheat Sheet (2022), Python for Web Scraping](https://medium.com/geekculture/web-scraping-cheat-sheet-2021-python-for-web-scraping-cad1540ce21c#2773) (2021.8)
- CSS 선택자에 대한 내용은 다음 문서를 참고
  - [CSS Selector Reference](https://www.w3schools.com/cssref/css_selectors.php)
- Playwright 선택자에 대한 예제는 다음 문서를 참고
  - [Playwright Select First or Last Element](https://www.programsbuzz.com/article/playwright-select-first-or-last-element)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

