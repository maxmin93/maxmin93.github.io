---
title: "KG2Vec: A node2vec-based vectorization model for knowledge graph (2021.3)"
date: 2020-12-03 00:00:00 +0000
categories: ["papers", "KG"]
tags: ["KG2Vec", "word2vec", "Knowledge graphs", "Heterogeneous Network", "Walk strategy", "triples"]
---

**`KG2Vec`: A node2vec-based vectorization model for knowledge graph (2021.3)**

YueQun Wang, LiYan Dong, XiaoQuan Jiang, XinTao Ma, YongLi Li, Hao Zhang

- link: [https://doi.org/10.1371/journal.pone.0248552](https://doi.org/10.1371/journal.pone.0248552)


### Abstract

Since the word2vec model was proposed, many researchers have vectorized the data in the research field based on it. In the field of social network, the Node2Vec model improved on the basis of word2vec can vectorize nodes and edges in social networks, so as to carry out relevant research on social networks, such as link prediction, and community division. However, social network is a network with homogeneous structure. When dealing with heterogeneous networks such as knowledge graph, Node2Vec will lead to inaccurate prediction and unreasonable vector quantization data. Specifically, in the Node2Vec model, the walk strategy for homogeneous networks is not suitable for heterogeneous networks, because the latter has distinguishing features for nodes and edges. In this paper, a Heterogeneous Network vector representation method is proposed based on random walks and Node2Vec, called `KG2vec` (Heterogeneous Network to Vector) that solves problems related to the inadequate consideration of the full-text semantics and the contextual relations that are encountered by the traditional vector representation of the knowledge graph. First, the knowledge graph is reconstructed and a new random walk strategy is applied. Then, two training models and optimizing strategies are proposed, so that the contextual environment between entities and relations is obtained, semantically providing a full vector representation of the Heterogeneous Network. The experimental results show that the `KG2VEC` model solves the problem of insufficient context consideration and unsatisfactory results of one-to-many relationship in the vectorization process of the traditional knowledge graph. Our experiments show that `KG2vec` achieves better performance with higher accuracy than traditional methods.

> word2vec 모델이 제안 된 이후 많은 연구자들이 이를 기반으로 연구 분야의 데이터를 벡터화 했습니다. 소셜 네트워크 분야에서는 word2vec을 기반으로 개선된 Node2Vec 모델이 소셜 네트워크의 노드와 에지를 벡터화 할 수 있어 링크 예측, 커뮤니티 분할 등 소셜 네트워크 관련 연구를 수행할 수 있습니다. 그러나 소셜 네트워크는 동일한 구조의 네트워크입니다. 지식 그래프와 같은 이기종 네트워크를 다룰 때 Node2Vec은 부정확한 예측과 불합리한 벡터 양자화 데이터로 이어질 것입니다. 특히 Node2Vec 모델에서 동종 네트워크에 대한 걷기 전략은 이기종 네트워크에 적합하지 않습니다. 후자는 노드와 에지에 대한 구별 기능을 가지고 있기 때문입니다. 이 논문에서 랜덤 워크와 Node2Vec을 기반으로 한 이기종 네트워크 벡터 표현 방법은 `KG2vec` (Heterogeneous Network to Vector)라고 불리며, 전체 텍스트 의미론에 대한 부적절한 고려와 기존의 벡터 표현이 직면 한 상황 관계와 관련된 문제를 해결합니다. 지식 그래프. 먼저 지식 그래프를 재구성하고 새로운 랜덤 워크 전략을 적용합니다. 그런 다음 두 가지 훈련 모델과 최적화 전략이 제안되어 엔티티와 관계 간의 컨텍스트 환경이 얻어지고 의미 론적으로 이기종 네트워크의 전체 벡터 표현을 제공합니다. 실험 결과 `KG2VEC` 모델은 전통 지식 그래프의 벡터화 과정에서 맥락 고려가 불충분하고 일대다 관계의 결과가 만족스럽지 못한 문제를 해결함을 보여준다. 우리의 실험은 `KG2vec`이 기존 방법보다 더 높은 정확도로 더 나은 성능을 달성한다는 것을 보여줍니다.


### 1. Introduction

Nowadays we reach an era that everything can be embedded, called representation learning. In many research fields, embedding models are adopted to vectorize the research data. For instance, in the field of natural language processing (NLP) [1], by embedding the words into the vector representation, we can determine a word’s synonym, or estimate the accuracy of the translation; in the field of bioinformatics, protein chain [2] or transcription factor [3]can be regarded as a network. By embedding the proteins into vectors, we can determine whether a chain bond exists; as in social network, by embedding social entities, link prediction can be performed. Therefore, many researchers have developed various 2vec models tailored to fields, such as word2vec [4] in NLPs, and Node2Vec [5] in social networks.

Currently, most heterogeneous information networks (HIN) measure the similarity between points by aiming at making dot products of two nodes as large as possible in low-dimensional space. This method can only consider first-order proximity, which is also mentioned in node2vec. Compared with homogeneous information network, heterogeneous information network contains multiple relationships, where each relationship has different types of semantic information, and the distribution of relationship types is very uneven.

For heterogeneous networks (i.e. Knowledge graphs), a more advanced algorithm represents the nodes and links as triples (head, relation, and tail). In KGs, we often project an entity to a low-dimensional vector h (or t) with dimension n, by considering the entity to be a node, and representing the relations as operations between nodes [6]. Therefore, a relational scoring function can be defined as fr(h,t), by minimizing the distance between fr and real r as the target. By iteratively updating h, the vector projection of r and t can be obtained.

The KG embedding algorithms like TransE [6], TransR [7] and TransG [8] are designed by this main idea. Although these algorithms are proved to be efficient in many scenarios, we notice that the trans-algorithms handle each triple with the same probability, lacking the emphasis as the 2vec models process the vectorization, resulting in unsatisfactory results. Taking the movie dataset as an example, the movie node A has relations with three actor nodes, one director node, and one country node, as shown in Fig 1. During the process of embedding, the influence of the country node and its relation is bound to be different from that of the director node.

> 오늘날 우리는 표현 학습이라고하는 모든 것이 내장될 수 있는 시대에 도달했습니다. 많은 연구 분야에서 연구 데이터를 벡터화하기 위해 임베딩 모델이 채택됩니다. 예를 들어, 자연어 처리 (NLP) 분야에서 단어를 벡터 표현에 삽입하여 단어의 동의어를 결정하거나 번역의 정확성을 추정할 수 있습니다. 생물 정보학 분야에서 단백질 사슬 또는 전사 인자는 네트워크로 볼 수 있다. 벡터에 단백질을 삽입하여 사슬 결합이 존재하는지 확인할 수 있습니다. 소셜 네트워크에서와 같이 소셜 엔티티를 삽입하여 링크 예측을 수행할 수 있습니다. 따라서 많은 연구자들이 word2vec와 같은 분야에 맞는 다양한 2vec 모델을 개발했습니다. NLP에서, Node2Vec 소셜 네트워크에서.
>
> 현재 대부분의 이기종 정보 네트워크 (HIN)는 저 차원 공간에서 두 노드의 내적을 최대한 크게 만드는 것을 목표로 포인트 간의 유사성을 측정합니다. 이 방법은 node2vec에서도 언급 된 1차 근접만 고려할 수 있습니다. 동종 정보 네트워크와 비교할 때 이기종 정보 네트워크는 여러 관계를 포함하며 각 관계는 서로 다른 유형의 의미 정보를 가지며 관계 유형의 분포는 매우 고르지 않습니다.
>
> 이기종 네트워크 (예 : 지식 그래프)의 경우 고급 알고리즘은 노드와 링크를 트리플 (헤드, 관계 및 테일)로 나타냅니다. KG 에서는 종종 저 차원 벡터에 엔티티 돌출 H (또는 t) 치수와 N을, 노드로 엔티티를 고려하고, 노드 간의 연산 등의 관계를 나타내는 의해. 따라서 관계형 스코어링 함수는 fr 과 실제 r 사이의 거리를 대상 으로 최소화하여 fr (h , t) 로 정의 할 수 있습니다. h 를 반복적으로 업데이트 하면 r과 t 의 벡터 투영을 얻을 수 있습니다.
>
> TransE, TransR 및 TransG 과 같은 KG 임베딩 알고리즘이 주요 아이디어로 설계되었습니다. 이러한 알고리즘은 많은 시나리오에서 효율적인 것으로 입증되었지만 트랜스 알고리즘은 동일한 확률로 각 트리플을 처리하고 2vec 모델이 벡터화를 처리할 때 강조하지 않아 만족스럽지 못한 결과를 초래합니다. 영화 데이터 세트를 예로 들어 영화 노드 A는 그림 1 과 같이 3 개의 배우 노드, 1 개의 감독 노드 및 1 개의 국가 노드와 관계가 있습니다. 임베딩 과정에서 국가 노드와 그 관계의 영향은 디렉터 노드의 영향과 다를 수 밖에 없습니다.

![Fig 1. A subgraph of Fig 4.](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.g001&type=large)

The trans-series algorithm can accurately predict 1-to-1 relation using triples, however, it has flaws in dealing with N-to-N, or 1-to-N. As shown in Fig 2, movie A is both directed and performed by B, meaning that there are two relation types between A and B, which cannot be trained using triples.

![Fig 2. 1-N relation in knowledge graph.](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.g002&type=large)

Taking 2vec and trans series algorithms into consideration, we aim to give certain weights to the triples in trans series by 2vec random walks [9], so that emphasis takes place during vectorization. However, the random walks in 2vec algorithms fail in heterogeneous networks. Besides, trans series using triples can neither give emphasis on different triples nor avoid the problem of multiple relations.

In this paper, the `KG2Vec` algorithm is proposed based on node2vec. Two challenges would appear if node2vec is directly applied to the vectorization of the heterogeneous networks: 1) heterogeneous networks are composed of entities (different types of nodes) and relations (different types of edges). For heterogeneous networks, the triple of form (head entity, relation, and tail entity) is the key to construct the node context. The node2vec algorithm neglects this key information, so that the quality of embedding is compromised. 2) Encountering the complexity of heterogeneous networks, the random walks strategy has to be adapted.

