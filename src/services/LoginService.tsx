import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 1000,
  headers: { "Content-Type": "application/json" }
});

export class LoginService{
    login(email: string, password: string){
        return axiosInstance.post("/login", { email: email, password: password});
    }
}