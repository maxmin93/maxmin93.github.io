---
title: "graph2vec: Learning Distributed Representations of Graphs (2017.7)"
date: 2020-12-05 00:00:00 +0000
categories: ["papers", "KG"]
tags: ["graph2vec", "graph embedding", "Graph representations", "graph classification", "graph clustering"]
---

**`graph2vec`: Learning Distributed Representations of Graphs (2017.7)**

Annamalai Narayanan, Mahinthan Chandramohan, Rajasekar Venkatesan, Lihui Chen, Yang Liu and Shantanu Jaiswal

- link: [https://arxiv.org/pdf/1707.05005.pdf](https://arxiv.org/pdf/1707.05005.pdf)


### ABSTRACT

Recent works on representation learning for graph structured data predominantly focus on learning distributed representations of graph substructures such as nodes and subgraphs. However, many graph analytics tasks such as graph classification and clustering require representing entire graphs as fixed length feature vectors. While the aforementioned approaches are naturally unequipped to learn such representations, graph kernels remain as the most effective way of obtaining them. However, these graph kernels use handcrafted features (e.g., shortest paths, graphlets, etc.) and hence are hampered by problems such as poor generalization. To address this limitation, in this work, we propose a neural embedding framework named `graph2vec` to learn data-driven distributed representations of arbitrary sized graphs. `graph2vec`’s embeddings are learnt in an unsupervised manner and are task agnostic. Hence, they could be used for any downstream task such as graph classification, clustering and even seeding supervised representation learning approaches. Our experiments on several benchmark and large real-world datasets show that `graph2vec` achieves significant improvements in classification and clustering accuracies over substructure representation learning approaches and are competitive with state-of-the-art graph kernels.

> 그래프 구조화 된 데이터에 대한 표현 학습에 대한 최근 작업은 주로 노드 및 하위 그래프와 같은 그래프 하위 구조의 분산 표현 학습에 중점을 둡니다. 그러나 그래프 분류 및 클러스터링과 같은 많은 그래프 분석 작업은 전체 그래프를 고정 길이 특징 벡터로 표현해야 합니다. 앞서 언급한 접근 방식은 자연스럽게 이러한 표현을 학습할 수 있는 장비가 없지만 그래프 커널은 이를 얻는 가장 효과적인 방법으로 남아 있습니다. 그러나 이러한 그래프 커널은 손으로 만든 기능 (예 : 최단 경로, 그래프릿 등)을 사용하므로 일반화 불량과 같은 문제로 인해 방해를 받습니다. 이 제한을 해결하기 위해 이 작업에서는 `graph2vec`라는 신경 임베딩 프레임 워크를 제안하여 임의 크기 그래프의 데이터 기반 분산 표현을 학습합니다. `graph2vec`의 임베딩은 감독되지 않은 방식으로 학습되며 작업에 구애받지 않습니다. 따라서 그래프 분류, 클러스터링 및 감독 된 표현 학습 접근법 시딩과 같은 모든 다운 스트림 작업에 사용할 수 있습니다. 여러 벤치 마크 및 대규모 실제 데이터 세트에 대한 우리의 실험은 `graph2vec`이 하위 구조 표현 학습 접근 방식에 비해 분류 및 클러스터링 정확도에서 상당한 개선을 달성하고 최첨단 그래프 커널과 경쟁한다는 것을 보여줍니다.

**Keywords**: Graph Kernels, Deep Learning, Representation Learning


### 1. INTRODUCTION

Graph-structured data are ubiquitous nowadays in many domains such as social networks, cybersecurity, bio- and chemo-informatics. Many analytics tasks in these domains such as graph classification, clustering and regression require representing graphs as fixed-length feature vectors to facilitate applying appropriate Machine Learning (ML) algorithms. For instance, vectorial representations (aka embeddings) of programs’ call graphs could be used to detect malware [6] and those of chemical compounds could be used to predict their properties such as solubility and anti-cancer activity [7].

> 그래프 구조 데이터는 오늘날 소셜 네트워크, 사이버 보안, 생물 및 화학 정보학과 같은 많은 영역에서 유비쿼터스입니다. 그래프 분류, 클러스터링 및 회귀와 같은 이러한 도메인의 많은 분석 작업은 적절한 기계 학습 (ML) 알고리즘 적용을 용이하게 하기 위해 그래프를 고정 길이 특징 벡터로 표현해야합니다. 예를 들어, 프로그램 호출 그래프의 벡터 표현 (임베딩이라고도 함)을 사용하여 맬웨어를 감지 할 수 있고 [6] 화합물의 표현을 사용하여 용해도 및 항암 활동과 같은 속성을 예측할 수 있습니다 [7].


**Graph Kernels and handcrafted features.**

Graph kernels are one of the most prominent ways of catering the aforementioned graph analytics tasks. Graph kernels evaluate the similarity (aka kernel value) between a pair of graphs G and G’ by recursively decomposing them into atomic substructures (e.g., random walks, shortest paths, graphlets etc.) and defining a similarity (aka kernel) function over the substructures (e.g., counting the number of common substructures across G and G’). Subsequently, kernel methods (e.g., Support Vector Machines (SVMs)) could be used for performing classification/clustering. However, these kernels exhibit two critical limitations: (1) Many of them do not provide explicit graph embeddings. This renders using general purpose ML algorithms which operate on vector embeddings (e.g., Random Forests (RFs), Neural Networks, etc.) unusable with graph data. (2) The substructures (i.e., walk, paths, etc.) leveraged by these kernels are ‘handcrafted’ i.e., determined manually with specific welldefined functions that help extracting such substructures from graphs. However, as noted by Yanardag and Vishwanathan [7], when such handcrafted features are used on large datasets of graphs, it leads to building very high dimensional, sparse and non-smooth representations and thus yield poor generalization. We note that replacing handcrafted features with ones that are learnt automatically from data could help to fix both the aforementioned limitations. In fact, in related domains such as text mining and computer vision, feature learning based approaches have outperformed handcrafted ones significantly across many tasks [2, 9].

> 그래프 커널은 앞서 언급한 그래프 분석 작업을 처리하는 가장 눈에 띄는 방법 중 하나입니다. 그래프 커널은 그래프 쌍 G와 G’ 사이의 유사성 (일명 커널 값)을 재귀 적으로 원자 하위 구조 (예 : 랜덤 워크, 최단 경로, 그래프 렛 등)로 분해하고 유사성 (일명 커널) 함수를 정의하여 평가합니다. 하부 구조 (예 : G와 G’에 걸쳐 공통 하부 구조의 수 계산). 그 후, 커널 방법 (예 : SVM (Support Vector Machine))을 사용하여 분류 / 클러스터링을 수행할 수 있습니다. 그러나 이러한 커널에는 두 가지 중요한 제한이 있습니다. (1) 대부분은 명시적인 그래프 임베딩을 제공하지 않습니다. 이는 그래프 데이터에 사용할 수 없는 벡터 임베딩 (예 : 랜덤 포레스트 (RF), 신경망 등)에서 작동하는 범용 ML 알고리즘을 사용하여 렌더링합니다. (2) 이러한 커널에 의해 활용되는 하위 구조 (예 : 걷기, 경로 등)는 ‘손수 제작’ 됩니다. 즉, 그래프에서 이러한 하위 구조를 추출하는 데 도움이 되는 잘 정의 된 특정 함수를 사용하여 수동으로 결정됩니다. 그러나 Yanardag 및 Vishwanathan [7]에 의해 언급 된 것처럼 이러한 수작업 기능이 대규모 그래프 데이터 세트에 사용되면 매우 높은 차원, 희소 및 비 매끄러운 표현을 구축하게 되어 일반화가 제대로 이루어지지 않습니다. 손으로 만든 기능을 데이터에서 자동으로 학습하는 기능으로 대체하면 앞서 언급 한 두 가지 한계를 모두 해결하는 데 도움이 될 수 있습니다. 실제로 텍스트 마이닝 및 컴퓨터 비전과 같은 관련 영역에서 기능 학습 기반 접근 방식은 많은 작업에서 수작업 방식을 훨씬 능가했습니다 [2, 9].


**Learning substructure embeddings.**

Recently, several approaches have been proposed to learn embeddings of graph substructures such as nodes [4], paths [7] and subgraphs [5, 6]. These embeddings can then be used directly in substructure based analytics tasks such as node classification, community detection and link prediction. However, these substructure representation learning approaches are incapable of learning representations of entire graphs and hence cannot be used for tasks such as graph classification. As we show through our experiments in §5, obtaining graph embeddings through trivial extensions such as averaging or max pooling over substructure embeddings leads to suboptimal results.

> 최근에 노드 [4], 경로 [7] 및 하위 그래프 [5, 6]와 같은 그래프 하위 구조의 임베딩을 학습하기 위한 몇 가지 접근법이 제안되었습니다. 이러한 임베딩은 노드 분류, 커뮤니티 감지 및 링크 예측과 같은 하위 구조 기반 분석 작업에서 직접 사용할 수 있습니다. 그러나 이러한 하위 구조 표현 학습 접근법은 전체 그래프의 표현을 학습 할 수 없으므로 그래프 분류와 같은 작업에 사용할 수 없습니다. §5의 실험을 통해 보여 주듯이, 하위 구조 임베딩에 대한 평균 또는 최대 풀링과 같은 사소한 확장을 통해 그래프 임베딩을 얻는 것은 차선의 결과를 가져옵니다.


**Learning task-specific graph embeddings.**

On the other hand, a few supervised approaches (i.e., ones that require class labels of graphs) to learn embeddings of entire graphs such as Patchy-san [9] have been proposed very recently. While they offer excellent performances in supervised learning tasks (e.g., graph classification) they pose two critical limitations that reduce their usability: (1) Being deep neural network based representation learning approaches, they require large volume of labeled data to learn meaningful representations. Obviously, obtaining such datasets is a challenge in itself as it requires mammoth labeling effort. (2) The representations thus learnt are specific to one particular ML task and cannot be used or transferred to other tasks or problems. For instance, the graph embeddings for the chemical compounds in the MUTAG dataset (see [7] for details) learnt using [9] are specifically designed to predict whether or not a compound has mutagenic effect on a bacterium. Hence, the same embeddings could not be used for any other tasks such as predicting the properties of the compounds. To circumvent these limitations, similar to the above mentioned substructure representation learning approaches, we need a completely unsupervised approach that can succinctly capture the generic characteristics of entire graphs in the form of their embeddings. To the best of our knowledge, there are no such techniques available. Hence driven by this motivation, in this work, we take the first steps towards learning task-agnostic representations of arbitrary sized graphs in an unsupervised fashion.

> 반면에 Patchy-san [9]과 같은 전체 그래프의 임베딩을 학습하기 위한 몇 가지 감독 된 접근 방식 (즉, 그래프의 클래스 레이블이 필요한 접근 방식)이 최근에 제안되었습니다. 지도 학습 작업 (예 : 그래프 분류)에서 뛰어난 성능을 제공하지만 유용성을 감소시키는 두 가지 중요한 제한 사항이 있습니다. (1) 심층 신경망 기반 표현 학습 접근 방식이므로 의미있는 표현을 학습하려면 많은 양의 레이블이 지정된 데이터가 필요합니다. 분명히 이러한 데이터 세트를 얻는 것은 엄청난 라벨링 노력이 필요하기 때문에 그 자체로 어려운 일입니다. (2) 이렇게 학습 된 표현은 하나의 특정 ML 작업에 한정되며 다른 작업이나 문제에 사용하거나 전송할 수 없습니다. 예를 들어, [9]를 사용하여 학습 한 MUTAG 데이터 세트 (자세한 내용은 [7] 참조)의 화학 화합물에 대한 그래프 임베딩은 화합물이 박테리아에 대한 돌연변이 유발 효과가 있는지 여부를 예측하도록 특별히 설계되었습니다. 따라서 동일한 임베딩을 화합물의 특성 예측과 같은 다른 작업에 사용할 수 없습니다. 이러한 제한을 피하려면 위에서 언급 한 하부 구조 표현 학습 접근 방식과 유사하게 임베딩 형태로 전체 그래프의 일반적인 특성을 간결하게 캡처 할 수있는 완전히 비지도 접근 방식이 필요합니다. 우리가 아는 한 그러한 기술을 사용할 수 없습니다. 따라서 이 동기에 따라 이 작업에서 우리는 감독되지 않은 방식으로 임의의 크기 그래프의 작업에 구애받지 않는 표현을 학습하기 위한 첫 번째 단계를 수행합니다.


**Our approach.**

To this end, we propose and develop a neural embedding framework named `graph2vec`. Inspired by the success of recently proposed neural document embedding models, we extend the same to learn graph embeddings. These document embedding models exploit the way how words/word sequences compose documents to learn their embeddings. Analogically, in `graph2vec`, we propose to view an entire graph as a document and the rooted subgraphs around every node in the graph as words that compose the document and extend document embedding neural networks to learn representations of entire graphs.

To the best of our knowledge, `graph2vec` is the first neural embedding approach that learns representations of whole graphs and it offers the following key advantages over graph kernels and other substructure embedding approaches:

> 이를 위해 `graph2vec`라는 신경 임베딩 프레임 워크를 제안하고 개발합니다. 최근 제안 된 신경 문서 임베딩 모델의 성공에 영감을 받아 그래프 임베딩을 학습하기 위해 동일한 기능을 확장합니다. 이러한 문서 임베딩 모델은 단어 / 단어 시퀀스가 문서를 구성하여 임베딩을 학습하는 방식을 활용합니다. 유사하게, `graph2vec`에서 우리는 전체 그래프를 문서로, 그래프의 모든 노드 주변의 루트 하위 그래프를 문서를 구성하고 문서 임베딩 신경망을 확장하여 전체 그래프의 표현을 학습하는 단어로 볼 것을 제안합니다.
>
> 우리가 아는 한, `graph2vec`은 전체 그래프의 표현을 학습하는 최초의 신경 임베딩 접근 방식이며 그래프 커널 및 기타 하위 구조 임베딩 접근 방식에 비해 다음과 같은 주요 이점을 제공합니다.


**1) Unsupervised representation learning:**

