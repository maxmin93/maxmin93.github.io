---
date: 2021-01-07 00:00:00 +0900
title: Effective PYTHON 2nd - Ch06
description: Effective Python 의 6장을 요약 했습니다.
categories: [Language, Python]
tags: [book]
---

![Cover - Effective Java 3rd](https://effectivepython.com/images/cover_2ed.jpg){: width="320" .w-75 .normal}
_도서 - Effective PYTHON 2nd_

## 6장 메타클래스와 애트리뷰트

### 44) 세터와 게터 메서드 대신 평범한 애트리뷰트를 사용하라 <a id="item44" />

- 클래스 인터페이스를 정의할 때 `setter`나 `getter` 메서드를 가급적 사용하지 말라
  - 간단한 공개 attribute 에서 시작하자 (파이썬 다운 코드)
- attribute 접근시 특별한 동작이 필요하면 `@property`로 구현할 수 있다
  - 이상한 부작용을 만들어내지 말자
  - 빠르게 실행되도록 유지하라 (느리거나 복잡한 동작은 일반적인 메서드 사용)

```python
# 속성을 단순하게 정의하고 사용하자 (파이썬 스타일)
class Resistor:
    def __init__(self, ohms):
        self.ohms = ohms
        self.voltage = 0
        self.current = 0

r1 = Resistor(50e3)
r1.ohms = 10e3


class VoltageResistence(Resistor):
    def __init__(self, ohms):
        super().__init__(ohms)
        self._voltage = 0

    # getter 에서는 다른 속성값을 조작해서는 안된다
    # 다루려고 하는 속성만 전달하자
    @property
    def voltage(self):
        return self._voltage

    # 부가적인 기능을 수행: voltage -> current
    @voltage.setter
    def voltage(self, voltage):
        self._voltage = voltage
        self.current = self._voltage / self.ohms

r2 = VoltageResistence(1e3)
# >>> r2.current = 0.00
r2.voltage = 10
# >>> r2.current = 0.01


class BoundedResistence(Resistor):
    def __init__(self, ohms):
        super().__init__(ohms)
        # Resistor.__init__ 에서 `self.ohms = -5` 대입문 실행
        # ==> ohms.setter 가 동작하여 초기화에 대한 검증 수행

    @property
    def ohms(self):
        return self._ohms

    # 입력값의 검증을 수행
    @ohms.setter
    def ohms(self, ohms):
        if ohms <= 0:
            raise ValueError(f'저항은 0 이상이어야 합니다. ({ohms})')
        self._ohms = ohms

r3.ohms = 0             # ohms.setter 호출
# >>> ValueError
BoundedResistence(-5)   # super 를 통해 ohms.setter 호출
# >>> ValueError


class FixedResistence(Resistor):
    def __init__(self, ohms):
        super().__init__(ohms)

    @property
    def ohms(self):
        return self._ohms

    # 부모 클래스의 ohms 를 불변 객체로 만들어 버린다
    @ohms.setter
    def ohms(self, ohms):
        if hasattr(self, '_ohms'):      # 이미 생성되어 있으면
            raise ValueError(f'저항은 0 이상이어야 합니다. ({ohms})')
        self._ohms = ohms               # 아직 생성 안되었음 (초기화)

r4 = FixedResistence(1e3)   # 초기화시 _ohms 생성
r4.ohms = 2e3               # ValueError

```

### 45) 애트리뷰트를 리팩터링하는 대신 @property를 사용하라 <a id="item45" />

- `@property`를 사용해 기존 애트리뷰트에 새로운 기능을 제공할 수 있다
  - `@property`는 데이터 모델을 점진적으로 개선하는 과정에서 중간중간 필요한 기능을 제공하는 수단으로 유용하다
- `@property`를 과하게 쓰고 있다면, 클래스와 관련 코드를 리팩토링 하는 것을 고려하라

```python
from datetime import datetime, timedelta

# leaky bucket 알고리즘
# 남은 가용 용량(quaota)과 이 가용 용량의 잔존 시간을 표시
class Bucket:
    def __init__(self, period):
        self.period_delta = timedelta(seconds=period)
        self.reset_time = datetime.now()
        self.quota = 0      # 현재 가용량

    def __repr__(self):
        return f'Bucket(quota={self.quotat})'

# Helper 함수: 용량을 채운다
def fill(bucket, amount):
    now = datetime.now()
    if (now - bucket.reset_time) > bucket.period_delta:
        bucket.quota = 0
        bucket.reset_time = now
    bucket.quota += amount

# Helper 함수: 용량을 뺀다(쓴다)
def deduct(bucket, amount):
    now = datetime.now()
    if (now - bucket.reset_time) > bucket.period_delta:
        return False    # 새 주기 시간이 맞지 않다 (재설정되지 않았다)
    if bucket.quota - amount < 0:
        return False    # 용량 부족
    else:
        bucket.quota -= amount
        return True     # 용량 사용 가능

bucket = Bucket(60)
fill(bucket, 100)       # quota = 100

deduct(bucket, 99)      # True: quota = 1
deduct(bucket, 3)       # False: 용량 부족


# 문제: 최초 가용 용량이 얼마인지 알 수 없다
# ==> 재설정된 가용 용량 max_quota 와 소비한 용량 quota_consumed 를 추적하도록 개선
# ==> 모델 개선에 property 를 사용해 보자!

class NewBucket:
    def __init__(self, period):
        self.period_delta = timedelta(seconds=period)
        self.reset_time = datetime.now()
        self.max_quota = 0          # 최대 적재량
        self.quota_consumed = 0     # 누적 소비량

    def __repr__(self):
        return f'NewBucket(max_quota={self.max_quota}, consumed={self.quota_consumed})'

    # 현재 용량을 계산하여 반환
    @property
    def quota(self):
        return self.max_quota - self.quota_consumed

    # helper 함수들의 사용 방식에 맞춰 내부 동작을 수행
    # => quota 변경의 여러 상황에 맞춰 내부 변수 조정
    @quota.setter
    def quota(self, amount):
        delta = self.max_quota - amount
        if amount == 0:         # 초기 설정시
            self.quota_consumed = 0
            self.max_quota = 0
        elif delta < 0:         # 새로운 주기 시작시 용량 설정
            assert self.quota_consumed == 0
            self.max_quota = amount
        else:                   # 용량 소비시
            assert self.max_quota >= self.quota_consumed
            self.quota_consumed += delta

# 기존 Helper 코드를 바꾸지 않아도 된다
bucket = newBucket(60)
fill(bucket, 100)
deduct(bucket, 99)
deduct(bucket, 3)

print('여전히', bucket)
# >>> NewBucket(max_quota=100, quota_consumed=99)

```

### 46) 재사용 가능한 @property 메서드를 만들려면 디스크립터를 사용하라 <a id="item46" />

- `@property` 메서드의 동작과 검증 기능을 재사용하고 싶다면 descriptor 클래스를 만들자
  - descriptor 클래스는 `__get__`과 `__set__` 메서드를 제공한다
  - descriptor 클래스를 만들 때는 메모리 누수 방지를 위해 **_WeakKeyDictionary_** 를 사용하라
- `__getattribute__`가 descriptor 프로토콜을 사용해 속성 값을 읽거나 설정하는 방식을 정확히 이해하자

```python
# 시험 점수
class Exam:
    math_grade = Grade()        # Grade: 0 ~ 100 값을 검증하는 클래스
    writing_grade = Grade()     # 중요!! Exam 여러 instance 들이 Grade() 객체를 공유하게 됨
    science_grade = Grade()

first_exam = Exam()
first_exam.writing_grade = 40
# ==> Exam.__dict__['writing_grade'].__set__(first_exam, 40)
print(first_exam.writing_grade)
# ==> Exam.__dict__['writing_grade'].__get__(first_exam, Exam)


# 디스크립터 클래스 : 일종의 Type Class(?)
class Grade:
    def __init__(self):
        self._value = 0         # 생성 시점의 인스턴스에 종속된다
                                # Exam: math_grade = Grade()
                                #       <-- Exam 선언 시점에 Grade 인스턴스 생성
    # get 디스크립터
    def __get__(self, instance, instance_type):
        return self._value      # instance 구별없이 같은 _value 출력

    # set 디스크립터
    def __set__(self, instance, value):
        if not (0 <= value <= 100):
            raise ValueError('점수는 0과 100 사이입니다')
        self._value = value

second_exam = Exam()
second_exam.writing_grade = 75
# ==> second_exam.writing_grade = 75

first_exam.writing_grade
# >>> 75 (40이 아니라)          # 속성을 공유한 다른 Exam 인스턴스도 변경되어 버린다


from weakref import WeakKeyDictionary

class Grade:
    def __init__(self):
        # self._values = {}                 # instance 별 value 저장 (메모리 해제 안됨)
        self._values = WeakKeyDictionary()  # 활성참조 0 이면 해제 (메모리 누수 방지)

    # get 디스크립터
    def __get__(self, instance, instance_type):
        if instance is None
            return self
        return self._values.get(instance, 0)    # instance 구별

    # set 디스크립터
    def __set__(self, instance, value):
        if not (0 <= value <= 100):
            raise ValueError('점수는 0과 100 사이입니다')
        self._values[instance] = value          # instance 구별

```

### 47) 지연 계산 애트리뷰트가 필요하면 `__getattr__`, `__getattribute__`, `__setattr__`을 사용하라 <a id="item47" />

- `__getattr__`과 `__setattr__`을 사용해 객체 속성을 지연해 가져오거나 저장할 수 있다
  - `__getattr__`은 속성이 존재하지 않을 때만 호출되지만,
  - `__getattribute__`는 속성을 읽을 때마다 항상 호출된다
- `__getattribute__`와 `__setattr__`에서 무한 재귀를 피하려면 super()에 있는 메서드를 사용해 속성에 접근하라

```python
class LazyRecord:
    def __init__(self):
        self.exists = 5
    def __getattr__(self, name):
        value = f'{name}를 위한 값'
        setattr(self, name, value)
        return value

data = LazyRecord()
print('pre:', data.__dict__)        # { 'exists': 5 }
print('getattr:', data.foo)         # 생성 --> foo를 위한 값
print('post:', data.__dict__)       # { 'exists': 5, 'foo': 'foo를 위한 값' }


# 스키마가 없는 데이터에 지연 계산으로 접근하는데 유용하다

class LoggingLazyRecord(LazyRecord):
    def __getattr__(self, name):
        print(f'call: __getattr__({name!r})')
        # 무한 재귀호출을 피하기 위해 super().__getattr__() 를 통해 초기화
        # ==> super 없으면 self 뿐인데 재귀 호출됨
        result = super().__getattr__(name)
        print(f'return: {result!r}')
        return result

data = LoggingLazyRecord()
print('first getattr:', data.foo)         # call: __getattr__('foo') <== 처음에만 호출됨
print('second getattr:', data.foo)        # 이후 __dict__ 에서 저장된 값을 반환

# `hasattr()` 을 이용해 프로퍼티 존재를 검사할 수 있다
data = LoggingLazyRecord()
print('first getattr:', hasattr(data, 'foo'))         # first: True (__getattr__ 호출 후 반환)
print('second getattr:', hasattr(data, 'foo'))        # second: True (__dict__ 통해 반환)


# 만일, 데이터베이스의 트랜잭션 처리를 하는 경우
# 여전히 세션이 열려있는지 확인해서 프로퍼티를 가져오고 싶다면
# __getattribute__ 를 이용한다

class ValidatingRecord:
    def __init__(self):
        self.exists = 5
    # __getattr__ 과 달리 매번 호출됨
    def __getattribute__(self, name):
        print(f'call: __getattr__({name!r})')
        try:
            value = super().__getattribute__(name)
            print(f'found: {name!r}, return: {value!r}')
            return value
        # __dict__에 없는 경우 예외 발생
        except AttributeError:
            value = f'value for {name}'
            print(f'setattr: {name} -> {value}')
            setattr(self, name, value)
            return value

data = ValidatingRecord()
print('first getattr:', data.foo)
# [첫 호출시 값 설정] call: __getattr__('foo') ==> setattr: foo -> value for foo
print('second getattr:', data.foo)
# [매번 실행됨] call: __getattr__('foo') ==>  found: 'foo', return: 'value for foo'

class SavingRecord:
    def __setattr__(self, name, value):
        # 데이터를 데이터베이스 레코드에 저장한다 (persistence object)
        ...
        super().__setattr__(name, value)    # 메모리 객체에도 저장

class LoggingSavingRecord(SavingRecord):
    # 값 설정이든 변경이든 매번 호출됨
    def __setattr__(self, name, value):
        print(f'call: __setattr__({name!r}, {value!r})')
        super().__setattr__(name, value)

data = LoggingSavingRecord()
print('pre:', data.__dict__)    # pre: {}
data.foo = 5                    # create!   => call: __setattr__('foo', '5')
print('post:', data.__dict__)   # post: { 'foo': 5 }
data.foo = 7                    # update!!  => call: __setattr__('foo', '7')
print('final:', data.__dict__)  # final: { 'foo': 7 }

# __getattribute__ 에 의한 무한호출을 막으려면 super() 를 이용하라
# __setattr__ 도 마찬가지이므로, super().__setattr__ 를 이용해 무한 호출을 방지할 것

class DictionaryRecord:
    def __init__(self, data):
        self._data = data
    def __getattribute__(self, name):
        print(f'call: __getattribute__({name!r})')
        # 직접 self._data[name] 을 접근하면 무한호출에 빠진다!!
        # ==> super()를 통해 _data에 접근
        data_dict = super().__getattribute__('_data')
        return data_dict[name]

```

### 48) `__init_subclass__`를 사용해 하위 클래스를 검증하라 <a id="item48" />

- 메타클래스의 대표적인 활용법은 어떤 클래스가 제대로 구현됐는지 검증하는 것
- 메타클래스의 `__new__` 메서드는 class 문의 모든 본문이 처리된 직후에 호출된다
  - 메타클래스를 사용해 클래스가 정의된 직후이면서, 클래스가 생성되기 직전인 시점에 클래스 정의를 변경할 수 있다.
- 하지만 메타클래스는 원하는 목적을 달성하기에 너무 복잡해지는 경우가 많다
  - `__init_subclass__` 를 사용해 복잡함을 줄일 수 있다
  - `__init_subclass__` 안에서 `super().__init_subclass__` 를 호출해 여러 계층에 걸쳐 검증하고 다중상속을 처리할 수 있다

```python
# type 상속
class Meta(type):
    # 자신과 연관된 클래스의 내용을 받는다
    # 생성 클래스의 본문이 실행된 이후 실행 시작
    def __new__(meta, name, bases, class_dict):
        print(f'execute: {meta}.__new__ of {name} ({bases})')
        print(class_dict)
        return type.__new__(meta, name, bases, class_dict)

class MyClass(metaclass=Meta):
    stuff = 123
    def foo(self):
        pass

class MySubClass(MyClass):
    other = 567
    def bar(self):
        pass

data = MyClass()
# execute: <class '__main__.Meta'>.__new__ of MyClass ()
# {
#    '__module__': '__main__',
#    '__qualname__': 'MyClass',
#    'stuff': 123,
#    'foo': <function MyClass.foo>
# }


# 하위 클래스의 모든 파라미터 검증
class ValidatePolygon(type):
    def __new__(meta, name, bases, class_dict):                         # 4)
        # Polygon 클래스의 하위 클래스만 검증 (bases != None)
        if bases:
            if class_dict['sides'] < 3:
                raise ValueError('다각형 변은 3개 이상이어야 함')       # 5)
        return type.__new__(meta, name, bases, class_dict)

class Polygon(metaclass=ValidatePolygon):
    sides = None    # 하위 클래스는 반드시 값 지정을 해야 함
    @classmethod
    def interior_angles(cls):
        return (cls.sides - 2) * 180

print('pre of sides')       # 1)

class Line(Polygon):
    sides = 2               # 2)
    print('post of sides')  # 3)

# 1) pre of sides
# 2,3) post of sides
# 4,5) ValueError: 다각형 변은 3개 이상이어야 함

# __init_subclass__: 파이썬 3.6부터
class BetterPolygon:
    sides = None    # 하위 클래스는 반드시 값 지정을 해야 함

    # ValidatePolygon 메타 클래스 생략 등의 번거로운 코드 절약
    def __init_subclass__(cls):
        super().__init_subclass__()
        if cls.sides < 3:
            raise ValueError('다각형 변은 3개 이상이어야 함')

    @classmethod
    def interior_angles(cls):
        return (cls.sides - 2) * 180

class Hexagon(BetterPolygon):
    sides = 6

assert Hexagon.interior_angles() == 720


# 검증을 여러 단계로 하기 위해 메타클래스를 상속할 수도 있다
# ==> 코드가 복잡해지기 때문에 Mixin 클래스 사용을 추천

class ValidatePolygon(type):
    def __new__(meta, name, bases, class_dict):                         # 4)
        # 루트 클래스가 아닌 경우만 검증 (클래스 속성)
        if not class_dict.get('is_root'):
            if class_dict['sides'] < 3:
                raise ValueError('다각형 변은 3개 이상이어야 함')       # 5)
        return type.__new__(meta, name, bases, class_dict)

class Polygon(metaclass=ValidatePolygon):
    is_root = True
    sides = None        # 하위 클래스는 반드시 값 지정을 해야 함

# 메타클래스 하위 클래스 (조건 추가)
class ValidateFilledPolygon(ValidatePolygon):
    def ___new__(meta, name, bases, class_dict):
        # 루트 클래스가 아닌 경우만 검증 (클래스 속성)
        if not class_dict.get('is_root'):
            if class_dict['color'] not in ('red', 'green'):
                raise ValueError('지원하지 않는 color 값')
        return super().__new__(meta, name, bases, class_dict)

# Polygon 의 생성조건 검사와 더불어 추가적인 color 검사를 포함한 root 클래스
class FilledPolygon(Polygon, metaclass=ValidateFilledPolygon):
    is_root = True
    color = None        # 하위 클래스는 반드시 값 지정을 해야 함


class GreenPentagon(FilledPolygon):
    color = 'green'
    sides = 5

greenie = GreenPentagon()
assert isinstance(greenie, Polygon)     # True

class OrangePentagon(FilledPolygon):
    color = 'orange'
    sides = 5
# >>> ValueError: 지원하지 않는 color 값

class RedLine(FilledPolygon):
    color = 'red'
    sides = 2
# >>> ValueError: 다각형 변은 3개 이상이어야 함

##
## item41: 기능을 합성할 때는 Mixin 클래스를 사용하라
##

class Filled:
    color = None        # 하위 클래스는 반드시 값 지정을 해야 함
    # FilledPolygon 메타클래스를 정의하는 대신에 __init_subclass__ 활용
    def __init_subclass__(cls):
        super().__init_subclass__()
        if class_dict['color'] not in ('red', 'green', 'blue'):
            raise ValueError('지원하지 않는 color 값')

# Mixin 클래스로 두개의 조건을 모두 검사
class RedTriangle(Filled, Polygon):
    color = 'green'
    sides = 5

ruddy = RedTriangle()
assert isinstance(ruddy, Polygon)       # True
assert isinstance(ruddy, Filled)        # True

# __init_subclass__ 를 다이아몬드 상속 같은 복잡한 경우에도 사용할 수 있다

```

### 49) `__init_subclass__`를 사용해 클래스 확장을 등록하라 <a id="item49" />

- 메타클래스의 다른 용례로 프로그램이 자동으로 타입을 등록하는 것이 있다
  - 예를 들어, JSON 으로 직렬화 하는 직렬화 표현 방식 구현
  - 클래스 등록은 파이썬의 모듈화할 때 유용한 패턴이다
- 메타클래스를 클래스 등록에 사용하면 등록하지 않아서 생기는 오류를 피할 수 있다
- 표준적인 메타클래스 방식보다 `__init_subclass__`가 더 낫다

```python
import json

# 직렬화 특성 클래스
class Serializable:
    def __init__(self, *args):
        self.args = args
    def serialize(self):
        return json.dumps({'args': self.args})

class Point2D(Serializable):
    def __init__(self, x, y):
        super().__init__(x, y)
        self.x = x
        self.y = y
    def __repr__(self):
        return f'Point2D({self.x},{self.y})'

point = Point2D(5,3)
point.serialize()       # { 'args': [5,3] }

# 역직렬화 특성 클래스
class Deserializable(Serializable):
    @classmethod
    def deserialize(cls, json_data):    # json -> 객체
        params = json.loads(json_data)
        return cls(*params['args'])     # 생성자 호출

class BetterPoint2D(Deserializable):
    ...

before = BetterPoint2D(5, 3)
data = before.serialize()                   # 직렬화
after = BetterPoint2D.deserialize(data)     # 역직렬화


# 직렬화 함수가 많다고 하더라도
# 역직렬화 하는 함수는 공통으로 하나만 있는 것이 이상적이다

class BetterSerializable:
    def __init__(self, *args):      # 배열
        self.args = args
    def serialize(self):
        return json.dumps({
            'class': self.__class__.__name__,
            'args': self.args
        })
    def __repr__(self):
        name = self.__class__.__name__
        args_str = ', '.join(str(x) for x in self.args)
        return f'{name}({args_str})'

registry = {}

# (역)직렬화 대상 클래스 등록
def register_class(target_class):
    registry[target_class.__name__] = target_class

# 역직렬화 함수 (공통으로 하나만 작성)
def deserialize(data):
    params = json.loads(data)
    name = params['class']
    target_class = registry[name]
    return target_class(*params['args'])        # 생성자 호출

# ex) 활용
class EvenBetterPoint2D(BetterSerializable):
    def __init__(self, x, y):
        super().__init__(x, y)
        self.x = x
        self.y = y

register_class(EvenBetterPoint2D)   # 먼저 등록 (문제점!)

before = EvenBetterPoint2D(5, 3)
data = before.serialize()           # 직렬화
after = deserialize(data)           # 역직렬화 (공통함수)


# register_class 자동화 => 메타클래스를 이용해 먼저 등록하게 해준다면??
class Meta(type):
    def __new__(meta, name, bases, class_dict):
        cls = type.__new__(meta, name, bases, class_dict)
        register_class(cls)         # 자동으로 클래스 등록
        return cls

class RegisteredSerializable(BetterSerializable, metaclass=Meta):
    pass

class Vector3D(RegisteredSerializable):
    def __init__(self, x, y, z):
        super().__init__(x, y, z)
        self.x, self.y, self.z = x, y, z

before = Vector3D(10, -7, 3)
data = before.serialize()           # 직렬화
after = deserialize(data)           # 역직렬화 (공통함수)


# 파이썬 3.6부터 도입된 __init_subclass__ 사용해보자
class BetterRegisteredSerializable(BetterSerializable):
    def __init_subclass__(cls):     # metaclass 대체
        super().__init_subclass__()
        register_class(cls)         # 자동으로 클래스 등록

class Vector1D(BetterRegisteredSerializable):
    def __init__(self, x):
        super().__init__(x)
        self.x = x

before = Vector1D(6)
data = before.serialize()           # 직렬화
after = deserialize(data)           # 역직렬화 (공통함수)

```

### 50) `__set_name__`으로 클래스 애트리뷰트를 표시하라 <a id="item50" />

- 메타클래스의 또다른 유용한 용례로 <br>
  클래스 정의 후, 사용되기 이전 시점에 속성을 변경하거나 표시할 수 있는 기능
  - 예) 데이터베이스 row 를 표현하는 새 클래스 정의시, 컬럼에 해당하는 속성을 클래스에 작성되도록 연동
