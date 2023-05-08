import L from 'leaflet';

declare module 'leaflet' {
	export interface Marker {
		slideTo: (
			latlng: LatLngExpression,
			options?: {
				duration?: number;
				keepAtCenter?: boolean;
			}
		) => void;
	}
}
