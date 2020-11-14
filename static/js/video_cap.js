export {startVideoCapture, stopVideoCapture}
import {multiLog, socket} from "./redast.js";
//import Pica from './lib/pica.min.js';

//const pica = Pica();
var snap;
let front = false;
let flip = $('button#flipCamera').on('click', () => {
    front = !front;
    flip.text(front ? "Toggle Rear camera" : "Toggle Front camera");
    stopVideoCapture();
    startVideoCapture();
});

let video = document.querySelector('video#videoElement');
const STREAM_SPEED = 50;
const IDEAL_FPS = 15;
const MAX_FPS = 20;

//TODO: handle portrait / landscape
let constraints = {
    audio: false,
    video: {
        frameRate: {ideal: IDEAL_FPS, max: MAX_FPS},
        facingMode: (front ? "user" : "environment"),
        width: {min: 640},
        height: {min: 480}
    }
};

function startVideoCapture() {
    console.log("Start")
    try {
        getCameraAccess(constraints);
    } catch (e) {
        multiLog("[ERROR]", "Could not get camera access");
    }
}

function stopVideoCapture() {
    console.log("Stop");
    window.stream.getTracks().forEach(track => track.stop());
    video.srcObject = null;
    if (snap) {
        clearInterval(snap);
    }
}

function getCameraAccess(constraints) {
    if (navigator.mediaDevices === undefined) {
        multiLog("[DEBUG]", "Undefined mediaDevices");
        navigator.mediaDevices = {};
    }

    // Some browsers partially implement mediaDevices.
    // We can't just assign an object with getUserMedia as it would overwrite existing properties.
    // Here, we will just add the getUserMedia property if it's missing.
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {

            multiLog("[DEBUG]", "Legacy part triggered");

            // First get ahold of the legacy getUserMedia, if present
            let getUserMedia = (navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia)

            // Some browsers just don't implement it - return a rejected promise with an error
            // to keep a consistent interface
            if (!getUserMedia) {
                multiLog("[ERROR]", "getUserMedia() is not implemented at ALL in this browser ...");
                return Promise.reject(new Error('[HERE] getUserMedia() is not implemented at ALL in this browser ...'));
            }

            // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
            return new Promise(function (resolve, reject) {
                multiLog("[INFO]", "Calling getUserMedia promise");
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
    }

    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch((e) => {
        multiLog("[ERROR]", "Error accessing media : " + e);
    });
}

function handleSuccess(stream) {

    // Older browsers may not have srcObject
    if ("srcObject" in video) {
        video.srcObject = stream;
    } else {
        multiLog("[DEBUG]", "window.URL.createObjectURL called");
        // Avoid using this in new browsers, as it is going away.
        video.src = window.URL.createObjectURL(stream);
    }

    video.onloadedmetadata = function (e) {
        video.play();
        //video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    };
    window.stream = stream;

    snap = setInterval(function () {
        sendSnapshot();
    }, STREAM_SPEED);
}

function sendSnapshot() {

    if (!window.stream) {
        multiLog("[ERROR]", "localStream problem");
        return;
    }

    let canvas = document.querySelector("canvas#canvasElement");
    let ctx = canvas.getContext('2d');
    //TODO: improve the with video compression ? jsmpg ? (https://weheart.digital/build-simple-live-streaming-solution/ )
    ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight, 0, 0, 300, 150);

    let dataURL = canvas.toDataURL('image/jpeg');
    socket.emit('video', dataURL.split(",")[1]);
}

function sendSnapshot2() {

    if (!window.stream) {
        multiLog("[ERROR]", "localStream problem");
        return;
    }

    const track = window.stream.getVideoTracks()[0];
    let imageCapture = new ImageCapture(track);

    imageCapture.grabFrame()
        .then(imageBitmap => {
            let dataURL = imageBitmap.toDataURL('image/jpeg');
            socket.emit('video', dataURL.split(",")[1]);
        })
        .catch(error => console.log(error));
}

function sendSnapshot3() {

    if (!window.stream) {
        multiLog("[ERROR]", "localStream problem");
        return;
    }

    let canvas = document.querySelector("canvas#canvasElement");
    let ctx = canvas.getContext('2d');
    /**
     pica.resize(window.stream, ctx)
     .then(result => pica.toBlob(result, 'image/jpeg', 0.60))
     .then(blob => {
            multiLog(blob);
            //socket.emit('video', blob);
        });

     //let dataURL = canvas.toDataURL('image/jpeg');
     */
}