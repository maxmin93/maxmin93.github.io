---
date: 2022-08-31 00:00:00 +0000
title: 깃허브 블로그 jekyll 갱신하기 (Mac M1)
categories: ["devops", "jekyll"]
tags: ["깃블로그", "깃허브 블로그", "구글검색등록", "버전업", "chirpy 테마"]
image: "/2022/08/31-jekyll-permanant-url-path-min.png"
---

Github pages를 chirpy 5.2.1로 갱신하면서 발생한 오류들과 전체 과정을 설명합니다.

## 1. 기존 블로그 상태와 문제들

### 1) 왜 루비 3.x 을 깐거야

기존에 `jekyll-theme-chirpy` 4.x 버전을 깃허브 블로그에 설치해 사용중이었다. 사실 내가 쓰는 글이 오래도록 보존하고 널리 읽히게 할 만큼 품질이 좋은 것은 아니라 여겼기에, 나만 보는 개발공부 공책같은 쓰임새였다.

그렇다 하더라도 이게 망가져서 못쓰게 되어버리자 정말 불편하고 속상하더라. 명색이 개발자로 20년 가까이를 지냈는데, 자신의 블로그 하나를 관리 못해서야.

어쩌다보니 Ruby 3.x 최신 버전이 설치되면서, ruby 경로가 바뀌었던가보다. 그것도 모르고 블로그 작업을 하다가 작동이 잘 안되는 것을 보고, `bundle` 명령까지 해버렸다. 번들은 루비의 설치관리자이기 때문에 자기 역활을 다했지만, 더이상 로컬에서 페이지를 띄워보면 작업을 할 수가 없게 되어버렸네.

