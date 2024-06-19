import GradPhoto from "../../images/grad.png";
import "./styles.css";
import { About as Content } from "../../data";

const About = () => {
	return (
		<main id="main-container">
			<img
				id="photo"
				src={GradPhoto}
				alt="Maesela's graduation portrait"
			/>
			<section id="content">
				<h1>{Content.greeting}</h1>
				<p>
					<b>TL;DR</b>: {Content.tldr}
				</p>
				{Content.paragraphs.map((paragraph, index) => {
					if (index === 0) {
						return (
							<p key={index}>
								<b>The long 🥱 professional version</b>:{" "}
								{paragraph}
							</p>
						);
					}
					return <p key={index}>{paragraph}</p>;
				})}
			</section>
		</main>
	);
};

export default About;
