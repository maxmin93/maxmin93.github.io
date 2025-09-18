---
date: 2022-06-21 00:00:00 +0900
title: Python - gRPC 기반 Chat 2nd
description: 마이크로 서비스의 핵심 프로토콜인 gRPC 에 대해 Chat 예제 소스를 분석하며 공부합니다.
categories: [Backend]
tags: [python, grpc, channel]
image: "https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8susytd9w6lxe9sreqvd.jpg"
---

## gRPC 기반 Chat 프로그램

**출처** [chatting](https://github.com/ehei1/chatting)

- asyncio, asyncio.runner 에 대해 공부 필요
- 각 서비스간 메시지 전달 절차가 헷갈린다. 다시 살펴보자.

**참고**

- [asyncio 를 활용한 동시성 - 1. threading 과의 비교](https://nachwon.github.io/asyncio-and-threading/?fbclid=IwAR3Co42I4McewjruUjkDIgt_nJZvP42A2LhvNQpTS38iBzcmhjjXgpHru2E)
- [asyncio 뽀개기 1 - Coroutine과 Eventloop](https://tech.buzzvil.com/blog/asyncio-no-1-coroutine-and-eventloop/)

```python
import asyncio
from datetime import datetime
from random import randint

async def run_job(num) -> None:
    delay = randint(5, 15)
    print(f'{datetime.now()} [{num}] sleep for {delay} seconds')
    await asyncio.sleep(delay)  # 5~15초 동안 잠자기
    print(f'{datetime.now()} [{num}] finished ({delay} sec)')

async def main() -> None:
    i = 10
    while i > 0:
        asyncio.create_task(run_job(i))
        await asyncio.sleep(10)
        i -= 1

# asyncio.run(main())
# Jupyter 에서 이미 이벤트 루프가 돌고 있기 때문에 RuntimeError 발생
await main()
```

### asyncio 와 threading 차이점

- asyncio 는 하나의 스레드로 동시적으로 실행
  - async/await 문으로 작성.
  - 코루틴(동시실행루틴)은 주종관계없이 대등
  - 태스크는 생성과 동시에 예약됨
    - 코루틴을 create_task()로 감싸서 생성
  - await 가능한 객체: 코루틴, 태스크, 퓨쳐
- threading 은 GIL 때문에 I/O 작업시에만 효용있음
  - 상속 클래스 또는 일반 함수로 생성 후 start() 로 시작
- asyncio.Task 와 threading.Thread 는 거의 대등
- Task 는 코루틴을, Thread 는 Callable 을 실행시킴
- Task.cancel() 메서드가 있지만 Thread는 없음
  - 스레드 방식은 외부에서 스레드 내부를 제어할 수 없다

### Chat Demo

![gRPC-Chat-Demo2](/2022/06/21-grpc-chat-demo2.png){: width="540" .w-75}

1. Server 시작 : `python -m server`
2. Client 시작 : `python console.py`

- Agent 생성 (사용자)
- Lobby 입장 : 커맨드 라인 입력
- Heartbeat 시작 (접속상태 확인)
- Channel 생성 및 입장 (채팅방)

### Architecture

#### 사용자와 서버간 관계

![user-server-relation](https://github.com/ehei1/chatting/raw/master/user-server_relation.png){: width="540" .w-75}

- User 는 Agent 에 접속
  - Agent 로부터 Lobby 와 Heartbeat 주소를 받음
- User 는 Heartbeat 에 heartbeat 요청
  - Heartbeat 는 주기적으로 User 에게 시간 정보를 응답
- User 는 Lobby 에게 각종 요청을 원격 호출로 전달
  - Lobby 는 사용자 명령에 대한 실제 작업을 처리 후 응답
  - Lobby 는 채널 생성에 대해 채널을 생성하고 사용자를 JOIN 시킴
- User 는 Channel 에 대해 Chat 전송을 요청
  - Channel 은 Chat 을 등록된 사용자들에게 전달 (<-- 이부분이 안보임)

#### 서버와 서버간 관계

![server-server-relation](https://github.com/ehei1/chatting/raw/master/server-server_relation.png){: width="540" .w-75}

- Agent 는 로그인 사용자를 Lobby 에 전달
  - 동시에 Heartbeat 에게 사용자 정보를 전달
- Lobby 는 사용자 상태에 대해 관련 서비스에 요청을 전달
  - Channel 을 생성하고 사용자를 등록
  - Heartbeat 에 사용자 제거 요청을 전달
  - Agent 에 사용자 제거 요청을 전달 (<-- 안보임)

### proto3

```proto
syntax = "proto3";

// 빈 메시지
message Empty {}

//////////////////////////////////////

// 로그인 요청
message LoginRequest {
    string ip = 1;
}

// 로그인 응답
message LoginReply {
    int32 index = 1;
    string heartbeat_ip = 2;
    string lobby_ip = 3;
}

// 로그인: 로그인 요청 --> 로그인 응답
service Agent {
    rpc TryLogin (LoginRequest) returns (LoginReply) {}
}

//////////////////////////////////////

// 접속상태 요청
message HeartbeatRequest {
    int32 index = 1;
}

// 접속상태 응답
message HeartbeatReply {
    int64 time = 1;
}

// 사용자 요청
message UserRequest {
    int32 index = 1;
}

// 사용자 접속상태 응답
message UserLivesReply {
    enum Status {
        LIVE = 0;
        UNKNOWN = 1;
    }
    Status status = 1;
}

// 접속상태 확인
service Heartbeat {
    rpc TryHeartbeat (HeartbeatRequest) returns (stream HeartbeatReply) {}
    rpc TryUserLives (UserRequest) returns (UserLivesReply) {}
}

//////////////////////////////////////

// 챗 : 채팅방, 메시지
message Chat {
    int32 index = 1;
    optional string text = 2;
}

// 상태 응답
message StatusReply {
    enum Status {
        OK = 0;
        JOIN_USER = 1;
        LEAVE_USER = 2;
        QUIT = 3;
    }
    Status status = 1;
    int32 index = 2;
    optional int32 channel = 3;
}

// 채팅방
service Channel {
    rpc TryChatSend (Chat) returns (Empty) {}
    rpc TryChatReceive (Chat) returns (stream Chat) {}
    rpc TryUserRemove(UserRequest) returns (Empty) {}
    rpc TryStatusRequest(UserRequest) returns (stream StatusReply) {}
}

//////////////////////////////////////

// 명령어 요청
message CommandRequest {
    enum Status {
        LIST_CHANNELS = 0;
        MAKE_CHANNEL = 1;
        JOIN_CHANNEL = 2;
        LEAVE_CHANNEL = 3;
        LIST_USERS = 4;
    }
    Status status = 1;
    int32 index = 2;
    optional int32 channel = 3;
}

// 명령어 응답
message CommandReply {
    enum Status {
        SUCCESS = 0;
        FAILURE = 1;
    }
    optional Status status = 1;
    optional string address = 2;
    repeated int32 channels = 3;
    repeated int32 users = 4;
}

// 대기실
service Lobby {
    rpc TryChatSend (Chat) returns (Empty) {}
    rpc TryChatReceive (Chat) returns (stream Chat) {}
    rpc TryUserRemove(UserRequest) returns (Empty) {}
    rpc TryCommand (CommandRequest) returns (CommandReply) {}
    rpc TryUserExit (UserRequest) returns (StatusReply) {}
    rpc TryStatusRequest(UserRequest) returns (stream StatusReply) {}
}
```

### Servers

```python
# {SRC_ROOT}/server/__main__.py

def main() -> None:
    # agent: 'localhost:50050',
    # heartbeat: 'localhost:50051',
    # lobby: 'localhost:50052'
    agent = Agent(arguments.agent, arguments.heartbeat, arguments.lobby)
    heartbeat = Heartbeat(arguments.heartbeat)
    lobby = Lobby(arguments.lobby, arguments.channel, arguments.ports)

    # 이벤트 루프에 코루틴들을 등록하고 실행
    servers = asyncio.gather(
        *(agent.run(), heartbeat.run(), lobby.run())
        )
    loop = asyncio.get_event_loop()
    loop.set_debug(True)
    loop.run_until_complete(servers)

    loop.close()


if __name__ == '__main__':
    main()
```

#### Agent server

```python
User = collections.namedtuple(
    'User', ('IP', 'Index', 'TimeStamp')
)
RemoteProcedureCall = collections.namedtuple(
    'RemoteProcedureCall', ('Channel', 'Stub')
)

# Agent 서비스의 서버 클래스
class Agent(client_to_agent_pb2_grpc.Agent):
    __index = 0
    __heartbeat_rpc = None
    __lobby_rpc = None

    def __init__(self, agent_address: str, heartbeat_address: str, lobby_address: str):
        self.__users = []
        self.__address = agent_address
        self.__heartbeat_address = heartbeat_address
        self.__lobby_address = lobby_address
        self.__server = self.__create_server(agent_address)

    # 클라이언트의 TryLogin 요청에 대해 응답
    # - heartbeat, lobby 서비스의 ip 전달
    async def TryLogin(self,
        request: client_to_agent_pb2.LoginRequest,
        context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.LoginReply:

    # 사용자 중단시까지 백그라운드 수행
    async def run(self) -> None:

    # Agent 객체를 grpc 서버에 연결
    def __create_server(self, address: str) -> grpc.aio.server:

    # Login 요청한 User를 내부 리스트에 등록
    # - heartbeat 과 lobby 서비스의 Stub 초기화
    def __add_user(self, ip: str, index: int) -> None:

    # 사용자 관리
    async def __check_user(self) -> None:
        # 사용자 유효기간(timestamp)가 남았으면 리스트에 유지
        # 유효기간이 지난 사용자에 대해 TryUserLives 원격 호출
        # - LIVE 상태면 Lobby 서비스에 사용자가 나갔는지 TryUserExit 호출
        #   - OK 응답이면 사용자 재등록
        #   - 아니면, Lobby 서비스에 사용자 지우라고 TryUserRemove 호출

    # heartbeat 서비스 Stub 생성 (나중에 Login 응답시 전달)
    def __create_heartbeat_rpc(self) -> RemoteProcedureCall:

    # lobby 서비스 Stub 생성 (나중에 Login 응답시 전달)
    def __create_lobby_rpc(self) -> RemoteProcedureCall:
```

#### Heartbeat server

```python
# Heartbeat 서비스의 서버 클래스
class Heartbeat(client_to_agent_pb2_grpc.Heartbeat):
    __server = None
    __handler = None
    __address = ''
    __users = None
    __any_messages = None
    __live_seconds = 5

    # grpc 서버에 객체 연결
    def __init__(self, address: str):
        self.__users = {}
        self.__address = address
        self.__server = server = grpc.aio.server()
        client_to_agent_pb2_grpc.add_HeartbeatServicer_to_server(self, server)
        server.add_insecure_port(address)

    # 사용자에게 '현재시간 + 생존시간'을 주기적으로 전송 (HeartbeatReply)
    async def TryHeartbeat(self,
        request: client_to_agent_pb2.HeartbeatRequest,
        context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.HeartbeatReply:

    # 사용자의 접속상태 요청에 대해 응답 (Agent가 요청)
    # - 없으면 UNKNOWN 상태로 변경하라고 응답
    # - 시간이 지났어도 UNKNOWN 상태로 변경하라고 응답
    # - 그 외에는 LIVE 상태 응답
    async def TryUserLives(self,
        request: client_to_agent_pb2.UserRequest,
        context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.UserLivesReply:

    # 사용자 중단시까지 백그라운드 작업 시작
    async def run(self) -> None:
```

#### Lobby server

```python
# 사용자 상태 관리 클래스
class User:
    __time_stamp = 0
    __validating_time = 60

    def __init__(self, index: int):
        self.index = index
        self.chats = []
        self.channel = 0
        self.statuses = []

    # 유효시간 = 현재시간 + __validating_time
    def validate(self):
    # 유효시간이 만료되었는지 여부 반환
    def is_invalidated(self) -> bool:

# Lobby 서비스의 서버 클래스
class Lobby(client_to_agent_pb2_grpc.Lobby):
    # grpc 서버에 객체 연결
    def __init__(self,
        lobby_address: str,
        channel_ip: str,
        channel_ports:'tuple[int]'
    ):
        self.__channels = collections.OrderedDict()
        self.__users = {}
        self.__address = lobby_address
        self.__channel_ports = list(channel_ports)
        self.__channel_ip = channel_ip
        self.__server = server = grpc.aio.server()
        client_to_agent_pb2_grpc.add_LobbyServicer_to_server(self, server)
        server.add_insecure_port(self.__address)

    # 사용자의 Chat 메시지를 받아 사용자 상태에 기록 (응답 없음)
    # - 사용자 생존시간 갱신
    async def TryChatSend(self,
        request: client_to_agent_pb2.Chat,
        context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.Empty:

    # 특정 사용자의 Chat 메시지를 모두 반환(yield) 후 비우기
    # - 1초 간격으로 사용자의 Chat 메시지 확인
    async def TryChatReceive(self,
        request: client_to_agent_pb2.Chat,
        context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.Chat:

    # 사용자 제거 요청에 대한 실제적인 작업 수행 (응답 없음)
    # - 사용자 리스트와 채널 내의 사용자에서 제거
    async def TryUserRemove(self,
        request: client_to_agent_pb2.UserRequest,
        context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.Empty:

    # 사용자 명령에 대해 실제적인 작업 수행
    # - list, make, join, user, leave
    # - 매 처리시마다 항상 사용자 존재를 확인한다 (+ 유효시간 갱신)
    async def TryCommand(self,
        request: client_to_agent_pb2.CommandRequest,
        context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.CommandReply:

    # 백그라운드 작업 시작
    async def run(self) -> None:

    # 사용자 나감을 처리
    # - 있으면 QUIT 상태 반환, 없으면 이미 OK 상태라고 반환
    async def TryUserExit(self,
            request: client_to_agent_pb2.UserRequest,
            context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.Empty:

    # 요청 사용자에 대한 상태 응답를 반환(yield)
    async def TryStatusRequest(self,
            request: client_to_agent_pb2.UserRequest,
            context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.StatusReply:

    # 채널로부터 사용자 삭제
    async def __remove_user_from_channel(self, user_index: int, port: int) -> None:

    # 채널에 사용자 등록
    async def __join_channel(self, index: int, channel: collections.Hashable) -> str:

    # 특정 채널의 사용자 리스트 반환
    # - 없는 채널이면 모든 사용자 반환
    async def __get_users(self, channel: collections.Hashable) -> 'tuple[int]':

    # 특정 사용자 정보 반환
    def __get_user(self, index: collections.Hashable) -> User:
```

#### Channel server

```python
Status = collections.namedtuple('Status', ('Status', 'Index', 'Channel'))

# 사용자 관리 클래스
class User:
    def __init__(self):
        self.chats = []
        self.statuses = []

# Channel 서비스의 서버 클래스
class Handler(client_to_agent_pb2_grpc.Channel):
    def __init__(self, channel_index: int):
        self.__users = collections.defaultdict(User)
        self.__channel_index = channel_index

    # 사용자의 채팅 메시지 전송 요청을 받아 저장 (응답 없음)
    async def TryChatSend(self,
        request: client_to_agent_pb2.Chat,
        context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.Empty:

    # 특정 사용자의 채팅 메시지에 대한 수신 요청에 대해 chat 메시지 반환
    # - 1초 간격으로 확인
    async def TryChatReceive(self,
        request: client_to_agent_pb2.Chat,
        context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.Chat:

    # 사용자 제거 요청에 대한 작업 수행 (응답 없음)
    async def TryUserRemove(self,
        request: client_to_agent_pb2.UserRequest,
        context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.Empty:

    # 채널에 사용자를 JOIN 시키고 상태 반환
    async def TryStatusRequest(self,
        request: client_to_agent_pb2.UserRequest,
        context: grpc.aio.ServicerContext
    ) -> client_to_agent_pb2.StatusReply:

    # 채널에서 사용자를 삭제하고 LEAVE_USER 상태를 추가
    def remove_user(self, index: int) -> None:

    def is_empty(self) -> bool:
        return not self.__users

    # 사용자 상태에 처리된 상태 응답을 추가
    def __add_status(self, response: client_to_agent_pb2.StatusReply) -> None:

# 채널 관리용 클래스 (개별적인 address 소유)
class Channel:
    def __init__(self, ip: str, port: int):
        self.__address = address = f'{ip}:{port}'
        self.__server = server = grpc.aio.server()
        server.add_insecure_port(address)

        # grpc 서버에 특정 채널에 대한 작업을 수행하는 handler를 등록
        handler = Handler(port)
        self.__handler = weakref.proxy(handler)
        client_to_agent_pb2_grpc.add_ChannelServicer_to_server(handler, server)

    def __del__(self):
        logging.debug('Closing Channel on %s', self.__address)

    # 채널 Handler 백그라운드 시작
    async def run(self) -> None:

    # 채널 중단
    async def stop(self) -> None:

    # 사용자 제거
    def remove_user(self, index: int) -> None:

    # 사용자가 없는지 체크
    def is_empty(self) -> bool:
```

### Client

```python
def run() -> None:
    # Agent 서비스에 대해서
    with grpc.insecure_channel(arguments.agent) as agent_channel:
        # AgentStub 을 받아서 TryLogin 원격 호출

        # Heartbeat 서비스에 대해서
        with grpc.insecure_channel(agent_response.heartbeat_ip) as heartbeat_channel:
            # HeartbeatStub 을 받아서 TryHeartbeat 원격 호출
            # 이후 Heartbeat 응답을 스레드풀로 백그라운드에서 처리

            # Lobby 서비스에 대해서
            with grpc.insecure_channel(agent_response.lobby_ip) as lobby_channel:
                # LobbyStub 을 받아서
                # TryChatReceive, TryChatSend, TryStatusRequest 응답에 대한 이터레이터 생성
                # 스레드풀로 4개의 이터레이터를 백그라운드에서 처리
                # - 사용자 중단시 백그라운드 작업 모두 취소
                # - 사용자 명령 입력는 TryChatSend 에서 처리 (명령도 Chat)

                concurrent.futures.wait(futures)

if __name__ == '__main__':
    run()
```

## 9. Review

- grpc 는 python 보다 go 언어와 잘 어울리는거 같다.
- 채팅 서비스의 구조와 grpc 동작방식에 대한 이해가 필요하다.
- WebRTC 기반의 p2p 채팅 방식도 최근 기술 트렌드이다. (니꼬쌤 자료 참고)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
