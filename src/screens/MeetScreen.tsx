import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View, Switch, Alert } from "react-native";
import { DrawerNavigationOptions } from "@react-navigation/drawer";

import {
  mediaDevices,
  RTCView,
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
} from "react-native-webrtc";
import { mediaCons, peerCons, sessionCons } from "webrtc/config";

import * as rtcSocket from "sockets/webrtc.socket";
import { Device } from "cons";

const MeetScreen = () => {
  const [video, setVideo] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [rStream, setRStream] = useState<MediaStream | null>(null);
  const [negotiated, setNegotiated] = useState(false);
  const [remoteId, setRemoteId] = useState("");

  const pc = useRef<RTCPeerConnection | null>(null);
  const channel = useRef<any>(null);

  useEffect(() => {
    rtcSocket.initWebRTC();

    return () => {
      rtcSocket.disconnect();
      stop();
    };
  }, []);

  useEffect(() => {
    rtcSocket.userJoined((socketID: string) => {
      setRemoteId(socketID);
    });

    rtcSocket.offerIn((data: any) => {
      createAnswer(data);
    });

    rtcSocket.answerIn((data: any) => {
      handleAnswer(data);
    });
  }, []);

  useEffect(() => {
    if (negotiated && !stream && remoteId) {
      console.log("offer being created");
      createOffer();
    }
  }, [negotiated]);

  useEffect(() => {
    pc.current?.addEventListener("negotiationneeded", (event) => {
      console.log("negotiationneeded");
      setNegotiated(true);
    });
  });

  const start = async () => {
    if (stream) return;

    pc.current = new RTCPeerConnection(peerCons);

    try {
      const mystream = await mediaDevices.getUserMedia(mediaCons);
      if (!video) {
        let videoTrack = mystream.getVideoTracks()[0];
        videoTrack.enabled = false;
      }
      pc.current.addStream(mystream);
      setStream(mystream);

      createChannel();
    } catch (e) {
      console.log("starting-error", e);
    }
  };

  const createChannel = async () => {
    try {
      const datachannel = pc.current?.createDataChannel("my_channel");
    } catch (err) {
      console.log("channel-creating-error", err);
    }
  };

  const createOffer = async () => {
    try {
      const offerDescription = await pc.current?.createOffer(sessionCons);
      await pc.current?.setLocalDescription(offerDescription);
      // Send the offerDescription to the other participant.
      rtcSocket.sendOffer(remoteId, offerDescription);
    } catch (err) {
      console.log("offer-creating-error", err);
    }
  };

  const handleAnswer = async ({ from, desc, type }: any) => {
    try {
      // Use the received answerDescription

      const answerDescription = new RTCSessionDescription(desc);
      await pc.current?.setRemoteDescription(answerDescription);
    } catch (err) {
      console.log("handle-answer-error", err);
    }
  };

  const createAnswer = async ({ from, desc, type }: any) => {
    try {
      // Use the received offerDescription

      const offerDesc = new RTCSessionDescription(desc);
      await pc.current?.setRemoteDescription(offerDesc);
      const answerDesc = await pc.current?.createAnswer(sessionCons);
      await pc.current?.setLocalDescription(answerDesc);
      // Send the answerDescription back as a response to the offerDescription.
      rtcSocket.sendAnswer(from, answerDesc);
    } catch (err) {
      console.log("answer-creating-error", err);
    }
  };

  const stop = () => {
    stream?.release();
    setStream(null);

    pc.current?._unregisterEvents();
    pc.current?.close();
    pc.current = null;

    channel.current?.close();
    channel.current = null;
  };

  return (
    <View style={styles.screen}>
      <View style={styles.video}>
        <RTCView
          streamURL={stream?.toURL()}
          style={styles.stream}
          mirror={true}
          objectFit={"cover"}
          
        />
      </View>
      <View style={styles.remote}>
        <RTCView
          streamURL={rStream?.toURL()}
          style={styles.stream}
          mirror={true}
          objectFit={"cover"}
          zOrder={0}
        />
      </View>
      <View style={styles.buttons}>
        <Button title="start" onPress={start} />
        <Switch value={video} onValueChange={(v) => setVideo(v)} />
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
    height: "45%",
    margin: 5,
  },
  remote: {
    height: "45%",
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
