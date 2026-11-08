import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

const root = process.cwd();
const destinationRoot = join(root, "public", "destinations");
const slugs = ["gunung-bromo", "labuan-bajo", "dieng-plateau", "nusa-penida", "raja-ampat", "gunung-rinjani", "belitung", "borobudur"];

test("ships eight unique local images for every destination", () => {
  const hashes = new Set();
  for (const slug of slugs) {
    const folder = join(destinationRoot, slug);
    const files = readdirSync(folder).filter((file) => file.endsWith(".webp")).sort();
    assert.deepEqual(files, ["01.webp", "02.webp", "03.webp", "04.webp", "05.webp", "06.webp", "07.webp", "08.webp"]);
    for (const file of files) {
      const imagePath = join(folder, file);
      assert.ok(statSync(imagePath).size > 1_000, `empty or invalid image: ${slug}/${file}`);
      const hash = createHash("sha256").update(readFileSync(imagePath)).digest("hex");
      assert.equal(hashes.has(hash), false, `duplicate image bytes: ${slug}/${file}`);
      hashes.add(hash);
    }
  }
  const coverRoot = join(root, "public", "covers");
  const covers = readdirSync(coverRoot).filter((file) => file.endsWith(".webp")).sort();
  assert.deepEqual(covers, slugs.map((slug) => `${slug}.webp`).sort());
  for (const file of covers) {
    const coverPath = join(coverRoot, file);
    assert.ok(statSync(coverPath).size > 1_000, `empty or invalid cover: ${file}`);
    const hash = createHash("sha256").update(readFileSync(coverPath)).digest("hex");
    assert.equal(hashes.has(hash), false, `cover duplicates another image: ${file}`);
    hashes.add(hash);
  }
  const heroPath = join(root, "public", "bromo.webp");
  assert.ok(statSync(heroPath).size > 1_000, "empty or invalid homepage hero");
  const heroHash = createHash("sha256").update(readFileSync(heroPath)).digest("hex");
  assert.equal(hashes.has(heroHash), false, "homepage hero duplicates another image");
  hashes.add(heroHash);
  assert.equal(hashes.size, 73);
});

test("records a credit for every destination image", () => {
  const credits = JSON.parse(readFileSync(join(root, "public", "image-credits.json"), "utf8"));
  assert.equal(credits.length, 64);
  assert.equal(new Set(credits.map((credit) => credit.path)).size, 64);
  for (const credit of credits) {
    assert.ok(credit.creator);
    assert.ok(credit.license);
    assert.ok(credit.source?.startsWith("https://commons.wikimedia.org/"));
  }
});

test("records a transparent credit status for every destination cover", () => {
  const credits = JSON.parse(readFileSync(join(root, "public", "cover-credits.json"), "utf8"));
  assert.equal(credits.length, 8);
  assert.equal(new Set(credits.map((credit) => credit.path)).size, 8);
  for (const credit of credits) {
    assert.ok(credit.creator);
    assert.ok(credit.license);
  }
});

test("records the homepage hero source and license", () => {
  const credits = JSON.parse(readFileSync(join(root, "public", "hero-credits.json"), "utf8"));
  assert.equal(credits.length, 1);
  assert.equal(credits[0].path, "/bromo.webp");
  assert.ok(credits[0].creator);
  assert.ok(credits[0].license);
});

