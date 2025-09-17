---
date: 2022-09-07 00:00:00 +0900
title: 네트워크 다이어그램 시각화 라이브러리
description: 내부 또는 클라우드 시스템 모니터링/관리를 위한 네트워크 구성도 시각화 관련 오픈소스를 조사합니다.
categories: [Frontend]
tags: [오픈소스, 시각화]
mermaid: true
image: "https://www.conceptdraw.com/solution-park/icons/CN_TOOL_COMPNETDIAGRMS/spbanner.png"
---

## 1. 용어 설명

### 1) 논리적 네트워크 다이어그램과 물리적 네트워크 다이어그램

- 논리적 네트워크 다이어그램 : 물리적 시설을 제외하고 추상화를 통해 시각화
- 물리적 네트워크 다이어그램 : 실제 거리와 배치 상태를 포함하여 시각화

### 2) [Network Topology & Mapping Tools](https://www.comparitech.com/net-admin/network-topology-and-mapping/)

네트워크 다이어그램이 주로 사용되는 관리 도구

- 네트워크 구성을 IP 스캔을 통해 장치들과 연결관계를 탐지해 매핑(Mapping)
- 네트워크 구성(topology) 형태를 데이터로 저장하고 health 상태를 모니터링
- 네트워크 구성 정보와 상태를 시각적으로 표현
- 그 외 네트워크 관리 도구를 제공
- 대부분 NMS 애플리케이션 형태를 갖추고, 유료버전임

> 시각화 모듈은 내장되어 있어 따로 분리 사용이 어려움 _(제외!)__

#### 참고: [OpenNMS](https://www.opennms.com/)

