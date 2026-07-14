import GradPhoto from "../../images/grad.png";
import "./styles.css";
import { About as Content } from "../../data";
import { CMS_URL } from "../../config";

const About = () => {
	// The CMS-managed portrait (Gallery → Photos, linked via About global) takes
	// priority; falls back to the bundled photo if none is set.
	const portraitSrc = Content.portraitId
		? `${CMS_URL}/api/site/photo?id=${Content.portraitId}&w=900&q=82`
		: GradPhoto;
	const portraitAlt = Content.portraitAlt || "Maesela's portrait";

	return (
		<article className="page about">
			<p className="eyebrow">About</p>
			<h1 className="about-greeting serif">{Content.greeting}</h1>

			<figure className="about-figure">
				<img id="photo" src={portraitSrc} alt={portraitAlt} />
			</figure>

			<section id="content" className="about-body">
				<p>
					<b>TL;DR</b>: {Content.tldr}
				</p>
				{Content.paragraphs.map((paragraph, index) => {
					if (index === 0) {
						return (
							<p key={index}>
								<b>The long 🥱 professional version</b>: {paragraph}
							</p>
						);
					}
					return <p key={index}>{paragraph}</p>;
				})}
			</section>
		</article>
	);
};

export default About;