To solve the first problem, we propose to homogenize heterogeneous networks by abstracting the relation in heterogeneous networks to a new relation node and the node in heterogeneous networks to an entity node. Then we can use node2vec idea to train the reconstructed heterogeneous networks. However, the original random walks make no distinction between relation-type node and entity-type node, so the result is unsatisfactory.

Due to the natural advantages of heterogeneous network embedding (HNE) in application, which largely prevents the task performance from being attributed to effective data preprocessing and novel technical design, especially considering the various possible ways to build heterogeneous networks from the actual application data. As for heterogeneous networks, the 2vec random walks algorithm leading to the problem of inaccuracy embedding.

Thus, a new random walk strategy is proposed. The strategy learns the pattern “entity-relation-entity” as the main context. Therefore, we can find the most suitable context by this pattern in the reconstructed heterogeneous networks, as the input of this model.

Moreover, CBOW [10] and Skip-gram [11] are applied in the training process of `KG2Vec`, and the embedding of relation node and entity node are predicted. A parameter called node degree that adjusts the walk times is also introduced, in order to improve the quality and efficiency of the model.

> 2vec 및 trans 시리즈 알고리즘을 고려하여 2vec 랜덤 워크에 의해 trans 시리즈의 트리플에 특정 가중치를 부여하여 벡터화 중에 강조되도록 합니다. 그러나 2vec 알고리즘의 랜덤 워크는 이기종 네트워크에서 실패합니다. 게다가 트리플을 사용하는 트랜스 시리즈는 다른 트리플을 강조하거나 다중 관계의 문제를 피할 수 없습니다.
>
> 본 논문에서는 node2vec를 기반으로 `KG2Vec` 알고리즘을 제안한다. node2vec가 이기종 네트워크의 벡터화에 직접 적용되는 경우 두 가지 문제가 나타납니다. 1) 이기종 네트워크는 엔티티 (다른 유형의 노드)와 관계 (다른 유형의 에지)로 구성됩니다. 이기종 네트워크의 경우 삼중 형태 (헤드 엔터티, 관계 및 테일 엔터티)가 노드 컨텍스트를 구성하는 핵심입니다. node2vec 알고리즘은 이 주요 정보를 무시하므로 임베딩 품질이 손상됩니다. 2) 이기종 네트워크의 복잡성에 직면하여 랜덤 워크 전략을 조정해야합니다.
>
> 첫 번째 문제를 해결하기 위해 이기종 네트워크의 관계를 새로운 관계 노드로 추상화하고 이기종 네트워크의 노드를 엔티티 노드로 추상화하여 이종 네트워크를 균질화하는 것을 제안합니다. 그런 다음 node2vec 아이디어를 사용하여 재구성 된 이기종 네트워크를 훈련 할 수 있습니다. 하지만 원래 랜덤 워크는 관계형 노드와 엔티티 형 노드를 구분하지 않기 때문에 결과가 만족스럽지 않습니다.
>
> 특히 실제 애플리케이션 데이터에서 이기종 네트워크를 구축할 수 있는 다양한 방법을 고려할 때, 작업 성능이 효과적인 데이터 전처리 및 새로운 기술 설계에 기인하는 것을 크게 방해하는 애플리케이션에서 이기종 네트워크 임베딩 (HNE)의 자연스러운 이점으로 인해. 이기종 네트워크의 경우 2vec 랜덤 워크 알고리즘은 부정확한 임베딩 문제로 이어집니다.
>
> 따라서 새로운 랜덤 워크 전략이 제안됩니다. 이 전략은 "개체-관계-개체" 패턴을 주요 컨텍스트로 학습합니다. 따라서이 모델의 입력으로 재구성된 이기종 네트워크에서이 패턴에 의해 가장 적합한 컨텍스트를 찾을 수 있습니다.
>
> 또한 `KG2Vec` 의 학습 과정 에서는 CBOW 와 Skip-gram 을 적용하여 관계 노드와 엔티티 노드의 임베딩을 예측합니다. 모델의 품질과 효율성을 향상시키기 위해 보행 시간을 조정하는 노드 정도라는 매개 변수도 도입되었습니다.

The contributions of this paper are summarized as follows:

• The original heterogeneous networks are reconstructed, and an entity-relation topology is proposed.<br/>
• A new embedding method for heterogeneous networks is proposed and node2vec is improved. The new walk strategy is applied in the reconstructed heterogeneous networks. A node-degree parameter is also introduced to control the walk times.<br/>
• Two training models are proposed for heterogeneous networks: given relations, CBOW is used to predict the context entity; given entities, Skip-gram is used to predict the relation node.

> 이 백서의 기여는 다음과 같이 요약됩니다.
>
> • 원래의 이기종 네트워크가 재구성되고 엔티티 관계 토폴로지가 제안됩니다.<br/>
> • 이종 네트워크를위한 새로운 임베딩 방법이 제안되고 node2vec 가 개선됩니다. 새로운 걷기 전략은 재구성 된 이기종 네트워크에 적용됩니다. 걷기 시간을 제어하기 위해 node-degree 매개 변수도 도입되었습니다.<br/>
> • 이기종 네트워크에 대해 두 가지 훈련 모델이 제안됩니다. 관계가 주어지면 CBOW 가 컨텍스트 엔티티를 예측하는 데 사용됩니다. 주어진 엔티티에서 Skip-gram 은 관계 노드를 예측하는 데 사용됩니다.


### 2. Related work

This paper study the representation learning of heterogeneous information networks. In this chapter, the existing heterogeneous information network algorithm and the existing 2vec algorithm will be elaborated.

> 이 논문은 이기종 정보 네트워크의 표현 학습을 연구합니다. 이 장에서는 기존의 이기종 정보 네트워크 알고리즘과 기존 2vec 알고리즘에 대해 설명합니다.


#### 2.1 Heterogeneous network representation learning

A universal taxonomy is used for existing HNE algorithms with three categories based on their common objectives. The main challenge of instantiating on heterogeneous networks is the consideration of complex interactions regarding multi-typed links and higher order meta-paths. The HNE algorithm is mainly based on three ideas, including: Proximity-Preserving Methods, Message-Passing Methods and Relation-Learning Methods.

The goal of network embedding is to capture network topological information. This can be achieved by preserving different types of proximity among nodes. There are two major categories of proximity preserving methods in HNE: random walk-based approaches (inspired by DeepWalk) and first/second-order proximity based ones (inspired by LINE [12]). Metapath2vec [13] is one of the typical algorithms based on random walk, so does HIN2vec [14] algorithm. Metapath2vec utilizes the node paths traversed by meta-path guided random walks to model the context of a node regarding heterogeneous semantics. HIN2Vec considers the probability that there is a meta-path M between nodes u and v. SHNE [15] improves metapath2vec by incorporating additional node information. For such algorithms, it is generally necessary to establish a meta-path. However, one disadvantage of this path-based approach is that the path (pattern) needs to be specified (requiring more domain knowledge to do so). The first/second-order proximity-base algorithm includes PTE [16] algorithm, AspEm [17] algorithm, HEER algorithm and so on. PTE proposes to decompose a heterogeneous network into multiple bipartite networks, each of which describes one edge type. Its objective is the sum of log-likelihoods over all bipartite networks. AspEm assumes that each heterogeneous network has multiple aspects, and each aspect is defined as a subgraph of the network schema [18]. An incompatibility measure is proposed to select appropriate aspects for embedding learning. HEER extends PTE by considering typed closeness. Specifically, each edge type has an embedding.

> 범용 분류는 공통 목표를 기반으로하는 세 가지 범주가있는 기존 HNE 알고리즘에 사용됩니다. 이기종 네트워크에서 인스턴스화 할 때의 주요 과제는 다중 유형 링크 및 고차 메타 경로와 관련된 복잡한 상호 작용을 고려하는 것입니다. HNE 알고리즘은 주로 근접 보존 방법, 메시지 전달 방법 및 관계 학습 방법을 포함한 세 가지 아이디어를 기반으로합니다.
>
> 네트워크 임베딩의 목표는 네트워크 토폴로지 정보를 캡처하는 것입니다. 이는 노드간에 서로 다른 유형의 근접성을 유지함으로써 달성할 수 있습니다. HNE에는 두 가지 주요 범주의 근접성 보존 방법이 있습니다. 무작위 보행 기반 접근 방식 (DeepWalk에서 영감을 얻음)과 1차 / 2차 근접성 기반 접근 방식 (LINE 에서 영감을 얻음)입니다. Metapath2vec 은 랜덤 워크를 기반으로하는 일반적인 알고리즘 중 하나이며 HIN2vec 알고리즘도 마찬가지 입니다. Metapath2vec은 이기종 의미론에 관한 노드의 컨텍스트를 모델링하기 위해 메타 경로 안내 무작위 걷기에 의해 통과되는 노드 경로를 활용합니다. HIN2Vec은 노드 u 와 v 사이에 메타 경로 M이 있을 확률을 고려합니다. SHNE 는 추가 노드 정보를 통합하여 metapath2vec를 개선합니다. 이러한 알고리즘의 경우 일반적으로 메타 경로를 설정해야합니다. 그러나 이 경로 기반 접근 방식의 한 가지 단점은 경로 (패턴)를 지정해야 한다는 것입니다 (이를 수행하려면 더 많은 도메인 지식이 필요함). 1차 / 2차 근접 기반 알고리즘은 **PTE 알고리즘**, AspEm 알고리즘, HEER 알고리즘 등을 포함합니다. _PTE 는 이기종 네트워크를 여러이 분할 네트워크로 분해할 것을 제안합니다._ 각 네트워크는 하나의 에지 유형을 설명합니다. 목표는 모든 이분 네트워크에 대한 로그 가능성의 합계입니다. AspEm 은 각 이기종 네트워크가 여러 측면을 가지고 있다고 가정하고 각 측면은 네트워크 스키마의 하위 그래프로 정의됩니다. 임베딩 학습을위한 적절한 측면을 선택하기 위해 비 호환성 측정이 제안됩니다. HEER는 입력된 친밀성을 고려하여 PTE를 확장합니다. 특히 각 모서리 유형에는 임베딩이 있습니다.

