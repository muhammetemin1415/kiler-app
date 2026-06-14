import { mkdir, copyFile, cp, rm } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const outDir = join(root, "www");
const files = ["index.html", "styles.css", "app.js", "manifest.json"];

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

for (const file of files) {
  await copyFile(join(root, file), join(outDir, file));
}

await cp(join(root, "src"), join(outDir, "src"), { recursive: true });

console.log(`Copied ${files.length} web files and src/ to www/`);
