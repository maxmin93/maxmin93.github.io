---
date: 2025-12-04 00:00:00 +0900
title: Windows WSL2 에 ext4 드라이브 마운트 방법
description: 이전에 리눅스에서 쓰던 ext4 포맷의 외장 드라이브를 윈도우 11의 wsl2 에 마운트해서 사용하려고 설정한 작업들을 기록합니다. 서브시스템은 debian 13 환경입니다.
categories: [DevOps]
tags: [wsl2, jekyll, debian]
image: "https://devpro.kr/assets/img/title/server/windows/wsl_design.png"
---

기존에 2018년 모델 MacMini 에서 Ubuntu 를 사용하고 있었는데, 드라이버 셋팅이 힘들어서 Windows 11 로 교체했다. 그러면서 ext4 포맷으로 사용하던 1T 짜리 SSD 를 어떻게 할까 하다가 wsl2 에 연결해서 사용하면 C 드라이브 공간 문제도 해결하고 Linux 를 주력으로 사용할 수도 있어서 설정을 시작했다.


## 0. 작업순서

### 수동 작업

1. PowerShell 에서 외장 SSD 드라이브를 mount 하기
2. wsl2 에서 SSD 드라이브의 path 를 하위 폴더로 bind 하기

### 자동 설정

1. 윈도우 시동시 자동으로 mount 하도록 작업 스케줄러 설정
  - mount 할 때마다 UUID 가 달라져서 path 로 설정해야 함
2. `/etc/fstab` 에 bind 설정
  - home 위치에 용도별로 bind 하자 : workspaces, dockers 등..


## 1. 수동 작업

### 1-1. SSD 드라이브 mount 하기

- 드라이브를 연결한 상태에서 <u>관리자 권한</u>으로 PowerShell 실행
- wsl 상태를 초기화 하기 위해 shutdown 하자
- mount 대상의 DeviceID 를 확인 (ex: `\\.\PHYSICALDRIVE1`)
- `wsl --mount` 명령으로 mount 하기

```console
# wsl2 서브시스템 기본값 확인
> wsl -l -v
  NAME              STATE           VERSION
* Debian            Running         2
  docker-desktop    Running         2

# 현재 작동중인 wsl 종료
> wsl --shutdown

> wmic diskdrive list brief
DeviceID : \\.\PHYSICALDRIVE1
Model : SHGP31-1000GM
Partitions : 2
Size : 1000202273280

> wsl --mount \\.\PHYSICALDRIVE1 --partition 1 -t ext4
디스크가 '/mnt/wsl/PHYSICALDRIVE1p1'(으)로 탑재되었습니다.
참고: /etc/wsl.conf에서 automount.root 설정을 수정한 경우 위치가 달라집니다.
디스크를 마운트 해제하고 분리하려면 'wsl.exe --unmount \\.\PHYSICALDRIVE1'을(를) 실행합니다.
```
{: file="powershell.exe"}

### 1-2. WSL2 에서 드라이브의 하위경로를 bind 하기

- wsl 하위시스템(Debian)으로 터미널을 열고
- `/mnt/wsl` 밑에 mount 가 잘 되었는지 확인
  - 또는 `lsblk` 명령어 사용
- sudo mount --bind 명령어로 bind 실행
- 잘 연결 되었는지 확인

```bash
$ ll /mnt/wsl/PHYSICALDRIVE1p1

$ lsblk
sdd      8:64   0 931.5G  0 disk
└─sdd1   8:65   0 931.5G  0 part /mnt/wsl/PHYSICALDRIVE1p1


# 통채로 연결해 보자
$ sudo mount --bind /mnt/wsl/PHYSICALDRIVE1p1 $HOME/disk

# 잘 되었다
$ ll $HOME/disk/
합계 24
drwxrwxrwx 7 bgmin bgmin 4096 12월  4일  21:05 ./
drwxrwxrwt 5 root  root   120 12월  4일  12:40 ../
drwxr-xr-x 2 bgmin bgmin 4096 12월  4일  19:19 downloads/
drwxrwxr-x 5 bgmin bgmin 4096 12월  4일  13:23 public/
```
{: file="WSL2 Terminal"}

## 2. 자동 설정

### 2-1. 작업 스케줄러로 자동실행 설정

- 작업 스케줄러를 검색해서 열고
- 작업 만들기를 선택
  - 일반 탭에서 "WSL 시작" 작업 이름을 지정하고
    - '로그온 여부에 관계 없이'를 선택
      - 마지막으로 확인을 누를 때 패스워드를 입력한다
    - **가장 높은 권한으로 실행(Run with highest privileges)**을 체크
  - 트리거 탭에서 새로 만들기를 클릭
    - '시작 시' 또는 '로그온 할 때'를 선택
    - 고급설정에서 작업 지연 시간을 10초 지정
  - 동작 탭에서 새로 만들기를 클릭
    - 프로그램/스크립트 필드에 `powershell` 을 입력
    - 인수 추가 필드에 `-Command "wsl ..."` 명령을 입력

