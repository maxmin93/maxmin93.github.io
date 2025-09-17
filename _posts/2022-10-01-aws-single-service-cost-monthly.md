---
date: 2022-10-01 00:00:00 +0900
title: AWS 최소 서비스 - 한달간의 유지비용 측정
categories: [DevOps, Cloud]
tags: ["elb", "한달비용", "ec2", "운영비용"]
image: "/2022/10/01-aws-minimal-architecture-crunch.png"
---

> AWS 싱글서비스 유지에 대한 최소비용을 한달간 실험했습니다. (5만원 소요)
{: .prompt-tip }

AWS 최소 운영비용이 최소 5만원이라는 말을 어디서 본 기억이 나서, 실제로 그런지 실험으로 측정해보았습니다. 할인이나 이벤트는 없는 상태로 최소 구성으로 한달간 운영한 결과, 대략 4만원 정도 나왔습니다. (EC2 를 24시간 가동하면 5만원 될 듯)

## 1. AWS 구성: EC2 + LB + Route53 구성

AWS 를 이용해 1인 서비스를 운영할 때 비용이 어느정도 들지 실비용을 측정하기 위해 다음과 같이 구성했습니다.

### 1) EC2 : 웹서버 + DB서버(sqlite) + 도커

약 9400원 (5.89$ + 부가세 10%)

- 정액제 : 시스템과 스토리지 초기 선택에 따라 결정
  + t2.micro, EBS gp3 30GB
- 평일 오전8시~오후8시 운영 (22일간 220시간)
  + 하루종일 운영하면 낭비가 커서 자동으로 시작/중지 하도록 설정

### 2) LB : 네트워크

약 25657원 ($16.2 + 부가세 10%)

- 종량제 : 1LCU 기준으로 요금 부과
- 운영시간 및 규모를 조절할 수 없음
  + 720시간 (=30일)
- 도메인 접속에 대해 AWS 자원을 연결하는 기능이라 필수 요소임
  + 아니면 IP 고정을 선택해서 노출하던지 (비추)

#### `1 LCU` 는 다음을 포함합니다.

참고 [Elastic Load Balancing 요금](https://aws.amazon.com/ko/elasticloadbalancing/pricing/)

- 초당 25개의 새로운 연결
- 분당 3,000개의 활성 연결
- Amazon Elastic Compute Cloud(EC2) 인스턴스, 컨테이너 및 IP 주소를 대상으로 하는 경우 시간당 1GB, Lambda 함수를 대상으로 하는 경우 0.4GB
- 초당 1,000개의 규칙 평가

> 어지간해서는 개인 서비스로 1 LCU 를 채우기 어렵다네요.

#### 아무것도 없는 서비스인데 왜 이런 사용량이 나왔나?

크롤러나 웹로봇들이 접근해서 그런게 아닌가 짐작할 뿐입니다.

- 해킹해서 좀비 호스트로 쓰려고 한게 아닌가
- AWS 에 등록된 호스트들을 들쳐보는 녀석들이 있지 않나 싶어요.
  + 어떻게 알아낸건지는 모르겠고 (인터넷 라우터들을 뒤지는건지)


### 3) Route 53 : 도메인 설정 및 유지

약 3167원 ($2 + 부가세 10%)

- 정액제 : HostedZone 1개당 $0.5
  - 도메인은 다른 곳에서 구매했지만, AWS 자원과 연결하려면 Route 53 에 등록해야함 

## 2. 2022년 9월 AWS 청구서

AWS 운영 예산을 위한 베이스라인으로 활용

![AWS 청구서 - 2022년9월](/2022/10/01-aws-bill-202209-crunch.png){: width="580"}
_&lt;그림&gt; AWS 청구서 - 2022년9월_

- 2022년 9월 평일 22일 기준
- 달러환율 1440원 기준

## 3. 한달간의 실험 이후의 조치

한달간의 실험이 끝나서 LB 삭제하고 도메인 2개만 유지합니다. 예상 비용은 월 1만원 (EC2 + Route 53)

### 그러면 개발할 때는 어떻게 하려고?

- 번거롭기는 해도 외부 접속이 필요한 경우, 그때그때 Route 53 에 직접 공개 주소를 등록하여 사용
  + EC2 의 공개 주소는 껏다켰다 할 때마다 바뀌어요  

## 4. AWS 구성 (기록)

구성을 없애면서 나중에 작업에 참고하도록 기록해둔다.

![AWS 최소 구성 - Draw.io ](/2022/10/01-aws-minimal-architecture-crunch.png){: width="480"}
_&lt;그림&gt; AWS 최소 구성 - Draw.io_


### 1) EC2

#### EC2 속성

![AWS 구성 - EC2 속성](/2022/10/01-aws-ec2-description-crunch.png){: width="580"}
_&lt;그림&gt; AWS 구성 - EC2 속성_

#### 보안그룹 인바운드 규칙

사용되는 TCP 포트 등록 (아웃바운드는 모두 허용)

![AWS 구성 - EC2 보안그룹 인바운드](/2022/10/01-aws-ec2-sg-inbounds-crunch.png){: width="580"}
_&lt;그림&gt; AWS 구성 - EC2 보안그룹 인바운드_


### 2) ELB

#### LB 속성

![AWS 구성 - LB 속성](/2022/10/01-aws-lb-description-crunch.png){: width="580"}
_&lt;그림&gt; AWS 구성 - LB 속성_

#### LB 목표그룹

외부 접속을 어떤 AWS 자원에 연결할 것인지 정의

![AWS 구성 - LB 목표그룹](/2022/10/01-aws-lb-targetgroup-crunch.png){: width="580"}
_&lt;그림&gt; AWS 구성 - LB 목표그룹_

#### LB 리스너

HTTP/HTTPS 에 대한 리스너 정의

![AWS 구성 - LB 리스너](/2022/10/01-aws-lb-listeners-crunch.png){: width="580"}
_&lt;그림&gt; AWS 구성 - LB 리스너_

#### LB 리스너 규칙 - HTTP:80

80 포트 접속시 443 포트로 리다이렉트

- 내부 nginx 에서 할 수도 있지만 LB 에서 하면 유지보수가 편하다

![AWS 구성 - LB 리스너 규칙 ](/2022/10/01-aws-lb-rules-crunch.png){: width="580"}
_&lt;그림&gt; AWS 구성 - LB 리스너 규칙_


### 3) Route 53

#### A Record

리스너의 A 레코드 값을 지정한다 (LB가 전달하도록)

![AWS 구성 - Route 53 Record](/2022/10/01-aws-route53-a-record-crunch.png){: width="580"}
_&lt;그림&gt; AWS 구성 - Route 53 Record_


## 9. Review

- 전에 AWS 작업하면서 글을 안올렸나보네. 그때그때 기록하자.
- Draw.io 로 AWS 구성도를 그려봤는데, 앞으로 그림자 효과는 빼자.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }