import axios from "axios";

const API = axios.create({
  baseURL: "https://hrms-lite-a5f5.onrender.com/api/"
});

export default API;