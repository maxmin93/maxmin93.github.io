---
date: 2025-10-03 00:00:00 +0900
title: TrueNAS 에 Tailscale 설치하기
description: 포트를 공개하기 어려운 원격서버 서비스에 접속하기 위해서 VPN 을 사용해야 한다. Tailscale 은 무료이며, 종단간 터널링과 Exit Node 기능을 제공한다.
categories: [DevOps]
tags: [truenas, install, tailscale]
image: "https://cdn2.steamgriddb.com/logo/9d0bea2cbb6504b5a6ec324dfbdb9446.png"
---

> 목록
{: .prompt-tip }

- [TrueNAS 와 Application 설치하기](/posts/truenas-install-applications/)
- [TrueNAS 에 Docker 로 Apache 설치하기](/posts/truenas-install-docker-apache/)
- [TrueNAS 에 Tailscale 설치하기](/posts/truenas-install-tailscale/) &nbsp; &#10004;


예를 들어 portainer 같은 도커 매니저나 ssh, postgres 등은 내부망 처럼 연결해야 외부 공격에 안전하다. VPN 은 이럴 때 사용하는데, Tailscale 과 Cloudflare 등이 많이 사용된다. 자료를 찾아보니 Cloudflare 는 Tailscale 과 NPM(Nginx Proxy Manager)를 합쳐 놓은게 아닌가 한다. 아뭏튼 도메인이 연결되지 않은 내부망 연결이 필요하기 때문에 Tailscale 을 설치한다.


## 0. 작업순서

1. 다른 기기에서 [Tailscale](https://tailscale.com/) 에서 회원가입(무료)
2. TrueNAS 에서 Tailscale 앱을 찾아서 설치
3. 연결할 기기들을 모두 Tailscale 앱 설치하고 연결
4. SMB 접속이 잘 되는지 확인해 보자


## 1. [Tailscale](https://tailscale.com/) 회원가입

TrueNAS 앱 설치할 때는 회원가입을 못하기 때문에 일단 다른 기기에서 브라우저로 실행

- 'Get started' 선택하고 회원가입(무료)
- 회원 가입을 하다보면 앱을 설치하게 되는데 걱정말고 설치하자
- 앱 접속까지 되면 `100.xxx.xxx.xxx` 가상 IP가 부여된다

이제부터 내 계정으로 접속되는 기기를 하나하나 넣어 연결할거다


## 2. TrueNAS 에 Tailscale 설치

### Install 을 위한 설정사항

- AuthKey 입력 : [Tailsacle 관리자 콘솔](https://login.tailscale.com/admin/settings/general) 에서 `Settings > Keys` 메뉴의 `Genertate auth key...` 버튼 클릭하여 생성
- 선택 옵션에서 'Userspace', 'Advertise Exit Node' 선택
- State Storage 에서 자동(ixVolume) 혹은 원하는 Path 설정
- 그리고 Install

[Tailscale 관리자 콘솔 > Machines](https://tailscale.com/) 에서 NAS 서버가 등록된 것을 확인


## 3. 연결할 기기들을 모두 연결

- [Tailscale 다운로드](https://tailscale.com/download) 하여 설치
  - iOS, Linux, Windows 등등 종류별로 다 있다
- 로그인 하면 자동으로 연결된다.


## 4. 접속이 잘 되는지 확인해 보자

Tailscale 접속이 된 상태에서 TrueNAS 의 가상IP 를 복사하자.

### SMB 접속

- 아이폰의 경우 파일앱에서 `...` 메뉴 아래에 `서버에 연결` 클릭
- 맥북의 경우 Finder에서 메뉴 `이동 > 서버에 연결` 클릭

### Portainer 접속

- Portainer WebUI `https://{가상IP}:31015/` 접속하면 됨


## 5. Tailscale Exit Node 활성화

선택 메뉴가 따로 있는 줄 알았는데, 최근 변경된 것인지 찾아도 없다. Reddit 에서도 어디 있냐고 문의 글이 많다.

- TrueNAS 에서 Tailscale 앱 설치시 Exit Node 옵션 체크했다면
- [Tailscale 관리자 콘솔](https://login.tailscale.com/admin/machines) 에서 TrueNAS 서버에 Exit Node 라는 표시가 있을텐데, `!` 표가 같이 붙어 있다. (비활성화 상태)
- 활성화를 위해 우측 끝 `...` 메뉴 버튼을 눌러 활성화를 하자
  - Exit Node 표시에 `!` 표가 사라졌다. (활성화 상태)

![](/2025/10/03-tailscale-admin-exitnode.webp){: width="580" .w-75}
_TrueNAS 를 Exit Node 로 활성화하는 메뉴_


## 9. Reviews

- Tailscale 설치는 정말 편하다. 매끄럽게 진행된다. 
  - 공짜라 더 좋다.
- 그런데 Nginx Proxy Manager 가 Route 안됨.
  - Tailscale 을 모두 제거한 후에는 다시 정상 작동한다.
  - 관련된 글 [1](https://github.com/tailscale/tailscale/issues/14187), [2](https://github.com/NginxProxyManager/nginx-proxy-manager/discussions/4743) 을 찾아 읽기는 했는데 당장은 번거로워 보류다.
    - 아, 이래서 Cloudflare 를 쓴건가? [PiHole](https://pi-hole.net/) 은 또 뭐지?
- [Cloudflare](https://g.co/finance/NET:NYSE) 주가를 보니 엄청나다. 아--, 진즉 알았다면 샀을텐데
  - 2025년 1분기에 흑자 전환했고, 영업이익률은 11.7% 


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
