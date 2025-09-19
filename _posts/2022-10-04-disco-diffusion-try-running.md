---
date: 2022-10-04 00:00:00 +0900
title: Disco/Stable Diffusion 실행해보기
description: 텍스트로부터 이미지를 생성하는 오픈소스 Disco 와 Stable Diffusion 을 실행해봅니다.
categories: [AI, Generative AI]
tags: [python, diffusion, text-to-image, ai-art]
image: "/2022/10/04-disco-diffusion-output_49-crunch.png"
---

![disco diffusion - sample 이미지](https://replicate.com/api/models/nightmareai/disco-diffusion/files/5800f828-94d5-46a0-9eb2-96b51d7846e3/6af357b1-11dc-4954-ad45-4f17b3bc18890_0.png){: width="580" .w-75}
_&lt;그림&gt; disco diffusion - [sample images](https://replicate.com/nightmareai/disco-diffusion/examples)_

## 1. 초거대 AI 를 이용한 이미지 생성기

`text-to-image` 또는 이미지 생성기 중에서 `AI 아트` 라는 장르를 생성하고 있다. 초기 이미지 생성 모델에 속하는데, diffusion 이란 이름으로 몇몇 알고리즘들이 오픈소스로 풀려서 상업적으로 이용이 가능하다. 최근에는 [깃허브 - stable diffusion](https://github.com/CompVis/stable-diffusion) 도 나왔다.

입력 문장을 이용해 다음 문장을 생성하는 NLP 기술과 원리가 흡사하다.

### 1) [깃허브 - disco diffusion](https://github.com/alembics/disco-diffusion) 란?

장면을 설명하는 프롬프트를 사용하여 텍스트를 이미지로 변환하는 데 사용할 수 있는 AI 모델링 기술중의 하나이고, Dall-E 가 나오면서 조명되기 시작했다. 이를 활용한 여러 이미지 생성 알고리즘 중에서 disco diffusion 은 비교적 초기에 오픈소스로 풀려서 널리 알려져 있다.

#### 참고: DALL·E 2

DALL·E 2 is a new AI system that can create realistic images and art from a description in natural language.

- [https://openai.com/dall-e-2/](https://openai.com/dall-e-2/)

#### 참고: [루트코스키 화풍](https://www.technologyreview.kr/this-artist-is-dominating-ai-generated-art-and-hes-not-happy-about-it/)

폴란드 출신 디지털 아티스트 그렉 루트코스키(Greg Rutkowski)

루트코스키 특유의 화풍은 이제 지난달 말 오픈소스로 출시된 AI 이미지 생성 프로그램인 스테이블 디퓨젼(Stable Diffusion) 이용자들이 가장 많이 입력하는 프롬프트(명령어) 중 하나가 됐다.

### 2) 참고문서

- [creator nightcafe studio](https://creator.nightcafe.studio/explore?q=top-month)
  + 다른 사람들이 생성해 놓은 이미지들을 감상해볼 수 있다. (좋아요 평가)
  + 직접 문구를 작성해 나만의 이미지를 생성할 수도 있고

- [유투브 - Animations in Disco Diffusion V4.1 & V5.2. A quick tutorial & a few tips.](https://www.youtube.com/watch?v=Ou5jzf76d28)
  + 생성한 이미지로 생성된 애니메이션

<iframe width="640" height="480" src="https://www.youtube.com/embed/Ou5jzf76d28" title="Animations in Disco Diffusion V4.1 & V5.2. A quick tutorial & a few tips." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## 2. Disco Diffusion 실행해보기

참고문서

- [유투브 - Get Started with Disco Diffusion in Google Colab to Create "AI" Generated Art (First Run)](https://www.youtube.com/watch?v=n2-PmMQrZTE&t=2s)
- [유투브 - Quick Start on using AI to render images using Disco Diffusion](https://youtu.be/wIw59kAU6u8)


### 1) [Colab 소스](https://colab.research.google.com/github/alembics/disco-diffusion/blob/main/Disco_Diffusion.ipynb) 열고 사본으로 저장

- 불필요한 부분들을 모두 날리자.
  + 숫자로 단계가 표시된 부분만 있으면 된다.

- Colab 실행 환경에 GPU 설정을 확인

### 2) Setting 수정

#### 3. Settings

Basic Settings:

- batch_name 입력 : 'tutorial'
  - 이미지 생성 중 출력물이 저장되는 폴더 이름
- width_height_for_512x512_models : `[500, 300]`
  - 생성할 이미지 사이즈 (작을수록 빨라진다)

Init Image Settings:

- init_image : None
  + 이미지 생성을 위한 초기 이미지 (없어도 된다)
  + 있으면, 초기 이미지로부터 조금씩 변형을 시작하여 이미지 생성
    * 튜토리얼에서는 스타워즈 도킹 베이를 사용했다.
- skip_steps: 25
  + 건너뛰기

Extra Settings:

- intermediate_saves : 10
  + 스텝별로 저장할 중간 이미지 개수

Prompts: (핵심 입력사항!!)

- text_prompts
  + 이미지를 설명하는 텍스트

```js
text_prompts = {
    0: ["5 uniformed men working with 8 robots in the middle of a huge docking bay of a spaceship, ridley scott, cinematic lighting, octane, depth of field"],
}
```

### 3) Colab 실행

- 순서적으로 실행
  + 1. Set Up
  + 2. Diffusion and CLIP model settings
    * Custom model settings : 필요없음 (건너뛰자)
  + 3. Settings
  + 4. Diffuse!
    * 이미지가 생성되는 과정을 볼 수 있다. (재밋다)

- 선택사항
  + 5. Create the video

## 3. 생성된 이미지

### 1) 초기 이미지

원본 이미지 : [starwars docking bay](https://i.stack.imgur.com/QFhVX.jpg)

![disco diffusion - 초기 이미지](/2022/10/04-starwars-docking-bay-crunch.png){: width="580" .w-75}
&lt;그림&gt; disco diffusion - 초기 이미지

### 2) 스텝별 생성된 이미지

![disco diffusion - step #00](/2022/10/04-disco-diffusion-output_00-crunch.png){: width="580" .w-75}
_&lt;그림&gt; disco diffusion - step #00_

![disco diffusion - step #05](/2022/10/04-disco-diffusion-output_05-crunch.png){: width="580" .w-75}
_&lt;그림&gt; disco diffusion - step #05_

![disco diffusion - step #11](/2022/10/04-disco-diffusion-output_11-crunch.png){: width="580" .w-75}
_&lt;그림&gt; disco diffusion - step #11_

![disco diffusion - step #17](/2022/10/04-disco-diffusion-output_17-crunch.png){: width="580" .w-75}
_&lt;그림&gt; disco diffusion - step #17_

![disco diffusion - step #29](/2022/10/04-disco-diffusion-output_29-crunch.png){: width="580" .w-75}
_&lt;그림&gt; disco diffusion - step #29_

![disco diffusion - step #36](/2022/10/04-disco-diffusion-output_36-crunch.png){: width="580" .w-75}
_&lt;그림&gt; disco diffusion - step #36_

![disco diffusion - step #49](/2022/10/04-disco-diffusion-output_49-crunch.png){: width="580" .w-75}
_&lt;그림&gt; disco diffusion - step #49_

## 4. 추가 : [Stable Diffusion 이미지 생성](https://keras.io/guides/keras_cv/generate_images_with_stable_diffusion/)

- 어지간히 유명한 상징물 아니면 구체적으로 설정하지 못하는군요
- 제주 사진들을 추가해서 재학습 과정이 필요한듯

### 1) "제주 판포리 항구에서 스노쿨링 즐기기"

![stable diffusion - 판포리](/2022/10/04-stable_diffusion-panpori_snorkeling-crunch.png){: width="580" .w-75}
_&lt;그림&gt; stable diffusion - 제주 판포리 스노쿨링_

![](/2022/10/04-gpt4o-image-panpori.webp){: width="580" .w-75}
_&lt;그림&gt; GPT-4o 모델 이미지 생성 - 판포리 (2025년 추가)_

### 2) "제주도 감귤밭에서 사진 찍기"

![stable diffusion - 감귤밭](/2022/10/04-stable_diffusion-jeju-gamgyul-farm-picture-crunch.png){: width="580" .w-75}
_&lt;그림&gt; stable diffusion - 제주도 감귤밭 사진 찍기_

![](/2022/10/04-gpt4o-image-gamgyul.webp){: width="580" .w-75}
_&lt;그림&gt; GPT-4o 모델 이미지 생성 - 감귤 (2025년 추가)_


## 9. Review

- 파라미터를 조정해도 최소 30~40분 걸린다.
- 원하는 이미지를 생성하기 위한 제어가 쉽지 않다. 
  - 다른 이들은 그럼에도 곧잘 만들어내고 있다.
- 데코라던지 흥미거리로 그림을 사용할 수준은 된다.
  + 이정도 발전 속도라면 웹소설이 웹툰으로 바뀌는 시대도 멀지 않을듯

> 추가

- GPT-4o 모델로 생성한 사진 2장을 추가했다. 판포리와 감귤밭 사진 모두 2022년 디퓨전 모델에 비하면 월등히 좋아졌다. 놀랍다.

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }