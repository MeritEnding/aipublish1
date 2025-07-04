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
