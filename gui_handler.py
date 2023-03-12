import time
import os
import random
from db_handler import Db_handler
from carrier_handler import Carrier
from termcolor import colored, cprint

db_handler = Db_handler()

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
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
        os.system('cls')
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
    def main_menu(self, carrier):
        cprint(f"\n\nMAIN MENU               TOTAL FUEL: {carrier.fuel:.0f}       TOTAL MONEY: {carrier.money:.0f}\n","black","on_white")
        for index, plane in enumerate(carrier.airplanes):
            cprint(f"{index+1}. {plane.name}\nType: {plane.type_name}\nLocation: {plane.airport.name}, {plane.airport.country_name}\n")
        input("Press enter to continue")
        
    def setup_screen(self, carrier, plane, app):
        os.system("cls")
        cprint(f"\n\nFLIGHT SELECTION SCREEN               TOTAL FUEL: {carrier.fuel:.0f}       TOTAL MONEY: {carrier.money:.0f}\n","black","on_white")
        print(f"You have selected {plane.name} of type {plane.type_name} located at {plane.airport.name}\nThis airplane can carry a total of {plane.passenger_capacity} passengers\n")
        print("Please select a airport you would like to fly to: ")
        routes = db_handler.get_next_routes(plane)
        for index, route in enumerate(routes):
            cprint(f"{index+1}. {route.arrival_airport.name} in {route.arrival_airport.country_name}",attrs=["reverse"])
            print(f"    Lenght: {route.route_lenght:.0f} km")
            print(f"    Passengers available: {route.departure_airport.airport_passengers()}")
            vip_available = "NO"
            if route.has_vip:
                vip_available = "YES"
            print(f"    VIP available: {vip_available}")
            print(f"    Fuel required: {route.fuel_required:.0f} l")
            print("\n")
        choice ="not set yet"
        while choice not in ["1","2","3","4","5"]:
            choice = input("Choose an airport: ")
        choice = int(choice)
        routes[choice-1].take_off()
        app.gamestate = "waiting"
        return routes[choice-1]
        

    def progress_bar(self, percent, bar_len=20):
        filled_len = int(round(bar_len * percent))
        bar = '=' * filled_len + '-' * (bar_len - filled_len)
        return f'|{bar}| {percent:.0%}'

    def waiting(self, route, plane, carrier, app):
        clear = lambda: os.system('cls' if os.name == 'nt' else 'clear')
        airplane = [
            "                      ___",
            "                      \\ \\",
            "                       \\ `\\",
            "                        \\  \\",
            "                         \\  `\\",
            " ___                      \\    \\",
            "|    \\                     \\    `\\",
            "|_____\                     \\     \\",
            "|______\\                     \\     `\\",
            "|       \\                     \\      \\",
            "|      __\\__---------------------------------._.",
            "__|---~~~__o_o_o_o_o_o_o_o_o_o_o_o_o_o_o_o_o_o_[][\__",
            "|___                         /~      )                \\__",
            "    ~~~---..._______________/      ,/_________________/",
            "                           /      /",
            "                          /     ,/",
            "                         /     /",
            "                        /    ,/",
            "                       /    /",
            "                      //  ,/",
            "                     //  /",
            "                    // ,/",
            "                   //_/"
        ]

        pos = 0

        while app.gamestate == "waiting":
            clear()
            for line in airplane:
                # Add spaces to the beginning of the line to move the airplane
                # and remove the excess characters on the right side
                print(" " * pos + line[:os.get_terminal_size().columns - pos])
            pos += 1
            if pos > os.get_terminal_size().columns:
                pos = 0
            print("\n\n\n")
            percent = route.elapsed_time / route.flight_time
            print(self.progress_bar(percent))
            fly_return = route.fly(plane, carrier, app)
            time.sleep(0.04)
        # Print iterations progress
            if fly_return != False and fly_return != None:
                print(fly_return)
                input("Press enter to continue")

            
    def splash_screen(self):
        os.system('cls')
        print("Console Carrier")
        time.sleep(1)
        print("The ultimate aviation management experience")
        time.sleep(1)
        print("\nBy Antto Salo & Veeti Sundqvist")
        time.sleep(3)
        os.system('cls')
