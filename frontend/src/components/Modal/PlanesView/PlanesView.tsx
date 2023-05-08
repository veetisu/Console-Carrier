import React from 'react';
import {Plane} from '../../../types/Airplane';
import {sellPlane} from '../../../Map/api';

interface PlanesViewProps {
	planes: Plane[];
	setCarrier: (carrier: any) => void; // Add this prop for updating the carrier after a successful sell
}

const PlanesView: React.FC<PlanesViewProps> = ({planes, setCarrier}) => {
	const handleSellPlane = async (plane: Plane) => {
		const data = await sellPlane(parseInt(plane.id));
		const updatedCarrier = data['carrier'];
		if (updatedCarrier) {
			setCarrier(updatedCarrier);
			alert('Plane sold successfully.');
		} else {
			alert('Error selling plane. Please try again.');
		}
	};
	return (
		<div className="planes-view-scrollable" style={{maxHeight: '100%', overflowY: 'auto'}}>
			{planes.map((plane: Plane) => {
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
						<button onClick={() => handleSellPlane(plane)} className="sell-button btn btn-danger ms-3">
							Sell
						</button>
					</div>
				);
			})}
		</div>
	);
};

export default PlanesView;
