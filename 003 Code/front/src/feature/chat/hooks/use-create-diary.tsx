import apiClient from "@/src/shared/api/axios";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "expo-router";

interface CreateDiaryVariables {
  threadId: string;
  // title: string;
  //  mood: string;
}

interface CreateDiaryResponse {
  id: string;
  diaryId: string;
  //title: string;
  //  mood: string;
  content: string;
  summary: string;
  createdAt: string;
}

interface ApiError {
  message: string;
  status: string;
}

const createDiary = async (variables: CreateDiaryVariables): Promise<CreateDiaryResponse> => {
  const API_ENDPOINT = "/diaries";

  try {
    const { data } = await apiClient.post<CreateDiaryResponse>(
      `${process.env.EXPO_PUBLIC_BACKEND_URL}${API_ENDPOINT}`,
      variables
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const serverError = error.response?.data as ApiError;
      if (error.response?.status === 404) {
        throw new Error(serverError?.message || "스레드를 찾을 수 없습니다.");
      }
      throw new Error(serverError?.message || "일기 생성에 실패했습니다.");
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

export const useCreateDiary = (
  options?: Omit<UseMutationOptions<CreateDiaryResponse, Error, CreateDiaryVariables>, "mutationFn">
) => {
  const router = useRouter();
  return useMutation<CreateDiaryResponse, Error, CreateDiaryVariables>({
    mutationFn: createDiary,
    onSuccess: (data) => {
      console.log("data", data);
      router.push(`/diary/${data.diaryId}`);
    },
    ...options,
  });
};
