export const peerCons = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

export const sessionCons = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: true,
    VoiceActivityDetection: true,
  },
};

export const mediaCons = {
  audio: true,
  video: {
    frameRate: 30,
    facingMode: "user", //environment
  },
};

// useEffect(() => {
//   pc.current?.addEventListener("datachannel", (event: any) => {
//     console.log("datachannel");
//     channel.current = event.channel;
//   });
// });

// useEffect(() => {
//   pc.current?.addEventListener("connectionstatechange", (event: any) => {
//     console.log("connectionstatechange");
//     switch (pc.current?.connectionState) {
//       case "closed":
//         //You can handle the call being disconnected here.
//         break;
//     }
//   });
// });

// useEffect(() => {
//   pc.current?.addEventListener("icecandidate", (event: any) => {
//     console.log("icecandidate");
//     // When you find a null candidate then there are no more candidates.
//	   // Gathering of candidates has finished.
//	   // if ( !event.candidate ) { return; };
//
//	   // Send the event.candidate onto the person you're calling.
//	   // Keeping to Trickle ICE Standards, you should send the candidates immediately.
//   });
// });

// useEffect(() => {
//   pc.current?.addEventListener("icecandidateerror", (event: any) => {
//     console.log("icecandidateerror");
//     // You can ignore some candidate errors.
//	   // Connections can still be made even when errors occur.
//   });
// });

// useEffect(() => {
//   pc.current?.addEventListener("iceconnectionstatechange", (event: any) => {
//     console.log("iceconnectionstatechange");
//     switch (pc.current?.iceConnectionState) {
//       case "connected":
//       case "completed":
//          // You can handle the call being connected here.
//			// Like setting the video streams to visible.
//       break;
//     }
//   });
// });

// useEffect(() => {
//   pc.current?.addEventListener("signalingstatechange", (event: any) => {
//     console.log("signalingstatechange");
//     switch (pc.current?.signalingState) {
//       case "closed":
//         //You can handle the call being disconnected here.
//         break;
//     }
//   });
// });

// useEffect(() => {
//   pc.current?.addEventListener("addstream", (event: any) => {
//     console.log("signalingstatechange");
//     // Grab the remote stream from the connected participant.
//     	  remoteMediaStream = event.stream;
//   });
// });
