import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SharedHeaderProps {
  children: React.ReactNode;
}

function SharedHeader({ children }: SharedHeaderProps) {
  return <View style={styles.header}>{children}</View>;
}

function HeaderSide({ children }: { children: React.ReactNode }) {
  return <View style={styles.sideContainer}>{children}</View>;
}

function PlaceHoder() {
  return <View style={styles.placeholder} />;
}

function BackButton({ path }: { path?: string }) {
  const router = useRouter();
  type RouterPushParam = Parameters<typeof router.push>[0];
  return (
    <Pressable onPress={() => (path ? router.push(path as RouterPushParam) : router.back())} style={styles.iconButton}>
      <Image source={require("@/assets/images/back-icon.png")} style={styles.backIcon} />
    </Pressable>
  );
}

function EditButton({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.iconButton, styles.editButton]}>
      <Text style={styles.editIcon}>✎</Text>
    </Pressable>
  );
}

function HeaderTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.headerTitleContainer}>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

SharedHeader.Side = HeaderSide;
SharedHeader.Edit = EditButton;
SharedHeader.PlaceHoder = PlaceHoder;
SharedHeader.Back = BackButton;
SharedHeader.Title = HeaderTitle;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFBF2",
  },
  sideContainer: {
    width: 40,
    alignItems: "center",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#FFF5E0",
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  editIcon: {
    fontSize: 18,
    color: "#F88010",
    fontWeight: "bold",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  subtitle: {
    fontSize: 12,
    color: "#F88010",
    marginTop: 2,
    fontWeight: "500",
  },
  placeholder: {
    width: 40,
  },
});

export default SharedHeader;
