import mariadb
import sys
import os
import geopy.distance
import random
import config as cfg

class Db_handler():
    def __init__(self):
        try:
            conn = mariadb.connect(
                user="root",
                password= os.environ.get("DBPASS") or "admin",
                host="localhost",
                port=3306,
                database="flight_game"
            )
        except mariadb.Error as e:
            print(f"Error connecting to MariaDB Platform: {e}")
            sys.exit(1)
        self.cursor = conn.cursor()
    
    def get_starting_airports(self):
        #Gotta have Helsinki Vantaa
        #Startairports hardcoded
        
        #
        wanted_airports = ("EFHK","ESSA","EFOU","EKOD")
        self.cursor.execute("SELECT airport.name, country.name FROM airport JOIN country ON airport.iso_country = country.iso_country WHERE ident IN (?, ?, ?, ?)", wanted_airports)
        airports = self.cursor.fetchall()
        return airports
    def get_next_airports(self):
        #few random airports
        #Range limited by airplane
        #Distance filtering, HOW?
        self.cursor.execute("SELECT airport.type, airport.name, airport.latitude_deg, airport.longitude_deg, country.name FROM airport JOIN country ON airport.iso_country = country.iso_country")
        all_airports = self.cursor.fetchall()
        results = []
        while len(results)<cfg.MAX_AIRPORTS_PER_SEARCH:
            random.choice(all_airports)

app = Db_handler()
app.get_next_airports()