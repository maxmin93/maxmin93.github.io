---
date: 2022-01-29 00:00:00 +0000
title: "AgensKG 지식그래프 생성하기"
categories: ["knowledge-graph"]
tags: ["지식그래프", "트리플그래프", "라벨링", "개체", "ner"]
---

> &#91;알림&#93; 본 연구는 **"2019 GCS 창업성장과제"** 의 지원으로 진행된 **"그래프 기술 기반 Graph AI 솔루션 연구개발"** 과제의 연구결과입니다. **AgensKG**의 모든 저작권은 [비트나인](https://bitnine.net/)에 있습니다.
{: .prompt-warning }

## 지식 모델링

### 한국어 문장구조에 적합한 SPOC Triple 구조

한국어는 영어와 언어적인 구조가 다르기 때문에, 주어-동사-목적어 구조의 Triple 모델은 한국어를 자연스럽게 표현하기에 적합하지 않습니다. 영어는 명사 중심이고 주어가 반드시 포함되어야 하는 구조인데 반해, 한국어는 동사 중심이고 주어 또는 목적어가 없어도 문장이 성립되는 차이점이 있기 때문입니다. 또한 한국어의 문장 구조는 어순이 자유로워 영어처럼 1형식~5형식으로 정형화시키기 어렵다는 특징이 있습니다. [&lt;참조&gt;](http://gosischool.or.kr/contents/hangukmunbub/down/C01.pdf)

![한국어 기본 문형 5가지](/2022/01/29-pic01.png){: width="540"}<br>
&lt;그림&gt; 한국어 기본 문형 5가지

또한 시간, 장소, 수단, 이유 등의 의미를 표현하는 부사어의 경우 하나 이상의 부사어가 서술어를 수식합니다. 때문에 부사어는 서술어와 분리하지 않고, 서술어를 수식하는 구조로 하나의 Triple에 담아야 온전하게 의미를 전달할 수 있습니다.

이러한 한국어의 문법 구조의 특이성 때문에 SPO(주어-서술어-목적어) 구조의 Triple 모델로는 지식 표현에 한계가 있어서 보어(C)를 추가한 SPOC의 구조를 채택하였습니다. RDF 'Triple'은 세가지 구성요소(SPO)를 의미하는데, SPOC 구성요소를 채택하면 'Quadruple'이란 용어로 칭하는게 맞겠지만, 지식그래프 관련 용어에 혼동이 생길 수 있기 때문에 SPOC Triple이라 명기하도록 하겠습니다. (이후에 표기되는 Triple은 SPOC를 의미합니다)

![Triple 연결부위(Joint) 모델의 예시](/2022/01/29-pic02.png){: width="540"}<br>
&lt;그림&gt; Triple 연결부위(Joint) 모델의 예시

Triple은 최소의 의미 단위를 표현하기 때문에, 하나의 긴 문장은 여러 작은 문장으로 쪼개는 것이 바람직합니다. '작년에 갔던 해운대는 멋졌다'라는 문장에서 형용사 수식절인 '작년에 갔던'과 '해운대는 멋졌다'는 두개의 문장으로 분리하여 Triple을 생성하고 연결하면 자연어 문장의 의미를 손실없이 표현할 수 있습니다. 이를 위해서 &lt;그림&gt;처럼 Triple 간에 연결관계(Joint)를 정의합니다. 연결관계는 head와 part로 구성되며, 여기서 head는 두개의 Triple이 공유하는 단어를 의미하고, part는 피수식절 Triple에서 head가 자리하는 위치(주어, 서술어, 목적어, 보어)를 의미합니다.

NLP 분석에 의해 잘게 쪼개진 의존관계는 서술어를 기준으로 Triple 단위 나누고, 이 과정에서 수식어절을 비롯해 분리 가능한 문장요소들을 연결관계로 만들어 Triple들을 연결하면 지식그래프인 SPOC Triple Graph가 생성됩니다. 생성을 위한 로직은 이후 의존그래프 가공 단계에서 설명하겠습니다.

![한국어 특성을 이용해 자연어 문장으로부터 변환된 SPOC Triple 및 그래프 예시](/2022/01/29-pic03.png){: width="540"}<br>
&lt;그림&gt; 한국어 특성을 이용해 자연어 문장으로부터 변환된 SPOC Triple 및 그래프 예시

### Entity로 확장된 지식그래프 표현

SPOC Triple Graph와 Entity가 결합되어 그래프DB에 저장되는 지식그래프가 생성됩니다.

![한국어에 특화된 트리플의 시각화 예시](/2022/01/29-pic04.png){: width="540"}<br>
&lt;그림&gt; SPOC Triple 그래프에 Entity를 연결하여 확장한 지식그래프 예시

## 지식그래프 생성

자연어로 작성된 뉴스 원문으로부터 지식 그래프로 변환하는 과정을 기술합니다.

![한국어에 특화된 트리플의 시각화 예시](/2022/01/29-pic05.png){: width="540"}<br>
&lt;그림&gt; 뉴스 원문으로부터 지식그래프 생성 과정

### ① NLP 분석

NLP(Natural Language Processing)는 자연어 원문을 기계가 이해할 수 있도록 처리하는 모든 과정을 통칭하는데, 통상적으로는 특수한 목적의 자연어 처리를 위해 시작단계에서 공통적으로 적용하는 전처리 과정을 의미하기도 합니다. 이러한 전처리 성격의 NLP 분석은 문장 분리, 단어 식별 및 품사 태깅 등을 과정을 포함합니다.

○ 전처리 작업

- 뉴스 제공자, 기자명 등의 불필요한 본문 내용 제거
- 불필요한 특수기호 제거
- 따옴표("")로 구분된 인용구/삽입구 제거
- 연속 공백 제거
- 문장 앞의 접속사 제거 (예: 그러나, 그리고, 또한, 하지만 ..)

○ 문장 분리

문장부호 또는 특수기호 등으로 분리 가능한 문장 단위로 문서를 나눕니다. 지식 그래프 처리시 문장 단위로 생성/가공하기 때문에 명확한 문장 분리가 중요합니다.

○ 형태소 분석: 단어 식별 및 품사 태깅

품사는 자연어에서 단어가 갖게되는 문법적 속성을 말하며, 한국어의 경우 5언9품사의 체계로 정리가 되어 있습니다. 한국어 9품사에는 명사, 동사, 형용사, 부사, 조동사, 수사, 대명사, 관형사, 감탄사가 있습니다. (cf. 영어의 경우 8품사)

○ 의존관계 분석: 문장 성분 태깅

단어 자체의 속성 외에도 문장 상에서 단어가 갖는 성분에 대한 속성을 분석합니다. 한국어는 문장을 구성하는데 주어, 목적어, 서술어, 보어, 부사어, 관형어, 독립어 등으로 분류합니다. 다만, 한국어는 영어와 다르게 서술어만으로도 문장이 성립하고 주어와 목적어의 생략이 자유로운 편입니다. (cf. 영어는 문장에 주어, 목적어가 반드시 존재해야 하고 없는 경우 대명사를 사용합니다)

### ② 개체(Entity) 분석

개체(Entity)는 NER(Named Entity Recognition) 분석을 통해 식별된 단어 개체를 말하며, 여기서 Named Entity는 사전에 정의된 카테고리에 따라 분류된 단어를 의미하며 <단어, 개체타입>으로 표현합니다. 사전에 정의된 카테고리는 사람, 장소, 기관, 상품 등으로 나눌 수 있고, NER 분석 목적에 따라 카테고리는 다르게 정의될 수 있습니다.

예) 문장 “샐러리맨의 신화로 불리던 윤석금 웅진그룹 회장이 사기성 기업어음 발행 등의 혐의로 재판에 넘겨졌다.”의 식별된 Entity 리스트<br>
⇒ (샐러리맨, PERSON), (신화, OTHER), (윤석금, PERSON), (웅진그룹, ORGANIZATION), (회장, PERSON), (사기성어음, OTHER), (발행, OTHER), (혐의, OTHER), (재판, EVENT)

