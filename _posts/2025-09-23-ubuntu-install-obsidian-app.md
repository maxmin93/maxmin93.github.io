---
date: 2025-09-23 00:00:00 +0900
title: Ubuntu 에 Obsidian App 설치하기
description: Ubuntu 에서 Obsidian.AppImage 를 Application 처럼 등록해서 사용하기 위한 방법입니다. Github 리포지토리와 연결하는 방법과 유용한 플러그인도 소개합니다.
categories: [Application]
tags: [obsidian, tips]
image: "https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/d9/9e/18/d99e18a7-9b82-4f54-3c7e-d20d351de81a/AppIcon-0-1x_U007epad-0-1-85-220-0.png/1200x630wa.png"
---

## 작업순서

참조 : [How to Create a Launcher for Your AppImage on Linux](https://dev.to/lovestaco/how-to-create-a-launcher-for-your-appimage-on-linux-mc3)

1. [Obsidian - Download](https://obsidian.md/download) 에서 Linux AppImage 다운로드
2. `Obsidian-{version}.AppImage` 를 `/opt/obsidian` 으로 이동
3. 아이콘 이미지 파일도 다운로드 해서 넣고
4. 응용프로그램을 위한 `obsidian.desktop` 을 작성
5. `update-desktop-database` 으로 응용프로그램 업데이트
6. 응용프로그램 리스트에서 찾아서 실행
  - 아이콘을 고정해서 더욱 편리하다.

```console
wget https://github.com/obsidianmd/obsidian-releases/releases/download/v1.9.12/Obsidian-1.9.12.AppImage

sudo mv Obsidian-1.9.12.AppImage /opt/obsidian/

# 인터넷에서 투명 바탕 아이콘으로 적당한 것을 찾아 다운로드
sudo mv Obsidian-Icon.png /opt/obsidian/

cat <<EOF > ~/.local/share/applications/obsidian.desktop
[Desktop Entry]
Name=Obsidian
Comment=Obsidian for Linux
Exec=/opt/obsidian/Obsidian-1.9.12.AppImage --no-sandbox
Icon=/opt/obsidian/obsidian-icon.png
Terminal=false
Type=Application
Categories=Utility;
EOF

update-desktop-database ~/.local/share/applications
```


## 설치시 발생할 수 있는 문제

### snap 또는 deb 으로 설치시 한글 입력이 안되는 문제

참고 : [Ubuntu : 옵시디언 한글 입력 안됨](https://lazyartisan.tistory.com/5)

- 한글 입력기를 iBus 에서 fcixt5 로 바꿔도 해결 안됨
- 그냥 AppImage 로 설치하면 아무 문제 없음


## 유용한 커뮤니티 플러그인

![](/2025/09/23-obsidian-git-vault.webp){: width="560" .w-75}
_Git 플러그인이 사용된 옵시디언_

### [Git](https://github.com/Vinzent03/obsidian-git)

- Github 리포지토리를 Vault 로 설정하면 원격저장소가 된다.
- 설정 > `Custom Git binary path` 에 리포지토리 url 을 넣는다.
  - `https://{git-token}@github.com/리포지토리`

**안됨!!** ➡ iPhone 에 [iSH Shell](https://apps.apple.com/us/app/ish-shell/id1436902243) 이용해 연동하기

- iSH 에서 Github 리포지토리를 다운 받았지만, Obsidian 앱 안으로 폴더를 옮길 수 없다.
- 메시지 : `하위 프로그램과 통신이 되지 않습니다.`

예전에는 되었던 모양이지만, 폴더간에 파일을 직접 옮기는 조작을 애플이 그냥 놔둘리 없을거라 생각하니 안되는 것이 납득이 된다.

### [Periodic Notes](https://github.com/liamcain/obsidian-periodic-notes)

- Daily, Weekly, Monthly 노트를 자동으로 생성해준다.
  - template 노트와 생성 위치를 설정
- Weekly Notes 를 사용하기 위해서는 [Calendar](https://github.com/liamcain/obsidian-calendar-plugin) 플러그인을 설치하고 Weekly Number 를 켜야 한다.

### [Smart Typography](https://github.com/mgmeyers/obsidian-smart-typography)

- 화살표라던지 따옴표 등 몇가지 기호를 자동으로 변환해준다.

### [Abbreviations expander](https://github.com/WoodenMaiden/obsidian-abbreviations)

- 약어를 등록하면 자동으로 변환해 준다.
  - `$snp` -> `S&P500`
  - `$매수` -> `<font color="crimson">**매수**</font>`
  - `$매도` -> `<font color="royalblue">**매도**</font>`

### [Emoji Toolbar](https://github.com/oliveryh/obsidian-emoji-toolbar)

- `설정 > 단축키` 에서 picker 단축키를 설정해서 실행한다.
  - 'Emoji Toolbar: open emoji picker'

### [Timeline](https://github.com/George-debug/obsidian-timeline)

- 시간순으로 내용을 작성할 수 있는 포맷을 제공한다.
- 첫번째 '+'가 왼쪽 date 영역, 두번째가 오른쪽 title 영역, 세번째가 오른쪽 content 영역이다.
  - title 영역은 h3 를 사용하기 때문에, 먼저 닫고 열면 기본 텍스트를 작성할 수 있다. (꼼수)

```md
'''timeline
+ 9/11
+ </h3>📌 왜 샀는지 모르겠다.<h3>
+
  <font color="crimson">**매수**</font> ACE 미국10년국채액티브
  50주, 10240원 → 51만2천원
  <sub>(잘못 눌러서 매수가 되었다. 멍충이!)</sub>
'''
```


## Obsidian 태그

### 문서 별칭과 태그 설정

- 문서를 여러 다른 이름으로 링크할 수 있다.
- tags 는 키워드로도 사용할 수 있다.

```md
---
aliases: [별칭1, 별칭2, 별칭3]
tags: [태그1]
---
```

### 외부 각주

문서간에 링크는 heading 태그에 대해서 기본적으로 지원하지만, 특정 문장이나 블록에도 `^{tag}` 를 붙이면 외부문서에서 참조할 수 있다. 단, 블록 당 하나만 지정할 수 있다.

```md
<!-- 전기차.md -->

## 테슬라 ^TSLA
테슬라에 대한 설명. 블라블라~~

## 리비안 ^RIVN
리비안에 대한 설명. 블라블라~~
```

테슬라의 대한 별칭으로 주식 티커를 외부 각주를 사용했다. 이러면 전기차 회사들마다 문서를 생성하지 않아도 된다. 전기차 문서의 특정 블록을 연결할 수 있다.

AI 파티의 밤 10시 30분 ... <u>테슬라</u> <u>엔비디아</u> 사라

```md
AI 파티의 밤 10시 30분 ... [[전기차#테슬라 TSLA|테슬라]] [[반도체#엔비디아 NVDA|엔비디아]] 사라
```

### 템플릿으로 날짜를 자동으로 작성하기

- template 노트에 `{% raw %}{{date}}{% endraw %}` 또는 `{% raw %}{{time}}{% endraw %}` 를 작성하면 템플릿으로 새 노트를 생성할 때 날짜 또는 시간이 자동으로 작성된다.
  - daily 노트의 템플릿에 작성해 두면 편하다.
- 그 밖에 다른 variables 들은 [설명문서](https://help.obsidian.md/web-clipper/variables)를 참조할 것

```md
오늘 날짜 : {% raw %}{{date:YYYY-MM-DD}}{% endraw %}

<!--
오늘 날짜 : 2025-09-23
  -->
```

### 그 외 유용한 문법

- 노란색 강조 표시 `=={강조영역}==`
- 밑줄 `<u>{강조영역}</u>`
- `[!info]` 같은 CallOut 지원 태그를 사용하면 이쁘다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
