import React from 'react';
import ReactDOM from 'react-dom';
import Login from './Login';
import Map from './Map/Map';
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';

function AppRouter() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<App />} />
				<Route path="/Map" element={<Map />} />
			</Routes>
		</BrowserRouter>
	);
}

function App() {
	const navigate = useNavigate();

	const handleButtonClick = () => {
		navigate('/Map');
	};

	return (
		<div>
			<Login></Login>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')).render(<AppRouter />);