`graph2vec` learns graph embeddings in a completely unsupervised manner i.e., class labels of graphs are not required for learning their embeddings. This allows us to readily use `graph2vec` embeddings in a plethora of applications where labeled data is difficult to obtain.

> `graph2vec`은 완전히 감독되지 않는 방식으로 그래프 임베딩을 학습합니다. 즉, 그래프의 클래스 레이블이 임베딩 학습에 필요하지 않습니다. 이를 통해 레이블이 지정된 데이터를 얻기 어려운 수많은 애플리케이션에서 `graph2vec` 임베딩을 쉽게 사용할 수 있습니다.


**2) Task-agnostic embeddings:**

Since `graph2vec` does not leverage on any task-specific information (e.g., class labels) for its representation learning process, the embeddings it provides are generic. This allows us to use these embeddings across all analytics tasks involving whole graphs. In fact, `graph2vec` embeddings could be used to seed supervised representation learning approaches such as [9].

> `graph2vec`는 표현 학습 프로세스에 대한 작업별 정보 (예 : 클래스 레이블)를 활용하지 않기 때문에 제공하는 임베딩은 일반적입니다. 이를 통해 전체 그래프와 관련된 모든 분석 작업에서 이러한 임베딩을 사용할 수 있습니다. 사실, `graph2vec` 임베딩은 [9]와 같은 지도적 표현 학습 접근법을 시드하는데 사용될 수 있습니다.


**3) Data-driven embeddings:**

Unlike graph kernels, `graph2vec` learns graph embeddings from a large corpus of graph data. This enables `graph2vec` to circumvent the aforementioned disadvantages of handcrafted feature based embedding approaches.

> 그래프 커널과 달리 `graph2vec`은 큰 그래프 데이터 모음에서 그래프 임베딩을 학습합니다. 이를 통해 `graph2vec`는 앞서 언급한 수작업 기능 기반 임베딩 접근 방식의 단점을 우회 할 수 있습니다.


**4) Captures structural equivalence:**

Unlike approaches such as sub2vec [5] which sample linear substructures (e.g., fixed length random walks) in a graph and learns graph embeddings from them, our framework samples and considers non-linear substructures, namely, rooted subgraphs for learning embeddings. Considering such non-linear substructures are known to preserve structural equivalence and hence this ensures `graph2vec`’s representation learning process yields similar embeddings for structurally similar graphs.

> 그래프에서 선형 하위 구조 (예 : 고정 길이 랜덤 워크)를 샘플링하고 그래프 임베딩을 학습하는 sub2vec [5]와 같은 접근 방식과 달리, 우리의 프레임 워크는 비선형 하위 구조, 즉 임베딩 학습을 위한 루트 하위 그래프를 샘플링하고 고려합니다. 이러한 비선형 하위 구조는 구조적 동등성을 유지하는 것으로 알려져 있으므로 `graph2vec`의 표현 학습 프로세스가 구조적으로 유사한 그래프에 대해 유사한 임베딩을 생성하도록 보장합니다.


**Experiments.**

We determine `graph2vec`’s accuracy and efficiency in both supervised and unsupervised learning tasks with several benchmark and large real-world graph datasets. Also, we perform comparative analysis against several stateof-the-art substructure (e.g., node) representation learning approaches and graph kernels. Our experiments reveal that `graph2vec` achieves significant improvements in classification and clustering accuracies over substructure embedding methods and are highly competitive to state-of-theart kernels. Specifically, on two real-world program analysis tasks, namely, malware detection and malware familial clustering, `graph2vec` outperforms state-of-the-art substructure embedding approaches by more than 17% and 39%, respectively.

> 여러 벤치 마크 및 대규모 실제 그래프 데이터 세트를 사용하여 지도 및 비지도 학습 작업 모두에서 `graph2vec`의 정확성과 효율성을 결정합니다. 또한 몇 가지 최첨단 하위 구조 (예 : 노드) 표현 학습 접근법 및 그래프 커널에 대한 비교 분석을 수행합니다. 우리의 실험은 `graph2vec`이 하위 구조 임베딩 방법에 비해 분류 및 클러스터링 정확도에서 상당한 향상을 이루 었으며 최첨단 커널에 비해 매우 경쟁력이 있음을 보여줍니다. 특히, 두 가지 실제 프로그램 분석 작업, 즉 맬웨어 탐지 및 맬웨어 가족 클러스터링에서 `graph2vec`은 최첨단 하위 구조 임베딩 접근 방식을 각각 17 % 및 39 % 이상 능가합니다.


**Contributions.**

We make the following contributions:

• We propose `graph2vec`, an unsupervised representation learning technique to learn distributed representations of arbitrary sized graphs.

• Through our large-scale experiments on several benchmark and real-world datasets, we demonstrate that `graph2vec` could significantly outperform substructure representation learning algorithms and highly competitive to state-of-the-art graph kernels on graph classification and clustering tasks.

• We make an efficient implementation of `graph2vec` and the embeddings of all the datasets used in this work publicly available at [15].

The remainder of the paper is organized as follows: In §2 the problem of learning graph embeddings is formally defined. In §3, preliminaries on word and document representation learning approaches that `graph2vec` relies on are presented. The proposed method and its evaluation results and discussions are presented in §4 and §5, respectively. Conclusions are discussed in §6.

