---
date: 2022-02-15 00:00:00 +0900
title: Windows용 인증서 및 App 서명
description: Windows용 네이티브 웹앱을 패키징하고 배포하기 위해 필요한 `signtool`(개발자 서명)과 `makecert`(서명자 생성)에 대해 `pgAdmin4`를 가지고 작업한 내용을 기록합니다.
categories: [DevOps, Packaging]
tags: [windows, 서명, 인증서]
image: /2022/02/15_04-SignWizard.png
---

## win32 인증서 및 서명

### 인증서 만들기

#### 참고 문서

- [실행파일 디지털 서명하기](https://blog.naver.com/remocon33/220244101931)
- [실행파일(exe) 드라이버 프로그램 디지털 서명 해결 방법](https://gogildong.com/65)

#### 인증서 도구 위치

- `C:\Program Files (x86)\Windows Kits\10\bin\10.0.17763.0\x64`
- Windows Kits 아래에 가장 높은 버전의 x64 폴더를 사용

#### 인증서 도구들

- [makecert.exe](https://docs.microsoft.com/ko-kr/windows-hardware/drivers/devtest/makecert) : 인증서 생성 도구
- [cert2spc.exe](https://docs.microsoft.com/ko-kr/dotnet/framework/tools/cert2spc-exe-software-publisher-certificate-test-tool) : SPC 테스트 도구
- [cert2mgr.exe](https://docs.microsoft.com/ko-kr/dotnet/framework/tools/certmgr-exe-certificate-manager-tool) : 인증서 관리자 도구
- [pvk2pfx.exe](https://docs.microsoft.com/ko-kr/windows-hardware/drivers/devtest/pvk2pfx) : pfx 변환 도구 (spc와 pvk를 입력받아)

#### 인증서(pfx) 생성 방법

```powershell
# STEP.1 pvk와 cer 파일 생성
# + (pvk용) 개인키 암호: "bitnine"
makecert -n "CN=AgensEnterprise" -r -sv bitnine.pvk bitnine.cer

# STEP.2 cer 파일로 spc 파일 생성
cert2spc.exe bitnine.cer bitnine.spc

# STEP.3 localMachine에 AgensEnterprise 인증기관 등록
certmgr.exe -add bitnine.cer -s -r localMachine root

# STEP.4 pvk, spc 파일로 pfx 파일 생성
pvk2pfx -pvk bitnine.pvk -pi bitnine -spc bitnine.spc -pfx bintine.pfx
```

- 참고: [language support list of MD code-block](https://rdmd.readme.io/docs/code-blocks#language-support)

인증서 관리 도구에 등록된 AgensEnterprise

![15_01-AgensEnterprise](/2022/02/15_01-AgensEnterprise.png){: width="540" .w-75}

### 서명하기

#### 사전 작업

- bitnine.pfx 파일 : `${PGADMIN4_SRC}\pkg\win32\build_lib` 에 저장
- `cert2mgr.exe` 로 localMachine 에 AgensEnterprise 인증기관 등록
- build 결과물인 exe 파일 위치 확인

#### 명령 프롬프트(CMD)에서 서명하기

```powershell
# STEP.1 exe 파일에 pfx 파일로 서명하기 (localMachine에 등록된 인증기관 사용)
signtool sign /t http://time.certum.pl /f .\pkg\win32\build_lib\bitnine.pfx /p bitnine .\dist\pgadmin4-6.5-x64.exe
# ==>
# Done Adding Additional Store
# Successfully signed: .\dist\pgadmin4-6.5-x64.exe
```

#### Make.bat 스크립트 상의 서명작업

```powershell
:SIGN_INSTALLER
    ECHO Attempting to sign the installer...
    CALL "%PGADMIN_SIGNTOOL_DIR%\signtool.exe" sign /t http://time.certum.pl /f %BUILD_LIB_DIR%\bitnine.pfx /p bitnine "%DISTROOT%\%INSTALLERNAME%"
    IF %ERRORLEVEL% NEQ 0 (
        ECHO.
        ECHO **********************************************
        ECHO * Failed to sign the installer
        ECHO **********************************************
        PAUSE
    )

    EXIT /B 0
```

#### GUI 도구인 wizard 로 서명하기

- `signtool signwizard` 실행
- 안내대로 수행

![15_02-SignWizard](/2022/02/15_02-SignWizard.png){: width="540" .w-75}

![15_03-SignWizard](/2022/02/15_03-SignWizard.png){: width="540" .w-75}

![15_04-SignWizard](/2022/02/15_04-SignWizard.png){: width="540" .w-75}

#### 서명 된 exe 파일의 디지털 서명 속성

![15_05-SignWizard](/2022/02/15_05-SignWizard.png){: width="540" .w-75}

## 패키징 예제 [pgAdmin4](https://github.com/postgres/pgadmin4)

### `Make.bat`의 환경변수 설정

- PGADMIN_PYTHON_DIR : 파이썬 위치
- PGADMIN_KRB5_DIR : 커버로스5 위치
- PGADMIN_POSTGRES_DIR : postgresql 위치
- PGADMIN_INNOTOOL_DIR : Inno Setup 6 위치
- PGADMIN_VCREDIST_DIR : VC++ Runtime 필수 라이브러리 Installer 위치
- PGADMIN_SIGNTOOL_DIR : signtool 위치

```powershell
:SET_ENVIRONMENT
    ECHO Configuring the environment...
    IF "%PGADMIN_PYTHON_DIR%" == ""   SET "PGADMIN_PYTHON_DIR=C:\Python310"
    IF "%PGADMIN_KRB5_DIR%" == ""     SET "PGADMIN_KRB5_DIR=%BUILD_LIB_DIR%\krb5"
    IF "%PGADMIN_POSTGRES_DIR%" == "" SET "PGADMIN_POSTGRES_DIR=%BUILD_LIB_DIR%/postgres"
    IF "%PGADMIN_INNOTOOL_DIR%" == "" SET "PGADMIN_INNOTOOL_DIR=C:\Program Files (x86)\Inno Setup 6"
    IF "%PGADMIN_VCREDIST_DIR%" == "" SET "PGADMIN_VCREDIST_DIR=C:\Program Files (x86)\Microsoft Visual Studio\2017\Professional\VC\Redist\MSVC\14.16.27012"
    IF "%PGADMIN_SIGNTOOL_DIR%" == "" SET "PGADMIN_SIGNTOOL_DIR=C:\Program Files (x86)\Windows Kits\10\bin\10.0.17763.0\x64"
```

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
