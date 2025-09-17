---
date: 2022-06-25 00:00:00 +0900
title: Python - Thread Safe 타입도 Lock 이 필요한가?
description: 알아도 또 까먹고, 헷갈리는 스레드 안전에 대한 개념을 한번 더 챙겨봅니다.
categories: [Language, Python]
tags: [thread, gil]
image: "https://cdn.educba.com/academy/wp-content/uploads/2024/03/Python-Global-Interpreter-Lock.jpg"
---

> 알아도 또 까먹고, 헷갈리는 스레드 안전에 대한 개념을 한번 더 챙겨봅니다.
{: .prompt-tip }

## GIL 이 있어도 Lock 이 필요할까?

여러 스레드가 경쟁하는 관계에서 값을 재사용하는 트랜잭션(예: `v = v + 1`)이라면 원하는 값이 계산되지 않을 것이다. 이런 경우에 `Lock` 을 사용한다는 설명을 흔히 책이나 인터넷에서 검색해 볼 수 있다.

`Lock` 은 성능을 현저히 떨어뜨린다. multi-threading 방식을 사용할 필요가 없을 정도로 느려진다. 그러면 single-thread 를 사용하는 것이 옳은가? IO-bound 작업처럼 대기(wait 또는 sleep)이 걸리는 작업이 아니라면 single-thread 가 낫다. 단순하고 계산 위주의 작업일수록 single-thread 가 낫다.

피치 못해서 multi-threading 방식이 필요하다면, Lock 으로 인한 성능저하를 최소화 할 수 있는 방안을 찾아 사용하는 것이 바람직하다.

- List 를 append 만 하는 경우, Lock 을 안써도 된다.
  - 원소(item) 값을 재사용하는 경우가 아니라면, 결과적으로 모든 결과가 취합된다.
- Map 을 사용해 중복제거를 하는 경우, Lock 을 안써도 된다.
  - key 의 hashing 범위가 충분히 넓어서 중복 데이터가 드물다면 Lock 이 없어도 된다.
  - 어차피 중복 데이터를 제거하고 하나만 남기는 경우라서 받아들일만한 결과가 나온다.
  - 중복 데이터에서 `if` 문으로 최대값, 최소값을 갱신하는 경우에도 Lock 없이 결과는 같다.

반면에, 동일한 값을 읽고 쓰는 경우는 Lock 이 필요하다. 변경 불가능한 내장 타입인 int, float 를 사용하는 경우는 당연히 Lock 을 써야하고, `thread-safe` 을 보장한다는 list, map, deque 등도 Lock 을 쓰는게 옳다.

그러면, 파이썬 데이터 타입의 `thread-safe` 라는 말은 무슨 뜻인가? Python 은 multi-threading 환경에서 공유 메모리(heap)에 접근하는 스레드가 유일하도록 GIL 을 이용해 제한하고 있다. 예를 들어, List 타입은 append, pop 등의 메소드를 가지고 있고 heap 메모리에 값을 읽고 쓰는 작업을 수행한다. List 객체가 수행하는 작업에 대해 원자성(atomic)을 보장한다는 뜻이 `thread-safe` 이다. 여러 스레드가 동일한 heap 영역을 읽고 쓰기를 한다해도 자신의 객체에 대한 메모리 읽고 쓰기 작업에 대해 안전함을 보장한다는 뜻이다. (파이썬은 내부적으로 `GC` 가 항상 수행되고 있기 때문에, 싱글 스레드 작업이라 해도 멀티 스레드 형태로 수행된다.)

앞에서 언급한 값을 재사용하는 트랜잭션(`v = v + 1`)은 int 를 쓰든, list 를 쓰든 원자성이 보장되는 연산은 `thread-safe` 수행된다. 하지만 문장 자체가 갖는 트랜잭션으로서의 `thread-safe`를 보장한다는 뜻이 아니다. 그래서 Lock 이 필요하다.

최선의 방책은, 멀티스레딩 환경에서 트랜잭션을 작성할 때 계산 오류가 발생할 수 있는 경우를 최대한 피하는 것이다. 그렇지 못하는 경우에는 Lock 을 사용해 트랜잭션을 작성하는 것이 옳다.

### `thread-safe` 데이터 타입에 대한 멀티스레딩 예제

> int 타입

int 타입은 immutable 이라서, 갱신 때마다 객체 자체가 재생성되어 id() 값이 계속 바뀐다. 그렇다 하더라도 멀티스레드에 대해 안전하다. 모든 immutable 내장 객체가 동일하다.

```python
import threading
import time

total = 0
lock = threading.Lock()

def increment_n_times(n):
    global total
    for i in range(n):
        total += 1

def safe_increment_n_times(n):
    global total
    for i in range(n):
        lock.acquire()
        total += 1
        lock.release()

def increment_in_x_threads(x, func, n):
    threads = [threading.Thread(target=func, args=(n,)) for i in range(x)]
    global total
    total = 0
    begin = time.time()
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()
    print('finished in {}s.\ntotal: {}\nexpected: {}\ndifference: {} ({} %)'
           .format(time.time()-begin, total, n*x, n*x-total, 100-total/n/x*100))

print('unsafe:')
increment_in_x_threads(70, increment_n_times, 100000)

print('\nwith locks:')
increment_in_x_threads(70, safe_increment_n_times, 100000)

"""
unsafe:
finished in 0.3160538673400879s.
total: 6811163
expected: 7000000
difference: 188837 (2.697671428571425 %)

with locks:
finished in 1.8482868671417236s.
total: 7000000
expected: 7000000
difference: 0 (0.0 %)
"""
```

