---
date: 2022-02-04 00:00:00 +0900
title: Mac용 App 패키징 할 때 서명 및 공증 (Apple M1)
description: 맥 OS용 네이티브 웹앱을 패키징하고 배포하기 위해 필요한 `codesign`(개발자 서명)과 `notarization`(인증기관 공증)에 대해 pgAdmin4 를 가지고 연습해 보았습니다.
categories: [DevOps, Packaging]
tags: [mac, codesign, 공증]
image: https://devimages-cdn.apple.com/wwdc-services/images/48/2970/2970_wide_250x141_2x.jpg
---

## 패키징 예제 [pgAdmin4](https://github.com/postgres/pgadmin4)

pgAdmin4는 postgresql을 위한 클라이언트로 다양한 OS에 설치하여 pg 데이터베이스에 연결을 설정하고 쿼리를 실행할 수 있습니다. Dwonload 페이지에 가보면 OS별로 배포 가능한 바이너리들이 링크되어 있습니다. 이것들은 웹기반의 네이티브 애플리케이션 개발도구인 크로스 플랫폼 [nwjs](https://nwjs.io/)를 사용하여 생성된 설치 가능한 패키지들입니다.

&#91;TIP&#93; 알 수 없는 개발자에 의한 앱 설치 허용 방법

신뢰할 수 없는 애플리케이션이라면서 아무런 notification 없이 설치가 안되면 Mac 의 설정 메뉴에서 `보안 및 개인정보보호 > 일반` 탭 이동 후, 하단의 `다음에서 다운로드한 앱 허용` 항목을 보면 설치가 실패한 애플리케이션이 표시 되어 있을겁니다. 이를 **허용** 시키면 설치(실행)됩니다.

### pgAdmin의 패키징 가능한 OS 플랫폼

`$PGADMIN4_SRC/pkg` 폴더에 OS별로 패키징 스크립트가 있습니다. 이중에서 mac용 패키징을 시도합니다.

![pgadmin4_src_pkg](/2022/02/pgadmin4-pkgs.png){: width="540" .w-75}

`make appbundle` 명령에 의해 생성된 Mac 용 App입니다.

![pgadmin4_built_app](/2022/02/pgadmin4-built-app.png){: width="540" .w-75}

## Mac용 App 패키징 절차

Mac용 앱의 서명과 공증 작업을 위해서는 Apple Developer ID 발급 등의 사전작업이 필요합니다.

### 사전 작업

1. Apple Developer ID 발급

이에 대한 매뉴얼은 인터넷에 많이 있습니다. 저는 ['맥OS앱 코드사인 및 공증하기'](http://cwyang.github.io/2020/12/09/osx-codesign-notarization.html) 문서를 참조했습니다.

- [Apple Developer 사이트](https://developer.apple.com/)에서 개발자 등록하기

개발자 등록을 안한 상태에서는 그림의 빨간 박스 내용이 없습니다.

![Account - Apple Developer](/2022/02/Account-AppleDeveloper.png){: width="540" .w-75}

개발자 등록비는 1년에 12만9천원입니다. (2022년 2월 기준) 한번 시도해 보는데 13만원이라는 돈이 아까울 수 있지만, 다른 방법이 없습니다. 1년간 애플용 앱개발 공부하는 들어가는 수업료라고 생각하고 지르세요.

![Apple Developer-등록비용](/2022/02/AppleDeveloper-reg-price.png){: width="540" .w-75}

2. 인증서 발급

인증서 발급을 위해 [인증서 메뉴](https://developer.apple.com/account/resources/certificates)로 이동하여 인증서 추가를 합니다.

![Certificates-Developer](/2022/02/Certificates-Developer.png){: width="540" .w-75}

인증서 타입에 여러가지가 있는데, codesign 용도로 발급하기 위해 'Developer ID Application' 항목을 선택합니다. (This certificate is used to code sign your app for distribution outside of the Mac App Store.)

- 인증서 요청을 위해 본인의 개발자 정보를 담은 요청서 파일(cer)을 작성해야 합니다.

본인의 개발장비에서 '키체인' 실행 후, 메뉴 `키체인 접근 > 인증서 지원 > 인증기관에서 인증서 요청`를 선택하면 입력창이 뜹니다. 입력 항목은 간단합니다. 애플 개발자 등록에 사용할 이메일과 이름을 작성하고, 요청항목에 **_"디스크에 저장됨"_**을 선택합니다.

- 요청서 파일을 첨부하여 선택한 인증서 타입으로 인증서 생성을 요청합니다. (앞의 요청서 파일을 넣지 않으면 continue 버튼이 활성 상태로 바뀌지 않습니다!!)

![Certificates Request](/2022/02/CertificatesRequest.png){: width="540" .w-75}

- 생성된 인증서를 본인 개발장비의 키체인에 등록하기 위해 파일로 다운로드 합니다.

![Certificates Download](/2022/02/CertificatesDownload.png){: width="540" .w-75}

3. 인증서를 키체인에 등록하고, ASP 설정하여 xcode로 인증서 확인하기

- 다운로드한 인증서(이것도 확장명이 cer)를 키체인에 등록합니다.

![keyChain](/2022/02/keyChain.png){: width="540" .w-75}

- [appleid.apple.com](https://appleid.apple.com/account/manage)에서 ASP(App-Specific-Password)를 등록합니다.

'ASP'는 메뉴 한글명으로 '앱 암호'라고 되어 있는데, 실제 암호는 아니고 개발자 ID를 대신하는 '계정 코드'정도로 이해하시면 됩니다. 입력하는 키워드는 '용도'를 나타내기 때문에 사용 목적에 맞춰 적당히 이름을 넣으면 됩니다. (ex: pg개발)

![AppleID-ASP](/2022/02/AppleID-ASP-w640.png){: width="540" .w-75}

![AppleID-ASP-input](/2022/02/AppleID-ASP-input.png){: width="540" .w-75}

생성된 ASP(웹암호)는 `abcd-efgh-ijkl-mnop` 형식으로 되어 있습니다. 이후 인증서 공증처럼 Apple 서비스에 로그인 할 때 ID 대신에 사용되는 용도로 활용됩니다.

![APP_SPECIFIC_PASSWORD](/2022/02/APP_SPECIFIC_PASSWORD.png){: width="540" .w-75}

- xcode 도구를 이용해 등록한 인증서가 잘 작동하는지 확인합니다. (altool은 xcode 설치가 되어 있어야 사용할 수 있습니다. 안깔았으면 까세요.)

```shell
$ xcrun altool --list-providers -u "maxmin93@gmail.com" -p "${ASP}"
ProviderName   ProviderShortname PublicID                             WWDRTeamID
-------------- ----------------- ------------------------------------ ----------
Byeong-Guk Min X*********        e*******-8****-4****-8****-b******* X*********
```

인증서가 잘 작동한다면 위와 같이 출력될 것이고, (개인용 개발자 등록시) 그 중에 **'ProviderShortname'**을 공증 과정에서 `asc-provider`항목으로 사용할 것입니다.

### pgAdmin appbundle 작업

pgAdmin4의 Mac용 패키징 과정에 필요한 파일 2개가 있습니다.

- 서명을 위한 설정 파일 'codesign.conf'

```shell
# '12345ABCD'는 ${ProviderShortname}을 입력

DEVELOPER_ID="Developer ID Application: My Name (12345ABCD)"
```

- 공증을 위한 설정 파일 'notarization.conf'

```shell
# '12345ABCD'는 ${ProviderShortname}을 입력

DEVELOPER_USER="maxmin93@gmail.com"
DEVELOPER_ASP="****-****-****-****"
DEVELOPER_NAME="12345ABCD"
```

- 설정 파일이 잘 작성되었으면 `make appbundle`으로 전체 빌드 실행

![pgadmin4-makeAppbundle-head](/2022/02/pgadmin4-makeAppbundle-head-w640.png){: width="540" .w-75}
![pgadmin4-makeAppbundle-tail](/2022/02/pgadmin4-makeAppbundle-tail-w640.png){: width="540" .w-75}

### 개별적인 서명과 공증 사용

- 서명 사용시

```shell
# DEVELOPER_ID="Developer ID Application: My Name (12345ABCD)"
# DMG_NAME={dmg 파일경로}

codesign --force --verify --verbose --timestamp \
             --options runtime \
             -i org.pgadmin.pgadmin4 \
             --sign "${DEVELOPER_ID}" \
             "${DMG_NAME}"
```

- 공증 사용시

```shell
# '12345ABCD'는 ${ProviderShortname}을 입력
# 'abcd-efgh-ijkl-mnop'는 ${ASP}을 입력

# 인증서 확인
$ xcrun altool --list-providers -u "maxmin93@gmail.com" -p "abcd-efgh-ijkl-mnop"

# 공증 요청
$ xcrun altool --notarize-app -f "$PGADMIN4_SRC/pkg/../dist/pgadmin4-6.4.dmg" --asc-provider "12345ABCD" --primary-bundle-id org.pgadmin.pgadmin4 -u "maxmin93@gmail.com" -p "abcd-efgh-ijkl-mnop"

# 공증 응답 확인
$ xcrun altool --notarization-info "${공증 요청 ID}" --username "maxmin93@gmail.com" --password "abcd-efgh-ijkl-mnop"
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
