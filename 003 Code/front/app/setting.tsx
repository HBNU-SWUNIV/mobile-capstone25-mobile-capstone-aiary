import SharedHeader from "@/src/shared/ui/shared-header";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SettingsScreen = () => {
  const [nickname, setNickname] = useState("박건상");
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <SharedHeader>
        <>
          <SharedHeader.Side>
            <SharedHeader.Menu />
          </SharedHeader.Side>
          <SharedHeader.Title title="설정" />
          <SharedHeader.Side>
            <SharedHeader.PlaceHoder />
          </SharedHeader.Side>
        </>
      </SharedHeader>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>설정</Text>
        <Text style={styles.pageSubtitle}>계정 및 앱 설정을 관리하세요</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>로그인 / 회원정보 관리</Text>
            <Text style={styles.userIcon}>👤</Text>
          </View>

          <View style={styles.loginCard}>
            <View style={styles.loginInfo}>
              <Text style={styles.checkIcon}>✓</Text>
              <View style={styles.loginTextContainer}>
                <Text style={styles.loginStatus}>현재 로그인 상태입니다</Text>
                <Text style={styles.userEmail}>user@example.com</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>닉네임 수정</Text>
            <Text style={styles.editIcon}>✏️</Text>
          </View>

          <Text style={styles.label}>닉네임</Text>
          <TextInput
            style={styles.input}
            placeholder="닉네임을 입력하세요"
            placeholderTextColor="#B5B5B5"
            value={nickname}
            onChangeText={setNickname}
          />

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonIcon}>💾</Text>
            <Text style={styles.saveButtonText}>저장하기</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>감정 패턴 확인</Text>
            <Text style={styles.chartIcon}>📊</Text>
          </View>

          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyIcon}>📈</Text>
            <Text style={styles.emptyTitle}>곧 제공될 기능입니다!</Text>
            <Text style={styles.emptyDescription}>
              일기 데이터를 분석하여 감정 패턴을 시각화하여 보여드릴 예정입니다
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listItemLeft}>
            <Text style={styles.listItemIcon}>🔒</Text>
            <Text style={styles.listItemText}>비밀번호 변경</Text>
          </View>
          <Text style={styles.listItemAction}>준비중</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listItemLeft}>
            <Text style={styles.listItemIcon}>👑</Text>
            <Text style={styles.listItemText}>구독 및 이용 내역</Text>
          </View>
          <Text style={styles.listItemAction}>준비중</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },

  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginTop: 24,
    marginLeft: 4,
    marginBottom: 8,
  },
  pageSubtitle: {
    fontSize: 14,
    color: "#999",
    marginLeft: 4,

    marginBottom: 24,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  userIcon: {
    fontSize: 20,
  },
  editIcon: {
    fontSize: 20,
  },
  chartIcon: {
    fontSize: 20,
  },
  loginCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 16,
  },
  loginInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    fontSize: 20,
    color: "#4CAF50",
    marginRight: 12,
  },
  loginTextContainer: {
    flex: 1,
  },
  loginStatus: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: "#4CAF50",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#000",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#5B5FED",
    borderRadius: 12,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#5B5FED",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  emptyStateCard: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 13,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  listItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  listItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  listItemText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  listItemAction: {
    fontSize: 13,
    color: "#B5B5B5",
  },
});

export default SettingsScreen;
