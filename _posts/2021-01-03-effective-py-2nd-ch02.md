---
date: 2021-01-03 00:00:00 +0900
title: Effective PYTHON 2nd - Ch02
description: Effective Python 의 2장을 요약 했습니다.
categories: [Language, Python]
tags: [book]
---

![Cover - Effective Java 3rd](https://effectivepython.com/images/cover_2ed.jpg){: width="50%" .w-75 .normal}
_도서 - Effective PYTHON 2nd_

## 2장 리스트와 딕셔너리

### 11) 시퀀스를 슬라이싱하는 방법을 익혀라 <a id="item11" />

- 슬라이싱 할 때는 **간결하게** 하라. _시작 인덱스_ 에 0을 넣거나, _끝 인덱스_ 에 시퀀스 길이를 넣지 말라!
- 슬라이싱은 범위를 넘어가는 시작 인덱스나 끝 인덱스도 허용한다. ex) `a[:20]`, `a[-20:]`
- 리스트 슬라이스에 대입하면 원래 시퀀스에서 슬라이스가 가리키는 부분을 대입연산자 오른쪽에 있는 시퀀스로 대치한다.<br>
  이때 대치되는 시퀀스의 길이가 달라도 된다.

```python
a = ['a','b','c','d','e','f','g','h']

# 리스트를 슬라이싱 한 결과는 완전히 새로운 리스트이다
b = a[3:]
print('이전:', b)       # >>> ['d','e','f','g','h']
b[1] = 99
print('이후:', b)       # >>> ['d','99','f','g','h']
# 원래 리스트에 대한 참조는 그대로 유지된다
print('변화 없음:', a)  # >>> ['a','b','c','d','e','f','g','h']

# 대입되는 리스트의 길이가 더 짧기 때문에, 리스트가 줄어든다
a[2:7] = [99, 22]
print('이후:', a)       # >>> ['a','b',99,22,'h']

# 리스트 복사 (새 리스트)
b = a[:]
assert b == a and b is not a    # 내용은 같지만, 객체는 다르다

b = a
a[:] = [101, 102, 103]
assert a is b                   # 여전히 같은 리스트 객체 (내용도 같다)
```

### 12) 스트라이드와 슬라이스를 한 식에 함께 사용하지 말라 <a id="item12" />

- 스트라이드를 사용하는 구문은 종종 예기치 못한 동작이 일어나서 버그를 야기할 수 있다 (주의!)
- 슬라이싱 구문에 스트라이딩까지 들어가면 아주 혼란스럽다

```python
x = '초밥'
y = x[::-1]
print(y)                        # >>> '밥초' (유니코드)

x = '초밥'.encode('utf-8')
y = x[::-1]                     # utf-8 에서 한글은 3바이트
print(y.decode('utf-8'))        # >>> '$#@FDSAF' (안된다!!)

# 스트라이딩 한 결과를 변수에 대입한 다음 슬라이싱 하라!
y = x[::2]                      # 스트라이드로 데이터를 줄이고
z = y[1:-1]                     # 원하는 데이터 구간을 슬라이싱 (얕은 복사)

# 성능이 필요할 때에는 itertools.islice() 사용
islice('ABCDEFG', 2)            # --> A B
islice('ABCDEFG', 2, 4)         # --> C D
islice('ABCDEFG', 2, None)      # --> C D E F G
islice('ABCDEFG', 0, None, 2)   # --> A C E G
```

### 13) 슬라이싱보다는 나머지를 모두 잡아내는 언패킹을 사용하라 <a id="item13" />

- 언패킹 대입에 별표식을 사용하면 언패킹 패턴에서 대입되지 않는 모든 부분을 리스트에 잡아낼 수 있다
- 리스트를 서로 겹치지 않게 여러 조각으로 나눌 경우, 슬라이싱과 인덱싱을 사용하기 보다는<br>
  나머지를 모두 잡아내는 언패킹을 사용해야 실수할 여지가 훨씬 줄어든다

