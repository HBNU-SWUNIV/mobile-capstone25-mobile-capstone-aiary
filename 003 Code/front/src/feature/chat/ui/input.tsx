import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View, useWindowDimensions } from "react-native";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { useSendMessage } from "../hooks/use-send-message";

function ChatInput() {
  const { id: threadId } = useLocalSearchParams<{ id: string }>();
  const { width } = useWindowDimensions();
  const [chat, setChat] = useState("");
  const keyboard = useAnimatedKeyboard();
  const { mutate: sendMessage } = useSendMessage(threadId);

  const animatedKeyboardStyles = useAnimatedStyle(() => ({
    paddingBottom: Platform.OS === "android" && keyboard.height.value > 0 ? 16 : 0,
  }));

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

  return (
    <Animated.View style={[styles.container, { width }, animatedKeyboardStyles]}>
      <View style={styles.inputWrapper}>
        <TextInput
          multiline
          value={chat}
          onChangeText={setChat}
          style={styles.textInput}
          placeholder="메시지를 입력하세요..."
          placeholderTextColor="#999"
          numberOfLines={3}
        />
        <Pressable onPress={handleSend} style={styles.sendButton}>
          <MaterialCommunityIcons name="send" size={18} color="#fff" style={{ marginLeft: 2 }} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    backgroundColor: "#FFFBF2",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: "#333",
    paddingTop: 0,
    paddingBottom: 0,
    maxHeight: 100,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F88010",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
});

export default ChatInput;
