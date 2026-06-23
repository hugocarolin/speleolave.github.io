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

const sections = Object.fromEntries(
  sectionFiles.map((file) => [file, fs.readFileSync(file, "utf8").trim()])
);

fs.writeFileSync(
  "sections.js",
  `// Fichier genere depuis sections/*.html. Relancer: node build-sections.js\nwindow.SPELEOLAVE_SECTIONS = ${JSON.stringify(sections, null, 2)};\n`
);
