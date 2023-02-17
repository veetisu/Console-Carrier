import mariadb
import sys
import os
import geopy.distance
import random
import config as cfg
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

    
    def get_next_airports(self, plane):
        # Return a list of airports in the planes range
        results = []
        # Retuns a list of all airports in db
        self.cursor.execute("SELECT airport.type, airport.name, airport.latitude_deg, airport.longitude_deg, country.name FROM airport JOIN country ON airport.iso_country = country.iso_country")
        all_airports = self.cursor.fetchall()

        # Retuns coordinates for the airport the plane is currently in
        self.cursor.execute("SELECT latitude_deg, longitude_deg FROM airport WHERE ident = ?", (plane.location,))
        airplane_coords = self.cursor.fetchall()
        
        while len(results)<cfg.MAX_AIRPORTS_PER_SEARCH:
            random_airport = random.choice(all_airports)
            random_airport_coords = (random_airport[2],random_airport[3])
            distance_from_plane = geopy.distance.distance(airplane_coords,random_airport_coords).km
            if distance_from_plane<plane.range:
                results.append(random_airport)
        return results
    
    def add_carrier(self,carrier):
        self.cursor.execute("INSERT INTO carrier (carrier_name, fuel, carrier_money) VALUES (?, ?, ? )",(carrier.name, carrier.fuel, carrier.money))
        self.conn.commit()
        carrier.id = self.cursor.lastrowid
        
    def add_airplane(self, airport, carrier, type, name):
        self.cursor.execute("INSERT INTO plane (carrier_id, airport_id, type, name) VALUES (?, ?, ?, ?)",(carrier.id, airport, type, name))
        self.conn.commit()
        
    def exit(self):
        self.conn.close()
        
app = Db_handler()
#app.get_next_airports()