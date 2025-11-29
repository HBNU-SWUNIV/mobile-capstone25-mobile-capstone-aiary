import apiClient from "@/src/shared/api/axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";

interface CreateThreadVariables {
  title: string;
}

interface CreateThreadResponse {
  threadId: string;
}

interface ApiError {
  message: string;
  errorCode: string;
}

const createThread = async (variables: CreateThreadVariables): Promise<CreateThreadResponse> => {
  const API_ENDPOINT = "/chat/threads";

  try {
    const { data } = await apiClient.post<CreateThreadResponse>(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}${API_ENDPOINT}`,
      variables
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data as ApiError;
      throw new Error(serverError?.message || "스레드 생성에 실패했습니다.");
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

export const useCreateChat = (
  options?: Omit<UseMutationOptions<CreateThreadResponse, Error, CreateThreadVariables>, "mutationFn">
) => {
  return useMutation<CreateThreadResponse, Error, CreateThreadVariables>({
    mutationFn: createThread,

    ...options,
  });
};
