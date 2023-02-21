import geopy
import config as cfg
import random
#import below not completely necessary
from airplane import Airplane

class Airport():
    """This class represents a single airport"""
    def __init__(self, data):
        """"(2307, 'EFHK', 'large_airport', 'Helsinki Vantaa Airport', 60.3172, 24.963301, 179, 'EU', 'FI', 'FI-18', 'Helsinki', 'yes', 'EFHK', 'HEL', '', 'http://www.finavia.fi/en/helsinki-airpor', 'https://en.wikipedia.org/wiki/Helsinki_A', '')"""
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
        
    def airport_passengers(self):
        """Returns how many passenger are available from the airport, it is determined on random, but bigger airports will have more passengers on average"""   
        passengers = random.randint(cfg.airport_min_passenger,cfg.airport_max_passenger)
        airport_type_multiplier = cfg.airport_passenger_multiplier.get(self.type)
        passengers = passengers * airport_type_multiplier
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
        
    def fly(self, plane, carrier) -> None:
        """This is the method that shall be called when you want to fly the route. 
        This method will handle all the different tasks associated with the flying (Fuel consumption, money, etc.)"""
        #Needs more work, prob needs to return something
        enough_fuel = self.plane.consume_fuel(self, carrier)
        if enough_fuel:
            plane.airport = self.arrival_airport
            self.add_money(carrier)     
        
    def passengers(self) -> int:
        """Returns the number of passengers"""
        result = 0
        max_passengers = self.plane.passenger_capacity
        potential_passengers = self.departure_airport.airport_passengers()
        if  potential_passengers <= max_passengers:
            result = potential_passengers
        if potential_passengers > max_passengers:
            result = max_passengers
        return result
    
    def add_money(self) -> int:
        """Adds the amount of money that the route generates when flown to the carriers money balance.
        Returns: The value added to carriers balance"""
        money_per_passenger = cfg.money_per_passenger_per_km * self.route_lenght
        total_money = money_per_passenger * self.passengers()
        return total_money
    
        

