import config as cfg
class Airplane():
    def __init__(self, type):
        self.type = type
        stats =  cfg.PLANES.get(self.type)
        self.range = stats.get("range")
        self.passenger_capacity = stats.get("passenger_capacity")
