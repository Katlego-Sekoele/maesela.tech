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
		endDate: new Date("2024-10-31"),
		shown: true,
		description:
			"Bursary recipient since 2021. Opportunities to engage in vacation work and mentorship. Notably learnt:",
		keyPoints: [
			"TypeScript / Angular / React",
			"Node.js / Express / REST / MongoDB / MySQL",
			"Technical writing / Agile / Git",
		],
		companyLink: "https://www.bbdsoftware.com/",
		current: false,
	}),
	new Experience({
		company: "Nubee",
		position: "Software Developer",
		startDate: new Date("2024-03-01"),
		endDate: new Date("2024-05-01"),
		shown: true,
		description:
			"Worked on a driving school web app. Technologies & skills:",
		keyPoints: [
			"React / Node.js / Express / PostgreSQL",
			"Google Cloud Platform",
			"Docker / CI/CD",
		],
		companyLink: "https://www.nubee.co.za/",
		current: false,
	}),
	new Experience({
		company: "BBD Software",
		position: "Junior Software Engineer",
		startDate: new Date("2025-01-13"),
		endDate: undefined,
		shown: true,
		description:
			"Build features end-to-end on a large enterprise HR & workforce-management platform (Nx monorepo) serving ~1,000 employees, across the full stack.",
		keyPoints: [
			"Owned a greenfield internal-mobility product: relational schema, REST APIs, a configurable status state machine, multi-level approval workflows, audit trail, and queue-driven email",
			"Full-stack across Angular, Node.js/Express, and SQL Server (migrations, stored procedures, triggers, point-in-time analytics), deployed via Docker on Azure",
			"Built HR analytics dashboards and a chunked bulk-import pipeline (Azure blob/queue triggers); integrated the enterprise directory via Microsoft Graph API",
			"Built custom AI dev workflows (Cursor, Claude Code, MCP) automating ticket creation and release notes",
		],
		companyLink: "https://www.bbdsoftware.com/",
		current: true,
	}),
];

export const Educations = [
	new Education({
		company: "University of Cape Town",
		position: "MPhil specialising in Financial Technology",
		startDate: new Date("2025-02-01"),
		endDate: undefined,
		description: "Focus areas:",
		keyPoints: [
			"Financial Software Engineering",
			"Fintech & Cryptocurrencies",
			"Databases",
			"Supervised Learning",
		],
		shown: true,
		companyLink: "https://www.uct.ac.za/",
		current: true,
		grade: undefined,
		graduationDate: new Date("2027-12-15"),
	}),
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
		endDate: new Date("2024-10-31"),
		description: "Major focuses:",
		shown: true,
		companyLink: "https://www.uct.ac.za/",
		current: false,
		keyPoints: [
			"Cybersecurity, Privacy, and Ethics",
			"Sentiment Analysis of Financial News",
			"Personalisation Engine for an e-commerce and digital content cross-platform app",
			"IT Project Management"
		],
		grade: 72.14,
		graduationDate: new Date("2025-03-21"),
	}),
];

export const ShortBio = {
	bio: "Hi! 👋🏾 I'm Maesela — an impact-driven full-stack software engineer building on a large enterprise HR & workforce-management platform. I love the intersection of information, people, processes, and technology, and owning features end-to-end: from SQL Server schema to Node.js/TypeScript APIs to the Angular UI.",
	current: {
		activity: "working as a",
		position: "Junior Software Engineer",
		company: "BBD Software",
		interests: [
			"Agentic AI",
			"Financial technology",
			"Full-stack web development",
		]
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
		"In addition to my passion for technology and education, I am also interested in gaming, music festivals, and to a lesser extent, fashion.",
		"Throughout my academic career, I have proven myself to be a strong academic achiever and a self-motivated student. I am proud to have been on the Dean's Merit List for the entire duration of my undergraduate degree and completed my honours degree with a distinction in my research project. I am not afraid to ask questions, seek out new challenges, and learn from my peers and those more knowledgeable than I am.",
		"A highlight along the way: my team won the national Discovery GradHack (R100 000 prize), selected among 50 finalists from universities across South Africa, with SafeRoute — a data-driven, real-time safe-navigation app that pre-plans routes avoiding load-shedding and crime hotspots.",
		"I am excited to see where my career will take me and to continue pursuing my passion for software engineering.",
	],
};

