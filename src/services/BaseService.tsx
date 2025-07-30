import axios, { AxiosResponse } from "axios";
import { sessionStore } from '@/store/session-store';
import { ZodError, type ZodSchema } from "zod";

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
    constructor(url: string) {
        this.url = url;

        axiosInstance.interceptors.request.use((config) => {
            const user = sessionStore.getState().user;
            const token = user?.token as string;
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

    logout() {
        sessionStore.getState().clearUser();
        delete axiosInstance.defaults.headers.common['Authorization'];

        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }

    async getAll<T>(schema?: ZodSchema<T[]>): Promise<T[]> {
        const response = await axiosInstance.get(this.url);

        if (schema) {
            try {
                const parsed = schema.parse(response.data);
                return parsed;
            } catch (err) {
                console.error("Zod validate error:");
                if (err instanceof ZodError) {
                    console.error(err.errors);
                } else {
                    console.error(err);
                }
                throw err;
            }
        }

        return response.data;
    }

    getById(id: number) {
        return axiosInstance.get(this.url + "/" + id);
    }

    delete(id: number) {
        return axiosInstance.delete(this.url + "/" + id);
    }

    async insert<T>(data: T): Promise<AxiosResponse<T>> {
        console.log("insert data:", data);
        return axiosInstance.post<T>(this.url, data);
    }

    async update<T extends { id: number }>(data: T): Promise<T> {
        const response = await axiosInstance.put<T>(`${this.url}/${data.id}`, data);
        return response.data; 
    }
}