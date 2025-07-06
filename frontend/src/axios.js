import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // .env의 값 사용됨
  withCredentials: true, // 필요 시 쿠키 전달
});

export default api;