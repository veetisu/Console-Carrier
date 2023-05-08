import Input from './Input';
import Button from '../Button/Button';
import Like from '../Like/Like';
import {SyntheticEvent} from 'react';
import {BsFillCalendarFill} from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter, Routes, Route, Link, useNavigate} from 'react-router-dom';
import Map from '../../Map/Map';
const items = ['New York', 'San Francisco', 'Chicago', 'Helsinki'];
const handleSeletItem = (item: string) => {
	console.log(item);
};

const handleChange = () => {
	console.log('heo');
};

function LoginPage() {
	const navigate = useNavigate();

	const handleButtonClick = () => {
		navigate('/Map');
	};

	return (
		<div className="position-absolute top-50 start-50 translate-middle">
			<Input onChange={handleChange} type="email">
				Email
			</Input>
			<Input onChange={handleChange} helptext="Stored to DB in CLEAR TEXT!!">
				Password
			</Input>
			<Button onClick={handleButtonClick}>Go to Map</Button>
		</div>
	);
}

export default LoginPage;
