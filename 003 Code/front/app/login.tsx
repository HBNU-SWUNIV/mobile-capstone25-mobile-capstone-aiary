import { useLogin } from "@/src/feature/auth/hooks/auth";
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

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: login, isPending } = useLogin();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("입력 오류", "사용자 이름과 비밀번호를 입력하세요.");
      return;
    }

    login(
      { user_name: email, password },
      {
        onError: (error) => {
          Alert.alert("로그인 실패", error.message || "사용자 이름 또는 비밀번호를 확인해주세요.");
        },
      }
    );
  };

  const handleGoToSignUp = () => {
    router.push("/signup");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.appName}>Aiary</Text>
            <View style={styles.underline} />

            <Text style={styles.pageTitle}>로그인</Text>
            <Text style={styles.subtitle}>다시 만나서 반가워요</Text>
          </View>

          <View style={styles.formContainer}>
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

            <TouchableOpacity style={styles.forgotPasswordContainer}>
              <Text style={styles.forgotPasswordText}>비밀번호를 잊으셨나요?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={isPending}>
              <Text style={styles.loginButtonText}>로그인</Text>
            </TouchableOpacity>

            <View style={styles.signupPrompt}>
              <Text style={styles.signupText}>아직 계정이 없으신가요?</Text>
              <TouchableOpacity onPress={handleGoToSignUp}>
                <Text style={styles.signupLink}>회원가입</Text>
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
    top: -40,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FFF5E0",
  },
  bottomCircle: {
    position: "absolute",
    bottom: 100,
    left: -60,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#FFF5E0",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 50,
    marginTop: 60,
  },
  appName: {
    fontSize: 36,
    color: "#1F2937",
    fontFamily: Platform.select({ ios: "System", android: "sans-serif-medium" }),
  },
  underline: {
    width: 40,
    height: 3,
    backgroundColor: "#F97316",
    marginTop: 5,
    marginBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
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
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginTop: 12,
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: "#6B7280",
    fontSize: 13,
  },
  loginButton: {
    width: "100%",
    height: 56,
    backgroundColor: "#F88010",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F88010",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupPrompt: {
    flexDirection: "column",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 20,
    gap: 5,
  },
  signupText: {
    fontSize: 14,
    color: "#666",
  },
  signupLink: {
    fontSize: 15,
    color: "#F88010",
    fontWeight: "bold",
  },
});
