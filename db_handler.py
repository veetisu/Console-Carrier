import mariadb
import sys
import os
import geopy.distance
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
        
        pass