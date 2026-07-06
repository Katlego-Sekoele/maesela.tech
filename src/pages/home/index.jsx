import "../../App.css";
import "./styles.css";
import { Link } from "react-router-dom";
import PageHeader from "../../components/page-header";
import { ShortBio, Socials } from "../../data";
import { PortfolioExportControls } from "./portfolio-export-controls";

const SECTIONS = [
	{ to: "/experience", kicker: "Work", label: "Experience", blurb: "Where I've built software and what I shipped." },
	{ to: "/projects", kicker: "Builds", label: "Projects", blurb: "Side projects, experiments, and coursework." },
	{ to: "/education", kicker: "Studies", label: "Education", blurb: "Computer science, information systems, and fintech." },
	{ to: "/certifications", kicker: "Credentials", label: "Certifications", blurb: "Professional certifications I've earned." },
	{ to: "/talks", kicker: "Speaking", label: "Talks", blurb: "Talks I've given and things I've explained." },
];

function Home() {
	const interests = ShortBio.current.interests;
	const interestList =
		interests.length > 1
			? `${interests.slice(0, -1).join(", ")} and ${interests[interests.length - 1]}`
			: interests[0];

	return (
		<article className="page page--wide home">
			<div className="home-lede">
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
			</div>

			<nav className="home-cards" aria-label="Sections">
				<p className="eyebrow home-cards__label">Explore</p>
				<ul className="home-cards__grid">
					{SECTIONS.map(({ to, kicker, label, blurb }, index) => (
						<li key={to} className="home-cards__item">
							<Link to={to} className="scard">
								<p className="eyebrow scard__eyebrow">
									#{index + 1} {kicker}
								</p>
								<h2 className="serif scard__title">{label}</h2>
								<div className="scard__visual" aria-hidden="true">
									<span className="scard__num">
										{String(index + 1).padStart(2, "0")}
									</span>
									<span className="scard__arrow">↗</span>
								</div>
								<p className="scard__caption">{blurb}</p>
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</article>
	);
}

export default Home;
