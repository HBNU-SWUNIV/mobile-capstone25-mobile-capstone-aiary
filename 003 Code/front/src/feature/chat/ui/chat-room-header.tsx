import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useCreateDiary } from "../hooks/use-create-diary";
import ChatHeaderActions from "./chat-header-actions";

function ChatRoomHeader() {
  const router = useRouter();
  const mutation = useCreateDiary();
  const { id } = useLocalSearchParams<{ id: string }>();

  const handleSubmitDiary = () => {
    if (!id) return;
    mutation.mutate({ threadId: id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>AI 친구</Text>
          <Text style={styles.status}>온라인</Text>
        </View>

        <View style={{ width: 24 }} />
      </View>

      <ChatHeaderActions onCreateDiary={handleSubmitDiary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFBF2",
    paddingBottom: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 4,
    backgroundColor: "#fff",
    borderRadius: 20,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  status: {
    fontSize: 12,
    color: "#4CAF50",
    fontWeight: "500",
  },
});

export default ChatRoomHeader;