For Message-Passing Methods, each node in a network can have attribute information represented as a feature vector. Message-passing methods aim to learn node embeddings based on the feature vector, by aggregating the information from u’s neighbors. In recent studies, Graph Neural Networks (GNNs) [19] are widely adopted to facilitate this aggregation/message-passing process. Different from regular GNNs, R-GCN [20] considers edge heterogeneity by learning multiple convolution matrices W’s, each corresponding to one edge type. During message passing, neighbors under the same edge type will be aggregated and normalized first. The node embedding is the output of the K-th layer. As the development of deep learning, in the field of graph feature representation, in addition to those traditional methods, deep learning methods have also been integrated, in order to embed node features. For instance, DKN [21] (Deep Knowledge-aware Network) embeds news titles through KG into vectorization, improving the accuracy. Besides, MKR [22], as well as in the recommendation systems, collaborates users and items into KG, adjusts RS and KG by taking the difference between the actual rate and the predicted rate as the loss function, thus regulating the user and item feature embedding.

For Relation-Learning Methods, we first highlight TransE and its variants (TransR [7] and TransG [8]) because they are simple and effective and can achieve the state-of-the-art performance in the majority of related tasks, especially in KGs with thousands of relations. TransE is one of the classic algorithms for KG embedding that was presented by Bordes et al in 2013. After this algorithm was presented, a series of algorithms were implemented, such as TransH [23], and TransG. Those traditional training methods introduce too many parameters when modelling the triples (head-relation-tail) in the knowledge base, leading to the low interpretability of the model and the overfitting problem during training. Meanwhile, TransE improved the cost function by introducing a reward and punishment mechanism, which maximized the prediction result by separating right from wrong as far as possible. Thus, it has remedied the problems related to complex training parameters and difficult expansions in traditional methods. TransE represents a relation as a vector r indicating the semantic translation from the head entity h to the tail entity t, aiming to satisfy the equation t−h≈r when triplet (h; r; t) holds.

Furthermore, Zheng Wang et al. propose TransH, which introduces two additional relation matrices compared to TransE related to the head and the tail. Instead of projecting the relations to another space, they use vectors to solve the difficulties of TransE in dealing with reflexive one-to-many many-to-one many-to-many relations. In addition, Guoling Ji et al improve TransE when encountering the link prediction problem using a method called TransD [24]. This algorithm defines the mapping matrices for every relation, thus improving the prediction accuracy and the computational complexity.

> 메시지 전달 방법의 경우 네트워크의 각 노드는 특성 벡터로 표현되는 속성 정보를 가질 수 있습니다. 메시지 전달 방법은 u의 이웃 정보를 집계하여 특징 벡터를 기반으로 노드 임베딩을 학습하는 것을 목표로 합니다. 최근 연구에서 GNN (Graph Neural Networks) 은 이러한 집계 / 메시지 전달 프로세스를 용이하게 하기 위해 널리 채택되었습니다. 일반 GNN과 다른 R-GCN 는 각각 하나의 에지 유형에 해당하는 다중 컨볼루션 행렬 W를 학습하여 에지 이질성을 고려합니다. 메시지 전달 중에 동일한 에지 유형 아래의 인접 항목이 먼저 집계되고 정규화 됩니다. 노드 임베딩은 K 번째 레이어의 출력입니다. 딥러닝의 발전으로 그래프 특성 표현 분야에서는 기존의 방법 외에도 노드 특성을 내장하기 위해 딥러닝 방법도 통합 되었습니다. 예를 들어 DKN (Deep Knowledge-aware Network)은 KG 를 통해 뉴스 제목을 벡터화에 삽입하여 정확도를 높입니다. 게다가 MKR 뿐만 아니라 추천 시스템에서도 사용자와 아이템을 KG 로 협업하고, 실제 요율과 예측 요율의 차이를 손실 함수로 취하여 RS 와 KG 를 조정하여 사용자 및 아이템 특성 임베딩을 규제합니다.
>
> 관계 학습 방법의 경우 TransE와 그 변형 (TransR 및 TransG)이 간단하고 효과적이며 대부분의 관련 작업, 특히 대부분의 관련 작업에서 최첨단 성능을 달성 할 수 있기 때문에 먼저 강조 표시 합니다. 수천 개의 관계를 가진 KGs에서. 이 알고리즘은 예 TransH [같이, 일련의 알고리즘을 구현하고, 제시 한 후 TransE 2013 년 Bordes 등에 의해 발표되었다 KG 임베딩 고전 알고리즘 중 하나 (23)] 및 TransG. 이러한 전통적인 훈련 방법은 지식 기반에서 트리플 (head-relation-tail)을 모델링 할 때 너무 많은 매개 변수를 도입하여 모델의 해석 가능성이 낮아지고 훈련 중에 과적 합 문제가 발생합니다. 한편 TransE는 보상 및 처벌 메커니즘을 도입하여 비용 기능을 개선했으며, 이는 가능한 한 옳고 그름을 분리하여 예측 결과를 극대화했습니다. 따라서 복잡한 훈련 매개 변수 및 기존 방법의 어려운 확장과 관련된 문제를 해결했습니다. TransE는 삼중항 (h; r; t)이 성립할 때 방정식 t - h ≈ r 을 만족시키기 위해 헤드 엔티티 h에서 꼬리 엔티티 t 로의 의미론적 변환을 나타내는 벡터 r로 관계를 나타냅니다 .
>
> 또한 Zheng Wang et al. 머리와 꼬리와 관련된 TransE에 비해 두 개의 추가 관계 행렬을 도입하는 TransH 를 제안합니다. 관계를 다른 공간에 투영하는 대신 벡터를 사용하여 반사적 인 일대다 다대일 다대다 관계를 처리할 때 TransE의 어려움을 해결합니다. 또한 Guoling Ji 등은 TransD 라는 방법을 사용하여 링크 예측 문제에 직면했을 때 TransE 를 개선 합니다. 이 알고리즘은 모든 관계에 대한 매핑 행렬을 정의하여 예측 정확도와 계산 복잡성을 개선합니다.


#### 2.2 2Vec algorithm research

First, we review Word2vec and its extensions. Since Mikolov proposed the concept word embedding in his paper” Efficient Estimation of Word Representation in Vector Space” in 2013, the NLP field enters the world of “embedding”, such as Senternce2Vec [25], Doc2Vec [26], and Everthing2Vec. The word embedding is based on the assumption that the meaning of a word can be inferred from its context, proposing the word distributed representation. Compared with traditional One-hot Representation in NLP, which is high-dimensional and sparse, the word embedding trained by Word2Vec is both low-dimensional and dense. The main idea of Word2Vec is to make use of word context and yield richer semantic information. The current main applications are listed as follows:

1. The trained word embedding is used as the input feature to improve the existing system, for instance the input layer of neural networks such as sentiment analysis, part-of-speech tagging, natural language translation.<br/>
2. The word embedding is directly adopted from the perspective of linguistics, for instance, expressing the word similarity based on the distance of embeddings, and the query correlation. Word2vec employs a one-layer neural network (i.e. CBOW) to project the one-hot sparse word embedding to a n-dimensional dense vector.

Later, Word2vec has been transplanted in social networks. A.Grover designed a Node2vec model, which employs a weight parameter α, to control the random walks in Deepwalk, so that the resulting sequence is a combination of DFS and BFS [27]. This model makes use of Skip-gram in Word2vec as basis. The main contribution of Node2vec is considering a graph as a text, where the nodes in the graph can be represented by tokens in the text. Then Word2vec can be directly applied to yield vectors. However, the difference between graphs and texts lies in that texts are linear sequences, as graph has a more complex structure. The algorithm Deepwalk that was put forward before inspires Node2vec, which combines DFS and BFS as walk strategy to sample the nodes in graph. As Figure shows, BFS yields Local microscopic view, as DFS yields global macroscopic view. Node2vec introduces a heuristic approach 2nd-order random walks, namely defining random walks and two hyper parameters [28].

> 먼저 Word2vec과 그 확장을 검토합니다. Mikolov가 2013 년에 그의 논문 "벡터 공간에서 단어 표현의 효율적인 추정"에서 개념 단어 임베딩을 제안한 이후 NLP 필드는 Senternce2Vec, Doc2Vec 및 Everthing2Vec 과 같은 "임베딩"의 세계로 진입합니다. 단어 임베딩은 단어의 의미가 문맥에서 유추 될 수 있다는 가정에 기반하여 단어 분산 표현을 제안합니다. 고차원적이고 희소 한 NLP의 전통적인 One-hot Representation 과 비교할 때 Word2Vec 에서 훈련 된 단어 임베딩은 저 차원이며 밀도가 높습니다. Word2Vec 의 주요 아이디어는 단어 컨텍스트를 사용하고 더 풍부한 의미 정보를 생성하는 것입니다. 현재 주요 응용 프로그램은 다음과 같습니다.
>
> 1. 훈련 된 단어 임베딩은 감정 분석, 품사 태깅, 자연어 번역과 같은 신경망의 입력 계층과 같은 기존 시스템을 개선하기위한 입력 기능으로 사용됩니다.<br/>
> 2. 임베딩이라는 단어는 언어학의 관점에서 직접 채택됩니다. 예를 들어 임베딩 거리 및 쿼리 상관 관계를 기반으로 단어 유사성을 표현합니다. Word2vec은 1- 레이어 신경망 (예 : CBOW)을 사용하여 1-핫 희소 단어 임베딩을 n 차원 밀도 벡터에 투영합니다.
>
> 나중에 Word2vec은 소셜 네트워크에 이식되었습니다. A.Grover 는 결과 시퀀스 DFS와 BFS [의 조합되도록, Deepwalk에서 무작위 행보를 제어하기 위해 가중 파라미터 α를 이용하는 Node2vec 모델 설계 (27)]. 이 모델은 Word2vec의 Skip-gram을 기본으로 사용합니다. Node2vec의 주요 기여는 그래프를 텍스트로 고려하는 것입니다. 그래프의 노드는 텍스트의 토큰으로 표시될 수 있습니다. 그런 다음 Word2vec을 직접 적용하여 벡터를 생성할 수 있습니다. 그러나 그래프와 텍스트의 차이점은 그래프가 더 복잡한 구조를 가지고 있기 때문에 텍스트가 선형 시퀀스라는 점에 있습니다. 이전에 제시된 알고리즘 Deepwalk는 DFS와 BFS를 워크 전략으로 결합하여 그래프에서 노드를 샘플링하는 Node2vec에 영감을줍니다. 그림에서 알 수 있듯이 BFS는 DFS가 전역 거시적 보기를 생성하므로 로컬 현미경 보기를 생성합니다. Node2vec은 휴리스틱 방식의 2차 랜덤 워크, 즉 랜덤 워크와 두 개의 하이퍼 매개 변수를 정의합니다.

