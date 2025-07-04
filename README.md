# 실행 방법

## 1. 배포된 사이트 실행 방법
[걷다가 서재 사이트](http://20.249.104.162/)

- 로그인
- 회원가입(KT 체크)
- 마이페이지 포인트 5000 확인
- 작가등록
- 작가 승인까지 기다리기 관리자(작가승인 or 작가반려)
- 작가 승인 일 때 글을 작성 할 수 있는지 확인 
- 작가 반려일 때 글을 작성 할 수 없는지 확인
- 다시 사용자로 로그인해서 
- 도서등록(도서 내용 작성)
- 메타 데이터 확인 및 최종 제출
- 전체 도서로 가서 책 출간 확인
- 도서 상세내용 보기
- 마이페이지에서 포인트 감소 확인
- 열람한 도서 다시 들어갈 때 포인트 감소하지 않는 거 확인
- 회원가입(구독자)
- 도서 열람할 때 구독자면 포인트 감소하지 않는 거 확인
- 관리자 일 때 도서 삭제 할 수 있는지 확인
 
## 2. 배포 전 코드 실행 방법

## 1. 기본설정

https://gitpod.io/#https://github.com/MeritEnding/aipublish1.git 접속

다음 명령어를 차례대로 수행

git fetch

git reset —hard

git clean -fd

git checkout -b release origin/release

sdk install java

./init.sh

다른 터미널 열고

cd infra

docker compose up -d

각 서버 다 실행 시키기

cd aibookautomation

mvn spring-boot:run

cd bookpublication

mvn spring-boot:run

cd gateway

mvn spring-boot:run

cd subscritpionandpoint

mvn spring-boot:run

cd writerregistration

mvn spring-boot:run

cd frontend1

cd aipub

npm install -g yarn

yarn install

yarn start

## 2. 깃포드 바뀐거 설정

깃포드는 실행할때마다 자기 페이지로 바뀝니다.. 서버 실행했으면 그 뜬 것을 복붙하는 과정입니다.

![image](https://github.com/user-attachments/assets/08307ba2-2472-4c54-977b-a018c5dfd7cd)


gateway

![image](https://github.com/user-attachments/assets/3c6b08f2-dea3-40b1-a3aa-38d62b7512f0)


aibookautomain: api 넣기, 경로 설정

![image](https://github.com/user-attachments/assets/12b7a46f-0ae7-4595-a749-6cb164d88dd1)


bookpublication: 경로설정

![image](https://github.com/user-attachments/assets/4796a6d3-e9e6-4016-9d7e-227666e61eb8)


subscriptionandpoint 바꿀것없음

writerregistration: 경로설정

![image](https://github.com/user-attachments/assets/3afa94b8-6a36-480a-83f4-0269f04d70f5)


frontend1

pakage.json: 프록시 경로를 새로운 게이트웨이 경로

![image](https://github.com/user-attachments/assets/e69888b2-faa4-48cc-b9c9-a04c71d6a803)


1. 서버 재실행

각 서버 다 실행 시키기

aibookautomation

mvn spring-boot:run

bookpublication

mvn spring-boot:run

gateway

mvn spring-boot:run

subscritpionandpoint

mvn spring-boot:run

writerregistration

mvn spring-boot:run

frontend1

yarn start


## 3. 배포 방법

# 🚀 프로젝트 배포 가이드 (Azure AKS + ACR)

---

## 📂 브랜치 Pull 및 .env 설정

```bash
# 본인 배포용 브랜치 생성 및 pull
git checkout -b deploy/gyuhee
git pull origin deploy/gyuhee

# 루트 경로에 .env 파일 생성
echo "OPENAI_API_KEY=sk-xxxxx" > .env

# ☁️ Azure Cloud Setup (AKS, ACR)

이 문서는 Azure 포털을 통해 AKS (Azure Kubernetes Service) 클러스터 및 ACR (Azure Container Registry) 설정 과정을 안내합니다.

---

## 1️⃣ 구독(Subscription) 확인

1. [Azure 포털](https://portal.azure.com)에 로그인합니다.
2. 상단 검색창에 **`구독`** 또는 **`Subscription`** 을 입력하고 선택합니다.
3. 본인의 **구독 정보**를 확인합니다.

---

## 2️⃣ 리소스 그룹 생성

1. Azure 포털 상단 검색창에 **`리소스 그룹`** 입력 후 선택합니다.
2. **`만들기`** 버튼을 클릭합니다.
3. 다음 항목들을 입력합니다:

   - **구독**: 본인 계정의 구독 선택
   - **리소스 그룹명**: `userXX-rsrcgrp` (예: `user07-rsrcgrp`)
   - **영역(Region)**: `(Asia Pacific) Korea Central`

4. **`다음`** 클릭 → **`검토 + 만들기`** → **`만들기`** 클릭

---

## 3️⃣ AKS 클러스터 생성

1. 상단 검색창에 **`Kubernetes`** 입력 후 선택합니다.
2. **`만들기` > `Kubernetes 클러스터`** 선택

### 🔧 기본 설정

- **구독**: 본인 계정의 구독
- **리소스 그룹**: 위에서 생성한 `userXX-rsrcgrp`
- **클러스터 이름**: 예) `user07-aks`
- **용도**: `개발/테스트`

**→ `다음` 버튼 클릭**

---

### 📌 Agent Pool 설정

1. **`노드 풀`** 탭으로 이동
2. 기본 생성된 `agentpool` 클릭
3. 아래와 같이 설정 변경:

   - **가용성 영역**: `영역 1`, `영역 2`, `영역 3` 모두 선택
   - **노드 크기**: `DS2_v2 (2Core, 7GB RAM)`
   - **크기 조정 방식**: 자동 크기 조정 활성화
     - **최소 노드 수**: 3
     - **최대 노드 수**: 3

4. 하단의 **`업데이트`** 클릭  
5. **`다음`** 클릭 → **`검토 + 만들기`** → **`만들기`** 클릭

---

## ✅ 완료 확인

- 우측 상단의 **🔔 알림 아이콘** 클릭하여 **클러스터 생성 완료 여부** 확인
- 클러스터 생성 후, Azure CLI 또는 포털을 통해 클러스터에 연결 가능

---

📌 다음 단계로는 [kubectl 설정](https://learn.microsoft.com/ko-kr/azure/aks/kubernetes-walkthrough#connect-to-the-cluster) 및 Docker 이미지 배포, Helm, Kafka 설정이 필요합니다.

## 🧰 Azure CLI & Helm 설치

```bash
# Azure CLI 설치
curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash

# Azure 로그인
az login --use-device-code

# AKS 자격증명 가져오기
az aks get-credentials --resource-group <RESOURCE-GROUP-NAME> --name <CLUSTER-NAME>

# Helm 설치
curl https://raw.githubusercontent.com/helm/helm/master/scripts/get-helm-3 > get_helm.sh
chmod 700 get_helm.sh
./get_helm.sh

# Helm Repo 추가 및 Kafka 설치
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# Kafka 설치 (버전 명시)
helm install my-kafka bitnami/kafka --version 23.0.5

## Gateway / Ingress 설정

- Ingress를 사용할 경우, **정적 퍼블릭 IP**가 반드시 필요합니다.
- Gateway 권한 문제 발생 시, **Ingress**로 대체하여 사용할 수 있습니다.
- 권한 설정이 미흡할 경우, HTTP 413 Error가 발생할 수 있으니 주의가 필요합니다.

---

## Docker & ACR 이미지 배포

### 1. ACR 이미지 경로 수정

`kubernetes/deployment.yaml` 파일 내 이미지 경로를 다음과 같이 수정합니다:

```yaml
image: <ACR_URL>/<서비스명>:<버전>

kubectl apply -f kubernetes/deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl get all

---
AI 서비스 관련 설정
 OpenAI Secret 확인 및 생성

복사
편집
# openai-secret 존재 여부 확인
kubectl get secret openai-secret

# 존재하지 않는다면 생성
kubectl create secret generic openai-secret \
  --from-literal=OPENAI_API_KEY=sk-xxxxxx
AI 서비스 재시작

복사
편집
kubectl rollout restart deploy aibookautomation
 마무리
배포가 완료되면 아래 명령으로 정상 동작 여부를 계속 확인하세요:


복사
편집
kubectl get pods
kubectl logs <pod-name>






# Github 협업 규칙

## 브랜치

| 브랜치 | 용도 |
| --- | --- |
| `main` | 최종 배포, 확정된 코드만 올라감 |
| `master` | 배포 기준, 확정된 코드만 올라감 |
| `develop`| 벡엔드 프론트앤드 연동 |
| `frontend` | 프론트엔드 개발 공통 브랜치 |
| `backend` | 백엔드 개발 공통 브랜치 |
| `feature/팀이름` | 팀 작업 브랜치 (각 브랜치에서 파생) |
| `feature num/팀이름` | 개인 작업 브랜치 (각 브랜치에서 파생) |

**규칙**

- **main은 직접 수정 금지**
- 반드시 `frontend` or `backend`에서 **개인 브랜치 생성 후 작업**
- 작업 전 항상 `pull` 먼저 받아오기
`git pull origin [브랜치]`

## **Pull Request(PR) 생성 규칙**

| 항목 | 내용 |
| --- | --- |
| PR 대상 | `frontend` or `backend` 브랜치로 PR |
| PR 제목 | `로그인 기능 구현` 형태 |
| PR 본문 | - 어떤 기능/수정 작업인지 간단 설명- 참고 이슈 or 스크린샷 |
- 깃허브 담당자가 PR 확인 후 각 해당 브랜치로 Merge

![image](https://github.com/user-attachments/assets/4cf64e25-9013-4593-8522-6e73a51fac14)

❗베이스 브랜치 기본이 main으로 되어있음 잘 확인해서 merge 해야하는 브랜치로 바꾸기

## 개인 작업 브랜치 만들기

```bash

git checkout backend
git pull origin backend
git checkout -b feature본인팀번호/본인이름
```
## 수정 파일 원격 깃 푸시

```
git push origin feature본인팀번호/본인이름
```

## 올라가면 안되는 파일 올라갔을 때,,

### 1. `.gitignore`에 추가했는데 이미 커밋됨

```bash
git rm --cached 파일
```

```bash
git rm --cached kubectl
git commit -m "chore: ignore kubectl"
```

### 2. 특정 파일만 이전 상태로 되돌리기

```bash
git checkout main -- 파일경로/이름
```

### 3. 최근 커밋 되돌리기

```bash
git reset --soft HEAD~1
```

- 커밋만 되돌리고 코드/스테이지 상태는 유지됨

### 4. 최근 커밋 되돌리기 (코드까지 제거)

```bash
git reset --hard HEAD~1
```

- 커밋 + 코드도 되돌아감

### 5. 깃에 올리면 안되는 파일 add 됐을 때(커밋 전)

git restore --staged 파일경로/이름


---
# 카프카 통신 

## Model
www.msaez.io/#/105867850/storming/03ace7e054b1a8b7618fd07c466976a7

## Before Running Services
### Make sure there is a Kafka server running
```
cd kafka
docker-compose up
```
- Check the Kafka messages:
```
cd infra
docker-compose exec -it kafka /bin/bash
cd /bin
./kafka-console-consumer --bootstrap-server localhost:9092 --topic
```

## Run the backend micro-services
See the README.md files inside the each microservices directory:

- writerregistration
- subscriptionandpoint
- bookpublication
- aibookautomation


## Run API Gateway (Spring Gateway)
```
cd gateway
mvn spring-boot:run
```

## Test by API
- writerregistration
```
 http :8088/writes userId="user_id"name="name"email="email"bio="bio"status="status"createdAt="createdAt"
```
- subscriptionandpoint
```
 http :8088/users userId="user_id"name="name"email="email"passwordHash="passwordHash"isKtCustomer="isKtCustomer"subscription="subscription"
 http :8088/points pointId="pointId"userId="userId"balance="balance"
```
- bookpublication
```
 http :8088/books bookId="bookId"userId="user_id"title="title"content="content"summary="summary"coverImageUrl="coverImageUrl"category="category"price="price"status="status"viewCount="viewCount"createdAt="createdAt"
```
- aibookautomation
```
 http :8088/aiBookProcessors processorId="processorId"bookId="bookId"summary="summary"coverImageUrl="coverImageUrl"category="category"price="price "processStatus="ProcessStatus"createdAt="createdAt"
```


## Run the frontend
```
cd frontend
npm i
npm run serve
```

## Test by UI
Open a browser to localhost:8088

## Required Utilities

- httpie (alternative for curl / POSTMAN) and network utils
```
sudo apt-get update
sudo apt-get install net-tools
sudo apt install iputils-ping
pip install httpie
```

- kubernetes utilities (kubectl)
```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
```

- aws cli (aws)
```
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

- eksctl 
```
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```
---
#  요구사항 정의서

---

##  기능 요건

| 사용자 | 기능 항목 | 상세 내용 |
|--------|-----------|-----------|
| 작가 | 작가 등록 | 기본정보 + 포트폴리오 입력 → 관리자 승인 후 사용 가능 |
| 작가 | 글 작성 및 저장 | 에디터 작성 + 임시 저장/최종 저장 가능 |
| 작가 | 출간 요청 | 작성 완료 후 AI 출간 요청 (자동 표지 + 요약 포함) |
| 구독자 | 회원가입 및 포인트 지급 | 기본 1,000P 지급 + KT 고객이면 추가 5,000P |
| 구독자 | 구독 신청 및 열람 | 포인트 차감 or 월 9,900원 요금제로 무제한 열람 |
| 구독자 | 도서 즐겨찾기 | 도서 즐겨찾기 기능 (추가) |
| AI | 표지 이미지 생성 | 제목, 요약, 키워드 기반 표지 이미지 생성 |
| AI | 전자책 요약 | ePub 또는 PDF 자동 생성 |
| AI | 상품 자동 등록 | 카테고리 자동 분류 및 구독료 설정 |
| AI | 작가 스타일 번역 | 작가의 스타일로 콘텐츠 자동 변환 (추가) |
| 공통 | 베스트 셀러 등록 | 열람 5회 이상 도서에 배지 부여 및 추천 우선 노출 |
| 공통 | 포인트 사용 제약 | 포인트 소진 시 열람 불가 → KT 요금제 추천 노출 |

---

##  비기능 요건

| 구분 | 요구사항 |
|------|----------|
| 트랜잭션 | 작가 출간 요청 → AI 요약 + 표지 자동화 → 등록까지 트랜잭션 일관성 보장 |
| 장애 격리 | AI 또는 포인트 서비스 장애 시에도 출간 및 구독 신청 기능은 정상 운영 |
| 성능 | 실시간 응답 및 상태 확인 필요 (CQRS, Event-driven 구조 반영) |

---

#  사용자 스토리 (User Story)

---

##  작가 관련

- **US-01**  
  As a 작가,  
  I want to 기본 정보, 자기소개, 포트폴리오를 입력해 등록을 신청할 수 있어야 한다.  
  So that 관리자의 승인을 받아 작가 전용 기능을 사용할 수 있다.

- **US-02**  
  As a 작가,  
  I want to 웹 에디터를 통해 다양한 유형의 글을 작성하고 임시 저장하거나 최종 저장할 수 있어야 한다.  
  So that 글을 준비하고 관리할 수 있다.

- **US-03**  
  As a 작가,  
  I want to 출간 요청 버튼을 클릭하여 전자책 출간 절차를 자동으로 시작할 수 있어야 한다.  
  So that 손쉽게 출간을 진행하고 AI의 도움을 받을 수 있다.

---

##  구독자 관련

- **US-04**  
  As a 신규 사용자,  
  I want to 회원 가입 시 포인트를 자동 지급받고, KT 고객일 경우 추가 포인트를 받을 수 있어야 한다.  
  So that 초기 이용에 도움이 된다.

- **US-05**  
  As a 구독자,  
  I want to 월 정액 요금제를 통해 다양한 콘텐츠를 무제한 열람할 수 있어야 한다.  
  So that 원하는 도서를 자유롭게 읽을 수 있다.

- **US-06**  
  As a 구독자,  
  I want to 보유 포인트로 프리미엄 콘텐츠를 구매할 수 있어야 한다.  
  So that 유료 혜택을 활용할 수 있다.

---

##  관리자 관련

- **US-07**  
  As a 관리자,  
  I want to 작가 등록 요청을 승인하거나 반려할 수 있어야 한다.  
  So that 플랫폼의 콘텐츠 품질을 관리할 수 있다.

- **US-08**  
  As a 관리자,  
  I want to 등록된 도서를 목록에서 확인하고 품질 기준에 따라 삭제할 수 있어야 한다.  
  So that 부적절한 콘텐츠 유통을 방지할 수 있다.

---

##  AI 시스템 관련

- **US-09**  
  As a AI 시스템,  
  I want to 출간 요청 시 제목, 요약, 키워드를 기반으로 전자책 커버 이미지를 자동 생성할 수 있어야 한다.  
  So that 작가의 수작업 없이도 매력적인 표지를 제공할 수 있다.

- **US-10**  
  As a AI 시스템,  
  I want to 원고 내용을 요약해 줄거리 설명을 자동 생성할 수 있어야 한다.  
  So that 책 소개와 마케팅을 쉽게 할 수 있다.

- **US-11**  
  As a AI 시스템,  
  I want to 작성된 글을 EPUB 또는 PDF 포맷으로 자동 변환할 수 있어야 한다.  
  So that 다양한 디바이스에서 열람 가능한 전자책 형태로 제공할 수 있다.

- **US-12**  
  As a AI 시스템,  
  I want to 줄거리 및 메타데이터를 분석해 도서 카테고리를 자동 생성하고 적절한 구독 요금을 산정할 수 있어야 한다.  
  So that 콘텐츠 분류와 과금이 자동화될 수 있다.

---

##  플랫폼 시스템 관련

- **US-13**  
  As a 플랫폼 시스템,  
  I want to 도서 열람 수가 5회 이상일 때 해당 도서에 ‘베스트셀러’ 배지를 자동으로 부여할 수 있어야 한다.  
  So that 인기 도서를 강조하고 추천 우선순위에 반영할 수 있다.

- **US-14**  
  As a 플랫폼 시스템,  
  I want to 사용자의 포인트가 모두 소진되었을 때 KT 요금제 전환 또는 유료 구독 유도 메시지를 제공할 수 있어야 한다.  
  So that 서비스 이용을 지속시킬 수 있다.



---
#  API 명세서

> Notion 링크 기반 DTO 불러오기 방식 사용  
> DTO 작성 위치: [[DTO(데이터 전달 객체)]]  
> 사용 시: `[[DTO_이름]]`

---

##  사용자 관련

| 기능 | Method | URL | Request DTO | Response DTO | 비고 |
|------|--------|-----|--------------|---------------|------|
| 회원가입 | POST | `/users/registeruser` | [[RegisterUserCommand]] | [[UserResponse]] | |
| 로그인 | POST | `/users/login` | [[LoginUserCommand]] | [[UserResponse]] | |
| 포인트 잔액 조회 | GET | `/users/{id}/point` | - | [[PointResponse]] | |
| 포인트 구매 | POST | `/points/grant` | [[GrantPointCommand]] | [[PointResponse]] | |
| 마이페이지 조회 | GET | `/users/{id}/views` | - | - | |
| 구매 도서 목록 조회 | GET | `/books/purchased?userId={userId}` | - | [[PurchasedBookDTO]] | 제목, 표지 포함 |

---

##  구독 관련

| 기능 | Method | URL | Request DTO | Response DTO | 비고 |
|------|--------|-----|--------------|---------------|------|
| 구독 활성화 | POST | `/subscriptions/activate?userId={userId}` | - | - | |
| 구독 비활성화 | POST | `/subscriptions/deactivate?userId={userId}` | - | - | |

---

##  작가 관련

| 기능 | Method | URL | Request DTO | Response DTO | 비고 |
|------|--------|-----|--------------|---------------|------|
| 작가 등록 요청 | POST | `/writers/apply` | [[ApplyWriterRegistrationCommand]] | [[WriterCandidate]] | |
| 작가 여부 확인 (내부) | GET | `/writers/{userId}/isApproved` | - | Boolean | |

---

##  도서 관련

| 기능 | Method | URL | Request DTO | Response DTO | 비고 |
|------|--------|-----|--------------|---------------|------|
| 도서 저장/임시저장 | POST | `/books/savebookcommand` | [[SaveBookCommand]] | [[Book]] | status = DRAFT |
| 출간 요청 | POST | `/books/submitbookcommand` | [[SubmitBookCommand]] | [[Book]] | status = SUBMITTED |
| 출간 완료 도서 조회 | GET | `/books?status=PUBLISHED` | - | [[Book]] | |
| 베스트셀러 조회 | GET | `/books/bestsellers` | - | [[Book]] | viewCount ≥ 5 |
| 도서 상세 조회 | GET | `/books/{id}?userId={userId}` | - | [[Book]] | viewCount 증가, 자동 구매 처리 |
| 도서 삭제 (관리자) | DELETE | `/books/{id}?userId={userId}` | - | - | |
| 전체 도서 목록 (사용 X) | GET | `/books` | - | [[Book]] | |
| 메타데이터 업데이트 (내부) | POST | `/books/updatemetadata` | [[UpdateBookMetadataCommand]] | [[Book]] | status = PUBLISHED |

---

##  관리자 기능

| 기능 | Method | URL | Request DTO | Response DTO | 비고 |
|------|--------|-----|--------------|---------------|------|
| 작가 요청 리스트 조회 | GET | `/admin/writers?adminId={userId}` | - | [[WriterCandidate]] | |
| 작가 승인/반려 | PATCH | `/admin/writers/{writerId}/status?adminId={userId}` | [[ChangeWriterStatusCommand]] | [[WriterCandidate]] | |

---

##  포인트 관련 (내부)

| 기능 | Method | URL | Request DTO | Response DTO | 비고 |
|------|--------|-----|--------------|---------------|------|
| 포인트 차감 | POST | `/points/deduct` | - | - | 내부 로직 전용 |

---

##  AI 도서 자동화 관련 (내부)

| 기능 | Method | URL | Request DTO | Response DTO | 비고 |
|------|--------|-----|--------------|---------------|------|
| AI 도서 등록 | POST | `/aiBookProcessors` | [[AiBookProcessor]] | [[AiBookProcessor]] | status = READY |
| AI 출간 시작 | POST | `/aiBookProcessors/{id}/startaipublishing` | - | [[AiBookProcessor]] | status = COMPLETE, 메타+표지 자동 생성 |
| AI 메타데이터 수정 | POST | `/aiBookProcessors/{id}/updatebookmetadata` | [[UpdateBookMetadataCommand]] | [[AiBookProcessor]] | |
| AI 출간 도서 상세 조회 | GET | `/aiBookProcessors/{id}` | - | [[AiBookProcessor]] | |

---

##  API 테스트 예시 (httpie)

```bash
# 회원 등록
http :8088/users/registeruser userId="user1" name="홍길동" email="hong@email.com"

# 포인트 지급
http :8088/points/grant userId="user1" pointId="p1" balance="1000"

# 도서 저장
http :8088/books/savebookcommand bookId="b1" userId="user1" title="제목" status="DRAFT"

# AI 도서 등록
http :8088/aiBookProcessors processorId="proc1" bookId="b1" summary="요약" ...

---


