import {useEffect, useState} from 'react';
import {Marker, useMap} from 'react-leaflet';

interface MovingMarkerProps {
	departure: [number, number];
	arrival: [number, number];
	duration: number;
}

const MovingMarker = (props: MovingMarkerProps) => {
	const {departure, arrival, duration} = props;

	const [currentPosition, setCurrentPosition] = useState<[number, number]>(departure);
	const map = useMap();

	useEffect(() => {
		const [startLat, startLng] = currentPosition;
		const [endLat, endLng] = arrival;
		const stepLat = (endLat - startLat) / duration;
		const stepLng = (endLng - startLng) / duration;

		let progress = 0;
		let lastTimestamp = Date.now();

		const intervalId = setInterval(() => {
			const now = Date.now();
			const deltaTime = now - lastTimestamp;
			lastTimestamp = now;

			progress += deltaTime;

			if (progress >= duration) {
				setCurrentPosition(arrival);
				clearInterval(intervalId);
			} else {
				const newLat = startLat + stepLat * progress;
				const newLng = startLng + stepLng * progress;

				setCurrentPosition([newLat, newLng]);
			}
		}, 16); // Run the interval at 60 FPS (1000 ms / 60 = 16 ms)

		return () => {
			clearInterval(intervalId);
		};
	}, [currentPosition, departure, arrival, duration, map]);

	return <Marker position={currentPosition} />;
};

export default MovingMarker;
