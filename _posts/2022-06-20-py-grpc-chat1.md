---
date: 2022-06-20 00:00:00 +0900
title: Python - gRPC 기반 Chat 1st
description: 마이크로 서비스의 핵심 프로토콜인 gRPC 에 대해 Chat 예제 소스를 분석하며 공부합니다.
categories: [Backend]
tags: [python, grpc, proto3]
image: "https://dev-to-uploads.s3.amazonaws.com/uploads/articles/8susytd9w6lxe9sreqvd.jpg"
---

## gRPC 기반 Chat 서버와 클라이언트

### 출처 [python-grpc-chat](https://github.com/melledijkstra/python-grpc-chat)

### Chat Demo

![gRPC-Chat-Demo](/2022/06/20-grpc-chat-demo.png){: width="540" .w-75}

클라이언트 UI에 파이썬 표준 인터페이스인 `Tk interface` 를 사용했다. (Tcl 8.6, Tk 8.6) `simpledialog.askstring` 로 사용자명을 입력받고, `Text/Label/Entry` 를 사용하여 간단하게 채팅창을 구성할 수 있다.

- 서버 실행 `python server.py`

  - 하나의 channel 만 동작 (모든 클라이언트가 동일 서버에 접속)
  - 최대 10개 클라이언트 접속: 스레드풀 용량 `max_workers = 10`

- 클라이언트 실행 `python client.py` (2개 실행)
  - username 입력
  - 채팅 입력시 모든 클라이언트에 텍스트 공유

### protobuf (Protocol Buffers) 란?

구조화 데이터를 직렬화시키는 메커니즘으로, 프로그램 언어나 플랫폼에 중립적으로 사용할 수 있는 데이터 전송 방식이다. XML 같지만 XML 보다 작고 빠르며, 데이터가 축약되면서도 파싱하지 않기 때문에 빠르다. 이 때문에 게임 서버처럼 Socket 통신이나 gRPC 분산처리 할 경우에 주로 사용된다. (최근 마이크로서비스에도 흔히 사용)

