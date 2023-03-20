
# router.py
from flask import Flask, jsonify, Response, request
from route_handler import Route, Airport
from flask_cors import CORS
import sys
import time
from db_handler import Db_handler
from carrier_handler import Carrier
from airplane import Airplane
import pickle
import json

class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Airplane):
            return obj.__dict__
        elif isinstance(obj, Airport):
            return obj.__dict__
        elif isinstance(obj, Route):
            return obj.__dict__
        else:
            return super().default(obj)
class Router:
    def __init__(self, carrier: Carrier, db_handler:Db_handler) -> None:
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
            departure_airport = db_handler.add_airport("EDDB")
            arrival_airport = db_handler.add_airport("EFHK")
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
        @self.router.route('/airports')
        def airports():
            response = jsonify(db_handler.get_all_airports())
            return response
        @self.router.route('/carrier')
        def get_carrier():
            data = {
                'name': carrier.name,
                'airplanes': [plane.__dict__ for plane in carrier.airplanes],
                'headquarters': carrier.headquarters,
                'id': carrier.id,
                'resources': carrier.resources,
                'fuel': carrier.fuel,
                'money': carrier.money,
            }
            return json.dumps(data, cls=CustomJSONEncoder)

        @self.router.route('/post-route', methods=['POST'])
        def post_route():
            data = request.json
            departure = data['departure']
            arrival = data['arrival']
            plane_id = data['plane_id']
            print(departure, arrival)
            departure = db_handler.add_airport(departure)
            arrival = db_handler.add_airport(arrival)
            #This seatches for plane with given id from carriers planes
            plane = next((plane for plane in carrier.airplanes if plane.id == plane_id), None)

            route = Route(departure,arrival,plane)
            # Do something with the data

            return json.dumps(route, cls=CustomJSONEncoder)

    def run(self):
        self.router.run(debug=False)
        
if __name__ == '__main__':
    db_handler = Db_handler()
    carrier = Carrier("HEOO", "EFHK")
    carrier.new_plane("C172")
    router = Router(carrier,db_handler)
    router.run()