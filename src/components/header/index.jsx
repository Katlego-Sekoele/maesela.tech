import { Link } from "react-router-dom";
import Logo from "../../images/logo.png";
import "../../index.css";
import "./styles.css";
import ThemeToggle from "../theme-toggle";

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
				<Link to="/">Home</Link>
				<Link to="/about">Me</Link>
				<Link to="/shoutout">Shoutouts</Link>
				{/* <Link to="/etc">Etc.</Link> */}
				<ThemeToggle />
			</div>
		</header>
	);
};

export default Header;

