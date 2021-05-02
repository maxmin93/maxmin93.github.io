---
title: "KG 논문 서베이 - A Survey on Knowledge Graphs"
date: 2020-12-01 00:00:00 +0000
categories: ["papers", "KG"]
tags: ["Knowledge graph", "representation learning", "knowledge graph completion", "relation extraction", "reasoning", "deep learning"]
---

**A Survey on Knowledge Graphs: Representation, Acquisition and Applications (2020.8)**

Shaoxiong Ji, Shirui Pan, Erik Cambria, Senior Member, IEEE,
Pekka Marttinen, Philip S. Yu, Life Fellow, IEEE,

- link: [https://arxiv.org/pdf/2002.00388.pdf](https://arxiv.org/pdf/2002.00388.pdf)

### Abstract

Human knowledge provides a formal understanding of the world. Knowledge graphs that represent structural relations between entities have become an increasingly popular research direction towards cognition and human-level intelligence. In this survey, we provide a comprehensive review of knowledge graph covering overall research topics about 1) knowledge graph representation learning, 2) knowledge acquisition and completion, 3) temporal knowledge graph, and 4) knowledge-aware applications, and summarize recent breakthroughs and perspective directions to facilitate future research. We propose a full-view categorization and new taxonomies on these topics. Knowledge graph embedding is organized from four aspects of representation space, scoring function, encoding models, and auxiliary information. For knowledge acquisition, especially knowledge graph completion, embedding methods, path inference, and logical rule reasoning, are reviewed. We further explore several emerging topics, including meta relational learning, commonsense reasoning, and temporal knowledge graphs. To facilitate future research on knowledge graphs, we also provide a curated collection of datasets and open-source libraries on different tasks. In the end, we have a thorough outlook on several promising research directions.

> 인간의 지식은 세상에 대한 공식적인 이해를 제공합니다. 엔티티 간의 구조적 관계를 나타내는 지식 그래프는인지 및 인간 수준의 지능에 대한 연구 방향으로 점점 인기를 얻고 있습니다. 이 설문 조사에서는 1) 지식 그래프 표현 학습, 2) 지식 습득 및 완료, 3) 시간적 지식 그래프, 4) 지식 인식 응용 프로그램에 대한 전반적인 연구 주제를 포괄하는 지식 그래프에 대한 포괄적인 검토를 제공하고 최근의 획기적인 성과 및 미래 연구를 촉진하기 위한 관점 방향 우리는 이러한 주제에 대한 전체보기 분류와 새로운 분류법을 제안합니다. 지식 그래프 임베딩은 표현 공간, 스코어링 기능, 인코딩 모델 및 보조 정보의 네 가지 측면으로 구성됩니다. 지식 습득, 특히 지식 그래프 완성, 임베딩 방법, 경로 추론 및 논리 규칙 추론을 검토합니다. 우리는 메타 관계 학습, 상식적 추론 및 시간적 지식 그래프를 포함하여 몇 가지 새로운 주제를 추가로 탐구합니다. 지식 그래프에 대한 향후 연구를 용이하게하기 위해 다양한 작업에 대한 큐 레이트 된 데이터 세트 및 오픈 소스 라이브러리 모음도 제공합니다. 결국 우리는 몇 가지 유망한 연구 방향에 대한 철저한 전망을 가지고 있습니다.

**Index Terms** : Knowledge graph, representation learning, knowledge graph completion, relation extraction, reasoning, deep learning.


### I. INTRODUCTION

INCORPORATING human knowledge is one of the research directions of artificial intelligence (AI). Knowledge representation and reasoning, inspired by human problem solving, is to represent knowledge for intelligent systems to gain the ability to solve complex tasks [1], [2]. Recently, knowledge graphs as a form of structured human knowledge have drawn great research attention from both the academia and the industry [3]–[6]. A knowledge graph is a structured representation of facts, consisting of entities, relationships, and semantic descriptions. Entities can be real-world objects and abstract concepts, relationships represent the relation between entities, and semantic descriptions of entities, and their relationships contain types and properties with a well-defined meaning. Property graphs or attributed graphs are widely used, in which nodes and relations have properties or attributes. The term of knowledge graph is synonymous with knowledge base with a minor difference. A knowledge graph can be viewed as a graph when considering its graph structure [7]. When it involves formal semantics, it can be taken as a knowledge base for interpretation and inference over facts [8]. Examples of knowledge base and knowledge graph are illustrated in Fig. 1. Knowledge can be expressed in a factual triple in the form of (head, relation, tail) or (subject, predicate, object) under the resource description framework (RDF), for example, (Albert Einstein, WinnerOf, Nobel Prize). It can also be represented as a directed graph with nodes as entities and edges as relations. For simplicity and following the trend of the research community, this paper uses the terms knowledge graph and knowledge base interchangeably.

> 인간의 지식을 통합하는 것은 인공 지능 (AI)의 연구 방향 중 하나입니다. 인간의 문제 해결에서 영감을 얻은 지식 표현 및 추론은 복잡한 작업을 해결할 수 있는 능력을 얻기 위해 지능형 시스템에 대한 지식을 표현하는 것입니다 [1], [2]. 최근에 구조화 된 인간 지식의 한 형태 인 지식 그래프는 학계와 업계 모두에서 큰 연구 관심을 끌고 있습니다 [3] – [6]. 지식 그래프는 엔티티, 관계 및 의미 론적 설명으로 구성된 사실의 구조화 된 표현입니다. 엔터티는 실제 개체 및 추상 개념 일 수 있으며, 관계는 엔터티 간의 관계 및 엔터티의 의미 론적 설명을 나타내며 해당 관계에는 잘 정의 된 의미를 가진 유형과 속성이 포함됩니다. 노드 및 관계에 속성 또는 속성이 있는 속성 그래프 또는 속성 그래프가 널리 사용됩니다. 지식 그래프의 용어는 약간의 차이가 있는 지식 기반과 동의어입니다. 지식 그래프는 그래프 구조를 고려할 때 그래프로 볼 수 있습니다 [7]. 형식적 의미론을 포함하는 경우, 사실에 대한 해석 및 추론을 위한 지식 기반으로 간주 될 수 있습니다 [8]. 지식 기반과 지식 그래프의 예가 그림 1에 나와 있습니다. 지식은 자원 설명 프레임 워크 (RDF) 하에서 (머리, 관계, 꼬리) 또는 (주제, 술어, 대상)의 형태로 사실적 트리플로 표현 될 수 있습니다. 예 : (Albert Einstein, WinnerOf, Nobel Prize). 노드는 엔티티로, 간선은 관계로 있는 유 방향 그래프로 표현할 수도 있습니다. 단순함과 연구 커뮤니티의 추세를 따르기 위해 이 문서에서는 지식 그래프와 지식 기반이라는 용어를 서로 바꿔서 사용합니다.

Recent advances in knowledge-graph-based research focus on knowledge representation learning (KRL) or knowledge graph embedding (KGE) by mapping entities and relations into low-dimensional vectors while capturing their semantic meanings [5], [9]. Specific knowledge acquisition tasks include knowledge graph completion (KGC), triple classification, entity recognition, and relation extraction. Knowledge-aware models benefit from the integration of heterogeneous information, rich ontologies and semantics for knowledge representation, and multi-lingual knowledge. Thus, many real-world applications such as recommendation systems and question answering have been brought about prosperity with the ability of commonsense understanding and reasoning. Some real-world products, for example, Microsoft’s Satori and Google’s Knowledge Graph [3], have shown a strong capacity to provide more efficient services.

This paper conducts a comprehensive survey of current literature on knowledge graphs, which enriches graphs with more context, intelligence, and semantics for knowledge acquisition and knowledge-aware applications. Our main contributions are summarized as follows.

> 지식 그래프 기반 연구의 최근 발전은 엔터티와 관계를 저 차원 벡터로 매핑하면서 의미 론적 의미를 포착함으로써 지식 표현 학습 (KRL) 또는 지식 그래프 임베딩 (KGE)에 초점을 맞추고 있습니다 [5], [9]. 특정 지식 습득 작업에는 지식 그래프 완성 (KGC), 트리플 분류, 엔티티 인식 및 관계 추출이 포함됩니다. 지식 인식 모델은 이기종 정보의 통합, 지식 표현을 위한 풍부한 온톨로지 및 의미론, 다국어 지식의 이점을 누립니다. 따라서 추천 시스템 및 질문 답변과 같은 많은 실제 응용 프로그램이 상식적인 이해와 추론 능력으로 번영을 가져 왔습니다. 예를 들어 Microsoft의 Satori 및 Google의 지식 정보 [3]와 같은 일부 실제 제품은 보다 효율적인 서비스를 제공할 수 있는 강력한 능력을 보여주었습니다.
>
> 이 백서에서는 지식 습득 및 지식 인식 응용 프로그램을 위해 더 많은 컨텍스트, 지능 및 의미를 가진 그래프를 강화하는 지식 그래프에 대한 현재 문헌에 대한 포괄적 인 조사를 수행합니다. 우리의 주요 기여는 다음과 같이 요약됩니다.

• Comprehensive review.

We conduct a comprehensive review of the origin of knowledge graph and modern techniques for relational learning on knowledge graphs. Major neural architectures of knowledge graph representation learning and reasoning are introduced and compared. Moreover, we provide a complete overview of many applications in different domains.

• Full-view categorization and new taxonomies.

A fullview categorization of research on knowledge graph, together with fine-grained new taxonomies are presented. Specifically, in the high-level, we review the research on knowledge graphs in four aspects: KRL, knowledge acquisition, temporal knowledge graphs, and knowledge-aware application. For KRL approaches, we further propose fine-grained taxonomies into four views, including representation space, scoring function, encoding models, and auxiliary information. For knowledge acquisition, KGC is reviewed under embedding-based ranking, relational path reasoning, logical rule reasoning, and meta relational learning; entity-relation acquisition tasks are divided into entity recognition, typing, disambiguation, and alignment; and relation extraction is discussed according to the neural paradigms.

• Wide coverage on emerging advances.

Knowledge graph has experienced rapid development. This survey provides wide coverage on emerging topics, including transformer-based knowledge encoding, graph neural network (GNN) based knowledge propagation, reinforcement learning-based path reasoning, and meta relational learning.

• Summary and outlook on future directions.

This survey provides a summary of each category and highlights promising future research directions.

> • 포괄적인 검토.
>
> 우리는 지식 그래프의 관계 학습을 위한 지식 그래프의 기원과 현대 기술에 대한 포괄적 인 검토를 수행합니다. 지식 그래프 표현 학습 및 추론의 주요 신경 아키텍처를 소개하고 비교합니다. 또한 다양한 도메인의 많은 애플리케이션에 대한 전체 개요를 제공합니다.
>
> • 전체보기 분류 및 새로운 분류.
>
> 세분화 된 새로운 분류법과 함께 지식 그래프에 대한 연구의 전체보기 범주가 제공됩니다. 구체적으로 상위 수준에서는 KRL, 지식 습득, 시간적 지식 그래프, 지식 인식 응용의 네 가지 측면에서 지식 그래프에 대한 연구를 검토합니다. KRL 접근법의 경우 표현 공간, 스코어링 기능, 인코딩 모델 및 보조 정보를 포함하여 세분화 된 분류법을 네 가지 뷰로 추가로 제안합니다. 지식 습득을 위해 KGC는 임베딩 기반 순위, 관계 경로 추론, 논리적 규칙 추론 및 메타 관계 학습에서 검토됩니다. 엔티티-관계 획득 작업은 엔티티 인식, 타이핑, 명확화 및 정렬로 나뉩니다. 그리고 관계 추출은 신경 패러다임에 따라 논의됩니다.
>
> • 새로운 발전에 대한 광범위한 적용.
>
> 지식 그래프는 빠르게 발전했습니다. 이 설문 조사는 변환기 기반 지식 인코딩, 그래프 신경망 (GNN) 기반 지식 전파, 강화 학습 기반 경로 추론 및 메타 관계 학습을 포함한 새로운 주제에 대한 광범위한 범위를 제공합니다.
>
> • 향후 방향에 대한 요약 및 전망.
>
> 이 설문 조사는 각 카테고리의 요약을 제공하고 유망한 향후 연구 방향을 강조합니다.

The remainder of this survey is organized as follows: first, an overview of knowledge graphs including history, notations, definitions, and categorization is given in Section II; then, we discuss KRL in Section III from four scopes; next, our review goes to tasks of knowledge acquisition and temporal knowledge graphs in Section IV and Section V; downstream applications are introduced in Section VI; finally, we discuss future research directions, together with a conclusion in the end. Other information, including KRL model training and a collection of knowledge graph datasets and open-source implementations, can be found in the appendices.

> 이 설문 조사의 나머지 부분은 다음과 같이 구성됩니다. 첫째, 역사, 표기법, 정의 및 분류를 포함한 지식 그래프의 개요가 섹션 II에 제공됩니다. 그런 다음 섹션 III에서 네 가지 범위에서 KRL을 논의합니다. 다음으로, 우리의 검토는 섹션 IV 및 섹션 V의 지식 습득 및 시간적 지식 그래프 작업으로 이동합니다. 다운 스트림 애플리케이션은 섹션 VI에서 소개됩니다. 마지막으로 결론과 함께 향후 연구 방향에 대해 논의합니다. KRL 모델 교육, 지식 그래프 데이터 세트 및 오픈 소스 구현을 포함한 기타 정보는 부록에서 찾을 수 있습니다.


### II. OVERVIEW

#### A. A Brief History of Knowledge Bases

Knowledge representation has experienced a long-period history of development in the fields of logic and AI. The idea of graphical knowledge representation firstly dated back to 1956 as the concept of semantic net proposed by Richens [10], while the symbolic logic knowledge can go back to the General Problem Solver [1] in 1959. The knowledge base is firstly used with knowledge-based systems for reasoning and problemsolving. MYCIN [2] is one of the most famous rule-based expert systems for medical diagnosis with a knowledge base of about 600 rules. Later, the community of human knowledge representation saw the development of frame-based language, rule-based, and hybrid representations. Approximately at the end of this period, the Cyc project1 began, aiming at assembling human knowledge. Resource description framework (RDF)2 and Web Ontology Language (OWL)3 were released in turn, and became important standards of the Semantic Web4. Then, many open knowledge bases or ontologies were published, such as WordNet, DBpedia, YAGO, and Freebase. Stokman and Vries [7] proposed a modern idea of structure knowledge in a graph in 1988. However, it was in 2012 that the concept of knowledge graph gained great popularity since its first launch by Google’s search engine , where the knowledge fusion framework called Knowledge Vault [3] was proposed to build large-scale knowledge graphs. A brief road map of knowledge base history is illustrated in Fig. 2.

> 지식 표현은 논리 및 AI 분야에서 오랜 기간의 개발 역사를 경험했습니다. 그래픽 지식 표현의 개념은 Richens [10]가 제안한 의미 체계의 개념으로 처음 1956 년으로 거슬러 올라가는 반면, 상징 논리 지식은 1959 년 일반 문제 해결사 [1]로 거슬러 올라갈 수 있습니다. 지식 기반은 처음으로 다음과 같이 사용됩니다. 추론 및 문제 해결을 위한 지식 기반 시스템. MYCIN [2]는 약 600 개의 규칙에 대한 지식 기반을 갖춘 의료 진단을위한 가장 유명한 규칙 기반 전문가 시스템 중 하나입니다. 나중에 인간 지식 표현 커뮤니티는 프레임 기반 언어, 규칙 기반 및 하이브리드 표현의 개발을 보았습니다. 이 기간이 끝날 무렵, 인간 지식을 모으는 것을 목표로하는 Cyc 프로젝트 1가 시작되었습니다. 자원 설명 프레임 워크 (RDF) 2와 웹 온톨로지 언어 (OWL) 3가 차례로 출시되었으며 Semantic Web4의 중요한 표준이되었습니다. 그런 다음 WordNet, DBpedia, YAGO 및 Freebase와 같은 많은 개방형 지식 기반 또는 온톨로지가 게시되었습니다. Stokman and Vries [7]는 1988 년 그래프에서 구조 지식에 대한 현대적인 아이디어를 제안했습니다. 그러나 지식 그래프의 개념이 Google의 검색 엔진에 의해 처음 출시 된 이후로 큰 인기를 얻은 것은 2012 년이었습니다. 지식 융합 프레임 워크는 Knowledge 라고 합니다. Vault [3]는 대규모 지식 그래프를 구축하기 위해 제안되었습니다. 지식 기반 히스토리의 간략한 로드맵이 그림 2에 나와 있습니다.

#### B. Definitions and Notations

Most efforts have been made to give a definition by describing general semantic representation or essential characteristics. However, there is no such wide-accepted formal definition. Paulheim [11] defined four criteria for knowledge graphs. Ehrlinger and Woß [12] analyzed several existing definitions and proposed Definition 1, which emphasizes the reasoning engine of knowledge graphs. Wang et al. [5] proposed a definition as a multi-relational graph in Definition 2. Following previous literature, we define a knowledge graph as G = {E, R, F}, where E, R and F are sets of entities, relations and facts, respectively. A fact is denoted as a triple (h, r, t) ∈ F.

> 일반적인 의미 표현 또는 필수 특성을 설명하여 정의를 제공하려는 대부분의 노력이 이루어졌습니다. 그러나 널리 받아 들여지는 공식적인 정의는 없습니다. Paulheim [11]은 지식 그래프에 대한 네 가지 기준을 정의했습니다. Ehrlinger와 Woß [12]는 기존의 여러 정의를 분석하고 지식 그래프의 추론 엔진을 강조하는 정의 1을 제안했습니다. Wang et al. [5] 정의 2에서 다중 관계 그래프로 정의를 제안했습니다. 이전 문헌에 따라 지식 그래프를 G = {E, R, F}로 정의합니다. 여기서 E, R 및 F는 개체, 관계 및 사실의 집합입니다. 각각. 사실은 트리플 (h, r, t) ∈ F로 표시됩니다.

Definition 1 (Ehrlinger and Woß [12])

A knowledge graph acquires and integrates information into an ontology and applies a reasoner to derive new knowledge.

Definition 2 (Wang et al. [5]).

A knowledge graph is a multirelational graph composed of entities and relations which are regarded as nodes and different types of edges, respectively.

Specific notations and their descriptions are listed in Table I. Details of several mathematical operations are explained in Appendix A.

> 정의 1 (Ehrlinger 및 Woß [12])
>
> 지식 그래프는 정보를 수집하여 온톨로지에 통합하고 추론자를 적용하여 새로운 지식을 도출합니다.
>
> 정의 2 (Wang et al. [5]).
>
> 지식 그래프는 각각 노드와 다른 유형의 모서리로 간주되는 엔티티와 관계로 구성된 다중 관계형 그래프입니다.
>
> 특정 표기법과 그 설명은 표 I에 나열되어 있습니다. 몇 가지 수학적 연산에 대한 자세한 내용은 부록 A에 설명되어 있습니다.

#### C. Categorization of Research on Knowledge Graph

This survey provides a comprehensive literature review on the research of knowledge graphs, namely KRL, knowledge acquisition, and a wide range of downstream knowledgeaware applications, where many recent advanced deep learning techniques are integrated. The overall categorization of the research is illustrated in Fig. 3.

Knowledge Representation Learning is a critical research issue of knowledge graph which paves the way for many knowledge acquisition tasks and downstream applications. We categorize KRL into four aspects of representation space, scoring function, encoding models and auxiliary information, providing a clear workflow for developing a KRL model. Specific ingredients include:

* 1) representation space in which the relations and entities are represented;
* 2) scoring function for measuring the plausibility of factual triples;
* 3) encoding models for representing and learning relational interactions;
* 4) auxiliary information to be incorporated into the embedding methods.

> 이 설문 조사는 지식 그래프 연구, 즉 KRL, 지식 습득 및 최신 고급 딥 러닝 기술이 통합 된 광범위한 다운 스트림 지식 인식 응용 프로그램에 대한 포괄적 인 문헌 검토를 제공합니다. 연구의 전체 범주는 그림 3에 나와 있습니다.
>
> 지식 표현 학습은 많은 지식 습득 작업과 다운 스트림 애플리케이션을위한 길을 닦는 지식 그래프의 중요한 연구 문제입니다. 우리는 KRL을 표현 공간, 채점 기능, 인코딩 모델 및 보조 정보의 네 가지 측면으로 분류하여 KRL 모델 개발을위한 명확한 워크 플로우를 제공합니다. 특정 성분은 다음과 같습니다.
>
> 1) 관계와 실체가 표현되는 표현 공간
> 2) 사실적 트리플의 타당성을 측정하기 위한 점수 기능;
> 3) 관계형 상호 작용을 표현하고 학습하기 위한 인코딩 모델;
> 4) 임베딩 방법에 포함될 보조 정보.

