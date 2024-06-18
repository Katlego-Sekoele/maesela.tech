import "../../App.css";
import "./styles.css";
import ScrollableContainer from "../../components/scrollable-container";
import Construction from "../construction";
import Experience from "../../components/experience";
import { Educations, Experiences, ShortBio } from "../../data";
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
				<Construction />
			</ScrollableContainer>
		</main>
	);
}

export default Home;
