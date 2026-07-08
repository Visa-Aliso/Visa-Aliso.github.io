import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

function ecThemeForCurrentMode(): string {
	const isDark = document.documentElement.classList.contains("dark");
	return isDark ? expressiveCodeConfig.themeDark : expressiveCodeConfig.themeLight;
}

let systemThemeListener: (() => void) | null = null;

function removeSystemListener() {
	if (systemThemeListener) {
		window.matchMedia("(prefers-color-scheme: dark)").removeEventListener("change", systemThemeListener);
		systemThemeListener = null;
	}
}

function registerSystemListener() {
	const mq = window.matchMedia("(prefers-color-scheme: dark)");
	systemThemeListener = () => {
		if (mq.matches) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
		document.documentElement.setAttribute("data-theme", ecThemeForCurrentMode());
	};
	mq.addEventListener("change", systemThemeListener);
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	removeSystemListener();
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			registerSystemListener();
			break;
	}

	// Set the theme for Expressive Code
	document.documentElement.setAttribute(
		"data-theme",
		ecThemeForCurrentMode(),
	);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
