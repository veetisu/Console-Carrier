import React, {useState, useEffect} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import L, {latLngBounds, LatLngBoundsLiteral} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {fetchAirports, fetchAirportCoords, fetchRoute, fetchCarrier, postFly, getLanding} from './api';
import Navbar from '../components/NavBar/NavBar';
import './Map.css';
import TrackingMarker from '../components/TrackingMarker/TrackingMarker';
import Modal from '../components/Modal/Modal';
import Airport from '../types/Airport';
import Button from '../components/Button/Button';
import {Plane} from '../components/Modal/Modal';
import CustomAlert from '../components/Alert/Alert';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {Route} from './../types/Airplane';

import 'bootstrap/dist/css/bootstrap.css';
import Carrier from '../types/Carrier';
import {createAirportObjects} from './App';

import MovingMarker from '../components/TrackingMarker/MovingMarker';

const baseURL = 'http://127.0.0.1:5000';
const ENV = 'dev';

interface Marker {
	geocode: [number, number];
	popUp: string;
}

const customIcon = L.icon({
	iconUrl: 'img/airport.png',
	iconSize: [46, 46]
});
const airplaneIcon = L.icon({
	iconUrl: 'img/black-plane.png',
	iconSize: [46, 46],
	iconAnchor: [23, 23]
});

interface MapProps {
	center: [number, number];
}

function Map({center}: MapProps) {
	const map = useMap();
	useEffect(() => {
		map.flyTo(center, map.getZoom());
	}, [center, map]);
	return <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />;
}

interface AirportMarkerProps {
	airport: Airport;
	selectedPlane: Plane | null;
	handleAirportMarkerClick: (airport: Airport) => void;
	handleFly: (airport: Airport) => void;
}

function AirportMarker({airport, selectedPlane, handleAirportMarkerClick, handleFly}: AirportMarkerProps) {
	const latitude = airport.latitude_deg;
	const longitude = airport.longitude_deg;
	return (
		<Marker position={[latitude, longitude]} icon={customIcon}>
			<Popup>
				{airport.name}
				<br />
				{selectedPlane ? <Button onClick={() => handleFly(airport)}>Fly here</Button> : <Button onClick={() => handleAirportMarkerClick(airport)}>More</Button>}
			</Popup>
		</Marker>
	);
}

