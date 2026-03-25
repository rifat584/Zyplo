const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

test("hero image container stays visible on mobile", () => {
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
    !source.includes('className="order-2 relative hidden justify-center md:flex md:justify-end"'),
    "Expected the hero image wrapper to stay visible on mobile instead of being hidden before md",
  );
});
