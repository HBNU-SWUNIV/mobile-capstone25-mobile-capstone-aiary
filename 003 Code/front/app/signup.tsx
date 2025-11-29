import { useSignUp } from "@/src/feature/auth/hooks/auth";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: signUp, isPending } = useSignUp();

  const handleSignUp = () => {
    if (!nickname || !email || !password || !confirmPassword) {
      Alert.alert("입력 오류", "모든 필드를 채워주세요.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("비밀번호 오류", "비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    signUp(
      { nickname, user_name: email, password },
      {
        onSuccess: () => {
          Alert.alert("회원가입 성공", "환영합니다!");
          router.replace("/login");
        },
        onError: (error) => {
          Alert.alert("회원가입 실패", error.message || "다시 시도해주세요.");
        },
      }
    );
  };

  const handleGoToLogin = () => {
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topCircle} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.subtitle}>당신의 이야기를 시작하세요</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={styles.input}
              placeholder="닉네임을 입력해주세요"
              placeholderTextColor="#aaa"
              value={nickname}
              onChangeText={setNickname}
              autoCapitalize="none"
            />

            <Text style={styles.label}>유저이름</Text>
            <TextInput
              style={styles.input}
              placeholder="유저이름을 입력해주세요"
              placeholderTextColor="#aaa"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>비밀번호</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 입력해주세요"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Text style={styles.label}>비밀번호 확인</Text>
            <TextInput
              style={styles.input}
              placeholder="비밀번호를 다시 입력해주세요"
              placeholderTextColor="#aaa"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <TouchableOpacity style={styles.primaryButton} onPress={handleSignUp} disabled={isPending}>
              <Text style={styles.primaryButtonText}>시작하기</Text>
            </TouchableOpacity>

            <View style={styles.loginPrompt}>
              <Text style={styles.loginText}>이미 계정이 있으신가요?</Text>
              <TouchableOpacity onPress={handleGoToLogin}>
                <Text style={styles.loginLink}>로그인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFBF2",
    overflow: "hidden",
  },
  topCircle: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#FFF5E0",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 8,
    marginTop: 16,
    marginLeft: 4,
  },
  input: {
    width: "100%",
    height: 52,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#eee",
    color: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#F88010",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    shadowColor: "#F88010",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginPrompt: {
    flexDirection: "row",
    marginTop: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF9EB",
    paddingVertical: 20,
    borderRadius: 50,
    marginHorizontal: 20,
  },
  loginText: {
    fontSize: 15,
    color: "#666",
    marginRight: 6,
  },
  loginLink: {
    fontSize: 15,
    color: "#F88010",
    fontWeight: "bold",
  },
});
