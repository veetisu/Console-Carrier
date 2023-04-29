// Carrier.ts
import Airplane from './Airplane';
import {Route} from './Airplane';
export default class Carrier {
	name: string;
	airplanes: Airplane[];
	headquarters: string;
	id: number;
	resources: number;
	fuel: number;
	money: number;
	active_routes: {[planeId: number]: Route};

	constructor(data: any) {
		this.name = data.name;
		this.airplanes = data.airplanes.map((planeData: any) => new Airplane(planeData));
		this.headquarters = data.headquarters;
		this.id = data.id;
		this.resources = data.resources;
		this.fuel = data.fuel;
		this.money = data.money;

		// Check if active_routes exists, otherwise set it to an empty object
		const activeRoutesData = data.active_routes ? data.active_routes : {};
		this.active_routes = Object.values(activeRoutesData).map((routeData: any) => new Route(routeData));
	}

	// Add other methods to modify the carrier object
}
