import workImage from "../../images/error.png";
import "../../App.css";
import { ReactComponent as Globe } from "../../icons/globe.svg";
import { Socials } from "../../data";

function Shoutout() {
	return (
		<div className="App full-height centered stacked">
			<header>
				<div>
					<img src={workImage} className="App-logo" alt="logo" />
					<h1>I never said I was a designer</h1>
				</div>
			</header>
			<main>
				<p>
					The design of this website was taken from MICHELLE 心娅 LIU.
					Have a look at their stuff ↓
				</p>
				<div className="socials">
					<a
						href="https://michellexliu.me/#/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Globe className="social-icon" />
					</a>
				</div>
				<p>
					I am also a broke student 😔 so I used these other free cool
					stuff ↓
				</p>
				<div>
					<a
						href="https://www.boulevardtype.com/bl-melody"
						target="_blank"
						rel="noopener noreferrer"
						style={{ textDecoration: "underline" }}
					>
						BL-Melody Font
					</a>
					{" • "}
					<a
						href="https://simpleicons.org/"
						target="_blank"
						rel="noopener noreferrer"
						style={{ textDecoration: "underline" }}
					>
						Simple Icons
					</a>
				</div>
			</main>
		</div>
	);
}

export default Shoutout;
