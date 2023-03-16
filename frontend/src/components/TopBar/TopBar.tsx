import React from 'react';

function Navbar() {
	return <nav style={navStyle}>{/* Your navbar content goes here */}</nav>;
}

const navStyle = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	backgroundColor: '#333',
	padding: '1rem',
	color: '#fff'
};

export default Navbar;
