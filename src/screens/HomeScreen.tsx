import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { DrawerNavigationOptions } from "@react-navigation/drawer";

const HomeScreen = () => {
  return (
    <View>
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
