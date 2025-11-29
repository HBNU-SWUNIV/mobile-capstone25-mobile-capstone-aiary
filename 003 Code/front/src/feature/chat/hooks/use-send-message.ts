import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "../services/chat-api";
import { chatSSEService } from "../services/chatSSEService";
import { Chat } from "../types/chat";

export function useSendMessage(threadId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      chatSSEService.startStream(threadId);

      return chatApi.sendMessage(threadId, content);
    },

    onMutate: async (content: string) => {
      await queryClient.cancelQueries({ queryKey: ["chatList", threadId] });

      const previousChatList = queryClient.getQueryData(["chatList", threadId]);

      const optimisticMessage: Chat = {
        id: `temp-user-${Date.now()}`,
        role: "user",
        content: content,
        createdAt: new Date().toISOString(),
        threadId: "",
        senderId: "",
        senderName: "",
      };

      queryClient.setQueryData(["chatList", threadId], (oldData: any) => {
        if (!oldData) {
          return {
            pages: [{ items: [optimisticMessage], nextCursor: null }],
            pageParams: [""],
          };
        }

        const newPages = [...oldData.pages];
        newPages[0] = {
          ...newPages[0],
          items: [optimisticMessage, ...newPages[0].items],
        };

        return { ...oldData, pages: newPages };
      });

      return { previousChatList };
    },

    onError: (err, newTodo, context) => {
      chatSSEService.closeStream(threadId);

      if (context?.previousChatList) {
        queryClient.setQueryData(["chatList", threadId], context.previousChatList);
      }
    },
  });
}
