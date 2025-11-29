import apiClient from "@/src/shared/api/axios";
import { EmotionReportResponse } from "../../type";

export const getEmotionReport = async (diaryId: string): Promise<EmotionReportResponse | null> => {
  const response = await apiClient.get<EmotionReportResponse>(`/diaries/${diaryId}/emotion`);

  if (response.status === 204) {
    return null;
  }

  return response.data;
};
