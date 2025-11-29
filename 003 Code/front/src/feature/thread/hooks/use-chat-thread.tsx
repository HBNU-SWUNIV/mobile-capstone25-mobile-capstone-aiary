import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import * as api from "../api/index";
import type {
  ApiError,
  ChatThread,
  CreateThreadRequest,
  PaginatedResponse,
  UpdateThreadStatusRequest,
} from "../types";

const threadKeys = {
  all: ["threads"] as const,
  lists: () => [...threadKeys.all, "list"] as const,
  list: (filters: string) => [...threadKeys.lists(), { filters }] as const,
  details: () => [...threadKeys.all, "detail"] as const,
  detail: (id: string) => [...threadKeys.details(), id] as const,
};

// 스레드 목록 조회 (무한 스크롤)
export const useGetThreads = (status: "active" | "archived" = "active") => {
  return useInfiniteQuery<
    PaginatedResponse<ChatThread>,
    Error,
    PaginatedResponse<ChatThread>,
    ReturnType<typeof threadKeys.list>,
    string | null | undefined
  >({
    queryKey: threadKeys.list(status),
    queryFn: ({ pageParam }) => api.getThreads({ status, cursor: pageParam }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });
};

// 스레드 단건 조회
export const useGetThread = (threadId: string) => {
  return useQuery<ChatThread, ApiError>({
    queryKey: threadKeys.detail(threadId),
    queryFn: () => api.getThreadById(threadId),
    enabled: !!threadId, // threadId가 있을 때만 쿼리 실행
  });
};

// 스레드 생성
export const useCreateThread = () => {
  const queryClient = useQueryClient();
  return useMutation<ChatThread, ApiError, CreateThreadRequest>({
    mutationFn: api.createThread,
    onSuccess: () => {
      // 성공 시 'active' 상태의 스레드 목록 캐시를 무효화하여 새로고침
      queryClient.invalidateQueries({ queryKey: threadKeys.list("active") });
    },
  });
};

// 스레드 삭제
export const useDeleteThread = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ApiError, string>({
    mutationFn: api.deleteThread,
    onSuccess: (_, threadId) => {
      // 모든 스레드 목록 캐시와 해당 스레드의 상세 정보 캐시를 무효화
      queryClient.invalidateQueries({ queryKey: threadKeys.lists() });
      queryClient.removeQueries({ queryKey: threadKeys.detail(threadId) });
    },
  });
};

// 스레드 상태 변경
export const useUpdateThreadStatus = () => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    ApiError,
    { threadId: string } & UpdateThreadStatusRequest
  >({
    mutationFn: api.updateThreadStatus,
    onSuccess: (_, { threadId }) => {
      queryClient.invalidateQueries({ queryKey: threadKeys.lists() });
      queryClient.invalidateQueries({ queryKey: threadKeys.detail(threadId) });
    },
  });
};
