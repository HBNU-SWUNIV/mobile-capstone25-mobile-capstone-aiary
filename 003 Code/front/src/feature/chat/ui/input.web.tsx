import useKeyboardResizeEffect from "@/src/shared/hooks/use-keyboard-resize-effect";
import { useLocalSearchParams } from "expo-router";
import type React from "react";
import { type ChangeEvent, useCallback, useRef, useState } from "react";
import { useSendMessage } from "../hooks/use-send-message";

function WebChatInput() {
  const { id: threadId } = useLocalSearchParams<{ id: string }>();
  const [chat, setChat] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cloneRef = useRef<HTMLTextAreaElement>(null);
  const { mutate: sendMessage } = useSendMessage(threadId);

  useKeyboardResizeEffect();

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setChat(e.target.value);
    const elem = textareaRef.current;
    const cloneElem = cloneRef.current;
    if (!elem || !cloneElem) return;
    cloneElem.value = elem.value;

    elem.rows = Math.min(
      Math.max(Math.floor(cloneElem.scrollHeight / cloneElem.clientHeight), 1),
      3
    );
  };

  const handleSend = useCallback(async () => {
    const messageContent = chat.trim();
    if (!messageContent) return;
    setChat("");

    try {
      sendMessage(messageContent);
    } catch (error) {
      console.error("Message send error:", error);
    }
  }, [chat, threadId]);

  const styles = {
    container: {
      display: "flex",
      width: "100%",
      minHeight: 80,
      alignItems: "center",
      backgroundColor: "#FFFBF2",
      padding: "10px 16px",
      boxSizing: "border-box",
    },
    inputContainer: {
      position: "relative",
      display: "flex",
      flex: 1,
      alignItems: "center",
      borderRadius: "30px",
      backgroundColor: "#fff",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 20,
      paddingRight: 10,
      minHeight: 48,
      boxSizing: "border-box",
      border: "1px solid #E5E5E5",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.03)",
    },
    chatInput: {
      flex: 1,
      resize: "none",
      overflowY: "auto",
      backgroundColor: "transparent",
      margin: 0,
      padding: 0,
      color: "#333",
      fontSize: 16,
      lineHeight: "20px",
      border: "none",
      outline: "none",
      fontFamily: "inherit",
      scrollbarWidth: "none",
    },
    cloneInput: {
      position: "absolute",
      top: -9999,
      left: -9999,
      zIndex: -10,
      boxSizing: "border-box",
      width: "100%",
      resize: "none",
      overflowY: "auto",
      backgroundColor: "transparent",
      margin: 0,
      padding: 0,
      color: "black",
      fontSize: 16,
      lineHeight: "20px",
    },
    sendButton: {
      display: "flex",
      height: 36,
      width: 36,
      flexShrink: 0,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      borderRadius: "50%",
      backgroundColor: "#F88010",
      transition: "background-color 0.2s",
      marginLeft: 10,
      border: "none",
      padding: 0,
      cursor: "pointer",
    },
    sendIcon: {
      color: "white",
      fontSize: 14,
      fontWeight: "600",
      marginLeft: "2px",
    },
  };

  return (
    <div style={styles.container as React.CSSProperties}>
      <div style={styles.inputContainer as React.CSSProperties}>
        <textarea
          id="chat-input"
          ref={textareaRef}
          value={chat}
          onChange={handleChange}
          rows={1}
          placeholder="메시지를 입력하세요..."
          style={styles.chatInput as React.CSSProperties}
        ></textarea>

        <textarea
          id="chat-clone"
          ref={cloneRef}
          rows={1}
          readOnly
          tabIndex={-1}
          style={styles.cloneInput as React.CSSProperties}
        ></textarea>

        <button
          type="button"
          onClick={handleSend}
          style={styles.sendButton}
          aria-label="Send message"
        >
          <div style={styles.sendIcon}>➤</div>
        </button>
      </div>
    </div>
  );
}

export default WebChatInput;
