import { useTheme } from "../../contexts/ThemeContext";
import "./styles.css";

const ThemeToggle = () => {
	const { theme, setTheme } = useTheme();

	const cycleTheme = () => {
		if (theme === "light") {
			setTheme("dark");
		} else if (theme === "dark") {
			setTheme("system");
		} else {
			setTheme("light");
		}
	};

	const getIcon = () => {
		if (theme === "light") return "☀";
		if (theme === "dark") return "⏾";
		return "모";
	};

	const getLabel = () => {
		if (theme === "light") return "Light theme";
		if (theme === "dark") return "Dark theme";
		return "System theme";
	};

	return (
		<button
			className="theme-toggle"
			onClick={cycleTheme}
			aria-label={getLabel()}
			title={getLabel()}
		>
			{getIcon()}
		</button>
	);
};

export default ThemeToggle;

