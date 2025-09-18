---
date: 2023-04-28 00:00:00 +0900
title: OpenAI - GPT 공부하기
description: OpenAI 의 GPT-3.5 turbo 활용 방법을 공부합니다. 음성 파일에서 스크립트를 추출하는 방법도 살펴봅니다.
categories: [AI, Generative AI]
tags: ["openai", "gpt3.5", "prompt", "1st-day"]
image: "https://blog.nextideatech.com/wp-content/uploads/2024/02/images-21.jpeg"
---

## 1. OpenAI

### 1) Models

#### GPT-3 모델

> Davinci

가장 다재다능한 모델이며 다른 모델이 할 수 있는 모든 작업을 수행할 수 있으며 종종 더 적은 명령으로 훨씬 더 많은 작업을 수행할 수 있습니다. 논리 문제를 풀고, 원인과 결과를 결정하고, 텍스트의 의도를 이해하고, 창의적인 콘텐츠를 생성하고, 캐릭터 동기를 설명하고, 복잡한 요약 작업을 처리할 수 있습니다.

> Curie

힘과 속도의 균형을 맞추려고 합니다. Ada 와 Babbage 의 기능을 할 수 있지만 더 복잡한 분류 작업과 요약, 감정 분석, 챗봇 애플리케이션, 질문 및 답변과 같은 미묘한 작업을 처리할 수도 있습니다.

> Babbage

Ada 보다 약간 더 유능하지만 성능은 모자랍니다. Ada 와 동일한 작업을 모두 수행할 수 있지만 좀 더 복잡한 분류 작업도 처리할 수 있으며 문서가 검색어와 얼마나 일치하는지 순위를 매기는 시맨틱 검색 작업에 매우 적합합니다.

> Ada

일반적으로가장 빠르고 가장 저렴한 모델. 예를 들어 텍스트 구문 분석, 텍스트 서식 다시 지정 및 간단한 분류 작업과 같이 미묘한 차이가 적은 작업에 가장 적합합니다. 제공하는 컨텍스트가 많을수록 성능이 향상될 가능성이 높습니다.

#### GPT-3.5 turbo 및 davinci 모델 설명

