import apiClient from "@/src/shared/api/axios";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

const queryClient = new QueryClient();

const fetchUserInfo = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) return null;

  try {
    const { data } = await apiClient.get("/auth/me");

    return data;
  } catch (error) {
    return null;
  }
};

export function RootLayoutNav() {
  const router = useRouter();
  const segments = useSegments();

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserInfo,
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "home" || segments[0] === "login" || segments[0] === "signup";

    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && inAuthGroup) {
      router.replace("/home");
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="report/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
        <Stack.Screen name="chat/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="diary/index" options={{ headerShown: false }} />
        <Stack.Screen name="diary/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="setting" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

// 3. 최상위 Provider
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}
