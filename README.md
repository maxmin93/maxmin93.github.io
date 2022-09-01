# [태주네 블로그](https://taejoone.jeju.onl) (Taejoone)

## 사용한 jekyll template

- [깃허브 - Chirpy Starter](https://github.com/cotes2020/chirpy-starter) ![GitHub license](https://img.shields.io/github/license/cotes2020/chirpy-starter.svg?color=blue)
  - [테마 - jekyll-theme-chirpy 5.2.1](https://rubygems.org/gems/jekyll-theme-chirpy) ![Gem Version](https://img.shields.io/gem/v/jekyll-theme-chirpy)
  - jekyll-4.2.2

## 환경 설정

- Ruby 2.7 (권장 2.x 최신버전)
- Gem : ruby 설치 할때 같이 설치됨
  - 체크 : `gem environment gemdir`

### 새로 만들 때

**참고**: [Jekyll 에 Bundler 사용하기](https://jekyllrb-ko.github.io/tutorials/using-jekyll-with-bundler/)

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

### blog 소스를 다시 다운받을 때

```bash
$ cd {my-jekyll-website}

# bundle 의 local 환경설정 (venv 같은)
$ bundle config set path 'vendor/bundle'

# 의존 패키지들 설치하기 (./vendor/bundle)
$ bundle install
```

#### 수정이 필요한 파일들

```shell
.
├── _config.yml
├── _data
├── _plugins
├── _tabs
└── index.html
```

## 사용법

### 소스 관리

`vendor` 는 계속 패키지 다운로드에 따라 종속성이 있는 부분이라, `.gitignore` 에 등록해 주고, 계속 소스 관리를 하고 싶은 부분은 `jekyll-theme-chirpy-{버전}`의 하위 디렉토리 단위로 복사하면 된다.

- 예를 들어, 폰트를 바꾸고 싶다면 `_sass` 모듈이 필요하다.
  - `_sass` 디렉토를 통채로 복사한 후
  - `_sass/addon/common.scss` 파일을 수정
    - 최상단에 `@import url({폰트-URL});` 를 넣고, `body` 에 `font-family` 를 수정

```bash
# 수정을 원하는 모듈의 최상위 디렉토리를 통채로 복사하면 된다
cp -r ./vendor/bundle/ruby/2.7.0/gems/jekyll-theme-chirpy-5.2.1/_sass ./

# ==> `_sass/addon/common.scss` 파일을 수정
body{
  ...
  font-family: 'Noto Sans KR', sans-serif;
}
```

### Post 작성시 주의사항

#### Tag 대소문자 통일 (태그 충돌)

태그 페이지 생성시 대소문자 각각 index.html 생성

```
~~~~
tags: ["zombodb", "Postgresql"]
~~~~
tags: ["zombodb", "postgresql"]
~~~~

Conflict: The following destination is shared by multiple files.
    The written file may end up with unexpected contents.
    {blog_root_dir}/_site/tags/postgresql/index.html
      - tags/postgresql/index.html
      - tags/postgresql/index.html

    ...done in 11.610494 seconds.
```

### 참고

- [jekyll-theme-chirpy 문서](https://github.com/cotes2020/jekyll-theme-chirpy#documentation).
