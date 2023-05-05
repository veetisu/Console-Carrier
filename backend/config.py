import datetime
MAX_AIRPORTS_PER_SEARCH = 5
STARTING_FUEL = 10000
STARTING_MONEY = 100

FUEL_PRICE_PER_LITER = 3
TIME_SCALE_FACTOR = 8760  # 1 year in 1 hour
GAME_START_TIME = datetime.datetime(2023, 5, 2, 12, 0, 0)  # Year, Month, Day, Hour, Minute, Second
def set_game_start_time(start_time):
    global GAME_START_TIME
    GAME_START_TIME = start_time
# Parameters for calculating amount of passengers on a given airport
# Formula is: randint(airport_min_passenger, airport_max_passengers) * airport_passenger_multiplier for the type
airport_min_passenger = 10
airport_max_passenger = 200
airport_passenger_multiplier = {
    "large_airport": 4,
    "medium_airport": 2,
    "small_airport": 1,
    "closed" : 0
}
money_per_passenger_per_km = 1
base_ticket_price_multiplier = 1
price_sensitivity_divisor = 1

flight_time_multiplier = 1

vip_chance = 0


PLANES = {
    "C172": {
        "type": "C172",
        "name": "Cessna 172 Skyhawk",
        "range": 1280, # km
        "cruise_speed": 226, # km/h
        "passenger_capacity": 3,
        "fuel_consumption": 0.039, # L/km
        "price": 300_000 
    },
    "B350": {
        "type": "B350",
        "name": "Beechcraft King Air 350",
        "range": 2960, # km
        "cruise_speed": 574, # km/h
        "passenger_capacity": 11,
        "fuel_consumption": 0.12, # L/km
        "price": 8_000_000
    },
    "P300": {
        "type": "P300",
        "name": "Embraer Phenom 300",
        "range": 3334, # km
        "cruise_speed": 834, # km/h
        "passenger_capacity": 7,
        "fuel_consumption": 0.19, # L/km
        "price": 9_500_000
    },
    "L75": {
        "type": "L75",
        "name": "Bombardier Learjet 75 Liberty",
        "range": 3810, # km
        "cruise_speed": 860, # km/h
        "passenger_capacity": 9,
        "fuel_consumption": 0.24, # L/km
        "price":13_800_000
    },
    "A320": {
        "type": "A320",
        "name": "Airbus A320neo",
        "range": 6500, # km
        "cruise_speed": 828, # km/h
        "passenger_capacity": 180,
        "fuel_consumption": 2.39, # L/km
        "price": 110_000_000
    },
    "747" : {
    "type": "747",
    "name": "Boeing 747",
    "range": 13450,
    "cruise_speed": 920,
    "passenger_capacity": 660,
    "fuel_consumption": 13,
    "price":400_000_000
},
    "SSD": {
        "type": "SSD",
        "name": "Super Star Destroyer",
        "range": 1200000, # km (approximation, assuming constant speed)
        "cruise_speed": 900, # km/h (approximation)
        "passenger_capacity": 280000, # including crew and troops
        "fuel_consumption": 1600, # L/km (approximation, based on the massive size and energy consumption)
        "price": 1_000_000_000_000 # fictitious price, as it's from the Star Wars universe
    }

}
