from flask import request


def init(sio):
    print("[MAIN][IO] RedastIO init")

    clients = []

    @sio.on('connect')
    def on_connect():
        print("[MAIN][IO] Client {} connected".format(request.sid))
        sio.emit("connected")
        if request.sid in clients:
            sio.disconnect(request.sid)
            clients.remove(request.sid)
        clients.append(request.sid)

    @sio.on('disconnect')
    def on_disconnect():
        print("[MAIN][IO] Client {} disconnected".format(request.sid))
        clients.remove(request.sid)
        # update_clients()

    @sio.on('log')
    @sio.on('log', namespace="/iloc")
    @sio.on('log', namespace="/redast")
    def handle_log(message):
        print("[LOG]", message)

    def send_message(client_id, data):
        sio.emit('output', data, room=client_id)
        print('[MAIN][IO] Sending direct message "{}" to client "{}".'.format(data, client_id))

    @sio.on_error()  # Handles the default namespace
    def error_handler(e):
        print("Error in / : " + e)

    @sio.on_error('/redast')
    def error_handler_chat(e):
        print("Error in /redast : " + e)

    @sio.on_error_default  # handles all namespaces without an explicit error handler
    def default_error_handler(e):
        print("Error in any namespace : " + e)
