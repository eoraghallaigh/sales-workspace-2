#!/usr/bin/env node
import { chromium } from "playwright";
import { readFileSync, mkdirSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const id = process.argv[2];
if (!id) {
  console.error("Usage: capture-screenshots.mjs <iteration-id>");
  process.exit(1);
}

const baseUrl = process.env.CAPTURE_BASE_URL ?? "http://localhost:8080";

// Read screenshotConfig.ts as text and extract route entries
// (avoids needing tsx/ts-node to run a TS file)
const configSource = readFileSync(
  resolve(projectRoot, "src/data/cycles/screenshotConfig.ts"),
  "utf8",
);
const routeRegex =
  /\{\s*path:\s*["']([^"']+)["']\s*,\s*name:\s*["']([^"']+)["']/g;
const routes = [];
let match;
while ((match = routeRegex.exec(configSource)) !== null) {
  routes.push({ path: match[1], name: match[2] });
}

if (routes.length === 0) {
  console.error("No routes found in screenshotConfig.ts");
  process.exit(1);
}

// Routes in the config are stored relative to a cycle; prefix them with the
// current cycle slug pulled from src/data/cycles/index.ts so the capture
// script targets the live prototype URLs.
const indexSource = readFileSync(
  resolve(projectRoot, "src/data/cycles/index.ts"),
  "utf8",
);
const currentCycleMatch = indexSource.match(
  /currentCycleSlug:\s*CycleSlug\s*=\s*["']([^"']+)["']/,
);
if (!currentCycleMatch) {
  console.error("Could not find currentCycleSlug in src/data/cycles/index.ts");
  process.exit(1);
}
const currentCycleSlug = currentCycleMatch[1];
for (const route of routes) {
  route.path = `/${currentCycleSlug}${route.path}`;
}

// Pre-flight: confirm dev server is reachable
try {
  const res = await fetch(baseUrl, {
    signal: AbortSignal.timeout(3000),
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`HTTP ${res.status}`);
  }
} catch (err) {
  console.error(
    `Dev server not reachable at ${baseUrl}. Start it with /run-app first.`,
  );
  console.error(`(${err.message})`);
  process.exit(1);
}

const outDir = resolve(projectRoot, "public/about/iterations", id);
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

console.log(`Capturing ${routes.length} routes → ${outDir}`);

for (const route of routes) {
  const url = `${baseUrl}${route.path}`;
  process.stdout.write(`  ${route.name.padEnd(20)} ${route.path} ... `);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
    // Small settle delay for any post-load animations
    await page.waitForTimeout(300);
    const filePath = join(outDir, `${route.name}.png`);
    await page.screenshot({ path: filePath, fullPage: false });
    console.log("ok");
  } catch (err) {
    console.log(`failed (${err.message})`);
  }
}

await browser.close();
console.log("Done.");
