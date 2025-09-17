---
date: 2022-11-08 00:00:00 +0900
title: Go 언어 배우기 - 3일차 GIN, GORM
description: Go 언어의 대표적인 웹프레임워크 gin 과 ORM 프레임워크 gorm 을 공부합니다. 스케줄러 cron 도 살펴봅니다. (3일차)
categories: [Language, Go]
tags: [gin, gorm]
image: "https://i.ytimg.com/vi/ZI6HaPKHYsg/maxresdefault.jpg"
---

> 목록
{: .prompt-tip }

- [Go 언어 배우기 - 1일차 개요, 특징](/posts/golang-tutorial-day1/)
- [Go 언어 배우기 - 2일차 문법, 고루틴](/posts/golang-tutorial-day2/)
- [Go 언어 배우기 - 3일차 GIN, GORM](/posts/golang-tutorial-day3/) &nbsp; &#10004;
- [Go 언어 배우기 - 4일차 유틸리티 코드](/posts/golang-tutorial-day4/)
- [Go 언어 배우기 - 5일차 Go Fiber API](/posts/golang-tutorial-day5/)

## 1. GIN : 웹프레임워크

참고 : [Tutorial: Developing a RESTful API with Go and Gin](https://go.dev/doc/tutorial/web-service-gin)

### 1) Gin-Gonic 과 함께 사용할 라이브러리 [(출처)](https://blog.zestmoney.in/our-first-microservice-in-golang-using-gin-gonic-as-framework-4db155e46fc6)

- Authentication => [github.com/auth0/go-jwt-middleware](https://github.com/auth0/go-jwt-middleware)
- Managing modules => [Using Go Modules](https://blog.golang.org/using-go-modules)
- ORM => [gorm](https://gorm.io/)
- Migration => [goose](https://github.com/pressly/goose)
- Logging => [Zap](https://github.com/uber-go/zap)

> 추가

- assert 패키지 : ["github.com/stretchr/testify/assert"](https://github.com/stretchr/testify)
  - GIN 모듈에 포함되어 있음 (테스트에 사용)
  - testing.T 를 받아야 하기 때문에, 단독 사용은 안됨 

- VSCode 에서 [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) 확장도구를 사용해 API 테스트 진행
  + API 단위로 '###' 구분선을 작성하면 됨
    * 'Ctrl+Shift+P' 누른 후 "Rest Client: Send Request" 명령 선택
  + curl 명령으로 실행하는 것과 동일

```text
###

GET http://localhost:8080/albums/3 HTTP/1.1
content-type: application/json

###

POST http://localhost:8080/albums HTTP/1.1
content-type: application/json

{
  "id": "5",
  "title": "BEST Clifford Songs",
  "artist": "Clifford Brown",
  "ganre": "R&B",
  "price": 29.99
}
```

#### 기본 로거와 Zap 로거의 출력 포맷 비교

- 기본 로거의 출력

```text
[GIN] 2022/11/10 - 13:46:32 | 201 |     941.208µs |       127.0.0.1 | POST     "/albums"
[GIN] 2022/11/10 - 14:43:56 | 200 |     112.375µs |       127.0.0.1 | GET      "/albums/3"
[GIN] 2022/11/10 - 14:47:15 | 200 |     232.417µs |       127.0.0.1 | GET      "/albums/4"
```

- Zap 로거의 출력 (JSON 포맷)

```json
{"level":"info","ts":1668062579.340706,"caller":"zap@v0.1.0/zap.go:90","msg":"/ping","status":200,"method":"GET","path":"/ping","query":"","ip":"127.0.0.1","user-agent":"vscode-restclient","latency":0.000212666,"time":"2022-11-10T06:42:59Z"}
{"level":"info","ts":1668062596.9215739,"caller":"zap@v0.1.0/zap.go:90","msg":"/albums","status":200,"method":"GET","path":"/albums","query":"","ip":"127.0.0.1","user-agent":"vscode-restclient","latency":0.000322625,"time":"2022-11-10T06:43:16Z"}
```

### 2) 예제

```shell
$ go get -u github.com/gin-gonic/gin
$ go get -u github.com/gin-contrib/zap
$ go get -u github.com/json-iterator/go

$ go mod tidy

# 기본 JSON 모듈을 대체하여 실행 (또는 빌드)
$ go run -tags=jsoniter .
```

#### 소스

```go
package main

import (
  "bytes"
  "encoding/json"
  "fmt"
  "log"
  "net/http"
  "time"

  ginzap "github.com/gin-contrib/zap"
  "go.uber.org/zap"

  "github.com/gin-gonic/gin"
)

// Album for API /albums
type Album struct {
  ID     string  `json:"id"`
  Title  string  `json:"title"`
  Artist string  `json:"artist"`
  Ganre  string  `json:"ganre"`
  Price  float64 `json:"price"`
}

func main() {
  // 기본 로거와 미들웨어를 포함하는 라우터를 만든다.
  // r := gin.Default()

  // 빈 라우터를 만든다.
  r := gin.New()

  // zap 로거를 만들어 라우터에 추가한다.
  logger, _ := zap.NewProduction()
  r.Use(ginzap.Ginzap(logger, time.RFC3339, true))
  r.Use(ginzap.RecoveryWithZap(logger, true))

  ////////////////////////////////////////////////

  // 라우터에 핸들러를 추가한다.
  r.GET("/ping", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"message": "pong & <foo> zażółć gęślą jaźń@"})
  })

  // albums 의 크기를 지정하면 배열이 생성되고, 지정하지 않으면 슬라이스가 생성된다.
  // - 생성된 배열에 대해서는 수정이 불가능하다. (append 불가능)
  // - 크기를 지정하려면 [...]Album{ } 형태로 선언하면 된다.
  var albums = []Album{
    {ID: "1", Title: "Blue Train", Artist: "John Coltrane", Ganre: "Pop", Price: 56.99},
    {ID: "2", Title: "Jeru", Artist: "Gerry Mulligan", Ganre: "Pop", Price: 17.99},
    {ID: "3", Title: "Sarah Vaughan and Clifford Brown", Artist: "Sarah Vaughan", Ganre: "Classic", Price: 39.99},
  }

  // Closure for GET /albums
  r.GET("/albums", func(c *gin.Context) {
    c.IndentedJSON(http.StatusOK, albums)
  })
  // Closure for GET /albums/:id
  r.GET("/albums/:id", func(c *gin.Context) {
    getAlbumByID(c, albums)
  })

  // Closure for POST /albums
  r.POST("/albums", func(c *gin.Context) {
    // 기존 albums 을 새 앨범이 추가된 변경본으로 갱신해야 함
    log.Println("before Append:", cap(albums), len(albums))
    albums = postAlbums(c, albums) // array 인 경우 albums[:] 로 넘겨야 함
    log.Println("after Append:", cap(albums), len(albums))
  })

  // Routes starting with /albums/ganres are never interpreted
  // as /albums/:id... routes
  r.GET("/albums/ganres", func(c *gin.Context) {
    getGanresCount(c, albums)
  })

  r.GET("/albums/ids", func(c *gin.Context) {
    getAlbumIds(c, albums)
  })

  // Listen and Server in 0.0.0.0:8080
  if err := r.Run(":8080"); err != nil {
    log.Println("can' start server with 8080 port")
  }
}

// JSONMarshal 는 HTML escape 를 하지 않는다.
func JSONMarshal(t interface{}) ([]byte, error) {
  buffer := &bytes.Buffer{}
  encoder := json.NewEncoder(buffer)
  encoder.SetEscapeHTML(false)
  err := encoder.Encode(t)
  return buffer.Bytes(), err
}

// postAlbums adds an album from JSON received in the request body.
func postAlbums(c *gin.Context, albums []Album) []Album {
  var newAlbum Album
  // Call BindJSON to bind the received JSON to newAlbum.
  if err := c.BindJSON(&newAlbum); err != nil {
    log.Println(err)
    return nil
  }
  log.Printf("BODY: %+v", newAlbum)

  // SetEscapeHTML(false) 를 사용하면 HTML escape 를 하지 않는다.
  // https://github.com/gin-gonic/gin/issues/693#issuecomment-243681669
  // - "R&B" 를 "R\u0026B" 로 변환하지 않는다.
  messageJSON, _ := JSONMarshal(newAlbum)
  c.String(http.StatusCreated, string(messageJSON))

  // Add the new album to the slice.
  return append(albums, newAlbum)
}

// getAlbumByID locates the album whose ID value matches the id
func getAlbumByID(c *gin.Context, albums []Album) {
  id := c.Param("id")
  for _, a := range albums {
    if a.ID == id {
      c.IndentedJSON(http.StatusOK, a)
      return
    }
  }
  c.IndentedJSON(http.StatusNotFound, gin.H{
    "message": fmt.Sprintf("album not found among albums(%d)", len(albums)),
  })
}

// getAlbumByID locates Ganres and Count about albums
func getAlbumIds(c *gin.Context, albums []Album) {
  ids := []string{}
  for _, a := range albums {
    ids = append(ids, a.ID)
  }
  if len(ids) == 0 {
    c.IndentedJSON(http.StatusNotFound, gin.H{"message": "albums is empty"})
    return
  }
  c.IndentedJSON(http.StatusOK, ids)
}

// getAlbumByID locates Ganres and Count about albums
func getGanresCount(c *gin.Context, albums []Album) {
  ganres := map[string]int{}
  for _, a := range albums {
    ganres[a.Ganre]++
  }
  if len(ganres) == 0 {
    c.IndentedJSON(http.StatusNotFound, gin.H{"message": "albums is empty or ganres is not found"})
    return
  }
  c.IndentedJSON(http.StatusOK, ganres)
}
```

## 2. GORM : ORM 프레임워크

### 1) GORM SQLite 예제

GORM 과 GORM 을 위한 SQLite 드라이버로 구현됨

- gorm 옵션 
- 테이블 이름 가져오기 (네이밍 규칙에 따라)
- db.Debug : SQL문 출력하기 (디버깅)
- db.Raw : native sql 실행
- db.Create : create => ID 값이 채워짐
- db.First/Last : select limit 1 from 첫 or 마지막
- db.Update : update
- db.Delete : delete

```go
package main

import (
  "fmt"
  "time"

  "gorm.io/driver/sqlite"
  "gorm.io/gorm"
)

// go get -u gorm.io/gorm
// go get -u gorm.io/driver/sqlite

// Product 로 시작하는 Comment 를 쓰면, go-lint 언더라인이 사라진다.
type Product struct {
  gorm.Model        // ID, CreatedAt, UpdatedAt, DeletedAt
  Code       string `gorm:"index;not null"`
  Price      uint   `gorm:"default 0"`
}

// "go-lint" don't use ALL_CAPS in Go names; use CamelCase
const (
  // DateFmtNodash is format 2006-01-02
  DateFmtNodash = "20060102"
  // DateFmtDash is format 2006-01-02
  DateFmtDash = "2006-01-02"
)

func main() {
  db, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
  if err != nil {
    panic("failed to connect database")
  }

  // Migrate the schema
  db.AutoMigrate(&Product{})

  stmt := &gorm.Statement{DB: db}
  stmt.Parse(&Product{})
  tableName := stmt.Schema.Table
  fmt.Printf("TABLE: '%s'\n", tableName)

  // logging SQL stmt by Debug
  db.Debug().Where("code = ?", "jinzhu").First(&Product{})
  fmt.Println("")

  // Truncate : SQLite 에서는 TRUNCATE TABLE 을 지원하지 않는다.
  // tx := db.Exec(fmt.Sprintf("TRUNCATE TABLE %s;", tableName))
  tx := db.Exec(fmt.Sprintf("delete from %s;", tableName))
  if tx.Error != nil {
    panic("failed to truncate table")
  }

  // Create
  var product Product
  product = Product{Code: "D42", Price: 100}
  db.Create(&product)
  fmt.Printf("created: Product.ID=%d (uint)\n\n", product.ID)

  // Check if record exists
  var exists bool
  db.Raw(fmt.Sprintf("select ID from %s where CODE = ? limit 1", tableName), "D42").Row().Scan(&exists)
  if exists {
    fmt.Println("exists: Product.Code='D42'")
  }

  // Read
  var productRow Product
  db.First(&productRow, product.ID) // find product with integer primary key
  // find product with code D42
  tx = db.Table(tableName).Select("UPDATED_AT").Where("CODE = ?", "D42").First(&productRow)
  if tx.Error != nil {
    panic("failed to read table")
  }

  var dateFromDB string // SQLite returns string
  err = db.Raw("select date()").Row().Scan(&dateFromDB)
  if err != nil {
    fmt.Println(err)
    panic("fail to select date()")
  }

  // convert string to time.Time with format 'YYYY-MM-DD'
  today, err := time.Parse(DateFmtDash, dateFromDB)
  if err != nil {
    fmt.Println(dateFromDB, err)
    panic("fail to parse date()")
  }
  today = today.Truncate(24 * time.Hour)
  fmt.Printf("Today: '%s' => '%s'\n",
    dateFromDB,
    today.Format(DateFmtNodash))
  // Today: '2022-11-09' => '20221109'

  isDone := productRow.UpdatedAt.Truncate(24 * time.Hour).Equal(today)
  fmt.Printf("select: Product.UpdatedAt='%s' (%t)\n\n",
    productRow.UpdatedAt.Format(DateFmtNodash),
    isDone)

  // Update - update product's price to 200
  db.Model(&productRow).Update("Price", productRow.Price+200)
  fmt.Printf("updated: Product=%v\n\n", productRow)

  // Update - update multiple fields
  db.Model(&productRow).Updates(Product{Price: 300, Code: "F43"}) // non-zero fields
  db.Model(&productRow).Updates(map[string]interface{}{"Price": 400, "Code": "F44"})

  // Delete - delete product
  db.Delete(&productRow, productRow.ID)
  fmt.Printf("deleted: Product=%+v\n", productRow)
}

/*
TABLE: 'products'

2022/11/10 11:59:26 /Users/bgmin/Servers/go/pkg/mod/gorm.io/gorm@v1.24.1/callbacks.go:134 record not found
[0.061ms] [rows:0] SELECT * FROM `products` WHERE code = "jinzhu" AND `products`.`deleted_at` IS NULL ORDER BY `products`.`id` LIMIT 1

created: Product.ID=1 (uint)
exists: Product.Code='D42'
Today: '2022-11-09' => '20221109'
select: Product.UpdatedAt='20221109' (true)

updated: Product={ {1 2022-11-09 19:48:23.284966 +0900 +0900 2022-11-09 19:48:23.286196 +0900 KST {0001-01-01 00:00:00 +0900 UTC false} } D42 300}

deleted: Product={Model: {ID:1 CreatedAt:2022-11-09 19:48:23.284966 +0900 +0900 UpdatedAt:2022-11-09 19:48:23.287382 +0900 KST DeletedAt:{Time:2022-11-09 19:48:23.287918 +0900 KST Valid:true} } Code:F44 Price:400}
*/
```

### 2) database/sql 위한 [SQLite3 드라이버](https://github.com/mattn/go-sqlite3#go-sqlite3) 예제

참고 : [[Golang] sqlite3 Database Example - Basic Usage](https://siongui.github.io/2016/01/09/go-sqlite-example-basic-usage/)

#### db-sqlite3 예제용 패키지 생성과 테스트

```shell
# db-sqlite3 예제용 
$ go mod init example.com/sqlite3

# built-in database/sql interface 위한 SQLite3 드라이버
$ go get -u github.com/mattn/go-sqlite3

# 현재 패키지의 테스트 함수중에 특정 함수 테스팅
$ go test -run TestAll
dbpath: foo.db
PASS
ok      example.com/sqlite3      0.441s
```

#### db_sqlite.go

```go
package main

import (
  "database/sql"

  _ "github.com/mattn/go-sqlite3"
)

// TestItem structure
type TestItem struct {
  ID    string
  Name  string
  Phone string
}

// InitSqliteConnection initializes the sqlite connection
func InitSqliteConnection(filepath string) *sql.DB {
  db, err := sql.Open("sqlite3", filepath)
  if err != nil {
    panic(err)
  }
  if db == nil {
    panic("db nil")
  }
  return db
}

// CreateTable creates the table
func CreateTable(db *sql.DB) {
  // create table if not exists
  sqlTable := `
  CREATE TABLE IF NOT EXISTS items(
    Id TEXT NOT NULL PRIMARY KEY,
    Name TEXT,
    Phone TEXT,
    InsertedDatetime DATETIME
  );
  `

  _, err := db.Exec(sqlTable)
  if err != nil {
    panic(err)
  }
}

// StoreItem stores the item
func StoreItem(db *sql.DB, items []TestItem) {
  sqlAdditem := `
  INSERT OR REPLACE INTO items(
    Id,
    Name,
    Phone,
    InsertedDatetime
  ) values(?, ?, ?, CURRENT_TIMESTAMP)
  `

  stmt, err := db.Prepare(sqlAdditem)
  if err != nil {
    panic(err)
  }
  defer stmt.Close()

  for _, item := range items {
    _, err2 := stmt.Exec(item.ID, item.Name, item.Phone)
    if err2 != nil {
      panic(err2)
    }
  }
}

// ReadItem reads the items
func ReadItem(db *sql.DB) []TestItem {
  sqlReadall := `
  SELECT Id, Name, Phone FROM items
  ORDER BY datetime(InsertedDatetime) DESC
  `

  rows, err := db.Query(sqlReadall)
  if err != nil {
    panic(err)
  }
  defer rows.Close()

  var result []TestItem
  for rows.Next() {
    item := TestItem{}
    err2 := rows.Scan(&item.ID, &item.Name, &item.Phone)
    if err2 != nil {
      panic(err2)
    }
    result = append(result, item)
  }
  return result
}
```

#### sqlite3_test.go

```go
package main

import (
  "fmt"
  "testing"
)

// 테스팅 함수
func TestAll(t *testing.T) {
  const dbpath = "foo.db"
  fmt.Println("dbpath:", dbpath)

  db := InitSqliteConnection(dbpath)
  defer db.Close()
  CreateTable(db)

  // go-lint : struct 타입을 불필요하게 반복하지 말것
  items := []TestItem{
    {"1", "A", "213"}, // TestItem{ID: "1", Name: "A", Phone: "213"},
    {"2", "B", "214"}, // TestItem{ID: "2", Name: "B", Phone: "214"},
  }
  StoreItem(db, items)

  readItems := ReadItem(db)
  t.Log(readItems)

  items2 := []TestItem{
    {"1", "C", "215"},
    {"3", "D", "216"},
  }
  StoreItem(db, items2)

  readItems2 := ReadItem(db)
  t.Log(readItems2)
}

```

## 3. 백그라운드 스케줄러 구현하기

### 1) 크론탭 `cron/v3` 을 이용한 방법

DB(postgresql)에 이벤트 예약 정보를 쓰고, DB를 읽어 스케줄 수행

- 참고 [Building Basic Event Scheduler in Go](https://articles.wesionary.team/building-basic-event-scheduler-in-go-134c19f77f84)
  + 소스 [깃허브/dipeshdulal/event-scheduling](https://github.com/dipeshdulal/event-scheduling)
- 크론탭 [깃허브/robfig/cron](https://github.com/robfig/cron)
  + `go get github.com/robfig/cron/v3@v3.0.0`

#### database (polling) 방식 스케줄링

![database (polling) 방식 스케줄링](https://miro.medium.com/max/1122/1*WVOKKAJBbWlmOL2dEgOCOQ.png){: width="580"}

#### 실행 결과

1. 데이터베이스에 스케줄 테이블 생성
2. 이벤트 SendEmail, PayBills 을 스케줄링 하고 (insert)
3. duration 마다 ticker 채널 신호를 받아 실행할 이벤트를 확인
4. 실행할 이벤트를 select 하여 callListeners 로 넘김
5. 리스너의 eventFn(함수)를 실행하고, 스케줄 테이블에서 삭제 
6. close 이벤트 받으면 종료

```text
2021/01/16 11:58:49 💾 Seeding database with table...
2021/01/16 11:58:49 🚀 Scheduling event SendEmail to run at 2021-01-16 11:59:49.344904505 +0545 +0545 m=+60.004623549
2021/01/16 11:58:49 🚀 Scheduling event PayBills to run at 2021-01-16 12:00:49.34773798 +0545 +0545 m=+120.007457039
2021/01/16 11:59:49 ⏰ Ticks Received...
2021/01/16 11:59:49 📨 Sending email with data:  mail: nilkantha.dipesh@gmail.com
2021/01/16 12:00:49 ⏰ Ticks Received...
2021/01/16 12:01:49 ⏰ Ticks Received...
2021/01/16 12:01:49 💲 Pay me a bill:  paybills: $4,000 bill
2021/01/16 12:02:49 ⏰ Ticks Received...
2021/01/16 12:03:49 ⏰ Ticks Received...
^C2021/01/16 12:03:57 
❌ Interrupt received closing...
```

#### 주요 코드

```go
// Scheduler data structure
type Scheduler struct {
  db          *sql.DB
  listeners   Listeners
  cron        *cron.Cron
  cronEntries map[string]cron.EntryID
}

// CheckEventsInInterval checks the event in given interval
func (s Scheduler) CheckEventsInInterval(ctx context.Context, duration time.Duration) {
  ticker := time.NewTicker(duration)
  go func() {
    for {
      select {
      case <-ctx.Done():
        ticker.Stop()
        return
      case <-ticker.C:
        log.Println("⏰ Ticks Received...")
        events := s.checkDueEvents()
        for _, e := range events {
          s.callListeners(e)
        }
      }

    }
  }()
}

// callListeners calls the event listener of provided event
func (s Scheduler) callListeners(event Event) {
  eventFn, ok := s.listeners[event.Name]
  if ok {
    go eventFn(event.Payload)
    _, err := s.db.Exec(`DELETE FROM "public"."jobs" WHERE "id" = $1`, event.ID)
    if err != nil {
      log.Print("💀 error: ", err)
    }
  } else {
    log.Print("💀 error: couldn't find event listeners attached to ", event.Name)
  }
}

/*
// SendEmail 이벤트의 eventFn
func SendEmail(data string) {
  log.Println("📨 Sending email with data: ", data)
}
*/
```

### 2) GIN Gonic 에서 크론탭으로 스케줄링

GIN 라우팅 실행 전에 crontab 을 백그라운드로 돌려야 함

- Stackoverflow [Using Gin gonic and some scheduler in Golang](https://stackoverflow.com/a/52727369/6811653)

1. DB 연결
2. 고루틴 : 매 5초마다 크론탭 실행
3. GIN 서버 실행

```go
func main() {
    settings.AppSettings = settings.ReadSettings()

    // DB 연결
    db.InitOracleDataBase()
    OracleEnv, OracleSrv, OracleSes := db.GetOracleDB()
    defer OracleEnv.Close()
    defer OracleSrv.Close()
    defer OracleSes.Close()

    // 고루틴 : 매 5초마다 크론탭 실행
    go func() {
        gocron.Every(5).Seconds().Do(prOk)
        <-gocron.Start()
    }()

    // GIN 서버 실행
    routes.Init()
}
```

### 3) 참고 : [select 외부에 무한 루프를 갖는 형태](https://golangbyexample.com/select-forloop-outside-go/)

```go
package main

import (
  "fmt"
  "time"
)

func main() {
  news := make(chan string)
  go newsFeed(news)

  printAllNews(news)
}

func printAllNews(news chan string) {
  for {  // 무한루프
    select {
    case n := <-news:
      fmt.Println(n)
    case <-time.After(time.Second * 1):
      fmt.Println("Timeout: News feed finished")
      return  // 무한루프 탈출 
    }
  }
}

func newsFeed(ch chan string) {
  for i := 0; i < 2; i++ {
    time.Sleep(time.Millisecond * 400)
    ch <- fmt.Sprintf("News: %d", i+1)
  }
}
// News: 1
// News: 2
// Timeout: News feed finished
```

## 9. Review

- go-lint 짜증나는군. 이름 가지고 이래라 저래라 잔소리가 많다.

```text
// go-lint : 타입 이름으로 시작하는 comment 를 넣던지, 아니면 노출하지 마시오
// go-lint : ALL_CAPS 사용하지 말것, CamelCase 사용하시오
// go-lint : 이름에 '_'를 사용하지 말것
// go-lint : struct slice 안에 타입을 불필요하게 반복하지 말것
```

- 더 깊이 들어갈수록 복잡하고 어려워지기 시작하네.
  + 특히 slice 를 함수로 넘길 때, 원본을 수정하는 방법을 못찾았음
- 선호되고 신뢰성 있는 라이브러리들이 지정된게 아니라서 곤란하다.
  + 뭐를 쓰면 좋을지 선택 장애가 생긴다.
  + beego 는 풀세트를 제공하는데, 중국인 전용같은 느낌

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
