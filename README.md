# [태주네 블로그](https://taejoone.jeju.onl) (Taejoone)

기존 Jekyll 5.2.1 에서 7.3.1 로 업그레이드 작업을 수행했다.

- `2025-09-16` [Jekyll Chirpy 7.3.1 작업 기록](/_posts/2025-09-16-upgrade-jekyll-chirpy-v7.md)
- `2022-08-31` [Jekyll Chirpy 5.2.1 작업 기록](/_posts/2022-08-31-renewal-jekyll-github-pages.md)

## 사용한 Jekyll template

- [깃허브 - Chirpy Starter](https://github.com/cotes2020/chirpy-starter) ![GitHub license](https://img.shields.io/github/license/cotes2020/chirpy-starter.svg?color=blue)
  - [테마 - jekyll-theme-chirpy 7.3.1](https://rubygems.org/gems/jekyll-theme-chirpy) ![Gem Version](https://img.shields.io/gem/v/jekyll-theme-chirpy)
  - Ruby 3.3

참고 : [jekyll-theme-chirpy 문서](https://github.com/cotes2020/jekyll-theme-chirpy/wiki).

### Usage

> 로컬 실행 및 검사

```console
# 로컬 실행
$ tools/run.sh -H 0.0.0.0 -O 4001

# 깃허브 커밋 전에 htmlproofer 로 무결성 확인
$ tools/test.sh
```

> 이미지, 비디오 변환 도구

```console
# 현재 디렉토리의 png 이미지들을 모두 webp 로 변환
$ tools/images2webp.sh

# webp 포맷으로 이미지 변환
$ cwebp -resize 800 0 -q 80 -m 6 -mt origin.png -o target.webp

# h264 포맷으로 비디오 인코딩
$ ffmpeg -i origin.mp4 -vcodec h264 -acodec aac target.mp4
```

> Jekyll 마크다운 사용법

- 참고 : [Jekyll Typography 사용법](/_posts/2018-08-08-jekyll-typography.md)

### Trouble shooting

대부분의 모듈 문제는 강제 재설치 `bundle install --redownload` 로 처리할 수 있다.


## 수정 사항

```shell
.
├── _config.yml, CNAME, Gemfile
├── .github/workflows
├── _data
├── _layouts
├── _sass
├── _tabs
├── tools
└── assets
  ├── css
  ├── img : favicons
  └── lib/fonts
```

### `_config.yml`, `CNAME`, `Gemfile` 수정

- CNAME : public domain 작성
- Gemfile : 추가 plugin 작성
- `_config.yml` : 타이틀 및 메타 정보와 블로그 기능 설정사항

### `.github/workflows` 수정

- `pages-deploy.yml` : htmlproofer 파라미터를 추가

### `_data` 수정

- `locale/ko-KR.yml` : About 페이지 이름을 '자기소개'로 변경
- `authors.yml` : 외부 저자 정보를 작성 (name, url)
- `contact.yml` : 사이드바 하단 연락처 링크를 수정
- `share.yml` : 포스트 공유 연결 서비스를 수정

### `_includes` 수정

- `read-time.html` : '읽는 시간 ??분'으로 포맷 변경

### `_layouts` 수정

- `archives.html` : '일/월' 표시가 거슬려서 '월/일'로 변경
- `post.html` : comments 기능 넣었다가 지저분해서 다시 삭제함

### `_sass` 수정

- `abstracts/_variables.scss` : 스타일 변수 설정
  - `$font-family-base`, `$font-family-heading` 에 'Noto Sans KR' 설정
- `pages/_home.scss` : `.card-title` 수정
  - 홈 화면의 카드 타이틀 폰트 아랫부분이 잘리는 문제가 있어서 `padding-bottom` 추가

### `_tabs` 수정

- `about.html` 에 자기소개 작성 : 경력 및 Cover Letter
- 그 외 필요한 별도의 페이지를 추가

### `tools` 수정

- 실행과 검사용 쉘 스크립트
- 그 밖에 필요한 유틸리티

### `assets` 수정

- `img` : favicons 및 포스팅용 이미지 파일들
- `lib` : Self-hosting 을 할 js, fonts 파일들
- `css/jekyll-theme-chirpy.scss`
  - 폰트 'Noto Sans KR', 'JetBrains Mono', D2Coding' 임포트
    - `/assets/lib/fonts` 밑에 woff, woff2 파일 저장
  - 코드 하이라이트 용으로 'JetBrains Mono', D2Coding' 적용
  - 그 밖에 필요한 style 정의

