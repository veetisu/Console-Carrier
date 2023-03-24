from db_handler import Db_handler
from airplane import Airplane
import config as cfg
import pickle

db_handler = Db_handler()
class Carrier():
    #TI = To Implement
    def __init__(self, name, headquarters):
        #Creates a new Carrier for the player
        self.name = name
        self.airplanes = []
        
        #Shouldn't be hardcoded!
        self.headquarters = "EFHK"
        self.id = 1
        
        self.resources = ["fuel","money"]
        self.fuel = cfg.STARTING_FUEL
        self.money = cfg.STARTING_MONEY
        self.active_routes = None
        
        db_handler.add_carrier(self)
        
    def new_plane(self, type, airplane_name="Airplane"):
        id = db_handler.add_airplane(self.headquarters,self,type,airplane_name)
        airport = db_handler.add_airport(self.headquarters)
        self.airplanes.append(Airplane(self.id, type, airport, id))
        
    def update_resource(self, resource, amount):
    # Method to add / remove given amount of resources
    # Stupid/unusefull method??
        if hasattr(self, resource):
            setattr(self, resource, getattr(self, resource) + amount)
        else:
            print(f"Resource '{resource}' not found.")

    def get_resources(self):
    # Returns list of tuples with resource name and amount
        results = []
        for resource in self.resources:
            if hasattr(self, resource):
                results.append((resource,getattr(self, resource)))
        return results
    
    def save(self):
        with open('save/carrier_save.pickle', 'wb') as f:
            pickle.dump(self, f)