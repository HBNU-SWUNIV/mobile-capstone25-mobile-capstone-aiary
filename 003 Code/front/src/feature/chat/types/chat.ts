export interface Chat {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  role: string;
  isStreaming?: boolean;     
  isError?: boolean;         
}

export interface ChatListPage {
  items: Chat[];
  nextCursor?: string | null;
}

export interface ChatListResponse {
  pages: ChatListPage[];
  pageParams: (string | undefined)[];
}
