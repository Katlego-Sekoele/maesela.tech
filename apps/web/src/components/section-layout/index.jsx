import PropTypes from "prop-types";
import PageHeader from "../page-header";
import "./styles.css";

/**
 * Two-track layout for section routes: the main editorial column (title card +
 * content) with the section's grungy duotone image as a sticky aside — the same
 * artwork used on the home cards.
 */
const SectionLayout = ({ eyebrow, title, lead, image, children }) => {
	return (
		<article className="section-page">
			<div className="section-page__main">
				<PageHeader eyebrow={eyebrow} title={title} lead={lead} />
				{children}
			</div>
			{image && (
				<aside className="section-page__aside">
					<div className="section-aside">
						<img
							className="section-aside__img"
							src={image}
							alt=""
							loading="lazy"
							aria-hidden="true"
						/>
					</div>
				</aside>
			)}
		</article>
	);
};

SectionLayout.propTypes = {
	eyebrow: PropTypes.string,
	title: PropTypes.string.isRequired,
	lead: PropTypes.string,
	image: PropTypes.string,
	children: PropTypes.node,
};

export default SectionLayout;
