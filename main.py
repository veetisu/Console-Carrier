import math
import random
import time
from db_handler import Db_handler
import os
db_handler = Db_handler()


class App():
    def __init__(self):
        self.running = True
    def get_random_line(self,scenario):
        return random.choice(self.lines[scenario])
        
    def run(self):
            while self.running:
                pass
            

app = App()
app.run()
