import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Construction from "./pages/construction";
import "./App.css";
import Header from "./components/header";
import ScrollableContainer from "./components/scrollable-container";
import Shoutout from "./pages/shoutout";
import About from "./pages/about";
import INF3012_Notes from "./pages/notes/INF3012S";
import Private from "./pages/private";
import ETC from "./pages/etc";

const App = () => {
	return (
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
					<Route
						path="/INF3012S/*"
						element={
							<ScrollableContainer>
								<INF3012_Notes />
							</ScrollableContainer>
						}
					/>
					<Route
						path="/etc"
						element={
							<ScrollableContainer>
								<ETC />
							</ScrollableContainer>
						}
					/>
					<Route
						path="/private/*"
						element={
							<ScrollableContainer>
								<Private />
							</ScrollableContainer>
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
	);
};

export default App;
