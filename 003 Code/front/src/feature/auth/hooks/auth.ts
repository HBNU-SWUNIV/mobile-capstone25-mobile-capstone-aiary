// src/shared/hooks/auth.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as api from "../api/auth";
import type { ApiError, LoginRequest, LoginResponse, SignUpRequest, SignUpResponse } from "../types";

const authKeys = {
  all: ["auth"] as const,
};

export const useSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation<SignUpResponse, ApiError, SignUpRequest>({
    mutationFn: api.signUp,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation<LoginResponse, ApiError, LoginRequest>({
    mutationFn: api.login,
    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      queryClient.setQueryData(["user"], user);

      queryClient.invalidateQueries({ queryKey: authKeys.all });
      router.replace("/home");
    },
    onError: (error) => {
      console.error("로그인 실패:", error);

      alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    queryClient.setQueryData(["user"], null);

    router.replace("/login");
  };

  return { logout };
};
