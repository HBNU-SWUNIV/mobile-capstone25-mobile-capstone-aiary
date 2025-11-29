import apiClient from '@/src/shared/api/axios';
import type { ChatThread, CreateThreadRequest, PaginatedResponse, UpdateThreadStatusRequest } from '../types';

// 스레드 목록 조회
export const getThreads = async ({ status = 'active', limit = 20, cursor }: { status?: 'active' | 'archived', limit?: number, cursor?: string | null }) => {
  const { data } = await apiClient.get<PaginatedResponse<ChatThread>>('/chat/threads', {
    params: { status, limit, cursor },
  });
  return data;
};

// 스레드 생성
export const createThread = async (params: CreateThreadRequest) => {
  const { data } = await apiClient.post<ChatThread>('/chat/threads', params);
  return data;
};

// 스레드 단건 조회
export const getThreadById = async (threadId: string) => {
  const { data } = await apiClient.get<ChatThread>(`/chat/threads/${threadId}`);
  return data;
};

// 스레드 삭제
export const deleteThread = async (threadId: string) => {
  await apiClient.delete(`/chat/threads/${threadId}`);
};

// 스레드 상태 변경
export const updateThreadStatus = async ({ threadId, status }: { threadId: string } & UpdateThreadStatusRequest) => {
  await apiClient.patch(`/chat/threads/${threadId}`, { status });
};