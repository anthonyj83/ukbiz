const fs = require("fs");
const file = "app/layout.tsx";
let f = fs.readFileSync(file, "utf8");
f = f.replace(
  '<head>',
  '<head>\n        <meta name="google-site-verification" content="_UDuQDdPde2Avy9_WPc4cIjEZoZ4ml71X_1orFaaDgA" />'
);
fs.writeFileSync(file, f);
console.log("Done - added Google verification tag");
