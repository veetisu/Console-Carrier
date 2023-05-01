// ActiveRoutesList.tsx
import React from 'react';
import {ListGroup, Button, Row, Col} from 'react-bootstrap';
import {Route} from '../../../types/Airplane';

interface ActiveRoutesListProps {
	routes: {[planeId: string]: Route};
	removeRoute: (planeId: number) => void;
}

const ActiveRoutesList: React.FC<ActiveRoutesListProps> = ({routes, removeRoute}) => {
	return (
		<ListGroup className="active-routes-list">
			{Object.entries(routes).map(([planeId, route]) => (
				<ListGroup.Item key={planeId}>
					<Row>
						<Col>
							<strong>Plane ID:</strong> {planeId}
							<br />
							<strong>Departure:</strong> {route.departure_coords.join(', ')}
							<br />
							<strong>Arrival:</strong> {route.arrival_coords.join(', ')}
							<br />
							<strong>Flight Time:</strong> {route.flight_time} seconds
						</Col>
						<Col className="text-right">
							<Button variant="danger" onClick={() => removeRoute(parseInt(planeId))}>
								Remove
							</Button>
						</Col>
					</Row>
				</ListGroup.Item>
			))}
		</ListGroup>
	);
};

export default ActiveRoutesList;
