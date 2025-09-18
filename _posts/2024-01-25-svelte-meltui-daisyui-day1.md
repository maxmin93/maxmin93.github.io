---
date: 2024-01-25 00:00:00 +0900
title: melt-ui daisyui 컴포넌트 - 1일차
description: headless UI 컴포넌트인 melt-ui 와 tailwind 컴포넌트 라이브러리인 daisyUI 를 결합하여 svelte UI 컴포넌트를 작성하는 연습을 합니다. 분량이 많아서 연재로 차근차근 연습합니다.
categories: [Frontend, Svelte]
tags: ["daisyui","melt-ui","ui-components","1st-day"]
image: "https://miro.medium.com/v2/resize:fit:1019/1*nzMmDquNelU0m4v_Z2LnZA.png"
hidden: true
---

> 목록
{: .prompt-tip }

- [melt-ui daisyui 컴포넌트 - 1일차](/posts/svelte-meltui-daisyui-day1/) : checkbox &nbsp; &#10004;


## 0. 개요

- [x] 웹프레임워크 및 개발도구
  - Bun 1.0.25 + Vite 5.0.3 + SvelteKit 2.0.0
  - prettier 3.1.1
  - [prettier-plugin-svelte](https://www.npmjs.com/package/prettier-plugin-svelte) 3.1.2
- [x] CSS 유틸리티
  - TailwindCSS 3.4.1 (typography) + postcss 8.4.33
  - [prettier-plugin-tailwindcss](https://www.npmjs.com/package/prettier-plugin-tailwindcss) 0.5.11
  - [vite-plugin-tailwind-purgecss](https://www.npmjs.com/package/vite-plugin-tailwind-purgecss) 0.1.4
  - [tailwind-merge](https://www.npmjs.com/package/tailwind-merge) 2.1.0
  - [tailwind-variants](https://www.npmjs.com/package/tailwind-variants)
- [x] UI 라이브러리
  - fonts : D2Coding, Noto Sans/Serif KR, Noto Color Emoji
  - [lucide-svelte](https://www.npmjs.com/package/lucide-svelte) 0.295.0 (아이콘 1346개, ISC 라이센스)
  - [daisyui](https://www.shadcn-svelte.com/) 4.6.0
  - [melt-ui](https://melt-ui.com/docs/) 0.70.0
  - [svelte-legos](https://sveltelegos.com/guides/) 0.2.2
- [x] 유틸리티
  - [faker-js](https://www.npmjs.com/package/@faker-js/faker) 8.3.1
  - [drizzle-orm](https://orm.drizzle.team/docs/) 0.29.3
  - [svelte-persisted-store](https://www.npmjs.com/package/svelte-persisted-store) 0.9.0

## 0. 프로젝트 생성

### [SvelteKit](https://kit.svelte.dev/) 프로젝트 생성

```bash
bun create svelte@latest melt-daisy-app
  # - Skeleton project
  # - Typescript
  # - Prettier

cd melt-daisy-app
bun install

bun run dev
```

### tailwind + daisyUI + melt-ui 설정

참고 : [이전 블로그 - Svelte Server Pagination](/posts/svelte-server-pagination/)

### 디렉토리 구조

- src/routes
  - +layout.svelte
  - `(base)`
    + +layout.svelte : header(with menu), main(content)
    - components
      - +layout.svelte : main(content)
      - checkbox
        - +page.svelte

## 1. Tailwind CSS - Grid



## 2. melt-ui vs daisyUI 

### 컴포넌트 비교 (daisyUI 중심)

| 구분 | <mark>daisyUI</mark> | <mark>melt-ui</mark> | 비교 |
| ---- | ------- | ------- | ---- |
| <b>Actions</b> | [Button](https://daisyui.com/components/button/) | [✖] | 색상과 스타일, 애니메이션 효과를 포함  |
|   | [Dropdown](https://daisyui.com/components/dropdown/) | [Dropdown Menu](https://melt-ui.com/docs/builders/dropdown-menu) | 스크립트 없어도 사용 가능  |
|   | [Modal](https://daisyui.com/components/modal/) | [Dialog](https://melt-ui.com/docs/builders/dialog) | showModal() 함수 포함  |
|   | [Swap](https://daisyui.com/components/swap/) | [✖] |   |
| <b>Data display</b> | [Accordion](https://daisyui.com/components/accordion/) | [Accordion](https://melt-ui.com/docs/builders/accordion) | daisyUI 사용 |
|   | [Collapse](https://daisyui.com/components/collapse/) | [Collapsible](https://melt-ui.com/docs/builders/collapsible) | daisyUI 사용 |
|   | [Avatar](https://daisyui.com/components/avatar/) | [Avatar](https://melt-ui.com/docs/builders/avatar) | daisyUI 사용 (fallback 필요) |
|   | [Badge](https://daisyui.com/components/badge/) | [Tags Input](https://melt-ui.com/docs/builders/tags-input) |    |
|   | [Card](https://daisyui.com/components/card/) | [✖] |    |
|   | [Carousel](https://daisyui.com/components/carousel/) | [✖] | [auto-play 스크립트 필요](https://github.com/saadeghi/daisyui/discussions/1488#discussioncomment-4605801)   |
|   | [Chat bubble](https://daisyui.com/components/chat/) | [✖] |    |
|   | [Countdown](https://daisyui.com/components/countdown/) | [✖] |    |
|   | [Diff](https://daisyui.com/components/diff/) | [✖] | 두 영역의 겹칩 가로 비율 조정  |
|   | [Kbd](https://daisyui.com/components/kbd/) | [✖] | 키보드   |
|   | [Stat](https://daisyui.com/components/stat/) | [✖] | 대시보드 수치값  |
|   | [Table](https://daisyui.com/components/table/) | [✖] |  출력만 제공  |
|   | [Timeline](https://daisyui.com/components/timeline/) | [✖] |    |
|   | [✖] | [Table Of Contents](https://melt-ui.com/docs/builders/table-of-contents) | 제목 태그를 추출해 트리 출력   |
| <b>Navigation</b> | [Breadcrumbs](https://daisyui.com/components/breadcrumbs/) | [✖] | 현재 메뉴 경로 출력   |
|   | [Bottom navigation](https://daisyui.com/components/bottom-navigation/) | [✖] | 모바일 하단 메뉴바   |
|   | [Link](https://daisyui.com/components/link/) | [✖] | 헤더 메뉴바에 사용 |
|   | [Menu](https://daisyui.com/components/menu/) | [Tree](https://melt-ui.com/docs/builders/tree), [Menubar](https://melt-ui.com/docs/builders/menubar) | 간단한 메뉴는 daisyUI 사용 |
|   | [Navbar](https://daisyui.com/components/navbar/) | [Toolbar](https://melt-ui.com/docs/builders/toolbar) | 간단한 메뉴는 daisyUI 사용   |
|   | [Pagination](https://daisyui.com/components/pagination/) | [Pagination](https://melt-ui.com/docs/builders/pagination) | melt-ui 는 페이지 자동 계산   |
|   | [Steps](https://daisyui.com/components/steps/) | [✖] | 단계 안내   |
|   | [Tab](https://daisyui.com/components/tab/) | [Tabs](https://melt-ui.com/docs/builders/tabs) | daisyUI 사용   |
| <b>Feedback</b> | [Alert](https://daisyui.com/components/alert/) | [✖] | 출력 제어 필요   |
|   | [Loading](https://daisyui.com/components/loading/) | [✖] | 출력 제어 필요   |
|   | [Progress](https://daisyui.com/components/progress/),<br /> [Radial progress](https://daisyui.com/components/radial-progress/) | [Progress](https://melt-ui.com/docs/builders/progress) | value 제어 필요   |
|   | [Skeleton](https://daisyui.com/components/skeleton/) | [✖] | 출력 제어 필요 (로딩 실패시)  |
|   | [Toast](https://daisyui.com/components/toast/) | [Toast](https://melt-ui.com/docs/builders/toast) | 출력과 애니메이션 필요 |
|   | [Tooltip](https://daisyui.com/components/tooltip/) | [Tooltip](https://melt-ui.com/docs/builders/tooltip) |  텍스트 출력만 가능  |
|   | [✖] | [Popover](https://melt-ui.com/docs/builders/popover),<br /> [Context Menu](https://melt-ui.com/docs/builders/context-menu) | 특정 위치에 매인 Modal 출력 |
| <b>Data input</b>  | [Checkbox](https://daisyui.com/components/checkbox/) | [Checkbox](https://melt-ui.com/docs/builders/checkbox) |  daisyUI 사용  |
|   | [File Input](https://daisyui.com/components/file-input/) | [✖] |    |
|   | [Radio](https://daisyui.com/components/radio/) | [Radio Group](https://melt-ui.com/docs/builders/radio-group) |  name 으로 그룹화  |
|   | [Rating](https://daisyui.com/components/rating/), [Range](https://daisyui.com/components/range/) | [Slider](https://melt-ui.com/docs/builders/slider) | value 제어 필요   |
|   | [Select](https://daisyui.com/components/select/) | [Select](https://melt-ui.com/docs/builders/select),<br /> [Combobox](https://melt-ui.com/docs/builders/combobox) | selected 제어 필요  |
|   | [Text input](https://daisyui.com/components/input/) | [Label](https://melt-ui.com/docs/builders/label),<br /> [PIN Input](https://melt-ui.com/docs/builders/pin-input) | size 제어 가능, label 별도 |
|   | [Textarea](https://daisyui.com/components/textarea/) | [✖] | label 예제 포함 |
|   | [Toggle](https://daisyui.com/components/toggle/) | [Toggle](https://melt-ui.com/docs/builders/toggle),<br /> [Switch](https://melt-ui.com/docs/builders/switch) | check 입력 사용  |
| <b>Date input</b> | [✖] | [Calendar](https://melt-ui.com/docs/builders/calendar),<br /> [Range Calendar](https://melt-ui.com/docs/builders/range-calendar) | 연월일 계산값을 테이블로 출력하고 event 처리  |
|   | [✖] | [Date Field](https://melt-ui.com/docs/builders/date-field),<br /> [Date Range Field](https://melt-ui.com/docs/builders/date-range-field) | 입력 필드 (달력 없음) |
|   | [✖] | [Date Picker](https://melt-ui.com/docs/builders/date-picker),<br /> [Date Range Picker](https://melt-ui.com/docs/builders/date-range-picker) |  입력 필드 + 달력 포함  |
| <b>Layout</b> | [Artboard](https://daisyui.com/components/artboard/) | [✖] |    |
|   | [Divider](https://daisyui.com/components/divider/) | [Separator](https://melt-ui.com/docs/builders/separator) |    |
|   | [Drawer](https://daisyui.com/components/drawer/) | [✖] |  사이드 출현 메뉴  |
|   | [Footer](https://daisyui.com/components/footer/) | [✖] |    |
|   | [Hero](https://daisyui.com/components/hero/) | [✖] |  min-h-(사이즈) 필요  |
|   | [Indicator](https://daisyui.com/components/indicator/) | [✖] |    |
|   | [Join (group items)](https://daisyui.com/components/join/) | [Toggle Group](https://melt-ui.com/docs/builders/toggle-group) | 아이템(버튼)들의 상태값 변경 관리 |
|   | [Mask](https://daisyui.com/components/mask/) | [✖] | 테두리 모양   |
|   | [Stack](https://daisyui.com/components/stack/) | [✖] | 겹침 상태 (사라질때 애니 필요)   |


### 결론

- Date 관련 컴포넌트는 melt-ui 사용 (선택의 여지가 없고)
- daisyUI 를 사용하는 것이 기본 선택 (writable 함께 사용)
- 코드에서 mediaQuery 제어가 필요하면, svelte-legos 와 svelte-variants 사용

## 3. checkbox

> 참고

- [melt-ui - checkbox](https://melt-ui.com/docs/builders/checkbox)
- [daisyui - checkbox](https://daisyui.com/components/checkbox/)

### 코드

```html
<script lang="ts">
  import { createCheckbox, melt } from '@melt-ui/svelte';
  import { Minus } from 'lucide-svelte';
  import { writable } from 'svelte/store';

  export let label = 'Remember me';
  export let checked = writable<boolean | 'indeterminate'>('indeterminate');

  const {
    elements: { root, input },
    helpers: { isIndeterminate }
  } = createCheckbox({
    checked: checked
  });
  $: console.log('checked:', $checked, `(${$isIndeterminate})`);
</script>

<div class="form-control flex-row items-center">
  <button class="checkbox-secondary checkbox" use:melt={$root} id="checkbox">
    {#if $isIndeterminate}
      <Minus class="w-5 text-secondary" />
    {/if}
    <input type="checkbox" use:melt={$input} />
  </button>
  <label class="label cursor-pointer" for="checkbox">
    <span class="label-text">{label}</span>
  </label>
</div>
```

## 9. Review

- 작성중

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
