
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function BecomeSitter({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Rỗng</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFAF5",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 20,
  },
});
