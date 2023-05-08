import React, {useState, useEffect} from 'react';
import './ShopView.css';
import {fetchCfg} from '../../../Map/api';
import {buyPlane} from '../../../Map/api';
import CustomAlert from '../../Alert/Alert';
import Carrier from '../../../types/Carrier';

const shopViewProps = {
	setCarrier: Function
};

const ShopView: React.FC<shopViewProps> = ({setCarrier}) => {
	const shops = ['Planes', 'Staff', 'Upgrades'];
	const [activeShop, setActiveShop] = useState<string | false>(false);
	const [planes, setPlanes] = useState([]);
	const [selectedPlane, setSelectedPlane] = useState(null);
	const [showAlert, setShowAlert] = useState(false); // Add this line
	const [alertMessage, setAlertMessage] = useState<string>(''); // Add this line

	useEffect(() => {
		fetchCfg().then((data) => setPlanes(data));
	}, []);

	const handlePlaneClick = (plane) => {
		setSelectedPlane(plane);
	};

	async function handleBuyPlane(planeModel: string) {
		try {
			const result = await buyPlane(planeModel);

			if (result && result['success']) {
				setCarrier(result['carrier']);
			} else {
				setShowAlert(true);
				setAlertMessage(result['message'] || 'Error buying plane');
			}
		} catch (error) {
			console.error('Error buying plane:', error);
			setShowAlert(true);
			setAlertMessage('Error buying plane');
		}
	}

	return (
		<>
			{showAlert && (
				<CustomAlert
					message={alertMessage}
					onClose={() => {
						setShowAlert(false);
						console.log('close');
					}}
				/>
			)}
			<nav className="navbar navbar-expand-lg navbar-dark my-nav-bar">
				<div className="container-fluid">
					<ul className="navbar-nav w-100">
						{shops.map((shop, index) => {
							return (
								<li key={index} className="nav-item w-100">
									<a className="nav-link" href="#" onClick={() => setActiveShop(shop.toLowerCase())}>
										<div className="card">
											<div className="card-body d-flex align-items-center">
												<span>{shop}</span>
											</div>
										</div>
									</a>
								</li>
							);
						})}
					</ul>
				</div>
			</nav>
			<div className="row">
				{activeShop === 'planes' && (
					<div className="planes-container">
						<div className="row">
							<div className="col-md-6">
								<div className="planes-list">
									{planes.map((plane, index) => (
										<div key={index} className="plane-item" onClick={() => handlePlaneClick(plane)}>
											<div className="plane-image-name">
												<img src={`../../img/planes/${plane.type}.png`} alt={plane.name} className="plane-img" />
												<span>{plane.name}</span>
											</div>
										</div>
									))}
								</div>
							</div>
							<div className="col-md-6">
								{selectedPlane && (
									<div className="plane-details">
										<h2>{selectedPlane.name}</h2>
										<ul>
											<li>Range: {selectedPlane.range} km</li>
											<li>Cruise speed: {selectedPlane.cruise_speed} km/h</li>
											<li>Passenger capacity: {selectedPlane.passenger_capacity}</li>
											<li>Fuel consumption: {selectedPlane.fuel_consumption} L/km</li>
											<li>Price: ${selectedPlane.price.toLocaleString()}</li>
										</ul>
										<button onClick={() => handleBuyPlane(selectedPlane.type)}>Buy {selectedPlane.name}</button>
									</div>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default ShopView;
