---
date: 2022-06-08 00:00:00 +0900
title: Python 코딩테스트 연습문제 11~20
description: 파이썬 코딩테스트 준비를 하며 공부한 내용을 기록하고 복습합니다.
categories: [Language, Python]
tags: [dmoj, 코딩테스트]
image: https://media.licdn.com/dms/image/v2/C4D1BAQG7YbBjqFK1uw/company-background_10000/company-background_10000/0/1583674843233/dmoj_cover?e=2147483647&v=beta&t=9aZhG7toXaBf8_FRw7UERNZmOr_UwrUVbubHMcUa1Y0
---

## 코딩테스트 참고자료

- 사이트(무료) [DMOJ](https://dmoj.ca/), [USA Computing Olympiad](http://usaco.org/)
- 책 [코딩 테스트로 시작하는 파이썬 프로그래밍](https://www.youngjin.com/book/book_detail.asp?prod_cd=9788931466010&seq=7029&cate_cd=1&child_cate_cd=9&goPage=1&orderByCd=1)

## 파이썬 코딩테스트

### 문제11

[CCC '18 S1 - Voronoi Villages](https://dmoj.ca/problem/ccc18s1)

이웃간 거리의 절반이 경계선이다. enumerate 사용이 핵심

- 지문에서 '경계선' 단어를 중심으로 문제를 설명했다.
    + '경계선'의 left, right 를 구한 후 mid 를 계산

### 문제12

[ECOO '17 R1 P1 - Munch 'n' Brunch](https://dmoj.ca/problem/ecoo17r1p1)

테스트케이스 1,2,3 중에 3번을 통과 못함 (Final score: 4.833/5 points)

> 내가 제출한 코드

```python
# 여행 횟수
n_trips = 10
# 1학년 ~ 4학년 비용
money = (12,10,7,5)

def input_trip():
    trip_outcome = int(input())
    ratios = [float(x) for x in input().split()]
    students = int(input())
    return (trip_outcome, ratios, students)

def compute_income(n, ratio):
    sizes = [ n*x//1 for x in ratio ]
    # 잔여 인원을 제일 큰 비율의 학년에게 배당
    sizes[ ratio.index(max(ratio)) ] += n-sum(sizes)
    # print(sizes, '==>', sum(sizes))

    global money
    from functools import reduce
    # 브런치 행사로 벌어들이는 총 수입
    income = reduce(lambda acc,cur: acc+cur, [
        x[0]*x[1] for x in zip(sizes, money)
    ])
    return income

for _ in range(n_trips):
    data = input_trip()
    income = compute_income( data[2], data[1] )
    # 수입의 절반보다 여행비용이 적다면 추가 펀드가 필요 없음
    # print(income//2, data[0], not(income//2 > data[0]))
    if income//2 > data[0]:
        print('NO')
    else:
        print('YES')
```

### 문제13

[ECOO '17 R3 P1 - Baker Brie](https://dmoj.ca/problem/ecoo17r3p1)

rotated 된 매트릭스를 생성하기 때문에 시간과 메모리에서 차이가 났다.<br>
표현 방식 또는 `열/행` 순회 방법이 잘못된게 아닌지 고민해 봐야한다.

- 내 코드 Resources: 0.320s, 21.45 MB
- 다른 코드 Resources: 0.295s, 9.50 MB

**참고**: 이중 배열의 열과 줄을 바꾸는 코드

- Transpose 2D array as shortest array
  - `list(map(list, zip(*list2d)))`
- Transpose 2D array with None as longest array
  - `list(map(list, itertools.zip_longest(*list2d, fillvalue=None)))`

> 내가 제출한 코드

```python
def each_event():
    # swap columns and rows
    def rotate_matrix(arr_of_arr):
        rotated = []
        for i in range(len(arr_of_arr[0])):
            temp = []
            for r in arr_of_arr:
                temp.append(r[i])
            rotated.append(temp)
        return rotated

    # check dozens for each days or franchises
    def count_dozens(arr_of_arr):
        dozens = 0
        for r in arr_of_arr:
            if sum(r)%13 == 0:
                dozens += sum(r)//13
        return dozens

    # input dataset
    f, d = [int(x) for x in input().split()]
    sold = []
    for i in range(d):
        sold.append( [int(x) for x in input().split()] )

    dozens = 0
    # check dozens for each days
    dozens += count_dozens(sold)
    # swap columns and rows
    franchises = rotate_matrix(sold)
    # check dozens for each franchises
    dozens += count_dozens(franchises)
    return dozens

n_events = 10
for _ in range(n_events):
    dozens = each_event()
    print(dozens)
```

> 다른 제출자 코드

```python
for data_set in range(10):
    num_franchises, num_days = [int(value) for value in input().split()]

    # 프랜차이즈별 합산을 위한 매트릭스 생성
    franchises_total = [0] * num_franchises
    bonus_count = 0

    for day in range(num_days):
        day_sales = [int(value) for value in input().split()]

        # 일별 dozens 카운트
        if sum(day_sales) % 13 == 0:
            bonus_count += sum(day_sales) // 13

        # 일일 판매량에서 프랜차이즈별 합산
        franchises_total = [a + b for a, b in zip(franchises_total, day_sales)]

    # 프랜차이즈별 dozens 카운트
    for franchise in franchises_total:
        if franchise % 13 == 0:
            bonus_count += franchise // 13

    print(bonus_count)
```

### 문제14

[CCC '99 S1 - Card Game](https://dmoj.ca/problem/ccc99s1)

주의! `slicing` 은 index 가 범위를 벗어난다고 오류를 내지 않음

- 벗어난 index 를 읽어들이는 경우 Exception 발생

### 문제15

[TIMUS 2144. Cleaning the Room](https://acm.timus.ru/problem.aspx?space=1&num=2144)

예제가 이해되지 않는다. 책 답안 참고함

- 첫줄은 전체 박스 개수
- 두번째 줄부터 각 박스의 값을 의미하는데
  - 맨 앞 숫자는 박스 안의 피규어 개수를 의미 (별 의미 없음)
  - 피규어 크기는 두번째 숫자부터 임 (박스 내부를 정렬할 수는 없다)

```text
3             # n
2 1 2         # 2개의 피규어가 있는 박스: [ 1, 2 ]
3 7 7 7       # 3개의 피규어가 있는 박스: [ 7, 7, 7 ]
1 5           # 1개의 피규어가 있는 박스: [ 5 ]
==> YES

2             # n
2 1 3         # 2개의 피규어가 있는  박스: [ 1, 3 ]
1 2           # 1개의 피규어가 있는  박스: [ 2 ]
==> NO
```

> 다른 제출자 코드 (책 답안)

```python
lines = [
    '3','2 1 2','3 7 7 7','1 5'  # --> YES
    '2','2 1 3','1 2'  # --> NO
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

def read_boxes(n):
    """
    n은 읽어야 하는 상자의 수

    입력에서 상자들을 읽고 상자들의 리스트를 반환
    각 상자는 액션 피규어의 높이를 담은 리스트
    """
    boxes = []
    for i in range(n):
        box = input().split()
        box.pop(0)
        for i in range(len(box)):
            box[i] = int(box[i])
        boxes.append(box)
    return boxes

def box_ok(box):
    """
    box는 해당 상자 내부의 액션 피규어들의 높이를 담은 리스트

    True를 반환: 상자 내 액션 피규어들의 높이 순서가 오름차순 정렬된 상태
    False를 반환: 그렇지 않은 상태
    """
    for i in range(len(box)-1):
        if box[i] > box[i+1]:
            return False
    return True

def all_boxes_ok(boxes):
    """
    boxes는 상자들의 리스트. 각 상자는 액션 피규어 높이들의 리스트

    상자 내의 액션 피규어 높이가 오름차순 정렬되어 있다면 True 반환
    그렇지 않으면 False 반환
    """
    for box in boxes:
        if not box_ok(box):
            return False
    return True

def boxes_endpoints(boxes):
    """
    boxes는 상자들의 리스트. 각 상자는 액션 피규어 높이들의 리스트

    각각 두 개의 값이 있는 리스트들을 값으로 갖는 리스트를 반환
    두 개의 값은 상자의 가장 왼쪽과 가장 오른쪽 액션 피규어의 높이
    """
    endpoints = []
    for box in boxes:
        endpoints.append([box[0], box[-1]])
    return endpoints

def all_endpoints_ok(endpoints):
    """
    endpoints는 두 개의 값을 가진 리스트를 원소로 가진 리스트
    두 개의 값은 상자의 가장 왼쪽과 오른쪽 액션 피규어의 높이

    요구사항: endpoints는 피규어의 높이로 정렬되어 있어야 합니다

    endpoints가 순서대로 정리가 가능한 상자들이라면 True를 반환
    그렇지 않으면 False를 반환
    """
    maximum = endpoints[0][1]
    for i in range(1, len(endpoints)):
        if endpoints[i][0] < maximum:
            return False
        maximum = endpoints[i][1]
    return True


# Main Program
n = int(input())
boxes = read_boxes(n)

if not all_boxes_ok(boxes):
    print('NO')
else:
    endpoints = boxes_endpoints(boxes)
    endpoints.sort()
    if all_endpoints_ok(endpoints):
        print('YES')
    else:
        print('NO')
```

### 문제16

[USACO 2020 January Contest, Bronze Problem 1. Word Processor](http://usaco.org/index.php?page=viewproblem2&cpid=987)

왜 이중루프를 썼나? (생각을 하다 마는 모양을 보니) 짜기 싫은가?

- 어려운 문제가 아니다. 코드를 작고 단순하게 작성하자
- 핵심은 단어의 합이 k 크기에 달했을 때 어떻게 할 것인지이다
  - 핵심 코드를 짜고 그 외에 다른 앞뒤를 작성하면 편하다
- for 를 쓸지, while 을 쓸지는 루프 중단 조건문에 조작이 필요한지 여부임
  - for 문은 값 또는 인덱스를 순차적으로 fetch 한다 (횟수가 정해져 있음)
  - while 문은 내부에서 중단의 조건을 변경할 수 있다 (반복 횟수가 정해져 있지 않음)
- 반복문 이후의 작업은 for 또는 while 둘다 마찬가지로 필요하다

> 내가 제출한 코드

```python
lines = [
    '10 7',
    'hello my name is Bessie and this is my essay'
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

f = open('word.in', 'rt', encoding='utf-8')
with f:
    lines = f.readlines()
# print(list(map(lambda x: x.rstrip(), lines)))

n, k = list(map(int, lines[0].split()))
words = lines[1].split()
char_sizes = lambda line: sum([len(x) for x in line])

i = 0
lines = []
line = []
while i < n:
    while i < n and char_sizes(line)+len(words[i]) <= k:
        line.append( words[i] )
        i += 1
    lines.append(line)
    line = []

# print(len(lines), '==>', lines)
f = open('word.out', 'wt', encoding='utf-8')
f.writelines([ ' '.join(line)+'\n' for line in lines ])
f.close()
```

> 다른 제출자 코드

```python
input_file = open('word.in', 'r')
line  = input_file.readline().split()
n, k = list(map(int, line))
words = input_file.readline().split()
input_file.close()

output_file = open('word.out', 'w')
line = ''
chars_on_line = 0
for word in words:
    if chars_on_line + len(word) <= k:
        line += word + ' '
        chars_on_line += len(word)
    else:
        output_file.write(line[:-1]+'\n')
        line = word + ' '
        chars_on_line = len(word)

output_file.write(line[:-1]+'\n')
output_file.close()
```

### 문제17

[USACO 2019 February Contest, Bronze Problem 2. The Great Revegetation](http://usaco.org/index.php?page=viewproblem2&cpid=916)

아-, 너무 오래 걸렸다. 핵심이 되는 부분을 빨리 생각해 내야하는데 느리다.

- 소들이 선호하는 목초지 페어 리스트들을 모아 통합된 페어 리스트를 만들고
- 목초지 페어 리스트로부터 선택 가능한 풀종자 후보군을 제시하는게 핵심
  - set 연산으로 전체 풀종자 집합에서 사용된 풀종자 집합을 뺐다

문제를 빨리 풀기 위한 전략

1. 결과의 자료구조를 정립하자! `pastures = { 목초지 : 풀종자 }`
2. 핵심 문장을 작성하자! `pastures[k] = unused_grasses(k).pop(0)`
3. 핵심 함수를 구현하자! `unused_grasses(k) = { 모든 풀종자 } - { 할당된 풀종자 }`

> 내가 제출한 코드

```python
lines = [
    '5 6',
    '4 1','4 2','4 3','2 5','1 2','1 5'
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

# 풀종자
grasses = set(range(1,5))
print(f'grasses={grasses}')

# n=목초지 개수, m=소 마리수
n, m = list(map(int, input().split()))
print(f'pastures(n)={n}, cows(m)={m}')

# 소들이 좋아하는 목초지 페어
favorites = []
for i in range(m):
    favorites.append( list(map(int, input().split())) )
print(f'favorites={favorites}')

def all_pairs():
    pairs = {}
    for k,v in favorites:
        pair = pairs.setdefault(k, set())
        pair.add(v)
        pair = pairs.setdefault(v, set())
        pair.add(k)
    return pairs

pairs = all_pairs()
print(f'pairs={pairs}')
# half_pairs={4: {1, 2, 3}, 2: {5}, 1: {2, 5}}
# all_pairs={4: {1, 2, 3}, 1: {2, 4, 5}, 2: {1, 4, 5}, 3: {4}, 5: {1, 2}}

def assign_glass(pairs):

    # 결과 = { 목초지:풀종자 }
    pastures = { k:0 for k in range(1,n+1) }

    # 페어 리스트에서 사용되지 않은 풀종자 리스트 (선택후보군)
    def unused_grasses(k):
        used = { pastures[v] for v in pairs[k] if pastures[v] != 0 }
        return sorted(grasses-used)

    for k in pastures.keys():
        # 배정 가능한 풀종자 선택후보군에서 하나를 배정
        pastures[k] = unused_grasses(k).pop(0)

    return pastures

pastures = assign_glass(pairs)
print( [ pastures[v] for v in range(1,n+1) ])

## 결과
# grasses={1, 2, 3, 4}
# pastures(n)=5, cows(m)=6
# favorites=[[4, 1], [4, 2], [4, 3], [2, 5], [1, 2], [1, 5]]
# pairs={4: {1, 2, 3}, 1: {2, 4, 5}, 2: {1, 4, 5}, 3: {4}, 5: {1, 2}}
# ==> [1, 2, 1, 3, 3]
```

> 다른 제출자 코드

핵심 로직은 비슷하다. (목초지를 기준으로 할당 가능한 풀종자를 배정)

```python
def read_cows(input_file, num_cows):
    favorites = []
    for i in range(num_cows):
        lst = input_file.readline().split()
        favorites.append( [int(lst[0]), int(lst[1])] )
    return favorites

def cows_with_favorite(favorites, pasture):
    cows = []
    for i in range(len(favorites)):
        if pasture in favorites[i]:
            cows.append(i)
    return cows

def types_used(favorites, cows, pasture_types):
    used = []
    for cow in cows:
        pasture_a, pasture_b = favorites[cow]
        if pasture_a < len(pasture_types):
            used.append( pasture_types[pasture_a] )
        if pasture_b < len(pasture_types):
            used.append( pasture_types[pasture_b] )
    return used

def smallest_available(used):
    grass_type = 1
    while grass_type in used:
        grass_type += 1
    return grass_type

def write_pastures(output_file, pasture_types):
    pasture_types_str = []
    for pasture_type in pasture_types:
        pasture_types_str.append( str(pasture_type) )
    output = ''.join(pasture_type_str)
    output_file.write(output + '\n')

# Main Program
input_file = open('revegetate.in', 'r')
output_file = open('revegetate.out', 'w')

lst = input_file.readline().split()
num_pastures, num_cows = list(map(int, lst))
favorites = read_cows(input_file, num_cows)

pasture_types = [0]
for i in range(1, num_pastures + 1):
    # 목초지를 좋아하는 소들을 식별
    cows = cows_with_favorite(favorites, i)
    # 목초지에 할당할 수 없는 풀 유형을 제거
    eliminated = types_used(favorites, cows, pasture_types)
    # 목초지에 심을 가장 작은 번호의 풀 유형을 선택
    pasture_type = smallest_available(eliminated)
    pasture_types.append(pasture_type)

# 출력
pasture_types.pop(0)
write_pastures(output_file, pasture_types)

input_file.close()
output_file.close()
```

### 문제18

[ECOO '19 R2 P1 - Email](https://dmoj.ca/problem/ecoo19r2p1)

별다른 점은 없는 문제. `set` 을 사용해 unique 이메일을 구하는 것이 핵심

> 내가 제출한 코드

```python
lines = [
    '3','foo@bar.com','fO.o+baz123@bAR.com','foo@bar..com',
    '3','c++@foo.com','c...@Foo.com','.c+c@FOO.COM',
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

def read_emails():
    n = int(input())
    emails = []
    for _ in range(n):
        emails.append( input() )
    return emails

def clean_specials(email):
    email = email.lower()
    separator_idx = email.index('@')
    email_name = ''
    for c in email[:separator_idx]:
        if c == '.':
            continue
        elif c == '+':
            break
        else:
            email_name += c
    return email_name + email[separator_idx:]


n_dataset = 10
for _ in range(n_dataset):
    # read inputs
    emails = read_emails()
    # remove special characters
    unique_emails = set([ clean_specials(email) for email in emails ])
    # output
    print(len(unique_emails))
```

> 다른 제출자 코드

```python

```

### 문제19

[CCO '99 P2 - Common Words](https://dmoj.ca/problem/cco99p2)

예제 테스트는 다 통과했는데 채점이 안된다 (다른 제출 코드도 검색 안됨)

- 빈도에 의한 `ranks` 를 생성한 후, `top_n` 에 해당하는 단어들을 찾는게 핵심
  - 빈도값 정렬에 대한 단순 `top_n` 출력으로는 항상 1개만 출력됨
- 책 답안에서는 dictionary 를 반전시켜서 빈도로 단어를 찾음

> 내가 제출한 코드

```python
lines = [
    '7 2','the','brown','the','fox','red','the','red',
    # '1 3','the','2 1','the','wash'
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

def read_data():
    n, top_n = list(map(int, input().split()))
    words = []
    for i in range(n):
        words.append( input() )
    return top_n, words

# 영어 ordinal 표기법 (11,12,13만 예외 발생)
# 예) 122 --> 122nd, 1013 --> 1013th
def order_str(top_n):
    if top_n%10 == 1 and top_n%100 != 11:
        return f'{top_n}st'
    if top_n%10 == 2 and top_n%100 != 12:
        return f'{top_n}nd'
    if top_n%10 == 3 and top_n%100 != 13:
        return f'{top_n}rd'
    return f'{top_n}th'

def find_value(counter, value):
    keys = []
    for k, v in counter.items():
        if v == value:
            keys.append(k)
    return keys

from collections import Counter
def find_topn(top_n, words):
    desc_counter = Counter(words)
    ranks = sorted( set(desc_counter.values()), reverse=True)
    # print(ranks)

    print(f'{order_str(top_n)} most common word(s):')
    if top_n-1 < len(ranks):
        print( '\n'.join(find_value(desc_counter, ranks[top_n-1])) )
    else:
        print()
    print()


# main
n_dataset = int(input())
for _ in range(n_dataset):
    top_n, words = read_data()
    find_topn(top_n, words)
```

### 문제20

[USACO 2016 December Contest, Silver Problem 2. Cities and States](http://usaco.org/index.php?page=viewproblem2&cpid=667)

풀고 보니 다른 방식이 더 나아서 다시 작성했다. (조합된 combo 키를 구성)

- 내 코드는 키를 state 또는 city의 앞 2자인 1차원만 사용했다
  - 두개의 딕셔너리로 상호적으로 사용된 후보군을 찾은 후 쌍을 찾았는데 (2단계)
  - `combination` 을 사용해 모든 조합을 딕셔너리 쌍으로 탐색해야 함

- 다른 코드는 키를 2차원, 즉 `(state, city 앞 2자)` 또는 `(city 앞 2자, state)` 로 구성해 사용했다
  - 하나의 딕셔너리로 키를 바꿔서 카운팅 후 `//2` 로 쌍의 개수를 계산함 (조합)
  - 탐색 횟수는 2번으로 동일하지만 메모리 사용량은 절감됨

> 내가 제출한 코드

```python
lines = [
    '6',
    'MIAMI FL','DALLAS TX','FLINT MI','CLEMSON SC','BOSTON MA','ORLANDO FL'
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))

def read_data():
    n = int(input())
    data = []
    for i in range(n):
        data.append( input().split() )
    return data

data = read_data()
# 순방향 조합 딕셔너리 : (city 앞 2자, state)
combo_dict = { (v[0][:2], v[1]):v for v in data }
# 역방향 조합 키집합 : (state, city 앞 2자)
reverse_combo_keys = { (k[1], k[0]) for k in combo_dict.keys() }

# 역방향 조합 콤보키가 존재하는 데이터를 카운팅
def find_pairs(combo_dict, keys):
    return [ k for k in keys if k in combo_dict ]

pairs = find_pairs(combo_dict, reverse_combo_keys)

# 순방향과 역방향 모두 카운팅 되었기 때문에 //2 수행
print(len(pairs)//2, pairs)
## 결과
# 1 [('MI', 'FL'), ('FL', 'MI')]
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