Representation learning includes point-wise space, manifold, complex vector space, Gaussian distribution, and discrete space. Scoring metrics are generally divided into distance-based and similarity matching based scoring functions. Current research focuses on encoding models, including linear/bilinear models, factorization, and neural networks. Auxiliary information considers textual, visual, and type information.

Knowledge Acquisition tasks are divided into three categories, i.e., KGC, relation extraction, and entity discovery. The first one is for expanding existing knowledge graphs, while the other two discover new knowledge (aka relations and entities) from the text. KGC falls into the following categories: embedding-based ranking, relation path reasoning, rule-based reasoning, and meta relational learning. Entity discovery includes recognition, disambiguation, typing, and alignment. Relation extraction models utilize attention mechanism, graph convolutional networks (GCNs), adversarial training, reinforcement learning, deep residual learning, and transfer learning.

Temporal Knowledge Graphs incorporate temporal information for representation learning. This survey categorizes four research fields, including temporal embedding, entity dynamics, temporal relational dependency, and temporal logical reasoning.

Knowledge-aware Applications include natural language understanding (NLU), question answering, recommendation systems, and miscellaneous real-world tasks, which inject knowledge to improve representation learning.

> 표현 학습에는 점별 공간, 다양체, 복소 벡터 공간, 가우스 분포 및 이산 공간이 포함됩니다. 채점 메트릭은 일반적으로 거리 기반 및 유사성 일치 기반 채점 함수로 구분됩니다. 현재 연구는 선형 / 쌍 선형 모델, 분해 및 신경망을 포함한 인코딩 모델에 중점을 둡니다. 보조 정보는 텍스트, 시각적 및 유형 정보를 고려합니다.
>
> 지식 습득 작업은 KGC, 관계 추출, 개체 발견의 세 가지 범주로 나뉩니다. 첫 번째는 기존 지식 그래프를 확장하기 위한 것이고 다른 두 가지는 텍스트에서 새로운 지식 (일명 관계 및 엔티티)을 발견하는 것입니다. KGC는 임베딩 기반 순위, 관계 경로 추론, 규칙 ​​기반 추론 및 메타 관계 학습과 같은 범주로 분류됩니다. 엔티티 검색에는 인식, 명확성, 타이핑 및 정렬이 포함됩니다. 관계 추출 모델은 주의 메커니즘, 그래프 컨볼루션 네트워크 (GCN), 적대적 훈련, 강화 학습, 딥 레지 듀얼 학습 및 전이 학습을 활용합니다.
>
> 시간 지식 그래프는 표현 학습을위한 시간 정보를 통합합니다. 이 설문 조사는 시간적 임베딩, 개체 역학, 시간적 관계 의존성, 시간적 논리적 추론을 포함한 4 개의 연구 분야를 분류합니다.
>
> 지식 인식 응용 프로그램에는 자연어 이해 (NLU), 질문 응답, 추천 시스템 및 기타 실제 작업이 포함되며 표현 학습을 향상시키기 위해 지식을 주입합니다.

#### D. Related Surveys

Previous survey papers on knowledge graphs mainly focus on statistical relational learning [4], knowledge graph refinement [11], Chinese knowledge graph construction [13], knowledge reasoning [14], KGE [5] or KRL [9]. The latter two surveys are more related to our work. Lin et al. [9] presented KRL in a linear manner, with a concentration on quantitative analysis. Wang et al. [5] categorized KRL according to scoring functions and specifically focused on the type of information utilized in KRL. It provides a general view of current research only from the perspective of scoring metrics. Our survey goes deeper to the flow of KRL and provides a full-scaled view from four-folds, including representation space, scoring function, encoding models, and auxiliary information. Besides, our paper provides a comprehensive review of knowledge acquisition and knowledge-aware applications with several emerging topics such as knowledge-graph-based reasoning and few-shot learning discussed.

> 지식 그래프에 대한 이전 조사 논문은 주로 통계적 관계 학습 [4], 지식 그래프 개선 [11], 중국 지식 그래프 구성 [13], 지식 추론 [14], KGE [5] 또는 KRL [9]에 중점을 두었습니다. 후자의 두 설문 조사는 우리 작업과 더 관련이 있습니다. Lin et al. [9]는 KRL을 정량 분석에 집중하여 선형 방식으로 제시했습니다. Wang et al. [5] KRL을 채점 기능에 따라 분류하고 특히 KRL에서 활용되는 정보의 유형에 중점을 둡니다. 스코어링 메트릭의 관점에서만 현재 연구에 대한 일반적인 보기를 제공합니다. 우리의 설문 조사는 KRL의 흐름에 더 깊이 들어가서 표현 공간, 채점 기능, 인코딩 모델 및 보조 정보를 포함하여 네 가지 측면에서 본격적인보기를 제공합니다. 게다가, 우리의 논문은 지식 그래프 기반 추론 및 논의 된 몇 번의 학습과 같은 몇 가지 새로운 주제와 함께 지식 습득 및 지식 인식 응용 프로그램에 대한 포괄적인 검토를 제공합니다.


### III. KNOWLEDGE REPRESENTATION LEARNING

KRL is also known as KGE, multi-relation learning, and statistical relational learning in the literature. This section reviews recent advances on distributed representation learning with rich semantic information of entities and relations form four scopes including representation space (representing entities and relations, Section III-A), scoring function (measuring the plausibility of facts, Section III-B), encoding models (modeling the semantic interaction of facts, Section III-C), and auxiliary information (utilizing external information, Section III-D). We further provide a summary in Section III-E. The training strategies for KRL models are reviewed in Appendix C.

> KRL은 문헌에서 KGE, 다중 관계 학습 및 통계적 관계 학습으로도 알려져 있습니다. 이 섹션에서는 표현 공간 (엔티티 및 관계 표현, 섹션 III-A), 스코어링 기능 (사실의 타당성 측정, 섹션 III-B), 인코딩 모델 (사실의 의미 적 상호 작용 모델링, 섹션 III-C) 및 보조 정보 (외부 정보 활용, 섹션 III-D). 섹션 III-E에서 요약을 추가로 제공합니다. KRL 모델에 대한 교육 전략은 부록 C에서 검토됩니다.

#### A. Representation Space

The key issue of representation learning is to learn lowdimensional distributed embedding of entities and relations. Current literature mainly uses real-valued point-wise space (Fig. 4a) including vector, matrix and tensor space, while other kinds of space such as complex vector space (Fig. 4b), Gaussian space (Fig. 4c), and manifold (Fig. 4d) are utilized as well.

> 표현 학습의 핵심 문제는 엔티티와 관계의 저 차원 분산 임베딩을 학습하는 것입니다. 현재 문헌은 주로 벡터, 행렬 및 텐서 공간을 포함하는 실수 값 포인트 공간 (그림 4a)을 사용하는 반면, 복소 벡터 공간 (그림 4b), 가우스 공간 (그림 4c) 및 매니 폴드와 같은 다른 종류의 공간을 사용합니다. (그림 4d)도 활용됩니다.

**1) Point-Wise Space:**

Point-wise Euclidean space is widely applied for representing entities and relations, projecting relation embedding in vector or matrix space, or capturing relational interactions. TransE [15] represents entities and relations in d-dimension vector space, i.e., h, t, r ∈ Rd, and makes embeddings follow the translational principle h+r ≈ t. To tackle this problem of insufficiency of a single space for both entities and relations, TransR [16] then further introduces separated spaces for entities and relations. The authors projected entities (h, t ∈ Rk) into relation (r ∈ Rd) space by a projection matrix Mr ∈ Rk×d. NTN [17] models entities across multiple dimensions by a bilinear tensor neural layer. The relational interaction between head and tail hTMt c is captured as a tensor denoted as Mc ∈ Rd×d×k. Instead of using the Cartesian coordinate system, HAKE [18] captures semantic hierarchies by mapping entities into the polar coordinate system, i.e., entity embeddings em ∈ Rd and ep ∈ [0, 2π)d in the modulus and phase part, respectively.

Many other translational models such as TransH [19] also use similar representation space, while semantic matching models use plain vector space (e.g., HolE [20]) and relational projection matrix (e.g., ANALOGY [21]). Principles of these translational and semantic matching models are introduced in Section III-B1 and III-B2, respectively.

> 포인트 단위 유클리드 공간은 엔티티 및 관계를 표현하고, 벡터 또는 행렬 공간에 관계 임베딩을 투영하거나, 관계형 상호 작용을 캡처하는 데 널리 적용됩니다. TransE [15]는 d 차원 벡터 공간, 즉 h, t, r ∈ Rd에서 엔티티와 관계를 나타내며 임베딩이 변환 원리 h + r ≈ t를 따르도록합니다. 엔티티와 관계 모두에 대해 단일 공간이 부족하다는 문제를 해결하기 위해 TransR [16]은 엔티티와 관계에 대해 분리 된 공간을 추가로 도입합니다. 저자는 투영 행렬 Mr ∈ Rk × d에 의해 엔티티 (h, t ∈ Rk)를 관계 (r ∈ Rd) 공간으로 투영했습니다. NTN [17]은 쌍 선형 텐서 신경 층에 의해 여러 차원에 걸쳐 엔티티를 모델링합니다. 머리와 꼬리 hTMt c 사이의 관계형 상호 작용은 Mc ∈ Rd × d × k로 표시된 텐서로 캡처됩니다. 데카르트 좌표계를 사용하는 대신 HAKE [18]는 엔티티를 극 좌표계에 매핑하여 의미 계층을 캡처합니다.
>
> TransH [19]와 같은 다른 많은 변환 모델도 유사한 표현 공간을 사용하는 반면, 시맨틱 매칭 모델은 일반 벡터 공간 (예 : HolE [20])과 관계형 투영 행렬 (예 : ANALOGY [21])을 사용합니다. 이러한 번역 및 의미 일치 모델의 원리는 섹션 III-B1 및 III-B2에서 각각 소개됩니다.

**2) Complex Vector Space:**

Instead of using a real-valued space, entities and relations are represented in a complex space, where h, t, r ∈ Cd. Take head entity as an example, h has a real part Re(h) and an imaginary part Im(h), i.e., h = Re(h)+iIm(h). ComplEx [22] firstly introduces complex vector space shown in Fig. 4b which can capture both symmetric and antisymmetric relations. Hermitian dot product is used to do composition for relation, head and the conjugate of tail. Inspired by Euler’s identity eiθ = cos θ + isin θ, RotatE [23] proposes a rotational model taking relation as a rotation from head entity to tail entity in complex space as t = h◦r where ◦ denotes the element-wise Hadmard product. QuatE [24] extends the complex-valued space into hypercomplex h, t, r ∈ Hd by a quaternion Q = a + bi + cj + dk with three imaginary components, where the quaternion inner product, i.e., the Hamilton product h ⊗ r, is used as compositional operator for head entity and relation.

> 실수 공간을 사용하는 대신 엔티티와 관계는 h, t, r ∈ Cd의 복잡한 공간으로 표현됩니다. 헤드 엔터티를 예로 들면, h는 실수 부분 Re (h)와 허수 부분 Im (h), 즉 h = Re (h) + iIm (h)를 갖습니다. ComplEx [22]는 대칭 및 비대칭 관계를 모두 포착 할 수 있는 그림 4b에 표시된 복잡한 벡터 공간을 먼저 도입했습니다. Hermitian 내적은 관계, 머리 및 꼬리의 켤레를 구성하는 데 사용됩니다. Euler의 정체성 eiθ = cos θ + isin θ에서 영감을 얻은 RotatE [23]는 복잡한 공간에서 머리 개체에서 꼬리 개체로의 회전 관계를 t = h◦r로 간주하는 회전 모델을 제안합니다. 여기서 ◦는 요소 별 Hadmard 곱을 나타냅니다. QuatE [24]는 복소수 값 공간을 쿼터니언 Q = a + bi + cj + dk에 의해 하이퍼 컴플렉스 h, t, r ∈ Hd로 확장합니다. 여기서 쿼터니언 내적, 즉 해밀턴 곱 h ⊗ r , 헤드 엔티티 및 관계에 대한 구성 연산자로 사용됩니다.

**3) Gaussian Distribution:**

Inspired by Gaussian word embedding, the density-based embedding model KG2E [25] introduces Gaussian distribution to deal with the (un)certainties of entities and relations. The authors embedded entities and relations into multi-dimensional Gaussian distribution H ∼ N (µh, Σh) and T ∼ N (µt, Σt). The mean vector u indicates entities and relations’ position, and the covariance matrix Σ models their (un)certainties. Following the translational principle, the probability distribution of entity transformation H − T is denoted as Pe ∼ N (µh − µt, Σh + Σt). Similarly, TransG [26] represents entities with Gaussian distributions, while it draws a mixture of Gaussian distribution for relation embedding, where the m-th component translation vector of relation r is denoted as ur,m = t − h ∼ Nut − uh, σ2h + σ2t E.

> 가우스 단어 임베딩에서 영감을 받은 밀도 기반 임베딩 모델 KG2E [25]는 엔티티 및 관계의 (불) 확도를 처리하기 위해 가우스 분포를 도입합니다. 저자는 엔티티와 관계를 다차원 가우스 분포 H ∼ N (µh, Σh) 및 T ∼ N (µt, Σt)에 삽입했습니다. 평균 벡터 u는 엔티티와 관계의 위치를 나타내고 공분산 행렬 Σ는 해당 (불) 확도를 모델링합니다. 변환 원리에 따라 엔티티 변환 H − T의 확률 분포는 Pe ∼ N (µh − µt, Σh + Σt)으로 표시됩니다. 마찬가지로 TransG [26]는 가우시안 분포를 갖는 엔티티를 나타내며, 관계 임베딩을위한 가우스 분포의 혼합을 그립니다. 여기서 관계 r의 m 번째 성분 변환 벡터는 ur, m = t − h ∼ Nut − uh, σ2h + σ2t E.

**4) Manifold and Group:**

This section reviews knowledge representation in manifold space, Lie group, and dihedral group. A manifold is a topological space, which could be defined as a set of points with neighborhoods by the set theory. The group is algebraic structures defined in abstract algebra. Previous point-wise modeling is an ill-posed algebraic system where the number of scoring equations is far more than the number of entities and relations. Moreover, embeddings are restricted in an overstrict geometric form even in some methods with subspace projection. To tackle these issues, ManifoldE [27] extends point-wise embedding into manifold-based embedding. The authors introduced two settings of manifold-based embedding, i.e., Sphere and Hyperplane. An example of a sphere is shown in Fig. 4d. For the sphere setting, Reproducing Kernel Hilbert Space is used to represent the manifold function, i.e

where ϕ maps the original space to the Hilbert space, and K is the kernel function. Another “hyperplane” setting is introduced to enhance the model with intersected embeddings, i.e.

Hyperbolic space, a multidimensional Riemannian manifold with a constant negative curvature −c (c > 0) : Bd,c = x ∈ Rd: kxk2 < 1c, is drawing attention for its capacity of capturing hierarchical information. MuRP [28] represents the multi-relational knowledge graph in Poincar ball of hyperbolic space Bdc = x ∈ Rd: ckxk2 < 1. While it fails to capture logical patterns and suffers from constant curvature. Chami al. [29] leverages expressive hyperbolic isometries and learns a relation-specific absolute curvature cr in the hyperbolic space.

TorusE [30] solves the regularization problem of TransE via embedding in an n-dimensional torus space which is a compact Lie group. With the projection from vector space into torus space defined as π : Rn → Tn, x 7→ [x], entities and relations are denoted as [h], [r], [t] ∈ Tn. Similar to TransE, it also learns embeddings following the relational translation in torus space, i.e., [h] + [r] ≈ [t]. Recently, DihEdral [31] proposes a dihedral symmetry group preserving a 2-dimensional polygon.

> 이 섹션에서는 다양한 공간, 거짓말 그룹 및 이면체 그룹에서 지식 표현을 검토합니다. 매니 폴드는 집합 이론에 의해 이웃이 있는 점 집합으로 정의 될 수 있는 토폴로지 공간입니다. 그룹은 추상 대수에서 정의 된 대수 구조입니다. 이전의 포인트 별 모델링은 채점 방정식의 수가 엔티티 및 관계의 수보다 훨씬 많은 잘못된 대수 시스템입니다. 또한 임베딩은 부분 공간 투영을 사용하는 일부 방법에서도 지나치게 엄격한 기하학적 형태로 제한됩니다. 이러한 문제를 해결하기 위해 ManifoldE [27]는 포인트 단위 임베딩을 매니 폴드 기반 임베딩으로 확장합니다. 저자는 매니 폴드 기반 임베딩의 두 가지 설정, 즉 Sphere 및 Hyperplane을 도입했습니다. 구의 예가 그림 4d에 나와 있습니다. 구 설정의 경우 Reproducing Kernel Hilbert Space는 매니 폴드 함수를 나타내는 데 사용됩니다.
>
> 여기서 ϕ는 원래 공간을 Hilbert 공간에 매핑하고 K는 커널 함수입니다. 교차 된 임베딩으로 모델을 향상시키기 위해 또 다른 "초평면" 설정이 도입되었습니다.
>
> -c (c> 0) : Bd, c = x ∈ Rd : kxk2 <1c가 일정한 음의 곡률을 갖는 다차원 리만 매니 폴드 인 쌍곡선 공간은 계층 적 정보를 캡처하는 능력으로 주목을 받고 있습니다. MuRP [28]는 쌍곡선 공간의 Poincar ball에서 다중 관계 지식 그래프를 나타냅니다. Bdc = x ∈ Rd : ckxk2 <1. 논리 패턴을 포착하지 못하고 일정한 곡률을 겪고 있습니다. Chami al. [29] 표현 쌍곡선 아이 소메 트리를 활용하고 쌍곡선 공간에서 관계 별 절대 곡률 cr을 학습합니다.
>
> TorusE [30]는 콤팩트 한 Lie 그룹 인 n 차원 토러스 공간에 임베딩하여 TransE의 정규화 문제를 해결합니다. 벡터 공간에서 토러스 공간으로의 투영은 π : Rn → Tn, x 7 → [x]로 정의되며 엔티티와 관계는 [h], [r], [t] ∈ Tn으로 표시됩니다. TransE와 유사하게, 토러스 공간, 즉 [h] + [r] ≈ [t]에서 관계형 변환을 따르는 임베딩도 학습합니다. 최근 DihEdral [31]은 2 차원 다각형을 보존하는 2면 대칭군을 제안한다.

#### B. Scoring Function

The scoring function is used to measure the plausibility of facts, also referred to as the energy function in the energybased learning framework. Energy-based learning aims to learn the energy function Eθ(x) (parameterized by θ taking x as input) and to make sure positive samples have higher scores than negative samples. In this paper, the term of the scoring function is adopted for unification. There are two typical types of scoring functions, i.e., distance-based (Fig. 5a) and similaritybased (Fig. 5b) functions, to measure the plausibility of a fact. Distance-based scoring function measures the plausibility of facts by calculating the distance between entities, where addictive translation with relations as h+r ≈ t is widely used. Semantic similarity based scoring measures the plausibility of facts by semantic matching. It usually adopts multiplicative formulation, i.e., h > Mr ≈ t >, to transform head entity near the tail in the representation space.

> 채점 함수는 사실의 타당성을 측정하는 데 사용되며 에너지 기반 학습 프레임 워크에서 에너지 함수라고도합니다. 에너지 기반 학습은 에너지 함수 Eθ (x) (입력으로 x를 사용하는 θ에 의해 매개 변수화 됨)를 학습하고 양수 샘플이 음수 샘플보다 더 높은 점수를 받도록 하는 것을 목표로합니다. 본 논문에서는 통일을 위해 채점 함수라는 용어를 채택 하였다. 사실의 타당성을 측정하기위한 두 가지 일반적인 유형의 채점 함수, 즉 거리 기반 (그림 5a) 및 유사성 기반 (그림 5b) 함수가 있습니다. 거리 기반 채점 기능은 엔티티 간의 거리를 계산하여 사실의 타당성을 측정합니다. 여기서 h + r ≈ t와 같은 관계를 가진 중독성 번역이 널리 사용됩니다. 의미 론적 유사성 기반 점수는 의미 론적 일치를 통해 사실의 타당성을 측정합니다. 일반적으로 곱셈 공식, 즉 h> Mr ≈ t>를 채택하여 표현 공간에서 꼬리 근처의 머리 엔티티를 변환합니다.

**1) Distance-based Scoring Function:**

An intuitive distancebased approach is to calculate the Euclidean distance between the relational projection of entities. Structural Embedding (SE) [8] uses two projection matrices and L1 distance to learn structural embedding as.

