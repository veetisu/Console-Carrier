const baseURL = 'http://localhost:5000';
import {Plane} from '../components/Modal/Modal';
import {Size, Continent} from './../types/types';
import Airport from './Airport';
import Carrier from '../types/carrier';

export async function fetchAirports() {
	const response = await fetch(baseURL + '/airports');
	const data = await response.json();
	return data;
}

export async function fetchAirportCoords(code: string): Promise<[number, number]> {
	const response = await fetch(baseURL + '/airport/coords/' + code);
	const data = await response.json();
	const {latitude, longitude} = JSON.parse(data.replace(/'/g, '"'));
	return [latitude, longitude];
}
export const fetchRoute = async () => {
	try {
		const response = await fetch('http://127.0.0.1:5000/route');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching route:', error);
	}
};

export const fetchCarrier = async (): Promise<Carrier> => {
	try {
		const response = await fetch('http://127.0.0.1:5000/carrier');
		const data = await response.json();
		return new Carrier(data);
	} catch (error) {
		console.error('Error fetching carrier:', error);
	}
};

export const fetchFuelPrice = async () => {
	try {
		const response = await fetch('http://127.0.0.1:5000/fuel_price');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching route:', error);
	}
};
export const fetchCfg = async () => {
	try {
		const response = await fetch(baseURL + '/cfg');
		const data = await response.json();
		console.log(data);
		return data;
	} catch (error) {
		console.error('Error fetching route:', error);
	}
};
export const postBuyFuel = (amount, carrierId) => {
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({amount: amount, carrierId: carrierId})
	};

	return fetch('http://localhost:5000/buy_fuel', requestOptions)
		.then((response) => response.json())
		.then((data) => {
			// Create a Carrier instance from the received data
			return new Carrier(data);
		})
		.catch((error) => console.error(error));
};

export const postFly = async (plane_id: number, departure: string, arrival: string, continous: boolean) => {
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({departure, arrival, continous})
	};
	try {
		const response = await fetch(`http://localhost:5000/fly/${plane_id}`, requestOptions);

		if (!response.ok) {
			throw new Error(`Error sending plane to fly: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error in postFly:', error.message);
		throw error;
	}
};
export const getLanding = async (plane_id: number): Promise<Carrier> => {
	try {
		const response = await fetch(`${baseURL}/land/${plane_id}`);

		if (!response.ok) {
			throw new Error(`Error landing plane: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return new Carrier(data);
	} catch (error) {
		console.error('Error in getLanding:', error.message);
		throw error;
	}
};

export const postSearch = async (searchTerm: string, selectedSizes: Size[], selectedContinents: Continent[]) => {
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({
			searchTerm,
			selectedSizes,
			selectedContinents
		})
	};
	try {
		const response = await fetch(`${baseURL}/search_airports`, requestOptions);
		const data = await response.json();
		const airports = data.map((airportData) => {
			return new Airport(airportData[0], airportData[1], airportData[2], airportData[3], airportData[4], airportData[5], airportData[6], airportData[7], airportData[8], airportData[9], airportData[10], airportData[11], airportData[12], airportData[13], airportData[14], airportData[15], airportData[16], airportData[17]);
		});
		return airports;
	} catch (error) {
		console.error('Error posting search:', error);
	}
};
