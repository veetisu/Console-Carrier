
# router.py
from flask import Flask, jsonify, Response, request, g
from route_handler import Route, Airport
from flask_cors import CORS
import sys
import time
from db_handler import Db_handler
from carrier_handler import Carrier
from airplane import Airplane
import pickle
import json
from flask_socketio import SocketIO, emit


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
        
class TimingMiddleware:
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        start_time = time.monotonic()
        def custom_start_response(status, headers, exc_info=None):
            elapsed_time = time.monotonic() - start_time
            print(f"Request took {elapsed_time:.6f} seconds to complete.")
            return start_response(status, headers, exc_info)
        return self.app(environ, custom_start_response)

# Add the middleware to your Flask app

class Router:
    def __init__(self, carrier: Carrier, db_handler:Db_handler) -> None:
        self.router = Flask(__name__)
        self.socketio = SocketIO(self.router, cors_allowed_origins="*")
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
            data = db_handler.get_all_airports()
            response = jsonify(data)
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

        @self.router.route('/post_route', methods=['POST'])
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
            carrier.active_route = route
            
            return json.dumps(route, cls=CustomJSONEncoder)

        @self.router.route('/search_airports', methods=['POST'])
        def search_airports():
            data = request.json
            search_parameters = {
                'search_term': data.get('searchTerm', None),
                'continent': data.get('selectedContinents', None),
                'size': data.get('selectedSizes', None),
            }
            results = db_handler.search_airports(search_parameters['search_term'],search_parameters['continent'],search_parameters['size'])
            response = jsonify(results)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response
        @self.router.route('/fly', methods=['POST'])
        def fly():
            if carrier.active_route != None:
                carrier.active_route.fly()
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
    def notify_frontend_carrier_updated():
        data = {
            'name': carrier.name,
            'airplanes': [plane.__dict__ for plane in carrier.airplanes],
            'headquarters': carrier.headquarters,
            'id': carrier.id,
            'resources': carrier.resources,
            'fuel': carrier.fuel,
            'money': carrier.money,
        }
        emit('carrier_updated', json.dumps(data, cls=CustomJSONEncoder), broadcast=True)

    def run(self):
        self.socketio.run(self.router, debug=True)

        
if __name__ == '__main__':
    db_handler = Db_handler()
    carrier = Carrier("HEOO", "EFHK")
    carrier.new_plane("C172")
    router = Router(carrier, db_handler)
    router.router.wsgi_app = TimingMiddleware(router.router.wsgi_app)
    router.run()