from db_handler import Db_handler
from airplane import Airplane

db_handler = Db_handler()
class Carrier():
    #TI = To Implement
    def __init__(self, name):
        #Creates a new Carrier for the player
        self.name = name
        self.airplanes = []
        
        #Shouldn't be hardcoded!
        self.headquarters = "EFHK"
        self.id = 1
        
        #TI: Init the class with resources
        self.fuel = 1000
        self.money = 1000
        db_handler.add_carrier(self)
    #TI: Method to add new plane

    def new_plane(self,type):
        #FIX!
        db_handler.add_airplane(self.headquarters,self,type,"LOL")
        self.airplanes.append(Airplane(self.id, type, self.headquarters))
        
    #TI: Method to add / remove given amount of resources
    #TI: Method to print players resources, return nice string for printing

    #Carrier needs to have attribute id referring to its id on the db 

carrier = Carrier("LOL")
carrier.new_plane("C172")