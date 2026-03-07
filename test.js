#!/usr/bin/env node
// find-comments.js — lists .tsx files that contain comments, no modifications made

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_DIR = path.resolve(process.argv[2] || "./src");

const COMMENT_PATTERNS = [
  { type: "JSX",        re: /\{\/\*[\s\S]*?\*\/\}/  },
  { type: "block",      re: /\/\*[\s\S]*?\*\//       },
  { type: "line (//)",  re: /\/\/[^\n]*/              },
  { type: "HTML",       re: /<!--[\s\S]*?-->/         },
];

function hasComments(src) {
  return COMMENT_PATTERNS.some(({ re }) => re.test(src));
}

function walkDir(dir, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkDir(full, results);
    else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      const src = fs.readFileSync(full, "utf8");
      if (hasComments(src)) results.push(full);
    }
  }
  return results;
}

const files = walkDir(SRC_DIR);

if (!files.length) {
  console.log("No comments found in any .tsx files.");
} else {
  console.log(`Found comments in ${files.length} file(s):\n`);
  files.forEach(f => console.log(" ", f));
}