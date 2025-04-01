import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 1000,
  headers: { "Content-Type": "application/json" }
});

export class BaseService {
    url: string;
    constructor(url: string){
        this.url = url;

        axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('JWT_TOKEN');          
            console.log("Token utilizado na chamada " + url + ": " + token);
            const authRequestToken = token ? `Bearer ${token}` : '';
            config.headers['Authorization'] = authRequestToken;
            return config;
        },
            (error) => Promise.reject(error)
        );

        axiosInstance.interceptors.response.use((response) => {            
            return response;
        }, async (erro) => {
            console.log(erro.response.status);
            if (erro.response.status == 401) {
                localStorage.removeItem('JWT_TOKEN');
                window.location.reload();         
            }
            return Promise.reject(erro);
        });
    }

    getAll(){
        return axiosInstance.get(this.url);
    }

    getById(id : number) {
        return axiosInstance.get(this.url + "/" + id);
    }

    delete(id : number){
        return axiosInstance.delete(this.url + "/" + id);
    }
}