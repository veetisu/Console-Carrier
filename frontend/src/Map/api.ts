const baseURL = 'http://localhost:5000/';
import {Plane} from '../components/Modal/Modal';
import {Size, Continent} from '../types/types';
import Airport from '../types/Airport';
import Carrier from '../types/Carrier';
import CustomAlert from '../components/Alert/Alert';

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
		const response = await fetch(baseURL + '/route');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching route:', error);
	}
};

export const fetchCarrier = async (): Promise<Carrier | null> => {
	try {
		const res = await fetch(`${baseURL}/carrier`);
		if (!res.ok) {
			throw new Error('Error fetching carrier data');
		}
		const data = await res.json();
		return new Carrier(data);
	} catch (error) {
		console.error('Error fetching carrier:', error);
		return null;
	}
};

export const fetchFuelPrice = async () => {
	try {
		const response = await fetch(baseURL + '/fuel_price');
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
export const postBuyFuel = (amount: number, carrierId: number) => {
	// Added types to parameters
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
	} catch (error: any) {
		console.error('Error in postFly:', error.message);
		throw error;
	}
};
export const getLanding = async (plane_id: number): Promise<Carrier | string> => {
	try {
		const response = await fetch(`${baseURL}/land/${plane_id}`);

		if (!response.ok) {
			return 'error';
			throw new Error(`Error landing plane: ${response.status} ${response.statusText}`);
		}

		const data = await response.json();
		return new Carrier(data);
	} catch (error: any) {
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
		const airports = data.map((airportData: any) => {
			// Added type to airportData parameter
			return new Airport(airportData[0], airportData[1], airportData[2], airportData[3], airportData[4], airportData[5], airportData[6], airportData[7], airportData[8], airportData[9], airportData[10], airportData[11], airportData[12], airportData[13], airportData[14], airportData[15], airportData[16], airportData[17]);
		});
		return airports;
	} catch (error) {
		console.error('Error posting search:', error);
	}
};
export async function buyPlane(model) {
	try {
		const response = await fetch(`${baseURL}/buy_plane/${model}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data = await response.json();

		if (data.success) {
			console.log(data.message);
			const carrierData = JSON.parse(data.carrier);
			const carrier = new Carrier(carrierData);
			return {success: true, carrier: carrier};
			// Update the UI to reflect the successful purchase
		} else {
			return {succes: false, message: data.message.toString()};
		}
	} catch (error) {
		console.error('Error:', error);
		return;
		alert('An error occurred while trying to buy the plane.');
	}
}
export async function sellPlane(planeId: number): Promise<{success: boolean; carrier: Carrier | null}> {
	try {
		const response = await fetch(`${baseURL}/sell_plane/${planeId}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		const data = await response.json();

		if (data.success) {
			console.log(data.message);
			const carrierData = JSON.parse(data.carrier);
			const carrier = new Carrier(carrierData);
			return {success: true, carrier: carrier};
		} else {
			return {success: false, carrier: null};
		}
	} catch (error) {
		console.error('Error:', error);
		return {success: false, carrier: null};
	}
}
export const removeRoute = async (planeId: number): Promise<Carrier | null> => {
	try {
		const response = await fetch(`${baseURL}/delete_route/${planeId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			const data = await response.json();
			return data;
		} else {
			console.error('Error removing route:', response.statusText);
			return null;
		}
	} catch (error) {
		console.error('Error removing route:', error);
		return null;
	}
};
export const createRoute = async (departure: string, arrival: string, ticket_price: number, plane_id: number, continous: boolean) => {
	try {
		const response = await fetch(`${baseURL}/create_route`, {
			method: 'POST',
			body: JSON.stringify({
				departure,
				arrival,
				ticket_price,
				plane_id,
				continous
			})
		});

		if (response.status !== 200) {
			throw new Error(`Error creating route: ${response.status} ${response.statusText}`);
		}

		return response.data;
	} catch (error) {
		console.error('Error in createRoute:', error.message);
		throw error;
	}
};
export async function fetchIsCancelled(plane_id: number): Promise<string> {
	const response = await fetch(baseURL + '/is_cancelled/' + plane_id);
	const data = await response.json();
	return data;
}
