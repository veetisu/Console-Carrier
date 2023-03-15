import React, {useState, useEffect} from 'react';
import {MapContainer, TileLayer, Marker, useMap} from 'react-leaflet';
import {LatLng, latLng} from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';

const baseURL = 'http://127.0.0.1:5000';

function App() {
	const [position, setPosition] = useState<LatLng | undefined>(undefined);
	const [center, setCenter] = useState<[number, number]>([45.4, -75.7]);
	let map = (
		<MapContainer style={{height: '800px'}} center={center} zoom={5} scrollWheelZoom={true}>
			<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
			{position && <Marker position={position} />}
		</MapContainer>
	);
	map = useMap();
	useEffect(() => {
		const getAirportPosition = async () => {
			const response = await fetch(baseURL + '/airport/coords/EFHK');
			const data = await response.json();
			const {latitude, longitude} = JSON.parse(data.replace(/'/g, '"'));
			const coords = latLng(latitude, longitude);
			setPosition(coords);
			map.setView(coords);
		};
		getAirportPosition();
	}, []);

	return map;
}

export default App;
