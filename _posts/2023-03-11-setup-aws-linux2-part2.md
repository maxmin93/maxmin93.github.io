---
date: 2023-03-11 00:00:00 +0900
title: Amazon Linux 2 설정하기 - Part 2
description: AWS Lightsail 에서 Amazon Linux 2 를 선택하고 초기 설정 작업들을 기록합니다.
categories: [DevOps, Cloud]
tags: [lightsail, install]
image: "https://img1.daumcdn.net/thumb/R800x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdna%2F2AZ1L%2FbtrETSuCXGR%2FAAAAAAAAAAAAAAAAAAAAAAINGnBI_k1fL0DatMdhTIYLXQyfiwTE7GOkD4oD05nE%2Fimg.png%3Fcredential%3DyqXZFxpELC7KVnFOS48ylbz2pIh7yKj8%26expires%3D1759244399%26allow_ip%3D%26allow_referer%3D%26signature%3DtTCh8Aca%252FZOAqA%252BSHsTHrsE5EmE%253D"
---

관련 포스트

- [AWS Lightsail 에서 Amazon Linux 2 설정하기](/posts/setup-amazon-linux-2/)

## 1. Python 3.10 설치

참고 : [How To Install Python 3.10 on Amazon Linux 2](https://techviewleo.com/how-to-install-python-on-amazon-linux-2/)

### 참고 사항

기존 `openssl-devel 1.0.2k-24.amzn2.0.6` 과 충돌이 있기 때문에 삭제하고, openssl11 으로 다시 설치한다.

### 방법

1. Amazone Linux 2 용 개발 도구 그룹을 설치
2. Python 소스 다운로드
3. make 및 install
4. pip 업그레이드 
5. 필요에 따라 /usr/local/bin/python3 링크 재설정

```console
sudo yum update -y
sudo yum groupinstall "Development Tools" -y
sudo yum erase openssl-devel -y
sudo yum install openssl11 openssl11-devel  libffi-devel bzip2-devel wget -y

$ gcc --version
gcc (GCC) 7.3.1 20180712 (Red Hat 7.3.1-13)

$ amazon-linux-extras | grep -i python
 44  python3.8                available    [ =stable ]

$ wget https://www.python.org/ftp/python/3.10.10/Python-3.10.10.tgz
$ tar -xf Python-3.10.4.tgz
$ cd Python-3.10.4/

$ ./configure --enable-optimizations
$ nproc
1

$ make -j $(nproc)

$ sudo make altinstall
$ python3.10 --version
$ python3.10 -m pip install --upgrade pip

$ pip3.10 list
Package    Version
---------- -------
pip        23.0.1
setuptools 65.5.0
```

## 2. certbot

### 1) 도메인 재인증

참고 [Stackoverflow - Certbot 도메인 재인증(renew) 하는 법](https://stackoverflow.com/a/73781129/6811653)

1. nginx 정지
2. certbot 인증 테스트 (dry-run)
3. certbot 재인증 실행 (renew)
    - 인증 방법 : 1번 standalone 선택
    - Congratulations!
4. nginx 시작
5. 재인증 내용 확인 (90일간 유효)

```bash
# certbot v1.11 설치
sudo yum update -y
sudo yum install certbot python3-certbot-nginx

# 테스트
sudo systemctl stop nginx
sudo certbot renew --dry-run

# 재인증
sudo certbot certonly --force-renew -d demo.jeju.onl
# Select the appropriate number => 1

# 재시작
sudo systemctl start nginx
sudo certbot certificates
# ==> Certificate Name: demo.jeju.onl
# ==> Expiry Date: 2023-01-25 02:16:45+00:00 (VALID: 89 days)
```

### 2) [certbot 재인증 작업을 crontab 으로 스케줄 등록 해두기](https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/#auto-renewal)

- 매 홀수 달에만 실행 (month=1/2)
  - `5 4 3 1/2 *` 안됨! ==> `5 4 3 * *` 매달 실행하는 것으로 수정
  - 대신에 스크립트로 조건문과 같이 사용하는 것은 됨 (굳이!)

> 크론탭 스케줄 위치는 '분, 시, 일, 월, 주(week)' 순서임

```bash
sudo crontab -e
# 매달 3일 오전 4시 5분에 실행
5 4 3 * * /usr/bin/certbot renew --quiet

[ `expr $(date +'%m') % 2` -eq 1 ] && echo "odd" || echo "even"
# ==> 홀수달이면 odd, 짝수달이면 even 출력
```

## 3. docker 관련

### 1) Portainer CE 설치

- https 로 도메인을 연결하여 사용하려면 다음 문서를 참고
  - [using-your-own-ssl-certificate-on-docker-standalone](https://docs.portainer.io/advanced/ssl#using-your-own-ssl-certificate-on-docker-standalone)

> 업그레이드 및 재시작

```console
# uninstall
docker stop portainer
docker rm portainer

# download
docker pull portainer/portainer-ce:latest

# install and run
docker run -d -p 9443:9443 -p 8000:8000 \
    --name portainer --restart always \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v portainer_data:/data \
    -v /etc/letsencrypt/live/$MY_DOMAIN:/certs/live/$MY_DOMAIN:ro \
    -v /etc/letsencrypt/archive/$MY_DOMAIN:/certs/archive/$MY_DOMAIN:ro \
    portainer/portainer-ce:latest \
    --sslcert /certs/live/$MY_DOMAIN/fullchain.pem \
    --sslkey /certs/live/$MY_DOMAIN/privkey.pem
```

### 2) scrapy-playwright 도커

- 참고 : 깃허브 [elacuesta/scrapy-playwright-cloud-example](https://github.com/elacuesta/scrapy-playwright-cloud-example)
- Playwright 테스트 [파이썬 코드](https://playwright.bootcss.com/python/docs/intro#usage)
  + `Fast and reliable end-to-end testing ... | Playwright` 출력하면 정상

```dockerfile
FROM python:3.10.10-bullseye

# apt-get update
# apt-get install vim -y

WORKDIR /app

RUN apt-get update \
    && apt-get install nano \
    && pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir playwright scrapy-playwright scrapinghub-entrypoint-scrapy \
    && playwright install --with-deps chromium \
    && mv /root/.cache/ms-playwright /ms-playwright \
    && mv /ms-playwright/chromium-* /ms-playwright/chromium \
    # && mv /ms-playwright/firefox-* /ms-playwright/firefox \
    # && mv /ms-playwright/webkit-* /ms-playwright/webkit \
    && chmod -Rf 777 /ms-playwright

COPY . /app

ENV FOO bar
RUN scrapy crawl chocolatespider --logfile chocolates.log
```

> Amazone Linux 2 에서는 playwright 직접 설치가 안되서 docker 를 사용한다.

```console
docker build -t scrapy-playwright-example .

docker run -it --rm --name example01 scrapy-playwright-example:latest
```

## 9. Review

- nodejs 직접 설치가 안되고, nvm 을 통해 설치하도록 가이드 하고 있다.
  + 이때문에 playwright 설치가 안된다.
- 돌아서면 까먹는다. 나이 탓인가?
  + (완전 재탕은 아니지만) 재탕이라도 또 해보고, 또 기록하자.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
