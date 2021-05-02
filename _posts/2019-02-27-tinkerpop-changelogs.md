---
title: Tinkerpop Change-Logs
date: 2019-02-27 00:00:00 +0000
categories: ["graphdb"]
tags: ["Tinkerpop", "changes"]
permalink: /posts/tinkerpop-3.4-changes
---

## [Tinkerpop 3.4][tp34-logs] (Release Date: January 2, 2019)

- 파이썬 `bindings`가 2-tuple이 아닌 실제 Bindings 객체를 사용하도록 변경
- 향상된 Gremlin.NET 드라이버 : 이제는 요청 파이프 라이닝을 사용하고 ConnectionPool의 크기는 고정
- 로컬 컬렉션을 인덱싱 된 컬렉션 또는 맵으로 변환 할 수있는 `IndexStep`을 구현
- valueMap(boolean) overloads 대신에 modulators 를 사용하는 `valueMap()` 로 수정
- 숫자 값에 대해 동일한 필터 작동을 보장하도록 `Contains` predicates 에서 Compare.eq 를 사용
- 트래버스가 임의의 순회 전체 구성을 허용하도록 `OptionsStrategy` 추가
- `text predicates` 추가
- 모든 언어 변형을 지원하는 GraphSON 타입의 `BulkSet`을 추가
- 순회에서 "참조"하기 위해 요소를 자동 분리하는 `ReferenceElementStrategy` 추가
- GraphBinary 직렬화 형식의 초기 릴리즈 추가
- 필드 수용을 위한 `ImportCustomizer` 허가
- groovy-sql 의존성 제거
- Mutating steps 을 수정해서 더이상 final로 표시되지 않음
- 단독 순회에서 `ConnectiveStrategy` 재작성
- GraphSON `MessageSerializer` 는 자동으로 the GremlinServerModule 을 등록하도록 수정


- Bumped to Netty 4.1.25, Spark 2.4.0, Groovy 2.5.4.
- ShortestPathVertexProgram 과 the shortestPath() step 를 구현
- io() start step, read(), write() termination steps 추가
- GraphFeatures.supportsIoRead(), GraphFeatures.supportsIoWrite() 추가
- GraphMLReader better handles edge and vertex properties with the same name.
- Maintained order of annotations in metrics returned from profile()-step.
- Refactored TypeTranslator to be directly extensible for ScriptTranslator functions.
- Modified Gremlin Server to return a "host" status attribute on responses.
- Added ability to the Java, .NET, Python and JavaScript drivers to retrieve status attributes returned from the server.
- Modified Java and Gremlin.Net ResponseException to include status code and status attributes.
- Modified Python GremlinServerError to include status attributes.
- Modified the return type for IGremlinClient.SubmitAsync() to be a ResultSet rather than an IReadOnlyCollection.
- Added Client.submit() overloads that accept per-request RequestOptions.
- Added sparql-gremlin.
- Fixed a bug in dynamic Gryo registration where registrations that did not have serializers would fail.
- Moved Parameterizing interface to the org.apache.tinkerpop.gremlin.process.traversal.step package with other marker interfaces of its type.
- Replaced Parameterizing.addPropertyMutations() with Configuring.configure().
- Changed interface hierarchy for Parameterizing and Mutating interfaces as they are tightly related.
- Introduced the with(k,v) and with(k) step modulators which can supply configuration options to Configuring steps.
- Added OptionsStrategy to allow traversals to take arbitrary traversal-wide configurations.
- Introduced the with(k,v) and with(k) traveral source configuration options which can supply configuration options to the traversal.
- Added connectedComponent() step and related VertexProgram.
- Added supportsUpsert() option to VertexFeatures and EdgeFeatures.
- min() and max() now support all types implementing Comparable.
- Change the toString() of Path to be standardized as other graph elements are.
- hadoop-gremlin no longer generates a test artifact.
- Allowed GraphProvider to expose a cached Graph.Feature object so that the test suite could re-use them to speed test runs.
- Fixed a bug in ReducingBarrierStep, that returned the provided seed value despite no elements being available.
- Changed the order of select() scopes. The order is now: maps, side-effects, paths.
- Moved TraversalEngine to gremlin-test as it has long been only used in testing infrastructure.
- Nested loop support added allowing repeat() steps to be nested.
- Events from EventStrategy raised from "new" mutations will now return a KeyedVertexProperty or KeyedProperty as is appropriate.
- MutationListener#vertexPropertyChanged(Vertex, VertexProperty, Object, Object…​) no longer has a default implementation.
- Deprecated GraphSONMessageSerializerV2d0 as it is now analogous to GraphSONMessageSerializerGremlinV2d0.
- Moved previously deprecated RemoteGraph to gremlin-test as it is now just a testing component.


[tp34-logs]: https://github.com/apache/tinkerpop/blob/3.4.0/CHANGELOG.asciidoc#release-3-4-0
