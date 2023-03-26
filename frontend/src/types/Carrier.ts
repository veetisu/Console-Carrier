// Carrier.ts
import Airplane from './Airplane';
export default class Carrier {
	name: string;
	airplanes: Airplane[];
	headquarters: string;
	id: number;
	resources: number;
	fuel: number;
	money: number;

	constructor(data: any) {
		this.name = data.name;
		this.airplanes = data.airplanes.map((planeData: any) => new Airplane(planeData));
		this.headquarters = data.headquarters;
		this.id = data.id;
		this.resources = data.resources;
		this.fuel = data.fuel;
		this.money = data.money;
	}

	// Add other methods to modify the carrier object
}
