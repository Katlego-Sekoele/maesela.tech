import { Link } from "react-router-dom";
import Logo from "../images/logo.png";
import "../index.css";
import "./header.css";

const Header = () => {
	return (
		<header id="header">
			<Link to="/" id="name">
				Maesela Sekoele
				{
					<img
						id="logo-image"
						src={Logo}
						alt="illustration of Maesela's face"
					/>
				}
			</Link>
			<div id="navigation">
				<Link to="/about">About</Link>
				<Link to="/projects">Projects</Link>
				<Link to="/etc">Etc.</Link>
				<Link to="/shoutout">Shoutouts</Link>
			</div>
		</header>
	);
};

export default Header;
