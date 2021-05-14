---
title: "node2vec: Scalable Feature Learning for Networks (2016)"
date: 2020-12-04 00:00:00 +0000
categories: ["papers", "KG"]
tags: ["node2vec", "Node embeddings", "Graph representations", "link prediction", "random walks"]
---

**`node2vec`: Scalable Feature Learning for Networks (2016)**

Aditya Grover, Jure Leskovec

- link: [https://arxiv.org/pdf/1607.00653.pdf](https://arxiv.org/pdf/1607.00653.pdf)


### Abstract

Prediction tasks over nodes and edges in networks require careful effort in engineering features used by learning algorithms. Recent research in the broader field of representation learning has led to significant progress in automating prediction by learning the features themselves. However, present feature learning approaches are not expressive enough to capture the diversity of connectivity patterns observed in networks.

Here we propose `node2vec`, an algorithmic framework for learning continuous feature representations for nodes in networks. In `node2vec`, we learn a mapping of nodes to a low-dimensional space of features that maximizes the likelihood of preserving network neighborhoods of nodes. We define a flexible notion of a node’s network neighborhood and design a biased random walk procedure, which efficiently explores diverse neighborhoods. Our algorithm generalizes prior work which is based on rigid notions of network neighborhoods, and we argue that the added flexibility in exploring neighborhoods is the key to learning richer representations.

We demonstrate the efficacy of `node2vec` over existing state-ofthe-art techniques on multi-label classification and link prediction in several real-world networks from diverse domains. Taken together, our work represents a new way for efficiently learning stateof-the-art task-independent representations in complex networks.

> 네트워크의 노드 및 에지에 대한 예측 작업에는 학습 알고리즘에 사용되는 엔지니어링 기능에 세심한 노력이 필요합니다. 광범위한 표현 학습 분야에 대한 최근 연구는 기능 자체를 학습하여 예측 자동화에 상당한 진전을 가져 왔습니다. 그러나 현재의 기능 학습 접근 방식은 네트워크에서 관찰되는 연결 패턴의 다양성을 포착할만큼 충분히 표현적이지 않습니다.
>
> 여기서 우리는 네트워크의 노드에 대한 연속적인 특징 표현을 학습하기 위한 알고리즘 프레임워크인 `node2vec`를 제안합니다. `node2vec`에서는 노드의 네트워크 이웃을 보존할 가능성을 최대화하는 기능의 저차원 공간에 대한 노드 매핑을 학습합니다. 우리는 노드의 네트워크 이웃에 대한 유연한 개념을 정의하고 다양한 이웃을 효율적으로 탐색하는 편향된 임의 걷기 절차를 설계합니다. 우리의 알고리즘은 네트워크 이웃의 엄격한 개념을 기반으로 하는 이전 작업을 일반화하며, 이웃을 탐색할 때 추가된 유연성이 더 풍부한 표현을 배우는 열쇠라고 주장합니다.
>
> 우리는 다양한 도메인의 여러 실제 네트워크에서 다중 레이블 분류 및 링크 예측에 대한 기존 최첨단 기술에 대한 `node2vec`의 효율성을 보여줍니다. 종합하면 우리의 작업은 복잡한 네트워크에서 최첨단 작업 독립적 표현을 효율적으로 학습할 수 있는 새로운 방법을 나타냅니다.

**Keywords**: Information networks, Feature learning, Node embeddings, Graph representations.


### 1. INTRODUCTION

Many important tasks in network analysis involve predictions over nodes and edges. In a typical node classification task, we are interested in predicting the most probable labels of nodes in a network [33]. For example, in a social network, we might be interested in predicting interests of users, or in a protein-protein interaction network we might be interested in predicting functional labels of proteins [25, 37]. Similarly, in link prediction, we wish to predict whether a pair of nodes in a network should have an edge connecting them [18]. Link prediction is useful in a wide variety of domains; for instance, in genomics, it helps us discover novel interactions between genes, and in social networks, it can identify real-world friends [2, 34].

Any supervised machine learning algorithm requires a set of informative, discriminating, and independent features. In prediction problems on networks this means that one has to construct a feature vector representation for the nodes and edges. A typical solution involves hand-engineering domain-specific features based on expert knowledge. Even if one discounts the tedious effort required for feature engineering, such features are usually designed for specific tasks and do not generalize across different prediction tasks. An alternative approach is to learn feature representations by solving an optimization problem [4]. The challenge in feature learning is defining an objective function, which involves a trade-off in balancing computational efficiency and predictive accuracy. On one side of the spectrum, one could directly aim to find a feature representation that optimizes performance of a downstream prediction task. While this supervised procedure results in good accuracy, it comes at the cost of high training time complexity due to a blowup in the number of parameters that need to be estimated. At the other extreme, the objective function can be defined to be independent of the downstream prediction task and the representations can be learned in a purely unsupervised way. This makes the optimization computationally efficient and with a carefully designed objective, it results in task-independent features that closely match task-specific approaches in predictive accuracy [21, 23].

> 네트워크 분석의 많은 중요한 작업에는 노드 및 에지에 대한 예측이 포함됩니다. 일반적인 노드 분류 작업에서 우리는 네트워크에서 가장 가능성이 높은 노드 레이블을 예측하는데 관심이 있습니다 [33]. 예를 들어, 소셜 네트워크에서 사용자의 관심사를 예측하거나 단백질-단백질 상호 작용 네트워크에서 단백질의 기능적 라벨을 예측하는데 관심이 있을 수 있습니다 [25, 37]. 마찬가지로 링크 예측에서 우리는 네트워크의 노드 쌍이 이들을 연결하는 에지를 가져야 하는지 여부를 예측하고자 합니다 [18]. 링크 예측은 다양한 영역에서 유용합니다. 예를 들어 유전체학에서는 유전자 간의 새로운 상호 작용을 발견하는데 도움이 되며 소셜 네트워크에서는 실제 친구를 식별할 수 있습니다 [2, 34].
>
> 감독되는 기계 학습 알고리즘에는 정보를 제공하고 차별적이며 독립적인 기능이 필요합니다. 네트워크의 예측 문제에서 이것은 노드와 에지에 대한 특징 벡터 표현을 구성해야 함을 의미합니다. 일반적인 솔루션에는 전문 지식을 기반으로 한 수동 엔지니어링 도메인별 기능이 포함됩니다. 기능 엔지니어링에 필요한 지루한 노력을 줄이더라도 이러한 기능은 일반적으로 특정 작업을 위해 설계되고 다른 예측 작업에서 일반화되지 않습니다. 다른 접근법은 최적화 문제를 해결하여 특징 표현을 배우는 것입니다 [4]. 기능 학습의 과제는 계산 효율성과 예측 정확도의 균형을 맞추는데 있어 절충안을 포함하는 목적 함수를 정의하는 것입니다. 스펙트럼의 한쪽에서는 다운 스트림 예측 작업의 성능을 최적화 하는 기능 표현을 직접 찾는 것을 목표로 할 수 있습니다. 이 감독된 절차는 정확도가 좋지만 추정해야하는 매개 변수의 수가 증가하여 훈련 시간이 복잡해집니다. 다른 극단에서는 목적 함수가 다운 스트림 예측 작업과 독립적으로 정의될 수 있으며 표현은 순전히 감독되지 않은 방식으로 학습될 수 있습니다. 이것은 최적화를 계산적으로 효율적으로 만들고 신중하게 설계된 목표를 통해 예측 정확도에서 작업별 접근 방식과 밀접하게 일치하는 작업 독립적인 기능을 생성합니다 [21, 23].

However, current techniques fail to satisfactorily define and optimize a reasonable objective required for scalable unsupervised feature learning in networks. Classic approaches based on linear and non-linear dimensionality reduction techniques such as Principal Component Analysis, Multi-Dimensional Scaling and their extensions [3, 27, 30, 35] optimize an objective that transforms a representative data matrix of the network such that it maximizes the variance of the data representation. Consequently, these approaches invariably involve eigendecomposition of the appropriate data matrix which is expensive for large real-world networks. Moreover, the resulting latent representations give poor performance on various prediction tasks over networks.

Alternatively, we can design an objective that seeks to preserve local neighborhoods of nodes. The objective can be efficiently optimized using stochastic gradient descent (SGD) akin to backpropogation on just single hidden-layer feedforward neural networks. Recent attempts in this direction [24, 28] propose efficient algorithms but rely on a rigid notion of a network neighborhood, which results in these approaches being largely insensitive to connectivity patterns unique to networks. Specifically, nodes in networks could be organized based on communities they belong to (i.e., homophily); in other cases, the organization could be based on the structural roles of nodes in the network (i.e., structural equivalence) [7, 10, 36]. For instance, in Figure 1, we observe nodes u and s1 belonging to the same tightly knit community of nodes, while the nodes u and s6 in the two distinct communities share the same structural role of a hub node. Real-world networks commonly exhibit a mixture of such equivalences. Thus, it is essential to allow for a flexible algorithm that can learn node representations obeying both principles: ability to learn representations that embed nodes from the same network community closely together, as well as to learn representations where nodes that share similar roles have similar embeddings. This would allow feature learning algorithms to generalize across a wide variety of domains and prediction tasks.

> 그러나 현재 기술은 네트워크에서 확장 가능한 비지도 기능 학습에 필요한 합리적인 목표를 만족스럽게 정의하고 최적화하지 못합니다. Principal Component Analysis, Multi-Dimensional Scaling 및 확장 [3, 27, 30, 35]과 같은 선형 및 비선형 차원 감소 기술을 기반으로 하는 고전적인 접근 방식은 네트워크의 대표적인 데이터 매트릭스를 변환하는 목표를 최적화 합니다. 데이터 표현의 분산. 결과적으로 이러한 접근 방식은 대규모 실제 네트워크에 비용이 많이 드는 적절한 데이터 매트릭스의 고유 분해를 항상 포함합니다. 더욱이 그 결과 잠재된 표현은 네트워크를 통한 다양한 예측 작업에서 성능이 저하됩니다.
>
> 또는 노드의 지역 이웃을 보존하려는 목표를 설계할 수 있습니다. 목표는 단일 은닉 계층 피드 포워드 신경망에서 역전파와 유사한 확률적 경사 하강법(SGD)을 사용하여 효율적으로 최적화 할 수 있습니다. 이 방향의 최근 시도 [24, 28]는 효율적인 알고리즘을 제안하지만 네트워크 이웃의 엄격한 개념에 의존하므로 이러한 접근 방식은 네트워크 고유의 연결 패턴에 크게 민감하지 않습니다. 특히, 네트워크의 노드는 그들이 속한 커뮤니티 (즉, 동성애)를 기반으로 구성될 수 있습니다. 다른 경우에 조직은 네트워크에서 노드의 구조적 역할 (즉, 구조적 동등성)에 기반 할 수 있습니다 [7, 10, 36]. 예를 들어, 그림 1에서 노드 u와 s1은 서로 밀접하게 연결된 노드 커뮤니티에 속하는 반면 두 개의 다른 커뮤니티에 있는 노드 u와 s6은 허브 노드의 동일한 구조적 역할을 공유합니다. 실제 네트워크는 일반적으로 이러한 동등성이 혼합되어 있습니다. 따라서 두 가지 원칙을 준수하는 노드 표현을 학습 할 수 있는 유연한 알고리즘을 허용하는 것이 중요합니다. 동일한 네트워크 커뮤니티의 노드를 밀접하게 포함하는 표현을 학습하는 능력과 유사한 역할을 공유하는 노드가 비슷한 임베딩을 갖는 표현을 학습하는 능력. 이를 통해 기능 학습 알고리즘이 다양한 영역과 예측 작업에서 일반화 할 수 있습니다.

**Present work.**

We propose `node2vec`, a semi-supervised algorithm for scalable feature learning in networks. We optimize a custom graph-based objective function using SGD motivated by prior work on natural language processing [21]. Intuitively, our approach returns feature representations that maximize the likelihood of preserving network neighborhoods of nodes in a d-dimensional feature space. We use a 2nd order random walk approach to generate (sample) network neighborhoods for nodes.

Our key contribution is in defining a flexible notion of a node’s network neighborhood. By choosing an appropriate notion of a neighborhood, `node2vec` can learn representations that organize nodes based on their network roles and/or communities they belong to. We achieve this by developing a family of biased random walks, which efficiently explore diverse neighborhoods of a given node. The resulting algorithm is flexible, giving us control over the search space through tunable parameters, in contrast to rigid search procedures in prior work [24, 28]. Consequently, our method generalizes prior work and can model the full spectrum of equivalences observed in networks. The parameters governing our search strategy have an intuitive interpretation and bias the walk towards different network exploration strategies. These parameters can also be learned directly using a tiny fraction of labeled data in a semisupervised fashion.

> 우리는 네트워크에서 확장 가능한 특징 학습을 위한 준지도 알고리즘인 `node2vec`를 제안합니다. 자연어 처리에 대한 사전 작업에 의해 동기를 부여받은 SGD를 사용하여 맞춤형 그래프 기반 목적 함수를 최적화합니다 [21]. 직관적으로 우리의 접근 방식은 d 차원 기능 공간에서 노드의 네트워크 이웃을 보존할 가능성을 최대화 하는 기능 표현을 반환합니다. 2 차 랜덤 워크 접근 방식을 사용하여 노드에 대한 네트워크 이웃을 생성합니다 (샘플).
>
> 우리의 주요 기여는 노드의 네트워크 이웃에 대한 유연한 개념을 정의하는 것입니다. 이웃에 대한 적절한 개념을 선택함으로써 `node2vec`은 네트워크 역할 및 또는 속한 커뮤니티를 기반으로 노드를 구성하는 표현을 학습할 수 있습니다. 우리는 주어진 노드의 다양한 이웃을 효율적으로 탐색하는 편향된 랜덤 워크 패밀리를 개발하여 이를 달성합니다. 결과 알고리즘은 유연하여 이전 작업의 엄격한 검색 절차와 달리 조정 가능한 매개 변수를 통해 검색 공간을 제어 할 수 있습니다 [24, 28]. 결과적으로 우리의 방법은 이전 작업을 일반화하고 네트워크에서 관찰되는 전체 스펙트럼을 모델링 할 수 있습니다. 검색 전략을 관리하는 매개 변수는 직관적 인 해석을 가지고 있으며 다른 네트워크 탐색 전략을 향한 걸음을 편향시킵니다. 이러한 매개 변수는 반지도 방식으로 레이블이 지정된 데이터의 극히 일부를 사용하여 직접 학습할 수도 있습니다.

We also show how feature representations of individual nodes can be extended to pairs of nodes (i.e., edges). In order to generate feature representations of edges, we compose the learned feature representations of the individual nodes using simple binary operators. This compositionality lends `node2vec` to prediction tasks involving nodes as well as edges.

Our experiments focus on two common prediction tasks in networks: a multi-label classification task, where every node is assigned one or more class labels and a link prediction task, where we predict the existence of an edge given a pair of nodes. We contrast the performance of `node2vec` with state-of-the-art feature learning algorithms [24, 28]. We experiment with several real-world networks from diverse domains, such as social networks, information networks, as well as networks from systems biology. Experiments demonstrate that `node2vec` outperforms state-of-the-art methods by up to 26.7% on multi-label classification and up to 12.6% on link prediction. The algorithm shows competitive performance with even 10% labeled data and is also robust to perturbations in the form of noisy or missing edges. Computationally, the major phases of `node2vec` are trivially parallelizable, and it can scale to large networks with millions of nodes in a few hours.

> 또한 개별 노드의 기능 표현이 노드 쌍 (예 : 에지)으로 확장되는 방법도 보여줍니다. 에지의 특징 표현을 생성하기 위해 간단한 이항 연산자를 사용하여 개별 노드의 학습된 특징 표현을 구성합니다. 이 구성성은 `node2vec`를 노드와 에지를 포함하는 예측 작업에 적합하게 합니다.
>
> 우리의 실험은 네트워크의 두 가지 일반적인 예측 작업, 즉 모든 노드에 하나 이상의 클래스 레이블이 할당되는 다중 레이블 분류 작업과 노드 쌍이 주어진 에지의 존재를 예측하는 링크 예측 작업에 중점을 둡니다. 우리는 `node2vec`의 성능과 최첨단 기능 학습 알고리즘을 대조합니다 [24, 28]. 우리는 소셜 네트워크, 정보 네트워크 및 시스템 생물학의 네트워크와 같은 다양한 도메인의 여러 실제 네트워크를 실험합니다. 실험에 따르면 `node2vec`은 다중 레이블 분류에서 최대 26.7 %, 링크 예측에서 최대 12.6 %까지 최첨단 방법을 능가합니다. 이 알고리즘은 레이블이 10% 인 데이터로도 경쟁력 있는 성능을 보여 주며 노이즈가 있거나 누락된 에지 형태의 섭동에도 견고합니다. 계산적으로 `node2vec`의 주요 단계는 간단하게 병렬화 할 수 있으며 몇 시간 내에 수백만 개의 노드가 있는 대규모 네트워크로 확장할 수 있습니다.

Overall our paper makes the following contributions:

1. We propose `node2vec`, an efficient scalable algorithm for feature learning in networks that efficiently optimizes a novel network-aware, neighborhood preserving objective using SGD.
2. We show how `node2vec` is in accordance with established principles in network science, providing flexibility in discovering representations conforming to different equivalences.
3. We extend `node2vec` and other feature learning methods based on neighborhood preserving objectives, from nodes to pairs of nodes for edge-based prediction tasks.
4. We empirically evaluate `node2vec` for multi-label classification and link prediction on several real-world datasets.

> 1. SGD를 사용하여 새로운 네트워크 인식, 이웃 보존 목표를 효율적으로 최적화하는 네트워크에서 기능 학습을위한 효율적인 확장 가능한 알고리즘 `node2vec`를 제안합니다.<br>
> 2. 우리는 `node2vec`이 네트워크 과학에서 확립된 원칙에 따라 어떻게 다른 동등성을 따르는 표현을 발견하는 데 유연성을 제공하는지 보여줍니다.<br>
> 3. 노드에서 에지 기반 예측 작업을 위한 노드 쌍으로 이웃 보존 목표를 기반으로 `node2vec` 및 기타 특징 학습 방법을 확장합니다.<br>
> 4. 우리는 여러 실제 데이터 세트에 대한 다중 레이블 분류 및 링크 예측을 위해 `node2vec`를 경험적으로 평가합니다.<br>

The rest of the paper is structured as follows. In Section 2, we briefly survey related work in feature learning for networks. We present the technical details for feature learning using `node2vec` in Section 3. In Section 4, we empirically evaluate `node2vec` on prediction tasks over nodes and edges on various real-world networks and assess the parameter sensitivity, perturbation analysis, and scalability aspects of our algorithm. We conclude with a discussion of the `node2vec` framework and highlight some promising directions for future work in Section 5. Datasets and a reference implementation of `node2vec` are available on the project page: http://snap.stanford.edu/`node2vec`.

> 나머지 논문은 다음과 같이 구성됩니다. 섹션 2에서는 네트워크 기능 학습과 관련된 작업을 간략하게 조사합니다. 섹션 3에서는 `node2vec`를 사용한 기능 학습에 대한 기술적 세부 사항을 제시합니다. 섹션 4에서는 다양한 실제 네트워크의 노드 및 에지에 대한 예측 작업에 대한 `node2vec`을 경험적으로 평가하고 알고리즘의 매개 변수 민감도, 섭동 분석 및 확장성 측면을 평가합니다. `node2vec` 프레임 워크에 대한 논의로 마무리하고 섹션 5에서 향후 작업에 대한 몇 가지 유망한 방향을 강조합니다. 데이터 세트 및 `node2vec`의 참조 구현은 프로젝트 페이지 http://snap.stanford.edu/`node2vec` 에서 사용할 수 있습니다.


### 2. RELATED WORK

Feature engineering has been extensively studied by the machine learning community under various headings. In networks, the conventional paradigm for generating features for nodes is based on feature extraction techniques which typically involve some seed hand-crafted features based on network properties [8, 11]. In contrast, our goal is to automate the whole process by casting feature extraction as a representation learning problem in which case we do not require any hand-engineered features.

Unsupervised feature learning approaches typically exploit the spectral properties of various matrix representations of graphs, especially the Laplacian and the adjacency matrices. Under this linear algebra perspective, these methods can be viewed as dimensionality reduction techniques. Several linear (e.g., PCA) and non-linear (e.g., IsoMap) dimensionality reduction techniques have been proposed [3, 27, 30, 35]. These methods suffer from both computational and statistical performance drawbacks. In terms of computational efficiency, eigendecomposition of a data matrix is expensive unless the solution quality is significantly compromised with approximations, and hence, these methods are hard to scale to large networks. Secondly, these methods optimize for objectives that are not robust to the diverse patterns observed in networks (such as homophily and structural equivalence) and make assumptions about the relationship between the underlying network structure and the prediction task. For instance, spectral clustering makes a strong homophily assumption that graph cuts will be useful for classification [29]. Such assumptions are reasonable in many scenarios, but unsatisfactory in effectively generalizing across diverse networks.

> 기능 엔지니어링은 다양한 제목으로 머신 러닝 커뮤니티에서 광범위하게 연구되었습니다. 네트워크에서 노드에 대한 기능을 생성하는 기존 패러다임은 일반적으로 네트워크 속성을 기반으로하여 몇 가지 시드 수작업 기능을 포함하는 기능 추출 기술을 기반으로 합니다 [8, 11]. 반대로, 우리의 목표는 특성 추출을 표현 학습 문제로 캐스팅하여 전체 프로세스를 자동화하는 것입니다. 이 경우 수작업으로 설계된 기능이 필요하지 않습니다.
>
> 비지도 기능 학습 접근 방식은 일반적으로 그래프의 다양한 매트릭스 표현, 특히 라플라시안 및 인접 매트릭스의 스펙트럼 속성을 활용합니다. 이 선형 대수 관점에서 이러한 방법은 차원 감소 기술로 볼 수 있습니다. 몇 가지 선형 (예 : PCA) 및 비선형 (예 : IsoMap) 차원 감소 기술이 제안되었습니다 [3, 27, 30, 35]. 이러한 방법은 계산 및 통계 성능 단점을 모두 가지고 있습니다. 계산 효율성 측면에서 데이터 매트릭스의 고유 분해는 솔루션 품질이 근사치로 크게 손상되지 않는 한 비용이 많이 들고 따라서 이러한 방법은 대규모 네트워크로 확장하기 어렵습니다. 둘째, 이러한 방법은 네트워크에서 관찰되는 다양한 패턴 (예 : 동질성 및 구조적 동등성)에 견고하지 않은 목표에 대해 최적화하고 기본 네트워크 구조와 예측 작업 간의 관계에 대해 가정합니다. 예를 들어, 스펙트럼 클러스터링은 그래프 컷이 분류에 유용할 것이라는 강력한 동종성 가정을 만듭니다 [29]. 이러한 가정은 많은 시나리오에서 합리적이지만 다양한 네트워크에서 효과적으로 일반화 하는데 만족스럽지 않습니다.

Recent advancements in representational learning for natural language processing opened new ways for feature learning of discrete objects such as words. In particular, the Skip-gram model [21] aims to learn continuous feature representations for words by optimizing a neighborhood preserving likelihood objective. The algorithm proceeds as follows: It scans over the words of a document, and for every word it aims to embed it such that the word’s features can predict nearby words (i.e., words inside some context window). The word feature representations are learned by optmizing the likelihood objective using SGD with negative sampling [22]. The Skip-gram objective is based on the distributional hypothesis which states that words in similar contexts tend to have similar meanings [9]. That is, similar words tend to appear in similar word neighborhoods.

Inspired by the Skip-gram model, recent research established an analogy for networks by representing a network as a “document” [24, 28]. The same way as a document is an ordered sequence of words, one could sample sequences of nodes from the underlying network and turn a network into a ordered sequence of nodes. However, there are many possible sampling strategies for nodes, resulting in different learned feature representations. In fact, as we shall show, there is no clear winning sampling strategy that works across all networks and all prediction tasks. This is a major shortcoming of prior work which fail to offer any flexibility in sampling of nodes from a network [24, 28]. Our algorithm `node2vec` overcomes this limitation by designing a flexible objective that is not tied to a particular sampling strategy and provides parameters to tune the explored search space (see Section 3).

> 자연어 처리를 위한 표현 학습의 최근 발전은 단어와 같은 개별 객체의 특징 학습을 위한 새로운 방법을 열었습니다. 특히, Skip-gram 모델 [21]은 가능성 목표를 보존하는 이웃을 최적화 하여 단어에 대한 연속적인 특징 표현을 학습하는 것을 목표로합니다. 알고리즘은 다음과 같이 진행됩니다. 문서의 단어를 스캔하고 모든 단어에 대해 단어의 특징이 근처 단어 (예 : 컨텍스트 창 내부의 단어)를 예측할 수 있도록 포함하는 것을 목표로 합니다. 단어 특징 표현은 음의 샘플링과 함께 SGD를 사용하여 우도 목표를 최적화하여 학습됩니다 [22]. Skip-gram 목표는 유사한 문맥의 단어가 유사한 의미를 갖는 경향이 있다는 분포 가설에 기반합니다 [9]. 즉, 유사한 단어가 유사한 단어 이웃에 나타나는 경향이 있습니다.
>
> Skip-gram 모델에서 영감을 얻은 최근 연구는 네트워크를 “문서”로 표현함으로써 네트워크에 대한 비유를 확립했습니다 [24, 28]. 문서가 정렬 된 단어 시퀀스와 같은 방식으로 기본 네트워크에서 노드 시퀀스를 샘플링하여 네트워크를 정렬된 노드 시퀀스로 바꿀 수 있습니다. 그러나 노드에 대해 가능한 많은 샘플링 전략이 있으므로 학습된 기능 표현이 다릅니다. 사실, 우리가 보여줄 것처럼 모든 네트워크와 모든 예측 작업에서 작동하는 확실한 승리 샘플링 전략은 없습니다. 이것은 네트워크에서 노드를 샘플링 할 때 유연성을 제공하지 못하는 이전 작업의 주요 단점입니다 [24, 28]. 우리의 알고리즘 `node2vec`는 특정 샘플링 전략에 묶이지 않고 탐색된 검색 공간을 조정하기 위한 매개 변수를 제공하는 유연한 목표를 설계하여 이러한 한계를 극복합니다 (섹션 3 참조).

Finally, for both node and edge based prediction tasks, there is a body of recent work for supervised feature learning based on existing and novel graph-specific deep network architectures [15, 16, 17, 31, 39]. These architectures directly minimize the loss function for a downstream prediction task using several layers of non-linear transformations which results in high accuracy, but at the cost of scalability due to high training time requirements.

> 마지막으로, 노드 및 에지 기반 예측 작업 모두에 대해 기존 및 새로운 그래프 별 딥 네트워크 아키텍처를 기반으로하는 감독 기능 학습에 대한 최근 작업이 있습니다 [15, 16, 17, 31, 39]. 이러한 아키텍처는 여러 계층의 비선형 변환을 사용하여 다운 스트림 예측 작업에 대한 손실 함수를 직접 최소화하므로 높은 정확도를 제공하지만 높은 교육 시간 요구 사항으로 인해 확장성이 떨어집니다.


### 3. FEATURE LEARNING FRAMEWORK
We formulate feature learning in networks as a maximum likelihood optimization problem. Let G = (V, E) be a given network. Our analysis is general and applies to any (un)directed, (un)weighted network. Let f : V → Rd be the mapping function from nodes to feature representaions we aim to learn for a downstream prediction task. Here d is a parameter specifying the number of dimensions of our feature representation. Equivalently, f is a matrix of size |V | × d parameters. For every source node u ∈ V , we define NS(u) ⊂ V as a network neighborhood of node u generated through a neighborhood sampling strategy S.

We proceed by extending the Skip-gram architecture to networks [21, 24]. We seek to optimize the following objective function, which maximizes the log-probability of observing a network neighborhood NS(u) for a node u conditioned on its feature representation, given by f:

In order to make the optimization problem tractable, we make two standard assumptions:

> 네트워크에서 특징 학습을 최대 가능성 최적화 문제로 공식화합니다.
> G = (V, E)가 주어진 네트워크라고합시다. 우리의 분석은 일반적이며 모든 (무) 지향, (무) 가중 네트워크에 적용됩니다. f : V → Rd를 노드에서 특징 표현으로의 매핑 함수로 삼아 다운 스트림 예측 작업을 위해 학습합니다. 여기서 d는 피쳐 표현의 차원 수를 지정하는 매개 변수입니다. 마찬가지로 f는 크기 | V | × d 매개 변수. 모든 소스 노드 u ∈ V에 대해 NS (u) ⊂ V를 이웃 샘플링 전략 S를 통해 생성된 노드 u의 네트워크 이웃으로 정의합니다.
>
> Skip-gram 아키텍처를 네트워크로 확장하여 진행합니다 [21, 24]. 우리는 f에 의해 주어진 기능 표현에 조건이 지정된 노드 u에 대해 네트워크 이웃 NS (u)를 관찰하는 로그 확률을 최대화하는 다음 목적 함수를 최적화 하려고 합니다.
>
> 최적화 문제를 다루기 쉽게 만들기 위해 두 가지 표준 가정을합니다.

• Conditional independence.

We factorize the likelihood by assuming that the likelihood of observing a neighborhood node is independent of observing any other neighborhood node given the feature representation of the source:

• Symmetry in feature space.

A source node and neighborhood node have a symmetric effect over each other in feature space. Accordingly, we model the conditional likelihood of every source-neighborhood node pair as a softmax unit parametrized by a dot product of their features:

> • 조건부 독립.
>
> 우리는 이웃 노드를 관찰 할 가능성이 소스의 특징 표현이 주어졌을 때 다른 이웃 노드를 관찰하는 것과 무관하다고 가정하여 가능성을 분해합니다.
>
> • 피쳐 공간의 대칭.
>
> 소스 노드와 인접 노드는 피쳐 공간에서 서로 대칭 효과를 갖습니다. 따라서 우리는 모든 소스-이웃 노드 쌍의 조건부 우도를 해당 기능의 내적에 의해 매개 변수화 된 소프트 맥스 단위로 모델링합니다.

With the above assumptions, the objective in Eq. 1 simplifies to:

The per-node partition function, Zu = Pv ∈ V exp(f(u) · f(v)), is expensive to compute for large networks and we approximate it using negative sampling [22]. We optimize Eq. 2 using stochastic gradient ascent over the model parameters defining the features f.

Feature learning methods based on the Skip-gram architecture have been originally developed in the context of natural language [21]. Given the linear nature of text, the notion of a neighborhood can be naturally defined using a sliding window over consecutive words. Networks, however, are not linear, and thus a richer notion of a neighborhood is needed. To resolve this issue, we propose a randomized procedure that samples many different neighborhoods of a given source node u. The neighborhoods NS(u) are not restricted to just immediate neighbors but can have vastly different structures depending on the sampling strategy S.

> 노드 별 파티션 함수 Zu = Pv ∈ V exp (f (u) · f (v))는 대규모 네트워크에 대해 계산하는 데 비용이 많이 들고 음수 샘플링을 사용하여 근사합니다 [22]. Eq를 최적화합니다. 2 특징을 정의하는 모델 매개 변수에 대한 확률적 기울기 상승 사용 f.
>
> Skip-gram 아키텍처에 기반한 특징 학습 방법은 원래 자연어의 맥락에서 개발되었습니다 [21]. 텍스트의 선형 특성을 감안할 때 이웃의 개념은 연속된 단어에 대한 슬라이딩 창을 사용하여 자연스럽게 정의될 수 있습니다. 그러나 네트워크는 선형이 아니므로 더 풍부한 이웃 개념이 필요합니다. 이 문제를 해결하기 위해 주어진 소스 노드 u의 다양한 이웃을 샘플링 하는 무작위 절차를 제안합니다. 이웃 NS(u)는 인접 이웃에만 국한되지 않고 샘플링 전략 S에 따라 매우 다른 구조를 가질 수 있습니다.


#### 3.1 Classic search strategies

We view the problem of sampling neighborhoods of a source node as a form of local search. Figure 1 shows a graph, where given a source node u we aim to generate (sample) its neighborhood NS(u). Importantly, to be able to fairly compare different sampling strategies S, we shall constrain the size of the neighborhood set NS to k nodes and then sample multiple sets for a single node u. Generally, there are two extreme sampling strategies for generating neighborhood set(s) NS of k nodes:

> 우리는 소스 노드의 이웃을 샘플링하는 문제를 지역 검색의 한 형태로 봅니다. 그림 1은 소스 노드 u가 주어진 경우 이웃 NS (u)를 생성 (샘플)하려는 그래프를 보여줍니다. 중요한 것은 서로 다른 샘플링 전략 S를 공정하게 비교할 수 있도록 이웃 집합 NS의 크기를 k 노드로 제한한 다음 단일 노드 u에 대해 여러 집합을 샘플링해야 한다는 것입니다. 일반적으로 k 노드의 인접 세트 NS를 생성하기위한 두 가지 극단적인 샘플링 전략이 있습니다.

![Fig.1](/2020/12/node2vec_fig01.png)


• Breadth-first Sampling (BFS)

The neighborhood NS is restricted to nodes which are immediate neighbors of the source. For example, in Figure 1 for a neighborhood of size k = 3, BFS samples nodes s1, s2, s3.

• Depth-first Sampling (DFS)

The neighborhood consists of nodes sequentially sampled at increasing distances from the source node. In Figure 1, DFS samples s4, s5, s6.

The breadth-first and depth-first sampling represent extreme scenarios in terms of the search space they explore leading to interesting implications on the learned representations.

> • 너비 우선 샘플링 (BFS)
>
> 이웃 NS는 소스의 바로 이웃 노드로 제한됩니다. 예를 들어, 크기 k = 3 인 이웃에 대해 그림 1에서 BFS는 노드 s1, s2, s3을 샘플링합니다.
>
> • 깊이 우선 샘플링 (DFS)
>
> 이웃은 소스 노드에서 멀어지는 거리에서 순차적으로 샘플링 된 노드로 구성됩니다. 그림 1에서 DFS는 s4, s5, s6을 샘플링합니다.
>
> 너비 우선 및 깊이 우선 샘플링은 탐색하는 검색 공간 측면에서 극단적인 시나리오를 나타내며 학습된 표현에 흥미로운 영향을 미칩니다.

In particular, prediction tasks on nodes in networks often shuttle between two kinds of similarities: homophily and structural equivalence [12]. Under the homophily hypothesis [7, 36] nodes that are highly interconnected and belong to similar network clusters or communities should be embedded closely together (e.g., nodes s1 and u in Figure 1 belong to the same network community). In contrast, under the structural equivalence hypothesis [10] nodes that have similar structural roles in networks should be embedded closely together (e.g., nodes u and s6 in Figure 1 act as hubs of their corresponding communities). Importantly, unlike homophily, structural equivalence does not emphasize connectivity; nodes could be far apart in the network and still have the same structural role. In real-world, these equivalence notions are not exclusive; networks commonly exhibit both behaviors where some nodes exhibit homophily while others reflect structural equivalence.

We observe that BFS and DFS strategies play a key role in producing representations that reflect either of the above equivalences. In particular, the neighborhoods sampled by BFS lead to embeddings that correspond closely to structural equivalence. Intuitively, we note that in order to ascertain structural equivalence, it is often sufficient to characterize the local neighborhoods accurately. For example, structural equivalence based on network roles such as bridges and hubs can be inferred just by observing the immediate neighborhoods of each node. By restricting search to nearby nodes, BFS achieves this characterization and obtains a microscopic view of the neighborhood of every node. Additionally, in BFS, nodes in the sampled neighborhoods tend to repeat many times. This is also important as it reduces the variance in characterizing the distribution of 1-hop nodes with respect the source node. However, a very small portion of the graph is explored for any given k.

The opposite is true for DFS which can explore larger parts of the network as it can move further away from the source node u (with sample size k being fixed). In DFS, the sampled nodes more accurately reflect a macro-view of the neighborhood which is essential in inferring communities based on homophily. However, the issue with DFS is that it is important to not only infer which node-to-node dependencies exist in a network, but also to characterize the exact nature of these dependencies. This is hard given we have a constrain on the sample size and a large neighborhood to explore, resulting in high variance. Secondly, moving to much greater depths leads to complex dependencies since a sampled node may be far from the source and potentially less representative.

> 특히, 네트워크의 노드에 대한 예측 작업은 종종 두 종류의 유사성, 즉 동질성과 구조적 동등성 사이를 왕복합니다 [12]. 동성애 가설 [7, 36]에 따라 매우 상호 연결되어 있고 유사한 네트워크 클러스터 또는 커뮤니티에 속하는 노드는 서로 밀접하게 포함되어야 합니다 (예 : 그림 1의 노드 s1 및 u는 동일한 네트워크 커뮤니티에 속함). 반대로, 구조적 동등성 가설 [10] 하에서 네트워크에서 유사한 구조적 역할을 가진 노드는 밀접하게 함께 포함되어야 합니다 (예 : 그림 1의 노드 u와 s6는 해당 커뮤니티의 허브 역할을 합니다). 중요한 것은 동성애와 달리 구조적 동등성이 연결성을 강조하지 않는다는 것입니다. 노드는 네트워크에서 멀리 떨어져 있어도 동일한 구조적 역할을 가질 수 있습니다. 실제 세계에서 이러한 동등성 개념은 배타적이지 않습니다. 네트워크는 일반적으로 일부 노드가 동질성을 나타내는 반면 다른 노드는 구조적 동등성을 반영하는 두 동작을 모두 나타냅니다.
>
> 우리는 BFS 및 DFS 전략이 위의 동등성 중 하나를 반영하는 표현을 생성하는 데 중요한 역할을 한다는 것을 관찰합니다. 특히, BFS에 의해 샘플링 된 이웃은 구조적 동등성과 밀접하게 일치하는 임베딩으로 이어집니다. 직관적으로 우리는 구조적 동등성을 확인하기 위해 종종 지역 이웃을 정확하게 특성화하는 것으로 충분합니다. 예를 들어 브리지 및 허브와 같은 네트워크 역할에 기반한 구조적 동등성은 각 노드의 인접 이웃을 관찰하는 것만으로도 추론할 수 있습니다. 검색을 근처 노드로 제한함으로써 BFS는 이 특성화를 달성하고 모든 노드의 인접에 대한 미세한 보기를 얻습니다. 또한 BFS에서 샘플링 된 이웃의 노드는 여러 번 반복되는 경향이 있습니다. 이는 소스 노드와 관련하여 1-홉 노드의 분포를 특성화하는데 있어 분산을 줄이기 때문에 중요합니다. 그러나 주어진 k에 대해 그래프의 아주 작은 부분을 탐색합니다.
>
> 소스 노드 u (샘플 크기 k가 고정됨)에서 더 멀리 이동할 수 있으므로 네트워크의 더 큰 부분을 탐색 할 수 있는 DFS의 경우 그 반대입니다. DFS에서 샘플링 된 노드는 동성애를 기반으로 커뮤니티를 추론하는데 필수적인 이웃의 거시적 관점을보다 정확하게 반영합니다. 그러나 DFS의 문제는 네트워크에 존재하는 노드 간 종속성을 추론할 뿐만 아니라 이러한 종속성의 정확한 특성을 파악하는 것도 중요하다는 것입니다. 표본 크기에 제약이 있고 탐색할 큰 이웃이 있어 분산이 높기 때문에 이는 어렵습니다. 둘째, 훨씬 더 깊은 곳으로 이동하면 샘플링 된 노드가 소스에서 멀리 떨어져 잠재적으로 덜 대표적일 수 있으므로 복잡한 종속성이 발생합니다.


#### 3.2 `node2vec`

Building on the above observations, we design a flexible neighborhood sampling strategy which allows us to smoothly interpolate between BFS and DFS. We achieve this by developing a flexible biased random walk procedure that can explore neighborhoods in a BFS as well as DFS fashion.

> 위의 관찰을 바탕으로 BFS와 DFS 사이를 부드럽게 보간할 수 있는 유연한 이웃 샘플링 전략을 설계합니다. 우리는 BFS 및 DFS 방식으로 이웃을 탐색할 수 있는 유연한 편향 무작위 걷기 절차를 개발하여 이를 달성합니다.


##### 3.2.1 Random Walks

Formally, given a source node u, we simulate a random walk of fixed length l. Let ci denote the ith node in the walk, starting with c0 = u. Nodes ci are generated by the following distribution:

where πvx is the unnormalized transition probability between nodes v and x, and Z is the normalizing constant.

> 공식적으로 소스 노드 u가 주어지면 고정 길이 l의 임의 걷기를 시뮬레이션 합니다. ci는 c0 = u로 시작하여 걷기의 i 번째 노드를 나타냅니다. 노드 ci는 다음 배포에 의해 생성됩니다.
>
> 여기서 πvx는 노드 v와 x 사이의 정규화되지 않은 전이 확률이고 Z는 정규화 상수입니다.


##### 3.2.2 Search bias α

The simplest way to bias our random walks would be to sample the next node based on the static edge weights wvx i.e., πvx = wvx. (In case of unweighted graphs wvx = 1.) However, this does not allow us to account for the network structure and guide our search procedure to explore different types of network neighborhoods. Additionally, unlike BFS and DFS which are extreme sampling paradigms suited for structural equivalence and homophily respectively, our random walks should accommodate for the fact that these notions of equivalence are not competing or exclusive, and real-world networks commonly exhibit a mixture of both.

We define a 2nd order random walk with two parameters p and q which guide the walk: Consider a random walk that just traversed edge (t, v) and now resides at node v (Figure 2). The walk now needs to decide on the next step so it evaluates the transition probabilities πvx on edges (v, x) leading from v. We set the unnormalized transition probability to πvx = αpq(t, x) · wvx, where and dtx denotes the shortest path distance between nodes t and x. Note that dtx must be one of {0, 1, 2}, and hence, the two parameters are necessary and sufficient to guide the walk.

Intuitively, parameters p and q control how fast the walk explores and leaves the neighborhood of starting node u. In particular, the parameters allow our search procedure to (approximately) interpolate between BFS and DFS and thereby reflect an affinity for different notions of node equivalences.

> 랜덤 워크를 바이어스하는 가장 간단한 방법은 정적 에지 가중치 wvx, 즉 πvx = wvx를 기반으로 다음 노드를 샘플링하는 것입니다. (가중되지 않은 그래프 wvx = 1의 경우) 그러나 이것은 우리가 네트워크 구조를 설명하고 다른 유형의 네트워크 이웃을 탐색하기 위한 검색 절차를 안내하는 것을 허용하지 않습니다. 또한, 각각 구조적 동등성 및 동종성에 적합한 극단적인 샘플링 패러다임 인 BFS 및 DFS와는 달리, 랜덤 워크는 이러한 동등성 개념이 경쟁적이거나 배타적이지 않으며 실제 네트워크는 일반적으로 두 가지가 혼합되어 있다는 사실을 수용해야 합니다.
>
> 걷기를 안내하는 두 개의 매개 변수 p와 q를 사용하여 2 차 무작위 걷기를 정의합니다. 가장자리 (t, v)를 가로 지르고 이제 노드 v에 상주하는 무작위 걷기를 고려합니다 (그림 2). 걷기는 이제 다음 단계를 결정하여 v에서 이어지는 가장자리 (v, x)에서 전이 확률 πvx를 평가해야합니다. 비정규화 전이 확률을 πvx = αpq (t, x) · wvx로 설정합니다. 여기서 및 dtx는 다음을 나타냅니다. 노드 t와 x 사이의 최단 경로 거리. dtx는 {0, 1, 2} 중 하나여야 하므로 두 매개 변수가 필요하고 걷기를 안내하기에 충분합니다.
>
> 직관적으로 매개 변수 p와 q는 걷기가 시작 노드 u 주변을 탐색하고 떠나는 속도를 제어합니다. 특히, 매개 변수는 우리의 검색 절차가 BFS와 DFS 사이를 (대략) 보간 할 수 있게 하여 노드 동등성에 대한 서로 다른 개념에 대한 선호도를 반영합니다.

![Fig.2](/2020/12/node2vec_fig02.png)


**Return parameter, p.**

Parameter p controls the likelihood of immediately revisiting a node in the walk. Setting it to a high value (> max(q, 1)) ensures that we are less likely to sample an alreadyvisited node in the following two steps (unless the next node in the walk had no other neighbor). This strategy encourages moderate exploration and avoids 2-hop redundancy in sampling. On the other hand, if p is low (< min(q, 1)), it would lead the walk to backtrack a step (Figure 2) and this would keep the walk “local” close to the starting node u.

> 매개 변수 p는 걷기에서 노드를 즉시 다시 방문할 가능성을 제어합니다. 높은 값 (max (q, 1))으로 설정하면 다음 두 단계에서 이미 방문한 노드를 샘플링 할 가능성이 줄어 듭니다 (워크의 다음 노드에 다른 이웃이 없는 경우). 이 전략은 적절한 탐색을 장려하고 샘플링에서 2홉 중복을 방지합니다. 반면에 p가 낮 으면 (min (q, 1)), 걷기가 한 단계를 역추적하도록 유도하고 (그림 2) 걷기가 시작 노드 u에 가깝게 “로컬” 상태로 유지됩니다.

**In-out parameter, q.**

Parameter q allows the search to differentiate between “inward” and “outward” nodes. Going back to Figure 2, if q > 1, the random walk is biased towards nodes close to node t. Such walks obtain a local view of the underlying graph with respect to the start node in the walk and approximate BFS behavior in the sense that our samples comprise of nodes within a small locality.

In contrast, if q < 1, the walk is more inclined to visit nodes which are further away from the node t. Such behavior is reflective of DFS which encourages outward exploration. However, an essential difference here is that we achieve DFS-like exploration within the random walk framework. Hence, the sampled nodes are not at strictly increasing distances from a given source node u, but in turn, we benefit from tractable preprocessing and superior sampling efficiency of random walks. Note that by setting πv,x to be a function of the preceeding node in the walk t, the random walks are 2nd order Markovian.

> 매개 변수 q를 사용하면 검색에서 “내부”노드와 “외부”노드를 구분할 수 있습니다. 그림 2로 돌아가서 q > 1 이면 랜덤 워크는 노드 t에 가까운 노드쪽으로 편향됩니다. 이러한 걷기는 걷기의 시작 노드에 대한 기본 그래프의 로컬 뷰를 얻고 샘플이 작은 지역 내의 노드로 구성된다는 의미에서 BFS 동작을 근사합니다.
>
> 대조적으로, q < 1 이면 걷기는 노드 t에서 더 먼 노드를 방문하는 경향이 있습니다. 이러한 행동은 외부 탐색을 장려하는 DFS를 반영합니다. 그러나 여기서 중요한 차이점은 랜덤 워크 프레임워크 내에서 DFS와 같은 탐색을 달성한다는 것입니다. 따라서 샘플링 된 노드는 주어진 소스 노드 u에서 엄격하게 증가하는 거리에 있지 않지만, 우리는 다루기 쉬운 전처리와 랜덤 워크의 우수한 샘플링 효율성의 이점을 얻습니다. πv, x를 워크 t에서 선행 노드의 함수로 설정하면 랜덤 워크는 2 차 마르코 비안이됩니다.

**Benefits of random walks.**<br>
There are several benefits of random walks over pure BFS/DFS approaches. Random walks are computationally efficient in terms of both space and time requirements. The space complexity to store the immediate neighbors of every node in the graph is O(|E|). For 2nd order random walks, it is helpful to store the interconnections between the neighbors of every node, which incurs a space complexity of O(a2 |V|) where a is the average degree of the graph and is usually small for realworld networks. The other key advantage of random walks over classic search-based sampling strategies is its time complexity. In particular, by imposing graph connectivity in the sample generation process, random walks provide a convenient mechanism to increase the effective sampling rate by reusing samples across different source nodes. By simulating a random walk of length l > k we can generate k samples for l − k nodes at once due to the Markovian nature of the random walk. Hence, our effective complexity is Olk(l−k) per sample. For example, in Figure 1 we sample a random walk {u, s4, s5, s6, s8, s9} of length l = 6, which results in NS(u) = {s4, s5, s6}, NS(s4) = {s5, s6, s8} and NS(s5) = {s6, s8, s9}. Note that sample reuse can introduce some bias in the overall procedure. However, we observe that it greatly improves the efficiency.

> 순수 BFS / DFS 접근 방식에 비해 랜덤 워크의 몇 가지 이점이 있습니다.
> 랜덤 워크는 공간 및 시간 요구 사항 측면에서 계산적으로 효율적입니다. 그래프에서 모든 노드의 인접 인접 항목을 저장하는 공간 복잡도는 O (| E |)입니다. 2 차 랜덤 워크의 경우 모든 노드의 이웃 사이의 상호 연결을 저장하는 것이 도움이됩니다. 이로 인해 공간 복잡도가 O (a2 | V |) 발생합니다. 여기서 a는 그래프의 평균 정도이고 실제 네트워크에서는 일반적으로 작습니다. 기존 검색 기반 샘플링 전략에 비해 랜덤 워크의 또 다른 주요 이점은 시간 복잡성입니다. 특히, 샘플 생성 프로세스에 그래프 연결을 적용함으로써 랜덤 워크는 여러 소스 노드에서 샘플을 재사용하여 효과적인 샘플링 속도를 높이는 편리한 메커니즘을 제공합니다. 길이가 l> k 인 랜덤 워크를 시뮬레이션함으로써 랜덤 워크의 마르코 비안 특성으로 인해 l − k 노드에 대한 k 샘플을 한 번에 생성 할 수 있습니다. 따라서 우리의 효과적인 복잡성은 샘플 당 Olk (l-k)입니다. 예를 들어, 그림 1에서 길이 l = 6의 랜덤 걷기 {u, s4, s5, s6, s8, s9}를 샘플링하여 NS (u) = {s4, s5, s6}, NS (s4)가됩니다. = {s5, s6, s8} 및 NS (s5) = {s6, ​​s8, s9}. 샘플 재사용은 전체 절차에 약간의 편향을 일으킬 수 있습니다. 그러나 효율성이 크게 향상되는 것으로 나타났습니다.


##### 3.2.3 The `node2vec` algorithm

The pseudocode for `node2vec`, is given in Algorithm 1. In any random walk, there is an implicit bias due to the choice of the start node u. Since we learn representations for all nodes, we offset this bias by simulating r random walks of fixed length l starting from every node. At every step of the walk, sampling is done based on the transition probabilities πvx. The transition probabilities πvx for the 2nd order Markov chain can be precomputed and hence, sampling of nodes while simulating the random walk can be done efficiently in O(1) time using alias sampling. The three phases of `node2vec`, i.e., preprocessing to compute transition probabilities, random walk simulations and optimization using SGD, are executed sequentially. Each phase is parallelizable and executed asynchronously, contributing to the overall scalability of `node2vec`. `node2vec` is available at: http://snap.stanford.edu/`node2vec`.

> `node2vec`에 대한 의사 코드는 알고리즘 1에서 제공됩니다.
> 임의의 산책에서 시작 노드 u의 선택으로 인해 암시 적 편향이 있습니다. 모든 노드에 대한 표현을 배우기 때문에 모든 노드에서 시작하여 고정 길이 l의 무작위 걷기를 r 개 시뮬레이션하여 이 편향을 상쇄합니다. 걷기의 모든 단계에서 전환 확률 πvx를 기반으로 샘플링이 수행됩니다. 2 차 Markov 체인에 대한 전이 확률 πvx는 미리 계산 될 수 있으므로 랜덤 워크를 시뮬레이션하는 동안 노드 샘플링은 별칭 샘플링을 사용하여 O(1) 시간에 효율적으로 수행될 수 있습니다. `node2vec`의 세 단계, 즉 전환 확률을 계산하기위한 전처리, SGD를 사용한 랜덤 워크 시뮬레이션 및 최적화가 순차적으로 실행됩니다. 각 단계는 병렬화 가능하고 비동기식으로 실행되어 `node2vec`의 전반적인 확장성에 기여합니다. `node2vec`는 [http://snap.stanford.edu/node2vec](http://snap.stanford.edu/node2vec) 에서 구할 수 있습니다.

![Algo.1](/2020/12/node2vec_algo01.png)


#### 3.3 Learning edge features

The `node2vec` algorithm provides a semi-supervised method to learn rich feature representations for nodes in a network. However, we are often interested in prediction tasks involving pairs of nodes instead of individual nodes. For instance, in link prediction, we predict whether a link exists between two nodes in a network. Since our random walks are naturally based on the connectivity struct e between nodes in the underlying network, we extend them to pairs of nodes using a bootstrapping approach over the feature representations of the individual nodes.

Given two nodes u and v, we define a binary operator ◦ over the corresponding feature vectors f(u) and f(v) in order to generate a representation g(u, v) such that g : V × V → Rd0 where d0 is the representation size for the pair (u, v). We want our operators to be generally defined for any pair of nodes, even if an edge does not exist between the pair since doing so makes the representations useful for link prediction where our test set contains both true and false edges (i.e., do not exist). We consider several choices for the operator ◦ such that d0 = d which are summarized in Table 1.

> `node2vec` 알고리즘은 네트워크의 노드에 대한 풍부한 기능 표현을 학습하는 준지도 방법을 제공합니다. 그러나 우리는 종종 개별 노드 대신 노드 쌍을 포함하는 예측 작업에 관심이 있습니다. 예를 들어, 링크 예측에서는 네트워크의 두 노드 사이에 링크가 있는지 예측합니다. 랜덤 워크는 기본 네트워크의 노드 간 연결 구조 e를 자연스럽게 기반으로하기 때문에 개별 노드의 기능 표현에 대한 부트 스트랩 접근 방식을 사용하여 노드 쌍으로 확장합니다.
>
> 두 개의 노드 u와 v가 주어지면, g : V × V → Rd0 여기서 d0이되는 표현 g (u, v)를 생성하기 위해 해당 특징 벡터 f (u) 및 f (v)에 대해 이항 연산자 ◦를 정의합니다. 쌍 (u, v)의 표시 크기입니다. 우리는 테스트 세트가 참 및 거짓 에지를 모두 포함하는 링크 예측에 유용한 표현을 만들기 때문에 쌍 사이에 에지가 존재하지 않더라도 모든 노드 쌍에 대해 연산자를 일반적으로 정의하기를 원합니다 (즉, 존재하지 않음). 연산자 ◦에 대한 몇 가지 선택 사항을 고려하여 표 1에 요약 된 d0 = d입니다.


### 4. EXPERIMENTS

The objective in Eq. 2 is independent of any downstream task and the flexibility in exploration offered by `node2vec` lends the learned feature representations to a wide variety of network analysis settings discussed below.

> 식2 의 목적은 모든 다운 스트림 작업과 독립적이며 `node2vec`에서 제공하는 탐색의 유연성은 학습된 기능 표현을 아래에 설명된 다양한 네트워크 분석 설정에 제공합니다.


#### 4.1 Case Study: Les Misérables network

In Section 3.1 we observed that BFS and DFS strategies represent extreme ends on the spectrum of embedding nodes based on the principles of homophily (i.e., network communities) and structural equivalence (i.e., structural roles of nodes). We now aim to empirically demonstrate this fact and show that `node2vec` in fact can discover embeddings that obey both principles.

We use a network where nodes correspond to characters in the novel Les Misérables [13] and edges connect coappearing characters. The network has 77 nodes and 254 edges. We set d = 16 and run `node2vec` to learn feature representation for every node in the network. The feature representations are clustered using kmeans. We then visualize the original network in two dimensions with nodes now assigned colors based on their clusters.

> 3.1 절에서 우리는 BFS 및 DFS 전략이 동성애 원칙 (즉, 네트워크 커뮤니티) 및 구조적 동등성 (즉, 노드의 구조적 역할) 원칙에 기반한 임베딩 노드 스펙트럼의 극단을 나타냄을 관찰했습니다. 이제 우리는 이 사실을 경험적으로 증명하고 실제로 `node2vec`가 두 원칙을 모두 따르는 임베딩을 발견할 수 있음을 보여줍니다.
>
> 우리는 노드가 소설 Les Misérables [13]의 캐릭터에 해당하고 가장자리가 공존하는 캐릭터를 연결하는 네트워크를 사용합니다. 네트워크에는 77 개의 노드와 254 개의 에지가 있습니다. d = 16으로 설정하고 `node2vec`를 실행하여 네트워크의 모든 노드에 대한 기능 표현을 학습합니다. 기능 표현은 kmeans를 사용하여 클러스터링 됩니다. 그런 다음 노드가 클러스터에 따라 할당된 색상을 사용하여 원래 네트워크를 2 차원으로 시각화합니다.

![Fig.3](/2020/12/node2vec_fig03.png)


Figure 3(top) shows the example when we set p = 1, q = 0.5. Notice how regions of the network (i.e., network communities) are colored using the same color. In this setting `node2vec` discovers clusters/communities of characters that frequently interact with each other in the major sub-plots of the novel. Since the edges between characters are based on coappearances, we can conclude this characterization closely relates with homophily.

In order to discover which nodes have the same structural roles we use the same network but set p = 1, q = 2, use `node2vec` to get node features and then cluster the nodes based on the obtained features. Here `node2vec` obtains a complementary assignment of node to clusters such that the colors correspond to structural equivalence as illustrated in Figure 3(bottom). For instance, `node2vec` embeds blue-colored nodes close together. These nodes represent characters that act as bridges between different sub-plots of the novel. Similarly, the yellow nodes mostly represent characters that are at the periphery and have limited interactions. One could assign alternate semantic interpretations to these clusters of nodes, but the key takeaway is that `node2vec` is not tied to a particular notion of equivalence. As we show through our experiments, these equivalence notions are commonly exhibited in most real-world networks and have a significant impact on the performance of the learned representations for prediction tasks.

> 그림 3 (위)은 p = 1, q = 0.5 로 설정한 예를 보여줍니다. 네트워크 영역 (예 : 네트워크 커뮤니티)이 동일한 색상을 사용하여 색상이 지정되는 방식을 확인합니다. 이 설정에서 `node2vec`는 소설의 주요 하위 플롯에서 자주 상호 작용하는 캐릭터의 클러스터 / 커뮤니티를 발견합니다. 등장 인물 사이의 가장자리는 공동 출연을 기반으로 하기 때문에 이 특성화는 동성애와 밀접한 관련이 있다는 결론을 내릴 수 있습니다.
>
> 동일한 구조적 역할을 갖는 노드를 찾기 위해 동일한 네트워크를 사용하지만 p = 1, q = 2로 설정하고 `node2vec`를 사용하여 노드 기능을 얻은 다음 얻은 기능을 기반으로 노드를 클러스터링 합니다. 여기서 `node2vec`는 그림 3 (아래)에 설명 된 것과 같이 색상이 구조적 동등성에 해당하도록 클러스터에 대한 노드의 보완 할당을 얻습니다. 예를 들어 `node2vec`는 파란색 노드를 서로 가깝게 삽입합니다. 이 노드는 소설의 여러 하위 플롯 사이의 다리 역할을하는 캐릭터를 나타냅니다. 마찬가지로 노란색 노드는 대부분 주변에 있고 상호 작용이 제한된 문자를 나타냅니다. 이러한 노드 클러스터에 대체 의미론적 해석을 할당 할 수 있지만 핵심 사항은 `node2vec`이 특정 동등성 개념에 연결되어 있지 않다는 것입니다. 실험을 통해 보여주듯이 이러한 동등성 개념은 대부분의 실제 네트워크에서 일반적으로 표시되며 예측 작업에 대해 학습된 표현의 성능에 상당한 영향을 미칩니다.


#### 4.2 Experimental setup

Our experiments evaluate the feature representations obtained through `node2vec` on standard supervised learning tasks: multilabel classification for nodes and link prediction for edges. For both tasks, we evaluate the performance of `node2vec` against the following feature learning algorithms:

> 우리의 실험은 표준지도 학습 작업 (노드에 대한 다중 레이블 분류 및 에지에 대한 링크 예측)에서 `node2vec`을 통해 얻은 특징 표현을 평가합니다. 두 작업 모두에 대해 다음 기능 학습 알고리즘에 대해 `node2vec`의 성능을 평가합니다.

• Spectral clustering [29]:

This is a matrix factorization approach in which we take the top d eigenvectors of the normalized Laplacian matrix of graph G as the feature vector representations for nodes.

• DeepWalk [24]:

This approach learns d-dimensional feature representations by simulating uniform random walks. The sampling strategy in DeepWalk can be seen as a special case of `node2vec` with p = 1 and q = 1.

• LINE [28]:

This approach learns d-dimensional feature representations in two separate phases. In the first phase, it learns d/2 dimensions by BFS-style simulations over immediate neighbors of nodes. In the second phase, it learns the next d/2 dimensions by sampling nodes strictly at a 2-hop distance from the source nodes.

> • 스펙트럼 클러스터링 [29] :
>
> 이것은 그래프 G의 정규화 된 라플라시안 행렬의 상위 고유 벡터를 노드에 대한 특징 벡터 표현으로 취하는 행렬 분해 접근 방식입니다.
>
> • DeepWalk [24] :
>
> 이 접근 방식은 균일한 임의 걷기를 시뮬레이션하여 d 차원 특징 표현을 학습합니다. DeepWalk의 샘플링 전략은 p = 1 및 q = 1 인 `node2vec`의 특별한 경우로 볼 수 있습니다.
>
> • LINE [28] :
>
> 이 접근 방식은 두 개의 개별 단계에서 d 차원 기능 표현을 학습합니다. 첫 번째 단계에서는 인접 노드에 대한 BFS 스타일 시뮬레이션을 통해 d / 2 차원을 학습합니다. 두 번째 단계에서는 소스 노드에서 2 홉 거리에 있는 노드를 엄격하게 샘플링하여 다음 d / 2 차원을 학습합니다.

![Table.2](/2020/12/node2vec_tbl02.png)


We exclude other matrix factorization approaches which have already been shown to be inferior to DeepWalk [24]. We also exclude a recent approach, GraRep [6], that generalizes LINE to incorporate information from network neighborhoods beyond 2-hops, but is unable to efficiently scale to large networks.

In contrast to the setup used in prior work for evaluating samplingbased feature learning algorithms, we generate an equal number of samples for each method and then evaluate the quality of the obtained features on the prediction task.
In doing so, we discount for performance gain observed purely because of the implementation language (C/C++/Python) since it is secondary to the algorithm. Thus, in the sampling phase, the parameters for DeepWalk, LINE and `node2vec` are set such that they generate equal number of samples at runtime. As an example, if K is the overall sampling budget, then the `node2vec` parameters satisfy K = r · l · |V |. In the optimization phase, all these benchmarks optimize using SGD with two key differences that we correct for. First, DeepWalk uses hierarchical sampling to approximate the softmax probabilities with an objective similar to the one use by `node2vec`. However, hierarchical softmax is inefficient when compared with negative sampling [22]. Hence, keeping everything else the same, we switch to negative sampling in DeepWalk which is also the de facto approximation in `node2vec` and LINE. Second, both `node2vec` and DeepWalk have a parameter for the number of context neighborhood nodes to optimize for and the greater the number, the more rounds of optimization are required. This parameter is set to unity for LINE, but since LINE completes a single epoch quicker than other approaches, we let it run for k epochs.

The parameter settings used for `node2vec` are in line with typical values used for DeepWalk and LINE. Specifically, we set d = 128, r = 10, l = 80, k = 10, and the optimization is run for a single epoch. We repeat our experiments for 10 random seed initializations, and our results are statistically significant with a p-value of less than 0.01.The best in-out and return hyperparameters were learned using 10-fold cross-validation on 10% labeled data with a grid search over p, q ∈ {0.25, 0.50, 1, 2, 4}.

> 이미 DeepWalk [24]보다 열등한 것으로 밝혀진 다른 매트릭스 분해 접근법은 제외합니다. 또한 LINE을 일반화하여 2 홉 이상의 네트워크 이웃 정보를 통합하지만 대규모 네트워크로 효율적으로 확장할 수 없는 최근 접근 방식인 GraRep [6]도 제외합니다.
>
> 샘플링 기반 특징 학습 알고리즘을 평가하기 위해 이전 작업에서 사용된 설정과 달리, 우리는 각 방법에 대해 동일한 수의 샘플을 생성한 다음 예측 작업에서 획득한 특징의 품질을 평가합니다.
> 그렇게함으로써 우리는 알고리즘에 부차적인 구현 언어 (C / C ++ / Python)로 인해 관찰된 성능 향상을 할인합니다. 따라서 샘플링 단계에서 DeepWalk, LINE 및 `node2vec`에 대한 매개 변수는 런타임에 동일한 수의 샘플을 생성하도록 설정됩니다. 예를 들어, K가 전체 샘플링 예산이면 `node2vec` 매개 변수는 K = r · l · | V |를 충족합니다. 최적화 단계에서 이러한 모든 벤치 마크는 수정된 두 가지 주요 차이점과 함께 SGD를 사용하여 최적화됩니다. 첫째, DeepWalk는 계층적 샘플링을 사용하여 `node2vec`에서 사용하는 것과 유사한 목적으로 소프트 맥스 확률을 근사합니다. 그러나 계층적 소프트 맥스는 네거티브 샘플링과 비교할 때 비효율적입니다 [22]. 따라서 다른 모든 것을 동일하게 유지하면서 DeepWalk에서 네거티브 샘플링으로 전환합니다. 이는 `node2vec` 및 LINE의 사실상 근사치이기도합니다. 둘째, `node2vec`와 DeepWalk는 모두 최적화 할 컨텍스트 인접 노드 수에 대한 매개 변수를 가지고 있으며 수가 많을수록 더 많은 최적화 라운드가 필요합니다. 이 매개 변수는 LINE에 대해 unity로 설정되어 있지만 LINE은 다른 접근 방식보다 단일 epoch를 더 빨리 완료하므로 k epoch 동안 실행되도록 합니다.
>
> `node2vec`에 사용되는 매개 변수 설정은 DeepWalk 및 LINE에 사용되는 일반적인 값과 일치합니다. 특히, d = 128, r = 10, l = 80, k = 10으로 설정하고 최적화는 단일 에포크에 대해 실행됩니다. 10 개의 무작위 시드 초기화에 대한 실험을 반복하고 결과는 p- 값이 0.01 미만으로 통계적으로 유의합니다. 최상의 인-아웃 및 리턴 하이퍼 파라미터는 10 % 라벨링 된 데이터에 대해 10 배 교차 검증을 사용하여 학습되었습니다. p, q ∈ {0.25, 0.50, 1, 2, 4}에 대한 그리드 검색.


#### 4.3 Multi-label classification

In the multi-label classification setting, every node is assigned one or more labels from a finite set L. During the training phase, we observe a certain fraction of nodes and all their labels. The task is to predict the labels for the remaining nodes. This is a challenging task especially if L is large. We utilize the following datasets:

> 다중 레이블 분류 설정에서 모든 노드에는 유한 집합 L에서 하나 이상의 레이블이 할당됩니다. 훈련 단계 동안 노드의 특정 부분과 모든 레이블을 관찰합니다. 작업은 나머지 노드의 레이블을 예측하는 것입니다. 이것은 특히 L이 큰 경우 어려운 작업입니다. 우리는 다음 데이터 세트를 사용합니다.

• BlogCatalog [38]:

This is a network of social relationships of the bloggers listed on the BlogCatalog website. The labels represent blogger interests inferred through the metadata provided by the bloggers. The network has 10,312 nodes, 333,983 edges, and 39 different labels.

• Protein-Protein Interactions (PPI) [5]:

We use a subgraph of the PPI network for Homo Sapiens. The subgraph corresponds to the graph induced by nodes for which we could obtain labels from the hallmark gene sets [19] and represent biological states. The network has 3,890 nodes, 76,584 edges, and 50 different labels.

• Wikipedia [20]:

This is a cooccurrence network of words appearing in the first million bytes of the Wikipedia dump. The labels represent the Part-of-Speech (POS) tags inferred using the Stanford POS-Tagger [32]. The network has 4,777 nodes, 184,812 edges, and 40 different labels.

> • BlogCatalog [38] :
>
> 이것은 BlogCatalog 웹 사이트에 나열된 블로거의 사회적 관계 네트워크입니다. 레이블은 블로거가 제공 한 메타 데이터를 통해 추론 된 블로거 관심사를 나타냅니다. 네트워크에는 10,312 개의 노드, 333,983 개의 에지 및 39 개의 서로 다른 레이블이 있습니다.
>
> • 단백질-단백질 상호 작용 (PPI) [5] :
>
> 우리는 Homo Sapiens에 대해 PPI 네트워크의 하위 그래프를 사용합니다. 하위 그래프는 노드에 의해 유도 된 그래프에 해당하며, 우리는 특징 유전자 세트 [19]에서 라벨을 얻고 생물학적 상태를 나타낼 수 있습니다. 네트워크에는 3,890 개의 노드, 76,584 개의 에지 및 50 개의 서로 다른 레이블이 있습니다.
>
> • Wikipedia [20] :
>
> 이것은 Wikipedia 덤프의 처음 백만 바이트에 나타나는 단어의 동시 발생 네트워크입니다. 레이블은 Stanford POS-Tagger [32]를 사용하여 추론 된 품사 (POS) 태그를 나타냅니다. 네트워크에는 4,777 개의 노드, 184,812 개의 에지 및 40 개의 서로 다른 레이블이 있습니다.

All these networks exhibit a fair mix of homophilic and structural equivalences. For example, we expect the social network of bloggers to exhibit strong homophily-based relationships; however, there might also be some “familiar strangers”, i.e., bloggers that do not interact but share interests and hence are structurally equivalent nodes. The biological states of proteins in a protein-protein interaction network also exhibit both types of equivalences. For example, they exhibit structural equivalence when proteins perform functions complementary to those of neighboring proteins, and at other times, they organize based on homophily in assisting neighboring proteins in performing similar functions. The word cooccurence network is fairly dense, since edges exist between words cooccuring in a 2-length window in the Wikipedia corpus. Hence, words having the same POS tags are not hard to find, lending a high degree of homophily. At the same time, we expect some structural equivalence in the POS tags due to syntactic grammar patterns such as nouns following determiners, punctuations succeeding nouns etc.

> 이러한 모든 네트워크는 동질성과 구조적 동등성이 공정하게 혼합되어 있습니다. 예를 들어, 블로거의 소셜 네트워크는 강력한 동성애 기반 관계를 보여줄 것으로 기대합니다. 그러나 일부 “익숙한 낯선 사람”, 즉 상호 작용하지는 않지만 관심사를 공유하므로 구조적으로 동등한 노드인 블로거가 있을 수도 있습니다. 단백질-단백질 상호 작용 네트워크에서 단백질의 생물학적 상태는 두 가지 유형의 동등성을 나타냅니다. 예를 들어, 그들은 단백질이 인접 단백질의 기능을 보완하는 기능을 수행할 때 구조적 동등성을 나타내며, 다른 경우에는 유사한 기능을 수행하는 데 인접 단백질을 지원하는 동종성을 기반으로 조직화 합니다. 단어 동시 발생 네트워크는 Wikipedia 코퍼스의 2 개 길이 창에서 동시 발생하는 단어 사이에 가장자리가 존재하기 때문에 상당히 조밀합니다. 따라서 동일한 POS 태그를 가진 단어를 찾기가 어렵지 않아 높은 수준의 동성애를 제공합니다. 동시에, 결정자를 따르는 명사, 명사 뒤의 구두점 등과 같은 구문적 문법 패턴으로 인해 POS 태그에서 구조적 동등성을 기대합니다.

**Experimental results.**

The node feature representations are input to a one-vs-rest logistic regression classifier with L2 regularization. The train and test data is split equally over 10 random instances. We use the Macro-F1 scores for comparing performance in Table 2 and the relative performance gain is over the closest benchmark. The trends are similar for Micro-F1 and accuracy and are not shown. From the results, it is evident we can see how the added flexibility in exploring neighborhoods allows `node2vec` to outperform the other benchmark algorithms. In BlogCatalog, we can discover the right mix of homophily and structural equivalence by setting parameters p and q to low values, giving us 22.3% gain over DeepWalk and 229.2% gain over LINE in Macro-F1 scores. LINE showed worse performance than expected, which can be explained by its inability to reuse samples, a feat that can be easily done using the random walk methods. Even in our other two networks, where we have a mix of equivalences present, the semi-supervised nature of `node2vec` can help us infer the appropriate degree of exploration necessary for feature learning. In the case of PPI network, the best exploration strategy (p = 4, q = 1) turns out to be virtually indistinguishable from DeepWalk’s uniform (p = 1, q = 1) exploration giving us only a slight edge over DeepWalk by avoiding redudancy in already visited nodes through a high p value, but a convincing 23.8% gain over LINE in Macro-F1 scores. However, in general, the uniform random walks can be much worse than the exploration strategy learned by `node2vec`. As we can see in the Wikipedia word cooccurrence network, uniform walks cannot guide the search procedure towards the best samples and hence, we achieve a gain of 21.8% over DeepWalk and 33.2% over LINE.

> 노드 특성 표현은 L2 정규화를 사용하여 1 대 나머지 로지스틱 회귀 분류기에 입력됩니다. 학습 및 테스트 데이터는 10 개의 임의 인스턴스에 대해 균등하게 분할됩니다. 우리는 표 2의 성능을 비교하기 위해 Macro-F1 점수를 사용하고 상대적인 성능 향상은 가장 가까운 벤치 마크를 초과합니다. Micro-F1 및 정확도의 추세는 유사하며 표시되지 않습니다. 결과를 통해 이웃 탐색의 유연성이 추가되어 `node2vec`이 다른 벤치 마크 알고리즘을 능가하는 방법을 알 수 있습니다. BlogCatalog에서 우리는 매개 변수 p와 q를 낮은 값으로 설정하여 동종 성과 구조적 동등성의 올바른 조합을 발견 할 수 있습니다 .DeepWalk보다 22.3 %, Macro-F1 점수에서 LINE보다 229.2 % 이득을 얻었습니다. LINE은 예상보다 나쁜 성능을 보 였는데, 이는 샘플을 재사용 할 수 없기 때문에 설명 할 수 있는데, 이는 랜덤 워크 방법을 사용하여 쉽게 할 수있는 업적입니다. 동등성이 혼합 된 다른 두 네트워크에서도 `node2vec`의 반 감독 특성은 기능 학습에 필요한 적절한 탐색 수준을 추론하는 데 도움이 될 수 있습니다. PPI 네트워크의 경우 최상의 탐사 전략 (p = 4, q = 1)은 DeepWalk의 균일 (p = 1, q = 1) 탐사와 사실상 구별 할 수없는 것으로 밝혀져 중복을 피함으로써 DeepWalk보다 약간의 우위를 제공합니다. 높은 p 값을 통해 이미 방문한 노드에서 있지만 Macro-F1 점수에서 LINE보다 23.8 % 확실한 이득을 얻었습니다. 그러나 일반적으로 균일 한 무작위 걷기는 `node2vec`에서 학습 한 탐색 전략보다 훨씬 더 나쁠 수 있습니다. Wikipedia 단어 동시 발생 네트워크에서 볼 수 있듯이 균일 한 걷기는 검색 절차를 최상의 샘플로 안내 할 수 없으므로 DeepWalk보다 21.8 %, LINE보다 33.2 %의 이득을 얻습니다.

![Fig.4](/2020/12/node2vec_fig04.png)


For a more fine-grained analysis, we also compare performance while varying the train-test split from 10% to 90%, while learning parameters p and q on 10% of the data as before. For brevity, we summarize the results for the Micro-F1 and Macro-F1 scores graphically in Figure 4. Here we make similar observations. All methods significantly outperform Spectral clustering, DeepWalk outperforms LINE, `node2vec` consistently outperforms LINE and achieves large improvement over DeepWalk across domains. For example, we achieve the biggest improvement over DeepWalk of 26.7% on BlogCatalog at 70% labeled data. In the worst case, the search phase has little bearing on learned representations in which case `node2vec` is equivalent to DeepWalk. Similarly, the improvements are even more striking when compared to LINE, where in addition to drastic gain (over 200%) on BlogCatalog, we observe high magnitude improvements upto 41.1% on other datasets such as PPI while training on just 10% labeled data.

> 보다 세밀한 분석을 위해 우리는 또한 훈련 테스트 분할을 10 %에서 90 %로 변경하면서 성능을 비교하고 이전과 같이 데이터의 10 %에서 매개 변수 p와 q를 학습합니다. 간결함을 위해 Micro-F1 및 Macro-F1 점수에 대한 결과를 그림 4에 그래픽으로 요약합니다. 여기에서 유사한 관찰을 수행합니다. 모든 방법은 스펙트럼 클러스터링을 크게 능가하고 DeepWalk는 LINE을 능가하며 `node2vec`는 일관되게 LINE을 능가하며 도메인 전체에서 DeepWalk보다 크게 향상됩니다. 예를 들어, 우리는 70 % 레이블이 지정된 데이터에서 BlogCatalog의 DeepWalk 26.7 % 보다 가장 큰 개선을 달성했습니다. 최악의 경우 검색 단계는 학습된 표현에 거의 영향을 미치지 않습니다. 이 경우 `node2vec`는 DeepWalk와 동일합니다. 마찬가지로 개선 사항은 LINE과 비교할 때 훨씬 더 놀랍습니다. BlogCatalog의 급격한 이득 (200 % 이상)에 더해 PPI와 같은 다른 데이터 세트에서 최대 41.1 %까지 크게 향상되었으며 레이블이 지정된 데이터는 10 %에 불과합니다.


#### 4.4 Parameter sensitivity

The `node2vec` algorithm involves a number of parameters and in Figure 5a, we examine how the different choices of parameters affect the performance of `node2vec` on the BlogCatalog dataset using a 50-50 split between labeled and unlabeled data. Except for the parameter being tested, all other parameters assume default values. The default values for p and q are set to unity.

We measure the Macro-F1 score as a function of parameters p and q. The performance of `node2vec` improves as the in-out parameter p and the return parameter q decrease. This increase in performance can be based on the homophilic and structural equivalences we expect to see in BlogCatalog. While a low q encourages outward exploration, it is balanced by a low p which ensures that the walk does not go too far from the start node.

We also examine how the number of features d and the node’s neighborhood parameters (number of walks r, walk length l, and neighborhood size k) affect the performance. We observe that performance tends to saturate once the dimensions of the representations reaches around 100. Similarly, we observe that increasing the number and length of walks per source improves performance, which is not surprising since we have a greater overall sampling budget K to learn representations. Both these parameters have a relatively high impact on the performance of the method. Interestingly, the context size, k also improves performance at the cost of increased optimization time. However, the performance differences are not that large in this case.

> `node2vec` 알고리즘에는 여러 매개 변수가 포함되어 있으며 그림 5a에서는 레이블이 지정된 데이터와 레이블이 없는 데이터를 50-50으로 분할하여 다양한 매개 변수 선택이 BlogCatalog 데이터 세트에서 `node2vec`의 성능에 어떤 영향을 미치는지 조사합니다. 테스트중인 매개 변수를 제외하고 다른 모든 매개 변수는 기본값을 가정합니다. p 및 q의 기본값은 단일로 설정됩니다.
>
> 우리는 매개 변수 p와 q의 함수로 Macro-F1 점수를 측정합니다. `node2vec`의 성능은 입출력 매개 변수 p와 리턴 매개 변수 q가 감소함에 따라 향상됩니다. 이러한 성능 향상은 우리가 BlogCatalog에서 볼 것으로 예상되는 동종성 및 구조적 동등성을 기반으로 할 수 있습니다. 낮은 q는 외부 탐험을 장려하지만 낮은 p로 균형을 이루므로 걷기가 시작 노드에서 너무 멀리 떨어지지 않도록합니다.
>
> 또한 특징 수 d와 노드의 인접 매개 변수 (보행 횟수 r, 보행 길이 l 및 인접 크기 k)가 성능에 미치는 영향을 조사합니다. 우리는 표현의 차원이 약 100에 도달하면 성능이 포화되는 경향이 있음을 관찰합니다. 마찬가지로, 우리는 소스당 걷기 횟수와 길이를 늘리면 성능이 향상된다는 것을 관찰합니다. 이는 표현을 학습하기 위한 전체 샘플링 예산 K가 더 많기 때문에 놀라운 일이 아닙니다. 이 두 매개 변수는 방법의 성능에 상대적으로 높은 영향을 미칩니다. 흥미롭게도 컨텍스트 크기 k는 최적화 시간이 늘어나는 대신 성능을 향상시킵니다. 그러나 이 경우 성능 차이는 그다지 크지 않습니다.


#### 4.5 Perturbation Analysis

For many real-world networks, we do not have access to accurate information about the network structure. We performed a perturbation study where we analyzed the performance of `node2vec` for two imperfect information scenarios related to the edge structure in the BlogCatalog network. In the first scenario, we measure performace as a function of the fraction of missing edges (relative to the full network). The missing edges are chosen randomly, subject to the constraint that the number of connected components in the network remains fixed. As we can see in Figure 5b(top), the decrease in Macro-F1 score as the fraction of missing edges increases is roughly linear with a small slope. Robustness to missing edges in the network is especially important in cases where the graphs are evolving over time (e.g., citation networks), or where network construction is expensive (e.g., biological networks).

In the second perturbation setting, we have noisy edges between randomly selected pairs of nodes in the network. As shown in Figure 5b(bottom), the performance of `node2vec` declines slightly faster initially when compared with the setting of missing edges, however, the rate of decrease in Macro-F1 score gradually slows down over time. Again, the robustness of `node2vec` to false edges is useful in several situations such as sensor networks where the measurements used for constructing the network are noisy.

> 많은 실제 네트워크의 경우 네트워크 구조에 대한 정확한 정보에 액세스 할 수 없습니다. BlogCatalog 네트워크의 에지 구조와 관련된 두 가지 불완전한 정보 시나리오에 대해 `node2vec`의 성능을 분석하는 섭동 연구를 수행했습니다. 첫 번째 시나리오에서는 누락 된 에지의 비율 (전체 네트워크에 비해)의 함수로 성능을 측정합니다. 누락 된 에지는 네트워크에서 연결된 구성 요소의 수가 고정 된 상태로 유지된다는 제약 조건에 따라 무작위로 선택됩니다. 그림 5b (위)에서 볼 수 있듯이 누락 된 가장자리의 비율이 증가함에 따라 Macro-F1 점수의 감소는 작은 기울기로 대략 선형입니다. 네트워크에서 누락 된 에지에 대한 견고성은 그래프가 시간이 지남에 따라 진화하거나 (예 : 인용 네트워크) 네트워크 구성이 비싼 경우 (예 : 생물학적 네트워크)에서 특히 중요합니다.
>
> 두 번째 섭동 설정에서는 네트워크에서 무작위로 선택된 노드 쌍 사이에 잡음이 있는 에지가 있습니다. 그림 5b (아래)에서 볼 수 있듯이 `node2vec`의 성능은 누락 된 가장자리 설정과 비교할 때 초기에 약간 더 빠르게 감소하지만 Macro-F1 점수의 감소 속도는 시간이 지남에 따라 점차 느려집니다. 다시 말하지만, `node2vec`의 거짓 에지에 대한 견고성은 네트워크를 구성하는 데 사용되는 측정 값이 노이즈가 많은 센서 네트워크와 같은 여러 상황에서 유용합니다.

![Fig.5](/2020/12/node2vec_fig05.png)


#### 4.6 Scalability

To test for scalability, we learn node representations using `node2vec` with default parameter values for Erdos-Renyi graphs with increasing sizes from 100 to 1,000,000 nodes and constant average degree of 10. In Figure 6, we empirically observe that `node2vec` scales linearly with increase in number of nodes generating representations for one million nodes in less than four hours. The sampling procedure comprises of preprocessing for computing transition probabilities for our walk (negligibly small) and simulation of random walks. The optimization phase is made efficient using negative sampling [22] and asynchronous SGD [26]. Many ideas from prior work serve as useful pointers in making the sampling procedure computationally efficient. We showed how random walks, also used in DeepWalk [24], allow the sampled nodes to be reused as neighborhoods for different source nodes appearing in the walk. Alias sampling allows our walks to generalize to weighted networks, with little preprocessing [28]. Though we are free to set the search parameters based on the underlying task and domain at no additional cost, learning the best settings of our search parameters adds an overhead. However, as our experiments confirm, this overhead is minimal since `node2vec` is semisupervised and hence, can learn these parameters efficiently with very little labeled data.

> 확장성을 테스트하기 위해 노드 크기가 100 개에서 1,000,000 개로 증가하고 평균 각도가 10 인 Erdos-Renyi 그래프에 대한 기본 매개 변수 값이있는 `node2vec`를 사용하여 노드 표현을 학습합니다. 그림 6에서는 `node2vec`가 수의 증가에 따라 선형 적으로 확장되는 것을 경험적으로 관찰합니다. 4 시간 이내에 백만 개의 노드에 대한 표현을 생성하는 노드의 수. 샘플링 절차는 걷기 (무시할 정도로 작음)에 대한 전환 확률 계산을위한 전처리와 무작위 걷기 시뮬레이션으로 구성됩니다. 최적화 단계는 네거티브 샘플링 [22] 및 비동기 SGD [26]를 사용하여 효율적으로 이루어집니다. 이전 작업의 많은 아이디어는 샘플링 절차를 계산적으로 효율적으로 만드는 데 유용한 지침으로 사용됩니다. DeepWalk [24]에서도 사용되는 랜덤 워크를 통해 샘플링 된 노드를 워크에 나타나는 다른 소스 노드의 이웃으로 재사용하는 방법을 보여주었습니다. 별칭 샘플링을 사용하면 전처리를 거의하지 않고 가중 네트워크로 일반화 할 수 있습니다 [28]. 추가 비용없이 기본 작업 및 도메인을 기반으로 검색 매개 변수를 자유롭게 설정할 수 있지만 검색 매개 변수의 최상의 설정을 배우면 오버 헤드가 추가됩니다. 그러나 우리의 실험에서 확인된 바와 같이 `node2vec`는 반 감독되므로 이러한 매개 변수를 매우 적은 레이블 데이터로 효율적으로 학습 할 수 있으므로이 오버 헤드는 최소화됩니다.

![Fig.6](/2020/12/node2vec_fig06.png)


#### 4.7 Link prediction

In link prediction, we are given a network with a certain fraction of edges removed, and we would like to predict these missing edges. We generate the labeled dataset of edges as follows: To obtain positive examples, we remove 50% of edges chosen randomly from the network while ensuring that the residual network obtained after the edge removals is connected, and to generate negative examples, we randomly sample an equal number of node pairs from the network which have no edge connecting them.

Since none of feature learning algorithms have been previously used for link prediction, we additionally evaluate `node2vec` against some popular heuristic scores that achieve good performance in link prediction. The scores we consider are defined in terms of the neighborhood sets of the nodes constituting the pair (see Table 3). We test our benchmarks on the following datasets:

> 링크 예측에서 특정 부분의 가장자리가 제거 된 네트워크가 제공되며 이러한 누락 된 가장자리를 예측하려고합니다. 다음과 같이 레이블이 지정된 에지 데이터 세트를 생성합니다. 양의 예를 얻기 위해 네트워크에서 무작위로 선택한 에지의 50 %를 제거하고 에지 제거 후 얻은 잔여 네트워크가 연결되어 있는지 확인하고 음의 예를 생성하기 위해 무작위로 샘플링합니다. 에지를 연결하지 않는 네트워크에서 동일한 수의 노드 쌍.
>
> 이전에 링크 예측에 사용 된 기능 학습 알고리즘이 없기 때문에 링크 예측에서 우수한 성능을 달성하는 인기 휴리스틱 점수에 대해 `node2vec`을 추가로 평가합니다. 우리가 고려하는 점수는 쌍을 구성하는 노드의 이웃 집합으로 정의됩니다 (표 3 참조). 다음 데이터 세트에서 벤치 마크를 테스트합니다.

• Facebook [14]:

In the Facebook network, nodes represent users, and edges represent a friendship relation between any two users. The network has 4,039 nodes and 88,234 edges.

• Protein-Protein Interactions (PPI) [5]:

In the PPI network for Homo Sapiens, nodes represent proteins, and an edge indicates a biological interaction between a pair of proteins. The network has 19,706 nodes and 390,633 edges.

• arXiv ASTRO-PH [14]:

This is a collaboration network generated from papers submitted to the e-print arXiv where nodes represent scientists, and an edge is present between two scientists if they have collaborated in a paper. The network has 18,722 nodes and 198,110 edges.

**Experimental results.**

We summarize our results for link prediction in Table 4. The best p and q parameter settings for each `node2vec` entry are omitted for ease of presentation. A general observation we can draw from the results is that the learned feature representations for node pairs significantly outperform the heuristic benchmark scores with `node2vec` achieving the best AUC improvement on 12.6% on the arXiv dataset over the best performing baseline (Adamic-Adar [1]).

Amongst the feature learning algorithms, `node2vec` outperforms both DeepWalk and LINE in all networks with gain up to 3.8% and 6.5% respectively in the AUC scores for the best possible choices of the binary operator for each algorithm. When we look at operators individually (Table 1), `node2vec` outperforms DeepWalk and LINE barring a couple of cases involving the Weighted-L1 and Weighted-L2 operators in which LINE performs better. Overall, the Hadamard operator when used with `node2vec` is highly stable and gives the best performance on average across all networks.

> 링크 예측에 대한 결과는 표 4에 요약되어 있습니다. 각 `node2vec` 항목에 대한 최상의 p 및 q 매개 변수 설정은 쉽게 표현할 수 있도록 생략되었습니다. 결과에서 얻을 수 있는 일반적인 관찰은 노드 쌍에 대해 학습된 기능 표현이 경험적 벤치 마크 점수를 크게 능가한다는 것입니다. `node2vec`는 최고 성능 기준선에 대해 arXiv 데이터 세트에서 12.6 %에서 최고의 AUC 개선을 달성했습니다 (Adamic-Adar [1] ).
>
> 기능 학습 알고리즘 중에서 `node2vec`은 모든 네트워크에서 DeepWalk와 LINE 모두를 능가하며 각 알고리즘에 대한 이항 연산자의 가능한 최선의 선택에 대해 AUC 점수에서 각각 최대 3.8 % 및 6.5 %의 이득을 얻습니다. 연산자를 개별적으로 살펴보면 (표 1) `node2vec`은 LINE의 성능이 더 좋은 Weighted-L1 및 Weighted-L2 연산자와 관련된 몇 가지 경우를 제외하고 DeepWalk 및 LINE보다 성능이 뛰어납니다. 전반적으로 `node2vec`와 함께 사용할 때 Hadamard 연산자는 매우 안정적이며 모든 네트워크에서 평균적으로 최고의 성능을 제공합니다.

![Table.4](/2020/12/node2vec_tbl04.png)


### 5. DISCUSSION AND CONCLUSION

In this paper, we studied feature learning in networks as a searchbased optimization problem. This perspective gives us multiple advantages. It can explain classic search strategies on the basis of the exploration-exploitation trade-off. Additionally, it provides a degree of interpretability to the learned representations when applied for a prediction task. For instance, we observed that BFS can explore only limited neighborhoods. This makes BFS suitable for characterizing structural equivalences in network that rely on the immediate local structure of nodes. On the other hand, DFS can freely explore network neighborhoods which is important in discovering homophilous communities at the cost of high variance.

Both DeepWalk and LINE can be seen as rigid search strategies over networks. DeepWalk [24] proposes search using uniform random walks. The obvious limitation with such a strategy is that it gives us no control over the explored neighborhoods. LINE [28] proposes primarily a breadth-first strategy, sampling nodes and optimizing the likelihood independently over only 1-hop and 2-hop neighbors. The effect of such an exploration is easier to characterize, but it is restrictive and provides no flexibility in exploring nodes at further depths. In contrast, the search strategy in `node2vec` is both flexible and controllable exploring network neighborhoods through parameters p and q. While these search parameters have intuitive interpretations, we obtain best results on complex networks when we can learn them directly from data. From a practical standpoint, `node2vec` is scalable and robust to perturbations.

We showed how extensions of node embeddings to link prediction outperform popular heuristic scores designed specifically for this task. Our method permits additional binary operators beyond those listed in Table 1. As a future work, we would like to explore the reasons behind the success of Hadamard operator over others, as well as establish interpretable equivalence notions for edges based on the search parameters. Future extensions of `node2vec` could involve networks with special structure such as heterogeneous information networks, networks with explicit domain features for nodes and edges and signed-edge networks. Continuous feature representations are the backbone of many deep learning algorithms, and it would be interesting to use `node2vec` representations as building blocks for end-to-end deep learning on graphs.

> 이 논문에서는 검색 기반 최적화 문제로서 네트워크의 특징 학습을 연구했습니다. 이 관점은 우리에게 여러 가지 이점을 제공합니다. 탐사-활용 절충안을 기반으로 고전적인 검색 전략을 설명 할 수 있습니다. 또한 예측 작업에 적용될 때 학습 된 표현에 대한 어느 정도의 해석 가능성을 제공합니다. 예를 들어, BFS는 제한된 지역만 탐색할 수 있음을 관찰했습니다. 따라서 BFS는 노드의 즉각적인 로컬 구조에 의존하는 네트워크의 구조적 동등성을 특성화하는 데 적합합니다. 반면에 DFS는 높은 분산을 희생하면서 동성 커뮤니티를 발견하는 데 중요한 네트워크 이웃을 자유롭게 탐색할 수 있습니다.
>
> DeepWalk와 LINE은 모두 네트워크를 통한 엄격한 검색 전략으로 볼 수 있습니다. DeepWalk [24]는 균일한 무작위 걷기를 사용하는 검색을 제안합니다. 그러한 전략의 명백한 한계는 탐색된 이웃을 통제 할 수 없다는 것입니다. LINE [28]은 주로 노드를 샘플링하고 1 홉 및 2 홉 이웃에 대해서만 가능성을 최적화하는 폭 우선 전략을 제안합니다. 이러한 탐색의 효과는 특성화하기 더 쉽지만 제한적이며 더 깊이있는 노드 탐색에 유연성을 제공하지 않습니다. 반대로 `node2vec`의 검색 전략은 매개 변수 p와 q를 통해 네트워크 이웃을 탐색하는 유연하고 제어 가능합니다. 이러한 검색 매개 변수는 직관적인 해석을 제공하지만 데이터에서 직접 학습할 수 있을 때 복잡한 네트워크에서 최상의 결과를 얻습니다. 실용적인 관점에서 `node2vec`는 확장 가능하고 섭동에 견고합니다.
>
> 예측을 연결하기 위한 노드 임베딩의 확장이 이 작업을 위해 특별히 설계된 인기 휴리스틱 점수를 어떻게 능가하는지 보여주었습니다. 우리의 방법은 표 1에 나열된 것 외에 추가 이진 연산자를 허용합니다. 향후 작업으로 Hadamard 연산자가 다른 연산자에 비해 성공한 이유를 탐색하고 검색 매개 변수를 기반으로 에지에 대한 해석 가능한 동등성 개념을 설정하려고합니다. `node2vec`의 향후 확장에는 이기종 정보 네트워크, 노드 및 에지에 대한 명시적 도메인 기능이 있는 네트워크, 서명 된 에지 네트워크와 같은 특수 구조의 네트워크가 포함될 수 있습니다. 연속적인 특징 표현은 많은 딥러닝 알고리즘의 중추이며 `node2vec` 표현을 그래프에서 종단간 딥러닝을 위한 빌딩 블록으로 사용하는 것은 흥미로울 것입니다.



\[끝\]
