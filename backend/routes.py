from flask import Flask, jsonify

class Router:
    def __init__(self, carrier, db_handler) -> None:
        self.router = Flask(__name__)     
        @self.router.route('/hq')
        def hq():
            return carrier.headquarters
        # GET route that accepts a parameter
        @self.router.route('/airport/coords/<icao>')
        def coords(icao):
            response = jsonify(db_handler.get_coords(icao))
            response.headers.add('Access-Control-Allow-Origin', '*')
            return response

    def run(self):
        self.router.run()
