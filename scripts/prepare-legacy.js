/* Copy ../old/ legacy Hexo site into ./public/legacy/ and rewrite root-absolute
 * URLs so the static snapshot stays self-contained under the /legacy/ subpath.
 * Injects body[data-pagefind-ignore] so Pagefind skips the snapshot.
 *
 * Usage: from fuwari/ run `node scripts/prepare-legacy.js`
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.resolve(__dirname, "..", "..", "old");
const DST = path.resolve(__dirname, "..", "public", "legacy");

function rmrf(p) {
	if (!fs.existsSync(p)) return;
	fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src, dst) {
	fs.mkdirSync(dst, { recursive: true });
	for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
		const s = path.join(src, entry.name);
		const d = path.join(dst, entry.name);
		if (entry.isDirectory()) copyDir(s, d);
		else fs.copyFileSync(s, d);
	}
}

function walkHtml(dir, out = []) {
	for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
		const p = path.join(dir, entry.name);
		if (entry.isDirectory()) walkHtml(p, out);
		else if (entry.name.endsWith(".html")) out.push(p);
	}
	return out;
}

// Rewrite root-absolute URLs in src/href attributes to /legacy/...
// Skips protocol-relative (//cdn...) and full URLs (http://, https://).
function rewriteAttrs(html) {
	return html.replace(
		/(\s(?:src|href)\s*=\s*")\/(?!\/)([^"]*)"/g,
		(match, prefix, rest) => {
			// href="/" alone should map to /legacy/
			return `${prefix}/legacy/${rest}"`;
		}
	);
}

function injectPagefindIgnore(html) {
	// Skip if already injected (idempotent re-runs)
	if (/<body[^>]*data-pagefind-ignore/.test(html)) {
		return html.replace(
			/<body([^>]*)>/,
			(full, attrs) => `<body${attrs} data-legacy-site>`
		);
	}
	return html.replace(
		/<body([^>]*)>/,
		(full, attrs) => `<body${attrs} data-pagefind-ignore="true" data-legacy-site>`
	);
}

if (!fs.existsSync(SRC)) {
	console.error(`Source not found: ${SRC}`);
	process.exit(1);
}

console.log(`Preparing legacy site:`);
console.log(`  from: ${SRC}`);
console.log(`  to:   ${DST}`);

rmrf(DST);
copyDir(SRC, DST);

const htmlFiles = walkHtml(DST);
	let touched = 0;
for (const file of htmlFiles) {
	let html = fs.readFileSync(file, "utf8");
	const before = html;
	html = rewriteAttrs(html);
	html = injectPagefindIgnore(html);
	if (html !== before) {
		fs.writeFileSync(file, html);
		touched++;
	}
}

console.log(`  ${htmlFiles.length} html files scanned, ${touched} rewritten.`);
console.log(`Done. Commit public/legacy/ when ready.`);