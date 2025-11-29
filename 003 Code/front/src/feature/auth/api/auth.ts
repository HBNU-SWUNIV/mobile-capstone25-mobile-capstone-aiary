import apiClient from "@/src/shared/api/axios";
import type { LoginRequest, LoginResponse, SignUpRequest, SignUpResponse } from "../types";

export const signUp = async (params: SignUpRequest) => {
  const { data } = await apiClient.post<SignUpResponse>("/auth/sign-up", params);
  return data;
};

export const login = async (params: LoginRequest) => {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", params);
  return data;
};