| 개체 타입     |    개체 타입 설명     |                   예시 |
| ------------- | :-------------------: | ---------------------: |
| PERSON        |      인물, 사람       |           윤석금, 회장 |
| LOCATION      |      지명, 위치       |         청주시, 63빌딩 |
| ORGANIZATION  |   기관, 조직, 단체    |     웅진그룹, 삼성그룹 |
| EVENT         |      행사, 의식       |           재판, 졸업식 |
| WORK_OF_ART   |        예술품         | 모나리자, 드라이브음악 |
| CONSUMER_GOOD |         상품          |                 컴퓨터 |
| PHONE_NUMBER  |       전화번호        |          +82-1234-1234 |
| ADDRESS       |         주소          |           삼성동 1번지 |
| DATE          |      날짜, 시간       |            3월, 2013년 |
| UNIT          |         단위          |             10개, 10회 |
| NUMBER        |         숫자          |                   1234 |
| PRICE         |         가격          |                2백만원 |
| OTHER         | 기타 (분류 안된 개체) |       신화, 혐의, 발행 |
| UNKNOWN       |   식별 불능 (오류)    |                      - |

&lt;표&gt; AgensKG에서 사용된 Entity 분류 14종

### ③ 의존그래프(Dependency Graph) 생성

의존 구문 분석은 지배소(Head)와 의존소(Modifier)의 관계에 따라 문장의 구조를 분석하여 트리를 생성
하는 자연어 처리 기법입니다. 의존 그래프는 문장내 단어들의 의존 관계에 따라 생성된 그래프로 트리 형태로 생성됩니다. 그래프의 Node는 단어를 가리키고, Edge는 단어 간의 의존관계를 표현합니다. 의존 관계는 NLP 분석에서 추출한 문장 성분 태깅을 속성으로 가지고 있습니다. 최초 생성된 의존 그래프는 조사를 포함해 모든 단어를 포함하기 때문에 간단한 문장의 경우 node의 개수가 2개로 구성될 수 있고, 긴 문장인 경우 100개 이상의 node로 구성될 수도 있습니다.

