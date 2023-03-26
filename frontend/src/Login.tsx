import ListGroup from './components/ListGroup';
import Input from './components/Input';
import Button from './components/Button/Button';
import Like from './components/Like/Like';
import {SyntheticEvent} from 'react';
import {BsFillCalendarFill} from 'react-icons/bs';
import 'bootstrap/dist/css/bootstrap.css';
import {BrowserRouter, Routes, Route, Link, useNavigate} from 'react-router-dom';
import Map from './Map/Map';
const items = ['New York', 'San Francisco', 'Chicago', 'Helsinki'];
const handleSeletItem = (item: string) => {
	console.log(item);
};

function App() {
	return (
		<div>
			<Like
				onClick={() => {
					console.log('Click');
				}}
			></Like>
			<Alert>Hello world!</Alert>
			<ListGroup items={items} heading="Cities" onSelectItem={handleSeletItem}></ListGroup>
			<BsFillCalendarFill></BsFillCalendarFill>
		</div>
	);
}

function onClick() {}
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
