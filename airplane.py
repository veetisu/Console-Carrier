import config as cfg
class Airplane():
    def __init__(self,carrier_id, type, location):
        self.type = type
        self.location = location
        self.carrier_id = carrier_id
        stats = cfg.PLANES.get(self.type)
        self.range = stats.get("range")
        self.fuel_consumption = stats.get("fuel_consumption")
        self.passenger_capacity = stats.get("passenger_capacity")

    def consume_fuel(self, flight_lenght, carrier):
        total_consumption = self.fuel_consumption * flight_lenght
        if total_consumption > carrier.fuel:
            carrier.fuel = 0
            self.crash()
            return False
        else:
            carrier.fuel -= total_consumption
            return True
        
    def fly(self, route, carrier):
        route_lenght = route[1]
        target_airport = route[0][4]
        enough_fuel = self.consume_fuel(route_lenght,carrier)
        if enough_fuel:
            self.location = target_airport

    def crash(self):
        #To be implemented
        print("You have crashed")
        pass