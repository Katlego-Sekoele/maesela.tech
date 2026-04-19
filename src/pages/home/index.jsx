import "../../App.css";
import "./styles.css";
import ScrollableContainer from "../../components/scrollable-container";
import Experience from "../../components/experience";
import { ShortBio, Socials } from "../../data";
import Education from "../../components/education";
import Certification from "../../components/certification";
import Video from "../../components/video";
import { getHomePortfolioSnapshot } from "../../utils/portfolioHomeSnapshot";
import { PortfolioExportControls } from "./portfolio-export-controls";

function Home() {
	const {
		experiences: sortedExperiences,
		educations: sortedEducations,
		certifications: sortedCertifications,
		videos: sortedVideos,
	} = getHomePortfolioSnapshot();

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
				<p>My current obsessions are {ShortBio.current.interests.slice(0, -1).join(", ")} and {ShortBio.current.interests[ShortBio.current.interests.length - 1]}.</p>
				<PortfolioExportControls />
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
					{sortedExperiences.map((experience, index) => (
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
					))}
				</div>
				<h2 className="section-title">Education</h2>
				<div className="section">
					{sortedEducations.map((experience, index) => (
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
					))}
				</div>
			</ScrollableContainer>
			<ScrollableContainer className="scrollable-container">
				<h2 className="section-title">Certifications</h2>
				<div className="section">
					{sortedCertifications.map((certification, index) => (
						<Certification
							key={index}
							name={certification.name}
							detailsLink={certification.detailsLink}
							verificationLink={certification.verificationLink}
							description={certification.description}
							acquiredDate={certification.acquiredDate}
							expiryDate={certification.expiryDate}
						/>
					))}
				</div>
				<h2 className="section-title">Videos</h2>
				<div className="section">
					{sortedVideos.map((video, index) => (
						<Video
							key={index}
							title={video.title}
							link={video.link}
							description={video.description}
							publishedDate={video.publishedDate}
							thumbnail={video.thumbnail}
						/>
					))}
				</div>
				{/* <div>
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
				</div> */}
			</ScrollableContainer>
		</main>
	);
}

export default Home;
