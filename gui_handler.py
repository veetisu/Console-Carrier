import time
import os
import random
from db_handler import Db_handler
from carrier_handler import Carrier
db_handler = Db_handler()

class UI:

    def __init__(self):
        pass
    def get_random_line(self,scenario):
        return random.choice(self.lines[scenario])
    
    # Screens
    def initial_setup(self):
        os.system("cls")
        print("Welcome to Console Carrier!")
        time.sleep(1)
        input("Are you ready to start your journey as a airline manager? (Press Enter to start)")
        time.sleep(1)
        name_input = input("Enter a name for your airline: ")
        time.sleep(1)
        print("\nNext choose the first plane for your carrier: ")
        print("1. Cessna 172")
        print("2. Citation CJ-4")
        print("3. TBM 930")
        time.sleep(1)
        airplane_type = int(input("Choose one of the planes (1/2/3): "))
        airports = db_handler.get_starting_airports()
        for index, airport in enumerate(airports):
            print(f"{index+1}. {airport[0]}, {airport[1]}")
        airport_input = int(input("\nChoose the starting airport for your carrier(1/2/3...): "))
        starting_airport = airports[airport_input-1][2]       
        carrier = Carrier(name_input,starting_airport)
        if airplane_type == 1:
            carrier.new_plane("C172")
        #FIX!!
        
        #Lines for printing messages to player
        self.lines = {
            
        }
        return carrier
    def main_menu(self, carrier_name, plane, cash, text_box):
        print(f"{carrier_name}                  {cash}\n{plane}")
        
    def setup_screen(self, carrier, plane):
        os.system("cls")
        print(f"\n\n FLIGHT SELECTION SCREEN               TOTAL FUEL: {carrier.fuel:.0f}       TOTAL MONEY: {carrier.money:.0f}\n")
        print(f"You have selected {plane.name} of type {plane.type_name} located at {plane.airport.name}\nThis airplane can carry a total of {plane.passenger_capacity} passengers\n")
        print("Please select a airport you would like to fly to: ")
        routes = db_handler.get_next_routes(plane)
        for index, route in enumerate(routes):
            print(f"{index+1}. {route.arrival_airport.name} in {route.arrival_airport.country_name}")
            print(f"    Lenght: {route.route_lenght:.0f} km")
            print(f"    Passengers available: {route.departure_airport.airport_passengers()}")
            vip_available = "NO"
            if route.has_vip:
                vip_available = "YES"
            print(f"    VIP available: {vip_available}")
            print(f"    Fuel required: {route.fuel_required:.0f} l")
            print("\n")
        choice = int(input("Choose an airport: "))
        print(routes[choice-1].fly(plane,carrier))
        input("Press enter to continue")
        
    def splash_screen(self):
        os.system('cls')
        print("Console Carrier")
        time.sleep(1)
        print("The ultimate aviation management experience")
        time.sleep(1)
        print("\nBy Antto Salo & Veeti Sundqvist")