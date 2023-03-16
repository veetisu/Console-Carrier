import L from 'leaflet';
import MovingMarker from 'leaflet-moving-marker';

L.Marker.movingMarker = function (latlngs, duration, options) {
	return new MovingMarker(latlngs, duration, options);
};

export default L;
