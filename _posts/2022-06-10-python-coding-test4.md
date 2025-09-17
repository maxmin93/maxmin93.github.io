---
date: 2022-06-10 00:00:00 +0900
title: Python 코딩테스트 연습문제 31~40
description: 파이썬 코딩테스트 준비를 하며 공부한 내용을 기록하고 복습합니다.
categories: [Language, Python]
tags: [coderbyte, 코딩테스트]
image: https://coderbytestaticimages.s3.amazonaws.com/consumer-v2/nav/coderbyte_logo_digital_multi_light.png
---

## 참고자료

- [coderbyte](https://coderbyte.com/)
- [GeeksForGeeks](https://www.geeksforgeeks.org/)
- [LeetCode](https://leetcode.com/)

## 파이썬 코딩테스트

### 문제31

[heapq 모듈 사용법](https://www.daleseo.com/python-heapq/)

`heapq` 는 내장 모듈로 리스트를 최소힙(min-heap) 처럼 사용하도록 돕는 helper 클래스이다.

- heapq 에 `list` 를 넣고, `heappush` (삽입) 또는 `heappop` (반출) 할 때마다 자동 정렬된다.
- 때문에 `list` 의 `[0]` 는 항상 가장 작은 값을 가리킨다
  - 반대로 가장 큰 값을 얻고 싶으면 `(-1*value, value)` 튜플 형태로 삽입하면 된다
  - 두번째 순위의 값을 얻고 싶으면 `[1]` 이 아니라, `heappop` 이후에 `[0]` 을 읽어야 한다.

> heapq 예제

```python
import heapq

# 삽입, 반출
heap = []
heapq.heappush(heap, 4)
heapq.heappush(heap, 1)
heapq.heappush(heap, 7)
heapq.heappush(heap, 3)
print(heap, heapq.heappop(heap))
# ==> [3, 4, 7] 1

# 리스트의 heap 적용
heap = [4, 1, 7, 3, 8, 5]
heapq.heapify(heap)
print(heap, heap[0])
# ==> [1, 3, 5, 4, 8, 7] 1

# 최대 값 구하기 (역순 정렬)
heap = [4, 1, 7, 3, 8, 5]
reverse_heap = [ (-x,x) for x in heap ]
heapq.heapify(reverse_heap)
while reverse_heap:
    print(heapq.heappop(reverse_heap)[1], end=' ')
print()
# ==> 8 7 5 4 3 1

# k 번째 최소값 구하기
def kth_smallest(nums, k):
    heap = []
    for num in nums:
        heapq.heappush(heap, num)

    kth_min = None
    for _ in range(k):
        kth_min = heapq.heappop(heap)
    return kth_min

print( kth_smallest([4, 1, 7, 3, 8, 5], 3) )
# ==> 4
```

### 문제 32

[다익스트라(Dijkstra) 최단경로 알고리즘](https://all-young.tistory.com/m/81)

`start` 정점으로부터 도달할 수 있는 모든 정점에 대한 `distance` 구하기

```python
lines = [
    '6 11',     # V, E
    '1',        # start
    '1 2 2','1 3 5','1 4 1','2 3 3','2 4 2',
    '3 2 3','3 6 5','4 3 3','4 5 1','5 3 1',
    '5 6 2'     # e_start, (e_end, e_dist)
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

# 정점수(n), 간선수(m)
n, m = map(int, input().split())
# 시작점
start = int(input())
# 최대값 (초기값)
INF = int(1e9)
# 이동 cost 저장
distance = [INF] * (n+1)

# 첫번째 0 노드는 무시 (안씀)
graph = [[] for i in range(n+1)]
# graph 데이터
for _ in range(m):
    a, b, c = map(int, input().split())
    graph[a].append((b, c))


import heapq

def dijkstra(start):
    loop_cnt = 0
    q = []
    heapq.heappush(q, (0, start))
    distance[start] = 0

    while q:
        # 최단 거리의 정점 순으로 이미 정렬되어 있다 (heapq)
        # 정렬 순서 : (cost, V)
        dist, curr = heapq.heappop(q)
        # 시작점은 0, 방문하지 않는 곳은 INF
        # 이미 계산된 값(distance[curr])이 더 작으면 유지한다
        # ==> 이미 방문한 곳은 건너뛰기
        if distance[curr] < dist:
            continue

        # 현재 정점(now)로부터 갈 수 있는 모든 정점을 방문
        for e_end, e_dist in graph[curr]:
            cost = dist + e_dist
            if cost < distance[ e_end ]:
                distance[ e_end ] = cost
                heapq.heappush( q, (cost, e_end) )
            loop_cnt += 1
    return loop_cnt

loop_cnt = dijkstra(start)
print( loop_cnt )
# ==> 11

for i in range(1, n+1):
    print(f'distance from V[{start}] to V[{i}] = {distance[i] if distance[i] != INF else "INFINITY"}')

## 결과
# distance from V[1] to V[1] = 0
# distance from V[1] to V[2] = 2
# distance from V[1] to V[3] = 3
# distance from V[1] to V[4] = 1
# distance from V[1] to V[5] = 2
# distance from V[1] to V[6] = 4
```

### 문제 33

깊이우선 탐색(DFS) 응용한 문제

[이진트리순회(DFS:Depth First Search)](https://velog.io/@baik9261/TIL-no.7-Python-%EC%9D%B4%EC%A7%84%ED%8A%B8%EB%A6%AC%EC%88%9C%ED%9A%8CDFSDepth-First-Search)

> 재귀함수를 이용한 이진수 출력

```python
def DFS(x):
    if x==0:
        return
    else:
        print(x%2, end='')
        DFS(x//2)

n=11
DFS(n)
# ==> 1101
```

> 괄호 조합 문제

이전 상태를 유지하면서 모든 경우를 파생시키며 다음 상태를 찾는 탐색 문제<br>
단, 파생시키는 경우에 제약을 걸어 원하는 방향으로 탐색되도록 해야 함

문제 [Bracket Combinations](https://coderbyte.com/information/Bracket%20Combinations)

- Input: 3
  - Output: 5
  - 가능한 조합: ()()(), ()(()), (())(), ((())), (()())
- Input: 3
  - Output: 5
- Input: 2
  - Output: 2

```python
def bracket(n, open, close, s, result):
    # 재귀함수 작성시 종료 조건을 먼저 기술
    if open == n and close == n:
        # 재귀할수록 증가하는 결과를 return 할 수 없다
        # --> array 저장
        result.append(s)
        return

    # 어떤 경우가 오던, 두가지 경우가 파생된다
    # 1) 괄호가 열리는 경우 s+'{'
    # 2) 괄호가 닫히는 경우 s+'}'

    # 문제는 이 상태로 진행시 종료 조건을 만족하지 못해
    # maximum recursion 에 의해 RecursionError 가 발생한다.
    # ==> 파생되는 제한 조건을 추가해야 한다.

    # DFS 왼쪽 탐색, 단 open 이 n 보다 작을 때에만
    if open < n:
        bracket(n, open+1, close, s+'{', result)
    # DFS 오른쪽 탐색, 단 close 가 open 보다 작을 때에만
    if close < open:
        bracket(n, open, close+1, s+'}', result)

result = []
n = 3
bracket(n, 0, 0, ' ', result)
print(result)
# ==> ['{ { { } } }', '{ { } { } }', '{ { } } { }', '{ } { { } }', '{ } { } { }']
```

반복문 형식으로 이진트리를 생성했는데, 좀 굼뜨다.

```python
def BracketCombinations(num):
  if num == 0: return 0

  visited = []
  stack = [ ('(',1,0) ]

  # 상태값을 가진 이진트리를 만들고, 완성된 조합 필터링
  # => open_cnt: s[1], close_cnt: s[2]
  while stack:
    curr = stack.pop()
    visited.append( curr[0] )
    if curr[1] < num:
      stack.append( (curr[0]+'(', curr[1]+1, curr[2]) )
    if curr[2] < num and curr[2] < curr[1]:
      stack.append( (curr[0]+')', curr[1], curr[2]+1) )

  # print('combinations:', ', '.join([ x for x in visited if len(x) == num*2 ]))
  return len([ x for x in visited if len(x) == num*2 ])

# keep this function call here
print(BracketCombinations(input()))
```

### 문제 34

[데코레이터 만들기](https://dojang.io/mod/page/view.php?id=2427)

```python
def trace(func):
    def wrapper():
        print(func.__name__, 'func head')
        func()
        print(func.__name__, 'func tail')
    return wrapper

def hello():
    print('hello!!')

@trace
def world():
    print('world!!')

trace_hello = trace(hello)
trace_hello()

world()
```

### 문제 35

[하노이의 탑 (재귀 알고리즘)](https://sikaleo.tistory.com/29)

- `hanoi(2,1,3,2)` 를 호출하면
  - `hanoi(1,1,2,3)` 1번째 재귀 이 때의 결과로 `1->2` 가 출력
  - `print(1,'->',3)` 실행 결과로 `1->3` 이 출력
  - `hanoi(1,2,3,1)` 2번째 재귀 결과로 `2->3` 이 출력

```python
def tower(n, src, dst, aux):
    if n == 0:
        return

    tower( n-1, src, aux, dst)
    print('move the disk', n, 'from', src, 'to', dst)
    tower( n-1, aux, dst, src)

tower(3, 'S','D','A')

## 결과
# move the disk 1 from S to D
# move the disk 2 from S to A
# move the disk 1 from D to A
# move the disk 3 from S to D
# move the disk 1 from A to S
# move the disk 2 from A to D
# move the disk 1 from S to D
```

### 문제 36

[배열로부터 바이너리트리 만들기](https://www.geeksforgeeks.org/binary-tree-array-implementation/)

배열의 첫번째를 root 로 삼아, `2**level` 크기로 children nodes 들이 binary 형태로 연결되어야 한다.

- Input: `[3,5,1,6,2,0,8,None,None,7,4]`
- `class Node { value, left, right }`

```python
class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.level = -1
    def __repr__(self):
        return f'Node[{self.val}]'

def binarytree(arr):
    # root
    nodes = [None]*len(arr)
    nodes[0] = Node(arr[0])
    nodes[0].level = 0

    # binary tree : 2 ** level
    idx = 0
    # level
    for i in range(1, MAX_LEVEL):
        # children
        for j in range(0, 2**i):
            idx += 1
            if idx >= len(arr):
                return nodes
            # print(idx, i, '-->', (idx-1)//2)

            # parent & child
            if nodes[(idx-1)//2]!= None and arr[idx] != None:
                parent = nodes[(idx-1)//2]
                nodes[idx] = Node(arr[idx])
                nodes[idx].level = i
                if idx%2 == 1:
                    parent.left = nodes[idx]
                else:
                    parent.right = nodes[idx]


arr = [3,5,1,6,2,0,8,None,None,7,4]
MAX_LEVEL = 10

nodes = binarytree(arr)

print(arr)
for n in nodes:
    if not n: continue
    print(f'(level={n.level})', n, '->', n.left, n.right)

## 결과
# [3, 5, 1, 6, 2, 0, 8, None, None, 7, 4]
# (level=0) Node[3] -> Node[5] Node[1]
# (level=1) Node[5] -> Node[6] Node[2]
# (level=1) Node[1] -> Node[0] Node[8]
# (level=2) Node[6] -> None None
# (level=2) Node[2] -> Node[7] Node[4]
# (level=2) Node[0] -> None None
# (level=2) Node[8] -> None None
# (level=3) Node[7] -> None None
# (level=3) Node[4] -> None None
```

### 문제 37

[배열로부터 바이너리트리 만들기](https://www.geeksforgeeks.org/binary-tree-array-implementation/)

[문제36](#문제-36) 과 반대로, `binary tree` 로부터 배열을 생성해 출력한다.

- child 의 index 는 parent(index)의 `(parent*2)+1`(왼쪽) 또는 `(parent*2)+1`(오른쪽) 이다.

```python
tree = [None] * 10

def root(key):
    if tree[0] != None:
        print('tree already had root')
    else:
        tree[0] = key

def set_left(key, parent):
    if tree[parent] == None:
        print(f'cannot set child[{key}] at', (parent*2)+1, ', no parent found')
    else:
        tree[ (parent*2)+1 ] = key

def set_right(key, parent):
    if tree[parent] == None:
        print(f'cannot set child[{key}] at', (parent*2)+2, ', no parent found')
    else:
        tree[ (parent*2)+2 ] = key

def print_tree():
    for i in range(10):
        if tree[i] != None:
            print(tree[i], end="")
        else:
            print('-', end='')
    print()

root('A')
set_right('C', 0)
set_left('D', 1)
set_right('E', 1)
set_right('F', 2)
print_tree()

## 결과
# cannot set child[D] at 3 , no parent found
# cannot set child[E] at 4 , no parent found
# A-C---F---
```

### 문제 38

[Binary Tree LCA 구하기](https://coderbyte.com/information/Binary%20Tree%20LCA)

Binary Tree 에서 LCA(공통 부모 노드) 를 구하는 문제

- [문제 36](#문제-36) 을 이용해 배열로부터 Binary Tree 를 생성하고
- Input: `[3,5,1,6,2,0,8,None,None,7,4]` 에 대해 `p=6, q=4` 의 LCA 구하기
- Output: 5

> 내가 쓴 코드 (5점)

자괴감 든다. (다른 사람들이 문제 푸는 머신들인건지, 내가 바보인건지)

```python
import json

class Node:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.level = -1
    def __repr__(self):
        return f'Node[{self.val}]'


MAX_LEVEL = 10

def binarytree(arr):
    # root
    nodes = [None]*len(arr)
    nodes[0] = Node(arr[0])
    nodes[0].level = 0

    # binary tree : 2 ** level
    idx = 0
    # level
    for i in range(1, MAX_LEVEL):
        # children
        for j in range(0, 2**i):
            idx += 1
            if idx >= len(arr):
                return nodes
            # print(idx, i, '-->', (idx-1)//2)

            # parent & child
            if nodes[(idx-1)//2]!= None and arr[idx] != None:
                parent = nodes[(idx-1)//2]
                nodes[idx] = Node(arr[idx])
                nodes[idx].level = i
                if idx%2 == 1:
                    parent.left = nodes[idx]
                else:
                    parent.right = nodes[idx]


def find_path(root, value):
    root.parent = None
    stack = [ root ]

    visit = []  # (child, parent)
    while stack:
        curr = stack.pop()
        # found
        if curr and curr.val == value:
            # trace parents
            path = [ curr ]
            while curr.parent:
                curr = curr.parent
                path.append( curr )
            # reverse path and extract values
            return [ path[i].val for i in range(len(path)-1, -1, -1) ]

        visit.append( curr )
        # left first search (must push left after right)
        if curr.right:
            curr.right.parent = curr
            stack.append( curr.right )
        if curr.left:
            curr.left.parent = curr
            stack.append( curr.left )
    return []

# root = nodes[0]
# print( find_path(root, 6) )
# print( find_path(root, 4) )

def find_lca(root, p, q):
  p_path = find_path(root, p)
  q_path = find_path(root, q)

  commons = []
  for i in range(min(len(p_path), len(q_path))):
      if p_path[i] == q_path[i]:
          commons.append( p_path[i] )
  return commons[-1] if commons else None


def BinaryTreeLCA(strArr):

  def parse_input(strArr):
    arr = json.loads( strArr[0].replace('#','null') )
    p, q = int(strArr[1]), int(strArr[2])
    return arr, p, q

  arr, p, q = parse_input(strArr)
  # print(arr, p, q)
  nodes = binarytree(arr)
  # print(nodes)
  lca = find_lca(nodes[0], p, q)
  return lca

# keep this function call here
strArr = ["[12, 5, 9, 6, 2, 0, 8, #, #, 7, 4, #, #, #, #]", "6", "4"]
print(BinaryTreeLCA(strArr))
# ==> 5
```

> 10점 만점짜리 답안은 이거다

```python
import math

def BinaryTreeLCA(strArr):
    [treeS, v1s, v2s] = strArr

    # eval 을 사용하자! (json 이나 ast 말고)
    v1 = eval(v1s)
    v2 = eval(v2s)
    tree = eval(treeS.replace("#", "None"))

    # p, q 위치(index)
    i1 = tree.index(v1)
    i2 = tree.index(v2)

    # 공통 부모라면 index 가 동일하다
    while i1 != i2:
        # 더 후위에 있는 index 를 binary search 하듯 계속 갱신
        if i1 > i2:
            i1 = math.floor((i1 - 1) / 2)
        else:
            i2 = math.floor((i2 - 1) / 2)

    return tree[i1]

strArr = ["[12, 5, 9, 6, 2, 0, 8, #, #, 7, 4, #, #, #, #]", "6", "4"]
print(BinaryTreeLCA(strArr))
# ==> 5
```

> 또 다른 코드 (이렇게 짰어야 했는데)

```python
def BinaryTreeLCA(strArr):
    # input
    traversal = [ num for num in strArr[0][1:-1].split(', ') ]
    for i, num in enumerate(traversal):
        if num != '#':
            traversal[i] = int(num)
    nodes = [ int(num) for num in strArr[1:] ]

    # find path of p, q
    node_paths = []
    for node in nodes:
        # 경로를 역순으로 저장했음 (스택)
        node_paths.append( find_path(traversal, node) )

    # find common
    common = traversal[0]
    while node_paths[0] and node_paths[1]:
        # 역순으로 되어 있다. [-1]을 비교
        if node_paths[0][-1] != node_paths[1][-1]:
            break
        common = node_paths[0][-1]
        node_paths[0].pop()
        node_paths[1].pop()
    return common

def find_path(traversal, node):
    path = [node]
    index = traversal.index(node)
    while index > 0:
        # 2의 배수 형태로 줄여가며 path 저장
        index = (index-1)//2
        path.append( traversal[index] )
    return path
```

### 문제 39

[파이썬 findall() 메서드](https://velog.io/@beanlove97/%ED%8C%8C%EC%9D%B4%EC%8D%AC-findall-%EB%A9%94%EC%84%9C%EB%93%9C)

패턴을 모두 찾아 리스트로 반환한다

- `search` 문이나 `match` 문은 제대로 찾았는지 확인하는 절차가 따로 필요하지만
- `findall()` 메서드로 찾으면 결과값이 빈 리스트로 `[]` 로 나온다
- 문자열 함수에 `findall()` 은 없음

```python
import re

number = 'My number is 511223-1****** and yours is 521012-2******'
print( re.findall(r'\d{6}', number) )
# ==> ['511223', '521012']

sentence = 'I love a lovely dog, really. I am not telling a lie.'
print( re.findall(r'\w+ly', sentence) )
# ==> ['lovely', 'really']
```

### 문제 40

[얕은 복사 vs 깊은 복사](https://wikidocs.net/16038)

> 얕은 복사 `arr[:]`

```python
a = [ [1,2], [3,4] ]

# 포인터만 복사되었음 (내부 리스트 객체는 복사 안됨)
b = a[:]

print( id(a[0]), id(b[0]), id(a[0])==id(b[0]) )
# ==> 4600378752 4600378752 True

a[1].append(5)
print( a[1], b[1], a==b )
# ==> [3, 4, 5] [3, 4, 5] True
```

> 깊은 복사 `copy.deepcopy`

```python
import copy

a = [[1,2],[3,4]]

# 내부 가변객체들까지 모두 새로 생성
b = copy.deepcopy(a)

a[1].append(5)
print( a[1], b[1], a==b )
# ==> [3, 4, 5] [3, 4] False
```

### 추가: `for/while + else`

반복문 내에서 `break` 없이 정상적으로 나온 경우 `else` 문을 실행

> 반복 완료 여부를 위한 상태값을 사용한 코드

```python
data = [2, 4, 5, 11, 3]

found = False
for i in data:
	if i > 10:
		found = True
        break

if found == False:
	print('10 보다 큰 수 없음')
```

> else 문 사용시 코드

```python
data = [2, 4, 5, 11, 3]
for i in data:
	if i > 10:
		break
else:
	print('10 보다 큰 수 없음')
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
