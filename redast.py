from flask import Flask
from flask_sslify import SSLify
from flask_socketio import SocketIO
import Routes
import redastIO.RedastIO as RedastIO
import redastIO.VideoIO as VideoIO
import redastIO.IMUIO as IMUIO
import socket as sock
import logging
#import eventlet
#from modules.NodeNav import NodeNav


def create_app():

    print("[MAIN] Initiating web app")

    app = Flask(__name__)
    #sslify = SSLify(app)

    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)

    # TODO: Re-implement Logging class ?
    # logging.basicConfig(filename='app.log', level=logging.DEBUG, filemode='w', format='%(asctime)s - %(message)s', datefmt='%d-%b-%y %H:%M:%S')
    # logger = logging.getLogger('web')

    # TODO: move to app.config file ?
    app.config['PORT'] = 5000
    app.config['SECRET_KEY'] = 'secret!'
    app.config['DEBUG'] = False

    # Init Routes
    # TODO: make blueprints !!!
    Routes.init(app)

    return app


def init_io(my_app):
    print("[MAIN] Initializing io")

    fsio = SocketIO(my_app)
    """ TODO:
        input = Input()
        input.attach(CameraHandler(), IMUHandler())

        Hand input to Processing
    """
    RedastIO.init(fsio)
    VideoIO.init(fsio)
    IMUIO.init(fsio)

    return fsio


# TODO: maybe create the nodeNav and return it, and then .run() it ?
def init_modules():

    print("[MAIN] Initializing modules")

    # Init modules (processing)
    # vio = VIO(videoIO, imuIO)
    # NodeNav.start(videoIO, vio)
    # NodeNav.start()


if __name__ == "__main__":
    redast = create_app()
    sio = init_io(redast)
    init_modules()
    print("[INFO] IP : ", sock.gethostbyname(sock.gethostname()))
    sio.run(redast, host="0.0.0.0", certfile='cert.pem', keyfile='key.pem', use_reloader=False)
    #sio.run(redast, host="0.0.0.0", ssl_context=('cert.pem', 'key.pem'), use_reloader=False)

