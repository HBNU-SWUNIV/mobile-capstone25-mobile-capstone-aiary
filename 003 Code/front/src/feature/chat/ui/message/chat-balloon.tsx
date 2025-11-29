import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

interface ChatBalloonProps {
  message: string;
  isMe: boolean;
}

function ChatBalloon({ message, isMe }: ChatBalloonProps) {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isMe ? "#F88010" : "#fff",
          borderTopRightRadius: 18,
          borderTopLeftRadius: 18,

          borderBottomLeftRadius: isMe ? 18 : 4,
          borderBottomRightRadius: isMe ? 4 : 18,
        },
      ]}
    >
      <Text style={[styles.messageText, { color: isMe ? "#fff" : "#333" }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  messageText: {
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
  },
});

export default ChatBalloon;
