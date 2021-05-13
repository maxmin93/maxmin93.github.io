---
title: "Efficient Graph Computation for Node2Vec (2018.5)"
date: 2020-12-02 00:00:00 +0000
categories: ["papers", "KG"]
tags: ["Node2Vec", "`Fast-Node2Vec`", "Spark-Node2Vec", "Pregel-Like", "Big-Graph", "network analysis"]
---

**Efficient Graph Computation for Node2Vec (2018.5)**

Dongyan Zhou, Songjie Niu, Shimin Chen∗

- link: [https://arxiv.org/pdf/1805.00280.pdf](https://arxiv.org/pdf/1805.00280.pdf)


### Abstract

Node2Vec is a state-of-the-art general-purpose feature learning method for network analysis. However, current solutions cannot run Node2Vec on large-scale graphs with billions of vertices and edges, which are common in real-world applications. The existing distributed Node2Vec on Spark incurs significant space and time overhead. It runs out of memory even for mid-sized graphs with millions of vertices. Moreover, it considers at most 30 edges for every vertex in generating random walks, causing poor result quality.

In this paper, we propose `Fast-Node2Vec`, a family of efficient Node2Vec random walk algorithms on a Pregel-like graph computation framework. `Fast-Node2Vec` computes transition probabilities during random walks to reduce memory space consumption and computation overhead for largescale graphs. The Pregel-like scheme avoids space and time overhead of Spark’s read-only RDD structures and shuffle operations. Moreover, we propose a number of optimization techniques to further reduce the computation overhead for popular vertices with large degrees. Empirical evaluation show that `Fast-Node2Vec` is capable of computing Node2Vec on graphs with billions of vertices and edges on a mid-sized machine cluster. Compared to Spark-Node2Vec, `Fast-Node2Vec` achieves 7.7–122x speedups.

> Node2Vec은 네트워크 분석을위한 최첨단 범용 기능 학습 방법입니다. 그러나 현재 솔루션은 실제 애플리케이션에서 흔히 볼 수있는 수십억 개의 정점과 모서리가 있는 대규모 그래프에서 Node2Vec을 실행할 수 없습니다. Spark의 기존 분산 Node2Vec은 상당한 공간 및 시간 오버 헤드를 발생시킵니다. 수백만 개의 정점이 있는 중간 크기 그래프의 경우에도 메모리가 부족합니다. 또한 무작위 걷기를 생성할 때 모든 정점에 대해 최대 30개의 가장자리를 고려하여 결과 품질이 저하됩니다.
>
> 이 백서에서는 Pregel과 같은 그래프 계산 프레임워크에서 효율적인 Node2Vec 랜덤 워크 알고리즘 제품군인 `Fast-Node2Vec`을 제안합니다. `Fast-Node2Vec`은 랜덤 워크 중 전환 확률을 계산하여 대규모 그래프의 메모리 공간 소비와 계산 오버 헤드를 줄입니다. Pregel과 유사한 체계는 Spark의 읽기전용 RDD 구조 및 셔플 작업의 공간 및 시간 오버헤드를 방지합니다. 또한, 우리는 큰 정도의 인기 있는 정점에 대한 계산 오버 헤드를 더욱 줄이기 위해 여러 최적화 기술을 제안합니다. 경험적 평가에 따르면 `Fast-Node2Vec`은 중간 크기의 기계 클러스터에서 수십억 개의 정점과 모서리가 있는 그래프에서 Node2Vec을 계산할 수 있습니다. Spark-Node2Vec에 비해 `Fast-Node2Vec`은 7.7–122 배의 속도 향상을 달성합니다.


### 1. INTRODUCTION

Graph is an important big data model, widely used to represent real-world entities and relationships in applications ranging from the World Wide Web [1], social networks [6], publication networks [18], to protein-protein interaction networks in bioinformatics [13]. One promising approach to network (graph) analysis is to construct feature vectors to represent vertices or edges in a graph such that classical machine learning algorithms can be applied to the resulting vector representations for network analysis tasks, such as node classification [16] and link prediction [6]. Node2Vec [5] is a state-of-the-art general-purpose feature learning method for network analysis. It has been shown that Node2Vec achieves better accuracy than other competitive feature learning solutions, including Spectral Clustering [15], DeepWalk [12], and LINE [14], as well as a number of popular heuristic solutions [5].

> 그래프는 월드 와이드 웹 [1], 소셜 네트워크 [6], 출판 네트워크 [18], 생물 정보학의 단백질-단백질 상호 작용 네트워크에 이르는 응용 프로그램에서 실제 개체와 관계를 나타내는데 널리 사용되는 중요한 빅데이터 모델입니다. [13]. 네트워크 (그래프) 분석에 대한 한가지 유망한 접근 방식은 노드 분류 [16] 및 링크와 같은 네트워크 분석 작업을 위한 결과 벡터 표현에 고전적인 기계 학습 알고리즘을 적용할 수 있도록 그래프에서 꼭지점 또는 가장자리를 나타내는 특징 벡터를 구성하는 것입니다. 예측 [6]. Node2Vec [5]는 네트워크 분석을 위한 최첨단 범용 기능 학습 방법입니다. Node2Vec은 Spectral Clustering [15], DeepWalk [12], LINE [14]뿐만 아니라 널리 사용되는 다양한 휴리스틱 솔루션 [5]을 포함한 다른 경쟁 기능 학습 솔루션보다 더 나은 정확도를 달성하는 것으로 나타났습니다.

Node2Vec extends the Skip-gram model [8] to the network analysis scenario. The Skip-gram model is originally studied in the text analysis scenario [8, 9]. The goal is to automatically learn a feature vector for every word. The first step is to sample the neighbor words for every word. Based on the samples, it then formulates and solves an optimization problem using Stochastic Gradient Descent (SGD) to obtain the vector representations of words. In the text scenario, the neighbor words of a word can be easily defined as the t words prior to and t words following the target word in sentences, where t is a parameter (e.g., 5). Therefore, one of the main challenges to employ this idea to graphs is to compute the neighbors of a vertex in a graph.

> Node2Vec은 Skip-gram 모델 [8]을 네트워크 분석 시나리오로 확장합니다. Skip-gram 모델은 원래 텍스트 분석 시나리오에서 연구되었습니다 [8, 9]. 목표는 모든 단어에 대한 특징 벡터를 자동으로 학습하는 것입니다. 첫 번째 단계는 모든 단어에 대해 인접 단어를 샘플링하는 것입니다. 그런 다음 샘플을 기반으로 SGD (Stochastic Gradient Descent)를 사용하여 최적화 문제를 공식화하고 해결하여 단어의 벡터 표현을 얻습니다. 텍스트 시나리오에서 단어의 인접 단어는 문장에서 대상 단어 앞의 t 단어와 다음 t 단어로 쉽게 정의할 수 있습니다. 여기서 t는 매개 변수 (예 : 5)입니다. 따라서 이 아이디어를 그래프에 적용하는 주요 과제 중 하나는 그래프에서 정점의 이웃을 계산하는 것입니다.

The main distinctive characteristic of Node2Vec is that it proposes a biased 2nd-order random walk model to sample neighbors of every vertex in a graph, upon which the optimization problem similar to that in the original text analysis scenario [9] is solved to obtain the vertex feature vectors. This random walk model combines BFS and DFS in a flexible manner so that local and global structures of the vertex neighborhood can both be captured. In this way, it is capable of supporting different varieties of graphs and analysis tasks well. The Node2Vec paper reports the run times for graphs with up to 1 million vertices and 10 million edges. In this paper, we are interested in efficiently supporting Node2Vec on large-scale graphs with billions of vertices and edges, which are common in real-world applications.

> Node2Vec의 주요 특징은 그래프에서 모든 정점의 이웃을 샘플링하기 위해 편향된 2차 랜덤 워크 모델을 제안한다는 것입니다. 여기에서 원본 텍스트 분석 시나리오 [9]와 유사한 최적화 문제를 해결하여 정점 특징 벡터. 이 랜덤 워크 모델은 BFS와 DFS를 유연한 방식으로 결합하여 정점 이웃의 로컬 및 글로벌 구조를 모두 캡처 할 수 있습니다. 이러한 방식으로 다양한 그래프와 분석 작업을 잘 지원할 수 있습니다. Node2Vec 문서는 최대 1백만 개의 정점과 1천만 개의 모서리가 있는 그래프의 실행 시간을 보고합니다. 이 백서에서는 실제 응용 프로그램에서 일반적으로 사용되는 수십억개의 정점과 모서리가 있는 대규모 그래프에서 Node2Vec을 효율적으로 지원하는데 관심이 있습니다.

Problems of Existing Node2Vec Implementations.

There are two reference implementations (i.e. Python and C++) on the Node2Vec project page2. Both of them run on a single machine and perform well on small graphs. However, the data structures for large-scale graphs with billion of vertices cannot fit into the main memory of a single machine, demanding distributed graph computation solutions. Spark3[21] is a popular distributed computation framework for big data processing. Compared to the previous MapReduce framework [3], Spark takes advantage of inmemory processing and caching to significantly improve computation efficiency. There is a Node2Vec implementation on Spark available online4. While it leverages Spark to compute Node2Vec on larger graphs using a cluster of machines, there are two main problems of Spark-Node2Vec.

> Node2Vec 프로젝트 page2에는 두 가지 참조 구현 (예 : Python 및 C ++)이 있습니다. 둘 다 단일 시스템에서 실행되고 작은 그래프에서 잘 수행됩니다. 그러나 수십억 개의 정점이 있는 대규모 그래프의 데이터 구조는 단일 시스템의 주메모리에 맞지 않아 분산 그래프 계산 솔루션이 필요합니다. Spark3 [21]은 빅 데이터 처리를 위한 널리 사용되는 분산 계산 프레임워크입니다. 이전 MapReduce 프레임워크 [3]와 비교하여 Spark는 인메모리 처리 및 캐싱을 활용하여 계산 효율성을 크게 향상시킵니다. Spark에는 온라인으로 사용 가능한 Node2Vec 구현이 있습니다. Spark를 활용하여 머신 클러스터를 사용하여 더 큰 그래프에서 Node2Vec을 계산하지만 Spark-Node2Vec에는 두 가지 주요 문제가 있습니다.

First, Spark-Node2Vec is not an exact Node2Vec implementation. For every vertex, it considers at most 30 edges with the highest weights for computing the biased random walks in order to save memory space for storing the transition probabilities. However, a popular vertex in a realworld graph (e.g., a social network) can have thousands or even millions of edges. As a result, Spark-Node2Vec samples only a very small fraction of neighbors of a popular vertex (e.g., 3% of 1K neighbors, 0.003% of 1M neighbors). This significantly degrades the quality of the resulting vectors, as will be shown in our experimental study in Section 4.

> 첫째, Spark-Node2Vec은 정확한 Node2Vec 구현이 아닙니다. 모든 정점에 대해 전이 확률을 저장하기 위한 메모리 공간을 절약하기 위해 편향된 임의 걷기를 계산하기 위해 가중치가 가장 높은 최대 30 개의 에지를 고려합니다. 그러나 실제 그래프 (예 : 소셜 네트워크)에서 인기있는 정점에는 수천 또는 수백만 개의 에지가 있을 수 있습니다. 결과적으로 Spark-Node2Vec은 인기있는 정점의 인접 항목 중 극히 일부만 샘플링합니다 (예 : 1K 인접 항목의 3 %, 1M 인접 항목의 0.003 %). 이것은 섹션 4의 실험 연구에서 볼 수 있듯이 결과 벡터의 품질을 크게 저하시킵니다.

Second, Spark-Node2Vec runs out of memory and incurs significant overhead for even mid-sized graphs. Spark’s core data structure is RDD, which is a distributed data set that allows parallel computation across multiple worker machine nodes. To simplify data consistency and fault tolerance, Spark’s RDD is designed to be read-only. That is, any modification to an RDD will result in a new RDD. However, every random walk step needs to update the sampled walks. A typical configuration runs 10 rounds of random walks, each with 80 steps. Therefore, Spark-Node2Vec incurs frequent creations of new RDDs, which consume the main memory space quickly. Moreover, the solution employs an RDD Join operation in selecting the transition probabilities at every step of the random walks. The Join operation performs data re-distribution, a.k.a. shuffle, which spills intermediate data to disks, incurring significant I/O overhead.

> 둘째, Spark-Node2Vec은 메모리가 부족하여 중간 크기의 그래프에서도 상당한 오버 헤드가 발생합니다. Spark의 핵심 데이터 구조는 여러 작업자 머신 노드에서 병렬 계산을 허용하는 분산 데이터 세트인 RDD입니다. 데이터 일관성과 내결함성을 단순화 하기 위해 Spark의 RDD는 읽기 전용으로 설계되었습니다. 즉, RDD를 수정하면 새 RDD가 생성됩니다. 그러나 모든 임의 걷기 단계는 샘플링된 걷기를 업데이트 해야합니다. 일반적인 구성은 각각 80단계씩 10라운드의 무작위 걷기를 실행합니다. 따라서 Spark-Node2Vec은 주 메모리 공간을 빠르게 소모하는 새로운 RDD를 자주 생성합니다. 또한 이 솔루션은 랜덤 워크의 모든 단계에서 전환 확률을 선택하는 데 RDD 조인 작업을 사용합니다. 조인 작업은 데이터 재분배, 즉 셔플을 수행하여 중간 데이터를 디스크로 유출하여 상당한 I/O 오버 헤드를 발생시킵니다.

Our Solution: `Fast-Node2Vec` on a Pregel-Like Graph Computation Framework.

We propose a `Fast-Node2Vec` algorithm on a Pregel-like graph computation framework [7] to address the problems of the existing solutions. Node2Vec consists of a biased random walk stage and a Skip-Gram computation stage. As the former constitutes 98.8% of the total execution time of Spark-Node2Vec, we mainly focus on improving the Node2Vec random walk stage in this paper.

> 우리는 기존 솔루션의 문제를 해결하기 위해 Pregel과 유사한 그래프 계산 프레임 워크 [7]에 `Fast-Node2Vec` 알고리즘을 제안합니다. Node2Vec은 편향된 랜덤 워크 단계와 Skip-Gram 계산 단계로 구성됩니다. 전자는 Spark-Node2Vec의 전체 실행 시간의 98.8 %를 차지하므로 본 논문에서는 Node2Vec 랜덤 워크 단계 개선에 주로 초점을 맞추고 있습니다.

First, we employ GraphLite5 , an open-source C/C++ implementation of Pregel [7] in order to avoid the overhead in Spark. Pregel is a distributed in-memory graph computation framework. Graph computation is implemented as programs running on individual vertices. In contrast to Spark, vertex states are updated in place and vertices communicate through messages in main memory and across network. Therefore, the Pregel framework does not incur the RDD creation and the shuffle overhead as in Spark.

> 먼저, Spark의 오버 헤드를 피하기 위해 Pregel [7]의 오픈 소스 C / C ++ 구현 인 GraphLite5를 사용합니다. Pregel은 분산 메모리 내 그래프 계산 프레임 워크입니다. 그래프 계산은 개별 정점에서 실행되는 프로그램으로 구현됩니다. Spark와 달리 정점 상태는 제자리에서 업데이트되고 정점은 주 메모리 및 네트워크에서 메시지를 통해 통신합니다. 따라서 Pregel 프레임 워크는 Spark에서와 같이 RDD 생성 및 셔플 오버 헤드를 발생시키지 않습니다.

Second, `Fast-Node2Vec` computes the transition probabilities on demand during random walks. It does not precompute and store all the transition probabilities before random walks. As Node2Vec performs a 2nd-order random walk, the transition probability depends on a pair of vertices in the last two steps in a random walk. Therefore, for a vertex Vi with di neighbors in an undirected graph, there are d2i transition probabilities. The total number of transition probabilities for all vertices is much larger than the number of vertices and the number of edges added up together. This is especially the case in power-law graphs, where a small number of popular vertices have high degrees. We find that the total amount of memory space required to store all transition probabilities of large-scale graphs can be magnitudes larger than the total memory size of the machine cluster used in our evaluation. Therefore, `Fast-Node2Vec` performs on-demand computation of transition probabilities in order to reduce the memory space and support large-scale graphs.

> 둘째, `Fast-Node2Vec`은 랜덤 워크 중 요청시 전환 확률을 계산합니다. 무작위 걷기 전에 모든 전환 확률을 미리 계산하고 저장하지 않습니다. Node2Vec이 2차 무작위 걷기를 수행하므로 전환 확률은 무작위 걷기의 마지막 두 단계에서 한 쌍의 정점에 따라 달라집니다. 따라서 무방향 그래프에서 di 이웃이 있는 정점 Vi의 경우 d2i 전환 확률이 있습니다. 모든 정점에 대한 총 전환 확률 수는 정점 수와 함께 합산된 가장자리 수보다 훨씬 큽니다. 이것은 특히 소수의 인기있는 정점이 높은 차수를 갖는 멱 법칙 그래프의 경우입니다. 대규모 그래프의 모든 전이 확률을 저장하는데 필요한 총 메모리 공간은 평가에 사용된 머신 클러스터의 총 메모리 크기보다 클 수 있습니다. 따라서 `Fast-Node2Vec`은 메모리 공간을 줄이고 대규모 그래프를 지원하기 위해 전이 확률의 주문형 계산을 수행합니다.

Third, we further analyze the computation overhead in `Fast-Node2Vec`. We find that the communication of vertex neighbors is a significant source of overhead, especially for popular vertices with a large number of neighbors. To reduce this overhead, we propose and study a family of FastNode2Vec algorithms: (i) For vertices in the same graph partition, we can directly read the neighbor information without sending messages (FN-Local); (ii) To find the common neighbors of a popular vertex B and a low-degree vertex S, we may always send S’s neighbors to B (FN-Switch); (iii) After receiving the neighbor information of a popular vertex B from a remote graph partition, we can cache it locally and reuse it (FN-Cache). The above `Fast-Node2Vec` algorithms are all exact implementation of Node2Vec random walks. In addition, we propose a variant of `Fast-Node2Vec` (FN-Approx) that approximately computes next moves at popular vertices with low overhead and bounded errors.

> 셋째, `Fast-Node2Vec`의 계산 오버 헤드를 추가로 분석합니다. 우리는 정점 이웃의 통신이 특히 많은 수의 이웃이 있는 인기있는 정점의 경우 오버 헤드의 중요한 소스라는 것을 발견했습니다. 이 오버 헤드를 줄이기 위해 FastNode2Vec 알고리즘 제품군을 제안하고 연구합니다. (i) 동일한 그래프 파티션의 정점에 대해 메시지를 보내지 않고 인접 정보를 직접 읽을 수 있습니다 (FN-Local). (ii) 인기있는 정점 B와 저차 정점 S의 공통 이웃을 찾기 위해 항상 S의 이웃을 B (FN-Switch)로 보낼 수 있습니다. (iii) 원격 그래프 파티션에서 인기있는 정점 B의 인접 정보를 수신 한 후 로컬에서 캐시하고 재사용 할 수 있습니다 (FN- 캐시). 위의 `Fast-Node2Vec` 알고리즘은 모두 Node2Vec 랜덤 워크의 정확한 구현입니다. 또한 오버 헤드가 낮고 오류가 제한된 인기있는 정점에서 다음 동작을 대략적으로 계산하는 `Fast-Node2Vec` (FN-Approx)의 변형을 제안합니다.

Finally, we perform extensive experiments to empirically evaluate all the proposed algorithms using both real-world and synthetic data sets. Our experimental results on a midsized cluster of 12 machines show that our proposed FastNode2Vec solutions are capable of computing Node2Vec for large-scale graphs with billions of vertices in a reasonable amount of time. Compared to Spark-Node2Vec, our proposed `Fast-Node2Vec` solutions achieve 7.7–122x speedups.

> 마지막으로 실제 데이터와 합성 데이터 세트를 모두 사용하여 제안된 모든 알고리즘을 경험적으로 평가하기 위해 광범위한 실험을 수행합니다. 12개 머신의 중간 규모 클러스터에 대한 실험 결과는 제안 된 FastNode2Vec 솔루션이 적절한 시간에 수십억 개의 정점이 있는 대규모 그래프에 대해 Node2Vec을 계산할 수 있음을 보여줍니다. Spark-Node2Vec과 비교하여 우리가 제안한 `Fast-Node2Vec` 솔루션은 7.7–122 배의 속도 향상을 달성합니다.

Contributions of the Paper:

(1) We propose `Fast-Node2Vec`, a family of efficient Node2Vec random walk algorithms on a Pregel-like graph computation framework. `Fast-Node2Vec` computes transition probabilities during random walks to reduce memory space consumption and computation overhead for largescale graphs.

> 우리는 Pregel과 같은 그래프 계산 프레임 워크에서 효율적인 Node2Vec 랜덤 워크 알고리즘 제품군 인 `Fast-Node2Vec`을 제안합니다. `Fast-Node2Vec`은 랜덤 워크 중 전환 확률을 계산하여 대규모 그래프의 메모리 공간 소비와 계산 오버 헤드를 줄입니다.

(2) We analyze the behavior of the Node2Vec random walks and show that popular vertices with a large number of edges incur significant overhead in message sizes and computations. Then we propose and study a number of optimization techniques (including FN-Cache and FNApprox) to reduce the overhead.

> Node2Vec 랜덤 워크의 동작을 분석하고 많은 수의 에지가 있는 인기있는 정점이 메시지 크기 및 계산에서 상당한 오버 헤드를 발생 시킨다는 것을 보여줍니다. 그런 다음 오버 헤드를 줄이기 위한 여러 최적화 기술 (FN-Cache 및 FNApprox 포함)을 제안하고 연구합니다.

(3) We perform extensive experiments to empirically evaluate our proposed solutions. In our experiments, we see that (i) Spark-Node2Vec has both poor result quality and poor efficiency. (ii) `Fast-Node2Vec` is capable of supporting graphs with billions vertices and edges using a mid-sized machine cluster. Similar computing resources are often available to academic researchers. (iii) Compared to Spark-Node2Vec, `Fast-Node2Vec` solutions achieve 7.7–122x speedups speedups. (iv) As the vertex distribution of a graph becomes more and more skewed, our optimization techniques to reduce the overhead of popular vertices become more effective.

> 우리는 제안된 솔루션을 경험적으로 평가하기 위해 광범위한 실험을 수행합니다. 실험에서 (i) Spark-Node2Vec은 결과 품질이 좋지 않고 효율성이 낮다는 것을 알 수 있습니다. (ii) `Fast-Node2Vec`은 중간 크기의 기계 클러스터를 사용하여 수십억 개의 정점과 모서리가있는 그래프를 지원할 수 있습니다. 유사한 컴퓨팅 리소스는 종종 학술 연구자들에게 제공됩니다. (iii) Spark-Node2Vec에 비해 `Fast-Node2Vec` 솔루션은 7.7–122 배의 속도 향상을 달성합니다. (iv) 그래프의 정점 분포가 점점 더 왜곡됨에 따라 인기있는 정점의 오버 헤드를 줄이기위한 최적화 기술이 더 효과적입니다.

The rest of the paper is organized as follows. Section 2 briefly overviews existing Node2Vec solutions. Section 3 presents the technical details for improving the efficiency of Node2Vec using `Fast-Node2Vec` on a Pregel-Like graph computation framework. Section 4 compares `Fast-Node2Vec` with Spark-Node2Vec, and studies the proposed optimizations for `Fast-Node2Vec`, using both real-world and synthetic graphs in a distributed machine environment. Finally, Section 5 concludes the paper.

> 나머지 논문은 다음과 같이 구성됩니다. 섹션 2에서는 기존 Node2Vec 솔루션을 간략하게 설명합니다. 섹션 3에서는 Pregel-Like 그래프 계산 프레임 워크에서 `Fast-Node2Vec`을 사용하여 Node2Vec의 효율성을 개선하기위한 기술적 세부 사항을 제공합니다. 섹션 4는 `Fast-Node2Vec`과 Spark-Node2Vec을 비교하고 분산 머신 환경에서 실제 및 합성 그래프를 모두 사용하여 제안 된 `Fast-Node2Vec` 최적화를 연구합니다. 마지막으로 섹션 5에서 논문을 마칩니다.


### 2. PROBLEMS OF SPARK-NODE2VEC

We briefly overview the Node2Vec random walk model, then discuss Spark-Node2Vec and its problems.

> Node2Vec 랜덤 워크 모델을 간략히 살펴본 다음 Spark-Node2Vec과 그 문제에 대해 논의합니다.


#### 2.1 Node2Vec Random Walk

The Node2Vec [5] method performs random walks to sample vertex neighborhood and then solves an optimization problem based on the Skip-gram model [8] to obtain vector representations for vertices in a graph. Figure 1 shows the runtime breakdown for Node2Vec on the BlogCatalog graph [20]. The random walk stage takes 98.8% of the total run time of Spark-Node2Vec. Moreover, the optimization problem is solved by performing a Stochastic Gradient Descent (SGD) computation, which has good distributed implementations. Therefore, we focus on the efficiency of the Node2Vec random walk stage in this paper.

> Node2Vec [5] 방법은 정점 이웃을 샘플링하기 위해 랜덤 워크를 수행한 다음 Skip-gram 모델 [8]을 기반으로 최적화 문제를 해결하여 그래프의 정점에 대한 벡터 표현을 얻습니다. 그림 1은 BlogCatalog 그래프에서 Node2Vec의 런타임 분석을 보여줍니다 [20]. 랜덤 워크 스테이지는 Spark-Node2Vec의 총 실행 시간의 98.8 %를 차지합니다. 또한 최적화 문제는 분산 구현이 좋은 SGD (Stochastic Gradient Descent) 계산을 수행하여 해결됩니다. 따라서 이 백서에서는 Node2Vec 랜덤 워크 스테이지의 효율성에 중점을 둡니다.

Node2Vec simulates r (e.g., r = 10) random walks of fixed length l (e.g., l = 80) starting from every vertex. The Node2Vec random walk model is illustrated in Figure 2. The unnormalized transition probability πvw from the current vertex v to its neighbor x depends on the edge weight wvx and αpq(u, v, x). The latter varies based on the distance between x and the last vertex u seen in the random walk. This random walk model flexibly combines characteristics of BFS and DFS by using the parameters p and q. The lower the parameter p and the higher the parameter q, the more likely the walk explores the local area close to the starting vertex u, mimicking a BFS-like behavior. In contrast, a large p and a small q will increase the probability for the walk to visit vertices further away from u, showing a DFS-like behavior. In this way, the vector representations combine both structural equivalence and local community features. As a result, Node2Vec can effectively support a variety of analysis tasks [5].

> Node2Vec은 모든 정점에서 시작하여 고정 길이 l (예 : l = 80)의 r (예 : r = 10) 임의 걷기를 시뮬레이션합니다. Node2Vec 랜덤 워크 모델은 그림 2에 나와 있습니다. 현재 정점 v에서 인접 x 로의 정규화되지 않은 전이 확률 πvw는 에지 가중치 wvx 및 αpq (u, v, x)에 따라 달라집니다. 후자는 임의 걷기에서 본 x와 마지막 정점 u 사이의 거리에 따라 달라집니다. 이 랜덤 워크 모델은 매개 변수 p와 q를 사용하여 BFS와 DFS의 특성을 유연하게 결합합니다. 매개 변수 p가 낮고 매개 변수 q가 높을수록 걷기가 시작 정점 u에 가까운 로컬 영역을 탐색하여 BFS와 같은 동작을 모방할 가능성이 높습니다. 대조적으로, 큰 p와 작은 q는 걷기가 u에서 더 먼 정점을 방문 할 확률을 증가시켜 DFS와 같은 동작을 보여줍니다. 이러한 방식으로 벡터 표현은 구조적 동등성과 지역 커뮤니티 기능을 결합합니다. 결과적으로 Node2Vec은 다양한 분석 작업을 효과적으로 지원할 수 있습니다 [5].

#### 2.2 Spark-Node2Vec

Spark [21] is a popular second-generation distributed computation framework for big data processing. It improves upon the first-generation framework, MapReduce [3], by putting the results of intermediate computation steps in memory, thereby reducing I/O overhead to access the underlying distributed file system (e.g. HDFS) in MapReduce. The core data structure in Spark is RDD (Resilient Distributed Data sets). An RDD is an immutable, distributed data set. Operations (a.k.a. transformations) on an RDD can be performed in parallel across all the partitions of the RDD. GraphX is a graph computation framework built on top of Spark. It represents vertices, edges, and intermediate states as RDDs, and implements graph computations using RDD transformations, such as joins.

> Spark [21]는 빅 데이터 처리를위한 인기있는 2세대 분산 계산 프레임워크입니다. 중간 계산 단계의 결과를 메모리에 저장함으로써 1세대 프레임워크인 MapReduce [3]를 개선하여 MapReduce의 기본 분산 파일 시스템 (예 : HDFS)에 액세스하기위한 I/O 오버 헤드를 줄입니다. Spark의 핵심 데이터 구조는 RDD (Resilient Distributed Data sets)입니다. RDD는 변경 불가능한 분산 데이터 세트입니다. RDD에 대한 작업 (일명 변환)은 RDD의 모든 파티션에서 병렬로 수행될 수 있습니다. GraphX는 Spark 위에 구축 된 그래프 계산 프레임워크입니다. 정점, 가장자리 및 중간 상태를 RDD로 나타내고 조인과 같은 RDD 변환을 사용하여 그래프 계산을 구현합니다.

Spark-Node2Vec implements random walks in two phases:

(i) Preprocessing phase: Spark-Node2Vec pre-computes all transition probabilities and allocates RDDs for storing the transition probabilities and to facilitate random walks. Every edge stores three arrays of equal length. One array records the neighbors of the destination vertex. The other two arrays are initialized using the transition probabilities for Alias Sampling [17]. Every vertex contains an array of (neighbor, edge weight) pairs. To reduce the allocated memory space and computation overhead, Spark-Node2Vec trims the graph by removing edges. It preserves only 30 edges with the top most edge weights for every vertex.

> 전처리 단계 : Spark-Node2Vec은 모든 전이 확률을 사전 계산하고 전이 확률을 저장하고 랜덤 워크를 용이하게하기 위해 RDD를 할당합니다. 모든 모서리는 길이가 같은 3개의 배열을 저장합니다. 하나의 배열은 대상 정점의 이웃을 기록합니다. 다른 두 배열은 Alias Sampling [17]에 대한 전환 확률을 사용하여 초기화됩니다. 모든 정점에는 (이웃, 가장자리 가중치) 쌍의 배열이 포함됩니다. 할당된 메모리 공간과 계산 오버 헤드를 줄이기 위해 Spark-Node2Vec은 간선을 제거하여 그래프를 자릅니다. 모든 정점에 대해 가장자리 가중치가 가장 높은 30 개의 가장자리 만 유지합니다.

(ii) Random walk phase: Spark-Node2Vec simulates random walks starting from all vertices based on the pre-computed transition probabilities. It computes one step of all walks in every loop iteration. This is achieved by joining the last two walk steps, the pre-computed transition probabilities for edges, and the recorded edge weights for vertices. The computed random walks are recorded in an RDD, where the walk length grows one step per iteration for every vertex.

> 무작위 걷기 단계 : Spark-Node2Vec은 미리 계산 된 전환 확률을 기반으로 모든 정점에서 시작하는 무작위 걷기를 시뮬레이션합니다. 모든 루프 반복에서 모든 걷기의 한 단계를 계산합니다. 이것은 마지막 두 걷기 단계, 가장자리에 대해 미리 계산 된 전환 확률 및 정점에 대해 기록 된 가장자리 가중치를 결합하여 달성됩니다. 계산 된 랜덤 보행은 RDD에 기록되며 보행 길이는 모든 정점에 대해 반복당 한 단계씩 증가합니다.

Spark-Node2Vec incurs both poor quality and poor efficiency:

• Poor quality: The trim idea over-simplifies the random walk process. For a vertex v with d >> 30 outgoing edges, Spark-Node2Vec would explore only 30 neighbors of v. For d = 1000, this is 3% of all neighbors. For d =1 million, merely 0.003% of the neighbors are preserved. This significantly deviates from the Node2Vec random walk model. As will be shown in Section 4, node classification accuracy suffers drastically because of the problematic trim idea.

> • 불량한 품질 : 트림 아이디어는 무작위 걷기 과정을 지나치게 단순화합니다. d >> 30 개의 나가는 에지가있는 정점 v의 경우 Spark-Node2Vec은 v의 인접 30 개만 탐색합니다. d = 1000 인 경우 이는 모든 인접 항목의 3 %입니다. d = 1 백만의 경우 단지 0.003 %의 이웃이 보존됩니다. 이것은 Node2Vec 랜덤 워크 모델과 크게 다릅니다. 섹션 4에서 볼 수 있듯이 문제가있는 트림 아이디어로 인해 노드 분류 정확도가 크게 저하됩니다.

• Poor efficiency: Even with the much simplified graph after trimming, the efficiency of Spark-Node2Vec is still poor. There are two main causes. First, Spark RDDs are read-only; Recording random walk steps in every iteration will result in a copy-on-write and the creation of a new RDD. Second, the computation performs frequent join transformations. However, a join often involves a shuffle operation, which prepares data by sorting or hash partitioning. Unfortunately, shuffle often needs to spill the intermediate data to disks, incurring significant disk I/O overhead. As a result, Spark-Node2Vec has a difficult time processing even mid-sized graphs, as will be shown in Section 4.

> • 효율성 저하 : 트리밍 후 그래프가 훨씬 단순화 되었더라도 Spark-Node2Vec의 효율성은 여전히 낮습니다. 두 가지 주요 원인이 있습니다. 첫째, Spark RDD는 읽기 전용입니다. 모든 반복에서 임의의 걷기 단계를 기록하면 기록 중 복사 및 새 RDD가 생성됩니다. 둘째, 계산은 빈번한 조인 변환을 수행합니다. 그러나 조인에는 종종 정렬 또는 해시 분할을 통해 데이터를 준비하는 셔플 작업이 포함됩니다. 안타깝게도 셔플은 종종 중간 데이터를 디스크로 유출해야하므로 상당한 디스크 I / O 오버 헤드가 발생합니다. 결과적으로 Spark-Node2Vec은 섹션 4에서 볼 수 있듯이 중간 크기의 그래프도 처리하는 데 어려움을 겪습니다.


### 3. FAST-NODE2VEC

We present `Fast-Node2Vec` in this section. We begin by describing our choice of graph computation framework in Section 3.1. Then, we describe the main components of the `Fast-Node2Vec` algorithm in Section 3.2. After that, we analyze the computation to understand its efficiency bottleneck in Section 3.3 and propose a number of techniques to improve `Fast-Node2Vec` in Section 3.4.

> 이 섹션에서는 `Fast-Node2Vec`을 제시합니다. 3.1 절에서 선택한 그래프 계산 프레임 워크를 설명하는 것으로 시작합니다. 그런 다음 섹션 3.2에서 `Fast-Node2Vec` 알고리즘의 주요 구성 요소를 설명합니다. 그 후 3.3 절에서 효율성 병목 현상을 이해하기 위해 계산을 분석하고 3.4 절에서 `Fast-Node2Vec`을 개선하기위한 여러 기술을 제안합니다.


#### 3.1 GraphLite: a Pregel-Like Distributed Graph Computation Framework

Pregel [7] is a distributed in-memory graph computation framework. GraphLite [10] is a lightweight open-source C/C++ implementation of Pregel. We choose GraphLite to run Node2Vec in order to avoid the costs of RDDs and shuffles in Spark, as discussed in Section 2.2.

> Pregel [7]은 분산 된 메모리 내 그래프 계산 프레임워크입니다. GraphLite [10]은 Pregel의 경량 오픈 소스 C / C ++ 구현입니다. 2.2 절에서 설명한 것처럼 Spark에서 RDD 및 셔플 비용을 피하기 위해 GraphLite를 선택하여 Node2Vec을 실행합니다.

In the Pregel model, a graph algorithm is implemented as a vertex-centric compute function. The system consists of a master machine node and a number of worker nodes connected through a data center network, as depicted in Figure 3. The graph is partitioned across the workers at the beginning of the computation. The system runs the graph computation in a series of supersteps. At the beginning of a superstep, the master broadcasts a start message to all workers. Upon receiving this message, each worker iterates through all the vertices and invoke the compute function for every vertex in its graph partition. Then workers send done messages to the master. The master starts the next superstep only after all the workers are done with the current superstep. In this way, the computation follows the Bulk Synchronous Parallel model: The master enforces a global barrier between two supersteps; Within each superstep, compute is run in parallel across workers.

> Pregel 모델에서 그래프 알고리즘은 정점 중심 컴퓨팅 함수로 구현됩니다. 시스템은 그림 3과 같이 마스터 머신 노드와 데이터 센터 네트워크를 통해 연결된 다수의 작업자 노드로 구성됩니다. 그래프는 계산 시작시 작업자간에 분할됩니다. 시스템은 일련의 슈퍼 단계에서 그래프 계산을 실행합니다. 수퍼 스텝이 시작될 때 마스터는 모든 작업자에게 시작 메시지를 브로드 캐스트합니다. 이 메시지를 받으면 각 작업자는 모든 정점을 반복하고 그래프 파티션의 모든 정점에 대해 계산 함수를 호출합니다. 그런 다음 작업자는 완료 메시지를 마스터에게 보냅니다. 마스터는 모든 워커가 현재 수퍼 스텝을 완료 한 후에 만 다음 수퍼 스텝을 시작합니다. 이러한 방식으로 계산은 대량 동기 병렬 모델을 따릅니다. 마스터는 두 수퍼 단계 사이에 전역 장벽을 적용합니다. 각 상위 단계 내에서 컴퓨팅은 작업자간에 병렬로 실행됩니다.

The compute function on a vertex is typically implemented with three main parts: (i) receiving incoming messages from the previous superstep; (ii) computing and updating the state of the vertex in light of the incoming messages; (iii) sending messages to other vertices that will be delivered in the next superstep.

> 정점에 대한 계산 기능은 일반적으로 세 가지 주요 부분으로 구현됩니다. (i) 이전 수퍼 단계에서 수신 메시지 수신; (ii) 들어오는 메시지에 비추어 정점의 상태를 계산하고 업데이트합니다. (iii) 다음 슈퍼 단계에서 전달 될 다른 정점으로 메시지를 보냅니다.

Figure 3 illustrates the internal data structures of a worker. There are an array of vertex states, an array of vertex outedges, and structures for managing messages. In a superstep, incoming messages to the vertices in the local partition are appended to the global received message list. At the start of the next superstep, the messages are then delivered into the per-vertex in-message lists, which are processed in the compute function invoked later in the superstep.

> 그림 3은 작업자의 내부 데이터 구조를 보여줍니다. 정점 상태 배열, 정점 바깥 쪽 배열 및 메시지 관리를위한 구조가 있습니다. 수퍼 단계에서 로컬 파티션의 꼭지점으로 들어오는 메시지는 전역 수신 메시지 목록에 추가됩니다. 다음 수퍼 단계가 시작될 때 메시지는 이후 수퍼 단계에서 호출되는 계산 함수에서 처리되는 버텍스 별 메시지 내 목록으로 전달됩니다.

Compared to Spark, the Pregel model has the following advantages. First, vertex states are updated in place, while Spark incurs RDD copy-on-write cost and consumes much more memory space. Second, vertices communicate through messages that are managed in main memory, while Spark’s shuffle operation may incur significant file I/O overhead.

> Spark와 비교할 때 Pregel 모델은 다음과 같은 장점이 있습니다. 첫째, 정점 상태가 제자리에서 업데이트되는 반면 Spark는 RDD 쓰기시 복사 비용이 발생하고 훨씬 더 많은 메모리 공간을 사용합니다. 둘째, 정점은 주 메모리에서 관리되는 메시지를 통해 통신하는 반면 Spark의 셔플 작업은 상당한 파일 I / O 오버 헤드를 유발할 수 있습니다.

GAS model and Node2Vec.

Apart from the Pregel model, another popular graph computation model is GAS proposed in PowerGraph [4]. The GAS model divides the compute function into three functions: Gather, Apply, and Scatter. While GAS can efficiently support many graph computation tasks, such as PageRank, we find that GAS may not be suitable for Node2Vec because the incoming messages in Node2Vec cannot be aggregated and there are no broadcasting outgoing messages. Consequently, the GAS approach does not introduce additional benefits for Node2Vec.

> Pregel 모델 외에 또 다른 인기있는 그래프 계산 모델은 PowerGraph [4]에서 제안한 GAS입니다. GAS 모델은 계산 함수를 Gather, Apply 및 Scatter의 세 가지 함수로 나눕니다. GAS는 PageRank와 같은 많은 그래프 계산 작업을 효율적으로 지원할 수 있지만 Node2Vec의 수신 메시지를 집계 할 수없고 브로드 캐스트 발신 메시지가 없기 때문에 GAS가 Node2Vec에 적합하지 않을 수 있습니다. 결과적으로 GAS 접근 방식은 Node2Vec에 추가 이점을 제공하지 않습니다.


#### 3.2 `Fast-Node2Vec` on GraphLite

We aim to run Node2Vec efficiently on graphs with billions of vertices and edges using a mid-sized cluster of machines. Such computing resources are often available to researchers in academia. In our experiments, we use a cluster of 12 machines, each with 128GB of memory and 40 cores. Since Pregel performs distributed computation in memory, we aim to restrict the total memory consumption in Node2Vec to the aggregate memory size in the cluster (i.e., 1.5TB).

> 우리는 중간 크기의 기계 클러스터를 사용하여 수십억 개의 정점과 모서리가있는 그래프에서 Node2Vec을 효율적으로 실행하는 것을 목표로합니다. 이러한 컴퓨팅 리소스는 종종 학계의 연구자들에게 제공됩니다. 실험에서는 각각 128GB의 메모리와 40 개의 코어가있는 12 개의 머신 클러스터를 사용합니다. Pregel은 메모리에서 분산 계산을 수행하기 때문에 Node2Vec의 총 메모리 사용량을 클러스터의 총 메모리 크기 (즉, 1.5TB)로 제한하는 것을 목표로합니다.

In the original Node2Vec [5], all transition probabilities are pre-computed before simulating the random walks. This approach is followed by both the single-machine reference implementations and Spark-Node2Vec. However, this approach consumes a large amount of memory. Let us consider an undirected graph for simplicity. Directed graphs can be analyzed similarly. Let the degree of a vertex Vi be di. As shown in Figure 2, there is an αpq(u, Vi, x) for each pair of u and x, which are Vi’s neighbors. Thus, the number of α’s at Vi is equal to d2i. Alias sampling [17] requires 8-byte space per probability. Therefore, the space for all the transition probabilities can be computed as follows:

> 원래 Node2Vec [5]에서 모든 전환 확률은 랜덤 워크를 시뮬레이션하기 전에 미리 계산됩니다. 이 접근 방식은 단일 머신 참조 구현과 Spark-Node2Vec이 뒤 따릅니다. 그러나이 방법은 많은 양의 메모리를 사용합니다. 단순성을 위해 무 방향 그래프를 고려해 보겠습니다. 유 방향 그래프도 유사하게 분석 할 수 있습니다. 정점 Vi의 차수를 di라고하자. 그림 2에서 볼 수 있듯이, Vi의 이웃 인 u와 x의 각 쌍에 대해 αpq (u, Vi, x)가 있습니다. 따라서 Vi에서 α의 수는 d2i와 같습니다. 별칭 샘플링 [17]에는 확률 당 8 바이트 공간이 필요합니다. 따라서 모든 전환 확률에 대한 공간은 다음과 같이 계산할 수 있습니다.

Here, we estimate the total amount of space required to store all the transition probabilities of a social network. Real-world social networks (e.g., Twitter, Facebook, WeChat) often have over a billion vertices. The number of friends of an average user is on the order of 100 to 1000. Therefore, if n = 1G and d = 100, it requires a space of 80 TB. If n = 1G and d = 1000, it takes 8 PB to store all transition probabilities. The space required is clearly much larger than the aggregate memory space available in a mid-sized cluster.

> 여기에서는 소셜 네트워크의 모든 전환 확률을 저장하는 데 필요한 총 공간을 추정합니다. 실제 소셜 네트워크 (예 : Twitter, Facebook, WeChat)에는 종종 10 억 개가 넘는 정점이 있습니다. 일반 사용자의 친구 수는 100 ~ 1000 명 정도입니다. 따라서 n = 1G, d = 100이면 80TB의 공간이 필요합니다. n = 1G이고 d = 1000이면 모든 전환 확률을 저장하는 데 8PB가 필요합니다. 필요한 공간은 중간 규모 클러스터에서 사용 가능한 총 메모리 공간보다 훨씬 큽니다.

Given this observation, we propose to compute the transition probability on demand during the biased random walk. Algorithm 1 lists the pseudo-code for `Fast-Node2Vec` on GraphLite. There are several interesting design choices in this algorithm. First, the algorithm simulates n random walks, one per starting vertex, where n is the number of vertices in the graph. At superstep s, it computes step s for all n random walks. Second, there are two types of messages: ST EP and NEIG. The ST EP message reports a sampled step in a random walk. The NEIG message sends the neighbors of the current vertex to the next-step vertex x in the random walk. All messages are labelled with the associated starting vertex ID (Line 9). Third, the sampled walk steps are stored in the value of the starting vertex (Line 5 and 11). This is achieved by sending the ST EP message with the sampled step as the value field to the starting vertex (Line 20). Fourth, if a random walk moves from v to x, then the compute at v will send v’s neighbor vertex IDs to x (Line 22). In this way, x can easily figure out the shared neighbors between x and v for the transition probability computation (Line 17). Finally, we note that multiple random walks may arrive at the same vertex in some step. The algorithm deals with this complexity by grouping messages based on the starting vertex IDs (Line 13 and 16).

> 이 관찰을 감안할 때, 우리는 편향된 랜덤 워크 동안 수요에 따라 전환 확률을 계산할 것을 제안합니다. 알고리즘 1은 GraphLite의 `Fast-Node2Vec`에 대한 의사 코드를 나열합니다. 이 알고리즘에는 몇 가지 흥미로운 디자인 선택이 있습니다. 먼저, 알고리즘은 시작 정점 당 하나씩 n 개의 임의 걷기를 시뮬레이션합니다. 여기서 n은 그래프의 정점 수입니다. 슈퍼 스텝 s에서 n 개의 랜덤 워크 모두에 대한 스텝 s를 계산합니다. 둘째, ST EP와 NEIG의 두 가지 유형의 메시지가 있습니다. ST EP 메시지는 무작위 걷기에서 샘플링 된 단계를보고합니다. NEIG 메시지는 현재 정점의 이웃을 랜덤 워크의 다음 단계 정점 x로 보냅니다. 모든 메시지는 연관된 시작 꼭지점 ID (9 행)로 레이블이 지정됩니다. 셋째, 샘플링 된 걸음 걸이는 시작 꼭지점 (5, 11 행)의 값에 저장됩니다. 이는 샘플링 된 단계를 값 필드로 사용하여 ST EP 메시지를 시작 정점 (라인 20)으로 전송하여 수행됩니다. 넷째, 임의 걷기가 v에서 x로 이동하면 v의 계산은 v의 인접 정점 ID를 x로 보냅니다 (22 행). 이러한 방식으로 x는 전환 확률 계산 (17 행)을 위해 x와 v 사이의 공유 이웃을 쉽게 파악할 수 있습니다. 마지막으로, 여러 무작위 걷기가 어떤 단계에서 동일한 정점에 도달 할 수 있습니다. 알고리즘은 시작 정점 ID (13 행 및 16 행)를 기반으로 메시지를 그룹화하여 이러한 복잡성을 처리합니다.

We now explain how to compute transition probabilities. A vertex can access its outgoing edges in the out-edge array in GraphLite to get its neighbors and edge weights. Suppose step s − 1 of the random walk is at u and the current step s is at v. We would like to compute the transition probabilities at v. According to Figure 2, we need to figure out the distance dist(u, x) between u and every neighbor x of v. In Algorithm 1, in superstep s − 1, compute at u has already sent u’s neighbors to v (Line 22). Therefore, in superstep s, compute at v will receive u’s neighbors in incoming messages (Line 12-14). The three cases of distances in Figure 2 means that x is u, x is a common neighbor of u and v, and all other cases. It is easy to find out if x is a common neighbor of u and v by using a hash set. In this way, we obtain the unnormalized transition probabilities, then use them to perform the biased sample at v (Line 18).

> 이제 전환 확률을 계산하는 방법을 설명합니다. 정점은 GraphLite의 바깥 쪽 가장자리 배열에서 나가는 가장자리에 액세스하여 인접 항목과 가장자리 가중치를 가져올 수 있습니다. 랜덤 워크의 단계 s-1이 u에 있고 현재 단계 s가 v에 있다고 가정합니다. v에서 전이 확률을 계산하려고합니다. 그림 2에 따라 거리 dist (u, x)를 계산해야합니다. u와 v의 모든 이웃 x 사이. 알고리즘 1에서 수퍼 단계 s-1에서 u의 계산은 이미 u의 이웃을 v로 보냈습니다 (22 행). 따라서 superstep s에서 compute at v는 수신 메시지에서 u의 이웃을 수신합니다 (12-14 행). 그림 2의 세 가지 거리 사례는 x가 u이고 x가 u와 v의 공통 이웃이며 다른 모든 경우를 의미합니다. 해시 세트를 사용하면 x가 u와 v의 공통 이웃인지 쉽게 알 수 있습니다. 이런 방식으로 우리는 정규화되지 않은 전이 확률을 얻은 다음 v에서 편향된 샘플을 수행하는 데 사용합니다 (18 행).


#### 3.3 Analysis of `Fast-Node2Vec` Computation

Figure 4 shows the change in the memory space consumed during the `Fast-Node2Vec` computation on com-Friendster, the largest real-world graph in our evaluation (c.f. Section 4.1). We see that the amount of memory consumed quickly increases, and then flattens after about 10 supersteps. To understand this behavior, we consider the memory consumed during graph computation. There are mainly three parts that consume significant amount of memory: (i) the graph topology, including vertices and edges; (ii) the vertex values and edge weights; (iii) the ST EP and NEIG messages. In the Node2Vec computation, the graph topology is unchanged and the memory space allocated for the vertex values and the edge weights keeps the same. Therefore, part (i) and part (ii), shown as base usage in Figure 4, do not contribute to the increase in the observed memory consumption. On the other hand, the memory consumed by messages grow significantly, as shown in Figure 4. The number of ST EP messages is equal to n, the number of vertices, in `Fast-Node2Vec`. The size of a ST EP message is always the same. Therefore, the memory consumed by all ST EP messages is the same in the entire computation. In contrast, the NEIG message sizes change significantly.

> 그림 4는 평가에서 가장 큰 실제 그래프 인 com-Friendster에서 `Fast-Node2Vec` 계산 중에 소비되는 메모리 공간의 변화를 보여줍니다 (섹션 4.1 참조). 소비되는 메모리의 양이 빠르게 증가한 다음 약 10 단계의 슈퍼 스텝 후에 평평 해집니다. 이 동작을 이해하기 위해 그래프 계산 중에 사용되는 메모리를 고려합니다. 상당한 양의 메모리를 소비하는 주로 세 부분이 있습니다. (i) 꼭지점과 모서리를 포함하는 그래프 토폴로지; (ii) 정점 값과 가장자리 가중치; (iii) ST EP 및 NEIG 메시지. Node2Vec 계산에서 그래프 토폴로지는 변경되지 않고 정점 값과 에지 가중치에 할당 된 메모리 공간은 동일하게 유지됩니다. 따라서 그림 4에서 기본 사용량으로 표시된 부분 (i) 및 부분 (ii)는 관찰 된 메모리 소비 증가에 기여하지 않습니다. 반면에 메시지가 사용하는 메모리는 그림 4에서와 같이 크게 증가합니다. ST EP 메시지의 수는 `Fast-Node2Vec`에서 정점 수인 n과 같습니다. ST EP 메시지의 크기는 항상 동일합니다. 따라서 모든 ST EP 메시지가 사용하는 메모리는 전체 계산에서 동일합니다. 반대로 NEIG 메시지 크기는 크게 변경됩니다.

We analyze the relationship of the vertex degrees and the frequency of vertices to appear in the resulting random walks, as shown in Figure 5. The X-axis shows equi-width buckets of degrees. For example, the bucket 600 contains all vertices with degrees between 400 and 600. The height of the bar represents the average times for a vertex in this bucket to be sampled in the Node2Vec random walks. From Figure 5, we see that the higher the vertex degree, the more frequently that the vertex is sampled in the random walks.

> 그림 5에서와 같이 결과로 생성되는 임의 걷기에 나타나는 정점 각도와 정점 빈도의 관계를 분석합니다. X 축은 동일한 너비의 각도 버킷을 보여줍니다. 예를 들어, 버킷 600에는 각도가 400에서 600 사이 인 모든 정점이 포함되어 있습니다. 막대의 높이는이 버킷의 정점이 Node2Vec 임의 걷기에서 샘플링되는 평균 시간을 나타냅니다. 그림 5에서 정점 정도가 높을수록 정점이 랜덤 워크에서 샘플링되는 빈도가 더 높습니다.

We can explain this phenomenon as follows. For a vertex v, if a random walk arrives at one of v’s neighbors, there is a chance for the random walk to move to v. The higher the degree of v, the more neighbors that v has, the more likely that the previous vertex in the random walk is a neighbor of v. This effect means that random walks will tend to visit large-degree vertices. We know that the higher the degree of v, the larger size v’s NEIG messages take. At the beginning, there is a walk at every vertex. Gradually, more and more large-degree vertices appear in the walk. Therefore, the memory consumed by NEIG messages increases. When this behavior becomes stable, the memory consumed becomes flat.

> 이 현상을 다음과 같이 설명 할 수 있습니다. 정점 v의 경우 임의 걷기가 v의 이웃 중 하나에 도달하면 무작위 걷기가 v로 이동할 가능성이 있습니다. v의 정도가 높을수록 v의 이웃이 많을수록 이전 정점 일 가능성이 높습니다. 이 효과는 랜덤 워크가 큰 정도의 정점을 방문하는 경향이 있음을 의미합니다. v의 정도가 높을수록 v의 NEIG 메시지 크기가 커집니다. 처음에는 모든 정점에 걷기가 있습니다. 점차적으로 점점 더 큰 정도의 정점이 걷기에 나타납니다. 따라서 NEIG 메시지가 사용하는 메모리가 증가합니다. 이 동작이 안정되면 사용되는 메모리가 평평 해집니다.

While Figure 4 and Figure 5 show the results for one set of Node2Vec (p, q) parameters, we see similar behaviors across different parameter settings.

> 그림 4와 그림 5는 Node2Vec (p, q) 매개 변수의 한 세트에 대한 결과를 보여 주지만 다른 매개 변수 설정에서 유사한 동작을 볼 수 있습니다.


#### 3.4 Optimization Techniques

We have seen that the neighbor messages can consume a large amount of memory. This is especially the case for power-law graphs where a small number of vertices have very large degrees. We call such vertices popular vertices. The memory consumption effectively determines the graph sizes that can be supported in a mid-sized cluster. In this subsection, we propose a number of techniques to reduce the message sizes for saving memory and improve the efficiency of `Fast-Node2Vec`.

> 이웃 메시지가 많은 양의 메모리를 사용할 수 있음을 확인했습니다. 이것은 특히 적은 수의 정점이 매우 큰 차수를 갖는 멱 법칙 그래프의 경우입니다. 이러한 정점을 인기있는 정점이라고합니다. 메모리 사용량은 중간 규모 클러스터에서 지원할 수있는 그래프 크기를 효과적으로 결정합니다. 이 하위 섹션에서는 메모리 절약을위한 메시지 크기를 줄이고 `Fast-Node2Vec`의 효율성을 향상시키는 여러 기술을 제안합니다.

FN-Local: Exploiting local graph partition.

Consider an NEIG message sent from u to v. The purpose of this message is to notify v of u’s neighbors. This is only necessary if u and v are in separate workers. If both u and v are in the same worker, v is able to directly read u’s neighbors from the out-edge array. We call an NEIG message between vertices in the same worker a local NEIG message. We extend the GraphLite framework with an API that allows a vertex to visit another vertex’s information in the same worker. Then FN-Local uses this API to reduce all the local NEIG messages.

> FN-Local : 로컬 그래프 파티션 악용.
>
> u에서 v로 전송 된 NEIG 메시지를 고려하십시오.이 메시지의 목적은 u의 이웃을 v에 알리는 것입니다. 이것은 u와 v가 별도의 작업자에있는 경우에만 필요합니다. u와 v가 모두 동일한 워커에있는 경우 v는 외부 에지 배열에서 u의 이웃을 직접 읽을 수 있습니다. 동일한 워커의 정점 사이에있는 NEIG 메시지를 로컬 NEIG 메시지라고합니다. Vertex가 동일한 워커에서 다른 정점의 정보를 방문 할 수 있도록하는 API로 GraphLite 프레임 워크를 확장합니다. 그런 다음 FN-Local은이 API를 사용하여 모든 로컬 NEIG 메시지를 줄입니다.

FN-Switch: Switching the destination of NEIG messages from popular vertices to unpopular vertices.

The NEIG message size is proportional to the number of neighbors of a vertex. Consider an NEIG message from u to v, where u is a popular vertex and v is an unpopular vertex. The purpose of this message is to facilitate the computation of common neighbors between u and v. However, since a popular vertex has a large number of neighbors, the message size from u to v is very large.

> FN-Switch : NEIG 메시지의 대상을 인기있는 정점에서 인기없는 정점으로 전환합니다.
>
> NEIG 메시지 크기는 정점의 이웃 수에 비례합니다. u에서 v 로의 NEIG 메시지를 고려하십시오. 여기서 u는 인기있는 꼭지점이고 v는 인기없는 꼭지점입니다. 이 메시지의 목적은 u와 v 사이의 공통 이웃 계산을 용이하게하는 것입니다. 그러나 인기있는 정점에는 많은 수의 이웃이 있으므로 u에서 v까지의 메시지 크기가 매우 큽니다.

An interesting observation is that the common neighbors between u and v can also be computed at u if v sends all its neighbors to u. In addition, after u knows all v’s neighbors, it can perform the full computation of transition probabilities and random walk simulation on behalf of v. In other words, it is possible to switch the destination of the NEIG message, asking v to send its neighbors to u. Since v has much fewer neighbors than u, this idea may significantly reduce the message size.

> 흥미로운 관찰은 v가 모든 이웃을 u로 보내면 u와 v 사이의 공통 이웃도 u에서 계산 될 수 있다는 것입니다. 또한 u가 v의 이웃을 모두 알고 나면 v를 대신하여 전이 확률과 랜덤 보행 시뮬레이션의 전체 계산을 수행 할 수 있습니다. 즉, NEIG 메시지의 대상을 전환하여 v에게 이웃을 보내도록 요청할 수 있습니다. 당신에게. v는 u보다 이웃 수가 훨씬 적기 때문에이 아이디어는 메시지 크기를 크게 줄일 수 있습니다.

While this destination switching idea seems promising at first sight, back-of-envelope computation shows that it could significantly increase the overall run time. There is a significant problem to implement this idea. There are two messages for computing the random walk step: u must notify v that it wants v to send back an NEIG message; Then v sends the NEIG message to u. This means that the random walk step needs two supersteps. This breaks FastNode2Vec’s behavior that it computes the same step of all random walks in every superstep. Consider a random walk that consists of alternating popular and unpopular vertices. Half of the moves are from a popular vertex to an unpopular vertex. Every such move takes one extra superstep. Thus, the entire random walk will take 50% more supersteps to complete, incurring significant time overhead.

> 이 대상 전환 아이디어는 처음에는 유망해 보이지만 봉투 뒤 계산은 전체 실행 시간을 크게 늘릴 수 있음을 보여줍니다. 이 아이디어를 구현하는 데 중요한 문제가 있습니다. 랜덤 워크 단계를 계산하기위한 두 가지 메시지가 있습니다. u는 v가 NEIG 메시지를 다시 보내길 원한다는 것을 v에 알려야합니다. 그런 다음 v는 NEIG 메시지를 u에게 보냅니다. 즉, 임의 걷기 단계에는 두 개의 슈퍼 단계가 필요합니다. 이것은 모든 슈퍼 스텝에서 모든 랜덤 워크의 동일한 스텝을 계산하는 FastNode2Vec의 동작을 깨뜨립니다. 인기있는 정점과 인기없는 정점을 번갈아 가며 구성된 임의의 걷기를 고려하십시오. 이동의 절반은 인기있는 정점에서 인기없는 정점으로 이동하는 것입니다. 그러한 모든 움직임은 하나의 추가 단계를 필요로합니다. 따라서 전체 임의 걷기는 완료하는 데 50 % 더 많은 슈퍼 스텝이 필요하므로 상당한 시간 오버 헤드가 발생합니다.

FN-Cache: Caching neighbors of remote popular vertices.

If a popular vertex u sends its neighbors to a vertex v in a remote worker W, v can cache u’s neighbors in a global data structure at worker W so that later computation at any vertices in worker W can directly access this information without u re-sending costly NEIG messages. To implement this idea, we extend GraphLite to expose an API for looking up the worker ID of a vertex. A popular vertex u will remember in an W orkerSent set to which remote workers it has sent NEIG messages. Before sending an NEIG message, u checks to see if the destination vertex v’s worker is in the W orkerSent set. If no, u sends a normal NEIG message and records v’s worker ID in the W orkerSent set. If yes, u sends a special NEIG message with a special (otherwise unused) value to notify v to look up u’s neighbors locally. In this way, this technique can significantly improve the efficiency of `Fast-Node2Vec` as will be shown in Section 4.

> FN-Cache : 인기있는 원격 정점의 인접 항목을 캐싱합니다.
>
> 인기있는 정점 u가 원격 작업자 W의 정점 v로 이웃을 보내면 v는 작업자 W의 전역 데이터 구조에 u의 이웃을 캐시하여 나중에 작업자 W의 모든 정점에서 계산이 사용자없이이 정보에 직접 액세스 할 수 있습니다. 값 비싼 NEIG 메시지 보내기. 이 아이디어를 구현하기 위해 GraphLite를 확장하여 정점의 작업자 ID를 조회하기위한 API를 노출합니다. 인기있는 정점 u는 NEIG 메시지를 보낸 원격 작업자에게 W orkerSent 집합을 기억합니다. NEIG 메시지를 보내기 전에 u는 대상 정점 v의 작업자가 W orkerSent 세트에 있는지 확인합니다. 그렇지 않은 경우 u는 일반 NEIG 메시지를 보내고 W orkerSent 세트에 v의 작업자 ID를 기록합니다. 그렇다면 u는 특별한 (그렇지 않으면 사용되지 않은) 값과 함께 특별한 NEIG 메시지를 전송하여 v에게 u의 이웃을 로컬에서 조회하도록 알립니다. 이러한 방식으로이 기술은 섹션 4에서 볼 수 있듯이 `Fast-Node2Vec`의 효율성을 크게 향상시킬 수 있습니다.

FN-Multi: Simulating random walks using multiple rounds.

After the above optimizations, it is possible that the memory space required by `Fast-Node2Vec` is still too large to fit into the aggregate memory size in the machine cluster. We would like to gracefully handle such situations. We observe that the random walks starting from different vertices are independent of each other. Therefore, it is not necessary to run all n random walks at the same time. Instead, we can simulate the random walks in k rounds. In each round, we simulate n/k random walks. This technique will reduce the memory space for managing messages and for recording random walks by about a factor of k times. Note that we cannot remove any vertex or edge from the graph to reduce memory space for vertices and edges. This is because every vertex and every edge may still be visited in the subset of random walks.

> FN-Multi : 여러 라운드를 사용하여 무작위 걷기를 시뮬레이션합니다.
>
> 위의 최적화 후에도 `Fast-Node2Vec`에 필요한 메모리 공간이 여전히 너무 커서 머신 클러스터의 총 메모리 크기에 맞지 않을 수 있습니다. 이러한 상황을 우아하게 처리하고 싶습니다. 다른 정점에서 시작하는 임의의 걷기가 서로 독립적임을 관찰합니다. 따라서 n 개의 무작위 걷기를 동시에 실행할 필요는 없습니다. 대신 k 라운드에서 무작위 걷기를 시뮬레이션 할 수 있습니다. 각 라운드에서 n / k 랜덤 워크를 시뮬레이션합니다. 이 기술은 메시지 관리 및 임의 걷기 기록을위한 메모리 공간을 약 k 배 감소시킵니다. 정점과 간선의 메모리 공간을 줄이기 위해 그래프에서 정점이나 간선을 제거 할 수 없습니다. 이는 모든 정점과 모든 가장자리가 임의 걷기의 하위 집합에서 여전히 방문 할 수 있기 때문입니다.

FN-Approx: Approximately computing the random walk steps at popular vertices.

The cost of computing the transition probabilities and simulating a random walk step at vertex v is O(dv), where dv is v’s degree. Therefore, popular vertices take much longer time for this computation. We would like to reduce the computation cost at popular vertices. Consider an NEIG message from an unpopular vertex u to a popular vertex v. We can derive the upper and lower bounds for an individual transition probability at v. Suppose 1/p ≤ 1 ≤ 1/q. Let du be u’s degree. Then the bounds for the transition probability from v to a neighbor x that is not u are as follows:

> FN-Approx : 인기있는 정점에서 임의의 걷기 단계를 대략적으로 계산합니다.
>
> 전환 확률을 계산하고 정점 v에서 임의 걷기 단계를 시뮬레이션하는 비용은 O (dv)이며 여기서 dv는 v 도입니다. 따라서 인기있는 정점은이 계산에 훨씬 더 오랜 시간이 걸립니다. 인기있는 정점에서 계산 비용을 줄이고 싶습니다. 인기가없는 정점 u에서 인기있는 정점 v 로의 NEIG 메시지를 고려하십시오. v에서 개별 전이 확률에 대한 상한 및 하한을 유도 할 수 있습니다. 1 / p ≤ 1 ≤ 1 / q라고 가정합니다. du를 당신의 학위로합시다. 그런 다음 v에서 u가 아닌 이웃 x 로의 전이 확률 경계는 다음과 같습니다.

The numerator is the unnormalized transition probability. Its minimal value is W eightmin, which is the product of the minimal α = 1 (when x is not u) and the minimal edge weight. Its maximal value is W eightmax q, which is the product of the maximal α and the maximal edge weight. For the denominator, the minimal value is achieved when all of u’s du neighbors are also v’s neighbors. The maximal value is achieved when u and v do not have common neighbors. Similarly, we can obtain the upper and lower bounds for other value combinations of p and q.

> 분자는 정규화되지 않은 전이 확률입니다. 최소값은 W 8min이며, 이는 최소 α = 1 (x가 u가 아닌 경우)과 최소 가장자리 가중치의 곱입니다. 최대 값은 최대 α와 최대 에지 가중치의 곱인 W eightmax q입니다. 분모의 경우 모든 u의 du 이웃이 v의 이웃 일 때 최소값이 달성됩니다. 최대 값은 u와 v에 공통 이웃이 없을 때 달성됩니다. 마찬가지로 p와 q의 다른 값 조합에 대한 상한과 하한을 얻을 수 있습니다.

Note that du << dv. In many real-world scenarios, the difference between W eightmin and W eightmax is small. (For example, in a great many cases, edge weights are 1 for all edges). Therefore, the above lower bound is close to q/dv, and the above upper bound is close to 1/dv. As dv is very large, the difference between the lower and the upper bounds can be very small.

> du << dv. 많은 실제 시나리오에서 W eightmin과 W eightmax의 차이가 작습니다. (예를 들어, 대부분의 경우 모든 간선에 대해 간선 가중치가 1입니다). 따라서 위의 하한은 q / dv에 가깝고 위의 상한은 1 / dv에 가깝습니다. dv가 매우 크기 때문에 하한과 상한의 차이가 매우 작을 수 있습니다.

Base on this observation, we propose FN-Approx, an approximate `Fast-Node2Vec` algorithm. At a popular vertex v, if the last step u is an unpopular vertex, FN-Approx computes the difference between the upper and the lower bounds. If the difference is below a pre-defined threshold (e.g., 1e-3), FN-Approx will simply sample the step based on the static edge weights without considering the 2nd order effect. In this way, FN-Approx can significantly reduce the time overhead for computing transition probabilities at popular vertices. We study the impact of this approximation on the efficiency and the accuracy of the solution in Section 4.

> 이 관찰을 바탕으로 우리는 대략적인 `Fast-Node2Vec` 알고리즘 인 FN-Approx를 제안합니다. 인기있는 정점 v에서 마지막 단계 u가 인기없는 정점 인 경우 FN-Approx는 상한과 하한 사이의 차이를 계산합니다. 차이가 미리 정의 된 임계 값 (예 : 1e-3) 미만인 경우 FN-Approx는 2 차 효과를 고려하지 않고 정적 에지 가중치를 기반으로 단계를 샘플링합니다. 이러한 방식으로 FN-Approx는 인기있는 정점에서 전환 확률을 계산하기위한 시간 오버 헤드를 크게 줄일 수 있습니다. 이 근사치가 4 장에서 솔루션의 효율성과 정확성에 미치는 영향을 연구합니다.


### 4. EVALUATION

In this section, we empirically evaluate the efficiency of our proposed `Fast-Node2Vec` algorithms. We apply the algorithms to a number of large-scale real-world and synthetic graphs.

> 이 섹션에서는 제안 된 `Fast-Node2Vec` 알고리즘의 효율성을 경험적으로 평가합니다. 우리는 수많은 대규모 실제 및 합성 그래프에 알고리즘을 적용합니다.


#### 4.1 Experimental Setup

Machine Configuration.

We run all experiments on a cluster of 12 machines, each of which is equipped with two Intel(R) Xeon(R) E5-2650 v3 CPU @ 2.30GHz (10 cores, 2 threads/core) and 128GB DRAM. The machine runs stock Ubuntu 16.04 with Linux Kernel version 4.4.0-112-generic. The machine nodes are connected through 10 Gbps Ethernet. The measured network bandwidth is between 9.4 and 9.6 Gbps. We compile C-Node2Vec, GraphLite, and the `Fast-Node2Vec` algorithms using g++ version 5.4.0 with optimization level -O3. For Spark-Node2Vec, we run Spark version 2.2.0 with Java version 1.8 and Scala version 2.11. We deploy a cluster of 11 Spark workers and 1 Spark master and set the driver memory and executor memory size as 100 GB for Spark-Node2Vec evaluation to utilize almost all memory available on the machine nodes.

> 모든 실험은 12 개의 머신 클러스터에서 실행되며, 각 머신에는 2 개의 Intel (R) Xeon (R) E5-2650 v3 CPU @ 2.30GHz (10 코어, 2 스레드 / 코어) 및 128GB DRAM이 장착되어 있습니다. 이 컴퓨터는 Linux Kernel 버전 4.4.0-112-generic으로 Ubuntu 16.04를 실행합니다. 머신 노드는 10Gbps 이더넷을 통해 연결됩니다. 측정 된 네트워크 대역폭은 9.4 ~ 9.6Gbps입니다. 최적화 수준이 -O3 인 g ++ 버전 5.4.0을 사용하여 C-Node2Vec, GraphLite 및 `Fast-Node2Vec` 알고리즘을 컴파일합니다. Spark-Node2Vec의 경우 Java 버전 1.8 및 Scala 버전 2.11과 함께 Spark 버전 2.2.0을 실행합니다. Spark 작업자 11 개와 Spark 마스터 1 개로 구성된 클러스터를 배포하고 Spark-Node2Vec 평가를 위해 드라이버 메모리 및 실행기 메모리 크기를 100GB로 설정하여 머신 노드에서 사용 가능한 거의 모든 메모리를 활용합니다.

Data Sets.

Table 1 summarizes the real-world and synthetic data sets used in the evaluation. The real-world graphs are described in the following:

> 표 1에는 평가에 사용 된 실제 및 합성 데이터 세트가 요약되어 있습니다. 실제 그래프는 다음과 같습니다.

• BlogCatalog [20]: This is a social network between authors on the BlogCatalog site. Vertices are labelled with topic categories provided by authors. This is the same data set used in the Node2Vec paper [5]. We use This data set to evaluate not only the efficiency the algorithms, but also the accuracy of the resulting vector representations for the node classification task.

• com-LiveJournal [19]: This is the friendship social network of the LiveJournal blogging website. There are 4 million vertices and 34.7 million edges in the graph.

• com-Orkut [19]: This is a social network of the Orkut site. Compared to com-LiveJournal, this graph contains slightly smaller number of vertices (3.1 million) but much larger number of edges (117.2 million). The average vertex degree of com-Orkut is 4.3 times as large as that of com-LiveJournal.

• com-Friendster [19]: This is a network of social relationships of the users on the Friendster site. Containing 1.8 billion edges, com-Friendster is the largest real-world data set in the evaluation.

> • BlogCatalog [20] : BlogCatalog 사이트에서 작성자 간의 소셜 네트워크입니다. 정점은 작성자가 제공 한 주제 범주로 레이블이 지정됩니다. 이것은 Node2Vec 논문 [5]에서 사용 된 것과 동일한 데이터 세트입니다. 이 데이터 세트를 사용하여 알고리즘의 효율성뿐만 아니라 노드 분류 작업에 대한 결과 벡터 표현의 정확성도 평가합니다.
>
> • com-LiveJournal [19] : LiveJournal 블로그 웹 사이트의 우정 소셜 네트워크입니다. 그래프에는 4 백만 개의 꼭지점과 3470 만 개의 모서리가 있습니다.
>
> • com-Orkut [19] : orkut 사이트의 소셜 네트워크입니다. com-LiveJournal과 비교하여이 그래프에는 약간 적은 수의 정점 (310 만)이 포함되지만 훨씬 더 많은 수의 가장자리 (1 억 1,720 만)가 포함됩니다. com-Orkut의 평균 정점 정도는 com-LiveJournal보다 4.3 배 큽니다.
>
> • com-Friendster [19] : Friendster 사이트에있는 사용자의 사회적 관계 네트워크입니다. 18 억 개의 에지를 포함하는 com-Friendster는 평가에서 가장 큰 실제 데이터 세트입니다.

In addition to the real-world graphs, we generate synthetic graphs that follow the RMAT [2] model. In the RMAT model, a graph with 2K vertices is generated using four parameters (a, b, c, d), where a+b+c+d = 1. The 2K ×2K adjacency matrix is conceptually divided into four 2K−1×2K−1 sub-matrices. An edge is randomly generated in the top-left, top-right, bottom-left, and bottom-right sub-matrices with probability a, b, c, and d, respectively. This process is recursively applied to every sub-matrix. That is, a 2i ×2i matrix is conceptually divided into four 2i−1 ×2i−1 matrices, where i = K, K − 1, · · · , 2. Given that an edge is to be generated in a 2i ×2i matrix, the probability that this edge belongs to one of its four 2i−1 × 2i−1 sub-matrices follows the (a, b, c, d) distribution. We use a graph generation tool called TrillionG6[11] to generate large-scale RMAT graphs. We vary (a, b, c, d) to generate three sets of graphs with different characteristics:

> 실제 그래프 외에도 RMAT [2] 모델을 따르는 합성 그래프를 생성합니다. RMAT 모델에서는 4 개의 매개 변수 (a, b, c, d)를 사용하여 2K 정점이있는 그래프가 생성됩니다. 여기서 a + b + c + d = 1입니다. 2K × 2K 인접 행렬은 개념적으로 4 개의 2K-1로 나뉩니다. × 2K−1 부분 행렬. 가장자리는 각각 확률 a, b, c 및 d를 사용하여 왼쪽 상단, 오른쪽 상단, 왼쪽 하단 및 오른쪽 하단 부분 행렬에서 무작위로 생성됩니다. 이 프로세스는 모든 하위 매트릭스에 반복적으로 적용됩니다. 즉, 2i × 2i 행렬은 개념적으로 4 개의 2i−1 × 2i−1 행렬로 나뉩니다. 여기서 i = K, K − 1, · · ·, 2. 2i × 2i에서 가장자리가 생성되는 경우 이 간선이 4 개의 2i−1 × 2i−1 부분 행렬 중 하나에 속할 확률은 (a, b, c, d) 분포를 따릅니다. TrillionG6 [11]이라는 그래프 생성 도구를 사용하여 대규모 RMAT 그래프를 생성합니다. 다양한 특성을 가진 세 가지 그래프 세트를 생성하기 위해 (a, b, c, d) 변경합니다.

• ER-K graphs: We set (a, b, c, d) to (0.25, 0.25, 0.25, 0.25) to generate Erdos-Renyi (ER) graphs with 2K vertices and an average degree of 10. Note that the edges in this graph are uniformly distributed. There is no skew in the vertex degree distribution. We use this graph because the Node2Vec paper [5] reports run times for ER graphs with up to 1 million vertices and 10 million edges. We would like to compare our solution with the original Node2Vec, and show that our solution can scale up to 1 billion vertices and 10 billion edges. Therefore, we vary K from 20 to 30 to generate graphs with 1 million to 1.1 billion vertices.

> • ER-K 그래프 : (a, b, c, d)를 (0.25, 0.25, 0.25, 0.25)로 설정하여 2K 정점과 평균 차수가 10 인 Erdos-Renyi (ER) 그래프를 생성합니다. 이 그래프에서 균일하게 분포되어 있습니다. 꼭지점 차수 분포에는 왜곡이 없습니다. Node2Vec 논문 [5]은 최대 1 백만 개의 정점과 1 천만 개의 모서리가있는 ER 그래프의 실행 시간을보고하기 때문에이 그래프를 사용합니다. 우리의 솔루션을 원래의 Node2Vec과 비교하여 우리의 솔루션이 최대 10 억 개의 정점과 100 억 개의 모서리까지 확장 할 수 있음을 보여주고 싶습니다. 따라서 K를 20에서 30으로 변경하여 100 만에서 11 억 개의 정점이있는 그래프를 생성합니다.

• WeC-K graphs: We model a WeChat-like social network, where the upper bound of the number of friends per user is 5,000 and the average number of friends is about 100. We generate a set of WeC-K graphs with 2K vertices and 100 × 2K edges. Without loss of generality, suppose c + d ≥ a + b. Then the vertex with the largest degree is the last vertex with high probability. We can compute the parameters to ensure the expected degree of the last vertex is 5000. While the resulting parameters vary slightly for different K, we choose (0.18, 0.25, 0.25, 0.32) as the representative parameters to generate all WeC-K graphs so that the graphs are comparable to the Skew-S graphs.

> • WeC-K 그래프 : WeChat과 유사한 소셜 네트워크를 모델링합니다. 여기서 사용자 당 친구 수의 상한은 5,000 명이고 평균 친구 수는 약 100 명입니다. 2K 꼭짓점으로 WeC-K 그래프 세트를 생성합니다. 및 100 × 2K 가장자리. 일반성을 잃지 않고 c + d ≥ a + b라고 가정합니다. 그러면 차수가 가장 큰 정점이 확률이 높은 마지막 정점이됩니다. 마지막 정점의 예상 각도가 5000인지 확인하기 위해 매개 변수를 계산할 수 있습니다. 결과 매개 변수는 K마다 약간 씩 다르지만 모든 WeC-K 그래프를 생성하는 대표 매개 변수로 (0.18, 0.25, 0.25, 0.32)를 선택합니다. 그래프는 Skew-S 그래프와 비슷합니다.

• Skew-S graphs: We generate a set of graphs with 222 vertices and an average degree of 100, while varying the skewness of the data. We set the parameters (a, b, c, d) so that the number of edges in the bottom-right part of the matrix is about S times as many as that in the topleft part of the matrix, i.e. d = Sa. In addition, we set b = c = 0.25. When S = 1, there is no skew. In general, when S > 1, RMAT generates graphs with power-law characteristics. The higher the S, the more skew the vertex degrees are. We vary S from 1 to 5. Note that WeC-22 is Skew-1.78 (0.32/0.18 = 1.78).

> • Skew-S 그래프 : 데이터의 왜곡도를 변경하면서 정점 222 개와 평균 차수가 100 인 그래프 세트를 생성합니다. 행렬의 오른쪽 하단 부분에있는 모서리 수가 행렬의 왼쪽 상단 부분에있는 것보다 약 S 배가되도록 매개 변수 (a, b, c, d)를 설정합니다 (예 : d = Sa). 또한 b = c = 0.25로 설정합니다. S = 1이면 스큐가 없습니다. 일반적으로 S> 1 일 때 RMAT는 멱 법칙 특성이있는 그래프를 생성합니다. S가 높을수록 정점 각도가 더 많이 기울어집니다. S는 1에서 5까지 다양합니다. WeC-22는 Skew-1.78 (0.32 / 0.18 = 1.78)입니다.


Algorithms to Compare.

We evaluate the following solutions in the experiments:

• C-Node2Vec: This is the single-machine C++ reference implementation from the Node2Vec project web page. We use this implementation for two purposes: (i) comparing accuracy of applying the various solutions to the node classification task; and (ii) evaluating the scalability using the ER-K graphs.

• Spark-Node2Vec: This is the Node2Vec implementation on Spark. It preserves up to 30 edges per vertex, and computes the transition probabilities before running the biased random walk.

• FN-Base: This is Algorithm 1, the baseline `Fast-Node2Vec` algorithm, which computes transition probabilities on demand and runs on GraphLite, a Pregel-Like Graph Computation Framework (cf. Section 3.2).

• FN-Local: FN-Local improves FN-Base by allowing vertices to visit edge information of other vertices in the local graph partitions (cf. Section 3.4). In this way, it reduces the NEIG messages for local vertices.

• FN-Switch: FN-Switch switches the destination of NEIG messages from popular to unpopular vertices (cf. Section 3.4). However, this may incur more rounds of messages and thus more supersteps.

• FN-Cache: FN-Cache improves FN-Local by caching neighbors of the most popular vertices in order to reduce the amount of messages for popular vertices (cf. Section 3.4).

• FN-Approx and FN-Exact: FN-Approx is the approximate algorithm to reduce the overhead for computing transition probability at popular vertices. It is otherwise the same as FN-Cache (cf. Section 3.4). As the other FN algorithms all give exact results, we use FN-Exact to represent them for the purpose of comparing accuracy of applying the solutions to the node classification task.


Measurements.

We compare both the result quality and the efficiency of the above solutions in our experiments. In the efficiency comparison, we will focus only on the run time of performing the Node2Vec random walks. For each combination of solutions, graphs, and Node2Vec (p, q) parameter settings, we compute 80-step biased random walks for all vertices in the graph.

> 실험에서 위 솔루션의 결과 품질과 효율성을 모두 비교합니다. 효율성 비교에서는 Node2Vec 랜덤 워크를 수행하는 런타임에만 초점을 맞출 것입니다. 솔루션, 그래프 및 Node2Vec (p, q) 매개 변수 설정의 각 조합에 대해 그래프의 모든 정점에 대해 80 단계 편향된 임의 걷기를 계산합니다.


#### 4.2 Accuracy of Node Classification

The first question that we would like to answer is what is the impact of the quality of the generated random walks on the accuracy of the node classification task. We use the BlogCatalog data set, in which vertex labels are available, for this purpose. Figure 6 compares the accuracy of the node classification task using the vector representations generated by C-Node2Vec, Spark-Node2Vec, FN-Exact, and FN-approx. From left to right, the figure shows the microF1 and macro-F1 scores with two sets of Node2Vec (p, q) parameters. The higher the scores, the better the solution.

> 우리가 대답하고 싶은 첫 번째 질문은 생성 된 랜덤 워크의 품질이 노드 분류 작업의 정확성에 미치는 영향입니다. 이를 위해 꼭짓점 레이블을 사용할 수있는 BlogCatalog 데이터 세트를 사용합니다. 그림 6은 C-Node2Vec, Spark-Node2Vec, FN-Exact 및 FN-approx에서 생성 된 벡터 표현을 사용하여 노드 분류 작업의 정확도를 비교합니다. 그림은 왼쪽에서 오른쪽으로 두 세트의 Node2Vec (p, q) 매개 변수가있는 microF1 및 macro-F1 점수를 보여줍니다. 점수가 높을수록 솔루션이 더 좋습니다.

From Figure 6, we see that:

(1) The accuracy of Spark-Node2Vec is dramatically worse than the other solutions. This is because Spark-Node2Vec preserves only up to 30 edges for every vertex in order to save memory space, significantly restricting the random walk destinations and thus altering the behavior of Node2Vec random walks.

(2) FN-exact achieves similar accuracy as C-Node2Vec. FNexact (i.e., FN-Base, FN-Local, FN-Switch, FN-Cache) implements the 2nd-order biased random walk exactly as defined in Node2Vec [5]. Therefore, it has similar quality as the reference implementation, C-Node2Vec.

(3) Interestingly, FN-approx, our proposed approximate solution, achieves similar accuracy compared to FN-exact and C-Node2Vec. This shows that the quality degradation caused by the approximate computation on popular vertices is neglegible. This approximation technique works in practice.

> (1) Spark-Node2Vec의 정확도는 다른 솔루션보다 훨씬 떨어집니다. 이는 Spark-Node2Vec이 메모리 공간을 절약하기 위해 모든 정점에 대해 최대 30 개의 에지 만 보존하고 랜덤 워크 대상을 크게 제한하여 Node2Vec 랜덤 워크의 동작을 변경하기 때문입니다.
>
> (2) FN-exact는 C-Node2Vec과 유사한 정확도를 달성합니다. FNexact (즉, FN-Base, FN-Local, FN-Switch, FN-Cache)는 Node2Vec [5]에 정의 된대로 정확하게 2 차 바이어스 랜덤 워크를 구현합니다. 따라서 참조 구현 인 C-Node2Vec과 유사한 품질을 갖습니다.
>
> (3) 흥미롭게도, 우리가 제안한 근사 솔루션 인 FN-approx는 FN-exact 및 C-Node2Vec에 비해 유사한 정확도를 달성합니다. 이것은 인기있는 정점에 대한 대략적인 계산으로 인한 품질 저하가 무시할 수 있음을 보여줍니다. 이 근사화 기술은 실제로 작동합니다.


#### 4.3 Efficiency on Real-World Graphs

Figures 7(a)-(c) compare the execution time of all seven solutions: C-Node2Vec, Spark-Node2Vec, FN-Base, FN-Local, FN-Cache, FN-Approx, and FN-Switch. For each graph, we run experiments with two sets of Node2Vec (p, q) parameters. From the figures, we can see the following trends:

> 그림 7 (a)-(c)는 C-Node2Vec, Spark-Node2Vec, FN-Base, FN-Local, FN-Cache, FN-Approx 및 FN-Switch의 7 개 솔루션 모두의 실행 시간을 비교합니다. 각 그래프에 대해 Node2Vec (p, q) 매개 변수의 두 세트로 실험을 실행합니다. 수치에서 다음과 같은 추세를 볼 수 있습니다.

(1) C-Node2Vec, a single-machine solution, cannot support very large graphs, such as com-Orkut. When the space required by the graph and the Node2Vec algorithm is too large to fit into the memory of a single machine, it is desirable to run distributed Node2Vec solutions.

(2) Spark-Node2Vec is by far the slowest solution. SparkNode2Vec tries to reduce memory space by restricting the number of edges per vertex to 30. As shown in Section 4.2, this trick drastically degrades the quality of the solution. However, even with this trick, Spark-Node2Vec still runs out of memory for com-Orkut on our 12-node cluster. Moreover, it suffers from the inefficiency of readonly RDDs and the I/O intensive shuffle operations.

(3) FN-Base achieves 7.7-22x speedups over Spark-Node2Vec for the cases that Spark-Node2Vec can support. The improvements of FN-Base are twofold. First, FN-Base employs a Pregel-like graph computation platform that avoids the overhead of RDDs and disk I/Os in Spark. Second, FN-Base computes the transition probabilities on the fly, thereby significantly reducing the memory required to store the transition probabilities. Suppose each probability requires 8-byte space. Then, the total amount of memory saved for storing the transition probabilities is 3.0GB, 68.6GB, 731.9GB for BlogCatalog, com-LiveJournal, and com-Orkut, respectively.

(4) FN-Local’s execution time is quite similar to that of FNBase. While FN-Local reduces the NEIG messages between vertices in the same graph partition, we find that the direct memory visits at a vertex u to retrieve the edge information of another vertex v may incur expensive CPU cache misses, which is especially the case when v’s degree is small. As a result, the overall benefit is not as large as we expected.

(5) FN-Cache and FN-Approx achieve 1.5–1.9x and 1.8–5.6x speedups over FN-Base, respectively. FN-Cache employs caching for the edge information of popular vertices. In this way, it significantly reduces the cost of NEIG messages. FN-Approx performs approximate computation (random sampling) on popular vertices when the estimation errors are low. This further reduces the computation overhead. Overall, compared to Spark-Node2Vec, FN-Cache and FN-Approx achieve 11.9–40.8x and 13.8–122x speedups, respectively.

(6) FN-Switch has the longest run time among the FastNode2Vec solutions. The switch of an NEIG message requires an additional message to be sent, thereby increasing the total number of supersteps in the graph computation. This effect significantly offsets the potential benefit of switching the NEIG messages, resulting in poor efficiency.

> (1) 단일 머신 솔루션 인 C-Node2Vec은 com-Orkut과 같은 매우 큰 그래프를 지원할 수 없습니다. 그래프와 Node2Vec 알고리즘에 필요한 공간이 너무 커서 단일 시스템의 메모리에 맞지 않는 경우 분산 형 Node2Vec 솔루션을 실행하는 것이 바람직합니다.
>
> (2) Spark-Node2Vec은 가장 느린 솔루션입니다. SparkNode2Vec은 정점 당 가장자리 수를 30 개로 제한하여 메모리 공간을 줄이려고합니다. 섹션 4.2에서 볼 수 있듯이이 트릭은 솔루션의 품질을 크게 저하시킵니다. 그러나이 트릭을 사용하더라도 Spark-Node2Vec은 12 노드 클러스터에서 com-Orkut에 대한 메모리가 부족합니다. 또한 읽기 전용 RDD의 비효율 성과 I / O 집약적 셔플 작업으로 인해 어려움을 겪습니다.
>
> (3) FN-Base는 Spark-Node2Vec이 지원할 수있는 경우 Spark-Node2Vec보다 7.7-22 배의 속도 향상을 달성합니다. FN-Base의 개선 사항은 두 가지입니다. 첫째, FN-Base는 Spark에서 RDD 및 디스크 I / O의 오버 헤드를 방지하는 Pregel과 유사한 그래프 계산 플랫폼을 사용합니다. 둘째, FN-Base는 전환 확률을 즉석에서 계산하여 전환 확률을 저장하는 데 필요한 메모리를 크게 줄입니다. 각 확률에 8 바이트 공간이 필요하다고 가정합니다. 그런 다음 전환 확률을 저장하기 위해 저장되는 총 메모리 양은 BlogCatalog, com-LiveJournal 및 com-Orkut에 대해 각각 3.0GB, 68.6GB, 731.9GB입니다.
>
> (4) FN-Local의 실행 시간은 FNBase의 실행 시간과 매우 유사합니다. FN-Local은 동일한 그래프 파티션의 정점 간 NEIG 메시지를 줄이지 만 다른 정점 v의 에지 정보를 검색하기 위해 정점 u에서 직접 메모리를 방문하면 비용이 많이 드는 CPU 캐시 미스가 발생할 수 있습니다. 정도가 작습니다. 결과적으로 전반적인 이익은 우리가 예상 한 것만 큼 크지 않습니다.
>
> (5) FN-Cache 및 FN-Approx는 FN-Base보다 각각 1.5–1.9x 및 1.8–5.6x 속도 향상을 달성합니다. FN-Cache는 인기있는 꼭지점의 가장자리 정보에 캐싱을 사용합니다. 이러한 방식으로 NEIG 메시지 비용을 크게 줄입니다. FN-Approx는 추정 오류가 낮을 때 많이 사용되는 정점에서 근사 계산 (무작위 샘플링)을 수행합니다. 이것은 계산 오버 헤드를 더욱 감소시킵니다. 전반적으로 Spark-Node2Vec에 비해 FN-Cache 및 FN-Approx는 각각 11.9–40.8x 및 13.8–122x 속도 향상을 달성했습니다.
>
> (6) FN-Switch는 FastNode2Vec 솔루션 중 가장 긴 실행 시간을 가지고 있습니다. NEIG 메시지를 전환하려면 추가 메시지를 보내야하므로 그래프 계산에서 총 슈퍼 스텝 수가 증가합니다. 이 효과는 NEIG 메시지 전환의 잠재적 이점을 크게 상쇄하여 효율성을 저하시킵니다.

From Figure 6 and Figure 7, we can conclude that SparkNode2Vec has both poor result quality and poor efficiency. Moreover, among the `Fast-Node2Vec` solutions, FN-Switch has poor efficiency and FN-Local achieves similar execution time as FN-Base. Therefore, we will not consider SparkNode2Vec, FN-Local, and FN-Switch any more in the rest of the evaluation.

> 그림 6과 그림 7에서 SparkNode2Vec의 결과 품질과 효율성이 모두 낮다는 결론을 내릴 수 있습니다. 또한 `Fast-Node2Vec` 솔루션 중 FN-Switch는 효율성이 낮고 FN-Local은 FN-Base와 유사한 실행 시간을 달성합니다. 따라서 나머지 평가에서는 SparkNode2Vec, FN-Local 및 FN-Switch를 더 이상 고려하지 않을 것입니다.


The com-Friendster Graph.

Figure 8 compares the execution time of FN-Base, FN-Cache, and FN-Approx for the com-Friendster Graph. com-Friendster is the largest real-world graph with 1.8 billion edges. The total amount of space required to store all the transition probabilites is 11.6TB, much larger than the total memory size (∼1.5TB) of our 12-node cluster. Therefore, the pre-computation approach is not possible. Computing the transition probabilities on the fly is a must for larger graphs. Taking this approach, FN-Base computes the full Node2Vec random walks in about 3.3 hours. This shows that FN-Base is capable of processing large-scale real-world graphs in a reasonable amount of time using a mid-sized cluster of machines.

However, FN-Base has already consumes the majority of memory for com-Friendster. Hence, FN-Cache has only limited amount of memory available for caching edge information for popular vertices, which does not show significant benefit.

> com-Friendster 그래프.
>
> 그림 8은 com-Friendster Graph에 대한 FN-Base, FN-Cache 및 FN-Approx의 실행 시간을 비교합니다. com-Friendster는 18 억 개의 모서리가있는 가장 큰 실제 그래프입니다. 모든 전환 확률을 저장하는 데 필요한 총 공간은 11.6TB로 12 노드 클러스터의 총 메모리 크기 (~ 1.5TB)보다 훨씬 큽니다. 따라서 사전 계산 방식은 불가능합니다. 큰 그래프에서는 즉시 전환 확률을 계산해야합니다. 이 접근 방식을 사용하면 FN-Base는 약 3.3 시간 내에 전체 Node2Vec 랜덤 워크를 계산합니다. 이는 FN-Base가 중간 규모의 머신 클러스터를 사용하여 합리적인 시간에 대규모 실제 그래프를 처리 할 수 있음을 보여줍니다.
>
> 그러나 FN-Base는 이미 com-Friendster를 위해 대부분의 메모리를 사용하고 있습니다. 따라서 FN-Cache는 많이 사용되는 정점에 대한 에지 정보를 캐싱하는 데 사용할 수있는 메모리의 양이 제한되어있어 큰 이점이 없습니다.


#### 4.4 Scalability on ER-K Graphs

Figure 9 shows the scalability of FN-Base and C-Node2Vec on the ER-K graphs varying the number of vertices from 220 (about 1 million) to 230 (about 1 billion). The two figures show the results for two sets of Node2Vec (p, q) parameters. Both the X-axis and the Y-axis are in the log-scale.

From Figure 9, we see that as the graph size increases, C-Node2Vec scales linearly. However, it runs out of memory for ER-K graphs, where K ≥ 26. In comparison, our `Fast-Node2Vec` solution scales linearly while the number of vertices increases from 1 million to 1 billion. FN-Base computes Node2Vec random walks on the largest ER-K graph, i.e. ER-30, in about 2.3 hours. This is quite reasonable on a mid-sized cluster of machines.

Note that in an ER-K graph, the average degree is 10, and the degree distribution is uniform. Therefore, the optimization techniques for popular vertices (including FNCache and FN-Approx) are not necessary.

> 그림 9는 ER-K 그래프에서 FN-Base 및 C-Node2Vec의 확장 성을 보여 주며 정점 수는 220 개 (약 100 만 개)에서 230 개 (약 10 억 개)까지 다양합니다. 두 그림은 Node2Vec (p, q) 매개 변수의 두 세트에 대한 결과를 보여줍니다. X 축과 Y 축은 모두 로그 스케일에 있습니다.
>
> 그림 9에서 그래프 크기가 증가하면 C-Node2Vec이 선형으로 확장되는 것을 볼 수 있습니다. 그러나 K ≥ 26 인 ER-K 그래프의 경우 메모리가 부족합니다. 이에 비해 `Fast-Node2Vec` 솔루션은 선형 적으로 확장되는 반면 정점 수가 100 만 개에서 10 억 개로 증가합니다. FN-Base는 가장 큰 ER-K 그래프 (예 : ER-30)에서 약 2.3 시간 내에 Node2Vec 임의 걷기를 계산합니다. 이것은 중간 규모의 머신 클러스터에서 상당히 합리적입니다.
>
> ER-K 그래프에서 평균 차수는 10이고 차수 분포는 균일합니다. 따라서 널리 사용되는 정점 (FNCache 및 FN-Approx 포함)에 대한 최적화 기술은 필요하지 않습니다.


#### 4.5 Efficiency and Scalability onWeC-K Graphs

In this subsection, we study the efficiency and scalability of Fast-NodeVec solutions on the WeC-K graphs. Unlike the ER-K graphs, the degree distribution in the WeC-K graphs are not uniform. As shown in Table 1, the maximum vertex degree is much (about 10–27 times) larger than the average vertex degree. Therefore, we expect the optimization techniques of FN-Cache and FN-Approx to be beneficial.

Figure 10 shows the execution times of FN-Base, FNCache, and FN-Approx for WeC-K graphs and for two sets of Node2Vec (p, q) parameters. We see that FN-Cache achieves a factor of 1.03–1.13x improvements over FN-Base, and FNApprox achieves a factor of 1.21–1.54x improvements over FN-Base. This confirms our expectation. In the next subsection, we will further study the relationship between the skewness of the graphs and the impact of FN-Cache and FN-Approx on execution time improvements.

Figure 11 shows the scalability of FN-Base on WeC-K graphs. We see that FN-Base scales linearly while the number of vertices increases from 220 to 226.

> 이 하위 섹션에서는 WeC-K 그래프에서 Fast-NodeVec 솔루션의 효율성과 확장 성을 연구합니다. ER-K 그래프와 달리 WeC-K 그래프의 차수 분포는 균일하지 않습니다. 표 1에서 볼 수 있듯이 최대 정점 각도는 평균 정점 각도보다 훨씬 더 큽니다 (약 10–27 배). 따라서 FN-Cache 및 FN-Approx의 최적화 기술이 도움이 될 것으로 기대합니다.
>
> 그림 10은 WeC-K 그래프 및 두 세트의 Node2Vec (p, q) 매개 변수에 대한 FN-Base, FNCache 및 FN-Approx의 실행 시간을 보여줍니다. 우리는 FN-Cache가 FN-Base에 비해 1.03-1.13 배의 개선을 달성하고 FNApprox는 FN-Base에 비해 1.21-1.54 배의 개선을 달성하는 것을 확인했습니다. 이것은 우리의 기대를 확인시켜줍니다. 다음 하위 섹션에서는 그래프의 왜곡 도와 FN-Cache 및 FN-Approx가 실행 시간 개선에 미치는 영향 사이의 관계를 추가로 연구 할 것입니다.
>
> 그림 11은 WeC-K 그래프를 기반으로 한 FN-Base의 확장성을 보여줍니다. 정점 수가 220 개에서 226 개로 증가하는 동안 FN-Base가 선형으로 확장되는 것을 볼 수 있습니다.


#### 4.6 In-Depth Analysis Using Skew-K Graphs

Finally, we use the Skew-K graphs to analyze the relationship between graph characteristics and the benefits of our proposed optimization techniques.

Figure 12 shows the vertex degree distribution of the SkewK graphs. We see that the vertex degree distribution of Skew-1 is essentially a guassian distribution centered at 100. This is because the edges in Skew-1 are uniformly randomly generated. When S > 1, the vertex degree distribution of Skew-S can be seen as a combination of the guassian distribution (which is the arc shape in the middle of the figure) and the power-law distribution (which is the linear shape in the right part of the figure). As S grows larger and larger, the distribution becomes closer and closer to the power-law distribution. Note that WeC-22 in Figure 10(b) is a Skew-S graph, where S = 1.78.

Figure 13(a)–(d) report the execution times of FN-Base, FN-Cache, and FN-Approx for Skew-2, Skew-3, Skew-4, and Skew-5 with two sets of Node2Vec (p, q) parameters. We make two interesting observations from the figure:

> 마지막으로 Skew-K 그래프를 사용하여 그래프 특성과 제안 된 최적화 기술의 이점 간의 관계를 분석합니다.
>
> 그림 12는 SkewK 그래프의 정점 정도 분포를 보여줍니다. Skew-1의 정점 정도 분포는 본질적으로 100을 중심으로 한 guassian 분포입니다. 이는 Skew-1의 가장자리가 균일하게 무작위로 생성되기 때문입니다. S> 1 일 때 Skew-S의 꼭짓점 분포는 guassian 분포 (그림 중간의 호 모양)와 power-law 분포 (그림의 선형 모양)의 조합으로 볼 수 있습니다. 그림의 오른쪽 부분). S가 점점 커질수록 분포는 멱 법칙 분포에 가까워집니다. 그림 10 (b)의 WeC-22는 Skew-S 그래프이며 S = 1.78입니다.
>
> 그림 13 (a) – (d)는 두 세트의 Node2Vec을 사용하여 Skew-2, Skew-3, Skew-4 및 Skew-5에 대한 FN-Base, FN-Cache 및 FN-Approx의 실행 시간을보고합니다 (p , q) 매개 변수. 그림에서 두 가지 흥미로운 관찰을합니다.
>
> (1) As S increases, it takes longer time to compute Node2Vec random walks. This can be clearly seen by the Y-axis labels. In particular, when p = 0.5, q = 2, FN-Base takes 314.5, 369.3, 811.1, 1710.4, and 2913.4 seconds for Skew1.78, Skew-2, Skew-3, Skew-4, and Skew-5, respectively.
>
> (2) As S increases, the benefits of FN-Cache and FN-Approx over FN-Base become larger. As S grows from 1.78 to 5, the speedup of FN-Cache over FN-Base grows from 1.04x to 2.68x when p = 0.5, q = 2, and from 1.09x to 2.66x when p = 2, q = 0.5. The speedup of FN-Approx over FN-Base grows from 1.45x to 17.2x when p = 0.5, q = 2, and from 1.41x to 17.1x when p = 2, q = 0.5.

