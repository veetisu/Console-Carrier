// TrackingMarker.tsx
import React, {useEffect, useRef, useState} from 'react';
import {Marker} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-rotatedmarker';
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
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

interface TrackingMarkerProps {
	positions: L.LatLngExpression[];
	icon: L.Icon;
	transitionTime: number;
	markerId: string;
}

const TrackingMarker: React.FC<TrackingMarkerProps> = ({positions, icon, transitionTime, markerId}) => {
	const [currentPosition, setCurrentPosition] = useState(positions[0]);
	const markerRef = useRef<L.Marker | null>(null);
	const animationRef = useRef<Map<string, {requestID: number; startTime: number}>>(new Map());

	useEffect(() => {
		setCurrentPosition(positions[0]);
	}, [positions]);

	useEffect(() => {
		if (positions.length > 1) {
			const animateMarker = (timestamp) => {
				const currentAnimation = animationRef.current.get(markerId);

				if (!currentAnimation.startTime) {
					currentAnimation.startTime = timestamp;
				}

				const elapsed = timestamp - currentAnimation.startTime;
				const progress = Math.min(elapsed / transitionTime, 1);

				const startPos = L.latLng(positions[0]);
				const endPos = L.latLng(positions[1]);

				const newLat = lerp(startPos.lat, endPos.lat, progress);
				const newLng = lerp(startPos.lng, endPos.lng, progress);

				setCurrentPosition([newLat, newLng]);

				if (progress < 1) {
					currentAnimation.requestID = requestAnimationFrame(animateMarker);
				} else {
					currentAnimation.startTime = 0;
				}
			};

			const currentAnimation = animationRef.current.get(markerId);

			if (currentAnimation && currentAnimation.requestID) {
				cancelAnimationFrame(currentAnimation.requestID);
			}

			if (!currentAnimation) {
				animationRef.current.set(markerId, {requestID: 0, startTime: 0});
			}

			animationRef.current.get(markerId).requestID = requestAnimationFrame(animateMarker);
		}

		return () => {
			const currentAnimation = animationRef.current.get(markerId);
			if (currentAnimation && currentAnimation.requestID) {
				cancelAnimationFrame(currentAnimation.requestID);
			}
		};
	}, [positions, transitionTime, markerId]);

	// Calculate the heading and apply rotation to the icon
	if (markerRef.current && positions.length > 1) {
		const startPos = L.latLng(positions[0]);
		const endPos = L.latLng(positions[1]);
		const heading = getHeading(startPos, endPos);
		markerRef.current.setRotationAngle(heading - 90);
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
