// TrackingMarker.tsx
import React from 'react';
import {Marker} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
import styled from 'styled-components';
import Velocity from 'velocity-animate';

function getHeading(fromLatLng, toLatLng) {
	const fromLat = (fromLatLng.lat * Math.PI) / 180;
	const fromLng = (fromLatLng.lng * Math.PI) / 180;
	const toLat = (toLatLng.lat * Math.PI) / 180;
	const toLng = (toLatLng.lng * Math.PI) / 180;

	const y = Math.sin(toLng - fromLng) * Math.cos(toLat);
	const x = Math.cos(fromLat) * Math.sin(toLat) - Math.sin(fromLat) * Math.cos(toLat) * Math.cos(toLng - fromLng);
	const bearing = Math.atan2(y, x);

	return (bearing * 180) / Math.PI;
}
interface TrackingMarkerProps {
	positions: L.LatLngExpression[];
	icon: L.Icon;
	transitionTime: number;
	disappear: boolean;
}
function easeInOutQuad(t) {
	return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const TrackingMarker: React.FC<TrackingMarkerProps> = ({positions, icon, transitionTime}) => {
	const [currentPosition, setCurrentPosition] = React.useState(positions[0]);
	const markerRef = React.useRef<L.Marker | null>(null);

	React.useEffect(() => {
		if (positions.length > 1) {
			const startPos = L.latLng(positions[0]);
			const endPos = L.latLng(positions[1]);

			const markerElement = document.createElement('div');

			Velocity(
				markerElement,
				{
					tween: [1, 0]
				},
				{
					duration: transitionTime,
					easing: 'linear',
					progress: (elements, complete, remaining, start, tweenValue) => {
						const newLat = lerp(startPos.lat, endPos.lat, tweenValue);
						const newLng = lerp(startPos.lng, endPos.lng, tweenValue);
						setCurrentPosition([newLat, newLng]);
					}
				}
			);
		}
	}, [positions, transitionTime]);

	// Calculate the heading and apply rotation to the icon
	if (markerRef.current && positions.length > 1) {
		const startPos = L.latLng(positions[0]);
		const endPos = L.latLng(positions[1]);
		const heading = getHeading(startPos, endPos);
		const markerIcon = markerRef.current.getElement();
		markerRef.current.setRotationAngle(heading - 45);
	}

	return (
		<div>
			<Marker
				ref={markerRef}
				position={currentPosition}
				icon={icon}
				zIndexOffset={1000} // Ensures the marker stays on top
			/>
		</div>
	);
};

export default TrackingMarker;