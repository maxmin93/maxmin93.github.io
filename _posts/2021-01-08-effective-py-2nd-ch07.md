---
date: 2021-01-08 00:00:00 +0000
title: "Effective PYTHON 2nd - Ch07"
categories: ["python"]
tags: ["effective python","TIL"]
image:
  src: https://effectivepython.com/images/cover_2ed.jpg
---

## 7장 동시성과 병렬성

### 52) 자식 프로세스를 관리하기 위해 subprocess를 사용하라 <a id="item52" />

* subprocess 모듈을 사용해 자식 프로세스를 실행하고 입력과 출력 스트림을 관리할 수 있다.
* 자식 프로세스는 파이썬 인터프리터와 병렬로 실행되므로 CPU 코어를 최대로 쓸 수 있다.
* 간단하게 자식 프로세스를 실행하고 싶은 경우에는 run 함수를 사용하라
  * 유닉스 스타일의 파이프라인이 필요하면 Popen 클래스를 사용하라
* 자식 프로세스가 멈추는 경우나 교착 상태를 방지하려면 communicate 메서드에 대해 timeout 파라미터를 사용하라.

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

* 파이썬 스레드는 GIL(전역 인터프리터 락)로 인해 멀티 CPU 코어에서 병렬로 실행될 수 없다.
* GIL 이 있음에도 파이썬 스레드는 여전히 유효하다.
  * 스레드를 사용하면 여러 job 을 동시에 진행하는 작업을 쉽게 기술할 수 있기 때문이다.
* 파이썬 스레드를 사용해 여러 시스템 콜을 병렬로 수행할 수 있다.
  * 이를 활용하면 블로킹 I/O 와 계산을 동시에 수행할 수 있다.

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


### 54) 스레드에서 데이터 경합을 피하기 위해 Lock을 사용하라 <a id="item54" />


```python

```


### 55) Queue를 사용해 스레드 사이의 작업을 조율하라 <a id="item55" />


```python

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

