import { serverSocket } from './Connection'
import Peer from "simple-peer";
import {getCookie} from './CookieHelper'

const TURN_SERVER_URL = '35.223.15.12:3479';
const TURN_SERVER_USERNAME = 'videoparty';
const TURN_SERVER_CREDENTIAL = 'videoparty100';
const SERVER_CONFIG = {
    iceServers: [
        {
            urls: 'turn:' + TURN_SERVER_URL + '?transport=tcp',
            username: TURN_SERVER_USERNAME,
            credential: TURN_SERVER_CREDENTIAL
        },
        {
            urls: 'stun:' + TURN_SERVER_URL,
            username: TURN_SERVER_USERNAME,
            credential: TURN_SERVER_CREDENTIAL
        }
    ]
};

var peerConnections = {};
var creatorPC;
var stream;
var videoPlayer;

function addMedia (joineePC) {
    let vidTracks = stream.getVideoTracks()
    let audTracks = stream.getAudioTracks()
    joineePC.addTrack(vidTracks[0], stream)
    joineePC.addTrack(audTracks[0], stream)
}

function startStreaming(roomMembers){
    let userType = getCookie("user-type")
    if(userType === 'creator'){
        //  create stream object
        videoPlayer = document.querySelector('video')
        if(videoPlayer === null || videoPlayer === undefined){
            console.error("videoPlayer not set: ", videoPlayer)
        }
        else if(stream === null || stream === undefined){
            stream = videoPlayer.captureStream()
        }

        Object.keys(roomMembers).map((username) => {
            // check if username same as own username
            if(username !== getCookie("username")){
                peerConnections[username] = {peerConnectionObject: new Peer({initiator: true, config:SERVER_CONFIG}), streamAdded: false}
                peerConnections[username]['peerConnectionObject'].on('signal', (desc) => {
                    serverSocket.emit("send-offer", {desc:desc, roomID:getCookie("room-id"), from: getCookie("username"), to: username,})
                })
            }
            return (null)
        })

    }
    else if(userType === 'joinee'){
        creatorPC = new Peer({config:SERVER_CONFIG})
        creatorPC.on('signal', (desc) => {
            serverSocket.emit("send-answer", {desc:desc, roomID:getCookie("room-id"), from: getCookie("username")})
        })
    }
}

serverSocket.on('receive-offer', (data) => {
    if(getCookie("user-type") === "joinee"){
        if(data['to'] === getCookie('username')){
            // add signalling desc of creator
            creatorPC.signal(data['desc'])

            // add callback event to receive stream
            creatorPC.on('stream', (stream) => {
                console.log("receiving stream");
                videoPlayer = document.querySelector('video')
                if ('srcObject' in videoPlayer) {
                    videoPlayer.srcObject = stream
                } else {
                    videoPlayer.src = window.URL.createObjectURL(stream) // for older browsers
                }
            })
        }
    }
})

serverSocket.on('receive-answer', (data) => {
    // receive answer from joinees
    if(getCookie("user-type") === "creator"){
        let from = data["from"]
        peerConnections[from]['peerConnectionObject'].signal(data['desc'])
        if(peerConnections[from]['streamAdded'] === false){
            addMedia(peerConnections[from]['peerConnectionObject'])
            peerConnections[from]['streamAdded'] = true;
        }
    }
})

export {startStreaming}