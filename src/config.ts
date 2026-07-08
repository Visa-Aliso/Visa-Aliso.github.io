import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	LinksConfig,
	NavBarConfig,
	ProfileConfig,
	ProjectsConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "Aliso' Blog",
	subtitle: "Like Water. Like Code. Always Evolving",
	lang: "zh_CN", // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
	themeColor: {
		hue: 250, // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
		fixed: false, // Hide the theme color picker for visitors
	},
	banner: {
		enable: true,
		src: "/images/seele.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
		position: "center", // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
		credit: {
			enable: false, // Display the credit text of the banner image
			text: "", // Credit text to be displayed
			url: "", // (Optional) URL link to the original artwork or artist's page
		},
	},
	toc: {
		enable: true, // Display the table of contents on the right side of the post
		depth: 2, // Maximum heading depth to show in the table, from 1 to 3
	},
	favicon: [
		{
			src: "/images/avatar.jpg",
		},
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		{
			name: "Projects",
			url: "/projects/",
			external: false,
		},
		{
			name: "Links",
			url: "/links/",
			external: false,
		},
		LinkPreset.About,
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "/images/avatar.jpg", // Relative to the /src directory. Relative to the /public directory if it starts with '/'
	name: "Aliso",
	bio: "Like Water. Like Code. Always Evolving",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github", // Visit https://icones.js.org/ for icon codes
			url: "https://github.com/Visa-Aliso",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (such as background color) are being overridden, see the astro.config.mjs file.
	themeLight: "github-light",
	themeDark: "github-dark",
};

export const linksConfig: LinksConfig = {
	friends: [
		{
			name: "KiloxGo",
			description: "Homepage",
			avatar: "https://avatars.githubusercontent.com/u/120613056?v=4",
			url: "https://profile.kilox.top",
		},
	],
	siteInfo: {
		name: siteConfig.title,
		desc: siteConfig.subtitle,
		link: "https://visa-aliso.github.io/",
		avatar: "https://visa-aliso.github.io/images/avatar.jpg",
	},
	apply: {
		text: "欢迎添加友链，请按照以下要求申请：",
		list: [
			"站点需在大陆地区能正常访问，并保持稳定运行",
			"网站需要有可读的内容，不接受空壳网站",
			"如有头像，请保证图片能长期稳定打开",
			"需要先添加本站友链",
			"不可含有色情、赌博、虚假医药、高版权风险、涉政等不宜内容",
		],
		footer: "请在下方评论区按照本站信息模板留言申请。",
	},
};

export const projectsConfig: ProjectsConfig = {
	collapseThreshold: 4,
	sections: [
		{
			category: "Projects",
			items: [
				{
					name: "🏠 Personal Homepage",
					description: "A minimal, elegant personal homepage template for academics and researchers.",
					date: "2025-09",
					primaryUrl: "https://github.com/Visa-Aliso/Asipe",
					links: [{ icon: "fa6-brands:github", url: "https://github.com/Visa-Aliso/Asipe" }],
				},
				{ name: "🤖 Coming Soon", description: "Work in progress, stay tuned.", date: "", links: [], placeholder: true },
				{ name: "🎮 Coming Soon", description: "Work in progress, stay tuned.", date: "", links: [], placeholder: true },
			],
		},
		{
			category: "Learning",
			items: [
				{ name: "📐 Coming Soon", description: "Work in progress, stay tuned.", date: "", links: [], placeholder: true },
				{ name: "💻 Coming Soon", description: "Work in progress, stay tuned.", date: "", links: [], placeholder: true },
				{ name: "🧪 Coming Soon", description: "Work in progress, stay tuned.", date: "", links: [], placeholder: true },
			],
		},
	],
};
