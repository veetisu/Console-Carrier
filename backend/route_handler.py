# route_handler.py
import geopy
import config as cfg
import random
import os
# import below not completely necessary
from airplane import Airplane
from datetime import datetime
from threading import Timer
from tools import get_in_game_month
import time


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
        passengers = random.randint(
            cfg.airport_min_passenger, cfg.airport_max_passenger)
        airport_type_multiplier = cfg.airport_passenger_multiplier.get(
            self.type)
        passengers = passengers * airport_type_multiplier
        return passengers


class Route():
    """"This class represents a route between two different airports"""

    # DO: Instances of this need to identifiable somehow
    def __init__(self, departure_airport: Airport, arrival_airport: Airport, plane: Airplane, set_ticket_price: float, continous = False, iteration=0):
        self.demand_factor = random.uniform(0.8, 1.2)  # Random value between 0.8 and 1.2
        self.competition_factor = random.uniform(0.9, 1.1)  # Random value between 0.9 and 1.1
        self.plane = plane
        self.departure_airport = departure_airport
        self.arrival_airport = arrival_airport
        self.departure_coords = (
            self.departure_airport.latitude, self.departure_airport.longitude)
        self.arrival_coords = (self.arrival_airport.latitude,
                               self.arrival_airport.longitude)
        self.route_lenght = geopy.distance.distance(
            self.departure_coords, self.arrival_coords).km
        self.continous = continous
        self.iteration = 0
        self.flown = False
        self.vip = None
        self.has_vip = self.generate_vip()
        self.vip_accepted = None
        self.fuel_required = self.plane.fuel_consumption * self.route_lenght
        self.flight_time = (self.route_lenght /
                            plane.cruise_speed)*cfg.flight_time_multiplier
        self.status = "ready"
        self.ticket_price = set_ticket_price
        self.season = "None"
        
        self.start_periodic_update()
    def start_periodic_update(self):
        # Calculate the real-time duration of an in-game month
        real_time_month_duration = (30 * 24 * 60 * 60) / cfg.TIME_SCALE_FACTOR

        # Schedule the update_demand_factor method to be called periodically
        Timer(real_time_month_duration*3, self.update_demand_factor).start()

    def take_off(self):
        self.status = "flying"
        self.take_off_time = datetime.now()
        

    def fly(self, carrier) -> None:
        """This is the method that shall be called when you want to fly the route.
        This method will handle all the different tasks associated with the flying (Fuel consumption, money, etc.)"""
        # Needs more work, prob needs to return something
        plane = self.plane
        enough_fuel = plane.consume_fuel(self, carrier)
        if not enough_fuel:
            return False
        plane.airport = self.arrival_airport
        total_money = self.total_money()
        carrier.money += total_money
        self.flown = True
        returnstr = f"Flew safely to {self.arrival_airport.name}"
        if self.has_vip and self.vip_accepted:
            returnstr += f"\n{self.vip.result_message}"
            carrier.money += self.vip.value
        del self
        return True

    def passengers(self) -> int:
        """Returns the number of passengers that will be onboard this flight"""
        if self.plane.type == "SSD":
            return self.plane.passenger_capacity
        result = 0
        max_passengers = self.plane.passenger_capacity
        potential_passengers = self.departure_airport.airport_passengers()

        # Calculate price sensitivity factor
        base_ticket_price = self.calculate_base_ticket_price()
        price_sensitivity_factor = base_ticket_price / (self.calculate_ticket_price() * cfg.price_sensitivity_divisor)

        # Adjust the number of passengers based on the price sensitivity factor
        potential_passengers = int(potential_passengers * price_sensitivity_factor)

        if potential_passengers <= max_passengers:
            result = potential_passengers
        if potential_passengers > max_passengers:
            result = max_passengers
        return result

    def total_money(self) -> int:
        """Returns the amount of money that the route generates when flown."""
        total_money = self.ticket_price * self.passengers()
        return total_money
    
    def calculate_base_ticket_price(self):
        base_price = cfg.money_per_passenger_per_km * self.route_lenght
        distance_factor = self.route_lenght / 1000
        price = base_price * (cfg.base_ticket_price_multiplier + distance_factor)
        return price

    
    def calculate_ticket_price(self):
        base_price = cfg.money_per_passenger_per_km*self.route_lenght
        distance_factor = self.route_lenght / 1000
        price = base_price * (1 + distance_factor) * self.demand_factor * self.competition_factor
        return price
    
    def update_factors(self, new_demand_factor=None, new_competition_factor=None):
        if new_demand_factor:
            self.demand_factor = new_demand_factor
        if new_competition_factor:
            self.competition_factor = new_competition_factor
    def update_demand_factor(self):
        current_month = get_in_game_month(cfg.GAME_START_TIME)
        if current_month in [6, 7, 8]:  # High season
            self.demand_factor = random.uniform(1.1, 1.3)
            self.season = "Summer, high demand"
        elif current_month in [12, 1, 2]:  # Low season
            self.demand_factor = random.uniform(0.7, 0.9)
            self.season = "Winter, low demand"
        elif current_month in [3, 4, 5]:  # Normal season
            self.demand_factor = random.uniform(0.9, 1.1)
            self.season = "Spring, regular demand"
        elif current_month in [9, 10, 11]:  # Normal season
            self.demand_factor = random.uniform(0.9, 1.1)
            self.season = "Fall, regular demand"
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] Updated demand factor for route from {self.departure_airport.name} to {self.arrival_airport.name}: {self.demand_factor}")


    def update_competition_factor(self, competitors: int):
        if competitors == 0:
            self.competition_factor = random.uniform(1.1, 1.3)
        elif competitors == 1:
            self.competition_factor = random.uniform(0.9, 1.1)
        else:
            self.competition_factor = random.uniform(0.7, 0.9)


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
                "name": "Sauli Niinistö",
                "value": 1000,
                "vip_message": f"I need to get to {route.arrival_airport.name} with Jenni.",
                "result_message": "You got 1000€ from finnish valtion kassa"
            },
            {
                "name": "Vladimir Putin",
                "value": -2000,
                "vip_message": f"I need help with warcrimes at {route.arrival_airport.name}",
                "result_message": "The UN has fined you 2000€ for collaborating with a known war criminal"
            }
        ]
        vip = random.choice(vips)
        self.name = vip["name"]
        self.value = vip["value"]
        self.vip_message = vip["vip_message"]
        self.result_message = vip["result_message"]
