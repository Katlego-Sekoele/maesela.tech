import "../../App.css";
import "./styles.css";
import { Link } from "react-router-dom";
import PageHeader from "../../components/page-header";
import { ShortBio, Socials } from "../../data";
import { PortfolioExportControls } from "./portfolio-export-controls";

const SECTIONS = [
	{ to: "/experience", label: "Experience", blurb: "Where I've built software and what I shipped." },
	{ to: "/projects", label: "Projects", blurb: "Side projects, experiments, and coursework." },
	{ to: "/education", label: "Education", blurb: "Computer science, information systems, and fintech." },
	{ to: "/certifications", label: "Certifications", blurb: "Professional certifications I've earned." },
	{ to: "/talks", label: "Talks", blurb: "Talks I've given and things I've explained." },
];

function Home() {
	const interests = ShortBio.current.interests;
	const interestList =
		interests.length > 1
			? `${interests.slice(0, -1).join(", ")} and ${interests[interests.length - 1]}`
			: interests[0];

	return (
		<article className="page home">
			<PageHeader
				eyebrow="Maesela Sekoele — Software Engineer"
				title="I build things with code."
			/>

			<div className="home-intro serif-body">
				<p>{ShortBio.bio}</p>
				<p>
					Currently {ShortBio.current.activity}{" "}
					<i>
						{ShortBio.current.position} @ {ShortBio.current.company}
					</i>
					.
				</p>
				<p>My current obsessions are {interestList}.</p>
			</div>

			<p className="text-links">
				<a className="u-link" href={Socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
				<a className="u-link" href={Socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
				<a className="u-link" href={Socials.email} target="_blank" rel="noopener noreferrer">Email</a>
				<a className="u-link" href={Socials.spotify} target="_blank" rel="noopener noreferrer">Spotify</a>
				<a className="u-link" href={Socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
			</p>

			<PortfolioExportControls />

			<nav className="home-index" aria-label="Sections">
				<p className="eyebrow home-index__label">Explore</p>
				<ul className="home-index__list">
					{SECTIONS.map(({ to, label, blurb }) => (
						<li key={to} className="home-index__item">
							<Link to={to} className="home-index__link">
								<span className="home-index__title serif">{label}</span>
								<span className="home-index__blurb">{blurb}</span>
								<span className="home-index__arrow" aria-hidden="true">→</span>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</article>
	);
}

export default Home;
