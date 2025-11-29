import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Chat } from "../types/chat";

type Callback = (msg: Chat) => void;

class ChatSSEService {
  private subscribers = new Map<string, Set<Callback>>();
  private controllers = new Map<string, AbortController>(); // EventSource 대신 컨트롤러로 관리
  private pendingMessages = new Map<string, Chat>();

  async startStream(threadId: string): Promise<void> {
    if (this.controllers.has(threadId)) {
      console.log("⚠️ [SSE] 이미 연결된 스트림입니다:", threadId);
      return;
    }

    const controller = new AbortController();
    this.controllers.set(threadId, controller);

    const token = localStorage.getItem("accessToken");
    const baseUrl = process.env.EXPO_PUBLIC_BACKEND_URL;

    if (!token) {
      console.error("❌ [SSE] 토큰이 없습니다. 로그인 상태를 확인하세요.");
      this.closeStream(threadId);
      return;
    }

    const url = `${baseUrl}/chat/stream?threadId=${threadId}`;
    console.log("🚀 [SSE] 연결 시작:", url);

    try {
      await fetchEventSource(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,

        async onopen(response) {
          if (response.ok) {
            console.log("✅ [SSE] 연결 성공 (200 OK)");
            return;
          } else if (response.status === 401 || response.status === 403) {
            console.error("🚫 [SSE] 인증 실패 (401/403)");
            throw new Error("Unauthorized");
          } else {
            throw new Error(`Connection failed: ${response.status}`);
          }
        },

        onmessage: (event) => {
          try {
            if (event.event === "done") {
              console.log("🏁 [SSE] 스트림 완료 (Done)");
              this.closeStream(threadId);
              return;
            }

            if (event.event === "delta") {
              const chunk = JSON.parse(event.data);

              if (chunk.text) {
                let currentMessage = this.pendingMessages.get(threadId);

                if (!currentMessage) {
                  currentMessage = {
                    id: `temp-${Date.now()}`,
                    threadId: threadId,
                    senderId: "ai",
                    senderName: "AI Assistant",
                    role: "assistant",
                    content: chunk.text,
                    createdAt: new Date().toISOString(),
                  };
                } else {
                  currentMessage = {
                    ...currentMessage,
                    content: (currentMessage.content || "") + chunk.text,
                  };
                }

                this.pendingMessages.set(threadId, currentMessage);
                this.broadcast(threadId, currentMessage);
              }
            }
          } catch (e) {
            console.error("❌ [SSE] 메시지 파싱 에러:", e);
          }
        },

        onerror: (err: any) => {
          console.error("🔥 [SSE] 에러 발생:", err);
          if (err.message === "Unauthorized") {
            this.closeStream(threadId);
            throw err;
          }
        },

        onclose: () => {
          console.log("🔒 [SSE] 연결이 서버에 의해 닫힘");
        },
      });
    } catch (error) {
      console.error("❌ [SSE] Fetch 실행 중 에러:", error);
      this.closeStream(threadId);
    }
  }

  closeStream(threadId: string): void {
    const controller = this.controllers.get(threadId);
    if (controller) {
      controller.abort();
      this.controllers.delete(threadId);
      this.pendingMessages.delete(threadId);
      console.log("✂️ [SSE] 연결 종료 및 리소스 정리:", threadId);
    }
  }

  subscribe(threadId: string, callback: Callback): () => void {
    if (!this.subscribers.has(threadId)) {
      this.subscribers.set(threadId, new Set());
    }

    const threadCallbacks = this.subscribers.get(threadId)!;
    threadCallbacks.add(callback);

    const currentMsg = this.pendingMessages.get(threadId);
    if (currentMsg) {
      callback(currentMsg);
    }

    return () => {
      threadCallbacks.delete(callback);
      if (threadCallbacks.size === 0) {
        this.subscribers.delete(threadId);
      }
    };
  }

  private broadcast(threadId: string, msg: Chat) {
    this.subscribers.get(threadId)?.forEach((cb) => cb(msg));
  }
}

export const chatSSEService = new ChatSSEService();
