---
date: 2022-02-10 00:00:00 +0900
title: Mac용 설치패키지 dmg 만들기
description: Mac 배포용 dmg 파일을 만들기 위해 pgAdmin4 대상으로 연습한 내용을 기록합니다.
categories: [DevOps, Packaging]
tags: [dmg, mac, dmg-icon]
image: /2022/02/10_02-dmg-image-view-w640.png
---

## create-dmg 를 이용한 dmg 생성

- 배포용 dmg 아이콘 : dmg-icon.icns
- 배포용 dmg 의 배경 이미지: dmg-background.png (1600 x 800)
- dmg 의 App 아이콘과 Application 아이콘의 크기 및 위치
  - `.DS_Store` 사용시, 아이콘의 위치와 크기 등은 `.DS_Store` 파일에 의해 결정됨

### pgAdmin4 의 create-dmg 과정

- [create-dmg](https://github.com/create-dmg/create-dmg.git) 다운로드
- dmg 생성을 위한 파라미터 설정 후 실행
  - `${BUNDLE_DIR}` 내용을 묶어서 `${DMG_NAME}` 에 dmg 생성

```shell
_create_dmg() {
    # move to the directory where we want to create the DMG
    test -d ${DIST_ROOT} || mkdir ${DIST_ROOT}

    echo "Checking out create-dmg..."
    git clone https://github.com/create-dmg/create-dmg.git "${BUILD_ROOT}/create-dmg"

    "${BUILD_ROOT}/create-dmg/create-dmg" \
        --volname "${APP_NAME}" \
        --volicon "${SCRIPT_DIR}/dmg-icon.icns" \
        --eula "${SCRIPT_DIR}/licence.rtf" \
        --background "${SCRIPT_DIR}/dmg-background.png" \
        --app-drop-link 600 220 \
        --icon "${APP_NAME}.app" 200 220 \
        --window-pos 200 120 \
        --window-size 800 400 \
        --hide-extension "${APP_NAME}.app" \
        --add-file .DS_Store "${SCRIPT_DIR}/dmg.DS_Store" 5 5 \
        --format UDBZ \
        --skip-jenkins \
        --no-internet-enable \
        "${DMG_NAME}" \
        "${BUNDLE_DIR}"
}
```

### `.DS_Store` 파일 만들기

`.DS_Store` 파일은 Finder 에서 보여지는 형식을 저장한 hidden 파일로, 해당 폴더의 내용을 아이콘 보기로 설정할 경우 아이콘의 크기와 위치까지 저장합니다. dmg 실행시 보여지는 파일 보기는 `.DS_Store`의 설정 내용대로 보여지기 때문에 dmg 생성시 함께 저장하면 원하는 아이콘의 위치와 크기로 보여지도록 설정할 수 있습니다.

- 수정 필요시 DiskUtility 로 새 Image 생성 후 app 파일과 Application 링크 복사 후 위치와 크기를 조정
  - 조정 후 변경된 .DS_Store 파일을 복사해서 dmg.DS_Store 파일로 저장하고 배포
- 배경화면은 Finder 보기 옵션에서 ‘그림’ 항목을 선택후 Drag&Drop 하면 반영됨 (위치 확인용으로만 사용)
  - 실제 배경화면은 background 옵션으로 저장된 이미지가 적용됨

![dmg-image-new](/2022/02/10_01-dmg-image-new.png){: width="540"}

![dmg-image-view](/2022/02/10_02-dmg-image-view-w640.png){: width="540"}

![dmg-image-files](/2022/02/10_03-dmg-image-files-w640.png){: width="540"}

&#91;주의&#93; `.DS_Store` 내용과 다른 파일명 변경 금지 <br>
`.DS_Store` 파일은 파일의 이름까지 저장하기 때문에 dmg에 들어가는 파일의 이름을 변경하면 설치 화면이 깨지는 원인이 됩니다. 아니면 `.DS_Store` 을 다시 만들던지. (여기서 많이 헤맸음)<br>

### icns 파일 만들기

icns 는 여러 해상도의 아이콘 파일을 포함하는 이미지 묶음입니다.

- [create_icns.sh](https://github.com/julioasotodv/bokeh-starlette-electron-app/blob/master/create_icns.sh) 이용해 생성
  - 1024x1024 (dpi 144) 이미지 한장으로 다른 사이즈 이미지를 생성하고 하나로 묶어줌
  - 동일 크기라도 `dpi 72`와 `dpi 144` 사이즈 두장이 생성됨 (200배율용)

```shell
# sips 을 이용하여 여러 사이즈의 이미지를 축소하고 iconutil 로 icns 생성
$ sh create_icns.sh dmg-icon_1024x1024.png
```

`create_icns.sh` 파일 내용

```shell
#!/bin/bash
IFS='.' read -ra ADDR <<< "$1"
ICONSET=${ADDR[0]}.iconset
mkdir $ICONSET
sips -z 16 16     $1 --out $ICONSET/icon_16x16.png
sips -z 128 128   $1 --out $ICONSET/icon_128x128.png
sips -z 256 256   $1 --out $ICONSET/icon_128x128@2x.png
sips -z 256 256   $1 --out $ICONSET/icon_256x256.png
sips -z 512 512   $1 --out $ICONSET/icon_256x256@2x.png
sips -z 512 512   $1 --out $ICONSET/icon_512x512.png
sips -z 1024 1024 $1 --out $ICONSET/icon_512x512@2x.png
cp $1 $ICONSET/icon_1024x1024@2x.png
iconutil -c icns $ICONSET
rm -R $ICONSET%
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
