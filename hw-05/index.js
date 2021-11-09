require("colors");
const http = require("http");
const path = require("path");
const fs = require("fs");

const isFile = (path) => fs.lstatSync(path).isFile();

const isSpace = (path) => {
  const space = /%20/g;
  return (newpath = path.replace(space, " "));
};

const lastVisited = (url) => {
  return url.slice(1, url.lastIndexOf("/"));
};

(async () => {
  http
    .createServer((req, res) => {
      const fullPath = path.join(process.cwd(), isSpace(req.url));

      if (!fs.existsSync(fullPath)) return res.end("Not found");

      if (isFile(fullPath)) {
        return fs.createReadStream(fullPath).pipe(res);
      }

      let linksList = "";

      const urlParams = req.url.match(/[\d\w\.-]+/gi);

      if (urlParams) {
        const prevUrl = lastVisited(req.url);
        linksList = urlParams.length
          ? `<li><a href="/${prevUrl}">..</a></li>`
          : '<li><a href="/">..</a></li>';
      }

      fs.readdirSync(fullPath).forEach((fileName) => {
        const filePath = path.join(req.url, fileName);
        linksList += `<li><a href="${filePath}">${fileName}</a></li>`;
      });

      const HTML = fs
        .readFileSync(path.join(__dirname, "index.html"), "utf-8")
        .replace("##links", linksList);

      res.writeHead(200, {
        "Content-Type": "text/html",
      });

      return res.end(HTML);
    })
    .listen(3000);
})();
