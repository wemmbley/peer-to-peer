'use strict';

let Peer = require('simple-peer')

let sendError = (message) => {
    let error = document.querySelector('.error');

    error.innerHTML = message;
};

// get video/voice stream
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
})
    .then(gotMedia)
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

function gotMedia (stream) {
    let peer1 = new Peer({ initiator: true, stream: stream })
    let peer2 = new Peer()

    peer1.on('signal', data => {
        peer2.signal(data)
    })

    peer2.on('signal', data => {
        peer1.signal(data)
    })

    peer2.on('stream', stream => {
        // got remote video stream, now let's show it in a video tag
        let video = document.querySelector('.user');
        let remoteVideo = document.querySelector('.remote-user')

        if ('srcObject' in video) {
            remoteVideo.srcObject = stream
        } else {
            remoteVideo.src = window.URL.createObjectURL(stream) // for older browsers
        }

        video.src = window.stream;
        remoteVideo.play()
    })
}