> list 타입

not-safe 한 increment_n_times 함수는 최대값이 결과값도 아니고 원하는 결과도 아니다.

```python
import threading
import time

total = [0]
lock = threading.Lock()

def increment_n_times(n):
    global total
    for i in range(n):
        total.append( total[-1]+1 )

def safe_increment_n_times(n):
    global total
    for i in range(n):
        lock.acquire()
        total.append( total[-1]+1 )
        lock.release()

def increment_in_x_threads(x, func, n):
    threads = [threading.Thread(target=func, args=(n,)) for i in range(x)]
    global total
    total = [0]
    begin = time.time()
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()
    print('finished in {}s.\ntotal: {}\nexpected: {}\ndifference: {} ({} %)'
           .format(time.time()-begin, total[-1], n*x, n*x-total[-1], 100-total[-1]/n/x*100))
    print(f'max(total)={max(total)}')

print('unsafe:')
increment_in_x_threads(70, increment_n_times, 100000)

print('\nwith locks:')
increment_in_x_threads(70, safe_increment_n_times, 100000)

"""
unsafe:
finished in 0.49228501319885254s.
total: 5700131
expected: 7000000
difference: 1299869 (18.56955714285715 %)
max(total)=5770692

with locks:
finished in 2.7705650329589844s.
total: 7000000
expected: 7000000
difference: 0 (0.0 %)
max(total)=7000000
"""
```

> deque 타입

not-safe 한 increment_n_times 함수의 경우, 사전에 `if` 확인을 했어도 한두 차례 `IndexError` 가 발생했다.

```python
import threading
import time
from collections import deque

total = deque()
lock = threading.Lock()

def increment_n_times(n):
    global total
    for i in range(n):
        if total:
            total.append( total.pop()+1 )

def safe_increment_n_times(n):
    global total
    for i in range(n):
        lock.acquire()
        if total:
            total.append( total.pop()+1 )
        lock.release()

def increment_in_x_threads(threads_size, func, n):
    threads = [threading.Thread(target=func, args=(n,)) for i in range(threads_size)]
    global total
    total = deque([0])
    begin = time.time()
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()

    if total:
        result = total.pop()
        print('finished in {}s.\ntotal: {}\nexpected: {}\ndifference: {} ({} %)'
               .format(time.time()-begin, result, n*threads_size,
                       n*threads_size-result, 100-result/n/threads_size*100))
    else:
        print('finished in {}s.\ntotal: empty'.format(time.time()-begin))

print('unsafe:')
increment_in_x_threads(70, increment_n_times, 100000)
print()
print('with locks:')
increment_in_x_threads(70, safe_increment_n_times, 100000)

"""
unsafe:
Exception in thread Thread-1165:
Traceback (most recent call last):
  File "/Users/bgmin/.pyenv/versions/3.9.13/lib/python3.9/threading.py", line 980, in _bootstrap_inner
    self.run()
  File "/Users/bgmin/.pyenv/versions/3.9.13/lib/python3.9/threading.py", line 917, in run
    self._target(*self._args, **self._kwargs)
  File "/var/folders/s1/6xwbd1gj1hdbyj9phsr7nc5w0000gn/T/ipykernel_92431/3217696385.py", line 12, in increment_n_times
IndexError: pop from an empty deque
finished in 0.513524055480957s.
total: 5475625
expected: 7000000
difference: 1524375 (21.776785714285708 %)

with locks:
finished in 2.328947067260742s.
total: 7000000
expected: 7000000
difference: 0 (0.0 %)
"""
```

## 9. Review

- 현타가 느껴지는 질문을 받을 때가 있다. 정리한 내용을 다시 보자.
- 자신의 성향을 바꾸는 것은 옳지 않다. 고쳐서 써야 한다. 계속 공부하자.
- python 은 싱글 스레드로 동작하도록 만들어졌다. 
  - 새로운 스레드 작업이 필요하면 쓰고 버리면 된다. (대범하게)
  - 고성능 병렬처리를 원한다면 go 언어를 추천한다.

> 참고문서

- [Why do we need locks for threads, if we have GIL?](https://stackoverflow.com/a/40072999)
- [Guido is Right to Leave the GIL in Python, Not for Multicore but for Utility Computing](https://smoothspan.com/2007/09/14/guido-is-right-to-leave-the-gil-in-python-not-for-multicore-but-for-utility-computing/)
- [Thread Synchronization Mechanisms in Python](https://web.archive.org/web/20201101025814id_/http://effbot.org/zone/thread-synchronization.htm)
- [How are thread-safe data types implemented in Python?](https://www.quora.com/How-are-thread-safe-data-types-implemented-in-Python)
- [Thread](https://hyobins.github.io/2021-08-15-Thread/)
- [Thread-Safety in Python](https://www.flowdas.com/2013/11/10/thread-safety-in-python.html)

  &nbsp; <br />
  &nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
