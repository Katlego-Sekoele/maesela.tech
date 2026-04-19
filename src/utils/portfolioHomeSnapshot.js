import {
	Certifications,
	Educations,
	Experiences,
	Videos,
} from "../data";

function sortByEndDateDesc(a, b) {
	if (a.endDate === undefined) return -1;
	if (b.endDate === undefined) return 1;
	return b.endDate - a.endDate;
}

function sortCertificationsDesc(a, b) {
	return b.acquiredDate - a.acquiredDate;
}

function sortVideosDesc(a, b) {
	return b.publishedDate - a.publishedDate;
}

/**
 * Sorted, shown-only lists matching the Home page order.
 */
export function getHomePortfolioSnapshot() {
	return {
		experiences: Experiences.toSorted(sortByEndDateDesc).filter(
			(e) => e.shown
		),
		educations: Educations.toSorted(sortByEndDateDesc).filter(
			(e) => e.shown
		),
		certifications: Certifications.toSorted(sortCertificationsDesc).filter(
			(c) => c.shown
		),
		videos: Videos.toSorted(sortVideosDesc).filter((v) => v.shown),
	};
}
