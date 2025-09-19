---
date: 2024-04-21 00:00:00 +0900
title: SvelteKit Tailwind 튜토리얼 - 6일차
description: TailGrids 의 샘플 Templates 들을 Svelte5 로 변환하며 runes 와 Tailwind CSS 사용법을 공부합니다. 외워질 때까지 여러번 반복하여 숙달합니다.
categories: [Frontend, CSS]
tags: [tailwind, svelte]
image: "https://cdn.icon-icons.com/icons2/2699/PNG/512/tailwindcss_logo_icon_170649.png"
---

> 목록
{: .prompt-tip }

- [SvelteKit Tailwind 튜토리얼 - 1일차](/posts/sveltekit-tailwindcss-day1/) : Tailwind Labs
- [SvelteKit Tailwind 튜토리얼 - 2일차](/posts/sveltekit-tailwindcss-day2/) : Plugins &amp; Tools
- [SvelteKit Tailwind 튜토리얼 - 3일차](/posts/sveltekit-tailwindcss-day3/) : Tutorial &#35;1
- [SvelteKit Tailwind 튜토리얼 - 4일차](/posts/sveltekit-tailwindcss-day4/) : Tutorial &#35;2
- [SvelteKit Tailwind 튜토리얼 - 5일차](/posts/sveltekit-tailwindcss-day5/) : Tutorial &#35;3
- [SvelteKit Tailwind 튜토리얼 - 6일차](/posts/sveltekit-tailwindcss-day6/) : Tutorial &#35;4 &nbsp; &#10004;

## 0. 개요

- [x] Bun 1.1.3 + Svelte 5 preview
  - prettier
  - [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte)
