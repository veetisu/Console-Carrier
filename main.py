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
from carrier_handler import Carrier
from airplane import Airplane
import pickle
import atexit
import curses
import sys
db_handler = Db_handler()

ui = ""


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
      
        created = db_handler.carrier_is_created()
        if created:
            carrier = self.load_carrier()
        else:
            carrier = Carrier("DummyCarrier","EFHK")
        
        atexit.register(carrier.save) 
          
        airport = db_handler.add_airport("EFHK")
        plane = Airplane(carrier.id,"C172",airport,"Hilavitkutin")
        plane2 = Airplane(carrier.id,"C172",airport,"Lentohärpätin")
        plane3 = Airplane(carrier.id,"C172",airport)

        planes = [plane,plane2,plane3]
        self.main_screen(planes)
        while False:
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
    
    
    def curses_off(self):
        """Terminates curses and resets terminal to its normal state."""

        curses.nocbreak()
        self.stdscr.keypad(False)
        curses.endwin()
        
    def main_screen_human(self,planes):
        # Clearing screen
        stdscr = curses.initscr()
        stdscr.keypad(True)
        rows, cols = stdscr.getmaxyx()
        stdscr.clear()
        # App doesn't display user's input on the terminal line (for the static GUI to work)
        curses.noecho()
        # User doesn't need to hit enter to input characters when cbreak function is called
        curses.cbreak()
        stdscr.refresh()
        
        selected_win = 0
        windows = []
        for i, plane in enumerate(planes):
            win = curses.newwin(6,cols-20,0+6*i,0)
            win.addstr(f"{plane.name}: Cessna 172, sattioned at {plane.airport.name}")
            win.refresh()
            win.attron(curses.A_REVERSE)
            windows.append(win)
        while True:
            input = stdscr.getch()
            if input == curses.KEY_DOWN:
                selected_win += 1         
                sys.exit(1)
            windows[selected_win].attron(curses.A_REVERSE)
            windows[selected_win].refresh()
            
    def main_screen(self, planes):
            # Clearing screen
            stdscr = curses.initscr()
            stdscr.keypad(True)
            rows, cols = stdscr.getmaxyx()
            stdscr.clear()
            # App doesn't display user's input on the terminal line (for the static GUI to work)
            curses.noecho()
            # User doesn't need to hit enter to input characters when cbreak function is called
            curses.cbreak()
            stdscr.refresh()

            selected_win = 1
            windows = []
            for i, plane in enumerate(planes):
                win = curses.newwin(6, cols - 20, 0 + 6 * i, 0)
                win.addstr(f"{plane.name}: {plane.type}, stationed at {plane.airport.name}")
                windows.append(win)


            while True:
                input_char = stdscr.getch()
                if input_char == ord('w') and selected_win > 0:
                    selected_win -= 1
                elif input_char == ord('s') and selected_win < len(windows) - 1:
                    selected_win += 1
                elif input_char == ord('q'):
                    return
                time.sleep(1)
                windows[1].attron(curses.A_REVERSE)
                windows[1].refresh()
                for i, win in enumerate(windows):
                    if i == selected_win:
                        win.attron(curses.A_REVERSE)
                    else:
                        win.attroff(curses.A_REVERSE)
                    win.refresh()


            curses.nocbreak()
            stdscr.keypad(False)
            curses.echo()
            curses.endwin()



app = App()
#app.run()
db_handler.add_airport("EFHK")
app.run_test()
db_handler.exit()

