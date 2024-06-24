class Experience {
	constructor({
		company,
		position,
		startDate,
		endDate,
		description,
		keyPoints = [],
		current = false,
		companyLink = null,
		shown = false,
	}) {
		this.company = company;
		this.position = position;
		this.startDate = startDate;
		this.endDate = endDate;
		this.description = description;
		this.current = current;
		this.companyLink = companyLink;
		this.shown = shown;
		this.keyPoints = keyPoints;
	}
}

class Education extends Experience {
	constructor({
		company,
		position,
		startDate,
		endDate,
		description,
		keyPoints = [],
		current = false,
		companyLink = null,
		shown = false,
		graduationDate,
		grade,
	}) {
		super({
			company,
			position,
			startDate,
			endDate,
			description,
			keyPoints,
			current,
			companyLink,
			shown,
		});
		this.graduationDate = graduationDate;
		this.grade = grade;
	}
}

export const Experiences = [
	new Experience({
		company: "Overland Ferndale",
		position: "Shop Assistant",
		startDate: new Date("2021-02-01"),
		endDate: new Date("2021-02-28"),
		description:
			"Duties included POS operations, assisting customers with queries, and stock management.",
		current: false,
		shown: true,
		keyPoints: null,
		companyLink: "https://overlandsa.co.za/",
	}),
	new Experience({
		company: "Genius Premium Tuition",
		position: "Private Tutor",
		startDate: new Date("2021-08-01"),
		endDate: new Date("2022-06-30"),
		description:
			"Tutored IEB and Cambridge Mathematics, Computer Science, Computer Applications Technology, and Information Technology.",
		current: false,
		shown: true,
		keyPoints: null,
		companyLink: "https://www.geniuspremiumtuition.com/",
	}),
	new Experience({
		company: "Self-Employed",
		position: "Private Tutor",
		startDate: new Date("2021-03-01"),
		endDate: new Date("2023-06-30"),
		description: "Tutored IEB Information Technology",
		current: false,
		shown: true,
		keyPoints: null,
	}),
	new Experience({
		company: "University of Cape Town",
		position: "Tutor",
		startDate: new Date("2022-04-01"),
		endDate: new Date("2023-11-30"),
		description:
			"Tutored Computer Science courses, assisted students with assignments, and invigilated tests.",
		current: false,
		shown: true,
		keyPoints: null,
		companyLink: "https://www.uct.ac.za/",
	}),
	new Experience({
		company: "Axone Network (UCT Financial Hub of Innovation)",
		position: "Software Developer",
		startDate: new Date("2023-08-01"),
		endDate: new Date("2023-12-31"),
		description:
			"Worked on illustration, profile, and generative AI features for a social writing platform. \nTech stack:",
		current: false,
		shown: true,
		keyPoints: ["SvelteKit", "TypeScript", "MongoDB"],
		companyLink: "https://www.axone.network/",
	}),
	new Experience({
		company: "BBD Software",
		position: "Bursar",
		startDate: new Date("2021-03-01"),
		endDate: undefined,
		shown: true,
		description:
			"Bursary recipient since 2021. Opportunities to engage in vacation work and mentorship. Notably learnt:",
		keyPoints: [
			"TypeScript / Angular / React",
			"Node.js / Express / REST / MongoDB / MySQL",
			"Technical writing / Agile / Git",
		],
		companyLink: "https://www.bbdsoftware.com/",
		current: true,
	}),
	new Experience({
		company: "Nubee",
		position: "Software Developer",
		startDate: new Date("2024-03-01"),
		endDate: undefined,
		shown: true,
		description:
			"Currently working on a driving school web app. Technologies & skills:",
		keyPoints: [
			"React / Node.js / Express / PostgreSQL",
			"Google Cloud Platform",
			"Docker / CI/CD",
		],
		companyLink: "https://www.nubee.co.za/",
		current: true,
	}),
];

