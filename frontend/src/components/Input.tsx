import React from 'react';

interface Props {
	children: string;
	type?: string;
	helptext?: string;
	onChange: () => void;
}

const Input = ({children, type = 'text', helptext = '', onChange}: Props) => {
	return (
		<div className="mb-3">
			<label htmlFor="myInput" className="form-label">
				{children}
			</label>
			<input type={type} className="form-control" id="myInput" aria-describedby="emailHelp" onChange={onChange}></input>
			<div id="emailHelp" className="form-text">
				{helptext}
			</div>
		</div>
	);
};

export default Input;