A more intensively used principle is the translation-based scoring function that aims to learn embeddings by representing relations as translations from head to tail entities. Bordes et al. [15] proposed TransE by assuming that the added embedding of h+r should be close to the embedding of t with the scoring function is defined under L1 or L2 constraints as.

Since that, many variants and extensions of TransE have been proposed. For example, TransH [19] projects entities and relations into a hyperplane, TransR [16] introduces separate projection spaces for entities and relations, and TransD [33] constructs dynamic mapping matrices Mrh = rph > p + I and Mrt = rpt > p +I by the projection vectors hp, tp, rp ∈ Rn. By replacing Euclidean distance, TransA [34] uses Mahalanobis distance to enable more adaptive metric learning. Previous methods used additive score functions, TransF [35] relaxes the strict translation and uses dot product as fr(h, t) = (h + r) > t. To balance the constraints on head and tail, a flexible translation scoring function is further proposed.

Recently, ITransF [36] enables hidden concepts discovery and statistical strength transferring by learning associations between relations and concepts via sparse attention vectors, with scoring function defined as.

where D ∈ Rn×d×d is stacked concept projection matrices of entities and relations and αHr, αTr ∈ [0, 1]n are attention vectors calculated by sparse softmax, TransAt [37] integrates relation attention mechanism with translational embedding, and TransMS [38] transmits multi-directional semantics with nonlinear functions and linear bias vectors, with the scoring function as.

KG2E [25] in Gaussian space and ManifoldE [27] with manifold also use the translational distance-based scoring function. KG2E uses two scoring methods, i.e, asymmetric KL-divergence and symmetric expected likelihood. While the scoring function of ManifoldE is defined as.

where M is the manifold function, and Dr is a relation-specific manifold parameter.

> 직관적 인 거리 기반 접근 방식은 엔티티의 관계형 투영 간의 유클리드 거리를 계산하는 것입니다. Structural Embedding (SE) [8]은 두 개의 투영 행렬과 L1 거리를 사용하여 구조적 임베딩을 학습합니다.
>
> 보다 집중적으로 사용되는 원칙은 관계를 머리에서 꼬리 엔터티로의 번역으로 표현하여 임베딩을 학습하는 것을 목표로하는 번역 기반 채점 기능입니다. Bordes et al. [15] 추가 된 h + r의 임베딩이 L1 또는 L2 제약 조건하에 정의 된 스코어링 함수를 사용하여 t의 임베딩에 가까워 야한다고 가정하여 제안 된 TransE.
>
> 그 이후로 TransE의 많은 변형과 확장이 제안되었습니다. 예를 들어 TransH [19]는 엔티티와 관계를 초평면에 투영하고 TransR [16]은 엔티티와 관계에 대한 별도의 투영 공간을 도입하고 TransD [33]은 동적 매핑 행렬 Mrh = rph> p + I 및 Mrt = rpt> p를 구성합니다. + I : 투영 벡터 hp, tp, rp ∈ Rn. Euclidean 거리를 대체함으로써 TransA [34]는 Mahalanobis 거리를 사용하여 보다 적응적인 메트릭 학습을 가능하게합니다. 이전 방법은 가산 점수 함수를 사용했지만 TransF [35]는 엄격한 변환을 완화하고 내적을 fr (h, t) = (h + r)> t로 사용합니다. 머리와 꼬리에 대한 제약의 균형을 맞추기 위해 유연한 번역 점수 기능이 추가로 제안됩니다.
>
> 최근 ITransF [36]는 점수 기능이 정의 된 희소주의 벡터를 통해 관계와 개념 간의 연관성을 학습함으로써 숨겨진 개념 발견 및 통계적 강도 이전을 가능하게합니다.
>
> 여기서 D ∈ Rn × d × d는 엔티티와 관계의 누적 개념 투영 행렬이고 αHr, αTr ∈ [0, 1] n은 희소 소프트 맥스에 의해 계산 된주의 벡터이고, TransAt [37]은 관계주의 메커니즘과 번역 임베딩을 통합하며 TransMS [38]은 비선형 함수와 선형 바이어스 벡터를 사용하여 다 방향 의미론을 전송하며 채점 함수는 다음과 같습니다.
>
> Gaussian 공간의 KG2E [25] 및 매니 폴드가있는 ManifoldE [27]도 병진 거리 기반 스코어링 기능을 사용합니다. KG2E는 두 가지 채점 방법, 즉 비대칭 KL- 발산 및 대칭 기대 가능성을 사용합니다. ManifoldE의 스코어링 기능은 다음과 같이 정의됩니다.
>
> 여기서 M은 매니 폴드 함수이고 Dr는 관계 별 매니 폴드 매개 변수입니다.

**2) Semantic Matching:**

Another direction is to calculate the semantic similarity. SME [39] proposes to semantically match separate combinations of entity-relation pairs of (h, r) and (r, t). Its scoring function is defined with two versions of matching blocks - linear and bilinear block, i.e.,

The linear matching block is defined as gleft(h, t) = Ml,1h > + Ml,2r > + b > l, and the bilinear form is gleft(h, r) = (Ml,1h) ◦ (Ml,2r)+b > l. By restricting relation matrix Mr to be diagonal for multi-relational representation learning, DistMult [32] proposes a simplified bilinear formulation defined as.

To capture productive interactions in relational data and compute efficiently, HolE [20] introduces a circular correlation of embedding, which can be interpreted as a compressed tensor product, to learn compositional representations. By defining a perturbed holographic compositional operator as p(a, b; c) = (c◦a)?b, where c is a fixed vector, the expanded holographic embedding model HolEx [40] interpolates the HolE and full tensor product method. It can be viewed as linear concatenation of perturbed HolE. Focusing on multi-relational inference, ANALOGY [21] models analogical structures of relational data. It’s scoring function is defined as.

with relation matrix constrained to be normal matrices in linear mapping, i.e., M > r Mr = MrM > r for analogical inference. Crossover interactions are introduced by CrossE [41] with an interaction matrix C ∈ Rnr×d to simulate the bi-directional interaction between entity and relation. The relation specific interaction is obtained by looking up interaction matrix as cr = x > r C. By combining the interactive representations and matching with tail embedding, the scoring function is defined as.

The semantic matching principle can be encoded by neural networks further discussed in Sec. III-C.

The two methods mentioned above in Sec. III-A4 with group representation also follow the semantic matching principle. The scoring function of TorusE [30] is defined as:

By modeling 2L relations as group elements, the scoring function of DihEdral [31] is defined as the summation of components:

where the relation matrix R is defined in block diagonal form for R(l) ∈ DK, and entities are embedded in real-valued space for h(l) and t(l) ∈ R2.

> 또 다른 방향은 의미 론적 유사성을 계산하는 것입니다. SME [39]는 (h, r) 및 (r, t)의 엔티티-관계 쌍의 개별 조합을 의미 론적으로 일치시킬 것을 제안합니다. 스코어링 기능은 선형 블록과 쌍 선형 블록의 두 가지 버전으로 정의됩니다.
>
> 선형 매칭 블록은 gleft (h, t) = Ml, 1h> + Ml, 2r> + b> l로 정의되고 쌍 선형 형식은 gleft (h, r) = (Ml, 1h) ◦ (Ml, 2r ) + b> l. 다중 관계 표현 학습을 위해 관계 행렬 Mr을 대각선으로 제한함으로써 DistMult [32]는 다음과 같이 정의 된 단순화 된 이중 선형 공식을 제안합니다.
>
> 관계형 데이터에서 생산적인 상호 작용을 캡처하고 효율적으로 계산하기 위해 HolE [20]는 압축 된 텐서 곱으로 해석 될 수 있는 임베딩의 순환 상관을 도입하여 구성 표현을 학습합니다. 섭동 된 홀로그램 구성 연산자를 p (a, b; c) = (c◦a)? b (c는 고정 벡터)로 정의함으로써 확장 홀로 그래픽 임베딩 모델 HolEx [40]는 HolE 및 전체 텐서 곱 방법을 보간합니다. 섭동 된 HolE의 선형 연결로 볼 수 있습니다. 다중 관계 추론에 초점을 맞춘 ANALOGY [21]는 관계형 데이터의 유사 구조를 모델링합니다. 점수 기능은 다음과 같이 정의됩니다.
>
> 선형 매핑에서 정규 행렬로 제한되는 관계 행렬, 즉 유추적 추론의 경우 M> r Mr = MrM> r CrossE [41]는 상호 작용 행렬 C ∈ Rnrxd를 사용하여 교차 상호 작용을 도입하여 엔티티와 관계 간의 양방향 상호 작용을 시뮬레이션합니다. 관계 특정 상호 작용은 상호 작용 행렬을 cr = x> r C로 조회하여 얻습니다. 상호 작용 표현을 결합하고 꼬리 임베딩과 일치함으로써 점수 함수는 다음과 같이 정의됩니다.
>
> 의미 일치 원리는 Sec. III-C.
>
> 위에서 언급 한 두 가지 방법은 Sec. 그룹 표현이있는 III-A4도 의미 일치 원리를 따릅니다. TorusE [30]의 채점 함수는 다음과 같이 정의됩니다.
>
> 2L 관계를 그룹 요소로 모델링함으로써 DihEdral [31]의 스코어링 함수는 구성 요소의 합계로 정의됩니다.
>
> 여기서 관계 행렬 R은 R (l) ∈ DK에 대해 블록 대각선 형식으로 정의되고 엔티티는 h (l) 및 t (l) ∈ R2에 대한 실수 공간에 포함됩니다.

#### C. Encoding Models

This section introduces models that encode the interactions of entities and relations through specific model architectures, including linear/bilinear models, factorization models, and neural networks. Linear models formulate relations as a linear/bilinear mapping by projecting head entities into a representation space close to tail entities. Factorization aims to decompose relational data into low-rank matrices for representation learning. Neural networks encode relational data with non-linear neural activation and more complex network structures. Several neural models are illustrated in Fig. 6.

> 이 섹션에서는 선형 / 쌍 선형 모델, 인수 분해 모델 및 신경망을 포함한 특정 모델 아키텍처를 통해 엔티티 및 관계의 상호 작용을 인코딩하는 모델을 소개합니다. 선형 모델은 헤드 엔티티를 꼬리 엔티티에 가까운 표현 공간으로 투영하여 선형 / 쌍 선형 매핑으로 관계를 공식화합니다. Factorization은 표현 학습을 위해 관계형 데이터를 하위 행렬로 분해하는 것을 목표로합니다. 신경망은 비선형 신경 활성화 및 더 복잡한 네트워크 구조로 관계형 데이터를 인코딩합니다. 여러 신경 모델이 그림 6에 나와 있습니다.

**1) Linear/Bilinear Models:**

Linear/bilinear models encode interactions of entities and relations by applying linear operation as:

or bilinear transformation operations as Eq. 10. Canonical methods with linear/bilinear encoding include SE [8], SME [39], DistMult [32], ComplEx [22], and ANALOGY [21]. For TransE [15] with L2 regularization, the scoring function can be expanded to the form with only linear transformation with one-dimensional vectors, i.e.,

Wang et al. [46] studied various bilinear models and evaluated their expressiveness and connections by introducing the concepts of universality and consistency. The authors further showed that the ensembles of multiple linear models can improve the prediction performance through experiments. Recently, to solve the independence embedding issue of entity vectors in canonical Polyadia decomposition, SimplE [47] introduces the inverse of relations and calculates the average canonical Polyadia score of (h, r, t) and (t, r−1, h) as.

where r0 is the embedding of inversion relation. More bilinear models are proposed from a factorization perspective discussed in the next section.

> 선형 / 쌍 선형 모델은 다음과 같이 선형 연산을 적용하여 엔티티 및 관계의 상호 작용을 인코딩합니다.
>
> 또는 쌍 선형 변환 연산을 Eq. 10. 선형 / 쌍 선형 인코딩을 사용하는 표준 방법에는 SE [8], SME [39], DistMult [32], ComplEx [22] 및 ANALOGY [21]가 있습니다. L2 정규화를 사용하는 TransE [15]의 경우 스코어링 함수는 1 차원 벡터를 사용한 선형 변환 만 사용하는 형식으로 확장 할 수 있습니다.
>
> Wang et al. [46]은 다양한 쌍 선형 모델을 연구하고 보편성과 일관성의 개념을 도입하여 표현 성과 연결성을 평가했습니다. 저자는 또한 여러 선형 모델의 앙상블이 실험을 통해 예측 성능을 향상시킬 수 있음을 보여주었습니다. 최근에 표준 Polyadia 분해에서 엔티티 벡터의 독립 임베딩 문제를 해결하기 위해 SimplE [47]는 관계의 역을 도입하고 (h, r, t) 및 (t, r-1, h)의 평균 표준 Polyadia 점수를 계산합니다. 같이.
>
> 여기서 r0은 반전 관계의 임베딩입니다. 다음 섹션에서 논의되는 인수 분해 관점에서 더 많은 쌍 선형 모델이 제안됩니다.

**2) Factorization Models:**

Factorization methods formulated KRL models as three-way tensor X decomposition. A general principle of tensor factorization can be denoted as Xhrt ≈ h > Mrt, with the composition function following the semantic matching pattern. Nickel et al. [48] proposed the three-way rank-r factorization RESCAL over each relational slice of knowledge graph tensor. For k-th relation of m relations, the k-th slice of X is factorized as.

The authors further extended it to handle attributes of entities efficiently [49]. Jenatton et al. [50] then proposed a bilinear structured latent factor model (LFM), which extends RESCAL by decomposing Rk = Pdi=1 αki uiv > i. By introducing threeway Tucker tensor decomposition, TuckER [51] learns to embed by outputting a core tensor and embedding vectors of entities and relations. LowFER [52] proposes a multimodal factorized bilinear pooling mechanism to better fuse entities and relations. It generalizes the TuckER model and is computationally efficient with low-rank approximation.

> 분해 방법은 KRL 모델을 3 원 텐서 X 분해로 공식화했습니다. 텐서 분해의 일반적인 원리는 Xhrt ≈ h> Mrt로 표시 될 수 있으며 구성 함수는 의미 일치 패턴을 따릅니다. Nickel et al. [48] ​​지식 그래프 텐서의 각 관계형 슬라이스에 대해 3 방향 Rank-r 분해 RESCAL을 제안했습니다. m 관계의 k 번째 관계의 경우 X의 k 번째 슬라이스는 다음과 같이 분해됩니다.
>
> 저자는 엔티티의 속성을 효율적으로 처리하기 위해 이를 더욱 확장했습니다 [49]. Jenatton et al. [50] 그런 다음 Rk = Pdi = 1 αki uiv> i를 분해하여 RESCAL을 확장하는 이중 선형 구조화 된 잠재 인자 모델 (LFM)을 제안했습니다. 3 방향 Tucker 텐서 분해를 도입함으로써 TuckER [51]는 코어 텐서를 출력하고 엔티티 및 관계의 벡터를 임베딩하여 임베딩하는 방법을 배웁니다. LowFER [52]는 엔티티와 관계를 더 잘 융합하기 위해 다중 모드 인수 분해 이중 선형 풀링 메커니즘을 제안합니다. TuckER 모델을 일반화하고 낮은 순위 근사를 통해 계산적으로 효율적입니다.

**3) Neural Networks:**

Neural networks for encoding semantic matching have yielded remarkable predictive performance in recent studies. Encoding models with linear/bilinear blocks can also be modeled using neural networks, for example, SME [39]. Representative neural models include multi-layer perceptron (MLP) [3], neural tensor network (NTN) [17], and neural association model (NAM) [53]. They generally take entities or relations or both of them into deep neural networks and compute a semantic matching score. MLP [3] (Fig. 6a) encodes entities and relations together into a fully-connected layer, and uses a second layer with sigmoid activation for scoring a triple as.

where W ∈ Rn×3d is the weight matrix and [h, r, t] is a concatenation of three vectors. NTN [17] takes entity embeddings as input associated with a relational tensor and outputs predictive score in as.

where br ∈ Rk is bias for relation r, Mr,1 and Mr,2 are relation-specific weight matrices. It can be regarded as a combination of MLPs and bilinear models. NAM [53] associates the hidden encoding with the embedding of tail entity, and proposes the relational-modulated neural network (RMNN).

> 시맨틱 매칭 인코딩을 위한 신경망은 최근 연구에서 놀라운 예측 성능을 제공했습니다. 선형 / 쌍 선형 블록이있는 인코딩 모델은 예를 들어 SME [39]와 같은 신경망을 사용하여 모델링 할 수도 있습니다. 대표적인 신경 모델에는 다층 퍼셉트론 (MLP) [3], 신경 텐서 네트워크 (NTN) [17], 신경 연관 모델 (NAM) [53]이 있습니다. 일반적으로 엔터티나 관계 또는 둘 모두를 심층 신경망으로 가져와 의미 일치 점수를 계산합니다. MLP [3] (그림 6a)는 엔티티와 관계를 완전히 연결된 계층으로 인코딩하고, 삼중 점수를 매기기 위해 시그모이드 활성화가 있는 두 번째 계층을 사용합니다.
>
> 여기서 W ∈ Rn × 3d는 가중치 행렬이고 [h, r, t]는 세 벡터의 연결입니다. NTN [17]은 엔티티 임베딩을 관계형 텐서와 관련된 입력으로 취하고 as에 예측 점수를 출력합니다.
>
> 여기서 br ∈ Rk는 관계 r에 대한 편향이고, Mr, 1 및 Mr, 2는 관계별 가중치 행렬입니다. MLP와 쌍 선형 모델의 조합으로 볼 수 있습니다. NAM [53]은 숨겨진 인코딩을 꼬리 엔티티의 임베딩과 연관시키고 RMNN (Relational-modulated Neural Network)을 제안합니다.

**4) Convolutional Neural Networks:**

CNNs are utilized for learning deep expressive features. ConvE [54] uses 2D convolution over embeddings and multiple layers of nonlinear features to model the interactions between entities and relations by reshaping head entity and relation into 2D matrix, i.e., Mh ∈ Rdw×dh and Mr ∈ Rdw×dh for d = dw × dh. Its scoring function is defined as.

where ω is the convolutional filters and vec is the vectorization operation reshaping a tensor into a vector. ConvE can express semantic information by non-linear feature learning through multiple layers. ConvKB [42] adopts CNNs for encoding the concatenation of entities and relations without reshaping (Fig. 6b). Its scoring function is defined as.

The concatenation of a set for feature maps generated by convolution increases the learning ability of latent features. Compared with ConvE, which captures the local relationships, ConvKB keeps the transitional characteristic and shows better experimental performance. HypER [55] utilizes hypernetwork H for 1D relation-specific convolutional filter generation to achieve multi-task knowledge sharing, and meanwhile simplifies 2D ConvE. It can also be interpreted as a tensor factorization model when taking hypernetwork and weight matrix as tensors.

> CNN은 깊은 표현 기능을 학습하는 데 사용됩니다. ConvE [54]는 임베딩과 비선형 특징의 다중 레이어에 대한 2D 컨볼 루션을 사용하여 헤드 엔티티와 관계를 2D 매트릭스로 재구성함으로써 엔티티와 관계 간의 상호 작용을 모델링합니다. 즉, d = dw에 대해 Mh ∈ Rdw × dh 및 Mr ∈ Rdw × dh × dh. 스코어링 기능은 다음과 같이 정의됩니다.
>
> 여기서 ω는 컨벌루션 필터이고 vec는 텐서를 벡터로 재구성하는 벡터화 연산입니다. ConvE는 다중 계층을 통한 비선형 특징 학습으로 의미 정보를 표현할 수 있습니다. ConvKB [42]는 재 형성없이 엔티티와 관계의 연결을 인코딩하기 위해 CNN을 채택합니다 (그림 6b). 스코어링 기능은 다음과 같이 정의됩니다.
>
> 컨볼루션에 의해 생성 된 기능 맵에 대한 집합을 연결하면 잠재 기능의 학습 능력이 향상됩니다. 로컬 관계를 캡처하는 ConvE와 비교하여 ConvKB는 전환 특성을 유지하고 더 나은 실험 성능을 보여줍니다. HypER [55]는 1D 관계 별 컨볼 루션 필터 생성을 위해 하이퍼 네트워크 H를 사용하여 다중 작업 지식 공유를 달성하고 2D ConvE를 단순화합니다. 하이퍼 네트워크와 가중치 행렬을 텐서로 사용할 때 텐서 분해 모델로 해석 될 수도 있습니다.

**5) Recurrent Neural Networks:**

