---
date: 2022-11-02 00:00:00 +0900
title: IFTTT 서비스와 자동화 관련 SaaS 조사
description: IFTTT 의 개념과 자동화 서비스 형태, 그리고 유사한 SaaS 서비스에 대해 알아보자.
categories: [DevOps]
tags: ["ifttt", "saas"]
image: "https://i0.wp.com/staceyoniot.com/wp-content/uploads/2019/05/IFTTT-Banner-2.png"
---

## 1. IFTTT (If This Then That)

IFTTT 는 여러 별개의 서비스와 어플들을 임의로 연동시켜주는 서비스를 말한다. 대표적인 상용 서비스로 [ifttt.com](https://ifttt.com/) 이 있다.

![IFTTT.com 프로세스 개요](https://web-assets.ifttt.com/packs/media/docs/architecture_diagram-8e8dd23e5d10e35cb94d.png){: width="600" .w-75}

### 1) IFTTT.com 서비스

[IFTTT - Apple App](https://apps.apple.com/us/app/ifttt-automation-workflow/id660944635) 설명을 보면 다음과 같이 작성되어 있다.

> 코드가 없는 간단한 인터페이스로 즐겨 사용하는 앱과 장치를 연결하고 자동화하십시오.
> 
> IFTTT를 사용하면 700개 이상의 인기 있는 서비스를 결합하여 생활의 거의 모든 것을 자동화할 수 있습니다. 100,000개의 사전 구축된 자동화 중 하나를 켜거나 창의력을 발휘하여 나만의 자동화를 구축하십시오. 자동화는 두 서비스를 연결하는 것처럼 간단할 수도 있고 여러 서비스와 조건부 논리를 포함하는 워크플로만큼 정교할 수도 있습니다.

#### 사용 사례로 제시한 것들 (레시피)

레시피는 IFTTT 에서 사전 정의된 서비스 통합 형태를 말한다.

- Siri, Alexa 또는 Google Assistant를 사용하여 스마트 홈을 제어
- 음성 어시스턴트로 iOS 미리 알림 추가
- 파일, 사진 및 연락처를 Dropbox 같은 클라우드 스토리지에 백업
- 위치를 사용하여 자동으로 Hue 조명 및 Spotify 재생
- 맞춤형 날씨 알림으로 악천후 대비
- 홈 보안 경보를 자동화하여 알림
- 최신 YouTube 동영상을 게시하면 Discord에서 공유
- Twitter, Instagram, Facebook 등과 같은 여러 플랫폼에 교차 게시하여 소셜 미디어를 간소화
- iPhone 및 Apple Watch의 건강 앱과 통합하여 건강 추적
- 웹훅을 사용하여 아직 IFTTT에 없는 서비스 연결 및 통합

#### 연동하는 앱/서비스들은

- 음성형 어시스턴스 : Siri, Alexa, Google Assistant
- 클라우드 저장소 : Dropbox, Microsoft, Google
- 생산성 도구 : Microsoft, Google 앱 (칼렌더/문서도구 등)
- 소셜 미디어 : YouTube, Facebook, Instagram, Twitter, RSS
- 커뮤니케이션 : Discord, Slack, LINE, Zoom
- 개인화 서비스 : FitBit(건강), Strava(싸이클), Spotify(음악), Coinbase(코인), Weather Underground(날씨)
- 스마트 홈 : Philips Hue (조명), LIFX (조명), Wyze(원격 Cam)
- (실제로 움직이는) 로봇 : iRobot(청소)

### 2) IFTTT 데이터 인프라스트럭쳐

출처: [Data Infrastructure at IFTTT](https://medium.com/engineering-at-ifttt/data-infrastructure-at-ifttt-35414841f9b5)

![IFTTT 데이터 인프라스트럭쳐](https://miro.medium.com/max/1400/1*xYi4YQgPXWrVFXg7oZHMJw.jpeg){: width="600" .w-75}

**Lessons Learned**

- Kafka 로 데이터 생산자와 소비자를 느슨하게 분리
  + 느린 소비자 몇개가 성능에 영향을 미치지 않습니다.
- Elasticsearch 는 확장을 위해 시작부터 클러스터로 설정
  + 샤드가 정말 큰 경우, 노드 확장보다 샤드 크기를 줄여야 함
- 복잡한 아키텍처는 작동을 확인하기 위해 알람 설정이 중요
- 데이터를 신뢰하려면 자동화 된 데이터 검증 단계가 있어야 함
- S3 저장소 이용시 `YYYYMMDD` 폴더 구조로 이벤트 데이터 저장
  + 날짜별로 샤딩되어 있어 로딩할 때 편리 
- Elasticsearch 에 시간(Hour) 단위 인덱스 생성
  + API 오류를 찾기 위해 지난 1시간 동안만 찾으면 됨
- 실행 중인 데이터 및 쿼리 유형에 따라 ES 설정 최적화가 중요
  + 노드 수, 샤드 수, 각 샤드의 최대 크기, 복제 요소 등

## 2. IFTTT(If This Then That) 관련 용어들

### 1) CEP (Complex Event Processing)

- 출처: [IFTTT 서비스를 위한 실시간 이벤트처리 룰 관리 시스템](http://koreascience.or.kr/article/JAKO201728642462956.pdf)
  + 멀티미디어학회 논문지 제20권 제8호(2017. 8)

> CEP 는 여러 이벤트 소스로 부터 발생한 이벤트를 대상으로 실시간으로 의미 있는 데이터를 추출하여 대응되는 액션을 수행하는 것을 말한다.

`CEP` 가 처리하는 데이터는 `스트림` 형태를 말하며, 시간 순서대로 끝없이 입력되는 데이터이기 때문에 전통적인 관계형 데이터 방식으로는 처리가 적합하지 않다.

CEP 의 엔진은 규칙(Rule)을 처리하는데, 규칙이 활성화 되기 위한 `Condition` 과 `Action` 으로 정의된다.

- Listening : 스트림 데이터를 수신하고 있다가
- Trigger : 특정 Condition (상황/조건)을 포착하면
- Action : 연결된 Action 을 수행시킨다

### 2) 개인화 (Personalization)

규칙이 적용되기 위한 조건과 적용할 기능은 모두 개인화를 기반으로 정의되어야 한다. 인공지능(AI)이라면 수많은 오차를 학습을 통해 제거하겠지만, 그렇지 않은 이상 정형화된 서비스만이 개인화를 만족시킬 수 있다.

#### 대상 식별 방법

대중적인 서비스의 계정 자체가 식별 방법이고 적용 대상이 된다.

- 클라우드 서비스의 경우 Account ID 
- 모바일 서비스라면 iPhone 이나 Galaxy Phone 의 Device ID

#### 상황 식별 방법

> 메일 자동분류 처럼 흔히 생각할 수 있는 명백한 조건이 좋다.

알아서 수행해주면 좋겠지만, 반대로 의도하지 않은 상황에 생각지 못한 동작이 수행되는 것이 더 큰일이다.

- 텍스트, 필드값이 특정 값을 포함하거나 만족하면
- 특정 시간, 특정 조건을 추가하거나
- 상황을 조회하는 API 를 수행시키거나

### 3) 레시피 (Receipt)

> 사전에 구현된 서비스 실행 또는 데이터 통합 방식들의 목록

레시피로 묶이는 기능들은 구현을 위한 일관성을 가져야 한다. 

- 호출과 조회, 제어를 위한 Spec 이 필요하다
- 호출(Call) 방식으로는 웹서비스 API 가 적합
  + 설정 : 로그인 정보, 권한, 감시 대상
  + 시작 또는 예약 (스케줄링)
  + 조회 : 진행 또는 결과 상태 조회
  + 중단 또는 예약된 작업까지 취소

## 3. 자동화 관련 SaaS 서비스들

출처: [ITWorld - IFTTT 대신할 만한 ‘업무 자동화 도구’ 5선](https://www.itworld.co.kr/news/177219)

### 1) [HEVO](https://hevodata.com/) - 따로 추가

- 코드 없는 데이터 파이프라인을 사용하여 Webhook ETL 간소화
- IFTTT 와 연결

![IFTTT Webhook 페이지](https://lh5.googleusercontent.com/jQklI3C484U2Hxu2dZfrvOMHlT8woxWqJEmoUzReI5v9HukSq-6tkKoaZzxzLxkR-rIvi-L8EHJjxUGPuQVf-vsdmVewKe-hSWUxj5S8vSVvK1nlH817jYQjm64s79zvdLYpNdmv){: width="620" .w-75}

### 2) [재피어(Zapier)](https://zapier.com/)

- IFTTT 애플릿과 비슷하게 작동한다. 기업 앱 통합에 더 치중
  + MySQL, 리컬리(Recurly) 등 기업용 툴

- 2단계 트리거 가능
  + 1단계) 특정 공유 자료가 업데이트 됨
  + 2단계) 업데이트 내용중 특정 인물, 텍스트 포함시 실행

### 3) 마이크로소프트의 [파워 오토메이트(Power Automate)](https://flow.microsoft.com/en-us/)

- 마이크로소프트의 '코드리스 자동화' 솔루션
- 오피스 365 라이선스

### 4) [인테그로매트(Integromat)](https://www.integromat.com/en/)

- 구성요소 : 실행, 라우터, 취합자, 반복자 등
- HTTP/SOAP 및 JSON/XML 모듈을 활용해 코딩 없이 API 처리

### 5) [오토메이트닷아이오(Automate.io)](https://automate.io/)

- 마케팅, 판매, 안내 데스크, 프로젝트 관리 자동화에 더 집중
- 다단계 워크플로우

1. 잠재 고객이 웹사이트에서 우푸(Wufoo) 양식을 작성했다. 
2. 사용자는 지메일 통지를 받을 것이고, 잠재 고객은 자동으로 메일침프 리드 양성 활동에 추가된다. 
4. 4일 후 봇은 메일침프에서 이메일 개봉률을 체크하고, 괜찮으면 잠재 고객에 대한 연락처를 세일즈포스에서 생성한다.

### 6) [조호 플로우(Zoho Flow)](https://www.zoho.com/flow/)

- 중소기업을 겨냥한 클라우드 기반 생산성 툴
- 단순화된 독자 프로그래밍 언어를 이용해 커스텀 기능 생성

## 4. IFTTT 활용 분야 (비즈니스)

### 1) 소셜 마케팅

자영업자들이 이용하는 마케팅 도구들이 이 부류에 속함

- 홍보 이벤트를 동시에 여러 매체에 퍼나르기
- 회원 가입하면 환영 메시지 보내기
- CRM 도구: 랜딩 페이지, 이메일 마케팅

### 2) 행동 교정, 트레이너

- 습관 만들기, 다이어트, 헬스 트레이너
- To-do, 일정 관리

### 3) 자동화

- 주식 거래 자동화
- 메일 전송, 블로그 포스트 작성
- 데이터 관리, 백업

### 4) 비즈니스 앱에 통합 (기업용)

- 코드 레벨에서 마케팅 API 로 사용

## 5. 참고사항

### 1) [Amazon Redshift 및 PostgreSQL](https://docs.aws.amazon.com/ko_kr/redshift/latest/dg/c_redshift-and-postgres-sql.html)

AWS Redshift 는 PostgreSQL 기반으로 만들었지만, 대용량 데이터 집합을 대상으로 하기 때문에 스키마, 쿼리엔진 등이 완전히 다르다.

- 데이터레이크 역활을 수행하는 DW

### 2) 양면시장 구조를 위한 플랫폼의 6가지 전략 요소

(쉽게 말해) 플랫폼 사업자가 성공하기 위한 조건들이다.

> 양면시장에는 보조받는 집단(보조자)과 보조하는 집단(지불자)가 존재하며, 이들 간에 상호작용을 촉진하는 매개자가 플랫폼이다. 양면 시장이 유지돼야 플랫폼과 구성 집단들이 모두가 상생할 수 있다. (비즈니스가 잘된다) [&lt;출처&gt;](https://dbr.donga.com/article/view/1202/article_no/10140/ac/magazine)

- 교차(Cross-side) 네트워크 효과
  + => 경쟁자를 차단하는 독과점 전략을 지향
- 동일면(Same-side) 네트워크 효과
  + => 한쪽 편을 들어주며 대가(비용)를 받는다
- 플랫폼 생산 비용의 절감 (호구 방지)
  + => 양면시장 구성원에게 가성비 있는 이득과 비용을 제시해야 함
- 이용자의 가격 민감도
  + => 가격에 더 민감한 그룹을 보조. ex) 사용자는 무료 이용
- 이용자의 품질 민감도
  + => 품질에 민감한 그룹을 보조. ex) 광고주
- 이용자의 브랜드 가치
  + => 충성 그룹을 확보하기 위한 유인 정책/혜택

## 9. Review

- 조사만 했지 제대로 써보지는 못했다. 
  + 어디에 쓰지? 연결해서 잘 동작할 서비스는?
- 우리나라 사람들이 즐겨쓰는 서비스 중에서는 무엇이 있지?
  + 가두리 서비스 형태라 개방성이 작고 수요도 적다
  + 결국은 다 개발의 영역. API 뚫거나 크롤링 해야함

- 생활 속의 IFTTT 를 찾아보자
  - 정보 홍수를 위한 큐레이터 IFTTT 는 없나?

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

