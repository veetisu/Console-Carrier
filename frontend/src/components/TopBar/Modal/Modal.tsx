import React from 'react';
import './Modal.css';
import Button from '../../Button';
import Airport from '../../../Map/Airport';

interface ModalProps {
	show: boolean;
	onClose: () => void;
	type: string;
	planes: any[];
	airport?: Airport;
	onPlaneSelect: (plane: Plane) => void;
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

const Modal: React.FC<ModalProps> = ({onClose, type, planes, airport, onPlaneSelect}) => {
	return (
		<div className="modal">
			<div className="modal-content">
				<button onClick={onClose} className="close-button">
					Close
				</button>
				{type === 'planes' &&
					planes.map((plane: Plane) => {
						return (
							<div className="plane">
								<div className="image-container">
									<img className="" src={`../img/planes/${plane.type}.png`} alt="" />
								</div>
								<div className="stats-container w-50">
									<div>Range: {plane.range}</div>
									<div>Passenger Capacity: {plane.passenger_capacity}</div>
									<div>Name: {plane.name}</div>
								</div>
								<div className="stats-container w-25">
									<Button onClick={() => onPlaneSelect(plane)}>Fly</Button>
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
			</div>
		</div>
	);
};

export default Modal;
