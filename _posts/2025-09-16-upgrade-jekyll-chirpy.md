---
date: 2025-09-16 00:00:00 +0900
title: Jekyll Chirpy 버전 업그레이드 하기
categories: [Frontend, Jekyll]
tags: [upgrade, ruby]
---

> ruby 2.7 에 jekyll 5.x 버전이 너무 느려서 ruby 3.3 과 최신 7.3.1 버전으로 교체했다. 작업한 사항을 기록한다.
{: .prompt-tip }


## 작업순서

1. ruby 3.3 설치
2. jekyll-chripy-theme 깃허브에서 리포지토리를 생성
3. bundle install
4. `_config.yml` 의 중요사항을 수정하고
5. 우선 실행해본다. 퍼블리싱이 잘 되었는지 확인한다.
6. 변경사항을 수정하고 테스트 한다.
7. 이상이 없으면 기존 포스트들과 이미지 파일들을 복사한다. 
8. 커밋하고 퍼블리싱한다.

### 실행

```console
$ tools/run.sh

> bundle exec jekyll s -l -H 127.0.0.1 -P 4001

Configuration file: /home/bgmin/Workspaces/my-blog/renew-blog/_config.yml
            Source: /home/bgmin/Workspaces/my-blog/renew-blog
       Destination: /home/bgmin/Workspaces/my-blog/renew-blog/_site
 Incremental build: disabled. Enable with --incremental
      Generating... 
                    done in 2.254 seconds.
 Auto-regeneration: enabled for '/home/bgmin/Workspaces/my-blog/renew-blog'
LiveReload address: http://127.0.0.1:35729
    Server address: http://127.0.0.1:4001/
  Server running... press ctrl-c to stop.

ERROR '/.well-known/appspecific/com.chrome.devtools.json' not found.
```

`com.chrome.devtools.json` 오류 메시지는 chrome 에서 요구하는 사항이기 때문에 신경쓰지 않아도 된다.

## 큰 변경사항

- 기존에는 포스트 링크의 포맷이 `/posts/YYYY-MM-DD-{post.title}/` 이었는데 `/posts/{post.title}/` 으로 변경되었다.
	- 이 때문에 내부 링크들을 모두 수정해야만 했다.


## 폰트 변경

### 원하는 폰트를 내장(self-hosting)하기

- 기본 폰트 : 'Noto Sans KR'
- 코딩 폰트 : 'JetBrains Mono', 'D2Coding'

> D2Coding 폰트는 내장시켰다.

`assets/lib/fonts` 밑에 `woff`, `woff2` 파일들을 저장했다.

### 폰트 적용하기

검색한 내용으로는 `$font-family-base`, `$font-family-heading` 변수를 수정하면 적용된다고 하는데, 해보니깐 안된다.

```scss
/* fonts */
/* 참고: https://walkbori.com/posts/blog-font/ */

$font-family-base: 'Noto Sans KR', 'Source Sans Pro', 'Microsoft Yahei', sans-serif !default;
$font-family-heading: 'Noto Sans KR', Lato, 'Microsoft Yahei', sans-serif !default;
$code-font-family: 'JetBrains Mono', 'D2Coding', monospace !default;
```
{: file='_sass/abstracts/_variables.scss''}

> `jekyll-theme-chirpy.scss` 에서 태그에 직접 지정

- `@import` 문으로 폰트를 추가하고
- 기본 폰트를 body, header, h1, h2, h3, h4, h5 에 적용
- 코딩 폰트를 pre, code, kbd 에 적용

```scss
/* append your custom style below */

@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700;900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap');
// @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap');

@font-face {
  font-family: 'D2Coding';
  src: url('/assets/lib/fonts/D2Coding.woff2') format('woff2'),
       url('/assets/lib/fonts/D2Coding.woff') format('woff');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'D2CodingBold';
  src: url('/assets/lib/fonts/D2CodingBold.woff2') format('woff2'),
       url('/assets/lib/fonts/D2CodingBold.woff') format('woff');
  font-weight: bold;
  font-style: normal;
}

pre, code, kbd {
  font-family: 'JetBrains Mono', 'D2Coding', monospace;
}

body, header, h1, h2, h3, h4, h5 {
  font-family: "Noto Sans KR", sans-serif;
}
```
{: file='assets/css/jekyll-theme-chirpy.scss'}

폰트 탓인지 한글 텍스트가 깔끔해졌다.

## `_data` 수정

### `authors.yml` 추가

포스트의 저자(author)를 개별 지정할 수 있는데, `authors.yml`에 없는 name 을 사용하면 공백으로 출력된다.

```md
---
title: Jekyll Typography
categories: [Blogging, Demo]
tags: [typography]
author: cotes
---
```

`authors.yml` 을 작성하면 name 과 url 이 출력된다.

```yml
cotes:
  name: Cotes Chung
  url: https://github.com/cotes2020
```
{: file='_data/authors.yml'}

## Tools 스크립트 수정

### `tools/run.sh`

기본포트 4000번을 사용중이라 파라미터에서 입력받도록 수정했다. 

```bash
host="127.0.0.1"
port="4001"

help() {
	# ...
  echo "Options:"
  echo "     -H, --host [HOST]    Host to bind to."
  echo "     -O, --port [PORT]    Port to bind to. (default 4001)"
}

while (($#)); do
  opt="$1"
  case $opt in
  -H | --host)
    host="$2"
    shift 2
    ;;
  -O | --port)
    port="$2"
    shift 2
    ;;
	# ...

command="$command -H $host -P $port"

# ...
```
{: file='tools/run.sh'}

### `tools/test.sh`

`bundle exec htmlproofer` 을 실행하여 출력본의 html 유효성을 검사한다. 이게 통과가 안되면 github.io 에 퍼블리싱 되지 못한다.

> 오류 메시지

- 링크에 http 사용을 허용하지 않음
- a 태그에 href 누락을 허용하지 않음

```console
$ tools/test.sh
Running 3 checks (Images, Links, Scripts) in ["_site"] on *.html files ...


Checking 344 internal links
Checking internal link hashes in 17 files
Ran on 41 files!


* At _site/index.html:1:
  image http://image.yes24.com/goods/65551284/800x0 uses the http scheme

* At _site/posts/ef-java-ch03/index.html:1:
  http://image.yes24.com/goods/65551284/800x0 is not an HTTPS link

* At _site/posts/ef-java-ch02/index.html:1:
  'a' tag is missing a reference

# ...

HTML-Proofer found 124 failures!
```

> 수정사항

- `--allow-missing-href` 추가
- `--no-enforce-https` 추가

```bash
main() {
  # ...

  # test
  bundle exec htmlproofer "$SITE_DIR" \
    --allow-missing-href \
    --no-enforce-https \
    --disable-external \
    --ignore-urls "/^http:\/\/127.0.0.1/,/^http:\/\/0.0.0.0/,/^http:\/\/localhost/"
}
```
{: file='tools/test.sh'}


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
