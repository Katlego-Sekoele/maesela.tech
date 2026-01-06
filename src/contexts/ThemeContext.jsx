import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within a ThemeProvider");
	}
	return context;
};

const applyThemeImmediate = () => {
	const stored = localStorage.getItem("theme") || "system";
	const root = document.documentElement;
	
	if (stored === "system") {
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		root.setAttribute("data-theme", prefersDark ? "dark" : "light");
	} else {
		root.setAttribute("data-theme", stored);
	}
};

if (typeof document !== "undefined") {
	applyThemeImmediate();
}

export const ThemeProvider = ({ children }) => {
	const [theme, setTheme] = useState(() => {
		const stored = localStorage.getItem("theme");
		return stored || "system";
	});

	useEffect(() => {
		const root = document.documentElement;
		
		if (theme === "system") {
			const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
			root.setAttribute("data-theme", prefersDark ? "dark" : "light");
			
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const handleChange = (e) => {
				const currentTheme = localStorage.getItem("theme") || "system";
				if (currentTheme === "system") {
					root.setAttribute("data-theme", e.matches ? "dark" : "light");
				}
			};
			
			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		} else {
			root.setAttribute("data-theme", theme);
		}
	}, [theme]);

	const updateTheme = (newTheme) => {
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
	};

	return (
		<ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

