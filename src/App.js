import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Construction from "./pages/construction";
import "./App.css";
import Header from "./components/header";
import ScrollableContainer from "./components/scrollable-container";

const App = () => {
	return (
		<div className="App">
			<Header />
			<div className="page-content">
				<Routes>
					<Route path="/" element={<Home />} />
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
