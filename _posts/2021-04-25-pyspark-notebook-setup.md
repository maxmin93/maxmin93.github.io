---
date: 2021-04-25 00:00:00 +0900
title: Jupyter notebook 과 pyspark 연동 설정
description: 데이터 분석을 위한 작업 환경을 개선하려고 주피터 노트북에 PySpark 를 연동한 작업을 기록합니다.
categories: [Backend, Analysis]
tags: [jupyter, pyspark]
image: https://miro.medium.com/max/698/1*h7xQUkvB_dyJKpJ3EP_TvA.jpeg
---

## 사전 작업

- spark 설치 및 pyspark shell 테스트
- ipython 설치 및 jupyter notebook 실행 테스트

## 참고 자료

- [Jupyter(IPython) 에서 pyspark 사용하기](https://ggoals.tistory.com/67)
- [Pyspark Shell과 Jupyter notebook 연동하기](https://joonyon.tistory.com/32)
- [How to install PySpark and Jupyter Notebook in 3 Minutes](https://www.sicara.ai/blog/2017-05-02-get-started-pyspark-jupyter-notebook-3-minutes)
- [Jupyter Notebook 실행시 토큰을 입력하라고 나옵니다](https://financedata.github.io/posts/jupyter-notebook-authentication.html)

## 작업 순서

1. ipython profile 생성
2. ipython_config.py 수정
3. ipython password 생성 및 설정
4. jupyter notebook 테스트
5. ipykernel 설치 및 환경 생성
6. kernel.json 수정
7. jupyter notebook 테스트 (spark 연동)
8. alias 등록

## ipython profile 설정 (1~4단계)

### ipython profile 생성

```shell
$ ipython profile create pyspark

# ~/.ipython/ 밑에 profile 생성됨
```

### ipython_config.py 수정

```shell
$ vi ~/.ipython/profile_pyspark/ipython_config.py

# 추가
#
c.NotebookApp.ip = '*'
c.NotebookApp.open_browser = False
c.NotebookApp.port = 29292
c.NotebookApp.notebook_dir = '/Users/bgmin/Workspaces/notebook'

# 패스워드 암호화 값은 다음 절 내용 참조
c.NotebookApp.password = 'sha1:**************************'
```

### ipython password 생성 및 설정

패스워드 설정이 없으면 ipython 실행시마다 Token 과 암호를 묻게된다.

```shell
$ ipython
In [1]: from IPython.lib import passwd

In [2]: passwd()
Enter password:         # 패스워드
Verify password:        # 재입력
Out[2]: 'sha1:****************************'

In [3]:
Do you really want to exit ([y]/n)? y
```

![패스워드 생성 화면](/2021/04/ipython_password_sha1.png){: width="540"}
_&lt;그림&gt; 패스워드 생성 화면_

### jupyter notebook 테스트

```shell
$ ipython notebook --config='~/.ipython/profile_pyspark/ipython_config.py'

# browser 에서 새 노트 생성 후 파이썬 테스트
```

![노트북 콘솔 화면](/2021/04/ipython_notebook_console_pyspark.png){: width="540"}
_&lt;그림&gt; 노트북 콘솔 화면_

![노트북 실행 화면](/2021/04/ipython_notebook_browser_pyspark.png){: width="540"}
_&lt;그림&gt; 노트북 실행 화면_

## ipython profile 설정 (5~7단계)

### ipykernel 설치 및 환경 생성

```shell
$ pip install ipykernel

# 환경설정 생성: pyspark
$ python -m ipykernel install --user --name=pyspark

# ~/Library/Jupyter/kernels/ 밑에 생성 (MacOS)
# - 기본적인 내용이 포함된 kernel.json 생성됨
```

### kernel.json 수정

```shell
$ vi ~/Library/Jupyter/kernels/pyspark/kernel.json

# 작성
# - {connection_file} 는 작성 항목 아님. 그대로 놔두면 됨
# - "env" 아래에 pyspark 연동을 위한 환경변수를 설정한다
{
  "display_name": "pyspark",
  "language": "python",
  "argv": [
    "/usr/local/bin/python3",
    "-m",
    "ipykernel",
    "-f",
    "{connection_file}"
  ],
  "env": {
    "SPARK_HOME": "/Users/bgmin/Servers/spark",
    "PYTHONPATH": "/Users/bgmin/Servers/spark/python/:/Users/bgmin/Servers/spark/python/lib/py4j-0.10.7-src.zip:/Users/bgmin/Servers/spark/python/lib/pyspark.zip",
    "PYSPARK_PYTHON": "/home/bgmin/.pyenv/shims/python3.7",
    "PYSPARK_DRIVER_PYTHON": "jupyter",
    "PYSPARK_DRIVER_PYTHON_OPTS": "notebook",
    "PYTHONSTARTUP": "/Users/bgmin/Servers/spark/python/pyspark/shell.py",
    "PYSPARK_SUBMIT_ARGS": "--master=spark://******:7077 --name 'pyspark.jupyter' --deploy-mode client pyspark-shell"
  }
}
```

### jupyter notebook 테스트 (spark 연동)

ipykernel 을 이용해 pyspark 연동을 설정했기 때문에, <br>
실행시 자동으로 spark, sc 변수가 포함된다. (findspark 안해도 됨)

```python
print(spark.version)
# >>> 2.4.7
```

![pyspark 실행 화면](/2021/04/ipython_pyspark-test.png){: width="540"}
_&lt;그림&gt; pyspark 실행 화면_

### alias 설정

```shell
# 편리하라고 등록: ~/.zshrc
alias pyspark-notebook="ipython notebook --config='~/.ipython/profile_pyspark/  ipython_config.py'"
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
