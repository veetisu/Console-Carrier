import {AiFillHeart} from 'react-icons/ai';
import {useState} from 'react';

interface Props {
	onClick: () => void;
}
function Like({onClick}: Props) {
	const [status, setStatus] = useState(false);
	const toggle = () => {
		setStatus(!status);
		onClick();
	};
	if (status) {
		return <AiFillHeart onClick={() => toggle()} style={{color: 'red'}}></AiFillHeart>;
	} else {
		return <AiFillHeart onClick={() => toggle()}></AiFillHeart>;
	}
}
function handleClick() {}
export default Like;
