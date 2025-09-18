---
date: 2025-02-24 00:00:00 +0900
title: 쇼핑몰 개발 도구 비교 
description: 제 나름의 기준으로 쇼핑몰 제작 도구(플랫폼)들을 조사하고 사용해본 느낌을 비교하여 정리했습니다.
categories: [DevOps]
tags: [쇼핑몰, cafe24, imweb]
image: "https://velog.velcdn.com/images/jaeiklee-dev/post/1f9101dd-0bd4-496f-9297-f64c161d827a/image.png"
---

## 0. 요구사항

> 지역 농산물을 구매대행하여 소비자와 연결해 주는 쇼핑몰을 만들고 싶어요. 메인 페이지에는 바로 상품들의 타일 형태의 리스트가 나오고, 상품의 상세 페이지에서 공유 링크를 복사해 여러 사이트에 복사할 수 있어요. 상품평을 작성할 수 있고, 장바구니와 간편결재 기능이 있고 배송 상태를 확인할 수 있어야 해요. 마지막으로 홍보를 위해 카톡, 밴드 등에 상세페이지에 대한 링크를 생성할 수 있어야해요.

### 농산물 직거래 관련 유사 사이트

기본적으로 다들 PC 버전, 모바일 버전 웹페이지를 가지고 있다. 

