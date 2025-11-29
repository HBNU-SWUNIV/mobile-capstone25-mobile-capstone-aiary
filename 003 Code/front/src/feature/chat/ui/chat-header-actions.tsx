import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ChatHeaderActionsProps {
  date?: string;
  onNewChat?: () => void;
  onCreateDiary?: () => void;
}

const ChatHeaderActions = ({ onCreateDiary }: ChatHeaderActionsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onCreateDiary} style={styles.touchable}>
        <LinearGradient
          colors={["#F88010", "#FF5E3A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.banner}
        >
          <View style={styles.row}>
            <MaterialCommunityIcons name="book-open-page-variant" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.bannerTitle}>대화를 일기로 생성하기</Text>
          </View>
          <Text style={styles.bannerSubtitle}>AI가 우리의 대화를 바탕으로 감성적인 일기를 작성해드려요</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  touchable: {
    width: "100%",
  },
  banner: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    shadowColor: "#F88010",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  bannerSubtitle: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
});

export default ChatHeaderActions;
