import React from 'react';
import './Modal.css';
import Button from '../Button/Button';
import Airport from '../../Map/Airport';
import {useState} from 'react';
import {Form, Row, Col} from 'react-bootstrap';
import SearchBox from './SearchBox';
import {Continent, Size} from '../../types/types';
import {postSearch} from '../../Map/api';
import FuelView from './FuelView/FuelView';
import ShopView from './ShopView/ShopView';
import Carrier from '../../types/Carrier';

interface ModalProps {
	show: boolean;
	onClose: () => void;
	type: string;
	planes: any[];
	airport?: Airport;
	onPlaneSelect: (plane: Plane) => void;
	selectedFlyPlane: Plane;
	setSelectedFlyPlane: (plane: Plane) => void;
	searchResults: Airport[];
	handleSearch: (searchResults: any) => void;
	destinationAirport: Airport;
	setDestinationAirport: (airport: Airport) => void;
	handleFly: () => void;
	carrier: any;
	setCarrier: (carrier: Carrier) => void;
	isFlyDisabled: boolean;
}

export interface Plane {
	id: string;
	type: string;
	name: string;
	airport: {
		id: number;
		icao: string;
		type: string;
		name: string;
		latitude: number;
		longitude: number;
		elevation_feet: number;
		continent: string;
		iso_country: string;
		iso_region: string;
		municipality: string;
		country_name: string;
	};
	carrier_id: number;
	range: number;
	type_name: string;
	fuel_consumption: number;
	passenger_capacity: number;
	cruise_speed: number;
}

function handleClick(plane: Plane) {}
const Modal: React.FC<ModalProps> = ({onClose, type, planes, airport, onPlaneSelect, selectedFlyPlane, setSelectedFlyPlane, searchResults, handleSearch, destinationAirport, setDestinationAirport, handleFly, carrier, setCarrier, isFlyDisabled}) => {
	return (
		<div className="modal mx-0">
			<div className="modal-content">
				<button onClick={onClose} className="close-button btn btn-danger">
					X
				</button>
				{type === 'planes' &&
					planes.map((plane: Plane) => {
						return (
							<div className="plane d-flex flex-row align-items-center border rounded mb-3 p-3">
								<div className="image-container">
									<img src={`../img/planes/${plane.type}.png`} alt="" className="img-fluid" style={{maxWidth: '25vw'}} />
								</div>
								<div className="stats-container">
									<h5 className="mb-1">{plane.name}</h5>
									<div className="d-flex flex-row">
										<div className="w-50 d-flex flex-column">
											<div>
												<span className="text-nowrap me-2">Type:</span>
												<span>{plane.type_name}</span>
											</div>
											<div>
												<span className="text-nowrap me-2">Range:</span>
												<span>{plane.range} km</span>
											</div>
										</div>
										<div className="w-50 d-flex flex-column">
											<div>
												<span className="text-nowrap me-2">Passenger Capacity:</span>
												<span>{plane.passenger_capacity}</span>
											</div>
										</div>
									</div>
								</div>
								<div className="location-container ms-auto">
									<div>
										<strong>Location:</strong>
									</div>
									<div>{plane.airport.name}</div>
									<div>({plane.airport.icao})</div>
								</div>
							</div>
						);
					})}

				{type === 'airport' && (
					<div>
						{Object.keys(airport).map((key) => (
							<div key={key}>
								{key}: {airport[key]}
							</div>
						))}
					</div>
				)}
				{type === 'flight_selection' && (
					<div className="w-100">
						<div className="w-50"></div>
						<div className="w-50"></div>
					</div>
				)}
				{type === 'fly' && (
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
							<SearchBox onSearch={handleSearch}></SearchBox>
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
				)}
				{type === 'fuel' && <FuelView onCarrierUpdated={setCarrier} fuelPrice={2} carrier={carrier} onBuyMoreFuel={() => console.log('F')} />}
				{type === 'shop' && <ShopView></ShopView>}
			</div>
		</div>
	);
};

export default Modal;
