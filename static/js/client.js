import {multiLog, socket} from "./redast.js";
import * as cap from "./video_cap.js";
import * as imu from "./imu_cap.js";
import {displayDOData, displayDMData} from "./imu_display.js";

let BTN_CLASS_OFF = "btn-secondary";
let BTN_CLASS_ERROR = "btn-danger";
let BTN_CLASS_ON = "btn-success";

let videoActive = false;
let imuActive = false;

/******************* socket events ********************/
socket.on("disconnect", () => {
    multiLog("[DEBUG]", "Client disconnected, capture stopped");

    if (videoActive) {
        stopVideo();
    }
    if (imuActive) {
        stopIMU();
    }
});

socket.on("imu_do_received", (data) => {
    displayDOData(data);
});

socket.on("imu_dm_received", (data) => {
    displayDMData(data);
});

/************************** VIDEO toggle **************************/

$('button#videoToggleButton').on('click', toggleVideoStream);

function stopVideo() {
    multiLog("[DEBUG]", "Video stream stopping");
    cap.stopVideoCapture();
    $('button#videoToggleButton').toggleClass(BTN_CLASS_OFF).toggleClass(BTN_CLASS_ON);
    videoActive = false;
}

function startVideo() {
    try {
        multiLog("[DEBUG]", "Video stream starting");
        cap.startVideoCapture();
        $('button#videoToggleButton').toggleClass(BTN_CLASS_OFF).toggleClass(BTN_CLASS_ON);
        videoActive = true;
    } catch (e) {
        multiLog("[DEBUG]", "Failed starting Video stream with error : " + e);
    }
}

function toggleVideoStream() {
    if (videoActive) {
        stopVideo()
    }
    else {
        startVideo()
    }
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
    imu.stopIMUCapture();
    $('button#imuToggleButton').toggleClass(BTN_CLASS_OFF).toggleClass(BTN_CLASS_ON);
    imuActive = false;
}

function startIMU() {
    try {
        multiLog("[DEBUG]", "IMU stream starting");
        imu.startIMUCapture();
        $('button#imuToggleButton').toggleClass(BTN_CLASS_OFF).toggleClass(BTN_CLASS_ON);
        imuActive = true;
    } catch (e) {
        multiLog("[DEBUG]", "Failed starting IMU stream with error : " + e);
    }
}