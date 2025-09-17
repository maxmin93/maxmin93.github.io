---
date: 2021-01-06 00:00:00 +0900
title: Effective PYTHON 2nd - Ch05
description: Effective Python 의 5장을 요약 했습니다.
categories: [Language, Python]
tags: [book]
---

![Cover - Effective Java 3rd](https://effectivepython.com/images/cover_2ed.jpg){: width="50%" .w-75 .normal}
_도서 - Effective PYTHON 2nd_

## 5장 클래스와 인터페이스

### 37) 내장 타입을 여러 단계로 내포시키기보다는 클래스를 합성하라 <a id="item37" />

- 내장 타입이 복잡하게 내포된 데이터를 값으로 사용하는 딕셔너리를 만들지 말라
  - :bangbang: &nbsp; 내부 클래스를 만들어 가독성 있게 관리하자
- 가벼운 불변 데이터 컨테이너가 필요하면 `namedtuple`을 사용하자

```python
#  클래스를 이용하면 동적인 내부상태를 잘 관리할 수 있다
class SimpleGradebook:
    def __init__(self):
        self._grades = {}
    def add_student(self, name):
        self._grades[name] = []
    def report_grade(self, name, score):
        self._grades[name].append(score)
    def average_grade(self, name):
        grades = self._grades[name]
        return sum(grades) / len(grades)


# 요구 변경: 과목별 점수 관리

from collections import defaultdict

class BySubjectGradebook:
    def __init__(self):
        self._grades = {}
    def add_student(self, name):
        self._grades[name] = defaultdict(list)
    def report_grade(self, name, subject, score):
        by_subject = self._grades[name]
        grade_list = by_subject[subject]
        grade_list.append(grade)
    def average_grade(self, name):
        by_subject = self._grades[name]
        total, count = 0, 0
        for grades in by_subject.values():
            total += sum(grades)
            count += len(grades)
        return total / count


# 요구 변경: 과목별 가중치 점수 관리
# ==> 단일 과목에 대한 하위 클래스를 만들어 사용하자

class Subject:
    def __init__(self):
        self._grades = []
    def report_grade(self, score, weight):
        self._grades.append(Grade(score, weight))
    def average_grade(self):
        total, total_weight = 0, 0
        for grade in self._grades:
            total += grade.score * grade.weight
            total_weight += grade.weight
        return total / total_weight

class Student:
    def __init__(self):
        self._subjects = defaultdict(Subject)
    def get_subject(self, name):
        return self._subjects[name]
    def average_grade(self):
        total, count = 0, 0
        for subject in self._subjects.values():
            total += subject.average_grade()
            count += 1
        return total / count

class Gradebook:
    def __init__(self):
        self._students = defaultdict(Student)
    def get_student(self, name):
        return self._student[name]

```

### 38) 간단한 인터페이스의 경우 클래스 대신 함수를 받아라 <a id="item38" />

- 파이썬에는 (java나 c++ 같은) Inteface class 를 위한 키워드가 없다
  - 함수나 추상 클래스를 이용해 비슷하게 제약을 걸 수는 있다
- 간단한 인터페이스가 필요할 때는 클래스를 정의하고 사용하는 대신, 간단히 함수를 사용할 수 있다
  - 함수나 메서드는 일급 시민이다 (매개변수로 사용 가능)
- `__call__` 특별 메서드를 사용하면 클래스의 인스턴스 객체를 함수처럼 호출할 수 있다
  - 상태를 유지하기 위한 함수가 필요한 경우, `__call__` 메서드가 있는 클래스를 고려해보라

```python
# Hook 으로 사용하기에는 함수가 클래스보다 제격이다
def log_missing():                              # 키 추가할 때마다, print
    print('key added')
    return 0

from collections import defaultdict

current = {'green': 12, 'blue': 3}
increments = [
    ('red', 5), ('blue', 17), ('orange', 9)
]
# defaultdict: key added 에 대한 hook 함수를 전달할 수 있다
result = defaultdict(log_missing, current)      # side effect: log_missing()
print('prev:', dict(result))
for key, amount in increments:
    result[key] += amount
print('post:', dict(result))


# 클래스로 만들면 깔끔하다
class CountMissing:
    def __init__(self):
        self.added = 0      # 초기화
    def missing(self):      # key-added hook 으로 사용될 메서드
        self.added += 1
        return 0

counter = CountMissing()    # 생성 및 초기화
result = defaultdict(counter.missing, current)
for key, amount in increments:
    result[key] += amount
assert counter.added == 2       # red, orange


# 호출 가능 객체로 더 깔끔하게 만들기
class BetterCountMissing:
    def __init__(self):
        self.added = 0
    def __call__(self):     # 객체를 함수처럼 호출할 수 있게 만든다
        self.added += 1
        return 0

counter = BetterCountMissing()              # 객체 생성
result = defaultdict(counter, current)      # __call__ 에 의존함
for key, amount in increments:
    result[key] += amount
assert counter.added == 2       # red, orange

```

### 39) 객체를 제너릭하게 구성하려면 `@classmethod`를 통한 다형성을 활용하라 <a id="item39" />

- 파이썬 클래스에는 생성자가 `__init__` 메서드 뿐이다
- `@classmethod`를 사용하면 클래스에 다른 생성자를 정의할 수 있다
- 클래스 메서드 다형성을 활용하면 여러 하위 클래스의 객체를 만들고 연결하는 제너릭한 방법을 제공할 수 있다

```python
# 상위 클래스
class InputData:
    def read(self):
        raise NotImplementedError

# 하위 클래스 (상속)
class PathInputData(InputData):
    def __init__(self, path):
        super().__init__()
        self.path = path
    def read(self):                     # 다형성 지원: 하위 클래스에서 재정의
        with open(self.path) as f:
            return f.read()


# 상위 클래스
class Worker:
    def __init__(self, input_data):
        self.input_data = input_data
        self.result = None
    def map(self):
        raise NotImplementedError
    def reduce(self):
        raise NotImplementedError

# 하위 클래스 (상속)
class LineCountWorker(Worker):
    def map(self):
        data = self.input_data.read()
        self.result = data.count('\n')
    def reduce(self, other):
        self.result += other.result


# 각각 따로 구현된 클래스들을 어떻게 연결할 것인가?
# ==> 가장 간단한 방법: helper 함수를 구현한다

import os

# PathInputData 를 생성하는 helper 함수
def generate_inputs(data_dir):
    for name in os.listdir(data_dir):
        yield PathInputData(os.path.join(data_dir, name))

# LineCountWorker 를 생성하는 helper 함수
def create_worker(input_list):
    workers = []
    for input_data in input_list:
        workers.append(LineCountWorker(input_data))
    return workers

from threading import Thread

# Worker 의 reduce 를 수행하는 helper 함수 (스레드 사용)
def execute(workers):
    threads = [Thread(target=w.map) for w in workers]
    for thread in threads: thread.start()
    for thread in threads: thread.join()

    first, *rest = workers
    for worker in rest:
        first.reduce(worker)
    return first.result

# 모든 helper 함수들을 조립하는 helper 함수
def mapreduce(data_dir):
    inputs = generate_inputs(data_dir)
    workers = create_workers(inputs)
    return execute(workers)

# 최종 사용 코드
tmp_dir = 'test_inputs'
result = mapreduce(tmp_dir)
print(f'총 {result} 줄이 있습니다')


#######################################
#   => 잘 동작하지만, 전혀 generic 하지 않다 (범용성X)
#######################################

# InputData를 위한 범용 클래스
class GenericInputData:
    def read(self):
        raise NotImplementedError

    @classmethod
    def generate_inputs(cls, config):
        raise NotImplementedError

# 하위 클래스 (범용클래스 상속)
class PathInputData(GenericInputData):
    ...
    @classmethod
    def generate_inputs(cls, config):
        data_dir = config['data_dir']
        for name in os.listdir(data_dir):
            yield cls(os.path.join(data_dir, name))

# Worker를 위한 범용 클래스
class GenericWorker:
    ...
    @classmethod
    def create_worker(cls, input_class, config):
        workers = []
        # 클래스 다형성을 이용 => generate_inputs 호출
        for input_data in input_class.generate_inputs(config):
            # **핵심** __init__ 호출이 아닌, cls() 호출을 통해 다른 클래스 접근이 가능!
            workers.append( cls(input_data) )
        return workers

# 하위 클래스 (범용클래스 상속)
class LineCountWorker(GenericWorker):
    ...

# 모든 helper 함수들을 조립하는 helper 함수
def mapreduce(worker_class, input_class, config):
    workers = worker_class.create_workers(input_class, config)
    return execute(workers)

config = {'data_dir': tmp_dir}
result = mapreduce(LineCountWorker, PathInputData, config)
print(f'총 {result} 줄이 있습니다')

```

### 40) super로 부모 클래스를 초기화하라 <a id="item40" />

- 파이썬은 표준 메서드 결정 순서(MRO)를 활용해 상위클래스 초기화 순서와 다이아몬드 상속문제를 해결한다
- 부모 클래스를 초기화할 때는 super 내장 함수를 아무 인자 없이 호출하라
  - 파이썬 컴파일러가 자동으로 올바른 파라미터를 넣어준다

```python
class MyBaseClass:
    def __init__(self, value):
        self.value = value

# 잘못된 방식의 초기화
class MyChildClass(MyBaseClass):
    def __init__(self):
        # 상위클래스의 __init__ 를 직접 호출하면 예기치 않은 방식으로 작동할 수 있다
        MyBaseClass.__init__(self, 5)

# 상위 클래스의 __init__ 를 직접 호출하면, 다이아몬드 계층 구조인 경우
# 상위 클래스의 초기화가 두번 호출되어 원하지 않는 값이 출력될 수 있다

# super 를 사용한 초기화
class TimesSevenCorrect(MyBaseClass):
    def __init__(self, value):
        super().__init__(value)
        self.value *= 7

class PlusNineCorrect(MyBaseClass):
    def __init__(self, value):
        super().__init__(value)
        self.value += 9

# 정상적으로 최상위 클래스 MyBaseClass 의 __init__ 가 한번만 호출되었다
class GoodWay(TimesSevenCorrect, PlusNineCorrect):
    def __init__(self, value):
        super().__init__(value)

foo = GoodWay(5)
print('7 * (5 + 9) = 98 이 나와야 하고, 실제로도', foo.value)

# super().__init__ 호출은 다중 상속을 튼튼하게 해주며
# 하위 클래스에서의 유지보수를 더 편하게 해준다

# super() 라고 호출해도 파이썬 컴파일러가 자동으로 올바른 파라미터를 넣어준다
class ExplicitTrisect(MyBaseClass):
    def __init__(self, value):
        # 동일 코드1: super().__init__(value)
        # 동일 코드2: super(__class__, self).__init__(value)
        super(ExplicitTrisect, self).__init__(value)
        self.value /= 3

```

### 41) 기능을 합성할 때는 믹스인 클래스를 사용하라 <a id="item41" />

- 믹스인으로 구현할 수 있는 기능을 (속성과 `__init__`이 포함된) 다중 상속을 통해 구현하지 말라
- 믹스인 클래스가 클래스별로 특화된 기능을 필요로 한다면, 인스턴스 수준에서 넣을 수 있는 기능을 활용하라
- 믹스인에는 필요에 따라 인스턴스 메서드 또는 클래스 메서드도 포함될 수 있다
- 믹스인을 합성하면 더 복잡한 기능을 만들어낼 수 있다

```python
# 공유할 메서드만 정의한 믹스인 클래스
# **장점: 제너릭 기능을 쉽게 연결할 수 있고,
#         필요할 때 기존 기능을 다른 기능으로 오버라이드 해 변경할 수 있다
class ToDictMixin:
    def to_dict(self):      # 외부 노출할 메서드
        return self._traverse_dict(self.__dict__)
    def _traverse_dict(self, instance_dict):
        output = {}
        for key, value in instance_dict.items():
            output[key] = self._traverse(key, value)
        return output
    def _traverse(self, key, value):
        if isinstance(value, ToDictMixin):
            return value.to_dict()
        elif isinstance(value, dict):
            return self._traverse_dict(value)
        elif isinstance(value, list):
            return [self._traverse(key, i) for i in value]
        elif hasattr(value, '__dict__'):
            return self._traverse_dict(value.__dict__)
        else:
            return value

# ToDictMixin 의 to_dict 메서드를 공유한다
class BinaryTree(ToDictMixin):
    def __init__(self, value, left=None, right=None):
        self.value = value
        self.left = left
        self.right = right

tree = BinaryTree(10,
    left=BinaryTree(7, right=BinaryTree(9)),
    right=BinaryTree(13, left=BinaryTree(11))
)
print(tree.to_dict())


# 순환 참조시 무한루프 문제 해결 방법
class BinaryTreeWithParent(BinaryTree):
    # parent 에 의한 순환 참조
    def __init__(self, value, left=None, right=None, parent=None):
        super().__init__(value, left=left, right=right)
        self.parent = parent
    # 오버라이드 해서 무한루프를 방지한다
    def _traverse(self, key, value):
        if (isinstance(value, BinaryTreeWithParent) and key == 'parent'):
            return value.value      # parent 만 예외 처리
        else:
            return super()._traverse(key, value)


# 믹스인을 서로 합성할 수도 있다
import json

# JSON 으로 직렬화 하거나 역직렬화 하는 믹스인
class JsonMixin:
    # 클래스 메소드
    @classmethod
    def from_json(cls, data):
        kwargs = json.loads(data)
        return cls(**kwargs)
    # 인스턴스 메소드
    def to_json(self):
        return json.dumps(self.to_dict())   # to_dict 필요

# 믹스인들을 합성했다
class DatacenterRack(ToDictMixin, JsonMixin):
    def __init__(self, switch=None, machines=None):
        self.switch = Switch(**switch)
        self.machines = [Machine(**kwargs) for kwargs in machines]
class Switch(ToDictMixin, JsonMixin):
    ...
class Machine(ToDictMixin, JsonMixin):
    ...

deserialized = DatacenterRack.from_json(serialized)
roundtrip = descrialized.to_json()
assert json.loads(serialized) == json.loads(roundtrip)

```

### 42) 비공개 애트리뷰트보다는 공개 애트리뷰트를 사용하라 <a id="item42" />

- 파이썬에서 클래스의 속성에 대한 가시성은 공개와 비공개, 두가지밖에 없다
- 비공개 속성에 대한 가시성을 엄격하게 제한하지 않는 이유
  - 파이썬의 모토 '우리는 모두 책임질 줄 아는 성인이다' <br>
    :bangbang: &nbsp; 우리가 하고 싶은 일을 언어가 제한하면 안된다는 것이다
- 하위 클래스를 정의하는 사람들이 클래스의 속성을 (사용하지 못하게 막기보다는) <br>
  사용해 더 많은 일을 할 수 있게 허용하라!
  - 하위 클래스에서 이름 충돌이 일어나는 경우를 막고 싶을 때만 비공개 속성을 사용할 것을 권한다

```python
class MyObject:
    def __init__(self):
        self.public_field = 5           # 공개 필드
        # 비공개 필드는 컴파일러가 `_클래스__비공개필드__`라는 이름으로 바꿔준다
        self.__private_field = 10       # 비공개 필드
    def get_private_field(self):        # 메서드로 비공개 필드에 접근할 수 있다ㄴ
        return self.__private_field

foo = MyObject()
foo.__private_field
# >>> AttributeError : 클래스 외부에서 비공개 필드에 접근하면 예외 발생

class MyOtherObject:
    def __init__(self):
        self.__private_field = 71       # 비공개 필드
    # 클래스 메서드에서 인스턴스의 비공개 필드에 접근할 수 있다
    @classmethod
    def get_private_field_of_instance(cls, instance):
        return instance.__private_field

```

### 43) 커스텀 컨테이너 타입은 `collections.abc`를 상속하라 <a id="item43" />

- 간편하게 사용할 경우에는 파이썬 컨테이너 타입(리스트나 딕셔너리 등)을 직접 상속하라
  - 커스텀 컨테이너를 제대로 구현하려면 수많은 메서드를 구현해야 한다는 점을 주의하라
- 커스텀 컨테이너 타입이 collections.abc 에 정의된 인터페이스를 상속하면 <br>
  컨테이너 타입이 작동하기에 필요한 기능들이 제대로 구현하도록 보장할 수 있다
  - ABC(추상 베이스 클래스) [&#9658;link](https://docs.python.org/ko/3/library/collections.abc.html): Container, Iterable, Iterator, Callable, Set, ...

```python
from collections.abc import Sequence

# Sequence 는 Reversible, Collection 을 상속받은 ABC 이다
# Sequence 를 상속하면 Sequence 의 __getitem__, __len__ 구현을 강제한다
class BadType(Sequence):
    pass

foo = BadType()
# >>> TypeError: 추상 클래스를 초기화 할 수 없음
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