class Certification {
	constructor({
		name,
		detailsLink,
		verificationLink,
		description,
		acquiredDate,
		expiryDate,
		shown = false,
	}){
		this.name = name;
		this.detailsLink = detailsLink;
		this.verificationLink = verificationLink;
		this.description = description;
		this.acquiredDate = acquiredDate;
		this.expiryDate = expiryDate;
		this.shown = shown;
	}
}

export const Certifications = [
	new Certification({
		name: "AWS Developer Associate (DVA-C02)",
		detailsLink: "https://aws.amazon.com/certification/certified-developer-associate/",
		verificationLink: "https://www.credly.com/badges/c96ebfbf-d433-4270-a365-11d676b51ceb/linked_in_profile",
		description: "AWS Certified Developer - Associate showcases skills and knowledge in developing, optimizing, packaging, and deploying applications, using CI/CD workflows, and identifying and resolving application issues. This certification is a good starting point on the AWS Certification journey for individuals in IT or cloud developer job roles.",
		acquiredDate: new Date("2025-11-18"),
		expiryDate: new Date("2028-11-18"),
		shown: true,
	}),
]

class Video {
	constructor({
		title,
		link,
		description,
		publishedDate,
		thumbnail,
		shown = false,
	}){
		this.title = title;
		this.link = link;
		this.description = description;
		this.publishedDate = publishedDate;
		this.thumbnail = thumbnail;
		this.shown = shown;
	}
}

export const Videos = [
	new Video({
		title: "Tetris in a PDF?",
		link: "https://youtu.be/0fo0-9t1558?si=aZnxgdN2YSisBTDj",
		description: `What if a "digital piece of paper" wasn't so passive after all? In this talk, we explore how PDFs are far more powerful than most of us realise. It is powerful enough to run interactive games like Tetris. What started as a viral tweet turned into a deep dive into the internals of the PDF format: how PDFs are structured, how they support interactivity, and how JavaScript and form elements can be combined to create fully interactive experiences.`,
		publishedDate: new Date("2025-12-22"),
		shown: true,
	}),
]

