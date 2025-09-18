---
date: 2022-08-18 00:00:00 +0900
title: FastAPI 예제로 파이썬 패키지 관리도구 비교
description: 오래된 습관같은 `pip+venv` 대신에 `poetry` 를 비롯한 새로운 관리도구들을 알아보겠습니다.
categories: [Language, Python]
tags: [venv, pip, pipenv, poetry]
image: https://d33wubrfki0l68.cloudfront.net/e5bef992cd67b65cf04372ce4802620989c02ccd/4d1dc/static/images/blog/poetry.png
---

## 파이썬 패키지 관리 (PyPA)

파이썬은 사용하기 편리한 크로스플랫폼 개발언어이지만, 다양한 머신과 운영체제 등의 호환성을 맞추기 위해 파이썬 기본 패키지와 의존 패키지들에 대한 개발환경 구성이 쉽지는 않다. 조금 오래된 소스들을 다시 돌려보려면 의존 패키지가 설치 과정에서 버전 충돌로 오류를 뱉고 중단된다던지, 새 버전이 설치되면서 오작동 하는 등의 문제가 발생한다.

파이썬과 함께 설치되는 기본 패키지 관리자인 [pip](https://pip.pypa.io/en/stable/)의 한계 때문인데, 이를 해결하기 위해 다양한 패키지 관리도구들이 나오고 있다.

- [파이썬 소스 배포 포맷](https://packaging.python.org/en/latest/specifications/source-distribution-format/): `requirements.txt` 에서 `pyproject.toml` 로 바뀌었다.
  - `pipenv` 는 [Pipfile](https://realpython.com/pipenv-guide/#the-pipfile) 이름의 구성파일 사용하지만, `toml` 포맷이다.
  - 요약된 의존성 파일(Pipfile, pyproject.toml)과 구체적인 `lock` 파일(Pipfile.lock, poetry.lock)로 나눠진다.
  - [파이썬 바이너리 배포 포맷](https://packaging.python.org/en/latest/specifications/binary-distribution-format/): `wheel` 포맷
    <br/>&nbsp;
- 가장 확실한 방법은 `Docker image`로 배포하는 것일지도 모른다. 그러면 추가 기능을 못만들겠지. `Docker`는 배포 테스트를 위한 목적이 더 크다.
  - [pipx](https://github.com/pypa/pipx) 가 비슷한 개념으로 의존 패키지마다 venv 를 구성해 충돌은 해결한다더라는. 때문에 소스 배포가 아니라 애플리케이션 배포에만 쓴다고.

#### 참고자료

- [Packaging in Python: Tools and Formats](https://towardsdatascience.com/packaging-in-python-tools-and-formats-743ead5f39ee): 패키징 관리 9가지 문제점에 대한 16가지 솔루션
- [프로젝트가 진행중인 여러 패키징 도구들](https://packaging.python.org/en/latest/key_projects/)

### 기본 패키지 관리도구

#### conda

![conda-log](https://miro.medium.com/max/1400/1*-_SPidVy1TiaCqhSv7-8Rw.png){: width="600" .w-75} <br />&nbsp;

대표적으로, 지금도 많이 쓰이는 [conda](https://docs.conda.io/en/latest/)가 있다. 다음과 같은 역활을 한다.

- 격리된 가상환경(venv)의 생성/제거와 관리
  - 특정 버전의 python 설치
    - 패키지 채널에 대한 설정: default, conda-forge, miniforge3
  - 의존성(dependency) 패키지들의 설치와 관리
- 사용된 가상환경의 보존(freeze)과 배포
  - 설치된 의존성 패키지들의 설치 정보 추출
  - 동일 환경으로 가상환경 재생성(복제)

#### mamba

![mamba-log](https://github.com/mamba-org/mamba/blob/master/docs/assets/mamba_header.png?raw=true){: width="600" .w-75} <br />&nbsp;

(anaconda.com 소유의) `conda` 의 대안으로 [mamba](https://github.com/mamba-org/mamba) 가 있다.

- conda 를 `C++`로 다시 개발한 버전 (더 빠른 크로스플랫폼 패키지 관리자)
  - 병렬로 다운로드를 수행하기 때문에 더 빠르다. (conda도 한번 받고나면 빠르다)
  - 참고: [mamba documentation](https://mamba.readthedocs.io/en/latest/index.html)
- `miniconda`에 대응하는 `micromaba`도 있다.

#### 참고사항

> anaconda 와 miniconda

참고: [미니콘다 vs 아나콘다](https://velog.io/@ash3767/%EB%AF%B8%EB%8B%88%EC%BD%98%EB%8B%A4-vs-%EC%95%84%EB%82%98%EC%BD%98%EB%8B%A4)

- anaconda: 720개 이상의 주요 패키지를 한꺼번에 자동 설치하는 관리도구
  - 패키지 제공 채널과 함께 anaconda.com 의 상용 라이센스 적용
  - 용량이 커 무겁다. 입문할 때 사용해보고, 숙달된 후에는 안쓴다.
- miniconda: 필수 패키지만 갖춘 작은 관리도구
  - 필요한 패키지는 conda-forge 채널에서 수동으로 설치
  - miniforge3 설치시 함께 설치된다: `{miniforge_dir}/base/condabin/conda`

> conda-forge 와 miniforge3

커뮤니티에 의해 관리되는 패키지 레시피, 빌드와 배포의 리포지토리 채널

- [conda-forge](https://anaconda.org/conda-forge/repo)가 기본 채널
  - 커뮤니티 주도이기 때문에 채널 인프라 운용은 anaconda.com 에 의존하고 있음
  - 참고: [블로그 - 'anaconda.com' 약관(TOS) 변경에 대한 입장](https://conda-forge.org/blog/posts/anaconda-tos/)
- [miniforge3](https://github.com/conda-forge/miniforge#miniforge3)는 `apple silicon` (`==aarch64`, `==arm64`) 지원을 위해 결성된 커뮤니티에 의해 운영되는 채널
  - 숫자 `3`이 무엇을 의미하는지 찾지 못했지만, `python3` 전용이라는 뜻인듯 싶다 (`python3.9`를 version base로 사용중)
  - 라즈베리파이(`arm64`)용 패키지들도 지원한다

### pip 를 대체하려고 검토한 패키지 관리도구들

Apple M1 맥북을 기준으로 작성합니다.

- `brew` 로 다 설치할 수 있다. (`brew`님이 있어서 다행입니다)

#### 기존 개발환경: pyenv + pip + venv

> [pyenv](https://github.com/pyenv/pyenv) <== **필수!!**

- `brew` 는 update 과정에서 minor 버전이 변동되어 의존 패키지들을 손실한다.
- `pyenv install`로 여러 파이썬 버전을 설치하고, 선택적으로 변경하여 사용
  - **[주의!!]** `brew` 설치 버전과 `pyenv` 설치 버전이 _서로 달라야한다._
  - 예) brew 버전으로 3.9.13 있고, pyenv 버전으로 동일 버전이 있으면 다른 패키지 관리자들이 brew 설치버전을 잡아서 사용하게 됨

> [pip](https://pip.pypa.io/en/stable/)

- [requirements.txt 포맷](https://pip.pypa.io/en/stable/reference/requirement-specifiers/#requirement-specifiers)

> [venv](https://docs.python.org/3/library/venv.html)

```shell
$ python3 -m venv ./venv
```

#### pyenv

#### poetry

```shell
# brew 로 설치하지 말자!! 최신 python 경로로 고정됨
$ pip install poetry

$ sudo vi /opt/homebrew/bin/poetry
---------------------------------
#!/usr/bin/env python       <== 환경변수 받도록 수정!!
# -*- coding: utf-8 -*-
import re
import sys
from poetry.console import main
if __name__ == '__main__':
    sys.argv[0] = re.sub(r'(-script\.pyw|\.exe)?$', '', sys.argv[0])
    sys.exit(main())


# DELETED!!
#!/opt/homebrew/Cellar/poetry/1.1.14/libexec/bin/python3.10
---------------------------------

# pyenv 에 의해 조정되는 python 위치를 PYTHONPATH 로 설정
$ PYTHONPATH=/Users/bgmin/.pyenv/shims/python whereis python

$ alias poetry="PYTHONPATH=/Users/bgmin/.pyenv/shims/python /opt/homebrew/bin/poetry"

$ 일단 app 으로 project 생성
poetry new app && cd app

```

## 9. Review

- 패키지 관리자는 개발 환경과 밀접한 관계를 가진다. 환경을 정립하자.
  + 익숙해질 때까지 시간이 필요하다. 
- 최근 poetry 가 1.2 를 릴리즈 했는데, 큰 변경사항이 있다. 
  + 실행시 사용할 python 을 내장하는 방식으로 설치하길 권장하고
  + `self update` 로 업데이트 방법을 제공 (자꾸 설치 이슈가 생겨서인듯)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
