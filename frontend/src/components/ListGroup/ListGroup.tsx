import {useState} from 'react';
import './ListGroup.css';
import styled from 'styled-components';

const List = styled.ul`
	background-color: red;
`;

interface ListItemProps {
	active: boolean;
}
const ListItem = styled.li<ListItemProps>`
	padding: 5px 0;
	background: ${(props) => (props.active ? 'blue' : 'none')};
`;

interface Props {
	items: string[];
	heading: string;
	onSelectItem: (item: string) => void;
}

function ListGroup({items, heading, onSelectItem}: Props) {
	const [selectedIndex, setSelectedIndex] = useState(0);

	return (
		<>
			<h1>{heading}</h1>
			{items.length === 0 ? <p>No items</p> : null}
			{items.length === 0 && <p>No items</p>}
			<List>
				{items.map((item, index) => (
					<ListItem active={index === selectedIndex} className={selectedIndex === index ? 'list-group-item active' : 'list-group-item'} key={item} onSelect={() => onSelectItem(item)}>
						{item}
					</ListItem>
				))}
			</List>
		</>
	);
}

export default ListGroup;
