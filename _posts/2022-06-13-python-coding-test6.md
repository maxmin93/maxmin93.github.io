---
date: 2022-06-13 00:00:00 +0900
title: Python 코딩테스트 연습문제 51~60
description: 파이썬 코딩테스트 준비를 하며 공부한 내용을 기록하고 복습합니다.
categories: [Language, Python]
tags: [coderbyte, 코딩테스트]
image: https://coderbytestaticimages.s3.amazonaws.com/consumer-v2/nav/coderbyte_logo_digital_multi_light.png
---

## 참고자료

- [coderbyte](https://coderbyte.com/)

## 파이썬 코딩테스트

### 문제 51

(Easy) [Letter Changes](https://coderbyte.com/editor/Letter%20Changes:Python3)

- input : "fun times!"
  - output : "gvO Ujnft!"
- input : "hello\*3"
  - output : "Ifmmp\*3"

```python
def LetterChanges(strParam):

  chrs = [ chr(ord(c)+1) if 'a' <= c <= 'z' else c for c in strParam ]
  caps = [ c.upper() if c in ('a','e','i','o','u') else c for c in chrs ]

  # code goes here
  return ''.join(caps)

# keep this function call here
print(LetterChanges(input()))
```

### 문제 52

(Easy) [Simple Adding](https://coderbyte.com/information/Simple%20Adding)

- input: 4 ==> output: 10

```python
def SimpleAdding(num):

  total = 0
  for i in range(1, num+1):
    total += i

  # code goes here
  return total

# keep this function call here
print(SimpleAdding(input()))
```

### 문제 53

(Easy) [Letter Capitalize](https://coderbyte.com/information/Letter%20Capitalize)

- Input: "hello world"
  - Output: Hello World

```python
def LetterCapitalize(strParam):

  strArr = [ c for c in strParam ]
  blanks = [ i for i in range(len(strArr)) if strArr[i] == ' ' ]

  for i in blanks:
    if i + 1 < len(strArr):
      strArr[i+1] = strArr[i+1].upper()

  if strArr[0] != ' ':
    strArr[0] = strArr[0].upper()

  # code goes here
  return ''.join(strArr)

# keep this function call here
print(LetterCapitalize(input()))
```

### 문제 54

[Min Window Substring](https://coderbyte.com/information/Min%20Window%20Substring)

- Input: ["aaabaaddae", "aed"]
  - output: "dae"
- Input: ["aabdccdbcacd", "aad"]
  - output: "aabd"
- Input: ["ahffaksfajeeubsne", "jefaa"]
  - Output: aksfaje
- Input: ["aaffhkksemckelloe", "fhea"]
  - Output: affhkkse

결국 못풀고 다른 사람 코드를 보아 버렸다.

- 검색 문제에서 중요한건 만족하는 조건(해답)을 정의하는 것이고
  - 조건을 만족하는지 검사하는 방법은 부차적으로 정의하고
- 그것을 위해 탐색하는 범위를 정의하는 것이다.
  - 이중 루프가 필요하면 과감히 써라 (처음부터 꼼수 찾지 말고)

```python
from collections import Counter

def compare_counter(d1, d2):
  comp = {}
  for k, v in d1.items():
    comp[k] = v - d2.get(k, 0)
  return len([ x for x in comp.values() if x > 0 ]) > 0

def MinWindowSubstring(strArr):
  # input
  N, K = strArr
  freq = Counter(K)
  # print('input:', freq)

  # 모든 범위에 대해 탐색 (이중 루프)
  # ==> freq 를 만족하면 break
  found = []
  for i in range(len(N)):
    curr = Counter()
    for j in range(i, len(N)):
      if N[j] in K:
        curr[ N[j] ] += 1
        # print(f'loop#{i}:{j}..', curr)
        if compare_counter(freq, curr) == False:
          found.append( N[i:j+1] )
          break

  result = sorted(found, key=lambda x: len(x))
  return result[0] if found else []

# keep this function call here
print(MinWindowSubstring(input()))
```

### 문제 55

[Matrix Chains](https://coderbyte.com/information/Matrix%20Chains)

Tag: `array`, `dynamic programming`

행렬 A, B의 곱셈은 `A(m,k) * B(k,n) = AB(m,n)` 크기를 행렬이 나온다.<br>
행렬 곱셈에 사용되는 Cell 간의 총 곱셈 횟수는 `A(m,k) * B(k,n) = m * k * n` 이다.<br>
입력은 행렬 크기의 연속 배열이라서 '1 x 2 x 3' 은 `A(1,2) * B(2,3)` 을 의미한다.<br>
행렬 곱셈 법칙상 순서는 변경되어도 같다. `A(BC) = (AB)C`<br>
점화식으로는 `F( i ) = f( N[0] * N[i-2] * N[i-1] ) + f( N[0] * N[i-1] * N[i] )`<br>
(`N[0]` 는 항상 곱해짐)

- Input: [1, 2, 3, 4]
  - => `행렬A(1,2) * 행렬B(2,3) * 행렬C(3,4)` => `행렬AB(1,3) * 행렬C(3,4)` => `행렬ABC(1,4)`
  - 모든 행렬의 곱셈 횟수를 더하면: `AB(1*2*3) + C(3,4)` => `6 + ABC(1*3*4)` => `6 + 12`
  - 일단 모든 행렬 조합을 곱한 상태로 만들면 => `[ _, _, 6, 12 ]` (최소 길이 3)
  - Output: 18
- Input: [2, 3, 4] => `행렬(2,3) * 행렬(3,4)` => `2*3*4`
  - Output: 24
- Input: [1, 4, 5, 6, 8] => `(1*4*5) + (1*5*6) + (1*6*8)`
  - Output: 98

> 내가 제출한 코드 (3점)

정렬부터 했어야 했는데. 역시나 풀긴 푸는데 시간이 오래 걸린다.

```python
def MatrixChains(arr):
  N = len(arr)
  first = arr[0]
  dp = [ 0 ]*N   # 길이: N-2

  # 모든 행렬 곱셈을 만들어 놓고
  for i in range(2, len(arr)):
    dp[i] = first * arr[ i-1 ] * arr[ i ]

  # code goes here
  return sum(dp)

# keep this function call here
print(MatrixChains(input()))
```

> 다른 사람의 코드 (5점)

```python
def MatrixChains(arr):

  arr.sort()

  m = arr[0]
  n = arr[1]
  p = arr[2]
  calcs = m * n * p

  for i in range(3, len(arr)):
    n = p
    p = arr[i]
    calcs += m * n * p
  # code goes here
  return calcs

# keep this function call here
print(MatrixChains(input()))
```

### 문제 56

[Matching Characters](https://coderbyte.com/information/Matching%20Characters)

검색의 시작지점과 끝지점을 찾는 것을 먼저하고, 유니크 문자셋을 확인했다.

- Input: "ahyjakh" => 중복 a(2), h(2)
  - output: 4
- Input: "mmmerme" => 중복 m(4), e(2)
  - Output: 3
  - 이 입력은 도통 이해가 안간다.<br>
    'e' 의 사이에 "rm"만 카운트 해야 하는데 3 이란다.
- Input: "abccdefghi"
  - Output: 0

> 내가 제출한 코드 (4)

모든 중복 문자가 아니라 어느 것이든 처음과 끝을 살피는 문제였던듯.<br>
필기로 풀어보고 보기가 안맞으면 문제를 잘 못 이해한 것이다.

```python
def MatchingCharacters(strParam):
  freq = {}
  for i, c in enumerate(strParam):
    tmp = freq.setdefault(c, [])
    tmp.append(i)

  dup = set([ k for k,v in freq.items() if len(v) > 1 ])
  start_idx = max([ freq[c][0] for c in dup ])+1
  end_idx = max([ freq[c][-1] for c in dup ])

  unq_size = 0
  if start_idx >= 0 and start_idx < end_idx:
    # print(start_idx, end_idx, strParam[start_idx:end_idx])
    unq_size = len(set(strParam[start_idx:end_idx]))

  # code goes here
  return unq_size

# keep this function call here
print(MatchingCharacters(input()))
```

> 다른 사람의 코드 (5)

문자열의 rfind() 함수를 사용한 것이 눈에 띔.

```python
def MatchingCharacters(strParam):
  # 문자 카운팅
  counts = {}
  for c in strParam:
    if c in counts:
      counts[c] += 1
    else:
      counts[c] = 1

  maxUnique = 0
  for c in counts:
    if counts[c] == 1:
      continue
    # 중복 문자에 대해
    l = strParam.find(c)
    r = strParam.rfind(c)
    unique = len(set(strParam[l+1:r]))
    maxUnique = max(maxUnique, unique)
  return maxUnique

# keep this function call here
print(MatchingCharacters(input()))
```

### 문제 57

[Ternary Converter](https://coderbyte.com/information/Ternary%20Converter)

십진수를 삼진수로 변환

- Input: 21
  - Output: 210
- Input: 67
  - Output: 2111

```python
def TernaryConverter(num):

  remains = []
  while num > 0:
    remains.append( num%3 )
    num = num // 3

  # 출력할 때는 반대로 뒤집어야 한다 (정렬이 아니고)
  return ''.join([ str(i) for i in remains[::-1] ])

# keep this function call here
print(TernaryConverter(input()))
```

### 문제 58

[Linear Congruence](https://coderbyte.com/information/Linear%20Congruence)

`선형 합동식`이라는데 뭔지 모르겠다. 답안을 보자.

- Input: "32x = 8 (mod 4)"
  - a = 32, b = 8, m = 4
  - m 의 나머지인 0, 1, 2, 3 중에 양변을 m 으로 mod 연산을 해도 똑같아 지는 x의 갯수
  - Output: 4 (= [ 0, 1, 2, 3 ])

혹 문자열에서 숫자를 파싱해내는 문제가 나올지 모르니 정규식을 기억하자.

- `re.findall( r'패턴', 문자열 )` 은 리스트를 반환한다
  - `r'\d+'` 은 숫자만, `r'\w+'` 은 문자만,`r'\W+'` 은 문자가 아닌것만
  - `r'\s+'` 은 공백만,`r'\S+'` 은 공백이 아닌것만
  - `re.split(r'[ ,:]', 문자열)` 은 모든 구분자 `[ ,:]` 에 대해 쪼개기를 수행

```python
string = 'aaa1234, ^&*2233pp'
numbers = re.findall(r'\d+', string)
print(numbers)
# ['1234', '2233']

s = 'apple orange:banana,tomato'
l = re.split(r'[ ,:]', s)
print(l)
# ['apple', 'orange', 'banana', 'tomato']
```

> 다른 사람의 코드

```python
import re

def LinearCongruence(strParam):
  reg = re.findall(r'\d+', strParam)
  a, b, m = [ int(r) for r in reg ]

  count = 0
  for x in range(m):
    check = (a * x) % m
    if check == b % m:
      count += 1

  return count

# keep this function call here
print(LinearCongruence(input()))
```

### 문제 59

[Formatted Number](https://coderbyte.com/information/Formatted%20Number)

문자열이 유효한 숫자인지 확인

- ["1,093,222.04"] => true
- ["1,093,22.04"] => false
- ["0.232567"] => true
- ["2,567.00.2"] => false

> 내가 제출한 코드

실패한 테스트 케이스 (수정해서 다시 제출했다)

- input ["23d"] => false
- input ["09.12"] => true
- input ["898989898"] => false

```python
import re

def FormattedNumber(strArr):
  strDigit, *_ = strArr
  above = strDigit[:strDigit.index('.')] if '.' in strDigit else strDigit
  below = strDigit[strDigit.index('.')+1:] if '.' in strDigit else ""
  # print(above, below)

  if not above or re.findall(r'[^\d,]+', above):
    return "false"

  # check below
  if len(re.findall(r'\d+', below)) > 1:
    return "false"

  # check above
  for i, d in enumerate(re.findall(r'\d+', above)):
    # 맨 앞자리도 아니면서 ',' 구분으로 잘려진 숫자열이 3 미만이면 false
    if len(d) < 3:
      if i > 0:
        return "false"
    if len(d) > 3:
      return "false"

  # code goes here
  return "true"

# keep this function call here
print(FormattedNumber(input()))
```

> 다른 사람의 코드

```python
import re

def FormattedNumber(strArr):

  PATTERN = r"^[0-9]{1,3}(?:,[0-9]{3})*(?:\.[0-9]+)?$"
  if re.match(PATTERN, strArr[0]) is not None:
    return "true"

  return "false"

# keep this function call here
print(FormattedNumber(input()))
```

### 문제 60

[Largest Row Column](https://coderbyte.com/information/Largest%20Row%20Column)

행렬에서 세자리의 가장 큰 합을 찾기

> 내가 제출한 코드

테스트케이스 6개를 실패했다. (2점) => 수정후 (5점)<br>
가능한 path 의 조합인지 체크하는 부분에서 실패

- input ["11111", "27222"] => 22
- input ["11111", "22922"] => 13
- input ["896", "161", "222", "333"] => 21
- input ["444", "511", "511"] => 12
- input ["11111"] => 3
- input ["44444449", "11111111"] => 17

```python
import itertools

# 매트릭스 크기가 허용하는 가장 큰 수를 찾아야 함
# ex) 3x3 매트릭스: [ 0:[0~2], 1:[0~2], 2:[0~2] ]
def LargestRowColumn(strArr):
  N = len(strArr)
  M = len(strArr[0])
  bound = [ (i*10,i*10 + M-1) for i in range(N) ]

  # matrix = [ (v, (i,j)) ]
  mat = []
  for i in range(N):
    for j in range(M):
      mat.append( (int( strArr[i][j] ), (i,j)) )

  # 모든 조합
  found = []
  for combo in itertools.combinations(mat,3):
    v = sum([ c[0] for c in combo ])
    cond = [ v for s,e in bound if s <= v <= e ]
    if cond:
      combo = sorted(combo, key=lambda c: c[1] )
      c1 = combo[0][1]
      c2 = combo[1][1]
      c3 = combo[2][1]
      if (
        # abs(c2[0]-c1[0])+abs(c2[1]-c1[1]) == 1 or
        abs(c3[0]-c1[0])+abs(c3[1]-c1[1]) <= 2
      ):
        # print(v, combo)
        found.append(v)

  # code goes here
  return max(found)

# keep this function call here
print(LargestRowColumn(input()))
```

> 다른 사람의 코드

특정 지점으로부터 가능한 2개의 지점을 포함해서 계산 (3중루프)

- 3개의 지점이라는 제약을 이용해 직관적으로 작성

```python
def LargestRowColumn(strArr):

  paths = [[(1,0), (2,0)],
          [(0,1), (0,2)],
          [(0,1), (1,1)],
          [(1,0), (0,1)],
          [(0,1), (-1,1)],
          [(1,0), (1,1)]]

  ROWS = len(strArr)
  COLS = len(strArr[0])

  maxSum = 0

  for i in range(COLS):
    for j in range(ROWS):
      for path in paths:
        total = int(strArr[j][i])
        y1 = i + path[0][0]
        y2 = i + path[1][0]
        x1 = j + path[0][1]
        x2 = j + path[1][1]
        if y1 < 0 or y2 < 0 or x1 < 0 or x2 < 0:
          continue
        try:
          total += (int(strArr[x1][y1]) + int(strArr[x2][y2]))
        except:
          continue
        # 매트릭스의 행렬 범위 체크
        if total > maxSum:
          r = total // 10
          c = total % 10
          if r < ROWS and c < COLS:
            maxSum = total

  # code goes here
  return maxSum

# keep this function call here
print(LargestRowColumn(input()))
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
