// Airplane.ts

export interface Plane {
	id: string;
	type: string;
	name: string;
	airport: {
		id: number;
		icao: string;
		type: string;
		name: string;
		latitude: number;
		longitude: number;
		elevation_feet: number;
		continent: string;
		iso_country: string;
		iso_region: string;
		municipality: string;
		country_name: string;
	};
	carrier_id: number;
	range: number;
	type_name: string;
	fuel_consumption: number;
	passenger_capacity: number;
	cruise_speed: number;
}

export default class Airplane implements Plane {
	id: string;
	type: string;
	name: string;
	airport: {
		id: number;
		icao: string;
		type: string;
		name: string;
		latitude: number;
		longitude: number;
		elevation_feet: number;
		continent: string;
		iso_country: string;
		iso_region: string;
		municipality: string;
		country_name: string;
	};
	carrier_id: number;
	range: number;
	type_name: string;
	fuel_consumption: number;
	passenger_capacity: number;
	cruise_speed: number;

	constructor(data: Plane) {
		this.id = data.id;
		this.type = data.type;
		this.name = data.name;
		this.airport = data.airport;
		this.carrier_id = data.carrier_id;
		this.range = data.range;
		this.type_name = data.type_name;
		this.fuel_consumption = data.fuel_consumption;
		this.passenger_capacity = data.passenger_capacity;
		this.cruise_speed = data.cruise_speed;
	}

	// Add other methods to modify the airplane object
}

interface Airport {
	id: string;
	icao: string;
	type: string;
	name: string;
	latitude: number;
	longitude: number;
	elevation_feet: number;
	continent: string;
	iso_country: string;
	iso_region: string;
	municipality: string;
	country_name: string;
}

interface Vip {
	name: string;
	value: number;
	vip_message: string;
	result_message: string;
}

export interface Route {
	plane: Airplane;
	departure_airport: Airport;
	arrival_airport: Airport;
	departure_coords: [number, number];
	arrival_coords: [number, number];
	route_length: number;
	flown: boolean;
	vip: Vip | null;
	has_vip: boolean;
	vip_accepted: boolean | null;
	fuel_required: number;
	flight_time: number;
	status: string;
}
