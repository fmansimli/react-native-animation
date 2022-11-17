import React, { useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { DrawerNavigationOptions } from "@react-navigation/drawer";

import { mediaDevices, RTCView, MediaStream } from "react-native-webrtc";

const MeetScreen = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const start = async () => {
    if (!stream) {
      let s;
      try {
        s = await mediaDevices.getUserMedia({ video: true });
        setStream(s);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const stop = () => {
    if (stream) {
      stream.release();
      setStream(null);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.video}></View>
      <View style={styles.buttons}>
        <Button title="start" onPress={start} />
        <Button title="stop" onPress={stop} />
      </View>
    </View>
  );
};

export const meetOptions: DrawerNavigationOptions = {
  title: "app",
};

export default MeetScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 20,
  },
  video: {
    height: "80%",
    borderWidth: 1,
  },
  stream: { flex: 1 },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
  },
});
