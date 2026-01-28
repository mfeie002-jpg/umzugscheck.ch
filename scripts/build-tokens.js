import fs from "fs";
import path from "path";
import tokens from "../src/tokens/feierabend.tokens.json" assert { type: "json" };

const OUTPUT_PATH = path.resolve(process.cwd(), "src/styles/tokens.css");
const RESERVED_KEYS = new Set(["meta", "description", "type"]);

const resolveValue = (raw) => {
  if (typeof raw !== "string") return raw;
  return raw.replace(/\{([^}]+)\}/g, (_, ref) => `var(--${ref.replace(/\./g, "-")})`);
};

const walkTokens = (node, trail = []) => {
  let css = "";
  for (const [key, value] of Object.entries(node)) {
    if (RESERVED_KEYS.has(key)) continue;

    const nextTrail = [...trail, key];

    if (value && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, "value")) {
      const varName = `--${nextTrail.join("-")}`;
      const resolved = resolveValue(value.value);
      css += `  ${varName}: ${resolved};\n`;
    }

    if (value && typeof value === "object" && !Object.prototype.hasOwnProperty.call(value, "value")) {
      css += walkTokens(value, nextTrail);
    }
  }
  return css;
};

const buildCss = () => {
  const sections = ["color", "typography", "spacing", "radius", "shadow"];
  let body = "";

  for (const section of sections) {
    if (tokens[section]) {
      body += walkTokens(tokens[section], [section]);
    }
  }

  return `:root {\n${body}}\n`;
};

const css = buildCss();

fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
fs.writeFileSync(OUTPUT_PATH, css, "utf8");
console.log(`Tokens generated at ${OUTPUT_PATH}`);
