"""
CONSOLE-CARRIER:

Airline resource management game. Utilizes a dataset of real life airports. UI done in terminal using curses module.

FIX:
    - Carrier not saved to db properly
    - Need ti handle a situation where carrier .pickle file is empty and db not
    - Currently support for only one plane
    - App.run wont work

To Implement:
    - Buying fuel (Maybe utilize API for fuel cost when connected to internet for funz)
    - Bank loan
    
    
Made by:
Antto Salo
Veeti Sundqvist
"""

import math
import random
import time
from db_handler import Db_handler
import os
from gui_proto import gui_handler
from carrier_handler import Carrier
from airplane import Airplane
import pickle

import atexit
db_handler = Db_handler()

ui = gui_handler()


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
        """Creates dummy data for testing, not to be used in production, only a testing environment. Don't try to understand it."""
        ui.curses_off()
      
        created = db_handler.carrier_is_created()
        if created:
            carrier = self.load_carrier()
        else:
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
            
    def load_carrier(self):
        """Loads carrier from file using pickles."""
        with open('carrier_save.pickle', 'rb') as f:
            carrier = pickle.load(f)
        return carrier


app = App()
#app.run()
db_handler.add_airport("EFHK")
app.run_test()
db_handler.exit()

