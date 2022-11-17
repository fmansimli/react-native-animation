import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { DrawerNavigationOptions } from "@react-navigation/drawer";

const HomeScreen = () => {
  return (
    <View style={styles.screen}>
      <Text>HomeScreen</Text>
    </View>
  );
};

export const homeOptions: DrawerNavigationOptions = {
  title: "app",
};

export default HomeScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
