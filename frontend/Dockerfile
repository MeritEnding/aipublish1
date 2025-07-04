# 1단계: Build React 앱
FROM node:18 AS builder

WORKDIR /app
COPY . .

# 필요 시 yarn → npm 으로 교체 가능
RUN npm install
RUN npm run build

# 2단계: nginx로 정적 파일 서빙
FROM nginx:stable-alpine

# React build 결과를 nginx 기본 경로로 복사
COPY --from=builder /app/build /usr/share/nginx/html

# CORS 등 설정 원할 경우 nginx.conf 추가 가능
# COPY nginx.conf /etc/nginx/nginx.conf  (선택사항)

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
