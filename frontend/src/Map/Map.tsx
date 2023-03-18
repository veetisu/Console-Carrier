import React, {useState, useEffect} from 'react';
import {MapContainer, TileLayer, Marker, Popup, useMap} from 'react-leaflet';
import L, {latLngBounds, LatLngBoundsLiteral} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {fetchAirports, fetchAirportCoords, fetchRoute} from './api';
import Navbar from '../components/TopBar/TopBar';
import './Map.css';
import TrackingMarker from './TrackingMarker';

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
	const [airports, setAirports] = useState([]);
	const [position, setPosition] = useState<[number, number] | undefined>(undefined);
	const [center, setCenter] = useState<[number, number]>([45.4, -75.7]);
	const maxBounds: LatLngBoundsLiteral = [
		[-90, -180],
		[90, 180]
	];

	const [route, setRoute] = useState<any>(null);

	useEffect(() => {
		const getRoute = async () => {
			const routeData = await fetchRoute();
			setRoute(routeData);
			console.log(routeData);
		};
		getRoute();
	}, []);

	useEffect(() => {
		const getAirportPosition = async () => {
			const coords = await fetchAirportCoords('EFHK');
			setPosition(coords);
			setCenter(coords);
		};
		getAirportPosition();
	}, []);
	useEffect(() => {
		const getAirports = async () => {
			const fetchedAirports = await fetchAirports();
			setAirports(fetchedAirports);
		};
		getAirports();
	}, []);

	return (
		<>
			<Navbar />
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
					const {latitude, longitude} = airport;
					return (
						<Marker position={[latitude, longitude]} icon={customIcon}>
							<Popup></Popup>
						</Marker>
					);
					var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
						maxZoom: 20,
						attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
					});
				})}
				{route && <TrackingMarker positions={[route.departure_coords, route.arrival_coords]} icon={airplaneIcon} transitionTime={route.flight_time * 1000} />}
			</MapContainer>
		</>
	);
}

export default App;
