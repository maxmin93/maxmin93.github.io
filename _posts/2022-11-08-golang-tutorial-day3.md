---
date: 2022-11-08 00:00:00 +0000
title: Go 언어 배우기 - 3일차 프레임워크
categories: ["go"]
tags: ["TIL", "tutorial", "framework", "gin", "gorm"]
image: "https://images.velog.io/images/milkcoke/post/2e6493d9-ef2a-4116-91bc-e257ca9af7ec/golang_icon.jpg"
hidden: true
---

> Go 언어의 웹프레임워크 gin 과 ORM 프레임워크 gorm 을 공부합니다. gin 으로 구현된 스케줄러 코드를 살펴봅니다. (3일차)
{: .prompt-tip }

## 1. Go 웹프레임워크

## 2. Go ORM 프레임워크

## 3. Gin 으로 스케줄러 구현하기

### 4) [select 외부에 무한 루프를 갖는 형태](https://golangbyexample.com/select-forloop-outside-go/)

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

## 9. Summary

- 방심할 수 없네. C 또는 Python 과 같은 듯 하면서 다른 Go 언어

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
