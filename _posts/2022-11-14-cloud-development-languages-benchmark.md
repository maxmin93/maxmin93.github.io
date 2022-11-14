---
date: 2022-11-14 00:00:00 +0000
title: 클라우드 개발시 언어 선택을 위한 성능 비교
categories: ["devops"]
tags: ["benchmark", "ecs", "terraform", "aws", "성능"]
image: "https://images.velog.io/images/milkcoke/post/2e6493d9-ef2a-4116-91bc-e257ca9af7ec/golang_icon.jpg"
---

> AWS 같은 클라우드 환경에서 언어별 성능과 예제 코드들을 살펴봅니다. AWS 서비스별 성능과 활용 팁도 포함
{: .prompt-tip }

## 1. AWS 사용사례와 GCS 의 성능 비교

### 1) AWS Lambda 와 GCS Cloud Functions (2세대) 간 성능 비교

출처 : [AWS Lambda vs Cloud Functions (2nd gen) performance benchmark: 40% slower😱](https://www.youtube.com/watch?v=kB-fM31UQBM) - 2022년10월

- AWS 람다
  + Hello World : average 0.1197s => _8% 느리고_
  + Image Resize : average 2.3848s => **36% 빠르다!!**
  + GS Resize : average 2.4796s

- 구글 Cloud Functions
  + Hello World : average 0.1106s
  + Image Resize : average 3.2576s

#### 추가 - 2020년11월

출처 : [AWS Lambda vs Google Cloud Functions](https://stackshare.io/stackups/aws-lambda-vs-google-cloud-functions)

- AWS vs GCS 요청수 비교
  + Average number of requests per second under incremental load for 5 minutes

![AWS vs GCS 요청수 비교](https://img.stackshare.io/stackups/lambda_vs_cloud_functions-requests-per-second.png){: width=540}

- AWS vs GCS 응답시간 비교
  + Average response time under incremental load for 5 minutes

![AWS vs GCS 응답시간 비교](https://s3-us-west-2.amazonaws.com/stackshare-imgix1/stackups/lambda_vs_cloud_functions-response_time.png){: width=540}

### 2) AWS SNS 와의 연계시 Lambda, API Gateway, ECS 간 성능 비교

출처 : [AWS API Performance Comparison: Serverless vs. Containers vs. API Gateway integration](https://www.alexdebrie.com/posts/aws-api-performance-comparison/#skipping-the-middleman-with-api-gateway-service-proxy)

> Amazon Simple Notification Service(Amazon SNS)는 게시자에서 구독자(생산자 및 소비자라고도 함)로 메시지를 전송하는 관리형 서비스입니다. 매월 1백만개 요청까지 무료 (이후 1백만개당 0.5달러)

- 방법1) Go Serverless with AWS Lambda

![Go Serverless with AWS Lambda](https://user-images.githubusercontent.com/6509926/52906603-cbb6cb80-3214-11e9-8a97-a5ea2d4036d3.png){: width="600"}

- 방법2) Skipping the middleman with API Gateway service proxy

![Skipping the middleman](https://user-images.githubusercontent.com/6509926/53012281-249a8580-3408-11e9-91e6-c64cfc82a434.png){: width="600"}

- 방법3) Containerizing your workload with Docker and AWS Fargate

![Docker and AWS Fargate](https://user-images.githubusercontent.com/6509926/53013070-6f1d0180-340a-11e9-860a-4f9962a04792.png){: width="600"}

#### 초기 웜업 결과

![Initial warmup results](https://user-images.githubusercontent.com/6509926/53103176-b7afea00-34f2-11e9-94e0-2d0dfd741397.png){: width="480"}

#### 풀테스트 결과

![Full performance test results](https://user-images.githubusercontent.com/6509926/53103177-b7afea00-34f2-11e9-99b1-75732550056f.png){: width="480"}

#### 결론

- 높은 성능을 원한다면 독립적인 인스턴스 방식(ECS/EKS/EC2)을 선택
  + 설정상 문제가 있어서 요청이 실패하기도 했지만, 고칠수 있을거라고
- 특정 용도로만 작동하면 되는 경우 API Gateway 로 직접 연결하고
  + 관리 포인트가 거의 없음 (메뉴상에서 설정하면 됨)
- 그 외 대부분의 경우에는 AWS Lambda 를 사용하면 됨
  + 범용적이고, 개발과 배포가 빠르다

## 2. AWS 내부(lambda) 에서 Go 언어와 다른 언어의 성능 비교

- 출처1 : [Fastest Runtime For AWS Lambda Functions](https://blog.thundra.io/fastest-runtime-for-aws-lambda-functions) - 2022년3월
- 출처2 : [AWS Lambda 성능 조정 및 모범 사례(2022)](https://www.simform.com/blog/aws-lambda-performance/)
  - Lambda 메모리 512MB 가 총비용 측면에서 가장 적합

### 1) 실험 설정 (Hello World)

- AWS lambda 테스트 구성도

![AWS lambda 테스트 구성도](https://blog.thundra.io/hs-fs/hubfs/Google%20Drive%20Integration/Fastest%20Runtime%20For%20AWS%20Lambda%20Functions-2.png){: width="480"}

- AWS lambda 언어별 함수 배포 (zip, 런타임 설정)

![AWS lambda 언어별 함수 배포](https://blog.thundra.io/hubfs/Google%20Drive%20Integration/Fastest%20Runtime%20For%20AWS%20Lambda%20Functions-4.png){: width="480"}

### 2) 결론

- 클라우드에서는 생산성이나 성능 면에서 Python, Node 가 좋아보임
  + StandAlone 서비스를 만들 경우, 컴파일 언어가 최고 (특히 Go)

- Python 은 메모리를 많이 쓰는 편인데, 그 외 성능은 좋다
  + 메모리를 많이 쓰지 않도록 필터링, 저장, 전달 형태로 사용하자
  + 클라우드에서는 스트림 형태로 데이터를 다루는게 옳다

#### 최대 처리시간 (웜업) : Java 는 갭이 커서 제외

Dotnet 이 느리고, Python / Node / Go 순으로 작다.

- 컴파일 언어는 콜드 스타트가 길지만 워밍업 후 다른 언어와 가까워짐
  + Go 의 경우 콜드 스타트 지속시간은 약 400ms 
  + Python(3.9) 과 Node(16.x) 는 콜드 스타트 영향이 거의 없는듯

![Max Duration](https://blog.thundra.io/hubfs/Google%20Drive%20Integration/Fastest%20Runtime%20For%20AWS%20Lambda%20Functions.gif){: width="600"}

#### 평균 처리시간 (웜업)

Java 가 가장 느리고, Python / Node / Go 순으로 작은데 거의 비슷

![Average Duration](https://blog.thundra.io/hubfs/Google%20Drive%20Integration/Fastest%20Runtime%20For%20AWS%20Lambda%20Functions-1.png){: width="600"}

#### 최대 메모리 사용량 (웜업)

Dotnet 이 가장 많이 사용하고, Go / Node / Python 순으로 적게 사용

![Max Memory Usages](https://blog.thundra.io/hubfs/Google%20Drive%20Integration/Fastest%20Runtime%20For%20AWS%20Lambda%20Functions-3.png){: width="600"}

#### 언어별 콜드스타트 시간 비교 [(출처-2021년)](https://mikhail.io/serverless/coldstarts/aws/languages/)

언어별 콜드스타트 시간 비교시 Python, JS 가 우수하다

- Python의 경우 0.2~0.25초 사이가 정점
- Javascript의 시작 시간은 0.2~0.4초 사이가 정점

![AWS lambda 콜드스타트 언어별 비교](/2022/11/14-AWS_Lambda-Cold_Start-Languages-crunch.png){: width="480"}

## 3. AWS SDK 에서 Go 언어와 다른 언어 코드 비교

출처 : [AWS Lambda - 개발자 안내서](https://docs.aws.amazon.com/ko_kr/lambda/latest/dg/with-sns-create-package.html)

### 1) SNS 메시지를 처리하고 메시지 내용을 로깅

> 확실히 Python 과 Node 가 코드량이 적고, 구조도 단순하다

- Python 3

```python
from __future__ import print_function
import json
print('Loading function')

def lambda_handler(event, context):
    #print("Received event: " + json.dumps(event, indent=2))
    message = event['Records'][0]['Sns']['Message']
    print("From SNS: " + message)
    return message
```

- Node 12.x

```js
console.log('Loading function');

exports.handler = function(event, context, callback) {
    // console.log('Received event:', JSON.stringify(event, null, 4));

    var message = event.Records[0].Sns.Message;
    console.log('Message received from SNS:', message);
    callback(null, "Success");
};
```

- Go 1.x

```go
package main

import (
    "context"
    "fmt"
    "github.com/aws/aws-lambda-go/lambda"
    "github.com/aws/aws-lambda-go/events"
)

func handler(ctx context.Context, snsEvent events.SNSEvent) {
    for _, record := range snsEvent.Records {
        snsRecord := record.SNS
        fmt.Printf("[%s %s] Message = %s \n", record.EventSource, snsRecord.Timestamp, snsRecord.Message)
    }
}

func main() {
    lambda.Start(handler)
}
```

- Java 11

```java
package example;

import java.text.SimpleDateFormat;
import java.util.Calendar;

import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.events.SNSEvent;

public class LogEvent implements RequestHandler<SNSEvent, Object> {
  public Object handleRequest(SNSEvent request, Context context){
    String timeStamp = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss").format(Calendar.getInstance().getTime());
    context.getLogger().log("Invocation started: " + timeStamp);
    
    context.getLogger().log(request.getRecords().get(0).getSNS().getMessage());

    timeStamp = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss").format(Calendar.getInstance().getTime());
    context.getLogger().log("Invocation completed: " + timeStamp);
           return null;
  }
} 
```

### 2) AWS CDK(Cloud Development Kit) 예제

AWS CDK 는 내부적으로 CloudFormation 을 이용함

- Typescript

```ts
import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'MyFirstBucket', {
      versioned: true
    });
  }
}
```

- Python

```python
import aws_cdk as cdk
import aws_cdk.aws_s3 as s3
            
class HelloCdkStack(cdk.Stack):

    def __init__(self, scope: cdk.App, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        bucket = s3.Bucket(self, "MyFirstBucket", versioned=True)
```

- Go

```go
package main

import (
  "github.com/aws/aws-cdk-go/awscdk/v2"
  "github.com/aws/aws-cdk-go/awscdk/v2/awss3"
  "github.com/aws/constructs-go/constructs/v10"
  "github.com/aws/jsii-runtime-go"
)

type HelloCdkStackProps struct {
  awscdk.StackProps
}

func NewHelloCdkStack(scope constructs.Construct, id string, props *HelloCdkStackProps) awscdk.Stack {
  var sprops awscdk.StackProps
  if props != nil {
    sprops = props.StackProps
  }
  stack := awscdk.NewStack(scope, &id, sprops)

  awss3.NewBucket(stack, jsii.String("MyFirstBucket"), &awss3.BucketProps{
    Versioned: jsii.Bool(true),
  })

  return stack
}

func main() {
  defer jsii.Close()

  app := awscdk.NewApp(nil)

  NewHelloCdkStack(app, "HelloCdkStack", &HelloCdkStackProps{
    awscdk.StackProps{
      Env: env(),
    },
  })

  app.Synth(nil)
}

func env() *awscdk.Environment {
  return nil
}
```

- Java

```java
package com.myorg;

import software.amazon.awscdk.*;
import software.amazon.awscdk.services.s3.Bucket;

public class HelloCdkStack extends Stack {
    public HelloCdkStack(final App scope, final String id) {
        this(scope, id, null);
    }

    public HelloCdkStack(final App scope, final String id, final StackProps props) {
        super(scope, id, props);

        Bucket.Builder.create(this, "MyFirstBucket")
            .versioned(true).build();
    }
}
```

### 3) 추가 : Terraform 코드

출처 : [Understanding IaC Tools: AWS CDK vs. Terraform](https://geekflare.com/aws-cdk-vs-terraform/)

- Infrastructure as code (IaC) tools of HashiCorp
  + AWS, GCS, Azure, Kubernetes, Oracle Cloud, Alibaba Cloud
- 테라폼이 더 생산성이 좋다며 추천 [(CDK 는 두번째 대안)](https://www.reddit.com/r/aws/comments/sy29ko/comment/hxvqefa/?utm_source=share&utm_medium=web2x&context=3)

```tf
resource "aws_s3_bucket" "my_s3_bucket" {
  bucket = "my-tf-bucket"

  tags = {
    Name        = "My bucket"
    Environment = "Dev"
  }
}
```

#### Terraform 자료

- [테라폼 동영상 튜토리얼](https://developer.hashicorp.com/terraform/tutorials/aws-get-started)
- [Terraform CLI 설치](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/aws-build#prerequisites)
  + 사전설치 [AWSCLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) `brew install awscli`
  + 설치 `brew install terraform`
    * 탭 추가 `brew tap hashicorp/tap`
- [Terraform Cloud](https://www.terraform.io/cloud)
  + 테라폼 서버를 따로 운영하지 않으려면 클라우드를 사용
  + 여러 클라우드 환경을 동시 운용시 유용 

- 예제) Amazon Linux 2 인스턴스 생성하기 [(AMI 카탈로그 검색)](https://ap-northeast-2.console.aws.amazon.com/ec2/v2/home?region=ap-northeast-2#AMICatalog:)

```bash
$ mkdir terraform-ec2-tutorial && cd terraform-ec2-tutorial
$ cat <<EOF > main.tf 
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-northeast-2"  # Seoul
}

resource "aws_instance" "app_server" {
  ami           = "ami-09cf633fe86e51bf0"  # Amazon Linux 2
  instance_type = "t2.micro"

  tags = {
    Name = "ExampleAppServerInstance"
  }
}
EOF

$ terraform init         # 초기화
Terraform has been successfully initialized!

$ terraform fmt          # 구성 자동 업데이트
main.tf

$ terraform validate     # 문법 검사
Success! The configuration is valid.

$ terraform apply        # 내용 확인 및 적용
# aws_instance.app_server will be created
Do you want to perform these actions? yes
...
aws_instance.app_server: Creation complete after 32s [id=i-07e8f806bc94ae977]

Apply complete! Resources: 1 added, 0 changed, 0 destroyed.

$ terraform show         # 결과 확인
# aws_instance.app_server:
resource "aws_instance" "app_server" {
  ...
}

$ terraform state list   # 상태 리스트 
aws_instance.app_server

$ ps -ef | grep terr     # 테라폼 서버가 돌고 있다
  501 49512 31939   0  2:37PM ??         0:01.78 /Users/bgmin/.vscode/extensions/hashicorp.terraform-2.24.3-darwin-arm64/bin/terraform-ls serve
```

## 4. AWS 활용 관련 팁(Tip)

### 1) [Lambda가 우리에게 적합하지 않은 이유](https://prismatic.io/blog/why-we-moved-from-lambda-to-ecs/#why-lambda-didnt-work-for-us) (ECS로 전환)

#### 서비스를 Lambda 에서 운영하며 부딪힌 문제들

- **속도 문제** : 다른 기능과 통합시 많은 지연 발생
  + Lambda 호출은 빠르지만, SQS 에 기록하고 다음 단계를 실행하는데는 단계마다 몇초가 걸렸음. ex) 500개 이상의 파일을 반복하는 경우는 몇분 ~ 몇시간이 걸리기도
  + 예열도 하고, vCPU 와 RAM 크기를 늘려도 크게 나아지지 않았음

- **SQS 크기 제한** : 메시지 크기를 256KB 로 제한
  + 종종 데이터 크기가 초과하는 경우 처리할 수 없었음
  + 차선책으로 S3 에 데이터를 적재후 참조 정보만 SQS 로 전달했음. 이 방식은 API 의 속도 저하 문제를 더 악화시켰음

- **프로세스 격리** : 완전히 격리된 실행이 아니었음
  + Lambda 는 상태 비정장 컴퓨팅 엔진으로 수평 확장이 매력적임. 그러나, Lambda 호출이 서로 격리되어 있는 것은 절반만 사실임 (놀란던 문제)
  + 첫 호출(Cold start)은 격리된 것이 맞지만, 이후 Warm(웜) 환경을 재사용하므로, 문제를 일으켰던 Dirty 상태가 그대로 이용될 수 있음
    * 강제로 Cold start를 하도록 하는데 어려움이 많았다고

#### ECS(AWS Elastic Container Service) 로 전환

서비스의 주요 작업은 ECS 를 활용하고, 관리 기능은 Lambda 를 활용

- 통합 실행의 지연 문제를 2초 이내에 다시 실행되도록 해결함
  + ECS 에서 불완전한 프로세스 격리 문제를 해결했고, 
  + SQS 크기 제한 문제는 Redis 대기열 서비스로 교체 

- 완벽하지는 않다
  + 자동 확장이 Lambda 만큼 빠르게 작동되지 않다
  + 스케일 업의 경우 컨테이너를 풀다운하고 초기화하는데 1분정도 소요
  + 수동으로 조작하기 위해, 규칙과 모니터링에 관해 추가 개발

- Lambda 에는 중요하지 않은 외적인 기능들을 남겨두었다.
  + 예약된 통합 작업을 대기열에 넣거나 메타 데이터를 DB에 기록
  + 통합 작업이 실패한 경우 이메일 알람을 보내거나
  + ECS 에서 로그를 가져와 DataDog 으로 전송하는 로거 서비스

## 9. Summary

백엔드는 핵심과 주변 기능으로 나누어서 구현하고 배포하자

- 클라우드에서 언어 선택은
  + ECS / EC2 같이 독립적인 자원을 활용할 때는 컴파일 언어가 좋고
  + Serverless 에서는 인터프리터 언어가 생산성이 좋다
    * 외부에서의 클라우드 관리 도구도 인터프리터 언어가 좋다
- 클라우드 구조는 
  + 주 기능을 ECS(+ Docker) / EC2 에서 구현하고 (데이터 가공)
  + 이벤트, 메시지 전달 등 지연 가능한 서비스는 Lambda 에서 처리
- 데이터 처리 방식
  + 가공/처리는 가급적 단일 레이어 내에서 완료 (중간 단계 없이)
  + 로그, 이미지, 알림 등의 파생 데이터는 저장 후 분산 처리 

- [Terraform 문서의 AWS Lambda Function 예제](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function#basic-example) 를 살펴보자.
  + 엄청 심플하네. 정말 좋다!
  
&nbsp; <br />
&nbsp; <br />

> **끝!** &nbsp; 읽어주셔서 감사합니다.
{: .prompt-info }