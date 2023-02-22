MAX_AIRPORTS_PER_SEARCH = 3
STARTING_FUEL = 100000
STARTING_MONEY = 100

# Parameters for calculating amount of passengers on a given airport
# Formula is: randint(airport_min_passenger, airport_max_passengers) * airport_passenger_multiplier for the type
airport_min_passenger = 1
airport_max_passenger = 5
airport_passenger_multiplier = {
    "large_airport": 10,
    "medium_airport": 5,
    "small_airport": 2,
    "closed" : 0
}

money_per_passenger_per_km = 1

PLANES = {
    "C172" : {
        "name": "Cessna-172",
        #range in nautical miles!!
        "range": 1185,
        "passenger_capacity":3,
        #Litres per km
        "fuel_consumption": 1
    }
}