import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Chat } from "../../types/chat";
import { formatToAmPm } from "../../utils/time";
import ChatBalloon from "./chat-balloon";

interface ChatMessageProps {
  item: Chat;
}

function ChatMessage({ item }: ChatMessageProps) {
  const isAI = item.role !== "user";
  const isMe = item.role === "user";

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: isMe ? "row" : "row",
          justifyContent: isMe ? "flex-end" : "flex-start",
        },
      ]}
    >
      {isAI && (
        <View style={[styles.avatar, { backgroundColor: "#F88010", marginRight: 8 }]}>
          <MaterialCommunityIcons name="heart" size={16} color="#fff" />
        </View>
      )}

      <View style={[styles.contentContainer, { alignItems: isMe ? "flex-end" : "flex-start" }]}>
        <ChatBalloon isMe={isMe ?? false} message={item.content} />
        <Text style={styles.time}>{formatToAmPm(item.createdAt)}</Text>
      </View>

      {isMe && (
        <View style={[styles.avatar, { backgroundColor: "#E0E0E0", marginLeft: 8 }]}>
          <MaterialCommunityIcons name="account" size={20} color="#fff" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 6,
    alignItems: "flex-start",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  contentContainer: {
    maxWidth: "75%",
  },
  time: {
    color: "#999",
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 4,
  },
});

export default ChatMessage;
