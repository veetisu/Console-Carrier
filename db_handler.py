import mariadb
import sys
import os
import geopy.distance
import random
import config as cfg
from route_handler import Route, Airport

class Db_handler():
    def __init__(self):
        try:
            self.conn = mariadb.connect(
                user="root",
                password= os.environ.get("DBPASS") or "admin",
                host="localhost",
                port=3306,
                database="flight_game"
            )
        except mariadb.Error as e:
            print(f"Error connecting to MariaDB Platform: {e}")
            sys.exit(1)
        self.cursor = self.conn.cursor()

    def get_starting_airports(self):
        #Returns info for the airports specified below
        wanted_airports = ("EFHK","ESSA","EFOU","EKOD")
        self.cursor.execute("SELECT airport.name, country.name FROM airport JOIN country ON airport.iso_country = country.iso_country WHERE ident IN (?, ?, ?, ?)", wanted_airports)
        return self.cursor.fetchall()

    
    def get_next_routes(self, plane):
        """Returns a list of routes in the planes range 
        
        Args:
            plane: The plane object for which you want to get the routes (The planes location is the departure airport )
        """
        #This method seriously needs some more work, it is a functional pile of shit...
        #OPTIMIZE!!!!!!!!!!!!!!!!
        results = []
        #Retuns a list of all airports in db
        type_filter = ["large_airport", "medium_airport", "small_airport"]
        self.cursor.execute("SELECT airport.type, airport.name, airport.latitude_deg, airport.longitude_deg, airport.ident, country.name FROM airport JOIN country ON airport.iso_country = country.iso_country WHERE airport.type IN {}"))
        all_airports = self.cursor.fetchall()

        # Retuns coordinates for the airport the plane is currently in
        self.cursor.execute("SELECT latitude_deg, longitude_deg FROM airport WHERE ident = ?", (plane.airport,))
        airplane_coords = self.cursor.fetchall()
        
        iterations = 0
        while len(results)<cfg.MAX_AIRPORTS_PER_SEARCH:
            random_airport = random.choice(all_airports)
            random_airport_coords = (random_airport[2],random_airport[3])
            # I know this dist calc is done twice, but its shitdev branch...
            distance_from_plane = geopy.distance.distance(airplane_coords, random_airport_coords).km
            
            iterations += 1
            if distance_from_plane < plane.range and random_airport[0] in type_filter:
                # More elegant solutions do exist... :D
                departure_airport = self.add_airport(plane.airport.icao)
                arrival_airport = self.add_airport(random_airport[4])
                route = Route(departure_airport,arrival_airport,plane)
                results.append(route)
        print(f"Had to go through {iterations} iterations")
        return results
    
    def add_airport(self, icao):
        """Makes a new aiport object from the airport with the provided icao code and returns it"""
        self.cursor.execute("SELECT * FROM airport WHERE ident = ?",(icao,))
        data = self.cursor.fetchone()
        airport = Airport(data)
        return airport
    
    def add_carrier(self,carrier):
        self.cursor.execute("INSERT INTO carrier (carrier_name, fuel, carrier_money) VALUES (?, ?, ? )",(carrier.name, carrier.fuel, carrier.money))
        self.conn.commit()
        carrier.id = self.cursor.lastrowid
    
    def carrier_is_created(self):
        """ Returns True if carrier exists in db and False otherwise. """
        
        self.cursor.execute("SELECT COUNT(*) FROM carrier")
        result = self.cursor.fetchone()
        if result == 0:
            False
        else:
            True
        
    def add_airplane(self, airport, carrier, type, name):
        self.cursor.execute("INSERT INTO plane (carrier_id, airport_id, type, name) VALUES (?, ?, ?, ?)",(carrier.id, airport, type, name))
        self.conn.commit()
        
    def exit(self):
        self.conn.close()
        
app = Db_handler()
#app.get_next_airports()