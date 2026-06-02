const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const TRANSCRIPT_DIR = "/root/.claude/projects/-home-user-foundersprogram";
const OUT = "/home/user/foundersprogram/public/images";

// Collect top-level (user-pasted) image blocks from user messages across all
// transcripts, in order. Tool-result images are nested and skipped.
const pasted = [];
for (const f of fs.readdirSync(TRANSCRIPT_DIR).filter((f) => f.endsWith(".jsonl"))) {
  const lines = fs.readFileSync(path.join(TRANSCRIPT_DIR, f), "utf8").trim().split("\n");
  for (const ln of lines) {
    let o; try { o = JSON.parse(ln); } catch { continue; }
    const msg = o.message || o;
    if (!msg || msg.role !== "user" || !Array.isArray(msg.content)) continue;
    for (const c of msg.content) {
      if (c && c.type === "image" && c.source && c.source.type === "base64" && c.source.data) {
        pasted.push(c.source.data);
      }
    }
  }
}

(async () => {
  console.log(`found ${pasted.length} user-pasted image(s)`);
  // Decode, measure, and map by aspect ratio.
  const items = [];
  for (const data of pasted) {
    const buf = Buffer.from(data, "base64");
    const m = await sharp(buf).metadata();
    items.push({ buf, w: m.width, h: m.height, ar: m.width / m.height });
  }
  // De-dup identical buffers (in case of repeats), keep last occurrences.
  const seen = new Set();
  const uniq = [];
  for (let i = items.length - 1; i >= 0; i--) {
    const key = items[i].w + "x" + items[i].h + ":" + items[i].buf.length;
    if (seen.has(key)) continue;
    seen.add(key);
    uniq.unshift(items[i]);
  }

  for (const it of uniq) {
    let file;
    if (it.ar > 1.3) file = "apply-bg.png";        // wide landscape
    else if (it.ar < 0.85) file = "edge-2.png";    // tall portrait (phone)
    else file = "edge-1.png";                       // ~square (satellites)
    await sharp(it.buf).png().toFile(path.join(OUT, file));
    console.log(`wrote ${file}  ${it.w}x${it.h}  ar=${it.ar.toFixed(2)}`);
  }
})();
