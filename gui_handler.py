import time
import os
from db_handler import Db_handler

db_handler = Db_handler()
class UI:
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
    db_handler.get_starting_airports()
    carrier = Carrier(name_input)
    #Lines for printing messages to player
    self.lines = {
        
    }
    def get_random_line(self,scenario):
        return random.choice(self.lines[scenario])