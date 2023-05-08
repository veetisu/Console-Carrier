import React, {useEffect, useState} from 'react';
import './Alert.css';

interface props {
	message: string;
	onClose: () => void;
}

const CustomAlert = ({message, onClose}: props) => {
	const [fadeOut, setFadeOut] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setFadeOut(true);
		}, 3000); // 3 seconds

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (fadeOut) {
			const timer = setTimeout(() => {
				onClose();
			}, 500); // 0.5 seconds

			return () => clearTimeout(timer);
		}
	}, [fadeOut, onClose]);

	return (
		<div className={`alert alert-warning alert-dismissible fade show myalert ${fadeOut ? 'fade-out' : ''}`} role="alert">
			{message}
			<button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={onClose}>
				<span aria-hidden="true">&times;</span>
			</button>
			{fadeOut && <style>{`.myalert.fade-out { animation: fadeOut 0.5s ease-in-out forwards; } @keyframes fadeOut { 0% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-20px); } }`}</style>}
		</div>
	);
};

export default CustomAlert;