- 디스크립터와 메타클래스를 조합하면 강력한 실행시점 코드 검사와 선언적인 동작을 만들 수 있다
- `__set_name__` 메서드를 디스크립터 클래스에 정의하면 클래스의 프로퍼티 이름을 다룰 수 있다

```python
# 디스크립터 클래스 (item46 참조)
class Field:
    def __init__(self, name):
        self.name = name
        self.internal_name = '_' + self.name
    def __get__(self, instance, instance_type):
        if instance is None:
            return self
        return getattr(instance, self.internal_name, '')
    def __set__(self, instance, value):
        setattr(instance, self.internal_name, value)

class Customer:
    # 클래스 속성
    first_name = Field('first_name')    # 변수명과 field 이름이 중복해서 기술된다
    last_name = Field('last_name')      # 메타클래스로 연동할 방법은?
    prefix = Field('prefix')
    sufix = Field('sufix')

cust = Customer()               # first_name = None(없음): {}
cust.first_name = '유클리드'    # { '_first_name': '유클리드' }


# 개선1) 필드 등록을 연동하는 메타클래스
class Meta(type):
    def __new__(meta, name, bases, class_dict):
        for key, value in class_dict.items():
            if isinstance(value, Field):
                value.name = key
                value.internal_name = '_'+key
        cls = type.__new__(meta, name, bases, class_dict)
        return cls

class DatabaseRow(metaclass=Meta):
    pass

class BetterCustomer(DatabaseRow):
    # 클래스 속성 (자동 등록)
    first_name = Field()    # Meta 에 의해 Field 의 속성값 결정
    last_name = Field()     # class_dict: { 'first_name': Field(), ... }
    prefix = Field()
    sufix = Field()


# 개선2) DatabaseRow 상속을 생략할 수 있는 방법은?

class Field:
    def __init__(self):
        self.name = None
        self.internal_name = None

    # 클래스가 생성될 때 모든 스크립터에 대해 이 메서드가 호출된다
    # 파이썬 3.8부터 __set_name__ 도입
    def __set_name__(self, owner, name):
        self.name = name
        self.internal_name = '_'+name

    def __get__(self, instance, instance_type):
        if instance is None:
            return self
        return getattr(instance, self.internal_name, '')
    def __set__(self, instance, value):
        setattr(instance, self.internal_name, value)

class FixedCustomer:
    first_name = Field()    # Field 사용시 __set_name__ 호출
    last_name = Field()     # ==> DatabaseRow 사용과 같은 효과
    prefix = Field()
    sufix = Field()

```

