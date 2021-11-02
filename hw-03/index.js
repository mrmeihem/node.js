const readline = require("readline");
const fs = require("fs");

const PATH = "./access.log";
const REGEX_1 = /89.123.1.41/;
const REGEX_2 = /34.48.240.111/;

const writeSorted = (input, regex) => {
  fs.writeFile(
    `./${regex}_requests.log`,
    input + "\n",
    {
      encoding: "utf-8",
      flag: "a",
    },
    (err) => {
      if (err) console.log(err);
    }
  );
};

const readInterface = readline.createInterface({
  input: fs.createReadStream(PATH),
  output: process.stdout,
  console: false,
});

readInterface.on("line", (input) => {
  if (REGEX_1.test(input)) {
    writeSorted(input, "89.123.1.41");
  } else if (REGEX_2.test(input)) {
    if (REGEX_2.test(input)) {
      writeSorted(input, "34.48.240.111");
    }
  } else {
    console.log("skipping");
  }
});
