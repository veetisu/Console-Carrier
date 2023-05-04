import React from 'react';
import './Modal.css';
import Button from '../Button/Button';
import Airport from '../../types/Airport';
import {useState} from 'react';
import {Form, Row, Col} from 'react-bootstrap';
import SearchBox from './SearchBox';
import {Continent, Size} from '../../types/types';
import {postSearch} from '../../Map/api';
import FuelView from './FuelView/FuelView';
import ShopView from './ShopView/ShopView';
import Carrier from '../../types/Carrier';
import RouteView from './RouteView/ActiveRoutesList';
import {Routes} from 'react-router-dom';
import {Route} from '../../types/Airplane';
import PlanesView from './PlanesView/PlanesView';
import ActiveRoutesList from './RouteView/ActiveRoutesList';
import FlyView from './FlyView/FlyView';

interface ModalProps {
	show: boolean;
	onClose: () => void;
	type: string;
	planes: any[];
	airport?: Airport | false;
	onPlaneSelect: (plane: Plane) => void;
	selectedFlyPlane: Plane | false;
	setSelectedFlyPlane: (plane: Plane) => void;
	searchResults: Airport[] | false;
	handleSearch: (searchResults: any) => void;
	destinationAirport: Airport | false;
	setDestinationAirport: (airport: Airport) => void;
	handleFly: () => void;
	carrier: any;
	setCarrier: (carrier: Carrier) => void;
	isFlyDisabled: boolean;
	onContinuousChange: (value: boolean) => void;
	routes: {[planeId: number]: Route};
	removeRoute: (planeId: number) => void;
	handleRouteRemoval: (planeId: number) => void;
	ticketPrice: number;
	setTicketPrice: (ticketPrice: number) => void;
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
const Modal: React.FC<ModalProps> = ({ticketPrice, setTicketPrice, handleRouteRemoval, onContinuousChange, onClose, type, planes, airport, onPlaneSelect, selectedFlyPlane, setSelectedFlyPlane, searchResults, handleSearch, destinationAirport, setDestinationAirport, handleFly, carrier, setCarrier, isFlyDisabled, routes}) => {
	return (
		<div className="modal mx-0">
			<div className="modal-content">
				<button onClick={onClose} className="close-button btn btn-danger">
					X
				</button>

				{type === 'planes' && <PlanesView setCarrier={setCarrier} planes={planes} />}

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
				{type === 'fly' && <FlyView ticketPrice={ticketPrice} setTicketPrice={setTicketPrice} planes={planes} setSelectedFlyPlane={setSelectedFlyPlane} selectedFlyPlane={selectedFlyPlane} handleSearch={handleSearch} onContinuousChange={onContinuousChange} searchResults={searchResults} setDestinationAirport={setDestinationAirport} destinationAirport={destinationAirport} handleFly={handleFly} isFlyDisabled={isFlyDisabled} />}
				{type === 'fuel' && <FuelView onCarrierUpdated={setCarrier} fuelPrice={2} carrier={carrier} onBuyMoreFuel={() => console.log('F')} />}
				{type === 'shop' && <ShopView setCarrier={setCarrier}></ShopView>}
				{type == 'routes' && <RouteView routes={routes} removeRoute={handleRouteRemoval} />}
			</div>
		</div>
	);
};

export default Modal;
