/**
 * Portfolio content — now sourced from the Payload CMS.
 *
 * `content.generated.json` is written at build time by
 * scripts/fetch-content.mjs (committed as an offline fallback). This module
 * maps that snapshot into the shapes the components/util already expect,
 * converting ISO date strings to Date objects and empty lists to null so the
 * existing sort/render logic is unchanged.
 */
import content from "./content.generated.json";

const toDate = (v) => (v ? new Date(v) : undefined);
const orNull = (arr) => (Array.isArray(arr) && arr.length ? arr : null);

export const Experiences = (content.experiences ?? []).map((e) => ({
	company: e.company,
	companyLink: e.companyLink ?? null,
	position: e.position ?? "",
	startDate: toDate(e.startDate),
	endDate: toDate(e.endDate),
	description: e.description ?? "",
	current: !!e.current,
	shown: e.shown !== false,
	keyPoints: orNull(e.keyPoints),
}));

export const Educations = (content.educations ?? []).map((e) => ({
	company: e.company,
	companyLink: e.companyLink ?? null,
	position: e.position ?? "",
	startDate: toDate(e.startDate),
	endDate: toDate(e.endDate),
	graduationDate: toDate(e.graduationDate),
	grade: typeof e.grade === "number" ? e.grade : undefined,
	current: !!e.current,
	shown: e.shown !== false,
	keyPoints: orNull(e.keyPoints),
}));

export const Certifications = (content.certifications ?? []).map((c) => ({
	name: c.name,
	detailsLink: c.detailsLink ?? null,
	verificationLink: c.verificationLink ?? null,
	description: c.description ?? "",
	acquiredDate: toDate(c.acquiredDate),
	expiryDate: toDate(c.expiryDate),
	shown: c.shown !== false,
}));

export const Videos = (content.videos ?? []).map((v) => ({
	title: v.title,
	link: v.link,
	description: v.description ?? "",
	publishedDate: toDate(v.publishedDate),
	thumbnail: v.thumbnail ?? undefined,
	shown: v.shown !== false,
}));

export const Projects = (content.projects ?? []).map((p) => ({
	name: p.name,
	descriptionParagraphs: p.descriptionParagraphs ?? [],
	links: (p.links ?? []).map((l) => ({ name: l.name, link: l.link })),
	primaryLink: p.primaryLink ?? null,
	shown: p.shown !== false,
}));

export const Articles = (content.articles ?? []).map((a) => ({
	title: a.title,
	url: a.url,
	description: a.description ?? "",
	readDate: a.readDate ?? null,
}));

export const ShortBio = {
	bio: content.shortBio?.bio ?? "",
	current: {
		activity: content.shortBio?.current?.activity ?? "",
		position: content.shortBio?.current?.position ?? "",
		company: content.shortBio?.current?.company ?? "",
		interests: content.shortBio?.current?.interests ?? [],
	},
};

export const Socials = {
	linkedin: content.socials?.linkedin ?? "",
	github: content.socials?.github ?? "",
	email: content.socials?.email ?? "",
	spotify: content.socials?.spotify ?? "",
	instagram: content.socials?.instagram ?? "",
};

export const About = {
	greeting: content.about?.greeting ?? "",
	tldr: content.about?.tldr ?? "",
	paragraphs: content.about?.paragraphs ?? [],
	portraitId: content.about?.portraitId ?? null,
	portraitAlt: content.about?.portraitAlt ?? "",
};
