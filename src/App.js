import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Construction from "./pages/construction";
import "./App.css";
import Header from "./components/header";
import ScrollableContainer from "./components/scrollable-container";
import Shoutout from "./pages/shoutout";
import About from "./pages/about";

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
