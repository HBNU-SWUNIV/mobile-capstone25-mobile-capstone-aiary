import { useLocalSearchParams } from "expo-router";
import type React from "react";
import { Platform, View } from "react-native";
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ChatList from "./chat-list";
import ChatRoomHeader from "./chat-room-header";
import ChatInput from "./input";
import WebChatInput from "./input.web";

function ChatDetail() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const keyboard = useAnimatedKeyboard();
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: Platform.OS === "android" ? 0 : -keyboard.height.value + insets.bottom - 10,
      },
    ],
  }));

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFBF2",
        paddingTop: insets.top,
        width: "100%",
        paddingBottom: insets.bottom + 14,
      }}
    >
      <ChatRoomHeader />
      <Animated.View
        style={[
          {
            flex: 1,
            width: "100%",
            backgroundColor: "#FFFBF2",
            alignContent: "center",
            justifyContent: "center",
          },
          animatedStyles,
        ]}
      >
        <ChatList />
        {Platform.OS === "web" ? <WebChatInput /> : <ChatInput />}
      </Animated.View>
    </View>
  );
}

export default ChatDetail;
