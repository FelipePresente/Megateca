export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  timestamp: string;
}

export function makeResponse<T = unknown>(
  message: string,
  data?: T,
  success: boolean = true
): ApiResponse<T> {
  return {
    success,
    message,
    ...(data !== undefined ? { data } : {}),
    timestamp: new Date().toISOString(),
  };
}
