import styles from './Button.module.css';

interface Props {
	children: any;
	color?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'info' | 'light' | 'dark' | 'link';
	onClick: () => void;
	classes?: string;
}

const Button = ({children, onClick, color = 'primary', classes}: Props) => {
	return (
		<button type="button" className={[styles.btn, styles['btn-' + color], classes].join(' ')} onClick={onClick}>
			{children}
		</button>
	);
};

export default Button;
