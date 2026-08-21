import assert from "node:assert/strict";
import { access, open, readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const output = new URL("../out/", import.meta.url);

test("exports the complete LWD research page", async () => {
  const html = await readFile(new URL("index.html", output), "utf8");
  const required = [
    "Learning while Deploying: Fleet-Scale Reinforcement Learning for Generalist Robot Policies",
    "Apr 30, 2026",
    "Imagine bringing home a single robot as your all-in-one kitchen assistant",
    "fleet-scale offline-to-online RL framework",
    "A Generalist Learns Beyond Demonstrations",
    "Successful executions, failed attempts, partial progress, failure recoveries",
    "An Offline-to-Online RL Data Flywheel",
    "offline RL initialization",
    "Challenges of Fleet-Scale RL for Generalist Policies",
    "Distributional Implicit Value Learning",
    "Policy Extraction with QAM",
    "Generalist Policy for Multiple Real-World Tasks",
    "Agibot G1 dual-arm robots across eight real-world manipulation tasks",
    "Fleet of Robots",
    "Brew Gongfu Tea",
    "Make Cocktail",
    "Make Fruit Juice",
    "Pack Shoes",
    "Grocery",
    "Toward Large-Scale Deployment",
    "full spectrum of real-world experience accumulated across robot fleets",
  ];
  for (const phrase of required) assert.match(html, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));

  assert.equal((html.match(/href="https:\/\/arxiv\.org\/abs\/2605\.00416"/g) ?? []).length, 2);
  assert.doesNotMatch(html, /href="\/lwd\.pdf"/);
  assert.match(html, /media\/teaser\.mp4/);
  assert.match(html, /media\/posters\/teaser\.jpg/);
  assert.doesNotMatch(html, /flywheel\.mp4/);
  assert.doesNotMatch(html, /output_2x\.mp4/);
  assert.doesNotMatch(html, /media\/fly\.mp4/);
  for (let index = 0; index < 6; index += 1) {
    assert.match(html, new RegExp(`media/tasks/${index}\\.mp4`));
    assert.match(html, new RegExp(`media/tasks/posters/${index}\\.jpg`));
  }
  assert.doesNotMatch(html, /finch\.agibot\.com|AGIBOT Finch|Join us|research@agibot\.com|G-GE3BF609W8/i);
  assert.doesNotMatch(html, /codex-preview|starter project|your site is taking shape/i);
});

test("publishes local paper, imagery, fonts, and fast-start videos", async () => {
  const requiredFiles = [
    "lwd.pdf",
    "og.png",
    "media/cover.png",
    "media/teaser.png",
    "media/method.png",
    "media/exp_res.png",
    "media/posters/teaser.jpg",
    "fonts/Satoshi-Regular.ttf",
    "fonts/DMSans-Regular.ttf",
  ];
  await Promise.all(requiredFiles.map((name) => access(new URL(name, output))));

  const media = new URL("media/", output);
  const tasks = new URL("tasks/", media);
  const topLevelVideos = (await readdir(media)).filter((name) => name.endsWith(".mp4"));
  assert.deepEqual(topLevelVideos.sort(), ["teaser.mp4"]);
  const taskVideos = (await readdir(tasks)).filter((name) => name.endsWith(".mp4"));
  assert.deepEqual(taskVideos.sort(), ["0.mp4", "1.mp4", "2.mp4", "3.mp4", "4.mp4", "5.mp4"]);
  await Promise.all(taskVideos.map((name) => access(new URL(`posters/${name.replace(".mp4", ".jpg")}`, tasks))));

  const videos = [
    ...topLevelVideos.map((name) => ({ name, url: new URL(name, media) })),
    ...taskVideos.map((name) => ({ name: `tasks/${name}`, url: new URL(name, tasks) })),
  ];
  for (const { name, url } of videos) {
    const info = await stat(url);
    assert.ok(info.size < 100 * 1024 * 1024, `${name} exceeds 100 MiB`);
    const handle = await open(url, "r");
    const buffer = Buffer.alloc(1024 * 1024);
    const { bytesRead } = await handle.read(buffer, 0, buffer.length, 0);
    await handle.close();
    const header = buffer.subarray(0, bytesRead).toString("latin1");
    assert.ok(header.indexOf("moov") >= 0 && header.indexOf("moov") < header.indexOf("mdat"), `${name} is not fast-start`);
  }

  const paper = await readFile(new URL("lwd.pdf", output));
  assert.equal(paper.subarray(0, 4).toString(), "%PDF");
  const og = await readFile(new URL("og.png", output));
  assert.equal(og.readUInt32BE(16), 1200);
  assert.equal(og.readUInt32BE(20), 630);
});

test("keeps GitHub Pages and local preview configuration", async () => {
  const [config, workflow, server] = await Promise.all([
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8"),
    readFile(new URL("../scripts/serve-static.mjs", import.meta.url), "utf8"),
  ]);
  assert.match(config, /GITHUB_REPOSITORY/);
  assert.match(config, /basePath/);
  assert.match(workflow, /actions\/deploy-pages@v5/);
  assert.match(server, /Content-Range/);
});
