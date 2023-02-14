import time
import os
import random
from db_handler import Db_handler
from carrier_handler import Carrier
db_handler = Db_handler()

class UI:
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
        
        carrier = Carrier(name_input)
        
        #FIX!!
        
        #Lines for printing messages to player
        self.lines = {
            
        }
        return carrier
        
    def get_random_line(self,scenario):
        return random.choice(self.lines[scenario])