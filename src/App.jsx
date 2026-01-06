import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Construction from "./pages/construction";
import "./App.css";
import Header from "./components/header";
import ScrollableContainer from "./components/scrollable-container";
import Shoutout from "./pages/shoutout";
import About from "./pages/about";
import INF3012_Notes from "./pages/notes/INF3012S";
import ETC from "./pages/etc";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/ThemeContext";

const App = () => {
	return (
		<ThemeProvider>
			<div className="App">
				<Header />
				<div className="page-content">
				<Routes>
					<Route path="/" element={<Home />} index />
					<Route
						path="/shoutout"
						element={
							<ScrollableContainer>
								<Shoutout />
							</ScrollableContainer>
						}
					/>
					<Route
						path="/about"
						element={
							<ScrollableContainer>
								<About />
							</ScrollableContainer>
						}
					/>
					{/* <Route
						path="/INF3012S/*"
						element={
							<ScrollableContainer>
								<INF3012_Notes />
							</ScrollableContainer>
						}
					/> */}
					{/* <Route
						path="/etc"
						element={
							<ScrollableContainer>
								<ETC />
							</ScrollableContainer>
						}
					/> */}
					<Route
						path="redirect/tinkr"
						element={
							<Tinkr />
						}
					/>
					<Route
						path="*"
						element={
							<ScrollableContainer>
								<Construction />
							</ScrollableContainer>
						}
					/>
				</Routes>
				</div>
			</div>
		</ThemeProvider>
	);
};

function Tinkr() {
	useEffect(() => {
		window.location.href = 'https://linktr.ee/uct_tinkr';
	}, []);

	return null;
}

export default App;
