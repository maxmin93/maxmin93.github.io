---
date: 2023-12-10 00:00:00 +0900
title: 이미지 생성형 AI 비교 (2023년)
description: 이미지 생성형 AI 세가지를 비교한 자료를 살펴봅니다. Dall-E, SDXL 도 좋다고 하지만 MidJourney 가 현재까지 가장 인기있는 이미지 생성도구입니다.
categories: [AI, Generative AI]
tags: [midjourney, gpt4, prompt]
image: "https://miro.medium.com/v2/resize:fit:1400/1*tj5Fgl_HTikHW_uTJmE2qg.jpeg"
---

## 1. AI 이미지 생성기

> 장단점 적기가 귀찮아서 GPT4 에 질문한 것을 옮겨왔습니다.

MidJourney는 예술적 표현에 중점을 두고 있으며 DALL-E 3는 세부적인 사실성에 중점을 두고 있으며 Stable Diffusion은 다양하고 효율적인 이미지 생성을 제공하는 등 각 도구마다 장점이 있습니다.

### [MidJourney](https://www.midjourney.com/home)

예술적이고 추상적인 이미지 생성으로 유명한 MidJourney는 독특한 스타일로 시각적으로 매력적인 이미지를 만듭니다. 예술적이고 개념적인 디자인에 자주 사용됩니다.

> 참고자료

