import "../home/styles.css";
import SectionLayout from "../../components/section-layout";
import Education from "../../components/education";
import { getHomePortfolioSnapshot } from "../../utils/portfolioHomeSnapshot";

export default function EducationPage() {
	const { educations } = getHomePortfolioSnapshot();

	return (
		<SectionLayout
			eyebrow="Studies"
			title="Education"
			lead="My path through computer science, information systems, and financial technology."
			image="/cards/education.png"
		>
			<div className="section">
				{educations.map((education, index) => (
					<Education
						key={index}
						company={education.company}
						companyLink={education.companyLink}
						position={education.position}
						startDate={education.startDate}
						endDate={education.endDate}
						description={education.description}
						current={education.current}
						keyPoints={education.keyPoints}
						graduationDate={education.graduationDate}
						grade={education.grade}
					/>
				))}
			</div>
		</SectionLayout>
	);
}