test("keeps the standalone identity and Kept brand color", () => {
  const layout = readFileSync(join(root, "app", "layout.tsx"), "utf8");
  const home = readFileSync(join(root, "app", "page.tsx"), "utf8");
  assert.doesNotMatch(layout + home, /JHIC|Team Knot|SMA LHI|CompetitionLogos/i);
  const css = readFileSync(join(root, "app", "globals.css"), "utf8");
  assert.match(css, /--blue:\s*#496af1/i);
});

test("keeps product language consistent and avoids remote runtime images", () => {
  const sources = [
    join(root, "app", "page.tsx"),
    join(root, "app", "destination", "page.tsx"),
    join(root, "app", "tour", "page.tsx"),
    join(root, "app", "account", "page.tsx"),
    join(root, "components", "account-controls.tsx"),
    join(root, "lib", "kept-data.ts"),
  ].map((path) => readFileSync(path, "utf8")).join("\n");
  assert.doesNotMatch(sources, /Promise Snapshot/i);
  assert.doesNotMatch(sources, /<img[^>]+src=["']https?:\/\//i);
  assert.match(sources, /Kept tidak memproses booking atau pembayaran/);
});

test("keeps direct-link error states from getting stuck in loading", () => {
  const tourPage = readFileSync(join(root, "app", "tour", "page.tsx"), "utf8");
  const destinationPage = readFileSync(join(root, "app", "destination", "page.tsx"), "utf8");
  assert.match(tourPage, /getTour\(params\.get\("slug"\)\) \?\? null/);
  assert.match(destinationPage, /getDestination\(new URLSearchParams\(window\.location\.search\)\.get\("slug"\)\) \?\? null/);
});

test("starts discovery broadly and fully resets visible search filters", () => {
  const homePage = readFileSync(join(root, "app", "page.tsx"), "utf8");
  assert.match(homePage, /useState\("Semua kota"\)/);
  assert.match(homePage, /useState\("Semua bulan"\)/);
  assert.match(homePage, /setFrom\("Semua kota"\)/);
  assert.match(homePage, /setDate\("Semua bulan"\)/);
  assert.match(homePage, /requestedFrom\.startsWith\("semua"\)/);
});

test("uses the approved demo identity and visible Traveler role language", () => {
  const accountData = readFileSync(join(root, "lib", "kept-account.ts"), "utf8");
  const accountUi = [
    readFileSync(join(root, "components", "account-controls.tsx"), "utf8"),
    readFileSync(join(root, "app", "account", "page.tsx"), "utf8"),
  ].join("\n");
  assert.match(accountData, /name: "Alifian Dzaky Makarim"/);
  assert.match(accountData, /initials: "AD"/);
  assert.doesNotMatch(accountUi, /Traveller/);
  assert.match(accountUi, /Traveler Mode/);
});

test("keeps common phone widths in a stable single-column interaction layout", () => {
  const css = readFileSync(join(root, "app", "globals.css"), "utf8");
  const phoneRules = css.slice(css.lastIndexOf("@media (max-width: 480px)"));
  assert.match(phoneRules, /\.mode-tabs\s*\{\s*grid-template-columns:\s*repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(phoneRules, /\.search-field,\.search-field\.wide\s*\{\s*flex-basis:\s*100%/);
  assert.match(phoneRules, /\.operator-home-actions\s*\{\s*flex-direction:\s*column/);
  assert.match(phoneRules, /\.operator-home-metrics,\.operator-performance-grid,\.operator-quick-grid\s*\{\s*grid-template-columns:\s*1fr/);
  assert.match(phoneRules, /\.mobile-mode-quick span\s*\{\s*display:\s*none/);
});

test("keeps internal navigation client-side to avoid full-page flashes", () => {
  const navigation = readFileSync(join(root, "components", "smooth-navigation.tsx"), "utf8");
  const layout = readFileSync(join(root, "app", "layout.tsx"), "utf8");
  const interactiveSources = [
    join(root, "app", "page.tsx"),
    join(root, "app", "account", "page.tsx"),
    join(root, "components", "account-controls.tsx"),
  ].map((path) => readFileSync(path, "utf8")).join("\n");
  assert.match(navigation, /router\.push\(next/);
  assert.match(navigation, /router\.prefetch/);
  assert.match(layout, /<SmoothNavigation\s*\/>/);
  assert.doesNotMatch(interactiveSources, /window\.location\.href\s*=/);
});

test("prevents Account Center content from widening the mobile viewport", () => {
  const css = readFileSync(join(root, "app", "globals.css"), "utf8");
  const phoneRules = css.slice(css.lastIndexOf("@media (max-width: 480px)"));
  assert.match(phoneRules, /\.account-shell,[\s\S]*\.mobile-role-switch\s*\{\s*min-width:\s*0;\s*max-width:\s*100%/);
  assert.match(phoneRules, /\.account-tab-list\s*\{\s*width:\s*100%\s*!important;\s*overflow-x:\s*auto/);
  assert.match(phoneRules, /\.mobile-role-switch\s*\{\s*width:\s*100%;\s*grid-template-columns:\s*minmax\(0,1fr\)\s*minmax\(0,1fr\)/);
  assert.match(phoneRules, /\.organizer-tour-row\s*\{\s*width:\s*100%;\s*min-width:\s*0;\s*grid-template-columns:\s*minmax\(0,1fr\)/);
  assert.match(phoneRules, /\.account-content fieldset,[\s\S]*\.account-form textarea\s*\{\s*min-width:\s*0;\s*max-width:\s*100%/);
});

test("keeps Promise Card and Reality Check as one traceable six-promise flow", () => {
  const data = readFileSync(join(root, "lib", "kept-data.ts"), "utf8");
  const tourPage = readFileSync(join(root, "app", "tour", "page.tsx"), "utf8");
  assert.match(data, /title: "Itinerary utama"/);
  assert.match(data, /completedReality\(promises, capacity\)/);
  assert.match(data, /realityResponses:/);
  assert.match(tourPage, /Peserta tidak mengubah Promise Card/);
  assert.match(tourPage, /Lihat cara mengisi/);
  assert.match(tourPage, /PRATINJAU ALUR PESERTA/);
  assert.match(tourPage, /tour\.realityResponses} dari {tour\.verifiedParticipants}/);
});
