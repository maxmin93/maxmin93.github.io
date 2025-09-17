---
date: 2021-01-08 00:00:00 +0900
title: Effective PYTHON 2nd - Ch07
description: Effective Python 의 7장을 요약 했습니다.
categories: [Language, Python]
tags: [book]
---

![Cover - Effective Java 3rd](https://effectivepython.com/images/cover_2ed.jpg){: width="50%" .w-75 .normal}
_도서 - Effective PYTHON 2nd_

## 7장 동시성과 병렬성

### 52) 자식 프로세스를 관리하기 위해 subprocess를 사용하라 <a id="item52" />

- subprocess 모듈을 사용해 자식 프로세스를 실행하고 입력과 출력 스트림을 관리할 수 있다.
- 자식 프로세스는 파이썬 인터프리터와 병렬로 실행되므로 CPU 코어를 최대로 쓸 수 있다.
- 간단하게 자식 프로세스를 실행하고 싶은 경우에는 run 함수를 사용하라
  - 유닉스 스타일의 파이프라인이 필요하면 Popen 클래스를 사용하라
- 자식 프로세스가 멈추는 경우나 교착 상태를 방지하려면 communicate 메서드에 대해 timeout 파라미터를 사용하라.

```python
import subprocess

result = subprocess.run(['echo', 'hello from subprocess!'],
        capture_output=True,
        encoding='utf-8'
        )
result.check_returncode()   # 예외가 발생하지 않으면 정상 종료임
print(result.stdout)


proc = subprocess.Popen(['sleep', '1'])
while proc.poll() is None:
    print('on working...')
    # 시간이 걸리는 작업
    ...

print('종료 상태:', proc.poll())    # => 0


# 자식 프로세스와 부모 프로세스를 분리하면
# 원하는 개수만큼 많은 자식 프로세스를 병렬로 실행할 수 있다
import time

start = time.time()
sleep_procs = []

for _ in range(10):
    proc = subprocess.Popen(['sleep', '1'])
    sleep_procs.append(proc)
for proc in sleep_procs:
    proc.communicate()      # 순차 실행시 10초 이상 걸림

end = time.time()
delta = end - start
print(f'{delta:.3} 초 만에 끝남')   # 1.04 초 만에 끝남


# 유닉스 파이프라인처럼 프로세스의 출력을 다음 프로세스 입력으로 연결시켜서
# 여러 병렬 프로세스를 연쇄적으로 실행할 수 있다
encrypt_procs = []
hash_procs = []
for _ in range(3):
    data = os.urandom(100)

    encrypt_proc = run_encrypt(data)            # PIPE => subprocess.Popen => PIPE
    encrypt_procs.append(encrypt_proc)
                                                # encrypt_proc 의 output 을 입력으로 연결
    hash_proc = run_hash(encrypt_proc.stdout)   # stdin => subprocess.Popen => PIPE
    hash_procs.append(hash_proc)

    encript_proc.stdout.close()
    encript_proc.stdout = None

for proc in encrypt_procs:
    proc_communicate()
    assert proc.returncode == 0

for proc in hash_procs:
    out, _ = proc.communicate()
    print(out[-10:])

assert proc.returncode == 0


# 블록되는 경우가 우려된다면, timeout 파라미터를 사용한다
proc  = subprocess.Popen(['sleep', '10'])
try:
    proc.communicate(timeout=0.1)
except subprocess.TimeoutExpired:
    proc.terminate()
    proc.wait()

print('종료 상태:', proc.poll())     # => 종료 상태: -15

```

### 53) 블로킹 I/O의 경우 스레드를 사용하고 병렬성을 피하라 <a id="item53" />

- 파이썬 스레드는 GIL(전역 인터프리터 락)로 인해 멀티 CPU 코어에서 병렬로 실행될 수 없다.
- GIL 이 있음에도 파이썬 스레드는 여전히 유효하다.
  - 스레드를 사용하면 여러 job 을 동시에 진행하는 작업을 쉽게 기술할 수 있기 때문이다.
- 파이썬 스레드를 사용해 여러 시스템 콜을 병렬로 수행할 수 있다.
  - 이를 활용하면 블로킹 I/O 와 계산을 동시에 수행할 수 있다.

> 스레드를 사용하지 않는 경우

```python
import time

def factorize(number):
    for i in range(1, number+1):
        if number % i == 0:
            yield i

numbers = [2139079, 1214759, 1516637, 1852285]
start = time.time()

# 스레드 1개만 사용
for number in numbers:
    print(number, '==>', list(factorize(number)))

# total 0.253 sec elapsed
end = time.time()
delta = end - start
print(f'total {delta:.3f} sec elapsed')
```

> 스레드를 사용한 경우 (비슷. 성능향상이 없다)

```python
from threading import Thread

class FactorizeThread(Thread):
    def __init__(self, number):
        super().__init__()
        self.number = number
    def run(self):
        self.factors = list( factorize(self.number) )

# 각 수마다 스레드를 시작해 병렬로 인수를 찾을 수 있다.
start = time.time()

threads = []
for number in numbers:
    thread = FactorizedThread(number)
    thread.start()
    threads.append(thread)

# 모든 스레드가 끝날 때까지 기다린다
for thread in threads:
    thread.join()

end = time.time()                           # 단순 순차 실행시 0.256초
print(f'총 {end - start:.3f} 초 걸림')      # >>> 0.446초 걸림

# 놀랍게도 스레드를 하나만 써서 순차적으로 factorize를 실행할 때보다
# 시간이 더 오래 걸린다. ==> GIL 의 영향

# 그럼에도 파이썬이 스레드를 지원하는 이유는?
# 1) 다중 스레드를 사용하면 프로그램이 동시에 여러 일을 하는 것처럼 보이게 만들기 쉽다.
#    - CPython 어느 정도 균일하게 각 스레드를 실행시킨다
# 2) 블로킹 I/O 를 다루기 위해서다.
#    - 운영체제가 시스템 콜 요청에 응답하는데 걸리는 시간 동안 파이썬 프로그램이 다른 일을 할 수 있다

import select
import socket

# 순차 실행시 수행시간이 선형으로 늘어나는 작업
# ==> 총 0.503초 걸림
def slow_systemcall():
    select.select([socket.socket()], [], [], 0.1)

start = time.time()

# 블로킹 I/O를 병렬로 실행한다
threads = []
for _ in range(5):
    thread = Thread(target=slow_systemcall)
    thread.start()
    threads.append(threads)

# 스레드를 시작한 후 다른 코드를 수행한다
def compute_another(index):
    ...

for i in range(5):                          # 다른 작업을 수행하고도
    compute_another(i)                      # 순차 실행보다 시간이 1/5로 줄어든다

for thread in threads:
    thread.join()

end = time.time()                           # 단순 순차 실행시 0.503초
print(f'총 {end - start:.3f} 초 걸림')      # >>> 총 0.102초 걸림

```

> 블로킹 I/O를 다루는 코드 (non-Thread)

```python
import select
import socket

def slow_systemcall():
    select.select([socket.socket()], [], [], 0.1)

start = time.time()

for _ in range(5):
    slow_systemcall()

# total 0.520 sec elapsed
end = time.time()
delta = end - start
print(f'total {delta:.3f} sec elapsed')
```

> 블로킹 I/O를 다루는 코드 (Thread 사용: **성능향상!!**)

```python
import select
import socket

# 블로킹 I/O 작업 (병렬성이 필요한 작업)
def slow_systemcall():
    # 시스템 콜 (select)
    select.select([socket.socket()], [], [], 0.1)

def compute_something(pre_val, cur_val):
    # doing other job (print 사용해도 지장 없음)
    # print( pre_val + cur_val )
    return pre_val + cur_val

start = time.time()

threads = []
for _ in range(5):
    thread = Thread(target=slow_systemcall)
    thread.start()
    threads.append(thread)

for i in range(5):
    compute_something(i, i+1)

# 모든 스레드가 끝날 때까지 기다린다
for thread in threads:
    thread.join()

# total 0.107 sec elapsed (non-thread: 0.520 sec)
end = time.time()
delta = end - start
print(f'total {delta:.3f} sec elapsed')
```

### 54) 스레드에서 데이터 경합을 피하기 위해 Lock을 사용하라 <a id="item54" />

- GIL은 여러 스레드 사이에 일어나는 데이터 경합으로부터 데이터를 보호하지 못한다
- 여러 스레드가 상호배제 락(뮤텍스) 없이 동일 객체를 다루면 데이터를 오염시킨다
  - threading 내장 모듈의 Lock 클래스를 활용하라

> Lock 없이 동일 개체를 다수의 Thread 가 다룬 경우 (데이터 오염)

```python
# 동일 객체를 대상으로 여러 스레드가 값을 갱신해서 데이터가 오염됨
# ==> Lock 필요
class Counter:
    def __init__(self):
        self.count = 0
    def increment(self, offset):
        self.count += offset

# how_many 만큼 숫자를 증가
def worker(sensor_index, how_many, counter):
    for _ in range(how_many):
        # 센서를 읽는다
        counter.increment(1)

from threading import Thread

how_many = 10**5
counter = Counter()

start = time.time()

threads = []
for i in range(5):
    thread = Thread(target=worker, args=(i, how_many, counter))
    thread.start()
    threads.append(thread)

# 모든 스레드가 끝날 때까지 기다린다
for thread in threads:
    thread.join()

# how_many 만큼 증가시키는 작업을 5번 실행한 결과 (0.085 sec elapsed)
# expected value = 500000, but found value = 367540
expected = how_many*5
found = counter.count
print(f'expected value = {expected}, but found value = {found}')

end = time.time()
delta = end - start
print(f'total {delta:.3f} sec elapsed')

# 결과
# expected value = 500000, but found value = 450379
# total 0.085 sec elapsed
```

> Lock 으로 보호된 객체를 다루는 경우 (올바른 결과)

```python
from threading import Lock

# 데이터 오염 방지
class LockingCounter:
    def __init__(self):
        self.lock = Lock()
        self.count = 0
    def increment(self, offset):
        with self.lock:
            self.count += offset

# how_many 만큼 숫자를 증가
def worker(sensor_index, how_many, counter):
    for _ in range(how_many):
        # 센서를 읽는다
        counter.increment(1)

from threading import Thread

how_many = 10**5
counter = LockingCounter()

start = time.time()

threads = []
for i in range(5):
    thread = Thread(target=worker, args=(i, how_many, counter))
    thread.start()
    threads.append(thread)

# 모든 스레드가 끝날 때까지 기다린다
for thread in threads:
    thread.join()

# how_many 만큼 증가시키는 작업을 5번 실행한 결과 (0.143 sec elapsed)
# expected value = 500000, but found value = 500000
expected = how_many*5
found = counter.count
print(f'expected value = {expected}, but found value = {found}')

end = time.time()
delta = end - start
print(f'total {delta:.3f} sec elapsed')

# 결과
# expected value = 500000, but found value = 500000
# total 0.143 sec elapsed
```

### 55) Queue를 사용해 스레드 사이의 작업을 조율하라 <a id="item55" />

- 순차적인 작업을 동시에 여러 스레드에서 실행되도록 조직하고 싶을 때라면 `파이프라인`이 유용하다
  - 특히 I/O 위주의 작업
- 동시성 파이프라인을 만들 때 발생할 수 있는 여러 문제를 잘 알아두어야 한다
  - 바쁜 대기, 작업자에게 종료를 알리는 방법, 잠재적인 메모리 사용량 폭발 등
- Queue 클래스는 튼튼한 파이프라인을 구축할 때 필요한 블로킹, 버퍼크기 지정, join을 통한 완료 대기를 모두 제공한다

```python
def download(item):
    print('downloaded:', item)
    return item
def resize(item):
    print('resizeed:', item)
    return item
def upload(item):
    print('uploaded:', item)
    return item

from collections import deque
from threading import Lock

class MyQueue:
    def __init__(self):
        self.items = deque()
        self.lock = Lock()
    def put(self, item):
        with self.lock:
            self.items.append(item)
    def get(self):
        with self.lock:
            return self.items.popleft()

from threading import Thread
import time

class Worker(Thread):
    def __init__(self, func, in_queue, out_queue):
        super().__init__()
        self.func = func
        self.in_queue = in_queue
        self.out_queue = out_queue
        self.polled_count = 0
        self.work_done = 0
    def run(self):
        while True:
            self.polled_count += 1
            try:
                item = self.in_queue.get()
            except IndexError:
                time.sleep(0.01)  # 할 일이 없음 (잠시 대기)
            else:
                result = self.func(item)
                self.out_queue.put(result)
                self.work_done += 1

download_queue = MyQueue()
resize_queue = MyQueue()
upload_queue = MyQueue()

done_queue = MyQueue()
threads = [
    Worker(download, download_queue, resize_queue),
    Worker(resize, resize_queue, upload_queue),
    Worker(upload, upload_queue, done_queue),
]

for thread in threads:
    thread.start()

for i in range(1000):
    download_queue.put(str(i))

while len(done_queue.items) < 1000:
    # 기다리는 동안 다른 작업을 수행할 수 있다
    pass

processed = len(done_queue.items)
polled = sum(t.polled_count for t in threads)
print(f'{processed} 개의 아이템을 처리,',f'이때 폴링을 {polled} 번 했습니다.')

# 결과
# 1000 개의 아이템을 처리, 이때 폴링을 3010 번 했습니다.
```

> Queue 를 사용하면 기아 상태로 인한 바쁜 대기를 방지할 수 있다

```python
from queue import Queue

my_queue = Queue()

def consumer():
    print('consumer ready')
    # 비어 있으면 대기 (불필요한 polling을 막아줌)
    my_queue.get()
    print('consumer done')

thread = Thread(target=consumer)
thread.start()

print('producer add data')
my_queue.put(object())
print('producer done')
thread.join()

# 결과
# consumer ready
# producer add data
# producer done
# consumer done

########################################

my_queue = Queue(1)  # 버퍼 크기

def consumer():
    time.sleep(0.1)
    my_queue.get()
    print('consumer#1')
    my_queue.get()
    print('consumer#2')
    print('consumer done')

thread = Thread(target=consumer)
thread.start()

my_queue.put(object())
print('producer#1')
my_queue.put(object())
print('producer#2')
print('producer done')

thread.join()

# 결과
# producer#1
# consumer#1
# producer#2
# producer done
# consumer#2
# consumer done
```

> 선형적인 파이프라인의 경우 `Queue` 가 잘 작동한다

```python
import select
import socket

# 블로킹 I/O 작업 (병렬성이 필요한 작업)
def slow_systemcall():
    select.select([socket.socket()], [], [], 0.1)

def download(item):
    print('downloaded:', item)
    slow_systemcall()
    return item
def resize(item):
    print('resizeed:', item)
    slow_systemcall()
    return item
def upload(item):
    print('uploaded:', item)
    slow_systemcall()
    return item

from collections import deque
from threading import Lock

class ClosableQueue(Queue):
    SENTINEL = object()

    def close(self):
        self.put(self.SENTINEL)
    def __iter__(self):
        while True:
            item = self.get()
            try:
                if item is self.SENTINEL:
                    return  # 스레드 종료
                yield item
            finally:
                self.task_done()

from threading import Thread
import time

class StoppableWorker(Thread):
    def __init__(self, func, in_queue, out_queue):
        super().__init__()
        self.func = func
        self.in_queue = in_queue
        self.out_queue = out_queue
    def run(self):
        for item in self.in_queue:
            result = self.func(item)
            self.out_queue.put(result)


def start_threads(count, *args):
    threads = [StoppableWorker(*args) for _ in range(count)]
    for thread in threads:
        thread.start()
    return threads

def stop_threads(closable_queue, threads):
    for _ in threads:
        closable_queue.close()

    closable_queue.join()
    for thread in threads:
        thread.join()

download_queue = ClosableQueue()
resize_queue = ClosableQueue()
upload_queue = ClosableQueue()
done_queue = ClosableQueue()

download_threads = start_threads(3, download, download_queue, resize_queue)
resize_threads = start_threads(4, resize, resize_queue, upload_queue)
upload_threads = start_threads(5, upload, upload_queue, done_queue)

for i in range(1000):
    download_queue.put(str(i))

stop_threads(download_queue, download_threads)
stop_threads(resize_queue, resize_threads)
stop_threads(upload_queue, upload_threads)

# 기다리는 동안 다른 작업을 수행할 수 있을줄 알았는데 실행 안된다 (왜지??)
# ==> qsize() 에 대해 Lock 이 걸리나?
while done_queue.qsize() < 1000:
    print('--'*10)

print(f'{done_queue.qsize()} 개의 아이템을 처리했습니다.')
```

### 56) 언제 동시성이 필요할지 인식하는 방법을 알아두라 <a id="item56" />

```python

```

### 57) 요구에 따라 팬아웃을 진행하려면 새로운 스레드를 생성하지 말라 <a id="item57" />

```python

```

### 58) 동시성과 Queue를 사용하기 위해 코드를 어떻게 리팩터링해야 하는지 이해하라 <a id="item58" />

```python

```

### 59) 동시성을 위해 스레드가 필요한 경우에는 `ThreadpoolExecutor`를 사용하라 <a id="item59" />

```python

```

### 60) I/O를 할 때는 코루틴을 사용해 동시성을 높여라 <a id="item60" />

```python

```

### 61) 스레드를 사용한 I/O를 어떻게 asyncio로 포팅할 수 있는지 알아두라 <a id="item61" />

```python

```

### 62) asyncio로 쉽게 옮겨갈 수 있도록 스레드와 코루틴을 함께 사용하라 <a id="item62" />

```python

```

### 63) 응답성을 최대로 높이려면 asyncio 이벤트 루프를 블록하지 말라 <a id="item63" />

```python

```

### 64) 진정한 병렬성을 살리려면 `concurrent.futures`를 사용하라 <a id="item64" />

```python

```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
