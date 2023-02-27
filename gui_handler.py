import time
import os
import random
import curses
from curses import wrapper
from db_handler import Db_handler
from carrier_handler import Carrier
db_handler = Db_handler()

class UI:

    stdscr = curses.initscr()

    def __init__(self):
        pass
    def initial_setup(self):
        print("Welcome to Console Carrier!")
        time.sleep(1)
        input("Are you ready to start your journey as a airline manager? (Press Enter to start)")
        time.sleep(1)
        os.system("cls")
        name_input = input("Enter a name for your airline: ")
        print("Next choose the first plane for your carrier: ")
        print("1. Cessna 172")
        print("2. Citation CJ-4")
        print("3. TBM 930")
        airplane_type = int(input("Choose one of the planes (1/2/3): "))
        print("Choose the starting airport for your carrier: ")
        
        #This variable is not supposed to be harcoded!! Need logic for user input
        starting_airport = "EFHK"
        
        carrier = Carrier(name_input,starting_airport)
        carrier.new_plane("C172")
        #FIX!!
        
        #Lines for printing messages to player
        self.lines = {
            
        }
        return carrier
        
    def get_random_line(self,scenario):
        return random.choice(self.lines[scenario])
    
class Screens():
    """A class for the different screen/window types of the program."""

    # Splash screen
    def splash_screen(self):
        """Splash screen stuff"""

        # Clearing screen
        UI.stdscr.clear()
        # App doesn't display user's input on the terminal line (for the static GUI to work)
        curses.noecho()
        # User doesn't need to hit enter to input characters when cbreak function is called
        curses.cbreak()

        whole_name = []

        for i in "Console Carrier":
            whole_name.append(i)
            printable_name = "".join(whole_name)

            UI.stdscr.addstr(
                int(os.get_terminal_size().lines/2), 
                int(os.get_terminal_size().columns/2-len(whole_name)/2), 
                str(printable_name),
                curses.A_REVERSE)

            UI.stdscr.refresh()
            time.sleep(0.1)
        time.sleep(3)

    # Where the game asks for the airport
    def setup_screen(screen_title, col_1_attributename, col_2_value, textbox_content):
        print("Setup")
    
    # The game's main window where your carriers planes are shown
    def main_screen():
        print("Main")