import math
import random
import time
from db_handler import Db_handler
import os
from gui_handler import UI
from carrier_handler import Carrier

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
            carrier = ui.initial_setup()
            carrier.new_plane("C172")
        if self.gamestate == "menu":
            pass
        #Gamestates
            #initializing
            #waiting?
            #choose/menu
            #Game over
            

app = App()
app.run()
