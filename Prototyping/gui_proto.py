import curses
from curses import wrapper

class gui_handler():

    # Initializes curses-module
    stdscr = curses.initscr()

    # A function which creates a base for a GUI-menu, with attributes for the button names, etc

    def updateMainHUD(self, column1_Title, column2_Title, column1_elements, column2_elements):
        
        # App doesn't display user's input on the terminal line (for the static GUI to work)
        curses.noecho()
        # User doesn't need to hit enter to input characters when cbreak function is called
        curses.cbreak()
        # Enables curses to understand key press as a text command
        self.stdscr.keypad(True)
        
        # Clearing screen
        self.stdscr.clear()

        # All actual function below this
        

        print()

    # Terminating curses app
    #curses.nocbreak()
    #stdscr.keypad(False)
    #curses.endwin()

class screens():

    def start_screen():
        print("Start")

    def initial_setup():
        print("Setup")