> • 임의의 크기의 그래프의 분산 표현을 학습하기 위해 비지도 학습 기법 인 `graph2vec`를 제안합니다.
>
> • 여러 벤치 마크 및 실제 데이터 세트에 대한 대규모 실험을 통해 `graph2vec`이 하위 구조 표현 학습 알고리즘을 크게 능가 할 수 있으며 그래프 분류 및 클러스터링 작업에서 최첨단 그래프 커널에 비해 매우 경쟁력이 있음을 보여줍니다.
>
> • 우리는 `graph2vec`의 효율적인 구현과이 작업에 사용 된 모든 데이터 세트의 임베딩을 [15]에서 공개적으로 제공합니다.
>
> 논문의 나머지 부분은 다음과 같이 구성됩니다. §2에서는 그래프 임베딩 학습 문제가 공식적으로 정의됩니다. §3에서는 `graph2vec`이 의존하는 단어 및 문서 표현 학습 접근 방식에 대한 예비 자료가 제공됩니다. 제안 된 방법과 그 평가 결과 및 논의는 각각 §4와 §5에 제시되어있다. 결론은 §6에서 논의됩니다.


### 2. PROBLEM STATEMENT
Given a set of graphs G = {G1, G2, …} and a positive integer δ (i.e., expected embedding size), we intend to learn δ-dimensional distributed representations for every graph Gi ∈ G. The matrix of representations of all graphs is denoted as Φ ∈ R|G|×δ.

More specifically, let G = (N, E, λ), represent a graph, where N is a set of nodes and E ⊆ (N ×N) be a set of edges. Graph G is labeled if there exists a function λ such that λ : N → L, which assigns a unique label from alphabet L to every node n ∈ N. Otherwise, G is considered as unlabeled. Additionally, the edges may also be labeled in which case we also have an edge labeling function, η : E → e.

Given G = (N, E, λ) and sg = (Nsg, Esg, λsg), sg is a subgraph of G iff there exists an injective mapping µ : Nsg → N such that (n1, n2) ∈ Esg iff (µ(n1), µ(n2)) ∈ E. In this work, by subgraph, we strictly refer to a specific class of subgraphs, namely, rooted subgraphs. In a given graph G, a rooted subgraph of degree d around node n ∈ N encompasses all the nodes (and corresponding edges) that are reachable in d hops from n.

> 그래프 세트 G = {G1, G2, …} 및 양의 정수 δ (예 : 예상 임베딩 크기)가 주어지면 모든 그래프 Gi ∈ G에 대한 δ 차원 분포 표현을 학습하려고합니다.
> 모든 그래프는 Φ ∈ R|G| × δ로 표시됩니다.
>
> 보다 구체적으로, G = (N, E, λ)는 그래프를 나타내며, 여기서 N은 노드 집합이고 E ⊆ (N × N)는 간선 집합입니다. 그래프 G는 λ : N → L과 같은 함수 λ가 있는 경우 레이블이 지정됩니다. 이는 알파벳 L에서 모든 노드 n ∈ N에 고유 한 레이블을 할당합니다. 그렇지 않으면 G는 레이블이 없는 것으로 간주됩니다. 또한 가장자리에 레이블을 지정할 수도 있습니다.이 경우 가장자리 레이블 지정 기능도 있습니다. η : E → e.
>
> G = (N, E, λ) 및 sg = (Nsg, Esg, λsg)가 주어지면 sg는 G의 서브 그래프입니다. (n1), µ(n2)) ∈ E.이 작업에서 서브 그래프는 특정 서브 그래프 클래스, 즉 루트 서브 그래프를 엄격하게 참조합니다. 주어진 그래프 G에서 노드 n ∈ N 주변의 d 차근 하위 그래프는 n에서 d 홉으로 도달할 수 있는 모든 노드 (및 해당 에지)를 포함합니다.


### 3. BACKGROUND: SKIPGRAM WORD & DOCUMENT EMBEDDING MODELS

Our goal is to learn the distributed representations of graphs by extending the recently proposed document embedding techniques in NLP for multi-relational data. Hence, in this section, we review the related background in language modeling, word and document embedding techniques.

> 우리의 목표는 다중 관계형 데이터를 위해 NLP에서 최근 제안된 문서 임베딩 기술을 확장하여 그래프의 분산 표현을 학습하는 것입니다. 따라서이 섹션에서는 언어 모델링, 단어 및 문서 임베딩 기술의 관련 배경을 검토합니다.


#### 3.1 Skipgram model for learning word embeddings

Modern neural embedding methods such as word2vec [2] use a simple and efficient feed forward neural network architecture called ”skipgram” to learn distributed representations of words. word2vec works based on the rationale that the words appearing in similar contexts tend to have similar meanings and hence should have similar vector representations. To learn a target word’s representation, this model exploits the notion of context, where a context is defined as a fixed number of words surrounding the target word. To this end, given a sequence of words {w1, w2, …, wt, …, wT }, the target word wt whose representation has to be learnt and the length of the context window c, the objective of skipgram model is to maximize the following log-likelihood:

> word2vec [2]와 같은 최신 신경 임베딩 방법은 “skip-gram”이라고 하는 간단하고 효율적인 피드 포워드 신경망 아키텍처를 사용하여 단어의 분산 표현을 학습합니다. word2vec은 유사한 문맥에 나타나는 단어가 유사한 의미를 갖는 경향이 있으므로 유사한 벡터 표현을 가져야 한다는 이론적 근거에 따라 작동합니다. 대상 단어의 표현을 학습하기 위해 이 모델은 컨텍스트 개념을 활용합니다. 여기서 컨텍스트는 대상 단어를 둘러싼 고정된 수의 단어로 정의됩니다. 이를 위해 일련의 단어 {w1, w2, …, wt, …, wT}가 주어지면 표현을 학습해야 하는 대상 단어 wt 및 컨텍스트 창의 길이 c, skip-gram의 목적 모델은 다음과 같은 로그 가능성을 최대화하는 것입니다.


#### 3.2 Negative Sampling

The posterior probability in eq(2) could be learnt in several ways. For instance, a naive approach would be to use a classifier like logistic regression. However, this is prohibitively expensive if the vocabulary V is very large.

Negative sampling is a simple yet efficient algorithm that helps to alleviate this problem and train the skipgram model. Negative sampling selects a small subset of words at random that are not in the target word’s context and updates their embeddings in every iteration instead of considering all words in the vocabulary. Training this way ensures the following: if a word w appears in the context of another word w0, then the vector embedding of w is closer to that of w0 compared to any other randomly chosen word from the vocabulary.

Once skipgram training converges, semantically similar words are mapped to closer positions in the embedding space revealing that the learned word embeddings preserve semantics.

> eq (2)의 사후 확률은 여러 가지 방법으로 학습 할 수 있습니다. 예를 들어 순진한 접근 방식은 로지스틱 회귀와 같은 분류기를 사용하는 것입니다. 그러나 어휘 V가 매우 큰 경우 이것은 엄청나게 비쌉니다.
>
> 네거티브 샘플링은 이 문제를 완화하고 스킵그램 모델을 훈련시키는 데 도움이 되는 간단하면서도 효율적인 알고리즘입니다. 음수 샘플링은 대상 단어의 컨텍스트에 없는 단어의 작은 하위 집합을 무작위로 선택하고 어휘의 모든 단어를 고려하는 대신 모든 반복에서 임베딩을 업데이트합니다. 이러한 방식으로 학습하면 다음이 보장됩니다. 단어 w가 다른 단어 w0의 컨텍스트에 나타나면 w의 벡터 임베딩은 어휘에서 임의로 선택된 다른 단어에 비해 w0의 임베딩에 더 가깝습니다.
>
> 스킵그램 훈련이 수렴되면 의미적으로 유사한 단어가 임베딩 공간에서 더 가까운 위치에 매핑되어 학습된 단어 임베딩이 의미를 보존함을 나타냅니다.


#### 3.3 Neural document embedding models

Recently, doc2vec, a straight forward extension to word2vec from learning embeddings of words to those of word sequences was proposed by Le and Mikolov [3]. doc2vec uses an instance of the skipgram model called paragraph vector-distributed bag of words (PV-DBOW) (interchangeably referred as doc2vec skipgram) which is capable of learning representations of arbitrary length word sequences such as sentences, paragraphs and even whole large documents. More specifically, given a set of documents D = {d1, d2, …dN } and a sequence of words c(di) = {w1, w2, …, wli} sampled from document di ∈ D, doc2vec skipgram learns a δ dimensional embeddings of the document di ∈ D and each word wj sampled from c(di) i.e., d~i ∈ Rδ and ~wj ∈ Rδ, respectively. The model works by considering a word wj ∈ c(di) to be occurring in the context of document di and tries to maximize the following log likelihood:

In `graph2vec`, we consider graphs analogical to documents that are composed of rooted subgraphs which, in turn, are analogical words from a special language and extend document embedding models to learn graph embeddings.

> 최근에 Le and Mikolov는 단어 삽입 학습에서 단어 시퀀스 학습으로 word2vec의 직접적인 확장인 doc2vec를 제안했습니다 [3]. doc2vec은 문장, 문단, 심지어 전체 큰 문서와 같은 임의의 길이의 단어 시퀀스 표현을 학습할 수 있는 PV-DBOW (paragraph vector-distributed bag of words, doc2vec skipgram)라고 하는 skip-gram 모델의 인스턴스를 사용합니다. 보다 구체적으로, 문서 세트 D = {d1, d2, … dN} 및 문서 di ∈ D, doc2vec skip-gram에서 샘플링된 일련의 단어 c (di) = {w1, w2, …, wli}가 주어지면 c(di)에서 샘플링 된 문서 di ∈ D 및 각 단어 wj의 δ 차원 임베딩, 즉 d ~ i ∈ Rδ 및 ~ wj ∈ Rδ를 각각 학습합니다. 이 모델은 wj ∈ c (di)라는 단어가 문서 di의 컨텍스트에서 발생하는 것을 고려하여 작동하며 다음 로그 가능성을 최대화하려고 합니다.
>
> `graph2vec`에서 우리는 특정 언어의 유추 단어인 루트 하위 그래프로 구성된 문서와 유사한 그래프를 고려하고 문서 임베딩 모델을 확장하여 그래프 임베딩을 학습합니다.

![Fig.1](/2020/12/graph2vec_fig01.png)


### 4. METHOD: LEARNING GRAPH REPRESENTATIONS

In this section we discuss the intuition (§4.1), overview (§4.2) and main components of our `graph2vec` algorithm (§4.3) in detail and explain how it learns embeddings of arbitrary sized graphs in an unsupervised manner.

> 이 섹션에서는 `graph2vec` 알고리즘 (§4.3)의 직관 (§4.1), 개요 (§4.2) 및 주요 구성 요소에 대해 자세히 논의하고 감독되지 않은 방식으로 임의 크기의 그래프 임베딩을 학습하는 방법을 설명합니다.


#### 4.1 Intuition

With the background on word and document embeddings presented in the previous section, an important intuition we extend in `graph2vec` is to view an entire graph as a document and the rooted subgraphs (that encompass a neighborhood of certain degree) around every node in the graph as words that compose the document. In other words, different subgraphs compose graphs in a similar way that different words compose sentences/documents when used together.

At this juncture, it is important to note that other substructures such as nodes, walks and paths could also be considered as atomic entities that compose a graph, instead of rooted subgraphs. However, there are two reasons that make rooted subgraphs more amenable for learning graph embeddings:

> 이전 섹션에서 제시 한 단어 및 문서 임베딩에 대한 배경을 사용하여 `graph2vec`에서 확장 한 중요한 직관은 전체 그래프를 문서로, 그리고 그래프의 모든 노드 주변에있는 루트 하위 그래프 (특정 정도의 이웃을 포함하는)를 다음과 같이 보는 것입니다. 문서를 구성하는 단어. 즉, 서로 다른 하위 그래프는 서로 다른 단어가 함께 사용될 때 문장 / 문서를 구성하는 것과 유사한 방식으로 그래프를 구성합니다.
>
> 이 시점에서 노드, 걷기 및 경로와 같은 다른 하위 구조도 루트 하위 그래프 대신 그래프를 구성하는 원자 엔티티로 간주 될 수 있다는 점에 유의하는 것이 중요합니다. 그러나 그래프 임베딩 학습에 루팅 된 하위 그래프를 더 쉽게 만드는 데에는 두 가지 이유가 있습니다.


**1) Higher order substructure.**

Compared to simpler lower order substructures such as nodes, rooted subgraphs encompass higher order neighborhoods which offers a richer representation of composition of the graphs. Hence, the embeddings learnt through sampling such higher order substructures would reflect the compositions of the graphs better.

**2) Non-linear substructure.**

Compared to linear substructures such as walks and paths, rooted subgraphs capture the inherent non-linearity in the graphs better. This fact is evident while considering the graph kernels, as well. For instance, Weisfeiler-Lehman (WL) kernel which are based on non-linear substructures offer significantly better performance on many tasks than the linear substructure based kernels such as random walk and shortest path kernels [7, 10].

> 1) 고차 하부 구조.
>
> 노드와 같은 더 단순한 하위 구조에 비해 루트 하위 그래프는 그래프의 구성에 대한 보다 풍부한 표현을 제공하는 고차 이웃을 포함합니다. 따라서 이러한 고차 하위 구조를 샘플링하여 학습 한 임베딩은 그래프의 구성을 더 잘 반영합니다.
>
> 2) 비선형 하부 구조.
>
> 걷기 및 경로와 같은 선형 하위 구조와 비교하여 루트 하위 그래프는 그래프의 고유 한 비선형 성을 더 잘 포착합니다. 이 사실은 그래프 커널을 고려할 때도 분명합니다. 예를 들어, 비선형 하위 구조를 기반으로 하는 Weisfeiler-Lehman (WL) 커널은 랜덤 워크 및 최단 경로 커널 [7, 10]과 같은 선형 하위 구조 기반 커널보다 많은 작업에서 훨씬 더 나은 성능을 제공합니다.

Through establishing the above mentioned analogy of documents and words to graphs and rooted subgraphs, respectively, one can utilize document embedding models to learn graph embeddings. The main expectation here is that structurally similar graphs will be close to each other in the embedding space. In this sense, similar to the Deep Graph Kernels [7], `graph2vec`’s embeddings provide means to arrive a data-driven graph kernel.

> 위에서 언급 한 문서와 단어의 비유를 그래프와 루트 하위 그래프에 각각 설정함으로써 문서 임베딩 모델을 활용하여 그래프 임베딩을 학습 할 수 있습니다. 여기서 주된 기대는 구조적으로 유사한 그래프가 임베딩 공간에서 서로 가깝다는 것입니다. 이러한 의미에서 Deep Graph Kernels [7]와 유사하게 `graph2vec`의 임베딩은 데이터 기반 그래프 커널에 도달하는 수단을 제공합니다.


#### 4.2 Algorithm overview

Similar to the document convention, the only required input is a corpus of graphs for `graph2vec` to learn their representations. Given a dataset of graphs, `graph2vec` considers the set of all rooted subgraphs (i.e., neighbourhoods) around every node (up to a certain degree) as its vocabulary. Subsequently, following the doc2vec skipgram training process, we learn the representations of each graph in the dataset.

To train the skipgram model in the above mentioned fashion we need to extract rooted subgraphs and assign a unique label for all the rooted subgraphs in the vocabulary. To this end, we deploy the WL relabeling strategy (which is also used by the WL kernel).

> 문서 규칙과 유사하게, 필요한 입력은 `graph2vec`이 표현을 학습하는 데 필요한 그래프 모음입니다. 그래프 데이터 세트가 주어지면 `graph2vec`은 모든 노드 (특정 정도까지) 주변의 모든 루트 하위 그래프 (즉, 이웃) 세트를 어휘로 간주합니다. 그 후, doc2vec skipgram 훈련 과정에 따라 데이터 세트에 있는 각 그래프의 표현을 학습합니다.
>
> 위에서 언급한 방식으로 스킵 그램 모델을 훈련 시키려면 루트 하위 그래프를 추출하고 어휘의 모든 루트 하위 그래프에 대해 고유한 레이블을 할당해야 합니다. 이를 위해 WL 재 라벨링 전략 (WL 커널에서도 사용됨)을 배포합니다.


#### 4.3 `graph2vec`: Algorithm

The algorithm consists of two main components; first, a procedure to generate rooted subgraphs around every node in a given graph (§4.3.1) and second, the procedure to learn embeddings of the given graphs (§4.3.2).

As presented in Algorithm 1 we intend to learn δ dimensional embeddings of all the graphs in dataset G in e epochs. We begin by randomly initializing the embeddings for all graphs in the dataset (line 2). Subsequently, we proceed with extracting rooted subgraphs around every node in each of the graphs (line 8) and iteratively learn (i.e., refine) the corresponding graph’s embedding in several epochs (lines 3 to 10). These steps represent the core of our approach and are explained in detail in the two following subsections.

> 알고리즘은 두 가지 주요 구성 요소로 구성됩니다. 첫째, 주어진 그래프 (§4.3.1)의 모든 노드 주변에 루트 하위 그래프를 생성하는 절차 (§4.3.1)와 두 번째, 주어진 그래프의 임베딩 학습 절차 (§4.3.2).
>
> 알고리즘 1에 제시된 대로 데이터 세트 G에 있는 모든 그래프의 δ 차원 임베딩을 e epoch에서 배우려고 합니다. 데이터 세트의 모든 그래프에 대한 임베딩을 무작위로 초기화 하는 것으로 시작합니다 (2 행). 그 후, 각 그래프 (8 행)의 모든 노드 주변에서 루트 하위 그래프를 추출하고 여러 세대 (3 ~ 10 행)에서 해당 그래프의 임베딩을 반복적으로 학습 (예 : 개선)합니다. 이러한 단계는 우리 접근 방식의 핵심을 나타내며 다음 두 하위 섹션에서 자세히 설명합니다.

![Algo.1](/2020/12/graph2vec_algo01.png)


##### 4.3.1 Extracting Rooted Subgraphs

To facilitate learning graph embeddings, a rooted subgraph sg(d)n around every node n of graph Gi is extracted (line 8). This is a fundamentally important task in our approach. To extract these subgraphs, we follow the wellknown WL relabeling process [10] which lays the basis for the WL kernel [7, 10]. The subgraph extraction process is explained separately in Algorithm 2. The algorithm takes the root node n, graph G from which the subgraph has to be extracted and degree of the intended subgraph d as inputs and returns the intended subgraph sg(d)n. When d = 0, no subgraph needs to be extracted and hence the label of node n is returned (line 3). For cases where d > 0, we get all the (breadth-first) neighbours of n in Nn (line 5). Then for each neighbouring node, n0, we get its degree d − 1 subgraph and save the same in list M(d)n (line 6). Finally, we get the degree d − 1 subgraph around the root node n and concatenate the same with sorted list M(d)n to obtain the intended subgraph sg(d)n (line 7).

