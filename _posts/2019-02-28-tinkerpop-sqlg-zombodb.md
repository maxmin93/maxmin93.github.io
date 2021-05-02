---
title: Tinkerpop & sqlg, postgresql & zombodb
date: 2019-02-24 00:00:00 +0000
categories: ["graphdb"]
tags: ["Tinkerpop", "postgresql", "sqlg", "zombodb"]
permalink: /posts/tinkerpop-sqlg-pg-zombodb
---

## Test

- Tinkerpop 3.3.4 & sqlg plugin
- Postgresql JDBC 연결 설정 ==> conf/sqlg.properties
-- jdbc.url, jdbc.username, jdbc.password

```groovy
$ gremlin-console bin/gremlin.sh

         \,,,/
         (o o)
-----oOOo-(3)-oOOo-----
plugin activated: tinkerpop.server
plugin activated: tinkerpop.utilities
plugin activated: sqlg.postgres01
plugin activated: tinkerpop.tinkergraph
gremlin> graph = SqlgGraph.open('conf/sqlg.properties')
==>sqlggraph[SqlGraph] (jdbc:postgresql://tonyne.iptime.org:5432/sqlgraphdb)
gremlin> g = graph.traversal()
==>sqlggraphtraversalsource[sqlggraph[SqlGraph] (jdbc:postgresql://tonyne.iptime.org:5432/sqlgraphdb), standard]
gremlin> graph.io(GraphSONIo.build(GraphSONVersion.V3_0)).readGraph("data/grateful-dead.json")
==>null
gremlin> g.V().count()
==>808
gremlin> g.V().groupCount().by(label)
==>[song:584,artist:224]
gremlin> g.E().groupCount().by(label)
==>[followedBy:7047,sungBy:501,writtenBy:501]
gremlin> g.V().hasLabel('song').properties().key().groupCount()
==>[name:584,songType:584,performances:584]
gremlin> g.V().hasLabel('song').limit(1)
==>v[public.song:::1]
gremlin> g.V().hasLabel('song').limit(1).properties()
==>vp[name->HEY BO DIDDLEY]
==>vp[songType->cover]
==>vp[performances->5]
gremlin> g.E().hasLabel('followedBy').properties().key().groupCount()
==>[weight:7047]
gremlin> g.E().hasLabel('followedBy').limit(1).properties()
==>p[weight->1]
gremlin> :quit
```

## Test

- postgresql & zombodb extension (elasticsearch)
- elasticsearch ==> http://localhost:9200/

```diff
- NOTE 1: sqlg 에 의한 schema 생성 후, 생성된 테이블에 대해 vaccum full <table_name> 처리 해야 indexing 가능
- NOTE 2: vaccum 수행을 하려면 graph.close 해야 가능 (table lock 해제)
```

```sql
set search_path=public;

VACUUM FULL "E_followedBy"; -- exec by only single transaction
create index idx_e_followedby
  on "E_followedBy" using zombodb(("E_followedBy".*))
  with (url='http://localhost:9200/');

VACUUM FULL "E_sungBy";	 -- exec by only single transaction
create index idx_e_sungby
  on "E_sungBy" using zombodb(("E_sungBy".*))
  with (url='http://localhost:9200/');

VACUUM FULL "E_writtenBy";	 -- exec by only single transaction
create index idx_e_writtenby
  on "E_writtenBy" using zombodb(("E_writtenBy".*))
  with (url='http://localhost:9200/');

VACUUM FULL "V_song";	 -- exec by only single transaction
create index idx_v_song
  on "V_song" using zombodb(("V_song".*))
  with (url='http://localhost:9200/');

VACUUM FULL "V_artist";	 -- exec by only single transaction
create index idx_v_artist
  on "V_artist" using zombodb(("V_artist".*))
  with (url='http://localhost:9200/');

select * from "V_song" where "V_song" ==> 'love AND original';
/*
ID		name		songType		performances
------	----------	----------		-----------
"17"	"THEY LOVE EACH OTHER"	"original"	227
"183"	"DONT NEED LOVE"	"original"	16
"189"	"EASY TO LOVE YOU"	"original"	45
*/
```

## Test : insert new vertex

- sqlg 로 연결한 postgresql 에 트랜잭션을 반영하기 위해서는 반드시 tx.commit 해야 함

```diff
- NOTE : sqlg trasaction have to need commit
```

```groovy
gremlin> newV = graph.addVertex(label,'song')
==>v[public.song:::585]
gremlin> newV.property('name','SQLG TEST SONG01')
==>vp[name->SQLG TEST SONG01]
gremlin> newV.property('songType','test')
==>vp[songType->test]
gremlin> newV.property('performances',99)
==>vp[performances->99]
gremlin> newV.properties()
==>vp[name->SQLG TEST SONG01]
==>vp[songType->test]
==>vp[performances->99]
gremlin> newV.id()
==>public.song:::585
gremlin> g.V().hasLabel('song').has('songType','test').limit(1).properties()
==>vp[name->SQLG TEST SONG01]
==>vp[songType->test]
==>vp[performances->99]

###############################
gremlin> graph.tx().commit()        # <== important!!
==>null
gremlin> g.close()
==>null
gremlin> graph.close()
==>null
###############################

gremlin> graph = SqlgGraph.open('conf/sqlg.properties')
==>sqlggraph[SqlGraph] (jdbc:postgresql://tonyne.iptime.org:5432/sqlgraphdb)
gremlin> g = graph.traversal()
==>sqlggraphtraversalsource[sqlggraph[SqlGraph] (jdbc:postgresql://tonyne.iptime.org:5432/sqlgraphdb), standard]
gremlin> g.V().hasLabel('song').has('songType','test').limit(1).properties()
==>vp[name->SQLG TEST SONG01]
==>vp[songType->test]
==>vp[performances->99]
```

## Test

- After tx commit, elasticsearch can do indexing changed-data
- 변경 사항이 즉시 반영된다 ==> very good!!

```sql
select * from "V_song" where "V_song" ==> 'test';
-- no result (without tx.commit)
-- after tx.commit, then OK!!
-- ==> "586"	"SQLG TEST SONG01"	"test"	99
```
