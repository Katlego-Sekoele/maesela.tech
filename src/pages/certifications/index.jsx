import "../home/styles.css";
import PageHeader from "../../components/page-header";
import Certification from "../../components/certification";
import { getHomePortfolioSnapshot } from "../../utils/portfolioHomeSnapshot";

export default function CertificationsPage() {
	const { certifications } = getHomePortfolioSnapshot();

	return (
		<article className="page">
			<PageHeader
				eyebrow="Credentials"
				title="Certifications"
				lead="Professional certifications I've earned."
			/>
			<div className="section">
				{certifications.map((certification, index) => (
					<Certification
						key={index}
						name={certification.name}
						detailsLink={certification.detailsLink}
						verificationLink={certification.verificationLink}
						description={certification.description}
						acquiredDate={certification.acquiredDate}
						expiryDate={certification.expiryDate}
					/>
				))}
			</div>
		</article>
	);
}