- 공식 문서: [Protocol Buffers](https://developers.google.com/protocol-buffers)
- 과거에는 게임 개발시 메시지 패킷의 바이너리 구조를 비트 단위로 직접 작성했는데, 더이상 그런 방식으로는 안함
- Hadoop 에는 protobuf 2.5 버전이 사용됨 (버전은 명세 차이)
- 구조화 데이터의 명세는 `.proto` 파일에 작성하고 `protoc`로 컴파일 한다.
- 언어 중립적이라 서로 다른 언어로 만들어진 `cross-project` 가 가능하다.

### gRPC (Remote Procedure Call) 란?

구글에서 만든 고성능 RPC 프레임워크로 분산프로세스간의 통신을 위해 사용된다. 양방향 통신과 스트리밍이 가능한 `HTTP/2` 프로토콜 위에 protobuf 로 데이터를 전달한다. 이 때문에 언어와 플랫폼에 중립적으로 사용할 수 있다.

- 공식 문서: [gRPC](https://grpc.io/)
- HTTP/2 성능 이점
  - HTTP/1.x 보다 간단하고 효율적 (이진 프레임밍 및 헤더 압축)
  - 한번 연결하면 끊지 않고, 응답을 기다리지 않고 다중전송(멀티플렉싱) 가능
    - connection 과 keep-alive 무시, Head-Of-Line 차단
- 빌드된 `Stub` 코드는 서버와 클라이언트에 배포되어 공통으로 사용

  - RPC runtime 으로부터 바이너리를 넘겨 받아 마샬링/역마살링 수행
  - 마샬링은 파라미터, 반환값을 포함한 메소드 객체를 전송 가능한 바이트 스트림으로 변환하는 작업을 말함 (직렬화는 객체의 값만 변환)

> [gRPC 와 JSON 기반 HTTP-API 비교](https://docs.microsoft.com/ko-kr/aspnet/core/grpc/comparison?view=aspnetcore-6.0#high-level-comparison)

| 기능            | gRPC                | HTTP-API           |
| --------------- | ------------------- | ------------------ |
| 계약            | 필수(.proto)        | 선택 사항(OpenAPI) |
| 프로토콜        | HTTP/2              | HTTP               |
| Payload         | Protobuf(소형,이진) | JSON(대형,가독성)  |
| 규범            | 엄격한 사양         | 느슨함             |
| 스트리밍        | 단방향, 양방향      | 단방향             |
| 브라우저 지원   | 일부 지원           | 모두 지원          |
| 보안            | TLS                 | TLS                |
| 클라이언트 코드 | 생성                | 직접 작성(OpenAPI) |

> gRPC vs Java Socket : 파일 전송시간 비교

gRPC 의 성능은 Java Socket 에 가깝습니다. [참조](https://medium.com/@safvan.kothawala/performance-test-grpc-vs-socket-vs-rest-api-9b9ac25ca3e5)

![gRPC vs Java Socket](https://miro.medium.com/max/1400/1*0vrow4sdHQJMuiJQBkUGkw.png){: width="540" .w-75}

> gRPC vs REST API : 개체 전송시간 비교

gRPC 의 성능은 REST API 의 성능보다 거의 3배 더 좋습니다. [참조](https://medium.com/@safvan.kothawala/performance-test-grpc-vs-socket-vs-rest-api-9b9ac25ca3e5)

| Object 전송                  | Object (100 Request) - 9kb size |
| ---------------------------- | ------------------------------- |
| gRPC (ProtoBuf)              | 125                             |
| gRPC (ProtoBuf Non-Blocking) | 80                              |
| REST API - HTTP1.1           | 300                             |
| REST API - HTTP2 with HTTPS  | 1802                            |

참고: gRPC 구현에 따라 요청 메시지 크기는 4MB 를 초과해서는 안됩니다.

### Chat 프로그램의 구성 (2-tier)

#### proto 메시지

protoc 컴파일 결과인 `*_pb2.py` 파일의 'pb2'는 아무 의미도 아니라고 함

- python 2 또는 3 의미도 아니고, proto 2 또는 3 의미도 아니라고
- proto 2 와 proto 3 모두 `*_pb2.py` 파일 출력
  - 참고: [Compiler Invocation](https://developers.google.com/protocol-buffers/docs/reference/python-generated#invocation)

```proto
syntax = "proto3";

package grpc;

// argument 와 return 는 반드시 정의되어야 함
// - 없는 경우 대체값으로 사용
message Empty {}

// 채팅 메시지 : 대상 이름(1)과 메시지(2)
message Note {
    string name = 1;
    string message = 2;
}

// 채팅 서버
service ChatServer {
    // 서버가 채팅 메시지를 모든 클라이언트에 stream 타입으로 return
    rpc ChatStream (Empty) returns (stream Note);
    // 클라이언트가 argument 로 채팅 메시지를 서버에 전달
    rpc SendNote (Note) returns (Empty);
}
```

#### proto & stub 코드

`--grpc_python_out` 옵션으로 파이썬용 stub 코드 생성

```shell
$ python -m grpc_tools.protoc -I=proto/ --python_out=proto/ --grpc_python_out=proto/ proto/chat.proto
```

```python
import grpc

# 파이썬용 메시지 스키마
from . import chat_pb2 as chat__pb2

# 클라이언트용 Stub 클래스
# - 클라이언트에서 ChatServer 프로시져를 호출할 때 사용
class ChatServerStub(object):
  pass

  # rpc 런타임의 채널
  def __init__(self, channel):
    # ChatStream 함수: 파라미터(직렬화), 반환값(역직렬화)
    self.ChatStream = channel.unary_stream(
        '/grpc.ChatServer/ChatStream',
        request_serializer=chat__pb2.Empty.SerializeToString,
        response_deserializer=chat__pb2.Note.FromString,
        )
    # SendNote 함수: 파라미터(직렬화), 반환값(역직렬화)
    self.SendNote = channel.unary_unary(
        '/grpc.ChatServer/SendNote',
        request_serializer=chat__pb2.Note.SerializeToString,
        response_deserializer=chat__pb2.Empty.FromString,
        )


# 서버용 Stub 클래스 (초기 상태의 베이스클래스)
# - 실제 클래스는 상속 받아 사용자 코드에 작성
class ChatServerServicer(object):
  pass

  def ChatStream(self, request, context):
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')

  def SendNote(self, request, context):
    pass
    context.set_code(grpc.StatusCode.UNIMPLEMENTED)
    context.set_details('Method not implemented!')
    raise NotImplementedError('Method not implemented!')


# 서버 기동시 서버 함수와 연결된 핸들러를 Thread에 연결
def add_ChatServerServicer_to_server(servicer, server):
  # 서버용 메시지 핸들러
  rpc_method_handlers = {
      # ChatStream: 파라미터(역직렬화), 반환값(직렬화)
      'ChatStream': grpc.unary_stream_rpc_method_handler(
          servicer.ChatStream,
          request_deserializer=chat__pb2.Empty.FromString,
          response_serializer=chat__pb2.Note.SerializeToString,
      ),
      # SendNote: 파라미터(역직렬화), 반환값(직렬화)
      'SendNote': grpc.unary_unary_rpc_method_handler(
          servicer.SendNote,
          request_deserializer=chat__pb2.Note.FromString,
          response_serializer=chat__pb2.Empty.SerializeToString,
      ),
  }
  # generic 핸들러를 생성하여 서버에 연결
  generic_handler = grpc.method_handlers_generic_handler(
      'grpc.ChatServer', rpc_method_handlers)
  server.add_generic_rpc_handlers((generic_handler,))
```

#### Server 코드

```python
class ChatServer(rpc.ChatServerServicer):

    def __init__(self):
        self.chats = []

    # chat 리스트에 새로운 메시지가 있으면 return
    def ChatStream(self, request_iterator, context):
        lastindex = 0
        while True:
            while len(self.chats) > lastindex:
                n = self.chats[lastindex]
                lastindex += 1
                yield n

    # 새로운 메시지를 chat 리스트에 저장
    def SendNote(self, request: chat.Note, context):
        print("[{}] {}".format(request.name, request.message))
        self.chats.append(request)
        return chat.Empty()


if __name__ == '__main__':
    port = 11912

    # gRPC server 에 스레드풀 등록
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    # gRPC server 에 채팅 서버 인스턴스 연결
    rpc.add_ChatServerServicer_to_server(ChatServer(), server)

    # gRPC server 시작
    print('Starting server. Listening...')
    server.add_insecure_port('[::]:' + str(port))
    server.start()

    # 메인 스레드는 (잠자면서) 대기
    # - 채팅 서버는 gRPC 서버에 의해 백그라운드로 작동 중
    while True:
        time.sleep(64 * 64 * 100)
```

#### Client 코드

```python
address = 'localhost'
port = 11912

class Client:

    def __init__(self, u: str, window):
        # create a gRPC channel + stub
        channel = grpc.insecure_channel(address + ':' + str(port))
        self.conn = rpc.ChatServerStub(channel)
        # 새 메시지가 올 때까지 블로킹 되기 때문에 별도의 스레드로 돌려야 함
        threading.Thread(target=self.__listen_for_messages, daemon=True).start()

    def __listen_for_messages(self):
        # 새로운 메시지가 들어오면, 채팅창에 출력
        for note in self.conn.ChatStream(chat.Empty()):
            print("R[{}] {}".format(note.name, note.message))

    def send_message(self, event):
        message = self.entry_message.get()
        if message != '':
            # 채팅 메시지 생성 후 값 설정
            n = chat.Note()
            n.name = self.username
            n.message = message
            print("S[{}] {}".format(n.name, n.message))  # debugging statement
            # 채팅 서버의 함수(rpc) 호출
            self.conn.SendNote(n)

    def __setup_ui(self):
        # 채팅창 UI 생성...
```

## 9. Review

- grpc 는 소규모 게임서버에 많이 쓰인다.
  + 패킷 구조를 바이너리 수준에서 공유하는 방법은 생산성이 떨어진다.
- stub 코드를 공유하면, 서버와 클라이언트가 따로 개발을 진행할 수 있다.
  - 게임엔진을 무엇을 쓰느냐, 또는 어떤 응용분야에 쓰느냐에 관계없이 가능
- 메시지 처리에 대한 테스트는 자동화가 필수. (머리가 복잡해짐)

&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }
