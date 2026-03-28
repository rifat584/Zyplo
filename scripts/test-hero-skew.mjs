import { readFile } from "node:fs/promises";

const source = await readFile("src/components/Home/Hero/Hero.jsx", "utf8");

function assertIncludes(snippet, message) {
  if (!source.includes(snippet)) {
    throw new Error(message);
  }
}

assertIncludes(
  "perspective(1800px)",
  "The hero image should apply a perspective transform.",
);

assertIncludes(
  "rotateY(-10deg)",
  "The hero image should tilt slightly on the Y axis.",
);

assertIncludes(
  "skewY(-2deg)",
  "The hero image should have a subtle skew.",
);

console.log("Hero image skew styling looks correct.");
