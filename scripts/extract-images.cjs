const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const TRANSCRIPT_DIR = "/root/.claude/projects/-home-user-foundersprogram";
const OUT = "/home/user/foundersprogram/public/images";

// nodeId -> output filename
const MAP = {
  "27:990": "hero-portrait.png",
  "27:168": "edge-1.png",
  "27:169": "edge-2.png",
  "27:224": "mentor-alfred.png",
  "27:231": "mentor-mar.png",
  "27:238": "mentor-florian.png",
  "27:245": "mentor-mike.png",
  "27:252": "mentor-konstantine.png",
  "27:259": "mentor-nick.png",
  "27:273": "testimonial-krish.png",
  "27:1090": "testimonial-ollie.png",
  "27:285": "_apply-composite.png", // cropped below
};

// Build tool_use_id -> nodeId and tool_use_id -> base64, scanning all transcripts.
const useToNode = {};
const useToData = {};

for (const f of fs.readdirSync(TRANSCRIPT_DIR).filter((f) => f.endsWith(".jsonl"))) {
  const lines = fs.readFileSync(path.join(TRANSCRIPT_DIR, f), "utf8").trim().split("\n");
  for (const ln of lines) {
    let o;
    try { o = JSON.parse(ln); } catch { continue; }
    const msg = o.message || o;
    const content = msg && msg.content;
    if (!Array.isArray(content)) continue;
    for (const c of content) {
      if (c && c.type === "tool_use" && /get_screenshot/.test(c.name || "") && c.input) {
        useToNode[c.id] = c.input.nodeId;
      }
      if (c && c.type === "tool_result" && Array.isArray(c.content)) {
        for (const b of c.content) {
          if (b && b.type === "image" && b.source && b.source.type === "base64" && b.source.data) {
            useToData[c.tool_use_id] = b.source.data;
          }
        }
      }
    }
  }
}

// nodeId -> latest base64
const nodeData = {};
for (const [useId, node] of Object.entries(useToNode)) {
  if (useToData[useId]) nodeData[node] = useToData[useId];
}

(async () => {
  for (const [node, file] of Object.entries(MAP)) {
    const data = nodeData[node];
    if (!data) { console.log(`MISSING base64 for ${node} (${file})`); continue; }
    const buf = Buffer.from(data, "base64");
    fs.writeFileSync(path.join(OUT, file), buf);
    const meta = await sharp(buf).metadata();
    console.log(`wrote ${file}  ${meta.width}x${meta.height}  ${(buf.length/1024).toFixed(0)}KB`);
  }

  // Crop the apply background out of the composite: drop the left card region,
  // keep the clean cleanroom photo on the right, then we use object-cover.
  const compPath = path.join(OUT, "_apply-composite.png");
  if (fs.existsSync(compPath)) {
    const img = sharp(compPath);
    const m = await img.metadata();
    // Card occupies roughly the left 40%; crop it away.
    const left = Math.round(m.width * 0.42);
    await sharp(compPath)
      .extract({ left, top: 0, width: m.width - left, height: m.height })
      .toFile(path.join(OUT, "apply-bg.png"));
    const am = await sharp(path.join(OUT, "apply-bg.png")).metadata();
    console.log(`wrote apply-bg.png  ${am.width}x${am.height} (cropped from composite)`);
    fs.unlinkSync(compPath);
  }
})();
