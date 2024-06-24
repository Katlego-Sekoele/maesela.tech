import "../../App.css";
import "./styles.css";
import ScrollableContainer from "../../components/scrollable-container";
import Construction from "../construction";
import Experience from "../../components/experience";
import { Educations, Experiences, Projects, ShortBio, Socials } from "../../data";
import Education from "../../components/education";

function Home() {
	const sortedExperiences = Experiences.toSorted((a, b) => {
		//undefined implies until now
		if (a.endDate === undefined) return -1;
		if (b.endDate === undefined) return 1;

		return b.endDate - a.endDate;
	});
	const sortedEducations = Educations.toSorted((a, b) => {
		//undefined implies until now
		if (a.endDate === undefined) return -1;
		if (b.endDate === undefined) return 1;
		return b.endDate - a.endDate;
	});

	const projectNames = Projects.map((project, _) => project.name);

	return (
		<main id="main-container">
			<ScrollableContainer className="scrollable-container">
				<p>{ShortBio.bio}</p>
				<p>
					Currently {ShortBio.current.activity}{" "}
					<i>
						{ShortBio.current.position} @ {ShortBio.current.company}
					</i>
					.
				</p>
				<p className="text-links">
					<a
						href={Socials.github}
						target="_blank"
						rel="noopener noreferrer"
					>
						GitHub
					</a>
					<a
						href={Socials.linkedin}
						target="_blank"
						rel="noopener noreferrer"
					>
						LinkedIn
					</a>
					<a
						href={Socials.email}
						target="_blank"
						rel="noopener noreferrer"
					>
						Email
					</a>
					<a
						href={Socials.spotify}
						target="_blank"
						rel="noopener noreferrer"
					>
						Spotify
					</a>
					<a
						href={Socials.instagram}
						target="_blank"
						rel="noopener noreferrer"
					>
						Instagram
					</a>
				</p>

				<h2 className="section-title">Experience</h2>
				<div className="section">
					{sortedExperiences.map((experience, index) => {
						return experience.shown ? (
							<Experience
								key={index}
								company={experience.company}
								companyLink={experience.companyLink}
								position={experience.position}
								startDate={experience.startDate}
								endDate={experience.endDate}
								description={experience.description}
								current={experience.current}
								keyPoints={experience.keyPoints}
							/>
						) : null;
					})}
				</div>
				<h2 className="section-title">Education</h2>
				<div className="section">
					{sortedEducations.map((experience, index) => {
						return experience.shown ? (
							<Education
								key={index}
								company={experience.company}
								companyLink={experience.companyLink}
								position={experience.position}
								startDate={experience.startDate}
								endDate={experience.endDate}
								description={experience.description}
								current={experience.current}
								keyPoints={experience.keyPoints}
								graduationDate={experience.graduationDate}
								grade={experience.grade}
							/>
						) : null;
					})}
				</div>
			</ScrollableContainer>
			<ScrollableContainer className="scrollable-container">

				<div>
					<h2 className="section-title">Projects</h2>
					<div className="desktop"
						style={{
							display: 'grid',
							gridTemplateColumns: "repeat(3, auto)",
							gridTemplateRows: `repeat(${Math.ceil(projectNames.length / 2)},auto)`,
							gridAutoFlow: 'row',
							gridGap: '0 1em'
						}}
					>
						{projectNames.map((name, index) => (
							<span key={index}>{name}</span>
						))}
					</div>
					<Construction />
				</div>
			</ScrollableContainer>
		</main>
	);
}

export default Home;
