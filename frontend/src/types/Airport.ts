interface Airport {
	id: number;
	ident: string;
	type: string;
	name: string;
	latitude_deg: number;
	longitude_deg: number;
	elevation_ft: number;
	continent: string;
	iso_country: string;
	iso_region: string;
	municipality: string;
	scheduled_service: string;
	gps_code: string;
	iata_code: string;
	local_code: string;
	home_link: string;
	wikipedia_link: string;
	keywords: string;
}

class Airport {
	constructor(public id: number, public ident: string, public type: string, public name: string, public latitude_deg: number, public longitude_deg: number, public elevation_ft: number, public continent: string, public iso_country: string, public iso_region: string, public municipality: string, public scheduled_service: string, public gps_code: string, public iata_code: string, public local_code: string, public home_link: string, public wikipedia_link: string, public keywords: string) {
		this.id = id;
		this.ident = ident;
		this.type = type;
		this.name = name;
		this.latitude_deg = latitude_deg;
		this.longitude_deg = longitude_deg;
		this.elevation_ft = elevation_ft;
		this.continent = continent;
		this.iso_country = iso_country;
		this.iso_region = iso_region;
		this.municipality = municipality;
		this.scheduled_service = scheduled_service;
		this.gps_code = gps_code;
		this.iata_code = iata_code;
		this.local_code = local_code;
		this.home_link = home_link;
		this.wikipedia_link = wikipedia_link;
		this.keywords = keywords;
	}
}
export default Airport;
