export interface EnvironmentVariables {
  NEXT_PUBLIC_SECRET: string;
  NEXT_PUBLIC_KEY_FILE_MAX_SIZE: string;
  NEXT_PUBLIC_TZ: string;
  NEXT_PUBLIC_API_BASE_URL: string;
  NEXT_PUBLIC_CLIENT_BASE_URL: string;
}

export interface ApiResponse<T> {
  status_code: number;
  message: string;
  data: Array<T>;
}
