---
date: 2022-01-27 00:00:00 +0000
title: "지식그래프란?"
categories: ["knowledge-graph"]
tags: ["지식그래프", "시멘틱웹", "온톨로지", "xAI", "agens-kg", "인식론"]
---

> 그래프 기반 지식그래프 R&D 과제 수행을 위해 지식그래프에 대한 개념부터 조사를 했습니다.
{: .prompt-tip }

## 지식그래프란?

지식 그래프는 개별 객체의 데이터를 나타내는 정점과 객체 간의 연관성을 의미하는 간선으로 표현할 수 있는 그래프 형태의 저장된 링크드 데이터(Linked Data)를 의미합니다. 본 장에서는 지식이란 무엇이고, 지식의 표현 방식과 지식 그래프에 관한 설명을 합니다.

### 지식(Knowledge)와 Belief(신뢰)의 차이

![지식은 진실과 신뢰의 교집합인가?](/2022/01/27-pic01.png#200x200){: width="540"}<br>
&lt;그림&gt; 지식은 진실과 신뢰의 교집합인가?

인식론(Epistemology)은 지식에 대한 제반 사항을 다루는 철학의 한 분야로서, 지식(Knowledge)을 참이라고 정당화되는 믿음(Beliefs)이라 정의하고 있습니다. 진리(Truths)는 온전하게 참인 것을 가리키며, 믿음은 개개인이 진실이라 믿는 것을 말합니다. 믿음에는 타인의 견해에 대한 신뢰, 권위에 대한 인정 등이 작용합니다. 따라서 대다수로부터 참이라고 정당화 되는 지식을 기반으로 저장소를 만드는 것과 개개인 또는 일부 사람들에 의해 정의된 믿음을 기반으로 저장소를 만드는 것은 다르다고 할 수 있습니다. [&lt;참조&gt;](https://www.samsungsds.com/kr/insights/TechToolkit_2021_Knowledge_Graph.html)

특정 목적에 활용되는 믿음은 수집과 활용에 대해 한정적인 대상과 대상자를 가지기 때문에 관련없는 대다수의 사람들에게 진실이 되지 않더라도 특정 분야의 지식으로 다루어질 수 있습니다. 구축 이후에 더 많은 사람들에게 믿음으로 받아 들여지고 활용될수록 지식으로 정제되어 발전되기 때문에, 믿음에 대한 수집과 축척은 지식을 구축하는 하나의 방법이 됩니다.

### 지식의 구축

지식을 구축하는 방식은 백과사전처럼 전문가에 의해 처음부터 지식으로 구축하는 방식과 WIKI 처럼 일반적인 개개인들의 믿음을 수집하여 수정하고 정제하여 구축하는 방식이 있습니다. 전문가에 의한 구축 방식은 소수의 사람이 작업을 수행하기 때문에 충분한 양을 구축하기까지 많은 시간이 소요되지만, 비교적 오류가 적다는 장점이 있습니다. 반면에 WIKI 와 같은 지식 데이터베이스는 많은 사람들이 참여하여 빠르게 구축할 수 있지만 오류도 많이 포함되어 있어 지속적인 수정이 필요한 단점이 있습니다. 그러나 컴퓨터와 인터넷이 발전한 오늘날에 있어서는 대다수의 사람들이 작업에 참여할 수 있는 방법과 수단이 충분해졌기 때문에 지식의 품질도 올라가 구축과 활용에 있어서 큰 가치를 보이고 있습니다.

또한 머신러닝과 텍스트 마이닝, 최근에 급속하게 발전한 딥러닝이라는 기술을 이용하여 인터넷으로부터 수집한 수많은 텍스트 데이터로부터 지식을 수집하고 정제하는 기술이 발달함에 따라 믿음으로부터 지식 베이스를 구축하는 방식의 효율성이 크게 상승하였습니다. 구축된 지식은 데이터베이스화 되어 각종 서비스로 개발되어 정보검색, 기계번역, 챗봇 등으로 인간과 기계가 상호소통하기 위한 자연어 처리의 필수적인 기술로 발전하고 있습니다.

### 지식의 표현방식

컴퓨팅 기술의 발전에 따라 지식의 구축 형태도 사람이 활용할 수 있는 텍스트 형태의 사전에서 컴퓨터가 이해할 수 있는 형태로 구축하는 기술이 연구되고 있습니다. 전통적인 웹에서 웹을 지식으로 활용하기 위한 시맨틱 웹으로 가기 위한 연구에서 온톨로지(Ontology), 지식그래프(Knowledge Graph) 등에 관한 연구가 파생되었습니다.

시맨틱 웹(Semantic Web)이란 컴퓨터가 정보의 의미를 이해하고 조작할 수 있는 환경을 말합니다. 웹에서의 정보 자원들 사이의 관계를 정의하여 웹 상의 SW, 즉 Agent 간에 정보를 스스로 수집하고 작동할 수 있게 하는 목적으로 시맨틱 웹을 연구하고 있습니다.[&lt;참조&gt;](https://www.itfind.or.kr/WZIN/jugidong/1265/126503.htm) 시맨틱 웹의 핵심기술은 메타데이터와 지식 표현인데, 메타데이터는 데이터에 관한 데이터로서 정보 검색의 처리 과정을 줄여주고 원하는 정보를 찾기 위해 필터링하거나 관련성이 많은 정보의 발견 가능성을 높여줌으로써 정보검색을 향상시키는 목적을 가집니다.

![시맨틱 웹 기술 계층 구조](/2022/01/27-pic02.jpeg){: width="540"}<br>
&lt;그림&gt; 시맨틱 웹 기술 계층 구조

시맨틱 웹을 위한 기술 형식으로 XML에서 파생된 RDF(Resource Description Framework), OWL(Web Ontology Language) 등을 사용하고 있으며 웹 상의 자원(Resource)과 자원 사이에 관계를 정의합니다.

RDF의 데이터 모델은 정보 자원(Resource), 속성 유형(Property Type), 속성값(Value)로 구성되어 있고 URI로 모든 객체를 식별하고 정의합니다. RDF로 정보 자원과 어휘(Vocaburary)에 대해 XML의 Namespace 기법으로 스키마(Schema)를 정의해 공개하면, 공유된 스키마에 의해 SPARQL(Simple Protocol and RDF Query Language) 같은 질의 언어를 이용해 정보를 질의할 수 있습니다. 이러한 RDF 데이터를 방대한 데이터베이스로 구축하여 공유 가능한 형태로 배포하는 웹 모델을 링크드 데이터(Linked Data)라고 합니다.

온톨로지는 시맨틱 웹을 구현하기 위한 도구로서 추상적인 개념을 명시적으로 정형화할 목적으로 설계된 명세서입니다. [&lt;참조&gt;](https://ko.wikipedia.org/wiki/%EC%98%A8%ED%86%A8%EB%A1%9C%EC%A7%80) 온톨로지는 다양한 분야의 지식 구조를 정의한 데이터베이스의 일종이라 할 수 있는데, 구성 요소로 클래스(Class), 인스턴스(Instance), 속성(Property), 관계(Relation)를 가지고 있고 OWL 언어를 이용해 기술할 수 있습니다. 온톨로지는 시맨틱 웹을 구현하기 위한 도구로 출발했지만 인공지능(AI)의 지식 표현 기술로서 점차 독립적으로 발전해옵니다. [&lt;참조&gt;](https://www.itfind.or.kr/WZIN/jugidong/1265/126503.htm)

### 지식그래프 용어

구글은 2010년에 프리베이스(Freebase) [&lt;참조&gt;](<https://en.wikipedia.org/wiki/Freebase_(database)>) 를 개발 한 메타웹(Metaweb)을 인수하며, 3년 후 자사의 검색 방식을 문자열이 아닌 의미를 이해하는 방식으로 전환해 2012년경 지식그래프(Knowledge graph)라는 이름으로 발표했습니다. [&lt;참조&gt;](https://g.co/kgs/y5tJqY) 시맨틱 웹 커뮤니티의 경험과 노력을 접목한 구글의 지식그래프는 검색 서비스뿐만 아니라 음성비서를 포함한 자사의 지능형 서비스의 핵심 데이터로 사용되며 이 용어가 인기를 얻었습니다. 이후 시맨틱 웹 커뮤니티에서도 지식그래프라는 용어를 사용하고 있으며, 최근에는 인공지능(AI)과 대규모 데이터 분석 및 클라우드 컴퓨팅과 밀접하게 연관되어 지식 그래프라는 용어가 자주 사용되고 있습니다.

지식그래프는 새로운 용어라기보다는 기존의 시맨틱 웹의 온톨로지를 검색 서비스에 적합하도록 구성하고 방대한 검색 이력을 이용해 추출된 데이터가 결합된 링크드 데이터(Linked Data)라 할 수 있습니다. 이를 시맨틱 웹이라는 난해한 용어 대신에 '지식의 그래프'라는 용어로 쉽게 이해시킬 수 있을 것이라 생각했습니다. 지식그래프라는 이름은 널리 알려졌으며, 현재 산업 환경에서 시맨틱 웹 기술과 엔터프라이즈 수준의 접근 방식을 지칭하는데 사용되고 있습니다.

![구글 검색결과에 포함되어 사용되는 지식그래프](/2022/01/27-pic03.png){: width="540"}<br>
&lt;그림&gt; 구글 검색결과에 포함되어 사용되는 지식그래프 (관련 개체에 대한 링크 연결)

지식그래프는 본질적으로 개체(Entity)를 문맥화 하고, 개체 또는 여러 유형의 개체 사이의 상관관계를 구성할 수 있는 데이터 구조입니다. 구글의 지식그래프는 검색 내에 내장된 지능으로서 검색한 사물과 관련된 사물 또는 유사한 사물간의 관계를 노출합니다. [&lt;참조&gt;](https://tsdownload.i-scream.co.kr/tscream/v1.0/resources/download/Knowledge%20Graph,%20Knowledge%20Map,%20Ontology,%20Linked%20Data,%20Semantic%20Web.pdf)

지식그래프의 적용 분야로는 의미 검색(Semantic Search), 자동 사기 탐지, 지능형 채팅봇, 첨단 약물 발견, 동적 위험 분석, 콘텐츠 기반 추천 엔진 및 지식관리시스템 등이 있습니다.

### 지식의 표현

시맨틱 웹을 구현하기 위한 링크드 데이터를 구축하기 위해서는 정보 자원과 자원간의 관계가 기계가 이해할 수 있는 형태로 기술되어야 합니다. 이를 위해 사용되는 언어가 RDF(Resource Description Framework)이며, 구성요소인 자원과 속성유형, 속성값은 주어-서술어-목적어(SPO)의 그래프 구조로 설명할 수 있습니다.

![RDF 그래프 모델의 기본 구조와 그래프 모델 표현 예시](/2022/01/27-pic04.png){: width="540"}<br>
&lt;그림&gt; RDF 그래프 모델의 기본 구조와 그래프 모델 표현 예시

W3C 웹표에 나온 설명에 따르면, RDF는 방향성이 있는 라벨 그래프를 형성하며, 그래프 노드로 표시되는 두 리소스간의 명명된 연결을 나타낸다고 설명하고 있습니다. &lt; 참고 &gt; RDF는 방향성이 있는 속성그래프(LPG: Labeled Property Graph)로 표현할 수 있어서 RDF 그래프라고도 합니다. &lt;그림&gt;은 RDF 그래프 모델의 구조와 그래프 모델 예시를 보여주고 있습니다.

![Entity 개체를 연결하여 확장한 그래프 모델](/2022/01/27-pic05.png){: width="540"}<br>
&lt;그림&gt; Entity 개체를 연결하여 확장한 그래프 모델

## 지식그래프 기술의 중요성

### (1) 설명 가능한 AI(XAI)의 필요성

딥러닝 기술의 대두 이후 자연어 처리에 관련된 기술이 빠르게 발전했습니다. 사람처럼 대화가 가능한 챗봇으로 이슈가 되었던 AI챗봇 '이루다'의 경우는 AI에 대한 놀라움과 함께 여러가지 논란점도 불러왔습니다. AI챗봇 '이루다'는 사람처럼 대화하는 능력을 얻기 위해 실제 사람간의 대화를 학습했는데, 이 과정에서 막말에 관한 논란과 개인정보를 가리지 않고 노출하는, 사람이라면 하지 않을 실수 아닌 오류를 보였습니다. 결국 운영사인 스캐터랩이 서비스를 중단하고 학습 데이터를 전량 폐기하겠다고 밝혔지만 이용자들은 AI에 대한 불안감을 가지게 되었습니다. [&lt;참조&gt;](https://m.etnews.com/20210119000126)

이루다 사태는 AI 서비스에 관한 투명성 요구와 맞닿아 있습니다. 현재의 AI는 학습을 통해 지능이 있는 것처럼 보이는 것이지 실제 지능이 있는 것은 아닙니다. 학습과정에 사용한 데이터를 바탕으로 블랙박스로 둘러쌓인 딥러닝 알고리즘이 사람의 대화를 흉내내기한 결과에 불과합니다. 이처럼 딥러닝의 대두 이후 모델의 복잡한 구조로 인해 어떤 근거로 해당 결과를 얻었는지 이해하기 어렵기에 생명과 존엄이 관련된 곳에는 AI의 도입이 지체되고 있습니다.

때문에 AI챗봇 '이루다'와 같은 인공지능 윤리 문제를 막기 위해서는 AI의 판단 근거를 알 수 있는 '설명 가능한 AI'(XAI: eXplainable AI) 기술이 필수라는 주장이 나오고 있습니다. 즉, 투명성을 확보한 후에야 보안과 공정성 문제로도 넘어갈 수 있다는 주장입니다. 유럽연합(EU) 개인정보보호법(GDPR)은 데이터 처리 투명성을 기본 요건으로 규정하고 있습니다. AI와 관련해서는 AI 알고리즘이 도출한 결과에 대해 정보 주체가 설명을 요구할 권리가 포함되어 있습니다. 이처럼 '설명 가능한 AI'는 개발사가 EU GDPR을 준수하기 위해서라도 도입을 확대하는 추세를 보이고 있습니다.

![지식그래프와 딥러닝 모델이 통합된 설명 가능한 AI 시스템](/2022/01/27-pic16.png){: width="540"}<br>
&lt;그림&gt; 지식그래프와 딥러닝 모델이 통합된 설명 가능한 AI 시스템

&lt;그림&gt;은 기존의 딥러닝 시스템(파란색)이 지식그래프와 온톨로지(주황색)에 맵핑되어 설명한 가능한 AI 시스템으로 작동할 수 있음을 설명하고 있습니다. 빨간색은 쿼리와 추론 매커니즘으로 사용자에 의해 이용되는 부분을 말합니다. 즉, '설명 가능한 AI'(XAI)는 지식 매칭을 통해 인간과 딥러닝 같의 공통적인 언어로서 딥러닝 알고리즘의 수학적 기능을 조작할 수 있는 솔루션을 제공하는데 목적이 있습니다. [&lt;참조&gt;](https://towardsdatascience.com/knowledge-graphs-for-explainable-ai-dcd73c5c016)

### (2) 지속 가능한 지능으로서의 지식그래프

지식그래프는 인간의 두뇌처럼 살아 설정하는 유기적인 모습의 데이터베이스입니다. 따라서 지속적으로 데이터를 공급하고 저장된 지식을 개선하고 품질을 관리할 수 있는 지식 관리 시스템이 필요합니다. 지식의 범주에 따른 도메인 규칙과 통일된 어휘를 구축하여 일관된 지식 활용 방안을 제공해야 합니다.

해외의 경우 구글의 지식그래프를 비롯하여 DBpredia, GeoNames, Wikidata 등과 같은 출처에서 자유롭게 이용할 수 있는 링크드 데이터가 많이 있으며 그 수는 매일 증가하고 있습니다. 지식그래프가 성장하기 위해서는 다양한 데이터소스로부터 방대한 데이터를 수집하고, 서로 상이한 데이터라도 연결시킬 수 있는 유연한 데이터 구조와 사용자가 필요한 형식으로 변형해서 출력할 수 있는 기능이 필요합니다. 하나로 통합되고 연계된 지식 저장소는 온톨로지, AI, 기계학습의 도움을 받아 지속적인 학습과 유기적인 성장이 가능합니다.

### (3) 응용서비스에 지능을 제공하기 위한 도구

지식그래프의 장점을 가장 잘 활용할 수 있는 분야는 정보 검색입니다. 기업의 경영 이슈를 해결하고 의사결정을 진행하는 지식 경영에 있어서 기존 정보 검색은 질의가 포함된 문서를 잘 보여줄 수 있지만 연관된 지식을 같이 표시하기는 어렵습니다. 검색을 고도화하고 어떤 대상이든 의미를 여러 각도로 관찰할 수 있도록 정보들을 일목요연하게 전달하려면 지식그래프를 구축하는 것이 필수입니다.

이 외에도 지능형 추천이나 콘텐츠, AI챗봇 또는 상황인식 에이전트, 효능과 효과에 관련된 약물 검색, 금융 투자를 위한 인텔리전스, 법률상담과 같은 전문가 서비스, 공공데이터의 재사용성 효율화 등에 사용될 수 있습니다.

## 지식그래프 관련기술

### 해외 관련기술 개발 현황

해외의 경우 IT 공룡기업들을 중심으로 지식그래프를 활발하게 구축, 활용하고 있습니다. Microsoft의 Bing 지식 그래프와 Google 지식 그래프는 검색 및 대화 중에 질문에 대한 검색 및 답변을 지원합니다. 사람, 장소, 사물, 조직에 대한 설명과 연결을 시작으로 이 그래프에는 세상에 대한 일반적인 지식이 포함됩니다. Facebook은 음악, 영화, 유명인 및 Facebook 사용자가 관심을 갖는 장소에 대한 정보를 포함하는 세계 최대의 소셜 그래프를 보유하고 있습니다. 현재 개발 중인 eBay의 제품 지식 그래프는 제품과 외부 세계 간의 관계에 대한 의미론적 지식을 내재시키고 있습니다. [&lt;참조&gt;](https://cacm.acm.org/magazines/2019/8/238342-industry-scale-knowledge-graphs/fulltext)

![IT 공룡들의 지식그래프](/2022/01/27-pic08.jpeg){: width="540"}<br>
&lt;표&gt; IT 공룡들의 지식그래프

블로그 "CLEVR graph: A dataset for graph based reasoning"(2018) [&lt;참조&gt;](https://medium.com/octavian-ai/clevr-graph-a-dataset-for-graph-based-reasoning-5e4e64f28ffb) 에서는 지하철역 지식그래프인 CLEVR graph [&lt;참조&gt;](https://github.com/Octavian-ai/clevr-graph) 에 대해 Cypher 쿼리를 이용해 간단한 질의응답을 할 수 있는 구현을 시도했습니다. 문장 구조에 대해 Cypher 쿼리의 여러 패턴중 하나와 맵핑하여 지식그래프의 특정 노드로부터 정답에 해당하는 노드까지 그래프 탐색을 시도하여 답변을 출력하는 방식입니다.

![CLEVR graph 지식그래프에 대해 Cypher 쿼리로 질의응답](/2022/01/27-pic06.png){: width="540"}<br>
&lt;그림&gt; CLEVR graph 지식그래프에 대해 Cypher 쿼리로 질의응답

논문 "Dependency graph for short text extraction and summarization"(2019) [&lt;참조&gt;](https://www.tandfonline.com/doi/pdf/10.1080/24751839.2019.1598771?needAccess=true) 에서는 구글 뉴스와 트위터 등의 텍스트 데이터로부터 의존 그래프를 추출하여 문장성분 간의 관계를 연결하여 지식그래프를 생성하는 기법에 대해 연구하였습니다. 예를 들어 &lt;그림3&gt;에서 "레오디카프리오는 놀라운 환경운동가이다. 그는 마침내 오스카 상을 수상했다."라는 두 문장을 결합하여 "레오디카프리오는 마침내 오스카 상을 수상했다."라는 지식그래프를 생성합니다. 이를 위해 의존관계 파서를 사용하고 문장성분간의 결합을 위해 Neo4j의 APOC 그래프 알고리즘을 사용하였습니다. 해당 논문에서는 자연어 텍스트로부터 추출된 수많은 Belief Graph을 중첩하고 병합시키면 Knowledge Graph로의 구축이 가능하다고 설명합니다. 예를 들어 Amazon 제품리뷰 1만개의 트윗을 샘플링 해서 10개 내외의 토픽으로 그룹핑하여 그들간의 의존성 트리를 중첩하고 병합함으로써 제품 평가에 대한 유의미한 지식그래프를 생성을 시도했습니다.

![Neo4j의 APOC 그래프 알고리즘과 Cypher 쿼리를 이용한 node 수집 예](/2022/01/27-pic10.png){: width="540"}<br>
&lt;그림&gt; Neo4j의 APOC 그래프 알고리즘과 Cypher 쿼리를 이용한 node 수집 예

해당 논문에서는 지식그래프와 신뢰그래프를 구분지어 정의했습니다. 지식그래프(Knowledge Graph)는 특정 영역에 대한 주체-객체 관계에 대한 단일한 정의가 있다는 면에서 원자성을 갖고, 대다수의 사람들에 의해 선별된 지식을 바탕으로 생성되고, 'is-a' 관계처럼 주체와 객체를 갖는 트리플 구조를 갖는다는 특징을 설명하고 있습니다. 다른 한편, 신뢰 그래프(Belief Graph)는 텍스트로부터 추출한 관계는 여러 해석이 가능한 모호함을 가지고 있고, 실제 신원을 알 수 없고 구조화되지 않은 개체를 생성한다는 점, 그리고 의존성 파서를 사용하기 때문에 능동태와 수동태 등 언어 형태의 문법적인 순서 관계를 보존하고 있다는 점을 특징으로 설명하고 있습니다.

![여러 의존 분석 그래프를 병합하여 하나의 신뢰 그래프를 구성하는 예시](/2022/01/27-pic09.png){: width="540"}<br>
&lt;그림&gt; 여러 의존 분석 그래프를 병합하여 하나의 신뢰 그래프를 구성하는 예시

### 국내 관련기술 개발 현황

외국의 구글 지식그래프와 마찬가지로 국내의 경우엔 주요 인터넷 포털업체를 중심으로 지식그래프를 실서비스로 활용하고 있습니다. 네이버의 경우에는 인물 정보, 방송/영화/웹툰 등의 콘텐츠, 공감 TALK, 문화재 정보, 교육 정보, 금융 정보, 경제 지표, 동물 정보, 전시회 및 공연장 정보 등을 데이터베이스화 하여 특정 키워드에 반응해서 출력하는 형태로 사용하고 있습니다.

![네이버 지식그래프 서비스 예시](/2022/01/27-pic11.png){: width="540"}<br>
&lt;그림&gt; 네이버 지식그래프 서비스 예시

논문 "한국어 의존 파싱을 이용한 트리플 관계 추출"(2013) [&lt;참조&gt;](https://www.koreascience.or.kr/article/CFKO201308355727371.pdf) 에서는 한국어 자연어 문장으로부터 ETRI 의존 파서로 의존관계를 분석하고 트리플로 생성하는 연구를 진행했습니다. 서술어를 중심으로 주어와 목적어의 의존관관계를 추출하고 주어가 없는 경우에는 이전 문장의 주어를 활용하는 방식으로 트리플을 구성하였습니다. 평가를 위해 엘비스 프레슬리에 대한 위키피디아 문서의 21개 문장을 이용해 트리플을 추출하여 총 78개의 정답(Gold answer) 트리플과 64개의 준정답(Silver answer) 트리플 평가 집합을 만들었습니다. 해당 논문은 정답 집합은 F-measure 60.75%, 준정답 집합까지 포함해 F-measure 66.67%의 성능을 보였습니다. 다만, 의존관계 파서의 성능이 예상보다 좋지 못해 더 많은 트리플을 수집하지 못했고, 목적어의 분류가 명확하지 못해 트리플 규칙 적용에 한계를 보였다고 설명하고 있습니다.

![엘비스 프레슬리에 관한 위키피디아 자연어 문장으로부터 트리플 집합을 추출하는 예](/2022/01/27-pic12.png){: width="540"}<br>
&lt;그림&gt; 엘비스 프레슬리에 관한 위키피디아 자연어 문장으로부터 트리플 집합을 추출하는 예

논문 "BERT 모델과 지식 그래프를 활용한 지능형 챗봇"(2019) [&lt;참조&gt;](https://www.dbpia.co.kr/journal/articleDetail?nodeId=NODE08769539) 에서는 오픈소스 지식그래프인 ConceptNet [&lt;참조&gt;](https://conceptnet.io/) 을 기반으로 트위터, 뉴스 등의 외부 데이터를 활용해 지식그래프를 확장하고 딥러닝 BERT 모델에 의해 질문에 대한 답변을 출력합니다. 질문 해석기 등의 질의응답 시스템은 구글의 Dialogflow를 활용하여 질문 상의 개체(Entity)들을 식별해 BERT의 결과를 그래프 형태로 출력하는 형태로 구현하였습니다. 외부의 실시간 텍스트 데이터를 활용함을써 신조어에 대한 답변 출력도 가능하도록 구현했다고 설명하고 있습니다. 다만, 질의가 가능한 개체(Entity)의 관계가 ConceptNet의 IsA, HasA, PartOf 등 40개의 관계로 한정되고 단답형의 질의 형태만 가능하다는 한계가 있습니다.

![확장된 지식그래프인 PolarisX를 통해 출력된 답변 그래프 예시](/2022/01/27-pic13.png){: width="540"}<br>
&lt;그림&gt; 확장된 지식그래프인 PolarisX를 통해 출력된 답변 그래프 예시

논문 "지식 그래프를 이용한 오픈 도메인 질문 응답"(2020) [&lt;참조&gt;](https://www.dbpia.co.kr/Journal/articleDetail?nodeId=NODE09910171) 에서는 딥러닝 GNN을 이용해 지식그래프에서 질의응답을 할 수 있는 KGNet이라는 추론 모델을 제안했습니다. 지식베이스로는 협업형 링크드 데이터인 Freebase를 활용했고, 질의응답의 벤치마킹을 위해 WebQuestionsSP 와 MetaQA를 이용했습니다. 해당 논문에서 다루었던 질문 유형은 단순 매칭보다 의문사가 중간에 낀 형태인 경로형 질문에 집중했습니다. 질문 q에서 지식그래프에서 해당 질문의 답변과 매칭될 수 있을 서브그래프 G=(K,D,L)을 S-MART(Structured Multiple Additive Regression Tree) 시스템을 이용해 추출했습니다. 질문 q에서 추출된 서브그래프를 구성하는 시드 node 개체에 대해 가중치를 적용하여 매칭의 정확도를 높였습니다. 해당 연구의 한계점은 경로형 질문이라 하더라도 하나 이상의 조건이 만족되어야 하는 접속형 복잡 질문에 대해서는 정답을 찾지 못했고, 지식베이스가 영어라 한국어에 대한 구현이 아니었다는 점이 있습니다.

![경로형 질문과 접속형 질문의 예](/2022/01/27-pic14.png){: width="540"}<br>
&lt;그림&gt; 경로형 질문과 접속형 질문의 예

논문 "질의문과 지식 그래프 관계 학습을 통한 지식 완성 시스템"(2021) [&lt;참조&gt;](https://www.dbpia.co.kr/Journal/articleDetail?nodeId=NODE10564128) 에서는 지식 그래프 임베딩을 활용하여 지식 그래프로부터의 topic과 질의문 사이의 관계를 학습하여 새로운 트리플을 추론합니다. 즉 &What does Christian Bale star in?&라는 쿼리에서 술어 "star in"에 대해 &starred_actors& 관계를 학습시켜 술어 중심으로 트리플을 검색하여 답변을 하는 방법입니다. 트리플 검색을 위한 토픽 선정은 빈도수가 2000이하인 단어를 선정하는데 예문의 경우 "Christian Bale"로 범위를 정하고 술어를 이용해 트리플의 목적어에 대해 점수를 산출하여 답변을 선정합니다. 실험은 MetaQA는 400,000개의 의문형 쿼리로 구성되어 있고 영화가 도메인인 141,690개의 트리플로 구성된 지식 그 래프를 사용했습니다. 해당 논문은 술어를 중심으로 지식 검색을 위한 트리플을 생성하고 사용했다는 점에서 차별성이 있었지만, 시드 단어인 토픽 선정에 빈도 중심이라는 한계점이 있고, 복잡한 형태의 질문은 답변하기 어렵다는 문제가 있습니다.

![쿼리와 유사한 트리플 술어를 추출해 쿼리를 확장하는 예제](/2022/01/27-pic15.png){: width="540"}<br>
&lt;그림&gt; 쿼리와 유사한 트리플 술어를 추출해 쿼리를 확장하는 예제

본 연구에 대한 포스트는 [태주네 블로그](https://taejoone.jeju.onl)에 연재됩니다.

&nbsp; <br />
&nbsp; <br />

> **끝!** 읽어주셔서 감사합니다.
{: .prompt-info }