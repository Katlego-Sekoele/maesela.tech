import PropTypes from "prop-types";

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
		"en-Za",
		{ year: "numeric", month: "long" }
	);
	const graudationString =
		new Date() > new Date(graduationDate)
			? `Graduated ${graduationDateString}`
			: `Graduating ${graduationDateString}`;

	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					flexWrap: "wrap",
				}}
			>
				<a
					style={{
						fontWeight: "600",
						textDecoration: "none",
						hover: "underline",
						color: "black",
						display: "flex",
						alignItems: "center",
					}}
					href={companyLink}
					target="_blank"
					rel="noopener noreferrer"
				>
					{current ? (
						<span
							style={{
								fontSize: "1rem",
								marginRight: "0.2rem",
								color: "blue",
								verticalAlign: "middle",
							}}
						>
							●
						</span>
					) : null}
					{company}
				</a>
				<div
					style={{
						fontSize: "0.8rem",
						marginBottom: "0.5rem",
					}}
				>
					<div>
						{graduationDate && new Date(graduationDate)
							? graudationString
							: null}
					</div>
					<i>{grade ? `GPA ${grade}%` : null}</i>
				</div>
			</div>
			<div
				style={{
					color: "gray",
				}}
			>
				{position}
			</div>
			<div
				style={{
					marginBottom: "1rem",
					lineHeight: "1.1em",
				}}
			>
				{description}
				{keyPoints ? (
					<ul
						style={{
							paddingLeft: "1rem",
							marginTop: "0.5rem",
						}}
					>
						{keyPoints.map((point, index) => (
							<li>{point}</li>
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