To better understand the results, we study the memory space consumption of FN-Base for processing the Skew-K graphs, as shown in Figure 14. We see that as S increases, the memory space consumed by messages constitutes an increasingly larger portion of the total space used.

Combining the results in Figure 12, Figure 13, and Figure 14, we see that as S increases, the vertex degree distribution is more and more skewed. A greater many vertices have large numbers of neighbors. Vertices with larger degrees also tend to be sampled more frequently in the random walks. This leads to larger memory space allocated for processing NEIG messages. Consequently, optimizations for popular vertices, including FN-Cache and FN-Approx, become more effective when S is larger.

> 결과를 더 잘 이해하기 위해 그림 14와 같이 Skew-K 그래프를 처리하기위한 FN-Base의 메모리 공간 소비를 연구합니다. S가 증가함에 따라 메시지가 소비하는 메모리 공간이 점점 더 많은 부분을 차지한다는 것을 알 수 있습니다. 사용 된 총 공간.
>
> 그림 12, 그림 13 및 그림 14의 결과를 결합하면 S가 증가함에 따라 꼭지점 차수 분포가 점점 더 왜곡된다는 것을 알 수 있습니다. 더 많은 정점에는 많은 수의 이웃이 있습니다. 각도가 더 큰 정점은 랜덤 워크에서 더 자주 샘플링되는 경향이 있습니다. 이로 인해 NEIG 메시지 처리에 할당 된 더 큰 메모리 공간이 발생합니다. 결과적으로 FN-Cache 및 FN-Approx를 포함하여 널리 사용되는 정점에 대한 최적화는 S가 더 클 때 더 효과적입니다.