The MLP- and CNN-based models, as mentioned above, learn triple-level representation. In comparison, the recurrent networks can capture longterm relational dependency in knowledge graphs. Gardner et al. [56] and Neelakantan et al. [57] propose RNN-based model over the relation path to learn vector representation without and with entity information, respectively. RSN [44] (Fig. 6d) designs a recurrent skip mechanism to enhance semantic representation learning by distinguishing relations and entities. The relational path as (x1, x2, . . . , xT ) with entities and relations in an alternating order is generated by random walk, and it is further used to calculate recurrent hidden state ht = tanh (Whht−1 + Wxxt + b). The skipping operation is conducted as.

where S1 and S2 are weight matrices.

> 위에서 언급했듯이 MLP 및 CNN 기반 모델은 트리플 레벨 표현을 학습합니다. 이에 비해 순환 네트워크는 지식 그래프에서 장기적인 관계 종속성을 포착 할 수 있습니다. Gardner et al. 및 Neelakantan et al. 각각 엔티티 정보없이 벡터 표현을 학습하기 위해 관계 경로에 대한 RNN 기반 모델을 제안한다. RSN [44] (그림 6d)은 관계와 개체를 구별하여 의미 론적 표현 학습을 향상시키기 위해 반복적 인 스킵 메커니즘을 설계합니다. 교대 순서의 엔티티 및 관계가있는 (x1, x2,..., xT)와 같은 관계형 경로는 임의 걷기에 의해 생성되며, 반복되는 은닉 상태 ht = tanh (Whht−1 + Wxxt + b ). 건너 뛰기 작업은 다음과 같이 수행됩니다.
>
> 여기서 S1과 S2는 가중치 행렬입니다.

**6) Transformers:**

Transformer-based models have boosted contextualized text representation learning. To utilize contextual information in knowledge graphs, CoKE [45] employs transformers to encode edges and path sequences. Similarly, KG-BERT [58] borrows the idea form language model pretraining and takes Bidirectional Encoder Representations from Transformer (BERT) model as an encoder for entities and relations.

> 변환기 기반 모델은 상황에 맞는 텍스트 표현 학습을 강화했습니다. 지식 그래프에서 상황 정보를 활용하기 위해 CoKE [45]는 변환기를 사용하여 에지와 경로 시퀀스를 인코딩합니다. 유사하게, KG-BERT [58]는 언어 모델 사전 훈련의 아이디어 형식을 차용하고 엔티티 및 관계에 대한 인코더로 Transformer (BERT) 모델에서 양방향 인코더 표현을 사용합니다.

**7) Graph Neural Networks:**

GNNs are introduced for learning connectivity structure under an encoder-decoder framework. R-GCN [59] proposes relation-specific transformation to model the directed nature of knowledge graphs. Its forward propagation is defined as.

where x(l)i ∈ Rd(l) is the hidden state of the i-th entity in l-th layer, Nri is a neighbor set of i-th entity within relation r ∈ R, W(l)r and W(l)0 are the learnable parameter matrices, and ci,r is normalization such as ci,r = \| Nri \|. Here, the GCN [60] acts as a graph encoder. To enable specific tasks, an encoder model still needs to be developed and integrated into the RGCN framework. R-GCN takes the neighborhood of each entity equally. SACN [43] introduces weighted GCN (Fig. 6c), which defines the strength of two adjacent nodes with the same relation type, to capture the structural information in knowledge graphs by utilizing node structure, node attributes, and relation types. The decoder module called Conv-TransE adopts ConvE model as semantic matching metric and preserves the translational property. By aligning the convolutional outputs of entity and relation embeddings with C kernels to be M(h, r) ∈ RC×d, its scoring function is defined as.

Nathani et al. [61] introduced graph attention networks with multi-head attention as encoder to capture multi-hop neighborhood features by inputing the concatenation of entity and relation embeddings. CompGCN [62] proposes entity-relation composition operations over each edge in the neighborhood of a central node and generalizes previous GCN-based models.

> 인코더-디코더 프레임 워크에서 연결 구조를 학습하기 위해 GNN이 도입되었습니다. R-GCN [59]은 지식 그래프의 방향성을 모델링하기 위해 관계 별 변환을 제안합니다. 순방향 전파는 다음과 같이 정의됩니다.
>
> 여기서 x (l) i ∈ Rd (l)는 l 번째 레이어에 있는 i 번째 엔티티의 은닉 상태이고, Nri는 관계 r ∈ R, W (l) r 및 W 내의 i 번째 엔티티의 인접 세트입니다. (l) 0은 학습 가능한 매개 변수 행렬이고 ci, r은 ci, r = \| Nri \|와 같은 정규화입니다. 여기서 GCN [60]은 그래프 인코더 역할을합니다. 특정 작업을 활성화하려면 인코더 모델을 개발하고 RGCN 프레임 워크에 통합해야합니다. R-GCN은 각 엔티티의 이웃을 동등하게 취합니다. SACN [43]은 노드 구조, 노드 속성 및 관계 유형을 활용하여 지식 그래프에서 구조 정보를 캡처하기 위해 동일한 관계 유형을 가진 두 인접 노드의 강도를 정의하는 가중치 GCN (그림 6c)을 도입했습니다. Conv-TransE 라고 하는 디코더 모듈은 ConvE 모델을 의미 일치 메트릭으로 채택하고 변환 속성을 보존합니다. 엔티티 및 관계 임베딩의 컨벌루션 출력을 C 커널과 M (h, r) ∈ RC × d 가 되도록 정렬함으로써 스코어링 함수는 다음과 같이 정의됩니다.
>
> Nathani et al. [61]은 엔터티와 관계 임베딩의 연결을 입력하여 다중 홉 이웃 특징을 캡처하기 위해 인코더로 다중 머리주의를 갖는 그래프주의 네트워크를 도입했습니다. CompGCN [62]은 중앙 노드 주변의 각 에지에 대한 엔티티-관계 구성 작업을 제안하고 이전 GCN 기반 모델을 일반화합니다.

#### D. Embedding with Auxiliary Information

Multi-modal embedding incorporates external information such as text descriptions, type constraints, relational paths, and visual information, with a knowledge graph itself to facilitate more effective knowledge representation.

> 다중 모드 임베딩은 텍스트 설명, 유형 제약, 관계형 경로 및 시각적 정보와 같은 외부 정보를 지식 그래프 자체와 통합하여보다 효과적인 지식 표현을 용이하게합니다.

**1) Textual Description:**

Entities in knowledge graphs have textual descriptions denoted as D =< w1, w2, . . . , wn >, providing supplementary semantic information. The challenge of KRL with textual description is to embed both structured knowledge and unstructured textual information in the same space. Wang et al. [63] proposed two alignment models for aligning entity space and word space by introducing entity names and Wikipedia anchors. DKRL [64] extends TransE [15] to learn representation directly from entity descriptions by a convolutional encoder. SSP [65] captures the strong correlations between triples and textual descriptions by projecting them in a semantic subspace. The joint loss function is widely applied when incorporating KGE with textual description. Wang et al. [63] used a three-component loss L = LK + LT + LA of knowledge model LK, text model LT and alignment model LA. SSP [65] uses a two-component objective function L = Lembed + µLtopic of embedding-specific loss Lembed and topic-specific loss Ltopic within textual description, traded off by a parameter µ.

> 지식 그래프의 엔티티에는 D = <w1, w2,으로 표시된 텍스트 설명이 있습니다. . . , wn>, 추가 의미 정보를 제공합니다. 텍스트 설명이있는 KRL의 과제는 동일한 공간에 구조화 된 지식과 구조화되지 않은 텍스트 정보를 모두 포함하는 것입니다. Wang et al. [63]은 엔티티 이름과 Wikipedia 앵커를 도입하여 엔티티 공간과 단어 공간을 정렬하기위한 두 가지 정렬 모델을 제안했습니다. DKRL [64]는 TransE [15]를 확장하여 컨벌루션 인코더에 의한 엔티티 설명에서 직접 표현을 학습합니다. SSP [65]는 트리플과 텍스트 설명 사이의 강한 상관 관계를 의미 적 부분 공간에 투영함으로써 포착합니다. 관절 손실 기능은 KGE와 텍스트 설명을 통합 할 때 널리 적용됩니다. Wang et al. [63]은 지식 모델 LK, 텍스트 모델 LT 및 정렬 모델 LA의 3 성분 손실 L = LK + LT + LA를 사용했습니다. SSP [65]는 두 가지 요소로 구성된 목적 함수 L = Lembed + µLtopic of embedding-specific loss Lembed 및 topic-specific loss Ltopic을 텍스트 설명 내에서 매개 변수 µ에 의해 상쇄됩니다.

**2) Type Information:**

Entities are represented with hierarchical classes or types, and consequently, relations with semantic types. SSE [66] incorporates semantic categories of entities to embed entities belonging to the same category smoothly in semantic space. TKRL [67] proposes type encoder model for projection matrix of entities to capture type hierarchy. Noticing that some relations indicate attributes of entities, KREAR [68] categorizes relation types into attributes and relations and modeled the correlations between entity descriptions. Zhang et al. [69] extended existing embedding methods with hierarchical relation structure of relation clusters, relations, and sub-relations.

> 엔티티는 계층 적 클래스 또는 유형으로 표현되며 결과적으로 의미 유형과의 관계로 표시됩니다. SSE [66]는 동일한 범주에 속하는 엔티티를 의미 공간에 매끄럽게 삽입하기 위해 엔티티의 의미 범주를 통합합니다. TKRL [67]은 유형 계층을 캡처하기 위해 엔티티의 투영 행렬에 대한 유형 인코더 모델을 제안합니다. KREAR [68]는 일부 관계가 개체의 속성을 나타내는 것을 인식하고 관계 유형을 속성과 관계로 분류하고 개체 설명 간의 상관 관계를 모델링했습니다. Zhang et al. 관계 클러스터, 관계 및 하위 관계의 계층 적 관계 구조로 기존의 삽입 방법을 확장했습니다.

**3) Visual Information:**

Visual information (e.g., entity images) can be utilized to enrich KRL. Image-embodied IKRL [70], containing cross-modal structure-based and imagebased representation, encodes images to entity space and follows the translation principle. The cross-modal representations make sure that structure-based and image-based representations are in the same representation space.

There remain many kinds of auxiliary information for KRL, such as attributes, relation paths, and logical rules. Wang et al. [5] gave a detailed review of these different kinds of information. This paper discusses relation path and logical rules under the umbrella of KGC in Sec. IV-A2 and IV-A4, respectively.

> 시각적 정보 (예 : 엔티티 이미지)를 활용하여 KRL을 강화할 수 있습니다. 교차 모달 구조 기반 및 이미지 기반 표현을 포함하는 이미지 구현 IKRL [70]은 이미지를 엔티티 공간으로 인코딩하고 변환 원칙을 따릅니다. 교차 모달 표현은 구조 기반 및 이미지 기반 표현이 동일한 표현 공간에 있는지 확인합니다.
>
> 속성, 관계 경로 및 논리 규칙과 같은 KRL에 대한 많은 종류의 보조 정보가 남아 있습니다. Wang et al. [5]는 이러한 다양한 종류의 정보에 대해 자세히 검토했습니다. 이 논문은 Sec.에서 KGC의 산하에있는 관계 경로와 논리 규칙을 논의합니다. IV-A2 및 IV-A4.

#### E. Summary

Knowledge representation learning is vital in the research community of knowledge graph. This section reviews four folds of KRL with several modern methods summarized in Table II and more in Appendix B. Overall, developing a novel KRL model is to answer the following four questions: 1) which representation space to choose; 2) how to measure the plausibility of triples in specific space; 3) what encoding model to modeling relational interaction; 4) whether to utilize auxiliary information.

The most popularly used representation space is Euclidean point-based space by embedding entities in vector space and modeling interactions via vector, matrix, or tensor. Other representation spaces, including complex vector space, Gaussian distribution, and manifold space and group, are also studied. Manifold space has an advantage over point-wise Euclidean space by relaxing the point-wise embedding. Gaussian embeddings can express the uncertainties of entities and relations, and multiple relation semantics. Embedding in complex vector space can effectively model different relational connectivity patterns, especially the symmetry/antisymmetry pattern. The representation space plays an essential role in encoding the semantic information of entities and capturing the relational properties. When developing a representation learning model, appropriate representation space should be selected and designed carefully to match the nature of encoding methods and balance the expressiveness and computational complexity. The scoring function with a distance-based metric utilizes the translation principle, while the semantic matching scoring function employs compositional operators. Encoding models, especially neural networks, play a critical role in modeling interactions of entities and relations. The bilinear models also have drawn much attention, and some tensor factorization can also be regarded as this family. Other methods incorporate auxiliary information of textual description, relation/entity types, and entity images.

> 지식 표현 학습은 지식 그래프 연구 커뮤니티에서 매우 중요합니다. 이 섹션에서는 표 II와 부록 B에 요약 된 몇 가지 현대적인 방법으로 KRL의 네 가지 방법을 검토합니다. 전반적으로 새로운 KRL 모델을 개발하는 것은 다음 네 가지 질문에 답하는 것입니다. 1) 선택할 표현 공간; 2) 특정 공간에서 트리플의 타당성을 측정하는 방법; 3) 관계형 상호 작용을 모델링 하기 위한 인코딩 모델; 4) 보조 정보 활용 여부.
>
> 가장 널리 사용되는 표현 공간은 벡터 공간에 엔티티를 포함하고 벡터, 행렬 또는 텐서를 통해 상호 작용을 모델링하는 유클리드 포인트 기반 공간입니다. 복잡한 벡터 공간, 가우스 분포, 다양한 공간 및 그룹을 포함한 다른 표현 공간도 연구됩니다. 매니 폴드 공간은 점별 임베딩을 완화하여 점별 유클리드 공간보다 유리합니다. 가우스 임베딩은 엔티티 및 관계의 불확실성과 다중 관계 의미를 표현할 수 있습니다. 복잡한 벡터 공간에 임베딩하면 다양한 관계형 연결 패턴, 특히 대칭 / 반대 칭 패턴을 효과적으로 모델링 할 수 있습니다. 표현 공간은 엔티티의 의미 정보를 인코딩하고 관계형 속성을 캡처하는 데 필수적인 역할을합니다. 표현 학습 모델을 개발할 때 적절한 표현 공간을 선택하고 인코딩 방법의 특성에 맞게 신중하게 설계하고 표현 성과 계산 복잡성의 균형을 맞춰야합니다. 거리 기반 메트릭을 사용하는 스코어링 기능은 번역 원칙을 사용하는 반면 의미 론적 일치 스코어링 기능은 구성 연산자를 사용합니다. 인코딩 모델, 특히 신경망은 엔터티와 관계의 상호 작용을 모델링하는 데 중요한 역할을합니다. 쌍 선형 모델도 많은 관심을 끌었으며 일부 텐서 분해도 이 패밀리로 간주 될 수 있습니다. 다른 방법은 텍스트 설명, 관계 / 엔티티 유형 및 엔터티 이미지의 보조 정보를 통합합니다.


### IV. KNOWLEDGE ACQUISITION

Knowledge acquisition aims to construct knowledge graphs from unstructured text and other structured or semi-structured sources, complete an existing knowledge graph, and discover and recognize entities and relations. Well-constructed and largescale knowledge graphs can be useful for many downstream applications and empower knowledge-aware models with commonsense reasoning, thereby paving the way for AI. The main tasks of knowledge acquisition include relation extraction, KGC, and other entity-oriented acquisition tasks such as entity recognition and entity alignment. Most methods formulate KGC and relation extraction separately. These two tasks, however, can also be integrated into a unified framework. Han et al. [71] proposed a joint learning framework with mutual attention for data fusion between knowledge graphs and text, which solves KGC and relation extraction from text. There are also other tasks related to knowledge acquisition, such as triple classification [72], relation classification [73], and open knowledge enrichment [74]. In this section, three-fold knowledge acquisition techniques on KGC, entity discovery, and relation extraction are reviewed thoroughly.

> 지식 습득은 구조화 되지 않은 텍스트 및 기타 구조적 또는 반 구조화 된 소스에서 지식 그래프를 구성하고, 기존 지식 그래프를 완성하고, 엔티티와 관계를 발견하고 인식하는 것을 목표로 합니다. 잘 구성된 대규모 지식 그래프는 많은 다운 스트림 애플리케이션에 유용 할 수 있으며 상식적인 추론으로 지식 인식 모델을 강화하여 AI를 위한 길을 닦습니다. 지식 습득의 주요 작업에는 관계 추출, KGC 및 개체 인식 및 개체 정렬과 같은 기타 개체 지향 습득 작업이 포함됩니다. 대부분의 방법은 KGC와 관계 추출을 별도로 공식화합니다. 그러나 이 두 작업은 통합 프레임 워크로 통합 될 수도 있습니다. Han et al. [71]은 KGC와 텍스트에서 관계 추출을 해결하는 지식 그래프와 텍스트 간의 데이터 융합을 위해 상호주의를 기울이는 공동 학습 프레임 워크를 제안했습니다. 삼중 분류 [72], 관계 분류 [73], 개방 지식 강화 [74]와 같은 지식 습득과 관련된 다른 작업도 있습니다. 이 섹션에서는 KGC, 개체 발견 및 관계 추출에 대한 3 중 지식 습득 기술을 철저히 검토합니다.

#### A. Knowledge Graph Completion

Because of the nature of incompleteness of knowledge graphs, KGC is developed to add new triples to a knowledge graph. Typical subtasks include link prediction, entity prediction, and relation prediction.

Preliminary research on KGC focused on learning lowdimensional embedding for triple prediction. In this survey, we term those methods as embedding-based methods. Most of them, however, failed to capture multi-step relationships. Thus, recent work turns to explore multi-step relation paths and incorporate logical rules, termed as relation path inference and rule-based reasoning, respectively. Triple classification as an associated task of KGC, which evaluates the correctness of a factual triple, is additionally reviewed in this section.

> 지식 그래프의 불완전 성으로 인해 KGC는 지식 그래프에 새로운 트리플을 추가하기 위해 개발되었습니다. 일반적인 하위 작업에는 링크 예측, 엔터티 예측 및 관계 예측이 포함됩니다.
>
> KGC에 대한 예비 연구는 트리플 예측을 위한 저 차원 임베딩 학습에 중점을 두었습니다. 이 설문 조사에서는 이러한 방법을 임베딩 기반 방법이라고 합니다. 그러나 그들 대부분은 다단계 관계를 포착하지 못했습니다. 따라서 최근 연구는 다단계 관계 경로를 탐색하고 각각 관계 경로 추론 및 규칙 기반 추론이라고하는 논리적 규칙을 통합합니다. 이 섹션에서는 사실 트리플의 정확성을 평가하는 KGC의 관련 작업 인 트리플 분류에 대해 추가로 검토합니다.

**1) Embedding-based Models:**

Taking entity prediction as an example, embedding-based ranking methods, as shown in Fig. 7a, firstly learn embedding vectors based on existing triples. By replacing the tail entity or head entity with each entity e ∈ E, those methods calculate scores of all the candidate entities and rank the top k entities. Aforementioned KRL methods (e.g., TransE [15], TransH [19], TransR [16], HolE [20], and RGCN [59]) and joint learning methods like DKRL [64] with textual information can been used for KGC.

Unlike representing inputs and candidates in the unified embedding space, ProjE [75] proposes a combined embedding by space projection of the known parts of input triples, i.e., (h, r, ?) or (?, r, t), and the candidate entities with the candidate-entity matrix Wc ∈ Rs×d, where s is the number of candidate entities. The embedding projection function including a neural combination layer and a output projection layer is defined as h(e, r) = g (Wcσ(e ⊕ r) + bp), where e ⊕ r = Dee + Drr + bc is the combination operator of input entity-relation pair. Previous embedding methods do not differentiate entities and relation prediction, and ProjE does not support relation prediction. Based on these observations, SENN [76] distinguishes three KGC subtasks explicitly by introducing a unified neural shared embedding with adaptively weighted general loss function to learn different latent features. Existing methods rely heavily on existing connections in knowledge graphs and fail to capture the evolution of factual knowledge or entities with a few connections. ConMask [77] proposes relationship-dependent content masking over the entity description to select relevant snippets of given relations, and CNN-based target fusion to complete the knowledge graph with unseen entities. It can only make a prediction when query relations and entities are explicitly expressed in the text description. Previous methods are discriminative models that rely on preprepared entity pairs or text corpus. Focusing on the medical domain, REMEDY [78] proposes a generative model, called conditional relationship variational autoencoder, for entity pair discovery from latent space.

