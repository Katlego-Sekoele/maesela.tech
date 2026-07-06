import "../home/styles.css";
import PageHeader from "../../components/page-header";
import Video from "../../components/video";
import { getHomePortfolioSnapshot } from "../../utils/portfolioHomeSnapshot";

export default function TalksPage() {
	const { videos } = getHomePortfolioSnapshot();

	return (
		<article className="page">
			<PageHeader
				eyebrow="Speaking"
				title="Talks"
				lead="Talks I've given and things I've explained on camera."
			/>
			<div className="section">
				{videos.map((video, index) => (
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
		</article>
	);
}
