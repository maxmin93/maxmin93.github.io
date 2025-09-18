---
date: 2021-01-05 00:00:00 +0900
title: Effective PYTHON 2nd - Ch04
description: Effective Python 의 4장을 요약 했습니다.
categories: [Language, Python]
tags: [book]
---

![Cover - Effective Java 3rd](https://effectivepython.com/images/cover_2ed.jpg){: width="320" .w-75 .normal}
_도서 - Effective PYTHON 2nd_

## 4장 컴프리헨션과 제너레이터

### 27) map과 filter 대신 컴프리헨션을 사용하라 <a id="item27" />

- 리스트 컴프리헨션은 lambda 식을 사용하지 않기 때문에 map, filter 내장 함수보다 더 명확하다
  - map 을 사용할 때 원소를 건너뛰려면 filter 가 필요하다
- 딕셔너리와 집합도 컴프리헨션으로 생성할 수 있다

```python
even_squares = [x**2 for x in a if x % 2 == 0]

even_squares_dict = {x: x**2 for x in a if x % 2 == 0}
threes_cubed_set  = {   x**3 for x in a if x % 3 == 0}

alt_dict = dict(map( lambda x: (x, x**2), filter(lambda x: x%2 == 0, a) ))
alt_set  = set (map( lambda x: x**3, filter(lambda x: x%3 == 0, a) ))
```

### 28) 컴프리헨션 내부에 제어 하위 식을 세 개 이상 사용하지 말라 <a id="item28" />

- 컴프리헨션은 여러 수준의 루프를 지원하며, 각 수준마다 여러 조건을 지원한다
- 제어 하위식이 세개 이상인 경우 이해하기 매우 어려우므로 가능하면 피해야 한다

```python
matrix = [[1,2,3], [4,5,6], [7,8,9]]
filtered = [[x for x in row if x % 3 == 0] for row in matrix if sum(row) <= 10]
# 보기에 시각적으로 어지럽다 => helper 함수를 이용하자!

helper = lambda row: [x for x in row if x % 3 == 0]
filtered = [helper(row) for row in matrix if sum(row) <= 10]
```

### 29) 대입식을 사용해 컴프리헨션 안에서 반복 작업을 피하라 <a id="item29" />

- 대입식을 이용해 컴프리헨션이나 제너레이터 식의 가독성과 성능을 향상시킬 수 있다
- 조건이 아닌 부분에도 대입식을 사용할 수 있지만, 그런 형태의 사용은 피해야 한다
- 대입식은 파이썬 3.8이상부터 사용가능

```python
# `get_batches(stock.get(name, 0), 8)`가 두번 쓰임
found = {name: get_batches(stock.get(name, 0), 8)
    for name in order if get_batches(stock.get(name, 0), 8)
}
# 대입식(왈러스 연산자)을 사용하면 간결해짐 (조건식에서 대입 처리)
found = {name: batches
    for name in order if (batches := get_batches(stock.get(name, 0), 8))
}

result = {name: tenth for name, count in stock.items() if (tenth := count // 10) > 0}
print(result)
# >>> {'못': 12, '나사': 3, '와서': 2}

# 컴프리헨션의 값 부분에서 왈러스 연산자를 사용할 때 그 값의 조건 부분이 없다면
# 루프 밖 영역으로 루프 변수가 노출된다 (last 변수)
half = [(last := count // 2) for count in stock.values()]
print(f'{half}의 마지막 원소는 {last}')

for cnt in range(10):   # 루프 변수 cnt 가 노출된다
    pass
print(cnt)              # 밖에서도 사용 가능. 몰랐음! (다른 언어에서는 scope를 벗어나 오류남)
# >>> 9                 # => cnt 의 마지막 값 유지
```

### 30) 리스트를 반환하기보다는 제너레이터를 사용하라 <a id="item30" />

- generator 를 사용하면 결과를 list 에 합쳐 반환하는 것보다 깔끔해진다
  - iterator 는 yield 의 반환값들로 이루어진 집합을 만들어낸다
- generator 를 사용하면 작업 메모리에 모든 입력, 출력을 저장할 필요가 없어 입력이 아주 커도 출력을 만들 수 있다

```python
# 1) 코드에 잡음이 많고 핵심을 알아보기 어렵다
#    => 새로운 결과를 찾을 때마다 append 호출
# 2) 결과 리스트를 만드는 줄과 결과를 반환하는 줄
def index_words(text):
    result = []
    if text:
        result.append(0)
    for index, letter in enumerate(text):
        if letter == ' ':
            result.append(index+1)      # 핵심 코드: index + 1
    return result

# 개선하는 방법은 generator 를 이용하는 것
# => 훨씬 읽기 쉽다
def index_words(text):
    if text:
        yield 0
    for index, letter in enumerate(text):
        if letter == ' ':
            yield index+1               # 핵심 코드: index + 1

# generator는 호출시 실행되지 않고, 즉시 iterator를 반환한다
it = index_words_iter(address)
print(next(it))

# 모든 반환값을 메모리에 저장하여 list 생성 -> 메모리 부족 가능성
result = list( index_words_iter(address) )
print(result[:10])

# 반면 같은 함수를 제너레이터 버전으로 만들면,
# 입력 길이가 아무리 길어도 가장 긴 한줄만큼의 메모리가 소비된다
def index_file(handle):
    offset = 0
    for line in handle:
        if line:
            yield offset
        for letter in line:
            offset += 1
            if letter == ' ':
                yield offset

```

### 31) 인자에 대해 이터레이션할 때는 방어적이 돼라 <a id="item31" />

- 입력 인자를 여러번 이터레이션 하는 함수나 메서드를 조심하라
  - iterator 는 결과를 한번만 만들어낸다 (StopIteration)
- `__iter__` 메서드를 제너레이터로 정의하면 쉽게 이터러블 컨테이너 타입을 정의할 수 있다
- 이터레이터인지를 검사하려면, iter 내장함수에 넘겨서 반환되는 값이 같은지 확인하면 된다
  - 또는 `if isinstance( object, collections.abc.Iterator )`

```python
def read_visits(data_path):
    with open(self.data_path) as f:
        for line in f:
            yield int(line)                 # 소진되면서 파일 포인터가 계속 변경된다

it = read_visits('my_numbers.txt')
percentages = normalize(it)
print(percentage)
# >>> []                                    # 모든 원소를 다 소진했다


# 컨테이너 클래스 : 반복 사용되어도 문제 없다
class ReadVisits:
    def __init__(self, data_path):
        self.data_path = data_path
    # iterator protocol: __iter__, __next__
    def __iter__(self):                     # 매번 새로운 iterator 반환 (소진되지 않은)
        with open(self.data_path) as f:     # => 파일 포인터가 0부터 시작
            for line in f:
                yield int(line)

visits = ReadVisits(path)
percentages = normalize(visits)
assert sum(percentages) == 100.0


# 반복 가능한 iterator 인지 검사하는 방어 코드 삽입
from collections.abc import Iterator

def normalize_defensive(numbers):
    if not isinstance(numbers, Iterator):       # 반복 가능한 iterator 인지 검사
        raise TypeError('컨테이너를 제공해야 합니다')
    total = sum(numbers)                        # 한번 소진 (new iterator)
    result = []
    for value in numbers:                       # 두번째 소진 (new iterator)
        percent = 100 * value / total
        result.append(percent)
    return result

# 컨테이너가 아닌 iterator 를 넣으면 예외를 발생시킨다
visits = [15, 35, 80]
it = iter(visits)
normalize_defensive(it)
# >>> TypeError: 컨테이너를 제공해야 합니다
```

### 32) 긴 리스트 컴프리헨션보다는 제너레이터 식을 사용하라 <a id="item32" />

- 제너레이터 식은 이터레이터처럼 한번에 원소를 하나씩 출력하기 때문에 메모리 문제를 피할 수 있다
- 다른 제너레이터를 하위식으로 사용함으로써 제너레이터 식을 합성할 수 있다
  - 서로 연결된 제너레이터 식은 매우 빠르게 실행되며 메모리도 효율적으로 사용한다

```python
# 파일에서 읽은 x 에는 새줄 문자가 들어 있으므로, 눈에 보이는 길이보다 1만큼 더 길다
value = [len(x) for x in open('my_file.txt')]
# type: list

# 이런 문제를 해결하기 위해 generator 를 사용한다
value = (len(x) for x in open('my_file.txt'))
# type: generator

# 두 generator 식을 합성할 수 있다
it = ...                            # generator 1st
roots = ((x, x**0.5) for x in it)   # generator 2nd
print(next(roots))      # root 와 함게 내부의 이터레이터도 전진
```

### 33) yield from을 사용해 여러 제너레이터를 합성하라 <a id="item33" />

- 만약 제너레이터를 합성한다면 가급적 `yield from`을 사용하라

```python
def move(period, speed):
    for _ in range(period):
        yield speed

def pause(delay):
    for _ in range(delay):
        yield 0

def run(func):
    for delta in func():
        render(delta)

# animate 가 너무 반복적 코드로 구성됨
def animate():
    for delta in move(4, 5.0):
        yield delta
    for delta in pause(3):
        yield delta
    for delta in move(2, 3.0):
        yield delta

# 고급 제너레이트 기법: 내포된 제너레이트의 모든 값을 내보낸다
def animate_composed():
    yield from move(4, 5.0)
    yield from pause(3)
    yield from move(2, 3.0)

run(animate_composed)
```

### 34) send로 제너레이터에 데이터를 주입하지 말라 <a id="item34" />

- send 메서드를 사용해 데이터를 제너레이터에 주입할 수 있다
- send 와 yield from 식을 함께 사용하면 제너레이터의 출력에 None이 불쑥불쑥 나타나는 의외의 결과를 얻을 수 있다
  - 합성할 제너레이터들의 입력으로 제너레이터를 전달하는 방식이 send 사용보다 낫다 <br>
    (send 를 가급적 사용하지 말라)

```python
def my_generator():
    received = yield 1
    print(f'받은 값 = {received}')

it = iter(my_generator())
output = next(it)
print(f'출력값 = {output}')
# >>> 출력값 = 1

try:
    next(it)
except StopIteration:
    pass
# >>> 받은 값 = None

it = iter(my_generator())
output = it.send(None)      # 첫번째 제너레이트 출력
print(f'출력값 = {output}')

try:
    it.send('안녕')         # 값을 제너레이트에 넣는다
except StopIteration:
    pass
# >>> 받은 값 = 안녕

# 이를 이용하여,
# 입력 시그널을 바탕으로 사인파의 진폭을 변조할 수 있는 함수를 작성할 수 있다

# ==> 잘 모르겠고, 복잡하다. 사용하지 말자!
```

### 35) 제너레이터 안에서 throw로 상태를 변화시키지 말라 <a id="item35" />

- throw 메서드를 사용하면 제너레이터가 마지막으로 실행한 yield 식의 위치에서 예외를 다시 발생시킬 수 있다
- throw 를 사용하면 가독성이 나빠진다
  - 예외를 잡아내고 다시 발생시키는데 준비코드가 필요하며, 내포단계가 깊어지기 때문이다
- 제너레이터에서 예외적인 동작을 제공하는 더 나은 방법은 `__iter__` 메서드를 구현하는 클래스를 사용하면서 <br>
  예외적인 경우에 상태를 전이시키는 것이다

```python
class MyError(Exception):
    pass

def my_generator():
    yield 1
    try:
        yield 2
    except MyError:
        print('MyError 발생!')
    else:
        yield 3
    yield 4

it = my_generator()
next(it)        # >>> 1
next(it)        # >>> 2
it.throw(MyError('test error'))
# >>> MyError 발생!
# >>> 4         <-- 예외 처리와 함께 4 까지 출력된다


"""
def timer(period):
    current = period
    while current:
        current -= 1
        try:
            yield current
        except Reset:           # 예외처리 코드
            current = period

def run():
    it = timer(4)
    while True:
        try:
            if check_for_reset():               # 매번 예외 검사
                current = it.throw(Reset())     # Exception class
            else:
                current = next(it)              # 정상 작동시
        except StopIteration:
            break
        else:
            announce(current)

"""

# throw 를 사용하지 말고 예외 처리를 하는 generator 컨테이너 클래스를 작성하자
class Timer:
    def __init__(self, period):
        self.current = period
        self.period = period

    def reset(self):
        self.current = self.period

    def __iter__(self):
        while self.current:
            self.current -= 1
            yield self.current

def check_for_reset():
    # 외부 이벤트를 폴링한다
    ...

def announce(remaining):
    print(f'{remaining} 틱 남음')

def run():
    timer = Timer(4)
    for current in timer:
        if check_for_reset():   # 예외적인 동작 검사 (throw를 사용하지 않는다)
            timer.reset()       # => 예외에 대한 조치 동작
        announce(current)

```

### 36) 이터레이터나 제너레이터를 다룰 때는 itertools를 사용하라 <a id="item36" />

- 복잡한 iteration 코드를 작성할 때, 혹시 쓸만한 기능이 없는지 itertools 를 살펴보라
- itertools 함수는 세가지 범주로 나눌 수 있다
  - 여러 이터레이터를 연결함 <br>
    chain, repeat, cycle, tee, zip_longest
  - 이터레이터의 원소를 걸러냄 <br>
    islice, takewhile, dropwhile, filterfalse
  - 원소의 조합을 만들어 냄 <br>
    accumulate, product, permutations, combinations, combinations_with_replacement

```python
import itertools

##############################
# 여러 이터레이터 연결하기
##############################

it = itertools.chain([1,2,3], [4,5,6])
list(it)
# >>> [1,2,3,4,5,6]

it = itertools.repeat('hi', 3)
list(it)
# >>> ['hi','hi','hi']

it = itertools.cycle([1,2])
result = [next(it) for _ in range(10)]
# >>> [1,2, 1,2, 1,2, 1,2, 1,2]

it1, it2, it3 = itertools.tee(['one', 'two'], 3)
list(it1), list(it2), list(it3)
# >>> ['one', 'two'], ['one', 'two'], ['one', 'two']

keys = ['one', 'two', 'three']
values = [1, 2]
# normal = list(zip(keys, values))
it = itertools.zip_longest(keys, values, fillvalue='없음')
list(it)
# >>> [(one, 1), (two, 2), (three, 없음)]

##############################
# 이터레이터에서 원소 거르기
##############################

values = [1,2,3,4,5,6,7,8,9,10]

itertools.islice(values, 5)             # >>> 1, 2, 3, 4, 5
itertools.islice(values, 2, 8, 2)       # >>> 3, 5, 7

less_than_seven = lambda x: x < 7
it = itertools.takewhile(less_than_seven, values)
# >>> 1, 2, 3, 4, 5, 6

it = itertools.dropwhile(less_than_seven, values)
# >>> 7, 8, 9, 10

evens = lambda x: x % 2 == 0
# filter(evens, values)                 # >>> 2, 4, 6, 8, 10
itertools.filterfalse(evens, values)
# >>> 1, 3, 5, 7, 9

##############################
# 이터레이터에서 원소의 조합 만들어내기
##############################

values = [1,2,3,4,5,6,7,8,9,10]

itertools.accumulate(values)            # fold 연산
# >>> 1, 3, 6, 10, 15, 21, 28, 36, 45, 55

itertools.product([1,2], repeat=2)      # 데카르트 곱
# >>> [(1,1), (1,2), (2,1), (2,2)]
itertools.product([1,2], ['a','b'])     # 데카르트 곱: 리스트 2개
# >>> [(1,a), (1,b), (2,a), (2,b)]

itertools.permutations([1,2,3], 2)
# >>> [(1,2), (1,3), (2,1), (2,3), (3,1), (3,2)]

itertools.combinations([1,2,3], 2)
# >>> [(1,2), (1,3), (2,3)]

itertools.combinations_with_replacement([1,2,3], 2)
# >>> [(1, 1), (1, 2), (1, 3), (2, 2), (2, 3), (3, 3)]
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
