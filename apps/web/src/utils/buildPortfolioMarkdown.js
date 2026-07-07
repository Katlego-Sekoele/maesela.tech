import { ShortBio, Socials } from "../data";
import { getHomePortfolioSnapshot } from "./portfolioHomeSnapshot";

function formatExpRange(startDate, endDate) {
	const start = new Date(startDate).toLocaleDateString(undefined, {
		month: "numeric",
		year: "numeric",
	});
	const end = endDate
		? new Date(endDate).toLocaleDateString(undefined, {
				month: "numeric",
				year: "numeric",
			})
		: "now";
	return `${start} - ${end}`;
}

function formatEducationGraduation(graduationDate) {
	if (!graduationDate) return "";
	const graduationDateString = new Date(graduationDate).toLocaleDateString(
		undefined,
		{ year: "numeric", month: "long" }
	);
	return new Date() > new Date(graduationDate)
		? `Graduated ${graduationDateString}`
		: `Graduating ${graduationDateString}`;
}

function formatCertDate(d) {
	return new Date(d).toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
	});
}

function formatVideoDate(d) {
	return new Date(d).toLocaleDateString(undefined, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function pushParagraph(lines, text) {
	if (!text) return;
	lines.push(text.replace(/\r\n/g, "\n").trim());
	lines.push("");
}

/**
 * Markdown export for Home portfolio content (same data/order as the page).
 */
export function buildPortfolioMarkdown() {
	const {
		experiences,
		educations,
		certifications,
		videos,
	} = getHomePortfolioSnapshot();

	const lines = [];

	lines.push("# Maesela Sekoele");
	lines.push("");
	pushParagraph(lines, ShortBio.bio);

	lines.push(
		`Currently ${ShortBio.current.activity} *${ShortBio.current.position} @ ${ShortBio.current.company}*.`
	);
	lines.push("");

	const interests = ShortBio.current.interests;
	if (interests.length > 0) {
		const list =
			interests.length === 1
				? interests[0]
				: `${interests.slice(0, -1).join(", ")} and ${interests[interests.length - 1]}`;
		lines.push(`My current obsessions are ${list}.`);
		lines.push("");
	}

	lines.push("## Links");
	lines.push("");
	lines.push(`- [GitHub](${Socials.github})`);
	lines.push(`- [LinkedIn](${Socials.linkedin})`);
	lines.push(`- [Email](${Socials.email})`);
	lines.push(`- [Spotify](${Socials.spotify})`);
	lines.push(`- [Instagram](${Socials.instagram})`);
	lines.push("");

	lines.push("## Experience");
	lines.push("");
	for (const exp of experiences) {
		const companyMd = exp.companyLink
			? `[${exp.company}](${exp.companyLink})`
			: exp.company;
		const currentMark = exp.current ? "● " : "";
		lines.push(`### ${currentMark}${companyMd}`);
		lines.push("");
		lines.push(`**${exp.position}**`);
		lines.push("");
		lines.push(formatExpRange(exp.startDate, exp.endDate));
		lines.push("");
		pushParagraph(lines, exp.description);
		if (exp.keyPoints && exp.keyPoints.length > 0) {
			for (const point of exp.keyPoints) {
				lines.push(`- ${point}`);
			}
			lines.push("");
		}
	}

	lines.push("## Education");
	lines.push("");
	for (const edu of educations) {
		const companyMd = edu.companyLink
			? `[${edu.company}](${edu.companyLink})`
			: edu.company;
		const currentMark = edu.current ? "● " : "";
		lines.push(`### ${currentMark}${companyMd}`);
		lines.push("");
		lines.push(`**${edu.position}**`);
		lines.push("");
		const grad = formatEducationGraduation(edu.graduationDate);
		if (grad) {
			lines.push(grad);
			lines.push("");
		}
		if (edu.grade != null) {
			lines.push(`*GPA ${edu.grade}%*`);
			lines.push("");
		}
		pushParagraph(lines, edu.description);
		if (edu.keyPoints && edu.keyPoints.length > 0) {
			for (const point of edu.keyPoints) {
				lines.push(`- ${point}`);
			}
			lines.push("");
		}
	}

	lines.push("## Certifications");
	lines.push("");
	for (const cert of certifications) {
		const nameMd = cert.detailsLink
			? `[${cert.name}](${cert.detailsLink})`
			: cert.name;
		const verify =
			cert.verificationLink &&
			` · [Verify](${cert.verificationLink})`;
		lines.push(`### ${nameMd}${verify || ""}`);
		lines.push("");
		lines.push(`Acquired: ${formatCertDate(cert.acquiredDate)}`);
		if (cert.expiryDate) {
			lines.push(`Expires: ${formatCertDate(cert.expiryDate)}`);
		}
		lines.push("");
		if (cert.description) {
			pushParagraph(lines, cert.description);
		}
	}

	lines.push("## Videos");
	lines.push("");
	for (const video of videos) {
		const titleMd = video.link
			? `[${video.title}](${video.link})`
			: video.title;
		lines.push(`### ${titleMd}`);
		lines.push("");
		lines.push(formatVideoDate(video.publishedDate));
		lines.push("");
		if (video.description) {
			pushParagraph(lines, video.description);
		}
	}

	return lines.join("\n").trimEnd() + "\n";
}

export function downloadMarkdownFile(filename = "maesela-portfolio.md") {
	const markdown = buildPortfolioMarkdown();
	const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.rel = "noopener";
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
