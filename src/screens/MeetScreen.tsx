import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View, Alert } from "react-native";
import { DrawerNavigationOptions } from "@react-navigation/drawer";

import {
  mediaDevices,
  RTCView,
  MediaStream,
  RTCPeerConnection,
  RTCSessionDescription,
  RTCIceCandidate,
} from "react-native-webrtc";
import { mediaCons, peerCons, sessionCons } from "webrtc/config";

import * as rtcSocket from "sockets/webrtc.socket";
import { Text } from "react-native-svg";
import { Device } from "cons";

const MeetScreen = () => {
  const [video, setVideo] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [rStream, setRStream] = useState<MediaStream | null>(null);
  const [remoteId, setRemoteId] = useState("");
  const pc = useRef<RTCPeerConnection | null>(new RTCPeerConnection(peerCons));
  const channel = useRef<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);

  console.log("re-rendering...");

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

    rtcSocket.replyIn((socketID: string) => {
      setRemoteId(socketID);
    });

    rtcSocket.offerIn((data: any) => {
      start(false).then(() => {
        createAnswer(data).then(() => finish());
      });
    });

    rtcSocket.answerIn((data: any) => {
      handleAnswer(data).then(() => finish());
    });

    rtcSocket.candidateIn((data: any) => {
      const iceCandidate = new RTCIceCandidate(data.candidate);

      if (pc.current?.remoteDescription == null) {
        setCandidates((old: any[]) => old.concat(iceCandidate));
      } else {
        pc.current?.addIceCandidate(iceCandidate);
      }
      //console.log(Device.osVersion, "ice->", candidates.length);
    });
  }, []);

  useEffect(() => {
    pc.current?.addEventListener("icecandidate", (event: any) => {
      if (event.candidate) {
        rtcSocket.sendCandidate(remoteId, event.candidate);
      }
    });
  });

  useEffect(() => {
    pc.current?.addEventListener("addstream", (event: any) => {
      //console.log(Device.osVersion, event.stream);
      setRStream(event.stream);
    });
  });

  useEffect(() => {
    pc.current?.addEventListener("iceconnectionstatechange", (event: any) => {
      console.log("iceconnectionstatechange", pc.current?.iceConnectionState);
      switch (pc.current?.iceConnectionState) {
        case "connected":
          console.log("connected!!!");
          break;
        case "completed":
          console.log("completed!!!");
          break;
      }
    });
  });

  const startHandler = (creator: boolean) => {
    start(creator).then(() => {
      createOffer();
    });
  };

  const start = async (creator: boolean = true) => {
    if (stream) return;
    try {
      const mystream = await mediaDevices.getUserMedia(mediaCons);

      if (!video) {
        let videoTrack = mystream.getVideoTracks()[0];
        videoTrack.enabled = false;
      }
      pc.current?.addStream(mystream);
      setStream(mystream);
      return Promise.resolve();
    } catch (e) {
      console.log("starting-error", e);
      return Promise.reject(e);
    }
  };

  const createChannel = async () => {
    try {
      channel.current = pc.current?.createDataChannel("my_channel");
    } catch (err) {
      console.log("channel-creating-error", err);
    }
  };

  const createOffer = async () => {
    try {
      const offer = await pc.current?.createOffer(sessionCons);
      await pc.current?.setLocalDescription(offer);
      rtcSocket.sendOffer(remoteId, offer);
    } catch (err) {
      console.log("offer-creating-error", err);
    }
  };

  const createAnswer = async ({ from, desc }: any) => {
    try {
      const offer = new RTCSessionDescription(desc);
      await pc.current?.setRemoteDescription(offer);

      const answer = await pc.current?.createAnswer(sessionCons);
      await pc.current?.setLocalDescription(answer);

      if (candidates.length) {
        candidates.map((candidate) => pc.current?.addIceCandidate(candidate));
        setCandidates([]);
      }

      rtcSocket.sendAnswer(from, answer);
    } catch (err) {
      console.log("answer-creating-error", err);
    }
  };

  const handleAnswer = async ({ from, desc }: any) => {
    try {
      const answer = new RTCSessionDescription(desc);
      await pc.current?.setRemoteDescription(answer);
    } catch (err) {
      console.log("handle-answer-error", err);
    }
  };

  const finish = () => {
    if (candidates.length > 0) {
      candidates.map((candidate) => pc.current?.addIceCandidate(candidate));
      setCandidates([]);
    }
  };

  const call = () => {
    Alert.alert(String(candidates.length));
  };

  const stop = () => {
    stream?.release();
    setStream(null);

    pc.current?._unregisterEvents();
    pc.current?.close();
    pc.current = null;

    channel.current?.close();
    channel.current = null;
    setCandidates([]);
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
      <Text>{remoteId}</Text>
      <View style={styles.remote}>
        <RTCView
          streamURL={rStream?.toURL()}
          style={styles.stream}
          mirror={true}
          objectFit={"cover"}
        />
      </View>
      <View style={styles.buttons}>
        <Button title="start" onPress={() => startHandler(true)} />
        <Button title="call" onPress={call} />
        <Button title="finish" onPress={finish} />
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
    borderWidth: 1,
  },
  remote: {
    height: "45%",
    margin: 5,
    borderWidth: 1,
  },
  stream: {
    flex: 1,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
});
