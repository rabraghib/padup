const path = require("path");

const SRC_DIR = path.resolve(`${__dirname}\\..\\`).replace(/\\/g, "/");
const fullPathOf = (itemPath) =>
  path.resolve(`${SRC_DIR}\\${itemPath}`).replace(/\\/g, "/");

function log(msg, color, newLine = true) {
  colors = {
    green: "\x1b[32m",
    blue: "\x1b[34m",
    greenCheckMark: "\x1b[32m" + "✓ " + "\x1b[0m",
    redFailMark: "\x1b[31m" + "X " + "\x1b[0m",
  };
  console.log((colors[color] || "") + msg + "\x1b[0m" + (newLine ? "\n" : ""));
}
const logBuildStart = (pkg) => log(`Building package: ${pkg}`, "blue");
const logSeparatedMsg = (
  msg,
  color = "",
  newLine = true,
  textColor = color
) => {
  log(
    `------------------------------------------------------------------------------`,
    color,
    false
  );
  log(`${msg}`, textColor, false);
  log(
    `------------------------------------------------------------------------------`,
    color,
    newLine
  );
};

module.exports = {
  log,
  logBuildStart,
  logSeparatedMsg,
  fullPathOf,
};
