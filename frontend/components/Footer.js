import Link from 'next/link';

const hrStyle = {
	marginTop: 75
};

const Footer = (props) =>
	<footer>
		<hr style={ hrStyle } />
		<p>{ props.copyright }</p>
	</footer>

;

export default Footer;
