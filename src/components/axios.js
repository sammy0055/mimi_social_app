import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:5001/social-app-3ed3c/us-central1/api",
});

export default instance;
