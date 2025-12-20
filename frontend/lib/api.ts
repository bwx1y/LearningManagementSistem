import axios, {AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig} from "axios";
import Cookies from 'js-cookie';

interface ApiErrorResponse {
    message: string;
    response: {
        data: {
            status: number;
            errors: Record<string, string[]>
        }
    }
}

class Api {
    private readonly api: AxiosInstance;

    constructor(public readonly baseUrl: string) {
        this.api = axios.create({
            baseURL: baseUrl
        });

        this.config();
    }
    
    private config() {
        this.api.interceptors.request.use(
            (request) => {
                const token = Cookies.get("token");

                if (token) {
                    request.headers.Authorization = `Bearer ${token}`;
                }

                return request;
            },
            (error) => Promise.reject(error)
        );
        
        this.api.interceptors.response.use(
            (response) => response,
            (error: AxiosError) => {

                if (error.response?.status == 403) {
                    window.location.href = "/"
                }
                
                if (!error.parse) {
                    error.parse = () => this.parseError(error);
                }
                return Promise.reject(error);
            }
        )
    }

    private parseError(e: unknown) : string[] {
        const data = (e as ApiErrorResponse).response?.data

        try {
            if ('request' in data.errors && Array.isArray(data.errors['request'])) {
                return data.errors['request'] as string[];
            }

            const message: string[] = [];
            for (const key in data.errors) {
                if (Array.isArray(data.errors[key])) {
                    message.push(...data.errors[key]);
                }
            }
            
            return message;
        } catch {
            return []
        }
    }

    public get<T>(url: string, params?: unknown): Promise<AxiosResponse<T>> {
        return this.api.get<T>(url, {
            params: params
        });
    }
    
    public post<Request, Response>(url: string, data: Request): Promise<AxiosResponse<Response>> {
        return this.api.post<Response>(url, data);
    }
    public put<Request, Response>(url: string, data: Request): Promise<AxiosResponse<Response>> {
        return this.api.put<Response>(url, data);
    }
    
    public delete<Response>(url: string): Promise<AxiosResponse<Response>> {
        return this.api.delete<Response>(url);
    }
}

export const api = new Api(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000");