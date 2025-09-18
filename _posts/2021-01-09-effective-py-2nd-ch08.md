---
date: 2021-01-09 00:00:00 +0900
title: Effective PYTHON 2nd - Ch08
description: Effective Python 의 8장을 요약 했습니다.
categories: [Language, Python]
tags: [book]
---

![Cover - Effective Java 3rd](https://effectivepython.com/images/cover_2ed.jpg){: width="320" .w-75 .normal}
_도서 - Effective PYTHON 2nd_

## 8장 강건성과 성능

- 기능을 개발한 후에는
- 오류가 발생해도 문제가 없도록 **프로덕션화** 해 코드를 방탄처리를 해야 한다
- 강건성(robust)에는 **규모 확장성** 과 **성능** 이라는 차원이 포함된다

### 65) `try/except/else/finally`의 각 블록을 잘 활용하라 <a id="item65" />

1. finally 블록

예외가 발생하더라도 정리 코드를 실행해야 한다면, try/finally를 사용하라

```python
def try_finally_example(filename):
    print('* file open')
    handle = open(filename, encoding='utf-8')   # OSError
                                # 파일 open 오류는 finally 처리가 되어서는 안되므로
                                # try 블록 바깥에서 실행
    try:
        print('* read data')
        return handle.read()    # UnicodeDecodeError
                                # 예외 발생시 try_finally_example 호출자에게 예외 반환
    finally:
        print('* close file')
        handle.close()          # try 블록이 실행된 다음에는 항상 이 블록이 실행됨
                                # => 예외가 발생하더라도, 먼저 파일을 닫는다 (그 후에 예외 반환)

#############################

filename = 'random_data.txt'
with open(filename, 'wb') as f:
    f.write(b'\xf1\xf2\xf3\xf4')    # 잘못된 utf-8 이진 문자열

data = try_finally_example(filename)
```

2. else 블록

코드에서 처리할 예외와 호출 스택을 거슬러 올라가며 전달할 예외를 명확히 구분하기 위해 try/except/else 를 사용하라.<br>
<br>
try 블록이 예외를 발생시키지 않으면 else 블록이 실행된다.<br>
else 블록을 사용하면 try 블록 안에 들어갈 코드를 최소화 할 수 있다. (가독성 좋아짐)<br>
==> 원래 한묶음으로 작성될 코드가 try 블록으로 갈라지게 되는 경우

```python
import json

def load_json_key(data, key):
    try:
        print('* read JSON data')
        result_dict = json.loads(data)      # ValueError
    except ValueError as e:
        print('* ValueError exception')
        raise KeyError(key) from e
    else:                                   # try 블록 외부
        print('* search key')
        return result_dict[key]             # KeyError

###############################

assert load_json_key('{"foo": "bar"}', 'foo') == 'bar'
>>> 정상

load_json_key('{"foo": "bar', 'foo') == 'bar'
>>>
Traceback ...
JSONDecodeError: ...

Traceback ...
KeyError: 'foo'

```

3. 모든 요소를 한꺼번에 사용하기

예를 들어, 파일을 읽어 처리한 다음에 원본 파일 자체를 변경하고 싶다면<br>

- try 블록: 파일을 읽고 처리
- except 블록: try 블록에서 예상되는 예외를 처리
- else 블록: 원본 파일의 내용을 변경하고, 오류 발생시 돌려준다
- finally 블록: 파일 핸들을 닫는다

### 66) 재사용 가능한 `try/finally` 동작을 원한다면 contextlib과 with 문을 사용하라 <a id="item66" />

- with 문을 사용하면 try/finally 블록을 통해 사용해야 하는 로직을 재활용 하면서 시각적인 잡음도 줄 일 수 있다.
- `contextlib 내장모듈`이 제공하는 `contextmanager 데코레이터`를 사용하면 사용자 함수를 `with문`에 사용할 수 있다.
- 컨텍스트 매니저가 yield 하는 값은 `with문`의 as 부분에 전달된다.<br>
  이를 활용하면 특별한 컨텍스트 내부에서 실행되는 코드 안에서 직접 그 컨텍스트에 접근할 수 있다.

1. with 문과 try/finally 블록 (같다)

```python
from threading import Lock

lock = lock()
# with 블록에서 acquire(), release() 를 처리해줌
with lock:
    # 어떤 불변 조건을 유지하면서 작업을 수행한다
    ...

###########################
# with 문을 사용하면 try/finally 와 구조가 같다

lock.acquire()
try:
    # 어떤 불변 조건을 유지하면서 작업을 수행한다
    ...
finally:
    lock.release()
```

```python
import logging

# 기본 로그수준은 warning 이라서, 사전 설정을 해주지 않으면 error 만 출력
def my_function():
    logging.debug('디버깅')
    logging.error('이 부분은 오류')
    logging.debug('추가 디버깅')


######################################
# 사용자 정의 with 구절

from contextlib import contextmanager

@contextmanager
def debug_logging(level):
    logger = logging.getLogger()
    old_level = logger.getEffectiveLevel()
    logger.setLevel(level)
    try:
        # yield 식은 with 블록의 내용이 실행되는 부분을 의미함
        yield
    finally:
        # with 블록이 끝나면 원래 log level 로 복구한다
        logger.setLevel(old_level)


with debug_logging(logging.DEBUG):
    print('* 내부 블록')
    my_function()           # 모두 출력

print('* 외부 블록')
my_function()               # error 만 출력
```

2. with 와 대상 변수 함께 사용하기

```python
with open('my_output.txt', 'w') as handle:
    handle.write('데이터입니다')

@contextmanager
def log_level(level, name):
    logger = logging.getLogger(name)
    old_level = logger.getEffectiveLevel()
    logger.setLevel(level)
    try:
        yield logger    # as 문으로 받아서 사용할 수 있음
    finally:
        logger.setLevel(old_level)

with log_level(logging.DEBUG, 'my-log') as logger:
    logger.debug(f'대상: {logger.name}')
    logging.debug('설정된 logger 를 사용 안하기 때문에 출력 안됨')
```

### 67) 지역 시간에는 time보다는 `datetime`을 사용하라 <a id="item67" />

- 여러 다른 시간대를 변환할 때는 time 모듈을 쓰지 말라
- 여러 다른 시간대를 신뢰할 수 있게 변환하고 싶으면 datetime 과 pytz 모듈을 함께 사용하라
- 항상 시간을 UTC 로 표시하고, 최종적으로 표현하기 직전에 지역시간으로 변환하라

1. time 모듈

```python

```

2. datetime 모듈

```python

```

### 68) copyreg를 사용해 pickle을 더 신뢰성 있게 만들라 <a id="item68" />

- 신뢰할 수 있는 프로그램 사이에 객체 직렬화/역직렬화에 pickle 내장 모듈이 유용하다
- 이후 클래스가 바뀔 경우 (속성의 추가/삭제 등), 이전의 pickle 객체는 안전하지 않다
- 직렬화한 객체의 하위 호환성을 보장하려면 copyreg 내장모듈과 pickle 을 함께 사용하라

1. 설계상 pickle 모듈의 직렬화 형식은 안전하지 않다<br>

- 반대로 json 모듈은 안전하다

```python

```

2. 디폴트 애트리뷰트 값

```python

```

3. 클래스 버전 지정

```python

```

4. 안정적인 임포트 경로

```python

```

### 69) 정확도가 매우 중요한 경우에는 decimal을 사용하라 <a id="item69" />

- 돈과 관련된 계산 등 높은 정밀도가 필요하거나 근삿값 계산을 제어해야 할 때는 `Decimal 클래스`가 좋다
- 부동 소수점으로 정확한 답을 계산해야 한다면 Decimal 생성자에 `str 인스턴스`를 넘겨라 (float 가 아니라)

```python

```

### 70) 최적화하기 전에 프로파일링을 하라 <a id="item70" />

- 파이썬 성능을 느리게 하는 원인이 불분명한 경우가 많으므로 최적화하기 전에 `프로파일링` 하는 것이 중요하다
- profile 대신 cProfile 모듈을 사용하라 (더 정확한 정보를 제공한다)
- 함수 호출 트리를 독립적으로 프로파일링 하고 싶다면 Profile 객체의 runcall 메서드를 사용하면 된다
- Stats 객체를 사용하면 프로파일링 정보 중에서 살펴봐야할 부분만 선택해 출력할 수 있다

```python

```

### 71) 생산자-소비자 큐로 deque를 사용하라 <a id="item71" />

- 생산자는 append를 호출해 원소를 추가하고 소비자는 pop(0) 을 사용해 원소를 받게 만들면 리스트 타입을 FIFO 큐로 사용할 수 있다.<br>
  하지만 큐 길이가 늘어남에 따라 pop(0) 성능이 나빠져 문제가 될 수 있다.
- collections 내장 모듈의 deque 클래스는 큐 길이와 관계없이 상수 시간 안에 append 와 popleft 를 수행한다.<br>
  ==> FIFO 큐 구현에 이상적

```python

```

### 72) 정렬된 시퀀스를 검색할 때는 bisect를 사용하라 <a id="item72" />

- 정렬된 리스트 데이터를 검색할 때 index 메서드 혹은 for 루프로 맹목적인 비교를 사용하면 선형 시간이 걸린다
- bisect 내장 모듈의 bisect_left 함수는 이진 검색 방식으로 O(logN) 시간이 걸린다.

```python
# index 함수 수행시 데이터 길이만큼 선형 시간이 소요된다
data = list(range(10**5))
index = data.index(91234)
assert index == 91234

# for 루프에 의한 탐색도 마찬가지로 데이터 길이만큼 시간 소요
def find_closest(sequence, goal):
    for index, value in enumerate(sequence):
        if goal < value:
            return index
    raise ValueError(f'범위를 벗어남: {goal}')

index = find_closest(data, 91234.56)
assert index == 91234
```

```python
# 이진검색 알고리즘 : 복잡도 O(logN)
from bisect import bisect_left

index = bisect_left(data, 91234)    # exact match
assert index == 91234

index = bisect_left(data, 91234.56) # closest match
assert index == 91235
```

### 73) 우선순위 큐로 heapq를 사용하는 방법을 알아두라 <a id="item73" />

- 우선순위 큐를 사용하면 선입선출이 아니라 원소의 중요도에 따라 원소를 처리할 수 있다
- 리스트로 우선순위를 구현하면 큐 크기가 커짐에 따라 프로그램 성능이 나빠진다
- heapq 내장모듈은 효율적으로 규모 확장이 가능한 우선순위 큐를 구현하는데 필요한 기능을 제공한다
- heapq 를 사용하려면 원소들이 자연스러운 순서를 가져야 한다. (`__lt__` 같은 특별 메소드 필요)

```python
class Book:
    def __init__(self, title, due_date):
        self.title = title
        self.due_date = due_date

def add_book(queue, book):
    queue.append(book)
    queue.sort(key=lambda x: x.due_date, reverse=True)

queue = []
add_book(queue, Book('돈키호테', '2020-06-07'))
add_book(queue, Book('프랑켄슈타인', '2020-06-05'))
add_book(queue, Book('레미제라블', '2020-06-08'))
add_book(queue, Book('전쟁과 평화', '2020-06-03'))

class NoOverdueBook(Exception):
    pass

# 이 기능이 수행되기 위해서는 book list 가 정렬되어 있어야 한다
def next_overdue_book(queue, now):
    if queue:
        book = queue[-1]
        if book.due_date < now:
            queue.pop()
            return book
    raise NoOverdueBook

now = '2020-06-10'

found = next_overdue_book(queue, now)
print(found.title)      # 전쟁과 평화
found = next_overdue_book(queue, now)
print(found.title)      # 프랑켄슈타인

def return_book(queue, book):
    queue.remove(book)

queue = []
book = Book('보물섬', '2020-06-04')
add_book(queue, book)

print('반납 전:', [x.title for x in queue])     # 보물섬
return_book(queue, book)
print('반납 후:', [x.title for x in queue])

try:
    next_overdue_book(queue, now)
except NoOverdueBook:
    pass                # 이 문장이 실행될 것임
else:
    assert False        # 이 문장은 실행되지 않음
```

```python
import random
import timeit

def print_result(count, tests):
    # ...
    pass

def print_delta(before, after):
    # ...
    pass

def list_overdue_benchmark(count):
    def prepare():
        to_add = list(range(count))
        random.shuffle(to_add)
        return [], to_add

    def run(queue, to_add):
        for i in to_add:
            queue.append(i)
            queue.sort(reverse=True)
        while queue:
            queue.pop()

    test = timeit.repeat(
        setup='queue, to_add = prepare()',
        stmt=f'run(queue, to_add)'
        globals=locals(),
        repeat=100,
        number=1
    )

    return print_results(count, tests)


baseline = list_overdue_benchmark(500)
for count in (1_000, 1_500, 2_000):
    comparison = list_overdue_benchmark(count)
    print_delta(baseline, comparison)

# >>> 원소수 500, 걸린 시간 0.000844초
# >>> 데이터 크기 2배, 걸린 시간 3.1배
# >>> 데이터 크기 3배, 걸린 시간 6.1배
# >>> 데이터 크기 4배, 걸린 시간 10.3배
```

```python
from heapq import heappush

def add_book(queue, book):
    heappush(queue, book)   # 정렬 가능한 개체만 가능


# 참고1: chapter.51 합성 가능한 클래스 확장이 필요할 경우 클래스 데코레이터를 활용하라
# 참고2: chapter.41 커스텀 컨테이너 타입은 collections.abc 를 상속하라
import functools
@functools.total_ordering
class Book:
    def __init__(self, title, due_date):
        self.title = title
        self.due_date = due_date

    # for 정렬
    def __lt__(self, other):
        return self.due_date < other.due_date


queue = []
add_book(queue, Book('돈키호테', '2020-06-07'))
add_book(queue, Book('프랑켄슈타인', '2020-06-05'))

# 직접 정렬하거나
queue.sort()
# heapq.heapify 함수를 이용하면 선형시간에 힙을 만들 수 있다
from heapq import heapify
heapify(queue)

# 원소 추가시 heapq.heappush 함수를 사용 (list.push 대신에)
# 원소 삭제시 heapq.heappop 함수를 사용 (list.pop 대신에)
from heapq import heappush, heappop

def run(queue, to_add):
    for i in to_add:
        heappush(queue, i)
    while queue:
        heappop(queue)

def next_overdue_book(queue, now):
    if queue:
        book = queue[0]
        if book.due_date < now:
            heappop(queue)
            return book
    raise NoOverdueBooks

# >>> 원소수 500, 걸린 시간 0.000116초
# >>> 데이터 크기 2배, 걸린 시간 2.1배
# >>> 데이터 크기 3배, 걸린 시간 3.2배
# >>> 데이터 크기 4배, 걸린 시간 4.4배
```

제시간에 반납된 책은 어떻게 처리해야 할까?<br>
==> 만기일까지 우선순위 큐에서 책을 절대 제거하지 않는 것이다. (상태변수 필요)<br>
==> 이 접근 방법을 택하면 책을 반납할 때 우선순위 큐를 변경할 필요가 없어진다

```python
import functools
@functools.total_ordering
class Book:
    def __init__(self, title, due_date):
        self.title = title
        self.due_date = due_date
        self.returned = False       # 상태변수


def next_overdue_book(queue, now):
    while queue:
        book = queue[0]

        if book.returned:           # 기존 흐름에 자연스럽게 섞어 넣는다
            heappop(queue)          # 정상 반납된 것이면 다음 항목을 검사 (while)
            continue

        if book.due_date < now:
            heappop(queue)
            return book

        break

    raise NoOverdueBooks


# 반납처리가 단순해졌다
def return_book(queue, book):
    book.returned = True
```

스레드 안전한 다른 선택이 필요하다면 queue.PriorityQueue 클래스를 보라.

### 74) bytes를 복사하지 않고 다루려면 memoryview와 bytearray를 사용하라 <a id="item74" />

스루풋이 높은 병렬 I/O를 다양한 방식으로 지원할 수 있다.

- `memoryview`는 CPython의 고성능 버퍼 프로토콜을 프로그램에 노출시켜준다. (저수준 C API)
  - 복사가 없는(**zero-copy**) 연산을 활성화 함으로써 Numpy 같은 수치계산 C 확장이나 I/O 위주 프로그램의 성능을 엄청나게 향상시킬 수 있다.
  - 수 GB의 미디어 파일의 경우 2만배 이상의 속도 향상 (단순 메모리 공유로는 클라이언트 17대 붙이기도 어렵다)

```python
data = '동해물과 백두산이 abc 마르고 닳도록'.encode('utf8')
view = memoryview(data)
chunk = view[12:19]     # 슬라이싱
print('크기:', chunk.nbytes)
print('뷰의 데이터:', chunk.tobytes)
print('내부 데이터:', chunk.obj)
```

- `bytearray` 타입은 bytes 에서 원하는 위치의 값을 바꿀 수 있는 가변 버전과 같다
- `bytearray` 타입은 복사가 없는 읽기 함수(socket.recv_from 같은)에 사용할 수 있는 bytes 의 변경 가능 타입을 제공한다.

```python
my_array = bytearray('hello 안녕'.encode('utf8'))
my_array[0] = 0x79
print('변경됨:', my_array)  # yello ~
```

- memoryview 로 bytearray 를 감싸면 복사에 따른 비용을 추가 부담하지 않고도 수신받은 데이터를 버퍼에서 원하는 위치에 스플라이스 할 수 있다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
