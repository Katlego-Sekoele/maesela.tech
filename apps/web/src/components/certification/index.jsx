import PropTypes from "prop-types";
import { Reveal } from "../motion";
import "./styles.css";

const Certification = ({
	name,
	detailsLink,
	verificationLink,
	description,
	acquiredDate,
	expiryDate,
}) => {
	const acquiredDateString = new Date(acquiredDate).toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
	});
	const expiryDateString = expiryDate
		? new Date(expiryDate).toLocaleDateString(undefined, {
				year: "numeric",
				month: "long",
		  })
		: null;

	return (
		<Reveal className="certification-container">
			<div className="item-header certification-header">
				<div className="certification-links">
					<a
						className="item-link"
						href={detailsLink}
						target="_blank"
						rel="noopener noreferrer"
					>
						{name}
					</a>
					{verificationLink && (
						<a
							className="certification-verify-link muted-text"
							href={verificationLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							Verify
						</a>
					)}
				</div>
				<div className="item-date certification-date-info">
					<div>Acquired: {acquiredDateString}</div>
					{expiryDateString && (
						<div className="muted-text">Expires: {expiryDateString}</div>
					)}
				</div>
			</div>
			{description && (
				<div className="item-description">
					{description}
				</div>
			)}
		</Reveal>
	);
};

Certification.propTypes = {
	name: PropTypes.string.isRequired,
	detailsLink: PropTypes.string,
	verificationLink: PropTypes.string,
	description: PropTypes.string,
	acquiredDate: PropTypes.object.isRequired,
	expiryDate: PropTypes.object,
};

export default Certification;

