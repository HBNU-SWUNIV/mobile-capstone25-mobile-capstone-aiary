// 공통 에러 응답 타입
export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  code: string;
  message: string;
  path: string;
}

// 페이지네이션 응답을 위한 제네릭 타입
export interface PaginatedResponse<T> {
  items: T[];
  cursor: string | null; // 다음 페이지 조회를 위한 커서
}

// 엔티티: ChatThread
export interface ChatThread {
  id: string; // UUID
  title: string;
  status: "active" | "archived";
  createdAt: string; // ISO 8601
}

// 엔티티: Diary
export interface DiaryEmotions {
  joy: number;
  sadness: number;
  anger: number;
  anxiety: number;
  tiredness: number;
  calm: number;
}

export interface Diary {
  id: string;
  threadId: string;

  content: string;
  summary: string;

  emotions: DiaryEmotions;
  dominantEmotion: string;
  overallMoodScore: number;
  recommendation: string;

  createdAt: string;
  analyzedAt: string;
}

// 요청(Request) 타입들
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
  // title: string;
  //  mood: string;
}

export interface DiaryEmotions {
  joy: number;
  sadness: number;
  anger: number;
  anxiety: number;
  tiredness: number;
  calm: number;
}

export interface Diary {
  id: string;
  threadId: string;
  content: string;
  diaryId: string;
  summary: string;
  emotions: DiaryEmotions;
  dominantEmotion: string;
  overallMoodScore: number;
  recommendation: string;
  createdAt: string;
  analyzedAt: string;
}

export type DiarySummary = Pick<Diary, "id" | "summary" | "dominantEmotion" | "createdAt">;
