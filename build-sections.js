const fs = require("node:fs");

const sectionFiles = [
  "sections/hero.html",
  "sections/intro.html",
  "sections/explorations.html",
  "sections/guide.html",
  "sections/galerie.html",
  "sections/avis.html",
  "sections/contact.html",
];

const template = fs.readFileSync("index.template.html", "utf8");
const sections = sectionFiles.map((file) => fs.readFileSync(file, "utf8").trim()).join("\n\n");

fs.writeFileSync("index.html", template.replace("<!-- SECTIONS -->", sections));
