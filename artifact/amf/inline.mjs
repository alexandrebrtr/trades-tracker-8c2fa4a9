// Assemble dist/ en un seul fichier HTML publiable (sans <html>/<head>/<body>, ajoutés à la publication).
import fs from "fs";
import path from "path";
const dist = path.resolve(path.dirname(new URL(import.meta.url).pathname), "dist");
const out = process.argv[2] ?? path.join(dist, "academie-amf.html");
const assets = fs.readdirSync(path.join(dist, "assets"));
const css = assets.filter((f) => f.endsWith(".css")).map((f) => fs.readFileSync(path.join(dist, "assets", f), "utf8")).join("\n");
const js = assets.filter((f) => f.endsWith(".js")).map((f) => fs.readFileSync(path.join(dist, "assets", f), "utf8")).join("\n");
// @import doit précéder toute règle : on le sort en <link>.
const imports = [...css.matchAll(/@import url\(['"]?([^'")]+)['"]?\);?/g)].map((m) => m[1]);
const cssBody = css.replace(/@import url\([^)]*\);?/g, "");
const html = `<title>Académie AMF</title>
<meta name="claude:viewport-fit-sides" content="cover">
${imports.map((u) => `<link rel="stylesheet" href="${u}">`).join("\n")}
<style>${cssBody.replace(/<\/style/gi, "<\\/style")}</style>
<div id="amf-root"></div>
<script type="module">${js.replace(/<\/script/gi, "<\\/script").replace(/\uFFFD/g, "\\uFFFD")}</script>
`;
fs.writeFileSync(out, html);
console.log(out, (html.length / 1024).toFixed(0) + " KB");
