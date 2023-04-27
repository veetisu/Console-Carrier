import {fetchAirports} from '../api';

// Mock the fetch function to return a predefined response
global.fetch = jest.fn(() =>
	Promise.resolve({
		json: () => Promise.resolve([{code: 'JFK', name: 'John F. Kennedy International Airport'}])
	})
);

describe('API tests', () => {
	afterEach(() => {
		// Clear all mocks after each test
		jest.clearAllMocks();
	});

	it('fetchAirports should return an array of airports', async () => {
		const airports = await fetchAirports();

		expect(airports).toEqual([{code: 'JFK', name: 'John F. Kennedy International Airport'}]);
		expect(fetch).toHaveBeenCalledTimes(1);
		expect(fetch).toHaveBeenCalledWith('http://localhost:5000/airports');
	});
});
