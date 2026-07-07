import "../home/styles.css";
import SectionLayout from "../../components/section-layout";
import Certification from "../../components/certification";
import { getHomePortfolioSnapshot } from "../../utils/portfolioHomeSnapshot";

export default function CertificationsPage() {
	const { certifications } = getHomePortfolioSnapshot();

	return (
		<SectionLayout
			eyebrow="Credentials"
			title="Certifications"
			lead="Professional certifications I've earned."
			image="/cards/certifications.png"
		>
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
		</SectionLayout>
	);
}
