import "../../App.css";
import "./styles.css";
import Experience from "../../components/experience";
import { ShortBio, Socials } from "../../data";
import Education from "../../components/education";
import Certification from "../../components/certification";
import Video from "../../components/video";
import Project from "../../components/project";
import { getHomePortfolioSnapshot } from "../../utils/portfolioHomeSnapshot";
import { PortfolioExportControls } from "./portfolio-export-controls";

function Home() {
	const {
		experiences: sortedExperiences,
		educations: sortedEducations,
		certifications: sortedCertifications,
		videos: sortedVideos,
		projects: sortedProjects,
	} = getHomePortfolioSnapshot();

	const interests = ShortBio.current.interests;
	const interestList =
		interests.length > 1
			? `${interests.slice(0, -1).join(", ")} and ${interests[interests.length - 1]}`
			: interests[0];

	return (
		<article className="page home">
			<p className="eyebrow">Maesela Sekoele — Software Engineer</p>

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

			<section className="home-section">
				<h2 className="section-title serif">Experience</h2>
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
			</section>

			<section className="home-section">
				<h2 className="section-title serif">Education</h2>
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
			</section>

			<section className="home-section">
				<h2 className="section-title serif">Projects</h2>
				<div className="section">
					{sortedProjects.map((project, index) => (
						<Project
							key={index}
							name={project.name}
							descriptionParagraphs={project.descriptionParagraphs}
							links={project.links}
							primaryLink={project.primaryLink}
						/>
					))}
				</div>
			</section>

			<section className="home-section">
				<h2 className="section-title serif">Certifications</h2>
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
			</section>

			<section className="home-section">
				<h2 className="section-title serif">Videos</h2>
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
			</section>
		</article>
	);
}

export default Home;
