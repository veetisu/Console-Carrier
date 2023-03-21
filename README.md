# Console-Carrier
https://docs.google.com/document/d/1jTesoYxSBAfy116WPSReQsFT1pKbXyfX/edit?usp=sharing&amp;ouid=115314051075464010633&amp;rtpof=true&amp;sd=true

# Käynnistys
Projektissa on nyt erikseen backend/frontend.
### Backend
Backend palvelin käynnistetään menemällä backend hakemistoon ja ajamalla python tiedosto ```routes.py```.
### Frontend
Lataa node.js ja npm koneelle jos ei ole vielä\
Ensin omalle tietokoneelle pitää asentaa riippuvuudet komennolla ```npm i```\
Frontend käynnistetään menemällä frontend hakemistoon ja ajamalla komento```npm run dev```, jonka jälkeen sovelluksen voi avata selaimessa konsolissa näkyvällä IP:llä

# Frontend
Frontend tehty Reactilla / Typescriptillä. Kartta on tehty leaflet.js nimisellä kirjastolla. Leafletin kanssa työskentelmiseen reactissa on mukana react-leaflet kirjasto.\
Projektin hakemisto on tällä hetkellä aika sotkuinen. Perusajatus on kuitenkin että frontendin kaikki koodi löytyy hakemistosta ```./src```. Frontendin "entrypoint
on ```index.html```, johon ei kuitenkaan luultavasti tarvitse tehdä muutoksia. ```main.tsx``` sisältää eri polut sovellukselle (esim. tällä hetkellä kirjautumissivu ja itse pelin UI)\
Suurin osa relevantista koodista on ```Map.tsx``` tiedostossa. Tämä tiedosto palauttaa tiedostoon ```main.tsx```  Map elementin joka on siis käytännössä koko UI.\
React painottaa uudelleen käytettäviä komponentteja. Nämä komponentit sijaitsevat hakemistossa ```.src/components/<ComponentName>```

Tässä on pätkä ```Map.tsx``` tiedostosta/ käytännössä koko UI:n koodi. Tämä on siis vain sovelluksen näkyvä osa eikä sisällä logiikkaa toimintojen takana.

```<>
			<Navbar carrier={carrier} onClick={handleItemClick} />
			<MapContainer
				className="map-container" // Update the className to use the Map.css rule
				center={center}
				zoom={7}
				scrollWheelZoom={true}
				minZoom={3}
				maxBounds={maxBounds}
				maxBoundsViscosity={1}
			>
				<Map center={center}></Map>
				<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' />
				{position && <Marker position={position} icon={customIcon} />}

				{airports.map((airport) => {
					const latitude = airport.latitude_deg;
					const longitude = airport.longitude_deg;
					return (
						<Marker position={[latitude, longitude]} icon={customIcon}>
							<Popup>
								{airport.name}
								<br />
								{selectedPlane ? <Button onClick={() => handleFly(airport)}>Fly here</Button> : <Button onClick={() => handleAirportMarkerClick(airport)}>More</Button>}
							</Popup>
						</Marker>
					);
				})}
				{route && <TrackingMarker positions={[route.departure_coords, route.arrival_coords]} icon={airplaneIcon} transitionTime={route.flight_time * 1000} />}
			</MapContainer>
			{showModal && (
				<Modal onClose={handleCloseModal} planes={carrier.airplanes} type={modalContent} airport={modalAirport} onPlaneSelect={handlePlaneSelect}>
					<div>HELLO</div>
				</Modal>
			)}
		</>
	);
  ```
  
  Käyn nyt koodin läpi elementti kerrallaan.
  
  ### Navbar
  Sivun ylälaidassa oleva Navbar. Tämän komponentin koodi löytyy
  
  ### MapContainer
  Leafletin luoma elementti. Tämän avulla voi hallitu kartta mm. Maxzoomia ja rajoja.

### Map 
Leafletin luoma

### Tilelayer
Tämä tarkoittaa itse karttaa / sen skiniä. Linkkiä muuttamalla voi kartan ulkonäköä vaihtaa. Googlaa leaflet skins jos kiinnostaa.

### TrackingMarker
Itse tehty luokka joka palauttaa Markerin joka liikkuu kahden koordinaatista A -> B annetussa ajassa. Hyödyllinen esim. lentokoneen animoinnissa.

### Modal
Itse tehty luokka joka palauttaa ikkunan kartan päälle, joka 80% koko screenin koosta. Tällä toteutetaan menut tällä hetkellä.

# API
Backendin ja Frontendin tiednvaihtoa varten on tehty RESTful API. Eli siis ```routes.py``` tiedosto pyörittää Backend Flask serveriä, johon frontend ottaa yhteyttä fetch komennolla. Frontendin puolelta api koodi löytyy ```api.ts``` tiedostosta. Python oliot muutetaan Typescript olioksi(ChatGPT hyvin hyödyllinen kirjoittamaan tyypityksiä niille :D)\
API:n base URL pitäisi olla http://localhost:5000
## Endpoints:
*```GET/airport/coords/<icao>```
palauttaa koordinaatit lentokentälle annetulla icao koodilla muodossa: ```{latitude: xx.xxx, longitude: xx.xxx}```\
\
*```GET/route``` Testaamista varten\
\
*```GET/airports``` Palauttaa kaikki isot lentokentät(Muokattavissa db_handler)\
\
*```GET/carrier``` Palauttaa Carrierin
