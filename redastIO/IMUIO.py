from redastIO.IMU import IMUHandler
from flask_socketio import emit

"""
    Alpha = Yaw
    Beta = Pitch
    Gamma = Roll
    
    Latest code: 
    https://developers.google.com/web/updates/2017/09/sensors-for-the-web
    In more details: https://www.w3.org/TR/orientation-sensor/#absoluteorientationsensor
    > Good code examples to try : https://github.com/intel/generic-sensor-demos
"""


def init(sio):
    #imu_handler = IMUHandler()

    print("[MAIN][IO] IMU IO initialization")

    @sio.on('imu_do', namespace="/redast")
    def imu_do_data(do):
        #print("[DEBUG] Received DO")
        emit('imu_do_received', do, broadcast=True)

    @sio.on('imu_dm', namespace="/redast")
    def imu_dm_data(dm):
        #print("[DEBUG] Received DM")
        emit('imu_dm_received', dm, broadcast=True)
