import {fetchAirports} from './api';
import Airport from '../types/Airport';
export async function createAirportObjects(): Promise<Airport[]> {
	const airportsData = await fetchAirports();
	const airports = airportsData.map((airportData) => new Airport(...Object.values(airportData)));
	return airports;
}
