import axios, { AxiosResponse } from "axios";
import { sessionStore } from '@/store/session-store';
import type { ZodSchema } from "zod";

export const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 1000,
    headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
});

export class BaseService {
    url: string;
    constructor(url: string){
        this.url = url;

        axiosInstance.interceptors.request.use((config) => {
            const user = sessionStore.getState().user;
            const token = user?.token as string;
            console.log("Token zustand utilizado na chamada " + url + ": " + token);
            const authRequestToken = token ? `Bearer ${token}` : '';
            config.headers['Authorization'] = authRequestToken;
            
            if (user?.company_id && !config.params?.company_id) {
                config.params = {
                    ...config.params,
                    company_id: user.company_id
                };
            }
            return config;
        },
            (error) => Promise.reject(error)
        );

        axiosInstance.interceptors.response.use((response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    sessionStore.getState().clearUser();
                    if (typeof window !== 'undefined') {
                        window.location.href = '/login';
                    }
                }
                return Promise.reject(error);
            }
        );
    }

    logout(){
        sessionStore.getState().clearUser();
        delete axiosInstance.defaults.headers.common['Authorization'];
        
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }

    async getAll<T>(schema?: ZodSchema<T[]>): Promise<T[]> {
        const response = await axiosInstance.get(this.url);
        if (schema) {
            return schema.parse(response.data);
        }
        return response.data;
    }

    getById(id : number) {
        return axiosInstance.get(this.url + "/" + id);
    }

    delete(id : number){
        return axiosInstance.delete(this.url + "/" + id);
    }

    insert<T>(data: T): Promise<AxiosResponse<T>> {
        console.log("insert");
        console.log(JSON.stringify(data));
        return axiosInstance.post<T>(this.url, JSON.stringify(data));
    }

    update<T>(data: T): Promise<AxiosResponse<T>> {
        return axiosInstance.put<T>(this.url, data);
    }
}