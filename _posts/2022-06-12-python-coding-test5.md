---
date: 2022-06-12 00:00:00 +0900
title: Python 코딩테스트 연습문제 41~50
description: 파이썬 코딩테스트 준비를 하며 공부한 내용을 기록하고 복습합니다.
categories: [Language, Python]
tags: [coderbyte, 코딩테스트]
image: https://coderbytestaticimages.s3.amazonaws.com/consumer-v2/nav/coderbyte_logo_digital_multi_light.png
---

## 참고자료

- [coderbyte](https://coderbyte.com/)
- [코딩테스트 문제 유형 정리](https://velog.io/@pppp0722/%EC%BD%94%EB%94%A9%ED%85%8C%EC%8A%A4%ED%8A%B8-%EB%AC%B8%EC%A0%9C-%EC%9C%A0%ED%98%95-%EC%A0%95%EB%A6%AC)
- [코딩테스트 전, 알고리즘 문제 유형 정리](https://skytitan.tistory.com/217)
- [Codebyte Practice Questions and Answers](http://wiki.alexjslessor.com/en/coderbyte-answers)

## 파이썬 코딩테스트

### 문제 41

[Two Sum](https://coderbyte.com/information/Two%20Sum)

두개의 숫자의 합이 `arr[0]` 이 되도록 조합하여 출력

- 없으면 `-1` 출력

```python
def TwoSum(arr):
  target = arr[0]
  nums = arr[1:][::-1]  # reversed

  result = []
  while nums:
    i = nums.pop()
    if target - i in nums:
      nums.remove(target-i)
      result.append((i,target-i))

  if result:
    return ' '.join([ f'{x[0]},{x[1]}' for x in result ])
  # empty
  return '-1'

# keep this function call here
print(TwoSum(input()))

## 결과
# [7, 6, 4, 1, 7, -2, 3, 12]
# ==> 6,1 4,3
# [17, 4, 5, 6, 10, 11, 4, -3, -5, 3, 15, 2, 7]
# ==> 6,11 10,7 15,2
```

### 문제 42

[소수 찾기 알고리즘 (Prime Number)](https://coding-of-today.tistory.com/169)

> 일반적인 코드

```python
# 특정 숫자 x가 소수인지 판별하는 가장 기본적인 알고리즘
def primenumber(x):
    for i in range(2, x):	# 2부터 x-1까지의 모든 숫자
      	if x % i == 0:		# 나눠떨어지는게 하나라도 있으면 False
          	return False
    return True
```

> 탐색범위를 제곱근 범위로 좁힌 코드

```python
import math

# 소수 판별
def primenumber(x):
    for i in range (2, int(math.sqrt(x) + 1):	# 2부터 x의 제곱근까지의 숫자
    	  if x % i == 0:		# 나눠떨어지는 숫자가 있으면 소수가 아님
        	  return False
    return True
```

### 문제 43

[Array Rotation](https://coderbyte.com/information/Array%20Rotation)

ArrayRotation(arr) 함수가 음수가 아닌 정수의 배열이 될 전달되는 arr 매개변수를 사용하고 N이 배열의 첫 번째 정수와 동일한 N번째 요소에서 시작하여 배열을 순환 회전하도록 합니다. 예를 들어: arr이 `[2, 3, 4, 1, 6, 10]`이면 배열의 첫 번째 요소가 2이기 때문에 프로그램은 배열을 두 번째 위치부터 회전해야 합니다. 따라서 최종 배열은 `[4, 1, 6, 10, 2, 3]`이고 프로그램은 새 배열을 문자열로 반환해야 하므로 이 예의 경우 프로그램은 4161023을 반환합니다. 배열의 첫 번째 요소는 항상 0보다 크거나 같은 정수입니다. 배열의 크기보다 작습니다.

- Input: [3,2,1,6]
  - Output: 6321
- Input: [4,3,4,3,1,2]
  - Output: 124343

> 내가 제출한 코드

```python
def ArrayRotation(arr):
  pivot = arr[0]
  x = arr[pivot:] + arr[:pivot]
  return ''.join([str(i) for i in x])

# keep this function call here
print(ArrayRotation(input()))
```

> 다른 사람의 코드

```python
def rotate_array_elements(deque, k):
  # 왼쪽으로 k 만큼 shift
  for i in range(k):
    first_element = deque.pop(0)
    deque.append(first_element)

def ArrayRotation(arr):
  number_of_shifts = arr[0] % len(arr)
  rotate_array_elements(arr, number_of_shifts)
  return "".join([str(x) for x in arr])

# keep this function call here
print(ArrayRotation(input()))
```

### 문제 44

[Longest Consecutive](https://coderbyte.com/information/Longest%20Consecutive)

LongestConsecutive(arr) 함수가 arr에 저장된 양의 정수 배열을 취하고 가장 긴 연속 부분 시퀀스(LCS)의 길이를 반환하도록 합니다. LCS는 숫자가 가장 낮은 것에서 가장 높은 것까지 정렬된 순서로 있고 연속적으로 증가하는 순서인 원래 목록의 하위 집합입니다. 시퀀스는 연속적일 필요가 없으며 여러 하위 시퀀스가 ​있을 수 있습니다. 예: arr이 `[4, 3, 8, 1, 2, 6, 100, 9]`이면 몇 개의 연속 시퀀스는 `[1, 2, 3, 4]` 및 `[8, 9]`입니다. 이 입력의 경우 프로그램은 가장 긴 연속 하위 시퀀스의 길이인 4를 반환해야 합니다.

- Input: [6, 7, 3, 1, 100, 102, 6, 12]
  - Output: 2
- Input: [5, 6, 1, 2, 8, 9, 7]
  - Output: 5

> 내가 제출한 코드

- arr.sort()
- 이중 for 문으로 arr 순환
  - `arr[i+1] - arr[i] == 1` 인 연속 리스트 저장
  - 연속되지 않으면 break
- 가장 긴 배열의 길이를 반환
  - 문자열로 변환 후 결합하여 출력

> 다른 사람의 코드

```python
def LongestConsecutive(arr):
  arr.sort()
  max_count = 0
  count = 1
  for i in range(len(arr)-1):
    if arr[i+1] - arr[i] == 1:
      count += 1
    else:
      max_count = max(max_count, count)
      count = 1
  max_count = max(max_count, count)
  return max_count

# keep this function call here
print(LongestConsecutive(input()))
```

### 문제 45

[Histogram Area](https://coderbyte.com/information/Histogram%20Area)

함수 HistogramArea(arr)가 arr에 저장된 음이 아닌 정수의 배열을 읽게 하여 그래프의 막대 높이(각 막대 너비가 1)를 나타내고 전체 막대 그래프 아래에서 가장 큰 영역을 결정합니다. 예: arr이 `[2, 1, 3, 4, 1]`이면 다음 막대 그래프와 같습니다.

위의 막대 그래프에서 그래프 아래의 가장 큰 영역이 x로 덮인 것을 볼 수 있습니다. 전체 너비가 2이고 최대 높이가 3이므로 `2 * 3 = 6`이기 때문에 해당 공간의 면적은 6과 같습니다. 따라서 프로그램은 6을 반환해야 합니다. 배열에는 항상 최소 1개의 요소가 포함됩니다.

- Input: [6, 3, 1, 4, 12, 4]
  - Output: 12
- Input: [5, 6, 7, 4, 1]
  - Output: 16

> 내가 제출한 코드 (4점)

- calc_area 함수 정의
  - 주어진 arr 에 대해 넒이 반환
- 이중 for 문으로 막대 그래프의 모든 조합 순회
  - calc_area 로 모든 넓이 저장
- 가장 큰 넓이 출력

```python
def calc_size(arr):
  height = min(arr)
  width = len(arr)
  return height * width

def HistogramArea(arr):
  # all combinations
  areas = []
  for i in range(len(arr)-1):
    for j in range(i+1,len(arr)+1):
      areas.append([ x for x in arr[i:j] ])
  # print( len(areas), areas )
  sizes = []
  for x in areas:
    sizes.append( calc_size(x) )
  # print(sizes)
  return max(sizes)

# keep this function call here
print(HistogramArea(input()))
```

> 다른 사람의 코드 (5점)

메모리 사용량이나 계산 시간, 시간복잡도 등으로 점수가 정해진다.

```python
def HistogramArea(arr):
  areas = []
  for i in range(1,len(arr)+1 ):
    for j in range(i):
      h = min(arr[j:i])
      w = i - j
      areas.append(h*w)
  # code goes here
  return max(areas)

print(HistogramArea(input()))
```

### 문제 46

[Django JSON Cleaning](https://coderbyte.com/information/Django%20JSON%20Cleaning)

JSON 데이터를 구문 분석하기 위해 Django 애플리케이션 내에서 함수를 작성한다고 상상해보십시오. Python 파일에서 [https://coderbyte.com/api/challenges/json/json-cleaning](https://coderbyte.com/api/challenges/json/json-cleaning) 경로에 대해 GET 요청을 수행하고 다음 규칙에 따라 개체를 정리하는 프로그램을 작성하십시오. 값이 있는 모든 키 제거 'N/A', '-' 또는 빈 문자열. 이러한 값 중 하나가 배열에 나타나면 배열에서 해당 단일 항목을 제거하십시오. 그런 다음 수정된 개체를 문자열로 인쇄합니다.

- Input<br>
  `{"name":{"first":"Daniel","middle":"N/A","last":"Smith"},"age":45}`
  - Output<br>
    `{"name":{"first":"Daniel","last":"Smith"},"age":45}`

> 내가 제출한 코드

- 최상위 딕셔너리에 포함된 values 들에 대해서도 처리해야 함
- 쓸데없이 시간을 허비한 문제
  - for 문 안에서는 제거할 수 없음 (keys 저장후 밖에서 제거)

```python
def remove_keys(dic, keys):
  # dic 에서 keys 항목 제거

def clean_arr(arr):
  # filtering 하여 반환

def clean_dic(dic):
  removed = []
  for k, v in dic.items():
    if isinstance(v, dict):
      dic[k] = clean_dic(v)
    elif isinstance(v, list):
      dic[k] = clean_arr(v)
    else:
      # 조건 검색 후 removed 에 key 추가
  return remove_keys(dic, removed)

r.json = request(url)
print( clean_dic(r.json) )
```

### 문제 47

[City Traffic](https://coderbyte.com/information/City%20Traffic)

그래프에서 각 노드에 대한 최대 이동량을 구하시오.<br>
임의의 시작 노드로부터 각 간선별로 연결된 모든 노드를 방문하고 인구수를 더하기

- Input: `["1:[5]", "4:[5]", "3:[5]", "5:[1,4,3,2]", "2:[5,15,7]", "7:[2,8]", "8:[7,38]", "15:[2]", "38:[8]"]`
  - key 는 노드 번호이자 인구수, value 는 연결된 노드 번호 리스트
  - 모든 도시에서 7번 도시로 이동하는 경우 (연결 간선은 2개)
    - 위쪽에서의 이동량은 (8 + 38) = 46,
    - 아래쪽에서의 이동량은 (2 + 15 + 1 + 3 + 4 + 5) = 30
    - 그래서, 최대 이동량은 max(46, 30) = 46
  - Output: `1:82,2:53,3:80,4:79,5:70,7:46,8:38,15:68,38:45`
- Input: `["1:[5]", "2:[5]", "3:[5]", "4:[5]", "5:[1,2,3,4]"]`
  - Output: `1:14,2:13,3:12,4:11,5:4`
- Input: `["1:[5]", "2:[5,18]", "3:[5,12]", "4:[5]", "5:[1,2,3,4]", "18:[2]", "12:[3]"]`
  - Output: `1:44,2:25,3:30,4:41,5:20,12:33,18:27`

> 내가 제출한 코드

```python
# j 에서 i 방향으로 오면 트래픽 합산 반환
def travel_dfs(graph, i, j):
  visited = [i]
  stack = [j]
  while stack:
    node = stack.pop()
    if node not in visited:
      visited.append( node )
      stack.extend( graph[node] )
  # print(f'travel[{i}<-{j}]', visited)
  return sum(visited[1:])   # 최초 i 노드 제외

def CityTraffic(strArr):
  # input
  graph = { int(k):eval(v) for k,v in [x.split(':') for x in strArr] }
  # print(graph)

  nodes = []
  # 모든 노드에 대해서 수행
  for i in sorted(graph.keys()):
    traffic = []
    # 연결된 간선에 대해 수행
    for j in graph[i]:
      # 리턴값 저장
      traffic.append( travel_dfs(graph, i, j) )
    nodes.append( f'{i}:{max(traffic)}' )

  return ','.join(nodes)

# keep this function call here
print(CityTraffic(input()))
```

> 다른 사람의 코드

난이도 hard 라는 설명에 시간이 없어서 건너뛰었지만 이제와 살펴보니 아까운 문제

```python
def CityTraffic(strArr):
  graph, res = {}, []
  for edges in strArr:
    v, nei = edges.split(':')
    v, nei = eval(v), eval(nei)
    graph[v] = nei

  def dfs(city, graph, seen, traf):
    for nb in graph[city]:
      if nb not in seen:
        new_seen = seen + [nb]
        traf += dfs(nb, graph, new_seen, nb)
    return traf

  cities = sorted(list(graph.keys()))
  for c in cities:
    temp = []
    for neib in graph[c]:
      temp.append(dfs(neib, graph, [c, neib], neib))
    res.append(str(c) + ':' + str(max(temp)))

  return ','.join(res)


# keep this function call here
print(CityTraffic(input()))
```

### 문제 48

[BE 2nd Diagonal]()

Here is the M X N matrix. Please make a function that prints the diagonal access of the matrix with the output values comma-delimited.

```text
1 2 3 4 5
6 7 8 9 10
11 12 13 14 15
```

The matrix above will be printed as following<br>
`1 2 6 11 7 3 4 8 12 13 9 5 10 14 15`

> 내가 제출한 코드

`N x N` 행렬에 대한 Z 순회 문제를 응용하여 작성함

- 참고: [Print matrix in diagonal pattern](https://tutorialspoint.dev/data-structure/matrix-archives/print-matrix-diagonal-pattern)
- 시험공부 하면서 본 적이 있었는데, 유별난 유형이라 생각했음

```python
MAX = 100

def printMatrixDiagonal(mat, n, m):
  traversal = []
  i, j, k = 0, 0, 0
  is_up = True

  while k < n * m:
    if is_up:
      while i >= 0 and j < m:
        # print( str(mat[i][j]), end=' ')
        traversal.append( mat[i][j] )
        k += 1
        j += 1 # 가로 (m)
        i -= 1 # 세로 (n)

      if i < 0 and j <= m-1:
        i = 0
      if j == m:
        i += 2
        j -= 1

    else:
      while j >= 0 and i < n:
        # print(mat[i][j], end=' ')
        traversal.append( mat[i][j] )
        k += 1
        i += 1
        j -= 1
      if j<0 and i<= n-1:
        j = 0
      if i == n:
        j += 2
        i -= 1

    is_up = not is_up

  return traversal


def BE2ndDiagonal(strArr):

  # input
  arr2d = []
  for x in strArr:
    arr2d.append( eval(x) )

  """
  # 행과 열을 바꾸기 <-- 필요 없음 (주석처리)
  transposed = list(map(list, zip(*arr2d)))

  n = len(transposed)
  m = len(transposed[0])
  print(n,m)
  """

  n = len(arr2d)
  m = len(arr2d[0])
  traversal = printMatrixDiagonal( arr2d, n, m )

  # code goes here
  return ', '.join([ str(x) for x in traversal ])

# keep this function call here
print(BE2ndDiagonal(input()))
```

### 문제 49

[Step Walking](https://www.coderbyte.com/information/Step%20Walking)

Have the function StepWalking(num) take the num parameter being passed which will be an integer between 1 and 15 that represents the number of stairs you will have to climb.<br><br>

You can climb the set of stairs by taking either 1 step or 2 steps, and you can combine these in any order.<br><br>

So for example, to climb 3 steps you can either do: (1 step, 1 step, 1 step) or (2, 1) or (1, 2). So for 3 steps we have 3 different ways to climb them, so your program should return 3.<br><br>

Your program should return the number of combinations of climbing num steps.

- Input: 1
  - Output: 1
- Input: 3
  - Output: 3

> 다른 사람의 코드

[피보나치 구하기] (/\_posts/python-coding-test1.md#피보나치-구하기) 와 유사한 문제

- num 을 1 과 2 의 조합으로 쪼개어 가면 됨
- 동적 프로그래밍: 점화식 `f(n) = f(n-1) + f(n-2)`

```python
def StepWalking(num):
  if num == 0:
    return 1
  if num < 0:
    return 0

  return StepWalking(num-1) + StepWalking(num-2)

# keep this function call here
print(StepWalking(input()))
```

### 문제 50

[Wildcards](https://coderbyte.com/information/Wildcards)

Have the function Wildcards(str) read str which will contain two strings separated by a space.<br><br>

The first string will consist of the following sets of characters: `+, *, $, and {N}` which is optional.<br><br>

The plus (`+`) character represents a single alphabetic character, the (`$`) character represents a number between 1-9, and the asterisk (`*`) represents a sequence of the same character of length 3 unless it is followed by `{N}` which represents how many characters should appear in the sequence where N will be at least 1.<br><br>

Your goal is to determine if the second string exactly matches the pattern of the first string in the input.<br><br>

For example: if str is `"++*{5} jtggggg"` then the second string in this case does match the pattern, so your program should return the string true.<br><br>

If the second string does not match the pattern your program should return the string false.

- Input: `"+++++* abcdehhhhhh"`
  - Output: false
- Input: `"$**+*{2} 9mmmrrrkbb"`
  - Output: true

> 다른 사람의 코드

```python
import re

def Wildcards(strParam):
  a, b = strParam.split()
  a = a.replace('+','[a-z]').replace('$','[1-9]')

  for i,v in enumerate(a):
    if(v == "{"):
      N = a[i+1]
      a = a.replace(a[i-1:i+3],'[a-z]{'+N+'}')

  a= a.replace("*",'[a-z]{3}')

  pattern = re.findall(a,b)
  if(len(pattern) > 0):
    if len(pattern[0]) == len(b):
      return "true"

  return "false"

# keep this function call here
print(Wildcards(input()))
```

```python
def Wildcards(strParam):
  ls = strParam.split(" ")
  sym = ls[0]
  act = ls[1]
  sym_check = ""
  sym_list = []
  act_check = ""
  for ind, x in enumerate(sym):
    if x == "+":
      sym_check += "a"
    elif x == "$":
      sym_check += "9"
    elif x == "*":
      if ind + 1 < len(sym):
        if sym[ind + 1] == "{":
          sym_list.append([len(sym_check), len(sym_check) + int(sym[ind + 2])])
          for y in range(int(sym[ind + 2])):
            sym_check += "a"
        else:
          sym_list.append([len(sym_check), len(sym_check) + 3])
          sym_check += "aaa"
      else:
          sym_list.append([len(sym_check), len(sym_check) + 3])
          sym_check += "aaa"
  for z in act:
    if z.isalpha():
      act_check += "a"
    if z.isnumeric():
      act_check += "9"
  if act_check != sym_check:
    return "false"
  for n in sym_list:
    for p in range(n[0] + 1, n[1]):
      if act[p] != act[n[0]]:
        return "false"
  return "true"

# keep this function call here
print(Wildcards(input()))
```

#### 'Wildcards' 유사 문제

[Wildcard Characters](https://www.coderbyte.com/information/Wildcard%20Characters)

```python
import re
def WildcardCharacters(strParam):
  # code goes here
  a,b = strParam.split()
  a = a.replace('+','[a-z]').replace('$','[1-9]')

  for i,v in enumerate(a):
    if(v == "{"):
      N = a[i+1]
      a = a.replace(a[i-1:i+3],'[a-z]{'+N+'}')

  a= a.replace("*",'[a-z]{3}')

  pattern = re.findall(a,b)
  if(len(pattern) > 0):
    if len(pattern[0]) == len(b):
      return "true"

  return "false"

# keep this function call here
print(WildcardCharacters(input()))
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