```console
powersell -Command "wsl --mount \\.\PHYSICALDRIVE1 --partition 1 -t ext4"`
powersell -WindowStyle Hidden -Command "& {wsl -d Debian}"
```
{: file="동작 스크립트 항목 (2개)"}

![](/2025/12/04-scheduler-task.webp){: width="380" .w-75}
_작업 스케줄러에 생성한 태스크_

- 잘 작동하는지 '실행'해 보자
  - 우선 `wsl --shutdown` 으로 초기화 하자
  - 실행 후 wsl 에 SSD 드라이브가 잘 연결되었으면 성공

### 2-2. `/etc/fstab` 에 bind 설정

- `$HOME` 밑에 연결하고 싶은 디렉토리들을 미리 생성
- wsl 에서 `sudo vi /etc/fstab` 로 열고 
- 필요한 하위 path 들을 HOME 밑에 연결되도록 작성하자

```bash
$ mkdir -p $HOME/public
$ mkdir -p $HOME/downloads

$ sudo vi /etc/fstab
# bind from mnt path to local path
/mnt/wsl/PHYSICALDRIVE1p1/downloads    /home/bgmin/downloads    none    bind,defaults,nofail 0 0
/mnt/wsl/PHYSICALDRIVE1p1/public    /home/bgmin/public    none    bind,defaults,nofail 0 0

$ sudo mount -a
```
{: file="WSL2 Terminal"}

- 잘 작동하는지, 윈도우를 재시작 해서 확인하자
  - Good! 잘 된다.


## 3. WSL2 팁

### WSL2 네트워크에 대한 방화벽만 비활성화 하기

윈도우 환경에 대한 방화벽은 `Windows 보안` 으로 관리하고, Linux 시스템에 대한 방화벽은 내부에서 알아서 하도록 비활성화 하고 싶다.

1. Windows 검색에서 제어판을 검색해서 열고
2. 시스템 및 보안 > Windows Defender 방화벽으로 이동
3. 왼쪽 메뉴에서 고급 설정을 클릭
4. Windows Defender 방화벽 속성을 클릭
5. 공용 프로필 탭으로 이동 (WSL2는 종종 공용 네트워크로 분류됨)
보호된 네트워크 연결에서 사용자 지정을 클릭
6. vEthernet 항목의 체크박스를 해제하여 해당 인터페이스만 방화벽 보호에서 제외
7. 변경 사항을 적용하려면 PowerShell에서 wsl --shutdown 명령을 실행하여 WSL2 VM을 종료한 후 다시 시작

![](/2025/12/04-defender-firewall-vethernet.webp){: width="580" .w-75}
_윈도우 wsl 의 방화벽만 해제하기_


### WSL2 의 network ip 를 Host 와 일치시키기

- `%USERPROFILE%\.wslconfig` 생성
- wsl2 에 대해 mirrored 모드 설정
- wsl 재시작

```ini
[wsl2]
networkingMode=mirrored
```
{: file="%USERPROFILE%\.wslconfig"}

### WSL2 에서 jekyll 오류 해결

처음에는 Windows 의 디렉토리를 bind 해서 사용하려고 했는데, 안되겠다. 하라는 대로 wsl 내에다가 설치하는게 맞는거 같다.

> WSL 에 ruby 및 jekyll-blog 설치 

```bash
# install ruby 3.3
sudo apt-get install ruby-full

sudo apt install -y build-essential libssl-dev libyaml-dev libreadline-dev zlib1g-dev libffi-dev libgmp-dev nodejs

export RUBY_HOME=$HOME/.local/share/gem/ruby/3.3.0
export PATH="$RUBY_HOME/bin:$PATH"


# download blog source
cd workspaces/blog
git clone --depth 1 $GITHUB/maxmin93/maxmin93.github.io


# install jekyll 4.4.1
bundle install

# _config.yml 위치 설정
bundle config path $(pwd)

# build and run
tools/run.sh
```

> 이상한 md 파일을 빌드하려고 할 때, config 에서 원본 posts 제외

```bash
$ tools/run.sh
Error: could not read file $MY_BLOG_HOME/ruby/3.3.0/gems/jekyll-4.4.1/lib/site_template/_posts/0000-00-00-welcome-to-jekyll.markdown.erb: Invalid date '<%= Time.now.strftime('%Y-%m-%d %H:%M:%S %z') %>'

$ vi _config.yml 
exclude:
  - $MY_BLOG_HOME/ruby/3.3.0/gems/jekyll-4.4.1/lib/site_template/_posts
  - ... 
```

> 라이브러리 설치가 잘못 된 경우

```bash
$ tools/run.sh
Liquid Exception: Liquid syntax error (line 8): Unknown tag 'when' in ruby/3.3.0/gems/liquid-4.0.4/lib/liquid/locales/en.yml

$ rm -rf ruby .bundle
$ bundle install --redownload
```

> 설치시 write 권한 문제가 발생한 경우

```bash
$ bundle install
Bundler::PermissionError: There was an error while trying to write to ...

$ sudo chown -R $USER /var/lib/gems/
$ sudo chown -R $USER /usr/local/bin
```


## 9. Reviews

- wsl 에 대한 방화벽 비활성화 설정을 했는데 다시 원복되는거 같다
- wsl 에서 개인 NAS 서버에 대한 nfs 연결이 안된다. 
  - timeout 발생. 뭐가 문제지?
  - smb 는 잘 연결된다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
