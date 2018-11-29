import { menuPropTypes, childComponentTypes, optionsPropTypes } from '../utils/types.spec';
import Menu from './Menu';
import Footer from './Footer';
import DocumentHead from '../utils/Head';

const layoutStyle = {
	margin: 20,
	padding: 20
};

const Layout = (props) =>
	<div style={ layoutStyle }>
		<DocumentHead />
		<Menu menu={ props.menu } />
		{ props.children }
		{ props.options &&
			<Footer copyright={ props.options.footerCopyright } />
		}
	</div>

;

Layout.propTypes = {
	menu: menuPropTypes,
	options: optionsPropTypes,
	children: childComponentTypes
}

export default Layout;
