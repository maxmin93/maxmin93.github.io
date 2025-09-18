---
date: 2022-10-09 00:00:00 +0900
title: PyArrow vs Pandas - CSV 읽기 쓰기 성능 비교
description: PyArrow 와 Pandas 의 CSV 읽기 쓰기 속도를 비교합니다. (유튜브 강좌 따라하기)
categories: [Language, Python]
tags: [benchmark, pyarrow, pandas]
image: "/2022/10/09-pyarrow-vs-pandas-csv-read-crunch.png"
---

## 1. PyArrow

`import pyarrow.csv as csv`

- [csv.read_csv](https://arrow.apache.org/docs/python/generated/pyarrow.csv.read_csv.html)
- [csv.write_csv](https://arrow.apache.org/docs/python/generated/pyarrow.csv.write_csv.html)

## 2. PyArrow vs. Pandas : CSV 읽기 쓰기 시간 측정

출처: [PyArrow vs. Pandas for managing CSV files - How to Speed Up Data Loading](https://www.youtube.com/watch?v=gFd4I1oXG8E)

- 작성자: [BetterDataScience](https://www.youtube.com/c/BetterDataScience)

### 1) 준비

```python
import random
import string
import numpy as np
import pandas as pd
import pyarrow as pa
import pyarrow.csv as csv
from datetime import datetime

def gen_random_string(length: int = 32) -> str:
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

gen_random_string()
# ==> 'K46RG2R07MLZCO94PMFBQ1Q2GDJE2WFE'

dt = pd.date_range(start=datetime(2000,1,1), end=datetime(2021,1,1), freq='min')
dt[:10]
# ==> 
# DatetimeIndex(['2000-01-01 00:00:00', '2000-01-01 00:01:00',
#                '2000-01-01 00:02:00', '2000-01-01 00:03:00',
#                '2000-01-01 00:04:00', '2000-01-01 00:05:00',
#                '2000-01-01 00:06:00', '2000-01-01 00:07:00',
#                '2000-01-01 00:08:00', '2000-01-01 00:09:00'],
#               dtype='datetime64[ns]', freq='T')

%%time

np.random.seed = 42
df_size = len(dt)
# ==> 11046241

%%time

df = pd.DataFrame({
    'date': dt,
    'a': np.random.rand(df_size),
    'b': np.random.rand(df_size),
    'c': np.random.rand(df_size),
    'd': np.random.rand(df_size),
    'e': np.random.rand(df_size),
    'str1': [gen_random_string() for x in range(df_size)],
    'str2': [gen_random_string() for x in range(df_size)]
})

df.head()
# ==> shape (11046241, 8)

#                  date         a         b         c         d         e  \
# 0 2000-01-01 00:00:00  0.673229  0.000314  0.087757  0.062980  0.407930   
# 1 2000-01-01 00:01:00  0.036759  0.775502  0.740333  0.093106  0.854366   
# 2 2000-01-01 00:02:00  0.767371  0.938403  0.903407  0.486610  0.976815   
# 3 2000-01-01 00:03:00  0.463437  0.661311  0.695746  0.543487  0.539629   
# 4 2000-01-01 00:04:00  0.692024  0.853330  0.098762  0.303125  0.199427   
#                                str1                              str2  
# 0  3Q0OXWM88JVSGHWP8YNE85VJ7A5FSVCD  TZMB94OPLZMN5H0T8Z587DSWX4LV4SQP  
# 1  RHGFUMXXE37R8V6E8635BZ7D0MXD1NYU  WFKQYOYE6HX523DX5OS052NTX5FAGVIG  
# 2  P8GUK7XAAA18K75B83O83YYAL4VSNF1F  3BI8Q4IHNV2SIOU352LSFLZ44FSQSBQ0  
# 3  8YRSAJCLRQKFXY9H81GXTG5AOMPDM52B  8NLQMMUL0GO5CVA7W8819C3VBBZ5M4JZ  
# 4  8HOX5CK95685XSFKXRRVSGRO5IOG9YD8  RC2YRDZXIQSWQ8FJ1WPZSTH3TCCKSM92  
```

### 2) Pandas : CSV 읽기 쓰기

```python
%%time
# CPU times: user 54.2 s, sys: 1.66 s, total: 55.8 s Wall time: 56 s

df.to_csv('temp/csv_pandas.csv', index=False)

%%time
# CPU times: user 2min 59s, sys: 1.41 s, total: 3min Wall time: 3min 1s

df.to_csv('temp/csv_pandas.csv.gz', index=False, compression='gzip')

%%time
# CPU times: user 13.4 s, sys: 804 ms, total: 14.2 s Wall time: 14.2 s

df1 = pd.read_csv('temp/csv_pandas.csv')

%%time
# CPU times: user 20.8 s, sys: 966 ms, total: 21.8 s Wall time: 21.8 s

df2 = pd.read_csv('temp/csv_pandas.csv.gz')
```

### 3) PyArrow : CSV 읽기 쓰기

```python
%%time
# CPU times: user 5.76 s, sys: 271 ms, total: 6.03 s Wall time: 6.04 s

csv.write_csv(df_pa_table, 'temp/csv_pyarrow.csv')

%%time
# CPU times: user 1min 21s, sys: 502 ms, total: 1min 22s Wall time: 1min 22s

with pa.CompressedOutputStream('temp/csv_pyarrow.csv.gz', 'gzip') as out:
    csv.write_csv(df_pa_table, out)

%%time
# CPU times: user 2.54 s, sys: 1.47 s, total: 4.01 s Wall time: 1.1 s

df_pa_1 = csv.read_csv('temp/csv_pyarrow.csv')

%%time
# CPU times: user 9.1 s, sys: 565 ms, total: 9.67 s Wall time: 7.05 s

df_pa_2 = csv.read_csv('temp/csv_pyarrow.csv.gz')
```

#### Pandas DataFrame 을 pyarrow Table 로 변환

- Date 타입을 정수형 `np.int64` 로 변환
- from_pandas 로 df 를 pa_table 로 생성

```python
df_pa = df.copy()
df_pa['date'] = df_pa['date'].values.astype(np.int64) // 10 ** 9

%%time
# CPU times: user 476 ms, sys: 184 ms, total: 660 ms Wall time: 529 ms

df_pa_table = pa.Table.from_pandas(df_pa)
```

#### pyarrow Table 을 Pandas DataFrame 으로 변환

- to_pandas 로 DataFrame 을 변환

```python
df_pa_1.schema
# ==>
# date: int64
# a: double
# b: double
# c: double
# d: double
# e: double
# str1: string
# str2: string

%%time
# CPU times: user 2.88 s, sys: 1.49 s, total: 4.38 s Wall time: 5.13 s

df_pd_1 = df_pa_1.to_pandas()
```

## 3. PyArrow vs. Pandas : CSV 읽기 쓰기 성능 비교

### 1) CSV 쓰기 성능 비교

![CSV 쓰기 성능 비교](/2022/10/09-pyarrow-vs-pandas-csv-write-crunch.png){: width="580" .w-75}

```python
import matplotlib.pyplot as plt

write_values = [56, 181, 6.04, 82]

mesures = ['Pandas Write (CSV)','Pandas Write(CSV.GZ)','PyArrow Write(CSV)','PyArrow Write(CSV.GZ)']

fig = plt.figure(figsize=(10, 4))

# creating the bar plot
ax = plt.barh(mesures, write_values, color='maroon')
plt.bar_label(ax, label_type='edge', padding=5, fmt='%.1f sec')

# plt.xlabel("Courses offered")
# plt.ylabel("No. of students enrolled")
plt.title("Pandas vs. PyArrow | Write time in seconds")
plt.grid(axis='x', color='black', linestyle='-.')
plt.grid(axis='y')
#plt.show()
plt.savefig('temp/09-pyarrow-vs-pandas-csv-write.png')
```

### 2) CSV 읽기 성능 비교

![CSV 읽기 성능 비교](/2022/10/09-pyarrow-vs-pandas-csv-read-crunch.png){: width="580" .w-75}

```python
import matplotlib.pyplot as plt

read_values  = [14.2, 21.8, 1.1, 7.05]

mesures = ['Pandas Read(CSV)','Pandas Read(CSV.GZ)','PyArrow Read(CSV)','PyArrow Read(CSV.GZ)']

fig = plt.figure(figsize=(10, 4))

# creating the bar plot
ax = plt.barh(mesures, read_values, color='maroon')
plt.bar_label(ax, label_type='edge', padding=5, fmt='%.1f sec')

# plt.xlabel("Courses offered")
# plt.ylabel("No. of students enrolled")
plt.title("Pandas vs. PyArrow | Write time in seconds")
plt.grid(axis='x', color='black', linestyle='-.')
plt.grid(axis='y')
#plt.show()
plt.savefig('temp/09-pyarrow-vs-pandas-csv-read.png')
```

## 9. Review

- Pandas 외에 PyArrow 를 익히자.
- Spark 없이 대량의 데이터를 가공할 때에는 PyArrow 가 유용하다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }