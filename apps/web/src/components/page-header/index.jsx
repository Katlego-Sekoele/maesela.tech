import PropTypes from "prop-types";
import "./styles.css";

/**
 * Editorial title card used at the top of each section route:
 * a mono eyebrow, a large serif title, and an optional lead line.
 */
const PageHeader = ({ eyebrow, title, lead }) => {
	return (
		<header className="page-header">
			{eyebrow && <p className="eyebrow page-header__eyebrow">{eyebrow}</p>}
			<h1 className="serif page-header__title">{title}</h1>
			{lead && <p className="page-header__lead">{lead}</p>}
		</header>
	);
};

PageHeader.propTypes = {
	eyebrow: PropTypes.string,
	title: PropTypes.string.isRequired,
	lead: PropTypes.string,
};

export default PageHeader;
