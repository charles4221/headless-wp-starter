import { menuPropTypes, childComponentTypes } from '../utils/types.spec';
import Header from './Header';
import Menu from './Menu';
import Footer from './Footer';

const layoutStyle = {
	margin: 20,
	padding: 20
};

const Layout = (props) =>
	<div style={ layoutStyle }>
		<Header />
		<Menu menu={ props.menu } />
		{ props.children }
		<Footer />
	</div>

;

Layout.propTypes = {
	menu: menuPropTypes,
	children: childComponentTypes
}

export default Layout;
