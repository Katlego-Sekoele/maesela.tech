import GradPhoto from "../../images/grad.png";
import "./styles.css";
import { About as Content } from "../../data";

const About = () => {
	return (
		<article className="page about">
			<p className="eyebrow">About</p>
			<h1 className="about-greeting serif">{Content.greeting}</h1>

			<figure className="about-figure">
				<img id="photo" src={GradPhoto} alt="Maesela's graduation portrait" />
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
