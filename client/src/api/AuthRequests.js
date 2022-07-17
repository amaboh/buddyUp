import axios from "axios"

const API = axios.create({baseURL: "http://localhost:5007/api"})
export const logIn = (formData)=> API.post("/auth/login", formData)
export const signUp = (formData)=> API.post("/auth/signup", formData)
