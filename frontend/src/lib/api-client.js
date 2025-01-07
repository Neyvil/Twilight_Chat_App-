import axios from "axios";
import { BACKEND_HOST } from "../../utils/constant.js";
const apiClient = axios.create({
  baseURL: BACKEND_HOST,
});

export { apiClient };
