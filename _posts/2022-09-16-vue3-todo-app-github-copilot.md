---
date: 2022-09-16 00:00:00 +0900
title: 깃허브 코파일럿과 함께 Vue3 공부해보기
categories: ["devops"]
tags: ["github", "copilot", "todo-app", "vue3", "tutorial"]
image: "/2022/09/16-vue3-my-todo-app-w640.png"
---

> Github Copilot 과 함께 Vue3 튜토리얼 - Todo App 을 따라해 본 소감을 기록합니다.
{: .prompt-tip }

## 1. 깃허브 코파일럿

한참을 뒷북치는 주제이긴한데, 그래도 써보고 나야 뭐라 평할수 있을거 같아 시도해 보았습니다. Github Copilot 에 대한 내용은 니꼬쌤의 방송을 보시면 10여분만에 금방 파악할 수 있습니다.

- [AI가 나 대신 코딩을? 깃헙 'Copilot' 을 사용해봤다!](https://www.youtube.com/watch?v=x_Yw2f161CU&t=14s)
- [깃헙 Copilot! 쓰면 고소각이라고?](https://www.youtube.com/watch?v=a9349pRiCRk)

### 1) 베타 서비스부터 현재까지의 스토리

대략적인 스토리를 적어보자면, MS 에서 github 를 인수한 뒤 수익모델로 내놓은 서비스가 사용자들의 코드를 학습해서 코딩에 도움을 주는 assistant 제품을 내놓았습니다. 혁신적인 개념에 개발자들은 열광했지만, 1) 사용자 코드를 공짜로 가져가서 유료 서비스로 제공한다는 점, 2) 라이센스와 프라이버시에 대한 고려 없이 출력되는 결과에 실망하게 되었습니다.

- 2022.6.21 [깃허브, 코덱스 기반 노코딩 AI ‘코파일럿’ 정식 출시](http://www.aitimes.com/news/articleView.html?idxno=145330)

베타 서비스를 1여년간 했고, 최근 6월에 정식버전을 출시했습니다. 60일간의 무료 이용기간을 제공하고, 이후 월 10달러의 요금제를 구독해야 합니다.

### 2) 사용자 평가

코파일럿에 대한 리뷰를 읽어보면 대체로 다음과 같은 평입니다.

- 확실히 혁신적인 도구임에는 틀림없다.
- JS 만 잘하는 줄 알았는데, python 등에서도 잘 작동한다.
- 한쪽에 구글검색을 띄워놓고 코딩을 하는 것보다 효과적이다.
- 하지만, 맥락을 잘 파악하지 못하는거 같다. 엉뚱한 코드를 제시한다.
- 주석을 달거나 힌트가 될 만한 조각을 추가하면 조금 더 정확해진다.
- 코딩 과정에서 딴지 거는거 같아서 불편한 느낌이다. 
- 제안을 채택해도 코드 컨벤션이 달라서 다시 수정하는 과정이 거슬린다.
- 앞으로 더 발전할 것이라 예상하지만, 현재는 아직 베타버전이다.

어느 정도의 느낌인지 알기 위해 Vue3 튜토리얼에 코파일럿을 사용해 보았습니다.

### 3) VSCode 에 Github Copilot 확장 모듈 설치

VSCode 의 Extension 메뉴에서 Github Copilot 을 설치하면 바로 사용할 수 있습니다.

- 깃허브를 통해 SignUp 을 하고
- 결재정보를 등록합니다. (신용카드 또는 paypal)
- 소스코드 파일을 열고 작성을 시작하면 copilot 이 작동합니다.

## 2. [Vue3 - Todo App](https://github.com/TylerPottsDev/yt-vue-todo-2022)

참고한 Vue3 튜토리얼 Youtube 입니다.

- 유투브: [Build a Todo List App in Vue JS with LocalStorage in 2022](https://www.youtube.com/watch?v=qhjxAP1hFuI)
- 글쓴이: [Tyler Potts](https://www.youtube.com/c/TylerPotts) 


### 1) 개발도구: Vite + Vue3

#### [Vite](https://vitejs.dev/guide/)

Vue 개발을 위해서 제공되는 개발도구로 Vue-Cli 가 있습니다. Vite 는 Vue-Cli 보다 변경사항을 더 빠르게 반영해주고, 더 작은(효율적인) 코드를 빌드합니다. 검색해보면 적어도 우리나라에서는 Vite 로 갈아타는 경향이 대세같습니다. (좁은 나라라서 그런건지 스타일도 휙휙 바뀌고, 우루루 대세로 쏠리는 경향이 크네요)

- 개발시 변경된 코드가 빠르게 반영하여 화면으로 즉시 확인할 수 있다
- 빌드 결과물이 더 작은 크기를 갖는다 (배포와 실행상의 효율성)

#### [Vue 3](https://vuejs.org/guide/introduction.html)

저의 경우 Angular 만 줄기차게 써 온 입장이라, Vue 나 React 는 완전 초보입니다. Vue 를 살펴보는 이유는, Angular 에 비해서 Vue 는 훨씬 가볍고 진입장벽도 낮고, 그래서 Angular 보다 더 대중적이기 때문입니다.

사용자가 많고 사용 사례가 많다는 것은, 많은 사람들의 고민이 반영되어 프레임워크의 발전을 이끌게 되고 새로운 개념도 더 빠르게 도입된다는 장점이 있습니다. 대세로 인정받은 스킬이기 때문에 취업에도 더 도움이 됩니다. (Angular 는 찾는 곳이 거의 없네요 T-T)

Vue3 는 Vue2 에서 typescript 완전히 다시 작성된 버전이고, 지금이 갈아타기 좋은 시점인거 같아서 배워보려고 합니다.

- Angular 보다 단순한 구조와 빠른 개발이 가능합니다.
- 컴포넌트를 독립적으로 사용하고 배포할 수 있습니다.
- Vue3 에서 typescript 를 받아들임으로써 더 복잡한 애플리케이션 개발이 가능해졌습니다.
  + 강력한 타입 제약으로 여러 개발자들과의 협업과 유지보수에 영향을 줍니다.
  + 객체지향 개념을 더 잘 적용할 수 있기 때문에 로직의 표현력이 향상됩니다.
  
### 2) 튜토리얼 Todo App

어떤 언어이든 하나쯤은 있는 튜토리얼 주제입니다.

- 해야할 항목을 입력하고
- 완료 상태를 체크하고
- 등록된 항목을 삭제할 수 있습니다.

Vue3 튜토리얼에서는 Todo-app 을 App.vue 파일 하나에서 다 구현합니다. (css 파일은 복사해 놓고 시작)

- SFC(Single-File Components) : template, logic, and styling 을 하나의 파일에서 기술하는 Vue 의 파일 포맷 (확장자 .vue)

## 3. 깃허브 코파일럿과 함게 Todo App 튜토리얼 진행 소감

### 1) 한차원 높은 Auto Completion 제공

사용 형태는 기존의 코드 스니펫(흔히 쓰이는/미리 정의된 조각)보다 더 길고 복잡한 제안을 제공합니다.

| ![todos_asc 함수 코드 제안](/2022/09/16-vue3-my-todo-app-w640.png){: width="580"} |
| :--: |
| &lt;그림&gt; todos_asc 함수 작성시 코드 제안 출력 |

등록된 todo 를 시간순으로 정렬하는 함수를 작성하는 부분인데, 키워드 두세개가 입력되면서부터 코드 제안이 제공됩니다. 제안된 내용은 원하던 형태가 아니었는데 나열해 보자면,

- 오름차순을 작성하려는데 내림차순 `a 의 값 - b 의 값` 형식으로 제안
- 시간 `createdAt` 값을 사용하려 했는데, 앞 단락부터 다른 항목(id 등)을 제시

에디터 위치에 가장 적합한(점수가 높은) 코드를 출력하는데, `Ctrl+Enter` 누르면 전체 제안 내용을 살펴볼 수 있습니다.

| ![todos_asc 함수 코드 제안 전체](/2022/09/16-vue3-my-todo-app-suggestions-w640.png){: width="580"} |
| :--: |
| &lt;그림&gt; todos_asc 함수 작성시 코드 제안 전체 조회 |

- 10개 정도 매칭되었다는데, 출력은 2개
- 무슨 생각으로 제안하는 것인지 맥락은 짐작할 수 없습니다.

### 2) 100 줄 이상 작성되면서 조금 더 정교해짐

제안된 코드가 사용자에게 얼마나 받아들여지고 있는지 hit 점수를 체크하는 항목이 있는거 같습니다. AI 를 적용하기 위한 전술(로직)이 있다고 짐작되고요. 다만, 빈 페이지에서 작성하기 시작한 초기에는 정확도가 떨어지거나 제안하는 내용이 들쭉날쭉한 경향이 보입니다.

- 작성 초반에는 정확도가 많이 떨어짐
- 100 줄 이상 넘어가면서 제안하는 정확도가 높아지는 느낌
- 그러나 여전히 일정 규모의 코드 pool 내에서 제시한다는 한계도 느껴짐
  + 아니라는데 계속 어떤 변수나, 코드 스타일을 꾸준히 주장
  
### 3) HTML 과 CSS 에 대해서는 작동하지 않음 (언어만 처리)

HTML 과 CSS 를 잘 못해서, 차라리 그 방면으로 자동 작성을 해주면 참 좋을텐데 안되네요. js 파트에서만 코드 제안을 출력합니다.

### 4) (당연하지만) 신규 문법/단어를 반영하지 못함

양방향 바인딩 키워드인 `v-model`에 대해서 한번도 제시를 안합니다. 여러번 썼는데도 마지막까지 수동 입력을 하도록 하네요.

- 충분한 데이터가 확보된 코드에 대해서만 작동
- 앞에 사용한 변수나 키워드를 반영하여 코드를 제시하지 못함
  - 작성하고자 하는 사람의 의도를 이해하지 못하고
  - 코드를 학습할 때, 의사코드 처럼 추상적으로 변형/가공한 것이 아니라서
  - 출력시에도 학습한 코드를 그대로 제시 (템플릿 형태로 다루는게 아님)

## 4. 이후 계획

일단 대강 맛만 본 상태입니다. python 에서는 어떤 느낌일지 댓글로 추가해 놓도록 하겠습니다. 그리고 무료 이용기간을 포함해 한동안 되든 안되든 켜놓고 써보려 합니다. 한달에 1만원을 들여서 코딩 시간이 10~20% 줄어든다면 좋겠습니다.

- CIOKorea.com [개발자들, 코파일럿 많이 쓸수록 생산성 향상됐다 느껴](https://www.ciokorea.com/t/21999//171544/245056)

7월14일에 만족도 설문조사를 발표했고요, 2000명중 대략 30% 가량이 생산성 향상이 있다고 응답했습니다. 그리고 대략 10번의 제안중 2~3번 정도만 제안을 채택한다고 조사되었습니다.


## 9. Review

- 이미 사용사례가 많은 언어를 뒤늦게 배울 때, 도움이 되지 않을까 기대합니다.
- API 개발이나 프론트엔드 개발할 때 도움이 될 거 같고
  + 특히 일정한 패턴이 필요한 Android, iOS 앱 개발시 유용할 듯

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