### 5. CONCLUSION

Node2Vec is a state-of-the-art feature learning method that generates high-quality vector representations for the purpose of employing classical machine learning methods in graph analysis. However, we find that existing Node2Vec implementations have significant difficulties in supporting large-scale graphs. The C++ and Python reference implementations of Node2Vec are limited by the resource of a single machine. An existing Node2Vec solution on the Spark big data platform has poor result quality and incurs large run-time overhead. In this paper, we aim to efficiently support Node2Vec on graphs with billions of vertices using a mid-sized cluster of machines.

> Node2Vec은 그래프 분석에 고전적인 기계학습 방법을 사용하기 위한 목적으로 고품질 벡터 표현을 생성하는 최첨단 기능 학습 방법입니다. 그러나 기존 Node2Vec 구현은 대규모 그래프를 지원하는데 상당한 어려움이 있음을 발견했습니다. Node2Vec의 C++ 및 Python 참조 구현은 단일 머신의 리소스로 제한됩니다. Spark 빅 데이터 플랫폼의 기존 Node2Vec 솔루션은 결과 품질이 좋지 않고 런타임 오버 헤드가 많이 발생합니다. 이 백서에서는 중간 크기의 머신 클러스터를 사용하여 수십억 개의 정점이 있는 그래프에서 Node2Vec을 효율적으로 지원하는 것을 목표로 합니다.

