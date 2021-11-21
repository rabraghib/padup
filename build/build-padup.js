const start = +new Date();
const fs = require("fs");
const fsExtra = require("fs-extra");
const sass = require("sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const CleanCSS = require("clean-css");
const {
  log,
  logBuildStart,
  logSeparatedMsg,
  fullPathOf,
} = require("./scripts-utils");

const DIST_FOLDER = fullPathOf("dist");
const ENTRIES_FILENAMES = ["ngaox"];

logBuildStart("PadUp");
logSeparatedMsg(`Building scss entry files`, "", false);

// delete css directory
if (fs.existsSync(fullPathOf("css"))) {
  try {
    fs.rmdirSync(fullPathOf("css"), { recursive: true });
    fs.rmdirSync(DIST_FOLDER, { recursive: true });
  } catch (err) {
    console.error(`Error while deleting old css & dist folders.`);
  }
}
log(`Clearing output directories.`, "greenCheckMark", false);

// compile scss
fs.mkdirSync(fullPathOf("css"));
ENTRIES_FILENAMES.forEach((filename) => {
  compileFile(filename, true);
  log(
    `Entry file '${filename}.scss' compiled successfully!`,
    "greenCheckMark",
    false
  );
});
console.log("");
logSeparatedMsg(`CSS Built done! to: ${fullPathOf("css")}`, "green");
const end = +new Date();
log(`Build at: ${new Date().toISOString()} - Time: ${end - start}ms`);

// copy padup folder to dist
// fsExtra.copy(fullPathOf(""), DIST_FOLDER).then(() => {
//   // scripts end
//   console.log("");
//   logSeparatedMsg(`Built done! to: ${DIST_FOLDER}`, "green");
//   const end = +new Date();
//   log(`Build at: ${new Date().toISOString()} - Time: ${end - start}ms`);
// });

function compileFile(filename, optimize = false) {
  const css_path = fullPathOf(`css\\${filename}.css`);
  const css_map_path = css_path + ".map";
  const css_min_path = fullPathOf(`css\\${filename}.min.css`);
  const result = sass.renderSync({
    file: fullPathOf(`scss\\themes\\${filename}.scss`),
    outFile: css_path,
    sourceMap: !optimize,
    outputStyle: "expanded",
  });
  fs.writeFileSync(css_path, result.css);
  if (result.map) {
    fs.writeFileSync(css_map_path, result.map);
  }

  if (optimize) {
    const css = fs.readFileSync(css_path);
    postcss([autoprefixer])
      .process(css, { from: css_path, to: css_path })
      .then((result) => {
        fs.writeFileSync(css_path, result.css);
        if (result.map) {
          fs.writeFileSync(css_map_path, result.map);
        }
        const minifiedCss = new CleanCSS({}).minify(result.css);
        fs.writeFileSync(css_min_path, minifiedCss.styles);
      });
  }
}