- [x] TailwindCSS 3.4.1 + typography
  - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss)
  - [vite-plugin-tailwind-purgecss](https://www.npmjs.com/package/vite-plugin-tailwind-purgecss) 0.1.3
  - [daisyui](https://daisyui.com/docs/colors/) : (dark 선택자 대신에) color 테마를 활용
- [x] Etc
  - fonts : 한글 Noto Sans KR, D2Coding


## 1. 프로젝트 생성

> 참고

- [2024-02-26-svelte5-runes-example1 - 1. 프로젝트 생성](/posts/svelte5-runes-example1/)
- [SvelteKit Tailwind 튜토리얼 - 4일차](/posts/sveltekit-tailwindcss-day4/)
  - 이전에 만들어 본 TailGrids Agency Site 와 많은 부분이 흡사하다.

### TailGrids - Dashboard and Admin Template

> top 화면

![](/2024/04/21-tailgrids-templates-site3-top.png){: width="560" .w-75}
_TailGrids - Dashboard and Admin Template_

> 전체 화면

![](/2024/04/21-site3-full-screen-shot.png){: width="200" .w-75}
_TailGrids - Dashboard and Admin Template 전체_

> Template Section and Pages

- Home
- NavMenu
- Dashboard
- Orders
- Messages
- Notifications
- Sales
- Events
- Charts
- Docs
- Settings
- Account Settings
- Log In and Log Out
- Sales Analytics - Chart and Graph
- Revenue and Sales Section
- Product Table
- 404 Page


## 2. `+page.svelte`

### 작업 절차

1. 상단의 메뉴바 작성 (절대위치)
2. 상단 메뉴바를 감싸는 전체 container 작성
3. 상단 메뉴바 보다 우선순위를 갖는 사이드 메뉴바를 작성하여 끼워넣기
4. 사이드바 토글 버튼을 만들고 open 상태 변수를 작성하여 translate 클래스와 연결
5. 사이드바 open 때에 전체 화면을 반투명하게 가리는 outside 영역을 작성하고 닫기 연결
6. Body 부분 (HeaderSection 과 ContentSection) 작성

### Admin 레이아웃

- 사이드바와 사이드바 핸들러(열고 닫기)를 먼저 작성하고
  - 사이드바는 초기에 회면 왼쪽(마이너스 x 위치)에 숨겨진 상태로 존재하다 나타난다.
- Body 영역에서 Header 와 Content 섹션을 작성한다.
  - HeaderSection 은 상단에 고정이지만,
  - ContentSection 은 메뉴 선택에 따라 내용이 바뀐다.

#### 전체 코드

- 생략가능(optional) 함수 파라미터의 JSDoc 표현식 : `@param {boolean=} value`

```svelte
<script>
  // 사이드 메뉴
  const sidebarController = (() => {
    /** @type {boolean} */
    let isOpen = $state(false);
    return {
      /** @param {boolean=} value */
      toggle: (value = undefined) => {
        if (value === undefined) {
          isOpen = !isOpen;
        } else {
          isOpen = value;
        }
      },
      get open() {
        return isOpen;
      },
    };
  })();
</script>

<section class="relative flex min-h-screen w-full items-start bg-base-100">
  <!-- 사이드바 위치 고정 -->
  <div
    class="{sidebarController.open
      ? 'translate-x-0'
      : '-translate-x-full'} absolute left-0 top-0 z-40 flex min-h-screen w-full max-w-[90px] flex-col justify-between bg-base-200 shadow-md duration-200 xl:translate-x-0"
  >
    <!-- || Sidebar menu Start -->
    <SidebarSection />
    <!-- || Sidebar menu End -->
  </div>

  <!-- Sidebar outside click -->
  <div
    onclick={() => {
      sidebarController.toggle();
    }}
    class="{sidebarController.open
      ? 'translate-x-0'
      : '-translate-x-full'} fixed left-0 top-0 z-30 h-screen w-full bg-neutral bg-opacity-80 xl:hidden"
  ></div>

  <!-- Body Area -->
  <div class="w-full xl:pl-[90px]">
    <!-- || Header Menu Section Start -->
    <HeaderSection {sidebarController} />
    <!-- || Header Menu Section End -->

    <!-- Content Area -->
    <div class="p-[30px]">
      <SalesSection />
    </div>    
  </div>  
</section>
```


## 3. 레이아웃

### 사이드바 

- 로고 이미지 (링크)
- 툴바 : 홈, 대시보드, 오더, 메시지, 판매, 이벤트, 차트, 문서
- 툴바 분리선
- 툴바 : 메시지, 설정, 로그아웃
- 프로파일 아바타

> 사이드바 close 상태 (light 테마)

![](/2024/04/21-site3-mobile-sidebar-close-light.png){: width="360" .w-75}
_Admin Template - Sidebar Layout - Close_

> 사이드바 open 상태 (dark 테마)

![](/2024/04/21-site3-mobile-sidebar-open-dark.png){: width="360" .w-75}
_Admin Template - Sidebar Layout - Open_

> `sidebar-section.svelte`

```svelte
<script>
  import LogoSvg from '$lib/assets/images/logo/logo.svg';
  import Avatar5Img from '$lib/assets/images/avatar/image-05.jpg';
</script>

<aside>
  <!-- 로고(Home) -->
  <div class="px-7 pb-7 pt-9">
    <a href={undefined}>
      <img src={LogoSvg} alt="logo" class="h-8 w-8" />
    </a>
  </div>

  <!-- 툴바 -->
  <nav>
    <ul>
      <!-- Home 버튼 -->
      <li class="group relative">
        <!-- 아이콘 링크 -->
        <a
          href={undefined}
          class="relative flex items-center justify-center border-r-4 border-transparent px-9 py-3 text-base font-medium text-base-content duration-200 hover:border-primary hover:bg-primary/5 hover:text-primary"
        >...</a>
        <!-- 라벨 (hover 할 때 translate 로 출력) -->
        <span
          class="invisible absolute left-[115%] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-[5px] bg-base-100 px-[14px] py-[6px] text-sm text-base-content shadow-md group-hover:visible"
        >...</span>
      </li>
      <!-- 나머지 툴바 버튼들... -->
      <li class="group relative">...</li>
    </ul>
  </nav>

  <!-- Profile : Avatar(image) -->
  <div class="px-6 py-10">
    <div class="flex items-center">...</div>
  </div>
</aside>
```

### 상단 메뉴바 

- 사이드바 open 버튼
- 검색창
- 툴바 : light/dark 테마, 칼렌더, 알림, 메시지, 프로파일

> `header-section.svelte`

```svelte
<header class="w-full bg-base-100">
  <div
    class="relative flex items-center justify-end bg-base-200 py-3 pl-[70px] pr-3 sm:justify-between md:pl-20 md:pr-8 xl:pl-8"
  >
    <!-- Hamburger Menu Button -->
    <button
      onclick={() => {
        sidebarController.toggle(true);
      }}
    >...</button>

    <!-- Search Input Box -->
    <div class="hidden sm:block">
      <div class="flex items-center">
        <span>...</span>
        <input type="text" ... />
      </div>
    </div>

    <!-- Toolbar -->
    <div>
      <div class="flex items-center">
        <!-- Theme Changer : light/dark -->
        <div class="mr-5 mt-2 hidden md:block">
          <!-- daisyui theme-controller ... -->
        </div>
        <!-- Calendar -->
        <div class="mr-5 hidden md:block">...</div>
        <!-- Alert -->
        <div class="relative mr-5 hidden md:block">...</div>
        <!-- Email -->
        <div class="relative mr-5 hidden md:block">...</div>
        <!-- Profile -->
        <div class="group relative">...</div>       
      </div>
    </div>

  </div>
</header>  
```


## 4. 컴포넌트

### 스코어 카드

![](/2024/04/21-site3-component-score-card.png){: width="560" .w-75}
_component-score-card.png_

숫자값 등을 출력하는 대시보드용 스코어 카드 컴포넌트에 대한 코드이다. 동일한 형태를 갖지만 내용물만 다른 경우 프로퍼티를 전달하여 재사용하도록 작성할 수 있다.

- svgIcon : 이전에 slot 으로 작성되던 위치에 snippet 으로 대치하여 작성
  - 컴포넌트 내부에 정의될 경우 attribute 로 지정 안해도 `$props` 로 받게 된다.
- 고정 개수이면 each loop 로 생성하는 것보다 물리적으로 반복하는 것이 보기 편하다.
  - 동적 개수이면 loop 로 처리하지만, 고정 형태라면 중복 작성이 옳다.
- 각 카드의 DropDown 메뉴 핸들러는 createDropdownHandle 로 생성시마다 호출
  - 상태 변수 open 과 toggle 함수를 각각 별개의 객체로 전달

> Parent Component

```svelte
<script>
  // create handler of dropdown menu
  const createDropdownHandle = () => {
    /** @type {boolean} */
    let isOpen = $state(false);
    return {
      /** @param {boolean=} value */
      toggle: (value = undefined) => {
        if (value === undefined) {
          isOpen = !isOpen;
        } else {
          isOpen = value;
        }
      },
      get open() {
        return isOpen;
      },
    };
  };

  /** @type { {
   *    value: string,
   *    description: string,
   *  }[] }
   */
  let scoreItems = [
    { value: '$4,350', description: 'Earned this month' },
    { value: '583', description: 'New Clients' },
    { value: '1289', description: 'New Sales' },
  ];

  import ChartCard from './chart-card.svelte';
  import ScoreCard from './score-card.svelte';
</script>

<ScoreCard
  value={scoreItems[0].value}
  description={scoreItems[0].description}
  handler={createDropdownHandle()}
>
  {#snippet svgIcon()}
    <svg
      width="30"
      height="31"
      viewBox="0 0 30 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="fill-current"
    >
      <path d="M18.5156 ... 14.4688Z" />
    </svg>
  {/snippet}
</ScoreCard>

<ScoreCard ... />
<ScoreCard ... />
```

> ScoreCard (Child)

```svelte
<script>
  /** @type { {
   *    value: string,
   *    description: string,
   *    handler: {
   *      open: boolean,
   *      toggle: (val?: boolean) => void,
   *    },
   *    svgIcon: import('svelte').Snippet,
   *  } }
   */
  let { value, description, handler, svgIcon } = $props();
</script>

<div
  class="relative mb-8 flex items-center rounded-[10px] px-6 py-10 shadow-sm sm:px-10 md:px-6 xl:px-10"
>
  <div
    class="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-full bg-primary text-primary-content sm:mr-6 sm:h-[60px] sm:max-w-[60px] md:mr-4 md:h-[50px] md:max-w-[50px] xl:mr-6 xl:h-[60px] xl:max-w-[60px]"
  >
    {@render svgIcon()}
  </div>
  <div>
    <p class="text-2xl font-bold text-primary-content xl:text-[28px] xl:leading-[35px]">
      {value}
    </p>
    <p class="mt-1 text-base text-base-content">{description}</p>
  </div>
</div>
```

### chart.js 차트

![](/2024/04/21-chartjs-barchart-demo.png){: width="560" .w-75}
_chartjs-barchart-demo_

- `onMount` 를 사용할 수도 있지만, use 지시자를 이용해 단순화했다.
- Svelte 에서는 `chart.js/auto` 를 참조해야 차트가 나타난다. [(매뉴얼 참고)](https://www.chartjs.org/docs/latest/getting-started/integration.html#quick-start)
  - chartjs 는 tree-shakeable 이라서, 번들링에 모두 포함되도록 auto 를 사용한다.
  - 예제 : [Create Beautiful Charts with Svelte and Chart js](https://dev.to/wesleymutwiri/create-beautiful-charts-with-svelte-and-chart-js-512n)

> `+page.svelte`

```svelte
<script>
  import { bindBarChart } from './chartjs-bar.svelte';
</script>

<section class="container mx-auto">
  <h1 class="pb-4 text-xl">Bar Chart</h1>
  <div class="w-[800px] border">
    <canvas use:bindBarChart></canvas>
  </div>
</section>
```

> `chartjs-bar.svelte.js`

```js
import { Chart as ChartJS } from 'chart.js/auto';

/** @param { HTMLCanvasElement } node */
export function bindBarChart(node) {

  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  /** @type { import('chart.js').Chart | undefined } */
  let barChart = new ChartJS(node, config);

  return {
    destroy() {
      if (barChart) barChart.destroy();
      barChart = undefined;
    },
  };
}
```

#### Canvas 바탕색상 변경

비슷한 방법으로 dark mode 에서 chart 의 색상, 스타일 등을 변경하는데 사용할 수 있다.

> 참고

- [How to Change the Background Color of Canvas in Chart JS 4](https://www.youtube.com/watch?v=_kXfsPxZOYQ)
- [How to Implement Dark Mode in Chart JS](https://www.youtube.com/watch?v=NV-8--_w1wY)

```js
const canvasBgColorConfig = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart, args, options) => {
    const { ctx } = chart;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = options.color || '#99ffff';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
};

let barChart = new ChartJS(ctx, {
  type: 'bar',
  data: { /* ... */ },
  options: {
    plugins: {
      customCanvasBackgroundColor: {
        color: 'lightGreen',
      },
    },
  },
  plugins: [canvasBgColorConfig]
});
```

#### Chart.js Actions 추가

차트 canvas 아래에 여러 action 버튼들을 추가해 동작하도록 작성해보았다.

- chartjs 생성 함수에서 차트 생성 후 emit 이벤트를 발신
- 차트 컴포넌트에서 chart 객체를 event.detail 로 받아 $state 변수에 저장
- 차트 컴포넌트에서 chart 객체를 파라미터로 넣어 다양한 action 함수들을 연결

참고 : [공식문서 - Line Chart with Actions](https://www.chartjs.org/docs/latest/samples/line/line.html)

> 화면캡쳐

![](/2024/04/21-svelte5-chartjs-line-actions.gif){: width="560" .w-75}
_chartjs-line-with-actions_

> sales-section.svelte (Parent 컴포넌트)

```svelte
<script>
  import { bindLineChart, lineChartActions } from './chartjs-line.svelte';
</script>

<!-- Chart #3 (with Actions) -->
<ChartCard
  title="$35,8K"
  description="Overall Revenue"
  options={[
    { value: 'monthly', name: 'Monthly' },
    { value: 'yearly', name: 'Yearly' },
  ]}
  chartfn={bindLineChart}
  class="2xl:w-5/12"
  actions={lineChartActions}
></ChartCard>
```

> chartjs-line.svelte.js (js 모듈)

```js
import { Chart as ChartJS } from 'chart.js/auto';
import * as Utils from '$lib/utils/chartjs-utils';

export const lineChartActions = [
  {
    name: 'Randomize',
    /** @param { import('chart.js').Chart } chart */
    handler(chart) {
      chart.data.datasets.forEach((dataset) => {
        if (chart.data.labels)
          dataset.data = Utils.numbers({ count: chart.data.labels.length, min: -100, max: 100 });
      });
      chart.update();
    },
  },
  { name: 'Add Dataset', handler(chart) {...} },
  { name: 'Add Data', handler(chart) {...} },
  { name: 'Remove Dataset', handler(chart) {...} },
  { name: 'Remove Data', handler(chart) {...} },
];

////////////////////////////////////////////////

/** @param { HTMLCanvasElement } node */
export function bindLineChart(node) {
  // create chartjs
  // ...

  // 차트가 생성되면 emit 이벤트를 발신(dispatch)
  node.dispatchEvent(new CustomEvent('emit', { detail: lineChart }));

  return {...};
}  
```

> chart-card.svelte (Child 컴포넌트)

- 상위 컴포넌트에서 actions 를 전달받고 action 버튼 생성
- chart 생성 함수에서 전달한 chart 객체를 저장하고 action handler 함수에 전달

```svelte
<script>
  /** @type { {
   *    title: string,
   *    description: string,
   *    options: any[],
   *     chartfn: (node: HTMLCanvasElement) => {destroy(): void;} | undefined,
   *     actions?: {name:string, handler(chart:import('chart.js').Chart):void}[],
   *     class?: string,
   *  } }
   * */
  let { title, description, options, chartfn, actions, ...restProps } = $props();
  let customClass = restProps.class ?? 'lg:w-1/2 xl:w-7/12 2xl:w-5/12';
  let chart = $state(undefined);

  /**
   * chart 하위 컴포넌트에서 emit 이벤트 발생시 실행되는 함수
   * @param {CustomEvent} event
   */
  function handleEmit(event) {
    /** @type { import('chart.js').Chart | undefined } */
    chart = event.detail ?? undefined;
  }
</script>

<!-- Line 차트 -->
<div class="flex h-[380px] items-center justify-center">
  {#if chartfn !== undefined}
    <canvas class="my-4" on:emit={handleEmit} use:chartfn></canvas>
  {/if}
</div>

<!-- Actions 버튼 그룹 -->
{#if actions}
  <div class="join mt-6 flex place-content-center gap-2">
    {#each actions as action}
      <button
        class="btn join-item bg-primary-content {!chart && 'btn-disabled'}"
        onclick={() => {
          console.log('action clicked:', action.name, !!chart);
          if (chart) action.handler(chart);
        }}>{action.name}</button
      >
    {/each}
  </div>
{/if}
```

## 9. Review

- 테이블, 다이얼로그 입력박스 등 나머지는 다음에..
  - 테이블 코드는 daisyui 샘플 코드를 붙여 넣었다.
  - 테이블에 thead 와 tbody 만 있는줄 알았는데, tfoot 도 있었다.
- 차트 컴포넌트 구현시 [svelte-chartjs](https://github.com/SauravKanchan/svelte-chartjs) 를 써도 되지만, svelte5 연습을 위해 사용하지 않았다.
  - 본래 Svelte 의 장점은 js 라이브러리들을 자유롭게 사용할 수 있다는 점이었다.
- 화면을 동영상 캡쳐해서 animated GIF 파일로 변환하는게 번거롭다. (쉬운 방법 없나?)


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
