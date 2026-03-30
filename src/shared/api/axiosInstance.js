import axios from "axios";
import { reissueToken } from "./reissueToken";

const axiosInstance = axios.create({
//  baseURL: "http://localhost:9090/api/v1", // Spring Boot 백엔드 API 주소 [개발환경]
//  baseURL: "http://52.78.45.234/api/v1", // Spring Boot 백엔드 API 주소 [EC2]
  baseURL: "https://godlifelog.com/api/v1", // HTTPS 통신용 주소

  headers: {
    //"ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json; charset=UTF-8",
    Accept: "application/json; charset=UTF-8",
  },
  withCredentials: true, // 필요한 경우 (JWT, 세션 사용 시)
});

axiosInstance.interceptors.request.use(
  (config) => {
     console.log("++++++++++++++ api 요청 +++++++++++++++++++");
    // JWT 토큰 가져오기 (로컬 스토리지)
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
     console.log(config);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => {
     console.log("✅ Response received:", response);
    return response; // 반드시 반환
  },
  async (error) => {
    const originalRequest = error.config;

    // 🔹 재발급 요청 자체는 재시도하지 않도록 제외
    if (originalRequest.url === "/reissue") {
      return Promise.reject(error);
    }

    // 🔹 로그인 요청은 재발급 제외
    if (originalRequest.url.startsWith("/user/")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await reissueToken(); // refresh 쿠키 기반 재발급
        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest); // 원래 요청 다시 시도
      } catch (err) {
        console.log(err);
      }
    }

    return Promise.reject(error);
  }
);



export default axiosInstance;
