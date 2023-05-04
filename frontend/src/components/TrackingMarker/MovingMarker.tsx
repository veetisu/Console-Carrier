import {useEffect, useRef, useState} from 'react';
import {Marker, useMap} from 'react-leaflet';
import L from 'leaflet';

interface MovingMarkerProps {
	departure: [number, number];
	arrival: [number, number];
	duration: number;
	markerId: string;
}

const MovingMarker = (props: MovingMarkerProps) => {
	const {departure, arrival, duration, markerId} = props;
	const [currentPosition, setCurrentPosition] = useState<[number, number]>(departure);
	const [rotation, setRotation] = useState(0);
	const map = useMap();
	const animationState = useRef<Map<string, {startTimestamp: number | null}>>(new Map());

	const customIcon = L.divIcon({
		className: 'custom-marker-icon',
		html: `<img src="./../../../img/blue-plane.png" style="transform: rotate(${rotation}deg); width: 38px; height: 38px;" />`,
		iconSize: [38, 38],
		iconAnchor: [19, 19],
		popupAnchor: [0, -19]
	});

	useEffect(() => {
		customIcon.options.html = `<img src="./../../../img/blue-plane.png" style="transform: rotate(${rotation}deg); width: 38px; height: 38px;" />`;
	}, [rotation]);

	useEffect(() => {
		const [startLat, startLng] = departure;
		const [endLat, endLng] = arrival;

		const animateMarker = (timestamp: number) => {
			if (!animationState.current.has(markerId)) {
				animationState.current.set(markerId, {startTimestamp: timestamp});
			}

			const markerState = animationState.current.get(markerId);

			if (markerState && markerState.startTimestamp) {
				const deltaTime = timestamp - markerState.startTimestamp;
				const progress = deltaTime / duration;

				if (progress >= 1) {
					setCurrentPosition(arrival);
				} else {
					const newLat = startLat + (endLat - startLat) * progress;
					const newLng = startLng + (endLng - startLng) * progress;
					const bearing = calculateBearing(startLat, startLng, newLat, newLng);

					setCurrentPosition([newLat, newLng]);
					setRotation(bearing);

					requestAnimationFrame(animateMarker);
				}
			}
		};

		requestAnimationFrame(animateMarker);

		return () => {
			// Clean up any pending requestAnimationFrame
			if (animationState.current.has(markerId)) {
				animationState.current.delete(markerId);
			}
		};
	}, [departure, arrival, duration, markerId, map]);

	return <Marker position={currentPosition} icon={customIcon} />;
};

function calculateBearing(startLat: number, startLng: number, endLat: number, endLng: number): number {
	const lat1 = startLat * (Math.PI / 180);
	const lat2 = endLat * (Math.PI / 180);
	const dLng = (endLng - startLng) * (Math.PI / 180);

	const y = Math.sin(dLng) * Math.cos(lat2);
	const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
	const bearing = Math.atan2(y, x) * (180 / Math.PI);

	return (bearing + 315) % 360;
}

export default MovingMarker;
