import logo from "../../images/logo.png";
import workImage from "../../images/work.png";
import "../../App.css";
import { ReactComponent as Mail } from "../../icons/gmail.svg";
import { ReactComponent as LinkedIn } from "../../icons/linkedin.svg";
import { ReactComponent as Github } from "../../icons/github.svg";
import { ReactComponent as Instagram } from "../../icons/instagram.svg";
import { ReactComponent as Spotify } from "../../icons/spotify.svg";
import { Socials } from "../../data";

function Construction() {
	return (
		<div className="App full-height centered stacked">
			<header>
				<div>
					<img src={workImage} className="App-logo" alt="logo" />
					<h1>Under Construction 🚧</h1>
				</div>
			</header>
			<main>
				<p>In the meantime, you can 👀 me here ↓</p>
				<div className="socials">
					<a
						href={Socials.linkedin}
						target="_blank"
						rel="noopener noreferrer"
					>
						<LinkedIn className="social-icon" />
					</a>
					<a
						href={Socials.github}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Github className="social-icon" />
					</a>
					<a
						href={Socials.email}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Mail className="social-icon" />
					</a>
					<a
						href={Socials.spotify}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Spotify className="social-icon" />
					</a>
					<a
						href={Socials.instagram}
						target="_blank"
						rel="noopener noreferrer"
					>
						<Instagram className="social-icon" />
					</a>
				</div>
			</main>
		</div>
	);
}

export default Construction;
