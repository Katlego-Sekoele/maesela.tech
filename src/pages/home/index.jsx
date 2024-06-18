import "../../App.css";
import "./styles.css";
import ScrollableContainer from "../../components/scrollable-container";
import Construction from "../construction";

function Home() {
	return (
		<main id="main-container">
			<ScrollableContainer className="scrollable-container">
				<h2>Home</h2>
				<p>
					Hi! 👋🏾 I'm Maesela. I am pursuing a career in software
					development 💻. I am passionate about the intersection of
					information, people, processes, and technology and how they
					can be leveraged to optimise businesses and bring the most
					value to users.
				</p>
				<p>
					Currently studying{" "}
					<i>
						Bachelor of Commerce Honours in Information Systems @
						the University of Cape Town
					</i>
					.
				</p>
			</ScrollableContainer>
			<ScrollableContainer className="scrollable-container">
				<Construction />
			</ScrollableContainer>
		</main>
	);
}

export default Home;