&lt;그림&gt;은 특정 문서(D71677144)에 대한 의존그래프를 시각화하여 출력한 결과입니다. 의존 그래프는 모두 5개의 서브그래프(sub-graph)로 구성되어 있고, 전체 그래프 크기는 nodes=169, edges=164 입니다.

![한국어에 특화된 트리플의 시각화 예시](/2022/01/29-pic06.png){: width="540"}<br>

![한국어에 특화된 트리플의 시각화 예시](/2022/01/29-pic07.png){: width="540"}<br>
&lt;그림&gt; 문서 'D71677144'에 대한 의존그래프 시각화 (회색은 조사, 파란색은 명사, 빨간색은 동사)

### ④ 의존그래프(Dependency Graph) 가공

의존그래프는 SPOC Triple Graph를 만들기 위한 입력 데이터로 사용됩니다. 최초의 의존그래프는 그래프의 크기가 클 뿐만 아니라, 조사를 비롯한 불필요한 node 개체들과 중복된 의존 관계들을 포함하고 있기 때문에 그래프의 크기를 줄이는 가지치기(pruning) 등의 가공 작업이 필요합니다. 또한 의존 관계를 단순화된 SPOC 구조로 만들기 위한 문장성분 라벨링(labeling) 작업도 필요합니다. 이와 같은 작업을 거치는 의존 그래프 가공 단계를 수행하고 나면 지식 그래프를 만들기 위한 그룹핑(grouping) 작업이 가능해 집니다.

○ 가치치기(pruning) 작업

- 전처리: 조사, 문장부호 노드 제거
- 명사 체인 결합, ex) '윤석금', '웅진그룹', '회장' ⇒ '윤석금 웅진그룹 회장'
- 동사 체인 결합, ex) '높이기', '위한' ⇒ '높이기 위한'
- 접속사 관계 결합, ex) '사과, 배 그리고 포도' ⇒ '사과, 배, 포도'
- 관용표현 이중 브릿지(bridge) 패턴 제거, ex) '~할 수 있는' ⇒ '할 있는'
- 후처리: 홀로 존재하는 문장 또는 노드 제거

○ 라벨링(labeling) 작업

- 문장의 시작 node로부터 너비우선순회(BFS)하며 모든 node를 방문
- 의존관계 태그를 기준으로 주어, 목적어, 서술어, 수식어(Modifier), 보어(Complement) 라벨 배정
- 누락된 서술어 채우기 등의 잘못 지정된 라벨 수정
- 단일 edge로 연결된 서술어 병합, ex) '~이기 때문'(P)->'이다'(P) ⇒ '이기 때문 이다'(P)
- 수식어(Modifier)를 서술어로 치환
- 서술어에 동사 원형(stem) 생성하여 node의 속성으로 저장

![한국어에 특화된 트리플의 시각화 예시](/2022/01/29-pic08.png){: width="540"}<br>
&lt;그림&gt; 의존그래프의 가지치기와 라벨링 작업을 거쳐 정제된 의존그래프 예시

&lt;그림&gt;은 문장 "샐러리맨의 신화 로 불리던 윤석금 웅진그룹 회장이 사기성 기업어음 발행 등의 혐의로 재판에 넘겨졌다"의 의존그래프에 대해 가지치기와 라벨링 작업을 거친 결과 그래프입니다. 최초 nodes=19, edges=18 크기의 그래프가 가공 이후 nodes=8, edges=7 크기로 축소되고 정제되었습니다.

### ⑤ 트리플 그래프(Triple Graph) 생성

