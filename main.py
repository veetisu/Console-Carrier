import math
import random
import time
from db_handler import Db_handler
import os
from gui_handler import UI

db_handler = Db_handler()
ui = UI()
class App():
    def __init__(self):
        self.running = True
        self.gamestate = "Initializing"
    def get_random_line(self,scenario):
        return random.choice(self.lines[scenario])
        
    def run(self):
        if not self.running:
            return
        if self.gamestate == "Initializing":
            ui.initial_setup()
        #Gamestates
            #initializing
            #waiting?
            #choose/menu
            #Game over
            

app = App()
app.run()
