import React, {useState, useEffect} from 'react';
import {fetchFuelPrice, postBuyFuel} from '../../../Map/api';

interface FuelViewProps {
	carrier: any;
	onCarrierUpdated?: (updatedCarrier: any) => void;
}

const FuelView: React.FC<FuelViewProps> = ({carrier, onCarrierUpdated}) => {
	const [amount, setAmount] = useState(0);
	const [fuelPrice, setFuelPrice] = useState(1);
	useEffect(() => {
		const getCarrier = async () => {
			const price = await fetchFuelPrice();
			console.log(price);
			setFuelPrice(price);
		};
		getCarrier();
	}, []);

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAmount(Number(e.target.value));
	};
	async function onBuyMoreFuel(amount) {
		const totalCost = amount * fuelPrice;
		if (carrier.money >= totalCost) {
			try {
				const updatedCarrier = await postBuyFuel(amount, carrier.id);
				if (onCarrierUpdated) {
					onCarrierUpdated(updatedCarrier);
				}
			} catch (error) {
				console.error('Error in onBuyMoreFuel:', error);
			}
		} else {
			return (
				<CustomAlert
					message="Insufficient funds"
					onClose={() => {
						console.log('close');
					}}
				></CustomAlert>
			);
		}
	}

	const totalCost = amount * fuelPrice;

	return (
		<div className="container">
			<div className="row justify-content-center">
				<div className="col-md-6">
					<div className="w-100">
						<h3>Fuel</h3>
						<p>You have {carrier.fuel.toFixed(0)} L of fuel.</p>
						<p>Price per liter: €{fuelPrice.toFixed(2)}</p>
						<div className="mb-3">
							<label htmlFor="amount" className="form-label">
								Amount (L)
							</label>
							<input type="range" className="form-range" id="amount" min="0" max="1000" step="1" value={amount} onChange={handleAmountChange} />
						</div>
						<div className="mb-3">
							<label htmlFor="amount-input" className="form-label">
								Amount (L)
							</label>
							<input type="number" className="form-control" id="amount-input" value={amount} min="0" max="10000" step="1" onChange={handleAmountChange} />
						</div>
						<p>Total cost: €{totalCost.toFixed(2)}</p>
						<button className="btn btn-primary" onClick={() => onBuyMoreFuel(amount)}>
							Buy {amount} L of fuel
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FuelView;
