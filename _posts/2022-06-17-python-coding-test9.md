---
date: 2022-06-17 00:00:00 +0900
title: Python 코딩테스트 연습문제 81~90
description: 파이썬 코딩테스트 준비를 하며 공부한 내용을 기록하고 복습합니다.
categories: [Language, Python]
tags: [coderbyte, 코딩테스트]
image: https://coderbytestaticimages.s3.amazonaws.com/consumer-v2/nav/coderbyte_logo_digital_multi_light.png
---

## 참고자료

- [구름level](https://level.goorm.io/)

`구름level` 의 문제들은 사용자들이 올린 문제라서 완전히 신뢰할 수는 없다.<br>
외국 사이트인 `coderbyte` 와 달리 한국식 수능 지문의 형태를 따른다.<br>
문제와 별개로 설정 상황을 긴 지문을 읽고 이해해야 하는 수고가 필요하다.<br>
왕 짜증! 그리고 유사문제에서 어렵게 꼬아 만든 티가 역력하다. 짜증x2!!

- [링크드인 스킬 평가 퀴즈 - 정답지](https://github.com/mauriziomarini/linkedin-skill-assessments-quizzes-1)
  - 이걸로 보시오! => [웹버전](https://ebazhanov.github.io/linkedin-skill-assessments-quizzes/)

실무 관련 이론적 수준 평가를 위한 다양한 문제들을 담고 있다.

## 코딩테스트

### 문제 81

아래 코드를 실행하면 어떻게 될까요?

- 처음 생각은 실행이 안될꺼라는 선택을 했다.
- 다시 생각해 보니 파일은 읽을것 같다는 생각을 했다.
- 다른 문제를 풀다가 다시 살펴보니 함정이 있지 않을까? 설마?

```js
const fs = require("fs");
const util = require("util");
const readFile = util.promisify(fs.readFile);

async function readTwoFiles(nyFile, ldFile) {
  const options = { encoding: "utf-8" };
  const ny = await readFile(nyFile, options);
  const ld = await readFile(ldFile, options);
  return [ny, ld];
}

// await 구문이 없으니 result 에 Promise 가 pending 상태로 반환
let result = readTwoFiles(
  "/Users/bgmin/Documents/temp/a.txt",
  "/Users/bgmin/Documents/temp/b.txt"
);
```

그래서 실제 돌려보았다.

- 아래 출력 결과에서 보듯이 `await` 없어도 모두 실행된다.
- 단지 비동기적으로 실행되지 않는다는 것뿐. 동기식으로 실행된다.
- 1 ~ 2초 뒤에 result에 결과가 담겨 있다.
- `Event Loop` 에 태워 비동기적으로 실행시키는 것은 `await` 이다.

```js
const fs = require("fs");
const util = require("util");
// Promise 를 손쉽게 생성해주는 유틸리티 함수
const readFile = util.promisify(fs.readFile);

// async 의 리턴값은 Promise 이다.
async function readTwoFiles(nyFile, ldFile) {
  console.log("## inner 1");
  const options = { encoding: "utf-8" };
  // 파일 읽기가 비동기 작업으로 예약된다.
  // 다만 현재 태스크가 우선적이라 기다리지 않고 바로 넘어감
  const ny = await readFile(nyFile, options);
  const ld = await readFile(ldFile, options);
  console.log("## inner 2");

  return [ny, ld];
}

// 순차적으로 실행되기 때문에 Promise 타입으로 object 를 즉시 반환
let result = readTwoFiles(
  "/Users/bgmin/Documents/temp/a.txt",
  "/Users/bgmin/Documents/temp/b.txt"
);

// object 는 파일 읽기에 대한 pending task 가 담겨 있다.
console.log("run..............", result instanceof Promise);
console.log(result);

// Timeout 으로 지연 후 확인해 보면 파일 읽기 결과가 있다.
// 메인 태스크가 끝나자, 예약된 비동기 작업이 실행된 것임
setTimeout(() => {
  console.log("## inner 99....", result instanceof Promise);
  console.log(result);
}, 2000);

/*
## inner 1
run.............. true
Promise { <pending> }
## inner 2
## inner 99.... true
Promise { [ 'aaaaaaaaaaaaa\n', 'bbbbbbbbbbb' ] }
*/
```

참고 자료

- StackOverflow: [Async Function returns Promise pending](https://stackoverflow.com/questions/65912986/async-function-returns-promise-pending)
- 블로그: [Async without await, Await without async](https://dev.to/codeprototype/async-without-await-await-without-async--oom)

### 문제 82

테이블 `employee` 는 `boss_id` 가 `id` 를 자기 참조하는 구조이다.<br>
최상위 보스 `id = 1` 에 대한 부하직원들 전체를 트리 형태로 보고 싶다면?

- Postgresql 의 `재귀쿼리` 구문을 이용한다 (자기참조 구조의 테이블)
- 최상위 쿼리를 정의하고, `union` 뒤에 `반복쿼리` 를 작성한다.

반복쿼리의 조인 조건 `e.boss_id = c.emp_id` 을<br>
`e.id = c.emp_id` 로 작성하면 쿼리가 `무한루프` 에 빠져 실행이 안된다.

왜냐하면, 반복쿼리의 결과도 다시 반복쿼리의 결과로 들어가기 때문임<br>
트리 형태의 끝까지 탐색하며 출력한다. (부하의 부하의 부하의 부하...)

- CTE_QRY 의 결과가 CTE_QRY 에 저장되고,
- CTE_QRY 의 추가된 row 가 CTE_QRY 에 parameter 로 사용됨

```sql
create table employee(
  id int not null primary key,
  name varchar(10) not null,
  boss_id int,
  foreign key (boss_id) references employee(id)
);

insert into employee values
  (1,'Anna',null),
  (2,'Bob',1),
  (3,'Louis',1),
  (4,'Sara',null),
  (5,'Sophie',4),
  (6,'John',2);

-- Postgresql 의 재귀실행 구문
with recursive CTE_QRY(emp_id, emp_name) as (
  -- 한번만 실행됨
  select e.id as emp_id, e.name as emp_name
  from employee e where e.boss_id = 1
  -- 연결되어 출력된다는 의미
  union all
  -- 재귀실행 문장 (CTE_QRY 결과를 param 으로 받아 계속 실행)
  select id, name from CTE_QRY c
  inner join employee e on e.boss_id = c.emp_id
)
-- 최종 출력쿼리 (한번만 실행)
select * from CTE_QRY;
```

참고자료

- [Learn PostgreSQL Recursive Query By Example](https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-recursive-query/)
- [[PostgreSQL] WITH RECURSIVE 구문 - 재귀쿼리, 계층쿼리](https://mine-it-record.tistory.com/447)

### 문제 83

**Right Outer Join**

테이블 Vendor 와 테이블 Purchase 간에 `JOIN` 에 관한 문제

- Vendor 테이블: company_id (PKEY)
- Purchase 테이블: order_id (PKEY), vendor_id (FKEY: Vendor)

두 테이블의 JOIN 결과를 작성하시오.

- 참고자료: [[SQL] INNER JOIN, LEFT JOIN, RIGHT JOIN and FULL JOIN 설명 및 예제](https://leejinseop.tistory.com/m/19)
- 테스트: [DB Fiddle](https://dbfiddle.uk/?rdbms=postgres_11&fiddle=02d5980f39a84a26d36c1dec4da9c19b)

```sql
create table vendor (
  id int not null primary key,
  name varchar(10) not null
);

create table purchase (
  id int not null primary key,
  name varchar(10) not null,
  vendor_id int,
  foreign key (vendor_id) references vendor(id)
);

insert into vendor values
(1,'Anna'),
(2,'Bob'),
(9,'TEST');

insert into purchase values
(3,'Louis',null),
(4,'Sara',null),
(5,'Sophie',1),
(6,'John',2);

-----------------------------------------

select p.*, v.id as v_id
from purchase p
inner join vendor v on v.id = p.vendor_id;

select p.*, v.id as v_id
from purchase p
left join vendor v on v.id = p.vendor_id;

select p.*, v.id as v_id
from purchase p
right join vendor v on v.id = p.vendor_id;

-----------------------------------------

select v.*, p.id as p_id
from vendor v
inner join purchase p on v.id = p.vendor_id;

select v.*, p.id as p_id
from vendor v
left join purchase p on v.id = p.vendor_id;

select v.*, p.id as p_id
from vendor v
right join purchase p on v.id = p.vendor_id;
```

> p `INNER JOIN` v

Purchase 와 Vendor 가 동등하게 매칭되어 출력 (rows=2)

| id  | name   | vendor_id | v_id |
| --- | ------ | --------- | ---- |
| 5   | Sophie | 1         | 1    |
| 6   | John   | 2         | 2    |

> p `LEFT OUTER JOIN` v

Purchase 테이블을 기준으로 Vendor 에 null 출력 (rows=4)

| id  | name   | vendor_id | v_id   |
| --- | ------ | --------- | ------ |
| 3   | Louis  | `null`    | `null` |
| 4   | Sara   | `null`    | `null` |
| 5   | Sophie | 1         | 1      |
| 6   | John   | 2         | 2      |

> p `RIGHT OUTER JOIN` v

Vendor 테이블을 기준으로 Purchase 에 null 출력 (rows=3)

| id     | name   | vendor_id | v_id |
| ------ | ------ | --------- | ---- |
| 5      | Sophie | 1         | 1    |
| 6      | John   | 2         | 2    |
| `null` | `null` | `null`    | 9    |

---

> v `INNER JOIN` p

동일한 결과

| id  | name | p_id |
| --- | ---- | ---- |
| 1   | Anna | 5    |
| 2   | Bob  | 6    |

> v `LEFT OUTER JOIN` p

Vendor 테이블을 기준으로 Purchase 에 null 출력 (rows=3)

| id  | name | p_id   |
| --- | ---- | ------ |
| 1   | Anna | 5      |
| 2   | Bob  | 6      |
| 9   | TEST | `null` |

> p `RIGHT OUTER JOIN` v

Purchase 테이블을 기준으로 Vendor 에 null 출력 (rows=4)

| id     | name   | p_id |
| ------ | ------ | ---- |
| `null` | `null` | 3    |
| `null` | `null` | 4    |
| 1      | Anna   | 5    |
| 2      | Bob    | 6    |

### 문제 84

정렬 알고리즘 시간복잡도

- 단순(구현 간단)하지만 비효율적인 방법
  - 삽입 정렬, 선택 정렬, 버블 정렬
- 복잡하지만 효율적인 방법
  - 퀵 정렬, 힙 정렬, 합병 정렬, 기수 정렬

![정렬 시간복잡도 비교표](https://gmlwjd9405.github.io/images/algorithm-merge-sort/sort-time-complexity.png){: width="540" .w-75}

합병 정렬(merge sort) 알고리즘의 특징

- 단점
  - 만약 레코드를 배열(Array)로 구성하면, 임시 배열이 필요하다.
  - 제자리 정렬(in-place sorting)이 아니다.
  - 레크드들의 크기가 큰 경우에는 이동 횟수가 많으므로 매우 큰 시간적 낭비를 초래한다.
- 장점
  - 안정적인 정렬 방법
  - 데이터의 분포에 영향을 덜 받는다. 즉, 입력 데이터가 무엇이든 간에 정렬되는 시간은 동일하다. (O(nlog₂n)로 동일)

참고자료

- [[알고리즘] 합병 정렬(merge sort)이란](https://gmlwjd9405.github.io/2018/05/08/algorithm-merge-sort.html)

### 문제 85

[쿠키(Cookie)와 세션(Session)](https://gxnzi.tistory.com/50)

- 쿠키는 클라이언트에 저장되고, 세션은 서버에 저장된다. (저장위치)

**쿠키(Cookie) 란?**

클라이언트에 저장되는 키와 값이 들어있는 작은 데이터 파일 (텍스트 형식)

- 쿠키의 특징
  - 서버 측에서 클라이언트 측에 상태 정보를 저장하고 추출할 수 있는 메커니즘
  - 이름, 값, 저장 기간 (쿠키 만료 기간), 경로 정보가 들어있다
  - 일정 시간 동안 데이터를 저장할 수 있어서 로그인 상태를 유지
  - HTTP에서 클라이언트의 상태 정보를 클라이언트의 하드 디스크에 저장하였다가 필요할 때 참조, 재사용한다
  - 쿠키 저장 시 종료 시점을 설정하고 설정하지 않으면 브라우저 종료 시 소멸)
- 쿠키의 사용 예
  - 방문했던 사이트에 재 방문 시, 아이디와 비밀번호 자동 입력
  - 팝업 '(기간) 동안 이 창을 다시 보지 않음' 체크
- 쿠키의 제약 조건
  - 클라이언트에 총 300개까지 저장할 수 있다.
  - 하나의 도메인 당 20개의 값만 가질 수 있다.
    - 20개 초과시 가장 적게 참조된 쿠키가 지워진다
    - [모든 서브 도메인은 도메인 하나로 취급](https://choichumji.tistory.com/140), ex) `.example.com`
  - 하나의 쿠키 값은 4096 Byte까지 저장 가능하다.

**세션(Session) 이란?**

클라이언트가 웹서버에 Request를 보내면, 해당 서버의 엔진이 클라이언트에게 유일한 ID를 부여하는데, 이 ID를 세션이라고 부른다. 이 ID는 쿠키를 사용하여 유지되며, 이 쿠키의 이름이 `JSESSIONID` 이다.

- 세션의 특징
  - 클라이언트와 웹서버 간 네트워크 연결이 지속 유지되고 있는 상태를 말한다
    - (브라우저를 열어 서버에 접속한 뒤 접속을 종료할 때까지)
  - `JSESSIONID` 를 웹 브라우저에 전달하고,
    - 클라이언트는 새로운 접속시 쿠키를 통해서 세션 ID 값을 서버에 전달한다.
- 세션의 사용 예
  - 로그인과 같이 보안상 중요한 작업

### 문제 86

삭제 코드(0)와 숫자값을 입력받아 합계를 출력

- 입력값 설명
  - 첫번째 입력값은 입력하는 숫자의 개수 N
  - 이후 N 개 만큼의 입력값
- 문제 조건
  - '0'이 나오면 직전의 입력값을 하나 제외 (잘못 입력된 값이란 뜻)
  - 모든 입력이 끝나면 합계를 출력

> 내가 제출한 코드

난이도는 쉬운데, `구름level` 의 문제들은 메모리와 수행시간도 체크한다.<br>
출제자 의도에 따라 최적화된 코드를 작성해야 통과되는 문제가 더러 있다.

- 처음에는 모두 배열에 push 또는 pop 한 후에 sum 으로 합계를 출력
- 이후 데이터가 커지는 것을 감안해, total 을 동시에 계산하도록 수정

```python
# -*- coding: utf-8 -*-
# UTF-8 encoding when using korean

lines = [
	"7",
	"10","20","0","94","38","29","0",	# ==> 142

	# "10",
	# "1","3","5","4","0","0","7","0","0","6",  # ==> 7
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))


# 1 <= K <= 100000
K = int(input())

# 값이 많으니 바로바로 계산하자
total = 0
buffer = []
for i in range(K):
	v_str = input()

	# '0'이 연거퍼 두세번 나올 수도 있음
	if v_str == '0':
		prev_v = buffer.pop()
		total -= prev_v
	else:
		v = int(v_str)
		buffer.append( v )
		total += v
	print(total, '==>', buffer)

# 입력 받으면서 계산된 total 을 바로 출력
print(total)
"""
10 ==> [10]
30 ==> [10, 20]
10 ==> [10]
104 ==> [10, 94]
142 ==> [10, 94, 38]
171 ==> [10, 94, 38, 29]
142 ==> [10, 94, 38]
142
"""
```

### 문제 87

가방에 물건을 부피에 맞도록 하나씩 넣는 문제이다.<br>
가방에 모두 배정할 수 있으면 YES, 아니면 NO 를 출력한다.

- 입력값 설명
  - 첫줄은 가방 N 개와 물건 M 개
  - 둘째줄은 가방 N 개의 부피에 대한 값
  - 셋째줄은 물건 M 개의 부피에 대한 값
- 문제 조건
  - 모든 가방에 선물이 하나 이상 주어질 수 있는지 판별
  - 물건의 부피가 크면 작은 가방에 들어갈 수 없다

> 내가 제출한 코드

부피가 큰 물건을 먼저 처리하는 것이 손쉬워서 정렬후 배정하기로 함

- 입력값이 클 수 있어서 heapq 로 입력하면서 정렬되도록 함
- 큰 부피가 앞에 오도록 `-1` 로 음수를 만들어 정렬함
- 가방에 넣을 수 없는 물건은 건너뛰기 하면서 배정
- 물건이 더이상 없어서 가방이 남으면 NO 출력, 반대의 경우에는 YES

처음에는 모든 가방에 모든 물건을 넣는 것인줄 알고 오래 헤맸다.<br>
그러다 예제를 통해 물건이 남는 것은 상관없다는 것을 알아챘다.<br>
2시간반 넘게 걸렸다. 문제좀 잘 읽자.

```python
# -*- coding: utf-8 -*-
# UTF-8 encoding when using korean

lines = [
"5 6","5 3 2 4 1","4 1 4 1 4 1"		# YES
#"5 6","5 3 2 4 1","4 1 4 4 1 4",""		# NO
]
from functools import partial
input = partial(lambda x: next(x), iter(lines))


import heapq

# 역순 정렬해서 가져오기
def read_nums(arr, data):
	size = 0
	v_str = ''
	for i in range(len(data)):
		if data[i] == ' ' and v_str:
			heapq.heappush(arr, -1*int(v_str) )
			v_str = ''
			size += 1
		else:
			v_str += data[i]
	# one more
	if v_str:
		heapq.heappush(arr, -1*int(v_str) )
		size += 1
	return size


# input
# ==================
# 1 <= N,M <= 100000
N, M = [ int(x) for x in input().split() ]
# 선물 개수가 적으면 무조건 NO
if M < N:
	print('NO')
	exit()

bags = []
size = read_nums(bags, input())

items = []
size = read_nums(items, input())

# main
# ==================
diff_cnt = M - N

while len(bags):
	# 둘다 꺼내기
	b_size = -1*heapq.heappop(bags)
	p_size = -1*heapq.heappop(items)

	# 가방에 들어가지 못하는 선물을 만나면
	while len(items) and b_size < p_size:
		# 선물이 들어갈 수 있는 지점까지 이동
		p_size = -1*heapq.heappop(items)
		diff_cnt -= 1

	# 선물이 다 떨어진 경우, NO!
	if len(items) == 0:
		break


# 출력
# ==================
# 모든 가방에 대해 짝을 맞출 수 있으면 된다.
if len(bags) == 0:
	print('YES')
else:
	print('NO')

# print('\n'+'--'*20)
# print('diff_cnt:', diff_cnt)
# print('bags:', bags)
# print('items:', items)
"""
True [-5, -4, -2, -3, -1]
True [-4, -4, -4, -1, -1, -1]

5 4 ||==> [-4, -3, -2, -1] [-4, -4, -1, -1, -1]
4 4 ||==> [-3, -1, -2] [-4, -1, -1, -1]
3 4 ||==> [-2, -1] [-1, -1, -1]
3 1 ##==> [-2, -1] [-1, -1]
2 1 ||==> [-1] [-1]
1 1 ||==> [] []
YES

----------------------------------------
True [-5, -4, -2, -3, -1]
True [-4, -4, -4, -1, -1, -4]

5 4 ||==> [-4, -3, -2, -1] [-4, -4, -4, -1, -1]
4 4 ||==> [-3, -1, -2] [-4, -4, -1, -1]
3 4 ||==> [-2, -1] [-4, -1, -1]
3 4 ##==> [-2, -1] [-1, -1]
3 1 ##==> [-2, -1] [-1]
2 1 ||==> [-1] []
NO

"""
```

---

### 문제 88

[COS PRO 1급 기출문제 - Python](https://edu.goorm.io/lecture/17299/cos-pro-1%EA%B8%89-%EA%B8%B0%EC%B6%9C%EB%AC%B8%EC%A0%9C-python)

[COS PRO 1급 Python 모의고사](https://programmers.co.kr/learn/courses/11133/)

```python

```

### 문제 89

[COS PRO 2급 기출문제 - Python](https://edu.goorm.io/lecture/17033/cos-pro-2%EA%B8%89-%EA%B8%B0%EC%B6%9C%EB%AC%B8%EC%A0%9C-python)

```python

```

### 문제 90

[COS PRO 2급 기출문제 - Python](https://edu.goorm.io/lecture/17033/cos-pro-2%EA%B8%89-%EA%B8%B0%EC%B6%9C%EB%AC%B8%EC%A0%9C-python)

```python

```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