트리플 그래프의 node는 앞서 설명한 SPOC의 구조의 Triple을 의미하고, Joint 연결관계를 edge로 표현된 데이터 모델입니다. 트래플 그래프 생성단계에서는 정제된 의존그래프를 입력으로 서술어(P) node를 중심으로 그룹핑(grouping)을 수행하여 node와 edge를 생성합니다. 이후 트리플 그래프의 node에 entity를 연결하여 그래프DB에 저장합니다.

○ 그룹핑(grouping) 작업

- 문장의 시작 node로부터 너비우선순회(BFS)하며 모든 node를 방문
- 하위 node를 분기시키는 서술어(P) node를 중심으로 연결된 주어(S), 목적어(O), 보어(C) node들을 수집하여 하나의 node group으로 잘라내기(slicing)

○ 트리플 그래프 생성 작업

- node group을 SPOC 자료구조에 맞게 정렬하여 Triple node 생성
- node group 간의 연결관계를 탐색하여 edge 생성

### ⑥ Entity 관계 그래프 확장

의존그래프의 node에 연결되어 있던 Entity node를 트리플 그래프의 node로 이전하고, edge를 생성하여 지식그래프를 확장합니다.

![한국어에 특화된 트리플의 시각화 예시](/2022/01/29-pic09.png){: width="540"}<br>
&lt;그림&gt; 의존그래프로부터 Entity 확장까지 처리된 지식그래프 예시

## 트리플 그래프 기반 Word2Vec 단어 모델

트리플 그래프 기반 Word2Vec 단어 모델은 질의 서브그래프를 구성할 때 사용되는 단어 유사도 모델입니다. 질의응답에 사용하는 단어 유사도는 두 단어가 동일한 또는 가까운 트리플 안에 존재할 때 강한 연결관계를 갖게 하는 것이 목적이기 때문에 트랜잭션의 범위를 트리플 단위로 트랜잭션을 설정했습니다. &lt;그림&gt;와 같이 일반적인 Word2Vec이 전체 문장을 트랜잭션으로 설정하는 것과 달리 본 연구에서 사용한 트리플 그래프 기반의 Word2Vec 모델은 동일한 트리플내의 출현하는 단어셋으로 트랜잭션을 한정하여 유사도 사용시 두드러진 변별력을 보여줍니다.

![문장 범위의 트랜잭션과 트리플 범위의 단어의 동시출현단어셋 비교](/2022/01/30-pic16.png){: width="540"}<br>
&lt;그림&gt; 문장 범위의 트랜잭션과 트리플 범위의 단어 '오바마'의 동시출현단어셋 비교

뉴스 빈도상으로도 (오바마,백악관)은 (오바마,푸틴)보다 더 빈번하게 출현하는 패턴입니다. '백악관'은 상식적으로 '오바마' 대통령의 집무실이기 때문에 문장에서 사용될 경우 부연설명 내지는 동류의 의미로 사용될 수 있습니다. 이와 달리 러시아 대통령인 '푸틴'은 '오바마'와 결합되어 정보성이 높은 지식을 전달하는 성향이 강합니다. '오바마'를 이용해 질문과 같은 단순한 문장으로 만들어 사용할 경우 같은 '오바마'에 대한 '푸틴'의 연결성이 강하게 만들 필요가 있기 때문에 출현 빈도를 트리플 단위로 잘라내기(slicing)하고, 서술어와 연결관계(Joint)에 의한 수식어까지 포함하여 유사단어 모델을 만들었습니다.

![유사 단어들의 트랜잭션 범위별 비교](/2022/01/30-pic17.png){: width="540"}<br>
&lt;그림&gt; 단어 '오바마'의 유사 단어들의 트랜잭션 범위별 비교 (왼쪽이 문장, 오른쪽이 트리플)

&lt;그림&gt;의 왼쪽 모델이 문장 전체 범위로 봤을 때 생성한 모델이고, 오른쪽 모델이 트리플 범위로 제한하여 생성한 모델입니다. (트리플 그래프 기반임을 표시하기 위해 node2vec이라 표기함) 오른쪽 트리플 범위의 단어 모델의 경우 (오바마,푸틴)이 (오바마,백악관)보다 가까운 관계임을 표시하고 있습니다. 이 외에도 자주 사용되는 서술어와 수식어 관계에 대해서도 대체적으로 트리플 그래프 기반의 단어 모델이 적합한 관계성을 보였습니다.

<br>
본 연구에 대한 포스트는 [태주네 블로그](https://taejoone.jeju.onl)에 연재됩니다.

&nbsp; <br />
&nbsp; <br />

> **끝!** 읽어주셔서 감사합니다.
{: .prompt-info }