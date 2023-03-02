import {io} from 'socket.io-client';
// import {RTCPeerConnection} from 'react-native-webrtc';
//const ENDPOINT = 'http://192.168.18.39:3000';
//const ENDPOINT = 'http://192.168.18.76:3000'; //router ip
const ENDPOINT = 'http://70.62.23.133:9999'; //development
// let peerConstraints = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
// export const peerConnection = new RTCPeerConnection(peerConstraints);

export const socket = io(ENDPOINT);
