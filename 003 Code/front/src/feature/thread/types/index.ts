export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  code: string;
  message: string;
  path: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  cursor: string | null;
}

export interface ChatThread {
  id: string; // UUID
  title: string;
  status: "active" | "archived";
  createdAt: string; // ISO 8601
}

export interface ChatMessage {
  id: string; // UUID
  threadId: string;
  content: string;
  sender: "user" | "ai";
  createdAt: string; // ISO 8601
}

export interface Diary {
  id: string; // UUID
  threadId: string;
  title: string;
  mood: string;
  content: string;
  createdAt: string;
}

export interface CreateThreadRequest {
  title: string;
}

export interface UpdateThreadStatusRequest {
  status: "active" | "archived";
}

export interface SendMessageRequest {
  threadId: string;
  content: string;
}

export interface UpdateMessageRequest {
  content: string;
}

export interface CreateDiaryRequest {
  threadId: string;
  //title: string;
  // mood: string;
}