> 엔티티 예측을 예로 들어 그림 7a와 같이 임베딩 기반 순위 지정 방법은 먼저 기존 트리플을 기반으로 임베딩 벡터를 학습합니다. 꼬리 엔터티 또는 헤드 엔터티를 각 엔터티 e ∈ E로 대체함으로써 이러한 방법은 모든 후보 엔터티의 점수를 계산하고 상위 k 엔터티의 순위를 지정합니다. 앞서 언급 한 KRL 방법 (예 : TransE [15], TransH [19], TransR [16], HolE [20], RGCN [59])과 텍스트 정보가있는 DKRL [64]와 같은 공동 학습 방법이 KGC에 사용될 수 있습니다.
>
> 통합 임베딩 공간에서 입력 및 후보를 나타내는 것과 달리 ProjE [75]는 입력 트리플의 알려진 부분, 즉 (h, r,?) 또는 (?, r, t)의 공간 투영에 의한 결합 임베딩을 제안합니다. 후보 엔티티 행렬 Wc ∈ Rsxd를 갖는 후보 엔티티. 여기서 s는 후보 엔티티의 수입니다. 신경 조합 레이어와 출력 투영 레이어를 포함하는 임베딩 투영 함수는 h (e, r) = g (Wcσ (e ⊕ r) + bp)로 정의됩니다. 여기서 e ⊕ r = Dee + Drr + bc는 조합 연산자입니다. 입력 엔티티-관계 쌍의. 이전 임베딩 방법은 엔티티와 관계 예측을 구분하지 않으며 ProjE는 관계 예측을 지원하지 않습니다. 이러한 관찰을 기반으로 SENN [76]은 서로 다른 잠재 특징을 학습하기 위해 적응 적으로 가중 된 일반 손실 함수가있는 통합 신경 공유 임베딩을 도입하여 세 가지 KGC 하위 작업을 명시 적으로 구분합니다. 기존 방법은 지식 그래프의 기존 연결에 크게 의존하며 몇 가지 연결이있는 사실적 지식 또는 엔티티의 진화를 포착하지 못합니다. ConMask [77]는 주어진 관계의 관련 스니펫을 선택하기 위해 엔티티 설명에 대한 관계 종속 콘텐츠 마스킹과 보이지 않는 엔티티로 지식 그래프를 완성하기 위한 CNN 기반 타겟 융합을 제안합니다. 쿼리 관계 및 엔터티가 텍스트 설명에 명시적으로 표현 될 때만 예측할 수 있습니다. 이전 방법은 미리 준비된 엔티티 쌍 또는 텍스트 말뭉치에 의존하는 차별적 모델입니다. 의료 영역에 초점을 맞춘 REMEDY [78]는 잠재 공간에서 엔티티 쌍을 발견하기 위해 조건부 관계 변이 자동 인코더라고 하는 생성 모델을 제안합니다.

**2) Relation Path Reasoning:**

Embedding learning of entities and relations has gained remarkable performance in some benchmarks, but it fails to model complex relation paths. Relation path reasoning turns to leverage path information over the graph structure. Random walk inference has been widely investigated; for example, the Path-Ranking Algorithm (PRA) [79] chooses a relational path under a combination of path constraints and conducts maximum-likelihood classification. To improve path search, Gardner et al. [56] introduced vector space similarity heuristics in random work by incorporating textual content, which also relieves the feature sparsity issue in PRA. Neural multi-hop relational path modeling is also studied. Neelakantan et al. [57] developed an RNN model to compose the implications of relational paths by applying compositionality recursively (in Fig. 7b). Chainof-Reasoning [80], a neural attention mechanism to enable multiple reasons, represents logical composition across all relations, entities, and text. Recently, DIVA [81] proposes a unified variational inference framework that takes multi-hop reasoning as two sub-steps of path-finding (a prior distribution for underlying path inference) and path-reasoning (a likelihood for link classification).

> 엔터티 및 관계에 대한 학습을 ​​포함하는 것은 일부 벤치 마크에서 놀라운 성능을 얻었지만 복잡한 관계 경로를 모델링하지 못했습니다. 관계 경로 추론은 그래프 구조에 대한 경로 정보를 활용합니다. 랜덤 워크 추론은 광범위하게 조사되었습니다. 예를 들어, PRA (Path-Ranking Algorithm) [79]는 경로 제약 조건의 조합에서 관계형 경로를 선택하고 최대 가능성 분류를 수행합니다. 경로 검색을 개선하기 위해 Gardner et al. [56]은 텍스트 콘텐츠를 통합하여 무작위 작업에 벡터 공간 유사성 휴리스틱을 도입했으며, 이는 또한 PRA의 기능 희소성 문제를 완화합니다. 신경 다중 홉 관계형 경로 모델링도 연구됩니다. Neelakantan et al. [57]은 구성 성을 재귀 적으로 적용하여 관계 경로의 의미를 구성하는 RNN 모델을 개발했습니다 (그림 7b). 여러 이유를 가능하게 하는 신경주의 메커니즘 인 Chainof-Reasoning [80]은 모든 관계, 개체 및 텍스트에 대한 논리적 구성을 나타냅니다. 최근 DIVA [81]는 다중 홉 추론을 경로 찾기 (기본 경로 추론을위한 사전 분포)와 경로 추론 (링크 분류 가능성)의 두 하위 단계로 취하는 통합 변형 추론 프레임 워크를 제안합니다.

**3) RL-based Path Finding:**

Deep reinforcement learning (RL) is introduced for multi-hop reasoning by formulating path-finding between entity pairs as sequential decision making, specifically a Markov decision process (MDP). The policybased RL agent learns to find a step of relation to extending the reasoning paths via the interaction between the knowledge graph environment, where the policy gradient is utilized for training RL agents.

DeepPath [82] firstly applies RL into relational path learning and develops a novel reward function to improve accuracy, path diversity, and path efficiency. It encodes states in the continuous space via a translational embedding method and takes the relation space as its action space. Similarly, MINERVA [83] takes path walking to the correct answer entity as a sequential optimization problem by maximizing the expected reward. It excludes the target answer entity and provides more capable inference. Instead of using a binary reward function, MultiHop [84] proposes a soft reward mechanism. Action dropout is also adopted to mask some outgoing edges during training to enable more effective path exploration. M-Walk [85] applies an RNN controller to capture the historical trajectory and uses the Monte Carlo Tree Search (MCTS) for effective path generation. By leveraging text corpus with the sentence bag of current entity denoted as bet , CPL [86] proposes collaborative policy learning for pathfinding and fact extraction from text.

With source, query and current entity denoted as es, eq and et, and query relation denoted as rq, the MDP environment and policy networks of these methods are summarized in Table III, where MINERVA, M-Walk and CPL use binary reward. For the policy networks, DeepPath uses fully-connected network, the extractor of CPL employs CNN, while the rest uses recurrent networks.

> RL (딥 강화 학습)은 엔티티 쌍 간의 경로 찾기를 순차적 의사 결정, 특히 Markov 의사 결정 프로세스 (MDP)로 공식화하여 다중 홉 추론에 도입되었습니다. 정책 기반 RL 에이전트는 지식 그래프 환경 간의 상호 작용을 통해 추론 경로를 확장하는 것과 관련된 단계를 찾는 방법을 배웁니다. 여기서 정책 그라데이션은 RL 에이전트 교육에 활용됩니다.
>
> DeepPath [82]는 먼저 RL을 관계형 경로 학습에 적용하고 정확도, 경로 다양성 및 경로 효율성을 향상시키기 위해 새로운 보상 함수를 개발합니다. 변환 임베딩 방법을 통해 연속 공간의 상태를 인코딩하고 관계 공간을 작업 공간으로 사용합니다. 마찬가지로 MINERVA [83]는 예상되는 보상을 최대화하여 순차적 최적화 문제로 정답 엔티티로가는 길을 택합니다. 대상 응답 엔터티를 제외하고 더 유능한 추론을 제공합니다. 바이너리 보상 함수를 사용하는 대신 MultiHop [84]는 소프트 보상 메커니즘을 제안합니다. 또한 훈련 중 일부 나가는 가장자리를 마스킹하기 위해 액션 드롭 아웃을 채택하여보다 효과적인 경로 탐색이 가능합니다. M-Walk [85]는 RNN 컨트롤러를 적용하여 역사적인 궤적을 캡처하고 효과적인 경로 생성을 위해 Monte Carlo Tree Search (MCTS)를 사용합니다. bet로 표시된 현재 엔티티의 문장 가방과 함께 텍스트 코퍼스를 활용하여 CPL [86]은 텍스트에서 경로 찾기 및 사실 추출을 위한 협업 정책 학습을 제안합니다.
>
> es, eq 및 et로 표시된 소스, 쿼리 및 현재 엔티티와 rq로 표시된 쿼리 관계를 사용하여 이러한 방법의 MDP 환경 및 정책 네트워크는 MINERVA, M-Walk 및 CPL이 바이너리 보상을 사용하는 표 III에 요약되어 있습니다. 정책 네트워크의 경우 DeepPath는 완전히 연결된 네트워크를 사용하고 CPL 추출기는 CNN을 사용하고 나머지는 반복 네트워크를 사용합니다.

**4) Rule-based Reasoning:**

To better make use of the symbolic nature of knowledge, another research direction of KGC is logical rule learning. A rule is defined by the head and body in the form of head ← body. The head is an atom, i.e., a fact with variable subjects and/or objects, while the body can be a set of atoms. For example, given relations sonOf, hasChild and gender, and entities X and Y , there is a rule in the reverse form of logic programming as: (Y, sonOf, X) ← (X, hasChild, Y) ∧ (Y, gender, Male) Logical rules can been extracted by rule mining tools like AMIE [87]. The recent RLvLR [88] proposes a scalable rule mining approach with efficient rule searching and pruning, and uses the extracted rules for link prediction.

More research attention focuses on injecting logical rules into embeddings to improve reasoning, with joint learning or iterative training applied to incorporate first-order logic rules. For example, KALE [89] proposes a unified joint model with t-norm fuzzy logical connectives defined for compatible triples and logical rules embedding. Specifically, three compositions of logical conjunction, disjunction, and negation are defined to compose the truth value of a complex formula. Fig. 8a illustrates a simple first-order Horn clause inference. RUGE [90] proposes an iterative model, where soft rules are utilized for soft label prediction from unlabeled triples and labeled triples for embedding rectification. IterE [91] proposes an iterative training strategy with three components of embedding learning, axiom induction, and axiom injection.

The combination of neural and symbolic models has also attracted increasing attention to do rule-based reasoning in an end-to-end manner. Neural Theorem Provers (NTP) [92] learns logical rules for multi-hop reasoning, which utilizes a radial basis function kernel for differentiable computation on vector space. NeuralLP [93] enables gradient-based optimization to be applicable in the inductive logic programming, where a neural controller system is proposed by integrating attention mechanism and auxiliary memory. Neural-Num-LP [94] extends NeuralLP to learn numerical rules with dynamic programming and cumulative sum operations. pLogicNet [95] proposes probabilistic logic neural networks (Fig. 8b) to leverage first-order logic and learn effective embedding by combining the advantages of Markov logic networks and KRL methods while handling the uncertainty of logic rules. ExpressGNN [96] generalizes pLogicNet by tuning graph networks and embedding and achieves more efficient logical reasoning.

> 지식의 상징적 특성을 더 잘 활용하기 위해 KGC의 또 다른 연구 방향은 논리적 규칙 학습입니다. 규칙은 머리 ← 몸의 형태로 머리와 몸으로 정의됩니다. 머리는 원자, 즉 가변 주체 및 / 또는 대상이있는 사실 인 반면 몸은 원자 집합 일 수 있습니다. 예를 들어, 관계가 sonOf, hasChild 및 성별, 엔티티 X 및 Y 인 경우 논리 프로그래밍의 반대 형식에는 다음과 같은 규칙이 있습니다. (Y, sonOf, X) ← (X, hasChild, Y) ∧ (Y, 성별 , Male) 논리 규칙은 AMIE와 같은 규칙 마이닝 도구로 추출 할 수 있습니다 [87]. 최근 RLvLR [88]은 효율적인 규칙 검색 및 정리를 통한 확장 가능한 규칙 마이닝 접근 방식을 제안하고 추출 된 규칙을 링크 예측에 사용합니다.
>
> 더 많은 연구 관심은 논리 규칙을 임베딩에 주입하여 추론을 개선하는 데 초점을 맞추고 있으며 공동 학습 또는 반복 학습을 적용하여 1 차 논리 규칙을 통합합니다. 예를 들어, KALE [89]는 호환 가능한 트리플과 논리 규칙 임베딩을 위해 정의 된 t-norm 퍼지 논리 연결을 가진 통합 조인트 모델을 제안합니다. 구체적으로 복잡한 공식의 진리 값을 구성하기 위해 논리적 결합, 분리, 부정의 세 가지 구성이 정의됩니다. 도 8a는 간단한 1 차 혼 절 추론을 예시한다. RUGE [90]는 반복 모델을 제안합니다. 여기서 소프트 규칙은 레이블이 지정되지 않은 트리플에서 소프트 레이블 예측에 사용되고 임베딩 수정을 위해 레이블이 지정된 트리플에서 사용됩니다. IterE [91]는 임베딩 학습, 공리 유도 및 공리 주입의 세 가지 구성 요소로 반복 훈련 전략을 제안합니다.
>
> 신경 및 상징적 모델의 조합은 또한 종단 간 방식으로 규칙 기반 추론을 수행하는 데 점점 더 많은 관심을 끌었습니다. Neural Theorem Provers (NTP) [92]는 벡터 공간에서 미분 계산을 위해 방사형 기저 함수 커널을 사용하는 다중 홉 추론에 대한 논리 규칙을 학습합니다. NeuralLP [93]는주의 메커니즘과 보조 메모리를 통합하여 신경 제어기 시스템을 제안하는 유도 논리 프로그래밍에 그라디언트 기반 최적화를 적용 할 수 있도록합니다. Neural-Num-LP [94]는 NeuralLP를 확장하여 동적 프로그래밍과 누적 합계 연산으로 수치 규칙을 학습합니다. pLogicNet [95]은 논리 규칙의 불확실성을 처리하면서 Markov 논리 네트워크와 KRL 방법의 장점을 결합하여 1 차 논리를 활용하고 효과적인 임베딩을 학습하기 위해 확률 논리 신경망 (그림 8b)을 제안합니다. ExpressGNN [96]은 그래프 네트워크를 조정하고 임베딩하여 pLogicNet을 일반화하고 보다 효율적인 논리적 추론을 달성합니다.

**5) Meta Relational Learning:**

The long-tail phenomena exist in the relations of knowledge graphs. Meanwhile, the real-world scenario of knowledge is dynamic, where unseen triples are usually acquired. The new scenario, called as meta relational learning or few-shot relational learning, requires models to predict new relational facts with only a very few samples.

Targeting at the previous two observations, GMatching [97] develops a metric based few-shot learning method with entity embeddings and local graph structures. It encodes one-hop neighbors to capture the structural information with R-GCN and then takes the structural entity embedding for multistep matching guided by long short-term memory (LSTM) networks to calculate the similarity scores. Meta-KGR [98], an optimization-based meta-learning approach, adopts model agnostic meta-learning for fast adaption and reinforcement learning for entity searching and path reasoning. Inspired by model-based and optimization-based meta-learning, MetaR [99] transfers relation-specific meta information from support set to query set, and archives fast adaption via loss gradient of highorder relational representation. Zhang et al. [100] proposed joint modules of heterogeneous graph encoder, recurrent autoencoder, and matching network to complete new relational facts with few-shot references. Qin et al. [101] utilized GAN to generate reasonable embeddings for unseen relations under the zero-shot learning setting.

> 롱테일 현상은 지식 그래프의 관계에 존재합니다. 한편, 실제 지식 시나리오는 일반적으로 보이지 않는 트리플이 획득되는 동적입니다. 메타 관계형 학습 또는 소수 관계형 학습이라고하는 새로운 시나리오에서는 매우 적은 샘플만으로 새로운 관계형 사실을 예측하는 모델이 필요합니다.
>
> 이전 두 가지 관찰을 대상으로하는 GMatching [97]은 엔티티 임베딩 및 로컬 그래프 구조를 사용하여 메트릭 기반 몇 번의 학습 방법을 개발합니다. R-GCN으로 구조 정보를 캡처하기 위해 1- 홉 이웃을 인코딩 한 다음 LSTM (장단기 기억) 네트워크에 의해 안내되는 다단계 일치를위한 구조 엔티티 임베딩을 사용하여 유사성 점수를 계산합니다. 최적화 기반의 메타 학습 접근법 인 Meta-KGR [98]은 빠른 적응을위한 모델 불가지론 적 메타 학습과 개체 검색 및 경로 추론을위한 강화 학습을 채택합니다. 모델 기반 및 최적화 기반 메타 학습에서 영감을 얻은 MetaR [99]은 지원 세트에서 쿼리 세트로 관계 별 메타 정보를 전송하고 고차 관계 표현의 손실 기울기를 통해 빠른 적응을 보관합니다. Zhang et al. 이기종 그래프 인코더, 반복 자동 인코더 및 매칭 네트워크의 공동 모듈을 제안하여 몇 번의 참조로 새로운 관계형 사실을 완성했습니다. Qin et al. 제로 샷 학습 설정에서 보이지 않는 관계에 대한 합리적인 임베딩을 생성하기 위해 GAN을 사용했습니다.

**6) Triple Classification:**

Triple classification is to determine whether facts are correct in testing data, which is typically regarded as a binary classification problem. The decision rule is based on the scoring function with a specific threshold. Aforementioned embedding methods could be applied for triple classification, including translational distance-based methods like TransH [19] and TransR [16] and semantic matching-based methods such as NTN [17], HolE [20] and ANALOGY [21].

Vanilla vector-based embedding methods failed to deal with 1-to-n relations. Recently, Dong et al. [72] extended the embedding space into region-based n-dimensional balls where the tail region is in the head region for 1-to-n relation using fine-grained type chains, i.e., tree-structure conceptual clusterings. This relaxation of embedding to n-balls turns triple classification into a geometric containment problem and improves the performance for entities with long type chains. However, it relies on the type chains of entities and suffers from the scalability problem.

> 삼중 분류는 일반적으로 이진 분류 문제로 간주되는 테스트 데이터에서 사실이 올바른지 여부를 확인하는 것입니다. 결정 규칙은 특정 임계 값이 있는 스코어링 기능을 기반으로합니다. TransH [19] 및 TransR [16]과 같은 변환 거리 기반 방법과 NTN [17], HolE [20] 및 ANALOGY [21]와 같은 의미 일치 기반 방법을 포함하여 앞서 언급 한 임베딩 방법을 트리플 분류에 적용 할 수 있습니다.
>
> 바닐라 벡터 기반 임베딩 방법은 1 대 n 관계를 처리하지 못했습니다. 최근 Dong et al. [72] 세밀한 유형의 체인, 즉 트리 구조 개념 클러스터링을 사용하여 꼬리 영역이 머리 영역에 있는 영역 기반 n 차원 공으로 임베딩 공간을 확장했습니다. n- 볼에 대한 임베딩의 이완은 트리플 분류를 기하학적 포함 문제로 바꾸고 긴 유형 체인을 가진 엔티티의 성능을 향상시킵니다. 그러나 엔티티의 유형 체인에 의존하며 확장 성 문제가 있습니다.

#### B. Entity Discovery

This section distinguishes entity-based knowledge acquisition into several fractionized tasks, i.e., entity recognition, entity disambiguation, entity typing, and entity alignment. We term them as entity discovery as they all explore entity-related knowledge under different settings.

> 이 섹션에서는 엔터티 기반 지식 습득을 엔터티 인식, 엔터티 명확화, 엔터티 타이핑 및 엔터티 정렬과 같은 여러 분할 작업으로 구분합니다. 우리는 그것들이 모두 다른 환경에서 엔티티 관련 지식을 탐구하기 때문에 엔티티 발견이라고 부릅니다.

**1) Entity Recognition:**

Entity recognition or named entity recognition (NER), when it focuses on specifically named entities, is a task that tags entities in text. Hand-crafted features such as capitalization patterns and language-specific resources like gazetteers are applied in many pieces of literature. Recent work applies sequence-to-sequence neural architectures, for example, LSTM-CNN [102] for learning character-level and word-level features and encoding partial lexicon matches. Lample et al. [103] proposed stacked neural architectures by stacking LSTM layers and CRF layers, i.e., LSTM-CRF (in Fig. 9a) and Stack-LSTM. MGNER [104] proposes an integrated framework with entity position detection in various granularities and attention-based entity classification for both nested and non-overlapping named entities. Hu et al. [105] distinguished multi-token and single-token entities with multitask training. Recently, Li et al. [106] formulated flat and nested NER as a unified machine reading comprehension framework by referring annotation guidelines to construct query questions.