function App() {
	const [airports, setAirports] = useState<Airport[]>([]);

	const [position, setPosition] = useState<[number, number] | undefined>(undefined);
	const [center, setCenter] = useState<[number, number]>([50.1109, 10.258]);
	const maxBounds: LatLngBoundsLiteral = [
		[-90, -180],
		[90, 180]
	];

	const [routes, setRoutes] = useState<{[planeId: number]: Route}>({});
	const [showModal, setShowModal] = useState(false);
	const [modalContent, setModalContent] = useState<string | false>(false);
	const [modalAirport, setModalAirport] = useState<Airport | false>(false);
	const [carrier, setCarrier] = useState<Carrier | null>(null);
	const [selectedPlane, setSelectedPlane] = useState<Plane | null>(null);
	const [selectedFlyPlane, setSelectedFlyPlane] = useState<Plane | false>(false);
	const [searchResults, setSearchResults] = useState<Airport[] | false>(false);
	const [destinationAirport, setDestinationAirport] = useState<Airport | false>(false);
	const [alerts, setAlerts] = useState<string[]>([]);
	const [isFlyDisabled, setIsFlyDisabled] = useState(false);
	const [isContinuous, setIsContinuous] = useState(false);

	const handleRemoveAlert = (index: number) => {
		setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
	};

	useEffect(() => {
		const getCarrier = async () => {
			const carrierData = await fetchCarrier();
			if (carrierData !== null) {
				console.log(carrierData);
				setCarrier(carrierData);
			} else {
				console.error('Error fetching carrier data');
			}
		};

		getCarrier();
	}, []);

	const handleNavItemClick = (type: string) => {
		setShowModal(true);
		setModalContent(type);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setModalContent(false);
	};
	const handleAirportMarkerClick = (airport: Airport) => {
		setShowModal(true);
		setModalContent('airport');
		setModalAirport(airport);
	};
	const handlePlaneSelect = (plane: Plane) => {
		setSelectedPlane(plane);
		setShowModal(false);
		setModalContent('flight_selection');
	};
	const handleFly = () => {
		const flyBack = (route: Route, origin: string, destination: string) => {
			route.iteration += 1;
			postFly(parseInt(route.plane.id), origin, destination, isContinuous)
				.then((carrier: Carrier) => {
					const plane_id = parseInt(route.plane.id);
					if (carrier != null) {
						console.log('Fly response for plane', route.plane.id, ':', carrier); // Added log

						if (routes) {
							setRoutes((prevRoutes) => ({
								...prevRoutes,
								[plane_id]: carrier.active_routes[plane_id]
							}));
						}
					} else {
						throw new Error('Invalid route object');
					}
					setTimeout(() => {
						getLanding(plane_id).then((carrier) => {
							setCarrier(carrier);
						});
						if (route.continous) {
							flyBack(route, destination, origin);
						}
					}, route.flight_time * 1000);
				})
				.catch((error) => {
					console.error('Error in flyBack:', error);
					setAlerts((prevAlerts) => [...prevAlerts, 'Error flying plane back']);
				});
		};

		if (destinationAirport && selectedFlyPlane) {
			postFly(parseInt(selectedFlyPlane.id), selectedFlyPlane.airport.icao, destinationAirport.ident, isContinuous)
				.then((carrier: Carrier) => {
					const route = carrier.active_routes[selectedFlyPlane.id];
					if (route != null) {
						console.log('Fly response for plane', selectedFlyPlane.id, ':', route); // Added log
						setCarrier(carrier);
						setRoutes(carrier.active_routes);
					} else {
						throw new Error('Invalid route object');
					}
					setTimeout(() => {
						getLanding(parseInt(route.plane.id)).then((carrier) => {
							setCarrier(carrier);
						});
						if (route.continous) {
							flyBack(route, destinationAirport.ident, selectedFlyPlane.airport.icao);
						} else {
							setRoutes((prevRoutes) => {
								if (prevRoutes) {
									// Create a copy of the previous routes object
									const updatedRoutes = {...prevRoutes};
									// Remove the flown route from the updatedRoutes object
									delete updatedRoutes[parseInt(selectedFlyPlane.id)];
									// Return the updated routes object
									return updatedRoutes;
								} else {
									return prevRoutes;
								}
							});
						}
					}, route.flight_time * 1000);
				})
				.catch((error) => {
					console.error('Error in handleFly:', error);
					setAlerts((prevAlerts) => [...prevAlerts, 'Error flying plane']);
				});
			setSelectedFlyPlane(false);
			setDestinationAirport(false);
			setModalContent(false);
			setShowModal(false);
		} else if (!selectedFlyPlane || !destinationAirport) {
			setAlerts((prevAlerts) => [...prevAlerts, 'No plane selected or destination not set']);
		}
	};

	const handleFlyButtonClick = () => {
		setShowModal(true);
		setModalContent('fly');
	};
	function handleSearch(searchResults: any) {
		setSearchResults(searchResults);
	}
	function handleMoreFuelClick(): void {
		setShowModal(true);
		setModalContent('fuel');
	}

	useEffect(() => {
		async function loadAirports() {
			const airports = await createAirportObjects();
			setAirports(airports);
		}
		loadAirports();
	}, []);
	useEffect(() => {
		function loadAirports() {
			console.log(routes);
		}
		loadAirports();
	}, [routes]);
	return (
		<>
			<Navbar handleMoreFuelClick={handleMoreFuelClick} carrier={carrier} onClick={handleNavItemClick} />
			<MapContainer
				className="map-container" // Update the className to use the Map.css rule
				center={center}
				zoom={5}
				scrollWheelZoom={true}
				minZoom={3}
				maxBounds={maxBounds}
				maxBoundsViscosity={1}
			>
				<Map center={center}></Map>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
				{position && <Marker position={position} icon={customIcon} />}
				{airports.map((airport) => {
					const latitude = airport.latitude_deg;
					const longitude = airport.longitude_deg;
					return (
						<Marker position={[latitude, longitude]} icon={customIcon}>
							<Popup>
								{airport.name}
								<br />
								{<Button onClick={() => handleAirportMarkerClick(airport)}>More</Button>}
							</Popup>
						</Marker>
					);
				})}
				{routes &&
					Object.entries(routes).map(([planeId, route]) => {
						const positions = [route.departure_coords, route.arrival_coords];
						const duration = route.flight_time * 1000;
						return <MovingMarker key={planeId} markerId={planeId} departure={positions[0]} duration={duration} arrival={positions[1]} />;
					})}
			</MapContainer>
			{showModal && <Modal show={showModal} carrier={carrier} setCarrier={setCarrier} onClose={handleCloseModal} planes={carrier?.airplanes ?? []} type={modalContent || ''} airport={modalAirport} onPlaneSelect={handlePlaneSelect} selectedFlyPlane={selectedFlyPlane} setSelectedFlyPlane={setSelectedFlyPlane} searchResults={searchResults} handleSearch={handleSearch} destinationAirport={destinationAirport} setDestinationAirport={setDestinationAirport} handleFly={handleFly} isFlyDisabled={isFlyDisabled} onContinuousChange={(value: boolean) => setIsContinuous(value)}></Modal>}
			<div className="alerts-container">
				{alerts.map((alertContent, index) => (
					<CustomAlert key={index} onClose={() => handleRemoveAlert(index)}>
						{alertContent}
					</CustomAlert>
				))}
			</div>
			<button className="floating-fly-button" onClick={handleFlyButtonClick}>
				FLY
			</button>
		</>
	);
}

export default App;
