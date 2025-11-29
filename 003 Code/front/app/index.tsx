import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [floatAnim]);

  const handleSignUp = () => {
    router.push("/signup");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.topCircle} />
      <View style={styles.bottomCircle} />

      <Animated.View style={[styles.logoContainer, { transform: [{ translateY: floatAnim }] }]}>
        <Image source={require("../assets/images/feather-icon.png")} style={styles.icon} />
      </Animated.View>

      <Text style={styles.appName}>Aiary</Text>
      <View style={styles.textContainer}>
        <Text style={styles.slogan}>오늘의 이야기를 AI와 함께</Text>
        <Text style={styles.slogan}>기록해보세요</Text>
      </View>

      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

      <View style={styles.spacer} />

      <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleSignUp}>
        <Text style={styles.primaryButtonText}>시작하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleLogin}>
        <Text style={styles.secondaryButtonText}>이미 계정이 있어요</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFBF2",
    paddingHorizontal: 24,
    overflow: "hidden",
  },
  topCircle: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#FFF5E0",
  },
  bottomCircle: {
    position: "absolute",
    bottom: 150,
    left: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: "#FFF5E0",
  },
  logoContainer: {
    marginTop: 80,
    width: 100,
    height: 100,
    backgroundColor: "#E86A10",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#E86A10",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    tintColor: "#fff",
  },
  appName: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  slogan: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E8A510",
    opacity: 0.5,
  },
  dotActive: {
    opacity: 1,
  },
  spacer: {
    flex: 1,
  },
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: "#E86A10",
    shadowColor: "#E86A10",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#FFE0B2",
    marginBottom: 50,
  },
  secondaryButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "500",
  },
});
