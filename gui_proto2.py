import curses
from curses import wrapper
import atexit

sr = curses.initscr() 

class Gui_handler():

    def __init__(self):
    # Initializes curses-module
        self.stdscr = curses.initscr()   
        atexit.register(self.curses_off)
        self.screens = Screens()

    # A function which creates a base for a GUI-menu, with attributes for the button names, etc

    def updateMainHUD(self):
        
        # App doesn't display user's input on the terminal line (for the static GUI to work)
        curses.noecho()
        # User doesn't need to hit enter to input characters when cbreak function is called
        curses.cbreak()
        # Enables curses to understand key press as a text command
        self.stdscr.keypad(True)
        
        # Clearing screen
        self.stdscr.clear()

        # All actual function below this
        
        self.current_screen = "Main"
        if self.current_screen == "Main":
            self.screens.main_window(self.stdscr)
    # Terminating curses app

    def curses_off(self):
        curses.nocbreak()
        self.stdscr.keypad(False)
        curses.endwin()

class Screens():
    def main_window(stdscr):
        stdscr.addstr()
        
    # Splash screen
    def start_screen():
        print("Start")

    # Where the game asks for the airport
    def initial_setup():
        print("Setup")
    
app = Gui_handler()
app.updateMainHUD()