import { useLogout } from "@/src/feature/auth/hooks/auth";
import { useCreateChat } from "@/src/feature/chat/hooks/use-create-chat";
import { useCurrentWeather } from "@/src/shared/hooks/use-current-weather";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
dayjs.locale("ko");

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { logout } = useLogout();
  type RouterPushParam = Parameters<typeof router.push>[0];

  const todayFormat = dayjs().format("YYYY년 M월 D일");

  const lat = 36.35;
  const lon = 127.38;

  const { data } = useCurrentWeather(lat, lon);

  const queryClient = useQueryClient();
  const mutation = useCreateChat({
    onSuccess: (responseData) => {
      console.log("스레드 생성 성공 ID:", responseData);
      router.push(`/chat/${responseData.threadId}`);
      queryClient.invalidateQueries({ queryKey: ["threads"] });
    },
    onError: (error) => {
      console.error("스레드 생성 실패:", error.message);
      return;
    },
  });
  const handleNavigation = (path: RouterPushParam | string) => {
    if (typeof path === "string" && path.startsWith("/chat")) {
      mutation.mutate({ title: "오늘의 일기" });
      return;
    }
    router.push(path as RouterPushParam);
  };
  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.bgCircle} />

      <ScrollView
        style={styles.content}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Aiary</Text>
          <View style={styles.headerUnderline} />
        </View>

        <View style={styles.greetingCard}>
          <View style={styles.greetingTop}>
            <View>
              <Text style={styles.greetingText}>안녕하세요 ✨</Text>
              <Text style={styles.greetingSubText}>오늘도 소중한 하루를 함께해요</Text>
            </View>
          </View>

          <View style={styles.greetingBottom}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={16} color="#F88010" />
              <Text style={styles.infoText}>{todayFormat}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                {data?.description || "맑음"}, {data ? `${data.temperature}°C` : "정보 없음"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuCard} onPress={() => handleNavigation("/chat")}>
            <View style={[styles.iconBox, { backgroundColor: "#F88010" }]}>
              <MaterialCommunityIcons name="chat-processing" size={24} color="#fff" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>채팅 시작하기</Text>
              <Text style={styles.menuDesc}>AI와 함께 오늘의 이야기를 나눠보세요</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => handleNavigation("/diary")}>
            <View style={[styles.iconBox, { backgroundColor: "#EAB308" }]}>
              <MaterialCommunityIcons name="book-open-variant" size={24} color="#fff" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>일기 목록</Text>
              <Text style={styles.menuDesc}>지금까지의 소중한 기억들을 둘러보세요</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuCard} onPress={() => handleNavigation("/report/recent")}>
            <View style={[styles.iconBox, { backgroundColor: "#F87171" }]}>
              <MaterialCommunityIcons name="heart" size={24} color="#fff" />
            </View>
            <View style={styles.menuTextContainer}>
              <Text style={styles.menuTitle}>감정 피드백</Text>
              <Text style={styles.menuDesc}>나의 감정 변화를 한눈에 확인해보세요</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={["#FEF3C7", "#FFEDD5"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.quoteCard}
        >
          <MaterialCommunityIcons name="format-quote-open" size={24} color="#F88010" style={{ marginBottom: 8 }} />
          <Text style={styles.quoteText}>"오늘의 작은 순간들이 모여 내{"\n"}일의 소중한 추억이 됩니다"</Text>
          <MaterialCommunityIcons name="format-quote-close" size={24} color="#F88010" style={{ marginTop: 8 }} />
        </LinearGradient>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={18} color="#666" />
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF2",
    overflow: "hidden",
  },
  bgCircle: {
    position: "absolute",
    top: -100,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#FFF5E0",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 64,
  },
  headerTitle: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerUnderline: {
    width: 40,
    height: 3,
    backgroundColor: "#F88010",
    marginTop: 4,
  },
  greetingCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  greetingTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  greetingSubText: {
    fontSize: 14,
    color: "#666",
  },
  greetingBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  menuContainer: {
    gap: 16,
    marginBottom: 24,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 400,
    color: "#333",
    lineHeight: 24,
    marginBottom: 4,
  },
  menuDesc: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
    paddingRight: 10,
  },
  quoteCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(253, 230, 138, 0.50)",
    padding: 24,
    alignItems: "center",
    marginBottom: 30,
  },
  quoteText: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    marginBottom: 20,
  },
  logoutText: {
    marginLeft: 8,
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default HomeScreen;
