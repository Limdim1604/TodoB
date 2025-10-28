import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
}); //tạo 1 instance của axios với cấu hình baseURL tùy thuộc vào môi trường dev hay production

export default api;