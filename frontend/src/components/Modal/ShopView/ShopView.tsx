import React from 'react';
import './ShopView.css';
import {useState, useEffect} from 'react';
import {fetchCfg} from '../../../Map/api';

const ShopView = () => {
	const shops = ['Planes', 'Staff', 'Upgrades'];
	const [activeShop, setActiveShop] = useState<string | false>(false);
	const [planeCfg, setPlaneCfg] = useState<object[] | false>(false);

	useEffect(() => {
		fetchCfg()
			.then((response) => {
				// Handle the response here
				console.log(response);
			})
			.catch((error) => {
				// Handle any errors here
				console.error(error);
			});
	}, []);

	const onClick = (shop: string) => {
		setActiveShop(shop);
	};

	return (
		<>
			<nav className="navbar navbar-expand-lg navbar-dark my-nav-bar">
				<div className="container-fluid">
					<ul className="navbar-nav w-100">
						{shops.map((shop, index) => {
							return (
								<li key={index} className="nav-item w-100">
									<a className="nav-link" href="#" onClick={() => onClick(shop.toLowerCase())}>
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
			{activeShop === 'planes' && <h1>Planes</h1>}
		</>
	);
};

export default ShopView;