> 그래프 임베딩 학습을 용이하게 하기 위해 그래프 Gi의 모든 노드 n 주위에 루트 하위 그래프 sg (d) n이 추출됩니다 (8 행). 이것은 우리의 접근 방식에서 근본적으로 중요한 작업입니다. 이러한 하위 그래프를 추출하기 위해 우리는 WL 커널 [7, 10]의 기초를 놓는 잘 알려진 WL 재 라벨링 프로세스 [10]를 따릅니다. 하위 그래프 추출 프로세스는 알고리즘 2에서 별도로 설명합니다. 알고리즘은 루트 노드 n, 하위 그래프를 추출해야하는 그래프 G 및 의도 된 하위 그래프 d의 차수를 입력으로 취하여 의도 한 하위 그래프 sg (d) n을 반환합니다. d = 0이면 부분 그래프를 추출 할 필요가 없으므로 노드 n의 레이블이 반환됩니다 (3 행). d> 0 인 경우 Nn (5 행)에서 n의 모든 (폭 우선) 이웃을 얻습니다. 그런 다음 각 인접 노드 n0에 대해 d-1 하위 그래프의 차수를 얻고 목록 M (d) n (6 행)에 저장합니다. 마지막으로 루트 노드 n 주변의 d-1 하위 그래프를 얻고이를 정렬 된 목록 M (d) n과 연결하여 의도 한 하위 그래프 sg (d) n (7 행)을 얻습니다.

![Algo.2](/2020/12/graph2vec_algo02.png)


##### 4.3.2 Skipgram with Negative Sampling
Given that sg(d)n ∈ SGvocab and |SGvocab| is very large, calculating P r(sg(d)n |Φ(G)) in line 9 of Algorithm 1 is prohibitively expensive. Hence we follow the negative sampling strategy (introduced in §3.2) to calculate this posterior probability.

In our negative sampling phase, for every training cycle of Algorithm 1, given a graph Gi ∈ G and a set of rooted subgraphs in its context,
c(Gi) = c = {sg1, sg2, …}, we select a set of fixed number of randomly chosen subgraphs as negative samples c0 = {sgn1, sgn2, …sgnk} such that c0 ⊂ SGvocab, k << |SGvocab| and c ∩ c0 = {}. Intuitively, negative samples (c0) is a set of k subgraphs, each of which is not present in the graph whose embedding has to be learnt (Gi), but in the vocabulary of subgraphs. The number of negative samples (k) is a hyper-parameter that could be empirically tuned. For efficient training, for every graph Gi ∈ G, first, the target-context pairs (Gi, c) are trained and the embeddings of the corresponding subgraphs are updated. Subsequently, we update only the embeddings of the negative samples c0, instead of the whole vocabulary. Given a pair of graphs Gi and Gj , this training makes their embeddings Φ(Gi) and Φ(Gj ) closer if they are composed of similar rooted subgraphs (i.e., c(Gi) is similar to c(Gj )) and at the same time distances them from the embeddings of all the graphs which are not composed of similar subgraphs.

> sg (d) n ∈ SGvocab 및 | SGvocab | 알고리즘 1의 9 행에서 Pr(sg(d)n | Φ(G))를 계산하는 것은 엄청나게 많은 비용이 듭니다.
> 따라서이 사후 확률을 계산하기 위해 음의 샘플링 전략 (§3.2에 도입 됨)을 따릅니다.
>
> 음의 샘플링 단계에서, 그래프 Gi ∈ G와 그 맥락에서 루트 하위 그래프 세트 c (Gi) = c = {sg1, sg2, …}가 주어지면
> 알고리즘 1의 모든 훈련주기에 대해 c0 ⊂ SGvocab, k << |SGvocab| 과 같은 음수 샘플로 무작위로 선택된 부분 그래프의 고정 된 수 세트 c0 = {sgn1, sgn2, … sgnk} 그리고 c ∩ c0 = {}. 직관적으로 음수 샘플 (c0)은 k 개의 하위 그래프의 집합으로, 각 하위 그래프는 임베딩을 학습해야 하는 그래프 (Gi)에는 없지만 하위 그래프의 어휘에는 없습니다.
> 음수 샘플의 수 (k)는 경험적으로 조정할 수 있는 하이퍼 매개 변수입니다. 효율적인 훈련을 위해 모든 그래프 Gi ∈ G에 대해 먼저 대상-컨텍스트 쌍 (Gi, c)이 훈련되고 해당 하위 그래프의 임베딩이 업데이트됩니다. 결과적으로 전체 어휘 대신 음수 샘플 c0의 임베딩 만 업데이트합니다. 한 쌍의 그래프 Gi 및 Gj가 주어지면 이 훈련은 유사한 루트 하위 그래프 (즉, c(Gi)가 c(Gj)와 유사)로 구성된 경우 임베딩 Φ(Gi) 및 Φ(Gj)를 더 가깝게 만듭니다. 동일한 시간은 유사한 하위 그래프로 구성되지 않은 모든 그래프의 임베딩과 거리를 둡니다.


##### 4.3.3 Optimization

Stochastic gradient descent (SGD) optimizer is used to optimize the parameters in line 9 and 10 of Algorithm 1. The derivatives are estimated using the back-propagation algorithm. The learning rate α is empirically tuned.

> 확률적 경사 하강법 (SGD) 옵티마이저는 알고리즘 1의 라인 9 및 10에서 매개 변수를 최적화하는데 사용됩니다. 미분은 역전파 알고리즘을 사용하여 추정됩니다. 학습률 α는 경험적으로 조정됩니다.


#### 4.4 Use cases

Once the embeddings of graphs are computed using `graph2vec`, they could be used for a variety of downstream graph analytics tasks. The prominent ones are reviewed below.

> `graph2vec`를 사용하여 그래프 임베딩이 계산되면 다양한 다운 스트림 그래프 분석 작업에 사용할 수 있습니다. 눈에 띄는 것들은 아래에서 검토됩니다.


**Graph Classification.**

Given G, a set of graphs and Y, the set of corresponding class labels, graph classification is the task where we learn a model H such that H : G → Y . To this end, one could obtain the embeddings of all the graphs in G and feed them to general purpose classifiers such as RFs, Nueral Networks and SVMs to perform classification. At this juncture, it is important to note that other graph embedding procedure such as graph kernels and substructure embeddings do not offer this flexibility. More specifically, in the case of such methods, the kernel matrices computed using them could be used only in conjunction with kernel classifiers (e.g., SVMs) and general purpose classifiers could not be used.

> G, 그래프 세트 및 Y, 해당 클래스 레이블 세트가 주어지면 그래프 분류는 H : G → Y와 같은 모델 H를 학습하는 작업입니다. 이를 위해 G에 있는 모든 그래프의 임베딩을 얻고 이를 RF, Nueral Networks 및 SVM과 같은 범용 분류기에 공급하여 분류를 수행 할 수 있습니다. 이 시점에서 그래프 커널 및 하위 구조 임베딩과 같은 다른 그래프 임베딩 절차는 이러한 유연성을 제공하지 않는다는 점에 유의하는 것이 중요합니다. 보다 구체적으로, 이러한 방법의 경우,이를 사용하여 계산 된 커널 행렬은 커널 분류기 (예 : SVM)와 함께 만 사용할 수 있으며 범용 분류기는 사용할 수 없습니다.


**Graph Clustering.**

Given G, in graph clustering, the goal is to group similar graphs together. `graph2vec`’s embeddings could be used along with general purpose clustering algorithms such as K-means and relational clustering algorithms such as Affinity Propagation (AP) [14] to achieve this. Again, due to the aforementioned limitations of graph kernels and substructure embeddings, they could be used only with relational clustering algorithms.

> G가 주어지면 그래프 클러스터링에서 목표는 유사한 그래프를 함께 그룹화 하는 것입니다. `graph2vec`의 임베딩은 이를 달성하기 위해 K-평균과 같은 범용 클러스터링 알고리즘 및 AP (Affinity Propagation) [14]와 같은 관계형 클러스터링 알고리즘과 함께 사용할 수 있습니다. 다시 말하지만, 앞서 언급한 그래프 커널 및 하위 구조 임베딩의 한계로 인해 관계형 클러스터링 알고리즘에서만 사용할 수 있습니다.


### 5. EVALUATION

We evaluate `graph2vec`’s accuracy and efficiency both in graph classification and clustering tasks. Besides experimenting with benchmark datasets, we also evaluate our approach on two real-world graph analytics tasks from the field of program analysis, namely, malware detection and malware familial clustering on large malware datasets.

> 그래프 분류 및 클러스터링 작업 모두에서 `graph2vec`의 정확성과 효율성을 평가합니다. 벤치 마크 데이터 세트로 실험하는 것 외에도 프로그램 분석 분야의 두 가지 실제 그래프 분석 작업, 즉 대규모 맬웨어 데이터 세트에 대한 맬웨어 탐지 및 맬웨어 가족 클러스터링에 대한 접근 방식을 평가합니다.


**Research Questions.**

Specifically, we intend to address the following research questions: (1) How does `graph2vec` compare to state-of-the-art substructure representation learning approaches and graph kernels for graph classification tasks in terms of accuracy and efficiency on benchmark datasets, (2) How does `graph2vec` compare to the aforementioned state-of-the-art approaches on a realworld graph classification task, namely, malware detection detection, and (3) How does `graph2vec` compare to the aforementioned state-of-the-art approaches on a real-world graph clustering task, namely, malware familial clustering.

> 구체적으로 다음과 같은 연구 질문을 다룰 예정입니다. (1) `graph2vec`은 벤치 마크 데이터 세트의 정확성 및 효율성 측면에서 그래프 분류 작업을 위한 최첨단 하위 구조 표현 학습 접근 방식 및 그래프 커널과 어떻게 비교됩니까? (2) `graph2vec`은 실제 그래프 분류 작업, 즉 맬웨어 탐지 감지에서 앞서 언급 한 최첨단 접근 방식과 어떻게 비교되며 (3) `graph2vec`은 실제 상황에서 앞서 언급 한 최첨단 접근 방식과 어떻게 비교됩니까? 실세계 그래프 클러스터링 작업, 즉 맬웨어 가족 클러스터링.


**Comparative Analysis.**

The proposed approach is compared with two representation learning techniques, namely, node2vec [4] and sub2vec [5] and two graph kernel techniques, namely, WL kernel [10] and Deep WL kernel [7]. node2vec is a neural embedding framework which learns feature representation of individual nodes in graphs. In our experiments, to obtain embeddings of entire graphs using node2vec, we average those of all the nodes in the graph. sub2vec [5] is a framework that learns representations of any arbitrary subgraphs. Therefore, obtaining representation of whole graphs using sub2vec is a straightforward procedure. WL kernel [10] is handcrafted feature based kernel that decomposes graphs into rooted subgraphs and computes the kernel values based on them. Besides kernel values, it also yields explicit vector representations of graphs. Deep WL kernel [7] is a representation learning variant of WL kernel which learns embeddings of rooted subgraphs such that similar subgraphs have similar embeddings. Thus, the kernel values obtained using subgraph embeddings would be unaffected by the limitations of handcrafted features such as diagonal dominance.

> 제안된 접근 방식은 두 가지 표현 학습 기법 인 node2vec [4]와 sub2vec [5]와 두 가지 그래프 커널 기법, 즉 WL 커널 [10]과 Deep WL 커널 [7]과 비교됩니다. node2vec는 그래프에서 개별 노드의 특징 표현을 학습하는 신경 임베딩 프레임 워크입니다. 실험에서 node2vec를 사용하여 전체 그래프의 임베딩을 얻기 위해 그래프에 있는 모든 노드의 임베딩을 평균합니다. sub2vec [5]는 임의의 하위 그래프의 표현을 학습하는 프레임 워크입니다. 따라서 sub2vec를 사용하여 전체 그래프를 표현하는 것은 간단한 절차입니다. WL 커널 [10]은 그래프를 루트 하위 그래프로 분해하고 이를 기반으로 커널 값을 계산하는 기능 기반 커널입니다. 커널 값 외에도 그래프의 명시적 벡터 표현도 생성합니다. Deep WL kernel [7]은 유사한 하위 그래프가 유사한 임베딩을 갖도록 루트 하위 그래프의 임베딩을 학습하는 WL 커널의 표현 학습 변형입니다. 따라서 부분 그래프 임베딩을 사용하여 얻은 커널 값은 대각선 우위와 같은 수작업 기능의 한계에 영향을 받지 않습니다.


**Evaluation Setup.**

All the experiments were conducted on a server with 36 CPU cores (Intel E5-2699 2.30GHz processor) and 200 GB RAM running Ubuntu 14.04.

> 모든 실험은 36 개의 CPU 코어 (Intel E5-2699 2.30GHz 프로세서)와 Ubuntu 14.04를 실행하는 200GB RAM이있는 서버에서 수행되었습니다.


#### 5.1 Graph Classification with Benchmark Datasets

**Datasets.**

Five benchmark graph classification datasets namely MUTAG, PTC, PROTEINS, NCI1 and NCI109 are used in this experiment. These datasets belong to chemoand bio-informatics domains and the specifications of the datasets used are given in Table 1. MUTAG is a data set of 188 chemical compounds labeled according to whether or not they have a mutagenic effect on a specific bacteria. PTC dataset comprises of 344 compounds and their classes indicate carcinogenicity on rats. PROTEINS is a collection of graphs whose nodes represent secondary structure elements and edges indicate neighborhood in the amino-acid sequence or in 3D space. NCI1 and NCI109 datasets consist of 4,110 and 4,127 graphs respectively, representing two balanced subsets of datasets of chemical compounds screened for activity against non-small cell lung cancer and ovarian cancer cell lines, respectively.

> 이 실험에는 MUTAG, PTC, PROTEINS, NCI1 및 NCI109라는 5 개의 벤치 마크 그래프 분류 데이터 세트가 사용되었습니다. 이러한 데이터 세트는 화학 및 생물 정보학 도메인에 속하며 사용 된 데이터 세트의 사양은 표 1에 나와 있습니다. MUTAG는 특정 박테리아에 대한 돌연변이 유발 효과가 있는지 여부에 따라 라벨이 지정된 188 개의 화학 화합물 데이터 세트입니다. PTC 데이터 세트는 344 개의 화합물로 구성되어 있으며 그 클래스는 쥐의 발암 성을 나타냅니다. PROTEINS는 노드가 2 차 구조 요소를 나타내고 모서리가 아미노산 서열 또는 3D 공간에서 이웃을 나타내는 그래프 모음입니다. NCI1 및 NCI109 데이터 세트는 각각 4,110 및 4,127 그래프로 구성되며, 각각 비소 세포 폐암 및 난소 암 세포주에 대한 활성에 대해 스크리닝 된 화학 화합물 데이터 세트의 균형 잡힌 두 하위 집합을 나타냅니다.

![Tbl.1](/2020/12/graph2vec_tbl01.png)


**Experiment & Configurations.**

In this experiment, for each of the datasets, we train a SVM classifier with 90% of the samples chosen at random and evaluate its performance on the test set of remaining 10% samples. The hyperparameters of the classifiers are tuned based on 5-fold cross validation on the training set. For all the representation learning methods, we used a common embedding dimensions of 1024, which was arrived empirically.

> 이 실험에서는 각 데이터 세트에 대해 무작위로 선택한 샘플의 90 %로 SVM 분류기를 훈련하고 나머지 10 % 샘플의 테스트 세트에서 성능을 평가합니다. 분류기의 하이퍼 파라미터는 훈련 세트에 대한 5겹 교차 검증을 기반으로 조정됩니다. 모든 표현 학습 방법에 대해 경험적으로 얻은 1024의 공통 임베딩 차원을 사용했습니다.


**Evaluation Metrics.**

The experiment is repeated 5 times and the average accuracy is used to determine the effectiveness of classification. Efficiency is determined in terms of time consumed for building graph embeddings (aka pre-training duration). The training and testing durations are not reported as they are not directly related to the proposed method.

> 실험을 5 회 반복하고 평균 정확도를 사용하여 분류의 효과를 결정합니다. 효율성은 그래프 임베딩을 구축하는데 소요되는 시간 (사전 훈련 기간)으로 결정됩니다. 훈련 및 테스트 기간은 제안된 방법과 직접 관련이 없으므로 보고되지 않습니다.

![Fig.2](/2020/12/graph2vec_fig02.png)


##### 5.1.1 Results and Discussion

**Accuracy.**

The results obtained by the `graph2vec` on benchmark datasets are summarized in Table 2. From the results, it is evident that the proposed approach outperforms other representation learning and kernel based techniques on 3 datasets (MUTAG, PTC and PROTEINS) and has comparable accuracy on the remaining 2 datasets (NCI1 and NCI109). The following inferences are made from the table.

> 벤치 마크 데이터 세트에 대한 `graph2vec`의 결과는 표 2에 요약되어 있습니다. 결과를 보면 제안 된 접근 방식이 3 개의 데이터 세트 (MUTAG, PTC 및 PROTEINS)에 대한 다른 표현 학습 및 커널 기반 기술을 능가하고 있는 것이 분명합니다. 나머지 2 개의 데이터 세트 (NCI1 및 NCI109). 표에서 다음과 같은 추론이 이루어집니다.

• node2vec being a lower order substructure embedding technique, it could only model local similarity within a confined neighborhood and fails to learn global structural similarities that helps to classify similar graphs together. This is especially evident from the results on larger datasets, PROTEINS, NCI1 and NCI109 where node2vec’s accuracy is just above 50% (i.e., only marginally better than random classification). In general, from these results, one could conclude that while the substructure embeddings techniques excel in substructure based analytics tasks (see [4] for node2vec’s node classification and link prediction performances), extending them directly for tasks involving whole graphs yields sub-par accuracies.

• sub2vec performs predominantly poorly across all datasets. This is mainly because of the fact that its strategy to sample graph substructures and learn their embeddings is particularly ill-suited for obtaining embedding of large graphs. That is, sub2vec samples only one random walk (of fixed length) from the given graph and subsequently learns its representations using fixed length linear context skipgrams (with several iterations) over the sampled walk. This prevents sub2vec from learning meaningful representations of an entire graph, as sampling only random walk may not be enough to cover all the neighborhoods in the graph. This ultimately prevents the method from appropriately modeling the structural similarities across graphs which reflects in its poor performance. Also, this inference is reinforced by the fact that sub2vec accuracies decrease with the increase in the size of the graphs (see the difference in accuracies for MUTAG and NCI109 datasets).

• WL kernel, being a technique particularly designed to cater tasks such as graph classification, consistently provides good results on all datasets. Deep WL Kernel performs better than WL kernel on all datasets, as it addresses the limitations of the latter kernel’s handcrafted features and achieves better generalization.

• Finally, `graph2vec`’s structure-preserving, data-driven embedding which appropriately models both local and global similarities among graphs, consistently yields good results on all datasets. In particular, it outperforms all the state-of-the-art methods in MUTAG, PTC and PROTEINS dataset and obtains slightly lesser accuracies on NCI1 and NCI109 datasets than the kernels.

