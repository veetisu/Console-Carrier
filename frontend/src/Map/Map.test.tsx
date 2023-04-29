import {render, fireEvent, waitFor, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import Map from './Map';
import * as api from './api';

// Mock the API functions
jest.mock('./api', () => ({
	...jest.requireActual('./api'),
	fetchAirports: jest.fn(),
	fetchAirportCoords: jest.fn(),
	fetchRoute: jest.fn(),
	fetchCarrier: jest.fn(),
	postFly: jest.fn(),
	getLanding: jest.fn()
}));

// Test if the Map component renders without crashing
test('renders Map component', () => {
	render(<Map />);
});

// Test if the "FLY" button is present
test('renders FLY button', () => {
	render(<Map />);
	const flyButton = screen.getByText('FLY');
	expect(flyButton).toBeInTheDocument();
});

// Test if the Modal opens when clicking the "FLY" button
test('opens modal on FLY button click', async () => {
	(api.fetchCarrier as jest.Mock).mockResolvedValue({
		airplanes: []
	});

	render(<Map />);
	const flyButton = screen.getByText('FLY');
	userEvent.click(flyButton);

	await waitFor(() => expect(screen.getByText('HELLO')).toBeInTheDocument());
});

// Add more tests based on your requirements and component behaviors
