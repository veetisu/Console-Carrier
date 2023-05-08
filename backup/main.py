"""
CONSOLE-CARRIER:

Airline resource management game. Utilizes a dataset of real life airports. UI done in terminal using curses module.

FIX:
    - Carrier not saved to db properly
    - Need to handle a situation where carrier .pickle file is empty and db not
    - Currently support for only one plane
    - App.run wont work

To Implement:
    - Buying fuel (Maybe utilize API for fuel cost when connected to internet for funz)
    - Bank loan
    - Pickle saving for other objects than carrier(In a new folder)
    - plane.crash()
    
    
Made by:
Antto Salo
Veeti Sundqvist
"""


from db_handler import Db_handler
from carrier_handler import Carrier
from gui_handler import UI
from airplane import Airplane
import pickle
import atexit

db_handler = Db_handler()

ui = UI()

ENVIRONMENT = "development"
class App():
    def __init__(self):
        self.running = True
        self.gamestate = "Not set yet"
        if ENVIRONMENT != "development":
            ui.splash_screen()
        
    def run(self):

        self.carrier = self.load_carrier()
        if not self.carrier:
            self.gamestate = "setup"
        else:
            self.gamestate = "flight_menu" 
            atexit.register(self.carrier.save)            
            
        while self.running:    
            if self.gamestate == "setup":
                self.carrier = ui.initial_setup()
                atexit.register(self.carrier.save) 
                self.carrier.new_plane("C172")
                self.gamestate = "flight_menu"
                
            if self.gamestate == "main_menu":
            #WORKS WITH ONLY ONE PLANE
                ui.main_menu(self.carrier)
            if self.gamestate == "flight_menu":
                self.selected_airplane = self.carrier.airplanes[0]
                self.selected_route = ui.setup_screen(self.carrier, self.selected_airplane, self)
                
            if self.gamestate == "menu":
                pass
            if self.gamestate == "waiting":
                ui.waiting(self.selected_route, self.selected_airplane, self.carrier, self)
            #Gamestates
                #initializing
                #waiting?
                #choose/menu 
                #Game over

    def load_carrier(self):
        """Loads carrier from file using pickles. Returns carrier object if found and False otherwise. """
        try:
            with open('save/carrier_save.pickle', 'rb') as f:
                carrier = pickle.load(f)
            return carrier
        except Exception:
            return False

app = App()
#app.run()
db_handler.add_airport("EFHK")
app.run()
db_handler.exit()
