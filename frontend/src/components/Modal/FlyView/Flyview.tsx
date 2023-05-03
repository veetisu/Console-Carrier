// FlyView.tsx
import React, {useEffect} from 'react';
import {Plane} from '../Modal';
import SearchBox from '../SearchBox';
import {fetchRoute} from '../../../Map/api';

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
}

const fetchRouteFromAPI = async (airport: any) => {
	// Replace this with your API call
	return {distance: 1000, duration: 120};
};

const handleTicketPriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
	setTicketPrice(Number(event.target.value));
};

const FlyView: React.FC<FlyViewProps> = ({planes, setSelectedFlyPlane, selectedFlyPlane, handleSearch, onContinuousChange, searchResults, setDestinationAirport, destinationAirport, handleFly, isFlyDisabled}) => {
	useEffect(() => {
		const route = fetchRoute();
		return () => {
			second;
		};
	}, [destinationAirport]);
	return (
		<div className="row h-100">
			<div className="col-md-6 fly-plane-select">
				<div className="dropdown">
					<a className="btn btn-secondary dropdown-toggle w-100" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
						Select a plane
					</a>

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
				<div className="mt-4 d-flex">
					<strong>
						<h3 className="selected-header">Selected: </h3>
					</strong>
					<span className="w-75 airport-name">{destinationAirport ? <h3>{destinationAirport.name}</h3> : <h3>Select destination airport</h3>}</span>
					<button disabled={isFlyDisabled} onClick={handleFly} className="btn btn-primary float-end mr-6">
						Fly
					</button>
				</div>
			</div>
		</div>
	);
};

export default FlyView;