> 엔터티 인식 또는 명명 된 엔터티 인식 (NER)은 특정 엔터티에 중점을 두는 경우 엔터티를 텍스트로 태그하는 작업입니다. 대문자 패턴과 같은 수작업 기능 및 지명 사전과 같은 언어 별 리소스는 많은 문헌에 적용됩니다. 최근 연구는 문자 수준 및 단어 수준 기능을 학습하고 부분 어휘 일치를 인코딩하기 위해 LSTM-CNN [102]과 같은 시퀀스 대 시퀀스 신경 아키텍처를 적용합니다. Lample et al. LSTM 계층과 CRF 계층, 즉 LSTM-CRF (그림 9a)와 Stack-LSTM을 적층하여 제안 된 적층 신경 아키텍처. MGNER [104]는 중첩 및 중첩되지 않는 명명 된 엔티티 모두에 대해 다양한 세분화 및주의 기반 엔티티 분류에서 엔티티 위치 감지와 통합 프레임 워크를 제안합니다. Hu et al. 멀티 태스킹 훈련을 통해 구별되는 다중 토큰 및 단일 토큰 엔티티. 최근 Li et al. 질의 질문을 구성하기 위해 주석 지침을 참조하여 통합 된 기계 읽기 이해 프레임 워크로 플랫 및 중첩 NER를 공식화했습니다.

**2) Entity Typing:**

Entity typing includes coarse and finegrained types, while the latter uses a tree-structured type category and is typically regarded as multi-class and multi-label classification. To reduce label noise, PLE [107] focuses on correct type identification and proposes a partial-label embedding model with a heterogeneous graph for the representation of entity mentions, text features, and entity types and their relationships. To tackle the increasing growth of typeset noisy labels, Ma et al. [108] proposed prototype-driven label embedding with hierarchical information for zero-shot finegrained named entity typing.

> 엔터티 유형에는 대략적인 유형과 세분화 된 유형이 포함되는 반면 후자는 트리 구조 유형 범주를 사용하며 일반적으로 다중 클래스 및 다중 레이블 분류로 간주됩니다. 레이블 노이즈를 줄이기 위해 PLE [107]는 올바른 유형 식별에 초점을 맞추고 엔티티 멘션, 텍스트 기능, 엔티티 유형 및 그 관계의 표현을위한 이기종 그래프가있는 부분 레이블 임베딩 모델을 제안합니다. 조판 시끄러운 레이블의 증가하는 성장에 대처하기 위해 Ma et al. 제로 샷 세분화 된 명명 된 엔티티 타이핑을위한 계층 적 정보를 포함하는 프로토 타입 기반 레이블 임베딩을 제안했습니다.

**3) Entity Disambiguation:**

Entity disambiguation or entity linking is a unified task which links entity mentions to the corresponding entities in a knowledge graph. For example, Einstein won the Noble Prize in Physics in 1921. The entity mention of “Einstein” should be linked to the entity of Albert Einstein. The contemporary end-to-end learning approaches have made efforts through representation learning of entities and mentions, for example, DSRM [109] for modeling entity semantic relatedness and EDKate [110] for the joint embedding of entity and text. Ganea and Hofmann [111] proposed an attentive neural model over local context windows for entity embedding learning and differentiable message passing for inferring ambiguous entities. By regarding relations between entities as latent variables, Le and Titov [112] developed an end-to-end neural architecture with relation-wise and mention-wise normalization.

> 엔티티 명확성 또는 엔티티 연결은 엔티티 언급을 지식 그래프의 해당 엔티티에 연결하는 통합 작업입니다. 예를 들어, 아인슈타인은 1921 년 물리학에서 고귀한 상을 수상했습니다. "아인슈타인"이라는 엔티티 언급은 알버트 아인슈타인의 엔티티와 연결되어야합니다. 현대의 end-to-end 학습 접근법은 엔티티와 언급의 표현 학습을 통해 노력했습니다. 예를 들어 엔티티 의미 관련성을 모델링하기 위한 DSRM [109]과 엔티티와 텍스트의 공동 임베딩을 위한 EDKate [110]가 있습니다. Ganea와 Hofmann [111]은 엔티티 임베딩 학습과 모호한 엔티티 추론을위한 차별화 가능한 메시지 전달을 위한 로컬 컨텍스트 창에 대한 세심한 신경 모델을 제안했습니다. 엔티티 간의 관계를 잠재 변수로 간주함으로써 Le와 Titov [112]는 관계 및 멘션 방식의 정규화를 사용하여 종단 간 신경 구조를 개발했습니다.

**4) Entity Alignment:**

The tasks, as mentioned earlier, involve entity discovery from text or a single knowledge graph, while entity alignment (EA) aims to fuse knowledge among various knowledge graphs. Given E1 and E2 as two different entity sets of two different knowledge graphs, EA is to find an alignment set A = {(e1, e2) ∈ E1 × E2\|e1 ≡ e2}, where entity e1 and entity e2 hold an equivalence relation ≡. In practice, a small set of alignment seeds (i.e., synonymous entities appear in different knowledge graphs) is given to start the alignment process, as shown in the left box of Fig. 9b. Embedding-based alignment calculates the similarity between the embeddings of a pair of entities. IPTransE [113] maps entities into a unified representation space under a joint embedding framework (Fig. 9b) through aligned translation as e1 + r(E1→E2) − e2, linear transformation as M(E1→E2)e1 − e2, and parameter sharing as e1 ≡ e2. To solve error accumulation in iterative alignment, BootEA [114] proposes a bootstrapping approach in an incremental training manner, together with an editing technique for checking newlylabeled alignment.

Additional information of entities is also incorporated for refinement, for example, JAPE [115] capturing the correlation between cross-lingual attributes, KDCoE [116] embedding multi-lingual entity descriptions via co-training, MultiKE [117] learning multiple views of the entity name, relation, and attributes, and alignment with character attribute embedding [118].

> 앞서 언급했듯이 작업은 텍스트 또는 단일 지식 그래프에서 엔티티 검색을 포함하는 반면 엔티티 정렬 (EA)은 다양한 지식 그래프 간의 지식을 융합하는 것을 목표로합니다. E1과 E2가 두 개의 서로 다른 지식 그래프의 두 개의 서로 다른 엔티티 세트로 주어지면 EA는 정렬 세트 A = {(e1, e2) ∈ E1 × E2 \| e1 ≡ e2}를 찾는 것입니다. 여기서 엔티티 e1과 엔티티 e2는 등가 관계를 유지합니다. ≡. 실제로, 그림 9b의 왼쪽 상자에 표시된 것처럼 정렬 프로세스를 시작하기 위해 작은 정렬 시드 세트 (즉, 다른 지식 그래프에 동의어 엔티티가 나타남)가 제공됩니다. 임베딩 기반 정렬은 한 쌍의 엔터티 임베딩 간의 유사성을 계산합니다. IPTransE [113]는 e1 + r (E1 → E2) − e2로 정렬 된 변환을 통해 공동 임베딩 프레임 워크 (그림 9b) 아래에서 엔티티를 통합 된 표현 공간으로 매핑하고, M (E1 → E2) e1 − e2로 선형 변환하고, e1 ≡ e2로 매개 변수 공유. 반복적 정렬에서 오류 누적을 해결하기 위해 BootEA [114]는 새로 레이블이 지정된 정렬을 확인하는 편집 기술과 함께 점진적 훈련 방식의 부트 스트랩 접근 방식을 제안합니다.
>
> 엔티티의 추가 정보도 구체화를 위해 통합됩니다. 예를 들어, JAPE [115] 교차 언어 속성 간의 상관 관계 캡처, KDCoE [116] 공동 학습을 통해 다중 언어 엔티티 설명 포함, MultiKE [117] 엔티티 이름, 관계, 속성, 문자 속성 임베딩과의 정렬 [118].

#### C. Relation Extraction

Relation extraction is a key task to build large-scale knowledge graphs automatically by extracting unknown relational facts from plain text and adding them into knowledge graphs. Due to the lack of labeled relational data, distant supervision [119], also referred to as weak supervision or self-supervision, uses heuristic matching to create training data by assuming that sentences containing the same entity mentions may express the same relation under the supervision of a relational database. Mintz et al. [120] adopted the distant supervision for relation classification with textual features, including lexical and syntactic features, named entity tags, and conjunctive features. Traditional methods rely highly on feature engineering [120], with a recent approach exploring the inner correlation between features [121]. Deep neural networks are changing the representation learning of knowledge graphs and texts. This section reviews recent advances of neural relation extraction (NRE) methods, with an overview illustrated in Fig. 10.

> 관계 추출은 일반 텍스트에서 알려지지 않은 관계 적 사실을 추출하여 지식 그래프에 추가하여 자동으로 대규모 지식 그래프를 구축하는 핵심 작업입니다. 레이블이 지정된 관계형 데이터가 없기 때문에 약한 감독 또는 자가 감독이라고도 하는 원격 감독 [119]은 동일한 엔티티 언급을 포함하는 문장이 감독하에 동일한 관계를 표현할 수 있다고 가정하여 휴리스틱 매칭을 사용하여 훈련 데이터를 만듭니다. 관계형 데이터베이스의. Mintz et al. [120]은 어휘 및 구문 적 특징, 명명 된 엔티티 태그 및 결합 적 특징을 포함하는 텍스트 특징과의 관계 분류를 위해 원격 감독을 채택했습니다. 전통적인 방법은 기능 공학 [120]에 크게 의존하며, 최근 접근 방식은 기능 간의 내부 상관 관계를 탐구합니다 [121]. 심층 신경망은 지식 그래프와 텍스트의 표현 학습을 변화시키고 있습니다. 이 섹션에서는 그림 10에 설명 된 개요와 함께 신경 관계 추출 (NRE) 방법의 최근 발전을 검토합니다.

**1) Neural Relation Extraction:**

Trendy neural networks are widely applied to NRE. CNNs with position features of relative distances to entities [122] are firstly explored for relation classification, and then extended to relation extraction by multiwindow CNN [123] with multiple sized convolutional filters. Multi-instance learning takes a bag of sentences as input to predict the relationship of the entity pair. PCNN [124] applies the piecewise max pooling over the segments of convolutional representation divided by entity position. Compared with vanilla CNN [122], PCNN can more efficiently capture the structural information within the entity pair. MIMLCNN [125] further extends it to multi-label learning with cross-sentence max pooling for feature selection. Side information such as class ties [126] and relation path [127] is also utilized.

RNNs are also introduced, for example, SDP-LSTM [128] adopts multi-channel LSTM while utilizing the shortest dependency path between entity pair, and Miwa et al. [129] stacks sequential and tree-structure LSTMs based on dependency tree. BRCNN [130] combines RNN for capturing sequential dependency with CNN for representing local semantics using two-channel bidirectional LSTM and CNN.

> 트렌디 한 신경망은 NRE에 널리 적용됩니다. 엔티티에 대한 상대적 거리의 위치 특성을 가진 CNN [122]은 먼저 관계 분류를 위해 탐색 된 다음 여러 크기의 컨볼 루션 필터를 사용하는 다중 창 CNN [123]에 의한 관계 추출로 확장됩니다. 다중 인스턴스 학습은 엔터티 쌍의 관계를 예측하기 위해 문장 가방을 입력으로 사용합니다. PCNN [124]은 개체 위치로 나눈 컨볼 루션 표현의 세그먼트에 조각 별 최대 풀링을 적용합니다. vanilla CNN [122]과 비교하여 PCNN은 엔티티 쌍 내의 구조 정보를 보다 효율적으로 캡처 할 수 있습니다. MIMLCNN [125]은 기능 선택을 위한 교차 문장 최대 풀링을 사용하여 다중 레이블 학습으로 확장합니다. 클래스 타이 [126] 및 관계 경로 [127]와 같은 부가 정보도 활용됩니다.
>
> RNN도 도입 되었습니다. 예를 들어 SDP-LSTM [128]은 엔티티 쌍 간의 최단 종속성 경로를 활용하면서 다중 채널 LSTM을 채택하고 Miwa et al. 종속성 트리를 기반으로 순차 및 트리 구조 LSTM을 스택합니다. BRCNN [130]은 순차 종속성을 캡처하기 위한 RNN과 2 채널 양방향 LSTM 및 CNN을 사용하여 로컬 의미를 표현하기위한 CNN을 결합합니다.

**2) Attention Mechanism:**

Many variants of attention mechanisms are combined with CNNs, for example, word-level attention to capturing semantic information of words [131] and selective attention over multiple instances to alleviate the impact of noisy instances [132]. Other side information is also introduced for enriching semantic representation. APCNN [133] introduces entity description by PCNN and sentence-level attention, while HATT [134] proposes hierarchical selective attention to capture the relation hierarchy by concatenating attentive representation of each hierarchical layer. Rather than CNN-based sentence encoders, Att-BLSTM [73] proposes word-level attention with BiLSTM.

> 어텐션 메커니즘의 많은 변형이 CNN과 결합됩니다. 예를 들어 단어의 의미 론적 정보를 캡처하는 단어 수준의주의 [131]와 시끄러운 인스턴스의 영향을 완화하기 위한 여러 인스턴스에 대한 선택적주의 [132]가 있습니다. 의미 론적 표현을 강화하기 위해 다른 부가 정보도 소개됩니다. APCNN [133]은 PCNN과 문장 수준의 주의에 의한 엔티티 설명을 소개하는 반면, HATT [134]는 각 계층 계층의 세심한 표현을 연결하여 관계 계층을 포착하기 위해 계층 적 선택적 주의를 제안합니다. CNN 기반의 문장 인코더 대신 Att-BLSTM [73]은 BiLSTM를 사용하여 단어 수준의 주의를 제안합니다.

**3) Graph Convolutional Networks:**

GCNs are utilized for encoding dependency tree over sentences or learning KGEs to leverage relational knowledge for sentence encoding. CGCN [135] is a contextualized GCN model over the pruned dependency tree of sentences after path-centric pruning. AGGCN [136] also applies GCN over the dependency tree, but utilizes multi-head attention for edge selection in a soft weighting manner. Unlike previous two GCN-based models, Zhang et al., [137] applied GCN for relation embedding in knowledge graph for sentence-based relation extraction. The authors further proposed a coarse-to-fine knowledge-aware attention mechanism for the selection of informative instance.

> GCN은 문장에 대한 종속성 트리를 인코딩하거나 KGE를 학습하여 문장 인코딩을 위한 관계형 지식을 활용하는 데 사용됩니다. CGCN [135]는 경로 중심 가지 치기 후 문장의 가지 치기 의존성 트리에 대한 문맥화 된 GCN 모델입니다. AGGCN [136]은 또한 종속성 트리에 GCN을 적용하지만 소프트 가중치 방식으로 에지 선택을 위해 다중 헤드 어텐션을 활용합니다. 이전의 두 GCN 기반 모델과 달리 Zhang et al., [137]은 문장 기반 관계 추출을 위한 지식 그래프에 관계 임베딩을 위해 GCN을 적용했습니다. 저자는 정보 사례를 선택하기 위해 대략적으로 정밀한 지식 인식주의 메커니즘을 제안했습니다.

**4) Adversarial Training:**

Adversarial Training (AT) is applied to add adversarial noise to word embeddings for CNNand RNN-based relation extraction under the MIML learning setting [138]. DSGAN [139] denoises distantly supervised relation extraction by learning a generator of sentence-level true positive samples and a discriminator that minimizes the probability of being true positive of the generator.

> MIML 학습 설정에서 CNN 및 RNN 기반 관계 추출을위한 단어 임베딩에 적대적 노이즈를 추가하기 위해 AT (적대적 훈련)가 적용됩니다 [138]. DSGAN [139]은 문장 수준의 참 양성 샘플 생성기와 생성기의 참 양성 가능성을 최소화하는 판별자를 학습하여 원거리 감독 관계 추출을 제거합니다.

**5) Reinforcement Learning:**

RL has been integrated into neural relation extraction recently by training instance selector with policy network. Qin et al. [140] proposed to train policybased RL agent of sentential relation classifier to redistribute false positive instances into negative samples to mitigate the effect of noisy data. The authors took the F1 score as an evaluation metric and used F1 score based performance change as the reward for policy networks. Similarly, Zeng et al. [141] and Feng et al. [142] proposed different reward strategies. The advantage of RL-based NRE is that the relation extractor is model-agnostic. Thus, it could be easily adapted to any neural architectures for effective relation extraction. Recently, HRL [143] proposed a hierarchical policy learning framework of high-level relation detection and low-level entity extraction.

> RL은 최근 정책 네트워크로 인스턴스 선택기를 훈련시켜 신경 관계 추출에 통합되었습니다. Qin et al. [140]은 잡음이 있는 데이터의 영향을 완화하기 위해 오탐지 사례를 부정적 샘플로 재분배하도록 감각 관계 분류기의 정책 기반 RL 에이전트를 훈련하도록 제안했습니다. 저자는 F1 점수를 평가 지표로 사용하고 F1 점수 기반 성능 변화를 정책 네트워크에 대한 보상으로 사용했습니다. 마찬가지로 Zeng et al. 및 Feng et al. 다른 보상 전략을 제안했습니다. RL 기반 NRE의 장점은 관계 추출기가 모델에 구애받지 않는다는 것입니다. 따라서 효과적인 관계 추출을 위해 모든 신경 아키텍처에 쉽게 적용 할 수 있습니다. 최근 HRL [143]은 고수준 관계 탐지와 저수준 개체 추출의 계층적 정책 학습 프레임 워크를 제안했다.

**6) Other Advances:**

Other advances of deep learning are also applied for neural relation extraction. Noticing that current NRE methods do not use very deep networks, Huang and Wang [144] applied deep residual learning to noisy relation extraction and found that 9-layer CNNs have improved performance. Liu et al. [145] proposed to initialize the neural model by transfer learning from entity classification. The cooperative CORD [146] ensembles text corpus and knowledge graph with external logical rules by bidirectional knowledge distillation and adaptive imitation. TK-MF [147] enriches sentence representation learning by matching sentences and topic words. Recently, Shahbazi et al. [148] studied trustworthy relation extraction by benchmarking several explanation mechanisms, including saliency, gradient × input, and leave one out.

The existence of low-frequency relations in knowledge graphs requires few-shot relation classification with unseen classes or only a few instances. Gao et al. [149] proposed hybrid attention-based prototypical networks to compute prototypical relation embedding and compare its distance between the query embedding. Qin et al. [150] explored the relationships between relations with a global relation graph and formulated few-shot relation extraction as a Bayesian meta-learning problem to learn the posterior distribution of relations’ prototype vectors.

> 딥 러닝의 다른 발전은 신경 관계 추출에도 적용됩니다. 현재의 NRE 방법이 매우 딥 네트워크를 사용하지 않는다는 사실을 알고 Huang과 Wang [144]은 딥 레지 듀얼 학습을 노이즈 관계 추출에 적용했으며 9 계층 CNN이 성능을 향상 시켰음을 발견했습니다. Liu et al. 개체 분류에서 전이 학습을 통해 신경 모델을 초기화하는 방안을 제안 하였다. 협동 CORD [146]는 양방향 지식 증류 및 적응 모방에 의해 외부 논리 규칙과 함께 텍스트 말뭉치와 지식 그래프를 앙상블 합니다. TK-MF [147]는 문장과 주제 단어를 일치시켜 문장 표현 학습을 풍부하게 합니다. 최근 Shahbazi et al. [148] saliency, gradient × input, leave one out 등 여러 설명 메커니즘을 벤치마킹 하여 신뢰할 수있는 관계 추출을 연구했습니다.
>
> 지식 그래프에 저 빈도 관계가 존재하려면 보이지 않는 클래스 또는 몇 개의 인스턴스만 있는 몇 번의 관계 분류가 필요합니다. Gao et al. 프로토 타입 관계 임베딩을 계산하고 쿼리 임베딩 간의 거리를 비교하기 위해 하이브리드 어텐션 기반 프로토 타입 네트워크를 제안했습니다. Qin et al. [150]은 관계의 원형 벡터의 사후 분포를 학습하기 위해 글로벌 관계 그래프를 사용하여 관계 간의 관계를 탐색하고 베이즈 메타 학습 문제로 몇 번의 관계 추출을 공식화했습니다.

#### D. Summary

This section reviews knowledge completion for incomplete knowledge graph and acquisition from plain text.

