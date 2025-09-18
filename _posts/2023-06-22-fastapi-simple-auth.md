---
date: 2023-06-22 00:00:00 +0900
title: FastAPI 간단한 Auth 구현 방법
description: FastAPI 로 백엔드 서비스를 만들 때 사용할 수 있는 간단한 인증 방법을 소개한다. api-key 를 이용해 로그인을 하고, 이후 jwt 토큰을 발급하는 방법이다.
categories: [Backend, Web Framework]
tags: ["fastapi","jwt","auth","python"]
image: "https://miro.medium.com/v2/resize:fit:1023/0*1EtZTArgBliVFhaC.png"
---

## 1. FastAPI 보안: [OpenAPI](https://fastapi.tiangolo.com/tutorial/security/#openapi)

OpenAPI(이전에는 Swagger라고 함)는 API를 구축하기 위한 개방형 사양이고, FastAPI 는 OpenAPI를 기반으로 합니다.

- Swagger 2.0 에서 3.0 버전으로 올라가면서 규약을 OpenAPI 라고 재정의
  + Swagger 는 OpenAPI 를 구현하기 위한 수많은 도구 중의 하나
  + 참고: [OpenAPI Tooling](https://tools.openapis.org/)

### 1) OpenAPI 의 보안 체계

- `apiKey` : 쿼리 매개변수, 헤더, 쿠키로부터 가져올 수 있고
- `http` + `Authorization` : bear + 토큰 형식에서 가져오거나 
- `oauth2` : client credential 정보를 바탕으로 token 발급
  + username + password (sha256 암호화) 으로 사용자 정보를 가져와 생성
  + client_id + secreteKey 으로 client 정보를 가져와 생성
- `openIdConnect` : OAuth2 인증데이터를 자동 검색하여 가져오거나
  + Google, Facebook, Twitter, GitHub 등과 같은 인증/권한 부여 공급자를 이용

> `fastapi.security` 모듈에서 이러한 OpenAPI 규약 기능들을 제공

### 2) 단순 비교 인증 [apiKey](https://itsjoshcampos.codes/fast-api-api-key-authorization)

- 1) 헤더(또는 queryParam, cookie)로부터 api_key 가져오기
- 2) 내부에 저장된 API_KEY 값과 같으면, 인증

```py
from .config import config_env
from fastapi.security.api_key import APIKeyHeader
from fastapi import Security, HTTPException
from starlette.status import HTTP_403_FORBIDDEN

api_key_header = APIKeyHeader(name="access_token", auto_error=False)

async def get_api_key(api_key_header: str = Security(api_key_header)):
    if api_key_header == config_env["API_KEY"]:
        return api_key_header   
    else:
        raise HTTPException(
            status_code=HTTP_403_FORBIDDEN, detail="Could not validate API KEY"
        )
```

### 3) [username, password 를 사용하는 OAuth2](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/)

- 1) endpoint `/token` 으로 username, password 받고
  + DB 로부터 username 사용자 정보 가져오기 
  + 사용자 정보의 hashed_password 가 hash(password) 같은지 비교
- 2) 사용자 정보가 일치하면, token 발급
  + 사용자 정보와 expire 시간을 합쳐서 token 생성
  + token 생성시 알고리즘(HS256)과 비밀키(secretKey) 필요
- 3) token 을 사용한 api 접근시, token 을 해독(decode)하여 user 정보 추출
  + expire 시간도 검사

#### jwt 암호화 및 해독

```py
from jose import JWTError, jwt

# openssl rand -hex 32
SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# 사용자 data 에 exp 를 추가해 token 생성
to_encode = data.copy()
to_encode.update({"exp": expire})
encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# token 해독하여 사용자 sub 추출
payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
username: str = payload.get("sub")
```

## 2. DB 없이 apiKey 와 oauth2 를 결합한 인증

> 목적

정해진 서버간의 API 요청과 응답만 있는 경우에 간단히 연결할 목적으로 작성했다.

> 장점

- (DB 가 필요없고) apiKey 만 있으면 된다
  + apiKey 를 cookie 또는 queryParam 으로 연결하면 테스트 할 때 편하다
- 그러면서, endpoint 가 노출 되어도 외부에서 활용할 수 없도록 막을 수 있고
- expire 시간을 이용해 사용에 시간 제한을 걸 수 있다

> 주의사항

- password 방식과 다름 없기 때문에, apiKey 가 노출되면 안된다
  + 당연하지만 secretKey 도 노출되면 안됨

### 1) `/login`

apiKey 를 password 처럼 사용하자

- 1) request 헤더에서 추출한 apiKey 로 username 획득
  + hash 처리된 값으로 비교 (선택)
- 2) username 의 권한 또는 역활 정보를 담아 token 생성
  + expire 시간도 포함

#### 인증 정보가 틀린 경우 HTTPException 오류 처리

[python-jose](https://python-jose.readthedocs.io/en/latest/jwt/) 에서 `exp` 예약어에 대해 자동으로 claim 처리를 해준다. 

```py
def get_jwt_data(token: str):
    try:
        return jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
    except ExpiredSignatureError:  # Expiration Claim
        return None
    except JWTError:
        return None

def auth_api_jwt(token: str = Depends(oauth2_scheme)):
    """API Key Authentication (JWT)"""
    data = get_jwt_data(token)
    if not data or not check_role(data["role"]) or not check_exp(data["exp"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return data        
```

#### 패스워드 bcrypt 해싱 및 비교

```py
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    """get password hash

    usage:
        [주의!] '==' 연산자로는 비교 불가능, 꼭 verify_password() 사용
        get_password_hash("my-password") == hashed_my_password
    """
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(fake_db, username: str, password: str):
    user = get_user(fake_db, username)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user    
```

### 2) `{API}/request` 요청시 token 해독

- HTTP 헤더의 Authorization 에서 token 추출
- SECRET_KEY 와 ALGORITHM 으로 해독하여 사용자 권한/역활 정보를 사용

```py
import httpx

access_token = token.get('access_token')

r = httpx.get(
    url=url,
    timeout=None,
    headers={
        "Accept": "application/json",
        'Authorization': f'Bearer {access_token}'
    },
)
r.raise_for_status()  # 401 Unauthorized, 404 Not Found
```

### 3) `/logout`

쿠키를 사용한 경우가 아니면, 필요없다.

- 쿠키 사용시, 쿠키 삭제
- 기본 endpoint 로 이동 또는 메시지 반환


## 9. Review

- DB 없이 간단하게 처리할 방법을 검색해 보았는데 못찾았다.
  + 정석적인 예제들은 모두 DB 를 사용하고, oauth2 에 집중해서 설명하니깐
- 도구는 이용하기 나름 아닌가? (자기 합리화)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
