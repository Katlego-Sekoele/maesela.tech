import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { WordReveal, DrawRule, EASE } from "../motion";
import "./styles.css";

/**
 * Editorial title card: a mono eyebrow, a large serif title whose words rise
 * from behind a clip line (masthead reveal), a rule that draws in, and an
 * optional lead. Falls back to static markup under prefers-reduced-motion.
 */
const PageHeader = ({ eyebrow, title, lead }) => {
	const reduce = useReducedMotion();

	if (reduce) {
		return (
			<header className="page-header">
				{eyebrow && <p className="eyebrow page-header__eyebrow">{eyebrow}</p>}
				<h1 className="serif page-header__title">{title}</h1>
				<div className="page-header__rule" />
				{lead && <p className="page-header__lead">{lead}</p>}
			</header>
		);
	}

	// timing: eyebrow → words → rule → lead
	const wordsStart = 0.12;
	const ruleDelay = wordsStart + String(title).split(" ").length * 0.055 + 0.05;

	return (
		<header className="page-header">
			{eyebrow && (
				<motion.p
					className="eyebrow page-header__eyebrow"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, ease: EASE }}
				>
					{eyebrow}
				</motion.p>
			)}
			<h1 className="serif page-header__title">
				<WordReveal text={title} delay={wordsStart} />
			</h1>
			<DrawRule className="page-header__rule" delay={ruleDelay} />
			{lead && (
				<motion.p
					className="page-header__lead"
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: EASE, delay: ruleDelay + 0.12 }}
				>
					{lead}
				</motion.p>
			)}
		</header>
	);
};

PageHeader.propTypes = {
	eyebrow: PropTypes.string,
	title: PropTypes.string.isRequired,
	lead: PropTypes.string,
};

export default PageHeader;
