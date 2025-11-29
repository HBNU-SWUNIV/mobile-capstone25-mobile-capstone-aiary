import { useGetDiaries } from "@/src/feature/diary/hooks/use-diary";
import { DiarySummary } from "@/src/feature/diary/types";
import SharedHeader from "@/src/shared/ui/shared-header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ICON_PRESETS = [
  { icon: "star", color: "#FFB02E" },
  { icon: "heart", color: "#6A9DFF" },
  { icon: "leaf", color: "#2ECC71" },
  { icon: "cloud", color: "#E056FD" },
  { icon: "flower-tulip", color: "#FF6B6B" },
  { icon: "weather-sunny", color: "#FF8E26" },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(date.getDate()).padStart(2, "0")}`;
};

const getRelativeTime = (dateString: string) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
  return "오래 전";
};

const StatsHeader = ({ total = 0, month = 0, week = 0 }) => (
  <View style={styles.statsContainer}>
    <View style={styles.statItem}>
      <Text style={styles.statNumber}>{total}</Text>
      <Text style={styles.statLabel}>총 일기</Text>
    </View>
    <View style={styles.statItem}>
      <Text style={[styles.statNumber, { color: "#D97706" }]}>{month}</Text>
      <Text style={styles.statLabel}>이번 달</Text>
    </View>
    <View style={styles.statItem}>
      <Text style={[styles.statNumber, { color: "#F88010" }]}>{week}</Text>
      <Text style={styles.statLabel}>이번 주</Text>
    </View>
  </View>
);

const DiaryItem = React.memo(({ item }: { item: DiarySummary }) => {
  const router = useRouter();

  const iconStyle = useMemo(() => {
    const index = item.id
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return ICON_PRESETS[index % ICON_PRESETS.length];
  }, [item.id]);

  const formattedDate = dayjs(item.createdAt).format("YYYY년 M월 D일");
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/diary/${item.id}`)}
    >
      <View style={styles.cardLeft}>
        <View style={[styles.iconCircle, { backgroundColor: iconStyle.color }]}>
          <MaterialCommunityIcons
            name={iconStyle.icon as any}
            size={24}
            color="#FFF"
          />
        </View>
      </View>

      <View style={styles.cardCenter}>
        <View style={styles.cardTitleRow}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {formattedDate}
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {getRelativeTime(item.createdAt)}
            </Text>
          </View>
        </View>

        <Text style={styles.dateText}>{formatDate(item.createdAt)}</Text>

        <Text style={styles.summaryText} numberOfLines={2}>
          {item.summary}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

const DiaryListScreen = () => {
  const insets = useSafeAreaInsets();
  const { data } = useGetDiaries();
  const diaryList = data?.reverse() ?? [];
  const stats = useMemo(() => {
    if (!diaryList || diaryList.length === 0) {
      return { total: 0, month: 0, week: 0 };
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    let monthCount = 0;
    let weekCount = 0;

    diaryList.forEach((diary) => {
      const diaryDate = new Date(diary.createdAt);

      if (
        diaryDate.getFullYear() === currentYear &&
        diaryDate.getMonth() === currentMonth
      ) {
        monthCount++;
      }

      if (diaryDate >= startOfWeek) {
        weekCount++;
      }
    });

    return {
      total: diaryList.length,
      month: monthCount,
      week: weekCount,
    };
  }, [diaryList]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SharedHeader>
        <SharedHeader.Side>
          <SharedHeader.Back />
        </SharedHeader.Side>
        <SharedHeader.Title title="나의 일기장" subtitle="소중한 기억들" />
        <SharedHeader.Side>
          <></>
        </SharedHeader.Side>
      </SharedHeader>

      <FlatList
        data={diaryList}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={<StatsHeader {...stats} />}
        renderItem={({ item }) => <DiaryItem item={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>작성된 일기가 없습니다.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF2",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingVertical: 20,
    marginVertical: 20,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    fontWeight: "500",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  cardLeft: {
    marginRight: 16,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  cardCenter: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  badge: {
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 11,
    color: "#D97706",
    fontWeight: "600",
  },
  dateText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
  },
});

export default DiaryListScreen;
