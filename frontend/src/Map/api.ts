const baseURL = 'http://localhost:5000';

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
