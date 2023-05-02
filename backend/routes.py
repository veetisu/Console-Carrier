
# routes.py
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
import os
sys.path.append('backend')


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
            active_routes_dict = {}
            for plane_id, route in carrier.active_routes.items():
                active_routes_dict[plane_id] = route.__dict__

            data = {
                'name': carrier.name,
                'airplanes': [plane.__dict__ for plane in carrier.airplanes],
                'headquarters': carrier.headquarters,
                'id': carrier.id,
                'resources': carrier.resources,
                'fuel': carrier.fuel,
                'money': carrier.money,
                'active_routes': active_routes_dict
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
            continous = data['continous']
            print(departure, arrival)
            departure = db_handler.add_airport(departure)
            arrival = db_handler.add_airport(arrival)
            plane_id = int(plane_id)
            plane = next(
                (plane for plane in carrier.airplanes if plane.id == plane_id), None)
            print(plane)
            route = Route(departure, arrival, plane, continous)
            carrier.active_routes[plane_id] = route
            if plane_id in carrier.deleted_routes:
                carrier.deleted_routes.remove(plane_id)
            print("Active routes:", carrier.active_routes)
            if route is not None:
                if route.fuel_required:
                    pass
                route.take_off()
                return return_carrier()
            else:
                return json.dumps({"error": f"Error in route generation"}, cls=CustomJSONEncoder)

        @self.router.route('/land/<int:plane_id>', methods=['GET'])
        def land_plane(plane_id):
            try:
                # Retrieve the route object and the carrier object from your data store
                if plane_id not in carrier.active_routes:
                    if plane_id in carrier.deleted_routes:
                        return jsonify(""), 200
                    print(f"Route not found for plane_id: {plane_id}")
                    return jsonify({"error": f"Route not found for plane_id: {plane_id}"}), 400

                print(f"Landing plane with id: {plane_id}")
                route = carrier.active_routes[plane_id]
                result = route.fly(carrier)

                if not result:
                    print(f"Failed to land the plane with id: {plane_id}")
                    return jsonify({"error": "Failed to land the plane"}), 400

                print(f"Successfully landed plane with id: {plane_id}")
                print(carrier.active_routes)
                return return_carrier()
            except Exception as e:
                print(f"Error in land_plane for plane_id: {plane_id}")
                print(str(e))
                traceback.print_exc()
                return jsonify({"error": str(e)}), 500

        @self.router.route('/buy_plane/<string:model>', methods=['POST'])
        def buy_plane(model):
            plane = cfg.PLANES.get(model)
            price = int(plane["price"])
            
            if not plane:
                response = jsonify({"error": "Invalid plane model"})
                response.status_code = 400
                return response

            if carrier.money >= price:
                carrier.money -= price
                carrier.new_plane(model)
                response = {"success": True, "message": "Plane purchased successfully.", "carrier": return_carrier()}
                return response
            else:
                response = {"success": False, "message": "Not enough money to buy the plane."}
            
                response["status_code"]= 403
                return response
        @self.router.route('/sell_plane/<int:plane_id>', methods=['POST'])
        def sell_plane(plane_id):
            plane_to_sell = None

            for plane in carrier.airplanes:
                if plane.id == plane_id:
                    plane_to_sell = plane
                    break

            if plane_to_sell:
                price = cfg.PLANES[plane.type]["price"]
                carrier.money += price * 0.5  # Give back 50% of the price
                carrier.airplanes.remove(plane_to_sell)
                response = {"success": True, "message": "Plane sold successfully.", "carrier": return_carrier()}
                return response
            else:
                response = {"success": False, "message": "Plane not found."}
                response["status_code"] = 404
                return response
        @self.router.route('/delete_route/<int:plane_id>', methods=['DELETE'])
        def del_route(plane_id):
            carrier.active_routes.__delitem__(plane_id)
            carrier.deleted_routes.append(int(plane_id))
            print(carrier.active_routes)
            return return_carrier()
        @self.router.route('/is_cancelled/<int:plane_id>')
        def iscancelled(plane_id):
            if plane_id in carrier.deleted_routes:
                return jsonify("True")
            else:
                return jsonify("False")        

    def run(self):
        self.router.run(debug=True)

base_dir = os.path.dirname(os.path.abspath(__file__))
save_path = os.path.join(base_dir, 'save', 'carrier_save.pickle')
def load_carrier():
    """Loads carrier from file using pickles. Returns carrier object if found and False otherwise. """
    try:
        if os.path.getsize(save_path) > 0:
            with open(save_path, 'rb') as f:
                carrier = pickle.load(f)
            return carrier
    except Exception:
        pass
    
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
        carrier.money=100000000
        carrier.save()
    atexit.register(carrier.save)
    carrier.active_routes={}
    router = Router(carrier, db_handler)
    router.router.wsgi_app = TimingMiddleware(router.router.wsgi_app)

    router.run()
