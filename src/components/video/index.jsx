import PropTypes from "prop-types";
import "./styles.css";

const Video = ({ title, link, description, publishedDate, thumbnail }) => {
	const publishedDateString = new Date(publishedDate).toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	// Extract YouTube video ID for thumbnail if not provided
	const getYouTubeThumbnail = (url) => {
		if (!url) return null;
		const match = url.match(
			/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
		);
		if (match) {
			return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
		}
		return null;
	};

	const thumbnailUrl = thumbnail || getYouTubeThumbnail(link);

	return (
		<div>
			<div className="item-header video-header">
				<a
					className="item-link video-title-link"
					href={link}
					target="_blank"
					rel="noopener noreferrer"
				>
					{title}
				</a>
				<div className="item-date muted-text">
					{publishedDateString}
				</div>
			</div>
			{thumbnailUrl && (
				<>
					<a
						href={link}
						target="_blank"
						rel="noopener noreferrer"
						className="video-thumbnail-container"
					>
						<div className="video-thumbnail-wrapper">
							<img
								src={thumbnailUrl}
								alt={title}
								className="video-thumbnail-image"
							/>
							{description && (
								<div className="video-description-overlay">
									{description}
								</div>
							)}
						</div>
					</a>
					{description && (
						<div className="video-description-mobile muted-text">
							{description}
						</div>
					)}
				</>
			)}
		</div>
	);
};

Video.propTypes = {
	title: PropTypes.string.isRequired,
	link: PropTypes.string.isRequired,
	description: PropTypes.string,
	publishedDate: PropTypes.object.isRequired,
	thumbnail: PropTypes.string,
};

export default Video;

