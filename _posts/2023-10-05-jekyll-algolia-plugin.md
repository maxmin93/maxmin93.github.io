---
date: 2023-10-05 00:00:00 +0900
title: jekyll 블로그에 Algolia 검색 기능 붙이기
description: Jekyll 기반 깃허브 블로그의 검색기능을 Algolia 로 바꾸는 작업을 했습니다. plugin 을 이용해 손쉽게 변경할 수 있습니다.
categories: [Backend, Search]
tags: ["git-blog", "search", "algolia", "jekyll"]
image: "https://global-uploads.webflow.com/637ca212d47966358b146792/639093ef3e8c0e5dba9e681d_Logo-Algolia-815x458-Color.webp"
---

## 1. Jekyll 블로그 검색 기능

- 베이스 : 새우 테마 지킬 블로그 `jekyll-theme-chirpy-5.2.1`
- 기존 검색 기능 : [Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search)
  - [데모 Simple-Jekyll-Search](https://christian-fei.github.io/Simple-Jekyll-Search/)

### 기존 검색 작동방식

- 빌드시 `_site/assets/js/data/search.json` 생성 
  - 모든 posts 에 대한 메타 데이터와 스니펫 작성
- json 파일 대상으로 문자열 매칭 수행 (공백, 특수기호 단위로 토큰 분리)
  - 카테고리, 태그 등도 포함

> 이게 꽤 성능이 좋다. 로컬 파일 검색이라 장애도 없다. 다만 형태소 분석이 아쉽다.

### 검색창 입력 및 출력

#### 검색창 `_includes/topbar.html`

```html
    <i id="search-trigger" class="fas fa-search fa-fw"></i>
    <span id="search-wrapper" class="align-items-center">
      <i class="fas fa-search fa-fw"></i>
      <input class="form-control" id="search-input" type="search"
        aria-label="search" autocomplete="off" placeholder="{{ site.data.locales[lang].search.hint | capitalize }}...">
    </span>
    <span id="search-cancel" >{{ site.data.locales[lang].search.cancel }}</span>
```

#### 검색 설정 `_includes/search-loader.html`

```html
<script src="{{ site.data.assets[origin].search.js | relative_url }}"></script>

<script>
SimpleJekyllSearch({
  searchInput: document.getElementById('search-input'),
  resultsContainer: document.getElementById('search-results'),
  json: '{{ '/assets/js/data/search.json' | relative_url }}',
  searchResultTemplate: '{{ result_elem | strip_newlines }}',
  noResultsText: '{{ not_found }}',
  templateMiddleware: function(prop, value, template) {
    if (prop === 'categories') {
      if (value === '') {
        return `${value}`;
      } else {
        return `<div class="mr-sm-4"><i class="far fa-folder fa-fw"></i>${value}</div>`;
      }
    }

    if (prop === 'tags') {
      if (value === '') {
        return `${value}`;
      } else {
        return `<div><i class="fa fa-tag fa-fw"></i>${value}</div>`;
      }
    }
  }
});
</script>
```

> search.js 의 설정 정보 : `_data/assets/cross_origin.yml`

```yml
# _data/assets/cross_origin.yml
search:
  js: https://cdn.jsdelivr.net/npm/simple-jekyll-search@1.10.0/dest/simple-jekyll-search.min.js
```

> 생성된 `/assets/js/data/search.json` 일부

```js
[  
  {
    "title": "jekyll 블로그에 Algolia 검색 기능 붙이기",
    "url": "/posts/2023-10-05-jekyll-algolia-plugin/",
    "categories": "frontend",
    "tags": "git-blog, algolia, jekyll",
    "date": "2023-10-05 00:00:00 +0900",
    "snippet": " Jekyll 기반 깃허브 블로그의 검색기능을 Algolia 로 바꾸는 작업을 했습니다. plugin 을 이용해 손쉽게 변경할 수 있습니다.1. Jekyll ..."
  }
  // ...
  // 작성된 md 파일들의 내용이 거의 그대로 실린다 (용량이 크다)
]
```

#### 검색 결과 `_includes/search-results.html`

```html
<div id="search-result-wrapper" class="d-flex justify-content-center unloaded">
  <div class="col-12 col-sm-11 post-content">
    <div id="search-hints">
      {_% include trending-tags.html %_}
    </div>
    <div id="search-results" class="d-flex flex-wrap justify-content-center text-muted mt-3"></div>
  </div>
</div>
```

## 2. [Algolia](https://www.algolia.com/doc/)

데이터소스를 클라우드로 전송하고, 인덱싱하여 클라우드의 검색엔진으로부터 검색 결과를 요청할 수 있는 검색 SaaS 입니다.

### 사용법

1. 회원가입 및 로그인
2. Dashboard 이동 및 Application 생성 (기본)
3. (왼쪽 사이드바) Search 메뉴에서 Index 생성
4. 데이터소스 업로드
5. Index 하위 메뉴에서 UI Demos 로 쿼리 테스트

### API Keys

- 왼쪽 사이드바 하단의 `Settings` 이동
- Team and Access 섹션의 `API Keys` 이동
- Your API Keys
  - Application ID : 필수
  - Search-Only API Key : algoliasearch 클라이언트 생성시 사용
  - Admin API Key : Index 업로드에서 사용

### 인덱스

- 문서 인덱스와 사전 (토큰 뭉치) : 문서로부터 생성
- 쿼리 제안 (Suggestions) : 자주 사용되는 검색어를 기반으로 생성
- 쿼리 분류 : AI 모델을 사용한 프리미엄 서비스 (유료)

### 쿼리 클라이언트 : [instantSearch.js](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/js/#the-instantsearch-instance)

- 설치는 npm 또는 cdn 모두 가능
- [깃허브 - algolia/instantsearch - getting-started](https://github.com/algolia/instantsearch/blob/master/examples/js/getting-started/src/app.js)

```js
const searchClient = algoliasearch(
  'latency',
  '6be0576ff61c053d5f9a3225e2a90f76'
);

const search = instantsearch({
  indexName: 'instant_search',
  searchClient,
});

search.addWidgets([
  instantsearch.widgets.refinementList({
    container: document.querySelector('#brand'),
    attribute: 'brand',
  })
]);

search.start();
```

#### [검색 UI 만들기](https://www.algolia.com/doc/guides/building-search-ui/getting-started/js/#building-a-ui)

```html
<div class="ais-InstantSearch">
  <h1>InstantSearch.js e-commerce demo</h1>

  <div class="right-panel">
    <div id="searchbox"></div>
    <div id="hits"></div>
    <div id="pagination"></div>
  </div>
</div>
```

## 3. [jekyll-algolia](https://www.algolia.com/developers/code-exchange/integrate-jekyll-with-algolia/) 플러그인 적용하기

- [깃허브 - algolia/jekyll-algolia](https://github.com/algolia/jekyll-algolia)
- [데모 jekyll-algolia example](https://community.algolia.com/jekyll-algolia-example/)

### 설치

1. `jekyll-algolia` 설치 : Gemfile 수정 후 `bundle install` 실행
2. `_config.yml` 에 algolia 설정 추가 (APP_ID, INDEX_NAME)
3. `jekyll-algolia` 실행 : ADMIN_API_KEY 필요
4. `deploy.sh` 작업에 indexing 단계 추가 (실패!!)
5. algolia 대시보드에서 인덱싱 조회 (쿼리 테스트)

```text
# Gemfile
group :jekyll_plugins do
  gem 'jekyll-algolia', '~> 1.0'
end
```

```yml
# _config.yml
algolia:
  application_id: '${ALGOLIA_APP_ID}'
  index_name: '${your-index-name}'
```

```bash
# tools/deploy.sh

indexing() {
  # upload to algolia
  ALGOLIA_API_KEY="${ALGOLIA_API_KEY}" bundle exec jekyll algolia --config "$_config"
}

main() {
  # ...
  echo "indexing by algolia..."
  indexing
  # ...
}
```

> github Action 에서 처리하도록 설정했는데, 실패했다. (Node v12 요구)

```text
indexing by algolia...
Error: Process completed with exit code 1.

==> continuous-delivery : 
The following actions uses node12 which is deprecated and will be forced to run on node16
```

### 인덱싱

algolia 의 인덱스로 데이터를 전송한다.

```console
$ ALGOLIA_API_KEY="${ALGOLIA_API_KEY}" bundle exec jekyll algolia --config "$_config"

Processing site...                                                               
       Jekyll Feed: Generating feed for posts
Rendering to HTML (100%) |===================================================|
Extracting records (100%) |==================================================|
Updating settings of index 
Getting list of existing                                  
Updating records in index                                

Records to delete: 0                                                             
Records to add: 3631                                                             
Updating index (100%) |======================================================|
✔ Indexing complete
```

![my-blog algolia-dashboard-index](/2023/10/05-algolia-dashboard-index-w600.png){: width="600" .w-75}

### 검색 UI

`vendor/bundle/ruby` 아래의 `jekyll-theme-chirpy-5.2.1/_includes/` 에 있는 html 파일들을 최상단 동일 디렉토리로 복사한 다음에 작업한다.

#### 검색창 `_includes/topbar.html`

```html
<div id="search-searchbar"></div>
```

#### 검색 설정 `_includes/search-loader.html`

- CDN : `algoliasearch@4.20.0`
- CDN : `instantsearch.js@4.57.0`
- algoliasearch 클라이언트 생성
- instantsearch 질의 및 출력기 설정
  - 입력창 설정
  - 출력 영역과 템플릿 설정

```html
<script src="https://cdn.jsdelivr.net/npm/algoliasearch@4.20.0/dist/algoliasearch-lite.umd.js" integrity="sha256-DABVk+hYj0mdUzo+7ViJC6cwLahQIejFvC+my2M/wfM=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/instantsearch.js@4.57.0/dist/instantsearch.production.min.js" integrity="sha256-foJtB+Wd0wvvK+VU3KO0/H6CjwSwJfB1RnWlgx0Ov9U=" crossorigin="anonymous"></script>

<script>
console.log("going search-loader.html");

// algolia: APPLICATION_ID, SEARCH_API_KEY
const searchClient = algoliasearch('${AGOLIA_APP_ID}', '${AGOLIA_SEARCH_API_KEY}');

// algolia: index_name
const search = instantsearch({
  indexName: '${AGOLIA_INDEX_NAME}',
  searchClient,
});

const hitTemplate = function(hit) {
  const title = hit._highlightResult.title.value;
  const content = hit._highlightResult.html.value;
  const html = content.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"');
  return `
    <div class="post-item">
      <span class="post-meta">${hit.date}</span>
      <h2><a class="post-link" href="${hit.url}">${title}</a></h2>
      <div class="post-snippet">${html}</div>
    </div>
  `;  // 날짜, 제목, 본문 발췌
}

search.addWidgets([
  instantsearch.widgets.searchBox({
    container: '#search-searchbar',  // 입력창
    placeholder: 'Algolia Search...',
  }),

  instantsearch.widgets.hits({
    container: '#search-hits',       // 출력영역
    templates: {
      item: hitTemplate
    }
  })
]);

search.start();
</script>
```

#### 검색 결과 `_includes/search-results.html`

```html
<div class="post-list" id="search-hits"></div>
```


## 9. Review

- 작동되는 것까지는 확인했는데, 다시 simple-jekyll-search 로 원상복구했다.
  - index.html 의 posts 리스트를 함께 조정해야 해서 복잡하고
  - 인덱싱 내용이 html 태그를 포함하고 있어서 후처리가 필요했다.
  - 이쁘게 출력하게 만들기가 어렵고 번거로워 포기
  - algolia 붙이는 작업을 하려면 search.html 을 따로 만드는게 좋겠다.
- 프론트엔드 실력이 좋으면 이거저거 해볼게 많은데, 참 안타깝다. 흐유~
- Algolia 키워드 제안(search suggestion) 기능을 시험해보지 못했다.

### 참고문서

- [Switching site search to Algolia, with Netlify build plugin](https://frankindev.com/2021/05/22/switch-to-algolia-search/)
- [Create a Search in Jekyll - Part2](https://blog.floriancourgey.com/2018/11/migrate-from-wordpress-to-jekyll-2)
  - Simple method: text search with SimpleJekyllSearch
  - Advanced search: Full-text search with lunr.js
  - Server-side search with Algolia

### nodejs 용 검색 라이브러리 : [lunr.js](https://lunrjs.com/docs/index.html)

- jekyll 에서 생성하는 search.json 파일을 이용해서 검색 기능을 만들 수 있다.
  - `simple-jekyll-search` 의 대체제

> 참고문서

- [Jekyll Static Site Search With lunr.js](https://thomascfoulds.com/2020/07/27/jekyll-static-site-search-lunr.html)
- [Jekyll search using lunr.js](https://learn.cloudcannon.com/jekyll/jekyll-search-using-lunr-js/)
- [How to insert the search box on your Jekyll site using lunr.js in Shopify](https://avada.io/shopify/devdocs/insert-the-search-box-on-your-jekyll-site-using-lunr-js.html)

```js
var idx = lunr(function () {
  this.field('title')
  this.field('body')

  this.add({
    "title": "Twelfth-Night",
    "body": "If music be the food of love, play on: Give me excess of it…",
    "author": "William Shakespeare",
    "id": "1"
  })
})

idx.search("love")
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
