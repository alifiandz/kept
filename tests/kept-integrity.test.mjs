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
  assert.equal(hashes.size, 64);
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

test("uses official competition logos and the locked Kept brand color", () => {
  for (const name of ["jhic-2.png", "jagoan-hosting.png", "komdigi.png", "garuda-spark.png", "ngalup.png"]) {
    assert.equal(existsSync(join(root, "public", "partners", name)), true, name);
  }
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
