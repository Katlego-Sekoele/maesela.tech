import PropTypes from "prop-types";
import "./styles.css";

const Project = ({ name, descriptionParagraphs, links, primaryLink }) => {
	return (
		<div className="project-container">
			<div className="item-header">
				<a
					className="item-link"
					href={primaryLink}
					target="_blank"
					rel="noopener noreferrer"
				>
					{name}
				</a>
			</div>
			{descriptionParagraphs && (
				<div className="item-description">
					{descriptionParagraphs.map((paragraph, index) => (
						<p key={index}>{paragraph}</p>
					))}
				</div>
			)}
			{links && links.length > 0 && (
				<div className="project-links">
					{links.map((projectLink, index) => (
						<a
							key={index}
							className="u-link project-link"
							href={projectLink.link}
							target="_blank"
							rel="noopener noreferrer"
						>
							{projectLink.name}
						</a>
					))}
				</div>
			)}
		</div>
	);
};

Project.propTypes = {
	name: PropTypes.string.isRequired,
	descriptionParagraphs: PropTypes.arrayOf(PropTypes.string),
	links: PropTypes.array,
	primaryLink: PropTypes.string,
};

export default Project;
