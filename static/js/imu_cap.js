export {startIMUCapture, stopIMUCapture}
import {multiLog, socket} from "./redast.js";

let ROT_THRESHOLD = 5;
let ACCEL_THRESHOLD = 1;

function startIMUCapture() {
    if (window.DeviceOrientationEvent) {
        window.ondeviceorientation = deviceOrientationHandler;
        //window.addEventListener('deviceorientation', deviceOrientationHandler);
    }
    if (window.DeviceMotionEvent) {
        // Doesn't work on some devices like Chrome on Windows
        //window.addEventListener('devicemotion', deviceMotionHandler);
        // Seems more widely compatible
        window.ondevicemotion = deviceMotionHandler;
    }
    console.log("IMU Capture started");
}

function stopIMUCapture() {
    //window.removeEventListener("deviceorientation", deviceOrientationHandler);
    window.ondeviceorientation = null;
    //window.removeEventListener("devicemotion", deviceMotionHandler);
    window.ondevicemotion = null;
    console.log("IMU Capture stopped");
}

function deviceOrientationHandler(doEvent) {
    let imu_do = {};
    imu_do['do'] = {};

    imu_do['time'] = doEvent.timeStamp;

    ['alpha', 'beta', 'gamma', 'absolute'].forEach(function (prop) {
        imu_do['do'][prop] = doEvent[prop];
    });

    socket.emit('imu_do', imu_do);
}

function deviceMotionHandler(dmEvent) {
    let imu_dm = {};
    imu_dm['time'] = dmEvent.timeStamp;
    imu_dm['rot'] = {};
    imu_dm['accel'] = {};
    imu_dm['g_accel'] = {};

    ['alpha', 'beta', 'gamma'].forEach(function (prop) {
        imu_dm['rot'][prop] = Math.abs(dmEvent.rotationRate[prop]) > ROT_THRESHOLD ? dmEvent.rotationRate[prop] : 0;
    });
    ['x', 'y', 'z'].forEach(function (prop) {
        imu_dm['accel'][prop] = Math.abs(dmEvent.acceleration[prop]) > ACCEL_THRESHOLD ? dmEvent.acceleration[prop] : 0;
        imu_dm['g_accel'][prop] = Math.abs(dmEvent.accelerationIncludingGravity[prop]) > ACCEL_THRESHOLD ? dmEvent.accelerationIncludingGravity[prop] : 0;
    });

    socket.emit('imu_dm', imu_dm);
}
