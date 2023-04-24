
# router.py
from flask import Flask, jsonify, Response, request, g
from route_handler import Route, Airport
from flask_cors import CORS
import sys
import time
from db_handler import Db_handler
from carrier_handler import Carrier
from airplane import Airplane
import config as cfg
import pickle
import json
from flask_socketio import SocketIO, emit
import threading
import atexit
import threading
from threading import Thread
from datetime import datetime
import traceback

def set_interval(func, sec):
    def func_wrapper():
        set_interval(func, sec)
        func()
    t = threading.Timer(sec, func_wrapper)
    t.start()
    return t


class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Airplane):
            return obj.__dict__
        elif isinstance(obj, Airport):
            return obj.__dict__
        elif isinstance(obj, Route):
            return obj.__dict__
        elif isinstance(obj, datetime):
            return obj.isoformat()
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
    def __init__(self, carrier: Carrier, db_handler: Db_handler) -> None:
        self.router = Flask(__name__)
        self.socketio = SocketIO(self.router, cors_allowed_origins="*")
        # ... Other routes
        CORS(self.router, resources={r"*": {"origins": "*"}})

        def return_carrier():
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

        @self.router.route('/airport/coords/<icao>')
        def coords(icao):
            response = jsonify(db_handler.get_coords(icao))
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

        @self.router.route('/fuel_price')
        def fprice():
            response = jsonify(cfg.FUEL_PRICE_PER_LITER)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

        @self.router.route('/cfg')
        def getcfg():
            planes_array = list(cfg.PLANES.values())
            response = jsonify(planes_array)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

        @self.router.route('/buy_fuel', methods=['POST'])
        def buy_fuel():
            data = request.json
            amount = data.get('amount', None)
            carrier_id = data.get("carrierId", None)
            carrier.buy_fuel(amount)
            return return_carrier()

        @self.router.route('/route')
        def route():
            departure_airport = db_handler.add_airport("EDDB")
            arrival_airport = db_handler.add_airport("EFHK")
            plane = carrier.airplanes[0]

            route = Route(departure_airport, arrival_airport, plane)
            route_data = {
                'departure_coords': route.departure_coords,
                'arrival_coords': route.arrival_coords,
                'route_length': route.route_lenght,
                'flown': route.flown,
                'has_vip': route.has_vip,
                'fuel_required': route.fuel_required,
                'flight_time': route.flight_time,
            }
            response = jsonify(route_data)
            return response

        @self.router.route('/airports')
        def airports():
            data = db_handler.get_all_airports()
            response = jsonify(data)
            return response

        @self.router.route('/carrier')
        def get_carrier():
            return return_carrier()

        @self.router.route('/search_airports', methods=['POST'])
        def search_airports():
            data = request.json
            search_parameters = {
                'search_term': data.get('searchTerm', None),
                'continent': data.get('selectedContinents', None),
                'size': data.get('selectedSizes', None),
            }
            results = db_handler.search_airports(
                search_parameters['search_term'], search_parameters['continent'], search_parameters['size'])
            response = jsonify(results)
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

        @self.router.route('/fly/<plane_id>', methods=['POST'])
        def fly (plane_id):
            data = request.json
            departure = data['departure']
            arrival = data['arrival']
            print(departure, arrival)
            departure = db_handler.add_airport(departure)
            arrival = db_handler.add_airport(arrival)
            plane_id = int(plane_id)
            plane = next(
                (plane for plane in carrier.airplanes if plane.id == plane_id), None)
            print(plane)
            route = Route(departure, arrival, plane)
            carrier.active_routes[plane_id] = route
            print("Active routes:", carrier.active_routes)
            if route is not None:
                route.take_off()
                response = json.dumps(route, cls=CustomJSONEncoder)
                return response
            else:
                return json.dumps({"error": f"Error in route generation"}, cls=CustomJSONEncoder)

        @self.router.route('/land/<int:plane_id>', methods=['GET'])
        def land_plane(plane_id):
            try:
                # Retrieve the route object and the carrier object from your data store
                route = carrier.active_routes.get(plane_id)
                result = route.fly(carrier)

                if not result:
                    return jsonify({"error": "Failed to land the plane"}), 400

                return return_carrier()
            except Exception as e:
                print(str(e))
                traceback.print_exc()
                return jsonify({"error": str(e)}), 500

    def run(self):
        self.router.run(debug=True)

def load_carrier():
    """Loads carrier from file using pickles. Returns carrier object if found and False otherwise. """
    try:
        with open('.\save\carrier_save.pickle', 'rb') as f:
            carrier = pickle.load(f)
        return carrier
    except Exception:
        return False


if __name__ == '__main__':
    db_handler = Db_handler()
    carrier = load_carrier()
    if not carrier:
        carrier = Carrier("HEOO", "EFHK")
        carrier.new_plane("C172")
        carrier.new_plane("B350")
        carrier.new_plane("P300")
        carrier.new_plane("L75")
        carrier.save()
    else:
        atexit.register(carrier.save)
    router = Router(carrier, db_handler)
    router.router.wsgi_app = TimingMiddleware(router.router.wsgi_app)
    set_interval(carrier.save, 10)
    router.run()
