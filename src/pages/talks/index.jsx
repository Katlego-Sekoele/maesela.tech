import "../home/styles.css";
import SectionLayout from "../../components/section-layout";
import Video from "../../components/video";
import { getHomePortfolioSnapshot } from "../../utils/portfolioHomeSnapshot";

export default function TalksPage() {
	const { videos } = getHomePortfolioSnapshot();

	return (
		<SectionLayout
			eyebrow="Speaking"
			title="Talks"
			lead="Talks I've given and things I've explained on camera."
			image="/cards/talks.png"
		>
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
		</SectionLayout>
	);
}
