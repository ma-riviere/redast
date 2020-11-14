export {displayDOData, displayDMData}
import {makeTruncater} from "./redast.js";

var dec2 = makeTruncater(2);

function displayDOData(data) {
    $('#do_alpha').val("Yaw: " + dec2(data.do.alpha));
    $('#do_beta').val("Pitch: " + dec2(data.do.beta));
    $('#do_gamma').val("Roll: " + dec2(data.do.gamma));
    $('#do_abs').val("Abs ?: " + data.do.absolute);
}

function displayDMData(data) {
    $('#dm_alpha').val("R-Yaw: " + dec2(data.rot.alpha));
    $('#dm_beta').val("R-Pitch: " + dec2(data.rot.beta));
    $('#dm_gamma').val("R-Roll: " + dec2(data.rot.gamma));

    $('#dm_x').val("X: " + dec2(data.accel.x));
    $('#dm_y').val("Y: " + dec2(data.accel.y));
    $('#dm_z').val("Z: " + dec2(data.accel.z));

    $('#dm_gx').val("GX: " + dec2(data.g_accel.x));
    $('#dm_gy').val("GY: " + dec2(data.g_accel.y));
    $('#dm_gz').val("GZ: " + dec2(data.g_accel.z));
}