
# router.py
from flask import Flask, jsonify
from route_handler import Route
from flask_cors import CORS
import sys
import time
from db_handler import Db_handler

class Router:
    def __init__(self, carrier, db_handler:Db_handler) -> None:
        self.router = Flask(__name__)
        # ... Other routes
        CORS(self.router, resources={r"*": {"origins": "*"}})
        
        @self.router.route('/airport/coords/<icao>')
        def coords(icao):
            response = jsonify(db_handler.get_coords(icao))
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        @self.router.route('/route')
        def route():
            departure_airport = db_handler.add_airport("EFHK")
            arrival_airport = db_handler.add_airport("ESSA")
            plane = carrier.airplanes[0]

            route = Route(departure_airport, arrival_airport, plane)
            route_data = {
                'departure_coords': route.depature_coords,
                'arrival_coords': route.arrival_coords,
                'route_length': route.route_lenght,
                'flown': route.flown,
                'has_vip': route.has_vip,
                'fuel_required': route.fuel_required,
                'flight_time': route.flight_time,
            }
            response = jsonify(route_data)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    def run(self):
        self.router.run(debug=True)