```python
car_ages = [0, 9, 4, 6, 8, 7, 19, 1, 5, 4 ]
car_ages_descending = sorted(car_ages, reverse=True)
# 별표식(*others) : 모든 값을 담는 언패킹
oldest, second_oldest, *others = car_ages_descending
print(oldest, second_oldest, others)
# >>> 19 9 [8, 7, 6, 5, 4, 4, 1, 0]

oldest, *others, youngest = car_ages_descending
print(oldest, others, youngest)
# >>> 19 [9, 8, 7, 6, 5, 4, 4, 1] 0

# 별표식 언패킹을 사용하려면, 적어도 하나 이상의 필수 변수가 있어야 한다
*others = car_ages_descending
# >>> SyntaxError: starred assignment target must be in a list or tuple

# 별표식은 항상 list 인스턴스가 된다
short_list = [1, 2]
first, second, *rest = short_list
# >>> 1, 2, []

# 언패킹을 이터레이터에 사용할 수도 있지만 그닥 유용하진 않다
it = iter(range(1,3))
first, second, *rest = it
# >>> 1, 2, []

def generate_csv():
    yield('날짜', '제조사', '모델', '연식', '가격')
    yield('2020-01-01', 'BMW', 'X5', '2019', '$50000')

# iterator를 슬라이스로 처리하는 방법
all_csv_rows = list(generate_csv())
header = all_csv_rows[0]
rows = all_csv_rows[1:]
print('CSV header:', header)
print('CSV rows:', rows)
# >>> CSV header: ('날짜', '제조사', '모델', '연식', '가격')
# >>> CSV rows: [('2020-01-01', 'BMW', 'X5', '2019', '$50000')]

# 별표식을 이용하면 iterator 언패킹이 훨씬 깔끔하다
it = generate_csv()
header, *rows = it

# 다만, iterator의 나머지 데이터가 모두 메모리에 들어갈 수 있다고 확신할 때만
# 별표식 언패킹을 사용해야 한다!
```

### 14) 복잡한 기준을 사용해 정렬할 때는 key 파라미터를 사용하라 <a id="item14" />

- 리스트 타입의 sort 메서드를 사용하면 같은 내장 타입인 경우 자연스러운 순서로 정렬할 수 있다
- sort 메서드의 key 파라미터를 사용해 비교할 객체를 반환하는 helper 함수를 제공할 수 있다
- key 함수에서 튜플을 반환하면 여러 정렬 기준을 하나로 엮을 수 있다

```python
class Tool:
    def __init__(self, name, weight):
        ...

tools = [
    Tool('Angular', 3.6),
    Tool('Hammer', 1.25),
    Tool('Driver', 0.5),
    Tool('Scratcher', 0.25)
]
tools.sort()
# >>> TypeError: 객체 비교를 위한 메서드가 정의되어 있지 않아 오류

# key 파라미터로 helper 함수 제공
tools.sort(key=lambda x: x.name)

# 튜플은 임의의 파이썬 값을 넣을 수 있는 불변타입이다
# 튜플은 두개 이상의 필드값을 정렬하는 가장 쉬운 해법
saw = (5, '원형톱')
jackhammer = (40, '착암기')
assert not (jackhammer < saw)   # 첫번째 위치 비교

drill  = (4, 'Drill')
sander = (4, 'Sander')
assert drill < sander           # 두번째 위치까지 비교

# 튜플을 이용해 두개 이상의 필드값으로 정렬
tools.sort(key=lambda x: (x.weight, x.name), reverse=True)

# 멀티 필드 정렬이면서 특정 숫자 필드에 대해서 역순 정렬 (minus 이용)
tools.sort(key=lambda x: (-x.weight, x.name))

# 문자열(str)은 minus 이용한 역순 정렬이 안되므로, 두번 정렬
tools.sort(key=lambda x: x.name)                # 순서 보존
tools.sort(key=lambda x: x.weight, reverse=True)
```

### 15) 딕셔너리 삽입 순서에 의존할 때는 조심하라 <a id="item15" />

- 파이썬 3.7부터는 dict 타입도 순서 보존이 된다 (언어명세에 포함)
  - 그 외 딕셔너리와 비슷한 클래스가 있지만 key 순서 보존을 반드시 보장할 수 없으므로 주의해야 한다
- OrderedDict 는 key 순서 보존을 위해 이전에 자주 쓰이던 클래스
  - 만약 빈번하게 item을 push 하고 pop 한다면, dict 보다 OrderedDict 가 낫다

```python
baby_names = {
    'cat': 'kitten',
    'dog': 'puppy'
}

print(list(baby_names).keys())
print(list(baby_names).values())
print(list(baby_names).items())
print(baby_names.popitem())         # 마지막에 삽입된 원소
"""
>>> ['cat', 'dog']
>>> ['kitten', 'puppy']
>>> [('cat','kitten'), ('dog','puppy')]
>>> ('dog','puppy')
"""

# 클래스도 인스턴스 딕셔너리에 dict 타입을 사용한다
class MyClass:
    def __init__(self):
        self.alligator = 'hatchling'
        self.elephant = 'calf'

a = MyClass()
for key, value in a.__dict__.items()
    print(f'{key} = {value!r}')
# >>> alligator = 'hatchling'
# >>> elephant = 'calf'
```

