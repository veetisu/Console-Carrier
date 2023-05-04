import React, {useEffect} from 'react';
import {Plane} from '../Modal';
import SearchBox from '../SearchBox';
import {fetchRouteData} from '../../../Map/api';

interface FlyViewProps {
	planes: Plane[];
	setSelectedFlyPlane: (plane: Plane) => void;
	selectedFlyPlane: Plane | false;
	handleSearch: (searchResults: any) => void;
	onContinuousChange: (value: boolean) => void;
	searchResults: any[] | false;
	setDestinationAirport: (airport: any) => void;
	destinationAirport: any | false;
	handleFly: () => void;
	isFlyDisabled: boolean;
	ticketPrice: number;
	setTicketPrice: (ticketPrice: number) => void;
}

const FlyView: React.FC<FlyViewProps> = ({ticketPrice, setTicketPrice, planes, setSelectedFlyPlane, selectedFlyPlane, handleSearch, onContinuousChange, searchResults, setDestinationAirport, destinationAirport, handleFly, isFlyDisabled}) => {
	const [estimatedMoneyPerFlight, setEstimatedMoneyPerFlight] = React.useState(0);
	const [potentialPassengers, setPotentialPassengers] = React.useState(0);
	const [routeLengthKm, setRouteLengthKm] = React.useState(0);
	const [routeLengthMinutes, setRouteLengthMinutes] = React.useState(0);
	const [fuelRequired, setFuelRequired] = React.useState(0);
	const [season, setSeason] = React.useState('Summer');

	const fetchTicketPriceData = async (price: number) => {
		try {
			const currentTime = Date.now();
			if (selectedFlyPlane && destinationAirport && currentTime - lastApiCall.current >= 500) {
				const response = await fetchRouteData(selectedFlyPlane.airport.icao, destinationAirport.ident, ticketPrice, selectedFlyPlane.id);

				setEstimatedMoneyPerFlight(response.data.total_money);
				setPotentialPassengers(response.data.potential_passengers);
				setRouteLengthKm(response.data.route_length_km);
				setRouteLengthMinutes(response.data.route_length_minutes);
				setFuelRequired(response.data.fuel_required);
				setSeason(response.data.season);

				lastApiCall.current = currentTime;
			}
		} catch (error) {
			console.error('Error in fetchTicketPriceData:', error.message);
		}
	};

	const lastApiCall = React.useRef<number>(0);

	const handleTicketPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newTicketPrice = Number(event.target.value);
		setTicketPrice(newTicketPrice);
		fetchTicketPriceData(newTicketPrice);
	};

	return (
		<div className="row h-100">
			<div className="col-md-6 fly-plane-select">
				<div className="dropdown">
					<a className="btn btn-secondary dropdown-toggle w-100" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
						Select a plane
					</a>{' '}
					<ul className="dropdown-menu w-90">
						{planes.map((plane: Plane) => {
							return (
								<li>
									<a
										className="dropdown-item"
										onClick={() => {
											setSelectedFlyPlane(plane);
										}}
									>
										Type: {plane.type_name}
										<br></br>
										Currently in: {plane.airport.name}
									</a>
								</li>
							);
						})}
					</ul>
					{selectedFlyPlane && (
						<div className="row">
							<div className="col-12">
								<h5>Selected plane:</h5>
							</div>
							<div className="col-12 col-md-6 ">
								<strong>{selectedFlyPlane.type_name}</strong>
							</div>
							<img className="" src={`../img/planes/${selectedFlyPlane.type}.png`} alt="" />
							<div className="col-12 col-md-6 ">
								<div>
									<strong>Currently at:</strong> {selectedFlyPlane.airport.name}
								</div>
								<div>
									<strong>Range:</strong> {selectedFlyPlane.range}
								</div>
								<div>
									<strong>Passenger Capacity:</strong> {selectedFlyPlane.passenger_capacity}
								</div>
								<div>
									<strong>Name:</strong> {selectedFlyPlane.name}
								</div>
							</div>
						</div>
					)}
					<strong>
						<h3 className="selected-header">Selected: </h3>
					</strong>
					<span className="w-75 airport-name">{destinationAirport ? <h3>{destinationAirport.name}</h3> : <h3>Select destination airport</h3>}</span>
					{destinationAirport && (
						<div>
							<div>
								<strong>Estimated money per flight: </strong> {estimatedMoneyPerFlight.toFixed(2)}
							</div>
							<div>
								<strong>Potential passengers: </strong> {potentialPassengers}
							</div>
							<div>
								<strong>Route length in km: </strong> {routeLengthKm.toFixed(2)}
							</div>
							<div>
								<strong>Route length in minutes: </strong> {routeLengthMinutes.toFixed(2)}
							</div>
							<div>
								<strong>Fuel required: </strong> {fuelRequired.toFixed(2)}
							</div>
							<div>
								<strong>Season: </strong> {season}
							</div>
							<label htmlFor="ticketPrice">Ticket Price:</label>
							<input type="range" id="ticketPrice" name="ticketPrice" min="0" max="1000" step="10" value={ticketPrice} onChange={handleTicketPriceChange} />
							<span>{ticketPrice}</span>
						</div>
					)}
				</div>
			</div>
			<div className="col-md-6 h-100">
				<SearchBox onSearch={handleSearch} onContinuousChange={onContinuousChange}></SearchBox>
				<div className="scrollable-content">
					<div className="list-group mt-3">
						{searchResults &&
							searchResults.map((airport) => {
								return (
									<div key={airport.id} className="list-group-item btn btn-primary" onClick={() => setDestinationAirport(airport)}>
										<div className="row">
											<div className="col-6">
												<strong>Name:</strong> {airport.name}
											</div>
											<div className="col-3">
												<strong>Type:</strong> {airport.type}
											</div>
											<div className="col-3">
												<strong>Country:</strong> {airport.iso_country}
											</div>
										</div>
									</div>
								);
							})}
					</div>
				</div>
				<div className="mt-4">
					<button disabled={isFlyDisabled} onClick={handleFly} className="btn btn-primary float-end mr-6 mb-4">
						Fly
					</button>
				</div>
			</div>
		</div>
	);
};

export default FlyView;
