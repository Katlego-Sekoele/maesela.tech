import { Link, NavLink } from "react-router-dom";
import Logo from "../../images/logo.png";
import "../../index.css";
import "./styles.css";
import ThemeToggle from "../theme-toggle";

const NAV = [
	{ to: "/", label: "home", end: true },
	{ to: "/about", label: "about" },
	{ to: "/shoutout", label: "shoutouts" },
	{ to: "/etc", label: "etc" },
];

const Header = () => {
	return (
		<header id="sidebar">
			<Link to="/" id="name">
				<img
					id="logo-image"
					src={Logo}
					alt="illustration of Maesela's face"
				/>
				<span id="name-text">Maesela Sekoele</span>
			</Link>

			<nav id="navigation" aria-label="Primary">
				{NAV.map(({ to, label, end }) => (
					<NavLink
						key={to}
						to={to}
						end={end}
						className={({ isActive }) =>
							`nav-link ${isActive ? "is-active" : ""}`
						}
					>
						{label}
					</NavLink>
				))}
			</nav>

			<div id="sidebar-footer">
				<ThemeToggle />
			</div>
		</header>
	);
};

export default Header;