[jekyll 문서](https://jekyllrb.com/docs/)에 보면 `ruby ~> 2.5` 권장이고, 3.x는 호환성 문제로 하지 말라고 한다. 아뭏튼 다시 설치해야 되겠다.

> **_TIP._** 특히나 `brew` 를 사용하는 Mac 에서는 ruby 는 `rbenv` 또는 [chruby](https://github.com/postmodern/chruby) 환경 관리자를 통해 설정하고 건드리지 말자!

### 2) 그밖에 문제들

- 검색에 거의 노출이 안되었다. 기분이 별로라 잘 쓸 필요도 없었고
- md 표현식으로 이미지 크기가 조절이 안되어 html 태그를 썼다.
- 메타 정보를 대충 적다보니 페북 등에 공유 링크를 생성해도 내마음대로 나오지 않았다. (구려서 그런줄 알고 넘어갔음)
- 페이지가 좀 많이 밋밋했다. 다들 똑같은 `jekyll-theme-chirpy` 테마 사용기가 넘친다.

## 2. [jekyll-theme-chirpy-5.2.1](https://github.com/cotes2020/jekyll-theme-chirpy) 로 블로그 버전업

### 1) 신규 리포지토리 생성

`jekyll-theme-chirpy` 페이지가 가면, [1단계 사이트 생성](https://github.com/cotes2020/jekyll-theme-chirpy#step-1-creating-a-new-site) 내용에 `Chirpy Stater` 라는 링크가 있다. 눌러서 새로운 리포지토리를 생성하자.

- 기존에 사용중인 `{github_username}.github.io` 리포지토리가 있다면, 과감히 퍼블리싱을 해제하고 이름을 바꾸어 놓자
  - 깃허브는 계정마다 블로그 도메인이 할당 되어있기 때문에 어디로 도망가지 않는다.
- 새로운 `{github_username}.github.io` 리포지토를 만들고 로컬에서 띄워보자
- 이제 깃허브에 올려서 빌드와 배포(CI/CD)가 잘 되는지 확인하자.
  - 이상이 없으면 작업 환경이 설정된 것임

```bash
$ git clone http://github.com/{github_username}/{github_username}.github.io

$ cd `{github_username}.github.io`

$ ruby --version  # 2.x 버전 확인
$ gem --version   # 최신버전 3.3.11

## bundle 아래에 jekyll 과 jekyll theme 가 설치된다.
## ----------------------------------------

# bundle 의 local 환경설정 (venv 같은)
$ bundle config set path 'vendor/bundle'

# 의존 패키지들 설치하기 (./vendor/bundle)
$ bundle install

# 로컬에서 웹페이지로 확인
$ bundle exec jekyll serve --host 0.0.0.0
```

![jekyll-chirpy-github-action-success](/2022/08/31-jekyll-chirpy-github-action-success-min.png){: width="600" } <br />&nbsp;

> 처음 jekyll(지킬)을 다뤄볼 때에는 다음과 같은 과정을 해보길 권한다.

```bash
$ cd {my-jekyll-website}

# bundle 은 설치 관리자
$ bundle init          # Gemfile 생성

# bundle 의 local 환경설정 (venv 같은)
$ bundle config set path 'vendor/bundle'

# 정적 웹사이트 생성 도구 jekyll 부터 받고
$ bundle add jekyll

# 초기 bundle 관련 파일 제거
$ bundle exec jekyll new --force --skip-bundle .

# 나머지 의존 패키지들 설치
$ bundle install

# (기본 템플릿) 웹사이트 실행 port=4000
$ bundle exec jekyll serve --host 0.0.0.0
```

### 2) `_config.yml` 설정

중요한 항목은 아래 표기한 정도가 되겠다.

```yaml
# The Site Configuration
theme: jekyll-theme-chirpy
baseurl: ""

lang: ko-KR
prefer_datetime_locale: ko
timezone: Asia/Seoul

title: 태주네 블로그
tagline: 풀스택 개발자, ...
description: >-
  Full-stack, AWS, ...

url: "https://{깃허브 계정명}.jeju.onl"

theme_mode: # [light|dark]

img_cdn: "/assets/img"
avatar: "/tonyne-avatar_360x360.png"
# ...
```

### 3) 절대경로(permalink) 설정

permalink 기본 설정으로 `/posts/:title/` 이렇게 잡혀있다.<br />
그러나 이 표기 방식은 불편하다. 파일명도 아니고 제목이면 중복될 수도 있으니깐.

- 문서(post)의 절대경로가 쓰이는 페이지는 posts 와 tabs 이다.
- [jekyll 공식문서 - 절대경로](https://jekyllrb-ko.github.io/docs/permalinks/) 참조
  - 예전에는 `_layouts/post.html` 등에서 직접 수정했었는데
  - jekyll 버전업이 되면서 `:path` 지원이 되었음 (`:slug` 안됨?)

```yaml
defaults:
  - scope:
      path: ""
      type: posts
    values:
      layout: post
      permalink: /posts/:path/
  - scope:
      path: ""
      type: tabs
    values:
      layout: page
      permalink: /:path/
```

> **_TIP._** 절대주소가 바뀌면 이전에 사용했던 링크들이 다 깨져버릴 것이다.

## 3. 깃허브 Action 배포 오류 발생

### 1) gh-pages 브랜치가 생성되지 않는다

`jekyll-theme-chirpy` 는 배포과정에 `gh-pages` 브랜치를 이용한다. 없으면 만드는 과정도 있는데, 안생겼다면 그 이전 단계에서 오류로 멈춰버렸단 뜻이다.

- 오류도 없는데 안생겼으면, 수동으로 만들어도 된다.
- 깃허브 블로그의 배포판을 `gh-pages` 브랜치에서 가져가도록 설정
  - 깃허브 블로그 리포지토리의 `(상단메뉴) Settings > (좌측메뉴) Pages > Branch 항목`
  - Source 항목은 당연히 `Deploy from Branch`
  - 하단에 `Enforce HTTPS` 꼭 체크해주삼 (http 접근도 https 로 리다이렉션 시킴)

### 2) 깃허브 자동빌드(CI) 과정에서 계속 오류

제목에도 써 놓았다시피, 나는 `Apple Macbook Pro M1` 사용중이다. <br />
`arm64` 또는 `aarch64` 아키텍처로 인식된다.

`Gemfile.lock` 에는 의존패키지들의 항목과 버전이 기록되어 있는데, platform 타입도 기재되어 있다. 깃허브 자동빌드(CI) 머신은 `x86_64 linux` 환경에서 똑같이 패키지를 설치하다 오류가 발생된 것이다.

> **_TIP._** 오류가 난 과정의 메시지만 봐서는 못찾았다. 그 이전 단계 로그를 봐야 찾을 수 있음.

![jekyll-chirpy-github-action-fail-log](/2022/08/31-jekyll-chirpy-github-action-fail-log-min.png){: width="600" } <br />&nbsp;

```bash
# Mac M1 환경에서 작업할 떄에는 꼭 확인!
$ bundle lock --add-platform x86_64-linux

# 업로드
$ git add --all && git commit -m "lock x86_64" && git push
```

한번 설치된 이후로 `Gemfile.lock` 이 또다시 수정될 일은 없다. 패키지 버전업 등을 하지 않는 이상 잘 통과된 lock 파일은 안심하고 사용해도 된다.

> **_TIP._** 이 같은 문제 때문에 대부분 `Gemfile.lock` 을 제거하고 올리라 권장하고 있다.

![jekyll-chirpy-lock-modify-x86](/2022/08/31-jekyll-chirpy-lock-modify-x86-min.png){: width="600" } <br />&nbsp;

### 3) 이번엔 또 뭐야? HTML-Proofer 오류

그래도 또 오류가 발생했다. 이런, x장!!

깃허브 자동빌드 과정에서 HTML 검사를 수행하는데 오류가 발생하면 멈춘다. 이전 버전에서는 이런 과정이 기술되어 있지 않아 빌드에서 멈추는 문제가 없었는데, 좋으면서 불편하다.

- [HTML-Proofer 3.17.x 버전 문제](https://github.com/cotes2020/jekyll-theme-chirpy/issues/178#issuecomment-731943898)가 있었는데, 새 버전이 나오면서 해결되었다더라.
  - 현재 버전은 3.18 이다.

> **_TIP._** `{blog_root_dir}/tools/deploy.sh`로 배포 전에 자가 검사를 하자.

```bash
$ ./tools/deploy.sh --dry-run
 Incremental build: disabled. Enable with --incremental
      Generating...
                    done in 10.127 seconds.
 Auto-regeneration: disabled. Use --watch to enable.

Running ["ScriptCheck", "LinkCheck", "ImageCheck", "HtmlCheck"] on ["_site"] on *.html...

Ran on 208 files!

- _site/posts/2019/03/06/ef-java-contents/index.html
  *  linking to internal hash #item01 that does not exist (line 1)
     <a href="/posts/ef-java-ch02#item01">아이템 1. 생성자 메서드를 고려하라</a>
  *  linking to internal hash #item02 that does not exist (line 1)
     <a href="/posts/ef-java-ch02#item02">아이템 2. 생성자에 빌더를 고려하라</a>
...
- _site/posts/python-coding-test8/index.html
  *  linking to internal hash #문제-44 that does not exist (line 569)
     <a href="/_posts/2022-06-12-python-coding-test5.md#문제-44">Consecutive 문제</a>

HTML-Proofer found 178 failures!
```

- 대부분 `<`, `>` 같은 HTML 관련 기호가 그대로 쓰였거나, 깨진 내부 링크 등을 지적한다. 얌전히 수정해 주자.
- 이렇게 해서 모든 어려움을 극복하고 정상적인 블로그 페이지를 볼 수 있게 되었다.

## 4. 사이드바 배경, 폰트 색상 CSS 수정

### 1) `{jekyll-theme-chirpy}/_scss` 디렉토리 복사

밋밋한 스타일을 고치고 싶다면 `scss` 스타일을 수정해야 한다. 그렇다고 테마의 소스 전부를 가져올 필요는 없고 관련된 최상위 디렉토리만 복사하면 된다.

- `{jekyll-theme-chirpy}/_scss` 를 `{blog_root_dir}/_scss` 로 복사
  - common.scss 만 고칠거라고 그거만 가져오는 방법은 안되더라

### 2) `Noto+Sans+KR` 폰트 적용

이쁜 한글 전용 폰트들도 있지만, 구글의 한글 폰트도 좋더라.

- 폰트가 바뀌면 글자폭이 틀려져 이것저것 손댈 것들이 많아진다.

```scss
/* #### _sass/addon/commons.scss #### */

/* 상단에 font 임포트 문장 추가 */
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap");

/* body 의 font-family 수정 */
body {
  /* 기존 항목은 주석처리 */
  // font-family: 'Source Sans Pro', 'Microsoft Yahei', sans-serif;
  /* 원하는 font 작성 */
  font-family: "Noto Sans KR", sans-serif;
}
```

### 3) 사이드바 변경할 때 style 변수를 활용하자

사이드바의 백그라운드에 그라데이션을 주고 싶었다.<br />
배경 이미지를 넣는 것도 해봤는데, 산만해져서 색상 효과만 주기로 했다.

- `--sidebar-bg` 변수는 light-mode 와 dark-mode 각각 설정되어 있다.
  - 한쪽만 써도 된다면 `_config.yml` 에서 모드를 고정하자.

```scss
/* #### _sass/addon/commons.scss #### */

/* --- sidebar layout --- */
#sidebar {
  background: var(--sidebar-bg);  // 변수


/* #### _sass/colors/dark-typography.scss #### */

  /* Sidebar */
  /* 사이드바 배경 그라데이션 */
  --sidebar-bg: linear-gradient(45deg, #822259 0%, #784BA0 13%, #2B86C5 36%, #0e0101 100%);
  /* 사이드바 폰트, 버튼 색상 */
  --sidebar-muted-color: rgba(134, 133, 133, 99%);  // 서브 타이틀
  --sidebar-active-color: rgb(255 255 255 / 80%);   // 메뉴 항목 활성화


/* #### _sass/colors/light-typography.scss #### */

  /* Sidebar */
  --sidebar-bg: linear-gradient(180deg, #FFDEE9 0%, #B5FFFC 100%);
  --sidebar-muted-color: #a2a19f;                   // 서브타이틀
  --sidebar-active-color: #424242;                  // 메뉴 항목 활성화

```

![jekyll-permanant-url-path](/2022/08/31-jekyll-permanant-url-path-min.png){: width="600" } <br />&nbsp;

## 5. [구글 검색 콘솔](https://search.google.com/)에 블로그 등록

말로만 들었지 솔직히 이 과정을 해본 것은 처음이다. 하나도 어렵지 않네.

### 1) 도메인 소유 확인 (AWS Route53)

내 경우엔 구매한 도메인이 있고, AWS 를 통해 DNS 서비스를 사용하고 있다. 도메인 검사과정을 선택한 경우 캡쳐 화면처럼 AWS 콘솔에서 CNAME 레코드를 잠시 TEXT 로 바꾸어 검사를 수행하자.

![google-domain-verification-aws](/2022/08/31-google-domain-verification-aws-min.png){: width="300" } <br />&nbsp;

> **_TIP._** jekyll 페이지를 통해 검사할 수도 있다. 관련 글은 설명하면 많이 나옴.

### 2) 페이지 크롤링 등록

블로그 페이지가 단순하기 때문에 첫페이지만 등록해 주어도 알아서 가져갈거 같다만, 아래 4개 URL을 등록하고 크롤링 신청을 해 두었다.

- 홈페이지
- 카테고리 페이지
- 태그 페이지
- 아카이브 페이지

![google-search-console-taejoone](/2022/08/31-google-search-console-taejoone-min.png){: width="600" } <br />&nbsp;

### 3) 그 밖의 작업

## 6. 사이트 최적화

### 1) 이미지 용량 줄이기

이미지가 제일 큰 문제다. 문서 하나당 이미지 서너장은 쓰는데, 1MB 짜리면 4~5MB 이다. 이래서야 공짜로 쓰는 입장에서 깃허브에 미안할 따름이다.

[compresspng.com](https://compresspng.com/ko/) 와 같은 이미지 압축 사이트들이 있다. 번거롭더라도 이미지 처리를 하고 나면, 대충 1/2 ~ 1/3 까지 용량이 축소된다.

### 2) category, tags 줄이기

쓴 글이 몇개나 된다고, 무슨 태그와 카테고리를 많이 만들었는지 번잡스럽기 짝이 없다. 그만한 글들 인터넷 세상에 천지이니 과감히 통합하자. 심플한게 훨씬 보기 좋더라.

- Jekyll 정적사이트 생성기도 할 일이 줄어든다.

&nbsp; <br />
&nbsp; <br />

```diff
+ This is the end of my post. Thank you.
```
