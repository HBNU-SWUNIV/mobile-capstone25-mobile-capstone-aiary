import apiClient from "@/src/shared/api/axios";
import type { CreateDiaryRequest, Diary, DiarySummary } from "../types";

// 일기 목록 조회
export const getDiaryList = async () => {
  const { data } = await apiClient.get<DiarySummary[]>("/diaries/all");
  return data;
};

// 일기 생성
export const createDiary = async (params: CreateDiaryRequest) => {
  const { data } = await apiClient.post<Diary>("/diaries", params);
  return data;
};

// 일기 단건 조회
export const getDiaryById = async (diaryId: string) => {
  const { data } = await apiClient.get<Diary>(`/diaries/${diaryId}`);
  return data;
};
