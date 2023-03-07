import math
import random
import time
from db_handler import Db_handler
import os
from Prototyping.curse_gui import UI
from carrier_handler import Carrier
from airplane import Airplane
import curses

db_handler = Db_handler()

ui : UI = curses.wrapper(UI)

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
            self.gamestate = "new_airports"
            
        if self.gamestate == "new_airports":
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
        airport = db_handler.add_airport("EFHK")
        plane = Airplane(carrier.id,"C172",airport)
        plane2 = Airplane(carrier.id,"C172",airport)
        planes = [plane, plane2]
        ui.display_planes(planes)
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