Knowledge graph completion completes missing links between existing entities or infers entities given entity and relation queries. Embedding-based KGC methods generally rely on triple representation learning to capture semantics and do candidate ranking for completion. Embedding-based reasoning remains in individual relation level, and is poor at complex reasoning because it ignores the symbolical nature of knowledge graph, and lack of interpretability. Hybrid methods with symbolics and embedding incorporate rulebased reasoning, overcome the sparsity of knowledge graph to improve the quality of embedding, facilitate efficient rule injection, and induce interpretable rules. With the observation of the graphical nature of knowledge graphs, path search and neural path representation learning are studied. However, they suffer from connectivity deficiency when traverses over largescale graphs. The emerging direction of meta relational learning aims to learn fast adaptation over unseen relations in lowresource settings.

Entity discovery acquires entity-oriented knowledge from text and fuses knowledge between knowledge graphs. There are several categories according to specific settings. Entity recognition is explored in a sequence-to-sequence manner, entity typing discusses noisy type labels and zero-shot typing, and entity disambiguation and alignment learn unified embeddings with iterative alignment model proposed to tackle the issue of a limited number of alignment seed. However, it may face error accumulation problems if newly-aligned entities suffer from poor performance. Language-specific knowledge has increased in recent years and consequentially motivates the research on cross-lingual knowledge alignment.

Relation extraction suffers from noisy patterns under the assumption of distant supervision, especially in text corpus of different domains. Thus, weakly supervised relation extraction must mitigate the impact of noisy labeling. For example, multi-instance learning takes bags of sentences as inputs and attention mechanism [132] reduce noisy patterns by soft selection over instances, and RL-based methods formulate instance selection as a hard decision. Another principle is to learn richer representation as possible. As deep neural networks can solve error propagation in traditional feature extraction methods, this field is dominated by DNN-based models, as summarized in Table IV.

> 이 섹션에서는 불완전한 지식 그래프에 대한 지식 완성과 일반 텍스트에서 얻은 습득을 검토합니다.
>
> 지식 정보 완성은 기존 엔터티 간의 누락 된 링크를 완료하거나 엔터티 및 관계 쿼리가 지정된 엔터티를 추론합니다. 임베딩 기반 KGC 방법은 일반적으로 의미론을 캡처하고 완료 후보 순위를 지정하기 위해 삼중 표현 학습에 의존합니다. 임베딩 기반 추론은 개별 관계 수준에 남아 있으며 지식 그래프의 상징적 특성을 무시하고 해석 가능성이 부족하기 때문에 복잡한 추론에 적합하지 않습니다. 심볼릭 및 임베딩을 사용한 하이브리드 방법은 규칙 기반 추론을 통합하고, 지식 그래프의 희소성을 극복하여 임베딩 품질을 개선하고, 효율적인 규칙 삽입을 촉진하고, 해석 가능한 규칙을 유도합니다. 지식 그래프의 그래픽 특성을 관찰하여 경로 검색 및 신경 경로 표현 학습을 연구합니다. 그러나 대규모 그래프를 탐색 할 때 연결성 부족으로 고통받습니다. 메타 관계 학습의 새로운 방향은 낮은 자원 환경에서 보이지 않는 관계에 대한 빠른 적응을 배우는 것을 목표로합니다.
>
> 엔티티 발견은 텍스트에서 엔티티 지향 지식을 획득하고 지식 그래프간에 지식을 융합합니다. 특정 설정에 따라 여러 범주가 있습니다. 엔티티 인식은 시퀀스 대 시퀀스 방식으로 탐색되고 엔티티 타이핑은 노이즈 유형 레이블 및 제로 샷 타이핑을 논의하며 엔티티 명확화 및 정렬은 제한된 수의 정렬 시드 문제를 해결하기 위해 제안 된 반복적 정렬 모델을 사용하여 통합 임베딩을 학습합니다. 그러나 새로 정렬 된 엔티티의 성능이 저하되면 오류 누적 문제가 발생할 수 있습니다. 최근 몇 년 동안 언어 별 지식이 증가했으며 결과적으로 다국어 지식 정렬 연구에 동기를 부여합니다.
>
> 관계 추출은 특히 다른 도메인의 텍스트 말뭉치에서 먼 감독 가정 하에서 시끄러운 패턴으로 어려움을 겪습니다. 따라서 약하게 감독되는 관계 추출은 잡음이 있는 라벨링의 영향을 완화해야합니다. 예를 들어, 다중 인스턴스 학습은 입력으로 문장 가방을 취하고 주의 메커니즘 [132]은 인스턴스에 대한 소프트 선택에 의해 시끄러운 패턴을 줄이고 RL 기반 방법은 인스턴스 선택을 어려운 결정으로 공식화합니다. 또 다른 원칙은 가능한 한 더 풍부한 표현을 배우는 것입니다. 심층 신경망은 기존 특징 추출 방법에서 오류 전파를 해결할 수 있으므로이 분야는 표 IV에 요약 된 것처럼 DNN 기반 모델이 지배합니다.


### V. TEMPORAL KNOWLEDGE GRAPH

Current knowledge graph research mostly focuses on static knowledge graphs where facts are not changed with time, while the temporal dynamics of a knowledge graph is less explored. However, the temporal information is of great importance because the structured knowledge only holds within a specific period, and the evolution of facts follows a time sequence. Recent research begins to take temporal information into KRL and KGC, which is termed as temporal knowledge graph in contrast to the previous static knowledge graph. Research efforts have been made for learning temporal and relational embedding simultaneously.

> 현재 지식 그래프 연구는 대부분 사실이 시간에 따라 변하지 않는 정적 지식 그래프에 초점을 맞추고 있지만 지식 그래프의 시간적 역학은 덜 탐구됩니다. 그러나 구조화 된 지식은 특정 기간에만 유지되고 사실의 진화는 시간 순서를 따르기 때문에 시간 정보는 매우 중요합니다. 최근의 연구는 시간 정보를 KRL과 KGC로 가져 가기 시작하는데, 이는 이전의 정적 지식 그래프와 달리 시간적 지식 그래프라고합니다. 시간적 및 관계 적 임베딩을 동시에 학습하기 위한 연구 노력이 이루어졌습니다.

#### A. Temporal Information Embedding

Temporal information is considered in temporal-aware embedding by extending triples into temporal quadruple as (h, r, t, τ ), where τ provides additional temporal information about when the fact held. Leblay and Chekol [151] investigated temporal scope prediction over time-annotated triple, and simply extended existing embedding methods, for example, TransE with the vector-based TTransE defined as.

Ma et al. [152] also generalized existing static embedding methods and proposed ConT by replacing the shared weight vector of Tucker with a timestamp embedding. Temporally scoped quadruple extends triples by adding a time scope [τs, τe], where τs and τe stand for the beginning and ending of the valid period of a triple, and then a static subgraph Gτ can be derived from the dynamic knowledge graph when given a specific timestamp τ . HyTE [153] takes a time stamp as a hyperplane wτ and projects entity and relation representation as. The temporally projected scoring function is calculated as.

within the projected translation of Pτ (h) + Pτ (r) ≈ Pτ (t). Garcıa-Duran et al. [154] concatenated predicate token sequence and temporal token sequence, and used LSTM to encode the concatenated time-aware predicate sequences. The last hidden state of LSTM is taken as temporal-aware relational embedding rtemp. The scoring function of extended TransE and DistMult are calculated as kh + rtemp − tk2 and (h ◦ t) rT temp, respectively. By defining the context of an entity e as an aggregate set of facts containing e, Liu et al. [155] proposed context selection to capture useful contexts, and measured temporal consistency with selected context. By formulating temporal KGC as 4-order tensor completion, Lacroix et al. [156] proposed TComplEx, which extends ComplEx decomposition, and introduced weighted regularizers.

> 시간 정보는 시간 인식 임베딩에서 (h, r, t, τ)와 같이 3 배를 시간 4 배로 확장하여 고려됩니다. 여기서 τ는 사실이 유지되는 시기에 대한 추가 시간 정보를 제공합니다. Leblay와 Chekol [151]은 시간 주석이 달린 트리플에 대한 시간적 범위 예측을 조사했으며, 벡터 기반 TTransE가 정의 된 TransE와 같은 기존 임베딩 방법을 단순히 확장했습니다.
>
> Ma et al. 또한 기존의 정적 임베딩 방법을 일반화하고 Tucker의 공유 가중치 벡터를 타임 스탬프 임베딩으로 대체하여 ConT를 제안했습니다. 시간 범위 4 중은 시간 범위 [τs, τe]를 추가하여 트리플을 확장합니다. 여기서 τs 및 τe는 트리플의 유효 기간의 시작과 끝을 나타내고, 정적 하위 그래프 Gτ는 주어진 경우 동적 지식 그래프에서 파생 될 수 있습니다. 특정 타임 스탬프 τ. HyTE [153]는 타임 스탬프를 하이퍼 플레인 wτ로 취하고 엔터티 및 관계 표현을 다음과 같이 투영합니다. 일시적으로 예상되는 채점 함수는 다음과 같이 계산됩니다.
>
> Pτ (h) + Pτ (r) ≈ Pτ (t)의 예상 번역 내에서. Garcıa-Duran et al. 연결된 술어 토큰 시퀀스와 시간 토큰 시퀀스, 그리고 연결된 시간 인식 술어 시퀀스를 인코딩하기 위해 LSTM을 사용했습니다. LSTM의 마지막 숨겨진 상태는 시간 인식 관계형 임베딩 rtemp로 간주됩니다. 확장 된 TransE 및 DistMult의 스코어링 함수는 각각 kh + rtemp − tk2 및 (h ◦ t) rT temp로 계산됩니다. 엔티티 e의 컨텍스트를 e를 포함하는 팩트 집합으로 정의함으로써 Liu et al. 유용한 컨텍스트를 포착하기 위해 컨텍스트 선택을 제안하고 선택한 컨텍스트와의 시간적 일관성을 측정했습니다. 시간적 KGC를 4 차 텐서 완성으로 공식화함으로써 Lacroix et al. ComplEx 분해를 확장하는 TComplEx를 제안하고 가중 정규화를 도입했습니다.

#### B. Entity Dynamics

Real-world events change entities’ state, and consequently, affect the corresponding relations. To improve temporal scope inference, the contextual temporal profile model [157] formulates the temporal scoping problem as state change detection and utilizes the context to learn state and state change vectors. Inspired by the diachronic word embedding, Goel et al. [158] took an entity and timestamp as the input of entity embedding function to preserve the temporal-aware characteristics of entities at any time point. Know-evolve [159], a deep evolutionary knowledge network, investigates the knowledge evolution phenomenon of entities and their evolved relations. A multivariate temporal point process is used to model the occurrence of facts, and a novel recurrent network is developed to learn the representation of non-linear temporal evolution. To capture the interaction between nodes, RE-NET [160] models event sequences via RNN-based event encoder, neighborhood aggregator. Specifically, RNN is used to capture the temporal entity interaction, and the neighborhood aggregator aggregates the concurrent interactions.

> 실제 이벤트는 엔티티의 상태를 변경하고 결과적으로 해당 관계에 영향을 줍니다. 시간적 범위 추론을 향상시키기 위해 상황 별 시간 프로파일 모델 [157]은 시간 범위 문제를 상태 변경 감지로 공식화하고 컨텍스트를 활용하여 상태 및 상태 변경 벡터를 학습합니다. 통시적인 단어 임베딩에서 영감을 얻은 Goel et al. [158] 엔티티와 타임 스탬프를 엔티티 임베딩 함수의 입력으로 사용하여 언제든지 엔티티의 시간 인식 특성을 보존합니다. 심층 진화 지식 네트워크 인 Know-evolve [159]는 실체의 지식 진화 현상과 진화 된 관계를 조사합니다. 사실의 발생을 모델링 하기 위해 다변량 시간 포인트 프로세스가 사용되며, 비선형 시간 진화의 표현을 학습하기 위해 새로운 반복 네트워크가 개발됩니다. 노드 간의 상호 작용을 포착하기 위해 RE-NET [160]은 RNN 기반 이벤트 인코더, 이웃 애그리게이터를 통해 이벤트 시퀀스를 모델링합니다. 특히, RNN은 시간적 엔티티 상호 작용을 캡처하는 데 사용되며 이웃 애그리게이터는 동시 상호 작용을 집계합니다.

#### C. Temporal Relational Dependency

There exists temporal dependencies in relational chains following the timeline, for example, wasBornIn → graduateFrom → workAt → diedIn. Jiang et al. [161], [162] proposed time-aware embedding, a joint learning framework with temporal regularization, to incorporate temporal order and consistency information. The authors defined a temporal scoring function as.

where T ∈ Rd×d is an asymmetric matrix that encodes the temporal order of relation, for a temporal ordering relation pair hrk, rli. Three temporal consistency constraints of disjointness, ordering, and spans are further applied by integer linear programming formulation.

> 타임 라인을 따르는 관계형 체인에는 시간적 종속성이 있습니다 (예 : wasBornIn → GraduateFrom → workAt → diedIn). Jiang et al. [161], [162]는 시간적 순서와 일관성 정보를 통합하기 위해 시간적 정규화와 공동 학습 프레임 워크 인 시간 인식 임베딩을 제안했습니다. 저자는 시간 점수 기능을 다음과 같이 정의했습니다.
>
> 여기서 T ∈ Rd × d는 시간 순서 관계 쌍 hrk, rli에 대한 관계의 시간 순서를 인코딩하는 비대칭 행렬입니다. 분리, 순서 및 범위의 세 가지 시간적 일관성 제약은 정수 선형 프로그래밍 공식에 의해 추가로 적용됩니다.

#### D. Temporal Logical Reasoning

Logical rules are also studied for temporal reasoning. Chekol et al. [163] explored Markov logic network and probabilistic soft logic for reasoning over uncertain temporal knowledge graphs. RLvLR-Stream [88] considers temporal close-path rules and learns the structure of rules from the knowledge graph stream for reasoning.

> 시간적 추론을 위해 논리적 규칙도 연구됩니다. Chekol et al. [163] 불확실한 시간적 지식 그래프에 대한 추론을 위해 Markov 논리 네트워크와 확률 론적 소프트 논리를 탐색했습니다. RLvLR-Stream [88]은 시간적 근접 경로 규칙을 고려하고 추론을 위해 지식 그래프 스트림에서 규칙의 구조를 학습합니다.


### VI. KNOWLEDGE-AWARE APPLICATIONS

Rich structured knowledge can be useful for AI applications. However, how to integrate such symbolic knowledge into the computational framework of real-world applications remains a challenge. This section introduces several recent DNN-based knowledge-driven approaches with the applications on NLU, recommendation, and question answering. More miscellaneous applications such as digital health and search engine are introduced in Appendix D.

> 풍부한 구조적 지식은 AI 애플리케이션에 유용 할 수 있습니다. 그러나 이러한 상징적 지식을 실제 응용 프로그램의 계산 프레임 워크에 통합하는 방법은 여전히 어려운 과제입니다. 이 섹션에서는 NLU, 권장 사항 및 질문 답변에 대한 응용 프로그램과 함께 최근의 DNN 기반 지식 기반 접근 방식을 소개합니다. 디지털 건강 및 검색 엔진과 같은 더 많은 기타 응용 프로그램은 부록 D에 소개되어 있습니다.

#### A. Natural Language Understanding

Knowledge-aware NLU enhances language representation with structured knowledge injected into a unified semantic space. Recent knowledge-driven advances utilize explicit factual knowledge and implicit language representation, with many NLU tasks explored. Chen et al. [164] proposed doublegraph random walks over two knowledge graphs, i.e., a slotbased semantic knowledge graph and a word-based lexical knowledge graph, to consider inter-slot relations in spoken language understanding. Wang et al. [165] augmented short text representation learning with knowledge-based conceptualization by a weighted word-concept embedding. Peng et al. [166] integrated an external knowledge base to build a heterogeneous information graph for event categorization in short social text.

Language modeling as a fundamental NLP task predicts the next word given preceding words in the given sequence. Traditional language modeling does not exploit factual knowledge with entities frequently observed in the text corpus. How to integrate knowledge into language representation has drawn increasing attention. Knowledge graph language model (KGLM) [167] learns to render knowledge by selecting and copying entities. ERNIE-Tsinghua [168] fuses informative entities via aggregated pre-training and random masking. BERT-MK [169] encodes graph contextualized knowledge and focuses on the medical corpus. K-BERT [170] infuses domain knowledge into BERT contextual encoder. ERNIEBaidu [171] introduces named entity masking and phrase masking to integrate knowledge into the language model and is further improved by ERNIE 2.0 [172] via continual multi-task learning. Rethinking about large-scale training on language model and querying over knowledge graphs, Petroni et al. [173] analyzed the language model and knowledge base. They found that certain factual knowledge can be acquired via pre-training language model.

> 지식 인식 NLU는 통합 된 의미 공간에 주입 된 구조화 된 지식으로 언어 표현을 향상시킵니다. 최근의 지식 기반 발전은 많은 NLU 작업을 탐구하면서 명시 적 사실 지식과 암시 적 언어 표현을 활용합니다. Chen et al. [164] 제안 된 이중 그래프 랜덤 워크는 구어 이해에서 슬롯 간 관계를 고려하기 위해 두 개의 지식 그래프, 즉 슬롯 기반 의미 지식 그래프와 단어 기반 어휘 지식 그래프를 살펴 봅니다. Wang et al. 가중 된 단어-개념 임베딩에 의한 지식 기반 개념화 학습으로 강화 된 짧은 텍스트 표현 학습. Peng et al. [166] 짧은 소셜 텍스트에서 이벤트 분류를위한 이기종 정보 그래프를 구축하기 위해 외부 지식 기반을 통합했습니다.
>
> 기본적인 NLP 작업으로서의 언어 모델링은 주어진 시퀀스에서 선행 단어가 주어진 다음 단어를 예측합니다. 전통적인 언어 모델링은 텍스트 말뭉치에서 자주 관찰되는 엔티티에 대한 사실적 지식을 활용하지 않습니다. 지식을 언어 표현에 통합하는 방법에 대한 관심이 증가하고 있습니다. 지식 그래프 언어 모델 (KGLM) [167]은 엔티티를 선택하고 복사하여 지식을 렌더링하는 방법을 배웁니다. ERNIE-Tsinghua [168]는 집계 된 사전 훈련 및 무작위 마스킹을 통해 정보 엔티티를 융합합니다. BERT-MK [169]는 그래프 맥락화 된 지식을 인코딩하고 의료 코퍼스에 중점을 둡니다. K-BERT [170]은 BERT 컨텍스트 인코더에 도메인 지식을 주입합니다. ERNIEBaidu [171]는 지식을 언어 모델에 통합하기 위해 명명 된 엔티티 마스킹 및 구문 마스킹을 도입하고 지속적인 다중 작업 학습을 통해 ERNIE 2.0 [172]에 의해 더욱 향상되었습니다. 언어 모델에 대한 대규모 교육과 지식 그래프에 대한 쿼리에 대해 다시 생각하면서 Petroni et al. [173]은 언어 모델과 지식 기반을 분석했습니다. 그들은 사전 훈련 언어 모델을 통해 특정 사실적 지식을 습득 할 수 있음을 발견했습니다.

#### B. Question Answering

knowledge-graph-based question answering (KG-QA) answers natural language questions with facts from knowledge graphs. Neural network-based approaches represent questions and answers in distributed semantic space, and some also conduct symbolic knowledge injection for commonsense reasoning.

> 지식 그래프 기반 질문 답변 (KG-QA)은 지식 그래프의 사실로 자연어 질문에 답변합니다. 신경망 기반 접근 방식은 분산 된 의미 공간에서 질문과 답변을 나타내며 일부는 상식 추론을 위해 상징적 지식 주입을 수행합니다.

**1) Single-fact QA:**

Taking a knowledge graph as an external intellectual source, simple factoid QA or single-fact QA is to answer a simple question involving a single knowledge graph fact. Bordes et al. [174] adapted memory network for simple question answering, taking knowledge base as external memory. Dai et al. [175] proposed a conditional focused neural network equipped with focused pruning to reduce the search space. To generate natural answers in a user-friendly way, COREAQ [176] introduces copying and retrieving mechanisms to generate smooth and natural responses in a seq2seq manner, where an answer is predicted from the corpus vocabulary, copied from the given question or retrieved from the knowledge graph. BAMnet [177] models the two-way interaction between questions and knowledge graph with a bidirectional attention mechanism.

Although deep learning techniques are intensively applied in KG-QA, they inevitably increase the model complexity. Through the evaluation of simple KG-QA with and without neural networks, Mohammed et al. [178] found that sophisticated deep models such as LSTM and gated recurrent unit (GRU) with heuristics achieve state of the art, and non-neural models also gain reasonably well performance.

