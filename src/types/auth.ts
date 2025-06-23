export interface User {
  id?: string;
  name?: string;
  userName: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface LoginCredentials {
  userName: string;
  password: string;
}

export interface LoginResponse {
  statusCode: number;
  data: {
    token: string;
    user: {
      userName: string;
      email: string;
    };
  };
  message: string;
  success: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}