---
date: 2022-10-25 00:00:00 +0900
title: AWS Lightsail 에서 Amazon Linux 2 설정하기
description: AWS Lightsail 에서 Amazon Linux 2 를 선택하고 초기 설정 작업들을 기록합니다.
categories: [DevOps, Cloud]
tags: [lightsail, install, aws]
image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSKc1WSJDv5bZkserQAiBZu6VCh-hD54Cj6dw&s"
---

## 1. AWS Lightsail

AWS 세미나 홍보가 왔길래, 겸사겸사 예습을 위해 Lightsail 서비스를 사용해 보고 있다. 느낌적인 느낌이지만 EC2 의 `t2.micro` 와 비슷한 사양(CPU 1개, 메모리 1G)에서 훨씬 쾌적한 느낌이다. 

요약하자면 Lightsail 은 EC2 의 light 버전(개발자용)이라 생각된다. 조금 더 저렴하게, 개발자용으로 단순/간편하게, 대신 SLA 보장을 조금 낮춘 인프라다.

### 1) EC2 와의 비교

참고: [AWS - Lightsail 과 EC2 비교](https://inpa.tistory.com/entry/AWS-%F0%9F%93%9A-Lightsail-vs-EC2-%EB%B9%84%EA%B5%90-%EC%96%B4%EB%8A%90%EA%B2%8C-%EC%A2%8B%EC%9D%84%EA%B9%8C)

#### EC2 특징

- IAM 을 이용해 디테일한 권한과 보안 설정
- 인스턴스 타입 변경 가능
- 서버를 껏다 켰다 할 수 있다. (종량제)
  + 관리를 통해 요금을 절감할 수 있다. (그러나 한계가 있다)
- 더 하드하고 복잡한 설정과 관리를 필요로 한다
  + 서버를 추가하면 그만큼 더 설정할 사항들이 많아진다
- 고정 IP 또는 로드밸런서를 사용하면 요금이 엄청 늘어난다

#### Lightsail 특징

- 개발자용으로 나온만큼 인프라 관리가 단순하다
- 인스턴스 타입을 변경하려면 새로 생성한 후 이미지를 복사해야 한다
- 서버를 껏다 켰다 할 수 없다. (정량제)
  + 그렇지만 24시간 기준으로 EC2 에 비해 저렴하다
- 서버를 여러대 추가하는 것이 어렵지 않다 (설정할게 없다)
- 고정 IP를 5개까지 준다고 한다. (<== 이게 킬링포인트/하이라이트)

### 2) 요금

![AWS Lightsail 요금](https://swiftcoding.org/wp-content/uploads/amazon-lightsail-new-plan-2018.png){: width="600"}

- 계정당 최대 20개의 인스턴스 유지
- 5개의 고정 IP 
- 총 3개의 DNS 존 
- 총합 20TB의 블록스토리지(디스크) 연결
- 5개의 로드 밸런서
- 최대 20개 인증서

#### EC2 `t2.micro` 인스턴스 1개와 비교

30G 스토리지를 포함해 하루 12시간만 운용하고 있는데, 4.5 달러 정도 나온다. 반면에 Lightsail 에서 비슷한 사양(40G 스토리지)으로 24시간 운용해도 5 달러가 나온다. 확실히 이득이다.

그리고 3개월간 무료(free)다. 

## 2. Lightsail 인스턴스 생성

### 1) [Amazon Lightsail - Home](https://lightsail.aws.amazon.com/ls/webapp/home) 접속

- create instance
- 5$ 인스턴스 선택
- OS 이미지에서 Amazon Linux 2 선택
- 그 외 설치 리전 등을 선택

![생성된 인스턴스](/2022/10/25-tonyne-dev01-Instances-crunch.png){: width="620"}

### 2) 메뉴

- Connect : 웹콘솔 SSH 접속
- Storage : 디스크 추가
- Metrics : 모니터링
- Networking : 고정 IP, 방화벽, 로드밸런싱, CDN (배포)
  + 일단 `Route 53` 에서 레코드 `A Type` 으로 `IPv4` 를 연결하여 사용
- Snapshots : 백업
- Tags : 키-값 태깅 (리소스 관리용)
- History : 설정 변경 이력 조회
- Delete : 인스턴스 삭제

### 3) 방화벽 설정

![방화벽 규칙 추가 - Custom TCP](/2022/10/25-tonyne-dev01-Networking-crunch.png){: width="480"}

백엔드 API 용도와 프론트엔드 WEB 용도로 TCP 포트를 추가했다.

### 4) pem 파일로 ssh 접속

- 키워드 입력 후 ssh 프라이빗 키 파일(pem) 다운로드
  + Permission 문제 방지를 위해 `chmod 400` 처리 
- 자신의 PC 에 잘 저장 (백업도 해 두고)
- `~/.ssh/config` 설정

```shell
$ chmod 400 <PATH>/yourPublicKeyFile.pem

$ vi ~/.ssh/config
# ...
Host awsdev
  User ec2-user
  IdentityFile <PATH>/yourPublicKeyFile.pem
  Hostname <IP주소>
      Port 22
      ServerAliveInterval 120

$ ssh awsdev
```

## 3. Amazon Linux 2 설정

### 1) yum 리포지토리 업데이트 및 기본 도구 설치

참고자료

- [amazon-linux-extras 패키지 설치](https://aws.amazon.com/ko/premiumsupport/knowledge-center/ec2-install-extras-library-software/)
  + postgresql14, mariadb10.5, tomcat9, php8.1 등..
  + rust1, golang1.11, ruby2.6, python3.8 등..

- [Amazon Linux 2 패키지 목록 및 버전 비교](https://docs.amazonaws.cn/en_us/linux/al2022/release-notes/version-compare-al2022.html)
  + 안정 버전 위주라서 최신 버전이 필요하면 repo 등록후 직접 설치

- [Amazon Linux 인스턴스에서 리포지토리 추가](https://docs.aws.amazon.com/ko_kr/AWSEC2/latest/UserGuide/add-repositories.html)


```shell
# amazon-linux-extras 패키지 설치 확인
$ which amazon-linux-extras
/usr/bin/amazon-linux-extras

# 없으면 설치
$ sudo yum update
$ sudo yum install -y amazon-linux-extras

# 패키지 설치 
$ sudo amazon-linux-extras install java-openjdk11
$ sudo amazon-linux-extras install redis6
$ sudo amazon-linux-extras install docker
$ sudo amazon-linux-extras install nginx1

```

> git, vim 등은 "amzn2-core"에 포함되어 설치되어 있음

#### 환경 설정 : TimeZone

```shell
# TimeZone 설정 (서울)
$ sudo cp -p /usr/share/zoneinfo/Asia/Seoul /etc/localtime
$ date 
```

#### `.bashrc` 설정

```shell
# User specific aliases and functions
export LANG=ko_KR.UTF-8

# default text editor
export EDITOR=vim
export VISUAL=vim

# aliases
alias vi="vim"
alias ports="sudo netstat -tnlp"
alias llt="ls -alt | grep ^-"
alias lls="ls -alSSrh"
alias monitor_cpu="mpstat -P ALL 4"

# for poetry with ssh
export PYTHON_KEYRING_BACKEND=keyring.backends.null.Keyring

# for common
export PATH="$(yarn global bin):$PATH"

# [주의!!]
# .bashrc 에서 echo 명령 사용하려면 case 문장 뒤에 작성해야 함!
case $- in
    *i*) ;;
    *) return;;
esac

echo "Your Greeting/Warning Message/s here!"
```

> .bashrc 에서 echo 명령 사용하면 scp 가 작동 안되는 문제

참고: [Stackoverflow - SCP doesn't work when echo in .bashrc?](https://stackoverflow.com/a/58248508/6811653)

- `scp` 로 파일 복사를 시도했는데 not working => 황당
- 맥OS 또는 우분투(Demian 계열)에서는 겪어보지 못한 문제
  + Red Hat Enterprise Linux (RHEL) 또는 Fedora 계열에서 주의!

#### `.vimrc` 설정

- vim colorscheme [jellybeans](https://github.com/nanotech/jellybeans.vim) 설치
- JetBrainsMono font 설치

```shell
# Install jellybeans colorscheme
$ mkdir -p ~/.vim/colors
$ cd ~/.vim/colors
$ curl -O https://raw.githubusercontent.com/nanotech/jellybeans.vim/master/colors/jellybeans.vim

# Install JetBrainsMono font on Linux
$ export FONT_JETBRAINS_DIR=/usr/share/fonts/JetBrainsMono
$ sudo mkdir -p $FONT_JETBRAINS_DIR && sudo wget https://github.com/JetBrains/JetBrainsMono/releases/download/v2.242/JetBrainsMono-2.242.zip -P $FONT_JETBRAINS_DIR
$ sudo unzip $FONT_JETBRAINS_DIR/JetBrainsMono-2.242.zip -d $FONT_JETBRAINS_DIR && sudo rm $FONT_JETBRAINS_DIR/*.zip
$ sudo fc-cache
```

- `~/.vimrc` 설정

```text
" Syntax Highlighting
if has("syntax")
    syntax on
endif

set smartindent
set tabstop=4
set expandtab
set shiftwidth=4

set guifont=JetBrains\ Mono\ 13
colorscheme jellybeans
```


### 2) Java, Node, Python 설치

#### openjdk-devel 설치 (jps 포함)

```shell
# jdk-devel 검색 
$ yum list java*jdk-devel

# 설치
$ sudo yum install -y java-11-openjdk-devel.x86_64
$ jps
```

#### nodejs 16, yarn 설치

```shell
# node 16.x 설치
$ curl -sL https://rpm.nodesource.com/setup_16.x | sudo bash -
$ sudo yum install -y nodejs
$ sudo yum install gcc-c++ make

# yarn 설치
$ curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
$ sudo yum install -y yarn
```

#### Python3.9 설치

- `amazon-linux-extras` 에는 Python3.8 이 있음

```shell
$ sudo yum -y groupinstall "Development Tools"
$ sudo yum -y install openssl-devel bzip2-devel libffi-devel

$ gcc --version
gcc (GCC) 7.3.1 20180712 (Red Hat 7.3.1-13)

$ make --version
GNU Make 3.82

$ sudo yum -y install wget
$ wget https://www.python.org/ftp/python/3.9.15/Python-3.9.15.tgz
$ tar xvf Python-3.9.15.tgz

$ cd Python-*/
$ ./configure --enable-optimizations
$ sudo make altinstall

$ python3.9 --version
$ pip3.9 --version
$ /usr/local/bin/python3.9 -m pip install --upgrade pip

$ cd /usr/local/bin
$ sudo ln -s python3.9 python3 
$ sudo ln -s pip3.9 pip3 

# pipx 설치
$ /usr/local/bin/python3.9 -m pip install --upgrade pipx

# python 도구 설치
$ pipx install poetry flake8 black isort
```

### 3) 서비스 설치 및 설정

#### [MongoDB Community Edition 설치 (Amazon Linux 2)](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-amazon/)

```shell
#####################################
##  mongodb
##
$ sudo cat <<EOF > /etc/yum.repos.d/mongodb-org-6.0.repo
[mongodb-org-6.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2/mongodb-org/6.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc
EOF

$ sudo yum install -y mongodb-org

$ sudo systemctl enable mongod.service
$ sudo systemctl start mongod.service
$ sudo systemctl status mongod.service

$ mongosh
> exit()
```

#### 서비스 설정

```shell
#####################################
##  nginx, redis 
##
$ sudo systemctl enable nginx.service
$ sudo service nginx start
$ sudo service nginx status

$ sudo systemctl enable redis.service
$ sudo systemctl start redis.service
$ sudo systemctl status redis.service

#####################################
##  docker group
##
$ sudo usermod -a -G docker ec2-user
$ id ec2-user

# docker 그룹으로 재로그인 (ec2-user:docker)
$ newgrp docker

$ sudo systemctl enable docker.service
$ sudo systemctl start docker.service
$ sudo systemctl status docker.service

$ docker login
# Username: ...
# Password: ...
```

- 동작중인 모든 서비스를 조회해보자

```shell
$ systemctl list-units --state=running --no-pager | grep -E '.+\.service'
```

#### 관리 도구

```shell
$ pipx install awscli

$ pipx install docker-compose
```

### 4) 개발 프레임워크 설치

- [nestjs](https://docs.nestjs.com/first-steps#setup)
- [angular](https://angular.io/guide/setup-local#install-the-angular-cli)

```shell
$ yarn global add @nestjs/cli

$ yarn global add @angular/cli
```

## 9. Review

- 웹서비스는 24시간이 정석이다.
- 장맛도 찍어 먹어봐야 아는 법이니, 일단 사용해보자.
- 고정IP로 깔끔하게 ssh 접속할 수 있어 정말 편하다
  + 전에는 켤 때마다 변하는 IP를 찾아 접속했다 (`awscli` 로 IP 조회)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

