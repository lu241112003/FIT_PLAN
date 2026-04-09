export interface User {
  id: string;
  nome: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterCredentials {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  changePassword: (
    senhaAtual: string,
    novaSenha: string,
    confirmarSenha: string
  ) => Promise<void>;
}
