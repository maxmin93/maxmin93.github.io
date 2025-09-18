---
date: 2021-01-02 00:00:00 +0900
title: Effective PYTHON 2nd - Ch01
description: Effective Python 의 1장을 요약 했습니다.
categories: [Language, Python]
tags: [book]
---

![Cover - Effective Java 3rd](https://effectivepython.com/images/cover_2ed.jpg){: width="320" .w-75 .normal}
_도서 - Effective PYTHON 2nd_

## 1장 파이썬답게 생각하기

### 01) 사용중인 파이썬의 버전을 알아두라 <a id="item01" />

:bangbang: &nbsp; 2020년 1월1일부터 파이썬2는 더이상 지원되지 않는다. 파이썬3를 사용할 것!<br>
:bangbang: &nbsp; **Pyspark 는 python 3.8 이상과 호환되지 않는다.** 3.7 버전을 사용해야 함 [&#9658;stackoverflow][1]

```shell
$ python3 --version
Python 3.7.9
```

### 02) PEP 8 스타일 가이드를 따르라 <a id="item02" />

공백 관련 스타일 가이드

- Tab 대신에 Space 4칸을 사용하라
- 각 함수와 클래스 사이에, 클래스 내에서 메소드 사이에 빈 줄 2개를 넣어라
- dict 에서 key 와 콜론(:) 사이에 공백을 넣지 말 것
- 변수 대입시 '=' 앞뒤로 공백
- 타입 표기시 콜론(:)과 타입 사이에 공백

명명 규약 스타일 가이드

- 함수, 변수, 속성은 소문자와 밑줄을 사용
- 보호되어야 하는 인스턴스 속성은 \_underscore 처럼 밑줄로 시작한다
- private 인스턴스 속성은 \_\_double_underscore 처럼 밑줄 두개로 시작한다
- 클래스는 대문자로 시작하는 낙타 표기법 사용
- 모듈 수준의 상수는 모두 대문자 표기

식과 문 스타일 가이드

- 긍정적인 식을 부정하지 말고, 부정을 내부에 넣어라
- 빈 컨테이너 또는 시퀀스를 len(something) == 0 비교하지 말것 (&rarr; if not something:)
- 한 줄짜리 if, for, while 문 등을 사용하지 말 것
- 여러 줄에 걸쳐 식을 쓸 때는 역슬래시('\\') 보다 괄호를 이용

:bangbang: &nbsp; **_TIP._** &nbsp; HTML/markdown 심볼 표기 [&#9658;link][2]

### 03) 3 bytes와 str의 차이를 알아두라 <a id="item03" />

```python
print(b'foo'.decode('utf-8'))   # 바이트 -> 문자
# foo

print('한글'.encode('utf-8'))   # UTF-8에서 한글은 3바이트임
# b'\xed\x95\x9c\xea\xb8\x80'

b'one' + 'two'
# >>> TypeError: can't concat str to bytes

assert b'blue' < 'red'
# >>> TypeError: '<' not supported between instances of 'bytes' and 'str'
```

### 04) C 스타일 형식 문자열을 str.format로 쓰기보다는 f-문자열을 통한 인터폴레이션을 사용하라 <a id="item04" />

```python
a = 1234.5678
formatted = format(a, ',.2f')   # 파이썬 3.x 부터 format 도입
print(formatted)
# 1,234.57

key = 'my_var'
value = 1.234
formatted = f'{key} = {value}'  # 파이썬 3.6 부터 인터폴레이션 도입
print(formatted)
# my_var = 1.234

formatted = f'{key!r:<10} = {value}'
print(formatted)
# 'my_var'   = 1.234

places = 3
number = 1.23456
print(f'I choose number: {number:.{places}f}')
# I choose number: 1.235
```

### 05) 복잡한 식을 쓰는 대신 도우미 함수를 작성하라 <a id="item05" />

**DRY 원칙** : <span style="color:blue">반복하지 말라 (Don't Repeat Yourself)</span>

```python
from urllib.parse import parse_qs

# URL의 query string 을 파싱
my_values = parse_qs('red=5&blue=1&green=', keep_blank_values=True)
print(repr(my_values))

# 코드가 반복되고 지저분해졌다 (가독성 X)
red_value = my_values.get('red', [''])[0] or 0
yellow_value = my_values.get('yellow', [''])[0] or 0
blue_value = int(my_values.get('blue', [''])[0]) if my_values.get('blue', [''])[0] else 0
green_value = int(my_values.get('green', [''])[0]) if my_values.get('green', [''])[0] else 0

print(f'red = {red_value!r}')
print(f'yellow = {yellow_value!r}')
print(f'blue = {blue_value!r}')
print(f'green = {green_value!r}')
"""
{'red': ['5'], 'blue': ['1'], 'green': ['']}
red = '5'
yellow = 0
blue = 1
green = 0
"""
```

- or 을 삼항연산자처럼 사용했다 => 그러나 if/else 를 사용하는 것이 바르다
- 단지 두세번에 불과할지라도 반복 적용하려면, helper 함수를 작성하는 것이 옳다.

```python
# helper 함수
def get_first_int(values, key, default=0):
    found = values.get(key, [''])
    if found[0]:
        return int(found[0])
    return default

# 코드가 간결해졌다 (가독성 O)
print(f'red = { get_first_int(my_values,"red") !r}')
print(f'yellow = { get_first_int(my_values,"yellow") !r}')
print(f'blue = { get_first_int(my_values,"blue") !r}')
print(f'green = { get_first_int(my_values,"green") !r}')
"""
red = 5
yellow = 0
blue = 1
green = 0
"""
```

### 06) 인덱스를 사용하는 대신 대입을 사용해 데이터를 언패킹하라 <a id="item06" />

파이썬에는 불변 순서쌍을 만들어낼 수 있는 tuple 내장 타입이 있다.

```python
# 괄호를 이용해 멀티라인 작성
snack_calories = {
    '감자칩': 140,
    '팝콘': 80,
    '땅콩': 190
}
snack_items = tuple(snack_calories.items())
print(snack_items)
# (('감자칩', 140), ('팝콘', 80), ('땅콩', 190))

snack_pair = ('약과', '호박엿')     # tuple: immutable object
#snack_pair[0] = '양갱'
# >>> TypeError: 'tuple' object does not support item assignment

first_snack, second_snack = snack_pair  # unpacking
print(first_snack, '&', second_snack)
# 약과 & 호박엿

def bubble_sort(a, copy=False):
    b = a[:] if copy else a     # shallow copy: use copy.copy()
                                # deep copy를 원한다면: use copy.deepcopy()
    for _ in range(len(b)):
        for i in range(1, len(b)):
            if b[i] < b[i-1]:
                b[i-1], b[i] = b[i], b[i-1] # swap using unpacking
                # temp 변수를 사용해 값 바꾸기를 하지 않아도 된다 (3줄짜리가 1줄로)
    return b

snack_names = ['프레즐','당근','쑥갓','베이컨']
bubble_sort(snack_names)    # 원본 데이터를 변경했음
print(snack_names)
# ['당근', '베이컨', '쑥갓', '프레즐']
snack_names = ['생강','프레즐','당근','쑥갓','베이컨']
print(bubble_sort(snack_names, True))   # copy 객체를 변경
# ['당근', '베이컨', '생강', '쑥갓', '프레즐']
```

파이썬다운 방식은 코딩은 다음과 같다

```python
for rank, (name, calories) in enumerate(snack_calories.items(), 1):
    print(f'#{rank}: {name!r}은 {calories} 칼로리입니다')
"""
#1: '감자칩'은 140 칼로리입니다
#2: '팝콘'은 80 칼로리입니다
#3: '땅콩'은 190 칼로리입니다
"""
```

파이썬은 list, 함수 인자, 키워드 인자, 다중 반환값 등에 대한 언패킹 기능도 제공한다.<br>
&rarr; &nbsp; 언패킹을 이용하면 인덱스 사용을 피하고, 더 명확하고 파이썬다운 코드를 만들 수 있다.

### 07) range보다는 enumerate를 사용하라 <a id="item07" />

enumerate 의 두번째 파라미터로 start_index 지정할 수 있다 (default=0)

```python
# index 와 다음 원소를 가져온다
it = enumerate(favor_list)
print(next(it))
print(next(it))
# (0, '바닐라')
# (1, '초콜릿')
```

### 08) 여러 이터레이터에 대해 나란히 루프를 수행하려면 zip을 사용하라 <a id="item08" />

- zip 내장함수를 사용해 여러 iterator를 나란히 iteration 할 수 있다
- zip은 tuple을 지연 계산하는 generator를 만든다. 따라서 무한히 긴 입력에도 zip을 쓸 수 있다
- zip은 가장 짧은 iterator 길이까지만 tuple을 내놓는다 (yield)
  - 길이가 서로 다른 이터레이터에 대해 수행하려면, itertools.zip_longest 함수를 사용하라

```python
# 하나의 tuple 로 만들어 연산하면 쉽다
names = ['Cecilia', '남궁민수', '해모수']
counts = [ len(n) for n in names ]

# 가장 긴 이름을 찾는다
longest_name = None
max_count = 0

# 시각적으로 잡음이 많은 코드
for i in range(len(names)):
# for i, name in enumerate(names):      # <-- 동일한 코드
    count = counts[i]
    if count > max_count:
        longest_name = names[i]
        max_count = count
print(longest_name)

for name, count in zip(names, counts):
    if count > max_count:
        longest_name = name
        max_count = count
print(longest_name)

# names 쪽이 counts 보다 하나 더 많아졌다
# 이런 경우 짧은쪽 기준으로 zip이 동작한다
names.append('Rosalind')
for name, count in zip(names, counts):
    print(f'{name}: {count}')   # Rosalind 가 출력되지 않는다

# itertools.zip_longest 를 활용하면 더 긴 배열을 기준으로 병합한다
# --> 디폴트 fillvalue 는 None (채우기)
import itertools
for name, count in itertools.zip_longest(names, counts):
    print(f'{name}: {count}')
```

### 09) for나 while 루프 뒤에 else 블록을 사용하지 말라 <a id="item09" />

- 파이썬은 for 나 while 루프 블록 바로 뒤에 else 블록을 허용하는 특별한 문법을 제공한다
  - 루프 뒤에 오는 else 블록은 루프가 반복되는 도중에 break 를 만나지 않은 경우에만 실행된다
- 동작이 직관적이지 않고 혼동을 야기할 수 있으므로 루프 뒤에 else 블록을 사용하지 말라

```python
for i in range(3):
    print('Loop', i)
else:
    print('Else block!')
# Else block! 출력

# for x in []:      # 마찬가지로 else 실행
while False:        # break 없는 loop
    print('이 줄은 실행되지 않음')
else:
    print('Else block!')
# Else block! 출력

for i in range(3):
    print('Loop', i)
    if i == 1:
        break       # break 를 만난 경우 else 실행 안함
else:
    print('Else block!')
# Else block! 출력 안됨

# 서로소(coprime) 관계를 판단하는 코드
a = 4
b = 9

# else 가 정상 종료 후 실행되는 finally 역활을 하고 있다
# => loop 실행 범위가 달라지는 경우 후처리를 else 로 수행
for i in range(2, min(a,b)+1):
    print('검사중:', i)
    if a % i == 0 and b % i == 0:
        print('서로소 아님')
        break
else:
    print('서로소 관계')

# 이보다는 `default return` 처리를 이용하는 것이 옳다
def coprime(a, b):
    # 또는 결과 변수를 사용해도 동일한 동작을 보인다
    # is_coprime = True
    for i in range(2, min(a,b)+1):
        # 서로소(coprime)가 아닌 경우를 검사
        if a % i == 0 and b % i == 0:
            # is_coprime = False; break
            return False    # 검사에 의한 return
    # return is_coprime
    return True             # default return: 검사에 걸리지 않은 모든 경우

assert coprime(4, 9)
assert not coprime(3, 6)
```

### 10) 대입식을 사용해 반복을 피하라 <a id="item10" />

- 왈러스 연산자 `:=`(대입식): :bangbang: &nbsp; **파이썬 3.8(이상)** 에서 새로 도입된 구문
  - 왈러스(walrus) == 바다코끼리
- **대입식** 은 대입문이 쓰일 수 없는 위치에서 변수에 값을 대입할 수 있으므로 유용하다
  - 대입식이 더 큰 식의 일부분으로 쓰일 때는 괄호로 둘러싸야 한다
- 파이썬에서는 `switch/case 문`이나 `do/while 루프`를 쓸 수 없지만, 대입식을 활용하면 더 깔끔하게 흉내낼 수 있다

```python
# 대입식(왈라스)이 사용되었다: `count`가 여러번 사용되는 경우를 제거
# =>
#   count = fresh_fruit.get('레몬', 0):
#   if count:
if count := fresh_fruit.get('레몬', 0):
    make_lemonade(count)
else:
    out_of_stock()

# =>
#   count = fresh_fruit.get('사과', 0):
#   if count >= 4:
if ( count := fresh_fruit.get('사과', 0) ) >= 4:
    make_lemonade(count)
else:
    out_of_stock()

# switch/case 구문이 없기 때문에 if/elif/else 구문 작성시 대입문이 유용하다!
# 1) 일반적인 switch/case 구문
count = fresh_fruit.get('바나나', 0)
if count >= 2:
    pieces = slice_bananas(count)
    to_enjoy = make_smoothies(pieces)
else:
    count = fresh_fruit.get('사과', 0)
    if count >= 4:
        to_enjoy = make_cider(count)
    else:
        count = fresh_fruit.get('레몬', 0)
        if count:
            to_enjoy = make_lemonade(count)
        else:
            to_enjoy = None

# 2) 대입문을 활용한 switch/case 구문
if (count := fresh_fruit.get('바나나', 0)) >= 2:
    # ...(count)
elif (count := fresh_fruit.get('바나나', 0)) >= 4:
    # ...(count)
elif count := fresh_fruit.get('바나나', 0):
    # ...(count)
else:
    to_enjoy = None

# while 무한루프 구문에서도 대입식이 유용하게 쓰인다
# 1) 일반적인 while 구문
bottles = []
while True:
    fresh_fruit = pick_fruit()
    if not fresh_fruit:     # 중간에서 끝내기
        break
    # ...
    bottles.append(...)

# 2) 대입식을 활용한 while 구문
bottles = []
while fresh_fruit := pick_fruit():
    # ...
    bottles.append(...)
```

[1]: https://stackoverflow.com/a/61834136
[2]: https://www.toptal.com/designers/htmlarrows/

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
