import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import "./App.css";
import Header from "./components/header";
import { ThemeProvider } from "./contexts/ThemeContext";

const Home = lazy(() => import("./pages/home"));
const About = lazy(() => import("./pages/about"));
const Shoutout = lazy(() => import("./pages/shoutout"));
const ETC = lazy(() => import("./pages/etc"));
const Admin = lazy(() => import("./pages/admin"));
const Construction = lazy(() => import("./pages/construction"));

const App = () => {
	return (
		<ThemeProvider>
			<div className="App">
				<Header />
				<main className="page-content">
					<Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
						<Routes>
							<Route path="/" element={<Home />} index />
							<Route path="/shoutout" element={<Shoutout />} />
							<Route path="/about" element={<About />} />
							<Route path="/etc" element={<ETC />} />
							<Route path="/admin" element={<Admin />} />
							<Route path="redirect/tinkr" element={<Tinkr />} />
							<Route path="*" element={<Construction />} />
						</Routes>
					</Suspense>
				</main>
			</div>
		</ThemeProvider>
	);
};

function Tinkr() {
	useEffect(() => {
		window.location.href = "https://linktr.ee/uct_tinkr";
	}, []);

	return null;
}

export default App;
