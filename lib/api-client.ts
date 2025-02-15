import { toast } from 'sonner';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
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

interface SignInResponse {
  token: string;
}

interface ResetPasswordData {
  password: string;
  confirmPassword: string;
  token: string;
}

export class ApiClient {
  private static instance: ApiClient;
  private baseUrl: string;
  private token: string | null;

  private constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  }

  public static getInstance(baseUrl?: string): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient(baseUrl);
    }
    return ApiClient.instance;
  }

  private mergeHeaders(headers?: HeadersInit): HeadersInit {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...headers,
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const headers = this.mergeHeaders(options.headers);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return { data };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  private handleError(error: string): void {
    toast.error(error || 'Something went wrong');
  }

  public async signUp(data: SignUpData): Promise<ApiResponse> {
    const response = await this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.error) {
      this.handleError(response.error);
    } else {
      toast.success('Account created successfully');
    }

    return response;
  }

  public async signIn(data: SignInData): Promise<ApiResponse<SignInResponse>> {
    const response = await this.request<SignInResponse>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.error) {
      this.handleError(response.error);
    } else {
      if (response.data) {
        this.token = response.data.token;
        localStorage.setItem('token', response.data.token);
      }
      toast.success('Signed in successfully');
    }

    return response;
  }

  public async forgotPassword(email: string): Promise<ApiResponse> {
    const response = await this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });

    if (response.error) {
      this.handleError(response.error);
    } else {
      toast.success('If an account exists, you will receive a password reset email');
    }

    return response;
  }

  public async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
    const response = await this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.error) {
      this.handleError(response.error);
    } else {
      toast.success('Password reset successful');
    }

    return response;
  }

  public signOut(onSignOut?: () => void): void {
    this.token = null;
    localStorage.removeItem('token');
    toast.success('Signed out successfully');
    if (onSignOut) onSignOut();
  }

  public isTokenValid(): boolean {
    if (!this.token) return false;
    // Add logic to validate token expiration
    return true; // Placeholder
  }
}