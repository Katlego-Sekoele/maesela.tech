import "../../App.css";
import "./styles.css";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PageHeader from "../../components/page-header";
import { ShortBio, Socials } from "../../data";
import { PortfolioExportControls } from "./portfolio-export-controls";
import { Stagger, Item, itemVariants } from "../../components/motion";

const SECTIONS = [
	{ to: "/experience", kicker: "Work", label: "Experience", blurb: "Where I've built software and what I shipped.", img: "/cards/experience.png" },
	{ to: "/projects", kicker: "Builds", label: "Projects", blurb: "Side projects, experiments, and coursework.", img: "/cards/projects.png" },
	{ to: "/education", kicker: "Studies", label: "Education", blurb: "Computer science, information systems, and fintech.", img: "/cards/education.png" },
	{ to: "/certifications", kicker: "Credentials", label: "Certifications", blurb: "Professional certifications I've earned.", img: "/cards/certifications.png" },
	{ to: "/talks", kicker: "Speaking", label: "Talks", blurb: "Talks I've given and things I've explained.", img: "/cards/talks.png" },
];

function Home() {
	const interests = ShortBio.current.interests;
	const interestList =
		interests.length > 1
			? `${interests.slice(0, -1).join(", ")} and ${interests[interests.length - 1]}`
			: interests[0];

	return (
		<article className="page page--wide home">
			<Stagger className="home-lede" stagger={0.09} delayChildren={0.06}>
				<Item>
					<PageHeader
						eyebrow="Maesela Sekoele — Software Engineer"
						title="I build things with code."
					/>
				</Item>

				<Item className="home-intro serif-body">
					<p>{ShortBio.bio}</p>
					<p>
						Currently {ShortBio.current.activity}{" "}
						<i>
							{ShortBio.current.position} @ {ShortBio.current.company}
						</i>
						.
					</p>
					<p>My current obsessions are {interestList}.</p>
				</Item>

				<Item as="p" className="text-links">
					<a className="u-link" href={Socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
					<a className="u-link" href={Socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
					<a className="u-link" href={Socials.email} target="_blank" rel="noopener noreferrer">Email</a>
					<a className="u-link" href={Socials.spotify} target="_blank" rel="noopener noreferrer">Spotify</a>
					<a className="u-link" href={Socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
				</Item>

				<Item>
					<PortfolioExportControls />
				</Item>
			</Stagger>

			<nav className="home-cards" aria-label="Sections">
				<p className="eyebrow home-cards__label">Explore</p>
				<Stagger as="ul" inView className="home-cards__grid" stagger={0.09}>
					{SECTIONS.map(({ to, kicker, label, blurb, img }, index) => (
						<motion.li key={to} className="home-cards__item" variants={itemVariants}>
							<Link to={to} className="scard">
								<p className="eyebrow scard__eyebrow">
									#{index + 1} {kicker}
								</p>
								<h2 className="serif scard__title">{label}</h2>
								<div className="scard__visual">
									<img
										className="scard__img"
										src={img}
										alt=""
										loading="lazy"
										aria-hidden="true"
									/>
									<span className="scard__arrow" aria-hidden="true">↗</span>
								</div>
								<p className="scard__caption">{blurb}</p>
							</Link>
						</motion.li>
					))}
				</Stagger>
			</nav>
		</article>
	);
}

export default Home;
