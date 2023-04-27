import {fetchAirports, fetchAirportCoords, fetchRoute, fetchCarrier, fetchFuelPrice, fetchCfg, postBuyFuel, postFly, getLanding, postSearch} from './../src/Map/api';
import {Size, Continent} from './../src/types/types';

describe('API functions', () => {
	test('fetchAirports', async () => {
		const airports = await fetchAirports();
		expect(airports).toBeDefined();
	});

	test('fetchAirportCoords', async () => {
		const coords = await fetchAirportCoords('JFK');
		expect(coords).toHaveLength(2);
	});

	test('fetchRoute', async () => {
		const route = await fetchRoute();
		expect(route).toBeDefined();
	});

	test('fetchCarrier', async () => {
		const carrier = await fetchCarrier();
		expect(carrier).toBeDefined();
	});

	test('fetchFuelPrice', async () => {
		const fuelPrice = await fetchFuelPrice();
		expect(fuelPrice).toBeDefined();
	});

	test('fetchCfg', async () => {
		const cfg = await fetchCfg();
		expect(cfg).toBeDefined();
	});

	test('postBuyFuel', async () => {
		const carrier = await postBuyFuel(10, 1);
		expect(carrier).toBeDefined();
	});

	test('postFly', async () => {
		const data = await postFly(1, 'JFK', 'LAX');
		expect(data).toBeDefined();
	});

	test('getLanding', async () => {
		const carrier = await getLanding(1);
		expect(carrier).toBeDefined();
	});
});
