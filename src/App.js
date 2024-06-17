import logo from "./images/logo.png";
import "./App.css";
import { ReactComponent as Mail } from "./icons/gmail.svg";
import { ReactComponent as LinkedIn } from "./icons/linkedin.svg";
import { ReactComponent as Github } from "./icons/github.svg";

function App() {
	return (
		<div className="App full-height centered">
			<header>
				<div>
					<img src={logo} className="App-logo" alt="logo" />
					<h1>Under Construction</h1>
				</div>
			</header>
			<main>
				<p>In the meantime, you can stalk me</p>
				<div className="socials">
					<a
						href="https://www.linkedin.com/in/maesela/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<LinkedIn className="social-icon" />
					</a>
					<a
						href="https://github.com/katlego-sekoele"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Github className="social-icon" />
					</a>
					<a
						href="mailto:sekoelekatlego@gmail.com"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Mail className="social-icon" />
					</a>
				</div>
			</main>
		</div>
	);
}

export default App;
