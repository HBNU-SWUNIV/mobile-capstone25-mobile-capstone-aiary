import { StyleSheet, Text, View } from "react-native";

const DateDivider = ({ date }: { date: string }) => (
  <View style={styles.dateDividerContainer}>
    <Text style={styles.dateText}>{date}</Text>
  </View>
);

const styles = StyleSheet.create({
  dateDividerContainer: {
    alignItems: "center",
    marginVertical: 8,
  },
  dateText: {
    fontSize: 12,
    color: "#9E9E9E",
    fontWeight: "400",
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: "#ECECEC",
    borderRadius: 12,
  },
});

export default DateDivider;
