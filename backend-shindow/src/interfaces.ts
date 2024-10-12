export interface EnvironmentVariables {
  API_PORT: string;
  API_DOMAIN: string;
  TZ: string;
  SERVER_IP: string;
  SERVER_PORT: string;
  SECRET: string;
}

export interface ConnectionCredentials {
  username: string;
  password: string;
  privateKey: string;
  passphrase: string;
}

export interface CustomError {
  errorType: string;
  error: unknown;
}

export interface ApiResponse<T> {
  status_code: number;
  message: string;
  data: Array<T>;
}
