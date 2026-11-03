/* Rebuilds the Kashmir valley in index.html from its source.

     node tools/valley/apply.js            write it into index.html
     node tools/valley/apply.js --check    exit 1 if index.html has drifted

   gen.js draws the panorama's paths (seeded, so the same every run) and
   build.js turns them into the HTML fragment; this puts the fragment
   between <!--kv:start--> and <!--kv:end--> in index.html. Change the art
   in gen.js or build.js, never by hand in index.html: --check fails when
   the two disagree. Node only, no packages; the site itself has no build. */
const fs = require("fs"), path = require("path"), os = require("os"), { execFileSync } = require("child_process");
const here = __dirname, page = path.join(here, "..", "..", "index.html");
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "valley-"));
const paths = path.join(tmp, "paths.json"), frag = path.join(tmp, "kv.html");
execFileSync(process.execPath, [path.join(here, "gen.js"), paths], { stdio: "ignore" });
execFileSync(process.execPath, [path.join(here, "build.js"), paths, frag], { stdio: "ignore" });
const html = fs.readFileSync(page, "utf8"), art = fs.readFileSync(frag, "utf8").trim();
const m = /(<!--kv:start-->)([\s\S]*?)(<!--kv:end-->)/.exec(html);
if(!m){ console.error("index.html has no <!--kv:start--> ... <!--kv:end--> markers"); process.exit(2); }
const inner = m[2], lead = inner.slice(0, inner.length - inner.trimStart().length), tail = inner.slice(inner.trimEnd().length);
fs.rmSync(tmp, { recursive: true, force: true });
if(process.argv.includes("--check")){
  const same = inner.trim() === art;
  console.log(same ? "valley: index.html matches tools/valley" : "valley: index.html differs from tools/valley");
  process.exit(same ? 0 : 1);
}
fs.writeFileSync(page, html.slice(0, m.index + m[1].length) + lead + art + tail + html.slice(m.index + m[0].length - m[3].length));
console.log("valley: written into index.html (" + art.length + " bytes)");
