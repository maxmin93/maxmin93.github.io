---
date: 2022-06-07 00:00:00 +0900
title: Python 코딩테스트 연습문제 01~10
description: 파이썬 코딩테스트 준비를 하며 공부한 내용을 기록하고 복습합니다.
categories: [Language, Python]
tags: [dmoj, 코딩테스트]
image: https://media.licdn.com/dms/image/v2/C4D1BAQG7YbBjqFK1uw/company-background_10000/company-background_10000/0/1583674843233/dmoj_cover?e=2147483647&v=beta&t=9aZhG7toXaBf8_FRw7UERNZmOr_UwrUVbubHMcUa1Y0
---

## 코딩테스트 참고자료

- 사이트(무료) [DMOJ](https://dmoj.ca/), [USA Computing Olympiad](http://usaco.org/)
- 책 [코딩 테스트로 시작하는 파이썬 프로그래밍](https://www.youngjin.com/book/book_detail.asp?prod_cd=9788931466010&seq=7029&cate_cd=1&child_cate_cd=9&goPage=1&orderByCd=1)

## 파이썬 코딩테스트

### 문제01

[DMOPC '15 Contest 7 P2 - Not a Wall of Text](https://dmoj.ca/problem/dmopc15c7p2)

문자열을 공백으로 잘라 배열로 만드는 것보다, 공백을 카운팅 하는게 더 빠름

### 문제03

[CCC '19 J1 - Winning Score](https://dmoj.ca/problem/ccc19j1)

가능하면 입력 받으면서 총점을 계산하도록 작성할 것 (속도와 로직)

- 데이터 입력과 동시에 자료구조 생성 (대부분 배열로 해결됨)
- 비교 상황/조건에 대한 데이터 가공
- 판별 또는 비교로 결과 출력

### 문제04

[CCC '18 J1 - Telemarketer or not?](https://dmoj.ca/problem/ccc18j1)

문자열의 특정 패턴의 추출 유형의 문제는 re 정규식 사용이 옳다.

### 문제05

[COCI '06 Contest 5 #1 Trik](https://dmoj.ca/problem/coci06c5p1)

쓸데없는 값 체크 코드 넣지 말자! (시간 없다)

### 문제06

[CCC '18 J2 - Occupy parking](https://dmoj.ca/problem/ccc18j2)

어제, 오늘 모두 주차된 자리의 개수를 출력하는게 포인트 (문제를 잘 읽자)

- 상태값을 배열로 표현
    + 코딩테스트는 시간 제한이 있어서 단순한게 정답

### 문제07

[COCI '16 Contest 1 #1 Tarifa](https://dmoj.ca/problem/coci16c1p1)

- 계산식 문제는 한 문장으로 기술할 수 있는 정도가 맞다
    + 단순, 명료하게 생각해라 (문제를 다시 읽어봐라)

```python
for x in range(month):
    cost = int(input())
    excess = excess + mb - cost  # <== 출제 의도
print(excess + mb)
```

### 문제08

[CCC '00 S1 - Slot Machines](https://dmoj.ca/problem/ccc00s1)

빨리 푸는게 장땡이니깐. (굳이 클래스 안써도)

- 슬롯머신의 경우 각각의 상태를 정의하는 자료구조 필요
    + '배열 + 사전'으로 표현 안되면, 클래스 고려
- 상태를 조작하는 action 은 대부분 공통으로 적용된다
    + 난이도 '상' 아닌 이상 바깥에서 처리 가능

### 문제09

[CCC '08 J2 - Do the Shuffle](https://dmoj.ca/problem/ccc08j2)

문제에 자료구조가 문자열로 서술된 경우 문자열로 푸는게 옳다.

- 플레이 순서가 문자열로 표현되었고 배열로 조작하여 풀었음

### 문제10

[COCI '08 Contest 3 #2 Kemija](https://dmoj.ca/problem/coci08c3p2)

다른 제출자는 참신한 생각을 했다

- 문제 상황이 다른 상황과 식별되는 식별자 'p' 가 제시되었다
- 식별자를 기준으로 처리 대상을 규정하는 것이 포인트
    + 식별자 'p'가 포함되는 5가지 패턴만 다루면 됨

### 참고 코드

#### 이중 배열의 열과 줄 바꾸기 (Transpose 2D List)

> `map` 과 `zip` 이용하기

```python
list2d = [[1,2,3], [4,5,6], [7], [8,9]]

# Transpose 2D array as shortest len
print( list(map(list, zip(*list2d))) )
# ==> [[1, 4, 7, 8]]

# Transpose 2D array with None
import itertools
print( list(map(list, itertools.zip_longest(*list2d, fillvalue=None))) )
# ==> [[1, 4, 7, 8], [2, 5, None, 9], [3, 6, None, None]]
```

> numpy + pandas 이용하기 

- 3 ~ 5배 정도 느려진다. 하지만 [pandas](https://pandas.pydata.org/docs/) 사용으로 코드가 짧아짐
    + [arrow](https://arrow.apache.org/docs/python/api.html) 를 연습해보자

```python
import numpy as np
import pandas as pd

l_2d = [[0, 1, 2], [3, 4, 5]]

arr_t = np.array(l_2d).T

print(arr_t)
print(type(arr_t))
# [[0 3]
#  [1 4]
#  [2 5]]
# <class 'numpy.ndarray'>

l_2d_t = np.array(l_2d).T.tolist()

print(l_2d_t)
print(type(l_2d_t))
# [[0, 3], [1, 4], [2, 5]]
# <class 'list'>
```

#### 피보나치 구하기

피보나치 수열의 점화식

- F(1) = 1, F(2) = 1
- F(n) = F(n-1) + F(n-2)

> 재귀함수 방식

```python
def fib(n):
    if n == 0:
        return 0
    elif n == 1 or n == 2:
        return 1
    else:
        return fib(n-1) + fib(n-2)

print(fib(5))
# ==> 10
```

> 제너레이트 방식

```python
def fib(n):
    curr, next = 1, 2
    for i in range(2, n+1):
        yield i, curr  # (index, value,)
        curr, next = next, curr + next

###################################

for i, v in fib(10):
    pass
    
print(f"count={i}, result={v}")
# count=10, result=55

###################################

gen = fib(10)

# StopIteration ==> None
while (r := next(gen, None)) is not None:
    print(f"count={r[0]}, result={r[1]}")

# count=2, result=1
# count=3, result=2
# count=4, result=3
# count=5, result=5
# count=6, result=8
# count=7, result=13
# count=8, result=21
# count=9, result=34
# count=10, result=55
```

> 동적프로그래밍 방식 (하향식)

```python
max_n = 10
dp = [0]*(max_n+1)
dp[1], dp[2] = 1, 1

# 가져다 쓰되, 하위 값이 없으면 그때 계산
def fib_down(n):
    if dp[n] == 0:
        dp[n] = fib(n-1) + fib(n-2)
    return dp[n]

# 하위 값을 미리 계산해 둔다
for i in range(2, max_n+1):
    fib_down(i)

print( dp )
print( dp[10] )
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
# ==> 55
```

> 동적프로그래밍 방식 (상향식)

```python
# 계산하면서 올라가는 방식
def fib_up(n):
    dp = [0] * (n+1)
    dp[1], dp[2] = 1, 1

    # 작은 값(소문제)부터 직접 계산하며 진행
    for i in range(2,n+1):
        dp[i] = dp[i-1] + dp[i-2]

    print(dp)
    return dp[n]

print(fib_up(10))
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55]
# ==> 55
```

#### 난수

```python
import random

random.seed(a=None)             # 현재시간 사용 (안해도 되는듯)
# random.seed(100)              # 동일 난수

print(random.randint(1,100))    # 정수형 난수값
print(random.uniform(1,10))     # 실수형 난수값
print(random.random())          # 난수값 (0~1)

actors = ['James', 'Jane', 'Bruce']
print(random.choice(actors))    # 임의 선택

random.shuffle(actors)          # 임의 섞기
print(actors)
print(random.sample(actors,2))  # 임의 선택
```

#### 파일 읽기

```python
# 1) read 이후 라인 자르기
f = open('/Users/bgmin/Downloads/word_bronze_jan20/1.in', 'rt', encoding='utf-8')  # Open file with 'UTF-8' 인코딩
with f:
    text = f.read()
lines = list(filter(None, text.split('\n')))  # 라인단위로 분해
print(lines)
# ==> ['10 7', 'hello my name is Bessie and this is my essay']

# 2) readlines 이후 개행문자 지우기
f = open('/Users/bgmin/Downloads/word_bronze_jan20/1.in', 'rt', encoding='utf-8')  # Open file with 'UTF-8' 인코딩
with f:
    lines = f.readlines()
print(list(map(lambda x: x.rstrip(), lines)))
# ==> ['10 7', 'hello my name is Bessie and this is my essay']

# 3) line 단위로 읽기
f = open('/Users/bgmin/Downloads/word_bronze_jan20/1.in', 'rt', encoding='utf-8')  # Open file with 'UTF-8' 인코딩
lines = []
with f:
    while True:
        line = f.readline().rstrip()
        if not line: break
        lines.append(line)
print(lines)
# ==> ['10 7', 'hello my name is Bessie and this is my essay']

# 4) csv로 읽기
import csv
f = open('/Users/bgmin/Downloads/word_bronze_jan20/1.in', 'rt', encoding='utf-8')  # Open file with 'UTF-8' 인코딩
reader = csv.reader(f, delimiter=' ')
next(reader)    # 헤더라인 skip… 필요한 경우 사용한다.
for line in reader:
    print(line)
f.close()
# ==> ['hello', 'my', 'name', 'is', 'Bessie', 'and', 'this', 'is', 'my', 'essay']
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
