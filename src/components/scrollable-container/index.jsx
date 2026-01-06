import PropTypes from "prop-types";
import "./styles.css";

const ScrollableContainer = ({
	children,
	borderBottom,
	borderLeft,
	borderRight,
	borderTop,
}) => {
	return (
		<div
			className={`scrollable-container ${
				borderBottom ? "border-bottom" : ""
			} ${borderLeft ? "border-left" : ""} ${
				borderRight ? "border-right" : ""
			} ${borderTop ? "border-top" : ""}`}
		>
			{children}
		</div>
	);
};

ScrollableContainer.propTypes = {
	children: PropTypes.node,
	borderBottom: PropTypes.bool,
	borderLeft: PropTypes.bool,
	borderRight: PropTypes.bool,
	borderTop: PropTypes.bool,
};

export default ScrollableContainer;

