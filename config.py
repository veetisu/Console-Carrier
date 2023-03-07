MAX_AIRPORTS_PER_SEARCH = 5
STARTING_FUEL = 100000
STARTING_MONEY = 100

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

vip_chance = 0.2


PLANES = {
    "C172" : {
        "name": "Cessna-172",
        "range": 1185,
        "cruise_speed": 226,
        "passenger_capacity":3,
        #Litres per km
        "fuel_consumption": 1
    }
}