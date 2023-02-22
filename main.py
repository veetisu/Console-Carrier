import math
import random
import time
from db_handler import Db_handler
import os
from gui_handler import UI
from carrier_handler import Carrier
from airplane import Airplane

import atexit
db_handler = Db_handler()

ui = UI()

class App():
    def __init__(self):
        self.running = True
        self.gamestate = "Initializing"
        
    def run(self):
        if not self.running:
            return
        if self.gamestate == "Initializing":
            carrier = ui.initial_setup()
            carrier.new_plane("C172")
            self.gamestate = "main_menu"
            
        if self.gamestate == "main_menu":
        #WORKS WITH ONLY ONE PLANE
            selected_airplane = carrier.airplanes[0]
            new_airports = db_handler.get_next_routes(selected_airplane)
            print(new_airports)
        if self.gamestate == "menu":
            pass
        #Gamestates
            #initializing
            #waiting?
            #choose/menu
            #Game over
    def run_test(self):
        # Creates dummy data for testing, not to be used in production, only a testing environment
        carrier = Carrier("DummyCarrier","EFHK")
        atexit.register(carrier.save)   
        airport = db_handler.add_airport("EFHK")
        plane = Airplane(carrier.id,"C172",airport)
        while True:
            routes = db_handler.get_next_routes(plane)

            print(routes[1])
            print(f"Carrier balance: {carrier.money:.0f} €")
            print(f"Carrier fuel: {carrier.fuel:.0f} l")
            input("Press enter to fly \n")
            print(routes[1].fly(plane,carrier))


app = App()
#app.run()
db_handler.add_airport("EFHK")
app.run_test()
db_handler.exit()

