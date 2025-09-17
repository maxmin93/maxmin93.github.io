---
date: 2022-03-01 00:00:00 +0900
title: Postgresql Windows build
description: 오픈소스 제품의 윈도우 패키징을 위해 Postgresql 대상으로 배포판을 만들어봅니다.
categories: [DevOps, Packaging]
tags: [visual-studio, build]
image: https://mblogthumb-phinf.pstatic.net/MjAxOTAxMjhfMjQz/MDAxNTQ4NjYwOTIwMTA5.psJHx5JY4FDnAkV-Ld8p7VPz5Th30Sf4rzGBvQZBxSwg.StW54Iez2-HbOZHaXJhJLWFCpyfh7VS3ge0Gw9_mGUEg.PNG.errorsoft666/26683C3758AE9B6E2F.png?type=w800
---

[Postgresql](https://github.com/postgres/postgres) 소스는 리눅스 기준으로 작성되었기 때문에, 윈도우 실행을 위해서는 Visual Studio 를 사용하여 윈도우 실행 파일인 exe 파일들로 빌드해야 합니다.

## Postgresql 윈도우 배포판 빌드하기

- linux 기반의 실행파일들이 모두 exe 형태로 빌드 되어야 함
- 이를 위해 Visual Studio 를 사용해 컴파일, 링킹 과정을 수행해야 함
  - → `${POSTGRES_SRC}/src/tools/msvc` 위치에 관련 스크립트 포함

### Postgresql 소스 빌드 환경 만들기

관련 자료 : [Working With VisualStudio](https://wiki.postgresql.org/wiki/Working_With_VisualStudio#Visual_Studio_2017)

- Windows 10 권장 (8.1 이상)
- Visual Studio Professional 2017 설치
  - → GUI 환경 쓸거 아니라서 나중에 expired 되도 상관 없다.
- cmd 실행 옵션에 vcvars64.bat 환경설정 연결 (이것으로 빌드 진행)
  - `%windir%\system32\cmd.exe /k "C:\Program Files (x86)\Microsoft Visual Studio\2017\BuildTools\VC\Auxiliary\Build\vcvars64.bat"`
- ActivePerl 설치 (중요!)
  - 다운로드 [ActivePerl](https://www.filehorse.com/download-activeperl/)
  - [Perl.org](http://perl.org/) 에 있는 Strawberry 나 ActiveState 의 Perl 제품 설치하지 말것! → 안된다
- [MinGW](https://osdn.net/projects/mingw/downloads/68260/mingw-get-setup.exe) 설치 : Bison, Flex
  - 환경변수 Path 에 `${MinGW_ROOT}/msys/1.0/bin` 등록
  - Perl 은 제거 (중요!) → 지우거나 확장명을 바꿔버릴것

![01_01-cmd-option](/2022/03/01_01-cmd-option-w640.png){: width="540"}

![01_02-sys-env](/2022/03/01_02-sys-env.png){: width="540"}

![01_03-mingw-msys](/2022/03/01_03-mingw-msys.png){: width="540"}

### postgresql 소스 빌드

pg 소스에는 Visual Studio 관련 프로젝트 파일이 없지만, build 실행시 perl 스크립트에 의해 vcproj 파일과 sln 파일이 자동으로 생성된다. 때문에 설치 환경 구성시 perl이 제일 중요하다.

![01_06-pg_build_sources](/2022/03/01_06-pg_build_sources.png){: width="540"}

```powershell
# build 명령은 이 위치에서 실행해야 함
cd %PG_SRC_ROOT%\src\tools\msvc

# 파라미터 DEBUG 또는 RELEASE (없으면 RELEASE)
# ==> 정상 종료시 %PG_SRC_ROOT% 위치에 `pgsql.sln` 솔루션 파일 생성
# ==> MinGW 와 함께 설치된 bison, flex 등의 명령어가 사용됨
build

# 배포판이 설치될 위치를 파라미터로 입력
install D:\pg_install

# 리그레션 테스트 (생략 가능)
# ==> MinGW 와 함께 설치된 diff 명령어가 사용됨
vcregress check
```

빌드 성공 : `pgsql.snl` 생성

![01_04-pg_build](/2022/03/01_04-pg_build.png){: width="540"}

생성된 exe 파일들

![01_05-pg_built_files](/2022/03/01_05-pg_built_files.png){: width="540"}

## 이후 작업

### Windows 인스톨러로 설치 패키지 생성

- BitRock 에서 만든 [InstallBuilder](https://installbuilder.com/index.html) 도구 등을 이용해 제작
- icon 과 sidebar 이미지, LICENSE 파일, `vcredist_x64.exe`을 포함해 패키지 생성
  - `vcredist_x64.exe`는 소스 빌드에 사용된 Visual Studio 버전을 따른다
    - `Microsoft Visual C++ 2017 Redistributable (x64)` 파일

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
