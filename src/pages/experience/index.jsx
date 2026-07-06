import "../home/styles.css";
import PageHeader from "../../components/page-header";
import Experience from "../../components/experience";
import { getHomePortfolioSnapshot } from "../../utils/portfolioHomeSnapshot";

export default function ExperiencePage() {
	const { experiences } = getHomePortfolioSnapshot();

	return (
		<article className="page">
			<PageHeader
				eyebrow="Work"
				title="Experience"
				lead="Where I've built software — and what I shipped."
			/>
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
		</article>
	);
}