- 네트워크 상의 모든 장비들을 시각화하고 모니터링 하는 오픈소스 솔루션
  + 오픈소스 [깃허브 - OpenNMS](https://github.com/OpenNMS)
  + 다양한 관련 업체들의 HW, SW 들과 호환성 제공
- 두 개의 벤더에 의해 제공 : [OpenNMS Meridian](https://www.opennms.com/Meridian), [OpenNMS Horizon](https://www.opennms.com/Horizon)
- 시각화 모듈은 내장

![OpenNMS Horizon - Diagram](https://gdm-catalog-fmapi-prod.imgix.net/ProductScreenshot/be1b4c04-2f03-4371-b382-c9a930887f8e.png){: width="580"}
_&lt;그림&gt; OpenNMS Horizon - Diagram_

- 다른 Network 솔루션들 

![SolarWinds Network Topology Mapper](https://logicalread.com/wp-content/uploads/2020/12/SolarWinds-Network-Topology-Mapper.png){: width="560"}
_&lt;그림&gt; SolarWinds Network Topology Mapper_

![Datadog Network Performance Monitoring](https://logicalread.com/wp-content/uploads/2021/01/Datadog.png){: width="560"}
_&lt;그림&gt; Datadog Network Performance Monitoring_

### 3) Architecture Diagram

흔히 말하는 시스템 구성도

- 프로그래밍으로 구현되고 변경되는 스택은 과거와 비교해 복잡도가 더 증가
- 수시로 변경 가능한 아키텍처를 반복적으로 작성하기 위해 다이어그램 생성 도구 필요
- Docker, Kubernetes 등의 발달로 시스템 아키텍처 관리툴의 수요가 다시 증가
- MS Azure, AWS 클라우드 기반 아키텍처를 지원하는 관리도구 개발도 활발

![Mermaid Live Editor - Sharing](https://mermaid.ink/img/pako:eNpdkl9PwyAUxb8KwVdqZnyrZkY333QPrtEldA8MLivKnwao3bL43W1pl1V5aE7PPfd3aeGEuROAcyy1a3nFfEQvb6VF3QrNbu9ZXSFDX8EbpsT1Z9gONaE88KicRcXT4PRrTdE2u84uxoLuGqXF_c7PhWIdzYRetyp2VOa_hGvtFmXZ_NKypM5mWlnog1p9AwKhovPjYLBiEI_0ozoi5gFNyU0A2eiHxERmSJr0sqK36IAMxMqJFJXOI-6BRWX30w2Og1apq6DPB2ZqDWe7SPaGruNRj43Mpg_krO5_yDm4ScF3Wqj6bHXPQXDNQliCRDt3QFJpnV9JKUmI3n1BfjWbzUadtUrEKr-pD4Q77Xyq3f2DhJpxaCsV4cKa4i56xM3-4CY09EgWZElWZEMMKch7v79peT2ZhQk2w63oLs-pT5U4VmCgxHknRXe6JS7tT5drasEiPKdjxLlkOgDBrIlufbQc59E3cA4th0MYzJ9fdLXYzg){: width="580"}
_&lt;그림&gt; Mermaid Live Editor 에서 바로 공유한 다이어그램_

#### 클라우드 제품별 다이어그램 스타일

![쿠버네티스 아키텍처 다이어그램](https://cacoo.com/assets/site/img/templates/screenshots/kubernetes-architecture@2x.png){: width="560"}
_&lt;그림&gt; 쿠버네티스 아키텍처 다이어그램_

![AWS 아키텍처 다이어그램](https://cacoo.com/assets/site/img/templates/screenshots/aws-architecture@2x.png){: width="560"}
_&lt;그림&gt; AWS 아키텍처 다이어그램_

![Azure 아키텍처 다이어그램](https://online.visual-paradigm.com/images/features/azure-architecture-diagram-tool/01-azure-architecture-diagram.png){: width="560"}
_&lt;그림&gt; Azure 아키텍처 다이어그램_

![GCP 아키텍처 다이어그램](https://cacoo.com/assets/site/img/templates/screenshots/gcp-architecture-diagram@2x.png){: width="560"}
_&lt;그림&gt; GCP 아키텍처 다이어그램_

### 4) 시각화 라이브러리

- 범용 목적의 시각화 라이브러리, ex) D3.js, Cytoscape
  + 그래프/네트워크 시각화 또는 차트 시각화
  + 스타일이 풍부하고 웹상에서 인터렉션이 자유로운 편
  + 2D 위주이지만, 3D 렌더링도 가능, ex) three.js
  + 프로그래밍이 작업이 많이 들어가고, 디자인 요소도 상당부분 필요함
- AR/VR 목적의 시각화 라이브러리 : 실내 위치 안내, 가상체험
  + 대량의 텍스처를 실시간 렌더링
  + 게임처럼 카메라 이동 등 시간에 따른 물리변화 표현
- 아키텍처 다이어그램 등의 특수 목적의 시각화 라이브러리
  + 특정 스타일의 다이어그램만 생성
  + 저작의 편의성을 위해 json, yaml 등의 데이터 파일 이용


## 2. 네트워크 시스템 시각화 요건

- 기본적으로 노드와 에지로 구성, 요소들의 그룹핑과 라벨링
- 다양한 컴포넌트에 대응하는 아이콘 제공
- 아키텍처 종류별, 또는 제품/플랫폼 특성별 템플릿 제공
- 격자 구조, 트리 및 그리드 레이아웃
  + 가로/세로 방향으로 연결선을 확장하는 형태
  + 노드의 자동 정렬
- 상태 표시용 색상, 텍스트의 스타일 적용
  + 동적 요소: 시스템 상태 표시를 위해 색상/텍스트 변경
- 확대/축소, 선택(이벤트)
  + 대규모 네트워크의 경우 상세 보기를 위한 도구 필요
  + 특정 노드 또는 특정 항목의 선택적 기능 실행 (버튼 등을 이용)


## 3. 네트워크 다이어그램 라이브러리들

[깃허브 검색어 'architecture diagrams'](https://github.com/search?p=3&q=architecture+diagrams&type=Repositories) : 좋은 소스가 많이 나옴 (아직도 덜 봤음)

- 크게 분류해 보면, 비슷한 원류로부터 서로 자신만의 도구 제작한 경향이 보임
  + yaml 파일을 읽어 python 코드로 생성하는 방식 부류
  + drawio(draw.io) 파일을 읽어 생성하는 방식 부류 (상품성 높음)

- 범용 시각화 라이브러리 기반은 다른 도구를 제작하기 위한 재료로 쓰임
  + 특정 회사 제품을 위한 네트워크 다이어그램을 개발하거나
  + 고정된 템플릿 위에서 동적요소 표현을 위해 사용하거나
  
- 제일 좋은 것은, 구성 파일을 읽어 자동으로 생성되는 방식
  + 쿠버네티스 구성 정보를 읽어 자동으로 그리거나
  + 간단한 명세 언어를 사용해 텍스트 파일로 구성을 표현 
  + 복잡한 구성은 전문 에디터를 사용하고, 모니터링 데이터를 입히는 형태로도 사용


### 1) [plantUML](https://plantuml.com/ko/) 을 이용한 [C4-PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML) - MIT license

- uml 정의 언어로 작성된 텍스트 파일(puml)을 읽어 다이어그램 생성
- plantuml.jar 을 [다운로드](https://plantuml.com/ko/download) 받아 java 커맨드라인으로 실행
- 표현이 풍부하고, 사용이 간편하다.

- sample-diagram.puml 작성

```uml
@startuml C4_Elements
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml

Person(personAlias, "Label", "Optional Description")
Container(containerAlias, "Label", "Technology", "Optional Description")
System(systemAlias, "Label", "Optional Description")

Rel(personAlias, containerAlias, "Label", "Optional Technology")
@enduml
```

- 이미지 파일 생성

```shell
$ java -jar plantuml-1.2022.7.jar ./sample-diagram.puml

$ ls .
C4_Elements.png
sample-diagram.puml
```

![C4_Elements.png](/2022/09/07-sample-diagram-crunch.png){: width="360"}
_&lt;그림&gt; 생성된 plantUML 이미지_
 
- vscode, intellij 확장 모듈을 설치해 내부에서 사용 가능

![VS Code 확장 모듈](https://github.com/plantuml-stdlib/C4-PlantUML/raw/master/images/vscode_c4plantuml_snippets.gif){: width="600"}
_&lt;그림&gt; VS Code 확장 모듈_


### 2) [Mermaid.js](https://mermaid-js.github.io/mermaid/#/)

- 텍스트와 코드를 통해 다이어그램을 생성할 수 있는 시각화 도구
- 쿠퍼네티스 공식문서 [문서화 가이드](https://kubernetes.io/docs/contribute/style/diagram-guide/)에 활용을 권장하고 있는 도구
  + 참고: [Improve your documentation with Mermaid.js diagrams](https://www.kubernetes.dev/blog/2021/12/01/improve-your-documentation-with-mermaid.js-diagrams/)
- 실시간 저작도구(editor) [mermaid.live](https://mermaid.live/) 지원
  + SVG, PNG 저장
  + 마크다운 형태로도 공유 가능 (클릭하면 온라인 에디터로 이동)
- 플로차트, UML, 간트차트, 깃플로, 시퀀스, 파이차트 등 작성 가능

![Mermaid 실시간 에디터 화면](/2022/09/07-mermaid-live-editor-crunch.png){: width="580"}
_&lt;그림&gt; Mermaid 실시간 에디터 화면_

#### 예제: [JS 방식](https://mermaid-js.github.io/mermaid/#/n00b-gettingStarted?id=_2-using-mermaid-plugins)

<!-- script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script -->

<div class="mermaid">
    graph TD 
    A[Client] --> B[Load Balancer] 
    B --> C[Server01] 
    B --> D[Server02]
</div>

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>

<div class="mermaid">
    graph TD 
    A[Client] --> B[Load Balancer] 
    B --> C[Server01] 
    B --> D[Server02]
</div>
```

#### 예제: 실시간 에디터 방식

```text
%%{init:{"theme":"neutral"}}%%
flowchart LR
    B[Why are diagrams<br>useful for documentation?] --> C[Use Mermaid.js]
    C --> D[Examples]
```

![실시간 에디터 방식](https://mermaid.ink/img/pako:eNpFjstKA0EQRX-lKJhd4gc0EsEkO90o4mI6i3K6xmntR6iuRsMw_-7ERqzV5dxDcWccsmM02HWzT17NbFEnjmzRWExcVShYXJaus2kM-WuYSBQenmyC9e771-kCJAzO07tQLLdvsquFxxpgzAIuDzVyUlKf090Jttsd7PuXwvDIEsm7m49yar_2v-WhP35TPAe-4lbgBmOT153zlf1vXKMj-bRo07J69exI-ei8ZkEzUii8Qaqany9pQKNS-U86tMENLj_UjFj3){: width="580"}
_&lt;그림&gt; Mermaid 실시간 에디터 방식_

### 3) [app.diagrams.net](https://app.diagrams.net) 또는 [Draw.io](http://draw.io)

draw.io는 보안상의 이유로 2020년에 diagrams.net으로 천천히 전환됩니다.<br />
[Open source diagramming is moving to diagrams.net, slowly](https://www.diagrams.net/blog/move-diagrams-net)

- 무료 다이아그램 저작도구 (다목적 그리기 도구)
  + 기업용은 당근 유료
- 온라인 웹버전과 데스크탑 앱버전도 있음
  + 구글 독스, 스프레드시트 등에서 plug-in 으로 사용 가능
  + Atlassian Confluence, Jira 에서 사용 가능
- 템플릿 그룹에서 클라우드 선택하면 AWS, GCP, IBM 등 스타일 선택 가능
  + 그밖에도 네트워크 템플릿 등 다양함

![app.diagrams.net](https://www.diagrams.net/assets/svg/home-dia1.svg){: width="580"}
_&lt;그림&gt; app.diagrams.net_

### 4) [Figma](https://figma.com)

- 앱 디자인툴로 유명한 피그마 (개인은 3개 Gem 파일까지 무료)
- [Figma Community](https://www.figma.com/community)에서 [AWS Diagram](https://www.figma.com/templates/aws-diagram-software/) 템플릿 등을 제공
  - [google-cloud-diagram-software](https://www.figma.com/templates/google-cloud-diagram-software/)
  - [azure-architecture-diagrams/](https://www.figma.com/templates/azure-architecture-diagrams/)

### 5) [grafana-flowcharting](https://github.com/algenty/grafana-flowcharting)

그라파나에서 drawio 를 이용해 복잡한 flowchart 를 그릴 수 있는 플러그인 

![Technical schema example](https://github.com/algenty/flowcharting-repository/raw/master/images/fc_archi_example.png?raw=true){: width="580"}
_&lt;그림&gt; Technical schema example_

### 6) [mingrammer/diagrams](https://github.com/mingrammer/diagrams) - MIT license

`Diagrams` : 파이썬 코드로 클라우드 시스템 아키텍처를 그려주는 라이브러리

- [diagrams 예제 페이지](https://diagrams.mingrammer.com/docs/getting-started/examples)

![Stateful Architecture](https://camo.githubusercontent.com/6edbef505e428a2c20a078c2e746efa9253551e8b83510c3a9117561e280dff8/68747470733a2f2f6469616772616d732e6d696e6772616d6d65722e636f6d2f696d672f737461746566756c5f6172636869746563747572655f6469616772616d2e706e67){: width="560"}
_&lt;그림&gt; Stateful Architecture_

![Advanced Web Service](https://camo.githubusercontent.com/f429d60fdaed78a9bc611349e620f5a8a74c2b5405bf93dd11d837808e903719/68747470733a2f2f6469616772616d732e6d696e6772616d6d65722e636f6d2f696d672f616476616e6365645f7765625f736572766963655f776974685f6f6e2d7072656d6973652e706e67){: width="560"}
_&lt;그림&gt; Advanced Web Service_

#### [Diagrams.net](https://www.diagrams.net/) 에디터

`Start Now` 버튼을 누르면 에디터 창으로 이동

- 저장 포맷: xml(.drawio), png, svg, html
- 구글 드라이브로 저장됨

![Diagrams editor](/2022/09/07-editor-diagrams-net-crunch.png){: width="560"}
_&lt;그림&gt; Diagrams Editor_


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

![Clustered Web Services](https://diagrams.mingrammer.com/img/clustered_web_services_diagram.png){: width="580"}
_&lt;그림&gt; 예제 - Clustered Web Services_

#### 예제: 딥러닝(DL)의 신경망(MNN) 시각화에도 사용할 수 있음

- 출처: [Neural Network Architecture Diagrams](https://github.com/kennethleungty/Neural-Network-Architecture-Diagrams)
  - Diagrams for visualizing neural network architecture (Created with diagrams.net)
  
![VGG-16](https://github.com/kennethleungty/Neural-Network-Architecture-Diagrams/raw/main/vgg16_image.png?raw=true){: width="560"}
_&lt;그림&gt; VGG-16 구조_

### 7) [lucasepe/draft](https://github.com/lucasepe/draft) - MIT license

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

![Sample YAML file](https://github.com/lucasepe/draft/raw/master/examples/clients.png){: width="560"}
_&lt;그림&gt; Sample YAML file examples/clients.yml_

### 8) [dcasati/kubernetes-PlantUML](https://github.com/dcasati/kubernetes-PlantUML) - MIT license

쿠버네티스 시스템 다이어그램 생성 용도로 만든 도구

- plantUML 파일을 읽고 다이어그램 생성

![Microservices](https://camo.githubusercontent.com/70ca7ce2d9cb29864602d0b5f6696183330cbf0416034bd439bff1bb8efa7a32/68747470733a2f2f646f63732e6d6963726f736f66742e636f6d2f656e2d75732f617a7572652f6172636869746563747572652f7265666572656e63652d617263686974656374757265732f6d6963726f73657276696365732f5f696d616765732f616b732e706e67){: width="560"}
_&lt;그림&gt; Sample Microservices  Diagram from UML file_

### 9) [k1LoW/ndiag](https://github.com/k1LoW/ndiag)

yaml 파일을 읽어서 Diagram 생성 (비슷한 것을 또 본것 같은데?)

![ndiag](https://github.com/k1LoW/ndiag/raw/main/img/doc.png){: width="560"}
_&lt;그림&gt; ndiag sample_


### 10) [aws-perspective](https://github.com/awslabs/aws-perspective) - Apache-2.0 license

AWS 클라우드 워크로드를 시각화하는 솔루션

- AWS의 실데이터를 기반으로 워크로드의 세부 아키텍처 다이어그램 생성
- 계정 및 리전 전반에 걸쳐 AWS 리소스의 인벤토리를 유지 관리하고, 관계를 매핑
- 사용자를 지정해서 공유가능

![aws-arch-diagram](https://d1.awsstatic.com/Solutions/Solutions%20Category%20Template%20Draft/Solution%20Architecture%20Diagrams/aws-perspective-architecture-diagram.9cc2f8ed5212705854c027f54bcc00221112db2c.png){: width="580"}
_&lt;그림&gt; aws-arch-diagram_

### 11) [openwisp-network-topology](https://github.com/openwisp/openwisp-network-topology) - BSD-3-Clause license

네트워크 구성요소들을 등록하면, 그래프 라이브러리로 시각화 하는 웹애플리케이션. 파이썬 백엔드로 구성되었고, 프론트는 jquery 와 d3 시각화로 구성. 

- 최근 2022년 7월까지 관리중 확인
- 최근 8개월 전에 django 지원 기능을 업데이트

![openwisp-network-topology](https://github.com/openwisp/openwisp-network-topology/raw/docs/docs/demo_network_topology.gif){: width="580"}
_&lt;그림&gt; openwisp-network-topology_


## 4. 그 밖에 범용 시각화 라이브러리들

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

![webgl with forced-directed layout](https://cylynx.imgix.net/uploads/graphvis_react_force_graph.png?ixlib=js-2.3.2&w=780){: width="580"}
_&lt;그림&gt; webgl with forced-directed layout_

### 4) [cytoscape.js](https://js.cytoscape.org/)

그래프 시각화 및 분석을 위한 라이브러리 (비트나인 재직시 이것으로 작업했었음)


#### [실제 사용 사례들](https://github.com/cytoscape/cytoscape.js/issues/914)

- 데모 [cytoscape-sbgn-stylesheet](https://pathwaycommons.github.io/cytoscape-sbgn-stylesheet/)

![ThreatConnect](https://camo.githubusercontent.com/3a80166edfc68bb0adf015bbe91cf213870293515ce877292f5e221cc5a6d729/68747470733a2f2f746872656174636f6e6e6563742e636f6d2f77702d636f6e74656e742f75706c6f6164732f546872656174436f6e6e6563742d5468726561742d496e74656c6c6967656e63652d506c6174666f726d2d43414c2e706e67){: width="560"}
_&lt;그림&gt; ThreatConnect_

![Bell Media](https://user-images.githubusercontent.com/7140406/137211233-d3a3a01c-3e4c-4e0a-88c7-eee6db0cecd9.jpg){: width="560"}
_&lt;그림&gt; Bell Media_

![StixView](https://raw.githubusercontent.com/traut/stixview/master/stixview-graph.png){: width="560"}
_&lt;그림&gt; StixView_

![AgensBrowser 2.0 groupBy, filterBy](/2018/12/ab2-graphquery-groupby.png){: width="560"}
_&lt;그림&gt; AgensBrowser 2.0 - groupBy, filterBy_

## 9. Review

- 범용 시각화 라이브러리는 제품화까지 많은 시간과 노력이 필요하다.
  + 쓸만한, (실제적인) 예제를 가진 라이브러리들은 거의 유료 제품이다.
- 다이어그램 출력 후, 캔버스를 overlay 시켜서 동적 효과를 주는 것도 방법이다.
- 다이어그램 기술 언어/포맷에 따라 유사한 오픈소스들이 있다.
- 대시보드의 경우 오픈소스로 grafana 가 유명하다. 
  + 필요한 기능이 있는지 오픈소스 위주로 찾아보고 시작하는게 현명하다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