> • node2vec는 하위 구조 임베딩 기술이기 때문에 제한된 이웃 내에서 로컬 유사성을 모델링 할 수 있으며 유사한 그래프를 함께 분류하는 데 도움이 되는 글로벌 구조적 유사성을 학습하지 못합니다. 이는 특히 node2vec의 정확도가 50 %를 약간 넘는 더 큰 데이터 세트 인 PROTEINS, NCI1 및 NCI109에 대한 결과에서 분명합니다 (즉, 무작위 분류보다 약간 더 좋음). 일반적으로 이러한 결과를 통해 하위 구조 임베딩 기술이 하위 구조 기반 분석 작업에서 탁월하지만 (node2vec의 노드 분류 및 링크 예측 성능에 대해서는 [4] 참조) 전체 그래프를 포함하는 작업에 대해 직접 확장하면 하위 수준의 정확도가 생성된다는 결론을 내릴 수 있습니다. .
>
> • sub2vec는 모든 데이터 세트에서 주로 성능이 저하됩니다. 이는 주로 그래프 하위 구조를 샘플링하고 임베딩을 학습하는 전략이 큰 그래프 임베딩을 얻는 데 특히 적합하지 않기 때문입니다. 즉, sub2vec은 주어진 그래프에서 하나의 임의 걷기 (고정 길이) 만 샘플링 한 후 샘플링 된 걷기에 대해 고정 길이 선형 컨텍스트 스킵 그램 (여러 반복 포함)을 사용하여 그 표현을 학습합니다. 이것은 임의의 걷기 만 샘플링하는 것만으로는 그래프의 모든 이웃을 포함하기에 충분하지 않을 수 있으므로 sub2vec이 전체 그래프의 의미있는 표현을 학습하는 것을 방지합니다. 이것은 궁극적으로 방법이 성능 저하를 반영하는 그래프 전체의 구조적 유사성을 적절하게 모델링하는 것을 방지합니다. 또한이 추론은 그래프 크기가 ​​증가함에 따라 sub2vec 정확도가 감소한다는 사실에 의해 강화됩니다 (MUTAG 및 NCI109 데이터 세트의 정확도 차이 참조).
>
> • 그래프 분류와 같은 작업을 처리하기 위해 특별히 설계된 기술인 WL 커널은 모든 데이터 세트에서 일관되게 좋은 결과를 제공합니다. Deep WL Kernel은 후자 커널의 수작업 기능의 한계를 해결하고 더 나은 일반화를 달성하기 때문에 모든 데이터 세트에서 WL 커널보다 더 나은 성능을 발휘합니다.
>
> • 마지막으로 `graph2vec`의 구조 보존 데이터 기반 임베딩은 그래프 간의 로컬 및 글로벌 유사성을 적절하게 모델링하여 모든 데이터 세트에서 일관되게 좋은 결과를 산출합니다. 특히, MUTAG, PTC 및 PROTEINS 데이터 세트의 모든 최첨단 방법을 능가하며 NCI1 및 NCI109 데이터 세트에서 커널보다 정확도가 약간 낮습니다.


**Efficiency.**

A pre-training phase to compute vectors of substructures and graphs is required for all the aforementioned methods except WL kernel. On the other hand, WL kernel requires a phase to extract rooted subgraph features and build handcrafted embeddings. In the case of former approaches, pre-training is the crucial step that helps in capturing latent substructure similarities in graphs and thus aids them to outperform handcrafted feature techniques. Therefore, it is important to study the cost of pre-training. The results of pre-training/feature extraction durations for all the methods under study are shown in Figure 2.

Understandably, WL kernel is the most scalable method for obtaining graph embeddings as it does not involve learning representations. node2vec learns embeddings of lower order entities (i.e., nodes) through confined explorations of neighborhoods around them and hence takes very less time for pretraining. sub2vec learns graph embeddings by sampling linear substructures and running several iterations of skipgram algorithm over them. This results in significantly high pretraining durations. DeepWL kernel learns rooted subgraph embeddings using skipgram. It takes much lesser duration than sub2vec as the latter’s length of sampled random walk is much longer than the number of samples rooted subgraphs in the former. Finally, our approach, which learns embeddings of higher order structures remains less scalable than node2vec, but much more scalable than Deep WL kernel and sub2vec. This is due to the fact that, our approach runs skipgram training only a limited number times (which is equal to the number of rooted subgraphs sampled form the given graph), while the other two approaches run it several times over a fixed length linear context window.

The efficiency results in our experiments with real-world datasets discussed in subsequent subsections follow the same pattern as the one discussed above. Hence, we refrain from discussing efficiency results here after.

> WL 커널을 제외한 앞서 언급한 모든 방법에 대해 하위 구조 및 그래프의 벡터를 계산하기 위한 사전 훈련 단계가 필요합니다. 반면에 WL 커널은 루팅된 하위 그래프 기능을 추출하고 수제 임베딩을 빌드하는 단계가 필요합니다. 이전 접근 방식의 경우 사전 학습은 그래프에서 잠재적인 하위 구조 유사성을 캡처하는데 도움이 되는 중요한 단계이므로 수작업 기능 기술을 능가하는데 도움이 됩니다. 따라서 사전 훈련 비용을 연구하는 것이 중요합니다. 연구중인 모든 방법에 대한 사전 훈련 / 특징 추출 기간의 결과는 그림 2에 나와 있습니다.
>
> 당연히 WL 커널은 학습 표현을 포함하지 않으므로 그래프 임베딩을 얻는데 가장 확장 가능한 방법입니다. node2vec는 주변 이웃의 제한된 탐색을 통해 하위 개체 (즉, 노드)의 임베딩을 학습하므로 사전 훈련에 매우 적은 시간이 걸립니다. sub2vec은 선형 하위 구조를 샘플링하고 그 위에 스킵그램 알고리즘을 여러번 반복하여 그래프 임베딩을 학습합니다. 이로 인해 사전 훈련 기간이 상당히 길어집니다. DeepWL 커널은 skipgram을 사용하여 루팅된 부분 그래프 임베딩을 학습합니다. 후자의 샘플링 된 랜덤워크 길이가 전자의 샘플 루트 하위 그래프 수보다 훨씬 길기 때문에 sub2vec보다 훨씬 짧은 기간이 걸립니다. 마지막으로, 고차 구조의 임베딩을 학습하는 우리의 접근 방식은 node2vec보다 확장성이 낮지만 Deep WL 커널 및 sub2vec보다 훨씬 확장 가능합니다. 이는 우리의 접근 방식이 제한된 횟수 (주어진 그래프에서 샘플링 된 루트 하위 그래프의 수와 동일) 만 skipgram 훈련을 실행하는 반면, 다른 두 접근 방식은 고정 길이 선형 컨텍스트 윈도우에서 이를 여러번 실행하기 때문입니다.
>
> 이후 하위 섹션에서 논의되는 실제 데이터 세트를 사용한 실험의 효율성 결과는 위에서 논의한 것과 동일한 패턴을 따릅니다. 따라서 우리는 여기서 효율성 결과에 대해 논의하지 않습니다.

![Tbl.2](/2020/12/graph2vec_tbl02.png)


#### 5.2 Graph Classification with Real-world Dataset

The performances of graph embedding approaches on large real-world datasets may be different from the benchmark ones as they are more complex. Furthermore, benchmark datasets used in §5.1 are too small for the data-driven embedding approaches to reap considerable leverage by exploiting the volume of data over the handcrafted approaches. Therefore, it is highly essential to evaluate the performance of the proposed method on large real-world datasets to showcase its true potentials.

> 대규모 실제 데이터 세트에 대한 그래프 임베딩 접근 방식의 성능은 더 복잡하기 때문에 벤치 마크 방식과 다를 수 있습니다. 또한 §5.1에 사용 된 벤치 마크 데이터 세트는 데이터 기반 임베딩 접근 방식이 수작업 방식을 통해 데이터 양을 활용하여 상당한 활용을 하기에는 너무 작습니다. 따라서 실제 잠재력을 보여주기 위해 대규모 실제 데이터 세트에서 제안 된 방법의 성능을 평가하는 것이 매우 중요합니다.

![Tbl.3,4](/2020/12/graph2vec_tbl03-04.png)


**Experiment & Configurations.**

To this end, we consider a large-scale Android malware detection problem where we are given a dataset of API Dependency Graphs (ADGs) of malicious and benign Android apps, and the task is to represent each of them as vectors and train ML classifiers to identify malicious ones. The datasets statistics are presented in Table 3. Evidently, these ADGs are much larger than the benchmark graphs. The dataset comprises of 10,560 ADGs, each of which contain more than 2,600 nodes (i.e., instructions), 920 edges (i.e., control flows among instructions) and 4200 unique node labels (i.e., APIs invoked in instructions) on average. The training set comprises of 70% of samples chosen at random and the remaining 30% samples are used as test set to evaluate the models. The experiment is repeated 5 times and the results are averaged.

> 이를 위해 악성 및 무해한 Android 앱의 API 종속성 그래프 (ADG) 데이터 세트가 제공되는 대규모 Android 맬웨어 감지 문제를 고려하고, 각 앱을 벡터로 표현하고 ML 분류기를 학습시켜 악의적 인 것을 식별하십시오. 데이터 세트 통계는 표 3에 나와 있습니다. 분명히 이러한 ADG는 벤치 마크 그래프보다 훨씬 큽니다. 데이터 세트는 평균 10,560 개 ADG로 구성되며, 각 ADG에는 2,600 개 이상의 노드 (예 : 명령), 920 개의 에지 (예 : 명령 간의 제어 흐름) 및 4200 개의 고유 노드 레이블 (예 : 명령에서 호출 된 API)이 포함됩니다. 훈련 세트는 무작위로 선택한 샘플의 70 %로 구성되며 나머지 30 % 샘플은 모델을 평가하기 위한 테스트 세트로 사용됩니다. 실험을 5 회 반복하고 결과를 평균화합니다.


**Evaluation Metrics.**

The same evaluation metrics that are used in experiments with benchmark datasets (see §5.1) are used here as well.

> 벤치 마크 데이터 세트 (§5.1 참조)를 사용한 실험에서 사용되는 것과 동일한 평가 메트릭이 여기에서도 사용됩니다.


##### 5.2.1 Results & Discussion

The malware detection results of the proposed and compared state-of-the-art approaches are presented in Table 4. From the results obtained, the following inference is drawn:

