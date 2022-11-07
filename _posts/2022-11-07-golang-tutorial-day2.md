---
date: 2022-11-07 00:00:00 +0000
title: Go 언어 배우기 - 2일차 GIN, GORM
categories: ["go"]
tags: ["TIL", "tutorial", "framework", "gin", "gorm"]
image: "https://images.velog.io/images/milkcoke/post/2e6493d9-ef2a-4116-91bc-e257ca9af7ec/golang_icon.jpg"
hidden: true
---

> Go 언어의 기본적인 내용과 다른 언어와 대비해 특징적인 기능 위주로 요약해본다. (2일차)
{: .prompt-tip }

## 1. Go 언어 개요

일단 첫 소감은 C 언어 사용자라면 쉽게 접근할 수 있지 않나 싶다. C 언어를 대체하려고 만든 것인지, 특히 포인터와 레퍼런스 기호가 나오고 struct 타입이 반갑다. 



## 2. 자료구조

### 1) 이진트리

```go
type Tree struct {
  Left *Tree
  Value int
  Right *Tree
}

// 이진트리 순회 (재귀호출)
func traverse(t *Tree) {
  if t == nil {
    return
  }
  traverse(t.Left)  // 왼쪽 먼저 순회
  fmt.Print(t.Value, " ")  // 자신
  traverse(t.Right)  // 오른쪽 순회
}

// 이진트리 삽입
func insert(t *Tree, v int) *Tree {
  // 빈자리(말단 노드)이면 삽입
  if t == nil {
    return &Tree(nil, v, nil)
  }
  // 같은 값이 있으면 자신을 반환
  if v == t.Value {
    return t
  }

  // 값이 작으면 왼쪽 노드에 삽입
  if v < t.Value {
    t.Left = insert(t.Left, v)
    return t
  }
  // 아니면 오른쪽 노드에 삽입
  t.Right = insert(t.Right, v)
  return t
}
```
### 2) 해시 테이블

```go
const SIZE = 15

// 해시 버킷의 노드 (링크드 리스트)
type Node struct {
  Value int 
  Next *Node
}

// 해시 테이블
type HashTable struct {
  Table map[int]*Node  // 맵
  Size int  // 맵 크기 (SIZE)
}

// 해시 버킷 결정 함수
func hashFunction(i, size int) int {
  return (i % size)
}

// 삽입 => 버킷 번호 반환
func insert(hash *HashTable, value int) int {
  index := hashFunction(value, hash.Size)
  // 버킷에 루트 노드로 추가
  element := Node{ Value: value, Next: hash.Table[index] }
  // (생략됨) 기존 루트 노드가 추가 노드에 연결
  hash.Table[index] = &element
  return index
}

func traverse(hash *HashTable) {
  for k := range hash.Table {
    if hash.Table[k] != nil {
      t := hash.Table[k]
      for t != nil {
        fmt.Printf("%d -> ", t.Value)
        t = t.Next
      }
      fmt.Println()
    }
  }
}
```

## 3. 고루틴





&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }

