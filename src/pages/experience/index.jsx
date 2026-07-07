import "../home/styles.css";
import SectionLayout from "../../components/section-layout";
import Experience from "../../components/experience";
import { getHomePortfolioSnapshot } from "../../utils/portfolioHomeSnapshot";

export default function ExperiencePage() {
	const { experiences } = getHomePortfolioSnapshot();

	return (
		<SectionLayout
			eyebrow="Work"
			title="Experience"
			lead="Where I've built software — and what I shipped."
			image="/cards/experience.png"
		>
			<div className="section">
				{experiences.map((experience, index) => (
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
		</SectionLayout>
	);
}
