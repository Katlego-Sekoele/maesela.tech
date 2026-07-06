import "../../App.css";
import "./styles.css";

const CREDITS = [
	{ label: "BL Melody Font", href: "https://www.boulevardtype.com/bl-melody" },
	{ label: "Fraunces (SIL OFL)", href: "https://fonts.google.com/specimen/Fraunces" },
	{ label: "three.js", href: "https://threejs.org/" },
	{ label: "anime.js", href: "https://animejs.com/" },
	{ label: "Simple Icons", href: "https://simpleicons.org/" },
	{ label: "Lucide Icons", href: "https://lucide.dev/" },
];

function Shoutout() {
	return (
		<article className="page shoutout">
			<p className="eyebrow">Shoutouts</p>
			<h1 className="shoutout-title serif">Standing on the shoulders of good design.</h1>

			<p className="shoutout-lead">
				The original look of this site was inspired by{" "}
				<a className="u-link" href="https://michellexliu.me/#/" target="_blank" rel="noopener noreferrer">
					Michelle 心娅 Liu
				</a>
				. The current editorial redesign takes cues from{" "}
				<a className="u-link" href="https://1chooo.com/" target="_blank" rel="noopener noreferrer">1chooo.com</a>,{" "}
				<a className="u-link" href="https://dotenvx.com/" target="_blank" rel="noopener noreferrer">dotenvx.com</a>, and{" "}
				<a className="u-link" href="https://hermes-agent.nousresearch.com/" target="_blank" rel="noopener noreferrer">Hermes Agent</a>.
			</p>

			<p className="shoutout-lead">Built with these free, excellent tools:</p>

			<ul className="shoutout-credits">
				{CREDITS.map(({ label, href }) => (
					<li key={href}>
						<a className="u-link" href={href} target="_blank" rel="noopener noreferrer">
							{label}
						</a>
					</li>
				))}
			</ul>
		</article>
	);
}

export default Shoutout;
