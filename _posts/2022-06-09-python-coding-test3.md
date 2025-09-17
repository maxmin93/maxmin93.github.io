---
date: 2022-06-09 00:00:00 +0900
title: Python 코딩테스트 연습문제 21~30
description: 파이썬 코딩테스트 준비를 하며 공부한 내용을 기록하고 복습합니다.
categories: [Language, Python]
tags: [dmoj, 코딩테스트]
image: https://media.licdn.com/dms/image/v2/C4D1BAQG7YbBjqFK1uw/company-background_10000/company-background_10000/0/1583674843233/dmoj_cover?e=2147483647&v=beta&t=9aZhG7toXaBf8_FRw7UERNZmOr_UwrUVbubHMcUa1Y0
---

## 코딩테스트 참고자료

- 사이트(무료) [DMOJ](https://dmoj.ca/), [USA Computing Olympiad](http://usaco.org/), [백준](https://www.acmicpc.net/)
- 책 [코딩 테스트로 시작하는 파이썬 프로그래밍](https://www.youngjin.com/book/book_detail.asp?prod_cd=9788931466010&seq=7029&cate_cd=1&child_cate_cd=9&goPage=1&orderByCd=1)

## 파이썬 코딩테스트

### 문제21

[USACO 2018 January Contest, Bronze Problem 2. Lifeguards](http://usaco.org/index.php?page=viewproblem2&cpid=784)

인명구조원을 하나씩 제거한 모든 시간표를 구해 커버 되는 최대 시간을 찾는다.

- 커버되는 시간대의 개수를 세면 된다
  - 중간에 시간이 끊겨도 해당 시간대는 포함됨
- 모든 시간표의 조합을 생성해 내는 것이 핵심 (이후 최대값 출력)
  - 완전(전체) 탐색 알고리즘

> 내가 제출한 코드

```python
lines = [
    '3','5 9','1 4','3 7'
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

def read_data():
    n = int(input())
    data = []
    for i in range(n):
        data.append( list(map(int, input().split())) )
    return data

data = read_data()
# print(sorted(data, key=lambda v: (v[0], v[1])))

def calc_covered_time(data):
    times = set()
    for i,j in sorted(data, key=lambda v: (v[0], v[1])):
        times.update(range(i,j))
    return len(times)

def max_covered_time(data):
    max_time = 0
    for i in range(len(data)):
        sliced = data[:i] + data[i+1:]
        covered_time = calc_covered_time(sliced)
        print(sliced, '==>', covered_time)
        if covered_time > max_time:
            max_time = covered_time
    return max_time

print( max_covered_time(data) )
## 결과
# [[1, 4], [3, 7]] ==> 6
# [[5, 9], [3, 7]] ==> 6
# [[5, 9], [1, 4]] ==> 7
# 7
```


### 문제22

[USACO 2014 January Contest, Bronze Problem 1. Ski Course Design](http://www.usaco.org/index.php?page=viewproblem2&cpid=376)

비용함수를 구현하고 탐색범위를 제한하는 것이 핵심

> 내가 제출한 코드

```python
lines = [
    '5',
    '20','4','1','24','21'
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

def read_data():
    n = int(input())
    data = []
    for i in range(n):
        data.append( int(input()) )
    return data

heights = read_data()
min_h, max_h = min(heights), max(heights)
ALLOWED_HEIGHT = 17
print(f'heights={heights}')

def calc_cost(heights, min_h, max_h):
    """
    주의!
    언덕의 높이가 min_h, max_h 사이에 들어가는 경우는 비용을 계산하지 않는다
    """
    cost = 0
    targets = [ x for x in heights if x < min_h or x > max_h ]
    for h in targets:
        diff = min( abs(h-min_h), abs(max_h-h) )
        cost += diff ** 2
        # print(h, diff, cost)
    return cost

def find_min_cost(heights):
    min_h, max_h = min(heights), max(heights)
    if max_h - min_h <= ALLOWED_HEIGHT:
        return 0

    # 허용치 17을 만족하기 위한 height 차이 (탐색범위)
    diff = (max_h - min_h) - ALLOWED_HEIGHT
    # 가장 많이 깍게 되는 경우를 최대치로 설정하고
    min_pair = min_h+diff, max_h-diff
    min_cost = calc_cost(heights, *min_pair)
    # min_h 를 시작으로 diff 차이만큼 구간을 옮기며 cost 계산
    for h in range(min_h, min_h+diff):
        cost = calc_cost(heights, h, h+ALLOWED_HEIGHT)
        # print(h, h+ALLOWED_HEIGHT, '==>', cost)
        if cost < min_cost:
            min_cost = cost
            min_pair = h, h+ALLOWED_HEIGHT
    return min_cost, min_pair

print( find_min_cost(heights) )
## 결과
# [20, 4, 1, 24, 21]
# (18, (4, 21))
```

### 문제23

[USACO 2013 December Contest, Bronze Problem 2. Cow Baseball](http://www.usaco.org/index.php?page=viewproblem2&cpid=359)

나는 `combinations` 를 사용했는데, 책에서는 `bisect` 로 탐색을 수행했다

- `from itertools import combinations`
  - 조합을 구한 후 정렬하고, 조합의 거리값으로 조건을 비교한다
- `from bisect import bisect_left, bisect_right`
  - 배열이 정렬되어 있어야 하고, 찾는 값이 배열 내에 존재해야 한다

> 내가 제출한 코드

```python
lines = [
    # '5','3','1','10','7','4'
    '7','16','14','23','18','1','6','11'
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

def read_data():
    n = int(input())
    data = []
    for i in range(n):
        data.append( int(input()) )
    return data

positions = read_data()
positions.sort()
print(f'positions={positions}')

from itertools import combinations
def find_xyz(positions):
    results = []
    for tp in combinations(positions,3):
        xyz = sorted(tp)
        dist_xy = xyz[1]-xyz[0]
        dist_yz = xyz[2]-xyz[1]
        if dist_xy <= dist_yz <= dist_xy*2:
            results.append(xyz)
    return results

tuples = find_xyz(positions)
print( '==>', tuples )
print( len(tuples) )

## 결과
# positions=[1, 3, 4, 7, 10]
# [[1, 3, 7], [1, 4, 7], [1, 4, 10], [4, 7, 10]]
# 4
# positions=[1, 6, 11, 14, 16, 18, 23]
# ==> [[1, 6, 11], [1, 6, 14], [1, 6, 16], [1, 11, 23], [6, 11, 16], [6, 11, 18], [6, 14, 23], [11, 14, 18], [11, 16, 23], [14, 16, 18], [14, 18, 23]]
# 11
```

> 다른 제출자 코드

```python
from bisect import bisect_left, bisect_right
lines = [
    # '5','3','1','10','7','4'
    '7','16','14','23','18','1','6','11'
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

def read_data():
    n = int(input())
    data = []
    for i in range(n):
        data.append( int(input()) )
    return data

positions = read_data()
positions.sort()
print(f'positions={positions}')

n = len(positions)
total = 0
for i in range(n):
    for j in range(i+1, n):
        xy_diff = positions[j] - positions[i]
        low_pos = positions[j] + xy_diff
        high_pos = positions[j] + xy_diff*2
        left = bisect_left(positions, low_pos)
        right = bisect_right(positions, high_pos)
        if right-left > 0:
            print(f'x({positions[i]}), y({positions[j]})에 대해 거리값 {low_pos}~{high_pos} 범위에 해당하는 아이템 개수 ==> {right-left} (인덱스 {left}:{right})')
        total += right - left

print(total)

## 결과
# positions=[1, 6, 11, 14, 16, 18, 23]
# x(1), y(6)에 대해 거리값 11~16 범위에 해당하는 아이템 개수 ==> 3 (인덱스 2:5)
# x(1), y(11)에 대해 거리값 21~31 범위에 해당하는 아이템 개수 ==> 1 (인덱스 6:7)
# x(6), y(11)에 대해 거리값 16~21 범위에 해당하는 아이템 개수 ==> 2 (인덱스 4:6)
# x(6), y(14)에 대해 거리값 22~30 범위에 해당하는 아이템 개수 ==> 1 (인덱스 6:7)
# x(11), y(14)에 대해 거리값 17~20 범위에 해당하는 아이템 개수 ==> 1 (인덱스 5:6)
# x(11), y(16)에 대해 거리값 21~26 범위에 해당하는 아이템 개수 ==> 1 (인덱스 6:7)
# x(14), y(16)에 대해 거리값 18~20 범위에 해당하는 아이템 개수 ==> 1 (인덱스 5:6)
# x(14), y(18)에 대해 거리값 22~26 범위에 해당하는 아이템 개수 ==> 1 (인덱스 6:7)
# 11

# [
#   [1, 6, 11], [1, 6, 14], [1, 6, 16],
#   [1, 11, 23],
#   [6, 11, 16], [6, 11, 18],
#   [6, 14, 23],
#   [11, 14, 18],
#   [11, 16, 23],
#   [14, 16, 18],
#   [14, 18, 23]
# ]
```

### 문제24

[DMOPC '20 Contest 2 P2 - Lousy Christmas Presents](https://dmoj.ca/problem/dmopc20c2p2)

> 내가 제출한 코드

```python
lines = [
    '4 2','1 2 3 4','1 3','2 3'  # --> 3
    # '3 2','1 2 3','2 5','1 1'  # --> 1
    # '3 1','1 2 3','3 2'  # --> 0
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

def read_data():
    # n 스카프 길이, m 친척 숫자
    n, m = list(map(int, input().split()))
    # 스카프 색상
    scarf = list(map(int, input().split()))
    # 친척이 원하는 색상 (처음,끝)
    data = []
    for i in range(m):
        data.append( list(map(int, input().split())) )
    return n, m, scarf, data

n, m, scarf, wants = read_data(lines)
print(f'scarf_size={n}')
print(f'n_wants={m}')
print(f'scarf={scarf}')
print(f'wants={wants}')

def find_index(arr, value):
    for i, v in enumerate(arr):
        if v == value:
            yield i

def find_part(scarf, head, tail):
    longest_size = 0
    heads = [ i for i in find_index(scarf, head) ]
    for i in heads:
        tails = [ j for j in find_index(scarf, tail) if j >= i ]
        # [1:1] 도 한칸이기 때문에 +1을 해야 한다
        if tails:
            size = max(tails)-i+1
            if size > longest_size:
                print(scarf[i], scarf[max(tails)], '==>', size)
                longest_size = size
    return longest_size

longest_size = 0
for w in wants:
    size = find_part(scarf, w[0], w[1])
    longest_size = size if size > longest_size else longest_size

print(longest_size)

## 결과
# scarf_size=4
# n_wants=2
# scarf=[1, 2, 3, 4]
# wants=[[1, 3], [2, 3]]
# 1 3 ==> 3
# 2 3 ==> 2
# 3
```

> 다른 제출자 코드

```python

```

### 문제25

[DMOPC '17 Contest 4 P1 - Ribbon Colouring Fun](https://dmoj.ca/problem/dmopc17c4p1)

문제에 `Subtask #N` 이라는 항목으로 테스트 배점이 표시되어 있다.<br>
(Constraints) `N,Q <= 1000` 가 40점, `N,Q <= 1000000` 가 60점

- 내가 제출한 코드는 `TLE [>2.000s, 34.38 MB]` 판정받아 40점 밖에 못받음
  - 내 코드는 `set` 을 이용해 겹쳐지는 부분을 제거했고
- 반면에 책 정답은 `AC [0.170s, 21.05 MB]` 로 100점을 받음
  - 책 코드는 `rightmost_position` 으로 색칠된 영역을 유지하는 방식으로 했다

> 내가 제출한 코드

```python
lines = [
    '20 4','18 19','4 16','4 14','5 12'
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

def read_data():
    n, q = list(map(int, input().split()))
    data = []
    for i in range(q):
        data.append( list(map(int, input().split())) )
    return n, data

n, strokes = read_data()
strokes.sort()  # key=lambda x: (x[0], x[1]))
print(f'N={n}, strokes={strokes}')

painted = set()
left, right = n, 0
for s in strokes:
    painted.update(range(s[0],s[1]))

print(painted)
print(n-len(painted), len(painted))

## 결과
# N=20, strokes=[[4, 14], [4, 16], [5, 12], [18, 19]]
# {4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 18}
# 7 13
```

> 다른 제출자 코드

```python
lines = [
    '20 4','18 19','4 16','4 14','5 12'
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

lst = input().split()
n, q = int(lst[0]), int(lst[1])

strokes = []
for i in range(q):
    stroke = input().split()
    strokes.append( [int(stroke[0]), int(stroke[1])])
strokes.sort()

rightmost_position = 0
blue = 0

for stroke in strokes:
    stroke_start = stroke[0]
    stroke_end = stroke[1]
    if stroke_start <= rightmost_position:
        if stroke_end > rightmost_position:
            blue += stroke_end - rightmost_position
            rightmost_position = stroke_end
    else:
        blue += stroke_end - stroke_start
        rightmost_position = stroke_end

print(n - blue, blue)
```

### 문제 26

[(백준) 토마토가 모두 익을 때까지의 최소 날짜 구하기](https://www.acmicpc.net/problem/7576)

익은 토마토를 중심으로 상하좌우의 인접 토마토가 익는데 1일이 소요된다.<br>
모든 토마토가 익을 때까지 며칠이 소요되는지 구하라.<br>
(단, 비어있는 셀은 -1로 표시되고 모두 익을 수 없는 경우에는 -1을 출력)

- 시간 복잡도가 있는 문제라서, 결과가 맞아도 점수를 받지 못함
- 탐색의 문제라 deque 와 bfs 탐색전략을 사용해야 올바르다

> 내가 제출한 코드

```python
m, n = 6, 4
# days = 8
box = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
# days = -1 (토마토가 모두 익지는 못하는 상황이면 -1을 출력해야 한다)
#box = [0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
# days = 6
#box = [1, -1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, -1, 1]


def get_adjacent(m, n, idx) -> list:
    indices = [
        None if idx < m else idx - m,       # up
        None if idx > m*(n-1) else idx + m, # down
        None if idx%m == 0 else idx - 1,    # left
        None if idx%m == m-1 else idx + 1,  # right
    ]
    # return list(filter(None, indices))
    # box 총 크기를 벗어나는 숫자(m*n)가 발생하지만 필터링으로 제외
    return list(filter(lambda x: x != None and 0 <= x < m*n, indices))


# 익지 않은 토마토 주변에 인접한 공간이 없는 상태가 발견되면
# 모두 익을 수 없는 상태로 판단하고 중단시키기
def exists_impossible(box, m, n) -> bool:
    unripen_indices = [ i for i, x in enumerate(box) if x == 0 ]
    for i in unripen_indices:
        adjacent_indices = [ x for x in get_adjacent(m, n, i) if box[x] >= 0 ]
        # print(i, adjacent_indices)
        if not adjacent_indices:
            return True
    return False


def become_ripe(box, m, n):

    def find_unripen(ripen_indices) -> list:
        unripen_indices = set()
        for i in ripen_indices:
            indices = [ x for x in get_adjacent(m, n, i) if box[x] == 0 ]
            unripen_indices.update(indices)
        return sorted(unripen_indices)

    ripen_indices = [ i for i, x in enumerate(box) if x > 0 ]
    # print('- ripen_indices:', ripen_indices)
    # 안익은 토마토 위치 찾아내기
    unripen_indices = find_unripen(ripen_indices)
    # print('- unripen_indices:', unripen_indices)
    # 익은 토마토로 상태 변경
    for i in unripen_indices:
        box[i] = 1
    return len(unripen_indices)


def main(box, m, n):
    # 초기 상태
    print(box)

    # 익을 수 없는 상태가 존재하는지 체크 (한번만 실행)
    if exists_impossible(box, m, n):
        print('-1')
        return

    days = 0
    while box.count(0) > 0:
        days += 1
        # print('unripen remains:', box.count(0))
        ripen_cnt = become_ripe(box, m, n)
        print(f'day {days}: {ripen_cnt} items became ripe')
        print(box)

    print(days)


main(box, m, n)
```

출력결과

```text
[1, -1, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, 0, 0, 0, -1, 0, 0, 0, 0, 0, -1, 1]
day 1: 2 items became ripe
[1, -1, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, -1, 1, 0, 0, 0, 0, -1, 1]
day 2: 2 items became ripe
[1, -1, 0, 0, 0, 0, 1, -1, 0, 0, 0, 1, 1, 0, 0, 0, -1, 1, 0, 0, 0, 0, -1, 1]
day 3: 4 items became ripe
[1, -1, 0, 0, 0, 1, 1, -1, 0, 0, 1, 1, 1, 1, 0, 0, -1, 1, 1, 0, 0, 0, -1, 1]
day 4: 4 items became ripe
[1, -1, 0, 0, 1, 1, 1, -1, 0, 1, 1, 1, 1, 1, 1, 0, -1, 1, 1, 1, 0, 0, -1, 1]
day 5: 4 items became ripe
[1, -1, 0, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 0, -1, 1]
day 6: 2 items became ripe
[1, -1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, -1, 1]
6
```

> 다른 제출자 코드

출처: [[백준] 7576: 토마토 (파이썬 / 해설포함)](https://jae04099.tistory.com/entry/%EB%B0%B1%EC%A4%80-7576-%ED%86%A0%EB%A7%88%ED%86%A0-%ED%8C%8C%EC%9D%B4%EC%8D%AC-%ED%95%B4%EC%84%A4%ED%8F%AC%ED%95%A8)

```python
# bfs 특 queue 사용하기
# deque 모듈 안쓰면 시간복잡도 박살남(pop(0)이 시간복잡도가 O(n)이고 popleft()가 O(1)이라고 함)
from collections import deque

m, n = map(int, input().split())
# 토마토 받아서 넣기. 이차원 리스트로 만들어질거.
matrix = [list(map(int, input().split())) for _ in range(n)]
# 좌표를 넣을거니까 []를 넣자.
queue = deque([])
# 방향 리스트. [dx[0], dy[0]]은 곧 [-1, 0]이고 이는 왼쪽으로 이동하는 위치이다.
# 그려보면 이해하기 편함
dx, dy = [-1, 1, 0, 0], [0, 0, -1, 1]
# 정답이 담길 변수
res = 0

# queue에 처음에 받은 토마토의 위치 좌표를 append 시킨다
# n과 m을 사용하는걸 헷갈리지 말아야 함!
for i in range(n):
    for j in range(m):
        if matrix[i][j] == 1:
            queue.append([i, j])

# bfs 함수. 한번 들어가면 다 돌고 나오니까 재귀 할 필요 없음
def bfs():
    while queue:
        # 처음 토마토 좌표 x, y에 꺼내고
        x, y = queue.popleft()
        # 처음 토마토 사분면의 익힐 토마토들을 찾아본다.
        for i in range(4):
            nx, ny = dx[i] + x, dy[i] + y
            # 해당 좌표가 좌표 크기를 넘어가면 안되고, 그 좌표에 토마토가 익지 않은채로 있어야 함(0).
            if 0 <= nx < n and 0 <= ny < m and matrix[nx][ny] == 0:
                # 익히고 1을 더해주면서 횟수를 세어주기
                # 여기서 나온 제일 큰 값이 정답이 될 것임
                matrix[nx][ny] = matrix[x][y] + 1
                queue.append([nx, ny])

bfs()
for i in matrix:
    for j in i:
        # 다 찾아봤는데 토마토를 익히지 못했다면 -1 출력
        if j == 0:
            print(-1)
            exit(0)
    # 다 익혔다면 최댓값이 정답
    res = max(res, max(i))

# 처음 시작을 1로 표현했으니 1을 빼준다.
print(res - 1)
```

### 문제27

(백준) [1로 만들기](https://www.acmicpc.net/problem/1463)

정수 X에 사용할 수 있는 연산은 다음과 같이 세 가지 이다. (동적계획법)

- X가 3으로 나누어 떨어지면, 3으로 나눈다.
- X가 2로 나누어 떨어지면, 2로 나눈다.
- 1을 뺀다.

> 내가 제출한 코드

```python

```

> 다른 제출자 코드 (상향식)

```python
lines = [
    '10'  # --> 3
    #'2'  # --> 1
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

n = int(input())

# dp 는 연산 횟수를 카운팅
dp = [0] * (n+1)
# i 는 연산 대상인 값 (아래 +1 들은 연산 회수 증가를 뜻함)
for i in range(2, n+1):
    dp[i] = dp[i-1] + 1    # -1 연산
    if i % 2 == 0:
        dp[i] = min(dp[i], dp[i//2] + 1)    # //2 연산
    if i % 3 == 0:
        dp[i] = min(dp[i], dp[i//3] + 1)    # //3 연산

print(dp[n])
```

### 문제28

[코딩테스트 깊이우선탐색(DFS)](https://han-py.tistory.com/242)

DFS의 핵심은 방문하자마자 visited를 체크하는 것이다. 인접행렬로 푼다.

- 정점의 인덱스가 1~V 까지라서 V+1 을 사용한다 (0은 안씀)

```python
lines = [
    # 정점(V)과 간선수(E), 정점간 연결(v-w)
    '7 8', '1 2 1 3 2 4 2 5 4 6 5 6 6 7 3 7'
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

V, E = list(map(int, input().split()))
temp = list(map(int, input().split()))

# 재귀호출로 찾을 때까지 탐색
def dfs(v):
    visited[v] = 1
    print(v, end=" ")

    for w in range(V+1):
        # 간선으로 연결되어 있고, 방문을 안했다면 dfs!
        if G[v][w] == 1 and visited[w] == 0:
            dfs(w)

#간선을 넣는 곳이다(2차원으로 바꿔주자.)
G = [ [0 for _ in range(V+1)] for _ in range(V+1) ]

# 방문을 체크해 주는 곳이다.
visited = [ 0 for _ in range(V+1) ]

# 1 2 가 들어오면 1, 2와 2, 1을 둘다 체크한다
for i in range(0, len(temp)-1):
    G[ temp[i] ][ temp[i+1] ] = 1
    G[ temp[i+1] ][ temp[i] ] = 1

# 1에서 시작하기 때문에 1을 대입하자
dfs(1)

## 결과
# 1 2 3 7 6 4 5
```

### 문제 29

[이진탐색 트리 - BFS](https://gingerkang.tistory.com/86)

BFS 클래스에 DFS 함수를 재귀호출, 반복호출 방식으로 구현해보았다.

- DFS 루프 방식을 구현할 때는 스택을 사용해야 한다.
- 초보자들이 실수하는 가장 큰것이 visited 배열을 안만드는 것이다. 반드시 만들어 주자.

```python
# 노드 생성
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

# 노드 삽입
class BST:
    def __init__(self, root):
        self.root = root

    def insert(self, value):
        # 현재 위치를 root로 설정
        self.current_node = self.root
        while True:
            if value < self.current_node.value:
                # 왼쪽 노드 처리 : 없으면 생성, 있으면 이동 후 반복
                if self.current_node.left != None:
                    self.current_node = self.current_node.left
                else:
                    self.current_node.left = Node(value)
                    break
            else:
                # 오른쪽 노드 처리 : 없으면 생성, 있으면 이동 후 반복
                if self.current_node.right != None:
                    self.current_node = self.current_node.right
                else:
                    self.current_node.right = Node(value)
                    break

    # 노드 탐색
    def search(self, value):
        # 현재 위치를 root로 설정
        self.current_node = self.root
        # 현재 위치를 계속 확인
        while self.current_node:
            # 현재 위치에서 찾으면 반환
            if self.current_node.value == value:
                return True
            # 현재 노드값이 더 크면 왼쪽으로 이동
            elif self.current_node.value > value:
                self.current_node = self.current_node.left
            # 현재 노드값이 더 작으면 오른쪽으로 이동
            else:
                self.current_node = self.current_node.right
        return False

    # 왼쪽 호출, 없으면 오른쪽 호출
    def dfs_recursive(self, value):
        def _dfs(curr):
            print(curr.value)
            if curr.value == value:
                return True
            if curr.left != None:
                return _dfs(curr.left)
            if curr.right != None:
                return _dfs(curr.right)
            return False
        # root로부터 재귀호출 탐색
        return _dfs(self.root)

    # stack 을 사용한다
    def dfs_iteration(self, value):
        # visited = 방문한 꼭지점들을 기록한 리스트
        visited = []
        # dfs는 stack, bfs는 queue개념을 이용한다.
        stack = [ self.root ]
        while stack:
            curr = stack.pop()
            if curr == None: continue
            print(curr.value)
            if curr.value == value:
                return True
            #현재 node가 방문한 적 없다 -> visited에 추가한다.
            #그리고 해당 node의 자식 node들을 stack에 추가한다.
            if curr not in visited:
                visited.append(curr)
                stack.extend([curr.right, curr.left])
        return False

root = Node(5)
bst = BST(root)
bst.insert(1)
bst.insert(2)
bst.insert(7)
bst.insert(4)
bst.insert(8)
bst.insert(10)

print( bst.dfs_iteration(4))

# print(bst.search(2))   # True
# print(bst.search(5))   # False
# print(bst.search(7))   # True
# print(bst.search(8))   # True
# print(bst.search(15))  # False
```

> 반복문 형태의 DFS 탐색

```python
graph = {'A':['B','C'],
         'B':['A','D','E'],
         'C':['A','G','H'],
         'D':['B'],
         'E':['B','F'],
         'F':['E'],
         'G':['C'],
         'H':['C']}

def dfs_iteration(graph, start):
    # 다음 이동(파생) 위치를 유지하는 stack 과
    stack = [start]
    # 이미 지나온 경로를 유지하는 visited 가 있어야 함
    visited = []
    # 최초 위치로부터 더 이상 이동할 곳이 없을 때까지
    while stack:
        # 현재 위치를 꺼내고 (선입후출)
        # 만약 queue 를 사용하면 너비우선(BFS) 탐색이 됨
        curr = stack.pop()
        # 아직 탐색되지 않은 곳이면
        if curr not in visited:
            # 탐색 기록을 하고 (추가적으로 할 작업 있으면 여기서)
            visited.append(curr)
            # 다음 이동 경로를 추가
            stack.extend(graph[curr])
    return visited

dfs_iteration(graph,'A')
# ==> ['A', 'C', 'H', 'G', 'B', 'E', 'F', 'D']
```

> 반복문 형태의 너비 우선 탐색(BFS)

`deque` 는 `list` 처럼 `queue[ idx ]` 로 원소를 조회할 수 있음

```python
from collections import deque

def bfs_iteration(graph, start):
    # 초기값 (생성자 이용)
    queue = deque( [start] )
    visited = []
    while queue:
        curr = queue.popleft()
        if curr not in visited:
            visited.append(curr)
            queue.extend(graph[curr])
    return visited

print( bfs_iteration(graph, 'A') )
# ==> ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'F']
```

> 반복문 형태의 binary search

```python
def binary_search(array, target, start, end):
    while start <= end:
        mid = (start + end) // 2
        if array[mid] == target:
            return mid
        elif array[mid] > target:
            end = mid -1
        else:
            start = mid +1
    return None

result = binary_search(array, target, 0, n - 1)
```

### 문제 30

[코딩테스트 - 정렬 알고리즘](https://jaemunbro.medium.com/python-%EC%BD%94%EB%94%A9%ED%85%8C%EC%8A%A4%ED%8A%B8-%EB%8C%80%EB%B9%84-cheat-sheet-839a0681738f)

```python
array = [2, 3, 1, 4]

# 가장 작은 값과 SWAP (이중루프)
def selection_sort(array, reverse=False):
    for i in range(len(array)):
        min_index = i
        for j in range(i+1, len(array)):
            if array[j] < array[min_index]:
                min_index = j
                array[i], array[min_index] = array[min_index], array[i]
    return array

# pivot 값을 중심으로 나머지(tail) 값들을 작은값, 큰값으로 나누어 재귀 처리
def quick_sort(array):
    if len(array) <= 1:
        return array

    pivot = array[0] # first element as pivot
    tail = array[1:] # list accept pivot
    left_side = [x for x in tail if x <= pivot] # left side
    right_side = [x for x in tail if x > pivot] # right side
    return quick_sort(left_side) + [pivot] + quick_sort(right_side)

print( selection_sort(array[:]) )
print( quick_sort(array[:]) )
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
