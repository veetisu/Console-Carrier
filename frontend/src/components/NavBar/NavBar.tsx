import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';
import Button from '../Button/Button';

interface Carrier {
	[key: string]: any;
}
interface NavbarProps {
	carrier: Carrier | null;
	onClick: (type: string) => void;
	handleMoreFuelClick: () => void;
}
function Navbar({onClick, carrier, handleMoreFuelClick}: NavbarProps) {
	const statItems = [
		{text: 'Money', identifier: 'money', unit: ' €', logo: '../../img/dollar.png'},
		{text: 'Fuel', identifier: 'fuel', unit: ' L', logo: '../../img/gas-can.png', button: {text: '+', func: handleMoreFuelClick}}
	];
	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container-fluid">
				<ul className="navbar-nav w-100">
					{navItems.map((item, index) => (
						<li key={index} className="nav-item w-100">
							<a className="nav-link" href="#" onClick={() => onClick(item.text.toLowerCase())}>
								<div className="card">
									<div className="card-body d-flex align-items-center">
										<img src={item.logo} alt={`${item.text} logo`} style={logoStyle} />
										<span>{item.text}</span>
									</div>
								</div>
							</a>
						</li>
					))}
				</ul>
			</div>
			<div className="d-flex stat-container w-25">
				{carrier &&
					statItems.map((statItem, index) => (
						<div id="d-flex flex-row">
							<span className="ns">
								<img src={statItem.logo} alt="" className="stat-item-img" />
								{carrier[statItem.identifier].toFixed(0) + statItem.unit}

								{statItem.button && (
									<Button classes="btn-sm" color="success" onClick={statItem.button.func}>
										{statItem.button.text}
									</Button>
								)}
							</span>
						</div>
					))}
			</div>
		</nav>
	);
}

const navItems = [
	{text: 'Planes', logo: '../../img/black-plane.png'},
	{text: 'Shop', logo: '../../img/shop.png'},
	{text: 'Routes', logo: '../../img/black-plane.png'}
	// Add more items as needed
];

const logoStyle = {
	width: '24px',
	height: '24px'
};

export default Navbar;
