import { motion, useReducedMotion } from "framer-motion";
import PropTypes from "prop-types";

// A calm, premium ease (out-expo-ish) used across entrance animations.
export const EASE = [0.22, 1, 0.36, 1];

/**
 * Fades + lifts its children into view once, as they scroll near the viewport.
 * No-ops (renders instantly) when the user prefers reduced motion.
 */
export function Reveal({ children, className, delay = 0, y = 18, duration = 0.6, ...rest }) {
	const reduce = useReducedMotion();
	if (reduce) return <div className={className}>{children}</div>;
	return (
		<motion.div
			className={className}
			initial={{ opacity: 0, y }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
			transition={{ duration, ease: EASE, delay }}
			{...rest}
		>
			{children}
		</motion.div>
	);
}

/**
 * Staggers its <Item> children. `inView` triggers the stagger on scroll (once);
 * otherwise it plays on mount (for above-the-fold hero content).
 */
export function Stagger({
	children,
	className,
	as = "div",
	inView = false,
	stagger = 0.08,
	delayChildren = 0.04,
	...rest
}) {
	const reduce = useReducedMotion();
	const Tag = motion[as] || motion.div;
	if (reduce) {
		const Plain = as;
		return <Plain className={className}>{children}</Plain>;
	}
	const variants = {
		hidden: {},
		show: { transition: { staggerChildren: stagger, delayChildren } },
	};
	const trigger = inView
		? { whileInView: "show", viewport: { once: true, margin: "-10% 0px" } }
		: { animate: "show" };
	return (
		<Tag className={className} initial="hidden" variants={variants} {...trigger} {...rest}>
			{children}
		</Tag>
	);
}

export const itemVariants = {
	hidden: { opacity: 0, y: 16 },
	show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

/** A child of <Stagger>. */
export function Item({ children, className, as = "div", ...rest }) {
	const reduce = useReducedMotion();
	const Tag = motion[as] || motion.div;
	if (reduce) {
		const Plain = as;
		return <Plain className={className}>{children}</Plain>;
	}
	return (
		<Tag className={className} variants={itemVariants} {...rest}>
			{children}
		</Tag>
	);
}

/**
 * Editorial masthead reveal: each word rises from behind a clipping line,
 * lightly staggered. Use inside a heading element.
 */
export function WordReveal({ text, delay = 0, stagger = 0.055, duration = 0.7 }) {
	const reduce = useReducedMotion();
	if (reduce) return text;
	const words = String(text).split(" ");
	return words.map((word, i) => (
		<span className="word-mask" key={`${word}-${i}`}>
			<motion.span
				className="word"
				initial={{ y: "115%" }}
				animate={{ y: 0 }}
				transition={{ duration, ease: EASE, delay: delay + i * stagger }}
			>
				{word}
				{i < words.length - 1 ? " " : ""}
			</motion.span>
		</span>
	));
}

/**
 * Reveals an image/panel with a top-to-bottom clip wipe — a "scan pass" that
 * suits the dithered duotone artwork. By default fires once when scrolled into
 * view; set `onMount` for elements that may sit in sticky/edge positions where
 * in-view detection is unreliable (fail-safe: always reveals).
 */
export function ScanReveal({ children, className, delay = 0, duration = 0.85, onMount = false, ...rest }) {
	const reduce = useReducedMotion();
	if (reduce) return <div className={className}>{children}</div>;
	const reveal = { clipPath: "inset(0 0 0% 0)" };
	const trigger = onMount
		? { animate: reveal }
		: { whileInView: reveal, viewport: { once: true, margin: "-12% 0px" } };
	return (
		<motion.div
			className={className}
			initial={{ clipPath: "inset(0 0 100% 0)" }}
			{...trigger}
			transition={{ duration, ease: EASE, delay }}
			{...rest}
		>
			{children}
		</motion.div>
	);
}

/** A hairline rule that draws in from the left when revealed. */
export function DrawRule({ className, delay = 0, duration = 0.7 }) {
	const reduce = useReducedMotion();
	if (reduce) return <div className={className} />;
	return (
		<motion.div
			className={className}
			style={{ transformOrigin: "left" }}
			initial={{ scaleX: 0 }}
			whileInView={{ scaleX: 1 }}
			viewport={{ once: true }}
			transition={{ duration, ease: EASE, delay }}
		/>
	);
}

const nodeType = { children: PropTypes.node, className: PropTypes.string };
WordReveal.propTypes = { text: PropTypes.string, delay: PropTypes.number, stagger: PropTypes.number, duration: PropTypes.number };
ScanReveal.propTypes = { ...nodeType, delay: PropTypes.number, duration: PropTypes.number, onMount: PropTypes.bool };
DrawRule.propTypes = { className: PropTypes.string, delay: PropTypes.number, duration: PropTypes.number };
Reveal.propTypes = { ...nodeType, delay: PropTypes.number, y: PropTypes.number, duration: PropTypes.number };
Stagger.propTypes = { ...nodeType, as: PropTypes.string, inView: PropTypes.bool, stagger: PropTypes.number, delayChildren: PropTypes.number };
Item.propTypes = { ...nodeType, as: PropTypes.string };
