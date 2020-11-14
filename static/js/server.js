import {multiLog, socket} from "./redast.js";
import {displayDOData, displayDMData} from "./imu_display.js";

let BTN_CLASS_OFF = "btn-secondary";
let BTN_CLASS_ERROR = "btn-danger";
let BTN_CLASS_ON = "btn-success";

let videoActive = false;
let imuActive = false;

let img = document.getElementById("img-stream");

/******************* socket events ********************/
socket.on("connect", () => {
    console.log("CONNECTED TO SERVER")
    //socket.emit("server")
    //TODO: do stuff on connect
});

socket.on("disconnect", () => {

    if (videoActive) {
        console.log("[DEBUG] Client disconnected, stopping video display");
        stopVideo();
    }
    if (imuActive) {
        console.log("[DEBUG] Client disconnected, stopping IMU display");
        stopIMU();
    }
});

socket.on("imu_do_received", (data) => {
    console.log("(SERVER) DO data received");
    displayDOData(data);
});

socket.on("imu_dm_received", (data) => {
    console.log("(SERVER) DM data received");
    displayDMData(data);
});

socket.on('vOut', (data) => {
    //console.log("Receiving vOut data");
    if (videoActive) {
        console.log("Processing vOut data");
        //TODO: native b64 to blob conversion ?
        let blob = b64toBlob(data, "image/jpeg");
        img.setAttribute('src', URL.createObjectURL(blob));
    }
});

/************************** VIDEO toggle **************************/

$('button#videoToggleButton').on('click', toggleVideoDisplay);

function toggleVideoDisplay() {
    if (videoActive) {
        stopVideo()
    }
    else {
        startVideo()
    }
}

function startVideo() {
    try {
        multiLog("[DEBUG]", "Video display starting");
        $('button#videoToggleButton').toggleClass(BTN_CLASS_OFF).toggleClass(BTN_CLASS_ON);
        videoActive = true;
    } catch (e) {
        multiLog("[DEBUG]", "Failed starting Video display with error : " + e);
    }
}

function stopVideo() {
    multiLog("[DEBUG]", "Video display stopping");
    videoActive = false;
    $('img#img-stream').src = "#";
    $('button#videoToggleButton').toggleClass(BTN_CLASS_OFF).toggleClass(BTN_CLASS_ON);
}

/****************************** IMU ***************************/

$('button#imuToggleButton').on('click', toggleImu);

function toggleImu() {
    if (imuActive) {
        stopIMU()
    }
    else {
        startIMU()
    }
}

function stopIMU() {
    multiLog("[DEBUG]", "IMU stream stopping");
    $('button#imuToggleButton').toggleClass(BTN_CLASS_OFF).toggleClass(BTN_CLASS_ON);
    imuActive = false;
}

function startIMU() {
    try {
        multiLog("[DEBUG]", "IMU stream starting");
        $('button#imuToggleButton').toggleClass(BTN_CLASS_OFF).toggleClass(BTN_CLASS_ON);
        imuActive = true;
    } catch (e) {
        multiLog("[DEBUG]", "Failed starting IMU stream with error : " + e);
    }
}


function b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}