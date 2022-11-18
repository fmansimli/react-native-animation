import React, { useEffect, useRef, useState } from "react";
import { Button, StyleSheet, View, Switch } from "react-native";
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
      rtcSocket.sendOffer(socketID, {
        title: "myoffer",
        from: Device.info,
      });
    });

    rtcSocket.offerIn((data: any) => {
      alert(JSON.stringify(data, null, 2));
      rtcSocket.sendAnswer(data.from, {
        title: "myanswer",
        from: Device.info,
      });
    });

    rtcSocket.answerIn((data: any) => {
      alert(JSON.stringify(data, null, 2));
    });
  }, []);

  useEffect(() => {}, [video]);

  // useEffect(() => {
  //   pc.current?.addEventListener("negotiationneeded", (event) => {
  //     console.log("negotiationneeded");
  //     createOffer();
  //   });
  // });

  const start = async () => {
    //pc.current = new RTCPeerConnection(peerCons);
    if (stream) return;

    let mystream;
    try {
      mystream = await mediaDevices.getUserMedia(mediaCons);
      if (!video) {
        let videoTrack = mystream.getVideoTracks()[0];
        videoTrack.enabled = false;
      }
      setStream(mystream);
      // pc.current.addStream(mystream);
      // createChannel();
    } catch (e) {
      console.log("starting-error", e);
    }
  };

  const createChannel = async () => {
    try {
      //let datachannel = pc.current?.createDataChannel("my_channel");
    } catch (err) {
      console.log("channel-creating-error", err);
    }
  };

  const createOffer = async () => {
    try {
      // const offerDescription = await pc.current?.createOffer(sessionCons);
      // await pc.current?.setLocalDescription(offerDescription);
      // Send the offerDescription to the other participant.
    } catch (err) {
      console.log("offer-creating-error", err);
    }
  };

  const handleAnswer = async () => {
    try {
      // Use the received answerDescription
      // let receivedAnswer = {};
      // const answerDescription = new RTCSessionDescription(receivedAnswer);
      // await pc.current?.setRemoteDescription(answerDescription);
    } catch (err) {
      console.log("handle-answer-error", err);
    }
  };

  const createAnswer = async () => {
    try {
      // Use the received offerDescription
      // let receivedOffer = {};
      // const offerDescription = new RTCSessionDescription(receivedOffer);
      // await pc.current?.setRemoteDescription(offerDescription);
      // const answerDescription = await pc.current?.createAnswer(sessionCons);
      // await pc.current?.setLocalDescription(answerDescription);
      // Send the answerDescription back as a response to the offerDescription.
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
