---
date: 2022-06-07 00:00:00 +0000
title: "Python 코딩테스트 01~10"
categories: ["python", "코딩테스트"]
tags: ["dmoj"]
---

> 파이썬 코딩테스트 준비를 하며 공부한 내용을 기록하고 복습합니다.
{: .prompt-tip }

## 코딩테스트 참고자료

- 사이트(무료) [DMOJ](https://dmoj.ca/), [USA Computing Olympiad](http://usaco.org/)
- 책 [코딩 테스트로 시작하는 파이썬 프로그래밍](https://www.youngjin.com/book/book_detail.asp?prod_cd=9788931466010&seq=7029&cate_cd=1&child_cate_cd=9&goPage=1&orderByCd=1)

## 파이썬 코딩테스트

### 문제01

[DMOPC '15 Contest 7 P2 - Not a Wall of Text](https://dmoj.ca/problem/dmopc15c7p2)

문자열을 공백으로 잘라 배열로 만드는 것보다, 공백을 카운팅 하는게 더 빠름

> 내가 제출한 코드

```python
s = input()
print(len(s.split()))
```

> 다른 제출자 코드

```python
in_string = input()
word_count = in_string.count(' ') + 1
print(word_count)
```

### 문제02

[DMOPC '14 Contest 5 P1 - Core Drill](https://dmoj.ca/problem/dmopc14c5p1)

1 ~ 100 사이의 입력값 처리는 안했고, 정수형(int) 변환이 핵심

> 내가 제출한 코드

```python
# input 파라미터로 입력창 라벨을 설정할 수 있음
# ==> 다른 텍스트가 감지되면 채점을 하지 못함
r = int(input(""))   # int(input("r: "))
h = int(input(""))   # int(input("h: "))

import math
v = (math.pi * r**2 * h)/3
print(f'{v:.2f}')
```

> 다른 제출자 코드

```python
PI = 3.141592653589793
r = int(input(""))
h = int(input(""))
print((PI*r**2*h)/3)
```

### 문제03

[CCC '19 J1 - Winning Score](https://dmoj.ca/problem/ccc19j1)

`if` 문에 의한 승리팀 판별이 핵심

> 내가 제출한 코드

```python
# print('Enter Three numbers (0~100)')
# a_points = list(map(int, input("A points: ").split()))
# b_points = list(map(int, input("B points: ").split()))

a_p3 = int(input(""))
a_p2 = int(input(""))
a_p1 = int(input(""))
b_p3 = int(input(""))
b_p2 = int(input(""))
b_p1 = int(input(""))

a_score = a_p3 * 3 + a_p2 * 2 + a_p1
b_score = b_p3 * 3 + b_p2 * 2 + b_p1
if a_score > b_score:
    print('A')
elif b_score > a_score:
    print('B')
else:
    print('T')
```

> 다른 제출자 코드

```python
# 입력 받으면서 총점을 계산하도록 함수로 정리
def calculate_score():
    score = 0
    i = 3
    while i > 0:
        score += int(input()) * i
        i -= 1
    return score

# 가독성 Good!
apple = calculate_score()
banana = calculate_score()

if apple > banana:
    print('A')
elif banana > apple:
    print('B')
else:
    print('T')
```

### 문제04

[CCC '18 J1 - Telemarketer or not?](https://dmoj.ca/problem/ccc18j1)

모든 테스트를 통과 못함. 왜지? 그리고 다른 이들의 코드를 볼 수 없음

> 내가 제출한 코드

```python
phonenumber_size = 4
def get_phonenumber() -> list:
    global phonenumber_size
    phonenumber = []
    for _ in range(phonenumber_size):
        phonenumber.append(int(input(""))%10)
    return phonenumber

pn = get_phonenumber()

if len(pn) != 4:
    raise ValueError('phonenumber must have 4-digit')
elif pn[0] in (8,9) and pn[-1] in (8,9):
    if pn[1] == pn[2]:
        print('ignore')
else:
    print('answer')
```

> 다른 제출자 코드

```python

```

### 문제05

[COCI '06 Contest 5 #1 Trik](https://dmoj.ca/problem/coci06c5p1)

쓸데없는 값 체크 코드 넣지 말자! (시간 없다)<br>
변경된 컵의 배열 상태 또는 볼의 위치를 유지하는게 핵심

> 내가 제출한 코드

```python
# 새로운 컵 배열을 반환
def change_ball(cups, c):
    if c == 'A':
        cups = [ cups[1], cups[0], cups[2] ]
    elif c == 'B':
        cups = [ cups[0], cups[2], cups[1] ]
    elif c == 'C':
        cups = [ cups[2], cups[1], cups[0] ]
    return cups

changes = [x.upper() for x in input() if x.upper() in ('A','B','C')][:50]
cups = [1, 0, 0]

# 루프 횟수가 정해진 경우 for 문을 사용
for c in changes:
    cups = change_ball(cups, c)

# 왼쪽부터 1, 2, 3
print(cups.index(1)+1)
```

> 다른 제출자 코드

```python
swaps = input()

ball_location = 1

for swap_type in swaps:
    if swap_type == 'A' and ball_location == 1:
        ball_location = 2
    elif swap_type == 'A' and ball_location == 2:
        ball_location = 1
    elif swap_type == 'B' and ball_location == 2:
        ball_location = 3
    elif swap_type == 'B' and ball_location == 3:
        ball_location = 2
    elif swap_type == 'C' and ball_location == 1:
        ball_location = 3
    elif swap_type == 'C' and ball_location == 3:
        ball_location = 1

print(ball_location)
```

### 문제06

[CCC '18 J2 - Occupy parking](https://dmoj.ca/problem/ccc18j2)

어제, 오늘 모두 주차된 자리의 개수를 출력하는게 포인트 (문제를 잘 읽자)

> 내가 제출한 코드

```python
n = int(input())
yesterday = [ 1 if x == 'C' else 0 for x in input()[:n] ]
today = [ 1 if x == 'C' else 0 for x in input()[:n] ]

checked = [ sum(x) for x in zip(yesterday, today) ]
print(checked.count(2))
```

> 다른 제출자 코드

```python
N = int(input())
yesterday = input()
today = input()

occupied = 0

# 동일한 for 문 아래에서 어제와 오늘을 비교하여 바로 카운팅
for i in range(N):
    if yesterday [i] == 'C' and today [i] == 'C':
        occupied = occupied + 1

print(occupied)
```

### 문제07

[COCI '16 Contest 1 #1 Tarifa](https://dmoj.ca/problem/coci16c1p1)

이런 데이터 용량제가 있을리 없다는 생각에 지문 이해가 잘 안되었음.

> 내가 제출한 코드

```python
d_size = int(input())
months = int(input())

d_used = []
d_remains = 0
for _ in range(months):
    d_used = int(input())
    d_remains += d_size - d_used

# 다음달 사용 가능한 데이터량
print(d_remains + d_size)
```

> 다른 제출자 코드

```python
mb = int(input())
month = int(input())
excess = 0

for x in range(month):
    cost = int(input())
    excess = excess + mb - cost
print(excess + mb)
```

### 문제08

[CCC '00 S1 - Slot Machines](https://dmoj.ca/problem/ccc00s1)

빨리 푸는게 장땡이니깐. (굳이 클래스 안써도)

> 내가 제출한 코드

```python
class Slotmachine:
    def __init__(self, limit:int, earn:int):
        self.limit = limit
        self.earn = earn
        self.played = 0
    def set_played(self, played):
        self.played = played
    def play(self):
        self.played += 1
        if self.played > 0 and self.played % self.limit == 0:
            return self.earn
        return 0

money = int(input())
machines = [ Slotmachine(35,30), Slotmachine(100,60), Slotmachine(10,9) ]
for m in machines:
    m.set_played(int(input()))

played = -1
while money > 0:
    money -= 1
    played += 1
    money += machines[played%len(machines)].play()

print(f'Martha plays {played+1} times before going broke.')
```

> 다른 제출자 코드

```python
quarters = int(input())
first = int(input())
second = int(input())
third = int(input())
plays = 0
machine = 0

while quarters >=1:
    quarters=quarters-1
    if machine ==0:
        first = first +1
        if first ==35:
            first = 0
            quarters =quarters+30
    elif machine ==1:
        second = second +1
        if second ==100:
            second =0
            quarters =quarters +60
    elif machine ==2:
        third = third +1
        if third ==10:
            third = 0
            quarters = quarters+9
    plays = plays +1
    machine = machine +1
    if machine ==3:
        machine = 0
print('Martha plays', plays, 'times before going broke.')
```

### 문제09

[CCC '08 J2 - Do the Shuffle](https://dmoj.ca/problem/ccc08j2)

가독성 좋으라고 `namedtuple` 사용함 (단순 tuple로 해도 괜춘)<br>
다른 제출자는 문자열과 슬라이싱을 사용함

> 내가 제출한 코드

```python
from collections import namedtuple
Button = namedtuple('Button', ['index','count'])

pressed = []
while True:
    index = int(input())
    count = int(input())
    if index == 4 and count == 1:
        break
    pressed.append(Button(index, count))

songs = ['A','B','C','D','E']

for p in pressed:
    for _ in range(p.count):
        if p.index == 1:
            temp = songs.pop(0)
            songs.append(temp)
        elif p.index == 2:
            temp = songs.pop(-1)
            songs.insert(0,temp)  # 파라미터 위치에 주의
        elif p.index == 3:
            temp = songs.pop(1)
            songs.insert(0,temp)
        # else: p.index==4

print(' '.join(songs))
```

> 다른 제출자 코드

```python
songs = 'ABCDE'
button = 0

while button != 4:
    button = int(input())
    num_times = int(input())

    for i in range(num_times):
        if button == 1:
            songs = songs[1:] + songs[0]
        elif button == 2:
            songs = songs[-1] + songs[:-1]
        elif button == 3:
            songs = songs[1] + songs[0] + songs[2:]

output = ''
for char in songs:
    output = output + char + ' '
print(output)
```

### 문제10

[COCI '08 Contest 3 #2 Kemija](https://dmoj.ca/problem/coci08c3p2)

다른 제출자는 참신한 생각을 했다

> 내가 제출한 코드

```python
original = input()

vowels = ('a','e','i','o','u',)
decoded = ''
index = 0
while index < len(original):
    decoded += original[index]
    # 모음 뒤에 'p+동일모음'이 추가된 형태 ==> +2
    if original[index] in vowels:
        index += 2
    index += 1

print(decoded)
```

> 다른 제출자 코드

```python
a=input()
b=a.replace("apa","a")
c=b.replace("epe","e")
d=c.replace("ipi","i")
e=d.replace("opo","o")
f=e.replace("upu","u")
print(f)
```

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

> `numpy` 이용하기

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
    curr, next = 0, 1
    for i in range(2,n+1):
        yield curr
        curr, next = next, next + 1

print(fib(10))
# ==> 55
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

> **끝!** 읽어주셔서 감사합니다.
{: .prompt-info }
