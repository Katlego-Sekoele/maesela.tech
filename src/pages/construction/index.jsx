import workImage from "../../images/work.png";
import "../../App.css";
import "./styles.css";
import { ReactComponent as Mail } from "../../icons/gmail.svg";
import { ReactComponent as LinkedIn } from "../../icons/linkedin.svg";
import { ReactComponent as Github } from "../../icons/github.svg";
import { ReactComponent as Instagram } from "../../icons/instagram.svg";
import { ReactComponent as Spotify } from "../../icons/spotify.svg";
import { Socials } from "../../data";

function Construction() {
	return (
		<article className="page construction stacked">
			<img src={workImage} className="construction-art" alt="" />
			<p className="eyebrow">404 · Under construction</p>
			<h1 className="serif construction-title">Nothing here yet 🚧</h1>
			<p>In the meantime, you can 👀 me here ↓</p>
			<div className="socials">
				<a href={Socials.linkedin} target="_blank" rel="noopener noreferrer">
					<LinkedIn className="social-icon" />
				</a>
				<a href={Socials.github} target="_blank" rel="noopener noreferrer">
					<Github className="social-icon" />
				</a>
				<a href={Socials.email} target="_blank" rel="noopener noreferrer">
					<Mail className="social-icon" />
				</a>
				<a href={Socials.spotify} target="_blank" rel="noopener noreferrer">
					<Spotify className="social-icon" />
				</a>
				<a href={Socials.instagram} target="_blank" rel="noopener noreferrer">
					<Instagram className="social-icon" />
				</a>
			</div>
		</article>
	);
}

export default Construction;
