---
date: 2022-06-14 00:00:00 +0900
title: Python 코딩테스트 연습문제 61~70
description: 파이썬 코딩테스트 준비를 하며 공부한 내용을 기록하고 복습합니다.
categories: [Language, Python]
tags: [coderbyte, 코딩테스트]
image: https://coderbytestaticimages.s3.amazonaws.com/consumer-v2/nav/coderbyte_logo_digital_multi_light.png
---

## 참고자료

- [coderbyte](https://coderbyte.com/)

## 파이썬 코딩테스트

### 문제 61

[Three Points](https://coderbyte.com/information/Three%20Points)

데카르트 좌표계에 라인 그리기<br>
세번째 점이 앞의 두점에 의한 라인보다 오른쪽 또는 왼쪽인지를 출력하라<br>
직선 함수: `Y = (y2-y1)/(x2-x1) * (X - x1) + y1`<br>
(단, 직선의 기울기에 따라 왼쪽, 오른쪽 판단이 달라진다)

- Input: ["(1,1)", "(3,3)", "(2,0)"]
  - Output: right
- Input: ["(0,-3)", "(-2,0)", "(0,0)"]
  - Output: right
- Input: ["(0,0)", "(0,5)", "(0,2)"]
  - Output: neither

> 내가 제출한 코드 (2점)

테스트케이스 6개 실패

- ["(0,0)", "(0,5)", "(-2,2)"] => left
- ["(0,0)", "(0,100)", "(-200,5)"] => left
- ["(0,1)", "(-3,0)", "(-1,0)"] => left
- ["(0,5)", "(0,-5)", "(1,1)"] => left
- ["(100,100)", "(-1,-1)", "(5,1)"] => left
- ["(5000,5001)", "(-5001,-5000)", "(0,601)"] => right

```python
def ThreePoints(strArr):
  points = [ eval(x) for x in strArr ]
  line = sorted(points[:2])
  # print( line )

  angle = 0 if line[1][0] == line[0][0] else \
      (line[1][1]-line[0][1]) / (line[1][0]-line[0][0])

  y1 = angle * (points[-1][0] - line[0][0]) + line[0][1]
  y2 = points[-1][1]

  # 각도가 0 또는 같으면 neither
  # 양의 기울기에서 y2가 작으면 오른쪽, 음의 기울기면 왼쪽
  if angle == 0:
    return 'neither'
  elif y1 < y2:
    return 'left' if angle > 0 else 'right'
  elif y1 > y2:
    return 'right' if angle > 0 else 'left'
  return 'neither'

# keep this function call here
print(ThreePoints(input()))
```

> 다른 사람의 코드

문제를 통해 수식을 도출할 수준이 아니다. 이런건 건너뛰자.

```python
def ThreePoints(strArr):
  points = [eval(raw_point) for raw_point in strArr]
  a,b,c = points

  # 벡터곱(선형대수학) : 두 벡터의 크기곱 x sin 함수(외적방향)
  cross_product =  (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
  # sin 함수는 180 도 단위로 양이면 왼쪽, 음이면 오른쪽 방향
  # 같거나 평행이면 0
  if cross_product > 0:
    return 'left'
  elif cross_product < 0:
    return 'right'
  return 'neither'

# keep this function call here
print(ThreePoints(input()))
```

### 문제 62

[Character Removal](https://coderbyte.com/information/Character%20Removal)

사전에 있는 단어 중 하나와 일치하도록<br>
단어에서 제거할 수 있는 최소 문자 수를 결정 (못찾으면 -1)

- Input: ["worlcde", "apple,bat,cat,goodbye,hello,yellow,why,world"]
  - Output: 2 (c 와 e 제거 => world)
- Input: ["baseball", "a,all,b,ball,bas,base,cat,code,d,e,quit,z"]
  - Output: 4
- Input: ["apbpleeeef", "a,ab,abc,abcg,b,c,dog,e,efd,zzzz"]
  - Output: 8

> 내가 제출한 코드

Counter 의 subtract 기능 때문에 손쉽게 풀었다.<br>
그렇지만 테스트케이스 2개를 실패했다. (4점)<br>
제거될 문자셋을 제거한 후가 사전의 단어와 같아져야 하는데 체크 안함<br>
이후 버전에서도, 여러번 나타난 문자의 어느 것을 제거해야 하는지 몰라 체크 안됨

- ["apbpleeeef", "a,abc,abcg,b,c,dog,e,efd,zzzz"] => 9
- ["wrdlmaeo", "a,b,c,d,ap,apple,bar,bat,cat,hello,y,yellow,w,wo,world,worr"] => 6

```python
import collections

def CharacterRemoval(strArr):
  word = strArr[0]
  dic_arr = strArr[1].split(',')

  def diff_chars(t, s):
    t_set = collections.Counter(list(t))
    s_set = collections.Counter(list(s))
    subtract_set = t_set - s_set
    # print(t, s, '=>', subtract_set)
    return sum([ i for i in subtract_set.values() if i > 0 ])

  subs = [ diff_chars(word, s) for s in dic_arr ]
  min_len = min(subs)
  return min_len if min_len < len(word) else -1

# keep this function call here
print(CharacterRemoval(input()))
```

> 다른 사람의 코드

사전이 알파벳순으로 정렬되어 있다는 점을 활용했다.<br>
단어의 철자를 컴비네이션(조합)하여 사전과 비교했음<br>
순서를 유지한 컴비네이션이기 때문에 원본의 문자열 순서를 훼손하지 않음

- `permutations` (순열) : `순서` 를 나열 (위치가 중요할 때)
- `combinations` (조합) : `모음` 을 나열 (원소의 구성만 필요할 때)

```python
from itertools import combinations

def CharacterRemoval(strArr):
  # word 길이에 대해
  for i in range(len(strArr[0])):
    # 순차적으로 조합된 글자(번호)를 늘려가며
    for iToDel in combinations( range(len(strArr[0])), i):
      # 조합된 글자를 뺀 새로운 글자를 만들어 사전과 비교
      newWord = ''.join([ strArr[0][j] for j in range(len(strArr[0])) if not j in iToDel ])
      # 사전과 매치된 상태의 삭제 글자수(i)를 반환
      if newWord in strArr[1].split(','):
        return i
  return -1

# keep this function call here
print(CharacterRemoval(input()))
```

### 문제 63

[Simple Password](https://coderbyte.com/information/Simple%20Password)

문자열이 유효한 패스워드인지 판단

1. It must have a capital letter.
2. It must contain at least one number.
3. It must contain a punctuation mark or mathematical symbol.
4. It cannot have the word "password" in the string.
5. It must be longer than 7 characters and shorter than 31 characters.

- Input: "apple!M7"
  - Output: true
- Input: "passWord123!!!!"
  - Output: false
- Input: "turkey90AAA="
  - Output: true

> 내가 제출한 코드

- `all()` 은 모든 항목이 True 이면 True 반환
- `any()` 은 항목 하나라도 True 이면 True 반환

```python
import re

def SimplePassword(strParam):
  check = {
    'capital': bool( re.findall(r'[A-Z]+',strParam) ),
    'number': bool( re.findall(r'\d+',strParam) ),
    'symbol': bool( re.findall(r'[\!-\+|\?\=]+',strParam) ),
    'password': not bool('password' in strParam.lower()),
    'length': 7 < len(strParam) < 31
  }
  # print(check, '=>', all(check.values()))

  # code goes here
  return 'true' if all(check.values()) else 'false'

# keep this function call here
print(SimplePassword(input()))
```

### 문제 64

[Preorder Traversal](https://coderbyte.com/information/Preorder%20Traversal)

바이너리 트리 왼쪽부터 순회하기

- Input: ["5", "2", "6", "1", "9", "#", "8", "#", "#", "#", "#", "4", "#"]
  - Output: 5 2 1 9 6 8 4
- Input: ["4", "1", "5", "2", "#", "#", "#"]
  - Output: 4 1 2 5
- Input: ["2", "6", "#"]
  - Output: 2 6

> 내가 제출한 코드

테스트케이스 1개 실패 (4점)

- ["5", "2", "6", "1", "9", "#", "8", "#", "#", "#", "#", "4", "#"]
  - Output: 5 2 1 9 6 8 4
  - 이건 예제가 잘못된듯. '#'이 두개 빠진듯 싶다.
  - 다른 코드들도 대부분 4점 (심지어 위 예제만 예외처리까지)

```python
def PreorderTraversal(strArr):

  def travel(idx, path):
    if strArr[idx] != '#':
      path.append(strArr[idx])

    # children from left
    if idx*2+1 < len(strArr):
      travel(idx*2+1, path)
    if idx*2+2 < len(strArr):
      travel(idx*2+2, path)

  path = []
  travel(0, path)
  return ' '.join(path)

# keep this function call here
print(PreorderTraversal(input()))
```

### 문제 65

[String Zigzag](https://coderbyte.com/information/String%20Zigzag)

지그재그 방향으로 문자열 인쇄

- Input: ["coderbyte", "3"]
  - Output: creoebtdy
  - 3줄에 걸쳐서 W 모양으로 인쇄되는 순서대로 한줄에 출력

```text
c       r       e
  o   e   b   t
    d       y
```

- Input: ["cat", "5"]
  - Output: cat
- Input: ["kaamvjjfl", "4"]
  - Output: kja jfavlm

> 내가 제출한 코드 (4점)

테스트케이스 1개 실패

- ["aeettym", "1"] => aeettym

```python
def StringZigzag(strArr):
  arr = strArr[0]
  N = int(strArr[1])

  # first lines = i + 2*(N-1)*j
  # middle lines = first + 2*(N-1-i), i + 2*(N-1)*j
  # last lines = i + 2*(N-1)*j

  result = []
  for i in range(N):
    j = 0
    pos = i + (2*(N-1) * j)
    while pos < len(arr):
      # print('rest:', i, j, '=>', pos)
      # first and last
      result.append( arr[pos] )

      # middle line
      if N > 2 and (0 < i < N-1):
        mid_pos = pos + 2*(N-1-i)
        # print('mid:', i, j, '=>', mid_pos)
        if mid_pos < len(arr):
          result.append( arr[mid_pos] )

      # next
      j += 1
      pos = i + (2*(N-1) * j)

  # code goes here
  return ''.join(result)

# keep this function call here
print(StringZigzag(input()))
```

> 다른 사람의 코드

내가 규칙관련 수식을 열심히 만들 동안, 이 사람은 자료구조 변경으로 해결<br>
바보짓 하지 말자. 미련하게 끌지도 말자.

```python
def StringZigzag(strArr):
  S = strArr[0]
  N = int(strArr[1])

  # 예외 처리
  if N == 1:
    return S

  # 매트릭스
  rows = [[] for _ in range(N)]

  row_cursor = 0
  step = 1
  for i, s in enumerate(S):
    rows[row_cursor].append(s)
    # 상단에서는 아래 방향으로
    if row_cursor == 0:
      step = 1
    # 하단에서는 위 방향으로
    if row_cursor == N - 1:
      step = -1
    # 줄 변경
    row_cursor += step

  # 매트릭스를 한줄로 연결
  output = ""
  for r in rows:
    output = f"{output}{''.join(r)}"

  return output

# keep this function call here
print(StringZigzag(input()))
```

### 문제 66

[Counting Anagrams](https://coderbyte.com/information/Counting%20Anagrams)

문자열에 얼마나 많은 Anagrams 이 있는지 개수 세기<br>
(Anagram 문자: cars and arcs)

- Input: "aa aa odg dog gdo"
  - Output: 2
  - => "dog"와 "gdo"는 "odg"의 anagram (단, "aa"는 반복 문자라서 안됨)
- Input: "a c b c run urn urn"
  - Output: 1

> 내가 제출한 코드 (15)

```python
import collections
import itertools

def CountingAnagrams(strParam):
  arr = set([ x for x in strParam.split() if len(x) > 1 ])
  arr_counter = [
    tuple( sorted(collections.Counter(list(x)).items()) ) for x in arr
  ]
  # print(arr_counter)

  # 컴비네이션 사용하면, 카운트 값이 이상하게 꼬여버린다.
  count = 0
  for i in range(len(arr_counter)):
    for j in range(i+1, len(arr_counter)):
      if arr_counter[i] == arr_counter[j]:
        count += 1
        break   # 왜 이래야 하는지 모르겠지만, 예제가 그러니

  return count

# keep this function call here
print(CountingAnagrams(input()))
```

> 다른 사람의 코드

```python
from itertools import permutations

def CountingAnagrams(str):
  words = str.split()
  count = 0
  # 하나씩 빼면서 나머지 문자열들과 비교
  while words:
    test = words.pop()
    # 모든 순열에 대해 test 와 일치하는 문자열이 있으면 +1
    if test not in words and test in (
        ''.join(p) for word in words for p in permutations(word)
    ):
      count += 1
  return count

# keep this function call here
print(CountingAnagrams(input()))
```

### 문제 67

[Maximal Square](https://coderbyte.com/information/Maximal%20Square)

'1'로 채워진 가장 큰 정사각형 부분행렬에 대한 넓이를 탐색

- Input: ["10100", "10111", "11111", "10010"]
  - Output: 4 => 정사각형 2x2

```text
1 0 1 0 0
1 0 1 1 1
1 1 1 1 1
1 0 0 1 0
```

- Input: ["0111", "1111", "1111", "1111"]
  - Output: 9
- Input: ["0111", "1101", "0111"]
  - Output: 1

> 내가 작성한 코드

- `주의!!` : 이렇게 작성하면 객체가 얕은복사 되어 모든 열이 연결되어 변경된다.
  - 2D 리스트 영(0) 채우기 : `mat_new = [ [0]*M ]*N`
  - ==> 바른 표기 : `mat_new = [ [0] * M for _ in range(N) ]`

```python
def MaximalSquare(strArr):
  N = len(strArr)
  M = len(strArr[0])

  mat_old = [ [int(x) for x in line ] for line in strArr ]
  mat_new = [ [0] * M for _ in range(N) ]

  # for dimensions, loop for i for j
  for d in range(1, min(N,M)):
    for i in range(d, N):
      for j in range(d, M):
        box = sum([
          mat_old[i-1][j-1], mat_old[i-1][j], mat_old[i][j-1], mat_old[i][j]
          ])
        mat_new[i][j] = 1 if box == 4 else 0

    # for k in range(N):
    #   print(mat_new[k])
    # print('d =', d**2)

    # check any '1'
    check_fill = [ any(mat_new[i]) for i in range(d, N) ]
    if not any(check_fill):
      return d**2

    # swap
    mat_old = mat_new
    mat_new = [ [0] * M for _ in range(N) ]

  return min(N,M)**2

# keep this function call here
print(MaximalSquare(input()))
```

> 다른 사람의 코드

```python
def MaximalSquare(strArr):

    for num in range( len(strArr), 0, -1 ):

      for rowIndex in range( 0, len(strArr)):
        row = strArr[rowIndex]
        if rowIndex + num > len(strArr):
          break

        for index in range( 0, len(row) ):
          if index + num > len(row):
            break

          found = True
          for i in range( index, index+num ):
            for j in range( rowIndex, rowIndex+num):
              if strArr[j][i] == '0':
                found = False
                break

          if found:
            return num*num

    return 1

# keep this function call here
print(MaximalSquare(input()))
```

### 문제 68

[Maximal Rectangle](https://coderbyte.com/information/Maximal%20Rectangle)

가장 큰 사각 매트릭스 찾아 넓이 반환

- Input: ["10100", "10111", "11111", "10010"]
  - Output: 6 => 넓이 2x3

```text
1 0 1 0 0
1 0 1 1 1
1 1 1 1 1
1 0 0 1 0
```

- Input: ["1011", "0011", "0111", "1111"]
  - Output: 8
- Input: ["101", "111", "001"]
  - Output: 3

> 다른 사람의 코드

[문제 67](#문제-67)과 유사해서 코드만 참고한다.

- `numpy` 이용한 행렬 처리를 기억해 둘 필요가 있다. (행렬 계산에 유용)
  - 2x2 행렬 초기화 : `matrix.shape` => (2,2)
    - `matrix = np.array( list(map(lambda x: list(map(int,x)), strArr)) )`
    - `arr_2d = np.zeros((2,2))` => '0.'(float) 로 초기화 됨
  - 2D 부분행렬 : `a[0:2,0:2]` => `[[1 2], [4 5]]`

```python
import numpy as np

def MaximalRectangle(strArr):
  matrix = np.array(list(map(lambda x: list(map(int,x)),strArr)))

  maximum = 0
  # top
  for i in range(matrix.shape[0]):
    # down
    for j in range(matrix.shape[0]):
      # left
      for k in range(matrix.shape[1]):
        # right
        for l in range(matrix.shape[1]):
          # 크기 1인 박스부터 크기 MxN 박스까지 체크
          if j >= i and l >= k:
            count_ones = np.sum(matrix[i:j+1,k:l+1])
            area = (j + 1 - i) * (l + 1 - k)
            # 전부 '1'로 채워진 경우 최대값 갱신
            if area == count_ones and area > maximum:
              maximum = area

  # code goes here
  return maximum

# keep this function call here
print(MaximalRectangle(input()))
```

### 문제 69

[Bipartite Matching](https://coderbyte.com/information/Bipartite%20Matching)

이분 그래프의 최대 카디널리티를 찾아야 함 (서로 다르게 연결할 수 있는 노드 개수)

- Input: ["a->d", "a->e", "b->f", "c->e"]
  - Output: 3
  - 왼쪽의 모든 노드를 오른쪽 노드들에 모두 연결할 수 있기 때문에 3 반환
- Input: ["a->w", "a->x", "b->x", "b->y", "c->x", "c->z", "d->w"]
  - Output: 4 (왼쪽 4, 오른쪽 4)
- Input: ["a->b", "c->b", "c->d", "e->b"]
  - Output: 2 (오른쪽 노드그룹 크기가 2)

> 다른 사람의 코드1 (15점)

```python
def BipartiteMatching(strArr):

  # 왜 왼쪽 길이로 체크하지? 방향성이라?
  def getMax(strArr, left, right):
    maxlen=len(left)
    for n in range(len(strArr)):
      v1, v2 = strArr[n][0], strArr[n][3]

      # 서로 다르게 연결할 수 있는 쌍 (똑같은 노드에 연결되는 간선 없이)
      if (v1 not in left) and (v2 not in right):
        l = getMax(strArr[n+1:], left+[v1], right+[v2])
        maxlen = max(maxlen, l)
    return maxlen

  maxlen = getMax(strArr,[],[])
  return maxlen

# keep this function call here
print(BipartiteMatching(input()))
```

> 다른 사람의 코드2 (13점)

```python
def BipartiteMatching(strArr):
    # 노드를 왼쪽 그룹, 오른쪽 그룹으로 분리
    from_vert = []
    to_vert = []
    for edge in strArr:
        from_vert.append(edge[0])
        to_vert.append(edge[-1])

    # 노드 그룹의 최소 크기 반환
    # ==> 서로 다르게 연결할 수 있는지 따지지 않았음
    return min(len(set(from_vert)), len(set(to_vert)))

# keep this function call here
print(BipartiteMatching(input()))
```

### 문제 70

[Pentagonal Number](https://coderbyte.com/information/Pentagonal%20Number)

오각형 안에 들어갈 수 있는 점의 개수:<br>
점 한개를 중심으로 오각형으로 둘러싸는 과정을 반복할 때, N번째 반복의 내부 점 개수는?

- 오각형 둘러싸기
  - 최초 점 1개
  - 1회 : 점 5개( 점1개 )
  - 2회 : 점10개( 점5개( 점1개 ) ) => 점6개 (= 5+1)
  - 3회 : 점15개( 점10개( 점5개( 점1개 ) ) ) => 점16개 (= 10+5+1)
- Input: 2
  - Output: 6 (2회 반복시 내부 점 개수)
- Input: 5
  - Output: 51 (5회 반복시 내부 점 개수)

> 내가 제출한 코드

난이도 hard 라고 겁먹을거 없네. (등급이 잘못된듯)

```python
def PentagonalNumber(num):
  if num < 1: return 0

  # f(i) = 5*i + f(i-1)
  def inner_dots(i):
    if i == 1:  # 1st loop
      return 1
    return 5*(i-1) + inner_dots(i-1)

  return inner_dots(num)

# keep this function call here
print(PentagonalNumber(input()))
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
