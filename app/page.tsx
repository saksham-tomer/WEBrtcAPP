"use client"

// import genUUID from '@lib/genUUID'
// import {useEffect,useState} from 'react'
// import {io} from 'socket.io/client'
// import RTCProvider from '@lib/WebRTC'
//
//
// export default function Home() {
//   const [roomName,setRoomName] = useState(null)
//  useEffect(()=>{
//     async function run(){
//   const socket = io('http://localhost:4000',{
//         reconnectionDelayMax: 10000,
//       });
//
// //
// // const openMediaDevices = async(constraints) =>{
// //   return await navigator.mediaDevices.getUserMedia(cosntraints)
// // }
// // try{
// //         const stream = openMediaDevices({'video':true,'audio':true})
// //         console.log('media stream incoming',stream
// //         )
// //       }catch(error){
// //         console.log("error accesing media devices",error)
// //       }
//
//
//
// const configuration = {
//     'iceServers': [{
//       'urls': 'stun:stun.1.google.com:19302'}]}
//     }]
//   }
// const peerConnection = new RTCPeerConnection(configuration);
//
//   RTCProvider(peerConnection);
//
//
//   const room = genUUID();
//     setRoomName((room)=>(roomName = room))
//
//     socket.emit("joinRoom",roomName);
//     }
//
//     peerConnection.onicecandidate = (event)=>{
//       if(event.candidate){
//         socket.emit('iceCandidate',event.candidate,roomName);
//       }
//     }
//     socket.on('iceCandidate',(candidate)=>{
//       peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
//     })
//     return {
//       socket.emit("disconnect")
//     }
//   },[]) 
//   return (
//     <main>
//       <div>Hello there!
//       <video src={} />
//       </div>
//    </main>
//   );
// }
//
// App.js
import React, { useEffect, useRef, useState } from 'react';
import {io} from 'socket.io-client';

const socket = io('http://localhost:4000'); // Replace with your Socket.io server URL

const Page = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    initMediaStream();

    // Setup socket event listeners
    socket.on('offer', handleOffer);
    socket.on('answer', handleAnswer);
    socket.on('iceCandidate', handleNewICECandidateMsg);

    // Cleanup function
    return () => {
      socket.off('offer', handleOffer);
      socket.off('answer', handleAnswer);
      socket.off('iceCandidate', handleNewICECandidateMsg);
    };
  }, []);

  // Get user media stream
  const initMediaStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      localVideoRef.current.srcObject = stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
    }
  };

  // Function to handle receiving offer from remote peer
  const handleOffer = async (offer) => {
    try {
      const pc = createPeerConnection();
      pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('answer', answer);
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  // Function to handle receiving answer from remote peer
  const handleAnswer = (answer) => {
    const pc = peerConnectionRef.current;
    pc.setRemoteDescription(new RTCSessionDescription(answer));
  };

  // Function to handle receiving ICE candidates from remote peer
  const handleNewICECandidateMsg = (candidate) => {
    const pc = peerConnectionRef.current;
    pc.addIceCandidate(new RTCIceCandidate(candidate));
  };

  // Function to create peer connection
  const createPeerConnection = () => {
    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('iceCandidate', event.candidate);
      }
    };

    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    return pc;
  };

  // Function to start video call
  const startCall = async () => {
    const pc = createPeerConnection();
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit('offer', offer);
  };

  return (
    <div>
      <div>
        <h2>Your Video</h2>
        <video ref={localVideoRef} autoPlay muted></video>
      </div>
      <div>
        <h2>Remote Video</h2>
        <video ref={remoteVideoRef} autoPlay></video>
      </div>
      <div>
        <button onClick={startCall}>Start Call</button>
      </div>
    </div>
  );
};

export default Page

