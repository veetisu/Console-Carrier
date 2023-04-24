import config as cfg
class Airplane():
    def __init__(self,carrier_id, type, airport,id, name = "Airplane"):
        self.id = id
        self.type = type
        self.name  = name
        # airport is a Airport object
        self.airport = airport
        self.carrier_id = carrier_id
        stats = cfg.PLANES.get(self.type)
        self.range = stats.get("range")
        self.type_name = stats.get("name")
        self.fuel_consumption = stats.get("fuel_consumption")
        self.passenger_capacity = stats.get("passenger_capacity")
        self.cruise_speed = stats.get("cruise_speed")
        self.status = "ground"

    def __str__(self) -> str:
        string = f"{self.type_name}\nRange: {self.range} "
        return string
        
    def consume_fuel(self, route, carrier) -> bool:
        """Subtracts the correct quantity of fuel from the carrier's total fuel. Calls self.crash if the plane runs out of fuel
            Args:
                flight_lenght (float): Lenght of flight in kilometers
                carrier (Object): Object of the carrier class
            returns: 
                True if the plane has enough fuel for the flight, False otherwise
        """
        total_consumption = self.fuel_consumption * route.route_lenght
        if total_consumption > carrier.fuel:
            carrier.fuel = 0
            self.crash()
            return False
        else:
            carrier.fuel -= total_consumption
            return True
        
            
    def crash(self):
        #To be implemented
        print("You have crashed")
        pass
