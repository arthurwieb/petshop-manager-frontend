import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 1000,
  headers: { "Content-Type": "application/json" }
});

export class LoginService{
    login(login: string, senha: string){
        return axiosInstance.post("/auth/login", { username: login, password: senha});
    }
}