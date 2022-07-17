import axios from "axios";
const API = axios.create({baseURL: 'http://localhost/5007/api/'})
export const fetchUser=()=> API.get("/login/success");