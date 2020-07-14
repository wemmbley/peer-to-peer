'use strict';

let sendError = (message) => {
    let error = document.querySelector('.error');

    error.innerHTML = message;
};

if(location.protocol !== 'https:') {
    sendError('* Sorry, but HTTPS required');
    throw new Error("Connection not secure.");
}

function getVideo(callbacks) {
    navigator.getUserMedia = (
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia);

    const constraints = {
        video: true,
        audio: true
    };

    navigator.getUserMedia(constraints, callbacks.success, callbacks.error)
}

function displayStream(stream, element) {
    let video = document.querySelector(element);

    if(!video) {
        sendError('* Sorry, but your browser does not support video');
        throw new Error("Browser does not support video.");
    }

    video.srcObject = stream;
}

getVideo({
    success: (stream) => {
        displayStream(stream, '.local-video')
    },
    error: (error) => {
        switch (error.name) {
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
    }
})



import Peer from 'peerjs';
const localPeer = new Peer('user-1', {
    host: '127.0.0.1:9000/myapp',
    port: 443,
    debug: 3
})

localPeer.on('open', function(id) {
    console.log('My peer ID is: ' + id);
});

// function gotMedia (stream) {
//     let peer1 = new Peer({ initiator: true, stream: stream })
//     let peer2 = new Peer({ stream: stream })
//
//     peer1.on('signal', data => {
//         peer2.signal(data)
//     })
//
//     peer2.on('signal', data => {
//         peer1.signal(data)
//     })
//
//     peer2.on('stream', stream => {
//         // got remote video stream, now let's show it in a video tag
//         let remoteVideo = document.querySelector('.remote-user')
//
//         if ('srcObject' in video) {
//             remoteVideo.srcObject = stream
//         } else {
//             remoteVideo.src = window.URL.createObjectURL(stream) // for older browsers
//         }
//
//         remoteVideo.play()
//     })
//
//     peer1.on('stream', stream => {
//         // got remote video stream, now let's show it in a video tag
//         let remoteVideo = document.querySelector('.user')
//
//         if ('srcObject' in video) {
//             remoteVideo.srcObject = stream
//         } else {
//             remoteVideo.src = window.URL.createObjectURL(stream) // for older browsers
//         }
//
//         remoteVideo.play()
//     })
// }