• Averaging node2vec embeddings and using sub2vec to obtain graph representations perform poorly in this experiment as well. In particular, the proposed approach outperforms these two techniques by more than 17% and 22%, respectively.

• Both WL and Deep WL kernels perform significantly better than the two substructure representation learning approaches. However, `graph2vec` still outperforms these techniques by 1.91% and 0.87%, respectively.

• Evidently, being data-driven approaches, both `graph2vec` and Deep WL kernel exhibit excellent performance on this large-scale dataset. Especially in this experiment, the range in which they outperform other techniques under comparison is more pronounced than the experiments with benchmark datasets. Again, the two representation learning approaches, node2vec and sub2vec perform worse as they are ill-suited for learning embeddings of entire graphs.

> 제안되고 비교된 최첨단 접근 방식의 맬웨어 탐지 결과는 표 4에 나와 있습니다. 얻은 결과로부터 다음과 같은 추론을 도출합니다.
>
> • node2vec 임베딩을 평균화하고 sub2vec를 사용하여 그래프 표현을 얻기 위해 이 실험에서도 성능이 좋지 않습니다. 특히 제안 된 접근 방식은 이 두 기술을 각각 17 % 및 22 % 이상 능가합니다.
>
> • WL 및 Deep WL 커널 모두 두 가지 하위 구조 표현 학습 접근 방식보다 훨씬 우수한 성능을 발휘합니다. 그러나 `graph2vec`은 여전히 ​​이러한 기술을 각각 1.91 % 및 0.87 % 능가합니다.
>
> • 데이터 기반 접근 방식이므로 `graph2vec` 및 Deep WL 커널 모두이 대규모 데이터 세트에서 우수한 성능을 나타냅니다. 특히 이 실험에서는 비교중인 다른 기술보다 성능이 우수한 범위가 벤치 마크 데이터 세트를 사용한 실험보다 더 두드러집니다. 다시 말하지만, 두 가지 표현 학습 접근 방식인 node2vec 및 sub2vec는 전체 그래프의 임베딩 학습에 적합하지 않기 때문에 성능이 저하됩니다.


#### 5.3 Graph Clustering

The goal of this experiment is to demonstrate the efficacy of `graph2vec`’s embedding in a downstream analytics task where we do not have class labels for graphs. This task would be most appropriate for evaluating and comparing the methods that do not leverage on any task-specific information in the process of learning representations.

> 이 실험의 목표는 그래프에 대한 클래스 레이블이 없는 다운 스트림 분석 작업에 `graph2vec`의 임베딩 효과를 입증하는 것입니다. 이 작업은 표현 학습 과정에서 작업별 정보를 활용하지 않는 방법을 평가하고 비교하는데 가장 적합합니다.

![Tbl.5](/2020/12/graph2vec_tbl05.png)


**Experiment & Configurations.**

In this experiment, we are given with ADGs of malware samples and the name of families to which they belong and the task is to group samples belonging to the same family into the same cluster. To this end, we consider the AMD dataset [13] which comprises of more than 24,000 Android malware apps belonging to 71 families. The statistics of this dataset is presented in Table 3.

From this dataset, only the large families that have more than 100 corresponding malware samples are considered for clustering as this helps to mitigate imbalance in the cluster sizes. The embeddings and kernels of ADGs belonging to these families are built and a relational clustering algorithm, namely, AP [14] is used to cluster them.

> 이 실험에서는 멀웨어 샘플의 ADG와 이들이 속한 계열의 이름이 주어지며, 작업은 동일한 계열에 속하는 샘플을 동일한 클러스터로 그룹화하는 것입니다. 이를 위해 71 개 제품군에 속하는 24,000 개 이상의 Android 맬웨어 앱으로 구성된 AMD 데이터 세트 [13]를 고려합니다. 이 데이터 세트의 통계는 표 3에 나와 있습니다.
>
> 이 데이터 세트에서 해당 맬웨어 샘플이 100 개가 넘는 대규모 패밀리만 클러스터링에 고려됩니다. 이는 클러스터 크기의 불균형을 완화하는데 도움이됩니다. 이들 계열에 속하는 ADG의 임베딩 및 커널이 구축되고 관계형 클러스터링 알고리즘, 즉 AP [14]를 사용하여 클러스터링합니다.


**Evaluation Metric.**

In order to quantitatively measure malware familial clustering accuracy, a standard clustering evaluation metric, namely, Adjusted Rand Index (ARI) is used. The ARI values lie in the range [-1, 1]. For the ease of understanding, we report the ARI as a percentage value. A higher ARI means a higher correspondence to the ground-truth data.

> 악성 코드 가족 클러스터링 정확도를 정량적으로 측정하기 위해 표준 클러스터링 평가 지표 인 ARI (Adjusted Rand Index)가 사용됩니다. ARI 값은 [-1, 1] 범위에 있습니다. 이해의 편의를 위해 ARI를 백분율 값으로 보고합니다. ARI가 높을수록 실측 데이터에 대한 대응도가 높습니다.


##### 5.3.1 Results and Discussion

The results of malware clustering using `graph2vec` and other state-of-the-art methods are presented in Table 5. From the table, the following inferences are drawn:

• At the outset, we observe all the method obtain lesser ARIs in this experiment, as the malware clustering task is inherently more complex than two classification tasks considered previously.

• Similar to the classification tasks, both node2vec and sub2vec perform poorer than the kernels and `graph2vec`. This reinforces the inference that adopting node2vec and sub2vec for graph embedding will yield subpar results.

• Both WL and Deep WL kernel perform much better than the two aforementioned embedding approaches. However, different from the classification tasks, in this task, the former methods outperform the latter methods by more than 2 folds.

• In this experiment, `graph2vec` outperforms all the other compared approaches highly significantly. In particular, it outperforms the substructure embedding techniques by more than 39% and the kernels by more than 5%. This reinforces the findings inferred from the classification experiments.

> `graph2vec` 및 기타 최신 방법을 사용한 맬웨어 클러스터링의 결과는 표 5에 나와 있습니다. 표에서 다음과 같은 추론을 도출합니다.
>
> • 처음에는 맬웨어 클러스터링 작업이 이전에 고려한 두 가지 분류 작업보다 본질적으로 더 복잡하기 때문에 이 실험에서 모든 방법이 더 적은 ARI를 얻는 것을 관찰합니다.
>
> • 분류 작업과 유사하게 node2vec 및 sub2vec 모두 커널 및 `graph2vec`보다 성능이 떨어집니다. 이것은 그래프 임베딩을 위해 node2vec 및 sub2vec를 채택하면 더 낮은 결과를 산출 할 것이라는 추론을 강화합니다.
>
> • WL과 Deep WL 커널 모두 앞서 언급 한 두 가지 임베딩 접근 방식보다 훨씬 더 잘 수행됩니다. 그러나 분류 작업과 달리 이 작업에서는 전자의 방법이 후자의 방법보다 2 배 이상 우수한 성능을 보입니다.
>
> •이 실험에서 `graph2vec`은 비교되는 다른 모든 접근 방식을 훨씬 능가합니다. 특히 하부 구조 임베딩 기술을 39 % 이상, 커널을 5 % 이상 능가합니다. 이것은 분류 실험에서 추론 된 결과를 강화합니다.


**Summary.**

Summarizing the inferences from all the three experiments, one could see: (1) trivially extending node and subgraph representation learning approaches to build graph embeddings yield sub-par results, and (2) learning graph embedding from data leads to more accurate results than building the same using handcrafted features. Since `graph2vec` is appropriately designed, it achieves excellent accuracies in graph analytics tasks with reasonably good efficiency.

> 세 가지 실험 모두에서 추론을 요약하면 (1) 노드 및 하위 그래프 표현 학습 접근 방식을 사소하게 확장하여 그래프 임베딩을 구축하고 (2) 데이터에서 그래프 임베딩을 학습하면 구축보다 더 정확한 결과를 얻을 수 있습니다. 수제 기능을 사용하여 동일합니다. `graph2vec`은 적절하게 설계 되었기 때문에 합리적으로 우수한 효율성으로 그래프 분석 작업에서 탁월한 정확도를 달성합니다.


### 6. CONCLUSIONS

In this paper, we presented `graph2vec`, an unsupervised representation learning technique to learn embedding of graphs of arbitrary sizes. Through our largescale experiments involving benchmark graph classification datasets, we demonstrate that graph embeddings learnt by our approach outperform substructure embedding approaches significantly and are comparable to graph kernels. Since `graph2vec` is a data-driven representation learning approach, its true potentials are revealed when trained on large volumes of graphs. To this end, when evaluated on two real-world applications involving large graph datasets, `graph2vec` outperforms state-of-the-art graph kernels without compromising efficiency of the overall performance. We make all the code and data used within this work available at: [15].

> 이 논문에서는 임의 크기의 그래프 임베딩을 학습하기 위한 비지도 학습 기법인 `graph2vec`를 제시했습니다. 벤치 마크 그래프 분류 데이터 세트와 관련된 대규모 실험을 통해 우리의 접근 방식을 통해 학습한 그래프 임베딩이 하위 구조 임베딩 접근 방식을 크게 능가하고 그래프 커널과 비교할 수 있음을 보여줍니다. `graph2vec`은 데이터 기반 표현 학습 접근 방식이므로 많은 양의 그래프에서 학습하면 진정한 잠재력이 드러납니다. 이를 위해 대형 그래프 데이터 세트를 포함하는 두 개의 실제 애플리케이션에서 평가할 때 `graph2vec`은 전체 성능의 효율성을 손상시키지 않으면서 최첨단 그래프 커널을 능가합니다. 이 작업에 사용된 모든 코드와 데이터는 [15]에서 사용할 수 있습니다.


\[끝\]
