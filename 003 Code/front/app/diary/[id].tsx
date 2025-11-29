import { useGetDiary } from "@/src/feature/diary/hooks/use-diary";
import SharedHeader from "@/src/shared/ui/shared-header";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface DiaryEmotions {
  joy: number;
  sadness: number;
  anger: number;
  anxiety: number;
  tiredness: number;
  calm: number;
}

const EMOTION_CONFIG: Record<keyof DiaryEmotions, { label: string; color: string }> = {
  joy: { label: "기쁨", color: "#FF8E26" }, // Orange
  sadness: { label: "슬픔", color: "#5C9DFF" }, // Blue
  anger: { label: "분노", color: "#FF4D4D" }, // Red
  anxiety: { label: "불안", color: "#A66EFE" }, // Purple
  tiredness: { label: "피로", color: "#8E99A6" }, // Grey
  calm: { label: "평온함", color: "#2BCBBA" }, // Teal/Green
};

const DiaryDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data } = useGetDiary(id);
  type RouterPushParam = Parameters<typeof router.push>[0];

  const formatDate = (dateString?: string) => {
    if (!dateString) return "2024년 11월 17일";
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  const handleGoToReport = () => {
    if (id) {
      router.push(`/report/${id}` as RouterPushParam);
    }
  };

  const moodScore = data ? Math.round(data.overallMoodScore * 100) : 0;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SharedHeader>
        <SharedHeader.Side>
          <SharedHeader.Back path={"/home"} />
        </SharedHeader.Side>
        <SharedHeader.Title title="오늘의 일기" subtitle={formatDate(data?.createdAt)} />
        <SharedHeader.Side>
          <></>
        </SharedHeader.Side>
      </SharedHeader>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeaderRow}>
            <View>
              <Text style={styles.scoreLabel}>오늘의 기분 점수</Text>
              <Text style={styles.scoreValue}>{moodScore}</Text>
            </View>
            <MaterialCommunityIcons name="emoticon-happy-outline" size={48} color="#D97706" />
          </View>
          <View style={styles.scoreBarBg}>
            <View style={[styles.scoreBarFill, { width: `${moodScore}%` }]} />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitleSmall}>지배적인 감정</Text>
          <View style={styles.dominantEmotionBox}>
            <MaterialCommunityIcons name="emoticon-neutral-outline" size={24} color="#333" />
            <Text style={styles.dominantEmotionText}>
              {data?.dominantEmotion &&
                (EMOTION_CONFIG[data.dominantEmotion as keyof DiaryEmotions]?.label || data.dominantEmotion)}
            </Text>
          </View>
        </View>

        <View style={styles.whiteCard}>
          <Text style={styles.sectionTitleSmall}>감정 분석</Text>
          <View style={{ marginTop: 10 }}>
            {data?.emotions &&
              Object.keys(data.emotions).map((key) => {
                const emotionKey = key as keyof DiaryEmotions;
                const config = EMOTION_CONFIG[emotionKey];
                const value = data.emotions[emotionKey] || 0;
                const percentage = Math.round(value * 100);

                return (
                  <View key={key} style={styles.emotionRow}>
                    <View style={styles.emotionLabelRow}>
                      <Text style={styles.emotionLabelText}>{config?.label || key}</Text>
                      <Text style={[styles.emotionPercentText, { color: config?.color }]}>{percentage}%</Text>
                    </View>
                    <View style={styles.emotionBarBg}>
                      <View
                        style={[styles.emotionBarFill, { width: `${percentage}%`, backgroundColor: config?.color }]}
                      />
                    </View>
                  </View>
                );
              })}
          </View>
        </View>

        <View style={styles.whiteCard}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color="#F88010" />
            <Text style={styles.cardTitle}>일기 요약</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>{data?.summary || "요약 내용이 없습니다."}</Text>
          </View>
        </View>

        <View style={[styles.whiteCard, styles.aiCard]}>
          <View style={styles.cardHeader}>
            <Ionicons name="heart" size={20} color="#FF6B6B" />
            <Text style={[styles.cardTitle, { color: "#FF6B6B" }]}>AI의 한마디</Text>
          </View>
          <Text style={styles.aiText}>{data?.recommendation || "오늘 하루도 수고 많으셨어요."}</Text>
        </View>

        <TouchableOpacity style={styles.reportButton} onPress={handleGoToReport} activeOpacity={0.9}>
          <View style={styles.reportIconContainer}>
            <MaterialCommunityIcons name="chart-line-variant" size={24} color="#FFF" />
          </View>
          <View style={styles.reportTextContainer}>
            <Text style={styles.reportBtnTitle}>감정 리포트 보기</Text>
            <Text style={styles.reportBtnSubtitle}>나의 감정 변화를 확인해보세요</Text>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.whiteCard}>
          <View style={styles.cardHeader}>
            <MaterialCommunityIcons name="pencil" size={20} color="#F88010" />
            <Text style={styles.cardTitle}>좋은 일이 있었던 하루</Text>
          </View>
          <Text style={styles.bodyText}>{data?.content || "내용이 없습니다."}</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF2",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 16,
  },

  scoreCard: {
    backgroundColor: "#FFECC8",
    borderRadius: 20,
    padding: 24,
  },
  scoreHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  scoreLabel: {
    fontSize: 14,
    color: "#9A6F4C",
    fontWeight: "600",
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#5C3D2E",
  },
  scoreBarBg: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 4,
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    backgroundColor: "#FF8E26",
    borderRadius: 4,
  },

  sectionContainer: {
    marginBottom: 4,
  },
  sectionTitleSmall: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 8,
    fontWeight: "500",
  },
  dominantEmotionBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    gap: 8,
  },
  dominantEmotionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },

  whiteCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 1,
  },

  emotionRow: {
    marginBottom: 12,
  },
  emotionLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  emotionLabelText: {
    fontSize: 14,
    color: "#4B5563",
    fontWeight: "500",
  },
  emotionPercentText: {
    fontSize: 14,
    fontWeight: "700",
  },
  emotionBarBg: {
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  emotionBarFill: {
    height: "100%",
    borderRadius: 3,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },

  summaryBox: {
    backgroundColor: "#FFF8E1",
    padding: 16,
    borderRadius: 12,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#5D4037",
  },

  aiCard: {
    backgroundColor: "#FFF5F5",
    borderWidth: 1,
    borderColor: "#FFE3E3",
  },
  aiText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
    fontStyle: "italic",
  },
  reportButton: {
    backgroundColor: "#FF8E26",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#FF8E26",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  reportIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  reportTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  reportBtnTitle: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 3,
  },
  reportBtnSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "500",
  },
  bodyText: {
    fontSize: 15,
    lineHeight: 26,
    color: "#374151",
    fontWeight: "400",
  },
});

export default DiaryDetailScreen;
