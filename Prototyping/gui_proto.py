import curses
from curses import wrapper

class gui_handler():
    
    # A function which creates a base for a GUI-menu, with attributes for the button names, etc

    def updateMainHUD(column1_Title, column2_Title, column1_elements, column2_elements):
        
        # Initializes curses-module
        stdscr = curses.initscr()
        # App doesn't display user's input on the terminal line (for the static GUI to work)
        curses.noecho()
        # User doesn't need to hit enter to input characters when cbreak function is called
        curses.cbreak()
        # Enables curses to understand key press as a text command
        stdscr.keypad(True)
        
        # Clearing screen
        stdscr.clear()

        # All actual function below this
        

        print()

    # Terminating curses app
    #curses.nocbreak()
    #stdscr.keypad(False)
    #curses.endwin()

