import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NavBar.css';

interface Carrier {
	[key: string]: any;
}
interface NavbarProps {
	carrier: Carrier;
	onClick: (type: string) => void;
}
function Navbar({onClick, carrier}: NavbarProps) {
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
			{carrier &&
				statItems.map((statItem, index) => (
					<span className="ns">
						{statItem.text}: {carrier[statItem.identifier]}
					</span>
				))}
		</nav>
	);
}

const navItems = [
	{text: 'Planes', logo: '../../img/black-plane.png'},
	{text: 'Shop', logo: '../../img/shop.png'},
	{text: 'Item 3', logo: '../../img/black-plane.png'}
	// Add more items as needed
];

const statItems = [
	{text: 'Money', identifier: 'money', logo: ''},
	{text: 'Fuel', identifier: 'fuel', logo: ''}
];

const logoStyle = {
	width: '24px',
	height: '24px'
};

export default Navbar;
