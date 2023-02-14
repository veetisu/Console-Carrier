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
        #Gotta have Helsinki Vantaa
        #Startairports hardcoded
        
        wanted_airports = ("EFHK","ESSA","EFOU","EKOD")
        self.cursor.execute("SELECT airport.name, country.name FROM airport JOIN country ON airport.iso_country = country.iso_country WHERE ident IN (?, ?, ?, ?)", wanted_airports)
        airports = self.cursor.fetchall()
        return airports
    
    def get_next_airports(self,carrier, plane):
        #few random airports
        #Range limited by airplane
        #Distance filtering, HOW?
        self.cursor.execute("SELECT airport.type, airport.name, airport.latitude_deg, airport.longitude_deg, country.name FROM airport JOIN country ON airport.iso_country = country.iso_country")
        all_airports = self.cursor.fetchall()
        #ONLY WORKS WITH ONE PLANE
        airplane_location = carrier.airplanes[0].location
        self.cursor.execute("SELECT latitude_deg, longitude_deg FROM airport WHERE ident = ?", (airplane_location,))
        airplane_coords = self.cursor.fetchall()
        results = []
        while len(results)<cfg.MAX_AIRPORTS_PER_SEARCH:
            random_airport = random.choice(all_airports)
            random_airport_coords = (random_airport[2],random_airport[3])
            distance_from_plane = geopy.distance.distance(airplane_coords,random_airport_coords).km
            #pls no more hardcoded values
            if distance_from_plane<500:
                results.append(random_airport)
        return results
    def add_carrier(self,carrier):
        self.cursor.execute("INSERT INTO carrier (carrier_name, fuel, carrier_money) VALUES (?, ?, ? )",(carrier.name, carrier.fuel, carrier.money))
        self.conn.commit()
        carrier.id = self.cursor.lastrowid
    def add_airplane(self, airport, carrier, type, name):
        #Where airport comes from??
        self.cursor.execute("INSERT INTO plane (carrier_id, airport_id, type, name) VALUES (?, ?, ?, ?)",(carrier.id, airport, type, name))
        self.conn.commit()
        
app = Db_handler()
#app.get_next_airports()