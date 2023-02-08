import mariadb
import sys
import os
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
class Db_handler():
    pass