Fig 3 shows the transition probability process of Node2Vec. The better the random walk is, the more appropriate context the algorithm finds, and the more efficient it is. Eq 1 is used to calculate the skip probability of Node2vec.

> 그림 3 은 Node2Vec의 전환 확률 프로세스를 보여줍니다. 랜덤 워크가 좋을수록 알고리즘이 더 적절한 컨텍스트를 찾고 더 효율적입니다. Eq 1 은 Node2vec의 건너 뛰기 확률을 계산하는 데 사용됩니다.

![Eq.1](https://journals.plos.org/plosone/article/file?type=thumbnail&id=info:doi/10.1371/journal.pone.0248552.e001) (1)

where πvx represents the skip probability between social nodes, and z is a normalization parameter.

![Fig 3. The transition probability process of Node2Vec.](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.g003&type=large)

Conversely, in Deepwalk, which is another embedding algorithm, the skip probability equals the weights that are labelled on the edges between nodes, such as πvx = Wvx The bias parameter influences Node2vec in the way that it regularizes the random walk and balances the BFS and DFS, thereby equipping the under-predicted nodes with better context.

> 반대로, 또 다른 임베딩 알고리즘 인 Deepwalk에서 건너 뛰기 확률은 π vx = W vx 와 같이 노드 사이의 가장자리에 레이블이 지정된 가중치와 동일합니다. 바이어스 매개 변수는 무작위 걷기를 정규화하고 균형을 맞추는 방식으로 Node2vec에 영향을줍니다. BFS 및 DFS를 통해 예측이 부족한 노드에 더 나은 컨텍스트를 제공합니다.

![Eq.2](https://journals.plos.org/plosone/article/file?type=thumbnail&id=info:doi/10.1371/journal.pone.0248552.e002) (2)

In Eq 2, p and q are used to adjust the walks, and dsx represents the smallest distance between s and x, which has the largest value of 2. Supposing the current node is v and the last hop is s, the parameter p defines the probability of jumping back. It can be concluded that the higher the probability of jumping back is, the more likely the random walk is to be a BFS. In contrast, parameter q determines the likelihood of a DFS. The skip probability of Node2Vec can be represented as (3):

> 에서는 수학 식 (2) , P 와 Q는 (가) 안내하고 조절하는 데 사용되는 차원 SX은 간의 최소 거리를 나타내고, S 및 X 현재 노드를 가정하면 (2)의 최대 값이 있고, V 와 마지막 홉이 들 , 파라미터 P를 뒤로 점프 할 확률을 정의합니다. 뒤로 점프 할 확률이 높을수록 랜덤 워크가 BFS가 될 가능성이 더 높다는 결론을 내릴 수 있습니다. 반대로 매개 변수 q 는 DFS의 가능성을 결정합니다. Node2Vec의 건너 뛰기 확률은 (3)으로 나타낼 수 있습니다.

![Eq.3](https://journals.plos.org/plosone/article/file?type=thumbnail&id=info:doi/10.1371/journal.pone.0248552.e003) (3)

However, applying 2vec model causes the loss of link meaning between nodes for heterogenous networks. Thus, in the field of KG representation, trans series are mostly used to embed entities and relations.

> 그러나 2vec 모델을 적용하면 이기종 네트워크에 대한 노드 간의 링크 의미가 손실됩니다. 따라서 KG 표현 분야에서 트랜스 시리즈는 주로 엔티티와 관계를 포함하는 데 사용됩니다.


### 3. `KG2Vec`

#### 3.1 Problem definitions

The walk strategy highlights the importance of nodes. If we extract the relation features between nodes, the interpretation of the node embedding can be improved. Besides, we also introduce the importance degree of nodes, improving the accuracy of embedding. In this section, we first present the reconstruction of homogeneous networks, and then the improved walk strategy.<br/>
<br/>
First, we introduce some common symbols: a traditional homogeneous network includes entities, semantics, contents, attributes, relations, etc., where the first four factors constitute the nodes in the KG and the last factor is represented as the links among those nodes. A homogeneous network is expressed by triples G = (E, R, S), where E represents the set of entities that are nodes in the graph where E = {e1, e2, e3……,e|E|}; R represents the set of relations that are represented as edges where R = {r1, r2, r3……,r|R|}; and S represents the triples “entity-relation-entity” where S∈E×R×E, meaning that an edge links two nodes. The homogeneous networks are homogenized by reconstructing the original G into G’ = (E,R,W), where E represents the set of entities as in G, R represents the set of relation nodes that are extracted from the original R in G, and W represents the links weight either between an entity node and relation nodes or between entity nodes.

> 걷기 전략은 노드의 중요성을 강조합니다. 노드 간의 관계 특성을 추출하면 노드 임베딩의 해석이 향상될 수 있습니다. 또한 노드의 중요도를 소개하여 임베딩의 정확도를 높입니다. 이 섹션에서는 먼저 동종 네트워크의 재구성과 개선 된 보행 전략에 대해 설명합니다.<br/>
> <br/>
> 먼저 몇 가지 공통 기호를 소개합니다. 기존의 동종 네트워크에는 엔티티, 의미론, 내용, 속성, 관계 등이 포함됩니다. 여기서 처음 4 개의 요소는 KG의 노드를 구성하고 마지막 요소는 해당 노드 간의 링크로 표시됩니다. 동종 네트워크는 트리플 G = (E, R, S)로 표현됩니다. 여기서 E 는 E = {e1, e2, e3 ……, e | E |} 인 그래프에서 노드 인 엔티티 집합을 나타냅니다. R 은 R = {r1, r2, r3 ……, r | R |} 인 가장자리로 표시되는 관계 집합을 나타냅니다. 그리고 S는 트리플 "엔티티 - 관계 - 엔티티"를 나타냅니다 S∈E × R × E 의미하는 에지 링크 두 개의 노드. 동종 네트워크는 원래 G 를 재구성하여 동질화됩니다.G 'E 됨 같은 엔티티들의 집합 나타낸다 = (E, R, W)에 G를 , R은 원본으로부터 추출되는 관계형 노드 세트 나타내는 R 의 G를 하고, W는 엔티티간에 하나의 링크 가중치를 나타낸다 노드 및 관계 노드 또는 엔티티 노드 간.


#### 3.2 Heterogeneous network reconstruction

As mentioned above, the link between nodes has the same type and meaning, thus the walk process can be interpreted. However, as a kind of heterogeneous network, the walk process has to be entitled with real meanings in order to get the importance of nodes and relations.

To unify the meaning of links, we need to reconstruct the heterogeneous network. To be specific, the reconstruction process is transforming the triples into three tuples. That means, we treat a link also as a node, so that in the original homogeneous networks, one link can be separated into three to form a triangle, namely a link between entities, a link between an entity and a relation, a link between a relation and an entity. One thing to notice is that these links without any real meaning, record only the frequency of the original link. Now we define the reconstruction of heterogeneous networks.

There are two types of nodes in the reconstructed heterogeneous network G’: relation nodes and entity nodes. No link is presented between relation nodes, while ordinary links are presented between relation nodes and entity nodes. There might be links between entity nodes.

After reconstructing Fig 4, the structure is obtained in Fig 5.

> 위에서 언급했듯이 노드 간의 연결은 동일한 유형과 의미를 가지므로 걷기 과정을 해석 할 수 있습니다. 그러나 일종의 이기종 네트워크로서 노드와 관계의 중요성을 얻기 위해서는 워크 프로세스가 실제 의미를 부여 받아야합니다.
>
> 링크의 의미를 통일하기 위해서는 이기종 네트워크를 재구성해야합니다. 구체적으로 말하면, 재구성 프로세스는 트리플을 3 개의 튜플으로 변환합니다. 즉, 링크도 노드로 취급하므로 원래의 동종 네트워크에서는 하나의 링크가 세 개로 분리되어 삼각형, 즉 엔티티 간의 링크, 엔티티와 관계 간의 링크, 관계와 엔티티. 주의해야 할 점은 이러한 링크가 실제 의미없이 원래 링크의 빈도 만 기록한다는 것입니다. 이제 우리는 이기종 네트워크의 재구성을 정의합니다.
>
> 재구성 된 이기종 네트워크 G '에는 관계 노드와 엔티티 노드의 두 가지 유형의 노드가 있습니다. 관계 노드 사이에는 링크가 표시되지 않지만 관계 노드와 엔티티 노드 사이에는 일반 링크가 표시됩니다. 엔티티 노드간에 링크가 있을 수 있습니다.
>
> 그림 4를 재구성 한 후 구조는 그림 5 에서 얻을 수 있습니다.

![그림 4. 사용자 영화의 지식 그래프.](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.g004&type=large)

![그림 5. 사용자 영화에 대한 간단한 지식 그래프 1.](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.g005&type=large)

In order to better illustrate the process of network reconfiguration, a simple knowledge graph is used to show the reconfiguration process. Fig 6 left shows a traditional structure of the heterogeneous network: A is the movie title, B and C are the actors, C is also the director, B and C has a conjugal relationship, D scores C is 3.

> 네트워크 재구성 프로세스를 더 잘 설명하기 위해 간단한 지식 그래프를 사용하여 재구성 프로세스를 표시합니다. 왼쪽 그림 6 은 이종 네트워크의 전통적인 구조를 보여줍니다. A 는 영화 제목, B 와 C 는 배우, C 는 감독, B 와 C 는 부부 관계, D 점수 C 는 3 입니다.

![Fig 6. Reconstructed knowledge graph.](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.g006&type=large)

The traditional representation of heterogeneous network (such as knowledge graph) as triples (h,t,r) is:

> 이기종 네트워크 (예 : 지식 그래프)를 트리플 (h, t, r)로 표현하는 기존 방식은 다음과 같습니다.

![Eq.4](https://journals.plos.org/plosone/article/file?type=thumbnail&id=info:doi/10.1371/journal.pone.0248552.e004)

After the reconstruction, the heterogeneous network (such as knowledge graph) is represented in Fig 6 right as:

> 재구성 후 이기종 네트워크 (예 : 지식 그래프)는 그림 6에 다음 과 같이 표시됩니다.

![Eq.5](https://journals.plos.org/plosone/article/file?type=thumbnail&id=info:doi/10.1371/journal.pone.0248552.e005)

As shown in the right part of Fig 6, the reconstructed heterogeneous network (such as knowledge graph) is a homogenous network.

We can see that in the original triple, we cannot identify the different importance of entity B and C to entity A. However, after the dissemblance of the entity and the relation, the entity pair (C,A) appears more frequently than the pair (C,B), highlighting the influence weight of entity C to A. Therefore, we entitle the links in the reconstructed homogenous network with weights, which is the frequency of the entity pair.

> 그림 6 의 오른쪽 부분에서 볼 수 있듯이 재구성 된 이기종 네트워크 (예 : 지식 그래프)는 동종 네트워크입니다.
>
> 원래의 트리플에서는 엔티티 B 와 C 가 엔티티 A 와 다른 중요성을 식별할 수 없다는 것을 알 수 있습니다. 그러나 엔티티와 관계의 불일치 이후 엔티티 쌍 (C, A)이 쌍 (C, B)보다 더 자주 나타나 엔티티 C 가 A에 미치는 영향 가중치를 강조합니다. 따라서 재구성 된 동종 네트워크의 링크에 엔티티 쌍의 빈도인 가중치를 부여합니다.

![Eq.6](https://journals.plos.org/plosone/article/file?type=thumbnail&id=info:doi/10.1371/journal.pone.0248552.e006)


#### 3.3 Walk strategy

Since the links in the homogenous network are endowed with the same meaning, sequence walks can be used to simulate the importance of nodes. However, common homogenous network only has one type of node, while the reconstructed network has two type of nodes, namely entity node and relation node. Thus, we need to alter the walk strategy as well. Compared with normal social network, KG has a special pattern that nodes exist with a sequence “entity-relation-entity”. We can set the new walk strategy according to this pattern.

In the Node2Vec model, a parameter α is employed to balance DFS and BFS. In this paper, this idea is inherited in the proposed `KG2Vec` model, yet altering the setting of walking parameters p and q. Now, different random walks are proposed for different types of nodes.

> 동종 네트워크의 링크에는 동일한 의미가 부여되므로 시퀀스 워크를 사용하여 노드의 중요성을 시뮬레이션 할 수 있습니다. 그러나 공통 동종 네트워크에는 한 가지 유형의 노드 만 있고 재구성 된 네트워크에는 두 가지 유형의 노드, 즉 엔티티 노드와 관계 노드가 있습니다. 따라서 우리는 보행 전략도 변경해야합니다. 일반 소셜 네트워크와 비교하여 KG는 노드가“entity-relation-entity”시퀀스로 존재하는 특별한 패턴을 가지고 있습니다. 이 패턴에 따라 새로운 걷기 전략을 설정할 수 있습니다.
>
> Node2Vec 모델에서는 매개 변수 α 를 사용하여 DFS와 BFS의 균형을 맞춥니다. 이 논문에서이 아이디어는 제안된 `KG2Vec` 모델에서 계승되지만 보행 매개변수 p 및 q 의 설정을 변경합니다. 이제 다른 유형의 노드에 대해 다른 랜덤 워크가 제안됩니다.


##### 3.3.1 Entity nodes.

As shown in Fig 7, it is supposed that the current node is the entity node S1, which can be reached from the relation node R2. As the next jump transition, there are three situations that could happen. The corresponding probabilities are as follows.

1. Jumping back to the last relation node R2 is meaningless for analysing a heterogeneous network, and hence the probability is 0.
2. Jumping to another connected relation node R1 is exactly what we want, as illustrated in hypothesis 1, and hence, the probability is 1.
3. Jumping to another connected entity node S2 is abnormal, and hence, the probability is set to 1/q.

> 그림 7에 도시된 바와 같이, 현재 노드는 관계 노드 (R2)에서 도달할 수 있는 엔티티 노드 (S1)라고 가정한다. 다음 점프 전환으로 발생할 수 있는 세 가지 상황이 있습니다. 해당 확률은 다음과 같습니다.
>
> 1. 마지막 관계 노드 R2로 다시 점프 하는 것은 이기종 네트워크를 분석하는 데 의미가 없으므로 확률은 0입니다.
> 2. 다른 연결된 관계 노드 R1로 점프하는 것은 가설 1에 설명 된 것처럼 정확히 원하는 것이므로 확률은 1입니다.
> 3. 다른 연결된 엔티티 노드 S2로 점프하는 것은 비정상이므로 확률은 1 / q로 설정됩니다 .

![Fig 7. Entity node transition probability.](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.g007&type=large)

The skip parameter α of entity nodes is summarized as Eq 4:

> 스킵 파라미터 α 엔티티 노드는 다음과 같이 요약 식 (4) :

![Eq.7](https://journals.plos.org/plosone/article/file?type=thumbnail&id=info:doi/10.1371/journal.pone.0248552.e007) (4)

where α is the skip parameter; q is the training parameter; dtx represents the shortest path between nodes t and x, which satisfies second-order Markov model; and the value of dtx is located in the set of {0,1,2}.

> 여기서 α 는 건너뛰기 매개 변수입니다. q 는 훈련 매개변수입니다. dtx 는 노드 t와 x 사이의 최단 경로를 나타내며 2차 Markov 모델을 만족합니다. dtx 의 값은 {0,1,2} 집합에 있습니다.


##### 3.3.2 Relation nodes.

Supposing the current node belongs to the relation type and, according to Hypothesis 1, relation nodes can only be connected to entity nodes. As shown in Fig 8, the current node is R, and the last node is S1. The next transition of node R includes three situations.

1. Jumping back to the last node S1 does not exist in the heterogeneous network, and hence the probability is 0.
2. Jumping to the node S2 that is connected with the last node S1 constitutes the logical sequence “entity-relation-entity”, which is exactly as expected in hypothesis 1, and hence the probability 1.
3. Jumping to another connected entity node S3 constitutes the logical sequence “entity-relation” and “relation-entity” which could happen but is unexpected and hence the probability is set to 1/p.

> 현재 노드가 관계 유형에 속하고 가설 1에 따라 관계 노드는 엔티티 노드에만 연결될 수 있다고 가정합니다. 그림 8 에서 볼 수 있듯이 현재 노드는 R 이고 마지막 노드는 S1 입니다. 노드 R의 다음 전환에는 세 가지 상황이 포함됩니다.
>
> 1. 마지막 노드 S1로 다시 점프 하는 것은 이기종 네트워크에 존재하지 않으므로 확률은 0 입니다.
> 2. 마지막 노드 S1과 연결된 노드 S2로 점프하는 것은 논리 시퀀스 "entity-relation-entity"를 구성하며, 이는 가설 1에서 예상 한 것과 정확히 일치하므로 확률 1입니다.
> 3. 다른 연결된 엔티티 노드 S3로 점프하는 것은 발생할 수 있지만 예상치 못한 논리적 시퀀스 "entity-relation"및 "relation-entity"를 구성하므로 확률은 1 / p로 설정됩니다 .

![Fig 8. Relation node transition probability.](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.g008&type=large)

The skip parameter α of the relation nodes is summarized as Eq 5:

> 관계 노드의 스킵 파라미터 α는 다음과 같이 요약 식 (5) :

![Eq.05](https://journals.plos.org/plosone/article/file?type=thumbnail&id=info:doi/10.1371/journal.pone.0248552.e008) (5)

where α is the skip parameter, p is the training parameter, dtx represents the shortest path between nodes t and x satisfying the second-order Markov model, and the value of dtx is located in the set {0,1,2}.

The skip probability of `KG2Vec` can be represented as Eq 6:

> 여기서 α는 스킵 파라미터이며, P는 트레이닝 파라미터이고 DTX는 노드 사이의 최단 경로를 나타내고, t 및 X 2 차 마르코프 모델을 만족을, 그리고 값 DTX는 집합 {0,1,2}에 위치한다.
>
> KG2Vec의 스킵 확률은 Eq 6 으로 표현할 수 있습니다 .

![Eq.06](https://journals.plos.org/plosone/article/file?type=thumbnail&id=info:doi/10.1371/journal.pone.0248552.e009) (6)


#### 3.4 Training model

Originally, Node2vec was inspired by Word2vec, which integrates NLP into social networks. Moreover, `KG2Vec`, which is based on Node2vec, deals especially with a heterogeneous network, which is a complex HIN. In comparison, Node2vec, which was proposed by Aditya, uses skip-gram for training. While the Word2vec training method is divided into the CBOW and skip-gram. Our `KG2Vec` combines those two methods to achieve better performance.

Additionally, there are two purposes of Word2vec: one is to predict the centre word given context, and the other is to predict the context given the centre word [29]. For the first situation, the CBOW is applied to perform the prediction, and skip-gram is applied for the second situation. However, in a heterogeneous network, the input sequence should obey the mode of “entity-relation-entity”.

Similarly, we could use different algorithms under different circumstances. For those relation nodes, the skip-gram is applied to predict the entity nodes of the context of the sgiven relation nodes and CBOW is applied to predict the relation nodes given the context of entity nodes. The same strategy is used for entity nodes to predict context and centre words. The following Fig 9 shows the prediction algorithm of `KG2Vec` for entity nodes and relation nodes.

> 원래 Node2vec은 NLP를 소셜 네트워크에 통합하는 Word2vec에서 영감을 받았습니다. 또한 Node2vec 기반의 `KG2Vec`은 특히 복잡한 HIN 인 이종 네트워크를 다룹니다. 이에 비해 Aditya가 제안한 Node2vec은 훈련을 위해 skip-gram을 사용합니다. Word2vec 교육 방법은 CBOW와 skip-gram으로 구분됩니다. 우리의 `KG2Vec`은 더 나은 성능을 달성하기 위해이 두 가지 방법을 결합합니다.
>
> 또한 Word2vec에는 두 가지 목적이 있습니다. 하나는 문맥이 주어진 중심 단어를 예측하는 것이고 다른 하나는 중심 단어 [ 29 ]가 주어진 문맥을 예측하는 것 입니다. 첫 번째 상황에서는 CBOW를 적용하여 예측을 수행하고 두 번째 상황에서는 skip-gram을 적용합니다. 그러나 이기종 네트워크에서 입력 시퀀스는 "entity-relation-entity"모드를 따라야합니다.
>
> 마찬가지로, 우리는 다른 상황에서 다른 알고리즘을 사용할 수 있습니다. 이러한 관계 노드의 경우 스킵 그램이 적용되어 주어진 관계 노드의 컨텍스트의 엔티티 노드를 예측하고 CBOW 를 적용하여 엔티티 노드의 컨텍스트가 주어진 관계 노드를 예측합니다. 동일한 전략이 엔터티 노드에서 컨텍스트 및 중심 단어를 예측하는 데 사용됩니다. 다음 그림 9 는 엔티티 노드와 관계 노드에 대한 `KG2Vec`의 예측 알고리즘을 보여줍니다.

![Fig 9. The `KG2Vec` model (a. the prediction of the relation using the CBOW, b. the prediction of the entity using the CBOW, c. the prediction of the entity’s context using Skip-gram, and d. the prediction of the relation’s context with Skip-gram).](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.g009&type=large)


#### 3.5 Optimizing random walks

To improve the accuracy and efficiency of the random walks, a parameter that expresses the influence of nodes is proposed. In Node2vec, no such parameter is taken into account, and it treats every node as equivalent, consequently lowering the quality of the sample data.

Therefore, the node degree is defined as the influence parameter. That is, nodes with higher influence would have more walks, and contrarily, nodes with lower influence would have fewer walks [30]. Additionally, a threshold is introduced to limit the upper bound of the walks. That is, when the node degree reaches this threshold, the maximum number of walks is used to train the model, and when the node degree is below this threshold, the number of walks is reduced according to the proportion of the influence. In conclusion, we define the walks Np for node p as Eq 7:

> 랜덤 워크의 정확성과 효율성을 높이기 위해 노드의 영향을 표현하는 매개 변수를 제안합니다. Node2vec에서는 이러한 매개 변수가 고려되지 않으며 모든 노드를 동등하게 취급하므로 결과적으로 샘플 데이터의 품질이 저하됩니다.
>
> 따라서 노드 정도는 영향 매개 변수로 정의됩니다. 즉, 영향력이 높은 노드는 더 많은 보행을 가지며, 반대로 영향력이 낮은 노드는 더 적은 보행을가집니다 [ 30 ]. 또한 걷기의 상한선을 제한하기 위해 임계값이 도입되었습니다. 즉, 노드 정도가 이 임계 값에 도달하면 최대 보행 횟수를 모델 학습에 사용하고, 노드 정도가 이 임계 값 미만이면 영향 비율에 따라 보행 횟수를 줄입니다. 결론적으로, 우리는 노드 p에 대한 walks Np 를 Eq 7 로 정의합니다 .

![Eq.07](https://journals.plos.org/plosone/article/file?type=thumbnail&id=info:doi/10.1371/journal.pone.0248552.e010) (7)

where Nmax is the maximum number of walks, Dp is the degree of node p, Dmax is the maximum degree among all the nodes, and t is the threshold.

Algorithm 1 is the pseudo code of `KG2Vec`. First, the walks Nmax are updated according to each node degree. Then, the learning process is optimized by simulating the random walk with an Nmax of length l from each node u, which neutralizes the implicit bias, and by calculating the transition probability, which complements the walking sequence as the selection of node context. Then, according to the type of the current node, which is either an entity node or relation node, we choose an appropriate random walk strategy as discussed before. After the context is obtained, we apply the SGD to simulate random walks and optimize the process. Thus, the algorithm is shown as follows.

> 여기서 N max 는 최대 보행 횟수, D p 는 노드 p 의 정도 , D max 는 모든 노드 간의 최대 정도, t 는 임계 값입니다.
>
> 알고리즘 1은 `KG2Vec`의 의사 코드입니다. 첫째, Walks N max 는 각 노드 정도에 따라 업데이트 됩니다. 그런 다음 암묵적 편향을 무력화하는 각 노드 u 에서 길이 l 의 N max 로 랜덤 걷기를 시뮬레이션하고 노드 컨텍스트의 선택으로 걷기 시퀀스를 보완하는 전환 확률을 계산하여 학습 프로세스를 최적화 합니다. 그런 다음 엔티티 노드 또는 관계 노드인 현재 노드의 유형에 따라 앞서 논의한대로 적절한 랜덤 워크 전략을 선택합니다. 컨텍스트를 얻은 후 SGD를 적용하여 랜덤 워크를 시뮬레이션하고 프로세스를 최적화합니다. 따라서 알고리즘은 다음과 같이 표시됩니다.

![Algorithm1 The KG2Vec algorithm](/2020/12/KG2Vec_algorithm.png)


### 4. Experiment

#### 4.1 Data set

Two data sets, which are common KG data: WordNet and Freebase, are used. WordNet is a lexical database. In WordNet, an entity is composed of one or several words, forming a synset. A single word can belong to different synsets. The relation between synset includes hypernym, hyponym, mer, hol, and troponym relationships. Freebase is a large collaborative knowledge graph that contains common world facts. WN18 [31] and FB15K-237 [32] are employed in Wordnet to evaluate the Recall. In addition, WN18 dataset is employed to evaluate the link prediction meanRank value.

Table 1 shows the basic parameters and settings of the above five data sets.

> 공통 KG 데이터 인 WordNet 및 Freebase의 두 데이터 세트가 사용됩니다. WordNet은 어휘 데이터베이스입니다. WordNet에서 엔티티는 하나 또는 여러 단어로 구성되어 synset을 형성합니다. 한 단어가 다른 synset에 속할 수 있습니다. synset 간의 관계에는 hypernym, hyponym, mer, hol 및 troponym 관계가 포함됩니다. Freebase는 공통된 세계 사실을 포함하는 대규모 협업 지식 그래프입니다. WN18 [ 31 ] 및 FB15K-237 [ 32 ]는 리콜을 평가하기 위해 Wordnet에서 사용됩니다. 또한 WN18 데이터 세트를 사용하여 링크 예측 meanRank 값을 평가합니다.
>
> 표 1 은 위의 5 개 데이터 세트의 기본 매개 변수 및 설정을 보여줍니다.

![Table 1. Data sets.](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.t001&type=large)

`KG2Vec` is compared with the following baseline. One thing to mention is that the parameter settings remain the same with the original paper unless otherwise specified.

• TransE: As mentioned above, this algorithm represents KG as triples and uses iterative training to minimize the value of h+r−t until convergence. Experimental parameters are set as follows: margin = 1, learningRate = 0.00001, dim = 8, L1 = True.

• Node2Vec: Node2Vec is one of the bases of our proposed algorithm. We set the parameters p = 4, and q = 1(the same as original paper), workers = 8, embedding_dim = 8, walking_length = 80, num_walks = 10.

> KG2Vec은 다음 기준과 비교됩니다. 한 가지 언급 할 사항은 매개 변수 설정이 달리 지정되지 않는 한 원본 용지와 동일하게 유지된다는 것입니다.
>
> • TransE : 위에서 언급 했듯이이 알고리즘은 KG를 트리플로 나타내며 수렴까지 h + r-t 값을 최소화하기 위해 반복 훈련을 사용합니다. 실험 매개 변수는 margin = 1, learningRate = 0.00001, dim = 8, L1 = True로 설정됩니다.
>
> • Node2Vec : Node2Vec은 우리가 제안한 알고리즘의 기반 중 하나입니다. 매개 변수 p = 4, q = 1 (원본과 동일), workers = 8, embedding_dim = 8, walking_length = 80, num_walks = 10을 설정합니다.


#### 4.2 `KG2Vec` parameter tuning

The `KG2Vec` trains the vector representations of entities and relations, which should be equipped with all the properties of other vectors (e.g., word vectors). One of the most important properties is similarity. For instance, word vectors could reveal the semantic similarity between two entities or words, thereby implying that those semantically similar entities should be closer in space, and further apart otherwise. Therefore, the similarity is adopted as an evaluation criterion. The similarity of entities and relations are separated as follows.

Definition 1: Similar entities are those that have the same relation node and are connected to each other. Similar relations are those who point to the same entity or those who are pointed to by the same entity. Furthermore, the recall is used as the evaluation standard. To start, all the similarities between the current entity node and other entities nodes (or the current relation node and other relation nodes) are calculated. Then, the similarities are sorted, and the proportion of similar nodes in the first N nodes is calculated as Eq 8.

> `KG2Vec`은 다른 벡터 (예 : 단어 벡터)의 모든 속성을 갖추어야하는 엔티티 및 관계의 벡터 표현을 훈련합니다. 가장 중요한 속성 중 하나는 유사성입니다. 예를 들어, 단어 벡터는 두 개체 또는 단어 간의 의미 적 유사성을 나타낼 수 있으므로 의미 적으로 유사한 개체는 공간에서 더 가까워 야하고 그렇지 않으면 더 멀리 떨어져 있어야 함을 의미합니다. 따라서 유사성은 평가 기준으로 채택됩니다. 엔티티와 관계의 유사성은 다음과 같이 구분됩니다.
>
> __정의 1__ : 유사한 엔티티는 동일한 관계 노드를 가지고 서로 연결된 엔티티입니다. 유사한 관계는 동일한 엔티티를 가리키는 관계 또는 동일한 엔티티가 가리키는 관계입니다. 또한 리콜은 평가 기준으로 사용됩니다. 시작하려면 현재 엔티티 노드와 다른 엔티티 노드 (또는 현재 관계 노드와 다른 관계 노드) 사이의 모든 유사성이 계산됩니다. 그런 다음 유사성을 정렬하고 처음 N 개의 노드에서 유사한 노드의 비율을 식 8 로 계산 합니다.

![Eq.08](https://journals.plos.org/plosone/article/file?type=thumbnail&id=info:doi/10.1371/journal.pone.0248552.e012) (8)

where Ri represents the recall of node i, N represents the top N after sorting the similarities, and Nisim represents the number of similar nodes to node i among those N nodes. To calculate the similarity between two nodes, the Euclidean distance is used as Eq 9.

> 여기서 Ri 는 노드 i 의 회수를 나타내고, N 은 유사성을 정렬 한 후 상위 N 을 나타내고, N isim 은 N 노드 중 노드 i 와 유사한 노드의 수를 나타냅니다 . 두 노드 간의 유사성을 계산하기 위해 유클리드 거리는 Eq.9 로 사용됩니다.

![Eq.09](https://journals.plos.org/plosone/article/file?type=thumbnail&id=info:doi/10.1371/journal.pone.0248552.e013) (9)

where N represents the number of vector dimensions, Ii represents the i-th dimension of vector I, and Ji represents the i-th dimension of vector J.

Regarding random walks, the values of parameters p and q need to be set. In `KG2Vec`, p is used to adjust the walks of relation nodes, while q is used to adjust the walks of entity nodes. To achieve the best performance, the values of p and q are tuned as shown in Fig 10.

> 여기서, N은 벡터의 차원 수를 나타내고, I 난 나타내는 I 번째 차원 벡터의 I을 한 지가 나타내는 I- 번째 차원 벡터 J .
>
> 무작위 걷기와 관련하여 매개 변수 p 및 q의 값을 설정해야합니다. KG2Vec에서 p는 관계 노드의 이동을 조정하는 데 사용되며 q는 엔티티 노드의 이동을 조정하는 데 사용됩니다. 최상의 성능을 얻기 위해 p 및 q 값은 그림 10 과 같이 조정됩니다 .

![Fig 10. Line chart of P (a is the entity data of the FB15K data set, b is the relational data of the FB15K data set, c is the entity data of the WN18 data set, and d is the parameter relational data of the WN18 data set).](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.g010&type=large)

It can be concluded from Fig 10 that the bigger the initial value of p is, the higher the recall is, no matter whether entity vectors or relation vectors are used. It can also be observed that when p is between 10 and 100, the recall does not differ much. Under some circumstances, p = 10 results in better performance. Therefore, 10 is used as the initial value of p. Another interesting result to note is that after introducing the optimizing training algorithm, the recall increases both with the CBOW and Skip-gram.

From Fig 11, it can be seen that there is no explicit regularity for q affecting the recall as p shows; nevertheless, the recall fluctuates greatly under different circumstances. This means that the effect of q on the walks is random. Therefore, q = 100 is finally chosen as the initial value the recall has the tendency to increase as q increases (C. Shi et al,2016) [17]. Furthermore, the optimized training algorithm that is illustrated above has little influence on the experimental recall-q, which also proves that in our proposed random walks, p has more influence than q.

> 그림 10 에서 p의 초기 값이 클수록 엔티티 벡터를 사용하든 관계 벡터를 사용하든 상관없이 재현율이 높다는 결론을 내릴 수 있습니다. 또한 p가 10과 100 사이 일 때 재현율이 크게 다르지 않음을 관찰 할 수 있습니다. 경우에 따라 p = 10이면 성능이 향상됩니다. 따라서 10은 p의 초기 값으로 사용됩니다. 주목해야 할 또다른 흥미로운 결과는 최적화 훈련 알고리즘을 도입 한 후 CBOW 및 Skip-gram 모두에서 재현율이 증가한다는 것입니다.
>
> 그림 11에서, P 쇼와 회수에 영향을 Q 위한 명확한 규칙이 존재하지 않음을 알 수 있다; 그럼에도 불구하고 리콜은 상황에 따라 크게 변동합니다. 이것은 걷기에 대한 q의 효과가 무작위임을 의미합니다. 따라서, q가 증가함에 따라 회상이 증가하는 경향이 있는 초기 값으로 q = 100이 최종적으로 선택됩니다 (C. Shi et al , 2016). 또한 위에서 설명한 최적화 된 훈련 알고리즘은 실험적 회상 -q에 거의 영향을주지 않으며, 제안 된 임의 걷기에서 p가 q보다 더 많은 영향을 미친다는 것을 증명합니다.

![그림 11.q 라인 차트 (a는 FB15K 데이터 세트의 엔티티 데이터, b는 FB15K 데이터 세트의 관계형 데이터, c는 WN18 데이터 세트의 엔티티 데이터, d는 WN18 데이터 세트의 매개 변수 관계형 데이터입니다. ).](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.g011&type=large)


#### 4.3 Result

The experiment results of recall on FB15K-237 are shown in Table 2. It can be seen that the algorithms with knowledge representation learning based on random walks, regardless of whether Node2Vec or `KG2Vec` is used, has better performance than those with space shifting, such as TransE. This means that the knowledge representation learning based on random walks results in more semantically sufficient representation vectors. Furthermore, our `KG2Vec` outperforms Node2Vec, both in entity vector learning and relation vector learning. Another observation is that the CBOW performs better than Skip-gram during vector learning, which may be because the CBOW predicts the current entity/relation based on context and Skip-gram uses the entity (or relationship) to predict the entities and relationships around it. In particular, there are not many nodes around the entity node that are connected to it, so they can’t travel route to its entity (or relationship). It can be also found that the proposed optimization algorithm in CBOW model training and Skip-gram has achieved good ascension. This shows that our training optimization algorithm can solve the problem of model overfitting caused by the high noise and low quality of data caused by the power law property of complex networks. As knowledge graph is also a kind of social network, power law problems can also appear in other social networks. Therefore, the training optimization algorithm proposed in this paper has strong universality and can be applied to solve other social network problems.

> FB15K-237에 대한 회수 실험 결과는 표 2 에 나와 있습니다. Node2Vec을 사용하든 `KG2Vec`을 사용하든 상관없이 랜덤 워크 기반 지식 표현 학습 알고리즘이 TransE와 같은 공간 이동 알고리즘보다 성능이 더 우수하다는 것을 알 수 있습니다. 이것은 무작위 걷기를 기반으로 한 지식 표현 학습이 더 의미 상 충분한 표현 벡터를 생성한다는 것을 의미합니다. 또한 KG2Vec은 엔티티 벡터 학습과 관계 벡터 학습 모두에서 Node2Vec을 능가합니다. 또 다른 관찰은 CBOW가 벡터 학습 중에 Skip-gram보다 더 잘 수행한다는 것입니다. 이는 CBOW가 컨텍스트를 기반으로 현재 엔티티 / 관계를 예측하고 Skip-gram이 엔티티 (또는 관계)를 사용하여 엔티티 및 주변 관계를 예측하기 때문일 수 있습니다. . 특히, 엔티티 노드 주변에 연결된 노드가 많지 않습니다. 따라서 엔티티 (또는 관계)로가는 경로를 이동할 수 없습니다. CBOW 모델 훈련 및 Skip-gram에서 제안 된 최적화 알고리즘이 좋은 상승을 달성했음을 알 수 있습니다. 이것은 우리의 훈련 최적화 알고리즘이 복잡한 네트워크의 멱 법칙 속성으로 인한 높은 노이즈와 낮은 데이터 품질로 인한 모델 과적 합 문제를 해결할 수 있음을 보여줍니다. 지식 그래프는 일종의 소셜 네트워크이기 때문에 권력 법칙 문제는 다른 소셜 네트워크에서도 나타날 수 있습니다. 따라서 본 논문에서 제안한 훈련 최적화 알고리즘은 보편성이 강하고 다른 소셜 네트워크 문제를 해결하는데 적용될 수있다. 이것은 우리의 훈련 최적화 알고리즘이 복잡한 네트워크의 멱 법칙 속성으로 인한 높은 노이즈와 낮은 데이터 품질로 인한 모델 과적합 문제를 해결할 수 있음을 보여줍니다. 지식 그래프는 일종의 소셜 네트워크이기 때문에 권력 법칙 문제는 다른 소셜 네트워크에서도 나타날 수 있습니다. 따라서 본 논문에서 제안한 훈련 최적화 알고리즘은 보편성이 강하고 다른 소셜 네트워크 문제를 해결하는데 적용될 수 있다. 이것은 우리의 훈련 최적화 알고리즘이 복잡한 네트워크의 멱 법칙 속성으로 인한 높은 노이즈와 낮은 데이터 품질로 인한 모델 과적합 문제를 해결할 수 있음을 보여줍니다. 지식 그래프는 일종의 소셜 네트워크이기 때문에 권력 법칙 문제는 다른 소셜 네트워크에서도 나타날 수 있습니다. 따라서 본 논문에서 제안한 훈련 최적화 알고리즘은 보편성이 강하고 다른 소셜 네트워크 문제를 해결하는데 적용될 수있다.

![Table 2. Experimental results of `KG2Vec` model on FB15K-237.](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.t002&type=large)

The experimental result of recallon WN18 is shown in Table 3. We can see the same result as that for FB15K-237. Both Node2Vec and `KG2Vec` that use knowledge representation learning based on random walks outperform those that use space shifting, such as TransE. Additionally, `KG2Vec` improves the vector learning of both entities and relations compared to Node2Vec. Therefore, it can be concluded that `KG2Vec`, which applies knowledge representation based on random walks and is tailored for knowledge graphs, achieves the best performance since it considers the full semantical characteristics of both entities and relations.

> WN18 리콜 실험 결과는 표 3과 같다. FB15K-237과 동일한 결과를 볼 수 있습니다. 무작위 걷기를 기반으로 지식 표현 학습을 사용하는 Node2Vec 및 `KG2Vec` 모두 TransE와 같은 공간 이동을 사용하는 학습을 능가합니다. 또한 `KG2Vec`은 Node2Vec에 비해 엔티티 및 관계의 벡터 학습을 향상시킵니다. 따라서 랜덤 워크를 기반으로 지식 표현을 적용하고 지식 그래프에 맞춤화 된 `KG2Vec`은 엔티티와 관계의 완전한 의미적 특성을 고려하여 최상의 성능을 발휘한다고 결론 지을 수있다.

![Table 3. Experimental results of `KG2Vec` model on WN18.](https://journals.plos.org/plosone/article/file?id=10.1371/journal.pone.0248552.t003&type=large)

In conclusion, our experiments show that the algorithm that learns the knowledge representation based on random walks can obtain a better representation vector, which takes full advantage of learning the semantics of entities and relations, compared to TransE. TransE is an algorithm that is based on the shifting of the space vector, which is a shallow algorithm. Deeper algorithms, such as the neural network based Node2Vec and our proposed `KG2Vec`, result in better semantic expressed vectors, which has been proven by this paper and others.

The CBOW model and Skip-gram model in `KG2Vec` have little difference in the learning of entity representation vector, but differ in the learning of relation representation vector, which is slightly different from the experimental results on the FB15K data set. Compared with CBOW model, the relationship representation vector learned by Skip-gram model is better. This may indicate that Skip-gram model of `KG2Vec` is a better method in relation representation vector. In addition, it is worth noting that the training optimization algorithm proposed in this paper still has a good effect, which further illustrates the superiority of the training optimization algorithm.

Two algorithms are also proposed with the CBOW and Skip-gram. The experimental results indicate that both algorithms equally improve the `KG2Vec`, more specifically, the CBOW performs better when learning entity representation vectors and Skip-gram is more suitable for learning relation representation vectors.

> 결론적으로, 우리의 실험은 랜덤 워크를 기반으로 지식 표현을 학습하는 알고리즘이 TransE에 비해 엔티티 및 관계의 의미론 학습을 최대한 활용하는 더 나은 표현 벡터를 얻을 수 있음을 보여줍니다. TransE는 얕은 알고리즘 인 공간 벡터의 이동을 기반으로하는 알고리즘입니다. 신경망 기반 Node2Vec 및 우리가 제안한 `KG2Vec`과 같은 더 깊은 알고리즘은 더 나은 의미 표현 벡터를 생성하며, 이는이 논문과 다른 사람들에 의해 입증되었습니다.
>
> `KG2Vec`의 CBOW 모델과 Skip-gram 모델은 엔티티 표현 벡터의 학습에서 거의 차이가 없지만 관계 표현 벡터의 학습에서 차이가 있으며 이는 FB15K 데이터 세트의 실험 결과와 약간 다릅니다. CBOW 모델에 비해 Skip-gram 모델에서 학습 한 관계 표현 벡터가 더 좋습니다. 이는 `KG2Vec`의 Skip-gram 모델이 관계 표현 벡터에서 더 나은 방법임을 나타낼 수 있습니다. 또한 본 논문에서 제안한 훈련 최적화 알고리즘은 여전히 ​​좋은 효과를 가지고 있으며 이는 훈련 최적화 알고리즘의 우월성을 더욱 잘 보여준다.
>
> CBOW 및 Skip-gram과 함께 두 가지 알고리즘도 제안됩니다. 실험 결과는 두 알고리즘 모두 `KG2Vec`을 똑같이 향상시키는 것으로 나타났습니다.보다 구체적으로 CBOW는 엔티티 표현 벡터를 학습 할 때 더 잘 수행되고 Skip-gram은 관계 표현 벡터를 학습하는 데 더 적합합니다.

By summarizing the experimental results on two data sets, it can be found that compared with the model represented by TransE, the knowledge representation learning model based on random walk can fully learn the semantics of entities and relationships. This is because:

1. Knowledge representation based on the random walk model aims at learning map entities (relationship) sequence in modeling, it focuses on a pair of entities and relationships, instead of focusing on the relationship between entities and relationships in order at the same time also pay attention to entities and relationships in the knowledge graph in the network, which well solves the limitation of learning knowledge representation model based on spatial translation.
2. Based on the random walk knowledge representation learning model, both node2VEc and the `KG2Vec` models proposed in this paper use Word2VEC model, and Word2VEC model itself is a neural network model, which is a deep model. TransE model, on the other hand, is based on vector translation in space, and it is a shallow model.

CBOW model is better at learning entity representation direction, while Skip-gram model is more suitable for learning relational representation vector, which may be related to the principles of CBOW and Skip-gram models.

> 두 개의 데이터 세트에 대한 실험 결과를 요약하면 TransE로 표현 된 모델과 비교하여 Random Walk에 기반한 지식 표현 학습 모델이 엔티티와 관계의 의미를 완전히 학습 할 수 있음을 알 수 있습니다. 이 때문입니다:
>
> 1. 랜덤 워크 모델을 기반으로 한 지식 표현은 모델링에서 맵 엔터티 (관계) 시퀀스를 학습하는 것을 목표로하며, 엔터티와 관계 간의 관계에 초점을 맞추는 대신 한 쌍의 엔터티와 관계에 초점을 맞추고 동시에 순서도주의를 기울여야합니다. 네트워크의 지식 그래프의 엔티티 및 관계는 공간 번역을 기반으로 한 학습 지식 표현 모델의 한계를 잘 해결합니다.
> 2. 랜덤 워크 지식 표현 학습 모델을 기반으로 본 논문에서 제안한 node2VEc 및 `KG2Vec` 모델은 모두 Word2VEC 모델을 사용하고 있으며, Word2VEC 모델 자체는 딥 모델 인 신경망 모델입니다. 반면 TransE 모델은 공간에서의 벡터 변환을 기반으로하며 얕은 모델입니다.
>
> CBOW 모델은 엔티티 표현 방향을 학습하는 데 더 적합하고 Skip-gram 모델은 CBOW 및 Skip-gram 모델의 원리와 관련 될 수있는 관계형 표현 벡터를 학습하는 데 더 적합합니다.

Finally, it can also be seen that both FB15K and WN18 models have lower recall rates in relation vectors, which may be caused by the following two reasons:

1. In the knowledge graph, the number of relational nodes is smaller than the number of entity nodes. Both the traditional knowledge representation learning model and random walk need a large number of training samples to improve the training effect of the model and avoid the problem of under fitting and overfitting. Therefore, it is not surprising that the experimental results do not show the ideal situation when the number of relational nodes is small.
2. In the previous definition of the concept of relational similarity, we mentioned that the definition of similar relationship is vaguer than that of similar entity, so it is difficult to ensure that the definition can accurately identify similar relationship.

In any case, the `KG2Vec` model proposed in this paper still performs better than the traditional knowledge representation learning model. From this point, it can still prove the superiority of knowledge representation learning based on random walk.

> 마지막으로, FB15K 및 WN18 모델 모두 관계 벡터에서 더 낮은 재현율을 가지며 이는 다음 두 가지 이유로 인해 발생할 수 있습니다.
>
> 1. 지식 그래프에서 관계형 노드의 수는 엔티티 노드의 수보다 적습니다. 전통적 지식 표현 학습 모델과 랜덤 워크 모두 모델의 학습 효과를 개선하고 언더 피팅 및 과적 합 문제를 방지하기 위해 많은 수의 학습 샘플이 필요합니다. 따라서 관계형 노드의 수가 적을 때 실험 결과가 이상적인 상황을 보여주지 못하는 것은 놀라운 일이 아닙니다.
> 2. 관계형 유사성 개념에 대한 이전 정의에서 유사 관계의 정의가 유사 개체의 정의보다 모호하여 유사 관계를 정확하게 식별 할 수 있는지 확인하기 어렵다고 언급했습니다.
>
> 어쨌든 이 논문에서 제안한 `KG2Vec` 모델은 여전히 ​​전통적인 지식 표현 학습 모델보다 더 나은 성능을 발휘합니다. 이 시점에서 랜덤 워크를 기반으로 한 지식 표현 학습의 우수성을 여전히 증명할 수있다.


### 5. Conclusion

An improved knowledge representation learning algorithm that is based on a modified random walk called `KG2Vec` is proposed, which is inspired by Node2Vec but tailored to KGs. The algorithm regards relations as the nodes in the network and reconstructs KGs, yielding two types of nodes: entity nodes and relation nodes. Afterwards, the algorithm utilizes the strategy in Node2Vec to generate node sequences, which is then further trained using Word2vec. Moreover, experiments on the FB15K237 and WN18 KG databases are conducted and the entity and the relation nodes to obtain their representation vectors. The results of recall shows that `KG2Vec` is efficient and effective on real-world data. However, our model has a high computational complexity, and time cost arising from representing each triple separately. How to improve the efficiency of the feature extraction is an urgent problem to be solved. In addition, the temporal and spatial attributes for dynamic KGs also need to be studied as the next research goal.

> Node2Vec에서 영감을 얻었지만 KG에 맞게 조정된 `KG2Vec`이라는 수정된 임의 걷기를 기반으로 하는 향상된 지식 표현 학습 알고리즘이 제안되었습니다. 알고리즘은 관계를 네트워크의 노드로 간주하고 KG를 재구성하여 엔티티 노드와 관계 노드라는 두 가지 유형의 노드를 생성합니다. 그 후, 알고리즘은 Node2Vec의 전략을 활용하여 노드 시퀀스를 생성한 다음 Word2vec을 사용하여 추가 학습합니다. 또한 FB15K237 및 WN18 KG 데이터베이스에 대한 실험이 수행되고 엔티티 및 관계 노드가 표현 벡터를 얻습니다. 리콜 결과는 `KG2Vec`이 실제 데이터에서 효율적이고 효과적이라는 것을 보여줍니다. 그러나 우리 모델은 계산 복잡성이 높고 각 트리플을 개별적으로 표현할 때 발생하는 시간 비용이 있습니다. 특성 추출의 효율성을 높이는 방법은 해결해야 할 시급한 문제입니다. 또한 동적 KG에 대한 시간적 및 공간적 속성도 다음 연구 목표로 연구해야 합니다.



\[끝\]