- 출처: [Example Code & Implementation Considerations For GPT 3.5 Turbo, ChatML & Whisper](https://cobusgreyling.medium.com/example-code-implementation-considerations-for-gpt-3-5-turbo-chatml-whisper-e61f8703c5db)

![GPT-3.5 turbo 및 davinci 모델들](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ZJiTwPjUMdzuGwIjsnx1xQ.png){: width="600" .w-75}
_GPT-3.5 turbo 및 davinci 모델들_

### 2) [Prices](https://openai.com/pricing)

> GPT-4

| Model	| Prompt | Completion |
| :---  | :---   | :--- |
| 8K context	| $0.03 / 1K tokens	| $0.06 / 1K tokens |
| 32K context	| $0.06 / 1K tokens	| $0.12 / 1K tokens |

> Chat

| Model | Usage |
| :--- | :--- |
| gpt-3.5-turbo	| $0.002 / 1K tokens |

> GPT-3 모델

| Model | Usage |
| :--- | :--- |
| Davinci (Most powerful) | $0.0200 / 1K tokens |
| Curie | $0.0020 / 1K tokens |
| Babbage | $0.0005 / 1K tokens |
| Ada (Fastest) | $0.0004 / 1K tokens |

### 3) GPT 3.5 Turbo 와 Davinci 차이

- 비용 : $0.002 / 1K tokens (Davinci 보다 10배 저렴)
- 학습연도 : 21년 9월까지 (Davinci 보다 3개월치 더 학습됨)
- 토큰수 : 4,096개 (Davinci 보다 96개 증가)
- Fine-tuning 가능 여부 : 불가능 (GPT-3 모델들만 가능)

## 2. [ChatGPT Examples](https://platform.openai.com/examples)

> 프롬프트 설정

- 페르소나 (화자 스타일)
- 출력 형태, 언어 등을 지정

### 1) [Chat with gpt-3.5-turbo](https://platform.openai.com/playground/p/default-chat?mode=chat)

- Mode: Chat (Beta)
- Model: gpt-3.5-turbo
- Options
  + Temperature 0.9
  + Maximum length 150
  + Top P 1
  + Presence penalty 0.6

```text
USER:
제주도에서 가장 인기있는 관광지는 어디일까?

ASSISTANT:
제주도에서 가장 인기있는 관광지는 한라산, 성산일출봉, 우도, 중문색달해수욕장, 테디베어 박물관 등이 있습니다.

USER:
제주도 물가에 대한 사람들의 인식은 어때?

ASSISTANT:
대체로 제주도 물가는 한국 내 다른 지역보다 비싸다는 인식이 있습니다. 이는 제주도가 국내외 관광객이 많이 찾는 인기 여행지인 만큼 수요와 공급의 균형이 이루어지지 않아 발생하는 경제적 현상이기도 합니다. 하지만 최근 제주도에서는 지속 가능한 관광을 위해 봄, 가을 등 계절별로 경제적인 할인 프로그

USER:
제주도를 여행할 때 가장 많이 소비하는 것은 무엇이지?

ASSISTANT:
제주도를 여행할 때 가장 많이 소비하는 것은 숙박비입니다. 제주도에서는 다양한 종류와 가격대의 숙박시설이 있으며, 시즌에 따라 가격이 상승하기도 합니다. 또한, 식비와 교통비도 중요한 소비 대상입니다. 제주도는 해산물이 풍부하므로 해산물 요리를 즐기는 여행객들이 많이 있습니다. 교

USER:
빌라 같은 다세대 주택의 건축 하자 발생시 어떻게 하면 되나요?

ASSISTANT:
다세대 주택의 경우, 건축 하자 발생 시 피해를 입은 입주민이 해당 문제를 제기하고, 주택 소유자와 건설사 등 건축 관련 업체와 협력하여 해결해야 합니다. 먼저, 문제가 된 부분을 정확히 파악한 후, 해당 문제를 수리 또는 교체하는 등 적절한 대응 방안을 마련해야 합니다. 만약, 이러한 과정에서
ASSISTANT:
문제를 해결하지 못하거나, 소유자와 건설사 등이 책임을 회피할 경우, 건축 관련 법적인 수단을 도입할 수도 있습니다. 이 경우, 법률 전문가의 조언과 지식이 필요하며, 법적인 해결 방법에 따라 달라질 수 있습니다. 따라서, 주택 소유자는 가능한 법률 전문가의 도움을 받아 문제를 해결하는 것이 좋습니다.
```

### 2) python 코드

```py
import os
import openai
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

res = openai.ChatCompletion.create(
  model="gpt-3.5-turbo", 
  messages = [
    {"role": "system", "content" : "You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.\nKnowledge cutoff: 2021-09-01\nCurrent date: 2023-03-02"},
    {"role": "user", "content" : "How are you?"},
    {"role": "assistant", "content" : "I am doing well"},
    {"role": "user", "content" : "What is the mission of the company OpenAI?"}
  ]
)
print(res['choices'][0]['message']['content'])
# ==>
# The mission of OpenAI is to develop and promote friendly AI for the betterment of humanity, and to ensure that the benefits of AI are as widely and evenly distributed as possible.
```

### 3) summarization

한글 뉴스 기사 하나를 선정하고, 영어로 번역 했습니다. 

> 기사의 주 내용은 한동훈 장관의 검수완박을 비판하는 발언에 대해 여당 윤상현 의원과 야당 오영환 의원 간의 설전입니다.

```text
한동훈 법무부 장관은 최근 2023년 4월 21일 '마약류 관리 종합 대책' 당정 협의회에 참석하여 '문재인 정부가 검찰의 손발을 전부 잘라놔서 마약에 대한 접근성이 매우 높아졌다'라고 주장했다, 더불어민주당 의원 측에서는 "그게 왜 우리 탓이냐"라며 크게 반발했다.

한동훈 장관의 주장을 살펴보기 전에 한국의 마약 실태를 파악하는 것이 중요하다. 경찰청에 따르면 국내 마약 관련 범죄 검거 건수는 지난해보다 4.4% 증가한 2만 4951건으로 집계됐다. 한국에서 가장 흔히 남용되는 마약은 메스암페타민이고 마리화나, 합성마약, 엑스터시가 그 뒤를 잇는다.

펜타닐은 1g당 1만 원(미화 8.50달러) 안팎에 거래되는 등 피자 한판 가격 수준으로 누구나 부담 없이 살수 있는 수준으로 마약 가격이 많이 떨어졌다고 한다.

한동훈 장관은 "마약이 아무나 살수 없을 정도로 비쌌던 이유는 다름 아닌 위험비용이다. 비싼 돈을 내야 했고 투약하고서 걸리면 인생이 망쳐졌기 때문인데 문재인 정부에서 마약 수사를 주도해온 검찰의 수사권한을 모두 망쳐놨기 때문에 마약을 구하는데 위험 비용이 매우 낮아진 것이다"라고 주장했다.

윤상현 국민의힘 위원은 24실 자신의 페이스북에 "아무나 구할 수 없던 마약을 미성년자나 주부도 쉽게 구할 수 있게 된 원인은 더불어민주당의 검수완박 영향이 가장 크다. 검찰의 마약 수사권을 문재인 정부가 폐기한 탓"이라고 주장했다.

윤 의원은 "2021년 검경 수사권이 조정되어 대검찰청의 마약범죄 모니터링 시스템이 전면 중단된 것도 모자라 검찰의 마약 인지수사가 불과 1년 만에 73% 이하 급감하였다"라고 지적하면서 "문재인 정부와 더불어민주당이 당장 눈앞의 당리 당량에 판단력이 흐려져 검수와는 박으로 대한민국 검찰의 법 시스템을 망쳐놨다"라고 맹비난하였다.

이어서 "아직 마약과의 전쟁을 선언할 단계는 아니라고 하는 경찰 공무원 출신 더불어민주당 의원이 발언이 떠오른다. 매우 위험하고 잘못된 판단이다. 대한민국은 하루라도 빨리 마약과의 전쟁을 선포해야 할 것이다"라고 강조했다.

국민의힘 윤상현 의원의 발언이 전해지자 더불어민주당 오영환 민주당 원내대변인은 당일 국회 의사당 브리핑을 통하여 "윤석열 정부의 문재인 정부 매도하기가 다시 되풀이되고 있다"면서 "한동훈 법무부 장관은 대검찰청 강력부를 폐지했기 때문에 국가 차원의 마약 대응 역량이 약화되었다고 주장하고 있는데, 일방적인 국민 우롱을 멈춰야 한다"라고 하였다.

오 의원은 "대검찰청 강력부는 효과적인 수사를 하기 위하여 반부패·강력부로 통합이 된 것이며 마약 범죄도 동시에 이관되어 대검 조직개편에서 마약 소사가 계속되었다"라며 "강남 버닝 썬 사건으로 인하여 단속이 매우 많아졌던 2020년을 제외하고서는 검경의 실적과 사건 처리 능력은 꾸준히 증가했음에도 불구하고 수사권 조정으로 인하여 국가의 마약 수사 능력이 약해졌다는 것은 일방적 억지로밖에 볼 수 없다"라고 반박하였다.

더불어민주당 장경태 최고위원도 "한동훈 장관의 주장은 어리석은 핑계와 변명뿐"이라면서 "1년에 7만 명의 미국인이 마약으로 사망하고 있는데 세계 최대의 선진국이자 경제대국인 미국도 손발이 잘려서 그런 것인가?"라고 되물었다.

장 의원은 이어서"어린아이도 이런 억지스럽고 뻔뻔한 논리는 필수 없을 것이다"라면서 "전혀 이치에 맞지 않는 전 정권 탓을 하고 싶다면 대법원이 공개하라고 판결한 검찰 특수활동비 지출 내역부터 전부 공개하셔라. 매년 90억이 넘는 특수활동비를 쓰면서 마약 수사에 얼마나 예산을 투입했는지 국민들이 알아야 할 것"이라고 했다.
```

> 파이썬 코드

- 너는 유능한 텍스트 요약 도우미야
- 한국어로 대답해줘

```py
person_type = "Second-Grader"
prompt = ''' 
한동훈 법무부 장관은 최근 2023년 4월 21일 '마약류 관리 종합 대책' 당정 협의회에 참석하여 '문재인 정부가 검찰의 손발을 전부 잘라놔서 마약에 대한 접근성이 매우 높아졌다'라고 주장했다.
더불어민주당 의원 측에서는 "그게 왜 우리 탓이냐"라며 크게 반발했다.
한동훈 장관의 주장을 살펴보기 전에 한국의 마약 실태를 파악하는 것이 중요하다.
경찰청에 따르면 국내 마약 관련 범죄 검거 건수는 지난해보다 4.4% 증가한 2만 4951건으로 집계됐다.
한국에서 가장 흔히 남용되는 마약은 메스암페타민이고 마리화나, 합성마약, 엑스터시가 그 뒤를 잇는다.
펜타닐은 1g당 1만 원(미화 8.50달러) 안팎에 거래되는 등 피자 한판 가격 수준으로 누구나 부담 없이 살수 있는 수준으로 마약 가격이 많이 떨어졌다고 한다.
한동훈 장관은 "마약이 아무나 살수 없을 정도로 비쌌던 이유는 다름 아닌 위험비용이다. 비싼 돈을 내야 했고 투약하고서 걸리면 인생이 망쳐졌기 때문인데 문재인 정부에서 마약 수사를 주도해온 검찰의 수사권한을 모두 망쳐놨기 때문에 마약을 구하는데 위험 비용이 매우 낮아진 것이다"라고 주장했다.
윤상현 국민의힘 위원은 24실 자신의 페이스북에 "아무나 구할 수 없던 마약을 미성년자나 주부도 쉽게 구할 수 있게 된 원인은 더불어민주당의 검수완박 영향이 가장 크다. 검찰의 마약 수사권을 문재인 정부가 폐기한 탓"이라고 주장했다.
윤 의원은 "2021년 검경 수사권이 조정되어 대검찰청의 마약범죄 모니터링 시스템이 전면 중단된 것도 모자라 검찰의 마약 인지수사가 불과 1년 만에 73% 이하 급감하였다"라고 지적하면서 "문재인 정부와 더불어민주당이 당장 눈앞의 당리 당량에 판단력이 흐려져 검수와는 박으로 대한민국 검찰의 법 시스템을 망쳐놨다"라고 맹비난하였다.
이어서 "아직 마약과의 전쟁을 선언할 단계는 아니라고 하는 경찰 공무원 출신 더불어민주당 의원이 발언이 떠오른다. 매우 위험하고 잘못된 판단이다. 대한민국은 하루라도 빨리 마약과의 전쟁을 선포해야 할 것이다"라고 강조했다.
국민의힘 윤상현 의원의 발언이 전해지자 더불어민주당 오영환 민주당 원내대변인은 당일 국회 의사당 브리핑을 통하여 "윤석열 정부의 문재인 정부 매도하기가 다시 되풀이되고 있다"면서 "한동훈 법무부 장관은 대검찰청 강력부를 폐지했기 때문에 국가 차원의 마약 대응 역량이 약화되었다고 주장하고 있는데, 일방적인 국민 우롱을 멈춰야 한다"라고 하였다.
오 의원은 "대검찰청 강력부는 효과적인 수사를 하기 위하여 반부패·강력부로 통합이 된 것이며 마약 범죄도 동시에 이관되어 대검 조직개편에서 마약 소사가 계속되었다"라며 "강남 버닝 썬 사건으로 인하여 단속이 매우 많아졌던 2020년을 제외하고서는 검경의 실적과 사건 처리 능력은 꾸준히 증가했음에도 불구하고 수사권 조정으로 인하여 국가의 마약 수사 능력이 약해졌다는 것은 일방적 억지로밖에 볼 수 없다"라고 반박하였다.
더불어민주당 장경태 최고위원도 "한동훈 장관의 주장은 어리석은 핑계와 변명뿐"이라면서 "1년에 7만 명의 미국인이 마약으로 사망하고 있는데 세계 최대의 선진국이자 경제대국인 미국도 손발이 잘려서 그런 것인가?"라고 되물었다.
장 의원은 이어서"어린아이도 이런 억지스럽고 뻔뻔한 논리는 필수 없을 것이다"라면서 "전혀 이치에 맞지 않는 전 정권 탓을 하고 싶다면 대법원이 공개하라고 판결한 검찰 특수활동비 지출 내역부터 전부 공개하셔라. 매년 90억이 넘는 특수활동비를 쓰면서 마약 수사에 얼마나 예산을 투입했는지 국민들이 알아야 할 것"이라고 했다.
'''

res = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    max_tokens=120,
    temperature=0.7,
    top_p=1,
    frequency_penalty=0.1,
    messages=[
        {
          "role": "system",
          "content": "You are a helpful assistant for text summarization.",
        },
        {
          "role": "system",
          "content": "한국어로 답변해주세요.",
        },
        {
          "role": "user",
          "content": f"Summarize this for a {person_type}: {prompt}",
        },
    ],
)
pprint.pprint(res['choices'][0]['message']['content'])
```

```text
# max_tokens=120
('한동훈 법무부 장관은 "마약을 구하기가 너무 쉬워져서 문제가 된다"고 말했어요. 그 이유는 검찰의 수사권한이 없어져서 마약을 쉽게 구할 '
 '수 있다는 것이라고 주장하고 있어요. 그런데 그 말을 반대하는 사람들도 있어요. 마약')

# max_tokens=200
('한동훈 법무부 장관은 최근 마약에 대한 대책을 논의하는 회의에서 검찰의 수사권한이 줄어들어 마약이 더 쉽게 구할 수 있게 되었다고 '
 '주장했다. 하지만 이를 반대하는 의견도 있다. 국내 마약 범죄 건수는 증가하고 있으며, 메스암페타민이 가장 많이 남용되고 있다. 마약 '
 '가격이 낮아지면서 미성년자나 주부도 쉽게 마약을 구할 수 있게 되었다. 이에 대한 의견이 분분하다') 
```

> GPT-3 (davinci) Summarization 결과

- 영문으로 프롬프트 입력
- 영문 결과를 한국어로 다시 번역

```text
한동훈 법무부 장관은 문재인 정부의 조치로 마약 접근성이 높아졌다고 주장했다. 다만 국민의힘 윤상현 의원은 검찰 수사 조정으로 마약사범 감시가 줄었다고 지적했다.
```

#### 또다른 프롬프트 설정 예제

```py
res = openai.ChatCompletion.create(
  model="gpt-3.5-turbo",
  messages=[
        {"role": "system", "content": "너는 블로그 작성자야"},
        {"role": "user", "content": "GPT에 관련된 블로그를 쓰려면 어떻게해야할까?"}
    ]
)
print(res['choices'][0]['message']['content'])

# ==>
"""
GPT는 인공지능 언어모델 중 하나로, 일반적으로 기업, 연구원, 개발자, 학생 등 다양한 분야에서 관심을 가지고 있는 주제입니다. 따라서 GPT에 관련된 블로그를 작성하려는 경우, 다음과 같은 방법을 고려해 볼 수 있습니다.

1. 관심있는 주제와 관련된 GPT 논문 리뷰 작성하기
GPT의 연구 논문들을 리뷰하고 해당 논문들이 의미하는 바와 함께 그들이 제안한 방법들에 대해 설명하는 것은 유익한 정보를 제공할 수 있습니다. 따라서, 관심 있는 주제와 관련된 GPT 논문들에 대해 리뷰를 작성해 볼 수 있습니다.

2. GPT 모델 구현 및 예제 제공하기
GPT 모델을 구현하고, 제공할 수 있는 예제 코드와 데이터를 제공하는 것은 GPT를 사용하는 사람들에게 큰 도움이 될 수 있습니다. 이를 통해 GPT 모델을 사용하는 사용자들이 모델의 기능과 성능에 대한 이해도를 높일 수 있습니다.

...
"""
```

## 3. OpenAI Speech-to-Text

> 참고

- [공식문서 Speech-to-Text](https://platform.openai.com/docs/guides/speech-to-text)
- [Example Code & Implementation Considerations For GPT 3.5 Turbo, ChatML & Whisper](https://cobusgreyling.medium.com/example-code-implementation-considerations-for-gpt-3-5-turbo-chatml-whisper-e61f8703c5db)


### 1) whisper 사용법

커맨드 라인에서 음성파일 스크립트 추출하기를 할 수 있다.

> 참고

- [Open AI의 음성 받아쓰기 - Whisper 사용해보기](https://www.clien.net/service/board/lecture/17699124)
- [깃허브 openai/whisper](https://github.com/openai/whisper)
- [Transcribe audio files with OpenAI’s Whisper](https://towardsdatascience.com/transcribe-audio-files-with-openais-whisper-e973ae348aa7)

```console
# 사전 설치
$ sudo apt-get install ffmpeg

# 설치
$ pip install torch torchvision torchaudio
$ pip install git+https://github.com/openai/whisper.git

# whisper 오류 발생시, cuda 이전 버전 설치 (python 3.9 이하)
# ==> cuDNN error: CUDNN_STATUS_NOT_INITIALIZED
$ pip install torch==1.8.0+cu111 torchvision==0.9.0+cu111 torchaudio==0.8.0 -f https://download.pytorch.org/whl/torch_stable.html

# 설치 확인
$ python -m torch.utils.collect_env
Collecting environment information...
PyTorch version: 1.8.0+cu111
Is debug build: False
CUDA used to build PyTorch: 11.1
ROCM used to build PyTorch: N/A

OS: Ubuntu 22.04.2 LTS (x86_64)
GCC version: (Ubuntu 11.3.0-1ubuntu1~22.04) 11.3.0
Clang version: Could not collect
CMake version: version 3.26.3

Python version: 3.9 (64-bit runtime)
Is CUDA available: True
CUDA runtime version: Could not collect
...


# GPU 실행
$ time \
  whisper --device cuda --language ko --output_format txt \
  --model small --output_dir output_small \
  ./CallRec_01040268555_1.mp3

# CPU 실행
# 테스트1 - small
$ time \
  whisper --device cpu --fp16 False --language ko \
  --model small --output_dir output_small \
  --output_format txt \
  ./CallRec_01040268555_1.mp3

# 테스트1 - medium
$ time \
  whisper --device cpu --fp16 False --language ko \
  --model medium --output_dir output_medium \
  --output_format txt \
  ./CallRec_01040268555_1.mp3
```

### 2) python 코드 : `whisper-1` 모델 사용

30초 분량 전화통화 녹음 파일을 읽어 텍스트 추출

```py
import os

notebook_path = os.path.abspath("Notebook.ipynb")
mp3_path = os.path.join(os.path.dirname(notebook_path), "CallRec_01040268555_1.mp3")

audio_file= open(mp3_path, "rb")
transcript = openai.Audio.transcribe("whisper-1", audio_file)
print(transcript["text"].encode('utf-8').decode('utf-8'))

# ==>
"""
여보세요? 사장님 김대표예요. 아이고 오랜만이네요. 어제 혹시 전화 받으셨어요? 못 받았지. (중략...)
"""
```

#### ChatGPT 요약 기능과 연결

```text
어떤 사람이 돈을 받지 못해서 문제가 있어서 이야기가 나왔어요. 그 사람은 빌려준 돈을 갚으려고 노력하고 있고, 그 돈을 빌렸던 사람들은 그 사람을 믿고 기다리고 있어요. 하지만 그 돈을 벌기 위해 불법적인 일을 하거나 손님들을 속이기도 했어요. 그래서 그 일을 하는 것은 좋지 않다는 것을 알아야 해요.
```

## 9. Review

- 만일을 위해 꼭 API 사용량 최대치를 설정하자
  + [OpenAI API 사용량 및 요금 조회](https://platform.openai.com/account/usage) : 
- 페르소나가 중요하다 : 아키텍처나 디자인에서 논하는 것과 상통
  + 참고 : [페르소나(persona) 뜻과 UX 디자인에서 중요하게 여겨지는 이유](https://ko.wix.com/blog/post/how-to-create-a-user-persona-ux)

### 참고

- [Text Summarization Development: A Python Tutorial with GPT-3.5](https://www.kdnuggets.com/2023/04/text-summarization-development-python-tutorial-gpt35.html)
- [이전 버전의 PyTorch 설치하기](https://pytorch.kr/get-started/previous-versions/) : `torch==1.8.0+cu111`
- [Building Customized Chatbots for the Web Using gpt-3.5-turbo, the Real Language Model behind ChatGPT](https://pub.towardsai.net/building-customized-chatbots-for-the-web-using-gpt-3-5-turbo-190424827493)
- [Building Your Own Mini ChatGPT](https://medium.com/mlearning-ai/building-your-own-mini-chatgpt-b2e9716ab119) : GPT2

### 팁

- [Jupyter Notebook 에서 로컬 파일 읽기](https://stackoverflow.com/a/52858398)

```py
import os
notebook_path = os.path.abspath("Notebook.ipynb")

train_csv = os.path.join(os.path.dirname(notebook_path), "Datasets/train.csv")
with open(train_csv) as file:
    #....etc
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }