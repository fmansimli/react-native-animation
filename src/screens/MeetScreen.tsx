import React, { useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { DrawerNavigationOptions } from "@react-navigation/drawer";

import { mediaDevices, RTCView, MediaStream } from "react-native-webrtc";

const MeetScreen = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    return () => stream?.release();
  }, []);

  const start = async () => {
    if (!stream) {
      let lStream;
      try {
        lStream = await mediaDevices.getUserMedia({ video: true });
        setStream(lStream);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const stop = () => {
    stream?.release();
    setStream(null);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.video}>
        <RTCView streamURL={stream?.toURL()} style={styles.stream} />
      </View>
      <View style={styles.buttons}>
        <Button title="start" onPress={start} />
        <Button title="stop" onPress={stop} />
      </View>
    </View>
  );
};

export const meetOptions: DrawerNavigationOptions = {
  title: "meet",
};

export default MeetScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  video: {
    height: "80%",
    margin: 5,
  },
  stream: {
    flex: 1,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
  },
});
