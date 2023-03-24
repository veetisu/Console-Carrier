import React, {useState, useEffect} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import L, {latLngBounds, LatLngBoundsLiteral} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {fetchAirports, fetchAirportCoords, fetchRoute, fetchCarrier, postRoute} from './api';
import Navbar from '../components/TopBar/NavBar';
import './Map.css';
import TrackingMarker from './TrackingMarker';
import Modal from '../components/TopBar/Modal/Modal';
import Airport from './Airport';
import Button from '../components/Button';
import {Plane} from '../components/TopBar/Modal/Modal';
import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'bootstrap/dist/css/bootstrap.css';

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

	const [route, setRoute] = useState<any>(null);
	const [showModal, setShowModal] = useState(false);
	const [modalContent, setModalContent] = useState<string | undefined>(undefined);
	const [modalAirport, setModalAirport] = useState<Airport | undefined>(undefined);
	const [carrier, setCarrier] = useState<object | null>(null);
	const [selectedPlane, setSelectedPlane] = useState<Plane | null>(null);
	const [selectedFlyPlane, setSelectedFlyPlane] = useState<Plane | null>(null);
	const [searchResults, setSearchResults] = useState<Airport[] | false>(false);
	const [destinationAirport, setDestinationAirport] = useState<Airport | false>(false);

	useEffect(() => {
		const getCarrier = async () => {
			const carrierData = await fetchCarrier();
			console.log(carrierData);

			setCarrier(carrierData);
		};
		getCarrier();
	}, []);

	const handleItemClick = (type: string) => {
		setShowModal(true);
		setModalContent(type);
	};

	const handleCloseModal = () => {
		setShowModal(false);
		setModalContent(undefined);
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
	const handleFly = async () => {
		const plane = selectedFlyPlane;

		try {
			const updatedCarrier = await postRoute(plane.airport.icao, destinationAirport.ident, plane.id);
			setSelectedFlyPlane(null);
			setDestinationAirport(false);
			setCarrier(updatedCarrier);
		} catch (error) {
			console.error('Error in handleFly:', error);
		}
	};
	const handleFlyButtonClick = () => {
		setShowModal(true);
		setModalContent('fly');
	};
	function handleSearch(searchResults: any) {
		setSearchResults(searchResults);
	}
	async function createAirportObjects(): Promise<Airport[]> {
		const airportsData = await fetchAirports();
		const airports = airportsData.map((airportData) => new Airport(...Object.values(airportData)));
		return airports;
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
			<Navbar carrier={carrier} onClick={handleItemClick} />
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
								{selectedPlane ? <Button onClick={() => handleFly(airport)}>Fly here</Button> : <Button onClick={() => handleAirportMarkerClick(airport)}>More</Button>}
							</Popup>
						</Marker>
					);
				})}
				{route && <TrackingMarker positions={[route.departure_coords, route.arrival_coords]} icon={airplaneIcon} transitionTime={route.flight_time * 1000} />}
			</MapContainer>
			{showModal && (
				<Modal onClose={handleCloseModal} planes={carrier.airplanes} type={modalContent} airport={modalAirport} onPlaneSelect={handlePlaneSelect} selectedFlyPlane={selectedFlyPlane} setSelectedFlyPlane={setSelectedFlyPlane} searchResults={searchResults} handleSearch={handleSearch} destinationAirport={destinationAirport} setDestinationAirport={setDestinationAirport} handleFly={handleFly}>
					<div>HELLO</div>
				</Modal>
			)}
			<button className="floating-fly-button" onClick={handleFlyButtonClick}>
				FLY
			</button>
		</>
	);
}

export default App;

/* useEffect(() => {
	const getAirportPosition = async () => {
		const coords = await fetchAirportCoords('EFHK');
		setPosition(coords);
		setCenter(coords);
	};
	getAirportPosition();
}, []); */
