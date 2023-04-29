import {useEffect, useRef, useState} from 'react';
import {Marker, useMap} from 'react-leaflet';

interface MovingMarkerProps {
	departure: [number, number];
	arrival: [number, number];
	duration: number;
	markerId: string;
}

const MovingMarker = (props: MovingMarkerProps) => {
	const {departure, arrival, duration, markerId} = props;
	const [currentPosition, setCurrentPosition] = useState<[number, number]>(departure);
	const map = useMap();
	const animationState = useRef<Map<string, {startTimestamp: number | null}>>(new Map());

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

					setCurrentPosition([newLat, newLng]);

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

	return <Marker position={currentPosition} />;
};

export default MovingMarker;
