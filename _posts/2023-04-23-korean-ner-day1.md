---
date: 2023-04-23 00:00:00 +0900
title: 한국어 개체명인식 공부하기 - 1일차
description: 개체명을 가중치로 이용하여 검색 서비스의 성능을 향상시킬 수 있습니다. 이를 위해 한국어 개체명 인식에 대해 공부합니다.
categories: [AI, NLP]
tags: ["토크나이징", "ner", "명사추출", "entity", "자연어처리"]
image: "https://www.pragnakalp.com/wp-content/uploads/2020/03/bert-based-named-entity-recognition-ner-1536x804.jpg"
---

## 1. 형태소 분석기 macab 설치

허깅페이스의 수많은 모델들을 살피기에 앞서 베이스 모델로 mecab 를 사용하고자 합니다. mecab 도 패턴 매칭으로 품사를 분류하고, 사용자 사전을 통해 단어와 태그를 추가할 수 있습니다.

### 1) mecab-ko 및 mecab-ko-dic 설치

두개의 모듈을 설치하여야 한다. 하나는 mecab 분석기, 또 하나는 mecab 사전이다.

- [mecab-ko 다운로드](https://bitbucket.org/eunjeon/mecab-ko/downloads)
- [mecab-ko-dic 다운로드](https://bitbucket.org/eunjeon/mecab-ko-dic/downloads)

인텔 버전 Mac Mini 대상으로 다음과 같이 설치했다.

```console
# mecab-ko 설치
$ wget "https://bitbucket.org/eunjeon/mecab-ko/downloads/mecab-0.996-ko-0.9.2.tar.gz"
$ tar xvfz mecab-0.996-ko-0.9.2.tar.gz
$ cd mecab-0.996-ko-0.9.2
$ ./configure 
$ make
$ make check
$ sudo make install

# shared libraries 오류 발생시 ldconfig 리로드
$ mecab --version
mecab: error while loading shared libraries: libmecab.so.2: cannot open shared object file: No such file or directory
$ sudo ldconfig

# 확인
$ mecab --version
mecab of 0.996/ko-0.9.2

# mecab-ko-dic 설치
$ wget "https://bitbucket.org/eunjeon/mecab-ko-dic/downloads/mecab-ko-dic-2.1.1-20180720.tar.gz"
$ tar xvfz mecab-ko-dic-2.1.1-20180720.tar.gz
$ cd mecab-ko-dic-2.1.1-20180720
$ ./autogen.sh
$ ./configure 
$ make
$ sudo make install

# 테스트 (-d 는 사전위치 옵션: 없어도 됨)
$ echo '설치가 완료되었습니다.' | mecab -d /usr/local/lib/mecab/dic/mecab-ko-dic
설치  NNG,행위,F,설치,*,*,*,*
가  JKS,*,F,가,*,*,*,*
완료  NNG,행위,F,완료,*,*,*,*
되  XSV,*,F,되,*,*,*,*
었  EP,*,T,었,*,*,*,*
습니다  EF,*,F,습니다,*,*,*,*
.  SF,*,*,*,*,*,*,*
EOS
```

원문 링크: [mecab-ko-dic 품사 태그 설명](https://docs.google.com/spreadsheet/ccc?key=0ApcJghR6UMXxdEdURGY2YzIwb3dSZ290RFpSaUkzZ0E&usp=sharing)

![mecab 사전 품사 태그](/2023/03/23-mecab-ko-dic_tags.png){: width="600" .w-75}
_mecab 사전 품사 태그_

### 2) ...

## 2. 개체명인식

> 참고자료

- ['한국어 임베딩' 저자의 NER 관련 포스트](https://ratsgo.github.io/nlpbook/docs/ner/train/)


## 9. Review

- 작성하다 말았음. 다시 살펴보긴 해야 하는데

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }