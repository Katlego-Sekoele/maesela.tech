import PropTypes from "prop-types";
import "./styles.css";

const Experience = ({
	company,
	companyLink,
	position,
	startDate,
	endDate,
	description,
	current,
	keyPoints,
}) => {
	const startDateString = new Date(startDate).toLocaleDateString(undefined, {
		month: "numeric",
		year: "numeric",
	});
	const endDateString = new Date(endDate).toLocaleDateString(undefined, {
		month: "numeric",
		year: "numeric",
	});

	return (
		<div className="experience-container">
			<div className="item-header">
				<a
					className="item-link"
					href={companyLink}
					target="_blank"
					rel="noopener noreferrer"
				>
					{current ? (
						<span className="current-indicator">
							●
						</span>
					) : null}
					{company}
				</a>
				<div className="item-date">
					{startDateString} - {endDate ? endDateString : "now"}
				</div>
			</div>
			<div className="item-position">
				{position}
			</div>
			<div className="item-description">
				{description}
				{keyPoints ? (
					<ul className="item-key-points">
						{keyPoints.map((point, index) => (
							<li key={index}>{point}</li>
						))}
					</ul>
				) : null}
			</div>
		</div>
	);
};

Experience.propTypes = {
	company: PropTypes.string,
	position: PropTypes.string,
	description: PropTypes.string,
	startDate: PropTypes.object,
	endDate: PropTypes.object,
	companyLink: PropTypes.string,
	current: PropTypes.bool,
	keyPoints: PropTypes.array,
};

export default Experience;

