import {toast} from "sonner"

interface ApiResponse<T=any> {
    data?:T;
    error?:string
}

interface SignUpData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  interface SignInData {
    email: string;
    password: string;
  }

  interface ResetPasswordData {
    password: string;
    confirmPassword: string;
    token: string;
  }
export class ApiClient{

    private static instance:ApiClient;
    private baseUrl:string;
    private token:string | null;

    private constructor(){
        this.baseUrl ='/api';
        this.token = typeof window !=='undefined'? localStorage.getItem('token'):null;
    }

    public static getInstance():ApiClient{
        if(!ApiClient.instance){
            ApiClient.instance = new ApiClient(); 
        }
        return ApiClient.instance;
    }


    private async request<T>(
        endpoint:string,
        options:RequestInit={}
    ):Promise<ApiResponse<T>>{
            try {
                const headers:HeadersInit ={
                    'Content-Type':'application/json',
                    ...(this.token && {Authorization:`Bearer ${this.token}`}),
                    ...options.headers,
                };

                const response = await fetch(`${this.baseUrl}${endpoint}`,{
                    ...options,
                    headers
                })

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Something went wrong');
                  }
            
                  return { data };
            } catch (error:any) {
                return { error: error.message };
            }
    }
}