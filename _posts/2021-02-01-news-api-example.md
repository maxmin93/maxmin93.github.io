---
date: 2021-02-01 00:00:00 +0900
title: 뉴스 API
description: 뉴스 데이터를 API 로 제공하는 서비스를 알아보았습니다. 국내는 빅카인즈, 영어권에 NEWS API 가 있습니다. 국내의 경우 연구과제용으로 쓰지 못합니다.
categories: [AI]
tags: [api, data]
image: /2021/02/news-api_20210201.png
---

![news-api](/2021/02/news-api_20210201.png){: width="540" .w-75}
_&lt;그림&gt; news-api_

## NEWS API [&#9658;link](https://newsapi.org/)

### [빅카인즈](https://www.bigkinds.or.kr/)

국내에도 뉴스 데이터를 API로 제공하는 업체가 있긴 한데, 뉴스 저작권 탓에 미디어스타트업 지원사업 선정사에 한해 API가 제공되고 있다. (무료 API 없음)

그 외에 대상인 경우 미디어협회에 돈 내고 사용해야 한다고. (자세한 사항은 직접 문의하시라)

### [NEWS API](https://newsapi.org/)

외국에는 자유롭게 api-key 를 발급받아 무료로 사용해 볼 수 있는 API 서비스가 있다. 영어권에 집중된 기능이긴 하지만 샘플 제작에는 도움이 된다. 유료시 원문 제공을 받을 수 있다.

한국(South Korea) 뉴스의 경우, 'country=kr' 옵션을 사용하여 `한글 뉴스 어플`을 만들어 볼 수 있다.

- 검색: 한글 검색은 작동하지 않음<br>

![news api - search](/2021/02/news-api-search-with-terms_20210201.png){: width="540" .w-75}
_&lt;그림&gt; news api - search_

- 언론사별: 한국 뉴스의 경우 뉴스제공사에 id가 없어 작동 안됨<br>

![news api - sources](/2021/02/news-api-sources_20210201.png){: width="540" .w-75}
_&lt;그림&gt; news api - sources_

- 국가별
  - category 옵션은 작동(7종): business, entertainment, general, health, science, sports, technology
  - from, to 기간 옵션은 최대 1달전까지
  - ex) http://newsapi.org/v2/top-headlines?country=kr&category=health&apiKey=API_KEY    

![news api - country](/2021/02/news-api-country_20210201.png){: width="540" .w-75}
_&lt;그림&gt; news api - country_

## NEWS API 를 이용한 Angular WebApp 예제

아마도 온라인 코딩 콘텐츠의 내용으로 배포된 듯. 동일한 코드가 github에 보인다.

- [github: news-aggregator](https://github.com/SteveEvrard/news-aggregator)

![news-aggregator](https://miro.medium.com/max/1400/1*bOxBX0VVGe_mgOYXkMkGWA.png){: width="540" .w-75}
_&lt;그림&gt; news-aggregator screen shots_

- [github: angular-news-application-with-material](https://github.com/rachidsakara/angular-news-application-with-material)

![angular-news-application-with-material](https://github.com/rachidsakara/angular-news-application-with-material/raw/master/screenshots/overview.PNG?raw=true){: width="540" .w-75}
_&lt;그림&gt; angular-news-application-with-material_

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
