export interface EnvironmentVariables {
  NEXT_PUBLIC_SECRET: string;
  NEXT_PUBLIC_KEY_FILE_MAX_SIZE: string;
  NEXT_PUBLIC_TZ: string;
  NEXT_PUBLIC_API_BASE_URL: string;
  NEXT_PUBLIC_CLIENT_BASE_URL: string;
  NEXT_PUBLIC_INITIAL_PATH: string;
  NEXT_PUBLIC_BACK_BASE_URL: string;
}

export interface ApiResponse<T> {
  status_code: number;
  message: string;
  data: Array<T>;
}

export interface Resource {
  date: string;
  group: string;
  hardLinks: number;
  isDirectory: boolean;
  name: string;
  owner: string;
  size: number;
  time: string;
  shortName: string;
  path: string;
}

export interface Vector2 {
  x: number;
  y: number;
}

export interface ClipboardItem {
  resource: Resource;
  method: "copied" | "cut";
}

export interface UploadClipboardItem {
  id: string;
  file: File;
  enterAnimationPlayed: boolean;
  status: "queued" | "serverUpload" | "sshUpload" | "complete";
  progress: number;
}
