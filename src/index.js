'use strict';

// Imports
// ======================
import Peer from 'peerjs';

// Variables
// ======================
let localStream;
let remoteStream = {};

// Functions
// ======================
function sendError(message) {
    let error = document.querySelector('.error');

    error.innerHTML = message;
}

function getUserMedia() {
    navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
    })
        .then((stream) => {
            localStream = stream;

            // play local video
            let video = document.querySelector('.user');

            if ('srcObject' in video) {
                video.srcObject = stream
            } else {
                video.src = window.URL.createObjectURL(stream) // for older browsers
            }
        })
        .catch((error) => {
            switch(error.name) {
                case 'NotFoundError': {
                    sendError('* Sorry, but you dont have any video devices');
                    break;
                }
                case 'NotAllowedError': {
                    sendError('* Permissions have not been granted to use your camera');
                    break;
                }
                case 'ConstraintNotSatisfiedError': {
                    sendError('The resolution ' + this.video.width.exact + 'x' +
                        this.video.height.exact + ' px is not supported by your device.');
                    break;
                }
                default: {
                    console.log(error.name);
                }
            }
        })
}

function waitingForCall() {
    Peer.on("call", (call) => {
        // return local stream
        call.answer(localStream);

        // get other streams
        call.on("stream", (stream) => { //here's where you get the stream
            remoteStream[call.peer] = stream; //Update your record.



            $("#video-" + call.peeer).remove(); //Remove remote video if exists before

            $("#video-list").append("<video id='video-"+ call.peeer +"' autoplay></video>"); //Create new video element
            $("#video-"+ call.peeer).prop("srcObject", stream); //Put stream to the video
        });
    });
}

function getUsers() {
    return ['user-1','user-2','user-3'];
}

function callToUsers() {
    for(let user of getUsers())
    {
        call = Peer.call(user, localStream);

        call.on("stream", () => {
            remoteStream[call.peer] = stream; //Update your record.

            $("#video-" + call.peeer).remove(); //Remove remote video if exists before

            $("#video-list").append("<video id='video-"+ call.peeer +"' autoplay></video>"); //Create new video element
            $("#video-"+ call.peeer).prop("srcObject", stream); //Put stream to the video
        });
    }
}

// Bootstrap
// ======================
getUserMedia();
// waitingForCall();
// callToUsers();