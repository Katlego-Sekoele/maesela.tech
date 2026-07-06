import "../home/styles.css";
import PageHeader from "../../components/page-header";
import Project from "../../components/project";
import { getHomePortfolioSnapshot } from "../../utils/portfolioHomeSnapshot";

export default function ProjectsPage() {
	const { projects } = getHomePortfolioSnapshot();

	return (
		<article className="page">
			<PageHeader
				eyebrow="Things I've built"
				title="Projects"
				lead="Side projects, experiments, and coursework — most of it on GitHub."
			/>
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
		</article>
	);
}