> 지식 그래프를 외부 지적 소스, 간단한 사실 QA 또는 단일 사실 QA로 취하면 단일 지식 그래프 사실과 관련된 간단한 질문에 답하는 것입니다. Bordes et al. [174] 간단한 질문 답변을위한 메모리 네트워크를 채택하여 지식 기반을 외부 메모리로 사용합니다. Dai et al. [175]는 검색 공간을 줄이기 위해 집중된 가지 치기 기능을 갖춘 조건부 집중 신경망을 제안했습니다. 사용자 친화적 인 방식으로 자연스러운 답변을 생성하기 위해 COREAQ [176]는 seq2seq 방식으로 부드럽고 자연스러운 답변을 생성하는 복사 및 검색 메커니즘을 도입합니다. 여기서 답변은 말뭉치 어휘에서 예측되거나 주어진 질문에서 복사되거나 지식 그래프. BAMnet [177]은 양방향주의 메커니즘을 사용하여 질문과 지식 그래프 간의 양방향 상호 작용을 모델링합니다.
>
> KG-QA에서는 딥 러닝 기법이 집중적으로 적용되지만 필연적으로 모델 복잡성이 증가합니다. 신경망이 있거나없는 간단한 KG-QA의 평가를 통해 Mohammed et al. [178]은 휴리스틱을 사용하는 LSTM 및 GRU (gated recurrent unit)와 같은 정교한 심층 모델이 최첨단을 달성하고 비 신경 모델도 합리적으로 우수한 성능을 얻는다는 것을 발견했습니다.

**2) Multi-hop Reasoning:**

Those neural network-based methods gain improvements with the combination of neural encoderdecoder models, but to deal with complex multi-hop relation requires a more dedicated design to be capable of multihop commonsense reasoning. Structured knowledge provides informative commonsense observations and acts as relational inductive biases, which boosts recent studies on commonsense knowledge fusion between symbolic and semantic space for multi-hop reasoning. Bauer et al. [179] proposed multihop bidirectional attention and pointer-generator decoder for effective multi-hop reasoning and coherent answer generation, utilizing external commonsense knowledge by relational path selection from ConceptNet and injection with selectivelygated attention. Variational Reasoning Network (VRN) [180] conducts multi-hop logic reasoning with reasoning-graph embedding, while handles the uncertainty in topic entity recognition. KagNet [181] performs concept recognition to build a schema graph from ConceptNet and learns path-based relational representation via GCN, LSTM, and hierarchical pathbased attention. CogQA [182] combines implicit extraction and explicit reasoning and proposes a cognitive graph model based on BERT and GNN for multi-hop QA.

> 이러한 신경망 기반 방법은 신경 인코더 디코더 모델의 조합으로 개선되지만 복잡한 다중 홉 관계를 처리하려면 다중 홉 상식적 추론을 수행 할 수있는보다 전용 설계가 필요합니다. 구조화 된 지식은 정보를 제공하는 상식적 관찰을 제공하고 관계형 귀납적 편향으로 작용하여 다중 홉 추론을위한 상징적 공간과 의미 론적 공간 간의 상식적 지식 융합에 대한 최근 연구를 촉진합니다. Bauer et al. ConceptNet의 관계형 경로 선택 및 선택적인 주의 주입에 의한 외부 상식 지식을 활용하여 효과적인 다중 홉 추론 및 일관된 응답 생성을위한 다중 홉 양방향 주의 및 포인터 생성기 디코더를 제안했습니다. VRN (Variational Reasoning Network) [180]은 추론 그래프 임베딩을 사용하여 다중 홉 논리 추론을 수행하는 동시에 주제 엔티티 인식의 불확실성을 처리합니다. KagNet [181]은 개념 인식을 수행하여 ConceptNet에서 스키마 그래프를 작성하고 GCN, LSTM 및 계층 적 경로 기반주의를 통해 경로 기반 관계 표현을 학습합니다. CogQA [182]는 암시 적 추출과 명시 적 추론을 결합하고 다중 홉 QA를 위해 BERT 및 GNN을 기반으로 하는 인지 그래프 모델을 제안합니다.

#### C. Recommender Systems

Recommender systems have been widely explored by collaborative filtering, which makes use of users’ historical information. However, it often fails to solve the sparsity issue and the cold start problem. Integrating knowledge graphs as external information enables recommendation systems to have the ability of commonsense reasoning.

By injecting knowledge-graph-based side information such as entities, relations, and attributes, many efforts work on embedding-based regularization to improve recommendation. The collaborative CKE [183] jointly trains KGEs, item’s textual information, and visual content via translational KGE model and stacked auto-encoders. Noticing that time-sensitive and topic-sensitive news articles consist of condensed entities and common knowledge, DKN [184] incorporates knowledge graph by a knowledge-aware CNN model with multichannel word-entity-aligned textual inputs. However, DKN cannot be trained in an end-to-end manner as it needs to learn entity embedding in advance. To enable end-to-end training, MKR [185] associates multi-task knowledge graph representation and recommendation by sharing latent features and modeling high-order item-entity interaction. While other works consider the relational path and structure of knowledge graphs, KPRN [186] regards the interaction between users and items as an entity-relation path in the knowledge graph and conducts preference inference over the path with LSTM to capture the sequential dependency. PGPR [187] performs reinforcement policy-guided path reasoning over knowledgegraph-based user-item interaction. KGAT [188] applies graph attention network over the collaborative knowledge graph of entity-relation and user-item graphs to encode high-order connectivities via embedding propagation and attention-based aggregation.

> Recommender 시스템은 사용자의 과거 정보를 활용하는 협업 필터링을 통해 광범위하게 탐색되었습니다. 그러나 희소성 문제와 콜드 스타트 ​​문제를 해결하지 못하는 경우가 많습니다. 지식 그래프를 외부 정보로 통합하면 추천 시스템이 상식적인 추론 능력을 가질 수 있습니다.
>
> 엔티티, 관계 및 속성과 같은 지식 그래프 기반 부가 정보를 주입함으로써 많은 노력이 임베딩 기반 정규화를 통해 권장 사항을 개선합니다. 협업 CKE [183]는 번역 KGE 모델과 스택 형 자동 인코더를 통해 KGE, 항목의 텍스트 정보 및 시각적 콘텐츠를 공동으로 훈련합니다. 시간에 민감하고 주제에 민감한 뉴스 기사가 축약 된 엔티티와 상식으로 구성되어 있음을 인식 한 DKN [184]은 지식 인식 CNN 모델에 의해 지식 그래프를 다중 채널 단어 엔티티 정렬 텍스트 입력과 통합합니다. 그러나 DKN은 엔터티 임베딩을 미리 학습해야 하므로 엔드 투 엔드 방식으로 훈련 할 수 없습니다. end-to-end 훈련을 가능하게하기 위해 MKR [185]은 잠재적 인 특징을 공유하고 고차원 항목-엔티티 상호 작용을 모델링함으로써 다중 작업 지식 그래프 표현과 추천을 연관시킵니다. 다른 작업은 지식 그래프의 관계 경로와 구조를 고려하는 반면, KPRN [186]은 지식 그래프에서 사용자와 항목 간의 상호 작용을 엔티티-관계 경로로 간주하고 LSTM을 사용하여 경로에 대한 선호도 추론을 수행하여 순차적 종속성을 포착합니다. PGPR [187]은 지식 그래프 기반 사용자 항목 상호 작용에 대한 강화 정책 안내 경로 추론을 수행합니다. KGAT [188]는 삽입 전파 및주의 기반 집계를 통해 고차 연결성을 인코딩하기 위해 엔티티 관계 및 사용자 항목 그래프의 협업 지식 그래프에 그래프주의 네트워크를 적용합니다.


### VII. FUTURE DIRECTIONS

Many efforts have been conducted to tackle the challenges of knowledge representation and its related applications. However, there remains several formidable open problems and promising future directions.

> 지식 표현 및 관련 응용 분야의 문제를 해결하기 위해 많은 노력이 수행되었습니다. 그러나 몇 가지 강력한 미해결 문제와 유망한 미래 방향이 남아 있습니다.

#### A. Complex Reasoning

Numerical computing for knowledge representation and reasoning requires a continuous vector space to capture the semantic of entities and relations. While embedding-based methods have a limitation on complex logical reasoning, two directions on the relational path and symbolic logic are worthy of being further explored. Some promising methods such as recurrent relational path encoding, GNN-based message passing over knowledge graph, and reinforcement learningbased pathfinding and reasoning are up-and-coming for handling complex reasoning. For the combination of logic rules and embeddings, recent works [95], [96] combine Markov logic networks with KGE, aiming to leverage logic rules and handling their uncertainty. Enabling probabilistic inference for capturing the uncertainty and domain knowledge with efficiently embedding will be a noteworthy research direction.

> 지식 표현과 추론을위한 수치 컴퓨팅은 엔티티와 관계의 의미를 포착하기 위해 연속적인 벡터 공간을 필요로합니다. 임베딩 기반 방법은 복잡한 논리적 추론에 제한이 있지만 관계형 경로와 상징적 논리에 대한 두 가지 방향은 더 자세히 살펴볼 가치가 있습니다. 반복적 인 관계형 경로 인코딩, 지식 그래프를 통한 GNN 기반 메시지 전달, 강화 학습 기반 경로 찾기 및 추론과 같은 일부 유망한 방법은 복잡한 추론을 처리하기 위해 떠오르고 있습니다. 논리 규칙과 임베딩의 조합을 위해 최근 연구 [95], [96]에서는 논리 규칙을 활용하고 불확실성을 처리하기 위해 Markov 논리 네트워크와 KGE를 결합합니다. 효율적으로 임베딩하여 불확실성과 도메인 지식을 포착하기 위한 확률 적 추론을 활성화하는 것은 주목할만한 연구 방향이 될 것입니다.

#### B. Unified Framework

Several representation learning models on knowledge graphs have been verified as equivalence, for example, Hayshi and Shimbo [189] proved that HolE and ComplEx are mathematically equivalent for link prediction with a particular constraint. ANALOGY [21] provides a unified view of several representative models, including DistMult, ComplEx, and HolE. Wang et al. [46] explored connections among several bilinear models. Chandrahas et al. [190] explored the geometric understanding of additive and multiplicative KRL models. Most works formulated knowledge acquisition KGC and relation extraction separately with different models. Han et al. [71] put them under the same roof and proposed a joint learning framework with mutual attention for information sharing between knowledge graph and text. A unified understanding of knowledge representation and reasoning is less explored. An investigation towards unification in a way similar to the unified framework of graph networks [191], however, will be worthy of bridging the research gap.

> 지식 그래프에 대한 여러 표현 학습 모델이 동등성으로 확인되었습니다. 예를 들어 Hayshi와 Shimbo [189]는 HolE와 ComplEx가 특정 제약 조건을 가진 링크 예측에 대해 수학적으로 동등하다는 것을 증명했습니다. ANALOGY [21]는 DistMult, ComplEx 및 HolE를 포함한 여러 대표 모델의 통합보기를 제공합니다. Wang et al. [46] 여러 쌍 선형 모델 간의 연결을 탐구했습니다. Chandrahas et al. [190] 덧셈 및 곱셈 KRL 모델의 기하학적 이해를 탐구했습니다. 대부분의 작품은 지식 습득 KGC와 관계 추출을 다른 모델과 별도로 공식화했습니다. Han et al. [71] 그것들을 같은 지붕 아래에 놓고 지식 그래프와 텍스트 간의 정보 공유를 위해 상호주의를 기울이는 공동 학습 프레임 워크를 제안했습니다. 지식 표현과 추론에 대한 통일 된 이해는 덜 탐구됩니다. 그러나 그래프 네트워크의 통합 프레임 워크 [191]와 유사한 방식으로 통합에 대한 조사는 연구 격차를 해소 할 가치가 있습니다.

#### C. Interpretability

Interpretability of knowledge representation and injection is a vital issue for knowledge acquisition and real-world applications. Preliminary efforts have been made for interpretability. ITransF [36] uses sparse vectors for knowledge transferring and interprets with attention visualization. CrossE [41] explores the explanation scheme of knowledge graphs by using embedding-based path searching to generate explanations for link prediction. However, recent neural models have limitations on transparency and interpretability, although they have gained impressive performance. Some methods combine black-box neural models and symbolic reasoning by incorporating logical rules to increase the interoperability. Interpretability can convince people to trust predictions. Thus, further work should go into interpretability and improve the reliability of predicted knowledge.

> 지식 표현 및 주입의 해석 가능성은 지식 습득 및 실제 응용 프로그램에서 중요한 문제입니다. 해석 가능성을 위해 예비 노력을 기울였습니다. ITransF [36]는 지식 전달을 위해 희소 벡터를 사용하고주의 시각화로 해석합니다. CrossE [41]는 링크 예측에 대한 설명을 생성하기 위해 임베딩 기반 경로 검색을 사용하여 지식 그래프의 설명 체계를 탐색합니다. 그러나 최근 신경 모델은 인상적인 성능을 얻었지만 투명성과 해석성에 한계가 있습니다. 일부 방법은 상호 운용성을 높이기 위해 논리적 규칙을 통합하여 블랙 박스 신경 모델과 상징적 추론을 결합합니다. 해석 가능성은 사람들이 예측을 신뢰하도록 설득 할 수 있습니다. 따라서 추가 작업은 해석 가능성으로 이동하고 예측 지식의 신뢰성을 향상시켜야합니다.

#### D. Scalability

Scalability is crucial in large-scale knowledge graphs. There is a trade-off between computational efficiency and model expressiveness, with a limited number of works applied to more than 1 million entities. Several embedding methods use simplification to reduce the computation cost, such as simplifying tensor products with circular correlation operation [20]. However, these methods still struggle with scaling to millions of entities and relations.

Probabilistic logic inference using Markov logic networks is computationally intensive, making it hard to scalable to large-scale knowledge graphs. Rules in a recent neural logical model [95] are generated by simple brute-force search, making it insufficient on large-scale knowledge graphs. ExpressGNN [96] attempts to use NeuralLP [93] for efficient rule induction. Nevertheless, there still has a long way to go to deal with cumbersome deep architectures and the increasingly growing knowledge graphs.

> 확장 성은 대규모 지식 그래프에서 매우 중요합니다. 계산 효율성과 모델 표현력 사이에는 절충안이 있으며, 100 만 개 이상의 항목에 제한된 수의 작업이 적용됩니다. 순환 상관 연산을 통해 텐서 곱을 단순화하는 것과 같은 여러 임베딩 방법은 단순화를 사용하여 계산 비용을 줄입니다 [20]. 그러나 이러한 방법은 여전히 수백만 개의 엔티티 및 관계로 확장하는 데 어려움을 겪고 있습니다.
>
> Markov 논리 네트워크를 사용한 확률 론적 논리 추론은 계산 집약적이므로 대규모 지식 그래프로 확장하기가 어렵습니다. 최근의 신경 논리 모델 [95]의 규칙은 단순한 무차별 대입 검색에 의해 생성되어 대규모 지식 그래프에서는 불충분합니다. ExpressGNN [96]은 효율적인 규칙 유도를 위해 NeuralLP [93]를 사용하려고합니다. 그럼에도 불구하고 번거로운 심층 아키텍처와 점점 증가하는 지식 그래프를 처리하기 위해 갈 길이 멀다.

#### E. Knowledge Aggregation

The aggregation of global knowledge is the core of knowledge-aware applications. For example, recommendation systems use a knowledge graph to model user-item interaction and text classification jointly to encode text and knowledge graph into a semantic space. Most current knowledge aggregation methods design neural architectures such as attention mechanisms and GNNs. The natural language processing community has been boosted from large-scale pre-training via transformers and variants like BERT models. At the same time, a recent finding [173] reveals that the pre-training language model on the unstructured text can acquire certain factual knowledge. Large-scale pre-training can be a straightforward way to injecting knowledge. However, rethinking the way of knowledge aggregation in an efficient and interpretable manner is also of significance.

> 글로벌 지식의 집합은 지식 인식 응용 프로그램의 핵심입니다. 예를 들어 추천 시스템은 지식 그래프를 사용하여 사용자 항목 상호 작용 및 텍스트 분류를 공동으로 모델링하여 텍스트와 지식 그래프를 의미 공간으로 인코딩합니다. 대부분의 최신 지식 집계 방법은주의 메커니즘 및 GNN과 같은 신경 아키텍처를 설계합니다. 자연어 처리 커뮤니티는 BERT 모델과 같은 변형 및 변환기를 통한 대규모 사전 교육을 통해 강화되었습니다. 동시에, 최근의 발견 [173]은 구조화되지 않은 텍스트에 대한 사전 훈련 언어 모델이 특정 사실적 지식을 얻을 수 있음을 보여줍니다. 대규모 사전 교육은 지식을 주입하는 간단한 방법이 될 수 있습니다. 그러나 효율적이고 해석 가능한 방식으로 지식 집계 방식을 재고하는 것도 중요합니다.

#### F. Automatic Construction and Dynamics

Current knowledge graphs rely highly on manual construction, which is labor-intensive and expensive. The widespread applications of knowledge graphs on different cognitive intelligence fields require automatic knowledge graph construction from large-scale unstructured content. Recent research mainly works on semi-automatic construction under the supervision of existing knowledge graphs. Facing the multimodality, heterogeneity, and large-scale application, automatic construction is still of great challenge.

The mainstream research focuses on static knowledge graphs, with several works on predicting temporal scope validity and learning temporal information and entity dynamics. Many facts only hold within a specific period. A dynamic knowledge graph, together with learning algorithms capturing dynamics, can address the limitation of traditional knowledge representation and reasoning by considering the temporal nature.

> 현재 지식 그래프는 노동 집약적이고 비용이 많이 드는 수동 구성에 크게 의존합니다. 다양한 인지 지능 분야에서 지식 그래프를 널리 적용하려면 대규모 비정형 콘텐츠에서 자동 지식 그래프 구성이 필요합니다. 최근 연구는 주로 기존 지식 그래프의 감독하에 반자동 건설에 관한 것입니다. 다중 모드, 이질성 및 대규모 응용 프로그램에 직면하여 자동 구성은 여전히 큰 도전입니다.
>
> 주류 연구는 정적 지식 그래프에 초점을 맞추고 있으며, 시간 범위 유효성을 예측하고 시간 정보 및 개체 역학을 학습하는 여러 작업을 수행합니다. 많은 사실은 특정 기간에만 유지됩니다. 역학을 포착하는 학습 알고리즘과 함께 동적 지식 그래프는 시간적 특성을 고려하여 전통 지식 표현 및 추론의 한계를 해결할 수 있습니다.


### VIII. CONCLUSION

Knowledge graphs as the ensemble of human knowledge have attracted increasing research attention, with the recent emergence of knowledge representation learning, knowledge acquisition methods, and a wide variety of knowledge-aware applications. The paper conducts a comprehensive survey on the following four scopes: 1) knowledge graph embedding, with a full-scale systematic review from embedding space, scoring metrics, encoding models, embedding with external information, and training strategies; 2) knowledge acquisition of entity discovery, relation extraction, and graph completion from three perspectives of embedding learning, relational path inference and logical rule reasoning; 3) temporal knowledge graph representation learning and completion; 4) real-world knowledge-aware applications on natural language understanding, recommendation systems, question answering and other miscellaneous applications. Besides, some useful resources of datasets and open-source libraries, and future research directions are introduced and discussed. Knowledge graph hosts a large research community and has a wide range of methodologies and applications. We conduct this survey to have a summary of current representative research efforts and trends and expect it can facilitate future research.

> 인간 지식의 앙상블로서의 지식 그래프는 최근 지식 표현 학습, 지식 습득 방법 및 다양한 지식 인식 응용 프로그램의 출현으로 연구 관심을 끌고 있습니다. 이 논문은 다음 네 가지 범위에 대한 포괄적 인 조사를 수행합니다. 1) 지식 그래프 임베딩, 임베딩 공간, 스코어링 메트릭, 인코딩 모델, 외부 정보 임베딩 및 훈련 전략에서 본격적인 체계적인 검토를 통해; 2) 임베딩 학습, 관계 경로 추론 및 논리적 규칙 추론의 세 가지 관점에서 엔티티 발견, 관계 추출 및 그래프 완성에 대한 지식 습득; 3) 시간적 지식 그래프 표현 학습 및 완료; 4) 자연어 이해, 추천 시스템, 질문 응답 및 기타 기타 응용 프로그램에 대한 실제 지식 인식 응용 프로그램. 또한 데이터 세트 및 오픈 소스 라이브러리의 유용한 리소스와 향후 연구 방향을 소개하고 논의합니다. 지식 그래프는 대규모 연구 커뮤니티를 호스팅하며 다양한 방법론과 응용 프로그램을 가지고 있습니다. 이 설문 조사를 수행하여 현재의 대표적인 연구 노력과 동향을 요약하고 향후 연구를 촉진 할 수있을 것으로 기대합니다.


\[끝\]
