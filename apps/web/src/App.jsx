import { Routes, Route, useLocation } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import "./App.css";
import Header from "./components/header";
import { ThemeProvider } from "./contexts/ThemeContext";
import { EASE } from "./components/motion";

const Home = lazy(() => import("./pages/home"));
const ExperiencePage = lazy(() => import("./pages/experience"));
const EducationPage = lazy(() => import("./pages/education"));
const ProjectsPage = lazy(() => import("./pages/projects"));
const CertificationsPage = lazy(() => import("./pages/certifications"));
const TalksPage = lazy(() => import("./pages/talks"));
const About = lazy(() => import("./pages/about"));
// const Shoutout = lazy(() => import("./pages/shoutout")); // disabled for now
const ETC = lazy(() => import("./pages/etc"));
const Admin = lazy(() => import("./pages/admin"));
const Construction = lazy(() => import("./pages/construction"));

const App = () => {
	return (
		<ThemeProvider>
			<div className="App">
				<Header />
				<main className="page-content">
					<AnimatedRoutes />
				</main>
			</div>
		</ThemeProvider>
	);
};

function AnimatedRoutes() {
	const location = useLocation();
	const reduce = useReducedMotion();
	return (
		<motion.div
			key={location.pathname}
			initial={reduce ? false : { opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.35, ease: EASE }}
		>
			<Suspense fallback={<div className="route-fallback" aria-hidden="true" />}>
				<Routes location={location}>
					<Route path="/" element={<Home />} index />
					<Route path="/experience" element={<ExperiencePage />} />
					<Route path="/education" element={<EducationPage />} />
					<Route path="/projects" element={<ProjectsPage />} />
					<Route path="/certifications" element={<CertificationsPage />} />
					<Route path="/talks" element={<TalksPage />} />
					<Route path="/about" element={<About />} />
					<Route path="/etc" element={<ETC />} />
					<Route path="/admin" element={<Admin />} />
					<Route path="redirect/tinkr" element={<Tinkr />} />
					<Route path="*" element={<Construction />} />
				</Routes>
			</Suspense>
		</motion.div>
	);
}

function Tinkr() {
	useEffect(() => {
		window.location.href = "https://linktr.ee/uct_tinkr";
	}, []);

	return null;
}

export default App;
