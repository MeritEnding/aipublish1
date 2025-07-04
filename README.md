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


