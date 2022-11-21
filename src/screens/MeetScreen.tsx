import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View, Switch, Alert } from "react-native";
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
  const [negotiated, setNegotiated] = useState(false);
  const [remoteId, setRemoteId] = useState("");
  const [creator, setCreator] = useState(false);
  const pc = useRef<RTCPeerConnection | null>(null);
  const channel = useRef<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);

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
      start(false);
      createAnswer(data);
    });

    rtcSocket.answerIn((data: any) => {
      handleAnswer(data);
    });

    rtcSocket.candidateIn((data: any) => {
      const iceCandidate = new RTCIceCandidate(data.candidate);

      if (pc.current?.remoteDescription == null) {
        return setCandidates((old: any[]) => [...old, iceCandidate]);
      }

      return pc.current?.addIceCandidate(iceCandidate);
    });
  }, []);

  useEffect(() => {
    if (negotiated && remoteId && creator) {
      createOffer();
    }
  }, [negotiated]);

  useEffect(() => {
    pc.current?.addEventListener("negotiationneeded", (event) => {
      setNegotiated(true);
    });
  });

  useEffect(() => {
    pc.current?.addEventListener("icecandidate", (event: any) => {
      if (event.candidate) {
        rtcSocket.sendCandidate(remoteId, event.candidate);
      }
    });
  });

  useEffect(() => {
    pc.current?.addEventListener("addstream", (event: any) => {
      console.log("+++++++++++++++++++", Device.info, " -> ");
      setRStream(event.stream);
    });
  });

  const start = async (creator: boolean = true) => {
    if (stream) return;

    setCreator(creator);
    pc.current = new RTCPeerConnection(peerCons);

    try {
      const mystream = await mediaDevices.getUserMedia(mediaCons);
      if (!video) {
        let videoTrack = mystream.getVideoTracks()[0];
        videoTrack.enabled = false;
      }
      pc.current?.addStream(mystream);
      setStream(mystream);

      createChannel();
    } catch (e) {
      console.log("starting-error", e);
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
      const offerDescription = await pc.current?.createOffer(sessionCons);
      await pc.current?.setLocalDescription(offerDescription);

      rtcSocket.sendOffer(remoteId, offerDescription);
    } catch (err) {
      console.log("offer-creating-error", err);
    }
  };

  const createAnswer = async ({ from, desc }: any) => {
    try {
      const offerDesc = new RTCSessionDescription(desc);

      await pc.current?.setRemoteDescription(offerDesc);
      const answerDesc = await pc.current?.createAnswer(sessionCons);

      await pc.current?.setLocalDescription(answerDesc);
      if (candidates.length < 1) {
        return;
      }

      candidates.map((candidate) => pc.current?.addIceCandidate(candidate));
      setCandidates([]);
      rtcSocket.sendAnswer(from, answerDesc);
    } catch (err) {
      console.log("answer-creating-error", err);
    }
  };

  const handleAnswer = async ({ from, desc }: any) => {
    try {
      const answerDescription = new RTCSessionDescription(desc);

      await pc.current?.setRemoteDescription(answerDescription);
    } catch (err) {
      console.log("handle-answer-error", err);
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
    setNegotiated(false);
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
        <Button title="start" onPress={() => start(true)} />
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
  },
});
