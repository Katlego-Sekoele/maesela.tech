import { Link } from "react-router-dom";
import Logo from "../images/logo.png";
import "./header.css";

const Header = () => {
	return (
		<header id="header">
			<Link to="/" id="name">
				Maesela
				{
					<img
						id="logo-image"
						src={Logo}
						alt="illustration of Maesela's face"
					/>
				}
				Sekoele
			</Link>
			<div id="navigation">
				<Link to="/about">About</Link>
				<Link to="/projects">Projects</Link>
			</div>
		</header>
	);
};

export default Header;
