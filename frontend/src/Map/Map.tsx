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

const baseURL = 'http://127.0.0.1:5000';

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

function Map(props: MapProps) {
	const {center} = props;
	const map = useMap();
	useEffect(() => {
		map.flyTo(center, map.getZoom());
	}, [center, map]);
	return <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />;
}

function App() {
	const [airports, setAirports] = useState<Airport[]>([]);

	const [position, setPosition] = useState<[number, number] | undefined>(undefined);
	const [center, setCenter] = useState<[number, number]>([45.4, -75.7]);
	const maxBounds: LatLngBoundsLiteral = [
		[-90, -180],
		[90, 180]
	];
	const [routes, setRoutes] = useState<Route[] | null>(null);
	const [showModal, setShowModal] = useState(false);
	const [modalContent, setModalContent] = useState<string | false>(false);
	const [modalAirport, setModalAirport] = useState<Airport | false>(false);
	const [carrier, setCarrier] = useState<Carrier | null>(null);
	const [selectedPlane, setSelectedPlane] = useState<Plane | null>(null);
	const [selectedFlyPlane, setSelectedFlyPlane] = useState<Plane | false>(false);
	const [searchResults, setSearchResults] = useState<Airport[] | false>(false);
	const [destinationAirport, setDestinationAirport] = useState<Airport | false>(false);
	const [activeRoute, setActiveRoute] = useState<any | false>(false);
	const [alerts, setAlerts] = useState<string[]>([]);

	const handleRemoveAlert = (index: number) => {
		setAlerts((prevAlerts) => prevAlerts.filter((_, i) => i !== index));
	};

	useEffect(() => {
		const getCarrier = async () => {
			const carrierData = await fetchCarrier();
			console.log(carrierData);
			setCarrier(carrierData);
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
		if (destinationAirport && selectedFlyPlane) {
			postFly(selectedFlyPlane.id, selectedFlyPlane.airport.icao, destinationAirport.ident)
				.then((routeJson) => {
					const route: Route = routeJson;
					console.log();
					if (route != null) {
						setActiveRoute(route);
					} else {
						throw new Error('Invalid route object');
					}
					setTimeout(() => {
						getLanding(route.plane.id);
						setActiveRoute(false);
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

	return (
		<>
			<Navbar handleMoreFuelClick={handleMoreFuelClick} carrier={carrier} onClick={handleNavItemClick} />
			<MapContainer
				className="map-container" // Update the className to use the Map.css rule
				center={center}
				zoom={7}
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
				{activeRoute && <TrackingMarker positions={[activeRoute.departure_coords, activeRoute.arrival_coords]} icon={airplaneIcon} transitionTime={activeRoute.flight_time * 1000} />}
			</MapContainer>
			{showModal && (
				<Modal carrier={carrier} setCarrier={setCarrier} onClose={handleCloseModal} planes={carrier.airplanes} type={modalContent} airport={modalAirport} onPlaneSelect={handlePlaneSelect} selectedFlyPlane={selectedFlyPlane} setSelectedFlyPlane={setSelectedFlyPlane} searchResults={searchResults} handleSearch={handleSearch} destinationAirport={destinationAirport} setDestinationAirport={setDestinationAirport} handleFly={handleFly} isFlyDisabled={false}>
					<div>HELLO</div>
				</Modal>
			)}
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
