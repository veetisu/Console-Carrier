MAX_AIRPORTS_PER_SEARCH = 5
STARTING_FUEL = 10000
STARTING_MONEY = 100

FUEL_PRICE_PER_LITER = 3

# Parameters for calculating amount of passengers on a given airport
# Formula is: randint(airport_min_passenger, airport_max_passengers) * airport_passenger_multiplier for the type
airport_min_passenger = 1
airport_max_passenger = 10
airport_passenger_multiplier = {
    "large_airport": 4,
    "medium_airport": 2,
    "small_airport": 1,
    "closed" : 0
}
money_per_passenger_per_km = 1
flight_time_multiplier = 3

vip_chance = 0.2


PLANES = {
    "C172": {
        "name": "Cessna 172 Skyhawk",
        "range": 1280, # km
        "cruise_speed": 226, # km/h
        "passenger_capacity": 3,
        "fuel_consumption": 0.039, # L/km
        "price": 300_000 
    },
    "B350": {
        "name": "Beechcraft King Air 350",
        "range": 2960, # km
        "cruise_speed": 574, # km/h
        "passenger_capacity": 11,
        "fuel_consumption": 0.12, # L/km
        "price": 8_000_000
    },
    "P300": {
        "name": "Embraer Phenom 300",
        "range": 3334, # km
        "cruise_speed": 834, # km/h
        "passenger_capacity": 7,
        "fuel_consumption": 0.19, # L/km
        "price": 9_500_000
    },
    "L75": {
        "name": "Bombardier Learjet 75 Liberty",
        "range": 3810, # km
        "cruise_speed": 860, # km/h
        "passenger_capacity": 9,
        "fuel_consumption": 0.24, # L/km
        "price":13_800_000
    },
    "A320": {
        "name": "Airbus A320neo",
        "range": 6500, # km
        "cruise_speed": 828, # km/h
        "passenger_capacity": 180,
        "fuel_consumption": 2.39, # L/km
        "price": 110_000_000
    },
    "747" : {
    "name": "Boeing 747",
    "range": 13450,
    "cruise_speed": 920,
    "passenger_capacity": 660,
    "fuel_consumption": 13,
    "price":400_000_000
}

}
