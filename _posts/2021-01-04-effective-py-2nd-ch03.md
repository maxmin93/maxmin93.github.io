---
date: 2021-01-04 00:00:00 +0900
title: Effective PYTHON 2nd - Ch03
description: Effective Python 의 3장을 요약 했습니다.
categories: [Language, Python]
tags: [book]
---

![Cover - Effective Java 3rd](https://effectivepython.com/images/cover_2ed.jpg){: width="320" .w-75 .normal}
_도서 - Effective PYTHON 2nd_

## 3장 함수

### 19) 함수가 여러 값을 반환하는 경우 절대로 네 값 이상을 언패킹하지 말라 <a id="item19" />

- 함수가 여러 값을 투플로 패킹하여 반환하고, 호출하는 쪽에서 언패킹 구문을 쓸 수 있다
  - 별표식을 이용해 여러값을 리스트로 받는 언패킹을 할 수도 있다
- 언패킹을 네개 이상 하면 실수하기 쉽다. 대신 작은 클래스 또는 namedtuple 인스턴스를 사용하자

```python
from collections import namedtuple

# 리스트로 필드 설정 (또는 'x y', 'x, y' 도 가능)
Point = namedtuple('Point', ['x', 'y'])

p = Point(11, y=22)     # instantiate with positional or keyword arguments
print(p[0] + p[1])      # indexable like the plain tuple (11, 22)
# >>> 33

# default 값 튜플 설정
fields = ('value', 'left', 'right')
Node = namedtuple('Node', fileds, defaults=(None, ) * len(fields))
print(Node())
# >>> Node(value=None, left=None, right=None)

from dataclasses import dataclass
from typing import Any

@dataclass
class Node:
    val: Any = None
    left: 'Node' = None
    right: 'Node' = None

print(Node())
```

### 20) None을 반환하기보다는 예외를 발생시켜라 <a id="item20" />

- 특별한 상황을 표현하기 위해 None 을 반환하는 대시 예외를 발생시켜라
  - 특별한 의미를 표시하는 None을 반환하는 함수를 사용하면 <br>
    None과 다른 값이 조건문에서 False로 평가될 수 있기 때문에 실수하기 쉽다
- 함수가 그 어떤 경우에도 None 을 반환하지 않는다는 사실을 타입 애너테이션으로 명시할 수 있다

```python
def careful_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None

x, y = 1, 0
result = careful_divide(x, y)
if result is None:
    print('잘못된 입력')

# ValueError 로 바꿔던져 호출한 쪽에 입력값이 잘못됐음을 알린다
def careful_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError as e:
        raise ValueError("잘못된 입력")

x, y = 5, 2
try:
    result = careful_divide(x, y)
except ValueError:
    print('잘못된 입력')
else:
    print(f'결과는 {result:.1f} 입니다')


# 타입 애너테이션으로 None 을 반환하지 않음을 알린다
def careful_divide(a: float, b: float) -> float:
    """a를 b로 나눈다

    Raises:
        ValueError: b 가 0 이어서 나눗셈을 할 수 없을 때
    """
    try:
        return a / b
    except ZeroDivisionError as e:
        raise ValueError("잘못된 입력")

```

### 21) 변수 영역과 클로저의 상호작용 방식을 이해하라 <a id="item21" />

- 클로저 함수는 자신이 정의된 영역 외부에서 정의된 변수도 참조할 수 있다
  - 클로저(`closure`)란 자신이 정의된 영역 밖의 변수를 참조하는 함수
- 클로저가 자신을 감싸는 영역의 변수를 변경한다는 사실을 표시할 때는 `nonlocal 문`을 사용하라
  - 간단한 함수가 아닌 경우에는 nonlocal 을 사용하지 말라

```python
def sort_priority(numbers, group):
    def helper(x):
        if x in group:
            return (0, x)
        return (1, x)
    numbers.sort(key=helper)

numbers = [8, 3, 1, 2, 5, 4, 7, 6]
group = {2, 3, 5, 7}
sort_priority(numbers, group)
print(numbers)
# >>> [2, 3, 5, 7, 1, 4, 6, 8]

def sort_priority2(numbers, group):
    found = False
    def helper(x):
        nonlocal found          # 클로저의 외부 변수를 명시
        if x in group:
            found = True
            return (0, x)
        return (1, x)
    numbers.sort(key=helper)
    return found

```

- 파이썬 인터프리터의 참조 영역의 순서
  1. 현재 함수의 영역
  2. 현재 함수를 둘러싼 영역
  3. 현재 코드가 들어있는 모듈의 영역 (global scope)
  4. 내장 영역 (built-in scope): len, str 등의 함수가 들어있는 영역

### 22) 변수 위치 인자를 사용해 시각적인 잡음을 줄여라 <a id="item22" />

- `def 문`에서 `*args`를 사용하면 함수가 가변 위치 기반 인자를 받을 수 있다
  - `*args`를 받는 함수에 새로운 위치 기반 인자를 넣으면 감지하기 힘든 버그가 생길 수 있다
- `* 연산자`를 사용하면 가변 인자를 받는 함수에게 시퀀스 내의 원소들을 전달 할 수 있다
- generator 에 `* 연산자`를 사용하면 프로그램이 메모리를 모두 소진하고 중단될 수 있다

```python
def log(message, *values):
    if not values:
        print(message)
    else:
        values_str = ', '.join(str(x) for x in values)
        print(f'{message}: {values_str}')

favorites = [7, 33, 99]
# `* 연산자`는 시퀀스의 원소들을 함수의 위치 인자로 넘길 것을 명령한다
log('좋아하는 숫자는?', *favorites)


# 위치 인자가 함수에 전달되기 전에 항상 튜플로 변환된다
def my_generator():
    for i in range(10):
        yield i

def my_func(*args):
    print(args)

it = my_generator()
my_func(*it)            # 주의! => Out of Memory
```

### 23) 키워드 인자로 선택적인 기능을 제공하라 <a id="item23" />

- 함수 인자를 위치에 따라 지정할 수도 있고, 키워드를 사용해 지정할 수도 있다
  - 키워드를 사용하면, 혼동할 수 있는 여러 인자의 목적을 명확히 할 수 있다
- 키워드 인자와 디폴트 값을 함께 사용하면 함수에 새로운 기능을 쉽게 추가할 수 있다
  - 선택적 키워드 인자는 위치가 아니라 항상 키워드를 사용해 전달되어야 한다
- `** 연산자`는 파이썬이 딕셔너리에 들어있는 값을 함수에 전달하도록 명령한다

```python
def remainder(number, divisor):
    return number % divisor

# 위치 기반 인자
assert remainder(20, 7) == 6

my_kwargs = {
    'number': 20,
    'divisor': 7
}
# 키워드 기반 인자
assert remainder(**my_kwargs) == 6


def flow_rate(weight_diff, time_diff, period=1):
    return (weight_diff / time_diff) * period

flow_per_second = flow_rate(weight_diff, time_diff)
flow_per_hour   = flow_rate(weight_diff, time_diff, period=3600)    # 선택적 인자: period
```

### 24) None과 독스트링을 사용해 동적인 디폴트 인자를 지정하라 <a id="item24" />

- 디폴트 값은 함수 정의가 속한 모듈이 로드되는 시점에 한번만 평가(evaluate)된다
- 동적인 값을 가질 수 있는 키워드 인자의 디폴트 값은 None 을 사용해라
  - 그리고 함수의 독스트링에 디폴트 인자가 어떻게 동작하는지 문서화 해라
  - 타입 애너테이션을 사용해 None 디폴트 값을 표현할 수 있다

```python
from time import sleep
from datetime import datetime

#
def log(message, when=datetime.now()):  # 디폴트는 한번만 실행된다
    print(f'{when}: {message}')

log('Hi~')
sleep(1.0)
log('Hi~2')
# >>> 똑같은 시간이 출력된다 (첫 디폴트 값이 고정)


import json

def decode(data, default={}):       # {} 변수가 호출시마다 공유된다
    try:
        return json.loads(data)
    except ValueError:
        return default

foo = decode('Wrong data')
foo['stuff'] = 5
bar = decode('Again wrong data')
bar['meep'] = 1
print('Foo:', foo)
print('Bar:', bar)
# >>> 똑같은 내용이 출력된다


from typing import Optional

# Optional 을 이용해 None 사용을 표현
def log_typed(message: str, when: Optional[datetime]=None) -> None:
    """메시지와 타임스탬프를 로그에 출력한다

    Args:
        message: 출력할 메시지
        when: 메시지가 발생한 시각. 디폴트 값은 현재 시각
    """
    if when is None:
        when = datetime.now()
    print(f'{when}: {message}')

```

### 25) 위치로만 인자를 지정하게 하거나 키워드로만 인자를 지정하게 해서 함수 호출을 명확하게 만들라 <a id="item25" />

- 키워드로만 지정해야 하는 인자를 사용하면, 호출하는 쪽에서 특정 인자를 반드시 키워드를 사용해 호출하도록 강제할 수 있따
  - 이를 통해 함수 호출의 의도를 명확히 할 수 있다
  - 인자 목록에서 `* 다음`에 위치
- 위치로만 지정해야 하는 인자를 사용하면, 키워드 인자를 사용 못하게 만들 수 있다
  - 이에 따라 함수 구현과 함수 호출 지점 사이의 결합을 줄일 수 있다
  - 인자 목록에서 `/ 앞`에 위치 (파이썬 3.8 이상)

```python
# 모든 인자가 위치 또는 키워드 기반으로 사용 가능하다
def safe_division_b(number, divisor,
        ignore_overflow=False,
        ignore_zero_division=False
    ):
    ...

result = safe_division_b(1.0, 10**500, ignore_overflow=True)
result = safe_division_b(1.0, 0, ignore_zero_division=True)


# 키워드만 사용하는 인자: `*` 다음에
def safe_division_c(number, divisor, *,         # 키워드 인자 사용을 강제한다
        ignore_overflow=False,
        ignore_zero_division=False
    ):
    ...

# 위치 기준 인자: `/` 앞에                      <-- 파이썬 3.8 이상
# number, divisor 위치 기준 인자
def safe_division_c(number, divisor, /, *,      # 위치 인자와 키워드 인자 사용을 강제한다
        ignore_overflow=False,
        ignore_zero_division=False
    ):
    ...

```

### 26) functools.wrap을 사용해 함수 데코레이터를 정의하라 <a id="item26" />

- 파이썬 decorator 는 실행 시점에 함수가 다른 함수를 변경할 수 있게 해주는 도구이다
  - 데코레이터를 사용하면 디버거 등 인트로스펙션을 사용하는 도구가 잘못 작동할 수 있다
- 직접 데코레이터를 구현할 때 (인트로스펙션에 문제가 생기지 않기를 바란다면) <br>
  functools.wraps 데코레이터를 사용하라

```python
def trace(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        print(f'{func.__name__}({args!r}, {kwargs!r})',
            f'-> {result!r}')
        return result
    return wrapper

# 이것과 같다 => "fibonacci = trace(fibonacci)"
@trace
def fibonacci(n):
    ...


# __main__ 에 속하지 않은 새로운 local 함수가 생성된다 => 인트로스펙션에 문제 발생!
# 이 문제를 해결하려면, functools.wraps 를 사용
from functools import wraps

def trace(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        ...
    return wrapper

# __main__ 에 속한 fibonacci 함수가 반환된다
@trace
def fibonacci(n):
    ...

```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
