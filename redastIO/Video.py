import threading
import binascii
from time import sleep
from PIL import Image
from io import BytesIO
import base64
from matplotlib import pyplot


class CameraHandler(object):

    def __init__(self):
        self.to_process = []
        self.to_output = []

        thread = threading.Thread(target=self.keep_processing, args=())
        thread.daemon = True
        thread.start()

    def __new__(cls):
        if not hasattr(cls, 'instance') or not cls.instance:
            cls.instance = super().__new__(cls)

        return cls.instance

    def process_one(self):
        if not self.to_process:
            return

        # input is an ascii string. 
        input_str = self.to_process.pop(0)

        # convert it to a pil image
        input_img = self.base64_to_pil_image(input_str)

        output_img = input_img.transpose(Image.FLIP_LEFT_RIGHT)
        #self.display_img(input_img)

        # output_str is a base64 string in ascii
        output_str = self.pil_image_to_base64(output_img)

        # convert eh base64 string in ascii to base64 string in _bytes_
        self.to_output.append(binascii.a2b_base64(output_str))

    def keep_processing(self):
        while True:
            self.process_one()
            sleep(0.01)

    def enqueue_input(self, input):
        self.to_process.append(input)

    def get_frame(self):
        while not self.to_output:
            sleep(0.05)
        return self.to_output.pop(0)

    @staticmethod
    def pil_image_to_base64(pil_image):
        buf = BytesIO()
        pil_image.save(buf, format="JPEG")
        return base64.b64encode(buf.getvalue())

    @staticmethod
    def base64_to_pil_image(base64_img):
        return Image.open(BytesIO(base64.b64decode(base64_img)))

    @staticmethod
    def display_img(frame):
        pyplot.imshow(frame)
