const fs = require("fs");
const file = "app/[industry]/[region]/client.tsx";
let f = fs.readFileSync(file, "utf8");
f = f.replaceAll("\\u2013", "\u2013");
f = f.replaceAll("\\u2014", "\u2014");
f = f.replaceAll("\\u2713", "\u2713");
f = f.replaceAll("\\u26a0\\ufe0f", "\u26a0\ufe0f");
fs.writeFileSync(file, f);
console.log("Done - fixed all unicode escapes");