We propose and evaluate `Fast-Node2Vec`, a family of efficient Node2Vec random walk algorithms. `Fast-Node2Vec` employs GraphLite, a Pregel-like graph computation framework, in order to avoid the overhead of read-only RDDs and I/O-intensive shuffle operations in Spark. It computes the transition probabilities of Node2Vec random walks on demand, thereby reducing the memory space required for storing all the transition probabilities, which is often much larger than the total memory size in the mid-sized cluster for large-scale graphs as shown in our evaluation. Moreover, we also propose and evaluate a set of techniques (e.g., FN-Cache and FN-Approx) to improve the efficiency of handling largedegree verticies. Experimental results show that Compared to Spark-Node2Vec, fast-Node2Vec solutions achieve 7.7–122x speedups speedups. Compared to the baseline FastNode2Vec, FN-Cache and FN-Approx achieve up to 2.68x and 17.2x speedups.

> 효율적인 Node2Vec 랜덤 워크 알고리즘 제품군인 `Fast-Node2Vec`을 제안하고 평가합니다. `Fast-Node2Vec`은 Spark에서 읽기 전용 RDD 및 I/O 집약적 셔플 작업의 오버 헤드를 피하기 위해 Pregel과 유사한 그래프 계산 프레임워크인 GraphLite를 사용합니다. 요청시 Node2Vec 랜덤 워크의 전환 확률을 계산하여 모든 전환 확률을 저장하는데 필요한 메모리 공간을 줄입니다. 이는 대규모 그래프의 경우 중간 크기 클러스터의 총 메모리 크기보다 훨씬 큽니다. 또한 대규모 정점 처리의 효율성을 개선하기 위해 일련의 기술 (예 : FN-Cache 및 FN-Approx)을 제안하고 평가합니다. 실험 결과는 Spark-Node2Vec과 비교하여 fast-Node2Vec 솔루션이 7.7–122 배의 속도 향상을 달성함을 보여줍니다. 기준 FastNode2Vec에 비해 FN-Cache 및 FN-Approx는 최대 2.68x 및 17.2x 속도 향상을 달성합니다.

In conclusion, our proposed `Fast-Node2Vec` solutions can successfully support Node2Vec computation on graphs with billions of vertices on a 12-node machine cluster. This means that researchers with moderate computing resources can exploit Node2Vec for employing classical machine learning algorithms on large-scale graphs.

> 결론적으로, 우리가 제안한 `Fast-Node2Vec` 솔루션은 12 노드 머신 클러스터에서 수십억개의 정점이 있는 그래프에서 Node2Vec 계산을 성공적으로 지원할 수 있습니다. 이는 적당한 컴퓨팅 리소스를 가진 연구자들이 대규모 그래프에서 고전적인 기계 학습 알고리즘을 사용하기 위해 Node2Vec을 이용할 수 있음을 의미합니다.


\[끝\]