### 51) 합성 가능한 클래스 확장이 필요하면 메타클래스보다는 클래스 데코레이터를 사용하라 <a id="item51" />

- 클래스 데코레이터는 class 인스턴스를 파라미터로 받아 변경된 클래스 또는 새로운 클래스를 반환해주는 간단한 함수이다
  - 준비 코드를 최소화하면서 클래스 내부의 메서드나 속성을 변경하고 싶을 때 유용하다
- 메타클래스는 서로 쉽게 합성할 수 없지만, 여러 클래스 데코레이터를 사용해 똑같은 클래스를 확장할 수 있다

```python
from functools import wraps

def trace_func(func):
    if hasattr(func, 'tracing'):    # 단 한번만 사용된다
        return func                 # 반환 전에 tracing 이 함수 객체에 삽입됨

    @wraps(func)
    def wrapper(*args, **kwargs):
        result = None
        try:
            result = func(*args, **kwargs)
            return result
        except Exception as e:
            result = e
            raise
        finally:
            print(f'{func.__name__}(args, kwargs) -> {result!r}')

    wrapper.tracing = True
    return wrapper

class TraceDict(dict):
    @trace_func
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    @trace_func
    def __setitem__(self, *args, **kwargs):
        super().__setitem__(*args, **kwargs)

    @trace_func
    def __getitem__(self, *args, **kwargs):
        super().__getitem__(*args, **kwargs)

trace_dict = TraceDict([ ('hi', 1)])
trace_dict['there'] = 2
try:
    trace_dict['not exists']
except KeyError:
    pass


# 개선1) 함수마다 매번 @trace_func 를 선언해야 한다는 점
# ==> 메타클래스를 사용해 클래스에 속한 모든 메서드를 자동으로 감싸는 것

import types

trace_types = (
    types.MethodType,
    types.FunctionType,
    types.BuiltinFunctionType,
    types.BuiltinMethodType,
    types.MethodDescriptorType,
    types.ClassMethodDescriptorType,
)

class TraceMeta(type):
    def __new__(meta, name, bases, class_dict):
        klass = super().__new__(meta, name, bases, class_dict)
        # 클래스의 모든 내용물을 대상으로 trace_func 적용
        for key in dir(klass):
            value = getattr(klass, key)
            if isinstance(value, trace_types):
                wrapped = trace_func(value)
                setattr(klass, key, wrapped)    # 갱신
        return klass

class TraceDict(dict, metaclass=TraceMeta):
    pass


# 개선 2) 다른 메타클래스가 상속되어 있는 경우 오류 발생
# ==> 이런 문제를 해결하기 위해 클래스 데코레이터를 지원한다
#     클래스 선언 앞에 @ 기호와 데코레이터 함수를 적으면 된다

def my_class_decorator(klass):
    klass.extra_param = 'hi'
    return klass

@my_class_decorator
class MyClass:
    pass

MyClass.extra_param
# >>> hi

# 클래스 데코레이터를 이용해 수정된 버전
def trace(klass):
    for key in dir(klass):
        value = getattr(klass, key)
        if isinstance(value, trace_types):
            wrapped = trace_func(value)
            setattr(klass, key, wrapped)    # 갱신
    return klass

@trace
class TraceDict(dict):
    pass


# 다른 메타클래스를 포함하고 있어도 잘 작동된다
# ==> 클래스를 확장하면서 합성이 가능한 방법을 찾고 있다면
#     클래스 데코레이터가 가장 적합한 방법이다

class OtherMeta(type):
    pass

@trace
class TraceDict(dict, metaclass=OtherMeta):
    pass

```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
