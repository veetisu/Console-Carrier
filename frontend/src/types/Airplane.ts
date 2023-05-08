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

export class Airport {
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

	constructor(data: any) {
		this.id = data.id;
		this.icao = data.icao;
		this.type = data.type;
		this.name = data.name;
		this.latitude = data.latitude;
		this.longitude = data.longitude;
		this.elevation_feet = data.elevation_feet;
		this.continent = data.continent;
		this.iso_country = data.iso_country;
		this.iso_region = data.iso_region;
		this.municipality = data.municipality;
		this.country_name = data.country_name;
	}
}

export class Route {
	plane: Airplane;
	departure_airport: Airport;
	arrival_airport: Airport;
	departure_coords: [number, number];
	arrival_coords: [number, number];
	route_lenght: number;
	flown: boolean;
	vip: Vip | null;
	has_vip: boolean;
	vip_accepted: boolean | null;
	fuel_required: number;
	flight_time: number;
	status: string;
	continous: boolean;
	iteration: number;
	season: string;

	constructor(data: any) {
		this.plane = new Airplane(data.plane);
		this.departure_airport = new Airport(data.departure_airport);
		this.arrival_airport = new Airport(data.arrival_airport);
		this.departure_coords = data.departure_coords;
		this.arrival_coords = data.arrival_coords;
		this.route_lenght = data.route_lenght;
		this.flown = data.flown;
		this.vip = data.vip ? new Vip(this) : null; // Pass the Route object (this) to the Vip constructor
		this.has_vip = data.has_vip;
		this.vip_accepted = data.vip_accepted;
		this.fuel_required = data.fuel_required;
		this.flight_time = data.flight_time;
		this.status = data.status;
		this.continous = data.continous;
		this.iteration = data.iteration;
		this.season = data.season;
	}
}
interface VipData {
	name: string;
	value: number;
	vip_message: string;
	result_message: string;
}

export class Vip {
	name: string;
	value: number;
	vip_message: string;
	result_message: string;

	constructor(route: Route) {
		const vips: VipData[] = [
			{
				name: 'Sauli Niinistö',
				value: 1000,
				vip_message: `I need to get to ${route.arrival_airport.name} with Jenni.`,
				result_message: 'You got 1000€ from Finnish valtion kassa'
			},
			{
				name: 'Vladimir Putin',
				value: -2000,
				vip_message: `I need help with warcrimes at ${route.arrival_airport.name}`,
				result_message: 'The UN has fined you 2000€ for collaborating with a known war criminal'
			}
		];

		const vip = vips[Math.floor(Math.random() * vips.length)];

		this.name = vip.name;
		this.value = vip.value;
		this.vip_message = vip.vip_message;
		this.result_message = vip.result_message;
	}
}
