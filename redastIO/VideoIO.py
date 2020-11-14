from flask_socketio import emit


def init(sio):
    print("[MAIN][IO] VideoIO init")

    @sio.on('video')
    @sio.on('video', namespace='/redast')
    def on_video(frame):
        #TODO: Do something to the video
        #TODO: get server id and send to him
        emit('vOut', frame, namespace='/redast', broadcast=True)
