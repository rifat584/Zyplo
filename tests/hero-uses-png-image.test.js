const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("hero uses the PNG dashboard image instead of HeroAppMock", () => {
  const heroPath = path.join(
    __dirname,
    "..",
    "src",
    "components",
    "Home",
    "Hero",
    "Hero.jsx",
  );
  const source = fs.readFileSync(heroPath, "utf8");

  assert.ok(
    source.includes('import Image from "next/image";'),
    "Expected Hero to import next/image for the PNG preview",
  );
  assert.ok(
    source.includes('import rightHeroImg from "../../../../public/right-hero.png";'),
    "Expected Hero to import the right-hero PNG asset",
  );
  assert.ok(
    source.includes("src={rightHeroImg}"),
    "Expected Hero to render the right-hero PNG asset",
  );
  assert.ok(
    !source.includes('import HeroAppMock from "./HeroAppMock";'),
    "Expected Hero to stop importing HeroAppMock",
  );
  assert.ok(
    !source.includes("<HeroAppMock />"),
    "Expected Hero to stop rendering HeroAppMock",
  );
});
