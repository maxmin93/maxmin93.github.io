---
date: 2025-09-29 00:00:00 +0900
title: TrueNAS 와 Application 설치하기
description: 버리긴 아까운 PC 에 NAS를 설치해 쓸모있게 만들어보자. 밖에서도 접속할 수 있도록 도메인을 연결하면 File Browser 웹앱으로 어디서나 파일을 공유할 수 있다.
categories: [DevOps]
tags: [truenas, install, nginx]
image: "https://forums.truenas.com/uploads/default/optimized/2X/3/39fe5131869649c438bf985b0228cefb42ccd20d_2_690x338.png"
---

> TrueNAS 와 [OpenMediaVault](https://www.openmediavault.org/) 를 비교하는 글들이 많은데, 제품 완성도 측면에서 TrueNAS 가 나아 보인다. Docker 를 조금이라도 이해하는 사람이라면 TrueNAS 를 더 유용하게 쓸 수 있을 것이다.


## 작업순서

### TrueNAS 설치

1. [TrueNAS Community Edition](https://www.truenas.com/download-truenas-community-edition/) 에서 25.04 이미지를 다운로드
  - [balena Etcher](https://etcher.balena.io/)로 설치 USB 를 만든다.
2. 설치할 PC의 BIOS에서 부팅 순서를 확인하고, 설치 USB로 부팅한다.
3. TrueNAS 의 Linux OS 가 설치될 디스크를 선택하고 설치 진행
  - boot 역활로 선택된 디스크는 데이터용으로 사용 못한다.
  - 그래서 64GB 샌디스크 USB 를 boot 용으로 사용했다.
4. 재부팅 후 멋없는 콘솔 메뉴가 뜨면 설치 끝
  - 이제부터는 웹UI로 진행한다. (이게 매력 포인트)

### TrueNAS 설정

1. 'System > General Settings' 에서 'Asia/Seoul' 시간대 설정
2. 'Storage' 메뉴에서 Disk 당 1개씩 Pool 생성
  - 디스크의 파티션 생성과 같다.
  - 데이터 안정성을 따질건 아니라서 Layout 은 Stripe 로 설정
3. 'System > Services' 에서 SMB, SSH 활성화
4. 'Network' 설정
  - Interfaces 에서 고정 IP 입력
  - Global Configuration 에서 GW 와 DNS 네임서버 1, 2 입력
    - ssh 접속시 외부 인터넷 연결을 위해 필요
    - 제공되는 인터넷 통신사업자의 네임서버를 설정
5. 'Credentails > Groups' 에서 그룹 생성
  - 특정 path 에 대해 SMB 공유의 접근제어(ACL) 부여를 위해 필요
6. 'Credentails > Users' 에서 사용자 생성
  - UID=1000 : Docker 사용시 권한 일치를 위해 필요한 경우가 있다
  - 'Auxiliary Groups' 항목에 이전에 생성한 group 포함

여기까지 하면 기본적인 설정은 완료다. 이후에는 원하는 기능별로 설정을 진행한다.

![](/2025/09/29-truenas-network.webp){: width="580" .w-75}
_TrueNAS 네트워크 설정_

![](/2025/09/29-truenas-services.webp){: width="580" .w-75}
_TrueNAS 서비스 제어_


## SMB 설정

SMB 서비스가 작동 중이고, 공유 폴더와 권한만 지정하면 된다.

### Datasets 생성

- SMB 그룹으로 'group1' 을 생성했고
- 사용자 'user1' 에 대해 'group1' 을 보조 그룹에 추가했다.
- 'group1' 을 '/public/share' 에 대해 '읽기/쓰기'를 허용하면
  - recursive 적용 옵션 포함
- 네트워크에서 NAS 접근시 'user1' 계정으로 파일 공유가 가능하다.

```text
🗁 disk1
    │
    ├── home
    │     └── user1   # 사용자 계정의 home 디렉토리
    └── public
          ├── drive   # File Browser 의 root
          └── share   # SMB 공유 폴더
```


## SSH 설정

### 사용자 설정

- home 디렉토리를 생성하지 말고, 원하는 위치로 지정하자
  - '읽기/쓰기/실행'은 Other 에게 write 권한만 제한
- 'Upload SSH Key' 항목에 자신의 `id_rsa.pub` 파일을 올리면 'Authorized Keys' 텍스트 창에 추가된다.
  - SSH 접속을 허용하는 화이트 리스트
- 'Shell' 은 zsh 을 선택
  - 접속 후 'oh-my-zsh' 을 설치할거다

![](/2025/09/29-truenas-add-user.webp){: width="580" .w-75}
_TrueNAS 사용자 추가 (admin 권한)_

> Tips
{: .prompt-tip }

- NAS 웹UI 에 접속하려면, 'builtin_administrators' 그룹이 부여되어야 한다.
- SSH 접속이 가능해지면 'builtin_users' 그룹이 할당된다.
- NAS 웹UI 접속이 빨리 끊어지는데, 'System > Advanced Settings' 에서 Access 항목의 Session Timeout 을 300 에서 3600(1시간) 으로 늘리면 편하다.

### SSH 접속

- git 은 설치되어 있다.
- ohmyzsh 와 zsh-autosuggestions 를 다운받아 설치한다.
  - admin 권한이 있어도 ssh 에서 apt, dpkg 등의 패키지 자동 설치는 안된다. git 또는 curl 로 내려받아 설치해야 한다.

```console
$ ssh user1@192.168.0.100  # NAS IP
Welcome to TrueNAS

$ cat /etc/os-release
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"

# ohmyzsh 설치
$ sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

# zsh-autosuggestions 설치
$ git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# zsh 플러그인 설정
$ vi ~/.zshrc
...
plugins=(git zsh-autosuggestions)

export PROMPT="${ret_status} %{$fg_bold[blue]%}%m %{$fg[cyan]%}%c%{$reset_color%} $(git_prompt_info)"
...
```

![](/2025/09/29-truenas-zsh-omz.webp){: width="580" .w-75}
_TrueNAS ssh 접속 (zsh+ohmyzsh)_


## 애플리케이션 설치

'Apps' 에서 원하는 항목을 검색해 설치한다.

![](/2025/09/29-truenas-installed-apps.webp){: width="580" .w-75}
_TrueNAS 설치한 애플리케이션들_

config 폴더를 요구하는 App 들이 있다. 한군데에 모아놓자.

```text
🗁 disk0
    │
    └── configs
          ├── browser       # File Browser 설정 파일
          └── nginx         # nginx proxy manager 설정 파일
                └── certs   # 인증서 폴더
```

### Nginx 프록시 매니저

참고 : [잇츠 매거진 - TrueNAS 도메인 연결하기](https://www.youtube.com/watch?v=MLtAawrAVhQ)

- UID=0, GID=0 으로 설정
- ID/PW : `admin@example.com` / `changeme`
  - 로그인 이후 패스워드 변경

![](/2025/09/29-truenas-app-nginxproxy.webp){: width="580" .w-75}
_TrueNAS Nginx 프록시 매니저_


### File Browser

참고 : [잇츠 매거진 - TrueNAS 파일브라우저 설치하기](https://www.youtube.com/watch?v=QzOy0apnkjk)

- UID=0, GID=0 으로 설정
- ID 는 `admin`
  - 최초 패스워드는 log 파일에 랜덤으로 생성되어 표시된다.
  - 복사해서 로그인 하고, 이후 패스워드 변경

```text
# container logs
...
User 'admin' initialized with randomly generated password: yFYsTacMa1kD6M6B
...
```

![](/2025/09/29-truenas-app-filebrowser.webp){: width="580" .w-75}
_TrueNAS 파일 브라우저_

### Postgres

- postgres 17 이미지
- 데이터 경로를 'pg_data' 만들어 따로 지정하려 했는데 실패다.
  - ixVolumes(자동 경로) 설정으로 해야 작동된다.
- TZ 를 비롯해 LANG 등 환경변수를 넣고 싶었는데 실패다.
  - docker 명세에 이미 설정되어 있다고 안된단다.

![](/2025/09/29-truenas-postgres-test.webp){: width="580" .w-75}
_TrueNAS PostgreSQL 테스트_


## 9. Review

- WebUI 로 작업하고, 시스템을 신경 안써도 되니 편하다.
- File Browser 가 좋아 보여 설치했는데, 막상 쓰려니깐 쓸모가 있나 싶다. 여러명이 같이 써야지 혼자서는 의미가 없다.
- 레딧에서 써보라고 추천하는 TrueNAS 앱들
  - Jellyfin : 미디어 공유
  - Handbrake : 영화 압축
  - Nextcloud : 사설 클라우드
  - Tailscale : VPN

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
