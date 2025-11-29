import apiClient from "@/src/shared/api/axios";
import { Chat } from "../types/chat";

export const chatApi = {
  async fetchChatList(threadId: string, cursor?: string): Promise<any> {
    const response = await apiClient.get(`/threads/${threadId}/messages`, {
      params: { cursor: cursor ?? "" },
    });
    return response.data;
  },

  async sendMessage(threadId: string, content: string): Promise<any> {
    const response = await apiClient.post(`/chat/messages`, {
      threadId,
      content,
    });
    return response.data;
  },

  async updateMessage(messageId: string, content: string): Promise<Chat> {
    const response = await apiClient.patch(`/chat/messages/${messageId}`, {
      content,
    });
    return response.data;
  },

  async deleteMessage(messageId: string): Promise<void> {
    await apiClient.delete(`/chat/messages/${messageId}`);
  },
};
