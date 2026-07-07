import "../home/styles.css";
import SectionLayout from "../../components/section-layout";
import Project from "../../components/project";
import { getHomePortfolioSnapshot } from "../../utils/portfolioHomeSnapshot";

export default function ProjectsPage() {
	const { projects } = getHomePortfolioSnapshot();

	return (
		<SectionLayout
			eyebrow="Things I've built"
			title="Projects"
			lead="Side projects, experiments, and coursework — most of it on GitHub."
			image="/cards/projects.png"
		>
			<div className="section">
				{projects.map((project, index) => (
					<Project
						key={index}
						name={project.name}
						descriptionParagraphs={project.descriptionParagraphs}
						links={project.links}
						primaryLink={project.primaryLink}
					/>
				))}
			</div>
		</SectionLayout>
	);
}
