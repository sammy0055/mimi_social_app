import axios from "axios";
const instance = axios.create({
  baseURL: "https://us-central1-social-app-3ed3c.cloudfunctions.net/api",
});

export default instance;

//http://localhost:5001/social-app-3ed3c/us-central1/api
