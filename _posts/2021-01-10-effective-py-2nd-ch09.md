---
date: 2021-01-10 00:00:00 +0900
title: Effective PYTHON 2nd - Ch09
description: Effective Python 의 9장을 요약 했습니다.
categories: [Language, Python]
tags: [book]
---

![Cover - Effective Java 3rd](https://effectivepython.com/images/cover_2ed.jpg){: width="50%" .w-75 .normal}
_도서 - Effective PYTHON 2nd_

## 9장 테스트와 디버깅

- 파이썬은 선택적인 타입 애너테이션을 지원하며 이를 활용해 정적 분석을 수행할 수 있다.
  - 파이썬은 컴파일 시점에 정적 타입 검사를 수행하지 않는다.
  - 또한 컴파일 시점에 프로그램이 제대로 작동할 것이라고 확인할 수 있는 요소가 전혀 없다.

### 75) 디버깅 출력에는 `repr` 문자열을 사용하라 <a id="item75" />

- repr 을 호출하면 출력 가능한 문자열을 얻는다. 이를 eval 함수에 전달하면 원래 값을 돌려받을 수 있다.
- 형식화 문자열 %s 는 str 과 같이 문자열을 만들어낸다.
- 직접 클래스의 `__repr__` 메서드를 정의해서 원하는 표현을 만들 수 있다.

```python
print( repr(5) )    # 5
print( repr('5') )  # '5'

print( '%r'%5 )     # 5
print( '%r'%'5' )   # '5'

# f-문자열에는 !r 타입변환을 사용할 것
int_value = 5
str_value = '5'
print(f'{int_value!r} != {str_value!r}')
# >>> 5 != '5'

b = eval( repr(int_value) )
assert int_value == b
c = eval( repr(str_value) )
assert str_value == c
```

```python
class BetterClass:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        return f'BetterClass({self.x!r},{self.y!r})'

obj = BetterClass(2, 'what')
print(obj)
# >>> BetterClass(2, 'what')
print(obj.__dict__)
# >>> {'x':2, 'y':'what'}
```

### 76) TestCase 하위 클래스를 사용해 프로그램에서 연관된 행동 방식을 검증하라 <a id="item76" />

```python
# utils.py
def to_str(data):
    if isinstance(data, str):
        return data
    elif isinstance(data, bytes):
        return data.decode('utf-8')
    else:
        raise TypeError('str 또는 bytes 를 전달해야 합니다, found value: %r'%data)


# utils_test.py
from unittest import TestCase, main
from utils import to_str

# TestCase 의 하위클래스 정의
class UtilsTestCase(TestCase):
    # 테스트 메서드
    def test_to_str_bytes(self):
        self.assertEqual('hello', to_str(b'hello'))

    def test_to_str_str(self):
        self.assertEqual('hello', to_str('hello'))

    # 실패 리포트 출력함
    def test_failing(self):
        self.assertEqual('incorrect', to_str('hello'))


if __name__ == '__main__':
    main()      # 테스트 케이스 실행
```

```python
# assert_test.py
from unittest import TestCase, main
from utils import to_str

class AssertTestCase(TestCase):
    # Value 까지 출력하면서 오류 출력 (더 도움된다)
    def test_assert_helper(self):
        expected = 12
        found = 2 * 5
        self.assertEqual(expected, found)

    # AssertionError 출력
    def test_assert_statement(self):
        expected = 12
        found = 2 * 5
        assert expected == found


if __name__ == '__main__':
    main()      # 테스트 케이스 실행
```

### 77) `setUp, tearDown, setUpModule, tearDownModule`을 사용해 각각의 테스트를 격리하라 <a id="item77" />

```python
# environment_test.py
from pathlib import Path
from tempfile import TemporaryDirectory
from unittest import TestCase, main

class EnvironmentTest(TestCase):
    def setUp(self):
        self.test_dir = TemporaryDirectory()
        self.test_path = Path(self.test_dir.name)

    def tearDown(self):
        self.test_dir.cleanup()

    def test_modify_file(self):
        with open(self.test_path / 'data.bin', 'w') as f:
            # ...
            pass

if __name__ == '__main__':
    main()



# integration_test.py
from unittest import TestCase, main

def setUpModule():
    print('** setup module')

def tearDownModule():
    print('** reset module')

class IntegrationTest(TestCase):
    def setUp(self):
        print('** setup Test')

    def tearDown(self):
        print('** reset Test')

    def test_end_to_end1(self):
        print('** Test1')

    def test_end_to_end2(self):
        print('** Test2')

if __name__ = '__main__':
    main()

```

```shell
$ python3 integration_test.py
* 모듈 설정
 * 테스트 설정
  * 테스트 1
 * 테스트 정리
 * 테스트 설정
  * 테스트 2
 * 테스트 정리
* 모듈 정리
```

### 78) 목을 사용해 의존 관계가 복잡한 코드를 테스트하라 <a id="item78" />

```python
class DatabaseConnection:
    # ...
    pass

def get_animals(database, species):
    # 데이터베이스에 질의한다
    # ...
    # (이름, 급양시간) 튜플 리스트를 반환한다
    pass


database = DatabaseConnection('localhost', '4444')

get_animals(database, '미어캣')
# >>>
# DatabaseConnectionError: Not connected
```

나은 방법은 데이터베이스를 모킹(mocking)하는 것이다.<br>
목(mock)은 자신이 흉내 내려는 대상에 의존하는 다름 함수들이 어떤 요청을 보내면 어떤 응답을 보내야 할지 알고, 요청에 따라 적절한 응답을 돌려준다.

```python
from datatime import datetime
from unittest.mock import Mock

mock = Mock(spec=get_animals)
expected = [
    ('점박이', datetime(2020, 6, 5, 11, 15)),
    ('털보', datetime(2020, 6, 5, 11, 15)),
    ('제제', datetime(2020, 6, 5, 11, 15)),
]
mock.return_value = expected


database = object()
result = mock(database, '미어캣')
assert result == expected
```

```python
from unittest.mock import ANY

mock = Mock(spec=get_animals)
mock('database 1', '토끼')
mock('database 2', '들소')
mock('database 3', '미어캣')

mock.assert_called_with(ANY, '미어캣')


class MyError(Exception):
    pass

mock = Mock(spec=get_animals)
mock.side_effect = MyError('에구모니나! 큰 문제 발생')
result = mock(database, '미어캣')
# >>>
# MyError: 에구머니나! 큰 문제 발생
```

```python
def get_food_period(database, species):
    # 데이터베이스에 질의한다
    # ...
    # 주기를 반환한다

def feed_animals(database, name, when):
    # 데이터베이스에 기록한다
    # ...

def do_rounds(database, species):
    now = datetime.datetime.utcnow()
    feeding_timedelta = get_food_period(database, species)
    animals = get_animals(database, species)
    fed = 0

    for name, last_mealtime in animals:
        if (now-last_mealtime) > feeding_timedelta:
            feed_animal(database, name, now)
            fed += 1
    return fed
####

def do_rounds(database, species, *,
    now_func=datetime.utcnow,
    food_func = get_food_period,
    animals_func = get_animals,
    feed_func = feed_animal
):
    now = now_func()
    feeding_timedelta = food_func(database, species)
    animals = animals_func(database, species)
    fed = 0

    for name, last_mealtime in animals:
        if (now-last_mealtime) > feeding_timedelta:
            feed_func(database, name, now)
            fed += 1
    return fed

####

from datetime import timedelta

now_func = Mock(spec=datetime.utcnow)
now_func.return_value = datetime(2020, 6,5,15,45)

food_func = Mock(spec=get_food_period)
food_func.return_value = timedelta(hours=3)

animals_func = Mock(spec=get_animals)
animals_func.return_value = [
    ('점박이', datetime(2020, 6, 5, 11, 15)),
    ('털보', datetime(2020, 6, 5, 11, 15)),
    ('제제', datetime(2020, 6, 5, 11, 15)),
]

feed_func = Mock(spec=feed_animal)

result = do_rounds(
    database,
    '미어캣',
    now_func=now_func,
    food_func = food_func,
    animals_func=animals_func,
    feed_func = feed_func
)
assert result == 2

####

from unittest.mock import call

food_func.assert_called_once_with(database, '미어캣')

animals_func.assert_called_once_with(database, '미어캣')

feed_func.assert_has_calls([
    call(database, '점박이', now_func.return_value),
    call(database, '털보', now_func.return_value),
],
any_order=True)

####

from unittest.mock import patch

print('patch external:', get_animals)

with patch('__main__.get_animals'):
    print('patch internal:', get_animals)

print('again patch external:', get_animals)
```

### 79) 의존 관계를 캡슐화해 모킹과 테스트를 쉽게 만들라 <a id="item79" />

```python
class ZooDatabase:
    # ...

    def get_animals(self, species):
        # ...

    def get_food_period(self, species):
        # ...

    def feed_animals(self, name, when):
        # ...

####

from datetime import datetime

def do_rounds(database, species, *, utcnow=datetime.utcnow):
    now = ntcnow()
    feeding_timedelta = database.get_food_period(species)
    animals = database.get_animals(species)
    fed = 0

    for name, last_mealtime in animals:
        if (now - last_mealtime) >= feeding_timedelta:
            database.feed_animal(name, now)
            fed += 1
    return fed
```

```python
from unittest.mock import Mock

database = Mock(spec=ZooDatabase)
print(database.feed_animal)
database.feed_animal()
database.feed_animal.assert_any_call()

####

from datetime import timedelta
from unittest.mock import call

now_func = Mock(spec=datetime.utcnow)
now_func.return_value = datetime(2019, 6, 5, 15, 45)

database = Mock(spec=ZooDatabase)
database.get_food_period.return_value = timedelta(hour=3)
database.get_animals.return_value = [
    ('점박이', datetime(2020, 6, 5, 11, 15)),
    ('털보', datetime(2020, 6, 5, 11, 15)),
    ('제제', datetime(2020, 6, 5, 11, 15)),
]

result = do_rounds(database, '미어캣', utcnow=now_func)
assert result == 2

database.get_food_period.assert_called_once_with('미어캣')
database.get_animals.assert_called_once_with('미어캣')
database.feed_func.assert_has_calls([
    call(database, '점박이', now_func.return_value),
    call(database, '털보', now_func.return_value),
],
any_order=True)

```

```python
DATABASE = None

def get_database():
    global DATABASE
    if DATABASE is None:
        DATABASE = ZooDatabase()
    return DATABASE

def main(argv):
    database = get_database()
    species = argv[1]
    count = do_rounds(database, species)
    print(f'feed: {count} {species}')
    return 0

####

import contextlib
import io
from unittest.mock import patch

with patch('__main__.DATABASE', spec=ZooDatabase):
    now = datetime.utcnow()

    DATABASE.get_food_period.return_value = timedelta(hours=3)
    DATABASE.get_animals.return_value = [
        ('점박이', datetime(2020, 6, 5, 11, 15)),
        ('털보', datetime(2020, 6, 5, 11, 15)),
        ('제제', datetime(2020, 6, 5, 11, 15)),
    ]

    fake_stdout = io.StringIO()
    with contextlib.redirect_stdout(fake_stdout):
        main(['program name', '미어캣'])

    found = fake_stdout.getvalue()
    expected = 'feed: 2 미어캣\n'

    assert found == expected

```

### 80) pdb를 사용해 대화형으로 디버깅하라 <a id="item80" />

```python
# always_breakpoint.py

import math

def compute_rmse(observed, ideal):
    total_err_2 = 0
    count = 0
    for got, wanted in zip(observed, ideal):
        err_2 = (got - wanted) ** 2
        breakpoint()    # 여기서 디버거를 시작함
        total_err_2 += err_2
        count += 1

    mean_err = total_err_2 / count
    rmse = math.sqrt(mean_err)
    return rmse

result = compute_rmse(
    [1.8, 1.7, 3.2, 6],
    [2, 1.5, 3, 5]
)
print(result)

# 실행시 파이썬 대화형 셀이 시작된다.
# $ python3 always_breakpoint.py
# > always_breakpoint.py(12)compute_rmse()
# -> total_err_2 += err_2
# (Pdb)

# Pdb 프롬프트에서 p <이름> 으로 지역변수 이름을 입력하면 값을 출력할 수 있다.

#####

# 조건부 디버깅
# conditional_breakpoint.py
def compute_rmse(observed, ideal):
    # ...
    for got, wanted in zip(observed, ideal):
        err_2 = (got - wanted) ** 2
        if err_2 >= 1:      # True 인 경우에만
            breakpoint()    # 디버거를 시작함
        total_err_2 += err_2
        count += 1
    # ...

#####

# 사후 디버깅
# postmortem_breakpoint.py

import math

# 평균제곱근오차(rmse)를 구함
def compute_rmse(observed, ideal):
    # ...

# $ python3 -m pdb -c continue postmortem_breakpoint.py
# Trackback (most recent call last)
# ...
# > postmortem_breakpoint.py(16)compute_rmse()
# -> rmse = math.sqrt(mean_err)
# (Pdb) mean_err
# (-5.97-17.5j)

```

### 81) 프로그램이 메모리를 사용하는 방식과 메모리 누수를 이해하기 위해 tracemalloc을 사용하라 <a id="item81" />

```python
# waste_memory.py
import os

class MyObject:
    def __init__(self):
        self.data = os.urandom(100)

    def get_data():
        values = []
        for _ in range(100):
            obj = MyObject()
            values.append(obj)

    def run():
        deep_values = []
        for _ in range(100):
            deep_values.append(get_data())
            return deep_values

#####

# using_gc.py
import gc

found_objects = gc.get_objects()
print('before:', len(found_objects))

import waste_memory

hold_reference = waste_memory.run()

found_objects = gc.get_objects()
print('after:', len(found_objects))

for obj in found_objects[:3]:
    print(repr(obj)[:100])

# gc.get_objects 의 문제점은 객체가 어떻게 할당됐는지를 알려주지 않는다는 것이다.
# 파이썬 3.4부터는 이런 문제를 해결해 주는 tracemalloc 내장모듈이 새로 도입됐다.

```

```python
# top_n.py
import tracemalloc

tracemalloc.start(10)                   # 스택 깊이 설정
time1 = tracemalloc.take_snapshot()     # 이전 스냅샷

import waste_memory

x = waste_memory.run()      # 이 부분의 메모리 사용을 디버깅함
time2 = tracemalloc.take_snapshot()     # 이후 스냅샷

stats = time2.compare_to(time1, 'lineno')   # 두 스냅샷을 비교
for stat in stats[:3]:
    print(stat)

#####

# with_trace.py
import tacemalloc

tracemalloc.start(10)
time1 = tracemalloc.take_snapshot()

import waste_memory

x = waste_memory.run()
time2 = tracemalloc.take_snapshot()

stats = time2.compare_to(time1, 'traceback')
top = stats[0]
print('가장 많이 사용하는 부분은:')
print('\n'.join(top.traceback.format()))
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
