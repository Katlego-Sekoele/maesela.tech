import PropTypes from "prop-types";
import "./styles.css";

const Education = ({
	company,
	companyLink,
	position,
	startDate,
	endDate,
	description,
	current,
	keyPoints,
	graduationDate,
	grade,
}) => {
	const graduationDateString = new Date(graduationDate).toLocaleDateString(
		undefined,
		{ year: "numeric", month: "long" }
	);
	const graudationString =
		new Date() > new Date(graduationDate)
			? `Graduated ${graduationDateString}`
			: `Graduating ${graduationDateString}`;

	return (
		<div className="education-container">
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
					<div>
						{graduationDate && new Date(graduationDate)
							? graudationString
							: null}
					</div>
					<i>{grade ? `GPA ${grade}%` : null}</i>
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

Education.propTypes = {
	company: PropTypes.string,
	position: PropTypes.string,
	description: PropTypes.string,
	startDate: PropTypes.object,
	endDate: PropTypes.object,
	graduationDate: PropTypes.string,
	grade: PropTypes.number,
	companyLink: PropTypes.string,
	current: PropTypes.bool,
	keyPoints: PropTypes.array,
};

export default Education;