- [제주농산](https://jejuns.kr/)
- [이제주몰](https://mall.ejeju.net/)
- [삼다몰](https://samdamall.com/) : 제주 특산물 쇼핑몰
  - 카톡 쇼핑몰 이용 (톡딜) : 링크 제공시 더 이쁘고 상세하게 나옴
- [탐나오](https://www.tamnao.com/) : 제주도 공공플랫폼
- [제주자연농장](https://jejunaturefarm.com/)
- [피키마트](https://www.pickymart.co.kr/)
- [탐라오렌지](https://tamraorange.com/)
  - 종류도 몇개 안되지만, 제철이 끝나면 상품이 없다. (품절)


## 1. 웹사이트 개발도구 비교

자체 개발보다는 웹사이트 개발도구(플랫폼)를 이용하는 것이 비용과 노력 측면에서 장점이 많아 사용하지 않을 이유가 없다. 요즘은 노코드 툴이 유행이라 다루기도 한층 편리해졌다.

> 국내 플랫폼

사용량 비교를 위해 프리랜서 사이트 [크몽](https://kmong.com/)의 검색량을 확인했다. 카페24로 쇼핑몰을 개발한다는 개발자의 수가 압도적으로 많다.

- [아임웹](https://imweb.me/) : 6페이지 분량의 개발자들
- [고도몰](https://godomall.nhn-commerce.com/) : 3페이지 분량의 개발자들
- [카페24](https://www.cafe24.com/) : 14페이지 분량의 개발자들
  - 참고 : [카페24 블로그 - 전자상거래 플랫폼 시장 점유율 70%](https://www.cafe24.com/story/why_cafe24.html)

> 해외 플랫폼

- [WIX](https://ko.wix.com/) : 2페이지 분량의 개발자들
- [Shopify](https://www.shopify.com/kr) : 3페이지 분량의 개발자들

### 국내 플랫폼 비교

> 아임웹

- 무료 버전에서는 5 페이지 이하 제한과 상품수 제한, 트래픽 제한이 있다.
  - [카카오페이](https://imweb.me/faq?mode=view&category=29&category2=39&idx=71717)는 [PG 신청](https://imweb.me/faq?mode=view&category=29&category2=39&idx=71419)할 때 함께 신청하고, [네이버페이](https://imweb.me/faq?mode=view&category=29&category2=39&idx=71574)는 Pro 버전부터 가능
- 간단한 또는 일반적인 형태의 사이트를 구축한다면 추천
- 비주얼 디자인 도구를 갖추고 사용자 친화적으로 다룰 수 있도록 노력했다
- 외형상 Shopify 와 WIX 를 따라할려고 노력한 흔적이 보인다.
- HTML 코드를 직접 수정할 수 있다고는 하지만 만질 수 있는 부분은 거의 없다.
  - 공통코드를 삽입하거나 사용자 위젯을 등록시킨후 배치시킬 수 있을뿐
  - 대신에 코드를 만질 필요가 없을만큼 사용자 인터페이스를 강화시켜 놓았다. 

![](/2025/02/24-imweb-admin-home.png){: width="560" .w-75}
_imweb-admin-home_

![](/2025/02/24-imweb-design-home.png){: width="560" .w-75}
_imweb-design-home_

> 고도몰

- 한달간은 무료이다. 이후 호스팅 비용 청구.
- 워드프레스(PHP) 기반이고
- 템플릿이 old-style 이다. 
- 반응형이 일부 있긴 하지만 대다수 PC / 모바일로 구분되어 있다. 
- 인기가 없으니깐 지원도 잘 안되면서 쇠락하는 흔적이 보인다.

![](/2025/02/24-godomall-admin-home.png){: width="560" .w-75}
_godomall-admin-home_

![](/2025/02/24-godomall-design-html.png){: width="560" .w-75}
_godomall-design-html_

> 카페24

- 개발과 운영에 필요한 대부분의 기능이 모두 무료이다. (독립적인 호스팅이 아님)
  - 도메인 비용, PG 수수료, 확장 기능 등에만 비용이 필요하다.
  - 실시간 주문데이터 확인도구를 추가하면 비용이 든다. (주문이 많은 대형 사이트)
- 섹션별로 나누어져 있고, 비주얼 디자인 도구와 HTML 직접 수정도 가능하다
- 반응형 템플릿이 많다.
- 웹사이트 생성을 도와주는 AI 챗봇이 있기는 한데 작성한 컨셉에 자유롭게 반응하지는 않아 보인다. 서너개의 선택지에서 색감이나 적용되는 정도? 
- 크몽에서 나타나듯이 다룰 수 있는 개발자가 많아 작업 의뢰가 수월하다.
- 요즘 [유튜브 쇼핑 제휴](https://www.cafe24.com/youtubeshopping/affiliate-about.html?tab=tabCreator) 기능으로 매출이나 주가 성장성이 높다.
  - 유튜브의 쇼핑 광고 기능에 사용하기 쉽도록 [상품을 등록](https://www.cafe24.com/youtubeshopping/affiliate.html#/search)하고 URL 을 제공
  - 유튜브 동영상에 나타나는 상품에 [스토어의 URL 을 태깅](https://support.google.com/youtube/answer/12258186?hl=ko&sjid=16441425602341260885-NC#)하면 된다.

![](/2025/02/24-cafe24-admin-home.png){: width="560" .w-75}
_cafe24-admin-home_

![](/2025/02/24-cafe24-design-home.png){: width="560" .w-75}
_cafe24-design-home_

### 해외 플랫폼 비교

해외 플랫폼은 최신 트렌드를 반영한 HTML 템플릿과 쾌적한 콘텐츠 서버를 구비해 글로벌 비즈니스에 적합하도록 되어 있다. 다만, 마케팅 하는 방법이 미국 스타일(할인코드와 프로모션 같은)이라 국내 스타일과 달라 망설여지는 원인이 된다.

> WIX

- [요금제](https://manage.wix.com/premium-purchase-plan/dynamo?siteGuid=3dd544ae-9f46-4f35-bf87-3f7c2599f388) : 월 11달러 ~ 24달러 (라이트, 코어, 비즈니스)

![](/2025/02/24-wix-admin-home.png){: width="560" .w-75}
_wix-admin-home_

![](/2025/02/24-wix-design-home.png){: width="560" .w-75}
_wix-design-home_

> Shopify

- 3일 무료이용 이후 한달간은 1달러라 시작하기에 저렴하다.

![](/2025/02/24-shopify-admin-home.png){: width="560" .w-75}
_shopify-admin-home_

![](/2025/02/24-shopify-design-home.png){: width="560" .w-75}
_shopify-design-home_


## 2. ERP 기능

쇼핑몰을 위해서는 ERP 기능이 필요하고, 이에 대한 기능은 모든 플랫폼에 공통으로 가지고 있다. 카페24를 기준으로 살펴보자.

### 필요한 기능

제주 농산물을 판매하는 쇼핑몰의 한 상품을 예로 들어보면

- 회원(사용자), 리뷰
- 상품, 상품정보(가격, 수량)
- 주문(장바구니)
- 결재 : PG(카드), 간편결재
- 배송(송장)

![](/2025/02/24-tamra-detail-product.png){: width="560" .w-75}
_tamra-detail-product_

![](/2025/02/24-tamra-detail-reviews.png){: width="560" .w-75}
_tamra-detail-reviews_

### 카페24 ERP

![](/2025/02/24-cafe24-erp-dashboard.png){: width="560" .w-75}
_cafe24-erp-dashboard_

![](/2025/02/24-cafe24-erp-shipping.png){: width="560" .w-75}
_cafe24-erp-shipping_

![](/2025/02/24-cafe24-erp-members.png){: width="560" .w-75}
_cafe24-erp-members_


## 3. 디자인

카페24의 경우엔 [디자인 쇼핑몰](https://d.cafe24.com/home)이 따로 있다. [베스트 디자인](https://d.cafe24.com/best/best_design)의 경우 대략 20만원대이다.

> 참고

- [카페24 - 스마트 디자인 가이드](https://sdsupport.cafe24.com/board/tip/list_intro.html?board_no=5&category_no=2)
- [길자쌤의 쇼핑몰스쿨](https://youtu.be/Jkq22-cwCh0?si=2bx5ZFyZXAyQT95t) : 카페24 제작 강의

### 섹션

페이지를 기준으로 내용물인 콘텐츠 섹션을 추가/삭제 할 수 있다. 그 안에 배너라던지, 동영상, 지도, 캘린더 등의 콘텐츠 모듈을 선택해 넣으면 된다.

![](/2025/02/24-cafe24-design-section.png){: width="560" .w-75}
_cafe24-design-section_

### 콘텐츠 모듈

기본 콘텐츠 모듈들은 수정할 수 있는 도구가 함께 제공된다. 스마트 배너를 예로 들면, 섹션 안에 들어가야하는 이미지나 텍스트 같은 것들은 편집자가 등록하고 순서도 편집할 수 있다. 

- 참고 : [카페24-스마트디자인-변수와 모듈 이해하기](https://sdsupport.cafe24.com/board/tip/read_intro.html?no=191&board_no=5)

![](/2025/02/24-cafe24-design-module.png){: width="560" .w-75}
_cafe24-design-module_

### HTML

커스텀 HTML 섹션을 삽입한 경우, 해당 섹션에 표시될 HTML 을 작성할 수 있다.

![](/2025/02/24-cafe24-design-html.png){: width="560" .w-75}
_cafe24-design-html_


## 9. Review

- 카페24의 시장 점유율 70% 이면, 가만 놔 두어도 쏠림 현상으로 시장 독식이 될거 같다.
- 웹페이지 개발은 쉬워졌는데 자잘한 일들은 여전하다. AI 로 이미지, 상품 설명문구 등을 자동으로 생성한다는데 그것도 찾아봐야겠다.
- 실제로 작업을 하면 골때리는 경우를 만날 수 있으니 가급적 기본 모듈을 사용해야 할거다.


&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }