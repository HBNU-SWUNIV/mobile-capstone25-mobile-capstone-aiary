export interface SignUpRequest {
  password: string;
  nickname: string;
  user_name: string;
}

export interface SignUpResponse {}

export interface LoginRequest {
  user_name: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    nickname: string;
    user_name: string;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
}
