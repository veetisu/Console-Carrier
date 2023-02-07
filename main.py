import math
from db_handler import DBHandler

class Carrier():
    def __init__(self, name):
        #Creates a new Carrier for the player
        self.name = name
    

class Airplane():
    pass

class App():
    def __init__(self):
        self.running = True
        while self.running:
            #Initializing the game 
            carrier = Carrier()

app = App()
