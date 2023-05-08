import React, {useState} from 'react';
import {ListGroup, Button, Row, Col, Modal, Tab, Tabs, ProgressBar} from 'react-bootstrap';
import {Route} from '../../../types/Airplane';
import styles from './ActiveRoutesList.module.css'; // Add this line

interface ActiveRoutesListProps {
	routes: {[planeId: string]: Route};
	removeRoute: (planeId: number) => void;
}

const ActiveRoutesList: React.FC<ActiveRoutesListProps> = ({routes, removeRoute}) => {
	const [show, setShow] = useState(false);
	const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

	const handleClose = () => {
		setShow(false);
		setSelectedRoute(null);
	};
	const handleShow = (route: Route) => {
		setSelectedRoute(route);
		setShow(true);
	};

	return (
		<>
			<ListGroup className={styles['active-routes-list']}>
				{Object.entries(routes).map(([planeId, route]) => (
					<ListGroup.Item key={planeId} className={styles['route-item']} onClick={() => handleShow(route)}>
						<Row>
							<Col>
								<h4>
									{route.plane.name} (ID: {planeId})
								</h4>
								<p>
									<strong>Departure:</strong> {route.departure_airport.name} ({route.departure_airport.icao})
									<br />
									<strong>Arrival:</strong> {route.arrival_airport.name} ({route.arrival_airport.icao})
									<br />
									<strong>Route Length:</strong> {route.route_lenght.toFixed(2)} km
									<br />
									<strong>Flight Time:</strong> {route.flight_time.toFixed(2)} minutes
								</p>
							</Col>
							<Col className="text-right">
								<div className={styles['remove-button-container']}>
									<Button variant="danger" onClick={() => removeRoute(parseInt(planeId))}>
										Remove
									</Button>
								</div>
							</Col>
						</Row>
					</ListGroup.Item>
				))}
			</ListGroup>

			{selectedRoute && (
				<Modal show={show} onHide={handleClose} size="lg">
					<Modal.Header closeButton>
						<Modal.Title>{selectedRoute.plane.name} Details</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Tabs defaultActiveKey="plane" id="route-details-tabs">
							<Tab eventKey="plane" title="Plane">
								<div className="row mt-3">
									<div className="col-4">
										<strong>Type:</strong>
										<br />
										<strong>Range:</strong>
										<br />
										<strong>Fuel Consumption:</strong>
										<br />
										<strong>Passenger Capacity:</strong>
										<br />
										<strong>Cruise Speed:</strong>
									</div>
									<div className="col">
										{selectedRoute.plane.type}
										<br />
										{selectedRoute.plane.range} km
										<br />
										{selectedRoute.plane.fuel_consumption} L/100km
										<br />
										{selectedRoute.plane.passenger_capacity} passengers
										<br />
										{selectedRoute.plane.cruise_speed} km/h
									</div>
								</div>
							</Tab>
							<Tab eventKey="departure" title="Departure Airport">
								<div className="row mt-3">
									<div className="col-4">
										<strong>Name:</strong>
										<br />
										<strong>ICAO:</strong>
										<br />
										<strong>Country:</strong>
										<br />
										<strong>Municipality:</strong>
									</div>
									<div className="col">
										{selectedRoute.departure_airport.name}
										<br />
										{selectedRoute.departure_airport.icao}
										<br />
										{selectedRoute.departure_airport.country_name}
										<br />
										{selectedRoute.departure_airport.municipality}
									</div>
								</div>
							</Tab>
							<Tab eventKey="arrival" title="Arrival Airport">
								<div className="row mt-3">
									<div className="col-4">
										<strong>Name:</strong>
										<br />
										<strong>ICAO:</strong>
										<br />
										<strong>Country:</strong>
										<br />
										<strong>Municipality:</strong>
									</div>
									<div className="col">
										{selectedRoute.arrival_airport.name}
										<br />
										{selectedRoute.arrival_airport.icao}
										<br />
										{selectedRoute.arrival_airport.country_name}
										<br />
										{selectedRoute.arrival_airport.municipality}
									</div>
								</div>
							</Tab>
							<Tab eventKey="route" title="Route">
								<div className="row mt-3">
									<div className="col-4">
										<strong>Route Length:</strong>
										<br />
										<strong>Flight Time:</strong>
										<br />
										<strong>Fuel Required:</strong>
										<br />
										<strong>Status:</strong>
									</div>
									<div className="col">
										{selectedRoute.route_lenght.toFixed(2)} km
										<br />
										{selectedRoute.flight_time.toFixed(2)} minutes
										<br />
										{selectedRoute.fuel_required} L
										<br />
										{selectedRoute.status}
									</div>
								</div>
								<div className="mt-3">
									<strong>Progress:</strong>
								</div>
							</Tab>
						</Tabs>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Close
						</Button>
					</Modal.Footer>
				</Modal>
			)}
		</>
	);
};

export default ActiveRoutesList;
