import { useInfiniteQuery } from "@tanstack/react-query";
import { chatApi } from "../services/chat-api";
import { ChatListPage } from "../types/chat";

export function useChatList(threadId: string) {
  return useInfiniteQuery<ChatListPage>({
    queryKey: ["chatList", threadId],
    queryFn: ({ pageParam }) =>
      chatApi.fetchChatList(threadId, pageParam as string),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: "",
  });
}