- [유튜브 - 미드저니 ai 사용법](https://www.youtube.com/watch?v=doYlI8zAaLs&t=234s) : 가입부터 기초 사용법까지

### [Dall-E 3](https://openai.com/dall-e-3)

이전 버전인 DALL-E 3의 진화 버전은 고해상도 이미지 생성과 복잡한 프롬프트를 이해하고 해석하는 향상된 능력으로 유명합니다. 텍스트 설명을 기반으로 상세하고 사실적인 이미지와 일러스트레이션을 만드는 데 탁월합니다.

### [Stable Diffusion XL 1.0](https://stability.ai/stable-diffusion)

이 도구는 다양한 상황에서 유연성과 적응성이 뛰어납니다. 고품질 이미지를 생성하도록 설계되었으며 다양한 이미지 생성 작업에서 효율성과 효율성이 뛰어난 것으로 알려져 있습니다. 


## 2. 비교 - 미드저니, 달리3, 스테이블 디퓨전

### [유튜브 - 생성 AI 어떤 걸 써야 할지 고민이라면 클릭하세요.](https://www.youtube.com/watch?v=al0HW4_3q-Y)

같은 프롬프트로 총 19장의 이미지를 생성하고 1~3 점수로 평가했다.

> 미드저니 : 총점 50점

실사, 로고, 일러스트, UI 등 다양한 이미지 생성에 탁월

- 총점은 미드 전이가 가장 높았고
- 전반적인 이미지 퀄리티에 있어서 가장 좋은 결과를 보여주었습니다 
- 다양한 디자인 작업을 할 때는 미드 전이가 가장 좋다고 추천

> 달리3 : 총점 40점

- 실사 이미지를 잘 뽑아 주었고 일러스트레이션도 나쁘지 않았습니다
- 특히 3D 작업물이 퀄리티가 좋았고 프롬프트를 잘 인식하는 듯 느껴졌습니다

> SDXL : 총점 29점

- 실사 이미지나 목업 이미지에서 괜찮은 결과를 보여줬습니다
- 파인 튜닝 된 LoRA 모델를 활용하면 보다 세밀한 결과물을 얻을 수 있음

### [Dall-E 3 VS MidJourney 5.2 VS Stable Diffusion XL — Same Prompt, Different Results](https://generativeai.pub/dall-e-3-vs-midjourney-5-2-vs-stable-xl-same-prompt-different-results-a68ae19b223e)

#### Coherence (구현의 정확성)

> 프롬프트: 강철마를 타고 달에 간 우주비행사. 우주 비행사는 파티 모자와 녹색 검이 달린 중세 갑옷을 입고 있습니다.

![Coherence](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0Dl49vzEaOigLvwZ4mdNmw.png){: width="560" .w-75}
_Coherence_

#### Surreal Landscape (초현실적인 풍경)

> 프롬프트: 구름은 솜사탕으로 만들어지고, 강은 액체 금으로 흐르는 몽환적인 풍경

![Surreal Landscape](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*tt5U2-2aDyBCuw5gTtuWxQ.png){: width="560" .w-75}
_Surreal Landscape_

#### Historical Fiction (역사적 상상)

> 프롬프트: 공룡을 타면서 최신 스마트폰을 사용하는 고대 이집트 파라오

![Historical Fiction](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NDnyAHbT-clsyCBk8jUqaA.png){: width="560" .w-75}
_Historical Fiction_


## 3. MidJourney 프롬프트 사용법

기본 형식 : `[content type], [description - subject + adjectives], [style], [composition]`

### 간단히 따라해본 작품

10달러 내고 한달간만 구독했습니다.

> 프롬프트 : A beautiful korean woman

![A beautiful korean woman](https://cdn.midjourney.com/5f2c5e40-2921-497e-b963-81325836bebb/0_0.webp){: width="560" .w-75}
_A beautiful korean woman_

> 프롬프트 : 
Welsh corgi, catch the ball with jumping, on the grain wide ground, ani style

![Welsh corgi](https://cdn.midjourney.com/0090fbb1-46c7-4ce3-a05f-c7503880583d/0_0.webp){: width="560" .w-75}
_Welsh corgi_

> 프롬프트 : Welsh corgi, cute, ani style, dog look at me with little smile (원본 이미지 주고 생성)

![Welsh corgi with source](https://cdn.midjourney.com/b039fd6e-60a5-4016-be1b-e2ac651ade6f/0_0.webp){: width="560" .w-75}
_Welsh corgi with source_

참고 : [미드저니 공식문서 - 이미지 URL 을 이용한 프롬프트 작성](https://docs.midjourney.com/docs/image-prompts)

#### [미드저니 파라미터 리스트](https://docs.midjourney.com/docs/parameter-list)

- `--v 5` : 미드저니 버전 5 사용
- `--q 0.5` : 퀄리티 0.5배
- `--ar 2:1` : 비율
- `--s 250` : [Stylize](https://docs.midjourney.com/docs/stylize), 기본값 100
- `--c 10` : [Chaos](https://docs.midjourney.com/docs/chaos), 기본값 0

### [유튜브 - 미드저니에는 넣는 순서와 용어가 따로 있다. (킵콴 작가)](https://www.youtube.com/watch?v=ujvTA-SPXGA)

#### 프롬프트에 무엇을 넣어야 할까

- 스토리 : 키워드 위주보다는 완결된 문장 형태가 조금 더 사용자의 의도를 반영한다
- 취향(style) : 애니메이션, 오일, 작가 스타일, 화풍
- 지역, 날씨, effects : 폭발효과
- 촬영기법 : 광각렌즈, `ISO 100`, `shot on 120mm`, 로우 앵글, 탑뷰 
- 미술기법 : pixel, 2D/3D
- 지식

#### 킵콴작가가 소개하는 팁

> 스타일을 활용해라

- 기본 : `/imagine prompt` a cute dog
- 애니메이션 스타일 : `/imagine prompt` a cute dog, anime style
- 유화 스타일 : `/imagine prompt` a cute dog, oil painting style

> 플러스(&plus;)를 적극 활용해라 (연계)

- 고딕 + 애니메이션 (plus 활용) : a cute dog, gothic + anime style
- `starwars + cinematic lighting` : 영화 조명효과
- `wes anderson film + fairy lighting` : 동화적 느낌
- `object photography` : 물품 사진 강조 (배경 날리기 지정하면 좋다)

> `and` 사용하면 그려지는 대상에 추가되어 옆에 있는 형태로 보여짐

```text
macro photography of kids toy camper and bear, photo, product photography high resolution, studio lighting, with shadows, modern, minimalistic, neutral color pallete --ar 3:2 --s 250 --v 5.0
```

![kids toy camper and bear](https://cdn.midjourney.com/73668c7a-3250-4c9c-9d5d-9b7975d23eed/0_0.webp){: width="560" .w-75}
_kids toy camper and bear_

### [유튜브 - 미드저니로 극강 귀여운 동물 만드는 마법의 프롬프트 발견하기!](https://www.youtube.com/watch?v=wf2xVGj7gTM)

#### 따듯하게 옷입은 펭귄 두마리

- on a snowy, two penguin snuggled together, 
- warming each other, wearing scarf and socks, 
- cute, cartoony 
- `--s 250 --v 5.2 --style raw --ar 16:9 --q 0.5`

![two penguin](https://cdn.midjourney.com/ec6333ba-ac8b-450f-ae58-57478f4775a7/0_3.webp){: width="560" .w-75}
_two penguin_

#### 의인화된 쥐

- tiny cute and **adorable** mouse, 
- anthropomorphic, standing,
- dramatic lighting, dramatic contrast,
- golden hour, cinematic,
- ultrasharp photography
- `--chaos 10`

![cute and adorable mouse](https://cdn.midjourney.com/bcd21f1d-8346-454f-8770-4179e2322a42/0_1.webp){: width="560" .w-75}
_cute and adorable mouse_

## 4. [MidJourney 로 자신만의 logo 만들기](https://www.logoai.com/blog/design-logo-with-midjourney-and-logoai)

### logo 디자인

> The letter"J" logo for a travel guide company, serif, flat, reminiscent of an island, mountain in center, green to blue gradient, vector art, whitebackground `--s 250 --v 5.2`

![jejusari logo](https://cdn.midjourney.com/6ba83f24-39e4-499e-a12b-2ee7a6904dc6/0_0.webp){: width="560" .w-75}
_jejusari logo_

- 참고 : [나눔가이드 - 미드저니 로고디자인 프롬프트 정리](https://www.nanumpress.com/ai%EC%A0%95%EB%B3%B4/midjourney/%EB%AF%B8%EB%93%9C%EC%A0%80%EB%8B%88-%EB%A1%9C%EA%B3%A0%EB%94%94%EC%9E%90%EC%9D%B8-%EB%AF%B8%EB%93%9C%EC%A0%80%EB%8B%88-%EB%A1%9C%EA%B3%A0-%ED%94%84%EB%A1%AC%ED%94%84%ED%8A%B8-%EC%A0%95%EB%A6%AC/)

> simple logo for running pony, minimal, cubism, line, vector, white background `--s 250 --v 5.2`

![running pony](https://cdn.midjourney.com/b2fe4d8a-087f-4c4a-9f84-341473bc265b/0_1.webp){: width="560" .w-75}
_running pony_

> simple logo for yellow wild flower, line, vector, white background `--s 250 --v 5.2`

![yellow wild flower](https://cdn.midjourney.com/7516aff8-6c1f-4519-9c33-fd179ae0aa7e/0_1.webp){: width="560" .w-75}
_yellow wild flower_

### [logoai 이용해 로고 디자인](https://www.logoai.com/make)

- logo 이미지에 텍스트까지 입혀서 실제적인 logo 디자인을 완료한다. (워터마크)
- 본격적으로 사용하려면 29달러를 내야한다. SVG 출력하려면 59달러 (일시불)

![jejusari-logoai-canvas](/2023/12/10-jejusari-logoai-canvas.png){: width="560" .w-75}
_jejusari-logoai-canvas_

> 결과물

![jejusari-logo-text-horizon](/2023/12/10-jejusari-logo-text-horizon.png){: width="560" .w-75}
_jejusari-logo-text-horizon_


## 9. Review

- 킵콴 작가분이 말씀하신 것처럼, 예술적 감각을 더하면 더 강력한 도구가 될 수 있다.
- 원하는 이미지를 뽑아내려면 프롬프트 예제를 보고, 방향성을 잡아가는 연습이 필요하다.
  - 옵션 기능으로 더 세밀하게 조정할 수 있지만, 일단은 스토리를 잡는게 우선이다.
- 한번에 안된다. variation 버튼을 눌러 여러번 시도해야 그중에 하나 나온다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }