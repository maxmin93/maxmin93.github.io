---
title: My Projects
icon: fas fa-building
order: 5
sitemap: false
---

> 현재 작업중인 미니 프로젝트들과 참고사항을 기록합니다.

&nbsp;<br/>

> 진행중인 작업들 (doing)
{: .prompt-info }

- 네이버 주식 가격 수집 (scrapy) : 작업중 <span style='font-size:1.5rem;'>&nbsp; &#128187;</span>
  - [깃허브/naver-stocks-collector](https://github.com/maxmin93/naver-stocks-collector) : 국내주식 카테고리별, 테마별 매일 수집

- Nextjs 예제 + Vercel 호스팅 (+ CI/CD) : 작업중 <span style='font-size:1.5rem;'>&nbsp; &#128187;</span>
  - Vercel 과 Github 연동시 CI/CD 수행
    + Github Pages, Gatsby Cloud 도 마찬가지

&nbsp;<br/>

> 계획된 작업들 (to-do)
{: .prompt-warning }

- 한글 편집 거리 기반 검색 자동 완성 <span style='font-size:1.5rem;'>&nbsp; &#10004;</span>
  + 한글 단어 또는 관용구 사전이 필요함 (빈번히 쓰이는 말뭉치)
  + Trie 검색은 고정된 키워드셋 안에서나 활용성 있고, 자연어는 아님

- 제주 뉴스 검색 서비스 - 행사/이벤트 수집 <span style='font-size:1.5rem;'>&nbsp; &#10004;</span>
  + 크롤링, IP 프록시 
  + 엔터티 식별, 카테고리 자동 분류

- Flutter 공부 = 한줄쓰기 일기장 앱 <span style='font-size:1.5rem;'>&nbsp; &#10004;</span>
  + 음성인식 API 연결
  + 짧은 애니메이션 아이콘이 있으면 좋겠음

- AI 이미지 예측 = 음식 사진 칼로리 계산 <span style='font-size:1.5rem;'>&nbsp; &#10004;</span>
  + 언제, 얼마나 먹었는지 기록해보자

&nbsp;<br/>

> 완료된 작업들 (done)
{: .prompt-tip }

- Docker + FastAPI + SQLModel(SQLAlchemy2 Future) 튜토리얼 <span style='font-size:1.5rem;'>&nbsp; &#10024;</span>
  - [깃허브/fastapi-sqlmodel-heroes](https://github.com/maxmin93/fastapi-sqlmodel-heroes)

- Todo App 풀스택 (Nestjs + Angular) <span style='font-size:1.5rem;'>&nbsp; &#10024;</span>
  - [깃허브/wisely-todo](https://github.com/maxmin93/wisely-todo) 
  - Docker 작업 아직 안했음 <span style='font-size:1.5rem;'>&nbsp; &#128561;</span>

&nbsp;<br/>

> 중단된 작업들 (holding)
{: .prompt-danger }

- AWS SageMaker 튜토리얼 : 천천히 써보기엔 비싸다 => 중단 <span style='font-size:1.5rem;'>&nbsp; &#128679;</span>
  - [깃허브/aws-notebook](https://github.com/maxmin93/aws-notebook) 
  - 모델 돌리고, 작업할 거리가 명확해지면 시작하자 <span style='font-size:1.5rem;'>&nbsp; &#129302;</span>

&nbsp;<br/>

***

상태 표시용 [이모지](https://unicode-table.com/kr/emoji/)

- 체크 <span style='font-size:1.5rem;'>&nbsp; &#10004;</span>
- 오케이 <span style='font-size:1.5rem;'>&nbsp; &#128076;</span> <span style='font-size:1.5rem;'>&nbsp; &#10024;</span>
- 작업중 <span style='font-size:1.5rem;'>&nbsp; &#127939;</span> <span style='font-size:1.5rem;'>&nbsp; &#128187;</span>
- 새로 배우기 <span style='font-size:1.5rem;'>&nbsp; &#127959;</span>
- 중단 <span style='font-size:1.5rem;'>&nbsp; &#128679;</span> <span style='font-size:1.5rem;'>&nbsp; &#129300;</span>
- 버려 <span style='font-size:1.5rem;'>&nbsp; &#128465;</span>

&nbsp; <br/>
&nbsp; <br/>

> ___ **Back To the Work!** ___ &nbsp;



<!-- When page loads, determine whether to show light mode or dark mode utterances comments -->
<section id="utteranc_box">
  <div id="light-mode">
    <script src="https://utteranc.es/client.js"
        repo="maxmin93/my-blog-comments"
        issue-term="pathname"
        label="comment"
      theme="github-light"
      crossorigin="anonymous"
      async>
    </script>
  </div>
  <div id="dark-mode">
    <script src="https://utteranc.es/client.js"
        repo="maxmin93/my-blog-comments"
        issue-term="pathname"
        label="comment"
      theme="github-dark"
      crossorigin="anonymous"
      async>
    </script>
  </div>
</section>

<script src="/assets/js/custom.js"></script>
<script type="text/javascript">
  $(function(){
    console.log("projects.html: utteranc comments");
    
    (window.customScripts.customUtteranc)();
  });
</script>
