import { useQuery } from "@tanstack/react-query";
import { useGetDiaries } from "../../diary/hooks/use-diary";
import { EmotionReportResponse } from "../type";
import { getEmotionReport } from "../type/api";

export const useEmotionReport = (diaryId: string) => {
  return useQuery<EmotionReportResponse | null>({
    queryKey: ["emotionReport", diaryId],
    queryFn: () => getEmotionReport(diaryId),
    enabled: !!diaryId,
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error: any) => {
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
};

export const useEmotionReportData = (specificDiaryId?: string) => {
  const { data: diaries, isLoading: isListLoading, isError: isListError } = useGetDiaries();

  const targetId =
    specificDiaryId === "recent" ? (diaries && diaries.length > 0 ? diaries[0].id : null) : specificDiaryId || null;

  const {
    data: report,
    isLoading: isReportLoading,
    isError: isReportError,
  } = useQuery<EmotionReportResponse | null>({
    queryKey: ["emotionReport", targetId],
    queryFn: () => getEmotionReport(targetId!),
    enabled: !!targetId,
  });

  const isLoading = specificDiaryId ? isReportLoading : isListLoading || (!!targetId && isReportLoading);
  const isError = specificDiaryId ? isReportError : isListError || isReportError;

  const hasDiaries = specificDiaryId ? true : !!(diaries && diaries.length > 0);

  return {
    report,
    isLoading,
    isError,
    hasDiaries,
    targetId,
  };
};