export const Educations = [
	new Education({
		company: "Curro Aurora High School",
		position: "IEB Matriculation",
		startDate: new Date("2016-01-15"),
		endDate: new Date("2020-11-30"),
		graduationDate: new Date("2021-02-28"),
		description: "Subjects:",
		keyPoints: [
			"English Home Language",
			"Afrikaans First Additional Language",
			"Mathematics",
			"Physical Sciences",
			"Information Technology",
			"Biology",
			"Life Orientation",
		],
		shown: true,
		companyLink: "https://www.curro.co.za/schools/curro-aurora-high-school",
		current: false,
		grade: 82.28,
	}),
	new Education({
		company: "University of Cape Town",
		position:
			"Bachelor of Science in Computer Science and Information Systems",
		startDate: new Date("2021-03-15"),
		endDate: new Date("2021-11-30"),
		graduationDate: new Date("2024-03-21"),
		description: "Major courses:",
		shown: true,
		companyLink: "https://www.uct.ac.za/",
		keyPoints: [
			"Intro Programming / OOP / Managerial Finance",
			"Databases / Data Structures",
			"Systems Analysis / Systems Design",
			"Mobile Development / Computer Architecture / Concurrent Programming",
			"IT Project Management / Business Intelligence / Business Process Management / Enterprise Systems / e-Commerce",
			"Operating Systems / Networks / Software Design / Algorithms",
		],
		grade: 79.49,
	}),
	new Education({
		company: "University of Cape Town",
		position: "Bachelor of Commerce Honours in Information Systems",
		startDate: new Date("2024-01-28"),
		endDate: undefined,
		description: "Current focuses:",
		shown: true,
		companyLink: "https://www.uct.ac.za/",
		current: true,
		keyPoints: [
			"Cybersecurity, Privacy, and Ethics",
			"Sentiment Analysis of Financial News",
			"Personalisation Engine for an e-commerce and digital content cross-platform app",
		],
		grade: null,
		graduationDate: new Date("2025-03-21"),
	}),
];

export const ShortBio = {
	bio: "Hi! 👋🏾 I'm Maesela. I am pursuing a career in software development 💻. I am passionate about the intersection of information, people, processes, and technology and how they can be leveraged to optimise businesses and bring value to users.",
	current: {
		activity: "studying",
		position: "Bachelor of Commerce Honours in Information Systems",
		company: "the University of Cape Town",
	},
};

export const Socials = {
	linkedin: "https://www.linkedin.com/in/maesela/",
	github: "https://github.com/katlego-sekoele",
	email: "mailto:sekoelekatlego@gmail.com",
	spotify: "https://open.spotify.com/user/21zhsmy8v3xkx5o73patd9r0i",
	instagram: "https://www.instagram.com/katlego.sekoele/",
};

export const About = {
	greeting: "Hey there! 👋🏾 I'm Maesela.",
	tldr: "I like to build things with code focusing on how technology, people, and processes intersect.",
	paragraphs: [
		"I am passionate about using my knowledge of computer science and business computing to make a positive impact. With a strong affinity for learning and a passion for technology, I am a firm believer in the power of continuous learning and improvement. I follow the CL/CI (continuous learning and continuous improvement) framework (totally made up), which guides me in my pursuit of personal and professional growth.",
		"In addition to my passion for technology and education, I am also interested in gaming, software development, and business. I am always looking for ways to combine my interests and skills to address niche problems and create innovative solutions.",
		"Throughout my academic career, I have proven myself to be a strong academic achiever and a self-motivated student. I am proud to have been on the Dean's Merit List for the entire duration of my undergraduate degree. I am not afraid to ask questions, seek out new challenges, and learn from my peers and those more knowledgeable than I am.",
		"I am excited to see where my studies will take me and to continue pursuing my passion for computer science.",
	],
};

class Project {
	constructor({
		name, 
		descriptionParagraphs,
		links,
		primaryLink,
		images,
	}){
		this.name = name;
		this.descriptionParagraphs = descriptionParagraphs;
		this.links = links;
		this.primaryLink = primaryLink;
		this.images = images;
	}

}

class ProjectLink {
	constructor({
		name,
		link,
	}){
		this.name = name;
		this.link = link;
	}
}

class ProjectImage {
	constructor({
		src,
		alt,
	}){
		this.src = src;
		this.alt = alt;
	}
}

export const Projects = [
	new Project({
		name: "Maesela.tech",
		descriptionParagraphs: [
			"A personal portfolio website showcasing my projects, skills, and experiences.",
			"Built with React, and deployed on Vercel. Nothing too fancy but I like it",
		],
		links: [
			new ProjectLink({
				name: "GitHub Repository",
				link: "https://github.com/Katlego-Sekoele/maesela.tech",
			}),
			new ProjectLink({
				name: "Hosted",
				link: "https://www.maesela.tech"
			})
		],
		primaryLink: "https://www.maesela.tech",
		images: [
			new ProjectImage({
				src: "portfolio.png",
				alt: "Screenshot of the portfolio website",
			}),
		],
	}),
	new Project({
		name: "Gigs",
		descriptionParagraphs: [
			"This is a web application built with Next.js that provides a platform for students to buy and sell services from each other. The website is largely unfinished and was just used as a playground to test and learn React.js and Next.js. The website is publicly hosted on this vercel."
		],
		links: [
			new ProjectLink({
				name: "GitHub",
				link: "maesela.tech",
			}),
		],
		primaryLink: "maesela.tech",
		images: [
			new ProjectImage({
				src: "portfolio.png",
				alt: "Screenshot of the portfolio website",
			}),
		],
	})
]
