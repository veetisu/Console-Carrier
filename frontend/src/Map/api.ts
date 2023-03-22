const baseURL = 'http://localhost:5000';
import {Plane} from '../components/TopBar/Modal/Modal';

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
export const fetchCarrier = async () => {
	try {
		const response = await fetch('http://127.0.0.1:5000/carrier');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching route:', error);
	}
};

export const postRoute = (departure: string, arrival: string, plane_id: string) => {
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({departure: departure, arrival: arrival, plane_id: plane_id})
	};

	fetch('http://localhost:5000/post-route', requestOptions)
		.then((response) => response.json())
		.then((data) => console.log(data))
		.catch((error) => console.error(error));
};
export const postSearch = (plane: Plane, typeFilter: string[]) => {
	const requestOptions = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify({range: plane.range})
	};

	fetch('http://localhost:5000/post-route', requestOptions)
		.then((response) => response.json())
		.then((data) => console.log(data))
		.catch((error) => console.error(error));
};
