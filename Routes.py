from flask import render_template


def init(app):

    print("[MAIN] Initializing routes")

    @app.route('/')
    def index():
        return render_template("index.html", title="Redast Main Page")

    @app.route('/client')
    def client():
        return render_template("client.html", title="Redast Client Interface")

    @app.route('/server')
    def server():
        return render_template("server.html", title="Redast Server Interface")

    @app.route('/readme')
    def readme():
        return render_template("readme.html", title="Redast Tutorial")

    """ TEST pages """

    ''' Legacy code
    
    def gen():
        """Video streaming generator function."""
        while True:
            frame = camera.get_frame()  # pil_image_to_base64(camera.get_frame())
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

    @app.route('/video_feed')
    def video_feed():
        """Video streaming route. Put this in the src attribute of an img tag."""
        return Response(gen(), mimetype='multipart/x-mixed-replace; boundary=frame')
    '''
