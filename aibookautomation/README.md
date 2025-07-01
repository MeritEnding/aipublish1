# aibookautomation

AI 기반 도서 요약, 카테고리 분류, 예상 가격 추천 및 표지 이미지 자동 생성 서비스  
(Sprint Boot + OpenAI GPT + DALL·E 2)

---

## 🚀 주요 기능

- **책 등록**: 제목, 내용 등 입력
- **AI 자동화**:  
  - GPT-3.5-turbo로 책 내용 요약, 카테고리/가격 제안
  - DALL·E 2로 표지 이미지 프롬프트 생성 및 실제 이미지 자동 생성
- **REST API 제공**
- **Kafka 이벤트 연동 및 DB 관리**
- **로컬, Docker, Kubernetes 환경 지원**

---

## 🛠️ 로컬 개발 환경 실행

```bash
mvn spring-boot:run

---
## 🐳 Docker로 빌드/실행

mvn package -B -DskipTests
docker build -t username/aibookautomation:v1 .
docker run -e OPENAI_API_KEY=sk-... -p 8080:8080 username/aibookautomation:v1


---
## ☁️ Kubernetes 배포

1. 이미지 Push

docker login
docker push username/aibookautomation:v1


2. kubernetes/deployment.yaml 이미지명 변경

spec:
  containers:
    - name: aibookautomation
      image: username/aibookautomation:v1
      ports:
        - containerPort: 8080
3. 배포

kubectl apply -f kubernetes/deployment.yaml
4. 상태 확인 & 포트포워딩

kubectl get pods -l app=aibookautomation
kubectl port-forward deploy/aibookautomation 8080:8080


---
## 🔑 OpenAI API Key 보안 관리

- .env 파일 또는 application-secret.yml 등으로 별도 분리
- 환경변수(OPENAI_API_KEY)로 주입 (강력 권장)
- 절대 Git 등 외부 저장소에 노출 금지!


---
## 💡 API 사용 예시
1. 책 등록

http POST :8080/aiBookProcessors bookId="test-1" title="데이터 과학 입문" content="실전 데이터 과학 입문서"


2. AI 출판 자동화 실행

http POST :8080/aiBookProcessors/1/startaipublishing

응답 예시
{
  "category": "컴퓨터 과학/데이터 과학",
  "coverImageUrl": "https://...",
  "price": 25000,
  "summary": "이 책은 데이터 과학의 기초 개념과 실전 프로젝트를 단계별로 설명하고 있는 입문서입니다."
}


---
## 🖼️ DALL·E 2 표지 이미지 생성

영어로 추출한 프롬프트 기반으로 표지 이미지를 생성
지원 사이즈: "256x256", "512x512", "1024x1024"
결과 이미지 URL이 coverImageUrl 필드에 포함됨
DALL·E API의 사용량/비용 정책에 유의


---
## 📝 Trouble Shooting

이미지 생성 오류: size 파라미터가 지원되는 값(512x512 등)인지 확인
API Key 문제: 환경변수/시크릿 노출 여부 반드시 점검
Kafka 연동 문제: local/k8s 환경에서 토픽, 포트 등 재확인


---
## 📁 프로젝트 주요 구조

src/main/java/aipublish/service/AiBookAutomationService.java: 핵심 자동화 서비스
src/main/resources/application.yml: 환경설정
kubernetes/deployment.yaml: K8S 배포파일
README.md: 프로젝트 설명 (본 파일)


---
## 🤝 협업 규칙
Git에 시크릿/키 커밋 절대 금지!
커밋 메시지: [기능/버그/설명] 간결히 작성
상세 협업 규칙: # Github 협업 규칙.txt 참고