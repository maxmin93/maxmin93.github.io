---
date: 2022-09-07 00:00:00 +0000
title: 네트워크 다이어그램 시각화 라이브러리
categories: ["opensource"]
tags: ["오픈소스", "topology", "network", "system", "visualization"]
image: "https://www.itfirms.co/wp-content/uploads/2020/12/network-diagram-1.png"
---

> 시스템 모니터링 개발을 위한 네트워크 구성도 시각화 관련 오픈소스를 조사합니다.
{: .prompt-tip }

## 1. 용어 설명

### 1) 논리적 네트워크 다이어그램과 물리적 네트워크 다이어그램

- 논리적 네트워크 다이어그램 : 물리적 시설을 제외하고 추상화를 통해 시각화
- 물리적 네트워크 다이어그램 : 실제 거리와 배치 상태를 포함하여 시각화

### 2) 출처: [Network Topology & Mapping Tools](https://www.comparitech.com/net-admin/network-topology-and-mapping/)

| ![Network-Topology-and-Mapping-Tools](https://cdn.comparitech.com/wp-content/uploads/2019/02/Network-Topology-and-Mapping-Tools-1.jpg){: width="580"} |
|:--:|
| &lt;그림&gt; Network-Topology-and-Mapping-Tools |

#### 기능

- 네트워크 구성을 IP 스캔을 통해 장치들과 연결관계를 탐지
- 네트워크 구성(topology) 형태를 데이터로 저장하고 health 상태를 모니터링
- 네트워크 구성 정보와 상태를 시각적으로 표현
- 그 외 네트워크 관리 도구를 제공

**네트워크 토폴로지 타입**

- 버스 토폴로지 - 두 끝점이 있는 단일 케이블
- 링 토폴로지 – 모든 네트워크 장치가 인라인으로 연결된 연속 루프 (단방향)
- 이중 링 토폴로지 – 각 장치가 양방향 데이터 흐름을 허용하는 링 토폴로지
- 스타 토폴로지 – 모든 네트워크 노드가 중앙 노드를 통해 서로 연결
- 트리 토폴로지 – 분기 연결이 부모-자식 계층 구조를 형성
- 메시 토폴로지 – 지점 간 연결 장치 (라우팅)
- 하이브리드 토폴로지 – 두 가지 이상의 네트워크 토폴로지로 구성

#### 특징

- 일정 기간 Trial 버전 사용 후, 유료 버전 적용
- 애플리케이션 형태
- 시각화 보다는 네트워크 관리 도구에 기능 집중

#### 대표적인 제품들

- [Auvik](https://www.auvik.com/)
- [SolarWinds Network Topology Mapper](https://www.solarwinds.com/)
- [Datadog Live Network Mapping](https://www.datadoghq.com/)
- [Faddom](https://faddom.com)
- [ManageEngine OpManager Network Mapping](https://www.manageengine.com/)
- [Domotz](https://www.domotz.com/)
- [Microsoft Visio](https://www.microsoft.com/ko-kr/microsoft-365/visio)
- [NetProbe/](https://netscan.pl/netprobe/)
- [ThreatConnect](https://threatconnect.com/)

| ![SolarWinds Network Topology Mapper](https://logicalread.com/wp-content/uploads/2020/12/SolarWinds-Network-Topology-Mapper.png){: width="560"} |
|:--:|
| &lt;그림&gt; SolarWinds Network Topology Mapper |

| ![Datadog Network Performance Monitoring](https://logicalread.com/wp-content/uploads/2021/01/Datadog.png){: width="560"} |
|:--:|
| &lt;그림&gt; Datadog Network Performance Monitoring |


## 2. 네트워크 시스템 시각화 요건

- 트리 및 그리드 레이아웃
  + 가로 방향으로 연결선을 확장하는 형태
  + 세로 방향으로 트리처럼 연결되는 형태
- 아이콘 또는 이미지 출력
  + 건물내 위치, 층수 등에 따라 적절한 이미지
  + 사용자 그룹 이미지
- 상태 표시용 색상, 텍스트의 동적 할당
  + 라벨 외에 상태를 설명하는 텍스트 출력
  + 시스템 상태 표시를 위해 red, green 색상 변경
- 확대, 축소, 선택(이벤트)
  + 대규모 네트워크의 경우 상세 보기를 위한 도구 필요
  + 특정 노드 또는 특정 항목의 선택적 기능 실행 (버튼 등을 이용)


## 3. 네트워크 다이어그램 라이브러리들

### 1) [openwisp-network-topology](https://github.com/openwisp/openwisp-network-topology) - BSD-3-Clause license

네트워크 구성요소들을 등록하면, 그래프 라이브러리로 시각화 하는 웹애플리케이션. 파이썬 백엔드로 구성되었고, 프론트는 jquery 와 d3 시각화로 구성. 

- 최근 2022년 7월까지 관리중 확인
- 최근 8개월 전에 django 지원 기능을 업데이트

| ![openwisp-network-topology](https://github.com/openwisp/openwisp-network-topology/raw/docs/docs/demo_network_topology.gif){: width="580"} |
|:--:|
| &lt;그림&gt; openwisp-network-topology |

### 2) [aws-perspective](https://github.com/awslabs/aws-perspective) - Apache-2.0 license


| ![aws-arch-diagram](https://d1.awsstatic.com/Solutions/Solutions%20Category%20Template%20Draft/Solution%20Architecture%20Diagrams/aws-perspective-architecture-diagram.9cc2f8ed5212705854c027f54bcc00221112db2c.png){: width="580"} |
|:--:|
| &lt;그림&gt; aws-arch-diagram |

### 3) [mingrammer/diagrams](https://github.com/mingrammer/diagrams) - MIT license

`Diagrams` : 파이썬 코드로 클라우드 시스템 아키텍처를 그려주는 라이브러리

- [diagrams 예제 페이지](https://diagrams.mingrammer.com/docs/getting-started/examples)

| ![Stateful Architecture](https://camo.githubusercontent.com/6edbef505e428a2c20a078c2e746efa9253551e8b83510c3a9117561e280dff8/68747470733a2f2f6469616772616d732e6d696e6772616d6d65722e636f6d2f696d672f737461746566756c5f6172636869746563747572655f6469616772616d2e706e67){: width="560"} |
|:--:|
| &lt;그림&gt; Stateful Architecture |

| ![Advanced Web Service](https://camo.githubusercontent.com/f429d60fdaed78a9bc611349e620f5a8a74c2b5405bf93dd11d837808e903719/68747470733a2f2f6469616772616d732e6d696e6772616d6d65722e636f6d2f696d672f616476616e6365645f7765625f736572766963655f776974685f6f6e2d7072656d6973652e706e67){: width="560"} |
|:--:|
| &lt;그림&gt; Advanced Web Service |

#### [Diagrams.net](https://www.diagrams.net/) 에디터

`Start Now` 버튼을 누르면 에디터 창으로 이동

- 저장 포맷: xml(.drawio), png, svg, html
- 구글 드라이브로 저장됨

| ![Diagrams editor](/2022/09/07-editor-diagrams-net-crunch.png){: width="560"} |
|:--:|
| &lt;그림&gt; Diagrams Editor |


#### 예제 : [Clustered Web Services](https://diagrams.mingrammer.com/docs/getting-started/examples#clustered-web-services)

```python
from diagrams import Cluster, Diagram
from diagrams.aws.compute import ECS
from diagrams.aws.database import ElastiCache, RDS
from diagrams.aws.network import ELB
from diagrams.aws.network import Route53

with Diagram("Clustered Web Services", show=False):
    dns = Route53("dns")
    lb = ELB("lb")

    with Cluster("Services"):
        svc_group = [ECS("web1"),
                     ECS("web2"),
                     ECS("web3")]

    with Cluster("DB Cluster"):
        db_primary = RDS("userdb")
        db_primary - [RDS("userdb ro")]

    memcached = ElastiCache("memcached")

    dns >> lb >> svc_group
    svc_group >> db_primary
    svc_group >> memcached
```

| ![Clustered Web Services](https://diagrams.mingrammer.com/img/clustered_web_services_diagram.png){: width="580"} |
|:--:|
| &lt;그림&gt; 예제 - Clustered Web Services |

#### 예제: 딥러닝(DL)의 신경망(MNN) 시각화에도 사용할 수 있음

- 출처: [Neural Network Architecture Diagrams](https://github.com/kennethleungty/Neural-Network-Architecture-Diagrams)
  - Diagrams for visualizing neural network architecture (Created with diagrams.net)
  
| ![VGG-16](https://github.com/kennethleungty/Neural-Network-Architecture-Diagrams/raw/main/vgg16_image.png?raw=true){: width="560"} |
|:--:|
| &lt;그림&gt; VGG-16 구조 |

### 4) [dyatko/arkit](https://github.com/dyatko/arkit) - MIT license

Visualises JavaScript, TypeScript and Flow codebases as meaningful and committable architecture diagrams

- Node.js 사용
- json 파일을 통해서 그릴 수 있음

#### 예제: [package.json](https://github.com/dyatko/arkit/blob/master/package.json#L17) 읽어서 다이어그램 생성

| ![Arkit itself using npx](https://github.com/dyatko/arkit/raw/master/dist/arkit.svg?sanitize=true){: width="560"} |
|:--:|
| &lt;그림&gt; Arkit itself using npx arkit and config in package.json |

### 5) [Unix Architecture Diagrams](https://github.com/dspinellis/unix-architecture) - Apache-2.0 license

책 또는 블로그 출간을 위해 아키텍처 그림을 그리는데 사용한 도구. `hbd`(hirerchical box diagram) 확장명 텍스트 파일을 읽어서 LaTeX 파일로 변환해 줌.

```txt
hbox {
  hl \bfseries{User Space}
  hbox {
    hl User commands
    hbox [color=SkyBlue] Shell (sh)
    hbox [color=SkyBlue] {
      hl [Program Development]
      vl as
...      
```

### 6) [lucasepe/draft](https://github.com/lucasepe/draft) - MIT license

yaml 파일을 읽고 png 그림 파일을 생성하는 go 언어 기반 시각화 도구

- 커맨드라인 방식으로 사용 가능

```yaml
--- 
backgroundColor: '#ffffff'
components: 
  - 
    kind: cli
    outline: Clients
    label: 'kind: <b>cli</b>'
  - 
    kind: usr
    outline: Clients
    label: 'kind: <b>usr</b>'
  - 
    kind: web
    outline: Clients
    label: 'kind: <b>web</b>'
connections:
   -
     origin: cli1
     targets:
       -
         id: usr1
         color: transparent
   -
     origin: usr1
     targets:
       -
         id: web1
         color: transparent
```

| ![Sample YAML file](https://github.com/lucasepe/draft/raw/master/examples/clients.png){: width="560"} |
|:--:|
| &lt;그림&gt; Sample YAML file examples/clients.yml. |

### 6) [dcasati/kubernetes-PlantUML](https://github.com/dcasati/kubernetes-PlantUML) - MIT license

쿠버네티스 시스템 다이어그램 생성 용도로 만든 도구

- plantUML 파일을 읽고 다이어그램 생성

| ![Microservices](https://camo.githubusercontent.com/70ca7ce2d9cb29864602d0b5f6696183330cbf0416034bd439bff1bb8efa7a32/68747470733a2f2f646f63732e6d6963726f736f66742e636f6d2f656e2d75732f617a7572652f6172636869746563747572652f7265666572656e63652d617263686974656374757265732f6d6963726f73657276696365732f5f696d616765732f616b732e706e67){: width="560"} |
|:--:|
| &lt;그림&gt; Sample Microservices  Diagram from UML file |



## 4. 그 밖에 유용한 라이브러리들

### 1) [D3.js](https://d3js.org/)

D3 는 모든 기능을 제공하는 데이터 시각화용 라이브러리이지만, 스타일링과 커스텀을 위해 많은 시간과 노력을 필요로 한다. 그 탓에 다른 라이브러리들의 기반으로 사용되기도 한다.

- 데모 [d3-network-topology](https://semonalbertyeah.github.io/d3-network-topology/)

#### D3 의 wrapper 라이브러리들

- [react-d3-graph](https://github.com/danielcaldas/react-d3-graph) : 유지보수 되고 있음
- [react-vis-force](https://github.com/uber/react-vis-force) : 더이상 유지보수 안함 (5년 전부터)
 
### 2) [G6](https://github.com/antvis/g6)

그래프 시각화 엔진. 다양한 사용예제가 있지만, 모든 문서가 중국어로 되어 있음

- [G6 갤러리](https://g6.antv.vision/zh/examples/gallery)

### 3) [React-force-graph](https://github.com/vasturiano/react-force-graph)

2D 캔바스 와 3D WebGL (three.js) 이 합쳐진 시각화 라이브러리

- 장점:
  - MIT licence
  - Excellent performance (WebGL)
    - 3D! (three.js)
    - AR! (three.js)
  - 몇몇 특별한 스타일링 옵션들<br />&nbsp;
- 단점:
  - 단지 force-directed 레이아웃만 지원
  - 단순 노드와 에지 모양만 있음
  - 지리공간 이나 시간축 기능이 없음

| ![webgl with forced-directed layout](https://cylynx.imgix.net/uploads/graphvis_react_force_graph.png?ixlib=js-2.3.2&w=780){: width="580"} |
|:--:|
| &lt;그림&gt; webgl with forced-directed layout |

### 4) [cytoscape.js](https://js.cytoscape.org/)

그래프 시각화 및 분석을 위한 라이브러리 (비트나인 재직시 이것으로 작업했었음)


#### [실제 사용 사례들](https://github.com/cytoscape/cytoscape.js/issues/914)

- 데모 [cytoscape-sbgn-stylesheet](https://pathwaycommons.github.io/cytoscape-sbgn-stylesheet/)

| ![ThreatConnect](https://camo.githubusercontent.com/3a80166edfc68bb0adf015bbe91cf213870293515ce877292f5e221cc5a6d729/68747470733a2f2f746872656174636f6e6e6563742e636f6d2f77702d636f6e74656e742f75706c6f6164732f546872656174436f6e6e6563742d5468726561742d496e74656c6c6967656e63652d506c6174666f726d2d43414c2e706e67){: width="560"} |
|:--:|
| &lt;그림&gt; ThreatConnect |

| ![Bell Media](https://user-images.githubusercontent.com/7140406/137211233-d3a3a01c-3e4c-4e0a-88c7-eee6db0cecd9.jpg){: width="560"} |
|:--:|
| &lt;그림&gt; Bell Media |

| ![Chat Analyser](https://camo.githubusercontent.com/c318baa7b5e35915067f8b9c8c2cf1c7cb2cd1879d22fb04611e7d957d75a867/68747470733a2f2f6d656469612e67697068792e636f6d2f6d656469612f774f3068534f6a365431666d534f423063782f67697068792e676966){: width="560"} |
|:--:|
| &lt;그림&gt; Chat Analyser |

| ![StixView](https://raw.githubusercontent.com/traut/stixview/master/stixview-graph.png){: width="560"} |
|:--:|
| &lt;그림&gt; StixView |

| ![AWS Perspective](https://github.com/awslabs/aws-perspective/raw/main/docs/screenshots/example-arch.png){: width="560"} |
|:--:|
| &lt;그림&gt; AWS Perspective |

| ![AgensBrowser 2.0 groupBy, filterBy](/2018/12/post20181231-groupBy.png){: width="560"}|
|:--:|
| &lt;그림&gt; AgensBrowser 2.0 - groupBy, filterBy |

### 5) [Neural Network Architecture Diagrams](https://github.com/kennethleungty/Neural-Network-Architecture-Diagrams)

딥러닝(DL)의 신경망(MNN)을 시각화하는 라이브러리

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