### 16) in을 사용하고 딕셔너리 키가 없을 때 KeyError를 처리하기보다는 get을 사용하라 <a id="item16" />

- 딕셔너리 키가 없는 경우를 처리하는 방법 <br>

1. in 연산자 <br>
2. KeyError 예외처리 <br>
3. setdefault 메서드 : `get_or_set` 동작을 수행 (가독성이 좋지 않지만)

- Counter 와 같이 기본타입 값이 들어가는 딕셔너리를 다룰 때는 get 메서드가 가장 좋다
  - 딕셔너리 아이템 삽입 비용이 비싸거나, 예외가 발생할 수 있는 경우에도 get 메서드가 좋다
- setdefault 를 사용하는 방법이 적합해 보인다면, defaultdict 사용도 고려해 보자
  - 기본타입 사용시 defaultdict <br>
    `from collections import defaultdict; dict = defaultdict(int)`
  - 빈도 계산시 Counter <br>
    `from collections import Counter; dict = Counter(아이템 리스트 또는 아이템 카운트 딕셔너리)`

```python
votes = {
    '바게뜨': ['철수', '순이'],
    '치아바타': ['하니', '유리']
}
key = '브리오슈'
who = '단이'

names.append(who)
print(votes)
# >>> { ..., '브리오슈': ['단이']}

# in 연산자로 key 검사
if key in votes:
    names = votes[key]
else:       # key 가 없으면 빈 리스트 생성
    votes[key] = names = []

# key 존재 검사를 무시하고 예외처리
try:
    names = votes[key]
except KeyError:
    votes[key] = names = []

# get 메서드 사용후 값을 검사
names = votes.get(key)
if names is None:
    votes[key] = names = []

# 대입식은 파이썬 3.8부터 사용 가능
if (names := votes.get(key)) is None:
    votes[key] = names = []

# get 메서드와 같지만, default 값을 제공한다
names = votes.setdefault(key, [])
names.append(who)

# 이럴거라면 defaultdict 를 사용하는게 낫다 (다음 17절에서 설명)
count = counters.setdefault(key, 0)     # defaultdict(int)
counters[key] = count + 1
```

### 17) 내부 상태에서 원소가 없는 경우를 처리할 때는 setdefault보다 defaultdict를 사용하라 <a id="item17" />

```python
class Visits:
    def __init__(self):
        self.data = {}
        # self.data = defaultdict(set)

    # 클래스 메서드가 setdefault 호출에 대한 복잡도를 가려준다
    def add(self, country, city):
        # 다루어야 할 dict가 어떻게 생긴 것인지 모른다면 setdefault 메서드도 적절하다
        city_set = self.data.setdefault(country, set())
        city_set.add(city)

```

### 18) `__missing__`을 사용해 키에 따라 다른 디폴트 값을 생성하는 방법을 알아두라 <a id="item18" />

- setdefault 메서드 주의사항: 이런 경우 사용하지 말라!
  - 디폴트 값을 만드는 계산비용이 높거나
  - 만드는 과정에서 예외가 발생할 수 있다면
- defaultdict 에 전달되는 함수는 인자를 받지 않는다. (입맛대로 디폴트 값을 생성할 수 없다)
- 키가 없는 로직을 커스텀화 하고 싶다면, 직접 dict의 하위 클래스와 `__missing__` 메서드를 정의하면 된다.
  - KeyError 예외 대신 `__missing__` 메서드가 호출된다 (`dict.__getitem__` 에서 key 가 없는 경우)
  - 참고: in 연산자는 `__contains__` 메서드를 호출 (`__missing__` 과 관련이 없다)

```python
from collections import defaultdict

pictures = {}
path = 'profile_1234.png'

def open_picture(profile_path):
    try:
        return open(profile_path, 'a+b')
    except OSError:
        print(f'경로를 열 수 없습니다: {profile_path}')
        raise

pictures = defaultdict(open_picture)    # Error! profile_path 인자를 받을 수 없다
handle = pictures[path]
handle.seek(0)
image_data = handle.read()

# => setdefault, defaultdict 모두 만족할 만한 해결책이 아니다

class Pictures(dict):                   # `unknown dict`를 위한 wrapper class
    def __missing__(self, key):         # KeyError 예외 대신 __missing__ 메서드가 호출된다!
        value = open_picture(key)       # unknown dict: open_picture
        self[key] = value
        return value

pictures = Pictures()
handle = pictures[path]
handle.seek(0)
image_data = handle.read()

```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
