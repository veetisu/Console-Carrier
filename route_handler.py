import geopy
import config as cfg
import random
import os
#import below not completely necessary
from airplane import Airplane
from datetime import datetime

        
class Airport():
    """This class represents a single airport"""
    def __init__(self, data):
        self.id = data[0]
        self.icao = data[1]
        self.type = data[2]
        self.name = data[3]
        self.latitude = data[4]
        self.longitude = data[5]
        self.elevation_feet = data[6]
        self.continent = data[7]
        self.iso_country = data[8]
        self.iso_region = data[9]
        self.municipality = data[10]
        self.country_name = data[19]
        
    def airport_passengers(self):
        """Returns how many passenger are available from the airport, it is determined on random, but bigger airports will have more passengers on average"""   
        passengers = random.randint(cfg.airport_min_passenger,cfg.airport_max_passenger)
        airport_type_multiplier = cfg.airport_passenger_multiplier.get(self.type)
        passengers = passengers * airport_type_multiplier
        return passengers
class Route():
    """"This class represents a route between two different airports"""
    
    # DO: Instances of this need to identifiable somehow
    def __init__(self,departure_airport:Airport, arrival_airport:Airport, plane: Airplane):
        
        self.plane = plane
        self.departure_airport = departure_airport
        self.arrival_airport = arrival_airport
        self.depature_coords = (self.departure_airport.latitude, self.departure_airport.longitude)
        self.arrival_coords = (self.arrival_airport.latitude, self.arrival_airport.longitude)
        self.route_lenght = geopy.distance.distance(self.depature_coords,self.arrival_coords).km
        self.flown = False
        self.vip = None
        self.has_vip = self.generate_vip()
        self.vip_accepted = None
        self.fuel_required = self.plane.fuel_consumption * self.route_lenght
        self.flight_time = (self.route_lenght/plane.cruise_speed)*cfg.flight_time_multiplier
        
    def take_off(self):
        if self.has_vip and self.vip_accepted == None:
            os.system("cls")
            print(f"Theres a VIP available for this flight:")
            print(f"{self.vip.name}: {self.vip.vip_message}")
            accept_input = input("Do you accept this VIP? (y/n): ")
            if accept_input == "y":
                self.vip_accepted = True
            if accept_input == "n":
                self.vip_accepted = False
        input("Press enter to continue")
        self.take_off_time = datetime.now()
        self.elapsed_time = 0
        
    def fly(self, plane, carrier, app) -> None:
        """This is the method that shall be called when you want to fly the route.
        This method will handle all the different tasks associated with the flying (Fuel consumption, money, etc.)"""
        #Needs more work, prob needs to return something
        self.elapsed_time = datetime.now()-self.take_off_time
        self.elapsed_time = self.elapsed_time.total_seconds()
        if self.elapsed_time < self.flight_time:
            return False
        
        enough_fuel = self.plane.consume_fuel(self, carrier)
        if not enough_fuel:
            return
        plane.airport = self.arrival_airport
        total_money = self.total_money()     
        carrier.money += total_money
        self.flown = True
        app.gamestate = "flight_menu"
        returnstr = f"Flew safely to {self.arrival_airport.name}"
            
        if self.has_vip and self.vip_accepted:
            returnstr += f"\n{self.vip.result_message}"
            carrier.money += self.vip.value
        return(returnstr)
        
    def passengers(self) -> int:
        """Returns the number of passengers that will be onboard this flight"""
        result = 0
        max_passengers = self.plane.passenger_capacity
        potential_passengers = self.departure_airport.airport_passengers()
        if  potential_passengers <= max_passengers:
            result = potential_passengers
        if potential_passengers > max_passengers:
            result = max_passengers
        return result
    
    def total_money(self) -> int:
        """Returns the amount of money that the route generates when flown."""
        money_per_passenger = cfg.money_per_passenger_per_km * self.route_lenght
        total_money = money_per_passenger * self.passengers()
        return total_money
    
    def generate_vip(self):
        """This method determines on random wether there will be a VIP available on this route. Called on route init. 
        Returns: True if VIP is available and created. False otherwise"""
        if random.random() < cfg.vip_chance:
            vip = Vip(self)
            self.vip = vip
            return True
        else:
            return False
    
    def __str__(self) -> str:
        return f"{self.route_lenght:.0f}km route from {self.departure_airport.name} to {self.arrival_airport.name} with {self.passengers()} passengers yelding {self.total_money():.0f} €"
class Vip(Route):
    """This class represents a high value passenger that may be available on a route."""
    def __init__(self, route: Route):
        vips = [
        {
            "name" : "Sauli Niinistö",
            "value" : 1000,
            "vip_message" : f"I need to get to {route.arrival_airport.name} with Jenni.",
            "result_message" : "You got 1000€ from finnish valtion kassa"
        },
        {
            "name" : "Vladimir Putin",
            "value" : -2000,
            "vip_message" : f"I need help with warcrimes at {route.arrival_airport.name}",
            "result_message" : "The UN has fined you 2000€ for collaborating with a known war criminal"
        }
    ]
        vip = random.choice(vips)
        self.name = vip["name"]
        self.value = vip["value"]
        self.vip_message = vip["vip_message"]
        self.result_message = vip["result_message"]
    
        

