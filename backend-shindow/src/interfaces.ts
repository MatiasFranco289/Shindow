export type NodeEnvironmentType = "test" | "development" | "production";

export interface EnvironmentVariables {
  API_PORT: string;
  CLIENT_DOMAIN: string;
  TZ: string;
  SERVER_IP: string;
  SERVER_PORT: string;
  SECRET: string;
  SESSION_MAX_AGE: string;
  NODE_ENVIRONMENT: NodeEnvironmentType;
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

export interface LoginRequest {
  username: string;
  password: string;
  privateKey: string;
  passphrase: string;
}

export interface Resource {
  isDirectory: boolean;
  owner: string;
  group: string;
  size: number;
  name: string;
  hardLinks: number;
  date: string;
  time: string;
  path: string;
}