class Project {
	constructor({
		name,
		descriptionParagraphs,
		links,
		primaryLink,
		images,
		shown = true,
	}){
		this.name = name;
		this.descriptionParagraphs = descriptionParagraphs;
		this.links = links;
		this.primaryLink = primaryLink;
		this.images = images;
		this.shown = shown;
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
			"My personal portfolio site — the one you're on now. Built with React and Vite and deployed on Vercel.",
			"An editorial, type-led design with light/dark theming. Nothing too fancy, but I like it.",
		],
		links: [
			new ProjectLink({
				name: "GitHub",
				link: "https://github.com/Katlego-Sekoele/maesela.tech",
			}),
			new ProjectLink({
				name: "Hosted",
				link: "https://www.maesela.tech",
			}),
		],
		primaryLink: "https://www.maesela.tech",
		images: [],
	}),
	new Project({
		name: "HERP",
		descriptionParagraphs: [
			"A content-driven web app built with Next.js and TypeScript, backed by Contentful as a headless CMS.",
			"Uses a shadcn/ui + Radix component system, TanStack Query for data fetching, and Recharts for data visualisation.",
		],
		links: [
			new ProjectLink({
				name: "GitHub",
				link: "https://github.com/Katlego-Sekoele/herp",
			}),
			new ProjectLink({
				name: "Hosted",
				link: "https://herp-six.vercel.app",
			}),
		],
		primaryLink: "https://herp-six.vercel.app",
		images: [],
	}),
	new Project({
		name: "Financial News Sentiment Analysis",
		descriptionParagraphs: [
			"My honours research project: a full-stack financial-news sentiment analysis tool built following a Design Science Research methodology.",
			"A Python/Flask API scrapes headlines (BeautifulSoup) and runs an NLTK pipeline (tokenisation, lemmatisation, stop-word removal) before classification. I trained and compared SVM (scikit-learn), word embeddings (gensim), and neural networks (TensorFlow/Keras) on the Financial PhraseBank, evaluating with F1, MCC, and non-parametric significance tests. Predictions surface in a Next.js + TypeScript dashboard.",
		],
		links: [
			new ProjectLink({
				name: "GitHub",
				link: "https://github.com/Katlego-Sekoele/Automatic-Financial-News-Sentiment-Analysis",
			}),
		],
		primaryLink: "https://github.com/Katlego-Sekoele/Automatic-Financial-News-Sentiment-Analysis",
		images: [],
	}),
	new Project({
		name: "Boids Flocking Simulation",
		descriptionParagraphs: [
			"A Java + JavaFX implementation of Craig Reynolds' \"Boids\" algorithm, simulating the emergent flocking of birds, herds, and schools.",
			"Built in a team of three, planned extensively with UML and managed with a Kanban approach in Notion.",
		],
		links: [],
		primaryLink: null,
		images: [],
	}),
	new Project({
		name: "Business Process Improvement for SAPS",
		descriptionParagraphs: [
			"A business-process management and improvement consulting project for the South African Police Service and the Department of Public Service and Administration.",
			"Worked in a team of six to analyse a business process and propose improvements; the report earned recognition from EY for its quality and suggestions.",
		],
		links: [],
		primaryLink: null,
		images: [],
	}),
	new Project({
		name: "Election Platform",
		descriptionParagraphs: [
			"A voting/election web platform with a React (Create React App) frontend and an Express backend.",
			"Uses Supabase for authentication, including email-confirmation flows.",
		],
		links: [
			new ProjectLink({
				name: "GitHub",
				link: "https://github.com/Katlego-Sekoele/election-platform",
			}),
			new ProjectLink({
				name: "Hosted",
				link: "https://election-platform.vercel.app",
			}),
		],
		primaryLink: "https://election-platform.vercel.app",
		images: [],
	}),
	new Project({
		name: "Gigs",
		descriptionParagraphs: [
			"A student services marketplace built with Next.js — a platform where students can buy and sell services from one another.",
			"A playground project for learning React and Next.js; largely a work in progress.",
		],
		links: [
			new ProjectLink({
				name: "GitHub",
				link: "https://github.com/Katlego-Sekoele/gigs",
			}),
			new ProjectLink({
				name: "Hosted",
				link: "https://gigs-silk.vercel.app",
			}),
		],
		primaryLink: "https://gigs-silk.vercel.app",
		images: [],
	}),
	new Project({
		name: "Home Goods Store",
		descriptionParagraphs: [
			"An e-commerce site for home goods, built with Angular as a way to learn and explore the framework.",
		],
		links: [
			new ProjectLink({
				name: "GitHub",
				link: "https://github.com/Katlego-Sekoele/HomeGoodsStore",
			}),
			new ProjectLink({
				name: "Hosted",
				link: "https://inf3014f-tutorial-2.onrender.com/",
			}),
		],
		primaryLink: "https://inf3014f-tutorial-2.onrender.com/",
		images: [],
	}),
	new Project({
		name: "TOKDOC Protocol",
		descriptionParagraphs: [
			"A custom application-layer protocol designed and implemented in a Python client-server application — a first venture into socket programming and protocol design.",
			"A team project with Owethu Novuka and Tiyani Mhlarhi; I designed and built the client.",
		],
		links: [
			new ProjectLink({
				name: "Client",
				link: "https://github.com/Katlego-Sekoele/TOKDOC-Protocol-Client",
			}),
			new ProjectLink({
				name: "Server",
				link: "https://github.com/Katlego-Sekoele/TOKDOC-Protocol-Server",
			}),
		],
		primaryLink: "https://github.com/Katlego-Sekoele/TOKDOC-Protocol-Client",
		images: [],
	}),
	new Project({
		name: "BBD Water Pipe",
		descriptionParagraphs: [
			"A browser-based pipe-connecting puzzle game built with vanilla HTML, CSS, and JavaScript.",
		],
		links: [
			new ProjectLink({
				name: "GitHub",
				link: "https://github.com/Katlego-Sekoele/BBD_Water_Pipe",
			}),
		],
		primaryLink: "https://github.com/Katlego-Sekoele/BBD_Water_Pipe",
		images: [],
	}),
];
